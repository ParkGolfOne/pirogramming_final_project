from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, redirect
from apps.users.forms import SignupForm, UpdateForm
from django.contrib.auth.forms import AuthenticationForm
from django.urls import reverse
from django.http import JsonResponse
from django.contrib import auth
from apps.communitys.models import *
from apps.region.models import *
from .models import *
import requests
import json

###########################################################
#                      기본 메인 페이지                    #
###########################################################
# 함수 이름 : home
# 전달인자 : request
# 기능 : 기본 메인페이지로 이동


def home(request):
    locations = [[location.golf_name, float(location.golf_latitude), float(
        location.golf_longitude)] for location in GolfLocation.objects.all()]
    location_json = json.dumps(locations)
    ctx = {
        'locations_list': location_json
    }
    return render(request, 'main.html', ctx)

###########################################################
#                      유저 개인 페이지                    #
###########################################################
# 함수 이름 : main
# 전달인자 : request, pk
# 기능 : 유저의 개인 페이지. 유저가 작성한 글, 댓글, 스크랩, 좋아요를 가져온다.


def main(request, pk):
    user = User.objects.get(id=pk)
    now_user = request.user
    # 내가 작성한 글 가져오기
    try:
        my_posts = Post.objects.filter(writer=user)
    except Post.DoesNotExist:
        my_posts = []

    # 내가 작성한 댓글 가져오기
    try:
        my_comments = Comment.objects.filter(commenter=user)
    except Comment.DoesNotExist:
        my_comments = []

    # 내가  스크랩한 게시글 가져오기
    try:
        my_scraps = Scrap.objects.filter(user=user)
    except Scrap.DoesNotExist:
        my_scraps = []

    # 내가  좋아요를 누른 게시글 가져오기
    try:
        my_likes = Like.objects.filter(user=user)
    except Like.DoesNotExist:
        my_likes = []

    # 즐겨찾기한 골프장 가져오기
    try:
        my_locations = LikeGolf.objects.filter(user=user)
    except Like.DoesNotExist:
        my_locations = []

     # 작성한 리뷰 가져오기
    try:
        my_reviews = Review.objects.filter(reviewer=user)
    except Review.DoesNotExist:
        my_reviews = []

    context = {
        "pk": pk,
        "user": user,
        "now_user": now_user,
        "my_posts": my_posts,
        "my_comments": my_comments,
        "my_scraps": my_scraps,
        "my_likes": my_likes,
        "my_locations": my_locations,
        "my_reviews": my_reviews,
    }

    return render(request, "users/users_main.html", context)

###########################################################
#                      유저 CRUD 관련 함수                 #
###########################################################
# 함수 이름 : signup
# 전달인자 : request, pk
# 기능 : 유저 회원가입


@csrf_exempt
def signup(request):
    if request.method == 'POST':
        print(request.POST, request.FILES)
        selected_city = request.POST.get('city')
        selected_town = request.POST.get('town')
        street_address = request.POST.get('street_address')
        detail_address = request.POST.get('detail_address')
        form = SignupForm(request.POST, request.FILES)
        if form.is_valid():
            user = form.save(commit=False)
            region = Region.objects.filter(
                city=selected_city, town=selected_town).first()
            # user에 region 정보를 저장
            user.region = region
            user.address = street_address
            user.detail_address = detail_address
            user.first_login = False
            user.save()
            auth.login(request, user,
                       backend='apps.users.backends.CustomModelBackend')
            redirect_url = reverse('home')
            return JsonResponse({'result': 'success', 'url': redirect_url})

        else:
            print("폼 유효성 검사 실패")
            print(form.errors)
            return JsonResponse({'result': 'failed', 'error': form.errors})
    else:
        context = {
            'pk': request.user.id,
        }
        return render(request, template_name='users/users_signup.html', context=context)

# 함수 이름 : login
# 전달인자 : request
# 기능 : 유저 로그인


def login(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, request.POST)
        if form.is_valid():
            user = form.get_user()
            auth.login(request, user,
                       backend='apps.users.backends.CustomModelBackend')
            return redirect('users:main', user.id)
        else:
            error_message = list(map(str, form.error_messages.values()))
            merged_string = ' '.join(error_message)
            error = merged_string.replace('%(username)s', "유저")
            context = {
                'form': form,
                'message': error
            }
            return render(request, template_name='users/users_login.html', context=context)
    else:
        form = AuthenticationForm()
        context = {
            'form': form,
            'message': None
        }
        return render(request, template_name='users/users_login.html', context=context)

# 함수 이름 : logout
# 전달인자 : request
# 기능 : 유저 로그아웃


def logout(request):
    user = request.user
    user.first_login = False
    user.save()
    # 카카오 연동 해제
    if user.social_auth.filter(provider='kakao').exists():
        kakao_unlink(request)
    auth.logout(request)
    return redirect('users:login')

# 함수 이름 : update
# 전달인자 : request, pk
# 기능 : 유저 정보 수정


@csrf_exempt
def update(request, pk):
    user = User.objects.get(id=pk)
    social_login_flag = "false"
    if request.method == 'POST':
        selected_city = request.POST.get('city')
        selected_town = request.POST.get('town')
        street_address = request.POST.get('street_address')
        detail_address = request.POST.get('detail_address')
        form = UpdateForm(request.POST, request.FILES, instance=user)
        if form.is_valid():
            user = form.save(commit=False)
            region = Region.objects.filter(
                city=selected_city, town=selected_town).first()
            user.first_login = False
            user.region = region
            user.address = street_address
            user.detail_address = detail_address
            user.save()
            redirect_url = reverse('users:main', kwargs={'pk': user.pk})
            return JsonResponse({'result': 'success', 'url': redirect_url})
        else:
            print("폼 유효성 검사 실패")
            print(form.errors)
            return JsonResponse({'result': 'fail', 'error': form.errors})
    else:
        try:
            context = {
                'pk': pk,
                "username": user.username,
                "nickname": user.nickname,
                "birth": user.birth.strftime('%Y-%m-%d') if user.birth is not None else None,
                "phone": user.phone,
                "email": user.email,
                'city': user.region.city,
                'town': user.region.town,
                'street_address': user.address,
                'detail_address': user.detail_address,
                "social_login_flag": social_login_flag,
            }
        except AttributeError:
            context = {
                'pk': pk,
                "username": user.username,
                "nickname": user.nickname,
                "birth": user.birth.strftime('%Y-%m-%d') if user.birth is not None else None,
                "phone": user.phone,
                "email": user.email,
                'city': None,
                'town': None,
                'street_address': user.address,
                'detail_address': user.detail_address,
                "social_login_flag": social_login_flag,
            }
        return render(request, template_name='users/users_update.html', context=context)


@csrf_exempt
@login_required
def delete(request, pk):
    user = User.objects.get(id=pk)
    if request.method == "POST":
        if user.social_auth.filter(provider='kakao').exists():
            kakao_unlink(request)
        user.delete()
        return redirect('home')


###########################################################
#                      소셜로그인 관련 함수                #
###########################################################
# 함수 이름 : social_login
# 전달인자 : request
# 기능 : 유저의 첫 로그인 여부에 따라 main 페이지 또는 추가 정보 입력을 위한 정보수정 페이지로 이동
def social_login(request):
    user = request.user
    if user.first_login == False:
        return redirect('users:main', user.id)
    else:
        social_login_flag = "true"
        context = {
            'pk': user.pk,
            "username": user.username,
            "nickname": user.nickname,
            "birth": None,
            "phone": None,
            "email": None,
            'city': None,
            'town': None,
            'street_address': None,
            'detail_address': None,
            "social_login_flag": social_login_flag,
        }
        return render(request, template_name='users/users_update.html', context=context)

# 함수 이름 : kakao_unlink
# 전달인자 : request
# 기능 : 카카오 소셜 로그아웃한 경우, 해당 계정과의 연결을 끊음


def kakao_unlink(request):
    user = request.user
    social_auth = user.social_auth.get(provider='kakao')
    access_token = social_auth.extra_data['access_token']

    # 카카오 API로 unlink 요청
    url = "https://kapi.kakao.com/v1/user/unlink"
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": f"Bearer {access_token}",
    }

    response = requests.post(url, headers=headers)

    # 디버깅 용 print
    if response.status_code == 200:
        print("Kakao user unlink successful")
    else:
        print(
            f"Failed to unlink Kakao user. Status code: {response.status_code}")
        print(response.text)


###########################################################
#                      유저 친구 CRUD                      #
###########################################################
# 함수 이름 : friend_list
# 전달인자 : request. pk
# 기능 : 현재 유저 친구 목록 불러오기
@login_required
def friend_list(request, pk):
    user = User.objects.get(id=pk)
    friends = user.friends.all()
    context = {
        'friends': friends,
        'user': user,
        'pk': pk,
    }
    return render(request, template_name='users/friend_list.html', context=context)

# 함수 이름 : friend_candidates
# 전달인자 : request
# 기능 : 현재 유저의 친구 후보(본인 + 친구가 아닌 사람들)을 db에서 가져옴


def friend_candidates(request):
    user = request.user
    friends = user.friends.all()
    candidate_friends = User.objects.exclude(
        id__in=[friend.id for friend in friends]).exclude(id=user.id)

    return candidate_friends

# 함수 이름 : add_friend
# 전달인자 : request. pk
# 기능 : 유저 friend로 입력 받은 친구 추가 (쌍방으로)


@csrf_exempt
@login_required
def add_friend(request, pk):
    if request.method == 'POST':
        user = request.user
        friend_id = request.POST.get('friend')
        friend = User.objects.get(id=friend_id)
        user.friends.add(friend)
        return JsonResponse({"friend_id": friend_id}, safe=False)

    else:
        friend_candidate = friend_candidates(request)
        context = {
            'candidates': friend_candidate,
            'pk': pk
        }
        return render(request, template_name='users/add_friend.html', context=context)

# 함수 이름 : delete_friend
# 전달인자 : request. pk
# 기능 : 입력받은 friend 삭제 (쌍방으로)


@csrf_exempt
@login_required
def delete_friend(request, pk):
    if request.method == 'POST':
        user = User.objects.get(id=pk)
        remove_friend = request.POST.get('friend')
        # 친구 관계 설정
        user.friends.remove(remove_friend)
        friend_json = []
        for friend in user.friends.all():
            friend_data = {
                'id': friend.id,
                'username': friend.username,
                'nickname': friend.nickname,
                'image': friend.image.url,
            }
            friend_json.append(friend_data)
        return JsonResponse(friend_json, safe=False)

from django.http import JsonResponse
from django.shortcuts import render, redirect
from apps.users.forms import SignupForm, UpdateForm
from django.contrib.auth.forms import AuthenticationForm
from django.contrib import auth
from apps.communitys.models import *
from .models import *
import requests

# Create your views here.


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

    context = {
        "pk": pk,
        "user": user,
        "now_user": now_user,
        "my_posts": my_posts,
        "my_comments": my_comments,
        "my_scraps": my_scraps,
        "my_likes": my_likes,
    }

    return render(request, "users/users_main.html", context)


def signup(request):
    # if request.method == 'POST':
    #     form = SignupForm(request.POST)
    #     if form.is_valid():
    #         user = form.save()
    #         auth.login(request, user,
    #                    backend='apps.users.backends.CustomModelBackend')

    #         # 도시와 동네 정보를 가져옴
    #         selected_city = request.POST.get('city')
    #         print(selected_city)
    #         selected_town = request.POST.get('town')

    #         # 도시와 동네 정보를 저장
    #         region = Region.objects.filter(city=selected_city, town=selected_town).first()
    #         user.region = region
    #         user.save()

    #         return redirect('users:main', user.id)
    #     else:
    #         print("폼 유효성 검사 실패")
    #         print(form.errors)
    #         return redirect('users:signup')
    # else:
    #     form = SignupForm()
    #     context = {
    #         'form': form,
    #     }
    #     return render(request, template_name='users/users_signup.html', context=context)

    # if request.method == 'POST':
    #     username = request.POST.get('username')
    #     nickname = request.POST.get('nickname')
    #     password1 = request.POST.get('password1')
    #     password2 = request.POST.get('password2')
    #     birth = request.POST.get('birth')
    #     phone = request.POST.get('phone')
    #     address = request.POST.get('address')
    #     city = request.POST.get('city')
    #     town = request.POST.get('town')

    #     # 필요한 유효성 검사 및 예외 처리를 수행합니다.
    #     if not username or not nickname or not password1 or not password2 or not birth or not phone or not address:
    #         return JsonResponse({'success': False, 'message': '모든 필드를 입력하세요.'})

    #     if password1 != password2:
    #         return JsonResponse({'success': False, 'message': '비밀번호가 일치하지 않습니다.'})

    #     # 사용자 생성
    #     region = Region.objects.filter(city=city, town=town).first()
    #     print(region)
    #     print(city)
    #     print(town)
    #     user = User.objects.create_user(username=username, password=password1, nickname=nickname, birth=birth, phone=phone, address=address, region=region)

    #     user.save()

    #     # 로그인
    #     auth.login(request, user,
    #                backend='apps.users.backends.CustomModelBackend')

    #     return JsonResponse({'success': True, 'message': '회원 가입이 완료되었습니다.', 'url': f"/users/{user.id}"})

    # return render(request, template_name='users/users_signup.html')

    # 현이 ver
    if request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)

            # 맞는 region 정보를 가지고 옴
            city = request.POST.get('city')
            town = request.POST.get('town')
            region = Region.objects.filter(city=city, town=town).first()

            # user에 region 정보를 저장
            user.region = region
            user.save()

            auth.login(request, user,
                       backend='apps.users.backends.CustomModelBackend')

            return redirect('users:main', user.id)
        else:
            print("폼 유효성 검사 실패")
            print(form.errors)
            return redirect('users:signup')
    else:
        form = SignupForm()
        context = {
            'form': form,
        }
        return render(request, template_name='users/users_signup.html', context=context)


def login(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, request.POST)
        if form.is_valid():
            user = form.get_user()
            auth.login(request, user,
                       backend='apps.users.backends.CustomModelBackend')
            return redirect('users:main', user.id)
        else:
            context = {
                'form': form,
            }
            return render(request, template_name='users/users_login.html', context=context)
    else:
        form = AuthenticationForm()
        context = {
            'form': form,
        }
        return render(request, template_name='users/users_login.html', context=context)


def logout(request):
    user = request.user
    user.first_login = False
    user.save()
    # 1. 유저가 카카오 소셜로그인으로 가입한 경우
    if user.social_auth.filter(provider='kakao').exists():
        kakao_unlink(request)
    auth.logout(request)
    return redirect('users:login')


# 메인 페이지
def home(request):
    return render(request, 'base.html')


def update(request, pk):
    user = User.objects.get(id=pk)
    if request.method == 'POST':
        form = UpdateForm(request.POST, instance=user)
        if form.is_valid():
            form.save()
            return redirect('users:main', user.id)
        else:
            print("폼 유효성 검사 실패")
            print(form.errors)
            return redirect('users:update', user.id)
    else:
        form = UpdateForm(instance=user)
        context = {
            'form': form,
            'pk': pk,
        }
        return render(request, template_name='users/users_update.html', context=context)


def social_login(request):
    user = request.user
    if user.first_login == False:
        return redirect('users:main', user.id)
    else:
        user.first_login = False
        user.save()
        if request.method == 'POST':
            form = UpdateForm(request.POST, instance=user)
            if form.is_valid():
                form.save()
                return redirect('users:main', user.id)
        else:
            form = UpdateForm(instance=user)
            context = {
                'form': form,
                'pk': user.id,
            }
            return render(request, template_name='users/users_update.html', context=context)

# def users_delete(request ,pk):

###################################
# 소셜 로그인 unlink request      #
###################################

# 1. 카카오


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

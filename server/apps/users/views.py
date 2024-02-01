from social_django.utils import psa
import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from apps.users.forms import SignupForm, UpdateForm
from django.contrib.auth.forms import AuthenticationForm
from django.contrib import auth
from apps.communitys.models import *
from .models import *
import requests

# Create your views here.
def main(request, pk):
    user = User.objects.get(id = pk)
    now_user = request.user
    # 내가 작성한 글 가져오기
    try:
        my_posts = Post.objects.filter(writer = user)
    except Post.DoesNotExist:
        my_posts = []

    # 내가 작성한 댓글 가져오기
    try:
        my_comments = Comment.objects.filter(commenter = user)
    except Comment.DoesNotExist:
        my_comments = []

    # 내가  스크랩한 게시글 가져오기
    try:
        my_scraps = Scrap.objects.filter(user = user)
    except Scrap.DoesNotExist:
        my_scraps = []

    # 내가  좋아요를 누른 게시글 가져오기
    try:
        my_likes = Like.objects.filter(user = user)
    except Like.DoesNotExist:
        my_likes = []

    context = {
        "pk" : pk,
        "user" : user,
        "now_user" : now_user,
        "my_posts" : my_posts,
        "my_comments" : my_comments,
        "my_scraps" : my_scraps,
        "my_likes" : my_likes,
    }

    return render(request, "users/users_main.html", context)

def signup(request):
    if request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            user = form.save()
            auth.login(request, user, backend='apps.users.backends.CustomModelBackend')
            return redirect('users:main', user.id )
        else:
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
            auth.login(request, user, backend='apps.users.backends.CustomModelBackend')
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
        print(f"Failed to unlink Kakao user. Status code: {response.status_code}")
        print(response.text)

############## 삽질 이력 ##############
# 2. 네이버
# def naver_unlink(code):
#     token = naver_get_token(code)
#     url = "https://nid.naver.com/oauth2.0/token"
#     params = {
#         'grant_type': 'delete',
#         'client_id': 'w0haveWbnc18S25mngGX',
#         'client_secret': 'erElQg0Ii1',
#         'code': '0FvAXdulstTRNv3Ygl8DgTVC',
#         'state': 'random_state',  # 보안을 위한 랜덤한 상태값
#         'access_token': token,
#         'service_provider': 'NAVER',
#     }
#     response = requests.post(url, data=params)
#     print(f"token: {token}")
#     if response.status_code == 200:
#         print("Naver user unlink successful")

# def naver_get_token(code):
#     token_url = 'https://nid.naver.com/oauth2.0/token'
#     params = {
#         'grant_type': 'authorization_code',
#         'client_id': 'w0haveWbnc18S25mngGX',
#         'client_secret': 'erElQg0Ii1',
#         'code': code,
#         'state': 'random_state',  # 보안을 위한 랜덤한 상태값
#         'redirect_uri': 'http://127.0.0.1:8000/auth/complete/naver/',
#     }

#     response = requests.post(token_url, data=params)

#     if response.status_code == 200:
#         return response.json().get('access_token')
    
# @csrf_exempt
# def naver_logout(request):
#     print("NAVER LOGOUT")
#     req = json.loads(request.body)
#     print(f"req: {req}")
#     code = req['code']
#     print(f"code: {code}")
#     # naver_unlink(code)
#     # auth.logout(request)

# def check_naver_auth(request):
#     user = request.user
#     if user.social_auth.filter(provider='naver').exists():
#         print("네이버 로그아웃 처리 시작")
#         return JsonResponse({'naver_account': True})
#     else:
#         return JsonResponse({'naver_account': False})


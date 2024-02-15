from django.shortcuts import render, redirect, get_object_or_404
from .models import *
from apps.users.models import *
from apps.locations.models import *
from apps.score.models import *
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
# 트랜잭션
from django.db import transaction
from apps.users.models import User
from apps.users.views import friend_candidates
from django.http import JsonResponse
from django.core.serializers import serialize
from django.shortcuts import render


###########################################################
#                       장소 검색하기                      #
###########################################################

# 함수 이름 : search_location
# 전달인자 : request
# 기능 : 해당 장소가 있는지 검색해준다.
@csrf_exempt
def search_location(request):
    req = json.loads(request.body)
    input_text = req["input_text"]
    # city 값

    city = req.get("city")
    town = req.get("town")
    sortType = req.get("sortType")

    # 조건 1 : 시 ,
    # 조건 2 : 군/구,
    filter_conditions1 = {'golf_name__startswith': input_text}
    filter_conditions2 = {}
    if city and town:
        # city와 town 모두 존재하는 경우에만 필터 추가
        filter_conditions2['golf_address__contains'] = city
        filter_conditions2['golf_address__contains'] = town
    elif city:
        filter_conditions2['golf_address__contains'] = city

    location_names = []

    if input_text:
        try:
            locations = GolfLocation.objects.filter(
                **filter_conditions1, **filter_conditions2).order_by(sortType)
            location_names = list(locations.values_list(
                "golf_name", "id", "fav_num", "golf_rate_num", "golf_rate"))
        except GolfLocation.DoesNotExist:
            location_names = []
    else:
        try:
            locations = GolfLocation.objects.filter(
                **filter_conditions2).order_by(sortType)
            location_names = list(locations.values_list(
                "golf_name", "id", "fav_num", "golf_rate_num", "golf_rate"))
        except GolfLocation.DoesNotExist:
            location_names = []

    return JsonResponse({'location_names': location_names})


###########################################################
#              쿼리에 해당하는 유저의 친구 반환              #
###########################################################
# 함수 이름 : search_candidate
# 전달인자 : request
# 기능 : 쿼리에 해당되는 친구 후보군 (본인+친구가 아닌 사람)을 반환
def search_candidate(request):
    input_value = request.GET.get('input', None)
    search_type = request.GET.get('type', None)

    # 현재 요청하는 유저의 친구 후보군
    friend_candidate = friend_candidates(request)

    # 만일 id에 대해 검색 요청이 들어온 경우 : input이 포함된 유저 보여줌
    if search_type == "id":
        # 입력 받은 input을 포함하는 유저들을 찾는다.
        search_friends = friend_candidate.filter(username__icontains=input_value)
        search_friends_json = []
        for friend in search_friends:
            search_friends_json.append({
                "id": friend.id,
                "username": friend.username,
                "nickname": friend.nickname,
            })
        print(search_friends_json)
        return JsonResponse(search_friends_json, safe=False)

    # 만일 email에 대해 검색 요청이 들어온 경우 : input과 email이 정확히 일치하는 유저 보여줌
    elif search_type == "email":
        # 입력 받은 input을 포함하는 유저들을 찾는다.
        search_friends = friend_candidate.filter(email__exact=input_value)
        search_friends_json = []
        for friend in search_friends:
            search_friends_json.append({
                "id": friend.id,
                "username": friend.username,
                "nickname": friend.nickname,
            })
        print(search_friends_json)
        return JsonResponse(search_friends_json, safe=False)

###########################################################
#              쿼리에 해당하는 유저 검색                    #
###########################################################
# 함수 이름 : user_candidate
# 전달인자 : request
# 기능 : 본인+superuser가 아닌 사람을 반환    
def user_candidate(request):
    # 본인과 슈퍼유저를 제외한 모든 사용자 가져오기
    candidate_users = User.objects.exclude(id=request.user.id).exclude(is_superuser=True)
    return candidate_users

# 함수 이름 : search_user
# 전달인자 : request
# 기능 : 쿼리에 해당되는 유저 검색 (본인+superuser가 아닌 사람)을 반환
def search_users(request):
    input_value = request.GET.get('input', None)
    search_type = request.GET.get('type', None)

    # 현재 요청하는 유저 후보군
    users_list = user_candidate(request)

    # 만일 id에 대해 검색 요청이 들어온 경우 : input이 포함된 유저 보여줌
    if search_type == "id":
        # 입력 받은 input을 포함하는 유저들을 찾는다.
        search_users = users_list.filter(
            username__icontains=input_value)
        search_users_json = []
        for user in search_users:
            search_users_json.append({
                "id": user.id,
                "username": user.username,
                "nickname": user.nickname,
            })
        print(search_users_json)
        return JsonResponse(search_users_json, safe=False)

    # 만일 email에 대해 검색 요청이 들어온 경우 : input과 email이 정확히 일치하는 유저 보여줌
    elif search_type == "email":
        # 입력 받은 input을 포함하는 유저들을 찾는다.
        search_users = users_list.filter(email__exact=input_value)
        search_users_json = []
        for user in search_users:
            search_users_json.append({
                "id": user.id,
                "username": user.username,
                "nickname": user.nickname,
            })
        print(search_users_json)
        return JsonResponse(search_users_json, safe=False)

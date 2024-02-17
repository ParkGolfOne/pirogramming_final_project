from django.shortcuts import render, redirect, get_object_or_404
from .models import *
from apps.users.models import *
from apps.locations.models import *
from apps.communitys.models import *
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
# 조건 에 OR 을 사용하기 위해서
from django.db.models import Q


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
    


###########################################################
#                     메인페이지 검색                      #
###########################################################
    

# 함수 이름 : search_main_func
# 전달인자 : request
# 기능 : 메인페이지에서 검색창에 글자를 입력하면 해당 글자로 시작하는 골프장 이름과 
#        해당 글자가 들어있는 커뮤니티 게시글을 모두 가져온다.
def search_main_func(input_text, start_num, count, sortType):
    search_result = []

    ###### 조건에 맞는 골프장 가져오기 ######
    # # 골프장 필터
    location_name_filter = Q(golf_name__startswith=input_text)
    location_address_filter = Q(golf_address__contains=input_text)

    location_filter = location_name_filter | location_address_filter

    try:
        if count > 0 : 
            locations = GolfLocation.objects.filter(location_filter).order_by(sortType)[start_num:start_num + count]


            # 안에 들어가 있는 개수 체크
            actual_count = min(len(locations), count)

            # 가져올 객체 수가 0보다 크면 해당 개수만큼만
            locations = locations[:actual_count]
        elif count == 0 :
            locations = GolfLocation.objects.filter(location_filter).order_by(sortType)
    except GolfLocation.DoesNotExist:
        locations = []


    ###### 조건에 맞는 커뮤니티게시글 제목 가져오기 ######
    # 커뮤니티 필터
    post_title_filter = {'title__contains': input_text}
    try:
        if count > 0 : 
            posts = Post.objects.filter(**post_title_filter).order_by(sortType)[start_num:start_num + count]

            # 안에 들어가 있는 개수 체크
            actual_count = min(len(posts), count)

            # 가져올 객체 수가 0보다 크면 해당 개수만큼만
            posts = posts[:actual_count]

        elif count == 0:
            posts = Post.objects.filter(**post_title_filter).order_by(sortType)

    except Post.DoesNotExist:
        posts = []


    # 검색 결과 정보 추가

    for location in locations:
        temp_result = {"type" : "골프장" ,"lid" : location.id, "lname" : location.golf_name, "addr" : location.golf_address,}
        search_result.append(temp_result)

    for post in posts:
        temp_result = {"type" : "게시글" ,"pid" : post.id, "title" : post.title, "content" : post.content,"bid" : post.board.id, "bname" : post.board.name,}
        search_result.append(temp_result)

    return search_result


# 함수 이름 : search_main
# 전달인자 : request
# 기능 : 메인페이지에서 검색창에 글자를 입력하면 해당 글자로 시작하는 골프장 이름과 
#        해당 글자가 들어있는 커뮤니티 게시글을 모두 가져온다.
def search_main(request):
    input_text = request.GET.get('input', None)
    # 장소, 게시글 당 몇개를 가져오는지 개수
    result_count = request.GET.get('count', 3)
    result_count = int(result_count)

    # 전송될 결과값
    search_result = search_main_func(input_text, 0, result_count, "id") # input_text 값을 0 부터 result_count 만큼의 개수를 id 로 정렬해서 가져오기


    return JsonResponse({"search_result" : search_result})



# 함수 이름 : search_main_result
# 전달인자 : request
# 기능 : 메인페이지에서 검색한 결과 값들 전체 보여주기
def search_main_result(request):
    input_text = request.GET.get('input', None)
    ctx = {
        'search_text' : input_text,
    }
    return render(request, "search/search_main_result.html",ctx)

# 함수 이름 : search_main_value
# 전달인자 : request
# 기능 : v페이지 정렬에 따른 값 보여주기
def search_main_value(request):
    pass



    
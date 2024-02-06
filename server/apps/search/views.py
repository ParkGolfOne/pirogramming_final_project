from apps.users.models import User
from apps.users.views import friend_candidates
from django.http import JsonResponse
from django.core.serializers import serialize
from django.shortcuts import render

###########################################################
#              쿼리에 해당하는 유저의 친구 반환              #
###########################################################
# 함수 이름 : search_candidate
# 전달인자 : request
# 기능 : 쿼리에 해당되는 친구 후보군 (본인+친구가 아닌 사람)을 반환
def search_candidate(request):
    input = request.GET.get('input', None)
    # 현재 요청하는 유저의 친구 후보군
    friend_candidate = friend_candidates(request)
    # 입력 받은 input을 포함하는 유저들을 찾는다.
    search_friends = friend_candidate.filter(username__icontains=input)
    search_friends_json = []
    for friend in search_friends:
        search_friends_json.append({
            "id": friend.id,
            "username": friend.username,
            "nickname": friend.nickname,
        })
    print(search_friends_json)
    return JsonResponse(search_friends_json, safe=False)

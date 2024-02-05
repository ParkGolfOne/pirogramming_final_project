from django.shortcuts import render
from apps.users.models import User
from django.http import JsonResponse

###########################################################
#              쿼리에 해당하는 유저의 친구 반환              #
###########################################################
# 함수 이름 : search_friend
# 전달인자 : request. pk
# 기능 : 쿼리에 해당되는 현재 유저 친구 목록 불러오기
def search_friend(request, pk):
    input = request.GET.get('input', None)
    # 유저의 친구 목록 불러오기
    user = User.objects.get(id=pk)
    # input에 해당하는 친구 목록 불러오기
    search_friends = user.friends.filter(username__icontains=input).values_list("username", flat=True)
    return JsonResponse(list(search_friends), safe=False)
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.shortcuts import render
from .models import Region
from apps.users.models import User
import json

###########################################################
#           시도/군구 (Region) 데이터 불러오는 함수         #
###########################################################
# 함수 이름 : get_city_list
# 전달인자 : request
# 기능 : 시도 목록을 가져오는 함수
def get_city_list(request):
    cities = Region.objects.values_list('city', flat=True).distinct()
    output = JsonResponse(list(cities), safe=False)
    return output

# 함수 이름 : get_town_list
# 전달인자 : request
# 기능 : 입력된 시도에 해당하는 군구 목록을 가져오는 함수
def get_town_list(request):
    city = request.GET.get('city', None)
    town_list = Region.objects.filter(
        city=city).values_list('town', flat=True).distinct()
    return JsonResponse(list(town_list), safe=False)

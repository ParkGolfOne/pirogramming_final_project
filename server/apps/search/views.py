from django.shortcuts import render, redirect, get_object_or_404
from .models import *
from apps.users.models import *
from apps.locations.models import *
from apps.score.models import *
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
#트랜잭션
from django.db import transaction


###########################################################
#                       장소 검색하기                      #
###########################################################

# 함수 이름 : search_location
# 전달인자 : request
# 기능 : 해당 장소가 있는지 검색해준다.
@csrf_exempt
@transaction.atomic
def search_location(request):
    req = json.loads(request.body)
    input_text = req["input_text"]
    location_names=[]

    if input_text:
        locations = GolfLocation.objects.filter(golf_name__startswith=input_text)
        print("locations = ", locations)
        location_names = list(locations.values_list("golf_name", flat=True))

    return JsonResponse({'location_names': location_names})
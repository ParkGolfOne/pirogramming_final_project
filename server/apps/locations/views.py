from django.shortcuts import render, redirect, get_object_or_404
from .models import *
from apps.region.models import *
from .forms import *
from .geocoding import *
from ..users.models import User
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
import json
from django.http import JsonResponse

# 골프장 목록 표시
def location_list(request):
    locations = GolfLocation.objects.all()
    regions = Region.objects.all()
    ctx = {
        'locations' : locations,
        'regions' : regions,
    }
    return render(request, 'locations/location_list.html', ctx)

#골프장 세부 내용 표시
def location_detail (request, pk):
    location = GolfLocation.objects.get(id=pk)

    # 즐겨찾기 여부 찾기
    now_user = request.user
    try:
        faved = LikeGolf.objects.get(user = now_user, ground = location)
    except LikeGolf.DoesNotExist:
        faved = False
    except:
        faved = False
    else:
        faved = True

    # 해당 리뷰가 있다면 가져오기
    try:
        reviews = Review.objects.filter(ground = location)
    except Review.DoesNotExist:
        reviews = []


    ctx = {
        'location' : location,
        'pk' : pk,
        'faved' : faved,
        'reviews' : reviews,
        'now_user' : request.user,
    }

    return render(request, 'locations/location_detail.html', ctx)


#새로운 골프장 추가
def location_create (request):
    if request.method == 'POST':
        form = NewField(request.POST, request.FILES)
        if form.is_valid():
            form.save()
        return redirect('locations:list')
        
    else:
        form = NewField()
        ctx = {
            'form' : form
        }
        return render(request, 'locations/location_create.html', ctx)
    
#골프장 변경사항 수정
def location_update(request, pk):
    location = GolfLocation.objects.get(id=pk)
    if request.method == "POST":
        form = NewField(request.POST, request.FILES, instance=location)
        if form.is_valid():
            form.save()
        return redirect('locations:detail', pk=pk)
    else:
        form = NewField(instance=location)
        ctx = {
            'location' : location, 
            'form' : form, 
            'pk' : pk,
        }
        return render(request, 'locations/location_update.html', ctx)
    
#골프장 삭제
def location_delete(request, pk):
    if request.method == 'POST':
        location = GolfLocation.objects.get(id=pk)
        location.delete()
        return redirect('locations:list')
    
#User 모델에서 address 필드 값 가져오기
def get_user_address (request, pk):
    user_address = User.objects.get(id=pk)
    return user_address.address
    
# 내가 입력한 주소 (집)으로 부터 가장 가까운 골프장 5곳    
def location_distance (request, pk):
    address = get_user_address(request, pk)  #사용자 외래키에서 주소 필드 가져오기
    instances = GolfLocation.objects.all() #사용자 주소와 비교할 골프장 인스턴스들

    nearests = find_nearest_golf(address, instances)
    
    ctx = {
        'nearests' : nearests,
    }
    return render(request, 'locations/location_distance.html', ctx)

#내 현재 위치 정보를 기반으로 한 가장 가까운 파크골프장 5곳
def location_myplace (request):
    #템플릿에 골프장 모델의 인스턴스들의 좌표를 보내줌 -> 자바스크립트에서 처리하기 위해
    positions = [[position.golf_name, float(position.golf_latitude), float(position.golf_longitude)] for position in GolfLocation.objects.all()]
    position_json = json.dumps(positions)
    ctx = {
        'positions_list' : position_json
    }
    return render(request, 'locations/location_myplace.html', ctx)



###########################################################
#                 골프장 즐겨찾기 관련 함수                 #
###########################################################
@csrf_exempt
@transaction.atomic
def add_fav_location(request):
    req = json.loads(request.body)
    location_id = req["location_id"]
    location = get_object_or_404(GolfLocation, id=location_id)
    now_user = request.user

    try:
        favPointer = LikeGolf.objects.get(ground=location, user=now_user)
        favPointer.delete()
        location.fav_num -= 1  

        favTag = 'nonfav'
        location.save()
        return JsonResponse({'location_id' : location_id, 'favNum' : location.fav_num, 'favTag' : favTag})
    except LikeGolf.DoesNotExist:
        LikeGolf.objects.create(ground=location, user=now_user)
        location.fav_num += 1

        favTag = 'faved'
        location.save()
        return JsonResponse({'location_id' : location_id, 'favNum' : location.fav_num, 'favTag' : favTag})



###########################################################
#                       리뷰 관련 함수                     #
###########################################################
    

# 함수 이름 : review_create
# 전달인자 : request
# 기능 : --
@csrf_exempt
@transaction.atomic
def review_create(request):
    req = json.loads(request.body)
    # 골프장 정보
    ground_id = req["ground_id"]
    ground = get_object_or_404(GolfLocation, id=ground_id)
    # 리뷰어
    reviewer = request.user
    # 내용
    content = req["content"]
    # 레이팅
    rating = req["rating"]


    new_review = Review.objects.create(ground = ground, reviewer = reviewer, content = content )      
    
    return JsonResponse({'reviewer' : new_review.reviewer.nickname, 'content' : new_review.content, 'reviewId' : new_review.id, 'rating' : rating})



# 함수 이름 : review_delete
# 전달인자 : request
# 기능 : --
@csrf_exempt
@transaction.atomic
def review_delete(request):
    req = json.loads(request.body)
    rid = req["review_id"]

    try:
        get_object_or_404(Review, id = rid).delete()
    except 404:
        print("해당 리뷰가 이미 존재하지 않습니다!")
    else:
        return JsonResponse({'review_id' : rid})


# 함수 이름 : review_update
# 전달인자 : request
# 기능 : --
@csrf_exempt
@transaction.atomic
def review_update(request):
    req = json.loads(request.body)
    rid = req["review_id"]
    content = req["content"]
    # 레이팅
    rating = req["rating"]
    


    try:
        target_review = get_object_or_404(Review, id = rid)
    except 404:
        print("존재하지 않는 댓글 update 시도!")
    else:
        target_review.content = content
        target_review.save()

    return JsonResponse({'reviewer' : target_review.reviewer.nickname, 'content' : content,'reviewId' : rid, 'rating' : rating,})


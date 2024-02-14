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
# 장고 모델 평균 계산
from django.db.models import Avg


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

#마커 클러스터 임시 표시 url
def location_cluster (request):
    locations = [[location.golf_name, float(location.golf_latitude), float(location.golf_longitude)] for location in GolfLocation.objects.all()]
    location_json = json.dumps(locations)
    ctx = {
        'locations_list' : location_json
    }
    return render(request, 'locations/location_cluster.html', ctx)



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

# 함수 이름 : cal_avg_rate
# 전달인자 : gid
# 기능 : 해당 파크골프장의 평균 값을 구하는 함수
# 반환값 : 평균값반환

def cal_avg_rate(ground):
    avgReviewScore = Review.objects.filter(ground = ground).aggregate(avg_rating = Avg('rating'))
    return avgReviewScore['avg_rating']



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
    rating = float(rating)
    if(rating == 0.5):
        rate_tag = 'half'
    elif(rating == 1.0):
        rate_tag = 'one'
    elif(rating == 1.5):
        rate_tag = 'one_half'
    elif(rating == 2.0):
        rate_tag = 'two'
    elif(rating == 2.5):
        rate_tag = 'two_half'
    elif(rating == 3.0):
        rate_tag = 'three'
    elif(rating == 3.5):
        rate_tag = 'three_half'
    elif(rating == 4.0):
        rate_tag = 'four'
    elif(rating == 4.5):
        rate_tag = 'four_half'
    elif(rating == 5.0):
        rate_tag = 'five'

    new_review = Review.objects.create(ground = ground, reviewer = reviewer, content = content, rating = rating, rate_tag = rate_tag )      
    
    ground.golf_rate = cal_avg_rate(ground)
    ground.golf_rate_num += 1
    ground.save()


    return JsonResponse({'reviewer' : new_review.reviewer.nickname, 'content' : new_review.content, 'reviewId' : new_review.id, 'rating' : rating , 'totalRate' : round(ground.golf_rate,2) ,'rateNum' : ground.golf_rate_num, 'groundId' : ground_id})



# 함수 이름 : review_delete
# 전달인자 : request
# 기능 : --
@csrf_exempt
@transaction.atomic
def review_delete(request):
    req = json.loads(request.body)
    rid = req["review_id"]
    # 골프장 정보
    ground_id = req["ground_id"]

    try:
        reviewPointer = get_object_or_404(Review, id = rid)
        tempRating = reviewPointer.rating

        reviewPointer.delete()
    except 404:
        print("해당 리뷰가 이미 존재하지 않습니다!")
        
    

    try:
         # 골프장 정보
        ground = get_object_or_404(GolfLocation, id=ground_id)
    except 404:
        print("존재하지 않는 파크골프장입니다.")
    else:
        ground.golf_rate_num -= 1
        if ground.golf_rate_num != 0:
            ground.golf_rate = cal_avg_rate(ground)
        elif ground.golf_rate_num == 0:
            ground.golf_rate = 5.00
        ground.save()
        return JsonResponse({'review_id' : rid , 'totalRate' : round(ground.golf_rate,2), 'rateNum' : ground.golf_rate_num })


# 함수 이름 : review_update
# 전달인자 : request
# 기능 : --
@csrf_exempt
@transaction.atomic
def review_update(request):
    req = json.loads(request.body)
    # 골프장 정보
    ground_id = req["ground_id"]
    # 리뷰 아이디
    rid = req["review_id"]
    # 리뷰 내용
    content = req["content"]
    # 리뷰 평점
    rating = req["rating"] 
    rating = float(rating)
    if(rating == 0.50):
        rate_tag = 'half'
    elif(rating == 1.00):
        rate_tag = 'one'
    elif(rating == 1.5):
        rate_tag = 'one_half'
    elif(rating == 2.0):
        rate_tag = 'two'
    elif(rating == 2.50):
        rate_tag = 'two_half'
    elif(rating == 3.00):
        rate_tag = 'three'
    elif(rating == 3.50):
        rate_tag = 'three_half'
    elif(rating == 4.00):
        rate_tag = 'four'
    elif(rating == 4.50):
        rate_tag = 'four_half'
    elif(rating == 5.00):
        rate_tag = 'five'
 
    


    try:
        target_review = get_object_or_404(Review, id = rid)
    except 404:
        print("존재하지 않는 댓글 update 시도!")
    else:
        before_rating = target_review.rating
        target_review.content = content
        target_review.rating = rating
        target_review.rate_tag = rate_tag
        target_review.save()

    try:
         # 골프장 정보
        ground = get_object_or_404(GolfLocation, id=ground_id)
    except 404:
        print("존재하지 않는 파크골프장입니다.")
    else:
        ground.golf_rate = cal_avg_rate(ground)
        ground.save()
        
    return JsonResponse({'reviewer' : target_review.reviewer.nickname, 'content' : content,'reviewId' : rid, 'rating' : rating, 'totalRate' : round(ground.golf_rate,2), 'rateNum' : ground.golf_rate_num, 'groundId' : ground_id})


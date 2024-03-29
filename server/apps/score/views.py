from django.shortcuts import render, redirect, get_object_or_404
from .models import *
from apps.users.models import *
from apps.locations.models import *
from apps.locations.views import location_get_by_name
from .forms import *
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
#트랜잭션
from django.db import transaction
# 이미지 텍스트 인식 관련
import requests
import uuid
import time
import json
import os
from django.core.files.storage import default_storage
from django.conf import settings
import environ
#  s3 에 이미지가 저장될 경우
from storages.backends.s3boto3 import S3Boto3Storage
from urllib.request import urlopen

###########################################################
#                      스코어 메인페이지                   #
###########################################################

# 함수 이름 : score_main
# 전달인자 : request
# 기능 : 점수 관련 메인페이지를 렌더링 해준다.
def score_main(request):
    return render(request, 'score/score_main.html')


###########################################################
#                   스코어 CRUD 관련 함수                  #
###########################################################


# 함수 이름 : score_input
# 전달인자 : request
# 기능 : --
def score_input(request, uid):
    if request.method == "GET":

        # HTML에 전달할 정보
        context = {
            'locations' : GolfLocation.objects.all()
        }
        return render(request,'score/score_create.html', context)
    
    # 스코어 생성 요청
    if request.method == "POST":
        # 장소 정보 추가
        location_name = request.POST.get('location')

        score_instance = Score.objects.create(player = request.user,ground = location_get_by_name(location_name))
    
        for i in range(1, 10):
            hole_key = f'hole{i}'
            score_instance.par[hole_key] = request.POST.get(f'par{i}', '')
            score_instance.scores[hole_key] = request.POST.get(f'score{i}', '')
        score_instance.save()
        
        return redirect("score:score_detail", score_instance.id)



# 함수 이름 : score_detail
# 전달인자 : request, sid
# 기능 : --
def score_detail(request, sid):
    if request.method == "GET":
        score = Score.objects.get(id = sid)
        now_user = request.user
        context={
            'score'  : score,
            "now_user"  : now_user,
            "sid" : sid,
        }
        return render(request,'score/score_detail.html',context)



# 함수 이름 : score_update
# 전달인자 : request, sid
# 기능 : --
def score_update(request, sid):
    score = Score.objects.get(id=sid)
    
    if request.method == "POST":
        location_name = request.POST.get('location')
        
        score_instance = Score.objects.create(player = request.user,ground = GolfLocation.objects.get(golf_name = location_name))
    
        for i in range(1, 10):
            hole_key = f'hole{i}'
            score_instance.par[hole_key] = request.POST.get(f'par{i}', '')
            score_instance.scores[hole_key] = request.POST.get(f'score{i}', '')
        score_instance.save()
        
        return redirect("score:score_detail", score_instance.id)
    
    if request.method == "GET":
        # HTML 에 전달할 정보
        context = {
            'sid' : sid,
            'score' :score,
            'locations' : GolfLocation.objects.all(),
            'now_golf_name' : score.ground.golf_name,
        }

        return render(request, "score/score_update.html",context)



# 함수 이름 : score_delete
# 전달인자 : request, sid
# 기능 : 선택한 점수 기록 삭제
def score_delete(request, sid):
    now_user = request.user
    if request.method == 'POST':
        Score.objects.get(id = sid).delete()
        return redirect("score:score_history", now_user.id)


###########################################################
#                   개인 스코어 포트폴리오                 #
###########################################################

# 함수 이름 : score_history
# 전달인자 : request, uid
# 기능 : 유저의 상세 기록들을 볼 수 있는 페이지
def score_history(request, uid):
    user = User.objects.get(id = uid)
    try:
        # 추후에 날짜 데이터 삽입시 변경.
        scores = Score.objects.filter(player = user).order_by('-id')
        # DoesNotExist 예외 x get()만 발생 / filter()는 빈 쿼리셋을 반환
    except Score.DoesNotExist:
        scores=[] 

    locations=[] 
    # 유저가 기록한 점수의 골프장 리스트 
    for score in scores:
        if score.ground not in locations:
            locations.append(score.ground)        

    context={
        'scores' : scores,
        'user' : user,
        'uid' : uid,
        'locations' : locations,
    }
    return render(request, 'score/score_history.html', context)


###########################################################
#                   스코어 스캔 관련 함수                  #
###########################################################

# 함수 이름 : score_scan
# 전달인자 : request
# 기능 : --
@csrf_exempt
@transaction.atomic
def score_scan(request):
    if request.method == "POST":
        image = request.FILES.get('image')
        if image:

            ##### 파일 저장 경로 설정 ######
            # media 로 올릴시 
            # save_path = os.path.join(settings.MEDIA_ROOT, 'uploads', image.name)
            # path = default_storage.save(save_path, image)

            # s3 사용시
            # S3에 파일 저장
            relative_path = 'score_scan/' + image.name
            image_url = default_storage.save(relative_path, image)

            # S3에 저장된 파일의 URL 가져오기
            path = default_storage.url(image_url)

            # media 파일 사용시
            # image_file_path = default_storage.path(path)  # 저장된 파일의 절대 경로

            # 네이버 OCR API 호출
            api_url = os.environ.get('NAVER_OCR_API_URL').strip()
            secret_key = os.environ.get('NAVER_SECRET_KEY').strip()


            # API 요청 데이터 준비

            request_json = {
                'images': [
                    {
                        'format': 'jpg',
                        'name': 'demo',
                        'url': path
                    }
                ],
                'requestId': str(uuid.uuid4()),
                'version': 'V2',
                'timestamp': int(round(time.time() * 1000))
            }

            payload = json.dumps(request_json).encode('UTF-8')
            headers = {
            'X-OCR-SECRET': secret_key,
            'Content-Type': 'application/json'
            }

            ##### media ######
            # request_json = {
            #     'images': [
            #         {
            #             'format': 'jpg',
            #             'name': 'demo',
            #             # s3 서버 적용시
            #             # "url": path,

            #         }
            #     ],
            #     'requestId': str(uuid.uuid4()),
            #     'version': 'V2',
            #     'timestamp': int(round(time.time() * 1000))
            # }
            # payload = {'message': json.dumps(request_json).encode('UTF-8')}
            # files = [('file', (image.name, file_content, 'image/jpeg'))]
            # headers = {'X-OCR-SECRET': secret_key,
            #            'Content-Type': 'application/json'}

            # API 요청 및 응답 처리

            # media 적용시
            # response = requests.post(api_url, headers=headers, data=payload, files=files)

            # s3 적용시
            response = requests.request("POST", api_url, headers=headers, data = payload)

            # 받아온 결과
            result = response.json()

            # 받아온 텍스트 저장
            text = [field['inferText'] for field in result['images'][0]['fields']]

            # 텍스트에서 결과값 뽑아내는 함수
            result = extractParScore(text)

            default_storage.delete(relative_path)

            return JsonResponse({'par': result['par'], 'score' : result['score']})
        
    

def extractParScore(inputText):
    par = []
    score = []
    mode = 0
    try : 
        for i in range(12,21):
            par.append(inputText[i])
        for j in range(23,32):
            score.append(inputText[j])
    except IndexError:
         return {'par' : par, 'score': score,}

    return {'par' : par, 'score': score,}
        

###########################################################
#                   스코어 그래프 관련 함수                 #
###########################################################

# 함수 이름 : take_score_info
# 전달인자 : request
# 기능 : --
@csrf_exempt
@transaction.atomic
def take_score_info (request):
    # 아래 오류 수정
    req = json.loads(request.body)
    user_id = req["user_id"]
    flag = req["flag"]
    select_name = req["location_name"]
    sort_type = req["sort"]
    user = get_object_or_404(User, id=user_id)
    score_info = []
    # 만약 location 필터가 있을 시
    if flag:
        # 해당 이름을 가진 로케이션 필드 가져오기
        try:
            ground = GolfLocation.objects.get(golf_name = select_name)
        except GolfLocation.DoesNotExist:
            print("골프장 이름 존재하지 않음. 해당 이름 체크 요망")

        # 해당 유저의 모든 Score 모델 가져오기
        try:
            score_list = Score.objects.filter(player = user, ground = ground).order_by(sort_type)
            scores = list(score_list.values_list("total_score", flat=True))
        except Score.DoesNotExist:
            scores = []

    # 전체 데이터 참고
    else:
        # 해당 유저의 모든 Score 모델 가져오기
        
        try:
            score_list = Score.objects.filter(player = user).order_by(sort_type)
            scores = list(score_list.values_list("total_score", flat=True))
        except Score.DoesNotExist:
            score_list = []
            scores = []

    for one_score in score_list:
        score_info.append({'score_id' : one_score.id, 'ground_name' : one_score.ground.golf_name,'total_score' : one_score.total_score})
    return JsonResponse({'scores' : scores, 'score_info' : score_info})


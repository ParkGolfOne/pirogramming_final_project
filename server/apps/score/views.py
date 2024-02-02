from django.shortcuts import render, redirect, get_object_or_404
from .models import *
from apps.users.models import *
from apps.locations.models import *
from .forms import *
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction


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
            'form' : ScoreForm
        }
        return render(request,'score/score_create.html', context)
    
    # 스코어 생성 요청
    if request.method == "POST":
        form = ScoreForm(request.POST, request.FILES)
        if form.is_valid:
            score_instance = form.save(commit=False)
            score_instance.player = request.user
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
        }
        return render(request,'score/score_detail.html',context)



# 함수 이름 : score_update
# 전달인자 : request, sid
# 기능 : --
def score_update(request, sid):
    score = Score.objects.get(id=sid)
    
    if request.method == "POST":
        form = ScoreForm(request.POST, instance = score)
        if form.is_valid():
            form.save()
        return redirect("score:score_detail", sid)
    
    if request.method == "GET":
        form = ScoreForm(instance=score)
        # HTML 에 전달할 정보
        context = {
            'form' : form,
            'sid' : sid,
        }

        return render(request, "score/score_update.html",context)



# 함수 이름 : score_delete
# 전달인자 : request, sid
# 기능 : 선택한 점수 기록 삭제
def score_delete(request, sid):
    if request.method == 'POST':
        Score.objects.get(id = sid).delete()
        return redirect("score:score_main")


###########################################################
#                   개인 스코어 포트폴리오                 #
###########################################################

# 함수 이름 : score_history
# 전달인자 : request, uid
# 기능 : 유저의 상세 기록들을 볼 수 있는 페이지
def score_history(request, uid):
    user = User.objects.get(id = uid)

    try:
        scores = Score.objects.filter(player = user)
    except Score.DoesNotExist:
        scores=[]

    context={
        'scores' : scores,
        'user' : user,
    }
    return render(request, 'score/score_history.html', context)


###########################################################
#                   스코어 스캔 관련 함수                  #
###########################################################

# 함수 이름 : score_scan
# 전달인자 : request
# 기능 : --
def score_scan(request):
    pass


###########################################################
#                   스코어 그래프 관련 함수                 #
###########################################################

# 함수 이름 : draw_score_graph
# 전달인자 : request
# 기능 : --
def draw_score_graph (request):
    pass
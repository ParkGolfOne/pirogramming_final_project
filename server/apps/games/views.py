from django.shortcuts import render, redirect,  get_object_or_404
from .forms import *
from .models import Game, Round, Player
from django.utils import timezone
from django.urls import reverse
from apps.score.models import Score
from django.views.decorators.csrf import csrf_exempt

# 게임 설정및 게임 생성 페이지
def game_set(request):
    if request.method == 'POST':
        # 라운드 수, 플레이어 수, 골프장 까지 받는데 아직 골프장은 x
        form = GameSetupForm(request.POST)
        if form.is_valid():
            round_count = form.cleaned_data['round_count']
            player_count = form.cleaned_data['player_count']
        
            # Game 인스턴스 생성
            game = Game.objects.create(
                create_by = request.user,
                ground=None,  # 일단은 골프장 none
                par='555555555',  # 일단 디폴트 값
                created_at=timezone.now()
            )
            # Round 인스턴스 생성
            for i in range(form.cleaned_data['round_count']):
                Round.objects.create(game=game, round_number = (i + 1) )

            return redirect(reverse('games:game_detail', args=(game.id, round_count, player_count)))
    else:
        form = GameSetupForm()
        content = {
            'form': form
        }
        return render(request, 'games/game_set.html', content)

@csrf_exempt  
def game_detail(request, game_id, round_count, player_count):
    # 페이지는 게임과 라운드 관련 모든 정보를 보여 주고 수정 가능하게
    if request.method == 'GET':
        game = get_object_or_404(Game, id=game_id)
        rounds = Round.objects.filter(game_id=game_id)

        for round in rounds:
            players = Player.objects.filter(round=round)
            if players.count() < player_count:
                for i in range(players.count(), player_count):
                    score = Score.objects.create(player=None, ground=game.ground)
                    Player.objects.create(round=round, name=f"플레이어{i+1}", score=score)
        content = {
            'game': game, 
            'round_count': round_count, 
            "player_count" : player_count,
        }
        return render(request, 'games/game_detail.html', content)
    # 저장 
    elif request.method == 'POST':
        score_data = request.POST.get('score')
        game_id = request.POST.get('game_id')
        game = get_object_or_404(Game, id=game_id)
        rounds = Round.objects.filter(game_id=game_id)

        for round in rounds:
            scores = Score.objects.filter(round_id=round.id)
            for score_instance in scores:
                score_instance.player=None,
                score_instance.ground=game.ground,
                score_instance.par=game.par,
                score_instance.score=score_data,
                score_instance.total_score=0, 
                score_instance.save()
        
        
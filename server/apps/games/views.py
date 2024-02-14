from django.shortcuts import render, redirect,  get_object_or_404
from .forms import *
from .models import Game, Round, Player
from django.utils import timezone
from django.urls import reverse
from apps.score.models import Score
from apps.users.models import User
from apps.locations.models import GolfLocation
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages

def game_set_post(request, form):
    #폼에서 라운드 수 와 플레이어 수를 입력받아 저장
    round_count = form.cleaned_data['round_count'] 
    location_name = request.POST.get('location')

    # Game 인스턴스 생성    
    game = Game.objects.create(
        created_by = request.user if request.user.is_authenticated else None,
        game_name = form.data['game_name'],
        ground = GolfLocation.objects.get(golf_name = location_name),
        created_at=timezone.now()
    )

    # 라운드 수 만큼 Round 인스턴스 생성
    rounds_to_create = [Round(game=game, round_number=i+1) for i in range(round_count)]
    Round.objects.bulk_create(rounds_to_create)

    return game       

def game_set_post_player(request, game):
    player_count = int(request.POST.get('player_count'))
    players_id = []
    for i in range(player_count):
        players_id.append(request.POST.get(f"player_{i+1}_id"))
        game['i'] = players_id
    return player_count

# 게임 설정및 게임 생성 페이지
def game_set(request):
    if request.method == 'POST':
        form = GameSetupForm(request.POST)
        if form.is_valid():
            game  = game_set_post(request, form) 
            player_count = game_set_post_player(request, game)
            # url에 라운드 수와 플레이어 수를 저장하고 game_detail로 보내기
            return redirect(reverse('games:game_update', args=(game.id,player_count)))
    
    else:
        form = GameSetupForm()
        locations = GolfLocation.objects.all()
        
        content = {
            'form': form,
            'locations' : locations,
        }
        
        if request.user.is_authenticated:
            friends = request.user.friends.all()
            content['friends'] = friends
        
        return render(request, 'games/game_create.html', content)


def game_load(game_id):
    # game_set에서 만든 게임과 라운드들 가져오기
    game = get_object_or_404(Game, id=game_id)
    rounds = Round.objects.filter(game_id=game_id)
    return game, rounds


def game_detail_get(game_id, player_count):
    game, rounds = game_load(game_id)
    # 불러온 라운드에 대해
    for round in rounds:
        # 만일 플레이어 생성되었다면
        players = Player.objects.filter(round=round)
        if players.count() < player_count:
            # 플레이어 수 만큼 플레이어와 플레이어의 스코어 보드도 생성
            for i in range(players.count(), player_count):
                score = Score.objects.create(player=None, ground=game.ground)
                Player.objects.create(round=round, name=f"플레이어{i+1}", score=score)
    

def game_detail_post(request, game_id):
    game, rounds = game_load(game_id)
    # 라운드에 대해
    for round in rounds:
        # 파 데이터 받아 넘겨주기
        par_data = round.par
        for i in range(1, 10):
            hole_key = f'hole{i}'
            par_data[hole_key] = int(request.POST.get(f'par{i}_{round.id}', 0))
        round.par = par_data
        round.save()
        # 라운드의 플레이어 마다 스코어 보드 저장 시키기
        players = Player.objects.filter(round_id=round.id)
        for player in players:
            scores_data = player.score.scores 
            player.name = request.POST.get(f'name_{player.id}', "플레이어")
            for i in range(1, 10):
                hole_key = f'hole{i}'
                scores_data[hole_key] = int(request.POST.get(f'score{i}_{player.id}', 0))
            player.score.scores = scores_data
            player.score.par = par_data
            player.score.ground = game.ground
            player.save()
            player.score.save()


@csrf_exempt  
# game_detail은 게임과 라운드 관련 모든 정보를 보여 주고 수정 가능하게    
def game_detail(request, game_id, player_count):
    game , rounds = game_load(game_id)
    if request.method == 'GET':
            # 데이터 넘겨주고
        game_detail_get(game_id, player_count)
        content = {
            'game': game,
            'rounds': rounds,  
            "player_count" : player_count,
        }
        return render(request, 'games/game_update.html', content)
    
    # 임시 저장 
    elif request.method == 'POST':
        game_detail_post(request, game_id)
        # 마찬가지로 불러오고
        if request.POST.get("save") == "점수 저장":
            return redirect("games:game_save", game_id=game.id, player_count=player_count )
    # 임시 저장이므로 다시 원래 페이지
    return redirect('games:game_update', game_id=game.id, player_count=player_count)


def game_save(request, game_id, player_count):
    game , rounds = game_load(game_id)

    if request.method == 'GET':
        content = {
            'game': game,
            'rounds': rounds,
            'player_count' : player_count,
        }
        return render(request, 'games/game_detail.html', content)
    
    if request.method == 'POST':
        player = Player.objects.get( id= request.POST.get('player_id') )
        player.score.player = request.user if request.user.is_authenticated else None
        player.score.save()
        return redirect(request.path)
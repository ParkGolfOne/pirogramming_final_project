from django.db import models
from apps.users.models import *
from apps.locations.models import *
from django.utils import timezone
from apps.locations.models import *
from apps.score.models import Score
def default_scores():
    return {"hole1": 4, "hole2": 4, "hole3": 4, "hole4": 4, "hole5": 4, "hole6": 4, "hole7": 4, "hole8": 4, "hole9": 4}

# 게임 모델 게임을 
class Game(models.Model):
    create_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True,  verbose_name='create_user')
    game_name = models.CharField('게임이름', max_length = 9, default = '게임')
    ground = models.ForeignKey(GolfLocation, null = True, blank = True ,on_delete=models.SET_NULL, verbose_name='골프장')
    created_at = models.DateTimeField(default=timezone.now)
    # ROUND카운터를 따로 두지 않아도 될 듯? 역 참조로 다 불러오면 될듯

# 라운드, 게임 진행 수, 파크 골프에선 코스
class Round(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='rounds')
    par = models.JSONField(default=default_scores)
    round_number = models.IntegerField()

# 플레이어 --> 라운드 마다 플레이어 수 만큼의 스코어 보드 필요 --> 둘과 일대일 관계인 플레이어 모델 생성
class Player(models.Model):
    round = models.ForeignKey(Round, on_delete=models.CASCADE, related_name='round_player')
    name = models.CharField(max_length=144)
    score = models.ForeignKey(Score, on_delete=models.CASCADE, related_name='score_player')

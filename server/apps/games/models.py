from django.db import models
from apps.users.models import *
from apps.locations.models import *
from django.utils import timezone
def default_scores():
    return {"hole1": 4, "hole2": 4, "hole3": 4, "hole4": 4, "hole5": 4, "hole6": 4, "hole7": 4, "hole8": 4, "hole9": 4}

# 게임 모델 게임을 
class Game(models.Model):
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True,  verbose_name='create_user')
    players_name = models.JSONField( null = True)
    players_id = models.JSONField( null = True)
    game_name = models.CharField('게임이름', max_length = 9, default = '게임')
    ground = models.ForeignKey(GolfLocation, null = True, blank = True ,on_delete=models.SET_NULL, verbose_name='골프장')
    created_at = models.DateTimeField(auto_now_add=True)
    # ROUND카운터를 따로 두지 않아도 될 듯? 역 참조로 다 불러오면 될듯

# 라운드, 게임 진행 수, 파크 골프에선 코스
class Round(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='rounds')
    par = models.JSONField(default=default_scores)
    round_number = models.IntegerField()

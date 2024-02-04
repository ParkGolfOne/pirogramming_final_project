from django.db import models
from apps.users.models import *
from apps.locations.models import *
from django.utils import timezone
from apps.locations.models import *
from apps.score.models import Score

# 게임 모델 게임을 
class Game(models.Model):
    create_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True,  verbose_name='create_user')
    game_name = models.CharField('게임이름', max_length = 9, default = '게임')
    ground = models.ForeignKey(GolfLocation, null = True, blank = True ,on_delete=models.SET_NULL, null=True,  verbose_name='골프장')
    par = models.CharField('파', max_length = 9, default = '555555555')
    created_at = models.DateTimeField(default=timezone.now)
    # ROUND카운터를 따로 두지 않아도 될 듯? 역 참조로 다 불러오면 될듯

class Round(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='rounds')
    round_number = models.IntegerField()

class Player(models.Model):
    round = models.ForeignKey(Round, on_delete=models.CASCADE, related_name='round_player')
    name = models.CharField(max_length=100)
    score = models.ForeignKey(Score, on_delete=models.CASCADE, related_name='game')

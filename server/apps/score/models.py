from django.db import models
from apps.users.models import *
from apps.locations.models import *
from django.utils import timezone
# Create your models here.

class Score(models.Model):
    player = models.ForeignKey(User, on_delete=models.CASCADE,  verbose_name='플레이어')
    ground = models.ForeignKey(GolfLocation, on_delete=models.SET_NULL, null=True,  verbose_name='골프장')
    par = models.CharField('파', max_length = 9, default = '555555555')
    score = models.CharField('점수', max_length = 9, default = '000000000')
    total_score = models.IntegerField(default = 0)
    date = models.DateTimeField('작성일', auto_created=True, auto_now_add=True)

    def save(self, *args, **kwargs):
        self.total_score = sum(int(score_digit) for score_digit in self.score)
        super().save(*args, **kwargs)

    
   
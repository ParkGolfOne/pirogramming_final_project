from django.db import models
from apps.users.models import *
from apps.locations.models import *
from django.utils import timezone
# Create your models here.
def default_scores():
    return {"hole1": 0, "hole2": 0, "hole3": 0, "hole4": 0, "hole5": 0, "hole6": 0, "hole7": 0, "hole8": 0, "hole9": 0}

class Score(models.Model):
    player = models.ForeignKey(User, null = True, on_delete=models.CASCADE,  verbose_name='플레이어')
    ground = models.ForeignKey(GolfLocation, on_delete=models.SET_NULL, null=True,  verbose_name='골프장')
    par = models.JSONField(default=default_scores)
    scores = models.JSONField(default=default_scores)
    total_score = models.IntegerField(default = 0)
    date = models.DateTimeField('작성일', auto_created=True, default = timezone.now)

    # scores 필드에서 각 점수의 합을 계산하여 total_score에 저장
    def save(self, *args, **kwargs):
        self.total_score = sum(int(score) for score in self.scores.values())
        super(Score, self).save(*args, **kwargs)
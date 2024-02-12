from django.db import models
from apps.users.models import *
from apps.locations.models import *
from django.utils import timezone
# Create your models here.
def default_scores():
    return {"hole1": 4, "hole2": 4, "hole3": 4, "hole4": 4, "hole5": 4, "hole6": 4, "hole7": 4, "hole8": 4, "hole9": 4}

class Score(models.Model):
    player = models.ForeignKey(User, null = True, on_delete=models.CASCADE,  verbose_name='플레이어')
    ground = models.ForeignKey(GolfLocation, on_delete=models.SET_NULL, null=True,  verbose_name='골프장')
    par = models.JSONField(default=default_scores)
    scores = models.JSONField(default=default_scores)
    total_score = models.IntegerField(default = 36)
    date = models.DateTimeField('작성일', auto_created=True, default = timezone.now)

    # scores 필드에서 각 점수의 합을 계산하여 total_score에 저장
    def save(self, *args, **kwargs):
        self.total_score = sum(int(score) for score in self.scores.values())
        super(Score, self).save(*args, **kwargs)
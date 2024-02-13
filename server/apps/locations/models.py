from django.db import models
from ..users.models import *
from tinymce.models import HTMLField

# 골프장 위치 모델
class GolfLocation (models.Model):
    golf_image = models.ImageField(blank = True, upload_to='locations/images/')
    golf_scale = models.TextField(blank = True)
    golf_name = models.CharField(max_length = 50, blank = False, null = False)
    golf_address = models.CharField(max_length = 50, blank = False, null = False)
    golf_latitude = models.DecimalField(max_digits=12, decimal_places=8, blank = False, null = False)
    golf_longitude = models.DecimalField(max_digits=12, decimal_places=8, blank = False, null = False)
    golf_detail = models.TextField(max_length = 200, blank = False, null = False)
    golf_holes = models.IntegerField(blank = False, null = False)
    golf_fee = models.TextField(blank = True, null = True)
    golf_runningtime = models.TextField(blank = True, null = True)
    golf_reservation = models.TextField(blank = True, null = True)
    golf_runningdate = models.TextField(blank = True, null = True)
    golf_homepage = models.TextField(blank = True, null = True)
    golf_reservepage = models.TextField(blank = True, null = True)
    #golf_user = models.ForeignKey(User, on_delete=models.CASCADE, blank = True, null = True)
    # golf_review = models.ForeignKey()
    fav_num =  models.IntegerField(default = 0)
    # 평점
    golf_rate = models.DecimalField(default = 5.00, max_digits=3, decimal_places=2)
    # 평점 개수
    golf_rate_num = models.IntegerField(default = 0)


class LikeGolf(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    ground = models.ForeignKey(GolfLocation, on_delete=models.CASCADE)


class Review(models.Model):
    ground = models.ForeignKey(GolfLocation,on_delete=models.CASCADE)
    reviewer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    content = HTMLField('리뷰 내용')
    # 사진은 일단 넣기만 하고, 나중에 추가 수정 필요
    photo = models.ImageField('이미지', blank=True, upload_to='review/photo/%Y/%m/%d')
    rating = models.DecimalField('평점', default = 5.00, max_digits=3, decimal_places=2)
    created_date = models.DateTimeField('작성일', auto_now_add=True)
    updated_date = models.DateTimeField('수정일', auto_now=True)

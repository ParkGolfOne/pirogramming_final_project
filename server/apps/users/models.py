from django.contrib.auth.models import AbstractUser
from django.db import models
from apps.region.models import Region
from config.settings import MEDIA_ROOT
import random
import os

# default 사진을 random으로 뽑는 함수
def get_default_image():
    image_path = f'{MEDIA_ROOT}/user/default'  # 기본 이미지 디렉토리 경로
    default_images = os.listdir(image_path)
    final_image = os.path.join(image_path, random.choice(default_images))
    return final_image.split('media/')[1]

# 유저 모델
class User(AbstractUser):
    username = models.CharField('아이디', max_length=15, null=False, unique=True)
    nickname = models.CharField('닉네임', max_length=31, null=False)
    image = models.ImageField(
        '이미지', blank=True, upload_to='user/%Y/%m/%d', default=get_default_image)
    birth = models.DateField(null=True, blank=True)
    phone = models.CharField(max_length=15, null=True, blank=True)
    email = models.EmailField('이메일', max_length=255, null=False, unique=True)
    address = models.CharField(max_length=255, null=True)
    detail_address = models.CharField(max_length=255, null=True, blank=True)
    first_login = models.BooleanField(default=True)
    region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True)
    # 친구 속성 추가
    friends = models.ManyToManyField('self', symmetrical=True, blank=True)

    def __str__(self):
        return self.nickname

    def save(self, *args, **kwargs):
        print("save!!")
        super().save(*args, **kwargs)

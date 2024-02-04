from django.contrib.auth.models import AbstractUser
from django.db import models
from apps.region.models import Region

# 유저 모델
class User(AbstractUser):
    username = models.CharField('아이디', max_length=15, null=False, unique=True)
    nickname = models.CharField('닉네임', max_length=31, null=False)
    birth = models.DateField(null=True)
    phone = models.CharField(max_length=15, null=False)
    address = models.CharField(max_length=255, null=False)
    first_login = models.BooleanField(default=True)
    region = models.ForeignKey(Region, on_delete=models.PROTECT, null=True, blank=True)

    def __str__(self):
        return self.username



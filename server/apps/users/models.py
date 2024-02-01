from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    username = models.CharField('아이디', max_length=15, null=False, unique=True)
    birth = models.DateField(null=True)
    phone= models.CharField(max_length=15, null=False)
    address= models.CharField(max_length=255, null=False)
    #town_id

    def __str__(self):
        return self.username
    

# class SocialUser(models.Model):
#     user = models.ForeignKey(
#         allauth.app_settings.USER_MODEL, on_delete=models.CASCADE)

from django.db import models
from ..users.models import *

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

class LikeGolf(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    ground = models.ForeignKey(GolfLocation, on_delete=models.CASCADE)
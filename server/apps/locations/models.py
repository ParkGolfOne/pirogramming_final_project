from django.db import models

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
    # golf_review = models.ForeignKey()
    # golf_이용가능대상 = models.ForeignKey()

from django.db import models

# 시도/ 군구 모델
class Region(models.Model):
    city = models.CharField("시/도", max_length=31)
    town = models.CharField("군/구", max_length=31)

    def __str__(self):
        return self.city + ' ' + self.town
        
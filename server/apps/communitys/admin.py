from django.contrib import admin
from apps.communitys import models
# Register your models here.

admin.site.register(models.Board)
admin.site.register(models.Comment)
admin.site.register(models.Post)
admin.site.register(models.Like)
admin.site.register(models.Scrap)
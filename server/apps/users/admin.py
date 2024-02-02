from django.contrib import admin
from apps.users import models
from django.contrib.auth.admin import UserAdmin

# Register your models here.
admin.site.register(models.User, UserAdmin)
# admin.site.register(models.Region)

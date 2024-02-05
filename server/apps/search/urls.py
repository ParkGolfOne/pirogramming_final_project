from django.urls import path
from .views import *

app_name = "search"

# communitys url 추가
urlpatterns = [
    path('search_location/', search_location, name='search_location'),
]
from django.urls import path
from .views import *

app_name = "games"

# games url 추가
urlpatterns = [
    path('game_set', game_set, name='game_set'),
    path('game_detail/<int:game_id>/<int:player_count>/', game_detail, name='game_detail'),
]
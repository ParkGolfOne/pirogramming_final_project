from django.urls import path
from .views import *

app_name = "games"

# games url 추가
urlpatterns = [
    path('game_set', game_set, name='game_set'),
    path('game_update/<int:game_id>/<int:player_count>', game_update, name='game_update'),
    path('game_save/<int:game_id>/<int:player_count>', game_save, name='game_save')
]
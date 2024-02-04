from django.urls import path
from .views import *

app_name = "games"

# games url 추가
urlpatterns = [
    path('score-input/<int:game_id>/<int:round_count>/<int:player_count>/', score_input_page, name='score_input_page'),
]
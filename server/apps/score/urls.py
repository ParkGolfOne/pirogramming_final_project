from django.urls import path
from .views import *

app_name = "score"

# communitys url 추가
urlpatterns = [
    path('', score_main, name='score_main'),
    path('score_input/<int:uid>/', score_input, name='score_input'),
    path('score_detail/<int:sid>/', score_detail, name='score_detail'),
    path('score_update/<int:sid>/', score_update, name='score_update'),
    path('score_delete/<int:sid>/', score_delete, name='score_delete'),
    path('userScoreHistory/<int:uid>/', score_history, name='score_history'),
    path('scan_scorePaper/', score_scan, name='score_scan'),
    path('take_score_info/', take_score_info, name='take_score_info'),
]
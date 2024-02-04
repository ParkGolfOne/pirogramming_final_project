from django.urls import path
from . import views

app_name = "region"

urlpatterns = [
    path('get_city_list/', views.get_city_list, name="get_city_list"),
    path('get_town_list/', views.get_town_list, name='get_town_list'),
]

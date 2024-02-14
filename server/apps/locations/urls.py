from django.urls import path
from .views import *

app_name = "locations"

urlpatterns = [
    path('list/', location_list, name='list'),
    path('detail/<int:pk>/', location_detail, name='detail'),
    path('create/', location_create, name='create'),
    path('update/<int:pk>/', location_update, name='update'),
    path('delete/<int:pk>/', location_delete, name='delete'),
    path('myhome/<int:pk>/', location_distance, name='myhome'),
    path('myplace/', location_myplace, name='myplace'),
    path('favorites/', add_fav_location, name='favorites'),
    path('cluster/', location_cluster, name='cluster'),
]
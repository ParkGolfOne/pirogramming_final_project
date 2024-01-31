from django.urls import path
from .views import *

app_name = "locations"

urlpatterns = [
    path('list/', location_list, name='list'),
    path('detail/<int:pk>/', location_detail, name='detail'),
    path('create/', location_create, name='create'),
    path('update/<int:pk>/', location_update, name='update'),
    path('delete/<int:pk>/', location_delete, name='delete'),
]
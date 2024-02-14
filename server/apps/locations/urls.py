from django.urls import path
from .naver_review import search_blog
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
    path('favorites/', add_fav_location, name='favorites' ),
    path('cluster/', location_cluster, name='cluster'),

    # 리뷰 url
    path('review_create/', review_create, name="review_create"),
    path('review_update/', review_update, name="review_update"),
    path('review_delete/', review_delete, name="review_delete"),
  
    # 네이버 블로그 리뷰 검색
    path('naver_blog/', search_blog, name="naver_blog")

]
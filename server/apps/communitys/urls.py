from django.urls import path
from .views import *

app_name = "communitys"

# communitys url 추가
urlpatterns = [
    # 게시판 url
    path('', board_list ,name="board_list" ),
    path('Board_create/',board_create, name="board_create"),
    path('Board_update/<int:bid>/',board_update, name="board_update"),
    path('Board_delete/<int:bid>/', board_delete, name="board_delete"),

    # 게시물 url
    path('<int:bid>/main/', post_list ,name="post_list" ),
    path('<int:bid>/main/post_create/',post_create, name="post_create"),
    path('<int:bid>/main/<int:pk>/', post_detail ,name="post_detail" ),
    path('<int:bid>/main/post_update/<int:pk>/',post_update, name="post_update"),
    path('<int:bid>/main/post_delete/<int:pk>/', post_delete, name="post_delete"),

    # 댓글 url
    path('comment_create/',comment_create, name="comment_create"),
    path('comment_update/<int:pk>/',comment_update, name="comment_update"),
    path('comment_delete/<int:pk>/', comment_delete, name="comment_delete"),

    # 좋아요 url
    path('post_like/',pushPostLike, name="post_like"),
    path('comment_like/',pushCommentLike, name="comment_like"),

    # 스크랩 url
    path('post_scrap/',pushScrap, name="scrap"),
]
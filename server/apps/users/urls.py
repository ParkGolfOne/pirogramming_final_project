from django.urls import path
from . import views

app_name = "users"

urlpatterns = [
    path("<int:pk>/", views.main, name="main"),
    path("login/", views.login, name="login"),
    path("logout/", views.logout, name="logout"),
    path("signup/", views.signup, name="signup"),
    path("delete/<int:pk>/", views.delete, name="delete"),
    path("update/<int:pk>/", views.update, name="update"),

    # 소셜 로그인 관련 기능
    path("social_login/", views.social_login, name="social_login"),

    # 친구 기능
    path("friend_list/<int:pk>/", views.friend_list, name="friend_list"),
    path("add_friend/<int:pk>/", views.add_friend, name="add_friend"),
    path("delete_friend/<int:pk>/", views.delete_friend, name="delete_friend"),
]
from django.urls import path
from . import views

app_name = "users"

urlpatterns = [
    path("<int:pk>/", views.main, name="main"),
    path("login/", views.login, name="login"),
    path("logout/", views.logout, name="logout"),
    path("signup/", views.signup, name="signup"),
]
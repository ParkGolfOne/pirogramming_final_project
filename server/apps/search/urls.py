from django.urls import path
from . import views

app_name = "search"

urlpatterns = [
    # 친구 search
    path("search_friend/<int:pk>/", views.search_friend, name="search_friend"),
]

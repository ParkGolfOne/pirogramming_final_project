from django.urls import path
from . import views

app_name = "search"

urlpatterns = [
    # add할 친구 search
    path("search_candidate/", views.search_candidate, name="search_candidate"),
]

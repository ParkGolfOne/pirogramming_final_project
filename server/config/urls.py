"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from apps.users.views import home
from django.views.static import serve


urlpatterns = [
    path('', home,  name='home'),
    path('admin/', admin.site.urls),
    path('communitys/', include('apps.communitys.urls')),
    path('users/', include('apps.users.urls')),
    path('score/', include('apps.score.urls',)),
    path('locations/', include('apps.locations.urls')),
    path('region/', include('apps.region.urls')),
    path('auth/', include('social_django.urls', namespace='social')),
    path('games/', include('apps.games.urls')),
    path('search/', include('apps.search.urls')),
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root':settings.MEDIA_ROOT}),
    re_path(r'^static/(?P<path>.*)$', serve, {'document_root':settings.STATIC_ROOT}),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


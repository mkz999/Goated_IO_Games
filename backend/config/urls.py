"""
URL Configuration for Goated IO Games project.
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from games_api.views import FrontendView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('games_api.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Catch-all for React routing - must be last
urlpatterns += [
    re_path(r'^.*$', FrontendView.as_view(), name='frontend'),
]

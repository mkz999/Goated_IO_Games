"""
URL Configuration for Goated IO Games project.
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from pathlib import Path
from games_api.views import FrontendView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('games_api.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    # Serve dist assets
    dist_assets_path = Path(settings.BASE_DIR) / 'staticfiles' / 'dist' / 'assets'
    if dist_assets_path.exists():
        urlpatterns += [
            re_path(r'^assets/(?P<path>.*)$', serve, {'document_root': str(dist_assets_path)}),
        ]

# Catch-all for React routing - must be last
urlpatterns += [
    re_path(r'^.*$', FrontendView.as_view(), name='frontend'),
]

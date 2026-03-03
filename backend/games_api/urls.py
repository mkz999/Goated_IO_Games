from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GameViewSet, CategoryViewSet

app_name = 'games_api'

router = DefaultRouter()
router.register(r'games', GameViewSet, basename='game')
router.register(r'categories', CategoryViewSet, basename='category')

urlpatterns = [
    path('', include(router.urls)),
]

from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.views import View
from django.http import HttpResponse
from django.conf import settings
from .models import Game, Category, UserFavorite
from .serializers import GameListSerializer, GameDetailSerializer, CategorySerializer


class GamePagination(PageNumberPagination):
    """Custom pagination for games"""
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 100


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoints for categories:
    - GET /api/categories/ - List all categories
    - GET /api/categories/:id/ - Get category details
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'


class GameViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoints for games:
    - GET /api/games/ - List games with filtering, sorting, and search
    - GET /api/games/:id/ - Get game details
    - POST /api/games/:id/favorite/ - Add to favorites
    - POST /api/games/:id/unfavorite/ - Remove from favorites
    """
    queryset = Game.objects.filter(is_active=True)
    pagination_class = GamePagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'tags']
    ordering_fields = ['created_at', 'play_count', 'rating']
    ordering = ['-created_at']

    def get_serializer_class(self):
        """Use different serializers for list and detail views"""
        if self.action == 'retrieve':
            return GameDetailSerializer
        return GameListSerializer

    def get_queryset(self):
        """Filter games by category and difficulty if provided"""
        queryset = super().get_queryset()
        category = self.request.query_params.get('category')
        difficulty = self.request.query_params.get('difficulty')
        
        if category:
            queryset = queryset.filter(categories__slug=category)
        
        if difficulty:
            queryset = queryset.filter(difficulty=difficulty)
        
        return queryset

    @action(detail=True, methods=['post'])
    def favorite(self, request, pk=None):
        """
        Add game to favorites
        POST /api/games/:id/favorite/
        """
        game = self.get_object()
        user_id = request.data.get('user_id') or request.session.session_key or 'anonymous'
        
        favorite, created = UserFavorite.objects.get_or_create(
            game=game,
            user_id=user_id
        )
        
        if created:
            return Response(
                {'status': 'game added to favorites'},
                status=status.HTTP_201_CREATED
            )
        return Response(
            {'status': 'game already in favorites'},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def unfavorite(self, request, pk=None):
        """
        Remove game from favorites
        POST /api/games/:id/unfavorite/
        """
        game = self.get_object()
        user_id = request.data.get('user_id') or request.session.session_key or 'anonymous'
        
        deleted_count, _ = UserFavorite.objects.filter(
            game=game,
            user_id=user_id
        ).delete()
        
        if deleted_count:
            return Response(
                {'status': 'game removed from favorites'},
                status=status.HTTP_200_OK
            )
        return Response(
            {'status': 'game not in favorites'},
            status=status.HTTP_404_NOT_FOUND
        )

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """
        Get featured games
        GET /api/games/featured/
        """
        featured_games = self.get_queryset().filter(is_featured=True)[:8]
        serializer = self.get_serializer(featured_games, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def increment_play_count(self, request, pk=None):
        """
        Increment play count for a game
        POST /api/games/:id/increment_play_count/
        """
        game = self.get_object()
        game.play_count += 1
        game.save(update_fields=['play_count'])
        return Response({'play_count': game.play_count})
    @action(detail=True, methods=['post'])
    def rate(self, request, pk=None):
        """
        Submit a user rating for a game
        POST /api/games/:id/rate/
        Body: { "rating": 1-5 }
        Each IP address can only vote once per game
        """
        from .models import UserRating
        
        game = self.get_object()
        
        # Get user's IP address
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            user_ip = x_forwarded_for.split(',')[0]
        else:
            user_ip = request.META.get('REMOTE_ADDR', 'anonymous')
        
        rating_value = request.data.get('rating')
        
        if not rating_value:
            return Response(
                {'error': 'rating field is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            rating_value = int(rating_value)
            if rating_value < 1 or rating_value > 5:
                raise ValueError
        except (ValueError, TypeError):
            return Response(
                {'error': 'rating must be an integer between 1 and 5'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        rating, created = UserRating.objects.update_or_create(
            game=game,
            user_id=user_ip,
            defaults={'rating': rating_value}
        )
        
        return Response({
            'status': 'rating submitted',
            'average_rating': game.get_average_rating(),
            'message': 'Each IP can only vote once' if not created else 'Rating submitted successfully'
        })


class FrontendView(View):
    """Serve the React frontend"""
    
    def get(self, request, *args, **kwargs):
        """Serve the Vite-built index.html"""
        import os
        from pathlib import Path
        
        # Get the dist index.html path
        base_dir = Path(settings.BASE_DIR)
        dist_path = base_dir / 'staticfiles' / 'dist' / 'index.html'
        
        # Try to serve the Vite-built index.html
        if dist_path.exists():
            with open(dist_path, 'r', encoding='utf-8') as f:
                content = f.read()
            return HttpResponse(content, content_type='text/html')
        
        # Fallback to basic template
        html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Goated IO Games</title>
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/static/dist/index.js"></script>
</body>
</html>"""
        return HttpResponse(html, content_type='text/html')
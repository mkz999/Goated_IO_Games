from rest_framework import serializers
from .models import Game, Category, UserFavorite, UserRating


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model"""
    game_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'icon', 'slug', 'game_count']

    def get_game_count(self, obj):
        return obj.games.filter(is_active=True).count()


class GameListSerializer(serializers.ModelSerializer):
    """Serializer for Game list view (minimal data)"""
    category = serializers.SerializerMethodField()
    tags_list = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()

    class Meta:
        model = Game
        fields = [
            'id',
            'title',
            'short_description',
            'thumbnail',
            'game_url',
            'category',
            'rating',
            'play_count',
            'tags_list',
            'is_featured',
            'difficulty'
        ]

    def get_category(self, obj):
        return [cat.name for cat in obj.categories.all()]

    def get_rating(self, obj):
        avg_rating = obj.get_average_rating()
        return avg_rating if avg_rating else 'NA'

    def get_tags_list(self, obj):
        return obj.get_tags_list()


class GameDetailSerializer(serializers.ModelSerializer):
    """Serializer for Game detail view (full data)"""
    category = serializers.SerializerMethodField()
    tags_list = serializers.SerializerMethodField()
    is_favorited = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()

    class Meta:
        model = Game
        fields = [
            'id',
            'title',
            'description',
            'short_description',
            'thumbnail',
            'game_url',
            'category',
            'rating',
            'play_count',
            'difficulty',
            'tags_list',
            'is_featured',
            'created_at',
            'updated_at',
            'is_favorited'
        ]

    def get_category(self, obj):
        return CategorySerializer(obj.categories.all(), many=True).data

    def get_rating(self, obj):
        avg_rating = obj.get_average_rating()
        return avg_rating if avg_rating else 'NA'

    def get_tags_list(self, obj):
        return obj.get_tags_list()

    def get_is_favorited(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user_id'):
            return UserFavorite.objects.filter(
                game=obj,
                user_id=request.user_id
            ).exists()
        return False

class UserRatingSerializer(serializers.ModelSerializer):
    """Serializer for User Ratings"""
    
    class Meta:
        model = UserRating
        fields = ['id', 'game', 'rating', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
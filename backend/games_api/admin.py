from django.contrib import admin
from .models import Game, Category, UserFavorite, UserRating


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'created_at']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']


@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ['title', 'play_count', 'is_featured', 'is_active']
    list_filter = ['categories', 'difficulty', 'is_featured', 'is_active', 'created_at']
    search_fields = ['title', 'description', 'tags']
    readonly_fields = ['created_at', 'updated_at', 'play_count']
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'short_description', 'description', 'categories')
        }),
        ('Media', {
            'fields': ('thumbnail', 'game_url')
        }),
        ('Metadata', {
            'fields': ('difficulty', 'play_count')
        }),
        ('Status', {
            'fields': ('is_featured', 'is_active', 'created_at', 'updated_at')
        }),
    )


@admin.register(UserFavorite)
class UserFavoriteAdmin(admin.ModelAdmin):
    list_display = ['game', 'user_id', 'created_at']
    list_filter = ['created_at', 'game__categories']
    search_fields = ['game__title', 'user_id']
    readonly_fields = ['created_at']

@admin.register(UserRating)
class UserRatingAdmin(admin.ModelAdmin):
    list_display = ['game', 'user_id', 'rating', 'created_at']
    list_filter = ['rating', 'created_at', 'game__categories']
    search_fields = ['game__title', 'user_id']
    readonly_fields = ['created_at', 'updated_at']
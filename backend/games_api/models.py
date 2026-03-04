from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db.models import Avg

class Category(models.Model):
    """Game category model"""
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, default='gamepad')  # FontAwesome icon name
    slug = models.SlugField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name


class Game(models.Model):
    """Game model"""
    DIFFICULTY_CHOICES = [
        ('impossible', 'Impossible'),
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
        ('extreme', 'Extreme'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    short_description = models.CharField(max_length=250, blank=True)
    thumbnail = models.ImageField(upload_to='game_thumbnails/')
    game_url = models.URLField()  # External game URL or internal game page
    categories = models.ManyToManyField(Category, related_name='games')
    tags = models.CharField(max_length=500, blank=True, help_text="Comma-separated tags")
    
    # Ratings and popularity
    play_count = models.IntegerField(default=0)
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='easy')
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_featured = models.BooleanField(default=False, verbose_name='is new')
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['is_featured', '-play_count']),
        ]

    def __str__(self):
        return self.title

    def get_tags_list(self):
        """Return tags as a list"""
        if self.tags:
            return [tag.strip() for tag in self.tags.split(',')]
        return []

    def get_average_rating(self):
        """Calculate average rating from all user ratings"""
        avg = self.ratings.aggregate(Avg('rating'))['rating__avg']
        return round(avg, 1) if avg else None


class UserFavorite(models.Model):
    """Track user favorite games (can be enhanced with actual user auth later)"""
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='favorites')
    user_id = models.CharField(max_length=100)  # Can be a session ID or anonymous user ID
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('game', 'user_id')
        verbose_name_plural = 'User Favorites'

    def __str__(self):
        return f"{self.user_id} - {self.game.title}"


class UserRating(models.Model):
    """Track user ratings for games"""
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='ratings')
    user_id = models.CharField(max_length=100)  # Can be a session ID or anonymous user ID
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Rating from 1 to 5 stars"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('game', 'user_id')
        verbose_name_plural = 'User Ratings'

    def __str__(self):
        return f"{self.user_id} - {self.game.title}: {self.rating}★"

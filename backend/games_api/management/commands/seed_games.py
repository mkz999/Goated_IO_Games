"""
Django management command to seed sample game data
Usage: python manage.py seed_games
"""
from django.core.management.base import BaseCommand
from games_api.models import Category, Game, UserRating


class Command(BaseCommand):
    help = 'Seed the database with sample game data'

    def handle(self, *args, **options):
        # Check if games already exist - prevent overwriting user's custom data
        existing_games_count = Game.objects.count()
        
        if existing_games_count > 0:
            self.stdout.write(
                self.style.WARNING(
                    f'\n⚠️  Database already has {existing_games_count} games.'
                )
            )
            self.stdout.write(
                self.style.WARNING(
                    'Seed command skipped to preserve your custom games.\n'
                )
            )
            return
        
        self.stdout.write(self.style.HTTP_INFO('Starting to seed games...'))

        # Create categories
        categories_data = [
            {
                'name': 'Action',
                'slug': 'action',
                'icon': 'Zap',
                'description': 'Fast-paced games requiring quick reflexes'
            },
            {
                'name': 'Puzzle',
                'slug': 'puzzle',
                'icon': 'Grid',
                'description': 'Brain-teasing games requiring strategy and logic'
            },
            {
                'name': 'Strategy',
                'slug': 'strategy',
                'icon': 'Target',
                'description': 'Games focusing on planning and tactical gameplay'
            },
            {
                'name': 'Multiplayer',
                'slug': 'multiplayer',
                'icon': 'Users',
                'description': 'Games where you can play with or against others'
            },
            {
                'name': 'Casual',
                'slug': 'casual',
                'icon': 'Smile',
                'description': 'Relaxing games for everyone'
            },
            {
                'name': 'Adventure',
                'slug': 'adventure',
                'icon': 'Navigation',
                'description': 'Story-driven exploration games'
            },
        ]

        categories = {}
        for cat_data in categories_data:
            cat, created = Category.objects.get_or_create(
                slug=cat_data['slug'],
                defaults={
                    'name': cat_data['name'],
                    'icon': cat_data['icon'],
                    'description': cat_data['description']
                }
            )
            categories[cat_data['slug']] = cat
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'✓ Created category: {cat.name}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'→ Category already exists: {cat.name}')
                )

        # Create sample games
        games_data = [
            {
                'title': '2048',
                'description': 'Combine numbered tiles to reach 2048.',
                'short_description': 'Combine tiles to reach 2048',
                'thumbnail': 'https://play2048.co/favicon.png',
                'game_url': 'https://play2048.co/',
                'category': ['puzzle', 'casual'],
                'tags': 'numbers, puzzle, brain',
                'rating': 4.5,
                'play_count': 0,
                'difficulty': 'medium',
                'is_featured': True,
            },
            {
                'title': 'Agar.io',
                'description': 'Grow your blob by eating others online.',
                'short_description': 'Multiplayer blob game',
                'thumbnail': 'https://agar.io/favicon.png',
                'game_url': 'https://agar.io',
                'category': ['multiplayer', 'action'],
                'tags': 'multiplayer, online, action',
                'rating': 4.3,
                'play_count': 0,
                'difficulty': 'hard',
                'is_featured': True,
            },
            {
                'title': 'Slither.io',
                'description': 'Eat and grow in this multiplayer snake battle.',
                'short_description': 'Multiplayer snake',
                'thumbnail': 'https://slither.io/favicon.png',
                'game_url': 'https://slither.io',
                'category': ['multiplayer', 'action'],
                'tags': 'multiplayer, online, snake',
                'rating': 4.4,
                'play_count': 0,
                'difficulty': 'medium',
                'is_featured': False,
            },
            {
                'title': 'Wordle',
                'description': 'Guess the word in 6 tries.',
                'short_description': 'Word puzzle game',
                'thumbnail': 'https://www.nytimes.com/games-assets/v2/assets/wordle-logo.png',
                'game_url': 'https://www.nytimes.com/games/wordle/',
                'category': ['puzzle', 'casual'],
                'tags': 'word, puzzle, daily',
                'rating': 4.7,
                'play_count': 0,
                'difficulty': 'medium',
                'is_featured': False,
            },
            {
                'title': 'Chess.com',
                'description': 'Play chess online against players worldwide.',
                'short_description': 'Online chess',
                'thumbnail': 'https://www.chess.com/favicon.ico',
                'game_url': 'https://www.chess.com/play/online',
                'category': ['strategy', 'multiplayer'],
                'tags': 'strategy, chess, online',
                'rating': 4.6,
                'play_count': 0,
                'difficulty': 'hard',
                'is_featured': False,
            },
            {
                'title': 'Tetris Effect',
                'description': 'Classic Tetris game online.',
                'short_description': 'Stack falling blocks',
                'thumbnail': 'https://tetris.com/favicon.ico',
                'game_url': 'https://tetris.com',
                'category': ['action', 'puzzle', 'casual'],
                'tags': 'tetris, arcade, puzzle',
                'rating': 4.4,
                'play_count': 0,
                'difficulty': 'medium',
                'is_featured': True,
            },
            {
                'title': 'Diep.io',
                'description': 'Tank battle game online.',
                'short_description': 'Tank shooter game',
                'thumbnail': 'https://diep.io/favicon.ico',
                'game_url': 'https://diep.io/',
                'category': ['action', 'multiplayer'],
                'tags': 'action, online, tanks',
                'rating': 4.2,
                'play_count': 0,
                'difficulty': 'medium',
                'is_featured': False,
            },
            {
                'title': 'Geoguessr',
                'description': 'Guess locations from street view images.',
                'short_description': 'Geography guessing game',
                'thumbnail': 'https://www.geoguessr.com/favicon.ico',
                'game_url': 'https://www.geoguessr.com/',
                'category': ['puzzle', 'adventure'],
                'tags': 'geography, puzzle, brain',
                'rating': 4.5,
                'play_count': 0,
                'difficulty': 'hard',
                'is_featured': False,
            },
            {
                'title': 'Among Us',
                'description': 'Multiplayer social deduction game.',
                'short_description': 'Multiplayer social game',
                'thumbnail': 'https://www.among-us.com/favicon.ico',
                'game_url': 'https://www.among-us.com/',
                'category': ['multiplayer', 'strategy'],
                'tags': 'multiplayer, social, strategy',
                'rating': 4.3,
                'play_count': 0,
                'difficulty': 'medium',
                'is_featured': True,
            },
            {
                'title': 'Minesweeper Online',
                'description': 'Classic mine sweeping puzzle game.',
                'short_description': 'Click safe squares',
                'thumbnail': 'https://minesweeper.online/favicon.ico',
                'game_url': 'https://minesweeper.online',
                'category': ['puzzle', 'casual'],
                'tags': 'puzzle, classic, logic',
                'rating': 4.2,
                'play_count': 0,
                'difficulty': 'medium',
                'is_featured': False,
            },
        ]

        for game_data in games_data:
            category_slugs = game_data.pop('category')  # Can be a string or list
            initial_rating = game_data.pop('rating', None)  # Remove rating field
            
            if isinstance(category_slugs, str):
                category_slugs = [category_slugs]
            
            # Get category objects
            game_categories = []
            for slug in category_slugs:
                cat = categories.get(slug)
                if cat:
                    game_categories.append(cat)
            
            if not game_categories:
                self.stdout.write(
                    self.style.WARNING(f'→ Skipping game "{game_data["title"]}" - no valid categories found')
                )
                continue

            # Create game
            game, created = Game.objects.get_or_create(
                title=game_data['title'],
                defaults=game_data
            )
            
            # Set the ManyToMany relationships
            game.categories.set(game_categories)
            
            # Add initial rating if provided
            if initial_rating:
                # Create initial user ratings to seed the average
                UserRating.objects.get_or_create(
                    game=game,
                    user_id='seed_initial',
                    defaults={'rating': int(initial_rating)}
                )
            
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'✓ Created game: {game.title}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'→ Game already exists: {game.title}')
                )

        self.stdout.write(
            self.style.SUCCESS('\n✓ Successfully seeded the database!')
        )
        self.stdout.write(
            self.style.HTTP_INFO(
                'Visit http://localhost:8000/admin to manage games'
            )
        )

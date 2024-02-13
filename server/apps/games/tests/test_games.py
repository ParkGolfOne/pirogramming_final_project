from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.locations.models import GolfLocation
from apps.games.models import Game, Round, Player, Score
from django.urls import reverse

User = get_user_model()

class GameModelTests(TestCase):

    def setUp(self):
        self.user = User.objects.create(username='testuser', password='12345')
        self.golf_location = GolfLocation.objects.create(name='Test Golf Location')
        self.game = Game.objects.create(
            created_by=self.user,
            game_name='Test Game',
            ground=self.golf_location,
        )
        self.round = Round.objects.create(
            game=self.game,
            round_number=1,
        )
        self.score = Score.objects.create()
        self.player = Player.objects.create(
            round=self.round,
            name='Test Player',
            score=self.score,
        )

    def test_game_creation(self):
        self.assertEqual(self.game.create_by, self.user)
        self.assertEqual(self.game.game_name, 'Test Game')
        self.assertEqual(self.game.ground, self.golf_location)

    def test_round_creation(self):
        self.assertEqual(self.round.game, self.game)
        self.assertEqual(self.round.round_number, 1)

    def test_player_creation(self):
        self.assertEqual(self.player.round, self.round)
        self.assertEqual(self.player.name, 'Test Player')
        self.assertEqual(self.player.score, self.score)


class GameViewSetTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.client.login(username='testuser', password='12345')
        self.golf_location = GolfLocation.objects.create(name='Test Golf Location')

    def test_game_set_get(self):
        response = self.client.get(reverse('games:game_set'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'games/game_create.html')

    def test_game_set_post(self):
        response = self.client.post(reverse('games:game_set'), data={
            'game_name': 'New Game',
            'round_count': 1,
            'player_count': 2,
            'location': self.golf_location.id,
        })
        self.assertEqual(response.status_code, 302)  # Expecting a redirect to game_update
        self.assertTrue(Game.objects.exists())  # Ensure a game was created

    def test_game_update_get(self):
        game = Game.objects.create(
            create_by=self.user,
            game_name='Test Game',
            ground=self.golf_location,
        )
        url = reverse('games:game_update', args=[game.id, 2])  # Assuming player_count=2 is passed
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'games/game_update.html')
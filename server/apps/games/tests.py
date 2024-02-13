from django.test import TestCase

class SimpleTest(TestCase):
    def test_basic(self):
        """간단한 테스트 케이스: 항상 참."""
        self.assertTrue(True)

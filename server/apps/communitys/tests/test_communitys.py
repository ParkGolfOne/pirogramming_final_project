# from django.test import TestCase
# from django.contrib.auth.models import User
# from django.contrib.auth import get_user_model

# from ..models import Board, Post, Comment

# class CommunityModelsTestCase(TestCase):
#     def setUp(self):
#         # 테스트 데이터 생성
#         self.user = User.objects.create_user(username='testuser', password='testpass')
#         self.board = Board.objects.create(name='Test Board', admin=self.user)
#         self.post = Post.objects.create(board=self.board, title='Test Post', content='Test content', writer=self.user)
#         self.comment = Comment.objects.create(post=self.post, content='Test comment', commenter=self.user)

#     def test_board_str(self):
#         self.assertEqual(str(self.board), 'Test Board')

#     def test_post_str(self):
#         self.assertEqual(str(self.post), 'Test Post')

#     def test_comment_str(self):
#         self.assertEqual(str(self.comment), 'Test comment')

#     def test_board_admin(self):
#         self.assertEqual(self.board.admin, self.user)

#     def test_post_writer(self):
#         self.assertEqual(self.post.writer, self.user)

#     def test_comment_commenter(self):
#         self.assertEqual(self.comment.commenter, self.user)

#     def test_comment_parent_comment(self):
#         self.assertIsNone(self.comment.parent_comment)

#     def test_comment_child_comments_num(self):
#         self.assertEqual(self.comment.child_comments_num, 0)

#     def test_comment_like_num(self):
#         self.assertEqual(self.comment.like_num, 0)
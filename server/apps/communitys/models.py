from django.db import models
from apps.users.models import *
from apps.locations.models import *
from django.utils import timezone

# 게시판 모델
class Board (models.Model):
    name = models.CharField('게시판이름', max_length=255)
    thumbnail = models.ImageField('게시판대표이미지',blank=True, upload_to='communitys/boards/%Y/%m/%d')
    admin = models.ForeignKey(User, on_delete=models.CASCADE,  verbose_name='작성자')

    def __str__(self):
        return self.name
    
# 게시글 모델
class Post (models.Model):
    board = models.ForeignKey(Board, on_delete=models.CASCADE, verbose_name='소속 게시판')
    title = models.CharField('제목', max_length=255)
    content = models.TextField('내용')
    writer = models.ForeignKey(User, on_delete=models.CASCADE,  verbose_name='작성자')
    photo = models.ImageField('이미지', blank=True, upload_to='communitys/posts/%Y/%m/%d')
    like_num  = models.IntegerField(default = 0)  # 좋아요 숫자
    scrap_num = models.IntegerField(default = 0) # 스크랩 숫자
    created_date = models.DateTimeField('작성일', auto_created=True, auto_now_add=True)
    updated_date = models.DateTimeField('수정일', auto_created=True, auto_now=True)
    # tags = models.ManyToManyField(Tag)                  # 태그 추가시 주석 해제


    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        # like_num, scrap_num이 변경되지 않았을 때만 갱신
        if self.like_num == self._original_like_num or self.scrap_num == self._original_scrap_num:
            self.updated_date = timezone.now()
        
        super().save(*args, **kwargs)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._original_like_num = self.like_num
        self._original_scrap_num = self.scrap_num


# 댓글 모델  
class Comment (models.Model):
   post = models.ForeignKey(Post, on_delete=models.CASCADE, verbose_name='소속 게시글')
   content = models.CharField('내용', max_length=255)
   parent_comment = models.ForeignKey('self', null=True, default = None, on_delete=models.CASCADE)
   commenter = models.ForeignKey(User, on_delete=models.CASCADE,  verbose_name='댓글 작성자')
   child_comments_num = models.IntegerField(default = 0)  # 대댓글 개수


# 댓글 좋아요 모델
class CommentLike (models.Model):
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, verbose_name='소속 댓글')
    user = models.ForeignKey(User, on_delete=models.CASCADE,  verbose_name='유저')


# 좋아요 모델
class Like (models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, verbose_name='소속 게시글')
    user = models.ForeignKey(User, on_delete=models.CASCADE,  verbose_name='유저')

# 스크랩 모델
class Scrap (models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, verbose_name='소속 게시글')
    user = models.ForeignKey(User, on_delete=models.CASCADE,  verbose_name='유저')


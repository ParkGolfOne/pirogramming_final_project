# Generated by Django 4.2.9 on 2024-02-01 16:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Board',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, verbose_name='게시판이름')),
                ('thumbnail', models.ImageField(blank=True, upload_to='communitys/boards/%Y/%m/%d', verbose_name='게시판대표이미지')),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.CharField(max_length=255, verbose_name='내용')),
                ('child_comments', models.ManyToManyField(blank=True, related_name='reply_set', to='communitys.comment')),
                ('parent_comment', models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='communitys.comment')),
            ],
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('updated_date', models.DateTimeField(auto_created=True, auto_now=True, verbose_name='수정일')),
                ('created_date', models.DateTimeField(auto_created=True, auto_now_add=True, verbose_name='작성일')),
                ('title', models.CharField(max_length=255, verbose_name='제목')),
                ('content', models.TextField(verbose_name='내용')),
                ('photo', models.ImageField(blank=True, upload_to='communitys/posts/%Y/%m/%d', verbose_name='이미지')),
                ('like_num', models.IntegerField(default=0)),
                ('scrap_num', models.IntegerField(default=0)),
                ('board', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='communitys.board', verbose_name='소속 게시판')),
            ],
        ),
        migrations.CreateModel(
            name='Scrap',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='communitys.post', verbose_name='소속 게시글')),
            ],
        ),
        migrations.CreateModel(
            name='Like',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='communitys.post', verbose_name='소속 게시글')),
            ],
        ),
        migrations.CreateModel(
            name='CommentLike',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('comment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='communitys.comment', verbose_name='소속 댓글')),
            ],
        ),
        migrations.AddField(
            model_name='comment',
            name='post',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='communitys.post', verbose_name='소속 게시글'),
        ),
    ]
from django.shortcuts import render, redirect, get_object_or_404
from .models import *
from apps.users.models import *
from .forms import *
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction



###########################################################
#                   게시판 관련 함수                       #
###########################################################


# 함수 이름 : board_list
# 전달인자 : request
# 기능 : --
def board_list(request):
    boards = Board.objects.all()

    print(boards)
     # HTML 에 전달할 정보
    context = {
        'boards' : boards,
    }
    return render(request, "communitys/board/board_list.html", context)


# 함수 이름 : board_create
# 전달인자 : request
# 기능 : --
def board_create(request):
    #### 권한 문제 추가 필요 ####

    # 생성 페이지 렌더링
    if request.method == "GET":
        form = BoardForm
        
        # HTML에 전달할 정보
        context = {
            'form' : form
        }
        return render (request, "communitys/board/board_create.html", context)
    
    # 페이지 생성 요청
    if request.method == "POST":
        form = BoardForm(request.POST, request.FILES)
        if form.is_valid:
            board_instance = form.save(commit=False)
            board_instance.admin = request.user
            board_instance.save()
        return redirect("communitys:board_list")



# 함수 이름 : board_delete
# 전달인자 : request, bid
# 기능 : --
def board_delete(request, bid):
    #### 권한 문제 추가 필요 ####

    # 삭제 요청 전송
    if request.method == 'POST':
        Board.objects.get(id = bid).delete()
        return redirect("communitys:board_list")



# 함수 이름 : board_update
# 전달인자 : request, bid
# 기능 : --
def board_update(request, bid):
    board = Board.objects.get(id = bid)

    if request.method == "POST":
        form = BoardForm(request.POST, request.FILES, instance = board)
        if form.is_valid():
            form.save()
        return redirect("communitys:board_list")
    
    if request.method == "GET":
        form = BoardForm(instance=board) 

        # HTML 에 전달할 정보
        context = {
            'form' : form,
            "bid" : bid,
            "board" : board,
        }

        return render(request, "communitys/board/board_update.html",context)


###########################################################
#                   게시글 관련 함수                       #
###########################################################


# 함수 이름 : post_list
# 전달인자 : request, bid
# 기능 : --
def post_list(request, bid):
    posts = Post.objects.filter(board = bid)
    board = Board.objects.get(id = bid)
    now_user  = request.user

    # HTML 에 전달할 정보
    context = {
        'posts' : posts,
        'bid' : bid,
        'board' : board,
        'now_user' : now_user,
    }
    return render(request, "communitys/posts/post_list.html", context)


# 함수 이름 : post_create
# 전달인자 : request
# 기능 : --
def post_create(request, bid):

    # 페이지 접속시
    if request.method == "GET":
        # HTML 에 전달할 정보
        context = {'form' : PostForm, 'bid': bid}
        return render(request, "communitys/posts/post_create.html", context)
    
    # 페이지 등록 요청시 
    if request.method == "POST":
        form = PostForm(request.POST, request.FILES)
        if form.is_valid():
            post_instance = form.save(commit=False)
            board = Board.objects.get(id = bid)
            post_instance.board = board
            post_instance.writer = request.user
            post_instance.save()
        return redirect("communitys:post_list", bid)


# 함수 이름 : post_delete
# 전달인자 : request, pk, bid
# 기능 : --
def post_delete(request, pk, bid):
    if request.method == "POST":
        Post.objects.get(id=pk).delete()
        return redirect("communitys:post_list",bid)


# 함수 이름 : post_update
# 전달인자 : request, pk, bid
# 기능 : --
def post_update(request, pk, bid):
    post = Post.objects.get(id=pk)
    
    if request.method == "POST":
        form = PostForm(request.POST, request.FILES, instance = post)
        if form.is_valid():
            form.save()
        return redirect("communitys:post_detail", bid, pk)
    
    if request.method == "GET":
        form = PostForm(instance=post)
        # HTML 에 전달할 정보
        context = {
            'form' : form,
            "bid" : bid,
            "pk" : pk,
        }

        return render(request, "communitys/posts/post_update.html",context)

# 함수 이름 : post_detail
# 전달인자 : request, pk
# 기능 : --
def post_detail(request, pk, bid):

    # 게시글 관련 정보, 현재 접속 유저 가져오기
    post = Post.objects.get(id=pk)
    post.view_num += 1
    post.save()

    now_user = request.user
    try:
        like = Like.objects.get(user = now_user, post = post)
    except Like.DoesNotExist:
        liked = False
    except:
        liked = False
    else:
        liked = True

    try:
        scrap = Scrap.objects.get(user = now_user, post = post)
    except Scrap.DoesNotExist:
        scraped = False
    except:
        scraped = False
    else:
        scraped = True

    try:
        comments = Comment.objects.filter(post = post, parent_comment = None)
    except Comment.DoesNotExist:
        comments = []


    # 추후에 작성자가 쓴 다른 글 참조시 사용
    # user = post.user
    # all_post = user.post_set.all()

    # HTML 에 전달할 정보
    context = {
        "post" : post,
        "bid" : bid,
        "comments" : comments,
        "liked" : liked,
        "scraped" : scraped,
        "now_user" : now_user,
        # "related_posts" : all_post,
    }
    return render(request, "communitys/posts/post_detail.html",context)

# 함수 이름 : search_post
# 전달인자 : request, bid
# 기능 : 해당 쿼리에 해당하는 게시글 반환
def search_post(request, bid):
    type = request.GET.get('searchType', None)
    input = request.GET.get('input', None)
    if type == "title":
        search_posts = Post.objects.filter(
            board_id=bid, title__icontains=input)
    elif type == "writer":
        search_posts = Post.objects.filter(
            board_id=bid, writer__nickname__icontains=input)
    elif type == "all":
        search_posts = Post.objects.filter(board_id=bid)
    else:
        return JsonResponse([], safe=False)
    # 직접 JSON 형태로 데이터 구성
    search_posts_json = []
    for post in search_posts:
        post_data = {
            'pk': post.id,
            'board': post.board.id,
            'title': post.title,
            'writer': post.writer.nickname,  # writer의 nickname 추가
        }
        search_posts_json.append(post_data)
    return JsonResponse(search_posts_json, safe=False)

# 함수 이름 : sort_post
# 전달인자 : request, bid
# 기능 : 해당 요청에 맞는 정렬된 게시글 반환
def sort_post(request, bid):
    type = request.GET.get('sortType', None)
    print("type : ", type)
    if type == "like":
        sort_posts = Post.objects.filter(board_id=bid).order_by('-like_num')
    elif type == "scrap":
        sort_posts = Post.objects.filter(board_id=bid).order_by('-scrap_num')
    elif type == "old":
        sort_posts = Post.objects.filter(board_id=bid).order_by('created_date')    
    elif type == "new":
        sort_posts = Post.objects.filter(
            board_id=bid).order_by('-created_date')
    elif type == "popular":
        sort_posts = Post.objects.filter(board_id=bid).order_by('-view_num')
    else:
        return JsonResponse([], safe=False)
    # 직접 JSON 형태로 데이터 구성
    sort_posts_json = []
    print(sort_posts)
    for post in sort_posts:
        post_data = {
            'pk': post.id,
            'board': post.board.id,
            'title': post.title,
            'writer': post.writer.nickname,  # writer의 nickname 추가
            'view_num' : post.view_num
        }
        sort_posts_json.append(post_data)
    print(sort_posts_json)
    return JsonResponse(sort_posts_json, safe=False)


###########################################################
#                     댓글 관련 함수                       #
###########################################################

# 함수 이름 : comment_create
# 전달인자 : request
# 기능 : --
@csrf_exempt
@transaction.atomic
def comment_create(request):
    print(request.body)
    req = json.loads(request.body)
    post_id = req["post_id"]
    content = req["content"]
    commenter = request.user
    post = get_object_or_404(Post, id=post_id)

    newcomment = Comment.objects.create(post = post, commenter = commenter, content = content )      
    
    return JsonResponse({'commenter' : newcomment.commenter.username, 'content' : newcomment.content, 'commentId' : newcomment.id})



# 함수 이름 : reply_create
# 전달인자 : request
# 기능 : --
@csrf_exempt
@transaction.atomic
def reply_create(request):
    req = json.loads(request.body)
    post_id = req["post_id"]
    content = req["content"]
    parent_comment_id = req["parent_comment_id"]
    commenter = request.user
    post = get_object_or_404(Post, id=post_id)

    parent_comment = get_object_or_404(Comment, id=parent_comment_id)
    print(parent_comment)

    newcomment = Comment.objects.create(post = post, commenter = commenter, content = content, parent_comment = parent_comment )
    parent_comment.child_comments_num += 1
    parent_comment.save()

    return JsonResponse({'commenter' : newcomment.commenter.username, 'content' : newcomment.content, 'commentId' : newcomment.id, 'post_id' : post_id})




# 함수 이름 : reply_list
# 전달인자 : request
# 기능 : --
@csrf_exempt
@transaction.atomic
def reply_list(request):
    pass



# 함수 이름 : comment_delete
# 전달인자 : request, pk
# 기능 : --
@csrf_exempt
@transaction.atomic
def comment_delete(request, pk):
    req = json.loads(request.body)
    cid = req["comment_id"]

    try:
        get_object_or_404(Comment, id = cid).delete()
    except 404:
        print("해당 댓글이 더이상 존재하지 않습니다!")
    else:
        return JsonResponse({'comment_id' : cid})


# 함수 이름 : comment_update
# 전달인자 : request, pk
# 기능 : --
@csrf_exempt
@transaction.atomic
def comment_update(request, pk):
    req = json.loads(request.body)
    cid = req["comment_id"]
    content = req["content"]

    try:
        target_comment = get_object_or_404(Comment, id = cid)
    except 404:
        print("존재하지 않는 댓글 update 시도!")
    else:
        target_comment.content = content
        target_comment.save()

    return JsonResponse({'commenter' : target_comment.commenter.username, 'content' : content,'commentId' : cid, 'post_id' : target_comment.post.id})





###########################################################
#                     좋아요 관련 함수                     #
###########################################################

# 함수 이름 : pushPostLike(request)
# 전달인자 : request
# 기능 : 게시글 좋아요
@csrf_exempt
@transaction.atomic
def pushPostLike(request):
    req = json.loads(request.body)
    post_id = req["post_id"]
    post = get_object_or_404(Post, pk=post_id)
    now_user = request.user

    try:
        likePointer = Like.objects.get(post=post, user=now_user)
        likePointer.delete()
        post.like_num -= 1  

        likeTag = 'nonlike'
        post.save()
        return JsonResponse({'post_id' : post_id, 'likeNum' : post.like_num, 'likeTag' : likeTag})
    except Like.DoesNotExist:
        Like.objects.create(post=post, user=now_user)
        post.like_num += 1

        likeTag = 'liked'
        post.save()
        return JsonResponse({'post_id' : post_id, 'likeNum' : post.like_num, 'likeTag' : likeTag})
    

# 함수 이름 : pushCommentLike(request)
# 전달인자 : request
# 기능 : 게시글 좋아요
@csrf_exempt
@transaction.atomic
def pushCommentLike(request):
    pass
    

###########################################################
#                     스크랩 관련 함수                     #
###########################################################
@csrf_exempt
@transaction.atomic
def pushScrap(request):
    req = json.loads(request.body)
    post_id = req["post_id"]
    post = get_object_or_404(Post, pk=post_id)
    now_user = request.user

    try:
        scrapPointer = Scrap.objects.get(post=post, user=now_user)
        scrapPointer.delete()
        post.scrap_num -= 1  

        scrapTag = 'nonscrap'
        post.save()
        return JsonResponse({'post_id' : post_id, 'scrapNum' : post.scrap_num, 'scrapTag' : scrapTag})
    except Scrap.DoesNotExist:
        Scrap.objects.create(post=post, user=now_user)
        post.scrap_num += 1

        scrapTag = 'scraped'
        post.save()
        return JsonResponse({'post_id' : post_id, 'scrapNum' : post.scrap_num, 'scrapTag' : scrapTag})

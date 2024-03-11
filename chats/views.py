from django.contrib.auth import get_user_model
from django.shortcuts import render

from chats.models import ChatModel, ChatNotification

User = get_user_model()


def index(request):
    users = User.objects.exclude(username=request.user.username)
    return render(request, 'index.html', context={'users': users})


def chatPage(request, username):
    user_obj = User.objects.get(username=username)
    current_user = request.user
    users = User.objects.exclude(username=current_user.username)

    if current_user.id > user_obj.id:
        thread_name = f'chat_{current_user.id}-{user_obj.id}'
    else:
        thread_name = f'chat_{user_obj.id}-{current_user.id}'

    message_objs = ChatModel.objects.filter(thread_name=thread_name)

    notifications = ChatNotification.objects.filter(user=current_user, chat__thread_name=thread_name)
    for notification in notifications:
        sender = notification.chat.sender
        if sender == user_obj.username:
            notification.mark_as_seen()

    return render(request, 'main_chat.html', context={'user': user_obj, 'users': users, 'messages': message_objs})

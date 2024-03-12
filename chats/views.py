from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404, render

from chats.models import ChatModel, ChatNotification

User = get_user_model()


def index(request):
    users = User.objects.exclude(username=request.user.username)
    return render(request, 'index.html', context={'users': users})


def chatPage(request, username):
    user_obj = get_object_or_404(User, username=username)
    users = User.objects.exclude(username=request.user.username)

    # Determine the thread name
    if request.user.id > user_obj.id:
        thread_name = f'chat_{request.user.id}-{user_obj.id}'
    else:
        thread_name = f'chat_{user_obj.id}-{request.user.id}'

    # Fetch messages for the thread
    message_objs = ChatModel.objects.filter(thread_name=thread_name)

    unread_messages = ChatNotification.objects.filter(user=request.user, chat__sender=username, is_seen=False)
    print(unread_messages)

    for unread_message in unread_messages:
        unread_message.mark_as_seen()

    return render(request, 'main_chat.html', context={'user': user_obj, 'users': users, 'messages': message_objs})
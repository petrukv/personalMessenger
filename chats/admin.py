from django.contrib import admin

from chats.models import ChatModel, UserProfileModel

admin.site.register(ChatModel)
admin.site.register(UserProfileModel)

from django.contrib.auth.models import User
from django.db import models


class UserProfileModel(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=50, blank=True, null=True)
    online_status = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username


class ChatModel(models.Model):
    sender = models.CharField(max_length=50, default=None)
    message = models.TextField(null=True, blank=True)
    thread_name = models.CharField(max_length=50, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.message
    

class ChatNotification(models.Model):
    chat = models.ForeignKey(ChatModel, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    is_seen = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username
    
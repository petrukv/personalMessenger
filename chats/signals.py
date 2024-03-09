import json

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import ChatNotification, UserProfileModel


@receiver(post_save, sender=ChatNotification)
def send_notification(sender, instance, created, **kwargs):
    if created:
        channel_layer = get_channel_layer()
        obj = ChatNotification.objects.filter(is_seen=False, user=instance.user).count()
        user_id = str(instance.user.id)
        data = {
            'count': obj
        }
        async_to_sync(channel_layer.group_send)(
            user_id, {
                'type': 'send_notification',
                'value': json.dumps(data)
            }
        )

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfileModel.objects.create(user=instance, name=instance.username)

@receiver(post_save, sender=UserProfileModel)
def send_onlineStatus(sender, instance, created, **kwargs):
    if not created:
        channel_layer = get_channel_layer()
        user = instance.user.username
        user_status = instance.online_status

        data = {
            'username': user,
            'status': user_status
        }

        async_to_sync(channel_layer.group_send)(
            'user', {
                'type': 'send_onlineStatus',
                'value': json.dumps(data)
            }
        )

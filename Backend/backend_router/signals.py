from django.db.models.signals import post_save
from django.dispatch import receiver
from backend_router.models import DiseaseDetection
from backend_router.cloudinary import create_link

def upload_to_cloudinary_and_update(instance):
    """
    This function would ideally be run in a background task.
    It uploads the image to Cloudinary and updates the model instance.
    """
    if instance.image and not instance.image_link.startswith('https'):
        instance.image_link = create_link(instance.image.path, instance.image_name)
        instance.save(update_fields=['image_link'])

@receiver(post_save, sender=DiseaseDetection)
def trigger_pipeline(sender, instance, created, **kwargs):
    if created and not instance.is_processed:
        print(f"Signal received for new instance: {instance.id}. Triggering Cloudinary upload.")
        upload_to_cloudinary_and_update(instance) # For a real app, offload this to a background worker.

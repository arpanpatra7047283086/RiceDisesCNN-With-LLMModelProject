from django.db import models
from django.conf import settings

class DiseaseDetection(models.Model):
    predicted_disease = models.CharField(max_length=100)
    confidence = models.FloatField()

    image = models.ImageField(upload_to="disease_images/")
    image_name = models.CharField(max_length=255, blank=True)
    image_link = models.URLField(max_length=500, blank=True)

    image_hash = models.CharField(max_length=64, blank=True, null=True)
    is_processed = models.BooleanField(default=False)

    import_time = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Set the image name and link before the initial save.
        if self.image and not self.image_name:
            self.image_name = self.image.name.split("/")[-1]
        if self.image and not self.image_link:
            base_url = getattr(settings, "PUBLIC_BASE_URL", "")
            self.image_link = f"{base_url}{self.image.url}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.predicted_disease

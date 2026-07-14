from django.contrib import admin
from .models import DiseaseDetection

@admin.register(DiseaseDetection)
class DiseaseDetectionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "predicted_disease",
        "confidence",
        "image_name",
        "short_image_link",
        "import_time",
    )

    readonly_fields = ("image_link", "import_time")

    def short_image_link(self, obj):
        return obj.image_link
    short_image_link.short_description = "Image URL"







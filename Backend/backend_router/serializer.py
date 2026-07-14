# backend_router/serializer.py
from rest_framework import serializers
from .models import DiseaseDetection


class DiseaseDetectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiseaseDetection
        fields = '__all__'
        
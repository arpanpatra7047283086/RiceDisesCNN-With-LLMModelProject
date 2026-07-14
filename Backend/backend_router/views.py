import os
from PIL import Image
from django.http import JsonResponse
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny
from .models import DiseaseDetection
from .MLModel.MLapp import predict_disease
from .rag_utils import get_expert_advice, query_expert

# ...................................................... For start ....................................................
def home(request):
    return JsonResponse({"status": "Backend is running 🚀"})
# ...................................................... For start ....................................................

# .......................................... Disease Detection & RAG ..........................................
@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
@permission_classes([AllowAny])
def detect_view(request):
    if "image" not in request.FILES:
        return JsonResponse({"error": "No image uploaded"}, status=400)

    try:
        image_file = request.FILES["image"]

        # 1. Perform Image Prediction
        img = Image.open(image_file).convert("RGB")
        prediction = predict_disease(img)
        disease_name = prediction["class"]
        confidence = prediction["confidence"]

        # 2. Get Expert Advice from RAG System
        expert_advice = get_expert_advice(disease_name)

        # 3. Save to Database (Optional but recommended)
        try:
            record = DiseaseDetection.objects.create(
                image=image_file,
                predicted_disease=disease_name,
                confidence=float(confidence)
            )
            record_id = record.id
        except Exception as db_err:
            print(f"Database save error: {db_err}")
            record_id = None

        # 4. Return combined result to Frontend
        return JsonResponse({
            "status": "success",
            "id": record_id,
            "disease": disease_name,
            "confidence": round(float(confidence), 4),
            "expert_advice": expert_advice,
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return JsonResponse({"error": str(e)}, status=500)

# .......................................... Chat with RAG ..........................................
@api_view(['POST'])
@permission_classes([AllowAny])
def chat_view(request):
    try:
        data = request.data
        question = data.get("question")
        disease = data.get("disease") # Optional context

        if not question:
            return JsonResponse({"error": "No question provided"}, status=400)

        # Enrich question with disease context if available
        full_query = question
        if disease:
            full_query = f"Regarding {disease}: {question}"

        response = query_expert(full_query)

        return JsonResponse({
            "status": "success",
            "response": response
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return JsonResponse({"error": str(e)}, status=500)

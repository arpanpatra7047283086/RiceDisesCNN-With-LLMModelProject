from django.urls import path
from backend_router import views
from .views import home


urlpatterns = [
    path('detect/', views.detect_view, name="predict_disease_from_image"),
    path('chat/', views.chat_view, name="chat_with_expert"),
    path('home/', home),
]

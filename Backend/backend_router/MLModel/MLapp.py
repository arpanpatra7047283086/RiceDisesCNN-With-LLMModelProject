import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # Suppress TensorFlow INFO messages
from pathlib import Path
import numpy as np
import tensorflow as tf
from huggingface_hub import hf_hub_download
from tensorflow.keras.preprocessing import image
import pickle

model = None
index_to_class = None

# --- Configuration ---
HF_TOKEN = os.getenv("HF_TOKEN")
REPO_ID = "DONCHAN123/RiceDisesCNN"  # Your Hugging Face repository

def predict_disease(img):
    global model, index_to_class

    # Lazy load the model on the first prediction
    if model is None:
        print("Loading model for the first time...")
        try:
            MODEL_PATH = hf_hub_download(
                repo_id=REPO_ID,
                filename="FlowerV1.h5",
                token=HF_TOKEN
            )
            model = tf.keras.models.load_model(MODEL_PATH)
            print("Model loaded successfully.")

            print("Loading class names...")
            CLASS_NAMES_PATH = hf_hub_download(
                repo_id=REPO_ID,
                filename="FlowerV1.pkl",
                token=HF_TOKEN,
            )
            with open(CLASS_NAMES_PATH, 'rb') as f:
                # Load the dictionary mapping {'class_name': index}
                class_indices = pickle.load(f)
                # Invert the dictionary to map {index: 'class_name'}
                index_to_class = {v: k for k, v in class_indices.items()}
            print("Class names loaded successfully.")
        except Exception as e:
            print(f"Error loading model or class names from Hugging Face: {e}")
            raise

    img = img.convert("RGB")
    img = img.resize((128, 128))  # Match your model's expected input size

    img_array = image.img_to_array(img).astype("float32") / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    predictions = model.predict(img_array, verbose=0)
    predicted_index = np.argmax(predictions[0])
    confidence = np.max(predictions[0])

    return {
        "class": index_to_class.get(predicted_index, "Unknown"),
        "confidence": float(confidence),
    }
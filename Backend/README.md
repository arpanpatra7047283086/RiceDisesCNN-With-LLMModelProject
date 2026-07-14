# 🌾 Rice Leaf Disease Detection System

An AI-powered **Rice Leaf Disease Detection Web Application** that helps farmers, researchers, and agricultural professionals identify common rice leaf diseases using image analysis and provides **recommended medicines** for treatment.

This project uses **Django** as the backend for disease prediction and **Next.js with React** as the frontend for a modern, responsive user interface.

---

## 🚀 Live Project Links

- **Backend (Django API):**  
  👉 https://cropdisesbackend-2.onrender.com

- **Frontend (Next.js + React):**  
  👉 https://kbtechagre.vercel.app

---

## 🧠 Project Overview

Rice is one of the most important crops in India and many parts of the world. Leaf diseases can significantly reduce yield and quality if not detected early.

This system allows users to:
- Upload a rice leaf image
- Detect the disease using a machine learning model
- View disease name, confidence level, and treatment recommendations
- Take early action using suggested medicines

---

## 🦠 Supported Rice Leaf Diseases & Treatments

### 1️⃣ Brown Spot Disease
**Cause:** Fungus (*Bipolaris oryzae*)  
**Symptoms:**
- Brown or dark circular spots on leaves
- Yellow halo around spots
- Reduced grain quality

**Recommended Medicines:**
- Mancozeb 75% WP
- Carbendazim
- Propiconazole

---

### 2️⃣ Narrow Brown Leaf Spot
**Cause:** Fungus (*Cercospora oryzae*)  
**Symptoms:**
- Narrow, linear brown lesions
- Appears mainly during high humidity
- Weakens leaf structure

**Recommended Medicines:**
- Carbendazim
- Hexaconazole
- Tricyclazole

---

### 3️⃣ Leaf Blast
**Cause:** Fungus (*Magnaporthe oryzae*)  
**Symptoms:**
- Diamond-shaped lesions
- Gray or white center with brown edges
- Severe yield loss if untreated

**Recommended Medicines:**
- Tricyclazole
- Isoprothiolane
- Azoxystrobin

---

### 4️⃣ Healthy Leaf
**Description:**
- No visible disease symptoms
- Normal green color
- Proper growth

**Action:**
- No medicine required
- Maintain proper irrigation and fertilization

---

## 🏗️ Tech Stack

### 🔹 Backend
- Django
- Django REST Framework
- Machine Learning Model for Image Classification
- Image Upload & Processing API

### 🔹 Frontend
- Next.js
- React
- Fetch API for backend communication
- Responsive UI

---

## 🔄 How It Works

1. User uploads a rice leaf image from the frontend
2. Image is sent to Django backend via API
3. ML model predicts the disease
4. Backend returns:
   - Disease name
   - Confidence score
   - Medicine suggestions
5. Frontend displays the result clearly to the user

---

## 🌱 Future Enhancements

- Add more rice diseases
- Multi-language support (Hindi, Bengali, etc.)
- Farmer advisory system
- Mobile app integration
- Disease severity estimation

---

## 👨‍💻 Developer

**Arpan Patra**  
AI & Web Development Enthusiast  
Focused on AgriTech and Smart Farming Solutions 🌾🤖

---

## ⭐ Support

If you find this project helpful:
- ⭐ Star this repository
- 🍴 Fork it
- 🐞 Report issues or suggest improvements

---

### ⚠️ Disclaimer
This system provides **suggestive information** only. Farmers should consult agricultural experts before applying medicines in real fields.

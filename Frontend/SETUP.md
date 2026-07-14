# Rice Leaf Disease Detection - Complete Setup Guide

This guide will help you set up and deploy the RiceDetect application with your backend ML model server.

## 📋 Prerequisites

Before starting, ensure you have:

- **Node.js** 18.0 or higher ([Download](https://nodejs.org/))
- **pnpm** package manager (`npm install -g pnpm`)
- **Backend ML Model Server** running and ready to receive requests
- **Git** (for version control and deployment)

## 🚀 Quick Start (5 minutes)

### 1. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url> rice-disease-detection
cd rice-disease-detection

# Install dependencies
pnpm install
```

### 2. Configure Backend Connection

```bash
# Copy the environment template
cp .env.example .env.local

# Edit .env.local with your backend URL
# Example: BACKEND_URL=http://localhost:5000
nano .env.local
```

### 3. Start Development Server

```bash
# Start the dev server
pnpm dev

# Open http://localhost:3000 in your browser
```

## 🔧 Environment Configuration

### Local Development (.env.local)

```env
# Your ML model backend server URL
# Local development
BACKEND_URL=http://localhost:5000

# Or for cloud deployment
BACKEND_URL=https://api.yourdomain.com
```

### For Vercel Deployment

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add new variable:
   - **Name**: `BACKEND_URL`
   - **Value**: `https://your-backend-server.com`
4. Click "Save"
5. Redeploy the project

### For Other Hosting Platforms

| Platform | How to Set Env Vars |
|----------|-------------------|
| **Heroku** | Go to Settings → Reveal Config Vars → Add BACKEND_URL |
| **Railway** | Variables tab → Add BACKEND_URL |
| **Render** | Environment tab → Add BACKEND_URL |
| **AWS Amplify** | Build settings → Environment variables → Add BACKEND_URL |
| **Docker** | `-e BACKEND_URL=...` flag or .env file |

## 🎯 Backend Integration Steps

### Step 1: Verify Backend API

Your backend must have this endpoint:

```
POST /api/detect
Content-Type: multipart/form-data
```

Test with curl:

```bash
curl -X POST \
  -F "image=@/path/to/leaf.jpg" \
  http://localhost:5000/api/detect
```

Expected response:

```json
{
  "disease": "Bacterial Leaf Blight",
  "confidence": 0.92
}
```

### Step 2: Update Backend URL in Frontend

Edit `.env.local`:

```env
BACKEND_URL=http://your-backend-server:port
```

Or for cloud:

```env
BACKEND_URL=https://api.yourdomain.com
```

### Step 3: Test the Integration

1. Start the frontend dev server: `pnpm dev`
2. Navigate to http://localhost:3000
3. Upload a rice leaf image
4. If successful, you'll see the disease detection result

### Troubleshooting Connection Issues

**Error: "Failed to analyze image"**

```bash
# Check 1: Backend is running
curl http://localhost:5000/api/detect -F "image=@test.jpg"

# Check 2: BACKEND_URL is correct in .env.local
cat .env.local | grep BACKEND_URL

# Check 3: CORS is enabled on backend (if backend and frontend on different domains)
# Backend should include CORS headers:
# Access-Control-Allow-Origin: *
# Access-Control-Allow-Methods: POST
```

**Error: "Cannot connect to backend"**

1. Verify backend server is running
2. Verify correct URL in `.env.local`
3. Check firewall/network settings
4. Look for SSL/certificate issues if using HTTPS

## 📦 Backend Implementation Examples

### Python/Flask

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
from your_ml_model import predict_disease

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

@app.route('/api/detect', methods=['POST'])
def detect():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        image_file = request.files['image']
        
        # Read image
        img_array = np.frombuffer(image_file.read(), np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
        
        # Preprocess (example)
        img = cv2.resize(img, (224, 224))
        img = img / 255.0
        
        # Predict using your ML model
        disease, confidence = predict_disease(img)
        
        return jsonify({
            'disease': disease,
            'confidence': float(confidence)
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

### Node.js/Express

```javascript
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(multer({ storage: multer.memoryStorage() }).single('image'));

// Import your ML model
const { predictDisease } = require('./ml_model');

app.post('/api/detect', async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Process image buffer
    const result = await predictDisease(req.file.buffer);

    res.json({
      disease: result.disease,
      confidence: result.confidence
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => {
  console.log('Backend running on port 5000');
});
```

### FastAPI (Python)

```python
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
from io import BytesIO
from your_model import predict_disease

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/detect")
async def detect(image: UploadFile = File(...)):
    try:
        # Read image
        image_data = await image.read()
        nparr = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Predict
        disease, confidence = predict_disease(img)
        
        return {
            "disease": disease,
            "confidence": float(confidence)
        }
    except Exception as e:
        return {"error": str(e)}, 500
```

## 🌐 Deployment

### Deploy Frontend to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables**
   - In Vercel dashboard: Settings → Environment Variables
   - Add: `BACKEND_URL=https://your-api.com`
   - Redeploy

4. **Your app is live!**
   - Frontend: `https://your-app.vercel.app`
   - Connected to: `https://your-api.com`

### Deploy Backend to Cloud

#### Heroku (Free alternative)

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create my-rice-detector-api

# Add buildpack (Python example)
heroku buildpacks:add heroku/python

# Deploy
git push heroku main

# View logs
heroku logs --tail

# Your backend is at: https://my-rice-detector-api.herokuapp.com
```

#### Railway.app

1. Sign up at [railway.app](https://railway.app)
2. Create new project → GitHub repo
3. Add environment variables
4. Deploy automatically on push

#### AWS Lambda + API Gateway

```bash
# Package Flask app
pip install -r requirements.txt -t .

# Create deployment package
zip -r deployment.zip .

# Upload to Lambda via AWS Console
# Create API Gateway endpoint pointing to Lambda
```

## ✅ Verification Checklist

- [ ] Node.js 18+ installed
- [ ] `pnpm install` completed successfully
- [ ] `.env.local` file created with `BACKEND_URL`
- [ ] Backend server is running and accessible
- [ ] Frontend starts: `pnpm dev`
- [ ] Can navigate to http://localhost:3000
- [ ] Can upload/capture image
- [ ] Image sends to backend successfully
- [ ] Disease detection result displays
- [ ] Disease details modal opens
- [ ] Chatbot responds to questions

## 📝 Testing Checklist

### Manual Testing

```bash
# 1. Start backend
python backend/app.py  # or npm run server

# 2. Start frontend (new terminal)
pnpm dev

# 3. Open browser
http://localhost:3000

# 4. Test flows:
# - Upload image
# - Capture with camera
# - View disease details
# - Ask chatbot questions
# - Try on mobile (http://localhost:3000 on phone)
```

### Automated Testing (Optional)

```bash
# With Jest/Testing Library
pnpm test

# With Playwright
pnpm test:e2e
```

## 🐛 Common Issues & Solutions

### Issue: "Module not found"

```bash
# Solution: Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Issue: "BACKEND_URL is not defined"

```bash
# Solution: Restart dev server
# Ctrl+C to stop
# pnpm dev to restart
# Changes to .env.local require restart
```

### Issue: Image upload fails

```bash
# Check:
1. Max file size in backend
2. Supported formats (JPEG/PNG)
3. Correct BACKEND_URL
4. Backend is running
```

### Issue: Camera permission denied

```bash
# Solution:
- Use HTTPS in production
- Check browser permissions
- Try different browser
- Check device has camera
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Vercel Deployment Guide](https://vercel.com/docs/frameworks/nextjs)
- [Express.js Guide](https://expressjs.com/)
- [Flask Documentation](https://flask.palletsprojects.com/)

## 💡 Tips for Production

1. **Enable HTTPS** - Required for camera/file access
2. **Set up CORS properly** - Don't use `*` in production
3. **Add rate limiting** - Prevent API abuse
4. **Monitor API usage** - Track inference calls
5. **Cache results** - Store disease detections
6. **Add authentication** - Protect your API
7. **Test thoroughly** - Different devices and networks
8. **Monitor logs** - Set up error tracking

## 🎓 Next Steps

1. **Customize diseases** - Add more rice diseases to database
2. **Improve accuracy** - Fine-tune your ML model
3. **Add user accounts** - Track detection history
4. **Create admin dashboard** - Manage data and reports
5. **Mobile app** - Build native iOS/Android apps

## 📞 Support

For issues or questions:

1. Check troubleshooting section above
2. Review README.md
3. Check Next.js/Express documentation
4. Open GitHub issue

---

**Last Updated**: 2024  
**Version**: 1.0.0  
**Status**: Production Ready ✅

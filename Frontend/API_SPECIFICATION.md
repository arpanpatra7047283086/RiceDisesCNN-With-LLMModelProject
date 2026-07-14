# RiceDetect - API Specification

Complete API specification for the frontend-backend communication in the RiceDetect application.

## 🔗 API Overview

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/detect` | POST | Submit rice leaf image for disease detection |

## 📤 Frontend → Backend

### POST /api/detect

**Location**: `http://{BACKEND_URL}/api/detect`

**Purpose**: Analyze a rice leaf image and return disease detection results.

#### Request

**Content-Type**: `multipart/form-data`

**Parameters**:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `image` | File | Yes | Rice leaf image file (JPEG, PNG, WebP) |

**Size Limits**:
- Max file size: 10 MB (recommended: < 5 MB)
- Resolution: Recommended 224x224px minimum, 1024x1024px maximum
- Format: JPEG (recommended), PNG, WebP

**Example Request** (cURL):

```bash
curl -X POST \
  -F "image=@rice_leaf.jpg" \
  http://localhost:5000/api/detect
```

**Example Request** (JavaScript/Fetch):

```javascript
const formData = new FormData();
formData.append('image', imageFile); // File object from input

const response = await fetch('http://localhost:5000/api/detect', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log(result);
```

**Example Request** (JavaScript/Axios):

```javascript
const formData = new FormData();
formData.append('image', imageFile);

const response = await axios.post(
  'http://localhost:5000/api/detect',
  formData,
  { headers: { 'Content-Type': 'multipart/form-data' } }
);

console.log(response.data);
```

#### Response

**HTTP Status Codes**:

| Status | Meaning | Response |
|--------|---------|----------|
| **200** | Success | Disease detected or healthy |
| **400** | Bad Request | Invalid image or missing file |
| **422** | Unprocessable | Image format unsupported |
| **500** | Server Error | ML model error or timeout |
| **503** | Service Unavailable | Backend temporarily down |

**Success Response** (200 OK):

```json
{
  "disease": "Bacterial Leaf Blight",
  "confidence": 0.92,
  "additional_info": "Optional metadata"
}
```

**Disease Name Examples**:
- `"Bacterial Leaf Blight"`
- `"Brown Spot"`
- `"Leaf Blast"`
- `"Healthy Leaf"`
- `"Septoria Leaf Spot"`
- `"Rice Blast"`

**Confidence Values**:
- Range: `0.0` to `1.0`
- Example: `0.92` means 92% confidence
- Interpretation:
  - 0.90+ = Very High confidence
  - 0.70-0.89 = High confidence
  - 0.50-0.69 = Medium confidence
  - 0.30-0.49 = Low confidence
  - < 0.30 = Very Low confidence

**Error Response** (400 Bad Request):

```json
{
  "error": "No image provided"
}
```

**Error Response** (422 Unprocessable):

```json
{
  "error": "Invalid image format. Supported formats: JPEG, PNG, WebP"
}
```

**Error Response** (500 Server Error):

```json
{
  "error": "Model inference failed: [detailed error message]"
}
```

## 📥 Backend → Frontend (Next.js API Route)

### POST /api/detect

The frontend has a Next.js API route that forwards requests to your backend.

**Location**: `/vercel/share/v0-project/app/api/detect/route.ts`

**How it works**:

1. Frontend sends image to Next.js API: `/api/detect`
2. Next.js route reads `BACKEND_URL` from environment
3. Forwards image to backend: `{BACKEND_URL}/api/detect`
4. Returns backend response to frontend

**Configuration**: 

Set `BACKEND_URL` environment variable:

```env
# .env.local (development)
BACKEND_URL=http://localhost:5000

# Vercel (production)
BACKEND_URL=https://api.yourdomain.com
```

## 🔄 Request/Response Flow

```
┌─────────────┐
│   Browser   │
│  (Frontend) │
└──────┬──────┘
       │ POST /api/detect (with image)
       │ localhost:3000
       ▼
┌─────────────────────────────┐
│   Next.js API Route         │
│   /api/detect/route.ts      │
│   (reads BACKEND_URL env)   │
└──────┬──────────────────────┘
       │ POST /api/detect (with image)
       │ Forward to BACKEND_URL
       ▼
┌──────────────────────┐
│  Your Backend Server │
│  (ML Model)          │
│  /api/detect         │
└──────┬───────────────┘
       │ JSON response
       │ {disease, confidence}
       ▼
┌─────────────────────────────┐
│   Next.js API Route         │
│   Transforms & returns      │
└──────┬──────────────────────┘
       │ JSON response
       │ {disease, confidence}
       ▼
┌──────────────┐
│   Browser    │
│   Displays   │
│   Results    │
└──────────────┘
```

## 📋 Disease Classification Reference

### Supported Diseases (Example)

```
1. Bacterial Leaf Blight (BLB)
   - Pathogen: Xanthomonas oryzae pv. oryzae
   - Symptoms: Water-soaked lesions with yellow halos
   
2. Brown Spot
   - Pathogen: Cochliobolus miyabeanus
   - Symptoms: Brown spots with concentric rings
   
3. Leaf Blast
   - Pathogen: Magnaporthe oryzae
   - Symptoms: Diamond-shaped lesions with gray centers
   
4. Septoria Leaf Spot
   - Pathogen: Septoria oryzae
   - Symptoms: Small brown spots on leaves
   
5. Healthy
   - Status: No disease detected
   - Confidence: Usually > 0.95
```

## 🧪 Testing the API

### Using cURL

**Test with local backend**:

```bash
# Test endpoint availability
curl -X POST http://localhost:5000/api/detect -F "image=@test.jpg" -v

# Full verbose output
curl -X POST http://localhost:5000/api/detect \
  -F "image=@test.jpg" \
  -H "User-Agent: curl" \
  -w "\nHTTP Status: %{http_code}\n"
```

**Test frontend API route**:

```bash
# Through Next.js API route
curl -X POST http://localhost:3000/api/detect \
  -F "image=@test.jpg"
```

### Using Postman

1. Create new POST request
2. URL: `http://localhost:5000/api/detect`
3. Body tab → form-data
4. Key: `image` → Value: Select image file
5. Send

Expected response:
```json
{
  "disease": "Bacterial Leaf Blight",
  "confidence": 0.92
}
```

### Using Python Requests

```python
import requests

url = 'http://localhost:5000/api/detect'
files = {'image': open('rice_leaf.jpg', 'rb')}

response = requests.post(url, files=files)
result = response.json()

print(f"Disease: {result['disease']}")
print(f"Confidence: {result['confidence']}")
```

### Using JavaScript/Fetch

```javascript
const imageFile = document.getElementById('imageInput').files[0];

const formData = new FormData();
formData.append('image', imageFile);

fetch('/api/detect', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => {
  console.log('Disease:', data.disease);
  console.log('Confidence:', data.confidence);
})
.catch(error => console.error('Error:', error));
```

## 🔒 Security Considerations

### CORS (Cross-Origin Resource Sharing)

If backend and frontend are on different domains, enable CORS:

**Python/Flask**:
```python
from flask_cors import CORS
CORS(app, resources={r"/api/*": {"origins": "*"}})
```

**Node.js/Express**:
```javascript
const cors = require('cors');
app.use(cors());
```

**Production**: Specify allowed origin instead of `*`:
```javascript
app.use(cors({
  origin: 'https://your-frontend.vercel.app',
  methods: ['POST'],
  credentials: true
}));
```

### Input Validation

**Backend should validate**:
- File exists and not empty
- File size < 10 MB
- File format is image (JPEG/PNG/WebP)
- Image dimensions reasonable (min 100x100, max 2000x2000)

**Example**:
```python
def validate_image(file):
    # Check file size
    if file.size > 10 * 1024 * 1024:  # 10 MB
        raise ValueError("File too large")
    
    # Check file extension
    allowed = {'jpg', 'jpeg', 'png', 'webp'}
    if file.filename.split('.')[-1].lower() not in allowed:
        raise ValueError("Unsupported format")
    
    # Validate image
    img = Image.open(file)
    if img.size[0] < 100 or img.size[1] < 100:
        raise ValueError("Image too small")
```

### Rate Limiting

Prevent API abuse:

**Express.js**:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // 100 requests per window
});

app.use('/api/', limiter);
```

### Authentication (Optional)

For production, consider API authentication:

```javascript
// Backend middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.post('/api/detect', authenticateToken, (req, res) => {
  // Process request
});
```

## ⚡ Performance Guidelines

### Image Optimization

**Frontend (before sending)**:
```javascript
// Compress image before upload
const canvas = document.createElement('canvas');
canvas.width = 640;
canvas.height = 640;
const ctx = canvas.getContext('2d');
ctx.drawImage(img, 0, 0, 640, 640);

canvas.toBlob(blob => {
  // Send compressed blob
}, 'image/jpeg', 0.8);
```

**Backend (during processing)**:
```python
# Resize before inference
img = cv2.resize(img, (224, 224))

# Normalize
img = img / 255.0

# Inference (should be < 1 second)
prediction = model.predict(np.expand_dims(img, axis=0))
```

### Timeout Settings

**Frontend**: Set reasonable timeout (e.g., 30 seconds)

```javascript
const timeoutId = setTimeout(() => {
  alert('Request timeout - backend server may be down');
}, 30000);

fetch('/api/detect', { body: formData })
  .then(r => { clearTimeout(timeoutId); return r.json(); })
```

**Backend**: Set model inference timeout (e.g., 25 seconds)

```python
from threading import Timer

def timeout_handler():
    raise TimeoutError("Model inference took too long")

timer = Timer(25.0, timeout_handler)
timer.start()

try:
    result = model.predict(img)
finally:
    timer.cancel()
```

## 📊 Response Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Image processed successfully |
| 400 | Bad Request | Invalid request format or missing image |
| 422 | Unprocessable Entity | Image format/size validation failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | ML model error or server crash |
| 502 | Bad Gateway | Routing/proxy issue |
| 503 | Service Unavailable | Backend temporarily down |
| 504 | Gateway Timeout | Request took too long |

## 🔄 Versioning

**Current Version**: `1.0.0`

**Future Enhancement Ideas**:
- v1.1: Batch image processing
- v1.2: Model confidence thresholds
- v1.3: Historical analysis
- v2.0: Advanced ML models

## 📝 Example Integration Test

```python
import requests
import json

def test_api():
    """Test the disease detection API"""
    
    # Prepare test image
    test_image_path = 'test_leaf.jpg'
    
    with open(test_image_path, 'rb') as f:
        files = {'image': f}
        
        # Send request
        response = requests.post(
            'http://localhost:5000/api/detect',
            files=files,
            timeout=30
        )
    
    # Validate response
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    
    data = response.json()
    assert 'disease' in data, "Missing 'disease' in response"
    assert 'confidence' in data, "Missing 'confidence' in response"
    assert 0 <= data['confidence'] <= 1, "Confidence out of range"
    
    print(f"✅ API Test Passed")
    print(f"   Disease: {data['disease']}")
    print(f"   Confidence: {data['confidence']}")

if __name__ == '__main__':
    test_api()
```

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Production Ready ✅

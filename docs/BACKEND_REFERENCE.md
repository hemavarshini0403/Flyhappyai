# Backend Implementation Reference

This document provides reference code structure for implementing the Flask backend.

## 📁 Backend Folder Structure

```
backend/
├── app.py                    # Main Flask application
├── config.py                 # Configuration settings
├── requirements.txt          # Python dependencies
├── .env.example             # Environment variables template
├── models/                   # Trained ML models
│   ├── complaint_model.pkl
│   └── vectorizer.pkl
├── ml/                       # ML training scripts
│   ├── train_model.py
│   ├── preprocess.py
│   └── dataset.csv
├── ocr/                      # OCR processing
│   └── ocr_reader.py
├── database/                 # Database utilities
│   ├── db.py
│   └── seed_data.py
├── utils/                    # Utility functions
│   ├── classifier.py
│   ├── priority.py
│   ├── translator.py
│   └── helpers.py
├── routes/                   # API routes
│   ├── complaints.py
│   ├── admin.py
│   ├── ocr.py
│   └── analytics.py
└── static/                   # Static files
    └── uploads/             # Uploaded files storage
```

---

## 🔧 Core Backend Files

### app.py

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
import os

# Import routes
from routes.complaints import complaints_bp
from routes.admin import admin_bp
from routes.ocr import ocr_bp
from routes.analytics import analytics_bp

app = Flask(__name__)
app.config.from_object(Config)
CORS(app, origins=app.config['ALLOWED_ORIGINS'])

# Register blueprints
app.register_blueprint(complaints_bp, url_prefix='/api/complaints')
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(ocr_bp, url_prefix='/api/ocr')
app.register_blueprint(analytics_bp, url_prefix='/api/analytics')

@app.route('/')
def index():
    return jsonify({
        'message': 'FlyHappy API',
        'version': '1.0',
        'status': 'running'
    })

@app.route('/api/health')
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    # Create upload folder if not exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # Run app
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=app.config['DEBUG']
    )
```

### config.py

```python
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Flask
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    DEBUG = os.getenv('FLASK_ENV') == 'development'
    
    # MongoDB
    MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
    DATABASE_NAME = os.getenv('DATABASE_NAME', 'flyhappy_db')
    
    # File Upload
    UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', 'static/uploads')
    MAX_FILE_SIZE = int(os.getenv('MAX_FILE_SIZE', 10485760))  # 10MB
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'pdf'}
    
    # OCR
    TESSERACT_CMD = os.getenv('TESSERACT_CMD', '/usr/bin/tesseract')
    
    # CORS
    ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', 'http://localhost:5173').split(',')
    
    # Admin
    ADMIN_USERNAME = os.getenv('ADMIN_USERNAME', 'admin')
    ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD', 'admin123')
```

### requirements.txt

```txt
Flask==2.3.2
Flask-CORS==4.0.0
pymongo==4.4.1
python-dotenv==1.0.0
scikit-learn==1.3.0
pandas==2.0.3
numpy==1.24.3
nltk==3.8.1
spacy==3.6.0
pytesseract==0.3.10
Pillow==10.0.0
opencv-python==4.8.0.74
bcrypt==4.0.1
PyJWT==2.8.0
googletrans==4.0.0rc1
```

---

## 🗄️ Database Module

### database/db.py

```python
from pymongo import MongoClient
from config import Config
import os

class Database:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Database, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance
    
    def _initialize(self):
        self.client = MongoClient(Config.MONGODB_URI)
        self.db = self.client[Config.DATABASE_NAME]
        self._create_indexes()
    
    def _create_indexes(self):
        """Create database indexes for better performance"""
        # Complaints collection
        self.db.complaints.create_index('complaintId', unique=True)
        self.db.complaints.create_index('email')
        self.db.complaints.create_index('status')
        self.db.complaints.create_index('airline')
        self.db.complaints.create_index('submittedAt')
    
    def get_collection(self, name):
        return self.db[name]

db = Database()
```

---

## 🤖 ML Classification Module

### utils/classifier.py

```python
import pickle
import re
import string
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import nltk

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')
    nltk.download('stopwords')

class ComplaintClassifier:
    def __init__(self):
        # Load trained model and vectorizer
        with open('models/complaint_model.pkl', 'rb') as f:
            self.model = pickle.load(f)
        
        with open('models/vectorizer.pkl', 'rb') as f:
            self.vectorizer = pickle.load(f)
        
        self.categories = [
            'delay', 'cancellation', 'baggage', 'refund',
            'staff_behaviour', 'seat_issue', 'food_issue',
            'overbooking', 'service_issue', 'other'
        ]
    
    def preprocess_text(self, text):
        """Preprocess complaint text"""
        # Convert to lowercase
        text = text.lower()
        
        # Remove URLs
        text = re.sub(r'http\S+|www\S+|https\S+', '', text)
        
        # Remove special characters and digits
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        
        # Tokenize
        tokens = word_tokenize(text)
        
        # Remove stopwords
        stop_words = set(stopwords.words('english'))
        tokens = [word for word in tokens if word not in stop_words]
        
        # Join back to string
        return ' '.join(tokens)
    
    def classify(self, description):
        """Classify complaint and return category with confidence"""
        # Preprocess
        processed_text = self.preprocess_text(description)
        
        # Vectorize
        features = self.vectorizer.transform([processed_text])
        
        # Predict
        prediction = self.model.predict(features)[0]
        probabilities = self.model.predict_proba(features)[0]
        
        # Get confidence
        confidence = max(probabilities)
        
        return {
            'category': prediction,
            'confidence': float(confidence),
            'all_probabilities': {
                cat: float(prob) 
                for cat, prob in zip(self.categories, probabilities)
            }
        }

classifier = ComplaintClassifier()
```

### ml/train_model.py

```python
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.svm import SVC
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import pickle
import nltk
from preprocess import preprocess_text

# Load dataset
print("Loading dataset...")
df = pd.read_csv('ml/dataset.csv')

print(f"Dataset shape: {df.shape}")
print(f"Categories: {df['category'].unique()}")

# Preprocess
print("Preprocessing text...")
df['processed_text'] = df['description'].apply(preprocess_text)

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    df['processed_text'], 
    df['category'],
    test_size=0.2,
    random_state=42,
    stratify=df['category']
)

print(f"Training samples: {len(X_train)}")
print(f"Testing samples: {len(X_test)}")

# Vectorization
print("Vectorizing text...")
vectorizer = TfidfVectorizer(
    max_features=5000,
    ngram_range=(1, 2),
    min_df=2
)

X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

# Train models
print("\n=== Training Logistic Regression ===")
lr_model = LogisticRegression(max_iter=1000, random_state=42)
lr_model.fit(X_train_vec, y_train)
lr_pred = lr_model.predict(X_test_vec)
lr_accuracy = accuracy_score(y_test, lr_pred)
print(f"Accuracy: {lr_accuracy:.4f}")

print("\n=== Training Naive Bayes ===")
nb_model = MultinomialNB()
nb_model.fit(X_train_vec, y_train)
nb_pred = nb_model.predict(X_test_vec)
nb_accuracy = accuracy_score(y_test, nb_pred)
print(f"Accuracy: {nb_accuracy:.4f}")

# Select best model
best_model = lr_model if lr_accuracy > nb_accuracy else nb_model
best_accuracy = max(lr_accuracy, nb_accuracy)
best_name = "Logistic Regression" if lr_accuracy > nb_accuracy else "Naive Bayes"

print(f"\n=== Best Model: {best_name} ===")
print(f"Accuracy: {best_accuracy:.4f}")

# Detailed metrics
print("\nClassification Report:")
print(classification_report(y_test, lr_pred if best_model == lr_model else nb_pred))

# Save model
print("\nSaving model...")
with open('models/complaint_model.pkl', 'wb') as f:
    pickle.dump(best_model, f)

with open('models/vectorizer.pkl', 'wb') as f:
    pickle.dump(vectorizer, f)

print("Model saved successfully!")
```

---

## 📸 OCR Module

### ocr/ocr_reader.py

```python
import pytesseract
from PIL import Image
import cv2
import numpy as np
import re
from config import Config

# Set Tesseract path
pytesseract.pytesseract.tesseract_cmd = Config.TESSERACT_CMD

class OCRReader:
    def __init__(self):
        self.field_patterns = {
            'pnr': r'PNR[:\s]+([A-Z0-9]{6,10})',
            'flight': r'Flight[:\s]+([A-Z0-9]{2}-?\d{3,4})',
            'passenger': r'(?:Passenger|Name)[:\s]+([A-Z\s]+)',
            'date': r'Date[:\s]+(\d{2}-\w{3}-\d{4})',
            'source': r'(?:From|Departure)[:\s]+([A-Z]{3})',
            'destination': r'(?:To|Arrival)[:\s]+([A-Z]{3})',
        }
    
    def preprocess_image(self, image_path):
        """Preprocess image for better OCR results"""
        # Read image
        img = cv2.imread(image_path)
        
        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Apply thresholding
        _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)
        
        # Denoise
        denoised = cv2.fastNlMeansDenoising(thresh)
        
        return denoised
    
    def extract_text(self, image_path):
        """Extract text from image"""
        try:
            # Preprocess
            processed_img = self.preprocess_image(image_path)
            
            # OCR
            text = pytesseract.image_to_string(processed_img)
            
            return text
        except Exception as e:
            raise Exception(f"OCR failed: {str(e)}")
    
    def extract_fields(self, text):
        """Extract specific fields from OCR text"""
        fields = {}
        
        for field_name, pattern in self.field_patterns.items():
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                fields[field_name] = match.group(1).strip()
        
        return fields
    
    def process_document(self, image_path):
        """Complete OCR processing pipeline"""
        # Extract text
        text = self.extract_text(image_path)
        
        # Extract fields
        fields = self.extract_fields(text)
        
        return {
            'success': True,
            'extracted_text': text,
            'detected_fields': fields
        }

ocr_reader = OCRReader()
```

---

## 🛣️ API Routes

### routes/complaints.py

```python
from flask import Blueprint, request, jsonify
from database.db import db
from utils.classifier import classifier
from utils.priority import predict_priority
import uuid
from datetime import datetime

complaints_bp = Blueprint('complaints', __name__)

@complaints_bp.route('/', methods=['POST'])
def register_complaint():
    """Register new complaint"""
    try:
        data = request.json
        
        # Validate required fields
        required = ['passengerName', 'email', 'description']
        if not all(field in data for field in required):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Classify complaint
        classification = classifier.classify(data['description'])
        
        # Predict priority
        priority = predict_priority(
            data['description'],
            classification['category']
        )
        
        # Create complaint object
        complaint = {
            'complaintId': f"FH{uuid.uuid4().hex[:8].upper()}",
            'passengerName': data['passengerName'],
            'email': data['email'],
            'phone': data.get('phone', ''),
            'pnr': data.get('pnr', ''),
            'flightNumber': data.get('flightNumber', ''),
            'airline': data.get('airline', ''),
            'source': data.get('source', ''),
            'destination': data.get('destination', ''),
            'dateOfTravel': data.get('dateOfTravel', ''),
            'description': data['description'],
            'complaintType': classification['category'],
            'priority': priority['priority'],
            'status': 'submitted',
            'uploadedFiles': data.get('uploadedFiles', []),
            'ocrData': data.get('ocrData', ''),
            'submittedAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow()
        }
        
        # Save to database
        result = db.get_collection('complaints').insert_one(complaint)
        
        return jsonify({
            'success': True,
            'complaintId': complaint['complaintId'],
            'classification': classification,
            'priority': priority
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@complaints_bp.route('/<complaint_id>', methods=['GET'])
def get_complaint(complaint_id):
    """Get complaint by ID"""
    try:
        complaint = db.get_collection('complaints').find_one(
            {'complaintId': complaint_id},
            {'_id': 0}
        )
        
        if not complaint:
            return jsonify({'error': 'Complaint not found'}), 404
        
        # Convert datetime to string
        complaint['submittedAt'] = complaint['submittedAt'].isoformat()
        complaint['updatedAt'] = complaint['updatedAt'].isoformat()
        
        return jsonify(complaint), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

---

## 📊 Priority Prediction

### utils/priority.py

```python
def predict_priority(description, category):
    """Predict complaint priority"""
    text = description.lower()
    score = 0
    factors = []
    
    # Category-based score
    category_scores = {
        'cancellation': 3,
        'overbooking': 3,
        'delay': 2,
        'baggage': 2,
        'refund': 2,
        'staff_behaviour': 1,
        'seat_issue': 1,
        'food_issue': 1,
        'service_issue': 1,
        'other': 1
    }
    score += category_scores.get(category, 1)
    
    # High priority keywords
    urgent_keywords = ['urgent', 'emergency', 'critical', 'immediate', 
                      'medical', 'health', 'stranded', 'lost passport']
    for keyword in urgent_keywords:
        if keyword in text:
            score += 2
            factors.append(f"Urgent keyword: {keyword}")
    
    # Sentiment keywords
    negative_keywords = ['terrible', 'worst', 'horrible', 'unacceptable', 
                        'disgusting', 'furious', 'angry']
    for keyword in negative_keywords:
        if keyword in text:
            score += 0.5
    
    # Determine priority level
    if score >= 4:
        priority = 'high'
    elif score >= 2:
        priority = 'medium'
    else:
        priority = 'low'
    
    return {
        'priority': priority,
        'score': score,
        'factors': factors
    }
```

---

## 🔐 Authentication

### routes/admin.py

```python
from flask import Blueprint, request, jsonify
import bcrypt
import jwt
from datetime import datetime, timedelta
from config import Config

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/login', methods=['POST'])
def login():
    """Admin login"""
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        
        # Simple authentication (in production, check database)
        if username == Config.ADMIN_USERNAME and password == Config.ADMIN_PASSWORD:
            # Generate JWT token
            token = jwt.encode({
                'username': username,
                'exp': datetime.utcnow() + timedelta(hours=24)
            }, Config.SECRET_KEY, algorithm='HS256')
            
            return jsonify({
                'success': True,
                'token': token,
                'username': username
            }), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

---

This reference guide provides the complete backend structure for implementing the FlyHappy system with Flask, MongoDB, and ML integration.

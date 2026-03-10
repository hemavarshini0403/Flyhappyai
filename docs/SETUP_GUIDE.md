# FlyHappy - Complete Setup Guide

## 📋 Prerequisites

Before setting up FlyHappy, ensure you have the following installed:

### Required Software:
- **Node.js** (v18.0 or higher)
- **npm** or **pnpm** (package manager)
- **Python** (v3.8 or higher) - for ML model training
- **MongoDB** (v4.4 or higher) - for production database
- **Git** - for version control

### Optional Software:
- **VS Code** or preferred IDE
- **MongoDB Compass** - GUI for MongoDB
- **Postman** - API testing

---

## 🚀 Quick Start (Frontend Only)

This section covers setting up the React frontend which demonstrates all features using mock data.

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/flyhappy.git
cd flyhappy
```

### Step 2: Install Dependencies

Using npm:
```bash
npm install
```

Using pnpm (recommended):
```bash
pnpm install
```

### Step 3: Run Development Server

```bash
npm run dev
# or
pnpm dev
```

The application will start at: `http://localhost:5173`

### Step 4: Access the Application

Open your browser and navigate to:
- **Home Page:** `http://localhost:5173/`
- **Register Complaint:** `http://localhost:5173/register`
- **Track Complaint:** `http://localhost:5173/track`
- **Chatbot:** `http://localhost:5173/chatbot`
- **Admin Dashboard:** `http://localhost:5173/admin/dashboard` (Login: admin/admin123)

---

## 🔧 Full Stack Setup (Production Ready)

### Backend Setup

#### Step 1: Install Python Dependencies

```bash
# Create and activate virtual environment
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate

# Install required packages
pip install flask
pip install flask-cors
pip install pymongo
pip install python-dotenv
pip install scikit-learn
pip install pandas
pip install numpy
pip install nltk
pip install spacy
pip install pytesseract
pip install pillow
pip install opencv-python
```

Or use requirements.txt:
```bash
pip install -r backend/requirements.txt
```

#### Step 2: Install Tesseract OCR

**Windows:**
- Download installer from: https://github.com/UB-Mannheim/tesseract/wiki
- Install and add to PATH
- Set environment variable: `TESSERACT_CMD=C:\Program Files\Tesseract-OCR\tesseract.exe`

**macOS:**
```bash
brew install tesseract
```

**Linux:**
```bash
sudo apt-get install tesseract-ocr
```

#### Step 3: Download NLTK Data

```python
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"
```

#### Step 4: Setup MongoDB

**Option 1: Local MongoDB**
- Install MongoDB Community Edition
- Start MongoDB service:
  ```bash
  # Windows (as service)
  net start MongoDB
  
  # macOS
  brew services start mongodb-community
  
  # Linux
  sudo systemctl start mongod
  ```

**Option 2: MongoDB Atlas (Cloud)**
- Create account at mongodb.com/atlas
- Create cluster
- Get connection string
- Add to .env file

#### Step 5: Configure Environment Variables

Create `.env` file in backend directory:

```env
# Flask Configuration
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your-secret-key-here

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/
DATABASE_NAME=flyhappy_db

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# OCR Configuration
TESSERACT_CMD=/usr/local/bin/tesseract

# CORS Settings
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# File Upload Settings
MAX_FILE_SIZE=10485760  # 10MB
UPLOAD_FOLDER=static/uploads
ALLOWED_EXTENSIONS=jpg,jpeg,png,pdf

# Email Configuration (Optional)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

#### Step 6: Train ML Model

```bash
cd backend/ml
python train_model.py
```

This will:
- Load the training dataset (dataset.csv)
- Preprocess text data
- Train classification model
- Save model files (complaint_model.pkl, vectorizer.pkl)
- Display performance metrics

#### Step 7: Seed Database (Optional)

```bash
cd backend/database
python seed_data.py
```

This populates MongoDB with sample complaint data for testing.

#### Step 8: Run Backend Server

```bash
cd backend
python app.py
```

Backend API will run at: `http://localhost:5000`

---

## 🔗 Connecting Frontend to Backend

### Update Frontend API Configuration

Create/edit `src/app/config/api.ts`:

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Complaints
  registerComplaint: `${API_BASE_URL}/complaints`,
  getComplaint: (id: string) => `${API_BASE_URL}/complaints/${id}`,
  getAllComplaints: `${API_BASE_URL}/complaints`,
  updateComplaintStatus: (id: string) => `${API_BASE_URL}/complaints/${id}/status`,
  
  // OCR
  extractText: `${API_BASE_URL}/ocr/extract`,
  
  // Classification
  classifyComplaint: `${API_BASE_URL}/classify`,
  
  // Admin
  adminLogin: `${API_BASE_URL}/admin/login`,
  adminLogout: `${API_BASE_URL}/admin/logout`,
  
  // Analytics
  getStats: `${API_BASE_URL}/analytics/stats`,
};
```

Create `.env.local` in project root:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🗄️ Database Schema

### Collections:

#### 1. complaints
```javascript
{
  _id: ObjectId,
  complaintId: String (unique),
  passengerName: String,
  email: String,
  phone: String,
  pnr: String,
  flightNumber: String,
  airline: String,
  source: String,
  destination: String,
  dateOfTravel: Date,
  complaintType: String,  // Enum: delay, cancellation, baggage, etc.
  description: String,
  priority: String,  // Enum: low, medium, high
  status: String,  // Enum: submitted, under_review, in_process, resolved, rejected
  uploadedFiles: [String],
  ocrData: String,
  adminNotes: String,
  submittedAt: Date,
  updatedAt: Date
}
```

#### 2. users (Admin)
```javascript
{
  _id: ObjectId,
  username: String (unique),
  password: String (hashed),
  role: String,  // Enum: admin, super_admin
  createdAt: Date
}
```

---

## 🧪 Testing Setup

### Run Frontend Tests

```bash
# Install testing dependencies
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom

# Run tests
npm run test
```

### Run Backend Tests

```bash
# Install pytest
pip install pytest pytest-flask

# Run tests
cd backend
pytest tests/
```

---

## 📦 Building for Production

### Frontend Build

```bash
npm run build
```

This creates optimized production build in `dist/` folder.

### Serve Production Build Locally

```bash
npm install -g serve
serve -s dist
```

### Deploy Frontend

**Netlify:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

**Vercel:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Deploy Backend

**Heroku:**
```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create flyhappy-api

# Add MongoDB addon
heroku addons:create mongolab

# Deploy
git subtree push --prefix backend heroku main
```

**AWS EC2:**
- Launch EC2 instance
- Install Python, MongoDB
- Clone repository
- Configure nginx as reverse proxy
- Setup systemd service for Flask app

---

## 🔍 Troubleshooting

### Common Issues:

**1. Port Already in Use**
```bash
# Find process using port 5173
lsof -i :5173
# Kill process
kill -9 <PID>
```

**2. Module Not Found (Python)**
```bash
# Ensure virtual environment is activated
# Reinstall dependencies
pip install -r requirements.txt
```

**3. MongoDB Connection Error**
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Check connection string in .env
```

**4. OCR Not Working**
```bash
# Verify Tesseract installation
tesseract --version

# Set correct path in .env
```

**5. CORS Errors**
- Check ALLOWED_ORIGINS in backend .env
- Ensure Flask-CORS is installed
- Clear browser cache

---

## 📊 Performance Optimization

### Frontend:
- Enable code splitting
- Lazy load routes
- Optimize images
- Use production build
- Enable gzip compression

### Backend:
- Database indexing
- Query optimization
- Caching (Redis)
- Load balancing
- CDN for static files

---

## 🔒 Security Best Practices

1. **Environment Variables:** Never commit .env files
2. **Password Hashing:** Use bcrypt for password storage
3. **Input Validation:** Sanitize all user inputs
4. **File Upload:** Validate file types and sizes
5. **HTTPS:** Use SSL certificates in production
6. **Rate Limiting:** Implement API rate limiting
7. **CSRF Protection:** Enable CSRF tokens
8. **SQL Injection:** Use parameterized queries

---

## 📞 Support

If you encounter issues:

1. Check this guide thoroughly
2. Review error logs
3. Check GitHub issues
4. Contact project maintainer

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Frontend loads at localhost:5173
- [ ] Can register a complaint
- [ ] OCR document upload works
- [ ] Can track complaint by ID
- [ ] Chatbot responds correctly
- [ ] Admin login works
- [ ] Admin dashboard displays data
- [ ] Charts render properly
- [ ] Backend API responds (if using)
- [ ] Database stores data correctly

---

**Setup complete! You're ready to use FlyHappy! 🎉**

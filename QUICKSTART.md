# FlyHappy - Quick Start Guide

Get FlyHappy up and running in 5 minutes! ⚡

---

## 🚀 Super Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/flyhappy.git
cd flyhappy

# 2. Install dependencies
npm install
# or
pnpm install

# 3. Run the application
npm run dev
# or
pnpm dev

# 4. Open browser
# Visit: http://localhost:5173
```

That's it! The application is now running. 🎉

---

## 📱 Using the Application

### For Passengers

#### Register a Complaint

1. **Navigate to Register Complaint**
   - Click "Register Complaint" in the navigation bar

2. **Fill the Form** (Two ways)
   
   **Option A: Manual Entry**
   - Enter your name, email, phone
   - Enter PNR, flight number, airline
   - Add source and destination
   - Describe your complaint
   - Click "Submit Complaint"

   **Option B: Upload Document (OCR)**
   - Click "Choose File" in the blue OCR section
   - Upload your boarding pass/ticket image
   - Watch as fields auto-populate! ✨
   - Fill any remaining fields
   - Describe your complaint
   - Click "Submit Complaint"

3. **Get Your Complaint ID**
   - After submission, you'll receive a unique ID (e.g., FH123ABC456)
   - Save this ID to track your complaint
   - AI automatically categorizes your complaint
   - Priority is assigned automatically

#### Track Your Complaint

1. **Go to Track Complaint**
   - Click "Track Complaint" in the navigation

2. **Enter Your ID**
   - Type your complaint ID
   - Click "Search"

3. **View Status**
   - See current status
   - View progress timeline
   - Check all complaint details

#### Use the Chatbot

1. **Click "Help Assistant"**
   - Opens the chatbot interface

2. **Ask Questions**
   - Type your question
   - Get instant responses
   - Ask about complaint types, documents needed, etc.

---

### For Administrators

#### Login to Admin Panel

1. **Navigate to Admin Login**
   - Click "Admin" in the navigation
   - Or visit: `http://localhost:5173/admin/login`

2. **Enter Credentials**
   ```
   Username: admin
   Password: admin123
   ```

3. **Click Login**

#### Manage Complaints

1. **View Dashboard**
   - See statistics overview
   - View all complaints in table
   - Check analytics charts

2. **Filter Complaints**
   - Use the status dropdown to filter
   - Options: All, Submitted, Under Review, In Process, Resolved, Rejected

3. **Update Status**
   - Find the complaint in the table
   - Change status using the dropdown
   - Status updates automatically

4. **View Details**
   - Click "View" on any complaint
   - See complete information
   - View OCR extracted data
   - Read passenger details

---

## 🎯 Sample User Flows

### Flow 1: Quick Complaint with OCR

```
1. Upload boarding pass image
2. System extracts: Name, PNR, Flight, etc.
3. Fields auto-fill
4. Add complaint description
5. Submit
6. Get complaint ID
7. Track status
```

**Time:** ~2 minutes

### Flow 2: Manual Complaint

```
1. Open registration form
2. Fill all fields manually
3. Write detailed complaint
4. Submit
5. AI classifies complaint
6. Priority assigned
7. Track with ID
```

**Time:** ~3 minutes

### Flow 3: Track Existing Complaint

```
1. Go to Track page
2. Enter complaint ID
3. View status timeline
4. Check updates
```

**Time:** ~30 seconds

### Flow 4: Admin Processing

```
1. Login to admin panel
2. View new complaints
3. Read complaint details
4. Update status to "Under Review"
5. Process the complaint
6. Update to "In Process"
7. Resolve and mark "Resolved"
```

**Time:** Varies per complaint

---

## 🎨 UI Tour

### Home Page
- **Hero Section**: Welcome banner
- **Features**: Key features showcase
- **How It Works**: 4-step process
- **Stats**: Performance metrics
- **CTA**: Call to action buttons

### Register Complaint Page
- **OCR Upload**: Blue section for document upload
- **Form Sections**: 
  - Passenger Information
  - Flight Information
  - Complaint Details
- **Submit Button**: Process and submit

### Track Complaint Page
- **Search Box**: Enter complaint ID
- **Status Card**: Current status with color coding
- **Progress Bar**: Visual progress indicator
- **Timeline**: Step-by-step status updates
- **Details Card**: Full complaint information

### Admin Dashboard
- **Stats Cards**: 4 key metrics
- **Charts**: Bar chart + Pie chart
- **Complaints Table**: Filterable, sortable table
- **Modal**: Detailed complaint view

### Chatbot
- **Chat Interface**: Message bubbles
- **Input Box**: Type messages
- **Bot Responses**: Instant answers
- **Scroll**: Auto-scroll to latest message

---

## 🎮 Try These Examples

### Example 1: Flight Delay Complaint

```
Description:
"My flight AI-342 from Delhi to Mumbai was delayed by 6 hours. 
No notification was sent. We were not provided with refreshments 
or meals during the wait. This is unacceptable."

Expected Result:
- Category: Flight Delay
- Priority: Medium
- Confidence: ~90%
```

### Example 2: Lost Baggage (High Priority)

```
Description:
"URGENT: My baggage was lost on flight 6E-2451. It contains 
important medical documents and prescription medication. 
I need immediate assistance to locate it."

Expected Result:
- Category: Baggage Issue
- Priority: HIGH
- Confidence: ~92%
```

### Example 3: Cancellation Request

```
Description:
"Flight cancelled at the last moment. I need immediate refund 
as this has caused major inconvenience. I was not provided any 
alternate arrangements."

Expected Result:
- Category: Flight Cancellation
- Priority: HIGH
- Confidence: ~95%
```

---

## 📊 Sample Data

The application comes with 4 pre-loaded sample complaints:

1. **Rajesh Kumar** - Flight Delay (Under Review)
2. **Priya Sharma** - Baggage Issue (In Process)
3. **Amit Patel** - Cancellation (Submitted)
4. **Sneha Reddy** - Staff Behaviour (Resolved)

You can view these in the admin dashboard!

---

## 🔧 Keyboard Shortcuts

- **Track Page**: Press Enter to search
- **Chatbot**: Press Enter to send message
- **Forms**: Tab to navigate fields

---

## 💡 Tips & Tricks

### For Better OCR Results
✅ Upload clear, well-lit images  
✅ Ensure text is readable  
✅ Use boarding pass/ticket scans  
✅ Avoid blurry or distorted images  

### For Better Classification
✅ Be specific in description  
✅ Use relevant keywords  
✅ Mention the issue clearly  
✅ Include dates and flight numbers  

### For Quick Support
✅ Use chatbot for common questions  
✅ Check FAQ in chatbot  
✅ Save your complaint ID  

---

## ❓ Common Questions

**Q: I forgot my complaint ID. What do I do?**  
A: Check your email (in production, you'd receive an email). For demo, check the admin dashboard.

**Q: How long does complaint processing take?**  
A: Typically 24-48 hours for review, 3-7 days for resolution.

**Q: Can I upload multiple files?**  
A: Currently single file upload is supported. Multiple files coming soon!

**Q: What file formats are supported?**  
A: Images (JPG, PNG) and PDF files.

**Q: Is my data secure?**  
A: Yes! In production, all data is encrypted and secure.

**Q: Can I edit my complaint after submission?**  
A: Not currently, but you can contact admin to add notes.

---

## 🐛 Troubleshooting

### Application won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
npm run dev
```

### Port already in use
```bash
# Kill process on port 5173
# On macOS/Linux:
lsof -ti:5173 | xargs kill -9

# On Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### OCR not working
- Check if image is uploaded successfully
- Try a different image
- Ensure image is clear and readable

### Complaint ID not found
- Check if you entered the correct ID
- IDs are case-sensitive
- Ensure the complaint was successfully submitted

---

## 📱 Mobile Usage

The application is fully responsive!

**Best on:**
- ✅ Desktop/Laptop (Chrome, Firefox, Safari)
- ✅ Tablets (iPad, Android tablets)
- ✅ Mobile phones (iOS, Android)

**Tips:**
- Use landscape mode for better admin dashboard experience
- Charts are scrollable on mobile
- Forms adapt to screen size

---

## 🎓 For Academic Reviewers

### Quick Demo Script

**1. Introduction (1 min)**
- Open home page
- Explain the problem and solution

**2. User Flow (3 min)**
- Register a new complaint
- Demonstrate OCR (upload sample boarding pass)
- Show AI classification
- Track the complaint

**3. Admin Panel (2 min)**
- Login to admin dashboard
- Show statistics and charts
- Update complaint status
- View detailed information

**4. AI Features (2 min)**
- Explain classification algorithm
- Show priority prediction
- Demonstrate chatbot

**5. Q&A (2 min)**
- Answer questions
- Discuss technical implementation

**Total Time:** 10 minutes

---

## 🚀 Next Steps

After getting started:

1. **Explore Features**
   - Try different complaint types
   - Test the chatbot
   - View analytics

2. **Read Documentation**
   - Check README.md for detailed info
   - Read setup guide for production deployment
   - Review project summary

3. **Customize**
   - Update branding
   - Add more airlines
   - Extend functionality

4. **Deploy** (Optional)
   - Deploy to Netlify/Vercel
   - Set up backend
   - Configure database

---

## 📞 Need Help?

- 📖 Read: [README.md](README.md)
- 🛠️ Setup: [SETUP_GUIDE.md](docs/SETUP_GUIDE.md)
- 📧 Contact: [your.email@example.com]
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/flyhappy/issues)

---

**Happy Flying! ✈️**

*Last Updated: March 10, 2026*

# TeamSync - Deployment Guide

## Prerequisites

- Node.js 20+ installed
- Firebase account and project created
- Google Cloud CLI installed
- GitHub account

## Local Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/preethi-tech/team-builder-app.git
cd team-builder-app
```

### 2. Install Dependencies
```bash
npm install
cd functions && npm install && cd ..
```

### 3. Firebase Setup

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project
3. Enable Authentication (Email/Password and Google)
4. Create Firestore Database
5. Create Cloud Storage bucket

#### Get Firebase Configuration
1. Project Settings → General → Your apps
2. Add web app
3. Copy configuration values

#### Create Environment File
```bash
cp .env.example .env
```

Edit `.env` with your Firebase config:
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 4. Start Development Server
```bash
npm run dev
```

Application runs at: http://localhost:5173

## Production Deployment

### Deploy to Firebase Hosting + Cloud Functions

#### 1. Build Production Assets
```bash
npm run build
```

#### 2. Deploy Firestore Rules and Indexes
```bash
firebase deploy --only firestore
```

#### 3. Deploy Storage Rules
```bash
firebase deploy --only storage
```

#### 4. Deploy Cloud Functions
```bash
firebase deploy --only functions
```

#### 5. Deploy Frontend to Cloud Run

##### Build Docker Image
```bash
docker build -t gcr.io/PROJECT_ID/teamsync:latest .
```

##### Push to Container Registry
```bash
docker push gcr.io/PROJECT_ID/teamsync:latest
```

##### Deploy to Cloud Run
```bash
gcloud run deploy teamsync \
  --image gcr.io/PROJECT_ID/teamsync:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080
```

## Security Configuration

### Firestore Security Rules
Already configured in `firestore.rules`. Deploy with:
```bash
firebase deploy --only firestore:rules
```

### Storage Security Rules
Already configured in `storage.rules`. Deploy with:
```bash
firebase deploy --only storage:rules
```

## Monitoring & Logging

### View Cloud Run Logs
```bash
gcloud run services logs read teamsync --region=us-central1
```

### View Cloud Functions Logs
```bash
firebase functions:log
```

## Troubleshooting

### Common Issues

#### 1. Firebase Emulator Connection Failed
```bash
# Kill existing processes
lsof -ti:8080,9099,5001,9199 | xargs kill -9
firebase emulators:start
```

#### 2. Permission Denied on Firestore
- Check Firestore security rules
- Verify user authentication token
- Check user role in `/users/{userId}` document

## Cost Optimization

### Set Budget Alerts
```bash
gcloud billing budgets create \
  --billing-account=BILLING_ACCOUNT_ID \
  --display-name="TeamSync Monthly Budget" \
  --budget-amount=100USD
```

## Support & Resources

- Firebase Documentation: https://firebase.google.com/docs
- Cloud Run Documentation: https://cloud.google.com/run/docs
- GitHub Repository: https://github.com/preethi-tech/team-builder-app

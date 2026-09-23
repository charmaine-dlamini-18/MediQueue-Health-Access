# MediQueue

**MediQueue** is an AI-powered healthcare web application designed to improve access to healthcare services, particularly for people living in rural and underserved communities. The platform helps patients reduce unnecessary clinic visits by providing intelligent symptom checking, appointment booking, clinic and pharmacy location services, medicine availability tracking, mental health support, and an AI healthcare assistant.

The application is inspired by real healthcare challenges faced in South Africa, including limited access to healthcare facilities, long waiting times, medicine shortages, and gaps in mental health services. MediQueue leverages Artificial Intelligence to improve healthcare accessibility while supporting patients in making informed decisions before travelling to a clinic.

---

# Project Overview

Many rural communities in South Africa experience limited access to healthcare facilities, overcrowded clinics, long waiting times, medicine stock shortages, and difficulty accessing reliable health information. Patients often travel long distances only to discover that medicines are unavailable or queues are extremely long.

MediQueue addresses these challenges by providing an AI-powered healthcare platform that enables users to:

- Check symptoms using an AI-powered symptom checker.
- Locate nearby clinics and pharmacies.
- View estimated queue waiting times.
- Book clinic appointments.
- Receive reminders for chronic disease appointments.
- Track medicine availability before travelling.
- Access mental health support resources.
- Chat with an AI healthcare assistant for guidance.

The goal of MediQueue is to improve healthcare accessibility, reduce unnecessary travel, and support better healthcare outcomes for underserved communities.

---

# Features

## AI Symptom Checker
- AI-powered symptom analysis
- Follow-up health questions
- Suggested urgency level
- Possible health conditions (non-diagnostic)
- Self-care recommendations
- Healthcare guidance and disclaimer

## Smart Clinic & Pharmacy Locator
- Find nearby clinics
- Locate nearby pharmacies
- GPS location services
- Estimated travel distance
- Community queue estimates
- Recommended least busy facilities

## Appointment Booking
- Book clinic appointments
- View upcoming appointments
- Reschedule appointments
- Cancel appointments
- Appointment reminders
- Chronic disease follow-up reminders

## Medicine Availability Tracker
- Check medicine availability
- Low stock notifications
- Out-of-stock alerts
- Find nearby facilities with available medication
- Reduce unnecessary travel

## Mental Health Support
- Anonymous AI chat support
- Mental health resources
- Stress management guidance
- Anxiety and depression support
- Wellness tips
- Local language support

## AI Healthcare Assistant
- Answer healthcare questions
- Explain symptoms
- Help book appointments
- Locate clinics and pharmacies
- Check medicine availability
- Provide appointment reminders
- Healthcare guidance

## Dashboard
- Upcoming appointments
- Health reminders
- Queue estimates
- Medicine availability alerts
- Health tips
- AI recommendations

## Accessibility
- Responsive design
- Mobile-friendly
- English and isiZulu support
- Simple user interface
- Easy navigation
- Low-data friendly design

---

# Tools Used

### Frontend
- HTML5
- CSS3
- JavaScript
- React.js
- Tailwind CSS

### AI & Development Tools
- OpenAI ChatGPT API
- Lovable AI

### Maps & Location
- Google Maps API / OpenStreetMap
- GPS Location Services

### Version Control
- GitHub

---

# Setup Instructions

There are two ways to use **MediQueue**.

## Option 1: Run the Project Locally Using Visual Studio Code (Recommended for Developers)

### Step 1: Clone the Repository

Open **Visual Studio Code**, launch a new terminal, and run:

```bash
git clone https://github.com/charmaine-dlamini-18/MediQueue-Health-Access.git
```

### Step 2: Navigate to the Project Folder

```bash
cd MediQueue-Health-Access
```

### Step 3: Open the Project in Visual Studio Code

If the project is not already open in VS Code, open the cloned folder.

You can also run:

```bash
code .
```

### Step 4: Install Dependencies

Install all required project dependencies by running:

```bash
npm install
```

### Step 5: Configure Environment Variables (If Required)

Create a `.env` file in the project root directory and add the required API keys.

Example:

```env
OPENAI_API_KEY=your_openai_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
FIREBASE_API_KEY=your_firebase_api_key
```

### Step 6: Start the Development Server

Run either of the following commands:

```bash
npm run dev
```

or

```bash
npm start
```

### Step 7: Open the Application

Once the development server starts successfully, open your browser and navigate to the URL displayed in the terminal, typically:

```
http://localhost:5173
```

or

```
http://localhost:3000
```

depending on your development environment.

---

## Option 2: View the Live Application

If you do not wish to install the project locally, you can access the deployed version by copying and pasting the following link into your web browser:

**Live Demo**

https://charmaine-dlamini-ai-powered-assistant.lovable.app

---

## GitHub Repository

The complete source code for this project is available on GitHub:

https://github.com/charmaine-dlamini-18/MediQueue-Health-Access.git

---

# Team Members

- **Charmaine Dlamini** – Project Developer and Owner

---

# Future Improvements

- Integration with Department of Health systems
- Government healthcare API integration
- Electronic Health Record (EHR) integration
- Medicine inventory integration
- AI-powered health risk prediction
- Telemedicine and virtual consultations
- Push notifications
- SMS appointment reminders
- Mobile application (Android & iOS)
- Wearable device integration
- Offline mode for rural communities
- Additional South African language support

---

# Responsible AI

MediQueue uses Artificial Intelligence to assist users by providing symptom guidance, appointment recommendations, health information, medicine availability insights, and healthcare support. AI-generated responses are intended for informational purposes only and **do not replace professional medical advice, diagnosis, or treatment**. Users should always consult qualified healthcare professionals regarding medical concerns or emergencies.

---

# License

This project was developed for educational purposes as part of the **CAPACITI AI Skills Accelerator Programme**.

---

# Acknowledgements

- CAPACITI AI Skills Accelerator Programme
- OpenAI
- Lovable AI
- Google Maps Platform
- OpenStreetMap
- South African Department of Health (future integration concept)
- Healthcare professionals and rural communities whose challenges inspired the MediQueue solution

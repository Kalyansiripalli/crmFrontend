# Mini CRM Opportunity Tracker - Frontend Application

This React client application provides a secure, fully responsive interface for the **Mini CRM Opportunity Tracker**. It allows team members to visualize, search, filter, and manage sales deals in a shared collaborative pipeline.

---

## 🚀 Live Demo & Project Details
- **Live Frontend URL**: https://crm-frontend-sigma-henna.vercel.app/
- **Live Backend URL**: https://crm-backend-jh7e.onrender.com
- **Registered Users on the Platform**:
  - **User 1 (kalyan)**: `svk@gmail.com` / `Password@123`
  - **User 2 (kumar)**: `stk@gmail.com` / `Password@123`

---

## 🎯 Key Features & Implementation Architecture

Here is how the frontend implementation is designed and structured:

### 1. Dedicated Routing & Page Layouts
- **Routing Security**: Built with React Router DOM (v7) inside [App.jsx](./src/App.jsx). Unauthenticated users attempting to access the dashboard are automatically redirected to `/login` via context checks.
- **Dedicated Pages**:
  - **Registration Page** ([Register.jsx](./src/pages/Register.jsx)): Includes form validation (checking fields, passwords, email formats) and shows error alerts.
  - **Login Page** ([Login.jsx](./src/pages/Login.jsx)): Performs authentication checks and saves the session.
  - **Opportunity Dashboard** ([Dashboard.jsx](./src/pages/Dashboard.jsx)): The control console containing summary metric cards, the toolbar search/filter utilities, and the opportunity grid.

### 2. Secure Token Management & API Integration
- **Client Session Persistence**: Upon successful authentication, the server-returned JWT token is stored inside `localStorage` under the key `crmToken` inside [AuthContext.jsx](./src/context/AuthContext.jsx).
- **Axios Interceptor**: Outbound HTTP requests route through the centralized API client in [api.js](./src/services/api.js). An request interceptor reads the token from storage and automatically appends it as `Authorization: Bearer <token>` in the headers, avoiding manual overrides in UI pages.

### 3. Collaborative Pipeline Visibility & Owner Protection
- **Shared Visualization**: The dashboard displays all opportunities in the pipeline so team members can view the company progress. Each [OpportunityCard.jsx](./src/components/OpportunityCard.jsx) displays the customer name, requirement summary, formatted deal value, stage badge, priority badge, follow-up date, owner name, and creation date.
- **Client-Side Authorization Hiding**:
  - The card component checks if the logged-in user is the owner of the opportunity (`auth.user._id === opportunity.owner._id`).
  - If the active user **owns** the card, the **Edit** and **Delete** buttons are displayed.
  - If the active user **does not own** the card, the controls are hidden from view. (The backend still acts as the absolute authority and blocks unauthorized edits).
  - Opportunities owned by the active user feature a subtle visual highlight to identify ownership.

### 4. Interactive UI/UX Polish (Bonus Enhancements)
- **Live Filtering**: Users can filter opportunities on-the-fly by **Stage** (New, Contacted, Qualified, Proposal Sent, Won, Lost) and **Priority** (Low, Medium, High).
- **Global Search**: Search bar filters matching customer names or requirement descriptions.
- **Summary Metrics Bar**: Computes and displays total pipeline value, active deal count, won revenue, and high-priority deals instantly from active data.
- **Modals**: Custom modal dialogues for creating and editing deals ([OpportunityForm.jsx](./src/components/OpportunityForm.jsx)) provide smooth form handling without requiring disruptive page transitions.
- **Loading & Error Feedback**: State variables display CSS loading spinners, alert banners, and form-level validations.

---

## 🛠️ Tech Stack Used

- **UI Framework**: React 19
- **Build Tool**: Vite
- **Routing**: React Router DOM (v7)
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Styling**: Vanilla CSS (custom design system, responsive grid layout, and card transitions in [index.css](./src/index.css))

---

## 🔑 Environment Variables
Create a `.env` file in the `crmFrontend/` directory:
```env
VITE_API_URL=http://localhost:5000
```
*Note: In production, point this to your hosted backend (e.g. Render/Railway URL).*

---

## 🚀 Local Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Configure Environment**:
   Create a `.env` file and set the `VITE_API_URL`.
3. **Run in Development Mode**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.
4. **Build Production Bundle**:
   ```bash
   npm run build
   ```

---

## ☁️ Deployment Details
- **Deployment Platform**: Vercel
- **Root Directory**: `crmFrontend`
- **Framework Preset**: Vite
- **Output Directory**: `dist`


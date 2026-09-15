## Frontend (React + Vite)

### Routing (`src/App.jsx`)
- `/` → `Landing`
- `/doctors` → `Doctors`
- `/chat` → `Chat`
- `/book` and `/booking` → `BookingNew`
- `/confirmation/:id` → `Confirmation`
- `/admin/login` → `AdminLogin`
- `/appointments` (protected) → `MyAppointments`
- `*` → `NotFound`

### State & Data
- Zustand store: `src/store/bookingStore.js`
- React Query client for server state
- Local/session storage for admin token and transient data

### UI & Components
- Tailwind CSS + Radix UI components in `src/components/ui`
- Chat UI components in `src/components/chat`
- `Navbar` component and page-specific CSS files

### API Layer (`src/services/api.js`)
- Base URL: `VITE_API_BASE_URL` (default `http://localhost:8000`)
- Methods: `checkHealth`, `predict`, `chat`, `book`, `getDepartments`, `getDiseases`, `login`, `getMe`, `getAppointments`, `getAppointmentById`, `updateAppointmentStatus`, `deleteAppointment`, `getBookedSlots`
- Includes robust retry/timeout logic and JWT header injection

### Pages
- `Landing`: marketing/homepage
- `Chat`: AI symptom collection
- `BookingNew`: booking form (AI/manual)
- `Confirmation`: shows booked appointment details
- `MyAppointments`: admin dashboard to manage appointments
- `Doctors`: static/curated doctor listing
- `AdminLogin`: JWT-based login
- `Contact`: contact info and map



# MemoMind Frontend

React + JavaScript + Vite high-fidelity frontend prototype for the MemoMind personal memory and care assistant.

## Requirements

- Node.js 20.19+ or Node.js 22.12+
- npm
- VS Code (recommended)

## Run

```bash
npm install
npm run dev
```

Then open the localhost URL shown by Vite, normally:

http://localhost:5173

## Demo behavior

This version is frontend-only. It uses mock data and React Context.

- Login accepts any non-empty email/password.
- Register accepts the form and starts onboarding.
- Medicines can be added and marked as taken.
- Appointments can be added.
- Memories can be added to the timeline.
- The assistant has demo responses based on the local mock data.
- Settings toggles work locally.
- Data resets when the browser storage/session is reset because the demo is not connected to FastAPI yet.

## Later FastAPI integration

When the backend is ready, keep the UI/components and replace the mock-data/context operations with an API layer such as:

src/services/api.js
src/services/authService.js
src/services/medicineService.js
src/services/appointmentService.js
src/services/memoryService.js
src/services/assistantService.js

Do not put FastAPI code inside React components.

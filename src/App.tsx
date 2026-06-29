import { Routes, Route } from "react-router-dom";

import { useReminderTrigger } from "./hooks/useReminderTrigger";

import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Emotion from "./pages/Emotion";
import MoodSuccess from "./pages/MoodSuccess";
import MoodError from "./pages/MoodError";
import Practices from "./pages/Practices";
import Profile from "./pages/Profile";
import BreathingGuide from "./pages/BreathingGuide";
import WaterReminder from "./pages/WaterReminder";
import VisualRest from "./pages/VisualRest";
import QuickMeditation from "./pages/QuickMeditation";
import Settings from "./pages/Settings";
import SmartReminders from "./pages/SmartReminders";
import History from "./pages/History";
import Reminders from "./pages/Reminders";
import ReminderConfig from "./pages/ReminderConfig";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import DevTools from "./components/debug/DevTools";

function App() {
  /**
   * ============================================================
   * MOTOR DE LEMBRETES
   * ============================================================
   *
   * Mantido por compatibilidade com a arquitetura atual.
   *
   * Em uma evolução futura pode ser movido para a área
   * autenticada da aplicação.
   */
  useReminderTrigger();

  return (
    <>
      <Routes>
        {/* =======================================================
            ROTAS PÚBLICAS
           ======================================================= */}

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        <Route
          path="/"
          element={
            <AppLayout>
              <Emotion />
            </AppLayout>
          }
        />

        <Route
          path="/success"
          element={
            <AppLayout>
              <MoodSuccess />
            </AppLayout>
          }
        />

        <Route
          path="/error"
          element={
            <AppLayout>
              <MoodError />
            </AppLayout>
          }
        />
        
        <Route
          path="/breathing"
          element={
            <AppLayout>
              <BreathingGuide />
            </AppLayout>
          }
        />

        <Route
          path="/practices"
          element={
            <AppLayout>
              <Practices />
            </AppLayout>
          }
        />

        <Route
          path="/meditation"
          element={
            <AppLayout>
              <QuickMeditation />
            </AppLayout>
          }
        />

          <Route
          path="/water"
          element={
            <AppLayout>
              <WaterReminder />
            </AppLayout>
          }
        />

        <Route
          path="/rest"
          element={
            <AppLayout>
              <VisualRest />
            </AppLayout>
          }
        />

        {/* =======================================================
            ROTAS PROTEGIDAS
           ======================================================= */}

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <AppLayout>
                <History />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/smart-reminders"
          element={
            <ProtectedRoute>
              <AppLayout>
                <SmartReminders />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Profile />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reminders"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Reminders />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Settings />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reminder-config"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ReminderConfig />
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>

      {import.meta.env.DEV && <DevTools />}
    </>
  );
}

export default App;

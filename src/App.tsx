import { Routes, Route } from "react-router-dom";

import { useReminderTrigger } from "./hooks/useReminderTrigger";

import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Emotion from "./pages/Emotion";
import History from "./pages/History";
import MoodSuccess from "./pages/MoodSuccess";
import MoodError from "./pages/MoodError";
import Practices from "./pages/Practices";
import Profile from "./pages/Profile";
import BreathingGuide from "./pages/BreathingGuide";
import WaterReminder from "./pages/WaterReminder";
import VisualRest from "./pages/VisualRest";
import QuickMeditation from "./pages/QuickMeditation";
import Reminders from "./pages/Reminders";
import Settings from "./pages/Settings";
import ReminderConfig from "./pages/ReminderConfig";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";

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

        {/* =======================================================
            ROTAS PROTEGIDAS
           ======================================================= */}

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Emotion />
              </AppLayout>
            </ProtectedRoute>
          }
        />

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
          path="/success"
          element={
            <ProtectedRoute>
              <AppLayout>
                <MoodSuccess />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/error"
          element={
            <ProtectedRoute>
              <AppLayout>
                <MoodError />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/practices"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Practices />
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
          path="/breathing"
          element={
            <ProtectedRoute>
              <AppLayout>
                <BreathingGuide />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/water"
          element={
            <ProtectedRoute>
              <AppLayout>
                <WaterReminder />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/rest"
          element={
            <ProtectedRoute>
              <AppLayout>
                <VisualRest />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/meditation"
          element={
            <ProtectedRoute>
              <AppLayout>
                <QuickMeditation />
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

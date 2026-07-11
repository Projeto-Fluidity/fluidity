import { Routes, Route } from "react-router-dom";

/**
 * ============================================================
 * COMPONENTS
 * ============================================================
 */

import ProtectedRoute from "./components/auth/ProtectedRoute";
import DevTools from "./components/debug/DevTools";
import AppLayout from "./components/layout/AppLayout";

/**
 * ============================================================
 * HOOKS
 * ============================================================
 */

import { useAppBootstrap } from "./hooks/useAppBootstrap";
import { useReminderTrigger } from "./hooks/useReminderTrigger";

/**
 * ============================================================
 * PAGES
 * ============================================================
 */

import BreathingGuide from "./pages/BreathingGuide";
import BreakReminder from "./pages/BreakReminder";
import Emotion from "./pages/Emotion";
import ForgotPassword from "./pages/ForgotPassword";
import History from "./pages/History";
import HydrationReminderConfig from "./pages/HydrationReminderConfig";
import Login from "./pages/Login";
import MoodError from "./pages/MoodError";
import MoodReminderConfig from "./pages/MoodReminderConfig";
import MoodSuccess from "./pages/MoodSuccess";
import Practices from "./pages/Practices";
import Profile from "./pages/Profile";
import QuickMeditation from "./pages/QuickMeditation";
import RelaxReminder from "./pages/RelaxReminder";
import Reminders from "./pages/Reminders";
import ResetPassword from "./pages/ResetPassword";
import Settings from "./pages/Settings";
import Signup from "./pages/Signup";
import SmartReminders from "./pages/SmartReminders";
import VisualRest from "./pages/VisualRest";
import WaterReminder from "./pages/WaterReminder";

function App() {

    /**
   * ============================================================
   * APPLICATION BOOTSTRAP
   * ============================================================
   *
   * Inicializa serviços globais da aplicação.
   */
  useAppBootstrap();

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

        <Route
          path="/break-reminder"
          element={
            <AppLayout>
              <BreakReminder />
            </AppLayout>
          }
        />

        <Route
          path="/relax-reminder"
          element={
            <AppLayout>
              <RelaxReminder />
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
          path="/mood-reminder-config"
          element={
            <ProtectedRoute>
              <AppLayout>
                <MoodReminderConfig />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/hydration-reminder-config"
          element={
            <ProtectedRoute>
              <AppLayout>
                <HydrationReminderConfig />
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

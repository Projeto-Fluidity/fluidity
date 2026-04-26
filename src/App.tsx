import { Routes, Route } from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";
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
import DevTools from "./components/debug/DevTools";

/**
 * Componente raiz da aplicação.
 *
 * Responsável por:
 * - Definir as rotas
 * - Aplicar layout padrão
 * - Exibir DevTools em ambiente de desenvolvimento
 */
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<AppLayout><Emotion /></AppLayout>} />
        <Route path="/history" element={<AppLayout><History /></AppLayout>} />
        <Route path="/success" element={<AppLayout><MoodSuccess /></AppLayout>} />
        <Route path="/error" element={<AppLayout><MoodError /></AppLayout>} />
        <Route path="/practices" element={<AppLayout><Practices /></AppLayout>} />
        <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
        <Route path="/breathing" element={<AppLayout><BreathingGuide /></AppLayout>} />
        <Route path="/water" element={<AppLayout><WaterReminder /></AppLayout>} />
        <Route path="/rest" element={<AppLayout><VisualRest /></AppLayout>} />
        <Route path="/meditation" element={<AppLayout><QuickMeditation /></AppLayout>} />
        <Route path="/reminders" element={<AppLayout><Reminders /></AppLayout>} />
        <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
      </Routes>

      {/* DevTools só aparece em desenvolvimento */}
      {import.meta.env.DEV && <DevTools />}
    </>
  );
}

export default App;

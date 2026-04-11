import { Routes, Route } from "react-router-dom";

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
import DevTools from "./components/debug/DevTools";

/**
 * Componente raiz da aplicacao.
 * Responsavel por configurar o roteamento principal.
 */
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Emotion />} />
        <Route path="/history" element={<History />} />
        <Route path="/success" element={<MoodSuccess />} />
        <Route path="/error" element={<MoodError />} />
        <Route path="/practices" element={<Practices />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/breathing" element={<BreathingGuide />} />
        <Route path="/water" element={<WaterReminder />} />
        <Route path="/rest" element={<VisualRest />} />
        <Route path="/meditation" element={<QuickMeditation />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/reminder-config" element={<ReminderConfig />} />
      </Routes>
      {import.meta.env.DEV && <DevTools />}
    </>
  );
}

export default App;
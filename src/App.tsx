import { Routes, Route } from "react-router-dom";

import Emotion from "./pages/Emotion";
import History from "./pages/History";
import MoodSuccess from "./pages/MoodSuccess";
import MoodError from "./pages/MoodError";
import Practices from "./pages/Practices";
import Profile from "./pages/Profile";
import BreathingGuide from "./pages/BreathingGuide";
import QuickMeditation from "./pages/QuickMeditation";

/**
 * Componente raiz da aplicação.
 * Responsável por configurar o roteamento principal.
 */
function App() {
  return (
    <Routes>
      <Route path="/" element={<Emotion />} />
      <Route path="/history" element={<History />} />
      <Route path="/success" element={<MoodSuccess />} />
      <Route path="/error" element={<MoodError />} />

      {/* novas telas */}
      <Route path="/practices" element={<Practices />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/breathing" element={<BreathingGuide />} />
      <Route path="/meditation" element={<QuickMeditation />} />
    </Routes>
  );
}

export default App;

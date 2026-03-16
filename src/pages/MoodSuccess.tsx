import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

import StatusScreen from "../components/ui/StatusScreen";
import StatusIcon from "../components/ui/StatusIcon";
import Button from "../components/ui/Button";

/**

* Tela exibida após o registro bem-sucedido
* do humor do usuário.
  */
  export default function MoodSuccess() {
  const navigate = useNavigate();

function handleNavigateHome() {
navigate("/");
}

return (
<StatusScreen
  hideBottomNav
  icon={<StatusIcon variant="success" icon={<Check size={28} strokeWidth={6} />} />}
  title="Humor registrado!"
  descriptionPrimary="Que bom que você registrou 🙂"
  action={
    <Button variant="success" fullWidth onClick={handleNavigateHome}>
      Ir para Home
    </Button>
  }
/>
);
}

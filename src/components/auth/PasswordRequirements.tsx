/**
 * ============================================================
 * PASSWORD REQUIREMENTS
 * ============================================================
 *
 * Exibe os requisitos mínimos exigidos para
 * criação e redefinição de senha.
 *
 * Responsabilidade:
 *
 * - orientar o usuário;
 * - reduzir erros de preenchimento;
 * - centralizar a documentação visual da
 *   política de senha.
 */
export default function PasswordRequirements() {
  return (
    <div className="rounded-xl bg-gray-50 p-3 text-sm text-gray-600">
      <p className="mb-2 font-medium">
        Sua senha deve conter:
      </p>

      <ul className="space-y-1">
        <li>• Pelo menos 8 caracteres</li>
        <li>• Uma letra maiúscula</li>
        <li>• Uma letra minúscula</li>
        <li>• Um número</li>
        <li>• Um caractere especial</li>
      </ul>
    </div>
  );
}

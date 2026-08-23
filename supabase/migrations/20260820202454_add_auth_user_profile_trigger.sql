-- ============================================================
-- AUTH USER PROFILE TRIGGER
-- ============================================================
--
-- Mantém public.profiles sincronizado com auth.users.
--
-- A função handle_new_user() já existe na migration inicial.
-- Aqui adicionamos o trigger que estava ausente no Staging.
-- ============================================================

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- BACKFILL EXISTING USERS
-- ============================================================
--
-- O usuário de Staging já existia em auth.users antes
-- da criação deste trigger.
--
-- Criamos o profile somente quando ele ainda não existe.
-- ============================================================

INSERT INTO public.profiles (
  id,
  name,
  email
)
SELECT
  u.id,
  COALESCE(
    u.raw_user_meta_data->>'name',
    ''
  ),
  u.email
FROM auth.users AS u
WHERE NOT EXISTS (
  SELECT 1
  FROM public.profiles AS p
  WHERE p.id = u.id
);

-- ============================================================
-- PROFILE SELECT POLICY
-- ============================================================
--
-- Permite que o usuário autenticado consulte
-- somente o próprio profile.
-- ============================================================

CREATE POLICY "users can select own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

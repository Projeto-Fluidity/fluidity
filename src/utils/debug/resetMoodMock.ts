const STORAGE_KEY = "fluidity:mood_mock";

export function resetMoodMock() {
  localStorage.removeItem(STORAGE_KEY);

  // opcional QA
  localStorage.removeItem("debug:forceError");

  console.log("[QA] Dados de humor resetados com sucesso");
}

export function showMessage(element, text, type = "error") {
  if (!element) return;
  element.textContent = text;
  element.className = "message show " + type;
}

export function clearMessage(element) {
  if (!element) return;
  element.textContent = "";
  element.className = "message";
}

export function switchTo(panelId, panels, tabs) {
  panels.forEach(panel => panel.classList.remove("active"));
  tabs.forEach(tab => tab.classList.remove("active"));

  const panel = document.getElementById(panelId);
  if (panel) panel.classList.add("active");

  const activeTab = Array.from(tabs).find(tab => tab.dataset.target === panelId);
  if (activeTab) activeTab.classList.add("active");
}

export function mapFirebaseError(error) {
  const code = error && error.code ? error.code : "";
  switch (code) {
    case "auth/email-already-in-use":
      return "Exista deja un cont cu acest email.";
    case "auth/invalid-email":
      return "Email invalid.";
    case "auth/weak-password":
      return "Parola este prea slaba. Foloseste minimum 6 caractere.";
    case "auth/invalid-credential":
      return "Email sau parola gresita.";
    case "auth/network-request-failed":
      return "Eroare de retea. Incearca din browserul principal, fara VPN sau adblock.";
    default:
      return error && error.message ? error.message : "A aparut o eroare neasteptata.";
  }
}

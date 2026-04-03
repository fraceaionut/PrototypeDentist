import { updateProfile } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { showMessage, clearMessage, switchTo, mapFirebaseError } from "./ui.js";
import { renderAppointments, renderTreatmentPlan } from "./booking.js";

export function bindAuth({
  auth,
  tabs,
  panels,
  registerMessage,
  loginMessage,
  profileMessage,
  bookingMessage,
  guestTabs,
  registerPanel,
  loginPanel,
  profilePanel,
  bookingFormCard
}) {
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      clearMessage(registerMessage);
      clearMessage(loginMessage);
      switchTo(tab.dataset.target, panels, tabs);
    });
  });

  const registerBtn = document.getElementById("registerBtn");
  if (registerBtn) {
    registerBtn.addEventListener("click", async () => {
      clearMessage(registerMessage);

      const nameEl = document.getElementById("registerName");
      const emailEl = document.getElementById("registerEmail");
      const passEl = document.getElementById("registerPassword");

      const name = nameEl ? nameEl.value.trim() : "";
      const email = emailEl ? emailEl.value.trim() : "";
      const password = passEl ? passEl.value : "";

      if (!name || !email || !password) {
        showMessage(registerMessage, "Completeaza toate campurile.", "error");
        return;
      }

      try {
        const { createUserWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js");
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(credential.user, { displayName: name });
        showMessage(registerMessage, "Cont creat cu succes.", "success");
      } catch (error) {
        showMessage(registerMessage, mapFirebaseError(error), "error");
        console.error(error);
      }
    });
  }

  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
      clearMessage(loginMessage);

      const emailEl = document.getElementById("loginEmail");
      const passEl = document.getElementById("loginPassword");
      const email = emailEl ? emailEl.value.trim() : "";
      const password = passEl ? passEl.value : "";

      if (!email || !password) {
        showMessage(loginMessage, "Introdu email si parola.", "error");
        return;
      }

      try {
        const { signInWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js");
        await signInWithEmailAndPassword(auth, email, password);
        showMessage(loginMessage, "Autentificare reusita.", "success");
      } catch (error) {
        showMessage(loginMessage, mapFirebaseError(error), "error");
        console.error(error);
      }
    });
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        const { signOut } = await import("https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js");
        await signOut(auth);
      } catch (error) {
        showMessage(profileMessage, mapFirebaseError(error), "error");
        console.error(error);
      }
    });
  }

  const { onAuthStateChanged } = window.__firebaseAuthHelpers;
  onAuthStateChanged(auth, user => {
    clearMessage(profileMessage);
    clearMessage(bookingMessage);
    const hero = document.getElementById("heroSection");
    if (!user) {
      if (hero) hero.style.display = "none";
      if (guestTabs) guestTabs.classList.remove("hidden");
      if (profilePanel) profilePanel.classList.remove("active");
      if (bookingFormCard) bookingFormCard.classList.add("form-hidden");
      switchTo("registerPanel", panels, tabs);
      return;
    }

    if (guestTabs) guestTabs.classList.add("hidden");
    if (registerPanel) registerPanel.classList.remove("active");
    if (loginPanel) loginPanel.classList.remove("active");
    if (profilePanel) profilePanel.classList.add("active");
    if (bookingFormCard) bookingFormCard.classList.remove("form-hidden");

    const profileName = document.getElementById("profileName");
    const profileEmail = document.getElementById("profileEmail");
    const bookingName = document.getElementById("bookingName");

    if (profileName) profileName.textContent = user.displayName || "-";
    if (profileEmail) profileEmail.textContent = user.email || "-";
    if (bookingName) bookingName.value = user.displayName || "";

    
    if (hero) hero.style.display = "none";

    renderAppointments();
    renderTreatmentPlan();
  });
}

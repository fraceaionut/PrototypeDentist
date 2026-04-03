import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

import { firebaseConfig } from "./firebase-config.js";
import { showMessage } from "./ui.js";
import {
  defaultAppointments,
  renderAppointments,
  renderTreatmentPlan,
  buildBookingEmailBody,
  buildWhatsAppBody
} from "./booking.js";
import { bindAuth } from "./auth.js";

window.__firebaseAuthHelpers = { onAuthStateChanged };

const bookingEmail = "adauga-aici-emailul-clinicii@example.com";
const whatsAppNumber = "40700000000";

const registerMessage = document.getElementById("registerMessage");
const loginMessage = document.getElementById("loginMessage");
const profileMessage = document.getElementById("profileMessage");
const bookingMessage = document.getElementById("bookingMessage");

const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");
const guestTabs = document.getElementById("guestTabs");
const registerPanel = document.getElementById("registerPanel");
const loginPanel = document.getElementById("loginPanel");
const profilePanel = document.getElementById("profilePanel");
const bookingFormCard = document.getElementById("bookingFormCard");

renderAppointments();
renderTreatmentPlan();

let auth = null;

try {
  if (!firebaseConfig || !firebaseConfig.projectId) {
    showMessage(registerMessage, "Completeaza firebase-config.js inainte sa folosesti aplicatia.", "error");
  } else {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);

    bindAuth({
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
    });
  }
} catch (error) {
  showMessage(registerMessage, "Eroare la initializare: " + (error.message || error), "error");
  console.error(error);
}

const emailBtn = document.getElementById("emailBookingBtn");
if (emailBtn) {
  emailBtn.addEventListener("click", () => {
    if (!auth || !auth.currentUser) {
      showMessage(profileMessage, "Trebuie sa fii logat pentru a trimite emailul de programare.", "error");
      return;
    }

    const subject = encodeURIComponent("Cerere programare dentist");
    const body = encodeURIComponent(buildBookingEmailBody());
    window.location.href = "mailto:" + bookingEmail + "?subject=" + subject + "&body=" + body;
  });
}

const waBtn = document.getElementById("whatsAppBookingBtn");
if (waBtn) {
  waBtn.addEventListener("click", () => {
    if (!auth || !auth.currentUser) {
      showMessage(profileMessage, "Trebuie sa fii logat pentru a deschide programarea prin WhatsApp.", "error");
      return;
    }

    const message = encodeURIComponent(buildWhatsAppBody());
    window.open("https://wa.me/" + whatsAppNumber + "?text=" + message, "_blank");
  });
}

const toggleBookingFormBtn = document.getElementById("toggleBookingFormBtn");
if (toggleBookingFormBtn) {
  toggleBookingFormBtn.addEventListener("click", () => {
    if (!auth || !auth.currentUser) {
      showMessage(profileMessage, "Trebuie sa fii logat pentru a completa formularul.", "error");
      return;
    }

    if (bookingFormCard) {
      bookingFormCard.classList.toggle("form-hidden");
      bookingFormCard.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

const submitBookingBtn = document.getElementById("submitBookingBtn");
if (submitBookingBtn) {
  submitBookingBtn.addEventListener("click", () => {
    if (!auth || !auth.currentUser) {
      showMessage(bookingMessage, "Trebuie sa fii logat pentru a adauga o programare.", "error");
      return;
    }

    const bookingNameEl = document.getElementById("bookingName");
    const bookingPhoneEl = document.getElementById("bookingPhone");
    const bookingDateEl = document.getElementById("bookingDate");
    const bookingServiceEl = document.getElementById("bookingService");
    const bookingDoctorEl = document.getElementById("bookingDoctor");
    const bookingNotesEl = document.getElementById("bookingNotes");

    const bookingName = bookingNameEl ? bookingNameEl.value.trim() : "";
    const bookingPhone = bookingPhoneEl ? bookingPhoneEl.value.trim() : "";
    const bookingDate = bookingDateEl ? bookingDateEl.value : "";
    const bookingService = bookingServiceEl ? bookingServiceEl.value : "";
    const bookingDoctor = bookingDoctorEl ? bookingDoctorEl.value : "";
    const bookingNotes = bookingNotesEl ? bookingNotesEl.value.trim() : "";

    if (!bookingName || !bookingPhone || !bookingDate) {
      showMessage(bookingMessage, "Completeaza numele, telefonul si data dorita.", "error");
      return;
    }

    defaultAppointments.push({
      date: bookingDate,
      doctor: bookingDoctor,
      service: bookingService,
      notes: bookingNotes || ("Telefon pacient: " + bookingPhone)
    });

    renderAppointments();
    showMessage(bookingMessage, "Cererea de programare a fost adaugata local in interfata.", "success");

    if (bookingPhoneEl) bookingPhoneEl.value = "";
    if (bookingDateEl) bookingDateEl.value = "";
    if (bookingNotesEl) bookingNotesEl.value = "";
  });
}

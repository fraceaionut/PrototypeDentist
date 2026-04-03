export const defaultAppointments = [
  { date: "2026-04-10 09:30", doctor: "Dr. Popescu", service: "Consultatie generala" },
  { date: "2026-04-18 11:00", doctor: "Dr. Ionescu", service: "Igienizare dentara" },
  { date: "2026-04-25 14:00", doctor: "Dr. Marinescu", service: "Radiografie dentara" },
  { date: "2026-05-02 10:15", doctor: "Dr. Georgescu", service: "Obturatie molar" }
];

export const defaultTreatmentPlan = [
  { name: "Consultatie initiala", status: "Achitat", price: 200, paid: true },
  { name: "Radiografie panoramica", status: "Achitat", price: 180, paid: true },
  { name: "Detartraj si periaj", status: "Achitat", price: 350, paid: true },
  { name: "Obturatie carie molar", status: "Neachitat", price: 450, paid: false },
  { name: "Tratament de canal", status: "Neachitat", price: 900, paid: false },
  { name: "Coroana ceramica", status: "Neachitat", price: 1500, paid: false },
  { name: "Control final si ajustari", status: "Neachitat", price: 250, paid: false }
];

export function renderAppointments(items = defaultAppointments) {
  const container = document.getElementById("appointmentsList");
  if (!container) return;

  const sorted = items
    .slice()
    .sort((a, b) => new Date(String(a.date).replace(" ", "T")) - new Date(String(b.date).replace(" ", "T")));

  container.innerHTML = sorted
    .map(item => {
      const notes = item.notes ? "<br>" + item.notes : "";
      return `<div class="list-item"><strong>${item.date}</strong><br>${item.service} - ${item.doctor}${notes}</div>`;
    })
    .join("");
}

export function renderTreatmentPlan(items = defaultTreatmentPlan) {
  const container = document.getElementById("treatmentPlanList");
  if (!container) return;

  const total = items.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const paid = items.reduce((sum, item) => sum + (item.paid ? Number(item.price || 0) : 0), 0);
  const remaining = total - paid;

  const rows = items
    .map(item => {
      const paidClass = item.paid ? " treatment-item-paid" : "";
      const statusClass = item.paid ? "status status-paid" : "status";
      return `<div class="list-item${paidClass}"><strong>${item.name}</strong><span class="${statusClass}">${item.status}</span><br><span class="price">${item.price} RON</span></div>`;
    })
    .join("");

  const summary = `
    <div class="treatment-summary">
      <div class="summary-row"><span>Total achitat</span><strong>${paid} RON</strong></div>
      <div class="summary-row"><span>Total plan tratament</span><strong>${total} RON</strong></div>
      <div class="summary-row total remaining"><span>Rest de plata</span><strong>${remaining} RON</strong></div>
    </div>
  `;

  container.innerHTML = rows + summary;
}

export function buildBookingEmailBody() {
  const profileNameEl = document.getElementById("profileName");
  const profileEmailEl = document.getElementById("profileEmail");
  const bookingNameEl = document.getElementById("bookingName");
  const bookingPhoneEl = document.getElementById("bookingPhone");
  const bookingDateEl = document.getElementById("bookingDate");
  const bookingServiceEl = document.getElementById("bookingService");
  const bookingDoctorEl = document.getElementById("bookingDoctor");
  const bookingNotesEl = document.getElementById("bookingNotes");

  const profileName = profileNameEl ? profileNameEl.textContent : "-";
  const profileEmail = profileEmailEl ? profileEmailEl.textContent : "-";
  const bookingName = bookingNameEl && bookingNameEl.value.trim() ? bookingNameEl.value.trim() : profileName;
  const bookingPhone = bookingPhoneEl ? bookingPhoneEl.value.trim() : "";
  const bookingDate = bookingDateEl ? bookingDateEl.value : "";
  const bookingService = bookingServiceEl ? bookingServiceEl.value : "";
  const bookingDoctor = bookingDoctorEl ? bookingDoctorEl.value : "";
  const bookingNotes = bookingNotesEl ? bookingNotesEl.value.trim() : "";

  return [
    "Buna ziua,",
    "",
    "Doresc o programare.",
    "",
    "Nume: " + bookingName,
    "Email: " + profileEmail,
    "Telefon: " + bookingPhone,
    "Serviciu dorit: " + bookingService,
    "Data preferata: " + bookingDate,
    "Medic preferat: " + bookingDoctor,
    "Detalii: " + bookingNotes,
    "",
    "Va rog sa ma contactati pentru confirmare."
  ].join("\n");
}

export function buildWhatsAppBody() {
  const profileNameEl = document.getElementById("profileName");
  const profileEmailEl = document.getElementById("profileEmail");
  const bookingNameEl = document.getElementById("bookingName");
  const bookingPhoneEl = document.getElementById("bookingPhone");
  const bookingDateEl = document.getElementById("bookingDate");
  const bookingServiceEl = document.getElementById("bookingService");
  const bookingDoctorEl = document.getElementById("bookingDoctor");
  const bookingNotesEl = document.getElementById("bookingNotes");

  const profileName = profileNameEl ? profileNameEl.textContent : "-";
  const profileEmail = profileEmailEl ? profileEmailEl.textContent : "-";
  const bookingName = bookingNameEl && bookingNameEl.value.trim() ? bookingNameEl.value.trim() : profileName;
  const bookingPhone = bookingPhoneEl ? bookingPhoneEl.value.trim() : "";
  const bookingDate = bookingDateEl ? bookingDateEl.value : "";
  const bookingService = bookingServiceEl ? bookingServiceEl.value : "";
  const bookingDoctor = bookingDoctorEl ? bookingDoctorEl.value : "";
  const bookingNotes = bookingNotesEl ? bookingNotesEl.value.trim() : "";

  return [
    "Buna ziua! Doresc o programare la dentist.",
    "",
    "Nume: " + bookingName,
    "Email: " + profileEmail,
    "Telefon: " + bookingPhone,
    "Serviciu dorit: " + bookingService,
    "Data preferata: " + bookingDate,
    "Medic preferat: " + bookingDoctor,
    "Detalii: " + bookingNotes
  ].join("\n");
}

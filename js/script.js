// =================================================
// 1. CONSTANTS & GLOBAL STATE
// =================================================
const CSV_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTgTjltCmy4ZrnWeLIWqOjrNUlJobYdG1UDuVhMk989j-pHi21KshF4af9TpdnnkVTvQjASv3LSoi00/pub?gid=1992378945&single=true&output=csv";

const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
let originalCardsOrder = [];


// =================================================
// 2. GLOBAL FUNCTIONS (USED BY HTML)
// =================================================

// Desktop scroll buttons
function scrollLecturers(amount) {
    const list = document.getElementById("lecturerList");
    if (!list) return;

    list.scrollBy({
        left: amount,
        behavior: "smooth"
    });
}

// Highlight selected lecturer
function highlightLecturer(active) {
    document.querySelectorAll(".lecturer").forEach(l =>
        l.classList.remove("active")
    );
    active.classList.add("active");
}

// Reset all subjects
function showAllSubjects() {
    const container = document.getElementById("subject-container");
    container.innerHTML = "";

    originalCardsOrder.forEach(card => {
        card.classList.remove("fade-out");
        card.classList.add("fade-in");
        container.appendChild(card);
    });

    document.querySelectorAll(".lecturer").forEach(l =>
        l.classList.remove("active")
    );

    container.scrollIntoView({ behavior: "smooth", block: "start" });
}


// =================================================
// 3. FILTER LOGIC (REORDER TO TOP)
// =================================================

function filterByLecturer(selectedLecturer) {
    const container = document.getElementById("subject-container");
    const cards = Array.from(container.children);

    const matched = [];
    const unmatched = [];

    cards.forEach(card => {
        if (card.dataset.lecturer === selectedLecturer) {
            matched.push(card);
        } else {
            unmatched.push(card);
        }
    });

    container.innerHTML = "";

    // Matched FIRST (visible at top)
    matched.forEach(card => {
        card.classList.remove("fade-out");
        card.classList.add("fade-in");
        container.appendChild(card);
    });

    // Unmatched AFTER (faded)
    unmatched.forEach(card => {
        card.classList.remove("fade-in");
        card.classList.add("fade-out");
        container.appendChild(card);
    });

    container.scrollIntoView({ behavior: "smooth", block: "start" });
}


// =================================================
// 4. DOM READY (LECTURER UI + BUTTONS)
// =================================================

document.addEventListener("DOMContentLoaded", () => {

    // Lecturer list
    const lecturers = [
        "Dr Mohd Nurul Hafiz Bin Ibrahim",
        "Noor Atikah binti Mat Abir",
        "Dr. Kazem Chamran",
        "Dr. Inam Ullah",
        "Dr Hazirah Bee",
        "Dr. Nwosu Anthony Ugochukwu",
        "Dr Taqiyah Khadijah",
        "Mohd Noor Hafizee bin Yahaya",
        "Nur Athirah Saharil",
        "Nur Fadhilah Binti Ahmad Ismail",
        "Nazmirul Izzad bin Nassir",
        "Aqilah Abd. Ghani",
        "Nurul Amirah Binti Jauhari",
        "Safia Adrina binti Mohd Zulkifli"
    ];

    const lecturerContainer = document.getElementById("lecturerList");

    lecturers.forEach(name => {
        const fileName = name
            .toLowerCase()
            .replace(/\./g, "")
            .replace(/\s+/g, "-");

        const lecturerDiv = document.createElement("div");
        lecturerDiv.className = "lecturer";

        lecturerDiv.innerHTML = `
            <img src="images/lecturers/${fileName}.jpg"
                 alt="${name}"
                 onerror="this.src='images/lecturers/default.jpg'">
            <span class="lecturer-name">${name}</span>
        `;

        lecturerDiv.addEventListener("click", () => {
            filterByLecturer(name);
            highlightLecturer(lecturerDiv);
        });

        lecturerContainer.appendChild(lecturerDiv);
    });

    // Show All button
    const showAllBtn = document.getElementById("showAllBtn");
    if (showAllBtn) {
        showAllBtn.addEventListener("click", showAllSubjects);
    }
});


// =================================================
// 5. CSV LOAD & CARD CREATION
// =================================================

Papa.parse(CSV_URL, {
    download: true,
    header: true,
    skipEmptyLines: true,

    complete: function (results) {
        const container = document.getElementById("subject-container");
        container.innerHTML = "";

        results.data.forEach(row => {
            if (!row["Subject code"]) return;

            const isToday =
                row["Day"] &&
                row["Day"].trim().toLowerCase() === today.toLowerCase();

            const card = document.createElement("div");
            card.className = "card fade-in";

            if (isToday) card.classList.add("today");

            card.dataset.lecturer = (row["Lecturer Name"] || "").trim();

            card.innerHTML = `
                ${isToday ? `<span class="today-badge">TODAY</span>` : ""}
                <h2>${row["Subject code"]} - ${row["Subject Name"]}</h2>
                <p><strong>Lecturer:</strong> ${row["Lecturer Name"]}</p>
                <p><strong>Class Code:</strong> ${row["Class Code"]}</p>
                <p><strong>Day:</strong> ${row["Day"]}</p>
                <p><strong>Time:</strong> ${row["Class Time"]}</p>
                <p><strong>Location:</strong> ${row["Class Location"]}</p>

                ${row["Whatsapp Group link"]
                    ? `<a href="${row["Whatsapp Group link"]}" target="_blank" class="btn whatsapp">WhatsApp Group</a>`
                    : ""}

                ${row["Google Classroom link"]
                    ? `<a href="${row["Google Classroom link"]}" target="_blank" class="btn google">Google Classroom</a>`
                    : ""}
            `;

            container.appendChild(card);
            originalCardsOrder.push(card);
        });
    },

    error: err => console.error("CSV parsing failed:", err)
});

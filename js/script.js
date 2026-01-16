// -------------------------------
// 1. Constants
// -------------------------------
const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTgTjltCmy4ZrnWeLIWqOjrNUlJobYdG1UDuVhMk989j-pHi21KshF4af9TpdnnkVTvQjASv3LSoi00/pub?gid=1992378945&single=true&output=csv";
let originalCardsOrder = [];
// Get today's day name (Monday, Tuesday, ...)
const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

// -------------------------------
// 2. DOMContentLoaded (Lecturers UI)
// -------------------------------
document.addEventListener("DOMContentLoaded", () => {
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

    function scrollLecturers(amount) {
        document.getElementById("lecturerList").scrollLeft += amount;
    }

        const container = document.getElementById("lecturerList");

        lecturers.forEach(name => {
            const fileName = name
                .toLowerCase()
                .replace(/\./g, "")
                .replace(/\s+/g, "-");

            const imgPath = `images/lecturers/${fileName}.jpg`;

            const lecturerDiv = document.createElement("div");
            lecturerDiv.className = "lecturer";

            lecturerDiv.innerHTML = `
                <img src="${imgPath}" alt="${name}"
                    onerror="this.src='images/lecturers/default.jpg'">
                <span class="lecturer-name">${name}</span>
            `;

            lecturerDiv.addEventListener("click", () => {
                filterByLecturer(name);
                highlightLecturer(lecturerDiv);
            });

            container.appendChild(lecturerDiv);
        });
    });

    const showAllBtn = document.getElementById("showAllBtn");

    if (showAllBtn) {
        showAllBtn.addEventListener("click", () => {
            showAllSubjects();
        });
    }


// -------------------------------
// 3. CSV Parsing & Card Rendering
// -------------------------------

Papa.parse(CSV_URL, {
    download: true,
    header: true,
    skipEmptyLines: true,

    complete: function (results) {
        const container = document.getElementById("subject-container");
        container.innerHTML = "";

        results.data.forEach(data => {
            // Safety check (prevents blank rows from crashing)
            if (!data["Subject code"]) return;

            const isToday =
                data["Day"] &&
                data["Day"].trim().toLowerCase() === today.toLowerCase();

            const card = document.createElement("div");
            card.className = "card";
            card.classList.add("fade-in");

            if (isToday) card.classList.add("today");
            card.dataset.lecturer = (data["Lecturer Name"] || "").trim();


            card.innerHTML = `
                ${isToday ? `<span class="today-badge">TODAY</span>` : ""}
                <h2>${data["Subject code"]} - ${data["Subject Name"]}</h2>
                <p><strong>Lecturer:</strong> ${data["Lecturer Name"]}</p>
                <p><strong>Class Code:</strong> ${data["Class Code"]}</p>
                <p><strong>Day:</strong> ${data["Day"]}</p>
                <p><strong>Time:</strong> ${data["Class Time"]}</p>
                <p><strong>Location:</strong> ${data["Class Location"]}</p>

                ${data["Whatsapp Group link"]
                    ? `<a href="${data["Whatsapp Group link"]}" target="_blank" class="btn whatsapp">WhatsApp Group</a>`
                    : ""}

                ${data["Google Classroom link"]
                    ? `<a href="${data["Google Classroom link"]}" target="_blank" class="btn google">Google Classroom</a>`
                    : ""}
            `;

            container.appendChild(card);
            originalCardsOrder.push(card);

        });
    },

    error: function (err) {
        console.error("CSV parsing failed:", err);
    }
});


// =================================================
// 4. FILTERING FUNCTIONS
// =================================================

function filterByLecturer(selectedLecturer) {
    const container = document.getElementById("subject-container");
    const cards = Array.from(container.querySelectorAll(".card"));

    const matched = [];
    const unmatched = [];

    cards.forEach(card => {
        if (card.dataset.lecturer === selectedLecturer) {
            matched.push(card);
        } else {
            unmatched.push(card);
        }
    });

    // Clear container
    container.innerHTML = "";

    // Re-append matched cards FIRST
    matched.forEach(card => {
        card.classList.remove("fade-out");
        card.classList.add("fade-in");
        container.appendChild(card);
    });

    // Then append unmatched cards
    unmatched.forEach(card => {
        card.classList.remove("fade-in");
        card.classList.add("fade-out");
        container.appendChild(card);
    });

    // Ensure user sees results immediately
    container.scrollIntoView({ behavior: "smooth", block: "start" });
}



function highlightLecturer(activeLecturer) {
    document.querySelectorAll(".lecturer").forEach(l =>
        l.classList.remove("active")
    );
    activeLecturer.classList.add("active");
}

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





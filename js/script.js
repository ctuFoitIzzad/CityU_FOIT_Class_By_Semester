const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTgTjltCmy4ZrnWeLIWqOjrNUlJobYdG1UDuVhMk989j-pHi21KshF4af9TpdnnkVTvQjASv3LSoi00/pub?gid=1992378945&single=true&output=csv";

Papa.parse(CSV_URL, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
        const container = document.getElementById("subject-container");

        results.data.forEach(data => {
            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
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
        });
    },
    error: function (err) {
        console.error("CSV Load Error:", err);
    }
});

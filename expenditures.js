document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Expenditures script loaded.");

    const expenditureContainer = document.getElementById("expenditureContainer");
    if (!expenditureContainer) {
        console.error("❌ No container found for expenditures.");
        return;
    }

    fetch("expenditures_cleaned.csv")
        .then(response => response.text())
        .then(csvData => {
            Papa.parse(csvData, {
                header: true,
                skipEmptyLines: true,
                complete: function (results) {
                    console.log("✅ Expenditures CSV Loaded:", results.data);
                    renderExpenditureTables(results.data);
                }
            });
        })
        .catch(error => console.error("❌ Error loading CSV:", error));

    function renderExpenditureTables(data) {
        const categories = {};

        data.forEach(row => {
            const category = row["Category"] || "Other";
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(row);
        });

        for (const [category, items] of Object.entries(categories)) {
            const section = document.createElement("section");
            section.classList.add("expenditure-section");
            section.innerHTML = `
                <h2 class="toggle-section">${category} ▼</h2>
                <div class="table-container">
                    <table class="expenditure-table">
                        <thead>
                            <tr>
                                <th>Account Number</th>
                                <th>Item Description</th>
                                <th>FY24 Actual</th>
                                <th>FY25 Requested</th>
                                <th>FY25 Actual</th>
                                <th>FY26 Dept</th>
                                <th>FY26 Admin</th>
                                <th>Change ($)</th>
                                <th>Change (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${items.map(row => `
                                <tr>
                                    <td>${row["Account Number"] || ""}</td>
                                    <td>${row["Item Description"] || ""}</td>
                                    <td>${row["FY24 ACTUAL"] || ""}</td>
                                    <td>${row["FY25 REQUESTED"] || ""}</td>
                                    <td>${row["FY25 ACTUAL"] || ""}</td>
                                    <td>${row["FY26 DEPT"] || ""}</td>
                                    <td>${row["FY26 ADMIN"] || ""}</td>
                                    <td>${row["CHANGE ($)"] || ""}</td>
                                    <td>${row["CHANGE (%)"] || ""}</td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
            `;

            expenditureContainer.appendChild(section);
        }

        document.querySelectorAll(".toggle-section").forEach(header => {
            header.addEventListener("click", function () {
                const table = this.nextElementSibling;
                table.style.display = table.style.display === "none" ? "block" : "none";
            });
        });

        console.log("✅ Tables Rendered Successfully");
    }
});

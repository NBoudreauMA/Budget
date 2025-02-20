document.addEventListener("DOMContentLoaded", function () {
    console.log("Expenditures script loaded.");

    // Load CSV file
    Papa.parse("expenditures_cleaned.csv", {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
            console.log("Expenditures CSV Loaded:", results.data);

            let data = results.data;
            let categoryData = {};

            // Organize expenditures by department
            data.forEach(row => {
                let department = row["Category"]?.trim();  // Main department (General Government, Public Safety, etc.)
                let item = row["Item Description"]?.trim();
                let amount = parseFloat(row["FY26 ADMIN"].replace(/[$,]/g, '')) || 0; // Remove $ and commas

                if (!department || !item || isNaN(amount) || amount <= 0) return;

                // Store details for table rendering
                if (!categoryData[department]) {
                    categoryData[department] = [];
                }
                categoryData[department].push({ item, amount });
            });

            // Render tables for each major category
            renderExpenditureTables(categoryData);
        }
    });
});

// 📌 Render tables for each **main category**
function renderExpenditureTables(categoryData) {
    let container = document.getElementById("expenditureContainer");
    if (!container) {
        console.warn("No container found for expenditures.");
        return;
    }
    container.innerHTML = ""; // Clear previous content

    Object.keys(categoryData).forEach(category => {
        let section = document.createElement("div");
        section.className = "expenditure-section";
        
        let title = document.createElement("h2");
        title.textContent = category;
        section.appendChild(title);

        let table = document.createElement("table");
        table.className = "styled-table";

        let thead = document.createElement("thead");
        thead.innerHTML = `<tr><th>Expenditure Item</th><th>Amount ($)</th></tr>`;
        table.appendChild(thead);

        let tbody = document.createElement("tbody");
        categoryData[category].forEach(({ item, amount }) => {
            let row = document.createElement("tr");
            row.innerHTML = `<td>${item}</td><td>$${amount.toLocaleString()}</td>`;
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        section.appendChild(table);
        container.appendChild(section);
    });

    console.log("Tables Rendered Successfully");
}

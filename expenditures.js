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
            let departmentTotals = {};
            let categoryData = {};

            // Aggregate expenditures by department
            data.forEach(row => {
                let department = row["Category"]?.trim();  // Main department (General Government, Public Safety, etc.)
                let amount = parseFloat(row["FY26 ADMIN"].replace(/[$,]/g, '')) || 0; // Remove $ and commas

                if (!department || isNaN(amount) || amount <= 0) return;

                // Store department totals for pie chart
                if (!departmentTotals[department]) {
                    departmentTotals[department] = 0;
                }
                departmentTotals[department] += amount;

                // Store details for table rendering
                if (!categoryData[department]) {
                    categoryData[department] = [];
                }
                categoryData[department].push({
                    description: row["Item Description"],
                    amount: amount
                });
            });

            // Render the pie chart using department totals
            renderExpenditureChart(departmentTotals);

            // Render tables for each major category
            renderExpenditureTables(categoryData);
        }
    });
});

// 📌 Render pie chart for **departments** instead of every line item
function renderExpenditureChart(departmentTotals) {
    let ctx = document.getElementById("expenditureChart")?.getContext("2d");
    if (!ctx) {
        console.warn("No canvas found for pie chart.");
        return;
    }

    let departments = Object.keys(departmentTotals);
    let values = Object.values(departmentTotals);

    if (departments.length === 0) {
        console.warn("No departments found for pie chart.");
        return;
    }

    new Chart(ctx, {
        type: "pie",
        data: {
            labels: departments,
            datasets: [{
                data: values,
                backgroundColor: [
                    "#4CAF50", "#FF9800", "#F44336", "#3F51B5", "#9C27B0", "#009688", "#FFC107", "#E91E63", "#795548"
                ],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: "bottom" }
            }
        }
    });

    console.log("Expenditure Chart Rendered Successfully");
}

// 📌 Render tables for each **main category**
function renderExpenditureTables(categoryData) {
    Object.keys(categoryData).forEach(category => {
        let cleanCategory = category.replace(/\s+/g, "-"); // Remove spaces for ID matching
        let section = document.getElementById(cleanCategory);
        
        if (!section) {
            console.warn(`No section found for category: ${category} (ID: ${cleanCategory})`);
            return;
        }

        let table = document.createElement("table");
        table.className = "styled-table";

        let thead = document.createElement("thead");
        thead.innerHTML = `<tr><th>Department</th><th>FY26 ADMIN</th></tr>`;
        table.appendChild(thead);

        let tbody = document.createElement("tbody");
        categoryData[category].forEach(({ description, amount }) => {
            let row = document.createElement("tr");
            row.innerHTML = `<td>${description}</td><td>$${amount.toLocaleString()}</td>`;
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        section.appendChild(table);
    });

    console.log("Tables Rendered Successfully");
}

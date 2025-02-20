document.addEventListener("DOMContentLoaded", function () {
    console.log("Expenditures script loaded.");

    // Load CSV file
    Papa.parse("expenditures_cleaned.csv", {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: function (results) {
            console.log("Expenditures CSV Loaded:", results.data);

            let data = results.data;
            let departmentTotals = {};
            let categoryData = {};

            // Aggregate expenditures by department (subcategories)
            data.forEach(row => {
                let category = row["Category"]?.trim();  // Main category
                let department = row["Item Description"]?.trim();  // Department names for pie chart
                let amount = parseFloat(row["FY26 ADMIN"]) || 0;

                // Skip if there's no amount
                if (!department || isNaN(amount)) return;

                // Store department-wise totals for pie chart
                if (!departmentTotals[department]) {
                    departmentTotals[department] = 0;
                }
                departmentTotals[department] += amount;

                // Store department-wise data under categories for tables
                if (!categoryData[category]) {
                    categoryData[category] = [];
                }
                categoryData[category].push({ department, amount });
            });

            // Render the pie chart using department totals
            renderExpenditureChart(departmentTotals);

            // Render tables for each major category
            renderExpenditureTables(categoryData);
        }
    });
});

// 📌 Render pie chart for departments
function renderExpenditureChart(departmentTotals) {
    let ctx = document.getElementById("expenditureChart").getContext("2d");

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
                    "#4CAF50", "#FF9800", "#F44336", "#3F51B5", "#9C27B0", "#009688", "#FFC107", "#E91E63"
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

// 📌 Render tables for each category
function renderExpenditureTables(categoryData) {
    Object.keys(categoryData).forEach(category => {
        let section = document.getElementById(category.replace(/\s+/g, ""));
        if (!section) {
            console.warn(`No section found for category: ${category}`);
            return;
        }

        let table = document.createElement("table");
        table.className = "styled-table";

        let thead = document.createElement("thead");
        thead.innerHTML = `<tr><th>Department</th><th>FY26 ADMIN</th></tr>`;
        table.appendChild(thead);

        let tbody = document.createElement("tbody");
        categoryData[category].forEach(({ department, amount }) => {
            let row = document.createElement("tr");
            row.innerHTML = `<td>${department}</td><td>$${amount.toLocaleString()}</td>`;
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        section.appendChild(table);
    });

    console.log("Tables Rendered Successfully");
}

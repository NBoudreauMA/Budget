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
            let categoryTotals = {};
            let departmentData = {};

            // Aggregate expenditures by category and department
            data.forEach(row => {
                let category = row["Category"];  // Main category (e.g., General Government)
                let department = row["Department"]; // Subcategory/Department
                let amount = row["FY26 ADMIN"];

                // Aggregate category totals for pie chart
                if (category && amount) {
                    if (!categoryTotals[category]) {
                        categoryTotals[category] = 0;
                    }
                    categoryTotals[category] += amount;
                }

                // Store department-wise data under categories
                if (category && department && amount) {
                    if (!departmentData[category]) {
                        departmentData[category] = [];
                    }
                    departmentData[category].push({ department, amount });
                }
            });

            // Render the pie chart
            renderExpenditureChart(categoryTotals);

            // Render tables for each major category
            renderExpenditureTables(departmentData);
        }
    });
});

// Render pie chart for main categories
function renderExpenditureChart(categoryTotals) {
    let ctx = document.getElementById("expenditureChart").getContext("2d");

    let categories = Object.keys(categoryTotals);
    let values = Object.values(categoryTotals);

    new Chart(ctx, {
        type: "pie",
        data: {
            labels: categories,
            datasets: [{
                data: values,
                backgroundColor: ["#4CAF50", "#FF9800", "#F44336", "#3F51B5", "#9C27B0", "#009688", "#FFC107", "#E91E63"],
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

// Render tables for each category
function renderExpenditureTables(departmentData) {
    Object.keys(departmentData).forEach(category => {
        let section = document.getElementById(category.replace(/\s+/g, ""));
        if (!section) return;

        let table = document.createElement("table");
        table.className = "styled-table";

        let thead = document.createElement("thead");
        thead.innerHTML = `<tr><th>Department</th><th>FY26 ADMIN</th></tr>`;
        table.appendChild(thead);

        let tbody = document.createElement("tbody");
        departmentData[category].forEach(({ department, amount }) => {
            let row = document.createElement("tr");
            row.innerHTML = `<td>${department}</td><td>$${amount.toFixed(2)}</td>`;
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        section.appendChild(table);
    });

    console.log("Tables Rendered Successfully");
}

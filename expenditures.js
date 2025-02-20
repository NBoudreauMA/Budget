document.addEventListener("DOMContentLoaded", function () {
    console.log("Expenditures script loaded.");

    Papa.parse("expenditures_cleaned.csv", {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
            console.log("Expenditures CSV Loaded:", results.data);
            renderExpenditures(results.data);
        }
    });
});

function renderExpenditures(data) {
    const categories = {
        "General Government": [],
        "Public Safety": [],
        "Public Works": [],
        "Education": [],
        "Human Services": [],
        "Culture and Recreation": [],
        "Debt": [],
        "Liabilities and Assessments": []
    };

    data.forEach(row => {
        if (categories[row.Category]) {
            categories[row.Category].push(row);
        }
    });

    Object.keys(categories).forEach(category => {
        const tableId = category.replace(/\s+/g, '') + "Table";
        const section = document.getElementById(category.replace(/\s+/g, ''));
        
        if (!section) {
            console.warn(`Table not found for category: ${category}`);
            return;
        }

        let tableHTML = `<table class="data-table"><thead><tr>
            <th>Department</th><th>FY24 Actual</th><th>FY25 Requested</th><th>FY25 Actual</th>
            <th>FY26 Dept</th><th>FY26 Admin</th><th>Change ($)</th><th>Change (%)</th></tr></thead><tbody>`;

        categories[category].forEach(item => {
            tableHTML += `<tr>
                <td>${item["Department"] || "N/A"}</td>
                <td>${formatCurrency(item["FY24 ACTUAL"])}</td>
                <td>${formatCurrency(item["FY25 REQUESTED"])}</td>
                <td>${formatCurrency(item["FY25 ACTUAL"])}</td>
                <td>${formatCurrency(item["FY26 DEPT"])}</td>
                <td>${formatCurrency(item["FY26 ADMIN"])}</td>
                <td>${formatCurrency(item["CHANGE ($)"])}</td>
                <td>${formatPercentage(item["CHANGE (%)"])}</td>
            </tr>`;
        });

        tableHTML += `</tbody></table>`;
        section.innerHTML += tableHTML;
    });

    renderExpendituresChart(data);
}

function renderExpendituresChart(data) {
    const ctx = document.getElementById("expenditureChart").getContext("2d");
    
    if (!ctx) {
        console.error("Canvas element for expenditures chart not found.");
        return;
    }

    const categoryTotals = {};
    data.forEach(row => {
        if (!categoryTotals[row.Category]) {
            categoryTotals[row.Category] = 0;
        }
        categoryTotals[row.Category] += parseFloat(row["FY26 ADMIN"]) || 0;
    });

    const labels = Object.keys(categoryTotals);
    const values = Object.values(categoryTotals);
    
    new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    "#4CAF50", "#FF9800", "#F44336", "#2196F3", "#9C27B0", "#FFC107", "#607D8B", "#E91E63"
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "bottom"
                }
            }
        }
    });

    console.log("Expenditure Chart Rendered Successfully");
}

function formatCurrency(value) {
    if (!value) return "$0.00";
    return `$${parseFloat(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

function formatPercentage(value) {
    if (!value) return "0%";
    return `${parseFloat(value).toFixed(1)}%`;
}

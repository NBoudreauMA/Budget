document.addEventListener("DOMContentLoaded", function () {
    console.log("Expenditures script loaded.");

    const expendituresCSV = "https://raw.githubusercontent.com/NBoudreauMA/Budget/main/expenditures_cleaned.csv";

    if (typeof Papa === "undefined") {
        console.error("PapaParse library is missing.");
        return;
    }

    let expenditureChartCanvas = document.getElementById("expenditureChart");
    let categories = {
        "General Government": 0,
        "Public Safety": 0,
        "Public Works": 0,
        "Education": 0,
        "Human Services": 0,
        "Culture and Recreation": 0,
        "Debt": 0,
        "Liabilities and Assessments": 0
    };

    function formatCurrency(value) {
        if (!value || value.trim() === "" || isNaN(parseFloat(value.replace(/[$,]/g, "")))) {
            return "$0.00"; // Default value for missing or invalid numbers
        }
        let num = parseFloat(value.replace(/[$,]/g, ""));
        return `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    Papa.parse(expendituresCSV, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
            if (!results.data || results.data.length === 0) {
                console.error("Expenditures CSV is empty.");
                return;
            }

            console.log("Expenditures CSV Loaded:", results.data);

            let expenditureTables = {};

            Object.keys(categories).forEach(category => {
                let tableId = category.replace(/\s+/g, '') + "Table";
                expenditureTables[category] = document.querySelector(`#${tableId} tbody`);
                if (!expenditureTables[category]) {
                    console.warn(`Table not found for category: ${category}`);
                }
            });

            results.data.forEach(row => {
                if (!row["Category"] || !row["FY26 Admin"]) return;

                let category = row["Category"].trim();
                let formattedValue = formatCurrency(row["FY26 Admin"]);
                let fy26Value = parseFloat(formattedValue.replace(/[$,]/g, "")) || 0;

                if (categories.hasOwnProperty(category)) {
                    categories[category] += fy26Value;

                    let rowHTML = `
                        <tr>
                            <td>${row["Account"]}</td>
                            <td>${formatCurrency(row["FY24 Actual"])}</td>
                            <td>${formatCurrency(row["FY25 Requested"])}</td>
                            <td>${formatCurrency(row["FY25 Actual"])}</td>
                            <td>${formatCurrency(row["FY26 Dept"])}</td>
                            <td>${formattedValue}</td>
                            <td>${formatCurrency(row["Change ($)"])}</td>
                            <td>${row["Change (%)"] || "0%"}%</td>
                        </tr>
                    `;

                    if (expenditureTables[category]) {
                        expenditureTables[category].innerHTML += rowHTML;
                    }
                }
            });

            const ctx = expenditureChartCanvas.getContext("2d");
            new Chart(ctx, {
                type: "pie",
                data: {
                    labels: Object.keys(categories),
                    datasets: [{
                        data: Object.values(categories),
                        backgroundColor: ["#66BB6A", "#42A5F5", "#FFA726", "#8E44AD", "#3498DB", "#E74C3C", "#27AE60", "#F39C12"],
                        hoverOffset: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: "bottom" },
                        tooltip: { enabled: true }
                    }
                }
            });

            console.log("Expenditure Chart Rendered Successfully");
        }
    });
});

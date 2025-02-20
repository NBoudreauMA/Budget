document.addEventListener("DOMContentLoaded", function () {
    console.log("Expenditures script loaded.");

    const expendituresCSV = "https://raw.githubusercontent.com/NBoudreauMA/Budget/main/expenditures_cleaned.csv";

    if (typeof Papa === "undefined") {
        console.error("PapaParse library is missing.");
        return;
    }

    let expenditureChartCanvas = document.getElementById("expenditureChart");

    if (!expenditureChartCanvas) {
        console.error("Expenditure chart canvas is missing.");
        return;
    }

    // Fetch and Parse CSV
    Papa.parse(expendituresCSV, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
            if (!results.data || results.data.length === 0) {
                console.error("Expenditures CSV is empty.");
                return;
            }

            console.log("Expenditures CSV successfully loaded:", results.data);

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
                let num = parseFloat(value.replace(/[$,]/g, ""));
                return isNaN(num) ? 0 : num;
            }

            results.data.forEach(row => {
                if (!row["Category"] || !row["FY26 ADMIN"]) return;

                let category = row["Category"].trim();
                let amount = formatCurrency(row["FY26 ADMIN"]);

                if (categories.hasOwnProperty(category)) {
                    categories[category] += amount;
                }
            });

            // Convert object to arrays for Chart.js
            let labels = Object.keys(categories);
            let data = Object.values(categories);

            console.log("Chart Data:", data);

            // Ensure Chart.js initializes only if data exists
            if (data.every(value => value === 0)) {
                console.warn("Chart data is all zero - check CSV values.");
                return;
            }

            // Draw the Chart
            const ctx = expenditureChartCanvas.getContext("2d");
            new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: [
                            "#66BB6A", "#42A5F5", "#FFA726", "#8E24AA",
                            "#D81B60", "#26C6DA", "#FF7043", "#7E57C2"
                        ],
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

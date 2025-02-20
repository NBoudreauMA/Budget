document.addEventListener("DOMContentLoaded", function () {
    console.log("Expenditures script loaded.");

    const expendituresCSV = "https://raw.githubusercontent.com/NBoudreauMA/Budget/main/expenditures_cleaned.csv";

    if (typeof Papa === "undefined") {
        console.error("PapaParse library is missing.");
        return;
    }

    let generalGovTable = document.querySelector("#generalGovTable tbody");
    let publicSafetyTable = document.querySelector("#publicSafetyTable tbody");
    let publicWorksTable = document.querySelector("#publicWorksTable tbody");
    let expenditureChartCanvas = document.getElementById("expenditureChart");

    if (!generalGovTable || !publicSafetyTable || !publicWorksTable || !expenditureChartCanvas) {
        console.error("One or more expenditure tables are missing in expenditures.html.");
        return;
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

            let expenditureCategories = {
                "General Government": 0,
                "Public Safety": 0,
                "Public Works": 0
            };

            function formatCurrency(value) {
                let num = parseFloat(value.replace(/[$,]/g, ""));
                return isNaN(num) ? "$0.00" : `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }

            results.data.forEach(row => {
                if (!row["Category"]) return;

                let rowHTML = `
                    <tr>
                        <td>${row["Category"]}</td>
                        <td>${row["Item Description"]}</td>
                        <td>${formatCurrency(row["FY24 Actual"])}</td>
                        <td>${formatCurrency(row["FY25 Requested"])}</td>
                        <td>${formatCurrency(row["FY25 Actual"])}</td>
                        <td>${formatCurrency(row["FY26 Dept"])}</td>
                        <td>${formatCurrency(row["FY26 Admin"])}</td>
                        <td>${formatCurrency(row["Change ($)"])}</td>
                        <td>${row["Change (%)"]}%</td>
                    </tr>
                `;

                let fy26Value = formatCurrency(row["FY26 Admin"]).replace(/[$,]/g, "");

                if (row["Category"].includes("General Government")) {
                    generalGovTable.innerHTML += rowHTML;
                    expenditureCategories["General Government"] += parseFloat(fy26Value);
                } else if (row["Category"].includes("Public Safety")) {
                    publicSafetyTable.innerHTML += rowHTML;
                    expenditureCategories["Public Safety"] += parseFloat(fy26Value);
                } else if (row["Category"].includes("Public Works")) {
                    publicWorksTable.innerHTML += rowHTML;
                    expenditureCategories["Public Works"] += parseFloat(fy26Value);
                }
            });

            // Generate Chart
            const ctx = expenditureChartCanvas.getContext("2d");
            new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: Object.keys(expenditureCategories),
                    datasets: [{
                        data: Object.values(expenditureCategories),
                        backgroundColor: ["#66BB6A", "#42A5F5", "#FFA726"],
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

document.addEventListener("DOMContentLoaded", function () {
    console.log("Revenue script loaded.");

    const revenueCSV = "https://raw.githubusercontent.com/NBoudreauMA/Budget/main/revenue_data.csv";

    if (typeof Papa === "undefined") {
        console.error("PapaParse library is missing.");
        return;
    }

    let taxLevyTable = document.querySelector("#taxLevyTable tbody");
    let stateAidTable = document.querySelector("#stateAidTable tbody");
    let localReceiptsTable = document.querySelector("#localReceiptsTable tbody");
    let revenueChartCanvas = document.getElementById("revenueChart");

    if (!taxLevyTable || !stateAidTable || !localReceiptsTable || !revenueChartCanvas) {
        console.error("One or more revenue tables are missing in revenue.html.");
        return;
    }

    Papa.parse(revenueCSV, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
            if (!results.data || results.data.length === 0) {
                console.error("Revenue CSV is empty.");
                return;
            }

            console.log("Revenue CSV Loaded:", results.data);

            let revenueCategories = {
                "Tax Levy": 0,
                "State Aid": 0,
                "Local Receipts": 0
            };

            function formatCurrency(value) {
                if (!value) return "$0.00";
                let num = parseFloat(value.toString().replace(/[$,]/g, ""));
                return isNaN(num) ? "$0.00" : `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }

            results.data.forEach(row => {
                if (!row["Account"]) return;

                let fy26Value = parseFloat(row["FY26 Proposed"].replace(/[$,]/g, "")) || 0;

                let rowHTML = `
                    <tr>
                        <td>${row["Account"]}</td>
                        <td>${formatCurrency(row["FY23 Actual"])}</td>
                        <td>${formatCurrency(row["FY24 Actual"])}</td>
                        <td>${formatCurrency(row["FY25 Budget"])}</td>
                        <td>${formatCurrency(row["FY26 Proposed"])}</td>
                    </tr>
                `;

                if (row["Account"].includes("Tax Levy")) {
                    taxLevyTable.innerHTML += rowHTML;
                    revenueCategories["Tax Levy"] += fy26Value;
                } else if (row["Account"].includes("State Aid")) {
                    stateAidTable.innerHTML += rowHTML;
                    revenueCategories["State Aid"] += fy26Value;
                } else {
                    localReceiptsTable.innerHTML += rowHTML;
                    revenueCategories["Local Receipts"] += fy26Value;
                }
            });

            // Ensure all revenue values are numbers
            Object.keys(revenueCategories).forEach(key => {
                if (isNaN(revenueCategories[key])) revenueCategories[key] = 0;
            });

            // Generate Chart
            const ctx = revenueChartCanvas.getContext("2d");
            new Chart(ctx, {
                type: "pie",
                data: {
                    labels: Object.keys(revenueCategories),
                    datasets: [{
                        data: Object.values(revenueCategories),
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

            console.log("Revenue Chart Rendered Successfully");
        }
    });
});

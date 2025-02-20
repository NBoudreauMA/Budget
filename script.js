document.addEventListener("DOMContentLoaded", function () {
    console.log("Script loaded and DOM fully parsed.");

    const revenueCSV = "https://raw.githubusercontent.com/NBoudreauMA/Budget/main/revenue.csv";

    if (typeof Papa === "undefined") {
        console.error("PapaParse library is missing.");
        return;
    }

    // Ensure tables exist before running the script
    let taxLevyTable = document.querySelector("#taxLevyTable tbody");
    let stateAidTable = document.querySelector("#stateAidTable tbody");
    let localReceiptsTable = document.querySelector("#localReceiptsTable tbody");

    if (!taxLevyTable || !stateAidTable || !localReceiptsTable) {
        console.error("One or more revenue tables are missing in revenue.html.");
        return;
    }

    // Fetch and Parse CSV
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

            let taxTotal = 0, stateAidTotal = 0, localReceiptsTotal = 0;

            function formatCurrency(value) {
                let num = parseFloat(value.replace(/[$,]/g, ""));
                return isNaN(num) ? "$0.00" : `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }

            results.data.forEach(row => {
                if (!row["Category"]) return;

                let rowHTML = `
                    <tr>
                        <td>${row["Category"]}</td>
                        <td>${formatCurrency(row["FY23 Actual"])}</td>
                        <td>${formatCurrency(row["FY24 Actual"])}</td>
                        <td>${formatCurrency(row["FY25 Budget"])}</td>
                        <td>${formatCurrency(row["FY26 Proposed"])}</td>
                    </tr>
                `;

                let fy26Value = parseFloat(row["FY26 Proposed"].replace(/[$,]/g, "")) || 0;

                if (row["Category"].includes("Tax Levy")) {
                    taxLevyTable.innerHTML += rowHTML;
                    taxTotal += fy26Value;
                } else if (row["Category"].includes("State Aid")) {
                    stateAidTable.innerHTML += rowHTML;
                    stateAidTotal += fy26Value;
                } else if (row["Category"].includes("Local Receipts")) {
                    localReceiptsTable.innerHTML += rowHTML;
                    localReceiptsTotal += fy26Value;
                }
            });

            // Update Revenue Chart
            const ctx = document.getElementById("revenueChart").getContext("2d");
            new Chart(ctx, {
                type: "pie",
                data: {
                    labels: ["Tax Levy", "State Aid", "Local Receipts"],
                    datasets: [{
                        data: [taxTotal, stateAidTotal, localReceiptsTotal],
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
        }
    });
});

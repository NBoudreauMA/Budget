document.addEventListener("DOMContentLoaded", function () {
    console.log("Script loaded and DOM fully parsed.");

    // Ensure all table elements exist before running the script
    const taxLevyTable = document.querySelector("#taxLevyTable tbody");
    const stateAidTable = document.querySelector("#stateAidTable tbody");
    const localReceiptsTable = document.querySelector("#localReceiptsTable tbody");

    if (!taxLevyTable || !stateAidTable || !localReceiptsTable) {
        console.error("One or more revenue tables are missing in revenue.html.");
        return;
    }

    const revenueCSV = "https://raw.githubusercontent.com/NBoudreauMA/Budget/main/revenue_data.csv";

    // Ensure PapaParse is loaded
    if (typeof Papa === "undefined") {
        console.error("PapaParse library is missing.");
        return;
    }

    // Fetch and Parse CSV
    Papa.parse(revenueCSV, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
            if (!results.data || results.data.length === 0) {
                console.error("CSV is empty or failed to load.");
                return;
            }

            console.log("CSV successfully loaded:", results.data);

            let taxTotal = 0, stateAidTotal = 0, localReceiptsTotal = 0;

            function formatCurrency(value) {
                let num = parseFloat(value);
                return isNaN(num) ? "$0.00" : `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }

            results.data.forEach(row => {
                if (!row["Account"]) return;

                let rowHTML = `
                    <tr>
                        <td>${row["Account"]}</td>
                        <td>${formatCurrency(row["FY23 Actual"])}</td>
                        <td>${formatCurrency(row["FY24 Actual"])}</td>
                        <td>${formatCurrency(row["FY25 Budget"])}</td>
                        <td>${formatCurrency(row["FY26 Proposed"])}</td>
                    </tr>
                `;

                let fy26Value = parseFloat(row["FY26 Proposed"]) || 0;

                if (["Tax Levy", "Prop 2.5%", "New Growth / Amended NG", "Debt Exclusions (School Roof)"].includes(row["Account"])) {
                    taxLevyTable.innerHTML += rowHTML;
                    taxTotal += fy26Value;
                } else if (["Unrestricted General Government Aid", "Abatements to Veterans' and Blind", "State Owned Land", "Veterans' Benefits and Exemptions", "Offsets (Library)"].includes(row["Account"])) {
                    stateAidTable.innerHTML += rowHTML;
                    stateAidTotal += fy26Value;
                } else {
                    localReceiptsTable.innerHTML += rowHTML;
                    localReceiptsTotal += fy26Value;
                }
            });

            // Ensure the chart updates properly
            const ctx = document.getElementById("revenueChart").getContext("2d");
            new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: ["Tax Levy", "State Aid", "Local Receipts"],
                    datasets: [{
                        data: [taxTotal, stateAidTotal, localReceiptsTotal],
                        backgroundColor: ["#66BB6A", "#42A5F5", "#FF7043"],
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
        },
        error: function (err) {
            console.error("Error loading CSV:", err);
        }
    });

    document.querySelectorAll(".dropdown-toggle").forEach(button => {
        button.addEventListener("click", function () {
            let content = this.nextElementSibling;
            content.style.display = content.style.display === "block" ? "none" : "block";
        });
    });
});

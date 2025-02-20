document.addEventListener("DOMContentLoaded", function () {
    console.log("Revenue script loaded.");

    const revenueCSV = "https://raw.githubusercontent.com/NBoudreauMA/Budget/main/revenue_data.csv";

    if (typeof Papa === "undefined") {
        console.error("PapaParse library is missing.");
        return;
    }

    let revenueTables = {
        "Tax Levy": document.querySelector("#taxLevyTable tbody"),
        "State Aid": document.querySelector("#stateAidTable tbody"),
        "Local Receipts": document.querySelector("#localReceiptsTable tbody")
    };

    let revenueChartCanvas = document.getElementById("revenueChart");
    let grandTotalContainer = document.getElementById("grandTotal");

    if (!revenueChartCanvas || !grandTotalContainer) {
        console.error("Revenue chart canvas or total container missing.");
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
                    revenueTables["Tax Levy"].innerHTML += rowHTML;
                    revenueCategories["Tax Levy"] += fy26Value;
                } else if (row["Account"].includes("State Aid")) {
                    revenueTables["State Aid"].innerHTML += rowHTML;
                    revenueCategories["State Aid"] += fy26Value;
                } else {
                    revenueTables["Local Receipts"].innerHTML += rowHTML;
                    revenueCategories["Local Receipts"] += fy26Value;
                }
            });

            // Add subtotal rows
            Object.keys(revenueCategories).forEach(category => {
                let subtotalRow = `<tr class="subtotal"><td colspan="4"><strong>Subtotal</strong></td><td><strong>${formatCurrency(revenueCategories[category])}</strong></td></tr>`;
                revenueTables[category].innerHTML += subtotalRow;
            });

            // Calculate grand total
            let grandTotal = Object.values(revenueCategories).reduce((acc, val) => acc + val, 0);
            grandTotalContainer.innerHTML = `<h3>Grand Total: ${formatCurrency(grandTotal)}</h3>`;

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
                    layout: {
                        padding: 10
                    },
                    plugins: {
                        legend: { position: "bottom" },
                        tooltip: { enabled: true }
                    }
                }
            });

            console.log("Revenue Chart Rendered Successfully");
        }
    });

    // Collapsible Dropdown Logic
    document.querySelectorAll(".dropdown-toggle").forEach(button => {
        button.addEventListener("click", function () {
            this.nextElementSibling.classList.toggle("active");
        });
    });
});

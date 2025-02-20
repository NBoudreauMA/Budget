document.addEventListener("DOMContentLoaded", function () {
    console.log("Revenue script loaded.");

    // Mobile menu functionality
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Revenue chart initialization
    const revenueChart = document.getElementById("revenueChart");
    if (revenueChart) {
        Papa.parse("revenue_data.csv", {
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
                    "Taxes": 0,
                    "State Aid": 0,
                    "Local Receipts": 0
                };

                // Process data
                results.data.forEach(row => {
                    if (!row["Account"]) return;

                    let fy26Value = parseFloat(row["FY26 Proposed"]?.replace(/[$,]/g, "")) || 0;

                    if (row["Account"].includes("Tax") || row["Account"].includes("Growth")) {
                        revenueCategories["Taxes"] += fy26Value;
                    } else if (row["Account"].includes("Aid") || row["Account"].includes("State")) {
                        revenueCategories["State Aid"] += fy26Value;
                    } else {
                        revenueCategories["Local Receipts"] += fy26Value;
                    }
                });

                // Update grand total
                const grandTotal = Object.values(revenueCategories).reduce((a, b) => a + b, 0);
                const grandTotalElement = document.getElementById("grandTotal");
                if (grandTotalElement) {
                    grandTotalElement.innerHTML = `<h3>Total Revenue: ${formatCurrency(grandTotal)}</h3>`;
                }

                // Render chart
                const ctx = revenueChart.getContext("2d");
                new Chart(ctx, {
                    type: "pie",
                    data: {
                        labels: Object.keys(revenueCategories),
                        datasets: [{
                            data: Object.values(revenueCategories),
                            backgroundColor: ["#66BB6A", "#42A5F5", "#FFA726"]
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { position: "bottom" },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        const value = context.raw;
                                        const percentage = ((value / grandTotal) * 100).toFixed(1);
                                        return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
                                    }
                                }
                            }
                        }
                    }
                });
            }
        });
    }
});

// Helper function to format currency
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

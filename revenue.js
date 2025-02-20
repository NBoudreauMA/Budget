document.addEventListener("DOMContentLoaded", function() {
    // Mobile menu functionality
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Load and process CSV data
    Papa.parse("revenue_data.csv", {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            if (!results.data || results.data.length === 0) {
                console.error("Revenue CSV is empty or invalid");
                return;
            }

            const revenueData = processRevenueData(results.data);
            renderRevenueChart(revenueData);
            populateRevenueTables(results.data);
        },
        error: function(error) {
            console.error("Error loading revenue data:", error);
        }
    });
});

function processRevenueData(data) {
    const categories = {
        "Taxes": 0,
        "State Aid": 0,
        "Local Receipts": 0
    };

    const taxItems = ["Tax Levy", "Prop 2.5%", "New Growth", "Debt Exclusions"];
    const stateAidItems = ["Unrestricted General Government Aid", "Abatements", "State Owned Land", "Veterans' Benefits"];

    data.forEach(row => {
        if (!row["Account"] || !row["FY26 Proposed"]) return;

        const amount = parseFloat(row["FY26 Proposed"].replace(/[$,]/g, "")) || 0;
        const account = row["Account"].trim();

        if (taxItems.some(item => account.includes(item))) {
            categories["Taxes"] += amount;
        } else if (stateAidItems.some(item => account.includes(item))) {
            categories["State Aid"] += amount;
        } else {
            categories["Local Receipts"] += amount;
        }
    });

    return categories;
}

function renderRevenueChart(categories) {
    const ctx = document.getElementById("revenueChart").getContext("2d");
    const totalRevenue = Object.values(categories).reduce((a, b) => a + b, 0);

    new Chart(ctx, {
        type: "pie",
        data: {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories),
                backgroundColor: ["#4CAF50", "#2196F3", "#FFC107"],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        padding: 20
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const percentage = ((value / totalRevenue) * 100).toFixed(1);
                            return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });

    // Update grand total display
    const grandTotalElement = document.getElementById("grandTotal");
    if (grandTotalElement) {
        grandTotalElement.innerHTML = `<h3>Total Revenue: ${formatCurrency(totalRevenue)}</h3>`;
    }
}

function populateRevenueTables(data) {
    const tables = {
        taxes: document.querySelector("#taxesTable tbody"),
        stateAid: document.querySelector("#stateAidTable tbody"),
        localReceipts: document.querySelector("#localReceiptsTable tbody")
    };

    // Clear existing table content
    Object.values(tables).forEach(table => {
        if (table) table.innerHTML = "";
    });

    // Helper function to categorize revenue items
    function getCategory(account) {
        const taxItems = ["Tax Levy", "Prop 2.5%", "New Growth", "Debt Exclusions"];
        const stateAidItems = ["Unrestricted General Government Aid", "Abatements", "State Owned Land", "Veterans' Benefits"];

        if (taxItems.some(item => account.includes(item))) return "taxes";
        if (stateAidItems.some(item => account.includes(item))) return "stateAid";
        return "localReceipts";
    }

    // Populate tables
    data.forEach(row => {
        if (!row["Account"]) return;

        const category = getCategory(row["Account"]);
        const table = tables[category];
        if (!table) return;

        const fy25Budget = parseFloat(row["FY25 Budget"]?.replace(/[$,]/g, "")) || 0;
        const fy26Proposed = parseFloat(row["FY26 Proposed"]?.replace(/[$,]/g, "")) || 0;
        const percentChange = fy25Budget ? ((fy26Proposed - fy25Budget) / fy25Budget * 100).toFixed(1) : "N/A";

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${row["Account"]}</td>
            <td>${formatCurrency(parseFloat(row["FY23 Actual"]?.replace(/[$,]/g, "")) || 0)}</td>
            <td>${formatCurrency(parseFloat(row["FY24 Actual"]?.replace(/[$,]/g, "")) || 0)}</td>
            <td>${formatCurrency(fy25Budget)}</td>
            <td>${formatCurrency(fy26Proposed)}</td>
            <td>${percentChange}%</td>
        `;
        table.appendChild(tr);
    });

    // Add subtotal rows
    Object.entries(tables).forEach(([category, table]) => {
        if (!table) return;

        const rows = table.querySelectorAll("tr");
        let subtotal = 0;
        rows.forEach(row => {
            const fy26Cell = row.cells[4];
            if (fy26Cell) {
                subtotal += parseFloat(fy26Cell.textContent.replace(/[$,]/g, "")) || 0;
            }
        });

        const subtotalRow = document.createElement("tr");
        subtotalRow.className = "subtotal";
        subtotalRow.innerHTML = `
            <td><strong>Subtotal</strong></td>
            <td colspan="3"></td>
            <td><strong>${formatCurrency(subtotal)}</strong></td>
            <td></td>
        `;
        table.appendChild(subtotalRow);
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

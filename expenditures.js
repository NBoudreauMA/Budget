document.addEventListener("DOMContentLoaded", function () {
    console.log("Expenditures script loaded.");

    // Mobile menu functionality
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Get filter elements
    const yearFilter = document.getElementById('yearFilter');
    const departmentFilter = document.getElementById('departmentFilter');
    let globalData = null;

    // Load CSV file
    Papa.parse("expenditures_cleaned.csv", {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: function (results) {
            console.log("Expenditures CSV Loaded:", results.data);
            globalData = results.data;
            processAndDisplayData();

            // Add filter event listeners
            yearFilter.addEventListener('change', processAndDisplayData);
            departmentFilter.addEventListener('change', processAndDisplayData);
        }
    });

    function processAndDisplayData() {
        const selectedYear = yearFilter.value;
        const selectedDept = departmentFilter.value;
        
        // Get column name for selected year
        const yearColumn = {
            'FY26': 'FY26 ADMIN',
            'FY25': 'FY25 BUDGET',
            'FY24': 'FY24 ACTUAL',
            'FY23': 'FY23 ACTUAL'
        }[selectedYear];

        let categoryTotals = {};
        let departmentData = {};

        // Process data
        globalData.forEach(row => {
            if (!row.Category || !row[yearColumn]) return;

            const category = row.Category.trim();
            const department = row.Department?.trim() || 'Uncategorized';
            const amount = parseFloat(row[yearColumn]) || 0;

            // Skip if filtering by department and doesn't match
            if (selectedDept !== 'all' && category.replace(/\s+/g, '') !== selectedDept) {
                return;
            }

            // Aggregate totals
            if (!categoryTotals[category]) {
                categoryTotals[category] = 0;
            }
            categoryTotals[category] += amount;

            // Store department data
            if (!departmentData[category]) {
                departmentData[category] = [];
            }
            departmentData[category].push({
                department: department,
                amount: amount,
                fy23: parseFloat(row["FY23 ACTUAL"]) || 0,
                fy24: parseFloat(row["FY24 ACTUAL"]) || 0,
                fy25: parseFloat(row["FY25 BUDGET"]) || 0,
                fy26: parseFloat(row["FY26 ADMIN"]) || 0
            });
        });

        // Update visualizations
        renderExpenditureChart(categoryTotals);
        renderDepartmentTables(departmentData, yearColumn);

        // Update visibility based on filter
        document.querySelectorAll('.department-section').forEach(section => {
            if (selectedDept === 'all' || section.id === selectedDept) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
    }

    function renderExpenditureChart(categoryTotals) {
        const ctx = document.getElementById("expenditureChart").getContext("2d");
        const totalExpenditure = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

        // Update grand total
        document.getElementById('grandTotal').innerHTML = 
            `<h3>Total Budget: ${formatCurrency(totalExpenditure)}</h3>`;

        // Destroy existing chart if it exists
        if (window.expenditureChart) {
            window.expenditureChart.destroy();
        }

        window.expenditureChart = new Chart(ctx, {
            type: "pie",
            data: {
                labels: Object.keys(categoryTotals),
                datasets: [{
                    data: Object.values(categoryTotals),
                    backgroundColor: [
                        "#4CAF50", "#2196F3", "#FFC107", "#9C27B0", 
                        "#FF5722", "#607D8B", "#795548", "#E91E63"
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "bottom"
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.raw;
                                const percentage = ((value / totalExpenditure) * 100).toFixed(1);
                                return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    function renderDepartmentTables(departmentData, yearColumn) {
        Object.entries(departmentData).forEach(([category, departments]) => {
            const sectionId = category.replace(/\s+/g, "");
            const section = document.getElementById(sectionId);
            
            if (!section) {
                console.warn(`No section found for category: ${category}`);
                return;
            }

            // Clear existing table
            const existingTable = section.querySelector('table');
            if (existingTable) {
                existingTable.remove();
            }

            // Create new table
            const table = document.createElement("table");
            table.className = "data-table";

            // Add header
            const thead = document.createElement("thead");
            thead.innerHTML = `
                <tr>
                    <th>Department</th>
                    <th>Amount</th>
                    <th>% of Category</th>
                </tr>
            `;
            table.appendChild(thead);

            // Add body
            const tbody = document.createElement("tbody");
            const categoryTotal = departments.reduce((sum, dept) => sum + dept.amount, 0);

            // Sort departments by amount
            departments.sort((a, b) => b.amount - a.amount);

            departments.forEach(dept => {
                const percentOfCategory = ((dept.amount / categoryTotal) * 100).toFixed(1);
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${dept.department}</td>
                    <td>${formatCurrency(dept.amount)}</td>
                    <td>${percentOfCategory}%</td>
                `;
                tbody.appendChild(row);
            });

            // Add total row
            const totalRow = document.createElement("tr");
            totalRow.className = "category-total";
            totalRow.innerHTML = `
                <td><strong>Total</strong></td>
                <td><strong>${formatCurrency(categoryTotal)}</strong></td>
                <td><strong>100%</strong></td>
            `;
            tbody.appendChild(totalRow);

            table.appendChild(tbody);
            section.appendChild(table);
        });
    }
});

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

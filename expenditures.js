document.addEventListener("DOMContentLoaded", async function() {
    console.log("Script starting...");

    // Get filter elements
    const yearFilter = document.getElementById('yearFilter');
    const departmentFilter = document.getElementById('departmentFilter');
    let globalData = null;

    try {
        // Load the CSV file
        const fileContent = await window.fs.readFile('expenditures_cleaned.csv', { encoding: 'utf8' });
        console.log("File loaded");

        // Parse CSV
        Papa.parse(fileContent, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: function(results) {
                console.log("CSV parsed successfully");
                globalData = results.data;
                processAndDisplayData();

                // Add event listeners
                yearFilter.addEventListener('change', processAndDisplayData);
                departmentFilter.addEventListener('change', processAndDisplayData);
            }
        });
    } catch (error) {
        console.error("Error loading file:", error);
    }

    function processAndDisplayData() {
        if (!globalData) return;

        const selectedYear = yearFilter.value;
        const selectedDept = departmentFilter.value;
        
        const yearColumn = selectedYear === 'FY26' ? 'FY26 ADMIN' : 
                          selectedYear === 'FY25' ? 'FY25 BUDGET' : 
                          `${selectedYear} ACTUAL`;

        let categoryTotals = {};

        // Process data
        globalData.forEach(row => {
            if (!row.Category) return;

            const category = row.Category.trim();
            const amount = parseFloat(row[yearColumn]) || 0;

            // Skip if filtering by department and doesn't match
            if (selectedDept !== 'all' && category.replace(/\s+/g, '') !== selectedDept) {
                return;
            }

            // Aggregate by category
            if (!categoryTotals[category]) {
                categoryTotals[category] = 0;
            }
            categoryTotals[category] += amount;
        });

        // Update chart
        updateChart(categoryTotals);

        // Update tables
        Object.entries(categoryTotals).forEach(([category, total]) => {
            const sectionId = category.replace(/\s+/g, '');
            const section = document.getElementById(sectionId);
            
            if (section) {
                // Clear existing content
                while (section.children.length > 1) { // Keep the h2
                    section.removeChild(section.lastChild);
                }

                // Create table
                const table = document.createElement('table');
                table.className = 'data-table';
                table.innerHTML = `
                    <thead>
                        <tr>
                            <th>Total</th>
                            <th>${formatCurrency(total)}</th>
                        </tr>
                    </thead>
                `;
                section.appendChild(table);
            }
        });

        // Show/hide sections based on filter
        document.querySelectorAll('.department-section').forEach(section => {
            section.style.display = 
                (selectedDept === 'all' || section.id === selectedDept) ? 'block' : 'none';
        });
    }

    function updateChart(data) {
        const ctx = document.getElementById('expenditureChart').getContext('2d');
        const total = Object.values(data).reduce((a, b) => a + b, 0);

        // Update total budget
        document.getElementById('totalBudget').textContent = 
            `Total Budget: ${formatCurrency(total)}`;

        // Create/update chart
        if (window.budgetChart) {
            window.budgetChart.destroy();
        }

        window.budgetChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(data),
                datasets: [{
                    data: Object.values(data),
                    backgroundColor: [
                        '#4CAF50', '#2196F3', '#FFC107', '#9C27B0',
                        '#FF5722', '#607D8B', '#795548', '#E91E63'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.raw;
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
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

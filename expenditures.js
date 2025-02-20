document.addEventListener("DOMContentLoaded", function() {
    // Mobile menu functionality
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Initialize filters
    const yearFilter = document.getElementById('yearFilter');
    const departmentFilter = document.getElementById('departmentFilter');
    let globalData = null;

    // Load CSV data
    Papa.parse("expenditures_cleaned.csv", {
        download: true,
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function(results) {
            console.log("Expenditures data loaded");
            globalData = results.data;
            processAndDisplayData(globalData);

            // Add filter event listeners
            yearFilter.addEventListener('change', () => processAndDisplayData(globalData));
            departmentFilter.addEventListener('change', () => processAndDisplayData(globalData));
        },
        error: function(error) {
            console.error("Error loading expenditures data:", error);
        }
    });

    // Handle hash changes for department navigation
    window.addEventListener('hashchange', function() {
        const dept = window.location.hash.slice(1);
        if (dept) {
            departmentFilter.value = dept;
            processAndDisplayData(globalData);
        }
    });
});

function processAndDisplayData(data) {
    if (!data) return;

    const selectedYear = document.getElementById('yearFilter').value;
    const selectedDept = document.getElementById('departmentFilter').value;
    
    // Get the column name for the selected year
    const yearColumn = {
        'FY26': 'FY26 ADMIN',
        'FY25': 'FY25 BUDGET',
        'FY24': 'FY24 ACTUAL',
        'FY23': 'FY23 ACTUAL'
    }[selectedYear];

    // Process data by department and category
    let processedData = {
        byCategory: {},
        byDepartment: {}
    };

    data.forEach(row => {
        if (!row.Category || !row.Department) return;

        const category = row.Category.trim();
        const department = row.Department.trim();
        const amount = parseFloat(row[yearColumn]) || 0;

        // Skip if department doesn't match filter (unless "all" is selected)
        if (selectedDept !== 'all' && category.replace(/\s+/g, '') !== selectedDept) {
            return;
        }

        // Aggregate by category
        if (!processedData.byCategory[category]) {
            processedData.byCategory[category] = 0;
        }
        processedData.byCategory[category] += amount;

        // Aggregate by department
        if (!processedData.byDepartment[category]) {
            processedData.byDepartment[category] = {};
        }
        if (!processedData.byDepartment[category][department]) {
            processedData.byDepartment[category][department] = {
                amount: 0,
                previousAmount: 0
            };
        }
        processedData.byDepartment[category][department].amount += amount;
    });

    // Update visualizations
    updateChart(processedData.byCategory);
    updateTables(processedData.byDepartment, yearColumn);
}

function updateChart(categoryData) {
    const ctx = document.getElementById('expenditureChart').getContext('2d');
    const totalExpenditure = Object.values(categoryData).reduce((a, b) => a + b, 0);

    // Sort categories by amount (descending)
    const sortedCategories = Object.entries(categoryData)
        .sort(([,a], [,b]) => b - a);

    // Create the chart
    if (window.expenditureChart) {
        window.expenditureChart.destroy();
    }

    window.expenditureChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: sortedCategories.map(([category]) => category),
            datasets: [{
                data: sortedCategories.map(([,amount]) => amount),
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
                    position: 'bottom',
                    labels: {
                        padding: 20
                    }
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

    // Update grand total
    const grandTotalElement = document.getElementById('grandTotal');
    if (grandTotalElement) {
        grandTotalElement.innerHTML = `<h3>Total Expenditures: ${formatCurrency(totalExpenditure)}</h3>`;
    }
}

function updateTables(departmentData, yearColumn) {
    // Clear existing tables
    document.querySelectorAll('.department-section').forEach(section => {
        // Keep the h2 title, remove everything else
        const title = section.querySelector('h2');
        section.innerHTML = '';
        if (title) section.appendChild(title);
    });

    // Create new tables
    Object.entries(departmentData).forEach(([category, departments]) => {
        const sectionId = category.replace(/\s+/g, '');
        const section = document.getElementById(sectionId);
        if (!section) return;

        const table = document.createElement('table');
        table.className = 'data-table';

        // Create header
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Department</th>
                <th>Amount</th>
                <th>% of Category</th>
            </tr>
        `;
        table.appendChild(thead);

        // Create body
        const tbody = document.createElement('tbody');
        const categoryTotal = Object.values(departments)
            .reduce((sum, dept) => sum + dept.amount, 0);

        // Sort departments by amount
        const sortedDepartments = Object.entries(departments)
            .sort(([,a], [,b]) => b.amount - a.amount);

        sortedDepartments.forEach(([dept, data]) => {
            const percentage = ((data.amount / categoryTotal) * 100).toFixed(1);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${dept}</td>
                <td>${formatCurrency(data.amount)}</td>
                <td>${percentage}%</td>
            `;
            tbody.appendChild(row);
        });

        // Add total row
        const totalRow = document.createElement('tr');
        totalRow.className = 'category-total';
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

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

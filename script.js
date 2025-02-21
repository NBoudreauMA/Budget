// Wait for DOM content to load before running scripts
document.addEventListener("DOMContentLoaded", function () {
    
    // 📌 Mobile Menu Toggle
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });

    // 📌 Section Toggle Functionality
    function toggleSection(button) {
        const content = button.nextElementSibling;
        content.classList.toggle("hidden");
    }

    const toggleButtons = document.querySelectorAll(".toggle-box");
    toggleButtons.forEach(button => {
        button.addEventListener("click", function () {
            toggleSection(this);
        });
    });

    // 📌 Revenue Chart
    const revenueCtx = document.getElementById("revenueChart").getContext("2d");
    new Chart(revenueCtx, {
        type: "bar",
        data: {
            labels: ["Tax Levy", "State Aid", "Local Receipts"],
            datasets: [{
                label: "Revenue Sources ($M)",
                data: [9.2, 2.5, 1.8], // Replace with actual data
                backgroundColor: ["#2a7d2e", "#1e5b24", "#ffd700"],
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true } }
        }
    });

    // 📌 Expenditure Chart
    const expenditureCtx = document.getElementById("expenditureChart").getContext("2d");
    new Chart(expenditureCtx, {
        type: "pie",
        data: {
            labels: ["Public Safety", "Education", "Public Works", "General Gov"],
            datasets: [{
                label: "Expenditure Breakdown",
                data: [4.5, 10.2, 3.1, 2.4], // Replace with actual data
                backgroundColor: ["#ff6b6b", "#4c91af", "#f4b400", "#8bc34a"],
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

});

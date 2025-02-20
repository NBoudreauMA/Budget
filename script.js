document.addEventListener("DOMContentLoaded", function () {
    // Auto-update year dynamically
    document.getElementById("year").innerText = new Date().getFullYear();
    document.getElementById("yearFooter").innerText = new Date().getFullYear();
    document.getElementById("footerYear").innerText = new Date().getFullYear();

    // Dark Mode Toggle with Local Storage
    const darkModeToggle = document.getElementById("darkModeToggle");
    const body = document.body;

    if (localStorage.getItem("dark-mode") === "enabled") {
        body.classList.add("dark-mode");
    }

    darkModeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
        if (body.classList.contains("dark-mode")) {
            localStorage.setItem("dark-mode", "enabled");
        } else {
            localStorage.setItem("dark-mode", "disabled");
        }
    });

    // Back to Top Button
    const backToTop = document.getElementById("backToTop");
    window.addEventListener("scroll", () => {
        backToTop.style.display = window.scrollY > 200 ? "block" : "none";
    });
    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // FAQ Toggle Animation
    document.querySelectorAll(".faq-item h3").forEach((question) => {
        question.addEventListener("click", () => {
            const answer = question.nextElementSibling;
            answer.classList.toggle("faq-answer");
            answer.style.display = answer.style.display === "block" ? "none" : "block";
            question.classList.toggle("active");
        });
    });

    // Intersection Observer for Scroll Animations
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll(".fade-in").forEach(element => {
        observer.observe(element);
    });

    // Budget Chart with Smooth Animations
    const budgetChart = document.getElementById("budgetChart");
    if (budgetChart) {
        const ctx = budgetChart.getContext("2d");
        new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: ["Revenue", "Expenditures", "Investments"],
                datasets: [{
                    data: [5000000, 4800000, 700000],
                    backgroundColor: ["#66BB6A", "#FF7043", "#42A5F5"],
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: "bottom" },
                    tooltip: { enabled: true }
                }
            }
        });
    }
});

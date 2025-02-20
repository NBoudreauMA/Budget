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
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("td").forEach(td => {
        let term = td.innerText.trim();
        let tooltipTexts = {
            "Prop 2.5%": "A Massachusetts law limiting how much property tax can increase annually.",
            "New Growth / Amended NG": "Revenue from new construction, renovations, or changes to taxable property.",
            "Debt Exclusions (School Roof)": "Temporary tax increases to fund specific projects, like a school roof.",
            "Unrestricted General Government Aid": "State funds that can be used flexibly for town operations.",
            "PILOT": "Payments in Lieu of Taxes—funds from tax-exempt properties (e.g., state-owned land).",
            "Motor Vehicle Excise": "A tax on registered vehicles in town, calculated based on value.",
            "Local Option Taxes": "Optional taxes approved by the town, such as meals or hotel taxes."
        };

        if (tooltipTexts[term]) {
            td.innerHTML += ` <span class="info-icon" title="${tooltipTexts[term]}">ℹ️</span>`;
        }
    });
});

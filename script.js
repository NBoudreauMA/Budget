document.addEventListener("DOMContentLoaded", function () {
    // Auto-update year
    document.getElementById("year").innerText = new Date().getFullYear();
    document.getElementById("yearFooter").innerText = new Date().getFullYear();
    document.getElementById("footerYear").innerText = new Date().getFullYear();

    // Dark Mode Toggle
    const darkModeToggle = document.getElementById("darkModeToggle");
    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });

    // Back to Top Button
    const backToTop = document.getElementById("backToTop");
    window.addEventListener("scroll", () => {
        backToTop.style.display = window.scrollY > 200 ? "block" : "none";
    });
    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // FAQ Toggle
    document.querySelectorAll(".faq-item h3").forEach((question) => {
        question.addEventListener("click", () => {
            question.nextElementSibling.classList.toggle("faq-answer");
            question.nextElementSibling.style.display =
                question.nextElementSibling.style.display === "block" ? "none" : "block";
        });
    });
});
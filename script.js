document.addEventListener("DOMContentLoaded", function () {
    console.log("Expenditures script loaded.");

    const expendituresCSV = "https://raw.githubusercontent.com/NBoudreauMA/Budget/main/expenditures_cleaned.csv";

    // Ensure PapaParse is loaded
    if (typeof Papa === "undefined") {
        console.error("PapaParse library is missing.");
        return;
    }

    // Fetch and Parse CSV
    Papa.parse(expendituresCSV, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
            if (!results.data || results.data.length === 0) {
                console.error("CSV is empty or failed to load.");
                return;
            }

            console.log("Expenditures CSV successfully loaded:", results.data);

            let generalGovTable = document.querySelector("#generalGovTable tbody");
            let publicSafetyTable = document.querySelector("#publicSafetyTable tbody");

            let govTotal = 0, safetyTotal = 0;

            function formatCurrency(value) {
                let num = parseFloat(value.replace(/[$,]/g, ""));
                return isNaN(num) ? "$0.00" : `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }

            results.data.forEach(row => {
                if (!row["Category"]) return;

                let rowHTML = `
                    <tr>
                        <td>${row["Category"]}</td>
                        <td>${row["Item Description"]}</td>
                        <td>${formatCurrency(row["FY24 ACTUAL"])}</td>
                        <td>${formatCurrency(row["FY25 REQUESTED"])}</td>
                        <td>${formatCurrency(row["FY25 ACTUAL"])}</td>
                        <td>${formatCurrency(row["FY26 DEPT"])}</td>
                        <td>${formatCurrency(row["FY26 ADMIN"])}</td>
                        <td>${formatCurrency(row["CHANGE ($)"])}</td>
                        <td>${row["CHANGE (%)"]}</td>
                    </tr>
                `;

                let fy26Value = parseFloat(row["FY26 ADMIN"].replace(/[$,]/g, "")) || 0;

                if (row["Category"].includes("General Government")) {
                    generalGovTable.innerHTML += rowHTML;
                    govTotal += fy26Value;
                } else if (row["Category"].includes("Public Safety")) {
                    publicSafetyTable.innerHTML += rowHTML;
                    safetyTotal += fy26Value;
                }
            });

            // Ensure the chart updates properly
            const ctx = document.getElementById("expenditureChart").getContext("2d");
            new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: ["General Government", "Public Safety"],
                    datasets: [{
                        data: [govTotal, safetyTotal],
                        backgroundColor: ["#FF7043", "#42A5F5"],
                        hoverOffset: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: "bottom" },
                        tooltip: { enabled: true }
                    }
                }
            });
        },
        error: function (err) {
            console.error("Error loading CSV:", err);
        }
    });

    document.querySelectorAll(".dropdown-toggle").forEach(button => {
        button.addEventListener("click", function () {
            let content = this.nextElementSibling;
            content.style.display = content.style.display === "block" ? "none" : "block";
        });
    });
});

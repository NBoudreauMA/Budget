document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Expenditures script loaded.");

    const expenditureContainer = document.getElementById("expenditureContainer");
    if (!expenditureContainer) {
        console.error("❌ No container found for expenditures.");
        return;
    }

    fetch("expenditures_cleaned.csv")
        .then(response => response.text())
        .then(csvData => {
            Papa.parse(csvData, {
                header: true,
                skipEmptyLines: true,
                complete: function (results) {
                    console.log("✅ Expenditures CSV Loaded:", results.data);
                    renderExpenditureTable(results.data);
                }
            });
        })
        .catch(error => console.error("❌ Error loading CSV:", error));

    function renderExpenditureTable(data) {
        if (!data.length) {
            console.error("❌ No data found in CSV.");
            expenditureContainer.innerHTML = "<p>No expenditure data available.</p>";
            return;
        }

        let tableHTML = `
            <table class="expenditure-table">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Department</th>
                        <th>Item</th>
                        <th>FY24 Actual</th>
                        <th>FY25 Requested</th>
                        <th>FY25 Actual</th>
                        <th>FY26 Dept</th>
                        <th>FY26 Admin</th>
                        <th>Change ($)</th>
                        <th>Change (%)</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.forEach(row => {
            tableHTML += `
                <tr>
                    <td>${row["Category"] || "-"}</td>
                    <td>${row["Item Description"] || "-"}</td>
                    <td>${row["Account Number"] || "-"}</td>
                    <td>${row["FY24 ACTUAL"] || "-"}</td>
                    <td>${row["FY25 REQUESTED"] || "-"}</td>
                    <td>${row["FY25 ACTUAL"] || "-"}</td>
                    <td>${row["FY26 DEPT"] || "-"}</td>
                    <td>${row["FY26 ADMIN"] || "-"}</td>
                    <td>${row["CHANGE ($)"] || "-"}</td>
                    <td>${row["CHANGE (%)"] || "-"}</td>
                </tr>
            `;
        });

        tableHTML += `</tbody></table>`;
        expenditureContainer.innerHTML = tableHTML;

        console.log("✅ Table Rendered Successfully");
    }
});

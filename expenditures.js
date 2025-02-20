<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Expenditures | Hubbardston Budget</title>
    <link rel="stylesheet" href="styles.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="expenditures.js" defer></script>
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <a href="index.html">
                    <img src="hubbardston_logo.png" alt="Town of Hubbardston">
                </a>
            </div>
            <ul class="nav-links">
                <li><a href="index.html">Home</a></li>
                <li><a href="revenue.html">Revenue</a></li>
                <li><a href="expenditures.html" class="active">Expenditures</a></li>
                <li><a href="information.html">Information</a></li>
                <li class="dropdown">
                    <a href="#">Departments ▼</a>
                    <ul class="dropdown-menu">
                        <li><a href="#GeneralGovernment">General Government</a></li>
                        <li><a href="#PublicSafety">Public Safety</a></li>
                        <li><a href="#PublicWorks">Public Works</a></li>
                        <li><a href="#Education">Education</a></li>
                    </ul>
                </li>
            </ul>
            <div class="hamburger-menu">
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
            </div>
        </div>
    </nav>

    <main class="main-content">
        <h1 class="text-center mb-2">Town Expenditures</h1>

        <div class="chart-container">
            <canvas id="expenditureChart"></canvas>
        </div>

        <section id="grandTotal" class="text-center mb-2"></section>

        <div class="expenditure-sections">
            <!-- Make sure these IDs match exactly with your CSV categories -->
            <section id="GeneralGovernment" class="department-section">
                <h2>General Government</h2>
            </section>

            <section id="PublicSafety" class="department-section">
                <h2>Public Safety</h2>
            </section>

            <section id="PublicWorks" class="department-section">
                <h2>Public Works</h2>
            </section>

            <section id="Education" class="department-section">
                <h2>Education</h2>
            </section>

            <section id="HumanServices" class="department-section">
                <h2>Human Services</h2>
            </section>

            <section id="CultureandRecreation" class="department-section">
                <h2>Culture and Recreation</h2>
            </section>

            <section id="DebtService" class="department-section">
                <h2>Debt Service</h2>
            </section>

            <section id="Unclassified" class="department-section">
                <h2>Other Expenses</h2>
            </section>
        </div>
    </main>

    <footer>
        <p>&copy; 2025 Town of Hubbardston</p>
    </footer>
</body>
</html>

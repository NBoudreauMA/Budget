/* Navigation */
.navbar {
    background: #165a22;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-logo img {
    height: 40px;
}

.nav-links {
    display: flex;
    gap: 2rem;
}

.nav-links a {
    color: white;
    text-decoration: none;
    font-weight: 500;
}

/* Main Content */
.main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

h1 {
    text-align: center;
    color: #333;
    margin-bottom: 2rem;
}

/* Filters */
.filters {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
}

.filters select {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
}

/* Chart Container */
.chart-container {
    background: white;
    border-radius: 8px;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    height: 400px;
}

/* Total Budget */
.total-budget {
    text-align: center;
    font-size: 1.25rem;
    font-weight: bold;
    margin: 2rem 0;
}

/* Department Sections */
.department-sections section {
    margin-bottom: 2rem;
}

.department-sections h2 {
    color: #333;
    border-bottom: 1px solid #ddd;
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
}

/* Data Tables */
.data-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
}

.data-table th,
.data-table td {
    padding: 0.75rem;
    border: 1px solid #ddd;
    text-align: left;
}

.data-table th {
    background: #165a22;
    color: white;
}

.data-table tr:nth-child(even) {
    background: #f9f9f9;
}

/* Footer */
footer {
    background: #165a22;
    color: white;
    text-align: center;
    padding: 1rem;
    position: fixed;
    bottom: 0;
    width: 100%;
}

/* Responsive Design */
@media (max-width: 768px) {
    .nav-links {
        display: none;
    }
    
    .filters {
        flex-direction: column;
    }
    
    .main-content {
        padding: 1rem;
    }
}

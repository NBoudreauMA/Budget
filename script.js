/* General Styles */
body {
    font-family: 'Poppins', sans-serif;
    margin: 0;
    padding: 0;
    background: linear-gradient(to right, #1b3d1a, #0e2910);
    color: #d4d4d4;
    transition: background 0.3s, color 0.3s;
}

/* Dark Mode */
.dark-mode {
    background: linear-gradient(to right, #0f1e0f, #09150a);
    color: #fff;
}

/* Header */
header {
    background: rgba(34, 73, 40, 0.9);
    color: white;
    text-align: center;
    padding: 20px;
    position: sticky;
    top: 0;
    z-index: 1000;
    backdrop-filter: blur(10px);
    transition: background 0.3s;
}

nav ul {
    list-style: none;
    padding: 0;
    text-align: center;
}

nav ul li {
    display: inline;
    margin: 0 15px;
}

nav ul li a {
    color: white;
    text-decoration: none;
    font-weight: bold;
    padding: 10px 15px;
    border-radius: 5px;
    transition: all 0.3s ease;
}

nav ul li a:hover {
    background: rgba(100, 255, 100, 0.2);
    color: #b2ff59;
    box-shadow: 0px 0px 8px rgba(100, 255, 100, 0.5);
}

/* Dark Mode Toggle */
#darkModeToggle {
    position: absolute;
    top: 10px;
    right: 20px;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid white;
    color: white;
    padding: 10px 15px;
    cursor: pointer;
    border-radius: 50%;
    font-size: 1.2em;
    transition: all 0.3s ease-in-out;
}

#darkModeToggle:hover {
    background: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 10px white;
}

/* Hero Section - Background Image */
.hero {
    background: url('https://raw.githubusercontent.com/NBoudreauMA/Budget/refs/heads/main/hubbardston_bg.jpg') no-repeat center center/cover;
    color: white;
    text-align: center;
    padding: 150px 20px;
    font-size: 1.5em;
    text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
    position: relative;
}

/* Dark Green Overlay */
.hero::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(34, 73, 40, 0.7); /* Dark green overlay */
    z-index: 1;
}

/* Ensure text appears above the overlay */
.hero h2, .hero p, .cta-button {
    position: relative;
    z-index: 2;
}

/* Budget Highlights */
.highlights {
    text-align: center;
    padding: 40px 20px;
}

.highlights h2 {
    color: #66BB6A;
}

.grid {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
}

.card {
    background: rgba(50, 80, 50, 0.6);
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0, 255, 127, 0.3);
    text-align: center;
    width: 280px;
    backdrop-filter: blur(10px);
    transition: transform 0.3s ease-in-out, box-shadow 0.3s;
}

.card:hover {
    transform: scale(1.08);
    box-shadow: 0px 0px 15px rgba(0, 255, 127, 0.6);
}

/* Back to Top Button */
#backToTop {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #43A047;
    color: white;
    padding: 12px;
    border-radius: 50%;
    font-size: 1.2em;
    cursor: pointer;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    display: none;
    transition: all 0.3s ease;
}

#backToTop:hover {
    background: #1B5E20;
    box-shadow: 0px 0px 10px white;
}

/* Footer */
footer {
    background: rgba(34, 34, 34, 0.9);
    color: white;
    text-align: center;
    padding: 20px;
    position: relative;
    backdrop-filter: blur(5px);
    border-top: 2px solid #66BB6A;
}

/* Animations */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
}

.fade-in {
    opacity: 0;
    transform: translateY(20px);
   

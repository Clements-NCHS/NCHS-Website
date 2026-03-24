/**
 * NCHS CONFIGURATION
 * 1. Go to Google Sheets > File > Share > Publish to Web.
 * 2. Select the specific TAB (e.g., 'Points' or 'Links').
 * 3. Select 'Comma-separated values (.csv)' and copy that link here.
 */
const POINTS_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRSrH6qtj6WXXjVE7uILcCMkXa5v5c6XOfreCW1fpA89NtOJnluORdg_G24PoC2CDBYTutOYcjHU5pu/pub?output=csv";
const HOME_LINKS_CSV = "";

/**
 * 1. PAGE NAVIGATOR
 * This function hides all content sections and only shows the one requested.
 */
function showPage(pageId) {
    // Hide all sections with the class 'page-content'
    const sections = document.querySelectorAll('.page-content');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Show the section that matches the clicked ID
    const activePage = document.getElementById(pageId);
    if (activePage) {
        activePage.style.display = 'block';
    }
    const decors = document.querySelectorAll('.toggle-decor');
    
    if (pageId === 'points-page') { 
        decors.forEach(d => d.style.display = 'none');
    } else {
        decors.forEach(d => d.style.display = 'block');
    }
    // Special triggers: load data only when the user visits those pages
    if (pageId === 'points-page') {
        loadPointsData();
    }
    
    // Always scroll to the top when switching pages
    window.scrollTo(0, 0);
}

/**
 * 2. LIVE POINTS TAB
 * Fetches the 'Points' tab from Google Sheets and builds a table.
 */
async function loadPointsData() {
    const container = document.getElementById('points-table-target');
    container.innerHTML = "<p>Loading latest points...</p>";

    try {
        const response = await fetch(POINTS_CSV);
        const csvData = await response.text();
        const rows = csvData.split('\n').map(row => row.split(','));

        // FIXED: Corrected "rflow" typo and added max-height
        let html = '<div class="points-scroll-wrapper" style="max-height: 450px; overflow-y: auto; border: 1px solid rgba(0,0,0,0.1); border-radius: 8px; max-width: 1200px; margin: 0 auto; overflow-x: auto;">';
        html += "<table class='points-table'><thead><tr>";
        
        // Headers
        rows[0].forEach(header => {
            html += `<th style="position: sticky; top: 0; background: var(--vermilion, #B22222); color: var(--bg-sand, #F8F4F0); padding: 12px; z-index: 10;">${header}</th>`;
        });
        html += "</tr></thead><tbody>";

        // Data Rows
        rows.slice(1).forEach(row => {
            if (row.length > 1) { 
                html += "<tr>";
                row.forEach(cell => {
                    html += `<td style="padding: 10px; border-bottom: 1px solid #eee;">${cell}</td>`;
                });
                html += "</tr>";
            }
        });

        html += "</tbody></table></div>";
        container.innerHTML = html;
    } catch (error) {
        container.innerHTML = "<p>Error loading points. Check your Published Link!</p>";
        console.error(error);
    }
}

/**
 * 3. DYNAMIC HOME BUTTONS
 * Fetches the 'Links' tab and creates buttons automatically.
 */
async function loadHomeButtons() {
    const linkContainer = document.getElementById('dynamic-home-links');
    
    try {
        const response = await fetch(HOME_LINKS_CSV);
        const csvData = await response.text();
        const rows = csvData.split('\n').map(row => row.split(','));

        linkContainer.innerHTML = ''; // Clear loading text

        // Loop through rows: Column A = Name, Column B = URL
        rows.slice(1).forEach(row => {
            if (row[0] && row[1]) {
                const btn = document.createElement('a');
                btn.href = row[1].trim();
                btn.innerText = row[0].trim();
                btn.className = 'dynamic-link-btn'; // Styled in your CSS
                btn.target = "_blank"; // Opens in new tab
                linkContainer.appendChild(btn);
            }
        });
    } catch (error) {
        console.error("Home links failed to load:", error);
    }
}

/**
 * INITIALIZATION
 * Runs when the website first opens.
 */
window.onload = () => {
    showPage('home-page'); // Start on Home
    //loadHomeButtons();     // Load those 'No-Code' links immediately
};

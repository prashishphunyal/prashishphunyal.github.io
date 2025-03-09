document.documentElement.classList.add('page-loading');

const toggle = document.querySelector('#color-mode-switch input[type="checkbox"]');
const root = document.documentElement;
const label = document.querySelector('#color-mode-switch .toggle-container');

const toggleTheme = () => {
    // Make theme change instant with no transitions
    document.body.classList.add('theme-transition');
    
    const isLightMode = root.getAttribute('data-theme') === 'light';
    root.setAttribute('data-theme', isLightMode ? 'dark' : 'light');
    localStorage.setItem('theme', isLightMode ? 'dark' : 'light');
    
    // No delay needed for instant toggle
    document.body.classList.remove('theme-transition');
};

// Apply the saved theme on page load
const savedTheme = localStorage.getItem('theme') || 'dark';
root.setAttribute('data-theme', savedTheme);
if (savedTheme === 'light') {
    toggle.checked = true;
}

// Add event listeners only after page is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    toggle.addEventListener('click', toggleTheme);
    // Remove loading class immediately
    document.documentElement.classList.remove('page-loading');
});
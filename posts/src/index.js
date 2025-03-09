const toggle = document.querySelector('#color-mode-switch input[type="checkbox"]');
        const root = document.documentElement;
        const label = document.querySelector('#color-mode-switch .toggle-container');

        const toggleTheme = () => {
            const isLightMode = root.getAttribute('data-theme') === 'light';
            root.setAttribute('data-theme', isLightMode ? 'dark' : 'light');
            localStorage.setItem('theme', isLightMode ? 'dark' : 'light');
        };

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            root.setAttribute('data-theme', savedTheme);
            if (savedTheme === 'light') {
                toggle.checked = true;
            } 
        }

        toggle.addEventListener('click', toggleTheme);
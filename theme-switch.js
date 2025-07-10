document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const themeLabel = document.getElementById('theme-label');

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        themeToggle.checked = true;
        themeLabel.textContent = 'Dark Mode';
    } else {
        themeLabel.textContent = 'Light Mode';
    }

    themeToggle.addEventListener('change', function () {
        if (themeToggle.checked) {
            body.classList.add('light-mode');
            themeLabel.textContent = 'Dark Mode';
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.remove('light-mode');
            themeLabel.textContent = 'Light Mode';
            localStorage.setItem('theme', 'dark');
        }
    });
});

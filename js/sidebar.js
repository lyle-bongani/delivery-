document.addEventListener('DOMContentLoaded', function () {
    // Get DOM elements
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mainContent = document.querySelector('main');
    let isOpen = false;

    // Function to toggle sidebar
    function toggleSidebar() {
        if (window.innerWidth < 992) { // Mobile view
            if (isOpen) {
                sidebar.classList.remove('show');
                mainContent.classList.remove('sidebar-open');
                removeOverlay();
            } else {
                sidebar.classList.add('show');
                mainContent.classList.add('sidebar-open');
                addOverlay();
            }
            isOpen = !isOpen;
        }
    }

    // Function to add overlay
    function addOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.addEventListener('click', () => {
            toggleSidebar();
        });
        document.body.appendChild(overlay);
    }

    // Function to remove overlay
    function removeOverlay() {
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    // Add click event to hamburger button
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', (e) => {
            e.preventDefault();
            toggleSidebar();
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth < 992 &&
            isOpen &&
            sidebar &&
            !sidebar.contains(e.target) &&
            sidebarToggle &&
            !sidebarToggle.contains(e.target)) {
            toggleSidebar();
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 992) {
            sidebar.classList.remove('show');
            mainContent.classList.remove('sidebar-open');
            removeOverlay();
            isOpen = false;
        }
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen) {
            toggleSidebar();
        }
    });

    // Close sidebar when clicking a nav link on mobile
    const navLinks = document.querySelectorAll('#sidebar .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 992) {
                toggleSidebar();
            }
        });
    });

    // Initialize sidebar state based on screen size
    if (window.innerWidth >= 992) {
        sidebar.classList.remove('show');
        mainContent.classList.remove('sidebar-open');
        removeOverlay();
        isOpen = false;
    }
}); 
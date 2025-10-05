        document.addEventListener('DOMContentLoaded', () => {
        const pages = document.querySelectorAll('.page');
        const navLinks = document.querySelectorAll('.nav-link');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const app = document.getElementById('app');

        // Function to show a page and hide others
        function showPage(pageId) {
            // Hide all pages
            pages.forEach(page => {
                page.classList.remove('active');
            });

            // Show the target page
            const targetPage = document.getElementById(pageId);
            if (targetPage) {
                targetPage.classList.add('active');
            }

            // Update active state in nav links
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.id === `nav-${pageId}`) {
                    link.classList.add('active');
                }
            });

            // Scroll to top on page change
            window.scrollTo(0, 0);
        }

        // Mobile menu toggle
        function toggleMenu() {
            mobileMenu.classList.toggle('-translate-x-full');
            document.body.classList.toggle('overflow-hidden');
            // Change menu icon
            if (mobileMenu.classList.contains('-translate-x-full')) {
                mobileMenuBtn.innerHTML = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>`;
            } else {
                mobileMenuBtn.innerHTML = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`;
            }
        }
        
        function closeMenu() {
            mobileMenu.classList.add('-translate-x-full');
            document.body.classList.remove('overflow-hidden');
            mobileMenuBtn.innerHTML = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>`;
        }


        // Event Listeners
        mobileMenuBtn.addEventListener('click', toggleMenu);

        // Set initial page
        document.addEventListener('DOMContentLoaded', () => {
            showPage('home');
        });
        });
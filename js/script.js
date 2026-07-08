/*==================================================
    PERSONAL PORTFOLIO WEBSITE
    File: js/script.js
    Part 1/4

    Contents

    1. App Bootstrap
    2. DOM Cache
    3. Theme Manager
==================================================*/


/*==================================================
1. GLOBAL DOM CACHE
==================================================*/

const DOM = {

    body: null,

    header: null,

    navbar: null,

    navLinks: null,

    menuButton: null,

    themeButton: null,

    backToTop: null

};


/*==================================================
2. APP STARTUP
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    cacheDOM();

    initTheme();

    initMobileMenu();

    initStickyHeader();

    initBackToTop();

    initReveal();

    initSmoothScroll();

    initActiveNavigation();
    initAutoHideHeader();

});


/*==================================================
3. CACHE DOM
==================================================*/

function cacheDOM() {

    DOM.body = document.body;

    DOM.header = document.querySelector(".header");

    DOM.navbar = document.querySelector(".navbar");

    DOM.navLinks = document.querySelector(".nav-links");

    DOM.menuButton = document.getElementById("menu-toggle");

    DOM.themeButton = document.getElementById("theme-toggle");

    DOM.backToTop = document.getElementById("backToTop");

}


/*==================================================
4. THEME MANAGER
==================================================*/

function initTheme() {

    if (!DOM.themeButton) return;

    const savedTheme = localStorage.getItem("theme");

    const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;

    if (

        savedTheme === "dark" ||

        (!savedTheme && prefersDark)

    ) {

        DOM.body.classList.add("dark");

    }

    updateThemeIcon();

    DOM.themeButton.addEventListener("click", toggleTheme);

}


/*==================================================
5. TOGGLE THEME
==================================================*/

function toggleTheme() {

    DOM.body.classList.toggle("dark");

    const isDark = DOM.body.classList.contains("dark");

    localStorage.setItem(

        "theme",

        isDark ? "dark" : "light"

    );

    updateThemeIcon();

}


/*==================================================
6. UPDATE THEME ICON
==================================================*/

function updateThemeIcon() {

    if (!DOM.themeButton) return;

    const icon = DOM.themeButton.querySelector("i");

    if (!icon) return;

    const isDark = DOM.body.classList.contains("dark");

    icon.className = isDark

        ? "fa-solid fa-sun"

        : "fa-solid fa-moon";

}


/*==================================================
7. REDUCED MOTION HELPER
==================================================*/

function prefersReducedMotion() {

    return window.matchMedia(

        "(prefers-reduced-motion: reduce)"

    ).matches;

}
/*==================================================
    PERSONAL PORTFOLIO WEBSITE
    File: js/script.js
    Part 2/4

    Contents

    8. Mobile Menu
    9. Sticky Header
    10. Auto Hide Header
==================================================*/


/*==================================================
8. MOBILE MENU
==================================================*/

function initMobileMenu() {

    if (!DOM.menuButton || !DOM.navLinks) return;

    // Toggle menu

    DOM.menuButton.addEventListener("click", toggleMobileMenu);

    // Close when clicking a navigation link

    DOM.navLinks.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", closeMobileMenu);

    });

    // Close when clicking outside

    document.addEventListener("click", (event) => {

        if (
            !DOM.navLinks.classList.contains("active")
        ) return;

        const clickedMenu = DOM.navLinks.contains(event.target);

        const clickedButton = DOM.menuButton.contains(event.target);

        if (!clickedMenu && !clickedButton) {

            closeMobileMenu();

        }

    });

    // ESC key

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {

            closeMobileMenu();

        }

    });

    // Reset when resizing to desktop

    window.addEventListener("resize", () => {

        if (window.innerWidth > 768) {

            closeMobileMenu();

        }

    });

}


/*==================================================
9. TOGGLE MENU
==================================================*/

function toggleMobileMenu() {

    DOM.navLinks.classList.toggle("active");

    DOM.menuButton.classList.toggle("active");

    document.body.classList.toggle(

        "menu-open",

        DOM.navLinks.classList.contains("active")

    );

}


/*==================================================
10. CLOSE MENU
==================================================*/

function closeMobileMenu() {

    DOM.navLinks.classList.remove("active");

    DOM.menuButton.classList.remove("active");

    document.body.classList.remove("menu-open");

}


/*==================================================
11. STICKY HEADER
==================================================*/

function initStickyHeader() {

    if (!DOM.header) return;

    const onScroll = () => {

        if (window.scrollY > 20) {

            DOM.header.classList.add("scrolled");

        } else {

            DOM.header.classList.remove("scrolled");

        }

    };

    onScroll();

    window.addEventListener(

        "scroll",

        throttle(onScroll, 50),

        { passive: true }

    );

}


/*==================================================
12. AUTO HIDE HEADER
==================================================*/

function initAutoHideHeader() {

    if (!DOM.header) return;

    // Không auto-hide trên mobile

    if (window.innerWidth <= 768) return;

    let lastScroll = window.scrollY;

    const onScroll = () => {

        const current = window.scrollY;

        if (current < 100) {

            DOM.header.classList.remove("hide");

            lastScroll = current;

            return;

        }

        if (current > lastScroll) {

            DOM.header.classList.add("hide");

        } else {

            DOM.header.classList.remove("hide");

        }

        lastScroll = current;

    };

    window.addEventListener(

        "scroll",

        throttle(onScroll, 80),

        { passive: true }

    );

}
/*==================================================
    PERSONAL PORTFOLIO WEBSITE
    File: js/script.js
    Part 3/4

    Contents

    13. Back To Top
    14. Smooth Scroll
    15. Reveal Animation
==================================================*/


/*==================================================
13. BACK TO TOP
==================================================*/

function initBackToTop() {

    if (!DOM.backToTop) return;

    const toggleButton = () => {

        if (window.scrollY > 500) {

            DOM.backToTop.classList.add("show");

        } else {

            DOM.backToTop.classList.remove("show");

        }

    };

    toggleButton();

    window.addEventListener(

        "scroll",

        throttle(toggleButton, 50),

        { passive:true }

    );

    DOM.backToTop.addEventListener(

        "click",

        () => {

            window.scrollTo({

                top:0,

                behavior: prefersReducedMotion()

                    ? "auto"

                    : "smooth"

            });

        }

    );

}


/*==================================================
14. SMOOTH SCROLL
==================================================*/

function initSmoothScroll() {

    const links = document.querySelectorAll(

        'a[href^="#"]'

    );

    links.forEach(link => {

        link.addEventListener(

            "click",

            function(event){

                const href = this.getAttribute("href");

                if (

                    href === "#" ||

                    href.length <= 1

                ) return;

                const target = document.querySelector(href);

                if (!target) return;

                event.preventDefault();

                target.scrollIntoView({

                    behavior: prefersReducedMotion()

                        ? "auto"

                        : "smooth",

                    block:"start"

                });

            }

        );

    });

}


/*==================================================
15. REVEAL ANIMATION
==================================================*/

function initReveal() {

    if (prefersReducedMotion()) {

        document

            .querySelectorAll(

                ".reveal,.reveal-left,.reveal-right,.reveal-scale"

            )

            .forEach(element => {

                element.classList.add("show");

            });

        return;

    }

    const observer = new IntersectionObserver(

        (entries) => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                entry.target.classList.add("show");

                observer.unobserve(entry.target);

            });

        },

        {

            threshold:0.15,

            rootMargin:"0px 0px -80px 0px"

        }

    );

    document

        .querySelectorAll(

            ".reveal,.reveal-left,.reveal-right,.reveal-scale"

        )

        .forEach(element => {

            observer.observe(element);

        });

}


/*==================================================
16. STAGGER HELPER
==================================================*/

function revealChildren(container){

    if(!container) return;

    [...container.children].forEach(

        (child,index)=>{

            child.style.transitionDelay=

                `${index*100}ms`;

            child.classList.add("show");

        }

    );

}
/*==================================================
    PERSONAL PORTFOLIO WEBSITE
    File: js/script.js
    Part 4/4

    Contents

    17. Active Navigation
    18. Debounce
    19. Throttle
    20. Helpers
==================================================*/


/*==================================================
17. ACTIVE NAVIGATION
==================================================*/

function initActiveNavigation() {

    if (!DOM.navLinks) return;

    const sections = document.querySelectorAll("section[id]");

    if (sections.length === 0) return;

    const navItems = DOM.navLinks.querySelectorAll("a");

    const observer = new IntersectionObserver(

        (entries) => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                const id = entry.target.id;

                navItems.forEach(link => {

                    link.classList.remove("active");

                    if (
                        link.getAttribute("href") === "#" + id
                    ) {

                        link.classList.add("active");

                    }

                });

            });

        },

        {

            rootMargin: "-35% 0px -55% 0px",

            threshold: 0

        }

    );

    sections.forEach(section => {

        observer.observe(section);

    });

}


/*==================================================
18. DEBOUNCE
==================================================*/

function debounce(callback, delay = 150) {

    let timer;

    return (...args) => {

        clearTimeout(timer);

        timer = setTimeout(() => {

            callback(...args);

        }, delay);

    };

}


/*==================================================
19. THROTTLE
==================================================*/

function throttle(callback, limit = 100) {

    let waiting = false;

    return (...args) => {

        if (waiting) return;

        callback(...args);

        waiting = true;

        setTimeout(() => {

            waiting = false;

        }, limit);

    };

}


/*==================================================
20. HELPERS
==================================================*/

function isMobile() {

    return window.innerWidth <= 768;

}

function isDesktop() {

    return window.innerWidth > 768;

}

function $(selector) {

    return document.querySelector(selector);

}

function $$(selector) {

    return document.querySelectorAll(selector);

}


/*==================================================
21. WINDOW EVENTS
==================================================*/

window.addEventListener(

    "resize",

    debounce(() => {

        if (isDesktop()) {

            closeMobileMenu();

        }

    })

);


/*==================================================
22. PAGE LOADED
==================================================*/

window.addEventListener("load", () => {

    document.body.classList.add("loaded");

});


/*==================================================
23. END OF FILE
==================================================*/
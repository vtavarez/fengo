import { directive as onClickaway } from 'vue-clickaway';
import { trapFocus } from '../../utils';

const Header = new Vue({
    el: '#vue-header',
    data: {
        search: {
            term: '',
            results: [],
        },
        mobile: {
            menu: false,
            cart: false
        },
        desktop: {
            menu: null,
            cart: false
        }
    },
    delimiters: ['${', '}'],
    directives: {
        onClickaway
    },
    methods: {
        toggleMobileMenu(e) {
            this.mobile.menu = !this.mobile.menu;
            this.mobile.cart = false;
        },
        toggleMobileCart(e) {
            this.mobile.cart = !this.mobile.cart;
            this.mobile.menu = false;
        },
        toggleDesktopMenu(e) {
            //* Toggle menu closed if open
            if(this.desktop.menu) {
                this.desktopMenuOpen(false);
                if(this.desktop.menu.dataset.menu === e.currentTarget.dataset.menu) {
                    return this.desktop.menu = null;
                }
                this.desktop.menu = null
            }
            //* Cache menu
            this.desktop.menu = e.currentTarget;

            //* Toggle menu open
            this.desktopMenuOpen(true);
        },
        toggleDesktopCart(e) {
            this.desktop.cart = !this.desktop.cart;
        },
        desktopMenuOpen(isMenuOpen){
            //* Menu button, icon, and dropdown
            const menuitembutton = this
                .desktop
                .menu
                .firstElementChild;
            const menuitemicon = this
                .desktop
                .menu
                .firstElementChild
                .lastElementChild;
            const menuitemdropdown = this
                .desktop
                .menu
                .lastElementChild;

            //* Toggle ARIA state
            menuitembutton.setAttribute('aria-expanded', isMenuOpen);
            menuitembutton.setAttribute('aria-haspopup', isMenuOpen);

            //* Toggle menu state
            if(isMenuOpen){
                menuitemicon
                    .classList
                    .add('menu-desktop--item-active');
                menuitemdropdown
                    .classList
                    .add('menu-desktop--dropdown-active');
            } else {
                menuitemicon
                    .classList
                    .remove('menu-desktop--item-active');
                menuitemdropdown
                    .classList
                    .remove('menu-desktop--dropdown-active');
            }
        },
        clickedAway(e) {
            this.mobile.menu = false;
            this.mobile.cart = false;
            this.desktop.cart = false;
            if(e !== 'search') this.search.term = '';
            if (this.desktop.menu) this.desktopMenuOpen(false);
        },
        togglePanel(e) {
            const panelIcons = e.currentTarget.querySelectorAll('.menu-mobile--item-expand-icon');
            const subMenu = e.currentTarget.nextElementSibling;
            const parentMenu = subMenu.parentElement;
            const parentMenuMaxHeight = parentMenu.style.maxHeight;
            const subMenuScrollHeight = subMenu.scrollHeight;
            const subMenuMaxHeight = subMenu.style.maxHeight;

            function toggleAccordian(acc, icon1, icon2, height) {
                height
                    ? acc.style.maxHeight = height + 'px'
                    : acc.style.maxHeight = null;

                if (icon1 && icon2) {
                    icon1.classList.toggle('icon--active');
                    icon2.classList.toggle('icon--active');
                }
            }

            if (!subMenuMaxHeight) {
                toggleAccordian(
                    parentMenu,
                    null,
                    null,
                    (parseInt(parentMenuMaxHeight) + parseInt(subMenuScrollHeight)).toString()
                );
            }

            subMenuMaxHeight
                ? toggleAccordian(subMenu, panelIcons[1], panelIcons[0])
                : toggleAccordian(subMenu, panelIcons[0], panelIcons[1], subMenuScrollHeight);
        },
        trapFocus(e) {
            let exit = trapFocus(e);

            if (exit) {
                this.clickedAway();
                e.currentTarget.previousElementSibling.focus();
            }
        },
        clearSearch(e) {
            const isInputClicked = e.type === 'click';
            const isEscapePressed = (e.key === 'Escape' || e.keyCode === 27);

            if (isEscapePressed) {
                this.search.term = '';
                e.currentTarget.querySelector('.combobox--search-input').focus();
            }

            if (isInputClicked) {
                this.clickedAway('search');
            }
        }
    },
    watch: {
        'search.term': _.debounce(function (val, oldVal) {
            if (val) {
                fetch(`/search/suggest.json?q=${val}&resources[type]=product&resources[limit]=5&resources[options][unavailable_products]=hide`)
                    .then(response => response.json())
                    .then(suggestions => {
                        const products = suggestions.resources.results.products;
                        Header.search.results = products;
                    });
            } else {
                Header.search.results = [];
            }
        }, 300)
    },
    computed: {
        desktopCartActive() {
            return {
                'topbar--minicart-button-active': this.desktop.cart
            }
        },
        mobileCartActive() {
            return {
                'menu-mobile--cart-active': this.mobile.cart
            }
        },
        miniCartActive() {
            return {
                'minicart--active': this.mobile.cart || this.desktop.cart || false
            }
        },
        searchActive() {
            return {
                'combobox--search-results-active': Boolean(this.search.term)
            }
        },
        mobileMenuActive() {
            return {
                'menu-mobile--dropdown-active': this.mobile.menu
            }
        }
    }
});

export default Header;
export const trapFocus = function (e) {
    let focusableEls = e.currentTarget.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), input[type="text"]:not([disabled])');

    const firstFocusableEl = focusableEls[0];
    const lastFocusableEl = focusableEls[focusableEls.length - 1];
    const KEYCODE_TAB = 9;
    const isTabPressed = (e.key === 'Tab' || e.keyCode === KEYCODE_TAB);

    if (!isTabPressed && e.key === 'Escape') {
        return true;
    }

    if (e.shiftKey) {
        if (document.activeElement === firstFocusableEl) {
            lastFocusableEl.focus();
        }
    } else {
        if (document.activeElement === lastFocusableEl) {
            firstFocusableEl.focus();
        }
    }
}

export const formatCurrency = function ($) {
    const currency = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2
    });

    return currency.format($ * 0.01);
}

export const toggleWarning = function (message) {
    if(!window.theme.warningBar){
        window.theme.warningBar = document.querySelector('.notification-bar-warning');
    }

    window.theme.warningBar.textContent = message;
    window.theme.warningBar.classList.toggle('notification-bar-active');
    setTimeout(() => window.theme.warningBar.classList.toggle('notification-bar-active'), 2000);
}

export const toggleSuccess = function (message) {
    if(!window.theme.successBar){
        window.theme.successBar = document.querySelector('.notification-bar-success');
    }

    window.theme.successBar.textContent = message;
    window.theme.successBar.classList.toggle('notification-bar-active');
    setTimeout(() => window.theme.successBar.classList.toggle('notification-bar-active'), 2000);
}

export const toggleSpinner = function (submitter) {
    submitter.classList.toggle('active');
    submitter.nextElementSibling.classList.toggle('active');
}
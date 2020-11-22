export const trapFocus = function (e) {
    let focusableEls = null;

    if (!focusableEls) {
       focusableEls = e.currentTarget.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), input[type="text"]:not([disabled])');
    }

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

export const toggleWarning = function (message) {
    let warningBar = null;

    if(!warningBar) {
        warningBar = document.querySelector('.notification-bar-warning');
    }

    warningBar.textContent = message;
    warningBar.classList.toggle('notification-bar-active');
    setTimeout(() => warningBar.classList.toggle('notification-bar-active'), 2000);
}

export const toggleSuccess = function (message) {
    let successBar = null;

    if(!successBar) {
        successBar = document.querySelector('.notification-bar-success');
    }

    successBar.textContent = message;
    successBar.classList.toggle('notification-bar-active');
    setTimeout(() => successBar.classList.toggle('notification-bar-active'), 2000);
}
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
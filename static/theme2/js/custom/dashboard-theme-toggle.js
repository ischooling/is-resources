/* ============================================================================
 * Dashboard Day / Night Theme Toggle
 * ----------------------------------------------------------------------------
 * Vanilla JS (no jQuery). Self-contained IIFE.
 *
 * Responsibilities:
 *   - Persist the selected theme in localStorage ("dashboardTheme": light|dark)
 *   - Apply the theme by toggling  data-theme="dark"  on <html>
 *   - Keep the toggle button's ARIA / visual state in sync
 *   - Add a brief transition window (.dn-anim) for a smooth cross-fade
 *
 * Public (reusable) API exposed on window:
 *   initDashboardTheme()      – restore + bind (called automatically on load)
 *   applyDashboardTheme(theme) – apply "light" | "dark" without persisting
 *   toggleDashboardTheme()    – flip current theme and persist it
 *
 * NOTE: A tiny inline script in the page <head> already applies the stored
 * theme BEFORE first paint (no flash of incorrect theme). This file is the
 * full, reusable controller that runs once the DOM is ready.
 * ========================================================================== */
(function () {
    'use strict';

    /* ----- Constants -------------------------------------------------------- */
    var STORAGE_KEY = 'dashboardTheme';
    var THEME_LIGHT = 'light';
    var THEME_DARK  = 'dark';
    var TOGGLE_ID   = 'dnThemeToggle';
    var ANIM_CLASS  = 'dn-anim';
    var ANIM_MS     = 400;

    /* ----- localStorage helpers (guarded for privacy / disabled storage) ---- */
    function getStoredTheme() {
        try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
    }
    function storeTheme(theme) {
        try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* ignore */ }
    }

    /* ----- Read the theme currently applied to <html> ----------------------- */
    function getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme') === THEME_DARK
            ? THEME_DARK
            : THEME_LIGHT;
    }

    /* ----- OS-level colour-scheme preference (used only when unset) --------- */
    function getSystemTheme() {
        try {
            return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
                ? THEME_DARK
                : THEME_LIGHT;
        } catch (e) { return THEME_LIGHT; }
    }

    /**
     * The theme to show right now: an explicit stored choice wins; otherwise
     * fall back to the OS preference (system default).
     */
    function getEffectiveTheme() {
        var stored = getStoredTheme();
        if (stored === THEME_DARK || stored === THEME_LIGHT) { return stored; }
        return getSystemTheme();
    }

    /**
     * Apply a theme to the document + sync the toggle button.
     * Does NOT persist (use toggleDashboardTheme for user-driven changes).
     * @param {string} theme "light" | "dark"
     */
    function applyDashboardTheme(theme) {
        var isDark = theme === THEME_DARK;

        if (isDark) {
            document.documentElement.setAttribute('data-theme', THEME_DARK);
        } else {
            document.documentElement.removeAttribute('data-theme');
        }

        var btn = document.getElementById(TOGGLE_ID);
        if (btn) {
            btn.setAttribute('aria-checked', isDark ? 'true' : 'false');
            btn.classList.toggle('is-dark', isDark);
        }
    }

    /** Flip the current theme, animate the switch, and persist the choice. */
    function toggleDashboardTheme() {
        var next = getCurrentTheme() === THEME_DARK ? THEME_LIGHT : THEME_DARK;

        // Enable smooth cross-fade only for the duration of the switch.
        var root = document.documentElement;
        root.classList.add(ANIM_CLASS);

        applyDashboardTheme(next);
        storeTheme(next);

        window.setTimeout(function () {
            root.classList.remove(ANIM_CLASS);
        }, ANIM_MS);
    }

    /** Restore the persisted theme and bind the toggle button (idempotent). */
    function initDashboardTheme() {
        // Re-assert the effective theme (the head script already did this
        // pre-paint; this keeps things correct if the button/DOM loaded later).
        // Explicit choice wins; otherwise defaults to the OS colour scheme.
        applyDashboardTheme(getEffectiveTheme());

        var btn = document.getElementById(TOGGLE_ID);
        if (btn && !btn.getAttribute('data-dn-bound')) {
            btn.setAttribute('data-dn-bound', '1');   // guard against double-binding
            btn.addEventListener('click', toggleDashboardTheme);
        }

        // While the user has made NO explicit choice, keep following the OS.
        try {
            var mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
            if (mq && typeof mq.addEventListener === 'function') {
                mq.addEventListener('change', function (e) {
                    if (!getStoredTheme()) {
                        applyDashboardTheme(e.matches ? THEME_DARK : THEME_LIGHT);
                    }
                });
            }
        } catch (e) { /* matchMedia unavailable – ignore */ }
    }

    /* ----- Expose reusable API --------------------------------------------- */
    window.initDashboardTheme   = initDashboardTheme;
    window.applyDashboardTheme  = applyDashboardTheme;
    window.toggleDashboardTheme = toggleDashboardTheme;

    /* ----- Bootstrap -------------------------------------------------------- */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDashboardTheme);
    } else {
        initDashboardTheme();
    }
})();

/**
 * SMS Error Logger — Frontend Utility
 * =====================================
 * Drop this file in your page (or bundle it).
 * It provides a fire-and-forget error reporting utility for all JS/AJAX errors.
 *
 * Usage:
 *   SMSErrorLogger.init({ userId: 42, schoolId: 5, roleId: 3 });
 *   SMSErrorLogger.log({ errorMessage: '...', stackTrace: '...' });
 *
 * All calls are non-blocking and failures are silently swallowed.
 */
(function (window) {
    'use strict';

    /* ------------------------------------------------------------------ */
    /* Configuration — override via SMSErrorLogger.init()                  */
    /* ------------------------------------------------------------------ */
    var _config = {
        apiEndpoint: '/api/v1/error-log/report',
        appVersion:  SCRIPT_VERSION,
        source:      'FRONTEND',
        // Context — set after login via init()
        userId:      USER_ID,
        schoolId:    SCHOOL_ID,
        userRoleId:  USER_ROLE,
        moduleId:    null,
        sessionId:   null,
        pageNo:      null
    };

    /* ------------------------------------------------------------------ */
    /* Helpers                                                              */
    /* ------------------------------------------------------------------ */

    function _generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0;
            return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
        });
    }

    function _currentUrl() {
        try { return window.location.href; } catch (e) { return ''; }
    }

    function _userAgent() {
        try { return navigator.userAgent; } catch (e) { return ''; }
    }

    function _truncate(str, max) {
        if (str == null) return str;
        if (typeof str !== 'string') {
            try { str = JSON.stringify(str); } catch (e) { str = String(str); }
        }
        return str.length > max ? str.substring(0, max) + '...[TRUNCATED]' : str;
    }

    function _buildPayload(options) {
        var mid = options.moduleId || _config.moduleId;
        return {
            errorUuid:     _generateUUID(),
            userId:        options.userId   || _config.userId,
            schoolId:      options.schoolId || _config.schoolId,
            userRole:      USER_ROLE,
            moduleId:      MODULE_ID,
            pageNo:        PAGE_REQUEST,
            sessionId:     options.sessionId  || _config.sessionId,
            currentUrl:    options.currentUrl || _currentUrl(),
            httpStatus:    options.httpStatus || null,
            errorType:     options.errorType  || 'JavaScriptError',
            errorMessage:  _truncate(options.errorMessage, 5000),
            stackTrace:    _truncate(options.stackTrace,   10000),
            requestParams: _truncate(options.requestParams, 2000),
            userAgent:     _userAgent(),
            appVersion:    _config.appVersion,
            source:        _config.source
        };
    }

    function _isProd() {
        try { return (window.DEPLOYMENT_MODE || '').toUpperCase() === 'PROD'; } catch (e) { return false; }
    }

    /** Core fire-and-forget send — never throws. */
    function _send(payload) {
        if (!_isProd()) return;
        try {
            /* Prefer fetch (modern); fall back to XHR (IE11 / older jQuery apps) */
            if (window.fetch) {
                window.fetch(_config.apiEndpoint, {
                    method:      'POST',
                    headers:     { 'Content-Type': 'application/json' },
                    body:        JSON.stringify(payload),
                    keepalive:   true   // survives page unload
                }).catch(function () { /* silence network errors */ });
            } else {
                var xhr = new XMLHttpRequest();
                xhr.open('POST', _config.apiEndpoint, true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify(payload));
                /* No onload/onerror handlers — fire-and-forget */
            }
        } catch (e) {
            /* Silently ignore — logging must never break the user experience */
        }
    }

    /* ------------------------------------------------------------------ */
    /* Global Error Hooks                                                   */
    /* ------------------------------------------------------------------ */

    var _NOISE_MESSAGES = [
        'Script error.',
        '$ is not defined',
        'ResizeObserver loop limit exceeded',
        'ResizeObserver loop completed with undelivered notifications'
    ];

    var _NOISE_SOURCES = [
        'chrome-extension://', 'moz-extension://', 'safari-extension://',
        'MetaMask', 'ethereum', 'web3', 'wp-admin', 'wp-content', 'wp-json'
    ];

    function _isNoise(msg, src) {
        if (!msg) return true;
        for (var i = 0; i < _NOISE_MESSAGES.length; i++) {
            if (msg === _NOISE_MESSAGES[i]) return true;
        }
        var haystack = (msg + ' ' + (src || '')).toLowerCase();
        var noiseKeys = ['metamask', 'ethereum', 'web3', 'chrome-extension', 'moz-extension',
                         'safari-extension', 'wp-admin', 'wp-content', 'wp-json'];
        for (var j = 0; j < noiseKeys.length; j++) {
            if (haystack.indexOf(noiseKeys[j]) !== -1) return true;
        }
        return false;
    }

    /** Uncaught JS errors */
    window.onerror = function (message, source, lineno, colno, error) {
        if (!message || message === 'Script error.') return false;
        if (!error && lineno === 0 && colno === 0) return false;
        var realMessage = (error && error.message) ? error.message : message;
        if (_isNoise(realMessage, source)) return false;
        SMSErrorLogger.log({
            errorType:    'UncaughtException',
            errorMessage: realMessage,
            stackTrace:   (error && error.stack) ? error.stack : (source + ':' + lineno + ':' + colno)
        });
        return false;
    };

    /** Unhandled Promise rejections */
    window.addEventListener('unhandledrejection', function (event) {
        var reason = event.reason;
        var msg = reason && reason.message ? reason.message : String(reason);
        if (!msg || msg === 'undefined' || msg === 'null' || msg === '[object Object]') return;
        if (_isNoise(msg, reason && reason.stack)) return;
        SMSErrorLogger.log({
            errorType:    'UnhandledPromiseRejection',
            errorMessage: msg,
            stackTrace:   reason && reason.stack ? reason.stack : ''
        });
    });

    /* ------------------------------------------------------------------ */
    /* Public API                                                           */
    /* ------------------------------------------------------------------ */

    var SMSErrorLogger = {

        /**
         * Call once after login to set user context.
         * @param {Object} ctx  { userId, schoolId, userRoleId, moduleId, sessionId, pageNo, appVersion }
         */
        init: function (ctx) {
            if (!ctx) return;
            _config.userId     = ctx.userId     || null;
            _config.schoolId   = ctx.schoolId   || null;
            _config.userRoleId = ctx.userRoleId || null;
            _config.moduleId   = ctx.moduleId   || null;
            _config.sessionId  = ctx.sessionId  || null;
            _config.pageNo     = ctx.pageNo     || null;
            if (ctx.appVersion) _config.appVersion = ctx.appVersion;
        },

        /**
         * Log any error asynchronously.
         * @param {Object} options
         *   errorMessage {string}    required
         *   stackTrace   {string}    optional
         *   errorType    {string}    optional  default 'JavaScriptError'
         *   httpStatus   {number}    optional
         *   requestParams{string}    optional
         *   currentUrl   {string}    optional  default window.location.href
         *   moduleId     {number}    optional  overrides init() value
         *   pageNo       {string}    optional  overrides init() value
         */
        log: function (options) {
            try {
                _send(_buildPayload(options || {}));
            } catch (e) { /* silence */ }
        },

        /**
         * jQuery AJAX error handler — wire directly to $.ajaxSetup.
         *
         * Example:
         *   $.ajaxSetup({ error: SMSErrorLogger.ajaxErrorHandler });
         */
        ajaxErrorHandler: function (jqXHR, textStatus, errorThrown) {
            // abort = user navigated away; status 0 = network offline — not a blocker
            if (textStatus === 'abort' || jqXHR.status === 0) return;
            // Only log real server errors (4xx, 5xx)
            if (jqXHR.status < 400) return;
            // 502/503/504 = infrastructure/gateway noise (Cloudflare, load balancer)
            if (jqXHR.status === 502 || jqXHR.status === 503 || jqXHR.status === 504) return;
            var settings = jqXHR._smsSettings || {};
            var failedUrl = settings.url || '-';
            var method    = settings.type || settings.method || '-';
            SMSErrorLogger.log({
                errorType:     'AJAXError',
                errorMessage:  errorThrown || textStatus || 'error',
                httpStatus:    jqXHR.status || 0,
                stackTrace:    '[' + method + '] ' + failedUrl + ' | Response: ' + _truncate(jqXHR.responseText, 3000),
                requestParams: _truncate(settings.data, 2000),
                currentUrl:    _currentUrl()
            });
        },

        /**
         * Wrap an async function with error logging.
         *
         * Example:
         *   var safeSubmit = SMSErrorLogger.wrap(submitForm, { moduleId: 7 });
         */
        wrap: function (fn, ctx) {
            return function () {
                try {
                    var result = fn.apply(this, arguments);
                    if (result && typeof result.then === 'function') {
                        result.catch(function (err) {
                            SMSErrorLogger.log(Object.assign({
                                errorType:    'AsyncError',
                                errorMessage: err && err.message ? err.message : String(err),
                                stackTrace:   err && err.stack   ? err.stack   : ''
                            }, ctx || {}));
                        });
                    }
                    return result;
                } catch (err) {
                    SMSErrorLogger.log(Object.assign({
                        errorType:    'SyncError',
                        errorMessage: err && err.message ? err.message : String(err),
                        stackTrace:   err && err.stack   ? err.stack   : ''
                    }, ctx || {}));
                    throw err; // Re-throw so the caller still knows about it
                }
            };
        }
    };

    /* Expose globally */
    window.SMSErrorLogger = SMSErrorLogger;

}(window));

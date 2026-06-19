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
        return {
            errorUuid:     _generateUUID(),
            userId:        options.userId     || _config.userId,
            schoolId:      options.schoolId   || _config.schoolId,
            userRoleId:    options.userRoleId || _config.userRoleId,
            moduleId:      options.moduleId   || _config.moduleId,
            pageNo:        options.pageNo     || _config.pageNo,
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

    /** Core fire-and-forget send — never throws. */
    function _send(payload) {
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

    /** Uncaught JS errors */
    window.onerror = function (message, source, lineno, colno, error) {
        SMSErrorLogger.log({
            errorType:    'UncaughtException',
            errorMessage: message,
            stackTrace:   (error && error.stack) ? error.stack : (source + ':' + lineno + ':' + colno)
        });
        return false; // Don't suppress the native console error
    };

    /** Unhandled Promise rejections */
    window.addEventListener('unhandledrejection', function (event) {
        var reason = event.reason;
        SMSErrorLogger.log({
            errorType:    'UnhandledPromiseRejection',
            errorMessage: reason && reason.message ? reason.message : String(reason),
            stackTrace:   reason && reason.stack   ? reason.stack   : ''
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
            SMSErrorLogger.log({
                errorType:    'AJAXError',
                errorMessage: errorThrown || textStatus,
                httpStatus:   jqXHR.status,
                stackTrace:   'Response: ' + _truncate(jqXHR.responseText, 3000),
                currentUrl:   _currentUrl()
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

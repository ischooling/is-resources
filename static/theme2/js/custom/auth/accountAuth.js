/*
 * Browser sign-in (docs/63_7_0_SMS_TOKEN_BASED_PLAN.md, section 27).
 *
 * Several users can be signed in to one browser; each has its own token cookies, and the server picks
 * which user a request is for. This script makes the page's own calls say which user they are for:
 *   - X-Account: the page's UNIQUEUUID, on every same-origin jQuery and fetch call;
 *   - X-CSRF-Token: the CSRF cookie's value, on the same calls, and a hidden _csrf field on POST forms;
 *   - when a call answers 401 with an X-Auth-Renew header (the access token expired), it renews once
 *     and repeats the call; if renewing fails, it goes to the login page. Renewals are shared by every tab
 *     (see renew below) and also serve jquery.commonFunction.js (window.smsRenew);
 *   - when a call answers 401 with an X-Auth-Visitor header (a signed-out page whose visitor token expired,
 *     section 29), it gets a new visitor token once and repeats the call;
 *   - when a call answers 401 with an X-Auth-Login header (nobody is signed in for it: the page's user has
 *     logged out, from another tab or a duplicated one), a page rendered for a user goes to that login page,
 *     once, and the call's own handlers do not run. A signed-out page (login, signup) is left alone.
 * The X-Account and CSRF headers are added only once a user has signed in (no CSRF cookie = none yet).
 * It also remembers, in this tab's sessionStorage, which user the tab's page is for: the "Choose account"
 * page (/<school>/auth/choose) then goes straight on for a tab that already works for one of the users.
 *
 * Loaded from custom/ on purpose (not the min/ copy): this file is not minified.
 */
(function (window, document) {
	'use strict';

	// Pages that include a shared header and also load jQuery themselves load this file twice: install once.
	if (window.__accountAuthInstalled) {
		return;
	}
	window.__accountAuthInstalled = true;

	// Works on both HTTPS (__Host- prefix required) and plain HTTP (prefix rejected by browsers).
	var CSRF_COOKIE = (function () {
		var prefixed = '__Host-IS_CSRF';
		var plain = 'IS_CSRF';
		// Try the prefixed form first (HTTPS); fall back to the plain form (HTTP test servers).
		var parts = document.cookie ? document.cookie.split('; ') : [];
		for (var i = 0; i < parts.length; i++) {
			var eq = parts[i].indexOf('=');
			if (eq > 0) {
				var n = parts[i].substring(0, eq);
				if (n === prefixed) { return prefixed; }
				if (n === plain) { return plain; }
			}
		}
		return prefixed; // default: HTTPS production
	}());
	var TAB_ACCOUNT = 'is-account';
	var ACCOUNT_ID = /^[A-Za-z0-9_-]{1,64}$/;
	var renewing = null;
	var visiting = null;
	var leaving = false;
	var nativeFetch = typeof window.fetch === 'function' ? window.fetch.bind(window) : null;

	function readCookie(name) {
		var parts = document.cookie ? document.cookie.split('; ') : [];
		for (var i = 0; i < parts.length; i++) {
			var eq = parts[i].indexOf('=');
			if (eq > 0 && parts[i].substring(0, eq) === name) {
				return decodeURIComponent(parts[i].substring(eq + 1));
			}
		}
		return null;
	}

	function enabled() {
		return readCookie(CSRF_COOKIE) !== null;
	}

	/**
	 * The signed-in user the page was served to: AUTH_ACCOUNT (set by the server for every signed-in page), else
	 * UNIQUEUUID. They differ when a page shows someone else's data, such as a director viewing a counselor's lead
	 * list: UNIQUEUUID is then the counselor, whose cookies this browser does not hold, and naming it signed the
	 * page's calls in as nobody (401, then the login page).
	 */
	function account() {
		var signedIn = typeof window.AUTH_ACCOUNT === 'string' ? window.AUTH_ACCOUNT : '';
		if (ACCOUNT_ID.test(signedIn)) {
			return signedIn;
		}
		var id = typeof window.UNIQUEUUID === 'string' ? window.UNIQUEUUID : '';
		return ACCOUNT_ID.test(id) ? id : null;
	}

	function sameOrigin(url) {
		if (!url) {
			return true;
		}
		try {
			return new URL(url, window.location.href).origin === window.location.origin;
		} catch (e) {
			return false;
		}
	}

	function authHeaders() {
		var headers = {};
		if (!enabled()) {
			return headers;
		}
		var id = account();
		var csrf = readCookie(CSRF_COOKIE);
		if (id) {
			headers['X-Account'] = id;
		}
		if (csrf) {
			headers['X-CSRF-Token'] = csrf;
		}
		return headers;
	}

	function loginPage() {
		var school = typeof window.SCHOOL_UUID === 'string' && window.SCHOOL_UUID ? window.SCHOOL_UUID : '';
		var context = typeof window.CONTEXT_PATH === 'string' ? window.CONTEXT_PATH.replace(/\/$/, '') : '';
		// Ensure context always starts with / so browsers don't misread it as a hostname.
		if (context && context.charAt(0) !== '/') { context = '/' + context; }
		window.location.href = context + '/' + school + '/common/login';
	}

	/** Which header a 401 carries: renew the user's token, get a new visitor token, or go to the login page. */
	function retryTarget(status, header) {
		if (status !== 401) {
			return null;
		}
		var renewUrl = header('X-Auth-Renew');
		if (renewUrl && enabled()) {
			return { url: renewUrl, run: renew };
		}
		var visitorUrl = header('X-Auth-Visitor');
		if (visitorUrl && sameOrigin(visitorUrl)) {
			return { url: visitorUrl, run: visitor };
		}
		var loginUrl = loginTarget(header);
		if (loginUrl) {
			return { url: loginUrl, run: leave };
		}
		return null;
	}

	/**
	 * The login page an X-Auth-Login 401 points at, for a page rendered for a user (it has a UNIQUEUUID); null on a
	 * signed-out page, whose stray calls must not bounce it, and on the login page itself (no reload loop).
	 */
	function loginTarget(header) {
		var url = header('X-Auth-Login');
		if (!url || !sameOrigin(url) || !account()) {
			return null;
		}
		var to = new URL(url, window.location.href);
		return to.pathname === window.location.pathname ? null : to.href;
	}

	/** Goes to the login page once, however many calls failed together; never settles, so no handler runs. */
	function leave(url) {
		if (!leaving) {
			leaving = true;
			window.location.assign(url);
		}
		return new Promise(function () {});
	}

	/**
	 * For the page's global ajaxError handler (jquery.commonFunction.js), which also sees synchronous calls this
	 * file does not wrap: true when the 401 sends the page to the login page, so no error message is shown.
	 */
	window.smsLeaveForLogin = function (xhr) {
		if (!xhr || xhr.status !== 401 || typeof xhr.getResponseHeader !== 'function') {
			return false;
		}
		var url = loginTarget(function (name) {
			return xhr.getResponseHeader(name);
		});
		if (!url) {
			return false;
		}
		leave(url);
		return true;
	};

	/** One new visitor token at a time; the server sets it as a cookie. */
	function visitor(url) {
		if (!visiting) {
			visiting = window.fetch(url, {
				method: 'GET',
				credentials: 'same-origin',
				__authNoRetry: true
			}).then(function (response) {
				if (!response.ok) {
					throw new Error('visitor token failed');
				}
			}).finally(function () {
				visiting = null;
			});
		}
		return visiting;
	}

	/*
	 * Renewing rotates the refresh token: the old one stops working. The access cookie is shared by every tab, so
	 * all tabs hit its expiry together, and each renewing on its own sends the same refresh token at once. The
	 * server lets one rotate and answers the others 409 (concurrent_refresh); sent again after its 10s grace, the
	 * old token counts as stolen and ends the login in every tab. So:
	 *   - one renewal at a time across tabs (Web Locks); a tab that waited skips its own when another tab renewed
	 *     after it asked (RENEWED_AT, in localStorage), since the shared cookies are fresh already;
	 *   - a 409 is not a failure: another call rotated a moment ago, its new cookies are on the way, so wait a
	 *     little and let the caller repeat its call.
	 */
	var RENEW_LOCK = 'is-auth-renew';
	var RENEWED_AT = 'is-auth-renewed-at:';
	var CONCURRENT_WAIT_MS = 1000;
	// Nothing may hold up renewing for good. A tab holding the lock can be frozen or throttled in the background,
	// or its request can sit behind slow ones; every other tab then waited on it forever and every call answered
	// 401. So the lock is waited for only so long (then renewing goes ahead without it: the server's grace answers
	// an overlap with 409, which is handled), and a renewal that never answers is given up.
	var LOCK_WAIT_MS = 8000;
	var RENEW_TIMEOUT_MS = 15000;
	// A renewal that could not tell (no answer, network error): not a sign-out. The call is repeated once; a real
	// end of the login answers 401 and goes to the login page.
	var UNKNOWN = 'unknown';

	function renewedAt(url) {
		try {
			return Number(window.localStorage.getItem(RENEWED_AT + url)) || 0;
		} catch (e) {
			return 0;
		}
	}

	function markRenewed(url) {
		try {
			window.localStorage.setItem(RENEWED_AT + url, String(Date.now()));
		} catch (e) {
			// storage unavailable: a waiting tab then renews once more, which is harmless
		}
	}

	function wait(ms) {
		return new Promise(function (resolve) {
			window.setTimeout(resolve, ms);
		});
	}

	/** A controller aborted after {@code ms}, or null where AbortController is missing. */
	function abortAfter(ms) {
		if (typeof window.AbortController !== 'function') {
			return null;
		}
		var controller = new window.AbortController();
		window.setTimeout(function () {
			controller.abort();
		}, ms);
		return controller;
	}

	/**
	 * Resolves when the renewal is done (or could not tell: UNKNOWN), rejects only when the server refused it
	 * (the login has ended).
	 */
	function postRenew(url, askedAt) {
		if (renewedAt(url) >= askedAt) {
			return Promise.resolve();
		}
		var timeout = abortAfter(RENEW_TIMEOUT_MS);
		return nativeFetch(url, {
			method: 'POST',
			credentials: 'same-origin',
			headers: { 'X-CSRF-Token': readCookie(CSRF_COOKIE) || '' },
			signal: timeout ? timeout.signal : undefined
		}).then(function (response) {
			if (response.ok) {
				markRenewed(url);
				return;
			}
			if (response.status === 409) {
				return wait(CONCURRENT_WAIT_MS);
			}
			if (response.status === 401 || response.status === 403) {
				throw new Error('renew refused: ' + response.status);
			}
			// 429, 5xx: the server could not renew right now, which does not end the login
			return UNKNOWN;
		}, function () {
			// no answer: timed out, offline, or the page is going away
			return UNKNOWN;
		});
	}

	/** Runs {@code run} holding the cross-tab renew lock, or without it once the lock was waited for too long. */
	function withRenewLock(run) {
		var locks = window.navigator && window.navigator.locks;
		if (!locks || typeof locks.request !== 'function') {
			return run();
		}
		var waited = abortAfter(LOCK_WAIT_MS);
		var options = waited ? { signal: waited.signal } : {};
		return locks.request(RENEW_LOCK, options, run).then(null, function (error) {
			if (error && error.name === 'AbortError') {
				return run();
			}
			throw error;
		});
	}

	/** One renewal at a time, shared by every call (and every tab) that hit the expiry together. */
	function renew(url) {
		if (!renewing) {
			var askedAt = Date.now();
			renewing = withRenewLock(function () {
				return postRenew(url, askedAt);
			}).finally(function () {
				renewing = null;
			});
		}
		return renewing;
	}
	// jquery.commonFunction.js renews through this too, so a page never runs two renewals of its own.
	window.smsRenew = renew;

	// ---- this tab's user (read by the "Choose account" page)
	function rememberTabAccount() {
		var id = account();
		if (id && enabled()) {
			try {
				window.sessionStorage.setItem(TAB_ACCOUNT, id);
			} catch (e) {
				// storage unavailable: the chooser then asks
			}
		}
	}
	rememberTabAccount();
	document.addEventListener('DOMContentLoaded', rememberTabAccount);

	// ---- fetch
	if (typeof window.fetch === 'function') {
		var originalFetch = window.fetch.bind(window);
		window.fetch = function (input, init) {
			var options = init || {};
			var url = typeof input === 'string' ? input : (input && input.url);
			if (options.__authNoRetry || !sameOrigin(url)) {
				return originalFetch(input, init);
			}
			var withHeaders = function () {
				var copy = Object.assign({}, options);
				var headers = new Headers(options.headers || (input && input.headers) || {});
				var extra = authHeaders();
				Object.keys(extra).forEach(function (name) {
					if (!headers.has(name)) {
						headers.set(name, extra[name]);
					}
				});
				copy.headers = headers;
				return copy;
			};
			return originalFetch(input, withHeaders()).then(function (response) {
				var target = retryTarget(response.status, function (name) {
					return response.headers.get(name);
				});
				if (target && target.run === leave) {
					return leave(target.url);
				}
				var reusableBody = !options.body || typeof options.body === 'string'
					|| options.body instanceof FormData || options.body instanceof URLSearchParams
					|| options.body instanceof Blob;
				if (!target || !reusableBody || typeof input !== 'string') {
					return response;
				}
				return target.run(target.url).then(function () {
					return originalFetch(input, withHeaders());
				}, function () {
					if (target.run === renew) {
						loginPage();
					}
					return response;
				});
			});
		};
	}

	// ---- jQuery
	function installJquery($) {
		$.ajaxPrefilter(function (options, originalOptions, jqXHR) {
			if (!sameOrigin(options.url) || options.__authNoRetry) {
				return;
			}
			options.headers = $.extend({}, authHeaders(), options.headers || {});
			// smsRenewHandled: jquery.commonFunction.js's $.ajax renews and replays this call itself (through
			// smsRenew); renewing here too would send a second renewal for the same 401.
			if (options.async === false || options.smsRenewHandled) {
				return;
			}
			var success = options.success;
			var error = options.error;
			var complete = options.complete;
			options.success = options.error = options.complete = null;
			var result = $.Deferred();
			jqXHR.done(function (data, status, xhr) {
				result.resolveWith(this, [data, status, xhr]);
			});
			jqXHR.fail(function (xhr, status, thrown) {
				var context = this;
				var failArgs = arguments;
				var target = retryTarget(xhr.status, function (name) {
					return xhr.getResponseHeader(name);
				});
				if (!target) {
					result.rejectWith(context, failArgs);
					return;
				}
				target.run(target.url).then(function () {
					var retry = $.extend({}, originalOptions, { success: null, error: null, complete: null, __authNoRetry: true });
					retry.headers = $.extend({}, authHeaders(), originalOptions.headers || {});
					$.ajax(retry).then(function (data, s, x) {
						result.resolveWith(context, [data, s, x]);
					}, function (x, s, t) {
						result.rejectWith(context, [x, s, t]);
					});
				}, function () {
					if (target.run === renew) {
						loginPage();
					}
					result.rejectWith(context, failArgs);
				});
			});
			if (success) {
				result.done(success);
			}
			if (error) {
				result.fail(error);
			}
			if (complete) {
				result.always(function () {
					var xhr = arguments[0] && arguments[0].readyState !== undefined ? arguments[0] : arguments[2];
					complete.call(this, xhr, result.state() === 'resolved' ? 'success' : 'error');
				});
			}
			return result.promise(jqXHR);
		});
	}

	// jQuery may load after this file (a deferred or later script tag): install as soon as it is there.
	if (window.jQuery) {
		installJquery(window.jQuery);
	} else {
		document.addEventListener('DOMContentLoaded', function () {
			if (window.jQuery) {
				installJquery(window.jQuery);
			}
		});
	}

	// ---- plain forms: carry the CSRF value as a hidden _csrf field
	document.addEventListener('submit', function (event) {
		var form = event.target;
		if (!form || !form.method || form.method.toLowerCase() !== 'post' || !enabled()
				|| !sameOrigin(form.action) || form.querySelector('input[name="_csrf"]')) {
			return;
		}
		var field = document.createElement('input');
		field.type = 'hidden';
		field.name = '_csrf';
		field.value = readCookie(CSRF_COOKIE) || '';
		form.appendChild(field);
	}, true);
})(window, document);

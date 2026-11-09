/*
 * Browser sign-in (docs/63_7_0_SMS_TOKEN_BASED_PLAN.md, section 27).
 *
 * Several users can be signed in to one browser; each has its own token cookies, and the server picks
 * which user a request is for. This script makes the page's own calls say which user they are for:
 *   - X-Account: the page's UNIQUEUUID, on every same-origin jQuery and fetch call;
 *   - X-CSRF-Token: the CSRF cookie's value, on the same calls, and a hidden _csrf field on POST forms;
 *   - when a call answers 401 with an X-Auth-Renew header (the access token expired), it renews once
 *     and repeats the call; if renewing fails, it goes to the login page;
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

	function account() {
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

	/** One renewal at a time, shared by every call that hit the expiry together. */
	function renew(url) {
		if (!renewing) {
			renewing = window.fetch(url, {
				method: 'POST',
				credentials: 'same-origin',
				headers: { 'X-CSRF-Token': readCookie(CSRF_COOKIE) || '' },
				__authNoRetry: true
			}).then(function (response) {
				if (!response.ok) {
					throw new Error('renew failed');
				}
			}).finally(function () {
				renewing = null;
			});
		}
		return renewing;
	}

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
			if (options.async === false) {
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

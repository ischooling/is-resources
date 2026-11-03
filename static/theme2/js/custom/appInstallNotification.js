/*
 * App Install Notification - device detection, role eligibility, live-class
 * suppression, countdown-gated Bootstrap modal dismissal and dismissal
 * persistence. Markup rendering lives in appInstallNotificationContent.js.
 * Entry point: initAppInstallNotification().
 */


var APP_INSTALL_CONFIG = {
	// Real, published store listings only — no fabricated/placeholder URLs.
	ANDROID_PLAY_STORE_URL: 'https://play.google.com/store/apps/details?id=org.is.cross_platform',
	IOS_APP_STORE_URL: 'https://apps.apple.com/us/app/is-app-teacher-and-student/id6748515815',
	DISMISS_DURATION_DAYS: 7,
	COUNTDOWN_SECONDS: 10,
	// How long to wait for the shared school-calendar fetch (dashboardCalendarNew.js,
	// used by both the student and teacher home dashboards) to report a fresh
	// CAN_SHOW_ENROLL_RESERVE_MODAL value before giving up.
	LIVE_CLASS_CHECK_TIMEOUT_MS: 8000,
	LIVE_CLASS_CHECK_POLL_MS: 250
};

var appInstallEligibleRoles = ['STUDENT', 'PARENT', 'TEACHER'];
// Roles that can be mid-live-class on their own home dashboard, via the shared
// dashboardCalendarNew.js schedule fetch. PARENT has no personal live class, so
// it is intentionally excluded from this gate.
var appInstallLiveClassGatedRoles = ['STUDENT', 'TEACHER'];
var appInstallDeferredPrompt = null;
var appInstallCountdownTimer = null;
// Device variant from the most recent showAppInstallNotification() call, kept
// so the "Get App" button can reopen the same modal without re-detecting the
// device or rerunning eligibility.
var appInstallLastDeviceType = null;
// 'auto' = normal eligibility-gated open (countdown, close disabled until it
// finishes). 'manual' = opened via the "Get App" button (no countdown, close
// enabled immediately). Read by the modal's shown.bs.modal handler.
var appInstallModalMode = 'auto';

// Captured as early as possible (script-load time) so the real native install
// prompt is available by the time the user clicks "Install App" on Android.
window.addEventListener('beforeinstallprompt', function (e) {
	e.preventDefault();
	appInstallDeferredPrompt = e;
});

var appInstallActivityCheckDone = false;

function checkAppActivityEligibility(callback) {
	// if (USER_ROLE === 'PARENT') {
	// 	checkParentAppActivityEligibility(callback);
	// 	return;
	// }

	var ajaxReqDetails = {
		method: 'GET',
		url: '/' + UNIQUEUUID + '/api/v1/dashboard/app-last-activity',
		showMessage: false
	};

	callCommonAjax(ajaxReqDetails).then(function (data) {
		if (!data || data.status != '2') {
			callback(false);
			return;
		}

		// Server decides via FCM + LAST_ACTIVE_TIME grace (minutes from SETTINGS) when UNINSTALLED.
		if (data.showInstallModal === true || data.appUsed === false) {
			callback(true);
			return;
		}

		callback(false);
	}).catch(function () {
		callback(false);
	});
}

function checkParentAppActivityEligibility(callback) {
	var studentUserIds = [];
	if (typeof STUDENT_LIST !== 'undefined' && STUDENT_LIST && STUDENT_LIST.studentBasicDetails) {
		$.each(STUDENT_LIST.studentBasicDetails, function (key, item) {
			if (item && item.userId) {
				studentUserIds.push(String(item.userId));
			}
		});
	}

	if (studentUserIds.length === 0) {
		callback(false);
		return;
	}

	var index = 0;

	function checkNextStudent() {
		if (index >= studentUserIds.length) {
			callback(true);
			return;
		}

		var currentUserId = studentUserIds[index];
		var ajaxReqDetails = {
			method: 'POST',
			url: '/' + UNIQUEUUID + '/api/v1/dashboard/app-last-activity',
			body: { userId: currentUserId },
			showMessage: false
		};

		callCommonAjax(ajaxReqDetails).then(function (data) {
			if (!data || data.status != '2') {
				callback(false);
				return;
			}

			if (data.showInstallModal === true || data.appUsed === false) {
				index++;
				checkNextStudent();
				return;
			}

			callback(false);
		}).catch(function () {
			callback(false);
		});
	}

	checkNextStudent();
}


function isAppInstallEligibleRole() {
	if (typeof USER_ROLE === 'undefined' || !USER_ROLE) {
		return false;
	}
	return $.inArray(USER_ROLE, appInstallEligibleRoles) > -1;
}

// The mobile app is only published/relevant for this one school for now
// (SCHOOL_ID is the existing global set by CommonCustomScript.jsp). String
// comparison since SCHOOL_ID is interpolated from JSP as a string.
function isAppInstallEligibleSchool() {
	return typeof SCHOOL_ID !== 'undefined' && String(SCHOOL_ID) === '1';
}

function detectAppInstallDevice() {
	if (typeof navigator === 'undefined' || !navigator.userAgent) {
		return null;
	}
	var ua = navigator.userAgent;
	var isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
	// iPadOS 13+ reports a Mac-like user agent but is touch-capable, unlike a real Mac.
	var isIPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
	if (isIOS || isIPadOS) {
		return 'ios';
	}
	if (/Android/i.test(ua)) {
		return 'android';
	}
	return 'desktop';
}

function isAppInstallAlreadyInstalled() {
	try {
		if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
			return true;
		}
		if (window.navigator.standalone === true) {
			return true;
		}
	} catch (e) {
		// Feature not supported in this browser - fall through to show the notification.
	}
	return false;
}

function getAppInstallNotificationStorageKey() {
	var scopeId = (typeof USER_ID !== 'undefined' && USER_ID) ? USER_ID : 'anonymous';
	return 'appInstallNotifDismissUntil_' + scopeId;
}

function isAppInstallNotificationDismissed() {
	try {
		var dismissedUntil = window.localStorage.getItem(getAppInstallNotificationStorageKey());
		return !!dismissedUntil && parseInt(dismissedUntil, 10) > Date.now();
	} catch (e) {
		return false;
	}
}

function dismissAppInstallNotification() {
	try {
		var dismissedUntil = Date.now() + (APP_INSTALL_CONFIG.DISMISS_DURATION_DAYS * 24 * 60 * 60 * 1000);
		window.localStorage.setItem(getAppInstallNotificationStorageKey(), String(dismissedUntil));
	} catch (e) {
		// Storage unavailable (private browsing, quota) - notification will simply reappear next load.
	}
}

function isLiveClassSignalReady() {
	return typeof IS_CLASS_LIVE === 'boolean';
}

/**
 * Waits (bounded) for IS_CLASS_LIVE to be set by the calendar module,
 * then calls back with true (suppress) / false (allow).
 * Roles with no personal live class (PARENT) resolve immediately.
 * On timeout the safe fallback is to suppress.
 */
function resolveLiveClassSuppression(callback) {
	if ($.inArray(USER_ROLE, appInstallLiveClassGatedRoles) < 0) {
		callback(false);
		return;
	}
	if (isLiveClassSignalReady()) {
		callback(IS_CLASS_LIVE);
		return;
	}
	var waited = 0;
	var pollMs = APP_INSTALL_CONFIG.LIVE_CLASS_CHECK_POLL_MS;
	var poll = window.setInterval(function () {
		waited += pollMs;
		if (isLiveClassSignalReady()) {
			window.clearInterval(poll);
			callback(IS_CLASS_LIVE);
			return;
		}
		if (waited >= APP_INSTALL_CONFIG.LIVE_CLASS_CHECK_TIMEOUT_MS) {
			window.clearInterval(poll);
			callback(true); // timeout: no calendar data at all -> suppress to be safe
		}
	}, pollMs);
}

function clearAppInstallCountdown() {
	if (appInstallCountdownTimer) {
		window.clearInterval(appInstallCountdownTimer);
		appInstallCountdownTimer = null;
	}
}

function startAppInstallCountdown() {
	clearAppInstallCountdown();
	var total = APP_INSTALL_CONFIG.COUNTDOWN_SECONDS;
	var remaining = total;
	var ringCircumference = 2 * Math.PI * 19;
	var $modal = $('#appInstallNotificationModal');
	if (!$modal.length) {
		return;
	}
	// Every dismiss control (header ×, desktop footer button, mobile "Maybe
	// Later") shares this class, so one disabled-toggle/class-swap gates and
	// restyles all of them together.
	var $closeControls = $modal.find('.app-install-notification__close');
	var $tickingLabel = $modal.find('[data-ticking-label] .app-install-notification__close-label');
	// var $footerInfo = $modal.find('.app-install-notification__footer-info');
	var $ring = $modal.find('.app-install-notification__ring');
	var $ringText = $modal.find('.app-install-notification__ring-text');
	var $ringProgress = $modal.find('.app-install-notification__ring-progress');
	var renderTick = function () {
		// Guard against a countdown tick firing after the modal was removed
		// from the DOM (e.g. closed/destroyed between ticks).
		if (!document.getElementById('appInstallNotificationModal')) {
			clearAppInstallCountdown();
			return;
		}
		var done = remaining <= 0;
		$closeControls.prop('disabled', !done);
		$closeControls.toggleClass('bg-light-danger', !done).toggleClass('bg-danger text-white', done);
		$tickingLabel.text(done ? 'Close' : ('Close (' + remaining + 's)'));
		// $footerInfo.toggleClass('d-none', !done);
		if (done) {
			$ring.addClass('d-none');
		} else {
			$ringText.text(remaining + 's');
			$ringProgress.css('stroke-dashoffset', ringCircumference * (1 - remaining / total));
		}
	};
	renderTick();
	appInstallCountdownTimer = window.setInterval(function () {
		remaining = Math.max(0, remaining - 1);
		renderTick();
		if (remaining <= 0) {
			clearAppInstallCountdown();
		}
	}, 1000);
}

// Puts the modal straight into its "countdown finished" visual state: close
// controls enabled + restyled, ring hidden. Used for a manual ('Get App')
// open, which skips the countdown entirely instead of racing it to zero.
function showAppInstallModalAsReady() {
	clearAppInstallCountdown();
	var $modal = $('#appInstallNotificationModal');
	var $closeControls = $modal.find('.app-install-notification__close');
	var $tickingLabel = $modal.find('[data-ticking-label] .app-install-notification__close-label');
	var $ring = $modal.find('.app-install-notification__ring');
	$closeControls.prop('disabled', false);
	$closeControls.removeClass('bg-light-danger').addClass('bg-danger text-white');
	$tickingLabel.text('Close');
	$ring.addClass('d-none');
}

// Once the user has seen the auto modal and closed it, "Get App" stays
// available on every later page load/refresh too - not just for the rest of
// the current session - so this is remembered the same way the 7-day
// dismissal is (localStorage, scoped per user).
function getGetAppButtonStorageKey() {
	var scopeId = (typeof USER_ID !== 'undefined' && USER_ID) ? USER_ID : 'anonymous';
	return 'appInstallGetAppBtnShown_' + scopeId;
}

function isGetAppButtonPersisted() {
	try {
		return window.localStorage.getItem(getGetAppButtonStorageKey()) === '1';
	} catch (e) {
		return false;
	}
}

function persistGetAppButtonShown() {
	try {
		window.localStorage.setItem(getGetAppButtonStorageKey(), '1');
	} catch (e) {
		// Storage unavailable (private browsing, quota) - button simply won't
		// persist past this page load, same fallback as the dismiss storage.
	}
}

function showGetAppButton() {
	$('#getAppBtn').removeClass('d-none');
	persistGetAppButtonShown();
}

// Reopens the same modal via the "Get App" button: reuses the device variant
// captured on the last (eligibility-gated) auto open when there was one this
// page load; otherwise (e.g. the button is showing from a prior session via
// isGetAppButtonPersisted()) falls back to detecting it fresh. Either way this
// neither reruns the app-install eligibility/live-class checks.
function openAppInstallNotificationManually(Clickfrom) {
	var deviceType = appInstallLastDeviceType || detectAppInstallDevice();
	if (!deviceType) {
		return;
	}
	showAppInstallNotification(deviceType, 'manual', Clickfrom);
}

function bindAppInstallNotificationEvents() {
	$(document).off('click.appInstallNotification');
	$(document).on('click.appInstallNotification', '#appInstallNotificationModal .app-install-notification__close', function () {
		if ($(this).prop('disabled')) {
			return;
		}
		dismissAppInstallNotification();
		$('#appInstallNotificationModal').modal('hide');
		showGetAppButton();
	});
	$(document).on('click.appInstallNotification', '#appInstallNotificationModal .app-install-notification__button[data-store-url]', function (e) {
		e.preventDefault();
		var $button = $(this);
		var storeUrl = $button.attr('data-store-url');
		if (appInstallDeferredPrompt && $button.hasClass('app-install-notification__button--android-prompt')) {
			appInstallDeferredPrompt.prompt();
			appInstallDeferredPrompt.userChoice.then(function () {
				appInstallDeferredPrompt = null;
			});
			return;
		}
		if (storeUrl) {
			window.open(storeUrl, '_blank', 'noopener');
		}
	});
	$('#appInstallNotificationModal').off('shown.bs.modal.appInstallNotification');
	$('#appInstallNotificationModal').on('shown.bs.modal.appInstallNotification', function () {
		if (appInstallModalMode === 'manual') {
			showAppInstallModalAsReady();
		} else {
			startAppInstallCountdown();
		}
	});
	$('#appInstallNotificationModal').off('hidden.bs.modal.appInstallNotification');
	$('#appInstallNotificationModal').on('hidden.bs.modal.appInstallNotification', function () {
		clearAppInstallCountdown();
		$(this).remove();
	});
}

function showAppInstallNotification(deviceType, mode, Clickfrom) {
	appInstallLastDeviceType = deviceType;
	appInstallModalMode = mode || 'auto';
	if ($('#appInstallNotificationModal').length) {
		return;
	}
	renderAppInstallNotification(deviceType, Clickfrom);
	bindAppInstallNotificationEvents();
	$('#appInstallNotificationModal').modal({ backdrop: 'static', keyboard: false });
}

function initAppInstallNotification() {
	// Restored regardless of the gates/returns below: once "Get App" has been
	// shown before (any past page load), it keeps showing on every refresh,
	// not just for the rest of that one session.
	if (isGetAppButtonPersisted()) {
		$('#getAppBtn').removeClass('d-none');
	}
	if (appInstallActivityCheckDone) {
		return;
	}
	if (!isAppInstallEligibleSchool()) {
		return;
	}
	if (!isAppInstallEligibleRole()) {
		return;
	}
	if (isAppInstallAlreadyInstalled()) {
		return;
	}
	if (isAppInstallNotificationDismissed()) {
		return;
	}
	var deviceType = detectAppInstallDevice();
	if (!deviceType) {
		return;
	}
	appInstallActivityCheckDone = true;
	checkAppActivityEligibility(function (eligible) {
		if (!eligible) {
			return;
		}
		resolveLiveClassSuppression(function (suppress) {
			if (suppress) {
				return;
			}
			showAppInstallNotification(deviceType);
		});
	});
}

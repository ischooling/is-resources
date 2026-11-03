/*
 * App Install Notification - content/markup builder.
 * Pairs with appInstallNotification.js (logic/events) following the project's
 * XyzContent.js / Xyz.js convention. DOM rendering only; no business logic here.
 * Markup follows the project's existing Bootstrap 4 modal convention (see
 * announcementModalContent() in announcementContent.js).
 */

// Intro line + feature list: identical for every eligible role (Student,
// Parent, Teacher all see the same copy - this is not role-specific).
var APP_INSTALL_TAGLINE = 'Everything you need for school, right on your phone.';
var APP_INSTALL_FEATURES = [
	{ icon: '🔔', text: 'All notifications in one place: school announcements, class cancellations, class reschedules and every other update.' },
	{ icon: '⏰', text: 'Class reminders: get notified before your class starts so you join on time.' },
	{ icon: '📅', text: 'Class calendar: see all your upcoming and live classes at a glance.' },
	{ icon: '📓', text: 'Diary: view notes and homework shared by your teachers.' },
	{ icon: '💬', text: 'Chat: message students, teachers and admins directly in the app.' }
];

function getAppInstallRoleDescription() {
	return APP_INSTALL_TAGLINE;
}

function buildAppInstallNotificationFeatureListHtml() {
	var itemsHtml = '';
	for (var i = 0; i < APP_INSTALL_FEATURES.length; i++) {
		itemsHtml += '<li><span class="app-install-notification__feature-icon" aria-hidden="true">' + APP_INSTALL_FEATURES[i].icon + '</span><span>' + APP_INSTALL_FEATURES[i].text + '</span></li>';
	}
	return '<ul class="app-install-notification__feature-list text-black">' + itemsHtml + '</ul>';
}

function buildAppInstallNotificationHeaderHtml(title, description, showRing, Clickfrom) {
    return '<div class="app-install-notification__header text-black">'
        + '<span class="" aria-hidden="true">'
        	+ '<img src="' + PATH_FOLDER_IMAGE2 + 'apple-icon-57x57.png" alt="' + SCHOOL_NAME + '" width="100%">'
        + '</span>'
        + '<div class="app-install-notification__header-text">'
        + '<h4 class="app-install-notification__title">' + title + '</h4>'
        + '<p class="app-install-notification__description">' + description + '</p>'
        + '</div>'
        + (showRing && Clickfrom != "button" ? buildAppInstallNotificationRingHtml() : '')
        // + buildAppInstallNotificationCloseControlHtml('header')
        + '</div>';
}

function buildAppInstallNotificationRingHtml() {
	return '<div class="app-install-notification__ring" aria-hidden="true">'
		+ '<svg viewBox="0 0 44 44">'
		+ '<circle class="app-install-notification__ring-track" cx="22" cy="22" r="19"></circle>'
		+ '<circle class="app-install-notification__ring-progress" cx="22" cy="22" r="19"></circle>'
		+ '</svg>'
		+ '<span class="app-install-notification__ring-text">' + APP_INSTALL_CONFIG.COUNTDOWN_SECONDS + 's</span>'
		+ '</div>';
}

/**
 * A dismiss control. All variants share the base class app-install-notification__close
 * so appInstallNotification.js gates and wires every one of them identically; the
 * modifier class only changes its visual presentation.
 * kind: 'header' (icon-only ×), 'footer' (modal-footer text button, ticking
 * label - used by every device variant, mobile included).
 */
function buildAppInstallNotificationCloseControlHtml(kind) {
	// bg-light-danger (disabled/counting) -> bg-danger (enabled/done) are
	// existing project utility classes (see new-theme-style.css), toggled by
	// appInstallNotification.js's countdown tick rather than invented here.
	// if (kind === 'header') {
	// 	return '<button type="button" class="app-install-notification__close app-install-notification__close--header bg-light-danger" disabled aria-label="Close">'
	// 		+ '<i class="fa fa-times" aria-hidden="true"></i>'
	// 		+ '</button>';
	// }
	return '<button type="button" class="app-install-notification__close app-install-notification__close--footer bg-light-danger" disabled data-ticking-label>'
		+ '<span class="app-install-notification__close-label">Close (' + APP_INSTALL_CONFIG.COUNTDOWN_SECONDS + 's)</span>'
		+ '</button>';
}

function buildAppInstallNotificationFooterBarHtml(includeCloseButton) {
	// The "You can close this window" message and countdown seconds text stay
	// hidden (d-none) until the countdown reaches 0; appInstallNotification.js
	// reveals them and hides the ring at that point.
	return '<div class="app-install-notification__footer-bar justify-content-end">'
		// + '<div class="app-install-notification__footer-info d-none">'
		// + '<i class="fa fa-clock" aria-hidden="true"></i> You can close this window'
		// + '</div>'
		+ (includeCloseButton ? buildAppInstallNotificationCloseControlHtml('footer') : '')
		+ '</div>';
}

/*
 * This project's bundled Font Awesome 5.6.3 only ships the solid font file
 * (fa-solid-900) - there is no brands font, so fa-android/fa-apple/
 * fa-google-play have no glyph at all and render blank. Generic solid icons
 * (fa-robot, fa-mobile-alt, etc.) are used instead; color + label text still
 * make the Android/iOS/platform distinction clear.
 */
function buildAppInstallNotificationGraphicHtml(variant) {
	if (variant === 'android') {
		return '<div class="app-install-notification__graphic">'
			+ '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="#1f9d55" width="80px"><path d="M131.2 125.9C136.5 125.4 141.8 126.5 146.5 128.9C151.2 131.3 155.1 135.1 157.8 139.7C174.8 169.2 192 198.6 209 228.1C212.5 226.7 216 225.4 219.5 224.2C250.8 213.3 283.7 207.6 316.9 207.3C317.9 207.3 319 207.3 320.1 207.3C358.2 207.3 396.3 214.3 431.7 228.4L483 139.7C484.8 136.5 487.3 133.7 490.2 131.5C493.1 129.3 496.4 127.6 500 126.7C503.1 125.9 506.4 125.6 509.6 125.9C513.8 126.3 517.9 127.6 521.5 129.7C525.5 132.1 528.8 135.4 531.2 139.4C533.2 142.8 534.5 146.6 535 150.6C535.5 154.6 535.1 158.6 533.8 162.3C533.2 164.2 532.4 166 531.4 167.8L481.7 253.6C501.2 265.8 519.3 280.1 535.6 296.4C547.9 308.6 559.1 321.8 569.1 335.9C577.3 347.4 584.7 359.5 591.3 372.1C608.8 405.7 619.9 442.6 624 480.2L16 480.2C20.1 442.5 31.2 405.7 48.7 372.1C63.2 344.2 82.1 318.6 104.4 296.4C120.9 280 139.1 265.5 158.9 253.3L109.4 167.9C105.7 161.5 104.7 153.8 106.6 146.7C108.5 139.6 113 133.6 119.3 129.9C122.9 127.7 127 126.4 131.2 126.1zM198.5 341.7C186.3 333.6 168.4 339.2 158.4 354.2C148.4 369.2 150.2 388 162.3 396.1C174.4 404.2 192.4 398.6 202.4 383.6C212.4 368.6 210.6 349.8 198.5 341.7zM482.1 354.2C472.1 339.2 454.2 333.6 442 341.7C429.8 349.8 428.1 368.6 438.1 383.6C448.1 398.6 466 404.2 478.2 396.1C490.4 388 492.1 369.2 482.1 354.2z"/></svg>'
			// + '<span class="app-install-notification__graphic-icon app-install-notification__graphic-icon--light"><i class="fa fa-mobile-alt" aria-hidden="true"></i></span>'
			// + '<span class="app-install-notification__graphic-icon app-install-notification__graphic-icon--pale"><i class="fa fa-check-circle" aria-hidden="true"></i></span>'
			+ '</div>';
	}
	return '<div class="app-install-notification__graphic">'
		+ '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="#000000" width="70px"><path d="M319.1 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7-55.8 .9-115.1 44.5-115.1 133.2 0 26.2 4.8 53.3 14.4 81.2 12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zM262.5 104.5c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>'
		// + '<span class="app-install-notification__graphic-icon app-install-notification__graphic-icon--dark"><i class="fa fa-tablet-alt" aria-hidden="true"></i></span>'
		+ '</div>';
}

function buildAndroidAppInstallNotificationBodyHtml() {
	var androidUrl = APP_INSTALL_CONFIG.ANDROID_PLAY_STORE_URL;
	return buildAppInstallNotificationHeaderHtml('Stay Connected with the '+SCHOOL_NAME+' App', getAppInstallRoleDescription(), false)
		+ buildAppInstallNotificationFeatureListHtml()
		+ buildAppInstallNotificationGraphicHtml('android')
		+ '<div class="app-install-notification__actions">'
		+ (androidUrl ? 
			// '<button type="button" class="app-install-notification__button app-install-notification__button--primary app-install-notification__button--android-prompt" data-store-url="' + androidUrl + '">Install App</button>' : '')
			'<button type="button" class="app-install-notification__button app-install-notification__button--store-badge app-install-notification__button--google" data-store-url="' + androidUrl + '">'
				+ '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="#ffffff" width="30px"><path d="M131.2 125.9C136.5 125.4 141.8 126.5 146.5 128.9C151.2 131.3 155.1 135.1 157.8 139.7C174.8 169.2 192 198.6 209 228.1C212.5 226.7 216 225.4 219.5 224.2C250.8 213.3 283.7 207.6 316.9 207.3C317.9 207.3 319 207.3 320.1 207.3C358.2 207.3 396.3 214.3 431.7 228.4L483 139.7C484.8 136.5 487.3 133.7 490.2 131.5C493.1 129.3 496.4 127.6 500 126.7C503.1 125.9 506.4 125.6 509.6 125.9C513.8 126.3 517.9 127.6 521.5 129.7C525.5 132.1 528.8 135.4 531.2 139.4C533.2 142.8 534.5 146.6 535 150.6C535.5 154.6 535.1 158.6 533.8 162.3C533.2 164.2 532.4 166 531.4 167.8L481.7 253.6C501.2 265.8 519.3 280.1 535.6 296.4C547.9 308.6 559.1 321.8 569.1 335.9C577.3 347.4 584.7 359.5 591.3 372.1C608.8 405.7 619.9 442.6 624 480.2L16 480.2C20.1 442.5 31.2 405.7 48.7 372.1C63.2 344.2 82.1 318.6 104.4 296.4C120.9 280 139.1 265.5 158.9 253.3L109.4 167.9C105.7 161.5 104.7 153.8 106.6 146.7C108.5 139.6 113 133.6 119.3 129.9C122.9 127.7 127 126.4 131.2 126.1zM198.5 341.7C186.3 333.6 168.4 339.2 158.4 354.2C148.4 369.2 150.2 388 162.3 396.1C174.4 404.2 192.4 398.6 202.4 383.6C212.4 368.6 210.6 349.8 198.5 341.7zM482.1 354.2C472.1 339.2 454.2 333.6 442 341.7C429.8 349.8 428.1 368.6 438.1 383.6C448.1 398.6 466 404.2 478.2 396.1C490.4 388 492.1 369.2 482.1 354.2z"/></svg>'
				+ '<span class="app-install-notification__store-badge-text"><small>Get it on Google Play</small>Install App</span>'
				+ '<i class="fa fa-chevron-right app-install-notification__store-badge-chevron" aria-hidden="true"></i>'
			+ '</button>':'')
		+ '</div>'
		+ buildAppInstallNotificationFooterBarHtml(true);
}

function buildIosAppInstallNotificationBodyHtml() {
	var iosUrl = APP_INSTALL_CONFIG.IOS_APP_STORE_URL;
	return buildAppInstallNotificationHeaderHtml('Stay Connected with the '+SCHOOL_NAME+' App', getAppInstallRoleDescription(), false)
		+ buildAppInstallNotificationFeatureListHtml()
		+ buildAppInstallNotificationGraphicHtml('ios')
		+ '<div class="app-install-notification__actions">'
		+ (iosUrl ? 
			// '<button type="button" class="app-install-notification__button app-install-notification__button--primary" data-store-url="' + iosUrl + '">Install App</button>' : '')
			'<button type="button" class="app-install-notification__button app-install-notification__button--store-badge app-install-notification__button--apple" data-store-url="' + iosUrl + '">'
				+ '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="#ffffff" width="20px"><path d="M319.1 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7-55.8 .9-115.1 44.5-115.1 133.2 0 26.2 4.8 53.3 14.4 81.2 12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zM262.5 104.5c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>'
				+ '<span class="app-install-notification__store-badge-text"><small>Download on the App Store</small>Install App</span>'
				+ '<i class="fa fa-chevron-right app-install-notification__store-badge-chevron" aria-hidden="true"></i>'
			+ '</button>':'')
		+ '</div>'
		+ buildAppInstallNotificationFooterBarHtml(true);
}

function buildAppInstallNotificationStoreBadgeHtml(kind, storeUrl) {
	if (!storeUrl) {
		return '';
	}
	if (kind === 'android') {
		return '<button type="button" class="app-install-notification__button app-install-notification__button--store-badge app-install-notification__button--google" data-store-url="' + storeUrl + '">'
			+ '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="#ffffff" width="30px"><path d="M131.2 125.9C136.5 125.4 141.8 126.5 146.5 128.9C151.2 131.3 155.1 135.1 157.8 139.7C174.8 169.2 192 198.6 209 228.1C212.5 226.7 216 225.4 219.5 224.2C250.8 213.3 283.7 207.6 316.9 207.3C317.9 207.3 319 207.3 320.1 207.3C358.2 207.3 396.3 214.3 431.7 228.4L483 139.7C484.8 136.5 487.3 133.7 490.2 131.5C493.1 129.3 496.4 127.6 500 126.7C503.1 125.9 506.4 125.6 509.6 125.9C513.8 126.3 517.9 127.6 521.5 129.7C525.5 132.1 528.8 135.4 531.2 139.4C533.2 142.8 534.5 146.6 535 150.6C535.5 154.6 535.1 158.6 533.8 162.3C533.2 164.2 532.4 166 531.4 167.8L481.7 253.6C501.2 265.8 519.3 280.1 535.6 296.4C547.9 308.6 559.1 321.8 569.1 335.9C577.3 347.4 584.7 359.5 591.3 372.1C608.8 405.7 619.9 442.6 624 480.2L16 480.2C20.1 442.5 31.2 405.7 48.7 372.1C63.2 344.2 82.1 318.6 104.4 296.4C120.9 280 139.1 265.5 158.9 253.3L109.4 167.9C105.7 161.5 104.7 153.8 106.6 146.7C108.5 139.6 113 133.6 119.3 129.9C122.9 127.7 127 126.4 131.2 126.1zM198.5 341.7C186.3 333.6 168.4 339.2 158.4 354.2C148.4 369.2 150.2 388 162.3 396.1C174.4 404.2 192.4 398.6 202.4 383.6C212.4 368.6 210.6 349.8 198.5 341.7zM482.1 354.2C472.1 339.2 454.2 333.6 442 341.7C429.8 349.8 428.1 368.6 438.1 383.6C448.1 398.6 466 404.2 478.2 396.1C490.4 388 492.1 369.2 482.1 354.2z"/></svg>'
			+ '<span class="app-install-notification__store-badge-text"><small>Get it on</small>Google Play</span>'
			// + '<i class="fa fa-chevron-right app-install-notification__store-badge-chevron" aria-hidden="true"></i>'
			+ '</button>';
	}
	return '<button type="button" class="app-install-notification__button app-install-notification__button--store-badge app-install-notification__button--apple" data-store-url="' + storeUrl + '">'
		+ '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="#ffffff" width="20px"><path d="M319.1 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7-55.8 .9-115.1 44.5-115.1 133.2 0 26.2 4.8 53.3 14.4 81.2 12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zM262.5 104.5c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>'
		+ '<span class="app-install-notification__store-badge-text"><small>Download on the</small>App Store</span>'
		// + '<i class="fa fa-chevron-right app-install-notification__store-badge-chevron" aria-hidden="true"></i>'
		+ '</button>';
}

function buildAppInstallNotificationQrBlockHtml(label, storeUrl) {
	if (!storeUrl) {
		return '';
	}
	// Each QR encodes that platform's own real store URL directly - not a
	// single shared/"smart" link. A static QR image cannot detect which
	// device is scanning it, so the only way to guarantee "iOS QR -> App
	// Store, Android QR -> Play Store" without inventing a backend
	// redirect/landing endpoint is to give each platform its own QR code.
	var qrSrc = 'https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=' + encodeURIComponent(storeUrl);
	return '<div class="app-install-notification__qr-block">'
		+ '<img class="app-install-notification__qr-code" src="' + qrSrc + '" alt="QR code to install the ' + label + ' app" width="130" height="130">'
		+ '<p class="app-install-notification__qr-label text-black">' + label + '</p>'
		+ '</div>';
}

function buildDesktopAppInstallNotificationBodyHtml(Clickfrom) {
	var androidUrl = APP_INSTALL_CONFIG.ANDROID_PLAY_STORE_URL;
	var iosUrl = APP_INSTALL_CONFIG.IOS_APP_STORE_URL;

	var qrCol = '<div class="app-install-notification__col app-install-notification__qr-col">'
		+ '<h5 class="app-install-notification__col-title">Scan to Install</h5>'
		+ '<div class="app-install-notification__qr-group">'
		+ buildAppInstallNotificationQrBlockHtml('Android', androidUrl)
		+ buildAppInstallNotificationQrBlockHtml('iOS', iosUrl)
		+ '</div>'
		+ '<div class="app-install-notification__store-badges">'
		+ buildAppInstallNotificationStoreBadgeHtml('android', androidUrl)
		+ buildAppInstallNotificationStoreBadgeHtml('ios', iosUrl)
		+ '</div>'
		+ '<p class="app-install-notification__qr-caption text-black"><i class="fa fa-info-circle font-16 text-primary position-relative" style="top:4px" aria-hidden="true"></i> Scan the matching QR code with your mobile camera to open the correct app store for your device.</p>'
		+ '</div>';

	var steps = [
		'Open the camera app on your mobile phone.',
		'Scan the QR code displayed on your computer.',
		'Open the link on your mobile device.',
		'Install the app using the appropriate Android or iOS instructions.'
	];
	var stepsHtml = '';
	for (var i = 0; i < steps.length; i++) {
		stepsHtml += '<li class="app-install-notification__guide-step">'
			+ '<span class="app-install-notification__guide-step-badge">' + (i + 1) + '</span>'
			+ '<span>' + steps[i] + '</span>'
			+ '</li>';
	}

	var guideCol = '<div class="app-install-notification__col app-install-notification__guide-col">'
		+ '<h5 class="app-install-notification__col-title">Easy Installation Guide</h5>'
		+ '<ol class="app-install-notification__guide">' + stepsHtml + '</ol>'
		// + '<div class="app-install-notification__guide-highlight">'
		// 	+ '<i class="fa fa-mobile font-28 text-primary" aria-hidden="true"></i>'
		// 	+ '<span class="text-black font-weight-semibold">Get quick access to your classes, assignments and more!</span>'
		// + '</div>'
		+ '</div>';

	return buildAppInstallNotificationHeaderHtml('Stay Connected with the '+SCHOOL_NAME+' App', getAppInstallRoleDescription(), true, Clickfrom)
		+ buildAppInstallNotificationFeatureListHtml()
		+ '<div class="app-install-notification__panel">' + qrCol + guideCol + '</div>'
		+ buildAppInstallNotificationFooterBarHtml(true);
}

function renderAppInstallNotification(deviceType, Clickfrom) {
	if ($('#appInstallNotificationModal').length) {
		return;
	}
	var bodyHtml;
	var modifierClass;
	var dialogSizeClass = '';
	if (deviceType === 'android') {
		bodyHtml = buildAndroidAppInstallNotificationBodyHtml();
		modifierClass = 'app-install-notification--android';
	} else if (deviceType === 'ios') {
		bodyHtml = buildIosAppInstallNotificationBodyHtml();
		modifierClass = 'app-install-notification--ios';
	} else {
		bodyHtml = buildDesktopAppInstallNotificationBodyHtml(Clickfrom);
		modifierClass = 'app-install-notification--desktop';
		dialogSizeClass = ' modal-lg';
	}
	var html = '<div class="modal fade app-install-notification ' + modifierClass + '" id="appInstallNotificationModal" tabindex="-1" role="dialog" aria-labelledby="appInstallNotificationTitle" aria-hidden="true">'
		+ '<div class="modal-dialog modal-dialog-centered' + dialogSizeClass + '" role="document">'
		+ '<div class="modal-content">'
		+ '<div class="modal-body">'
		+ bodyHtml
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '</div>';
	$('body').append(html);
}

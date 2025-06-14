window.isCookieConsent = (function () {
		var COOKIE_VALUE = 1;
	
		function consentWithCookies() {
			setCookie('is_cookie_consent', COOKIE_VALUE, 365 * 20);
			hideCookieDialog();
		}
		function cookieExists(name) {
			return (document.cookie.split('; ').indexOf(name + '=' + COOKIE_VALUE) !== -1);
		}
		function hideCookieDialog() {
			var dialogs = document.getElementsByClassName('cookie-consent');
			for (var i = 0; i < dialogs.length; ++i) {
				dialogs[i].style.display = 'none';
			}
		}
		function showCookieDialog(){
			var dialogs = document.getElementsByClassName('cookie-consent');
			for (var i = 0; i < dialogs.length; ++i) {
				dialogs[i].style.display = 'block';
			}
		}
		function setCookie(name, value, expirationInDays) {
			var date = new Date();
			date.setTime(date.getTime() + (expirationInDays * 24 * 60 * 60 * 1000));
			document.cookie = name + '=' + value + '; ' + 'expires=' + date.toUTCString() +';path=/';
		}
		if(cookieExists('is_cookie_consent')) {
			hideCookieDialog();
		}else{
			showCookieDialog();
		}
		var buttons = document.getElementsByClassName('cookie-consent-agree');
	
		for (var i = 0; i < buttons.length; ++i) {
			buttons[i].addEventListener('click', consentWithCookies);
		}
		return {
			consentWithCookies: consentWithCookies,
			hideCookieDialog: hideCookieDialog
		};
	})();
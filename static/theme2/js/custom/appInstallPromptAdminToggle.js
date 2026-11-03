/**
 * Admin Manage User List — per-user "Install mobile app" reminder toggle (student / parent / teacher).
 * Not shown when the logged-in user is STUDENT, PARENT, or TEACHER.
 */

function isAdminAppInstallPromptContext() {
	if (typeof USER_ROLE === 'undefined') {
		return false;
	}
	return USER_ROLE !== 'STUDENT' && USER_ROLE !== 'PARENT' && USER_ROLE !== 'TEACHER';
}

function appInstallPromptToggleHtml(userId, enabled, embedded, profileTimezone) {
	var checked = enabled !== 'N';
	var panelClass = embedded ? 'profile-app-install-prompt-embedded admin-app-install-prompt-panel' : 'main-card mb-3 p-3 border admin-app-install-prompt-panel';
	var inner = '<div class="' + panelClass + '" id="adminAppInstallPromptCard" data-user-id="' + userId + '">'
		+ (embedded ? '<h6 class="font-weight-bold text-dark mb-2">Install mobile app reminder</h6>' : '')

		+ '<div class="custom-control custom-switch custom-switch-lg pl-0">'
		+ '<input type="checkbox" class="custom-control-input" id="adminAppInstallPromptEnabled" '
		+ (checked ? 'checked' : '') + '>'
		+ '<label class="custom-control-label app-install-prompt-switch-label" for="adminAppInstallPromptEnabled">'
		+ 'Show &quot;Install mobile app&quot; reminder on web dashboard (when eligible)</label>'
		+ '</div>'
		+ '<button type="button" class="btn btn-sm btn-primary mt-3 font-weight-bold" id="saveAdminAppInstallPromptBtn">Save</button>'
		+ '</div>';
	return inner;
}

function mountAppInstallPromptAdminToggle($container, userId, enabledFlag, embedded, profileTimezone) {
	if (!isAdminAppInstallPromptContext() || !userId) {
		return;
	}
	if (!$container || !$container.length) {
		return;
	}
	$container.html(appInstallPromptToggleHtml(userId, enabledFlag || 'Y', !!embedded, profileTimezone));
	$('#saveAdminAppInstallPromptBtn').off('click.appInstallPrompt').on('click.appInstallPrompt', function () {
		saveAppInstallPromptAdminToggle(userId);
	});
}

function loadAndMountAppInstallPromptAdminToggle($container, userId) {
	if (!isAdminAppInstallPromptContext() || !userId) {
		return;
	}
	$.ajax({
		type: 'GET',
		url: CONTEXT_PATH + SCHOOL_UUID + '/dashboard/app-install-prompt-enabled/' + UNIQUEUUID,
		data: { userId: userId },
		dataType: 'json',
		success: function (res) {
			if (res && res.status === 'success') {
				mountAppInstallPromptAdminToggle($container, userId, res.enabled);
			}
		}
	});
}

// Profile views render this action from injected JSP content with an inline
// onclick, so publish it explicitly on window for reliable global lookup.
window.saveAppInstallPromptAdminToggle = function (userId) {
	var enabled = $('#adminAppInstallPromptEnabled').is(':checked') ? 'Y' : 'N';
	$.ajax({
		type: 'POST',
		url: CONTEXT_PATH + SCHOOL_UUID + '/dashboard/app-install-prompt-enabled/' + UNIQUEUUID,
		data: { userId: userId, enabled: enabled },
		dataType: 'json',
		success: function (res) {
			if (res && res.status === 'success') {
				if (typeof showMessageTheme2 === 'function') {
					showMessageTheme2(1, 'Install app reminder setting saved.');
				}
			} else if (typeof showMessageTheme2 === 'function') {
				showMessageTheme2(0, (res && res.message) ? res.message : 'Unable to save setting.');
			}
		},
		error: function () {
			if (typeof showMessageTheme2 === 'function') {
				showMessageTheme2(0, 'Unable to save setting.');
			}
		}
	});
};

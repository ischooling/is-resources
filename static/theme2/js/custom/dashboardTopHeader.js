(function ($) {
	'use strict';

	var config = window.IS_HEADER_CONFIG || {};
	var IS_CHAT_URL = (config.isChatUrl || '').replace(/\/$/, '');
	var IS_CHAT_ORIGIN = IS_CHAT_URL;
	var USER_ROLE = config.userRole || '';
	var ELIGIBLE_IS_CHAT = config.eligibleIsChat === true || config.eligibleIsChat === 'true';
	var NOTIFICATION_PAGE_LINKS = Array.isArray(config.notificationPageLinks)
		? config.notificationPageLinks
		: [];
	var USER_IS_CHAT = config.userIsChat || {};
	var PARENT_STUDENT_ID = config.parentStudentId || '';

	function escapeChatHtml(s) {
		return String(s == null ? '' : s)
			.replace(/&/g, '&amp;').replace(/</g, '&lt;')
			.replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
	}

	function renderChatStack(conversations) {
		var $stack = $('#chat-btn-stack');
		if (!$stack.length) return;
		var list = Array.isArray(conversations) ? conversations.slice() : [];
		if (list.length === 0) {
			$stack.html('<div class="chat-stack-empty">No unread messages</div>');
			return;
		}
		var MAX_VISIBLE = 5;
		var visible = list.slice(0, MAX_VISIBLE);
		var remaining = list.length - visible.length;
		var html = '';
		if (remaining > 0) {
			html += '<div class="chat-chip more">+' + remaining + ' more</div>';
		}
		visible.slice().reverse().forEach(function (c) {
			var name = escapeChatHtml(c.name || c.phone || 'Unknown');
			var n = parseInt(c.unreadCount, 10) || 0;
			html += '<div class="chat-chip">'
				+ '<span class="chip-name">' + name + '</span>'
				+ '<span class="chip-count">' + n + '</span>'
				+ '</div>';
		});
		$stack.html(html);
	}

	function renderAdminStack(adminBreakdown) {
		var $stack = $('#chat-btn-stack');
		if (!$stack.length) return;
		var list = Array.isArray(adminBreakdown) ? adminBreakdown.slice() : [];
		if (list.length === 0) {
			$stack.html('<div class="chat-stack-empty">All admins are caught up</div>');
			return;
		}
		var MAX_VISIBLE = 5;
		var visible = list.slice(0, MAX_VISIBLE);
		var remaining = list.length - visible.length;
		var html = '';
		if (remaining > 0) {
			html += '<div class="chat-chip more">+' + remaining + ' more admins</div>';
		}
		visible.slice().reverse().forEach(function (a) {
			var name = escapeChatHtml(a.name || 'Admin');
			var n = parseInt(a.count, 10) || 0;
			var roleSuffix = a.role === 'superadmin' || a.role === 'director' ? ' ★' : '';
			var adminId = escapeChatHtml(a.userId || '');
			// Chips are click-targets: superadmins jump straight into that admin's filtered list.
			html += '<div class="chat-chip chat-chip-admin"'
				+ ' data-admin-id="' + adminId + '"'
				+ ' data-admin-name="' + name + '"'
				+ ' role="button" tabindex="0"'
				+ ' style="cursor:pointer;">'
				+ '<span class="chip-name">' + name + roleSuffix + '</span>'
				+ '<span class="chip-count">' + n + '</span>'
				+ '</div>';
		});
		$stack.html(html);
	}

	// Post `setFilterMode` to the chat iframe — wait for widgetReady if the iframe hasn't
	// finished loading yet. Returns nothing; fire-and-forget.
	function postFilterModeWhenReady($chatFrame, mode) {
		if (!$chatFrame || !$chatFrame.length || !mode) return;
		function send() {
			var iframeEl = document.getElementById('chat-frame');
			if (!iframeEl || !iframeEl.contentWindow) return;
			try {
				iframeEl.contentWindow.postMessage(
					{ type: 'setFilterMode', mode: mode },
					IS_CHAT_URL
				);
			} catch (e) { /* ignore cross-origin errors */ }
		}
		if ($chatFrame.data('widget-ready')) {
			send();
			return;
		}
		if (!$chatFrame.attr('src')) {
			$chatFrame.attr('src', getISChatWidgetUrl());
		}
		var fired = false;
		var onReady = function (event) {
			if (fired) return;
			if (IS_CHAT_ORIGIN && event.origin !== IS_CHAT_ORIGIN) return;
			if (!event.data || event.data.type !== 'widgetReady') return;
			fired = true;
			window.removeEventListener('message', onReady);
			send();
		};
		window.addEventListener('message', onReady);
	}

	function openAdminConversations(adminId, adminName) {
		if (!adminId) return;
		var $chatFrame = $('#chat-frame');
		if (!$chatFrame.length) return;
		showChatFrame($chatFrame);
		function postFilter() {
			var iframeEl = document.getElementById('chat-frame');
			if (!iframeEl || !iframeEl.contentWindow) return;
			try {
				iframeEl.contentWindow.postMessage(
					{ type: 'filterByAdmin', adminId: adminId, adminName: adminName || '' },
					IS_CHAT_URL
				);
			} catch (e) { /* ignore cross-origin errors */ }
		}
		if ($chatFrame.data('widget-ready')) {
			postFilter();
		} else {
			// Widget hasn't loaded yet — wait for widgetReady, then post.
			$chatFrame.attr('src', $chatFrame.attr('src') || getISChatWidgetUrl());
			var fired = false;
			var onReady = function (event) {
				if (fired) return;
				if (IS_CHAT_ORIGIN && event.origin !== IS_CHAT_ORIGIN) return;
				if (!event.data || event.data.type !== 'widgetReady') return;
				fired = true;
				window.removeEventListener('message', onReady);
				postFilter();
			};
			window.addEventListener('message', onReady);
		}
		// Collapse the hover stack so it doesn't sit on top of the iframe.
		$('#chat-btn-stack').removeClass('is-open');
	}

	function handleUnreadMessage(data) {
		var $badge = $('#chat-badge');
		var isSuperAdmin = (data.viewerRole === 'superadmin') || (USER_ROLE === 'SUPER_ADMIN') ||  (data.viewerRole === 'director') || (USER_ROLE === 'director');
		var personalCount = parseInt(data.count, 10) || 0;
		var adminCount = (typeof data.adminBreakdownCount === 'number')
			? data.adminBreakdownCount
			: (Array.isArray(data.adminBreakdown) ? data.adminBreakdown.length : 0);
		var badgeCount = isSuperAdmin ? adminCount : personalCount;
		if (badgeCount > 0) {
			$badge
				.text(badgeCount > 99 ? '99+' : badgeCount)
				.removeClass('d-none')
				.addClass('d-flex');
		} else {
			$badge
				.addClass('d-none')
				.removeClass('d-flex')
				.text('');
		}
		if (isSuperAdmin) {
			renderAdminStack(data.adminBreakdown);
		} else {
			renderChatStack(data.conversations);
		}
	}

	function getISChatBaseUrl() {
		return IS_CHAT_URL;
	}

	function getISChatWidgetUrl() {
		var userData = {
			email: USER_IS_CHAT.email || '',
			name: USER_IS_CHAT.name || '',
			role: USER_IS_CHAT.role || '',
			available: true
		};
		var token = btoa(unescape(encodeURIComponent(JSON.stringify(userData))));
		return IS_CHAT_URL + '/sso?token=' + token + '&widget=true';
	}

	function markISChatWidgetReady($chatFrame) {
		if (!$chatFrame || !$chatFrame.length) return;
		$chatFrame.data('default-src', getISChatWidgetUrl());
		$chatFrame.data('widget-ready', true);
		var pending = $chatFrame.data('pending-chat');
		if (pending) {
			$chatFrame.removeData('pending-chat');
			openWhatsAppChatInFrame(pending.name, pending.phone, pending.leadNo);
		}
	}

	function showChatFrame($chatFrame) {
		$chatFrame.show();
		$('#chat-icon').hide();
		$('#close-icon').show();
	}

	function openWhatsAppChatInFrame(name, phone, leadNo) {
		var chatBaseUrl = getISChatBaseUrl();
		var normalizedPhone = (phone || '').toString().replace(/\D/g, '');
		if (!chatBaseUrl || !normalizedPhone) return false;
		var leadNoStr = leadNo == null ? '' : String(leadNo);
		var $chatFrame = $('#chat-frame');
		if ($chatFrame.length) {
			showChatFrame($chatFrame);
			if ($chatFrame.data('widget-ready')) {
				$chatFrame.data('active-chat', { name: name, phone: normalizedPhone, leadNo: leadNoStr });
				$chatFrame[0].contentWindow.postMessage(
					{ type: 'openChat', name: name || '', phone: normalizedPhone, leadNo: leadNoStr },
					getISChatBaseUrl()
				);
				return false;
			}
			$chatFrame.data('pending-chat', { name: name, phone: normalizedPhone, leadNo: leadNoStr });
			if (!$chatFrame.attr('src')) {
				var widgetUrl = $chatFrame.data('default-src') || getISChatWidgetUrl();
				$chatFrame.data('default-src', widgetUrl);
				$chatFrame.attr('src', widgetUrl);
			}
			return false;
		}
		var chatUrl = chatBaseUrl + '/?name=' + encodeURIComponent(name || '') + '&phone=' + encodeURIComponent(normalizedPhone);
		if (leadNoStr) chatUrl += '&leadNo=' + encodeURIComponent(leadNoStr);
		window.open(chatUrl, '_blank');
		return false;
	}

	// --- Single-tab guard ------------------------------------------------------
	// The IS_CHAT iframe is expensive: every tab that loads it adds read traffic
	// on the chat backend. So we let only ONE tab host the live widget at a time,
	// coordinated through localStorage. Extra tabs hide their chat button and stay
	// dormant (no iframe loaded). When the active tab closes/navigates away it
	// releases the lock and a waiting tab takes over.
	var IS_CHAT_LOCK_KEY = 'isChatActiveTab';
	var IS_CHAT_HEARTBEAT_MS = 3000;   // owner refreshes the lock this often
	var IS_CHAT_STALE_MS = 8000;       // a lock older than this is treated as dead
	var IS_CHAT_TAB_ID = 'tab-' + Date.now() + '-' + Math.random().toString(36).slice(2);
	var isChatTabOwner = false;
	var isChatHeartbeatTimer = null;
	var isChatWaitTimer = null;

	function readChatLock() {
		try {
			var raw = localStorage.getItem(IS_CHAT_LOCK_KEY);
			return raw ? JSON.parse(raw) : null;
		} catch (e) { return null; }
	}

	function writeChatLock() {
		try {
			localStorage.setItem(IS_CHAT_LOCK_KEY, JSON.stringify({ id: IS_CHAT_TAB_ID, ts: Date.now() }));
		} catch (e) { /* storage disabled/full — degrade gracefully */ }
	}

	// Free if nobody holds it, we already hold it, or the holder's heartbeat has
	// gone stale (its tab crashed/closed without releasing).
	function chatLockIsFree() {
		var lock = readChatLock();
		if (!lock || lock.id === IS_CHAT_TAB_ID) return true;
		return typeof lock.ts !== 'number' || (Date.now() - lock.ts) > IS_CHAT_STALE_MS;
	}

	function startChatHeartbeat() {
		writeChatLock();
		if (isChatHeartbeatTimer) clearInterval(isChatHeartbeatTimer);
		isChatHeartbeatTimer = setInterval(function () {
			if (isChatTabOwner) writeChatLock();
			else { clearInterval(isChatHeartbeatTimer); isChatHeartbeatTimer = null; }
		}, IS_CHAT_HEARTBEAT_MS);
	}

	function releaseChatLock() {
		if (isChatHeartbeatTimer) { clearInterval(isChatHeartbeatTimer); isChatHeartbeatTimer = null; }
		if (!isChatTabOwner) return;
		isChatTabOwner = false;
		var lock = readChatLock();
		if (lock && lock.id === IS_CHAT_TAB_ID) {
			try { localStorage.removeItem(IS_CHAT_LOCK_KEY); } catch (e) {}
		}
	}

	function showChatButton() { $('#chat-btn').show(); }
	function hideChatButton() { $('#chat-btn').hide(); }

	// Try to become the single active tab. Claims the lock tentatively, then
	// verifies after a short beat: if two tabs claimed at the same instant the
	// last writer wins, and the loser backs off WITHOUT loading the iframe — so we
	// never end up with two live widgets. Loses → fall back to dormant/waiting.
	function becomeChatOwner() {
		if (isChatTabOwner || !chatLockIsFree()) return;
		isChatTabOwner = true;       // tentative claim
		writeChatLock();
		setTimeout(function () {
			var lock = readChatLock();
			if (!lock || lock.id !== IS_CHAT_TAB_ID) {
				isChatTabOwner = false;
				startChatWaiting();
				return;
			}
			if (isChatWaitTimer) { clearInterval(isChatWaitTimer); isChatWaitTimer = null; }
			startChatHeartbeat();
			showChatButton();
			isChatLoad();
			$(window).on('beforeunload pagehide', releaseChatLock);
		}, 120);
	}

	// Dormant mode: hide the chat button and poll occasionally so we can recover
	// the widget if the active tab crashed without firing an unload event.
	function startChatWaiting() {
		hideChatButton();
		if (isChatWaitTimer) return;
		isChatWaitTimer = setInterval(function () {
			if (!isChatTabOwner && chatLockIsFree()) becomeChatOwner();
		}, IS_CHAT_STALE_MS);
	}

	function initChatTabGuard() {
		if (chatLockIsFree()) becomeChatOwner();
		else startChatWaiting();
	}

	function isChatLoad() {
		var widgetUrl = getISChatWidgetUrl();
		$('#chat-frame').off('load.isChatWidgetReady').on('load.isChatWidgetReady', function () {
			if (!$('#chat-frame').data('widget-ready')) {
				markISChatWidgetReady($('#chat-frame'));
			}
		});
		$('#chat-frame').attr('src', widgetUrl);
		$('#chat-frame').data('default-src', widgetUrl);
		if (localStorage.getItem('isFirstLogin') == null) {
			$('#chat-frame').toggle();
			if ($('#chat-frame').is(':visible')) {
				$('#chat-icon').hide();
				$('#close-icon').show();
			} else {
				$('#chat-icon').show();
				$('#close-icon').hide();
			}
			localStorage.setItem('isFirstLogin', true);
		}

		function hideChatFrameAndGoHome() {
			var $frame = $('#chat-frame');
			var iframeEl = document.getElementById('chat-frame');
			if (iframeEl && iframeEl.contentWindow) {
				try {
					iframeEl.contentWindow.postMessage({ type: 'navigateHome' }, IS_CHAT_URL);
				} catch (e) { /* ignore cross-origin errors */ }
			}
			$frame.hide();
			$frame.removeData('active-chat');
			$('#chat-icon').show();
			$('#close-icon').hide();
		}

		$('#chat-btn').on('click', function () {
			var $frame = $('#chat-frame');
			if ($frame.is(':visible')) {
				hideChatFrameAndGoHome();
			} else {
				$frame.show();
				$('#chat-icon').hide();
				$('#close-icon').show();
				// Superadmins always land on the org-wide "All Chats" view when opening.
				if (USER_ROLE === 'SUPER_ADMIN') {
					postFilterModeWhenReady($frame, 'ALL');
				}
			}
		});
		$('#close-icon').on('click', function (e) {
			e.stopPropagation();
			hideChatFrameAndGoHome();
		});
	}

	function singleSignOnLink() {
		if (typeof CHAT_URL === 'undefined' || !CHAT_URL) return;
		var data = {
			u: typeof UNIQUEUUID !== 'undefined' ? UNIQUEUUID : '',
			e: typeof DEPLOYMENT_MODE !== 'undefined' ? DEPLOYMENT_MODE : '',
			d: new Date().getTime()
		};
		var jsonString = JSON.stringify(data);
		var chatPayload = btoa(unescape(encodeURIComponent(jsonString)));
		var chatUrl = CHAT_URL + '/signIn?uuid=' + data.u + '+&p=' + chatPayload;
		var link =
			'<a target="_blank" href="' + chatUrl + '"' +
				' class="notify-bell-chat d-flex justify-content-center align-items-center group">' +
				'<svg class="chat-logo bg-primary" width="25" height="25"' +
					' viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">' +
					'<path d="M16.0156 16.0156V16.7969C16.0156 17.4414 15.4883 17.9688 14.8438 17.9688H7.61719L7.42188 18.125L4.88281 20.0781V17.9688H3.32031C2.67578 17.9688 2.14844 17.4414 2.14844 16.7969V8.59375C2.14844 7.94922 2.67578 7.42188 3.32031 7.42188H7.8125V6.64062H3.32031C2.24609 6.64062 1.36719 7.51953 1.36719 8.59375V16.7969C1.36719 17.8711 2.24609 18.75 3.32031 18.75H4.10156V21.6797L7.89063 18.75H14.8438C15.918 18.75 16.7969 17.8711 16.7969 16.7969V16.0156H16.0156Z" fill="white" />' +
					'<path d="M21.6797 4.29688C22.3242 4.29688 22.8516 4.82422 22.8516 5.46875V13.6719C22.8516 14.3164 22.3242 14.8438 21.6797 14.8438H20.1172V16.9727L17.5781 15.0195L17.3828 14.8438H10.1562C9.51172 14.8438 8.98438 14.3164 8.98438 13.6719V5.46875C8.98438 4.82422 9.51172 4.29688 10.1562 4.29688H21.6797ZM21.6797 3.51562H10.1562C9.08203 3.51562 8.20312 4.39453 8.20312 5.46875V13.6719C8.20312 14.7461 9.08203 15.625 10.1562 15.625H17.1094L20.8984 18.5547V15.625H21.6797C22.7539 15.625 23.6328 14.7461 23.6328 13.6719V5.46875C23.6328 4.39453 22.7539 3.51562 21.6797 3.51562Z" fill="white" />' +
				'</svg>' +
				'<span class="chat-message">Talk To Us!</span>' +
				'<span class="UNSEEN start-100 translate-middle badge position-absolute"></span>' +
			'</a>';
		var globalRole = typeof window.USER_ROLE !== 'undefined' ? window.USER_ROLE : USER_ROLE;
		if ($.inArray(globalRole, ['TEACHER', 'STUDENT', 'PARENT']) === -1) {
			$('#link-add').html(link);
		}
	}

	function getAsPostwithSession(url) {
		if (typeof getSession === 'function' && getSession()) {
			if (typeof getAsPost === 'function') getAsPost(url);
		} else if (typeof redirectLoginPage === 'function') {
			redirectLoginPage();
		}
	}

	function adjustAppContainerMargin() {
		var stickyHeaderHeight = $('.sticky-header').height();
		$('.app-container').css({ 'margin-top': stickyHeaderHeight - 59 });
	}

	// Expose for inline onclick handlers and external callers.
	window.getAsPostwithSession = getAsPostwithSession;
	window.openWhatsAppChatInFrame = openWhatsAppChatInFrame;
	window.singleSignOnLink = singleSignOnLink;
	window.isChatLoad = isChatLoad;
	window.ISChatBadge = {
		renderChatStack: renderChatStack,
		renderAdminStack: renderAdminStack,
		handleUnreadMessage: handleUnreadMessage,
		openAdminConversations: openAdminConversations
	};

	$(document).mouseup(function (e) {
		var notification = $('.popupbox');
		var showAll = $('#showAllNotification');
		var notificationItem = $('.a-card');
		if (e.target.id == 'notifyBox' || $(e.target).parents('#notifyBox').length) {
			// no-op
		} else {
			if (showAll.is(e.target)) {
				$('.popupbox').removeClass('show');
			} else if (notificationItem.is(e.target)) {
				$('.popupbox').removeClass('show');
			} else {
				$('.popupbox').removeClass('show');
			}
		}
	});

	// Another tab released/changed the single-tab chat lock — if we're eligible
	// but dormant, try to take over. A little jitter keeps several waiting tabs
	// from pouncing at the same instant.
	window.addEventListener('storage', function (event) {
		if (event.key !== IS_CHAT_LOCK_KEY || !ELIGIBLE_IS_CHAT || isChatTabOwner) return;
		if (!chatLockIsFree()) return;
		setTimeout(function () {
			if (!isChatTabOwner && chatLockIsFree()) becomeChatOwner();
		}, Math.floor(Math.random() * 250));
	});

	// Listen for widgetReady from the chat iframe.
	window.addEventListener('message', function (event) {
		if (IS_CHAT_ORIGIN && event.origin !== IS_CHAT_ORIGIN) return;
		if (!event.data || event.data.type !== 'widgetReady') return;
		markISChatWidgetReady($('#chat-frame'));
	});

	// Listen for unread-count updates from the chat iframe.
	$(window).on('message', function (event) {
		var e = event.originalEvent;
		if (IS_CHAT_ORIGIN && e.origin !== IS_CHAT_ORIGIN) return;
		if (!e.data || e.data.type !== 'CHAT_UNREAD_COUNT') return;
		handleUnreadMessage(e.data);
	});

	$(window).resize(adjustAppContainerMargin);

	$(document).ready(function () {
		adjustAppContainerMargin();
		var hasNotificationsLink = NOTIFICATION_PAGE_LINKS.some(function (link) {
			return link === 'notifications' || link === 'parent-notifications';
		});
		if (hasNotificationsLink) {
			$('#notificationBellConditionDiv').show();
		}
		if (typeof CHAT_URL !== 'undefined' && CHAT_URL !== '') {
			singleSignOnLink();
		}
		if (ELIGIBLE_IS_CHAT) {
			initChatTabGuard();
		}
		if (PARENT_STUDENT_ID) {
			$('#parentStudentSelectedId').val(PARENT_STUDENT_ID);
		}

		$('.close-message').click(function () {
			$(this).parent().hide().promise().done(adjustAppContainerMargin);
		});

		// Chat-stack hover/focus controller.
		var hoverTimer = null;
		function openStack() {
			if (hoverTimer) { clearTimeout(hoverTimer); hoverTimer = null; }
			$('#chat-btn-stack').addClass('is-open');
		}
		function closeStackSoon() {
			if (hoverTimer) clearTimeout(hoverTimer);
			hoverTimer = setTimeout(function () {
				$('#chat-btn-stack').removeClass('is-open');
			}, 180);
		}
		$(document).on('mouseenter', '#chat-btn, #chat-btn-stack', openStack);
		$(document).on('mouseleave', '#chat-btn, #chat-btn-stack', closeStackSoon);
		$(document).on('focus', '#chat-btn', openStack);
		$(document).on('blur', '#chat-btn', closeStackSoon);

		// Click an admin chip → open chat frame filtered to that admin's conversations.
		$(document).on('click', '.chat-chip-admin', function (e) {
			e.preventDefault();
			e.stopPropagation();
			var adminId = $(this).attr('data-admin-id');
			var adminName = $(this).attr('data-admin-name');
			openAdminConversations(adminId, adminName);
		});
		$(document).on('keydown', '.chat-chip-admin', function (e) {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				var adminId = $(this).attr('data-admin-id');
				var adminName = $(this).attr('data-admin-name');
				openAdminConversations(adminId, adminName);
			}
		});
	});
})(jQuery);

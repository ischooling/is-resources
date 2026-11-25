/*
 * Teacher tier header: tier pill + ladder tooltip + live colour preview.
 *
 * Desktop : hover the pill to open the ladder, hover a tier to preview its colour on the header.
 * Mobile  : tap the pill to open, tap a tier to preview. Tapping outside (or Esc) closes and
 *           the header returns to the teacher's real tier.
 *
 * Markup lives in theme2/dashboard/DashboardTopHeader.jsp; colours/patterns in
 * theme2/css/teacher-tier-header.css (the tier is just a `tier-<key>` class on .app-header).
 */
(function () {
	'use strict';

	var TIERS = [
		{ key: 'blue',     name: 'Blue',     level: 'Starting status' },
		{ key: 'silver',   name: 'Silver',   level: 'Status 2' },
		{ key: 'gold',     name: 'Gold',     level: 'Status 3' },
		{ key: 'platinum', name: 'Platinum', level: 'Status 4' },
		{ key: 'diamond',  name: 'Diamond',  level: 'Top status' }
	];

	function init() {
		var header = document.querySelector('.app-header.tier-header');
		var source = header && header.querySelector('.tier-wrap');
		if (!header || !source) { return; }

		var actual = header.getAttribute('data-tier') || 'blue';
		var shown = actual;
		var hoverCapable = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

		// Fixed-width tier label: every tier name is stacked in one grid cell (all but the visible one
		// invisible), so the pill is always as wide as the longest name and never jitters on preview.
		var nameEl = source.querySelector('.tier-name');
		if (nameEl) {
			nameEl.innerHTML = '';
			var current = document.createElement('span');
			current.className = 'tier-name-text';
			current.textContent = tierName(actual);
			nameEl.appendChild(current);
			TIERS.forEach(function (t) {
				var sizer = document.createElement('span');
				sizer.className = 'tier-name-sizer';
				sizer.setAttribute('aria-hidden', 'true');
				sizer.textContent = t.name;
				nameEl.appendChild(sizer);
			});
		}

		// Mobile copy of the pill: the header content collapses into a white panel on small screens,
		// so a second pill sits on the bar itself. CSS shows only one of them per breakpoint.
		var mobile = source.cloneNode(true);
		mobile.classList.add('tier-wrap--mobile');
		var logo = header.querySelector('.app-header__logo');
		if (logo && logo.parentNode === header) {
			logo.parentNode.insertBefore(mobile, logo.nextSibling);
		} else {
			header.appendChild(mobile);
		}

		function setShown(key) {
			if (key === shown) { return; }
			header.classList.remove('tier-' + shown);
			header.classList.add('tier-' + key);
			shown = key;
			// The pill label follows whichever tier is being previewed
			var label = tierName(key);
			var names = header.querySelectorAll('.tier-name-text');
			for (var i = 0; i < names.length; i++) { names[i].textContent = label; }
		}

		function tierName(key) {
			for (var i = 0; i < TIERS.length; i++) {
				if (TIERS[i].key === key) { return TIERS[i].name; }
			}
			return key;
		}

		[source, mobile].forEach(wire);

		function wire(wrap) {
			var pill = wrap.querySelector('.tier-pill');
			var list = wrap.querySelector('.tier-list');
			var closeTimer = null;
			var lastPointer = '';

			list.innerHTML = '';
			TIERS.forEach(function (t) {
				var isCurrent = t.key === actual;
				var li = document.createElement('li');
				li.className = 'tier-row' + (isCurrent ? ' is-current' : '');
				li.setAttribute('tabindex', '0');
				li.setAttribute('data-tier', t.key);
				li.innerHTML = '<span class="tier-swatch tier-' + t.key + '"></span>'
					+ '<span>' + t.name + '</span>'
					+ '<small>' + (isCurrent ? 'Your status' : t.level) + '</small>';
				list.appendChild(li);
			});
			var rows = list.querySelectorAll('.tier-row');

			function markPreview(key) {
				for (var i = 0; i < rows.length; i++) {
					rows[i].classList.toggle('is-previewing', rows[i].getAttribute('data-tier') === key && key !== actual);
				}
			}
			function preview(key) { setShown(key); markPreview(key); }

			function open() {
				clearTimeout(closeTimer);
				wrap.classList.add('is-open');
				pill.setAttribute('aria-expanded', 'true');
			}
			function close() {
				clearTimeout(closeTimer);
				wrap.classList.remove('is-open');
				pill.setAttribute('aria-expanded', 'false');
				preview(actual);
			}
			function closeSoon() {
				clearTimeout(closeTimer);
				closeTimer = setTimeout(close, 140);
			}
			function toggle() { wrap.classList.contains('is-open') ? close() : open(); }

			// Desktop hover (mouse only, so touch never gets stuck "hovering")
			wrap.addEventListener('pointerenter', function (e) {
				if (e.pointerType === 'mouse' && hoverCapable) { open(); }
			});
			wrap.addEventListener('pointerleave', function (e) {
				if (e.pointerType === 'mouse' && hoverCapable) { closeSoon(); }
			});

			// Click / tap / keyboard on the pill
			pill.addEventListener('pointerdown', function (e) { lastPointer = e.pointerType; });
			pill.addEventListener('click', function () {
				if (lastPointer === 'mouse' && hoverCapable) { lastPointer = ''; open(); return; } // hover already handles it
				lastPointer = '';
				toggle();
			});
			pill.addEventListener('keydown', function (e) {
				if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
			});

			// Tier rows: hover (mouse), tap (touch) and focus (keyboard) all preview
			Array.prototype.forEach.call(rows, function (row) {
				var key = row.getAttribute('data-tier');
				row.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { preview(key); } });
				row.addEventListener('click', function () { preview(key); });
				row.addEventListener('focus', function () { preview(key); });
			});
			list.addEventListener('pointerleave', function (e) {
				if (e.pointerType === 'mouse') { preview(actual); }
			});

			// Dismiss: tap/click outside, Esc
			document.addEventListener('pointerdown', function (e) {
				if (wrap.classList.contains('is-open') && !wrap.contains(e.target)) { close(); }
			});
			wrap.addEventListener('keydown', function (e) {
				if (e.key === 'Escape') { close(); pill.focus(); }
			});
			wrap.addEventListener('focusout', function (e) {
				if (wrap.classList.contains('is-open') && e.relatedTarget && !wrap.contains(e.relatedTarget)) { close(); }
			});
		}
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();

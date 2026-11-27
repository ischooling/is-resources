var SpecialHelp = (function ($) {
	var LABEL = { N: 'Off', R: 'Requested', Y: 'On' };
	var BADGE = { N: 'badge-secondary', R: 'badge-warning', Y: 'badge-success' };
	var PAGE_COLOURS = [['none', 'White'], ['cream', 'Cream'], ['peach', 'Peach'], ['mint', 'Mint'], ['sky', 'Sky']];

	function esc(value) {
		return $('<div>').text(value == null ? '' : String(value)).html();
	}

	function post(path, body) {
		return $.ajax({
			type: 'POST',
			contentType: 'application/json',
			url: getURLForHTML('dashboard', 'special-help/' + path),
			data: JSON.stringify(body),
			dataType: 'json',
			cache: false
		});
	}

	function ensureModal() {
		if ($('#shModal').length === 0) {
			$('body').append('<div class="modal fade" id="shModal" tabindex="-1" role="dialog"><div class="modal-dialog" role="document"><div class="modal-content">'
				+ '<div class="modal-header"><h5 class="modal-title"></h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
				+ '<div class="modal-body"></div><div class="sh-msg px-3 text-danger small"></div><div class="modal-footer"></div></div></div></div>');
		}
		return $('#shModal');
	}

	function openModal(title, bodyHtml, buttons) {
		var $modal = ensureModal();
		$modal.find('.modal-title').text(title);
		$modal.find('.modal-body').html(bodyHtml);
		$modal.find('.sh-msg').text('');
		var $footer = $modal.find('.modal-footer').empty();
		(buttons || []).forEach(function (button) {
			var $button = $('<button type="button" class="btn"></button>').addClass(button.cls || 'btn-secondary').text(button.label);
			$button.on('click', function () { button.onClick($modal, $button); });
			$footer.append($button);
		});
		$modal.modal('show');
		return $modal;
	}

	function closeButton() {
		return { label: 'Close', cls: 'btn-outline-secondary', onClick: function ($modal) { $modal.modal('hide'); } };
	}

	function failMessage($modal, response) {
		$modal.find('.sh-msg').text((response && response.message) || 'Something went wrong, please try again.');
	}

	function conditionSelectHtml(current, idPrefix) {
		var value = current || '';
		var isOther = value.indexOf('Other') === 0;
		var options = ['', 'Dyslexia', 'ADHD', 'Autism', 'Other'];
		var html = '<select class="form-control" id="' + idPrefix + 'Cond">';
		options.forEach(function (option) {
			var selected = (option === value || (option === 'Other' && isOther)) ? ' selected' : '';
			html += '<option value="' + option + '"' + selected + '>' + (option || 'Not disclosed') + '</option>';
		});
		html += '</select><input type="text" class="form-control mt-2" id="' + idPrefix + 'CondOther" maxlength="80" placeholder="Describe" style="display:' + (isOther ? 'block' : 'none') + '" value="' + esc(isOther ? value.replace(/^Other:?\s*/, '') : '') + '">';
		return html;
	}

	function readCondition(idPrefix) {
		var value = $('#' + idPrefix + 'Cond').val();
		if (value === 'Other') {
			return 'Other: ' + ($('#' + idPrefix + 'CondOther').val() || '').trim();
		}
		return value;
	}

	function bindConditionSwitch(idPrefix) {
		$('#' + idPrefix + 'Cond').on('change', function () {
			$('#' + idPrefix + 'CondOther').toggle($(this).val() === 'Other');
		});
	}

	function statusHtml(state, by) {
		var html = '<span class="badge ' + BADGE[state] + '">' + LABEL[state] + '</span>';
		if (state !== 'N') {
			html += ' <button type="button" class="btn btn-sm btn-link p-0 sh-view" title="View request" aria-label="View request">View</button>';
		}
		if (state === 'Y' && by) {
			html += '<div class="small text-muted">Enabled by ' + esc(by) + '</div>';
		}
		return html;
	}

	function actionHtml(state) {
		return state === 'Y'
			? '<button type="button" class="btn btn-sm btn-outline-primary sh-settings">Special help settings</button> <button type="button" class="btn btn-sm btn-outline-danger sh-off">Turn off</button>'
			: '<button type="button" class="btn btn-sm btn-primary sh-enable">Enable Special help</button>';
	}

	function paintRow($status, state, by) {
		$status.attr('data-sh-state', state).attr('data-sh-by', by || '');
		$status.html(statusHtml(state, by));
		$status.closest('tr').find('.sh-action').html(actionHtml(state));
	}

	function renderAll() {
		var seen = {};
		$('.sh-status').each(function () {
			var $cell = $(this);
			var key = ($cell.closest('table').attr('id') || $cell.closest('table').index('table')) + ':' + $cell.attr('data-sh-user');
			if (seen[key]) {
				$cell.addClass('sh-dup').empty();
				$cell.closest('tr').find('.sh-action').empty();
				return;
			}
			seen[key] = true;
			paintRow($cell, $cell.attr('data-sh-state') || 'N', $cell.attr('data-sh-by'));
		});
	}

	function repaintStudent(userId, details) {
		$('.sh-status[data-sh-user="' + userId + '"]').not('.sh-dup').each(function () {
			paintRow($(this), details.specialHelp, details.enabledBy);
		});
	}

	function requestRows(details) {
		return '<dl class="row mb-0 small">'
			+ '<dt class="col-4">Requested on</dt><dd class="col-8">' + esc(details.requestedAt || 'No request from the student') + '</dd>'
			+ '<dt class="col-4">Would help most</dt><dd class="col-8">' + esc(details.tools) + '</dd>'
			+ '<dt class="col-4">Reason</dt><dd class="col-8">' + esc(details.reason) + '</dd>'
			+ '<dt class="col-4">Condition</dt><dd class="col-8">' + esc(details.condition) + '</dd>'
			+ (details.specialHelp === 'Y' ? '<dt class="col-4">Enabled</dt><dd class="col-8">by ' + esc(details.enabledBy) + ' on ' + esc(details.enabledAt) + '</dd>' : '')
			+ '</dl>';
	}

	function openView(userId, name) {
		post('details', { studentUserId: userId }).done(function (response) {
			if (response.status !== '1') { openModal('Special help', '<p class="text-danger">' + esc(response.message) + '</p>', [closeButton()]); return; }
			openModal('Special help request - ' + name, requestRows(response.details), [closeButton()]);
		});
	}

	function openTurnOff(userId, onCancel, onDone) {
		openModal('Turn off Special help?', '<p>The student will be told it has been turned off. Their saved settings are kept but stop applying.</p><div class="form-group"><label for="shOffReason">Reason (required, saved in the change log)</label><textarea class="form-control" id="shOffReason" maxlength="500" rows="3"></textarea></div>', [
			{ label: 'Cancel', cls: 'btn-outline-secondary', onClick: function ($m) { $m.modal('hide'); onCancel(); } },
			{ label: 'Turn off', cls: 'btn-danger', onClick: function ($m, $btn) {
				var reason = ($('#shOffReason').val() || '').trim();
				if (!reason) { $m.find('.sh-msg').text('Please give a reason.'); return; }
				$btn.prop('disabled', true);
				post('disable', { studentUserId: userId, reason: reason }).done(function (result) {
					if (result.status === '1') { $m.modal('hide'); onDone(result); } else { failMessage($m, result); $btn.prop('disabled', false); }
				}).fail(function () { failMessage($m); $btn.prop('disabled', false); });
			} }
		]);
	}

	function openEnable(userId, name) {
		post('details', { studentUserId: userId }).done(function (response) {
			if (response.status !== '1') { openModal('Special help', '<p class="text-danger">' + esc(response.message) + '</p>', [closeButton()]); return; }
			var details = response.details;
			var first = (name || '').split(' ')[0];
			var intro = details.specialHelp === 'R' ? requestRows(details) : '<p class="mb-2">No request from the student - you are enabling this proactively.</p>';
			var body = '<p>This unlocks colour, reading and dyslexia settings in ' + esc(first) + '\'s Make it yours panel. ' + esc(first) + ' will be notified.</p>'
				+ intro + '<div class="form-group mt-3"><label for="shEnableCond">Condition (optional)</label>' + conditionSelectHtml(details.condition === 'not disclosed' ? '' : details.condition, 'shEnable') + '</div>';
			var $modal = openModal('Enable Special help for ' + first + '?', body, [
				{ label: 'Cancel', cls: 'btn-outline-secondary', onClick: function ($m) { $m.modal('hide'); } },
				{ label: 'Enable Special help', cls: 'btn-success', onClick: function ($m, $btn) {
					$btn.prop('disabled', true);
					post('enable', { studentUserId: userId, condition: readCondition('shEnable') }).done(function (result) {
						if (result.status === '1') { repaintStudent(userId, result.details); $m.modal('hide'); } else { failMessage($m, result); $btn.prop('disabled', false); }
					}).fail(function () { failMessage($m); $btn.prop('disabled', false); });
				} }
			]);
			bindConditionSwitch('shEnable');
		});
	}

	var CV_SWATCHES = { standard: ['#2563EB', '#C92F6E', '#6A3FC4', '#8A6A00', '#C92A2F'], cvd: ['#0072B2', '#B34700', '#A3507F', '#E69F00', '#00795A'] };
	var PAGE_HEX = { none: '#FFFFFF', cream: '#FFF1D0', peach: '#FDDCCB', mint: '#D8F0DD', sky: '#D9E8FB' };

	function ensureStyles() {
		if ($('#shStyles').length) { return; }
		$('head').append('<style id="shStyles">'
			+ '.shp{background:#f3f6fd;border:2px dashed #d5dff0;border-radius:20px;padding:16px}'
			+ '.shp h4,.shp h5{margin:0;font-weight:700;color:#1c2a3f}.shp .shp-sub{font-size:12.5px;font-weight:600;color:#5b6b82;margin:2px 0 8px}'
			+ '.shp-head{display:flex;align-items:center;gap:10px;margin-bottom:14px}.shp-ico{width:38px;height:38px;border-radius:12px;background:#ece8ff;display:flex;align-items:center;justify-content:center;font-size:20px}'
			+ '.shp-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px}'
			+ '.shp-opt{border:2px solid #dbe3f0;background:#fff;border-radius:14px;padding:12px 6px;text-align:center;font-weight:700;font-size:13px;color:#1c2a3f;cursor:pointer}'
			+ '.shp-opt.sel{border-color:#3b82f6;background:#eaf2ff}.shp-dots{display:flex;justify-content:center;gap:4px;margin-bottom:6px}.shp-dots i{width:15px;height:15px;border-radius:50%;display:block}'
			+ '.shp-read{font-size:17px;font-weight:800;display:block;margin-bottom:4px}.shp-card{background:#fff;border-radius:16px;padding:12px;margin-bottom:0}'
			+ '.shp-row{display:flex;align-items:center;gap:10px;border:2px solid #dbe3f0;border-radius:14px;padding:10px 12px;margin-bottom:8px;cursor:pointer;background:#fff}'
			+ '.shp-tile{width:42px;height:42px;border-radius:12px;background:#e6f2ff;color:#1b3a6b;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:18px;flex:none}'
			+ '.shp-row b{display:block;font-size:14px}.shp-row small{display:block;font-size:11.5px;font-weight:600;color:#5b6b82}.shp-grow{flex:1}'
			+ '.shp-sw{width:42px;height:24px;border-radius:999px;background:#d3dae6;position:relative;flex:none}.shp-sw::after{content:"";position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:left .15s}'
			+ '.shp-row.on .shp-sw{background:#3b82f6}.shp-row.on .shp-sw::after{left:21px}'
			+ '.shp-pages{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin:6px 0 10px}.shp-page{border:2px solid #dbe3f0;background:#fff;border-radius:14px;padding:6px 2px;text-align:center;font-size:11.5px;font-weight:700;cursor:pointer}'
			+ '.shp-page.sel{border-color:#3b82f6;background:#eaf2ff}.shp-page i{display:block;width:30px;height:30px;border-radius:50%;border:2px solid #dbe3f0;margin:0 auto 4px}'
			+ '</style>');
	}

	function settingsControlsHtml(settings) {
		ensureStyles();
		function opt(name, value, inner) {
			return '<button type="button" class="shp-opt' + (settings[name] === value ? ' sel' : '') + '" data-shp-opt="' + name + '" data-val="' + value + '">' + inner + '</button>';
		}
		function dots(key) {
			return '<span class="shp-dots">' + CV_SWATCHES[key].map(function (c) { return '<i style="background:' + c + '"></i>'; }).join('') + '</span>';
		}
		function row(name, tile, title, sub) {
			return '<div class="shp-row' + (settings[name] === 'on' ? ' on' : '') + '" role="switch" tabindex="0" data-shp-toggle="' + name + '"><span class="shp-tile">' + tile + '</span><span class="shp-grow"><b>' + title + '</b><small>' + sub + '</small></span><span class="shp-sw"></span></div>';
		}
		var pages = PAGE_COLOURS.map(function (c) {
			return '<button type="button" class="shp-page' + (settings.pageColor === c[0] ? ' sel' : '') + '" data-shp-opt="pageColor" data-val="' + c[0] + '"><i style="background:' + PAGE_HEX[c[0]] + '"></i>' + c[1] + '</button>';
		}).join('');
		return '<div class="shp"><div class="shp-head"><span class="shp-ico">&#128156;</span><div><h4>Special help</h4><div class="shp-sub mb-0">Colour-blind colours, reading help and dyslexia tools</div></div></div>'
			+ '<h5>Color vision</h5><div class="shp-sub">Pick colors that are easy for your eyes to tell apart.</div>'
			+ '<div class="shp-grid">' + opt('colorVision', 'standard', dots('standard') + 'Standard') + opt('colorVision', 'cvd', dots('cvd') + 'Color-blind friendly') + '</div>'
			+ '<h5>Reading help</h5><div class="shp-sub">More space between letters and words can make reading easier.</div>'
			+ '<div class="shp-grid">' + opt('reading', 'normal', '<span class="shp-read">read me</span>Normal spacing') + opt('reading', 'spaced', '<span class="shp-read" style="letter-spacing:.14em;word-spacing:.3em">read me</span>Extra spacing') + '</div>'
			+ '<div class="shp-card"><h5>&#128214; Dyslexia help</h5><div class="shp-sub">Research-based settings that make reading easier.</div>'
			+ row('dyslexia', 'Aa', 'Dyslexia mode', 'One tap: easy-to-read font, more space, soft page colour, plain letters')
			+ '<b style="font-size:14px">Page colour</b><div class="shp-pages">' + pages + '</div>'
			+ row('ruler', '&#9638;', 'Reading ruler', 'A bright strip follows your finger or mouse')
			+ row('plainText', 'Ab', 'Plain letters', 'No ALL CAPS or slanted text') + '</div></div>';
	}

	function currentSettings($root) {
		var values = {};
		$root.find('[data-shp-opt].sel').each(function () { values[$(this).attr('data-shp-opt')] = $(this).attr('data-val'); });
		$root.find('[data-shp-toggle]').each(function () { values[$(this).attr('data-shp-toggle')] = $(this).hasClass('on') ? 'on' : 'off'; });
		return values;
	}

	function collectSettings() {
		return currentSettings($('#shModal .shp'));
	}

	function pick($root, name, value) {
		$root.find('[data-shp-opt="' + name + '"]').removeClass('sel').filter('[data-val="' + value + '"]').addClass('sel');
	}

	function bindSettings() {
		var $root = $('#shModal .shp');
		$root.on('click', '[data-shp-opt]', function () {
			pick($root, $(this).attr('data-shp-opt'), $(this).attr('data-val'));
		});
		function toggle($row) {
			var on = !$row.hasClass('on');
			$row.toggleClass('on', on).attr('aria-checked', on ? 'true' : 'false');
			if ($row.attr('data-shp-toggle') === 'dyslexia') {
				pick($root, 'reading', on ? 'spaced' : 'normal');
				pick($root, 'pageColor', on ? 'cream' : 'none');
				$root.find('[data-shp-toggle="plainText"]').toggleClass('on', on);
				if (!on) { $root.find('[data-shp-toggle="ruler"]').removeClass('on'); }
			}
		}
		$root.on('click', '[data-shp-toggle]', function () { toggle($(this)); });
		$root.on('keydown', '[data-shp-toggle]', function (event) {
			if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); toggle($(this)); }
		});
	}

	function openSettings(userId, name) {
		var first = (name || '').split(' ')[0];
		post('settings', { studentUserId: userId }).done(function (response) {
			if (response.status !== '1') { openModal('Special help', '<p class="text-danger">' + esc(response.message) + '</p>', [closeButton()]); return; }
			var body = '<p class="small text-muted">Set these on ' + esc(first) + '\'s behalf. ' + esc(first) + ' can change them later from Make it yours.</p>' + settingsControlsHtml(response.details.settings);
			openModal('Special help for ' + name, body, [
				{ label: 'Close', cls: 'btn-outline-secondary', onClick: function ($m) { $m.modal('hide'); } },
				{ label: 'Save settings', cls: 'btn-success', onClick: function ($m, $btn) {
					$btn.prop('disabled', true);
					post('settings/save', { studentUserId: userId, settings: collectSettings() }).done(function (result) {
						if (result.status === '1') { $m.modal('hide'); } else { failMessage($m, result); $btn.prop('disabled', false); }
					}).fail(function () { failMessage($m); $btn.prop('disabled', false); });
				} }
			]);
			bindSettings();
		});
	}

	function paintAdmin($block, state, enabledBy, enabledAt, requestedAt) {
		$block.attr('data-sh-state', state);
		$block.find('.sh-admin-badge').attr('class', 'badge sh-admin-badge ' + BADGE[state]).text(LABEL[state]);
		$block.find('.sh-admin-toggle').prop('checked', state === 'Y');
		$block.find('.sh-admin-toggle-label').text(state === 'Y' ? 'On' : 'Off');
		var meta = state === 'Y' ? 'Enabled by ' + (enabledBy || '') + (enabledAt ? ' on ' + enabledAt : '') : state === 'R' ? 'Requested on ' + requestedAt : 'Not requested';
		$block.find('.sh-admin-meta').text(meta);
		$block.find('.sh-admin-view').toggle(state !== 'N');
		$block.find('.sh-admin-settings').toggle(state === 'Y');
	}

	function refreshAdmin($block) {
		var userId = $block.attr('data-sh-user');
		post('details', { studentUserId: userId }).done(function (response) {
			if (response.status !== '1') { return; }
			var d = response.details;
			paintAdmin($block, d.specialHelp, d.enabledBy, d.enabledAt, d.requestedAt);
		});
	}

	function adminBlockHtml(userId, name, condition) {
		return '<div class="mt-3 mb-2" id="specialHelpAdmin" data-sh-user="' + esc(userId) + '" data-sh-name="' + esc(name) + '" data-sh-state="N" data-sh-condition="' + esc(condition) + '">'
			+ '<div class="border rounded p-3" style="border-color:#5d4bd3 !important;">'
			+ '<div class="d-flex align-items-center flex-wrap mb-2"><h6 class="mb-0 mr-2">Special help</h6>'
			+ '<span class="badge badge-secondary sh-admin-badge mr-2">Off</span><span class="small text-muted sh-admin-meta mr-2"></span>'
			+ '<button type="button" class="btn btn-sm btn-link p-0 sh-admin-view" style="display:none;">View request</button></div>'
			+ '<div class="row align-items-center"><div class="col-md-3 col-sm-12"><div class="custom-control custom-switch">'
			+ '<input type="checkbox" class="custom-control-input sh-admin-toggle" id="shAdminToggle"><label class="custom-control-label" for="shAdminToggle"><span class="sh-admin-toggle-label">Off</span></label></div></div>'
			+ '<div class="col-md-9 col-sm-12"><label class="small text-muted mb-1">Condition (optional, visible to assigned teachers and admin only)</label><div class="sh-admin-cond-holder"></div></div></div>'
			+ '<div class="mt-2"><button type="button" class="btn btn-sm btn-outline-primary sh-admin-settings" style="display:none;">Open Special help settings</button> '
			+ '<button type="button" class="btn btn-sm btn-success sh-admin-save">Save Special help</button><span class="small ml-2 sh-admin-msg"></span></div>'
			+ '</div></div>';
	}

	function mountAdmin(selector, userId, name) {
		var $host = $(selector);
		if ($host.length === 0 || !userId) { return; }
		post('details', { studentUserId: userId }).done(function (response) {
			if (response.status !== '1' || !response.details || response.details.admin !== true) { return; }
			var condition = response.details.condition === 'not disclosed' ? '' : response.details.condition;
			$host.html(adminBlockHtml(userId, name || 'the student', condition));
			initAdmin();
		});
	}

	function initAdmin() {
		var $block = $('#specialHelpAdmin');
		if ($block.length === 0) { return; }
		var userId = $block.attr('data-sh-user');
		var name = $block.attr('data-sh-name');
		$block.find('.sh-admin-cond-holder').html(conditionSelectHtml($block.attr('data-sh-condition'), 'shAdmin'));
		bindConditionSwitch('shAdmin');
		$block.find('.sh-admin-toggle').on('change', function () {
			$block.find('.sh-admin-toggle-label').text($(this).is(':checked') ? 'On' : 'Off');
		});
		$block.find('.sh-admin-view').on('click', function () { openView(userId, name); });
		$block.find('.sh-admin-settings').on('click', function () { openSettings(userId, name); });
		$block.find('.sh-admin-save').on('click', function () {
			var state = $block.attr('data-sh-state');
			var wantOn = $block.find('.sh-admin-toggle').is(':checked');
			var $msg = $block.find('.sh-admin-msg').removeClass('text-success text-danger').text('');
			function done(result) {
				if (result.status === '1') { $msg.addClass('text-success').text('Saved.'); refreshAdmin($block); } else { $msg.addClass('text-danger').text(result.message || 'Could not save.'); paintAdmin($block, state, '', '', ''); refreshAdmin($block); }
			}
			if (wantOn && state !== 'Y') {
				post('enable', { studentUserId: userId, condition: readCondition('shAdmin') }).done(done);
			} else if (!wantOn && state === 'Y') {
				openTurnOff(userId, function () { refreshAdmin($block); }, done);
			} else {
				post('condition', { studentUserId: userId, condition: readCondition('shAdmin') }).done(done);
			}
		});
		refreshAdmin($block);
	}

	$(document).off('click.specialHelp').on('click.specialHelp', '.sh-enable', function () {
		var $status = $(this).closest('tr').find('.sh-status');
		openEnable($status.attr('data-sh-user'), $status.attr('data-sh-name'));
	});
	$(document).on('click.specialHelp', '.sh-view', function () {
		var $status = $(this).closest('tr').find('.sh-status');
		openView($status.attr('data-sh-user'), $status.attr('data-sh-name'));
	});
	$(document).on('click.specialHelp', '.sh-off', function () {
		var $status = $(this).closest('tr').find('.sh-status');
		var userId = $status.attr('data-sh-user');
		openTurnOff(userId, function () {}, function (result) { repaintStudent(userId, result.details); });
	});
	$(document).on('click.specialHelp', '.sh-settings', function () {
		var $status = $(this).closest('tr').find('.sh-status');
		openSettings($status.attr('data-sh-user'), $status.attr('data-sh-name'));
	});

	function watchProfilePage() {
		if (window.__specialHelpProfileWatch || typeof MutationObserver === 'undefined') { return; }
		window.__specialHelpProfileWatch = true;
		new MutationObserver(function () {
			var card = document.getElementById('personal_information');
			if (!card || document.getElementById('specialHelpAdminMount') || typeof PROFILE_RESPONSE_DATA === 'undefined' || !PROFILE_RESPONSE_DATA || !PROFILE_RESPONSE_DATA.userId) { return; }
			var $address = $(card).find('#address').closest('.col-12');
			if ($address.length === 0) { return; }
			$address.after('<div class="col-12" id="specialHelpAdminMount"></div>');
			mountAdmin('#specialHelpAdminMount', PROFILE_RESPONSE_DATA.userId, [PROFILE_RESPONSE_DATA.firstName, PROFILE_RESPONSE_DATA.lastName].filter(Boolean).join(' '));
		}).observe(document.documentElement, { childList: true, subtree: true });
	}

	watchProfilePage();

	return { renderAll: renderAll, initAdmin: initAdmin, mountAdmin: mountAdmin };
})(jQuery);

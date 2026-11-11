/*
 * Communications > Message templates: behaviour. Markup and styles are in messageTemplatesContent.js.
 * Server: {schoolId}/dashboard/message-templates/{list|save|delete} (MailboxAssistController), which
 * checks the session user, their school and their right on the message-templates menu.
 * Every value from the server is escaped before it reaches the page.
 */

var MT_STATE = { templates: [], canUpdate: false };

function initMessageTemplates() {
	$('#dashboardContentInHTML').html(getMessageTemplatesContent('Message templates'));
	$('#mtFilters').on('submit', function (e) { e.preventDefault(); });
	$('#mtFilterWriter, #mtFilterRecipient').on('change', renderMessageTemplates);
	$('#mtAdd').on('click', function () { openMessageTemplate(null); });
	$('#mtCancel').on('click', function () { document.getElementById('mtDialog').close(); });
	$('#mtForm').on('submit', function (e) {
		e.preventDefault();
		saveMessageTemplate();
	});
	var dialog = document.getElementById('mtDialog');
	// A click on the dimmed area outside the box closes it.
	dialog.addEventListener('click', function (e) {
		if (e.target === dialog) {
			dialog.close();
		}
	});
	$('#mtTable tbody').on('click', '[data-mt]', function () {
		var id = parseInt(this.getAttribute('data-id'), 10);
		var template = MT_STATE.templates.filter(function (t) { return t.id === id; })[0];
		var what = this.getAttribute('data-mt');
		if (what === 'edit' && template) {
			openMessageTemplate(template);
		} else if (what === 'copy' && template) {
			openMessageTemplate(template, true);
		} else if (what === 'delete' && template) {
			deleteMessageTemplate(template);
		}
	});
	loadMessageTemplates();
}

function mtEscape(value) {
	return String(value === null || value === undefined ? '' : value).replace(/&/g, '&amp;').replace(/</g, '&lt;')
		.replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function mtLabel(list, code) {
	var found = list.filter(function (o) { return o[0] === code; })[0];
	return found ? found[1] : code;
}

function mtPost(path, request, onDone) {
	$.ajax({
		contentType: APPLICATION_JSON_VALUE,
		type: 'POST',
		url: getURLForHTML('dashboard', 'message-templates/' + path),
		data: JSON.stringify(request),
		dataType: 'json',
		success: function (response) {
			if (!response || response.status !== '1') {
				onDone(null, (response && response.message) || 'The message templates could not be loaded just now. Please try again in a minute.');
				return;
			}
			onDone(response.data, null);
		},
		error: function () {
			onDone(null, 'The message templates could not be reached. Check your connection and try again.');
		}
	});
}

function loadMessageTemplates() {
	$('#mtStatus').text('Loading the templates...');
	mtPost('list', {}, function (data, problem) {
		if (problem) {
			$('#mtStatus').text(problem);
			showMessageTheme2(0, problem);
			return;
		}
		MT_STATE.templates = data.templates || [];
		MT_STATE.canUpdate = !!data.canUpdate;
		$('#mtAdd').prop('hidden', !MT_STATE.canUpdate);
		renderMessageTemplates();
	});
}

function renderMessageTemplates() {
	var writer = $('#mtFilterWriter').val();
	var recipient = $('#mtFilterRecipient').val();
	var rows = MT_STATE.templates.filter(function (t) {
		return (!writer || t.writerRole === writer) && (!recipient || t.recipientKind === recipient);
	});
	if ($.fn.dataTable && $.fn.dataTable.isDataTable('#mtTable')) {
		$('#mtTable').DataTable().destroy();
	}
	$('#mtTable tbody').html(rows.map(function (t) {
		var actions = '';
		if (MT_STATE.canUpdate) {
			actions = t.owner
				? '<button type="button" class="btn btn-outline-primary btn-sm" data-mt="edit" data-id="' + t.id + '">Edit</button>'
					+ '<button type="button" class="btn btn-outline-danger btn-sm" data-mt="delete" data-id="' + t.id + '">Delete</button>'
				: '<button type="button" class="btn btn-outline-primary btn-sm" data-mt="copy" data-id="' + t.id + '">Make my own copy</button>';
		}
		return '<tr><th scope="row" class="font-weight-normal">' + mtEscape(t.title) + '</th>'
			+ '<td>' + mtEscape(mtLabel(MT_WRITERS, t.writerRole)) + '</td><td>' + mtEscape(mtLabel(MT_RECIPIENTS, t.recipientKind)) + '</td>'
			+ '<td>' + mtEscape(t.subject) + '</td><td>' + t.sortOrder + '</td>'
			+ '<td>' + (t.active ? 'Shown' : '<span class="mt-off">Hidden</span>') + '</td>'
			+ '<td><span class="mt-badge">' + (t.owner ? 'Your school' : 'Shared') + '</span></td>'
			+ '<td><div class="mt-actions">' + actions + '</div></td></tr>';
	}).join(''));
	if ($.fn.DataTable) {
		$('#mtTable').DataTable({ pageLength: 25, order: [], autoWidth: false, pagingType: 'full', search: { smart: false } });
	}
	$('#mtStatus').text(rows.length ? rows.length + (rows.length === 1 ? ' template' : ' templates')
		: 'No templates match. Change the filters, or add a template.');
}

/* template null: a new one. copy: a copy of a shared template, saved as the school's own (same title replaces it). */
function openMessageTemplate(template, copy) {
	var editing = template && !copy;
	$('#mtDialogTitle').text(editing ? 'Edit template' : copy ? 'Your own copy of this template' : 'Add a template');
	$('#mtId').val(editing ? template.id : '');
	$('#mtTitle').val(template ? template.title : '');
	$('#mtWriter').val(template ? template.writerRole : 'TEACHER');
	$('#mtRecipient').val(template ? template.recipientKind : 'PARENT');
	$('#mtSubject').val(template ? template.subject : '');
	$('#mtBody').val(template ? template.body : '');
	$('#mtOrder').val(template ? template.sortOrder : 0);
	$('#mtActive').prop('checked', template ? template.active : true);
	$('#mtError').text('');
	document.getElementById('mtDialog').showModal();
	$('#mtTitle').trigger('focus');
}

function saveMessageTemplate() {
	var request = {
		id: parseInt($('#mtId').val(), 10) || null, title: $.trim($('#mtTitle').val()), writerRole: $('#mtWriter').val(),
		recipientKind: $('#mtRecipient').val(), subject: $.trim($('#mtSubject').val()), body: $('#mtBody').val(),
		sortOrder: parseInt($('#mtOrder').val(), 10) || 0, active: $('#mtActive').is(':checked')
	};
	var missing = !request.title ? ['Please give the template a title.', '#mtTitle'] : !request.subject ? ['Please give the template a subject.', '#mtSubject']
		: !$.trim(request.body) ? ['Please write the template text.', '#mtBody'] : null;
	if (missing) {
		$('#mtError').text(missing[0]);
		$(missing[1]).trigger('focus');
		return;
	}
	$('#mtSave').prop('disabled', true);
	mtPost('save', request, function (data, problem) {
		$('#mtSave').prop('disabled', false);
		if (problem) {
			$('#mtError').text(problem);
			return;
		}
		document.getElementById('mtDialog').close();
		showMessageTheme2(1, 'The template "' + request.title + '" is saved.');
		loadMessageTemplates();
	});
}

function deleteMessageTemplate(template) {
	if (!window.confirm('Delete the template "' + template.title + '"? People will no longer see it in Write a message.')) {
		return;
	}
	mtPost('delete', { id: template.id }, function (data, problem) {
		if (problem) {
			showMessageTheme2(0, problem);
			return;
		}
		showMessageTheme2(1, 'The template is deleted.');
		loadMessageTemplates();
	});
}

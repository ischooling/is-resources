/*
 * Communications > Message templates: markup and styles. Behaviour is in messageTemplates.js.
 * Colours come from the school theme variables (--pc, --gray, --light, --white, --danger).
 */

var MT_WRITERS = [['STUDENT', 'Student'], ['PARENT', 'Parent'], ['TEACHER', 'Teacher'], ['ADMIN', 'Admin and office staff'], ['ANY', 'Anyone']];
var MT_RECIPIENTS = [['OFFICE', 'School office'], ['TEACHER', 'Teacher'], ['STUDENT', 'Student'], ['PARENT', 'Parent'], ['ADMIN', 'Admin'], ['ANY', 'Anyone']];

function mtOptions(list, first) {
	return (first ? '<option value="">' + first + '</option>' : '') + list.map(function (o) {
		return '<option value="' + o[0] + '">' + o[1] + '</option>';
	}).join('');
}

function getMessageTemplatesContent(title) {
	return '<div id="mtScreen">'
		+ '<style>'
		+ '#mtScreen .mt-actions{display:flex;flex-wrap:wrap;gap:.35rem}'
		+ '#mtScreen .mt-badge{display:inline-block;padding:.1rem .5rem;border-radius:1rem;font-size:.75rem;border:1px solid var(--gray,#ccc);background:var(--light,#f7f7f7)}'
		+ '#mtScreen .mt-off{color:var(--danger,#b02a37)}'
		+ '#mtScreen .mt-table-wrap{overflow-x:auto}'
		+ '#mtDialog{width:min(42rem,calc(100vw - 2rem));max-height:calc(100dvh - 2rem);padding:0;border:1px solid var(--gray,#ccc);border-radius:.5rem}'
		+ '#mtDialog::backdrop{background:rgb(0 0 0 / .45)}'
		+ '#mtDialog form{padding:1rem}'
		+ '#mtDialog .mt-help{font-size:.8rem;color:var(--gray-dark,#555)}'
		+ '#mtDialog .mt-error{color:var(--danger,#b02a37);margin:.5rem 0 0}'
		+ '#mtDialog .mt-error:empty{display:none}'
		+ '</style>'
		+ '<div class="app-page-title mb-3 py-2"><div class="page-title-wrapper"><div class="page-title-heading">'
		+ '<div class="page-title-icon"><i class="fa fa-file-text-o text-primary" aria-hidden="true"></i></div>'
		+ '<div><h1 class="h4 mb-0">' + title + '</h1><div class="page-title-subheading">Ready-made messages people can start from in Inbox &gt; Write a message. '
		+ 'The shared templates cannot be changed; add your own with the same title to replace one.</div></div></div>'
		+ '<div class="page-title-actions"><button type="button" class="btn btn-primary btn-sm" id="mtAdd" hidden><i class="fa fa-plus" aria-hidden="true"></i>&nbsp;Add a template</button></div>'
		+ '</div></div>'
		+ '<div class="main-card mb-3 card"><div class="card-body">'
		+ '<form class="form-row align-items-end" id="mtFilters" novalidate>'
		+ '<div class="form-group col-md-4"><label for="mtFilterWriter">Written by</label><select id="mtFilterWriter" class="form-control">' + mtOptions(MT_WRITERS, 'Everyone') + '</select></div>'
		+ '<div class="form-group col-md-4"><label for="mtFilterRecipient">Sent to</label><select id="mtFilterRecipient" class="form-control">' + mtOptions(MT_RECIPIENTS, 'Everyone') + '</select></div>'
		+ '</form>'
		+ '<p id="mtStatus" role="status" class="mb-2"></p>'
		+ '<div class="mt-table-wrap"><table id="mtTable" class="table table-bordered table-striped font-12 nowrap" style="width:100%">'
		+ '<caption class="sr-only">Message templates</caption>'
		+ '<thead><tr class="bg-primary text-white"><th scope="col">Title</th><th scope="col">Written by</th><th scope="col">Sent to</th>'
		+ '<th scope="col">Subject</th><th scope="col">Order</th><th scope="col">Status</th><th scope="col">Source</th><th scope="col">Actions</th></tr></thead>'
		+ '<tbody></tbody></table></div>'
		+ '</div></div>'
		+ '<dialog id="mtDialog" aria-labelledby="mtDialogTitle"><form id="mtForm" novalidate>'
		+ '<h2 class="h5" id="mtDialogTitle">Template</h2>'
		+ '<input type="hidden" id="mtId">'
		+ '<div class="form-group"><label for="mtTitle">Title (people see this in the list)</label><input type="text" id="mtTitle" class="form-control" maxlength="100" required autocomplete="off"></div>'
		+ '<div class="form-row"><div class="form-group col-md-6"><label for="mtWriter">Written by</label><select id="mtWriter" class="form-control">' + mtOptions(MT_WRITERS) + '</select></div>'
		+ '<div class="form-group col-md-6"><label for="mtRecipient">Sent to</label><select id="mtRecipient" class="form-control">' + mtOptions(MT_RECIPIENTS) + '</select></div></div>'
		+ '<div class="form-group"><label for="mtSubject">Subject</label><input type="text" id="mtSubject" class="form-control" maxlength="200" required autocomplete="off"></div>'
		+ '<div class="form-group"><label for="mtBody">Message</label><textarea id="mtBody" class="form-control" rows="9" maxlength="10000" required aria-describedby="mtBodyHelp" spellcheck="true"></textarea>'
		+ '<p class="mt-help mb-0" id="mtBodyHelp">These are filled in automatically: [Recipient name], [Child name], [Your name], [School name]. '
		+ 'Write anything the sender must fill in between angle brackets, like &lt;date&gt;.</p></div>'
		+ '<div class="form-row"><div class="form-group col-md-4"><label for="mtOrder">Order in the list</label><input type="number" id="mtOrder" class="form-control" min="0" max="9999" value="0"></div>'
		+ '<div class="form-group col-md-8 d-flex align-items-end"><div class="form-check mb-2"><input type="checkbox" class="form-check-input" id="mtActive" checked>'
		+ '<label class="form-check-label" for="mtActive">Show this template in Write a message</label></div></div></div>'
		+ '<p class="mt-error" id="mtError" role="alert"></p>'
		+ '<div class="d-flex justify-content-end" style="gap:.5rem"><button type="button" class="btn btn-outline-secondary" id="mtCancel">Cancel</button>'
		+ '<button type="submit" class="btn btn-primary" id="mtSave">Save</button></div>'
		+ '</form></dialog></div>';
}

function getEmailerTemplateViewerContent(){
	renderEmailTemplateTesterContent();
	showAndHideDashboardAndAdditionalContent("main");
    $("#dashboardContentInHTMLAdditional").html("");
    $("#dashboardContentInHTML").show();
    customLoader(true);
}
function renderEmailTemplateTesterContent() {
	$("#dashboardContentInHTML").html(getEmailTemplateTesterContent("Email Template Tester"));
	if (typeof window.initEmailTemplateTester === "function") {
		window.initEmailTemplateTester();
	}
}


function getEmailTemplateTesterContent(title) {
	var selfEmail = "";
	try {
		selfEmail = String(window.USER_EMAIL || window.USERNAME || "").trim();
	} catch (e) {}

	return `
		<div class="app-page-title mb-3 py-2">
			<div class="page-title-wrapper">
				<div class="page-title-heading">
					<div class="page-title-icon">
						<i class="fas fa-envelope-open-text text-primary"></i>
					</div>
					<div>${mailTesterContentEsc(title || "Email Template Tester")}</div>
				</div>
			</div>
		</div>
		<div id="mailTesterRoot" class="container-fluid px-0">
			<input type="hidden" id="mailTesterSelfEmail" value="${mailTesterContentEsc(selfEmail)}" />
			<div class="row">
				<div class="col-12 col-xl-4">
					<div class="card rounded-15 mb-2">
						<div class="card-body">
							<div class="font-22 font-weight-semi-bold">Template Control</div>
							<div class="text-muted mb-3">
								Choose one active email template, inspect its metadata, and regenerate randomized sample values whenever you need a fresh preview.
							</div>
							<div class="mb-3">
								<label class="font-12 text-dark opacity-02" for="mailTesterTemplate">Email Template</label>
								<select id="mailTesterTemplate" class="form-control rounded"></select>
							</div>
							<div class="d-flex flex-wrap gap-10 mb-3">
								<button type="button" class="btn btn-primary btn-shadow rounded" id="mailTesterPreviewBtn">Random Preview</button>
								<button type="button" class="btn btn-outline-primary rounded" id="mailTesterApplyOverridesBtn">Apply Overrides</button>
								<button type="button" class="btn btn-outline-secondary rounded" id="mailTesterResetBtn">Reset</button>
							</div>
							<div class="row" id="mailTesterMetaGrid">
								<div class="col-12 col-md-6 mb-2">
									<div class="bg-light-primary rounded p-3 h-100 border">
									<div class="font-14 font-weight-semi-bold">Template For</div>
									<div class="font-weight-semi-bold text-dark" id="mailTesterMetaFor">--</div>
									</div>
								</div>
								<div class="col-12 col-md-6 mb-2">
									<div class="bg-light-primary rounded p-3 h-100 border">
									<div class="font-14 font-weight-semi-bold">Header/Footer</div>
									<div class="font-weight-semi-bold text-dark" id="mailTesterMetaHeader">--</div>
									</div>
								</div>
								<div class="col-12 col-md-6 mb-2">
									<div class="bg-light-primary rounded p-3 h-100 border">
									<div class="font-14 font-weight-semi-bold">Text Align</div>
									<div class="font-weight-semi-bold text-dark" id="mailTesterMetaAlign">--</div>
									</div>
								</div>
								<div class="col-12 col-md-6 mb-2">
									<div class="bg-light-primary rounded p-3 h-100 border">
									<div class="font-14 font-weight-semi-bold">Template Id</div>
									<div class="font-weight-semi-bold text-dark" id="mailTesterMetaId">--</div>
									</div>
								</div>
							</div>
							<div class="alert alert-info d-none mb-0" id="mailTesterUnresolvedWrap">
								<div class="font-12 font-weight-semi-bold mb-1">UNRESOLVED TOKENS</div>
								<div id="mailTesterUnresolvedText">None</div>
							</div>
						</div>
					</div>
					<div class="card rounded-15 mb-2">
						<div class="card-body">
							<div class="font-22 font-weight-semi-bold">Send Test Mail</div>
							<div class="text-muted mb-3">
								The subject and sample values come from the current preview. Refresh the preview first if you want a new randomized subject/body combination.
							</div>
							<div class="mb-3">
								<label class="font-12 text-dark opacity-02" for="mailTesterRecipient">Recipient Email</label>
								<input type="email" id="mailTesterRecipient" class="form-control rounded" placeholder="example@domain.com" />
							</div>
							<div class="mb-3">
								<label class="font-12 text-dark opacity-02" for="mailTesterSubject">Randomized Subject</label>
								<input type="text" id="mailTesterSubject" class="form-control rounded" readonly />
								<div class="text-muted mt-1">This subject is regenerated whenever you refresh the preview.</div>
							</div>
							<div class="d-flex flex-wrap gap-10 mb-3">
								<button type="button" class="btn btn-success btn-shadow rounded" id="mailTesterSendBtn">Send Test Mail</button>
								<button type="button" class="btn btn-outline-primary rounded" id="mailTesterSendSelfBtn">Send To Myself</button>
							</div>
							<div class="alert alert-info d-none mb-0" id="mailTesterSendResult">
								<div class="font-12 font-weight-semi-bold mb-1">LAST SEND RESULT</div>
								<div id="mailTesterSendResultText">No mail sent yet.</div>
							</div>
						</div>
					</div>
					<div class="card rounded-15 mb-2">
						<div class="card-body">
							<div class="font-22 font-weight-semi-bold">Placeholder Map</div>
							<div class="text-muted mb-3">
								Edit any generated placeholder value here, then apply overrides to re-render the preview or send the current overridden version directly.
							</div>
							<div class="table-responsive">
								<table class="table table-bordered mb-0">
									<thead>
										<tr>
											<th class="w-25">Token</th>
											<th>Injected Value</th>
										</tr>
									</thead>
									<tbody id="mailTesterTokenRows">
										<tr><td colspan="2" class="text-center text-muted py-4">Choose a template to inspect generated values.</td></tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
				<div class="col-12 col-xl-8">
					<div class="card rounded-15 mb-2">
						<div class="card-body">
							<div class="d-flex flex-wrap align-items-center justify-content-between mb-3 gap-10">
								<div>
									<div class="font-22 font-weight-semi-bold mb-1">Template Viewer</div>
									<div class="text-muted mb-0">Switch between the fully rendered email output and the original HTML pulled from the TEMPLATE table.</div>
								</div>
								<div class="btn-group" role="group">
									<button type="button" class="btn btn-primary rounded font-weight-semi-bold mx-2" data-mailtester-tab="rendered">Rendered Preview</button>
									<button type="button" class="btn btn-outline-primary rounded font-weight-semi-bold" data-mailtester-tab="raw">Raw Template</button>
								</div>
							</div>
							<div data-mailtester-pane="rendered">
								<div id="mailTesterRenderedWrap" class="border rounded p-4 text-center text-muted">Choose a template to generate a rendered preview.</div>
								<iframe id="mailTesterPreviewFrame" class="w-100 rounded border d-none" height="760"></iframe>
							</div>
							<div class="d-none" data-mailtester-pane="raw">
								<textarea id="mailTesterRawContent" class="form-control rounded" rows="28" readonly placeholder="Raw template HTML will appear here."></textarea>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>`;
}

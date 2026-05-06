function getEmailerTemplateViewerContent(){
	renderEmailTemplateTesterContent();
	showAndHideDashboardAndAdditionalContent("main");
    $("#dashboardContentInHTMLAdditional").html("");
    $("#dashboardContentInHTML").show();
    customLoader(true);
}
function renderEmailTemplateTesterContent() {
	$("#dashboardContentInHTML").html(getEmailTemplateTesterContent("Email Template Tester"));
	emailTemplateTesterPageLoadEvent();
}


function getEmailTemplateTesterContent(title) {
	var selfEmail = "";
	try {
		selfEmail = String(window.USER_EMAIL || window.USERNAME || "").trim();
	} catch (e) {}

	return `
		<style>
			#mailTesterRoot .mailTesterCard {
				border: 1px solid #e8edf5;
				border-radius: 14px;
				box-shadow: 0 8px 24px rgba(16, 24, 40, 0.06);
			}
			#mailTesterRoot .mailTesterCard .card-body {
				padding: 1.25rem;
			}
			#mailTesterRoot .mailTesterSectionTitle {
				font-size: 1.15rem;
				font-weight: 700;
				margin-bottom: 0.3rem;
			}
			#mailTesterRoot .mailTesterSectionText {
				color: #6b7280;
				font-size: 0.9rem;
				line-height: 1.45;
				margin-bottom: 1rem;
			}
			#mailTesterRoot .mailTesterSubWrap {
				border: 1px solid #dce4ef;
				background: #f9fbff;
				border-radius: 12px;
				padding: 0.9rem;
			}
			#mailTesterRoot .mailTesterMetaCard {
				background: #f7faff;
				border: 1px solid #dde6f3;
				border-radius: 10px;
				padding: 0.7rem;
				height: 100%;
			}
			#mailTesterRoot .mailTesterPreviewPanel {
				background: #f8fafc;
				border: 1px solid #dce4ef;
				border-radius: 12px;
				height: 460px;
				max-height: 460px;
				overflow: hidden;
				box-sizing: border-box;
				scroll-behavior: smooth;
			}
			#mailTesterRoot #mailTesterRenderedWrap {
				height: 100%;
				min-height: 0;
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 0.75rem;
				overflow-y: auto;
				overflow-x: hidden;
				word-break: break-word;
				overflow-wrap: anywhere;
			}
			#mailTesterRoot #mailTesterPreviewFrame {
				background: #fff;
				border: 1px solid #dce4ef !important;
				border-radius: 12px;
				width: 100%;
				height: 100%;
				display: block;
			}
			#mailTesterRoot .mailTesterViewerPane {
				background: #f8fafc;
				border: 1px solid #dce4ef;
				border-radius: 12px;
				height: 460px;
				max-height: 460px;
				padding: 0.75rem;
				overflow-y: auto;
				overflow-x: hidden;
				scroll-behavior: smooth;
			}
			#mailTesterRoot #mailTesterRawContent {
				height: 100%;
				min-height: 0;
				resize: none;
				overflow-y: auto;
				overflow-x: hidden;
				word-break: break-word;
				overflow-wrap: anywhere;
				background: #ffffff;
			}
			#mailTesterRoot #mailTesterRangeList {
				height: calc(100% - 2rem);
				overflow-y: auto;
				overflow-x: hidden;
				background: #ffffff;
			}
			#mailTesterRoot .mailTesterTokenTableWrap {
				max-height: 380px;
				overflow: auto;
				border: 1px solid #dce4ef;
				border-radius: 12px;
			}
			#mailTesterRoot .mailTesterTokenTable {
				margin-bottom: 0;
			}
			#mailTesterRoot .mailTesterPrimaryBtn {
				font-weight: 700;
				padding: 0.5rem 1rem;
			}
			#mailTesterRoot .mailTesterGap {
				row-gap: 1rem;
			}
			#mailTesterRoot .mailTesterBottomSection {
				margin-top: 1rem;
			}
			@media (max-width: 991.98px) {
				#mailTesterRoot .mailTesterCard .card-body {
					padding: 1rem;
				}
				#mailTesterRoot .mailTesterBottomSection {
					margin-top: 0.85rem;
				}
				#mailTesterRoot .mailTesterTokenTableWrap {
					max-height: 320px;
				}
				#mailTesterRoot .mailTesterPreviewPanel,
				#mailTesterRoot .mailTesterViewerPane {
					height: 420px;
					max-height: 420px;
				}
			}
		</style>
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

		<div id="mailTesterRoot" class="container-fluid px-0 pb-2">
			<input type="hidden" id="mailTesterSelfEmail" value="${mailTesterContentEsc(selfEmail)}" />

			<div class="row mailTesterGap">
				<div class="col-12 col-lg-4">
					<div class="card mailTesterCard h-100">
						<div class="card-body">
							<div class="mailTesterSectionTitle">Template Control</div>
							<div class="mailTesterSectionText">
								Choose one active email template, inspect metadata, and generate randomized sample values for quick validation.
							</div>

							<div class="form-group mb-3">
								<label class="font-12 text-dark opacity-9 mb-1" for="mailTesterTemplate">Email Template</label>
								<select id="mailTesterTemplate" class="form-control rounded"></select>
							</div>

							<div class="mailTesterSubWrap mb-3">
								<div class="font-16 font-weight-semi-bold mb-2">Range Preview</div>
								<div class="text-muted mb-2">Load multiple templates in one run (example: template_id 1 to 100).</div>
								<div class="form-row">
									<div class="col-12 col-sm-4 mb-2 mb-sm-0">
										<label class="font-12 text-dark opacity-9 mb-1" for="mailTesterFromId">From ID</label>
										<input type="number" id="mailTesterFromId" class="form-control rounded" min="1" placeholder="1" />
									</div>
									<div class="col-12 col-sm-4 mb-2 mb-sm-0">
										<label class="font-12 text-dark opacity-9 mb-1" for="mailTesterToId">To ID</label>
										<input type="number" id="mailTesterToId" class="form-control rounded" min="1" placeholder="100" />
									</div>
									<div class="col-12 col-sm-4">
										<label class="font-12 text-dark opacity-9 mb-1" for="mailTesterRangeLimit">Limit</label>
										<input type="number" id="mailTesterRangeLimit" class="form-control rounded" min="1" max="100" value="25" />
									</div>
								</div>
								<div class="mt-3">
									<button type="button" class="btn btn-outline-dark rounded" id="mailTesterLoadRangeBtn">Load Range</button>
								</div>
							</div>

							<div class="d-flex flex-wrap gap-10 mb-3">
								<button type="button" class="btn btn-primary btn-shadow rounded mailTesterPrimaryBtn" id="mailTesterPreviewBtn">Random Preview</button>
								<button type="button" class="btn btn-outline-primary rounded" id="mailTesterApplyOverridesBtn">Apply Overrides</button>
								<button type="button" class="btn btn-outline-secondary rounded" id="mailTesterResetBtn">Reset</button>
							</div>

							<div class="row" id="mailTesterMetaGrid">
								<div class="col-12 col-sm-6 mb-2">
									<div class="mailTesterMetaCard">
										<div class="font-13 font-weight-semi-bold">Template For</div>
										<div class="font-weight-semi-bold text-dark" id="mailTesterMetaFor">--</div>
									</div>
								</div>
								<div class="col-12 col-sm-6 mb-2">
									<div class="mailTesterMetaCard">
										<div class="font-13 font-weight-semi-bold">Header/Footer</div>
										<div class="font-weight-semi-bold text-dark" id="mailTesterMetaHeader">--</div>
									</div>
								</div>
								<div class="col-12 col-sm-6 mb-2">
									<div class="mailTesterMetaCard">
										<div class="font-13 font-weight-semi-bold">Text Align</div>
										<div class="font-weight-semi-bold text-dark" id="mailTesterMetaAlign">--</div>
									</div>
								</div>
								<div class="col-12 col-sm-6 mb-2">
									<div class="mailTesterMetaCard">
										<div class="font-13 font-weight-semi-bold">Template Id</div>
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
				</div>

				<div class="col-12 col-lg-8">
					<div class="card mailTesterCard h-100">
						<div class="card-body">
							<div class="d-flex flex-wrap align-items-start justify-content-between mb-3 gap-10">
								<div class="pr-2">
									<div class="mailTesterSectionTitle mb-1">Template Viewer</div>
									<div class="mailTesterSectionText mb-0">Switch between rendered output, raw HTML, and range preview.</div>
								</div>
								<div class="btn-group d-flex flex-wrap" role="group">
									<button type="button" class="btn btn-primary rounded font-weight-semi-bold mr-2 mb-2" data-mailtester-tab="rendered">Rendered Preview</button>
									<button type="button" class="btn btn-outline-primary rounded font-weight-semi-bold mr-2 mb-2" data-mailtester-tab="raw">Raw Template</button>
									<button type="button" class="btn btn-outline-primary rounded font-weight-semi-bold mb-2" data-mailtester-tab="range">Range Preview</button>
								</div>
							</div>

							<div data-mailtester-pane="rendered" class="mailTesterPreviewPanel p-3">
								<div id="mailTesterRenderedWrap" class="text-center text-muted">Choose a template to generate a rendered preview.</div>
								<iframe id="mailTesterPreviewFrame" class="w-100 d-none" loading="lazy"></iframe>
							</div>
							<div class="d-none mailTesterViewerPane" data-mailtester-pane="raw">
								<textarea id="mailTesterRawContent" class="form-control rounded" readonly placeholder="Raw template HTML will appear here."></textarea>
							</div>
							<div class="d-none mailTesterViewerPane" data-mailtester-pane="range">
								<div id="mailTesterRangeInfo" class="text-muted mb-2">No range loaded yet.</div>
								<div id="mailTesterRangeList" class="border rounded p-3 bg-white">
									<div class="text-muted text-center py-4">Use Range Preview controls to load templates.</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="row mailTesterGap mailTesterBottomSection">
				<div class="col-12">
					<div class="card mailTesterCard">
						<div class="card-body">
							<div class="mailTesterSectionTitle">Send Test Mail</div>
							<div class="mailTesterSectionText">
								The subject and sample values come from the current preview. Refresh preview first to regenerate randomized content.
							</div>
							<div class="row">
								<div class="col-12 col-lg-5 mb-3">
									<label class="font-12 text-dark opacity-9 mb-1" for="mailTesterRecipient">Recipient Email</label>
									<input type="email" id="mailTesterRecipient" class="form-control rounded" placeholder="example@domain.com" />
								</div>
								<div class="col-12 col-lg-7 mb-3">
									<label class="font-12 text-dark opacity-9 mb-1" for="mailTesterSubject">Randomized Subject</label>
									<input type="text" id="mailTesterSubject" class="form-control rounded" readonly />
									<div class="text-muted mt-1">This subject is regenerated whenever you refresh the preview.</div>
								</div>
							</div>
							<div class="d-flex flex-wrap gap-10 mb-3">
								<button type="button" class="btn btn-success btn-shadow rounded mailTesterPrimaryBtn" id="mailTesterSendBtn">Send Test Mail</button>
								<button type="button" class="btn btn-outline-primary rounded" id="mailTesterSendSelfBtn">Send To Myself</button>
							</div>
							<div class="alert alert-info d-none mb-0" id="mailTesterSendResult">
								<div class="font-12 font-weight-semi-bold mb-1">LAST SEND RESULT</div>
								<div id="mailTesterSendResultText">No mail sent yet.</div>
							</div>
						</div>
					</div>
				</div>

				<div class="col-12">
					<div class="card mailTesterCard">
						<div class="card-body">
							<div class="mailTesterSectionTitle">Placeholder Map</div>
							<div class="mailTesterSectionText">
								Edit generated placeholder values here, then apply overrides to re-render preview or send the overridden output.
							</div>
							<div class="mailTesterTokenTableWrap">
								<table class="mailTesterTokenTable table table-bordered" cellpadding="10">
									<thead>
										<tr>
											<th class="bg-light-primary font-weight-semi-bold" style="width: 180px;">Token</th>
											<th class="bg-light-primary font-weight-semi-bold">Injected Value</th>
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
			</div>
		</div>`;
}


function mailTesterContentEsc(value) {
	return String(value === undefined || value === null ? "" : value)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/\"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

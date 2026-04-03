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
		<style>
			#mailTesterRoot {
				min-height: 70vh;
				display: grid;
				gap: 18px;
			}
			#mailTesterRoot .mailTesterHero {
				position: relative;
				overflow: hidden;
				border-radius: 28px;
				padding: 24px 26px;
				background:
					radial-gradient(circle at top right, rgba(56, 189, 248, 0.18), transparent 24%),
					radial-gradient(circle at left bottom, rgba(59, 130, 246, 0.16), transparent 28%),
					linear-gradient(135deg, #ffffff 0%, #f7fbff 48%, #eef5ff 100%);
				border: 1px solid rgba(37, 99, 235, 0.1);
				box-shadow: 0 22px 48px rgba(36, 64, 115, 0.12);
			}
			#mailTesterRoot .mailTesterHero__eyebrow {
				font-size: 11px;
				font-weight: 800;
				letter-spacing: 0.18em;
				color: #5d7aa6;
				text-transform: none;
				margin-bottom: 10px;
			}
			#mailTesterRoot .mailTesterHero__title {
				font-size: clamp(30px, 3vw, 42px);
				line-height: 1;
				font-weight: 800;
				letter-spacing: -0.04em;
				color: #22324a;
				margin-bottom: 10px;
			}
			#mailTesterRoot .mailTesterHero__copy {
				max-width: 820px;
				font-size: 16px;
				line-height: 1.5;
				color: #667b93;
			}
			#mailTesterRoot .mailTesterHero__rail {
				display: flex;
				flex-wrap: wrap;
				gap: 10px;
				margin-top: 16px;
			}
			#mailTesterRoot .mailTesterPill {
				display: inline-flex;
				align-items: center;
				gap: 8px;
				padding: 8px 12px;
				border-radius: 999px;
				font-size: 12px;
				font-weight: 700;
				color: #3f5f86;
				background: rgba(255,255,255,0.85);
				border: 1px solid rgba(56, 107, 192, 0.1);
			}
			#mailTesterRoot .mailTesterShell {
				display: grid;
				grid-template-columns: minmax(320px, 0.95fr) minmax(0, 1.45fr);
				gap: 18px;
				align-items: start;
			}
			
			
			#mailTesterRoot .mailTesterCard__copy {
				font-size: 14px;
				line-height: 1.5;
				color: #6d8099;
				margin-bottom: 16px;
			}
			#mailTesterRoot .mailTesterField {
				margin-bottom: 14px;
			}
			
			#mailTesterRoot .mailTesterField__help {
				font-size: 12px;
				color: #7c8ea4;
				margin-top: 6px;
			}
			#mailTesterRoot .mailTesterActions {
				display: flex;
				flex-wrap: wrap;
				gap: 10px;
				margin-top: 8px;
			}
			#mailTesterRoot .mailTesterMetaGrid {
				display: grid;
				grid-template-columns: repeat(2, minmax(0, 1fr));
				gap: 10px;
				margin-top: 12px;
			}
			#mailTesterRoot .mailTesterMetaTile {
				padding: 12px 14px;
				background: linear-gradient(180deg, #ffffff 0%, #f7fbff 100%);
				border: 1px solid rgba(37, 99, 235, 0.08);
			}
			
			#mailTesterRoot .mailTesterMetaTile__value {
				font-size: 14px;
				font-weight: 700;
				line-height: 1.3;
				color: #243447;
				word-break: break-word;
			}
			#mailTesterRoot .mailTesterNotice {
				display: none;
				margin-top: 14px;
				padding: 14px 16px;
				border-radius: 18px;
				border: 1px solid rgba(15, 118, 110, 0.16);
				background: linear-gradient(180deg, #f0fdf9 0%, #ebfbf4 100%);
			}
			#mailTesterRoot .mailTesterNotice--warn {
				display: block;
				border-color: rgba(217, 119, 6, 0.16);
				background: linear-gradient(180deg, #fff8eb 0%, #fff4df 100%);
			}
			#mailTesterRoot .mailTesterNotice__label {
				font-size: 11px;
				font-weight: 800;
				letter-spacing: 0.14em;
				color: #5e7b8f;
				margin-bottom: 6px;
				text-transform: none;
			}
			#mailTesterRoot .mailTesterNotice__value {
				font-size: 14px;
				line-height: 1.5;
				color: #25415f;
			}
			#mailTesterRoot .mailTesterPreviewHead {
				display: flex;
				align-items: center;
				justify-content: space-between;
				gap: 12px;
				margin-bottom: 14px;
				flex-wrap: wrap;
			}
			#mailTesterRoot .mailTesterTabs {
				display: inline-flex;
				align-items: center;
				gap: 8px;
				padding: 6px;
				background: #edf4ff;
				border: 1px solid rgba(43, 102, 255, 0.1);
			}
			#mailTesterRoot .mailTesterTab {
				border: 0;
				background: transparent;
				border-radius: 999px;
				padding: 9px 14px;
				font-size: 12px;
				letter-spacing: 0.08em;
				color: #486685;
				text-transform: none;
			}
			#mailTesterRoot .mailTesterTab.active {
				background: #fff;
				box-shadow: 0 8px 16px rgba(32, 74, 139, 0.12);
				color: #155eef;
			}
			#mailTesterRoot .mailTesterPreviewPane {
				display: none;
			}
			#mailTesterRoot .mailTesterPreviewPane.active {
				display: block;
			}
			#mailTesterRoot .mailTesterFrame {
				width: 100%;
				min-height: 760px;
				border: 1px solid rgba(29, 78, 216, 0.08);
				border-radius: 18px;
				background: #fff;
			}
			#mailTesterRoot .mailTesterCode {
				width: 100%;
				min-height: 760px;
				border-radius: 18px;
				border: 1px solid rgba(29, 78, 216, 0.08);
				background: #0f172a;
				color: #dbe7ff;
				font-family: "SFMono-Regular", Menlo, Monaco, Consolas, monospace;
				font-size: 12px;
				line-height: 1.6;
				padding: 18px;
				resize: vertical;
			}
			#mailTesterRoot .mailTesterTokenTableWrap {
				max-height: 420px;
				overflow: auto;
				border: 1px solid rgba(29, 78, 216, 0.08);
				border-radius: 18px;
			}
			#mailTesterRoot .mailTesterTokenTable {
				width: 100%;
				border-collapse: collapse;
				background: #fff;
			}
			#mailTesterRoot .mailTesterTokenTable th,
			#mailTesterRoot .mailTesterTokenTable td {
				padding: 12px 14px;
				border-bottom: 1px solid rgba(38, 88, 168, 0.08);
				vertical-align: top;
			}
			#mailTesterRoot .mailTesterTokenTable th {
				font-size: 11px;
				font-weight: 800;
				letter-spacing: 0.12em;
				color: #6d8198;
				text-transform: none;
				background: #f7fbff;
				position: sticky;
				top: 0;
				z-index: 1;
			}
			#mailTesterRoot .mailTesterTokenCode {
				display: inline-flex;
				align-items: center;
				padding: 5px 8px;
				border-radius: 999px;
				background: #edf4ff;
				color: #155eef;
				font-family: "SFMono-Regular", Menlo, Monaco, Consolas, monospace;
				font-size: 12px;
				font-weight: 700;
			}
			#mailTesterRoot .mailTesterTokenInput {
				min-height: 78px;
				resize: vertical;
				font-size: 13px;
				line-height: 1.45;
				border-radius: 12px;
				border-color: rgba(29, 78, 216, 0.16);
				background: #fbfdff;
			}
			#mailTesterRoot .mailTesterTokenInput:focus {
				border-color: rgba(29, 78, 216, 0.32);
				box-shadow: 0 0 0 0.12rem rgba(59, 130, 246, 0.12);
				background: #fff;
			}
			#mailTesterRoot .mailTesterEmpty {
				display: flex;
				align-items: center;
				justify-content: center;
				min-height: 240px;
				border: 1px dashed rgba(83, 112, 161, 0.22);
				border-radius: 18px;
				background: linear-gradient(180deg, #fbfdff 0%, #f4f8ff 100%);
				color: #73859d;
				font-size: 15px;
				text-align: center;
				padding: 24px;
			}
			#mailTesterRoot .mailTesterLoader {
				display: flex;
				align-items: center;
				gap: 8px;
				font-size: 13px;
				font-weight: 700;
				color: #5d7aa6;
			}
			#mailTesterRoot .mailTesterLoader .spinner-border {
				width: 18px;
				height: 18px;
			}
			@media (max-width: 1199.98px) {
				#mailTesterRoot .mailTesterShell {
					grid-template-columns: 1fr;
				}
			}
			@media (max-width: 767.98px) {
				#mailTesterRoot .mailTesterHero,
				#mailTesterRoot .card-body {
					padding: 18px;
				}
				#mailTesterRoot .mailTesterMetaGrid {
					grid-template-columns: 1fr;
				}
				#mailTesterRoot .mailTesterFrame,
				#mailTesterRoot .mailTesterCode {
					min-height: 560px;
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
		<div id="mailTesterRoot">
			<input type="hidden" id="mailTesterSelfEmail" value="${mailTesterContentEsc(selfEmail)}" />
			<div class="mailTesterShell">
				<div class="mailTesterColumn">
					<div class="card rounded-15 mb-2">
						<div class="card-body">
							<div class="font-22 font-weight-semi-bold">Template Control</div>
							<div class="mailTesterCard__copy">
								Choose one active email template, inspect its metadata, and regenerate randomized sample values whenever you need a fresh preview.
							</div>
							<div class="mailTesterField">
								<label class="font-12 text-dark opacity-02" for="mailTesterTemplate">Email Template</label>
								<select id="mailTesterTemplate" class="form-control rounded"></select>
							</div>
							<div class="mailTesterActions">
								<button type="button" class="btn btn-primary btn-shadow rounded" id="mailTesterPreviewBtn">Random Preview</button>
								<button type="button" class="btn btn-outline-primary rounded" id="mailTesterApplyOverridesBtn">Apply Overrides</button>
								<button type="button" class="btn btn-outline-secondary rounded" id="mailTesterResetBtn">Reset</button>
							</div>
							<div class="mailTesterMetaGrid" id="mailTesterMetaGrid">
								<div class="mailTesterMetaTile rounded">
									<div class="font-14 font-weight-semi-bold">Template For</div>
									<div class="mailTesterMetaTile__value" id="mailTesterMetaFor">--</div>
								</div>
								<div class="mailTesterMetaTile rounded">
									<div class="font-14 font-weight-semi-bold">Header/Footer</div>
									<div class="mailTesterMetaTile__value" id="mailTesterMetaHeader">--</div>
								</div>
								<div class="mailTesterMetaTile rounded">
									<div class="font-14 font-weight-semi-bold">Text Align</div>
									<div class="mailTesterMetaTile__value" id="mailTesterMetaAlign">--</div>
								</div>
								<div class="mailTesterMetaTile rounded">
									<div class="font-14 font-weight-semi-bold">Template Id</div>
									<div class="mailTesterMetaTile__value" id="mailTesterMetaId">--</div>
								</div>
							</div>
							<div class="mailTesterNotice" id="mailTesterUnresolvedWrap">
								<div class="mailTesterNotice__label">UNRESOLVED TOKENS</div>
								<div class="mailTesterNotice__value" id="mailTesterUnresolvedText">None</div>
							</div>
						</div>
					</div>
					<div class="card rounded-15 mb-2">
						<div class="card-body">
							<div class="font-22 font-weight-semi-bold">Send Test Mail</div>
							<div class="mailTesterCard__copy">
								The subject and sample values come from the current preview. Refresh the preview first if you want a new randomized subject/body combination.
							</div>
							<div class="mailTesterField">
								<label class="mailTesterField__label" for="mailTesterRecipient">Recipient Email</label>
								<input type="email" id="mailTesterRecipient" class="form-control rounded" placeholder="example@domain.com" />
							</div>
							<div class="mailTesterField">
								<label class="mailTesterField__label" for="mailTesterSubject">Randomized Subject</label>
								<input type="text" id="mailTesterSubject" class="form-control rounded" readonly />
								<div class="mailTesterField__help">This subject is regenerated whenever you refresh the preview.</div>
							</div>
							<div class="mailTesterActions">
								<button type="button" class="btn btn-success btn-shadow rounded" id="mailTesterSendBtn">Send Test Mail</button>
								<button type="button" class="btn btn-outline-primary rounded" id="mailTesterSendSelfBtn">Send To Myself</button>
							</div>
							<div class="mailTesterNotice" id="mailTesterSendResult">
								<div class="mailTesterNotice__label">LAST SEND RESULT</div>
								<div class="mailTesterNotice__value" id="mailTesterSendResultText">No mail sent yet.</div>
							</div>
						</div>
					</div>
					<div class="card rounded-15 mb-2">
						<div class="card-body">
							<div class="font-22 font-weight-semi-bold">Placeholder Map</div>
							<div class="mailTesterCard__copy">
								Edit any generated placeholder value here, then apply overrides to re-render the preview or send the current overridden version directly.
							</div>
							<div class="mailTesterTokenTableWrap">
								<table class="mailTesterTokenTable">
									<thead>
										<tr>
											<th style="width: 180px;">Token</th>
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
				<div class="mailTesterColumn">
					<div class="card rounded-15 mb-2">
						<div class="card-body">
							<div class="mailTesterPreviewHead">
								<div>
									<div class="font-22 font-weight-semi-bold mb-1">Template Viewer</div>
									<div class="mailTesterCard__copy mb-0">Switch between the fully rendered email output and the original HTML pulled from the TEMPLATE table.</div>
								</div>
								<div class="d-inline-flex rounded-10 gap-10 p-1 bg-light-primary">
									<button type="button" class="mailTesterTab active rounded-10 font-weight-semi-bold cursor" data-mailtester-tab="rendered">Rendered Preview</button>
									<button type="button" class="mailTesterTab rounded-10 font-weight-semi-bold cursor" data-mailtester-tab="raw">Raw Template</button>
								</div>
							</div>
							<div class="mailTesterPreviewPane active" data-mailtester-pane="rendered">
								<div id="mailTesterRenderedWrap" class="mailTesterEmpty">Choose a template to generate a rendered preview.</div>
								<iframe id="mailTesterPreviewFrame" class="mailTesterFrame" style="display:none;"></iframe>
							</div>
							<div class="mailTesterPreviewPane" data-mailtester-pane="raw">
								<textarea id="mailTesterRawContent" class="mailTesterCode" readonly placeholder="Raw template HTML will appear here."></textarea>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>`;
}

function releaseNoteContentEsc(value) {
	return String(value === undefined || value === null ? "" : value)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

function getReleaseNoteAdminListContent(title) {
	return `
		<div class="app-page-title mb-3 py-2">
			<div class="page-title-wrapper">
				<div class="page-title-heading">
					<div class="page-title-icon"><i class="fa fa-bullhorn text-primary"></i></div>
					<div>${releaseNoteContentEsc(title || "Release Notes (Admin)")}</div>
				</div>
				<div class="page-title-actions">
					<button type="button" class="btn btn-outline-primary mr-2" onclick="releaseNoteAdminRefresh()">
						<i class="fa fa-refresh"></i>&nbsp;Refresh
					</button>
					<button type="button" class="btn btn-primary" onclick="releaseNoteAdminOpenEditor(0)">
						<i class="fa fa-plus-circle"></i>&nbsp;Create Release Note
					</button>
				</div>
			</div>
		</div>

		<div class="row mb-3">
			<div class="col-md-4 col-sm-6 col-12 mb-2">
				<div class="card">
					<div class="card-body py-3">
						<div class="font-weight-bold">Total</div>
						<div class="h4 mb-0" id="rnAdminTotalCount">0</div>
					</div>
				</div>
			</div>
			<div class="col-md-4 col-sm-6 col-12 mb-2">
				<div class="card">
					<div class="card-body py-3">
						<div class="font-weight-bold">Draft</div>
						<div class="h4 mb-0 text-warning" id="rnAdminDraftCount">0</div>
					</div>
				</div>
			</div>
			<div class="col-md-4 col-sm-6 col-12 mb-2">
				<div class="card">
					<div class="card-body py-3">
						<div class="font-weight-bold">Published</div>
						<div class="h4 mb-0 text-success" id="rnAdminPublishedCount">0</div>
					</div>
				</div>
			</div>
		</div>

		<div class="main-card mt-2 mb-3 card">
			<div class="card-body">
				<div class="table-responsive">
					<table id="releaseNoteAdminTable" class="table table-bordered table-striped" style="width:100%">
						<thead>
							<tr class="bg-primary text-white">
								<th>S.No</th>
								<th>Release Details</th>
								<th>Impact | Note | Target Roles</th>
								<th>Dates</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody id="rnAdminTableBody">
							<tr>
								<td colspan="7" class="text-center">Loading...</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>

		<div class="modal fade" id="releaseNoteAdminDetailModal" tabindex="-1" role="dialog" aria-hidden="true">
			<div class="modal-dialog modal-lg" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">Release Note Detail</h5>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body" id="rnAdminDetailBody"></div>
				</div>
			</div>
		</div>

		<div class="modal fade" id="releaseNoteSendMailModal" tabindex="-1" role="dialog" aria-hidden="true">
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">Send Release Note</h5>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body">
						<input type="hidden" id="rnSendMailReleaseNoteId" value="0" />
						<div class="form-group">
							<label>To Emails (comma separated)<sup class="text-danger">*</sup></label>
							<input type="text" class="form-control" id="rnSendMailToEmails" placeholder="user1@example.com, user2@example.com" />
						</div>
						<div class="form-group mb-0">
							<label>CC Emails (comma separated)</label>
							<input type="text" class="form-control" id="rnSendMailCcEmails" placeholder="cc1@example.com, cc2@example.com" />
						</div>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Cancel</button>
						<button type="button" class="btn btn-primary" id="rnSendMailSubmitBtn" onclick="releaseNoteAdminSubmitSendMail()">
							<i class="fa fa-envelope"></i>&nbsp;Send
						</button>
					</div>
				</div>
			</div>
		</div>`;
}

function getReleaseNoteAdminEditorContent(title) {
	return `
		<div class="app-page-title mb-3 py-2">
			<div class="page-title-wrapper">
				<div class="page-title-heading">
					<div class="page-title-icon"><i class="fa fa-file-text text-primary"></i></div>
					<div id="rnEditorHeading">${releaseNoteContentEsc(title || "Create Release Note")}</div>
				</div>
				<div class="page-title-actions">
					<a href="javascript:void(0)" class="btn btn-primary" onclick="return releaseNoteBackToAdminList()">
						<i class="fa fa-arrow-circle-left"></i>&nbsp;Back
					</a>
				</div>
			</div>
		</div>

		<div class="main-card mt-3 mb-3 card">
			<div class="card-body">
				<form id="releaseNoteAdminForm" action="javascript:void(0);">
					<div class="row">
						<div class="col-md-4 col-sm-6 col-12">
							<div class="form-group">
								<label>Version Label</label>
								<input type="text" class="form-control" id="rnVersionLabel" maxlength="100" autocomplete="off" placeholder="e.g. v60.1.0" />
							</div>
						</div>
						<div class="col-md-8 col-sm-6 col-12">
							<div class="form-group">
								<label>Release Title<sup class="text-danger">*</sup></label>
								<input type="text" class="form-control" id="rnTitle" maxlength="250" autocomplete="off" placeholder="Enter release note title" />
							</div>
						</div>
					</div>

					<div class="row">
						<div class="col-md-12 col-12">
							<div class="form-group">
								<label>Impact Module (comma separated)<sup class="text-danger">*</sup></label>
								<input type="text" class="form-control" id="rnImpactModules" maxlength="500" autocomplete="off" placeholder="Example: Admissions, Attendance, Report Card" />
							</div>
						</div>
					</div>

					<div class="row">
						<div class="col-md-12 col-12">
							<div class="form-group">
								<label>Target Roles<sup class="text-danger">*</sup></label>
								<div id="rnTargetRolesContainer" class="bg-white">Loading roles...</div>
								<small class="form-text text-muted">Only selected roles will see this release note on dashboard and release note page.</small>
							</div>
						</div>
					</div>

					<div class="row">
						<div class="col-md-12 col-12">
							<div class="form-group">
								<label>Short Summary</label>
								<textarea class="form-control" rows="2" id="rnSummary" maxlength="1000" placeholder="Brief summary for listing preview"></textarea>
							</div>
						</div>
					</div>

					<div class="row">
						<div class="col-md-12 col-12">
							<div class="form-group">
								<label>Release Content<sup class="text-danger">*</sup></label>
								<textarea class="form-control" rows="8" id="releaseNoteContentEditor" placeholder="Describe updates, fixes and notes"></textarea>
							</div>
						</div>
					</div>

					<div class="row">
						<div class="col-md-12 col-12">
							<div class="form-group">
								<label>Attachments (Image/PDF/Video/File)</label>
								<div class="card border-0 shadow-sm mb-3">
									<div class="card-body p-3 p-md-4">
										<div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between">
											<div class="mb-3 mb-md-0 pr-md-3">
												<div class="font-weight-semi-bold mb-1">Upload release assets</div>
												<div class="text-muted small">Images, PDFs, videos and supporting files can be attached here.</div>
											</div>
											<div class="d-flex flex-column flex-sm-row align-items-sm-center">
												<input type="file" id="rnAttachmentInput" multiple class="form-control-file mr-sm-3 mb-2 mb-sm-0" accept=".png,.jpg,.jpeg,.gif,.webp,.bmp,.pdf,.mp4,.mov,.avi,.mkv,.webm,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip" />
												<button class="btn btn-primary px-4" type="button" onclick="releaseNoteEditorUpload()">
													<i class="fa fa-upload"></i>&nbsp;Upload
												</button>
											</div>
										</div>
										<small class="form-text text-muted mt-3 mb-0">Select from the left list and preview on the right panel.</small>
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-lg-4 col-md-5 mb-2">
									<div class="card mb-0 h-100 border-0 shadow-sm">
										<div class="card-body p-3">
											<div class="d-flex justify-content-between align-items-center mb-3">
												<div class="font-weight-semi-bold">Attachment List</div>
												<span class="badge badge-light" id="rnAttachmentCountBadge">0</span>
											</div>
											<div id="rnAttachmentList" class="border rounded p-2" style="min-height: 220px; background:#f8fbff;">No attachment uploaded.</div>
										</div>
									</div>
								</div>
								<div class="col-lg-8 col-md-7 mb-2">
									<div class="card mb-0 h-100 border-0 shadow-sm">
										<div class="card-body p-3">
											<div id="rnAttachmentPreviewTitle" class="font-weight-semi-bold text-muted mb-3">No attachment selected.</div>
											<div id="rnAttachmentPreviewBody" class="border rounded p-2" style="min-height: 220px; background:#fcfdff;">
												<div class="text-muted">Upload and click Preview to view attachment here.</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div class="row mt-3">
						<div class="col-md-12 text-right">
							<button class="btn btn-outline-secondary mr-2" type="button" onclick="releaseNoteEditorReset()">
								<i class="fa fa-undo"></i>&nbsp;Reset
							</button>
							<button class="btn btn-warning mr-2" type="button" onclick="releaseNoteEditorSaveDraft()">
								<i class="fa fa-save"></i>&nbsp;Save Draft
							</button>
							<button class="btn btn-success" type="button" onclick="releaseNoteEditorPublish()">
								<i class="fa fa-paper-plane"></i>&nbsp;Publish
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>`;
}

function getReleaseNoteUserListContent(title) {
	return `
		<div class="app-page-title mb-3 py-2">
			<div class="page-title-wrapper">
				<div class="page-title-heading">
					<div class="page-title-icon"><i class="fa fa-newspaper-o text-primary"></i></div>
					<div>
						${releaseNoteContentEsc(title || "Release Notes")}
						<span id="rnUserNewCountBadge" class="badge badge-danger ml-2" style="display:none;">0 NEW</span>
					</div>
				</div>
				<div class="page-title-actions">
					<button type="button" class="btn btn-outline-secondary mr-2" onclick="releaseNoteUserBack()">
						<i class="fa fa-arrow-left"></i>&nbsp;Back
					</button>
					<button type="button" class="btn btn-outline-primary" onclick="releaseNoteUserRefresh()">
						<i class="fa fa-refresh"></i>&nbsp;Refresh
					</button>
				</div>
			</div>
		</div>

		<div class="main-card mt-2 mb-3 card">
			<div class="card-body" id="rnLatestContainer">
				<div class="text-muted">Loading latest release note...</div>
			</div>
		</div>

		<div class="main-card mt-2 mb-3 card">
			<div class="card-header">
				<div class="font-weight-bold">Past Releases</div>
			</div>
			<div class="card-body" id="rnPastContainer">
				<div class="text-muted">Loading past release notes...</div>
			</div>
		</div>

		<div class="modal fade" id="releaseNoteUserDetailModal" tabindex="-1" role="dialog" aria-hidden="true">
			<div class="modal-dialog modal-lg" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">Release Note Detail</h5>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body" id="rnUserDetailBody"></div>
					<div class="modal-footer">
						<button type="button" class="btn btn-outline-primary" data-dismiss="modal">
							<i class="fa fa-arrow-left"></i>&nbsp;Back
						</button>
					</div>
				</div>
			</div>
		</div>`;
}

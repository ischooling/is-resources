
function getEmailVerifyContent(title, newTheme) {
	var html = 
	`<div class="app-page-title mb-3 py-2">
		<div class="page-title-wrapper">
			<div class="page-title-heading">
				<div class="page-title-icon">
					<i class="fas fa-university text-primary"></i>
				</div>
				<div>${title}</div>
			</div>
			<div class="page-title-actions">
			</div>
		</div>
	</div>`;
	html += 
	`<div class="main-card mb-3 card">
		<div class="card-body">
			<div class="col-md-5 col-sm-12 col-12 mx-auto">
				<div class="form-group">
					<form id="emailVerifyForm" action="javascript:void(0);">
						<div class="full">
							<label class="text-primary font-weight-semi-bold font-size-lg justify-content-start mb-0">Enter Email</label>
							<div class="input-group">
								<input type="text" id="getVEmail" class="form-control" />
								<div class="input-group-append">
									<button class="input-group-text bg-success text-white" onclick="getEmailVerifyByEmail()">Search</button>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
			<div id="verificationDataTableWrapper"></div>
		</div>
	</div>`;
	return html;
}



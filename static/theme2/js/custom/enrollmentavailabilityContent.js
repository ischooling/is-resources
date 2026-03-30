function getEnrollmentAvailabilityContent() {
	return `
	<div class="px-2 pb-2">
				<div class="card rounded-10">
					<div class="card-header bg-white border-0 d-flex align-items-center justify-content-between flex-wrap rounded-top-left-10 rounded-top-right-10 px-3 py-2">
						<div class="d-flex align-items-center flex-wrap mt-2 mt-md-0">
							<div class="btn-group mr-2 mb-2 mb-md-0" role="group" aria-label="Saved records view toggle">
								<button type="button" class="btn btn-white border btn-sm rounded-10 ml-2 d-none" id="enrAvailSavedViewTable">Table</button>
							</div>
							<button type="button" class="btn btn-primary btn-shadow btn-sm rounded-10 mr-2 mb-2 mb-md-0" id="enrAvailViewBtn"><i class="fa fa-bar-chart mr-2"></i>View Enrollment Availability</button>
						</div>
					</div>
					<div class="card-body pt-3 pb-2 px-3">
							<div id="enrAvailSavedSummary" class="border rounded-10 bg-white p-3">
								<div class="d-flex align-items-end flex-nowrap mb-3" style="gap:10px;">
									<select id="enrAvailS_FCountry" class="form-control form-control-sm rounded-10" style="min-width:0;flex:1 1 0;width:1%;"></select>
									<select id="enrAvailS_FProgram" class="form-control form-control-sm rounded-10" style="min-width:0;flex:1 1 0;width:1%;"></select>
									<select id="enrAvailS_FGrade" class="form-control form-control-sm rounded-10" style="min-width:0;flex:1 1 0;width:1%;"></select>
									
									<button type="button" class="btn btn-primary btn-shadow btn-sm rounded-10" id="enrAvailS_Load" style="flex:0 0 auto;">Check</button>
									<button type="button" class="btn btn-outline-secondary btn-sm rounded-10" id="enrAvailS_Clear" style="flex:0 0 auto;">Clear</button>
									<span class="badge badge-pill bg-light-primary text-primary" id="enrAvailS_Count" style="flex:0 0 auto; text-transform:none;"></span>
								</div>

							<div id="enrAvailSummaryEditor" class="mb-3">
								<div class="text-muted text-center py-4" id="enrAvailLazyHint">Select a Country and click Check</div>
							</div>
									<div class="card border rounded-10 h-100">
										<div class="card-body p-3">
										<div class="d-flex align-items-center justify-content-between mb-2">
											<div class="font-weight-bold text-dark">Data</div>
										</div>
										<div id="enrAvailSumByGrade" class="text-muted font-12">No records yet</div>
										<div id="enrAvailSumByGradeDrill" class="mt-3"></div>
										</div>
									</div>
						</div>

						<div id="enrAvailSavedTable" class="d-none">
							<div class="table-responsive">
								<table class="table table-borderless table-hover mb-0">
									<thead class="border-bottom">
										<tr>
											<th class="text-muted font-12 text-uppercase border-0 py-2 px-2" style="width:32px;">
												<input type="checkbox" id="enrAvailSelAll" />
											</th>
											<th class="text-muted font-12 text-uppercase border-0 py-2 px-2">#</th>
											<th class="text-muted font-12 text-uppercase border-0 py-2 px-2">Country</th>
											<th class="text-muted font-12 text-uppercase border-0 py-2 px-2">Program</th>
											<th class="text-muted font-12 text-uppercase border-0 py-2 px-2">Grade</th>
											<th class="text-muted font-12 text-uppercase border-0 py-2 px-2">Capacity</th>
											<th class="text-muted font-12 text-uppercase border-0 py-2 px-2">Confirm</th>
											<th class="text-muted font-12 text-uppercase border-0 py-2 px-2">Remaining</th>
											<th class="text-muted font-12 text-uppercase border-0 py-2 px-2">About to book</th>
											<th class="text-muted font-12 text-uppercase border-0 py-2 px-2">Fill %</th>
											<th class="text-muted font-12 text-uppercase border-0 py-2 px-2 text-right">Actions</th>
										</tr>
									</thead>
									<tbody id="enrAvailTblBody">
										<tr><td colspan="11" class="text-center text-muted py-4">No records yet</td></tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>

		<div id="enrAvailPageView" class="d-none">
			<div id="enrAvailCountryGrid" class="text-muted text-center py-4">No records - go to Entry tab and save some data</div>
		</div>
	</div>
	`;
}

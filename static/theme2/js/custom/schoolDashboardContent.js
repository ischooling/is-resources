
var active_student=0;
async function renderSchoolDashboard(title, roleAndModule, SCHOOL_ID, USER_ID,USER_ROLE){
  	var objRight= await getShoolDashboardData(roleAndModule.moduleId, USER_ID);
	var objectRights=objRight.objectRights;
	OBJECT_RIGHTS=objectRights;
	var userCountList= await getSchoolUserCountData();
	//console.log(OBJECT_RIGHTS);
	// ROLE_MODULE=roleAndModule;
	
	$('#dashboardContentInHTML').html(getSchoolDashboardContent(title, userCountList.userCountList));
	getStudentYearChartData('student-year-chart');
	getStudentGradeChartData('student-grade-chart');
	
}

function getSchoolDashboardContent(title, userCountList){
	// <select	name="dashboardAcadmicYear" id="dashboardAcadmicYear" class="form-control" ></select>
	var html=
	`<div class="app-page-title mb-3 py-2">
		<div class="page-title-wrapper">
			<div class="page-title-heading">
				<div class="page-title-icon">
					<i class="fas fa-university text-primary"></i>
				</div>
				<div>${title}</div>
			</div>
			<div class="page-title-actions"></div>
		</div>
	</div>
	<div class="row">`
		+getUserCountHtml(userCountList)
	html+=`</div>`;
	html+=getCurrentUserCountHTML();
	html+=getSchoolDashboardContent2();
	
	return html;
}

function getUserCountHtml(userCountList){
var html=''
	if(userCountList.length>0){
		for (let u = 0; u < userCountList.length; u++) {
			const userCount = userCountList[u];
			active_student=userCount.activeStudent
			var bgcolor='bg-bluewise';
			if(userCount.roleName=='STUDENT'){
				html+=`<div class="col-md-6 col-sm-6 col-lg-3">
						<div class="mb-3 text-left card rounded bg-bluewise">
							<div class="card-body p-3">
								<div class="d-flex flex-row align-items-center font-size-md">
									<div class="icon-wrapper rounded m-0">
										<div class="icon-wrapper-bg bg-info"></div>
										<i class="lnr-graduation-hat text-info"></i>
									</div>
									<div class="ml-3">
										<p class="mb-0 text-dark font-weight-semi-bold"> Total Student | Active Student </p>
										<h4 class="mb-0 bold text-dark">${userCount.student} | ${userCount.activeStudent}</h4>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="col-md-6 col-sm-6 col-lg-3">
						<div class="mb-3 text-left card rounded bg-dangerwish">
							<div class="card-body p-3">
								<div class="d-flex flex-row align-items-center font-size-md">
									<div class="icon-wrapper rounded m-0">
										<div class="icon-wrapper-bg bg-danger"></div>
										<i class="pe-7s-back-2 text-danger"></i>
									</div>
									<div class="ml-3">
										<p class="mb-0 text-dark font-weight-semi-bold">Total Withdrawn</p>
										<h4 class="mb-0 bold text-dark">${userCount.withdraw}</h4>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="col-md-6 col-sm-6 col-lg-3">
						<div class="mb-3 text-left card rounded-10 bg-yellowish">
							<div class="card-body p-3">
								<div class="d-flex flex-row align-items-center font-size-md">
									<div class="icon-wrapper rounded m-0">
										<div class="icon-wrapper-bg bg-warning"></div>
										<i class="lnr-user text-warning"></i>
									</div>
									<div class="ml-3">
										<p class="mb-0 text-dark font-weight-semi-bold">Total Parent</p>
										<h4 class="mb-0 bold text-dark">${userCount.usercount}</h4>
									</div>
								</div>
							</div>
						</div>
					</div>`;
			}else if(userCount.roleName=='TEACHER'){
				html+=`<div class="col-md-6 col-sm-6 col-lg-3">
					<div class="mb-3 text-left card rounded-10 bg-orangewise">
						<div class="card-body p-3">
							<div class="d-flex flex-row align-items-center font-size-md">
								<div class="icon-wrapper rounded m-0">
									<div class="icon-wrapper-bg bg-orangewise-dark"></div>
									<i class="lnr-users text-orangewise-dark"></i>
								</div>
								<div class="ml-3">
									<p class="mb-0 text-dark font-weight-semi-bold">Total Teacher</p>
									<h4 class="mb-0 bold text-dark">${userCount.usercount}</h4>
								</div>
							</div>
						</div>
					</div>
				</div>`;
			}
		}
	}
	return html;
}

function getCurrentUserCountHTML(){
	var html='';
	html+=`<div class="main-card mb-3 card">
			<div class="no-gutters row">
				<div class="col-md-3">
					<div class="pt-0 pb-0 card-body">
						<ul class="list-group list-group-flush border-right">
							<li class="list-group-item">
								<div class="widget-content p-0">
									<div class="widget-content-outer">
										<div class="widget-content-wrapper">
											<div class="widget-content-left">
												<div class="widget-heading">Total Enrollment</div>
												<div class="widget-subheading">Current year</div>
											</div>
											<div class="widget-content-right">
												<div class="widget-numbers text-primary" id="totalCurrentYear">0</div>
											</div>
										</div>
									</div>
								</div>
							</li>
							
						</ul>
					</div>
				</div>
				<div class="col-md-3">
					<div class="pt-0 pb-0 card-body">
						<ul class="list-group list-group-flush border-right">
							<li class="list-group-item">
								<div class="widget-content p-0">
									<div class="widget-content-outer">
										<div class="widget-content-wrapper">
											<div class="widget-content-left">
												<div class="widget-heading">Fresh Enrollment</div>
												<div class="widget-subheading">Current year</div>
											</div>
											<div class="widget-content-right">
												<div class="widget-numbers text-success" id="freshCurrentYear">0</div>
											</div>
										</div>
									</div>
								</div>
							</li>
							
						</ul>
					</div>
				</div>
				<div class="col-md-3">
					<div class="pt-0 pb-0 card-body">
						<ul class="list-group list-group-flush border-right">
							<li class="list-group-item">
								<div class="widget-content p-0">
									<div class="widget-content-outer">
										<div class="widget-content-wrapper">
											<div class="widget-content-left">
												<div class="widget-heading">Re-Enrollment</div>
												<div class="widget-subheading">Current year</div>
											</div>
											<div class="widget-content-right">
												<div class="widget-numbers text-warning" id="reEnrollCurrentYear">0</div>
											</div>
										</div>
									</div>
								</div>
							</li>
							
						</ul>
					</div>
				</div>
				<div class="col-md-3">
					<div class="pt-0 pb-0 card-body">
						<ul class="list-group list-group-flush ">
							<li class="list-group-item">
								<div class="widget-content p-0">
									<div class="widget-content-outer">
										<div class="widget-content-wrapper">
											<div class="widget-content-left">
												<div class="widget-heading">Withdrawn</div>
												<div class="widget-subheading">Current year</div>
											</div>
											<div class="widget-content-right">
												<div class="widget-numbers text-danger" id="withdrawnCurrentYear">0</div>
											</div>
										</div>
									</div>
								</div>
							</li>
							
						</ul>
					</div>
				</div>
			</div>
		</div>`;
		return html;
}

function getSchoolDashboardContent2(){
	var html=`
		<div class="row">
			<div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
				<div class="mb-3 card">
					<div class="card-body">
						
						<div id="student-year-chart"></div>
					</div>
				</div>
			</div>
			<div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
				<div class="mb-3 card">
					<div class="card-body pb-1">
						<div id="student-grade-chart"></div>
					</div>
				</div>
			</div>
		</div>`;
return html;
}
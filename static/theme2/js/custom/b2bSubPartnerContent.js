async function renderB2BSubPartnerContent(title, roleAndModule, SCHOOL_ID, USER_ID,USER_ROLE){
	// var subPartList =[
	// 	{"partnerName":"Bhagat Singh","email":"web@seriindia.org","mobileNo":"741852963","country":"India","state":"Delhi", "city":"New Delhi","locationPartnerType":"Country Partner","timezone":"(UTC-11:00)-American Samao/Pago Pago"}
	// ]
	var payload = {};
    payload['userId'] = USER_ID;
    responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'get-all-subpartner-by-user-id',payload,'');
	console.log(responseData)
	$('#dashboardContentInHTML').html(getB2BSubPartnerContent(title, responseData));
	if($("#counselorCommissionRateLogs").length>0){
		$("#counselorCommissionRateLogs").remove();
	}
	if($("#addB2BSubPartnerModal").length>0){
		$("#addB2BSubPartnerModal").remove();
	}
	$("body").append(getAddB2BSubPartnerModal(responseData.coutryPartnerType));
	B2BSubPartnerPageEvent('B2BSubPartnerSaveForm');
}

function getB2BSubPartnerContent(title, subPartList){
	var html=
	`<div class="app-page-title mb-3 py-2">
		<div class="page-title-wrapper d-flex justify-content-between align-items-center">
			<div class="page-title-heading">
			  <div class="page-title-icon"><img src="${PATH_FOLDER_IMAGE2}/Icon/sidebar/Buy_Extra_Classes.png" style="max-width:200px; width: 90%; margin-right: auto; display: flex;"></i></div>
				<div>
					<span class="text-primary welcome-name-text">${title}</span>
				</div>
			</div>
			<div class="page-title-actions">
				<button onclick="addB2BSubPartner(\'B2BSubPartnerSaveForm\');" class="btn btn-sm btn-primary"><i class="fa fa-plus"></i>&nbsp;Add Sub Partner</button>
			</div>
		</div>
	</div>`;
	html+=getB2BSubPartnerListCard(subPartList)
	return html;
}
function getB2BSubPartnerListCard(subPartList){
	var html=
	`<div class="main-card mb-3">
		<div class="mb-3 card border rounded-10">
			<div class="card-body">
				<div class="full table-responsive">`
					+getB2BSubPartnerListTable(subPartList)
				html+=`</div>
			</div>
		</div>
	</div>`;
	return html;
}

function getB2BSubPartnerListTable(subPartList){
	var html=
	`<table id="B2BSubPartnerListTable" class="table table-bordered font-12 border-radius-table">`
		+getB2BSubPartnerListTableHead()
		html+=`<tbody id="B2BSubPartnerListTableBody">${getB2BSubPartnerListTableBody(subPartList)}</tbody>
	</table>`;
	return html;
}
function getB2BSubPartnerListTableHead(){
	var html=
	`<thead>
		<tr>
			<th class="bg-primary text-white bold rounded-top-left-10 border-bottom-0 border-primary">Sr. No.</th>
			<th class="bg-primary text-white bold border-bottom-0">Partner Name</th>
			<th class="bg-primary text-white bold border-bottom-0">Email</th>
			<th class="bg-primary text-white bold border-bottom-0">Mobile No.</th>
			<th class="bg-primary text-white bold border-bottom-0">Country | State | City</th>
			<th class="bg-primary text-white bold border-bottom-0">Location Partner Type</th>
			<th class="bg-primary text-white bold border-bottom-0">Timezone</th>
			<th class="bg-primary text-white bold border-bottom-0 rounded-top-right-10">Action</th>
		</tr>
	</thead>`;
	return html;
}

function getB2BSubPartnerListTableBody(subPartList){
	var html=``;
	$.each(subPartList.partnerList, function(i,v){
		html+=
		`<tr>
			<td>${i+1}</td>
			<td>${v.name}</td>
			<td>${v.email}</td>
			<td>${v.mobileNo}</td>
			<td>${v.country} | ${v.state} | ${v.city}</td>
			<td>${v.partnerType}</td>
			<td>${v.timeZone}</td>
			<td>
				<a href="javascript:void(0)" onclick="getSubPartnerLeadById(\'B2BSubPartnerSaveForm\',\'${v.leadId}\',\'addB2BSubPartnerModal\')">
					<i class="fa fa-edit"></i>
				</a>
			</td>
		</tr>`;
	});
	return html;
}


function getAddB2BSubPartnerModal(coutryPartnerType){
	var html=`
		<div id="addB2BSubPartnerModal" class="modal right-slide-modal fade" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-xl">
			<div class="modal-content border-0">
				<div class="modal-header py-2 h-auto text-white">
					<h5 class="text-white modal-title">Add Sub Partner</h5>
					<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body p-0 overflow-auto">
					<div class="col-xl-7 col-lg-8 col-md-11 col-sm-12 col-12 mx-auto py-4">
						<div class="p-1 bg-light-primary border border-primary rounded-10 card">
							<form class="col-12 mt-2 mb-2" method="post" id="B2BSubPartnerSaveForm" action="javascript:void(0);">
								<input type="hidden" name="B2BSubPartnerIsdCode" id="B2BSubPartnerIsdCode" value="1" />
								<input type="hidden" name="B2BSubPartnerPCountryCode" id="B2BSubPartnerPCountryCode" value="us" />
								<input type="hidden" name="leadSource" id="leadSource" value="26" />
								<input type="hidden" name="leadStatus" id="leadStatus" value="Converted & On Boarding | Hot" />
								<input type="hidden" name="leadAssignTo" id="leadAssignTo" value="${USER_ID}" />
								<input type="hidden" name="leadId" id="leadId" value="${USER_ID}" />
								<input type="hidden" name="rawLeadId" id="rawLeadId" value="${USER_ID}" />
								<div class="row">
									<div class="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12 mb-2">
										<label class="m-0">First Name<sup class="text-danger">*</sup></label>
										<input type="text" class="form-control" name="B2BSubPartnerName" id="B2BSubPartnerName" required/>
									</div>
									<div class="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12 mb-2">
										<label class="m-0">Middle Name</label>
										<input type="text" class="form-control" name="B2BSubPartnerMName" id="B2BSubPartnerMName">
									</div>
									<div class="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12 mb-2">
										<label class="m-0">Last Name<sup class="text-danger">*</sup></label>
										<input type="text" class="form-control" name="B2BSubPartnerLName" id="B2BSubPartnerLName" required/>
									</div>
									<div class="col-12 mb-2">
										<label class="m-0">Email<sup class="text-danger">*</sup></label>
										<input type="text" class="form-control" name="B2BSubPartnerEmail" id="B2BSubPartnerEmail" onkeydown="return M.isEmail(event);" required/>
									</div>
									<div class="col-12 mb-2">
										<label class="m-0">Mobile No.<sup class="text-danger">*</sup></label>
										<input type="text" name="B2BSubPartnerPhoneNo" id="B2BSubPartnerPhoneNo" class="form-control" value="" maxlength="15" onkeydown="return M.digit(event);" required/>
									</div>
									<div class="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12 mb-2">
										<label class="m-0">Country<sup class="text-danger">*</sup></label>
										<select name="countryId" id="countryId" class="form-control" required>
											<option value="0">Select country</option>
										</select>
									</div>
									<div class="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12 mb-2">
										<label class="m-0">State<sup class="text-danger">*</sup></label>
										<select name="stateId" id="stateId" class="form-control" required disabled>
											<option value="0">Select State/Province*</option>
										</select>
									</div>
									<div class="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12 mb-2">
										<label class="m-0">City<sup class="text-danger">*</sup></label>
										<select name="cityId" id="cityId" class="form-control" required disabled>
											<option value="0">Select City*</option>
										</select>
									</div>
									<div class="col-12 mb-2">
										<label class="m-0">Location Partner Type<sup class="text-danger">*</sup></label>
										<select name="B2BSubPartnerType" id="B2BSubPartnerType" class="form-control" required>
											${getPartnetTypeOptions(coutryPartnerType)}
										</select>
									</div>
									<div class="col-12 mb-2">
										<label class="m-0">Timezone<sup class="text-danger">*</sup></label>
										<select name="countryTimezoneId" id="countryTimezoneId" class="form-control" required></select>
									</div>
									<div class="col-12 mb-2">
										<label class="m-0">Default Setting (For Commission or Fee)</label>
										<select name="B2BSubPartnerCommission" id="B2BSubPartnerCommission" class="form-control" disabled>
											<option value="">Select option</option>
											<option value="sameAsPartner" selected>Same as Patner</option>
										</select>
									</div>
									<div class="col-12 text-right mt-2">
										<button type="button" class="btn btn-success float-right pr-4 pl-4" id="saveSubPartnerBtn" onclick="saveB2BSubPartnerDetails(\'B2BSubPartnerSaveForm\', \'B2B\')">Create</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>`;
	return html;
}

function getPartnetTypeOptions(coutryPartnerType){
	var html=
	`<option value="">Select partner type</option>
	<option value="1">Country Partner</option>
	<option value="2">State Partner</option>
	<option value="3">City Partner</option>`;
	if(coutryPartnerType == "2"){
		html=
		`<option value="">Select partner type</option>
		<option value="2">State Partner</option>
		<option value="3">City Partner</option>`;
	}else if(coutryPartnerType == "3"){
		html=
		`<option value="">Select partner type</option>
		<option value="3">City Partner</option>`;
	}
	return html;
}
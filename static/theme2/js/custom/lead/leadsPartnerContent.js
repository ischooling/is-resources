function renderPartnerCotent(partnerTypeId){
	$("#LeadPartnerUserFormB2BPopup").html(createPartnerAndSetCommissionModal(partnerTypeId));
	$('#saveCommissionRateForm #learningProgram').val('ONE_TO_ONE');
	$('#filterCommissionRate #learningProgramFilter').val('ONE_TO_ONE');
	$("#learningProgram").select2({
		theme:"bootstrap4",
		dropdownParent: "#leadPartnerUserB2B"
	});
	getGradesByLearningProgram('saveCommissionRateForm','learningProgram','standardId','leadPartnerUserB2B');
	$("#standardId").select2({
		theme:"bootstrap4",
		dropdownParent: "#leadPartnerUserB2B"
	});
	$("#learningProgramFilter").select2({
		theme:"bootstrap4",
		dropdownParent: "#leadPartnerUserB2B"
	});
	getGradesByLearningProgram('filterCommissionRate','learningProgramFilter','standardIdFilter','leadPartnerUserB2B');
	$("#standardIdFilter").select2({
		theme:"bootstrap4",
		dropdownParent: "#leadPartnerUserB2B"
	});
	$(".datepicker").datepicker({
		startDate: new Date(),
		format : 'M dd, yyyy',
		autoclose: true,
	});
	$("#originalTimezone").select2({
		theme:"bootstrap4",
		dropdownParent: "#leadPartnerUserB2B"
	});
	callPCountries('partnerUserB2BSaveForm', 0, 'countryId');
	getPartnerTypeList('partnerUserB2BSaveForm',0,'partnerType','');
	$("#createUserB2B").on('click', function(){
		savePatnerWithReferralCode('partnerUserB2BSaveForm','leadPartnerUserB2B');
	});
	getAllTimeZoneForPartner('originalTimezone');

	$("#learningProgram").val('A').trigger('change');
	$("#learningProgramFilter").val('A').trigger('change');
	$('#setCommissionRateTab').on('click', function() {
		$('#setCommissionRate .tab-content #addForm').addClass('active');
		setTimeout(function(){
			$('#setCommissionRate ul.nav li:first-child a').addClass('active');
			$('#setCommissionRate ul.nav li:nth-child(2) a').removeClass('active');
		},100);
		$('#setDiscount, #filterBy, #createPartner').removeClass('active');
	});
	$('#createPartnerTab').on('click', function() {
		$('#setCommissionRate .tab-content #addForm').addClass('active');
		setTimeout(function(){
			$('#setCommissionRate ul.nav li:first-child a').addClass('active');
			$('#setCommissionRate ul.nav li:nth-child(2) a').removeClass('active');
		},100);
		$('#setCommissionRate, #filterBy, #setDiscount').removeClass('active');
	});
	$('#setDiscountTab').on('click', function() {
		$('#setCommissionRate .tab-content #addForm').addClass('active');
		setTimeout(function(){
			$('#setCommissionRate ul.nav li:first-child a').addClass('active');
			$('#setCommissionRate ul.nav li:nth-child(2) a').removeClass('active');
		},100);
		$('#setCommissionRate, #filterBy, #createPartner').removeClass('active');
		getDiscountRate('saveDiscountRateForm');
	});

	
}

function createPartnerAndSetCommissionModal(partnerTypeId){
	var headTitle="Create Partner";
	var buttonTitle="Create";
	if(partnerTypeId!=null && partnerTypeId>0){
		headTitle="Update Partner";
		buttonTitle="Update";
	}
	var html =
		'<div id="leadPartnerUserB2B" class="modal right-slide-modal fade" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" data-backdrop="static">'
			+'<div class="modal-dialog modal-xl">'
				+'<div class="modal-content border-0">'
					+'<div class="modal-header py-0 text-white card-header card-header-tabe">'
						+'<ul class="nav" style="height: min-content;">'
							+'<li class="nav-item"><a data-toggle="tab" href="#createPartner" id="createPartnerTab" class="nav-link active">'+headTitle+'</a></li>'
							+'<li class="nav-item"><a data-toggle="tab" href="#setCommissionRate" id="setCommissionRateTab" class="nav-link" style="display:none">Set Commission Rate</a></li>'
							+'<li class="nav-item"><a data-toggle="tab" href="#setDiscount" id="setDiscountTab" class="nav-link" style="display:none">Set Discount</a></li>'
						+'</ul>'
						+'<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">'
							+'<span aria-hidden="true">×</span>'
						+'</button>'
					+'</div>'
					+'<div class="modal-body p-0 overflow-auto">'
						+'<div class="tab-content">'
							+getCreatePartnerContent(buttonTitle)
							+getSetCommissionRateContent()
							+getSetDiscountContent()
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>';
		html+=commissionRateLogsContentModal();
	return html;
}

function commissionRateLogsContentModal(partnerTypeId){
	var headTitle="Commission Rate Logs";
	var html =
		'<div id="commissionRateLogs" class="modal right-slide-modal fade" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">'
			+'<div class="modal-dialog modal-xl">'
				+'<div class="modal-content border-0">'
					+'<div class="modal-header py-0 text-white card-header card-header-tabe">'
						+'<h5 class="text-dark modal-title">'+headTitle+'</h5>'
						+'<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">'
							+'<span aria-hidden="true">×</span>'
						+'</button>'
					+'</div>'
					+'<div class="modal-body overflow-auto">'
						+'<div class="full table-responsive">'
							+'<table class="table table-bordered font-12 table-striped border-radius-table" id="commissionRateLogsTable">'
								+'<thead class="bg-primary">'
									+'<tr>'
									+'<th class="text-white bold rounded-top-left-10 border-bottom-0 border-primary" style="border-top-color:transparent;border-right-color:#fff !important">S.No.</th>'
									+'<th class="text-white bold border-bottom-0">Grade</th>'
									+'<th class="text-white bold border-bottom-0 text-center">Learning Program</th>'
									+'<th class="text-white bold border-bottom-0 text-center" style="width: 270px;">Commission - Lead Provided By Partner</th>'
									+'<th class="text-white bold border-bottom-0 text-center" style="width: 270px;">Commission - Lead Provided By Is</th>'
									+'<th class="text-white bold border-bottom-0 text-center">Applicable From</th>'
									+'<th class="text-white bold border-bottom-0 text-center">Applicable Till</th>'
									+'<th class="text-white bold border-bottom-0 text-center">Update By</th>'
									+'<th class="text-white bold border-bottom-0 rounded-top-right-10" style="border-top-color:transparent;border-right-color:transparent">Update At</th>'
									+'</tr>'
								+'<thead>'
								+'<tbody class="last-tr-fist-and-last-td-rounded">'
								+'</tbody>'
							+'</table>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>'
	return html;
}

function getCreatePartnerContent(buttonTitle){
	var html =
		'<div class="tab-pane active p-4" id="createPartner" role="tabpanel">'
			+'<div class="p-1 bg-light-primary border border-primary rounded-10 card">'
				+'<form class="col-12 mt-2 mb-2" method="post" id="partnerUserB2BSaveForm" action="javascript:void(0);">'
					+'<input type="hidden" name="leadId" id="leadId" value="0" />'
					+'<input type="hidden" name="rawLeadId" id="rawLeadId" value="0" />'
					+'<input type="hidden" name="leadType" id="leadType" value="B2B" />'
					+'<input type="hidden" name="isdCode" id="isdCode" value="" />'
					+'<input type="hidden" name="pCountryCode" id="pCountryCode" value="" />'
					+'<div class="row">'
						+'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2">'
							+'<label class="m-0">First Name</label>'
							+'<input type="text" name="fname" id="fname" value=""   class="form-control" maxlength="100" disabled>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2">'
							+'<label class="m-0">Middle Name</label>'
							+'<input type="text" name="mname" id="mname" value=""  class="form-control" maxlength="100" disabled>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2">'
							+'<label class="m-0">Last Name</label>'
							+'<input type="text" name="lname" id="lname" value=""  class="form-control" maxlength="100" disabled>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2">'
							+'<label class="m-0">Email</label>'
							+'<input type="email" name="email" id="email" class="form-control" value="" disabled>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2">'
							+'<label>Phone No.<sup class="text-danger">*</sup></label> '
							+'<input type="text" name="phoneNo" id="phoneNo" class="form-control" value="" maxlength="15" disabled />'
						+'</div>'
						+'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2">'
							+'<label class="m-0">Country</label>'
							+'<select name="countryId" id="countryId" class="form-control" disabled></select>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2">'
							+'<label class="m-0">State<sup class="text-danger">*</sup></label>'
							+'<select name="stateId" id="stateId" class="form-control" disabled></select>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2">'
							+'<label class="m-0">City</label>'
							+'<select name="cityId" id="cityId" class="form-control" disabled></select>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2">'
							+'<label class="m-0">Location Partner Type</label>'
							+'<select name="partnerType" id="partnerType" class="form-control"></select>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2">'
							+'<label class="m-0">Partner Type</label>'
							+'<select name="originalPartnerType" id="originalPartnerType" class="form-control">'
								+'<option value="">Select Partner Type</option>'
								+'<option value="GP">General Partner</option>'
								+'<option value="WLP">Self School or Academy</option>'
							+'</select>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2">'
							+'<label class="m-0">TimeZone</label>'
							+'<select name="originalTimezone" id="originalTimezone" class="form-control">'
								+'<option value="">Select Timezone</option>'
							+'</select>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2">'
							+'<label class="m-0">Commision Payout</label>'
							+'<select name="commissionPayout" id="commissionPayout" class="form-control">'
								+'<option value="SWP">'+SCHOOL_NAME+' will be paying commission to Partner</option>'
								+'<option value="PWP">Partner will be paying '+SCHOOL_NAME+'</option>'
							+'</select>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2">'
							+'<label class="m-0">White Label</label>'
							+'<select name="whiteLabel" id="whiteLabel" class="form-control">'
								+'<option value="NWL">No white - labeling '+SCHOOL_NAME+' Colors and Logor</option>'
								+'<option value="WLWC">With White Label Custom Colors and Logo</option>'
							+'</select>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2">'
							+'<label class="m-0">Enrolling Students</label>'
							+'<select name="enrollingStudent" id="enrollingStudent" class="form-control">'
								+'<option value="OWN">For their own school or academy</option>'
								+'<option value="FIS">For '+SCHOOL_NAME+'</option>'
							+'</select>'
						+'</div>'
						+'<div class="col-12 text-right">'
							+'<button type="button" class="btn btn-success btn-shadow float-right pr-4 pl-4" id="createUserB2B">'+buttonTitle+'</button>'
						+'</div>'
					+'</div>    '
				+'</form>'
			+'</div>'
		+'</div>'
	return html;
}

function getSetCommissionRateContent(){
	var html = 
		'<div class="tab-pane" id="setCommissionRate" role="tabpanel" style="display:none">'
			+'<div class="card-header card-header-tabe">'
				+'<ul class="nav">'
					+'<li class="nav-item"><a data-toggle="tab" href="#addForm" class="nav-link active">Add Commission</a></li>'
					+'<li class="nav-item"><a data-toggle="tab" href="#filterBy" class="nav-link">Filter By</a></li>'
				+'</ul>'
			+'</div>'
			+'<div class="tab-content p-4">'
				+getAddFormContent()
				+getFilterByContent()
			+'</div>'
		+'</div>';
	return html;
}

function getAddFormContent(){
	var html = 
		'<div class="tab-pane active p-1 bg-light-primary border border-primary rounded-10 card" id="addForm" role="tabpanel">'
			+'<div class="col-12 mt-2 mb-2">'
				+'<form id="saveCommissionRateForm" autocomplete="off" action="javascript:void(0);">'
					+'<div class="row">'
						+'<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12 mb-2 pr-0">'
							+'<label class="m-0">Lead Provided By Partner</label>'
							+'<div class="d-flex flex-wrap">'
								+'<div class="col-xl-9 col-lg-9 col-md-8 col-sm-12 col-12 mb-2 pl-0">'
									+'<select name="byPartnerType" id="byPartnerType" class="form-control">'
										+'<option value="P">Percentage</option>'
										+'<option value="F">Amount in USD without $ sign</option>'
									+'</select>'
								+'</div>'
								+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-12 col-12 mb-2 pl-0">'
									+'<input type="text" name="byPartnerValue" id="byPartnerValue" value="" onkeyup="getNum(this,\'\',\'byPartnerType\')" class="form-control">'
								+'</div>'
							+'</div>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12 mb-2 pr-0">'
							+'<label class="m-0">Lead Provided By IS</label>'
							+'<div class="d-flex flex-wrap">'
								+'<div class="col-xl-9 col-lg-9 col-md-8 col-sm-12 col-12 mb-2 pl-0">'
									+'<select name="bySchoolType" id="bySchoolType" class="form-control">'
										+'<option value="P">Percentage</option>'
										+'<option value="F">Amount in USD without $ sign</option>'
									+'</select>'
								+'</div>'
								+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-12 col-12 mb-2 pl-0">'
									+'<input type="text" name="bySchoolValue" id="bySchoolValue" value="" onkeyup="getNum(this,\'\',\'bySchoolType\')" class="form-control">'
								+'</div>'
							+'</div>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12 mb-2">'
							+'<label class="m-0">Select Learning Program</label>'
							+'<select name="learningProgram" id="learningProgram" class="form-control" onchange="getGradesByLearningProgram(\'saveCommissionRateForm\',\'learningProgram\',\'standardId\',\'leadPartnerUserB2B\')">'
								+'<option value="A" selected>All Program</option>'
								+getLearningProgramContent(SCHOOL_ID)
							+'</select>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12 mb-2">'
							+'<label class="m-0">Select Grade</label>'
							+'<select name="standardId" id="standardId" class="form-control" multiple="multiple">'
								// +'<option value="A" >ALL Grade</option>'
								// +getStandardContent(SCHOOL_ID,true)
							+'</select>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12 mb-2">'
							+'<label class="m-0">Enrollment Range</label>'
							+'<select name="enrollRange" id="enrollRange" class="form-control">'
								+'<option value="0">Select Range</option>'
								+'<option value="1-5" >1-5</option>'
								+'<option value="6-10" >6-10</option>'
								+'<option value="11-20" >11-20</option>'
								+'<option value="21-30" >21-30</option>'
								+'<option value="31-50" >31-50</option>'
								+'<option value="50-0" >50+</option>'
								
							+'</select>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12 mb-2">'
							+'<label class="m-0">Applicable From</label>'
							+'<input type="text" name="startDate" id="startDate" class="datepicker form-control">'
						+'</div>'
						// +'<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12 mb-2">'
						// 	+'<label class="m-0">Applicable Till</label>'
						// 	+'<input type="text" name="endDate" id="endDate" class="datepicker form-control">'
						// +'</div>'
						+'<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12 mb-2 text-left">'
							+'<label class="m-0 full">&nbsp;</label>'
							+'<a href="javascript:void(0)" onclick="saveCommissionRate(\'saveCommissionRateForm\')" class="btn btn-success mr-1 btn-shadow btn-lg">Add Commission</a>'
							+'<a href="javascript:void(0)" onclick="resetCommissionRate(\'saveCommissionRateForm\')" class="btn btn-primary btn-shadow btn-lg">Reset</a>'
						+'</div>'
					+'</div>'
				+'</form>'
			+'</div>'
		+'</div>'
	return html;
}

function getFilterByContent(){
	var html = 
		'<div class="tab-pane" id="filterBy" role="tabpanel">'
			+'<form id="filterCommissionRate" autocomplete="off" action="javascript:void(0);">'
				+'<div class="full p-1 bg-light-primary border border-primary rounded-10 card">'
					+'<div class="col-12 mt-2 mb-2">'
						+'<div class="row">'
							+'<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12 mb-2">'
								+'<label class="m-0">Select Learning Program</label>'
								+'<select name="learningProgramFilter" id="learningProgramFilter" class="form-control" onchange="getGradesByLearningProgram(\'filterCommissionRate\',\'learningProgramFilter\',\'standardIdFilter\',\'leadPartnerUserB2B\')">'
									+'<option value="">Select Learning Program</option>'
									+'<option value="A">All Program</option>'
									+getLearningProgramContent(SCHOOL_ID)
								+'</select>'
							+'</div>'
							+'<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12 mb-2">'
								+'<label class="m-0">Select Grade</label>'
								+'<select name="standardIdFilter" id="standardIdFilter" class="form-control" multiple="multiple">'
									// +'<option value="A">ALL Grade</option>'
									// +getStandardContent(SCHOOL_ID,true)
								+'</select>'
							+'</div>'
							+'<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12 mb-2 text-left">'
								+'<label class="m-0 full">&nbsp;</label>'
								+'<a href="javascript:void(0)" onclick="resetFilterByForm(\'filterCommissionRate\')" class="btn btn-primary mr-1">Reset</a>'
								+'<a href="javascript:void(0)" onclick="getCommissionRate(\'filterCommissionRate\')" class="btn btn-success">Find</a>'
							+'</div>'
						+'</div>'
					+'</div>'
				+'</div>'
				+'<div class="full text-right my-4">'
					+'<a href="javascript:void(0)" class="btn btn-primary bulkEditBtn" onclick="bulkEdit()" style="display:none">Bulk Edit</a>'
				+'</div>'
				+'<div class="full table-responsive">'
					+'<table class="table table-bordered font-12 border-radius-table text-center commissionTable" style="min-width:1380px;width:100%" id="commissionRateFilteredData">'
						+'<thead class="bg-primary">'
							+'<tr>'
								+'<th class="text-white bold rounded-top-left-10 border-bottom-0 border-primary" style="border-top-color:transparent;border-right-color:#fff !important">S.No.</th>'
								+'<th class="text-white bold border-bottom-0">Grade</th>'
								+'<th class="text-white bold border-bottom-0 text-center">Learning Program</th>'
								+'<th class="text-white bold border-bottom-0 text-center" style="width: 270px;">Commission - Lead Provided By Partner</th>'
								+'<th class="text-white bold border-bottom-0 text-center" style="width: 270px;">Commission - Lead Provided By Is</th>'
								+'<th class="text-white bold border-bottom-0 text-center">Enrollment Range</th>'
								+'<th class="text-white bold border-bottom-0 text-center">Applicable From</th>'
								+'<th class="text-white bold border-bottom-0 text-center">Applicable Till</th>'
								+'<th class="text-white bold border-bottom-0 rounded-top-right-10" style="border-top-color:transparent;border-right-color:transparent">Action</th>'
							+'</tr>'
						+'</thead>'
						+'<tbody class="last-tr-fist-and-last-td-rounded">'
						+'</tbody>'
					+'</table>'
					+'<div class="full text-right bulk-update-and-cancel-btn mb-4" style="display: none;">'
						+'<a href="javascript:void(0)" class="text-decoration-none btn btn-primary mr-2" onclick="cancelEitAllRow()">Cancel</a>'
						+'<a href="javascript:void(0)" class="text-decoration-none btn btn-success" onclick="updateCommissionRate(\'filterCommissionRate\',\'\')">Update</a>'
					+'</div>'
				+'</div>'
			+'</form>'
		+'</div>'
	return html;
}

function getSetDiscountContent(){
	var html =
		'<div class="tab-pane p-4" id="setDiscount" role="tabpanel" style="display:none">'
			+'<div class="p-1 bg-light-primary border border-primary rounded-10 card">'
				+'<form id="saveDiscountRateForm" class="col-12 mt-2 mb-2" method="post" action="javascript:void(0);">'
					+'<div class="row">'
						+'<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12 mb-2 pr-0">'
							+'<label class="m-0">Discount Type</label>'
							+'<div class="d-flex flex-wrap">'
								+'<div class="col-xl-9 col-lg-9 col-md-8 col-sm-12 col-12 mb-2 pl-0">'
									+'<select name="discountType" id="discountType" class="form-control">'
										+'<option value="P">Percentage</option>'
										+'<option value="F">Amount in USD without $ sign</option>'
									+'</select>'
								+'</div>'
								+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-12 col-12 mb-2 pl-0">'
									+'<input type="text" name="discountValue" id="discountValue" value="" onkeyup="getNum(this,\'\',\'discountType\')" class="form-control">'
								+'</div>'
							+'</div>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2">'
							+'<label class="m-0 full">&nbsp;</label>'
							+'<button type="button" class="btn btn-success btn-shadow btn-lg pr-4 pl-4" onclick="saveDiscountRate(\'saveDiscountRateForm\')">Save</button>'
						+'</div>'
					+'</div>'
				+'</form>'
			+'</div>'
			+'<div class="full table-responsive mt-2" id="setDiscountTable"></div>'
		+'</div>';
	return html;
}

function getDiscountRate(formId){
	var data=fetchDiscountRate(formId);
	if(data.discountRates.length>0){
		var html=
			'<table class="table table-bordered mt-2 font-12 border-radius-table" style="min-width:1380px;width:100%" id="discountTable">'
				+'<thead class="bg-primary">'
					+'<tr>'
						+'<th class="text-white bold rounded-top-left-10 border-bottom-0 border-primary" style="border-top-color:transparent;border-right-color:#fff !important">S.No.</th>'
						+'<th class="text-white bold border-bottom-0">Discount</th>'
						+'<th class="text-white bold border-bottom-0">Start Date</th>'
						+'<th class="text-white bold border-bottom-0">End Date</th>'
						+'<th class="text-white bold border-bottom-0">Created By</th>'
						+'<th class="text-white text-center bold border-bottom-0 rounded-top-right-10" style="border-top-color:transparent;border-right-color:transparent">Action</th>'
					+'</tr>'
				+'</thead>'
				+'<tbody>';
					$.each(data.discountRates, function(i, value){
						html+=
						'<tr>'
							+'<td>'+(i+1)+'</td>'
							+'<td>'+(value.discountType == 'F'?'USD ':'')+parseFloat(value.discountValue).toFixed(2)+(value.discountType != 'F'?'%':'')+'</td>'
							+'<td>'+value.startDate+'</td>'
							+'<td>'+value.endDate+'</td>'
							+'<td>'+value.userNameCreatedBy+'</td>'
							+'<td class="text-center">'
								+'<a href="javascript:void(0)" class="btn btn-danger btn-sm" onclick="">Deactivate</a>'
							+'</td>'
						+'</tr>';
					});
				+'</tbody>'
			+'</table>';
	}
	$("#setDiscountTable").html(html);
	var isDataTable = $.fn.dataTable.isDataTable('#discountTable');
		if(isDataTable){
			$('#discountTable').dataTable().fnDestroy();
		}
	$("#discountTable").DataTable({
		theme:"bootstrap4",
	});
}

function getCommissionRate(formId){
	var data=fetchCommissionRate(formId);
	var html=getFilteredCommissionRateContent(formId, data);
	$('#commissionRateFilteredData > tbody').html(html);
	$(".datepicker").datepicker({
		autoclose: true,
		format: 'M d, yyyy',
	});
	if($("#learningProgramFilter").val().length != null && $("#learningProgramFilter").val().length != undefined && $("#learningProgramFilter").val().length != 0 && $("#standardIdFilter").val().length != null && $("#standardIdFilter").val().length != undefined && $("#standardIdFilter").val().length != 0){
		$(".bulkEditBtn").show("show");
		$(".commissionTable thead > tr th:last-child, .commissionTable tbody > tr td:last-child").show();
		$(".commissionTable thead > tr th:nth-last-child(2)").removeClass("rounded-top-right-10");
		$(".bulk-update-and-cancel-btn").hide();
	}
}
function getFilteredCommissionRateContent(formId, data){
	var html = '';
	$.each(data.commissionRates, function(k,commissionRate){
		var range = commissionRate.min_range+'+';
		if(commissionRate.max_range>0){
			range=commissionRate.min_range+'-'+commissionRate.max_range;
		}
		html+=
		'<tr class="td-border-design border-color-gray" commissionRateId="'+commissionRate.id+'">'
			+'<td class="border-width-1">'+(k+1)+'</td>'
			+'<td class="border-width-1">'+commissionRate.standardName+'</td>'
			+'<td class="border-width-1">'+commissionRate.learningProgramValue+'</td>'
			+'<td class="p-0 border-width-1">'
				+'<table class="table m-0" style="table-layout: fixed; max-width: 270px;">'
					+'<tbody>'
						+'<tr>'
							+'<td class="border-left-0 border-bottom-0">'
								+'<div class="edit-value">'+(commissionRate.byPartnerType=='F'?'Amount in USD':'Percentage')+'</div>'
								+'<div class="edit-value-element" style="display: none;">'
									+'<select name="byPartnerType_'+commissionRate.id+'" id="byPartnerType_'+commissionRate.id+'" class="form-control byPartnerType">'
										+'<option value="P" '+(commissionRate.byPartnerType=='P'?'selected':'')+'>Percentage</option>'
										+'<option value="F" '+(commissionRate.byPartnerType=='F'?'selected':'')+'>Amount in USD without $ sign</option>'
									+'</select>'
								+'</div>'
							+'</td>'
							+'<td class="border-right-0 border-bottom-0">'
								+'<div class="edit-value">'+(commissionRate.byPartnerType=='F'?'$':'')+commissionRate.byPartnerValue+(commissionRate.byPartnerType=='F'?'':'')+'</div>'
								+'<div class="edit-value-element font-12" style="display: none;">'
								+'<input type="text" name="byPartnerValue_'+commissionRate.id+'" id="byPartnerValue_'+commissionRate.id+'" value="'+commissionRate.byPartnerValue+'" class="form-control byPartnerValue">'
								+'</div>'
							+'</td>'
						+'</tr>'
					+'</tbody>'
				+'</table>'
			+'</td>'
			+'<td class="p-0 border-width-1">'
				+'<table class="table m-0" style="table-layout: fixed;max-width: 270px;">'
					+'<tbody>'
						+'<tr>'
							+'<td class="border-left-0 border-bottom-0">'
								+'<div class="edit-value">'+(commissionRate.bySchoolType=='F'?'Amount in USD':'Percentage')+'</div>'
								+'<div class="edit-value-element" style="display: none;">'
									+'<select name="bySchoolType_'+commissionRate.id+'" id="bySchoolType_'+commissionRate.id+'" class="form-control bySchoolType">'
									+'<option value="P" '+(commissionRate.bySchoolType=='P'?'selected':'')+'>Percentage</option>'
									+'<option value="F" '+(commissionRate.bySchoolType=='F'?'selected':'')+'>Amount in USD without $ sign</option>'
									+'</select>'
								+'</div>'
							+'</td>'
							+'<td class="border-right-0 border-bottom-0">'
							+'<div class="edit-value">'+(commissionRate.bySchoolType=='F'?'$':'')+commissionRate.bySchoolValue+(commissionRate.bySchoolType=='F'?'':'')+'</div>'
								+'<div class="edit-value-element font-12" style="display: none;">'
								+'<input type="text" name="bySchoolValue_'+commissionRate.id+'" id="bySchoolValue_'+commissionRate.id+'" value="'+commissionRate.bySchoolValue+'" class="form-control bySchoolValue">'
								+'</div>'
							+'</td>'
						+'</tr>'
					+'</tbody>'
				+'</table>'
			+'</td>'
			+'<td class="border-width-1">'
				+'<div class="edit-value">'+range+'</div>'
				+'<div class="edit-value-element" style="display: none;">'
					+'<select name="enrollRange_'+commissionRate.id+'" id="enrollRange_'+commissionRate.id+'" class="form-control bySchoolType">'
						+'<option value="0">Select Range</option>'
						+'<option value="1-5" '+((commissionRate.min_range+'-'+commissionRate.max_range)=='1-5'?'selected':'')+'>1-5</option>'
						+'<option value="6-10" '+((commissionRate.min_range+'-'+commissionRate.max_range)=='6-10'?'selected':'')+'>6-10</option>'
						+'<option value="11-20" '+((commissionRate.min_range+'-'+commissionRate.max_range)=='11-20'?'selected':'')+'>11-20</option>'
						+'<option value="21-30" '+((commissionRate.min_range+'-'+commissionRate.max_range)=='21-30'?'selected':'')+'>21-30</option>'
						+'<option value="31-50" '+((commissionRate.min_range+'-'+commissionRate.max_range)=='31-50'?'selected':'')+' >31-50</option>'
						+'<option value="50-0" '+((commissionRate.min_range+'-'+commissionRate.max_range)=='50-0'?'selected':'')+'>50+</option>'
					+'</select>'
					+'</div>'
			+'</td>'
			+'<td class="border-width-1">'
				+'<div class="edit-value">'+commissionRate.startDate+'</div>'
				+'<div class="edit-value-element" style="display: none;">'
					+'<input type="text" name="startDate" id="startDate_'+commissionRate.id+'" value="'+commissionRate.startDate+'" class="datepicker form-control startDate">'
				+'</div>'
			+'</td>'
			+'<td class="border-width-1">'
				+'<div class="edit-value">'+commissionRate.endDate+'</div>'
				+'<div class="edit-value-element" style="display: none;">'
					+'<input type="text" name="endDate" id="endDate_'+commissionRate.id+'" value="'+commissionRate.endDate+'" class="datepicker form-control endDate">'
				+'</div>'
			+'</td>'
			+'<td class="text-center border-width-1">'
				+'<a href="javascript:void(0)" class="text-decoration-none text-primary edit-value" onclick="editRow(this)">'
					+'<i class="fa fa-edit"></i>'
				+'</a>&nbsp;'
				+'<a href="javascript:void(0)" class="text-decoration-none text-primary edit-value" onclick="getCommissionRateLogs('+commissionRate.id+')">'
					+'<i class="fa fa-history"></i>'
				+'</a>'
				+'<div class="edit-value-element" style="display: none;">'
					+'<a href="javascript:void(0)" class="text-decoration-none btn btn-primary btn-sm mb-2" onclick="cancelEitRow(this)">'
						+'cancel'
					+'</a>'
					+'<br/>'
					+'<a href="javascript:void(0)" class="text-decoration-none btn btn-success btn-sm" onclick="updateCommissionRate(\'filterCommissionRate\','+commissionRate.id+')">'
						+'Update'
					+'</a>'
				+'</div>'
			+'</td>'
		+'</tr>'
	});
	return html;
}

commissionRateLogsContentModal()
function getCommissionRateLogs(id){
	var data=commissionRateLogs(id);
	var html=getCommissionRateLogsContent(id, data);
	$('#commissionRateLogsTable > tbody').html(html);
	// $(".datepicker").datepicker({
	// 	autoclose: true,
	// 	format: 'M d, yyyy',
	// });
	$("#commissionRateLogs").modal("show");
}
function getCommissionRateLogsContent(id, data){
	var html = '';
	$.each(data.commissionRates, function(k,commissionRate){
		html+=
		'<tr class="td-border-design border-color-gray" commissionRateId="'+commissionRate.id+'">'
			+'<td class="border-width-1">'+(k+1)+'</td>'
			+'<td class="border-width-1">'+commissionRate.standardName+'</td>'
			+'<td class="border-width-1">'+commissionRate.learningProgramValue+'</td>'
			+'<td class="p-0 border-width-1">'
				+'<table class="table m-0" style="table-layout: fixed; max-width: 270px;">'
					+'<tbody>'
						+'<tr>'
							+'<td class="border-left-0 border-bottom-0">'
								+(commissionRate.byPartnerType=='F'?'Amount in USD':'Percentage')
							+'</td>'
							+'<td class="border-right-0 border-bottom-0">'
								+(commissionRate.byPartnerType=='F'?'$':'')+commissionRate.byPartnerValue+(commissionRate.byPartnerType=='F'?'':'%')
							+'</td>'
						+'</tr>'
					+'</tbody>'
				+'</table>'
			+'</td>'
			+'<td class="p-0 border-width-1">'
				+'<table class="table m-0" style="table-layout: fixed;max-width: 270px;">'
					+'<tbody>'
						+'<tr>'
							+'<td class="border-left-0 border-bottom-0">'
								+(commissionRate.bySchoolType=='F'?'Amount in USD':'Percentage')
							+'</td>'
							+'<td class="border-right-0 border-bottom-0">'
								+(commissionRate.bySchoolType=='F'?'$':'')+commissionRate.bySchoolValue+(commissionRate.bySchoolType=='F'?'':'%')
							+'</td>'
						+'</tr>'
					+'</tbody>'
				+'</table>'
			+'</td>'
			+'<td class="border-width-1">'
				+commissionRate.startDate
			+'</td>'
			+'<td class="border-width-1">'
				+commissionRate.endDate
			+'</td>'
			+'<td class="text-center border-width-1">'
				+commissionRate.userNameUpdatedBy
			+'</td>'
			+'<td class="text-center border-width-1">'
				+commissionRate.updatedAt
			+'</td>'
		+'</tr>'
	});
	return html;
}
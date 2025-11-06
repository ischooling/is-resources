var schoolContactNumber;
var schoolSupportNumber;
var itiSchoolContactNumber;
var itiSchoolSupportNumber;
function renderPartnerCotent(partnerTypeId){
	$("#LeadPartnerUserFormB2BPopup").html(createPartnerAndSetCommissionModal(partnerTypeId));
	$('#saveCommissionRateForm #learningProgram').val('ONE_TO_ONE');
	$('#filterCommissionRate #learningProgramFilter').val('ONE_TO_ONE');
	getAllCountryList('officeContactDetailsForm','officeCountryId');
	getAllTimezoneList('officeContactDetailsForm', 'schoolTimezone');
	// $("#learningProgramFilter").html(getLearningProgramAndCourseProviderMappingBySchoolId(SCHOOL_ID, false));
	$("#learningProgram").select2({
		theme:"bootstrap4",
		dropdownParent: "#leadPartnerUserB2B"
	});
	// getGradesByLearningProgram('saveCommissionRateForm','learningProgram','standardId','leadPartnerUserB2B');
	$("#standardId").select2({
		theme:"bootstrap4",
		dropdownParent: "#leadPartnerUserB2B"
	});
	$("#learningProgramFilter").select2({
		theme:"bootstrap4",
		dropdownParent: "#leadPartnerUserB2B"
	});
	// getGradesByLearningProgram('filterCommissionRate','learningProgramFilter','standardIdFilter','leadPartnerUserB2B');
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
	$("#schoolTimezone").select2({
		theme:"bootstrap4",
		dropdownParent: "#leadPartnerUserB2B"
	});
	$("#officeCountryId, #officeStateId, #officeCityId").select2({
		theme:"bootstrap4",
		dropdownParent: "#leadPartnerUserB2B"
	});
	callPCountries('partnerUserB2BSaveForm', 0, 'countryId');
	getPartnerTypeList('partnerUserB2BSaveForm',0,'partnerType','');
	$("#createUserB2B").on('click', function(){ 
		savePatnerWithReferralCode('partnerUserB2BSaveForm','leadPartnerUserB2B');
	});
	getAllTimeZoneForPartner('originalTimezone');
	$("#standardIdFilter").val("").trigger("change");
	$('#setCommissionRateTab').on('click', function() {
		setTimeout(function(){
			$('#setCommissionRate #addForm, #setCommissionRate ul.nav li:first-child a').addClass('active');
			$('#setCommissionRate ul.nav li:nth-child(2) a').removeClass('active');
		},100);
		$("#standardId").val("A").trigger("change");
		$("#standardIdFilter").val("A").trigger("change");
		$('#setDiscount, #filterBy, #createPartner, #feeStructure, #officeContactDetails, #enrollReg, #paymentOptions, #theme').removeClass('active');
		getCommissionRate("filterCommissionRate")
		// let learningProgram = getLearningProgramAndCourseProviderMappingBySchoolId($("#pSchoolId").val(), "All Program", "A");
		// $("#learningProgram").html(learningProgram);
		// $("#learningProgramFilter").html(learningProgram);
	});
	$("#learningProgram").val('A').trigger('change');
	$("#learningProgramFilter").val('A').trigger('change');
	$('#createPartnerTab').on('click', function() {
		$('#setCommissionRate, #filterBy, #setDiscount, #feeStructure, #officeContactDetails, #enrollReg, #paymentOptions, #theme').removeClass('active');
	});
	$('#setDiscountTab').on('click', function() {
		$('#setCommissionRate, #filterBy, #createPartner, #feeStructure, #officeContactDetails, #enrollReg, #paymentOptions, #theme').removeClass('active');
		getDiscountRate('saveDiscountRateForm');
	});
	$('#feeStructureTab').on('click', function() {
		$('#filterBy, #setDiscount, #officeContactDetails, #enrollReg, #paymentOptions, #theme').removeClass('active');
	});
	$('#officeContactDetailsTab').on('click', function() {
		$('#feeStructure, #filterBy, #setDiscount, #enrollReg, #paymentOptions, #theme').removeClass('active');
	});
	$('#enrollRegTab').on('click', function() {
		$('#feeStructure, #filterBy, #setDiscount, #officeContactDetails, #paymentOptions, #theme').removeClass('active');
	});
	$('#paymentOptionsTab').on('click', function() {
		$('#feeStructure, #filterBy, #setDiscount, #officeContactDetails, #enrollReg, #theme').removeClass('active');
	});
	$('#themeTab').on('click', function() {
		$('#feeStructure, #filterBy, #setDiscount, #officeContactDetails, #enrollReg, #paymentOptions').removeClass('active');
	});

	$('#otherPaymentMode').on('change', function () {
		if ($(this).is(':checked')) {
			$('#textPayment').slideDown();
		} else {
			$('#textPayment').slideUp();
		}
	});

    // $('#originalPartnerType').on('change', function () {
    //   updateFieldsBasedOnPartnerType();
    // });
    // $('#commissionPayout').on('change', function () {
	// 	updateTabsVisibility();
    // });
	if($("#cropModal").length > 0 ){
		$("body #cropModal").remove()
		$("body").append(cropModalContent())
	}else{
		$("body").append(cropModalContent())
	}
	schoolContactNumber = document.querySelector("#officeContactNumber");
	schoolSupportNumber = document.querySelector("#supportNumber");
	itiSchoolContactNumber = window.intlTelInput(schoolContactNumber);
	itiSchoolContactNumber.setCountry('US');
	$('#officeContactNumberCountryCode').val(itiSchoolContactNumber.getSelectedCountryData().iso2);
	$('#officeContactNumberDailCode').val(itiSchoolContactNumber.getSelectedCountryData().dialCode);
	schoolContactNumber.addEventListener('countrychange', function(e) {
		$('#officeContactNumberCountryCode').val(itiSchoolContactNumber.getSelectedCountryData().iso2);
		$('#officeContactNumberDailCode').val(itiSchoolContactNumber.getSelectedCountryData().dialCode);

	});
	itiSchoolSupportNumber = window.intlTelInput(schoolSupportNumber);
	itiSchoolSupportNumber.setCountry('US');
	$('#supportNumberCountryCode').val(itiSchoolSupportNumber.getSelectedCountryData().iso2);
	$('#supportNumberDailCode').val(itiSchoolSupportNumber.getSelectedCountryData().dialCode);
	schoolSupportNumber.addEventListener('countrychange', function(e) {
		$('#supportNumberCountryCode').val(itiSchoolSupportNumber.getSelectedCountryData().iso2);
		$('#supportNumberDailCode').val(itiSchoolSupportNumber.getSelectedCountryData().dialCode);

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
					+'<div class="modal-header py-0 text-white card-header card-header-tabe d-flex flex-column justify-content-center align-items-center bg-transparent" style="height:4.5rem !important;">'
						+'<input type="hidden" id="pSchoolId"></input>'
						+'<div id="partnerProgressBar" class="w-100 my-2 d-flex gap-3 align-items-center">'
							+'<div class="d-flex align-items-center">'
								+'<span id="partnerProgressText" class="text-primary font-weight-bold small mr-2">0% Complete</span>'
							+'</div>'
							+'<div class="progress col-11 px-0" style="height: 10px;">'
								+'<div id="partnerProgressBarFill" class="progress-bar bg-primary" role="progressbar" '
									+'style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">'
								+'</div>'
							+'</div>'
						+'</div>'
						// +'<h5 class="text-primary font-weight-bold my-2">Partner Name: Lsenda Global</h5>'
						+'<ul class="nav" style="height: min-content;">'
							+'<li class="nav-item"><a data-toggle="tab" href="#createPartner" id="createPartnerTab" class="nav-link active">'+headTitle+'</a></li>'
							+'<li class="nav-item"><a data-toggle="tab" href="#officeContactDetails" onclick="getOfficeContentsDetails(\'officeContactDetailsForm \')" id="officeContactDetailsTab" class="nav-link">School Contact Details</a></li>'
							+'<li class="nav-item"><a data-toggle="tab" href="#enrollReg" id="enrollRegTab" onclick="initEnrollReg()" class="nav-link">Enrollment / Registration</a></li>'
							+'<li class="nav-item"><a data-toggle="tab" href="#feeStructure" onclick="getStandardFee(\'fromTab\');" id="feeStructureTab" class="nav-link">Add Your Fee Structure</a></li>'
							+'<li class="nav-item"><a data-toggle="tab" href="#setCommissionRate" id="setCommissionRateTab" class="nav-link">Set Commission Rate</a></li>'
							+'<li class="nav-item"><a data-toggle="tab" href="#setDiscount" id="setDiscountTab" class="nav-link" style="display:none">Set Discount</a></li>'
							+'<li class="nav-item"><a data-toggle="tab" href="#paymentOptions" id="paymentOptionsTab" class="nav-link" onclick="getEnrollmentPartnerPaymentDetails();">Payment Options</a></li>'
							+'<li class="nav-item"><a data-toggle="tab" href="#theme" id="themeTab" class="nav-link" onclick="getPartnerSchoolImages(\'partnerUserB2BSaveForm\',\'rawLeadId\')">Theme</a></li>'
						+'</ul>'
						+'<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">'
							+'<span aria-hidden="true">&times;</span>'
						+'</button>'
					+'</div>'
					+'<div class="modal-body p-0 overflow-auto">'
						+'<div class="tab-content">'
							+getCreatePartnerContent(buttonTitle)
							+getSetCommissionRateContent()
							+getSetDiscountContent()
							+getFeeStructureContent()
							+getOfficeContactDetailsContent()
							+'<div id="enrollReg" class="tab-pane p-4" role="tabpanel">'
								// +enrollRegContent()
							+'</div>'
							+paymentOptionsContent()
							+'<div class="tab-pane p-4" id="theme" role="tabpanel">'
								+getSchoolSetupContent(true, true, true);
							+'</div>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>';
	return html;
}

function commissionRateLogsContentModal(partnerTypeId){
	var headTitle="Commission Rate Logs";
	var html =
		'<div id="commissionRateLogs" class="modal right-slide-modal fade" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">'
			+'<div class="modal-dialog modal-xl">'
				+'<div class="modal-content border-0">'
					+'<div class="modal-header py-0 text-white card-header card-header-tabe">'
						+'<h5 class="text-white modal-title">'+headTitle+'</h5>'
						+'<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">'
							+'<span aria-hidden="true">&times;</span>'
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
			+'<div class="col-xl-5 mx-auto">'
				+'<div class="p-1 bg-light-primary border border-primary rounded-10 card">'
					+'<form class="col-12 mt-2 mb-2" method="post" id="partnerUserB2BSaveForm" action="javascript:void(0);">'
						+'<input type="hidden" name="leadId" id="leadId" value="0" />'
						+'<input type="hidden" name="rawLeadId" id="rawLeadId" value="0" />'
						+'<input type="hidden" name="leadType" id="leadType" value="B2B" />'
						+'<input type="hidden" name="isdCode" id="isdCode" value="" />'
						+'<input type="hidden" name="pCountryCode" id="pCountryCode" value="" />'
						+'<div class="row">'
							+'<div class="col-12 mb-2">'
								+'<label class="m-0">First Name<sub class="text-danger">*</sub></label>'
								+'<input type="text" name="fname" id="fname" value=""   class="form-control" maxlength="100" disabled>'
							+'</div>'
							+'<div class="col-12 mb-2">'
								+'<label class="m-0">Middle Name</label>'
								+'<input type="text" name="mname" id="mname" value=""  class="form-control" maxlength="100" disabled>'
							+'</div>'
							+'<div class="col-12 mb-2">'
								+'<label class="m-0">Last Name<sub class="text-danger">*</sub></label>'
								+'<input type="text" name="lname" id="lname" value=""  class="form-control" maxlength="100" disabled>'
							+'</div>'
							+'<div class="col-12 mb-2">'
								+'<label class="m-0">Email<sub class="text-danger">*</sub></label>'
								+'<input type="email" name="email" id="email" class="form-control" value="" disabled>'
							+'</div>'
							+'<div class="col-12 mb-2">'
								+'<label>Mobile No.<sub class="text-danger">*</sub></label> '
								+'<input type="text" name="phoneNo" id="phoneNo" class="form-control" value="" maxlength="15" disabled />'
							+'</div>'
							+'<div class="col-12 mb-2">'
								+'<label class="m-0">Country<sub class="text-danger">*</sub></label>'
								+'<select name="countryId" id="countryId" class="form-control" disabled></select>'
							+'</div>'
							+'<div class="col-12 mb-2">'
								+'<label class="m-0">State<sub class="text-danger">*</sub></label>'
								+'<select name="stateId" id="stateId" class="form-control" disabled></select>'
							+'</div>'
							+'<div class="col-12 mb-2">'
								+'<label class="m-0">City<sub class="text-danger">*</sub></label>'
								+'<select name="cityId" id="cityId" class="form-control" disabled></select>'
							+'</div>'
							+'<div class="col-12 mb-2">'
								+'<label class="m-0">Location Partner Type<sub class="text-danger">*</sub></label>'
								+'<select name="partnerType" id="partnerType" class="form-control"></select>'
							+'</div>'
							+'<div class="col-12 mb-2">'
								+'<label class="m-0">Partner Type<sub class="text-danger">*</sub></label>'
								+'<select name="originalPartnerType" id="originalPartnerType" class="form-control">'
									+'<option value="">Select Partner Type</option>'
									+'<option value="GP">Enrollment Partner</option>'
									+'<option value="WLP">Self School or Academy</option>'
									// +'<option value="RP">Reseller Partner</option>'
									+'<option value="EPER">Enrollment Partner with Enrollment Rights</option>'
								+'</select>'
							+'</div>'
							+'<div class="col-12 mb-2">'
								+'<label class="m-0">TimeZone<sub class="text-danger">*</sub></label>'
								+'<select name="originalTimezone" id="originalTimezone" class="form-control">'
								+'</select>'
							+'</div>'
							+'<div class="col-12 mb-2">'
								+'<label class="m-0">Commision Payout</label>'
								+'<select name="commissionPayout" id="commissionPayout" class="form-control">'
									+'<option value="SWP">'+SCHOOL_NAME+' will be paying commission to Partner</option>'
									+'<option value="PWP">Partner will be paying '+SCHOOL_NAME+'</option>'
								+'</select>'
							+'</div>'
							+'<div class="col-12 mb-2">'
								+'<label class="m-0">White Label</label>'
								+'<select name="whiteLabel" id="whiteLabel" class="form-control">'
									+'<option value="NWL">No white - labeling '+SCHOOL_NAME+' Colors and Logor</option>'
									+'<option value="WLWC">With White Label Custom Colors and Logo</option>'
								+'</select>'
							+'</div>'
							+'<div class="col-12 mb-2">'
								+'<label class="m-0">Enrolling Students</label>'
								+'<select name="enrollingStudent" id="enrollingStudent" class="form-control">'
									+'<option value="OWN">For their own school or academy</option>'
									+'<option value="FIS">For '+SCHOOL_NAME+'</option>'
								+'</select>'
							+'</div>'
							+'<div class="col-12 mb-2">'
								+'<label class="m-0">Default Fee Structure</label>'
								+'<select name="defaultFeeStructure" id="defaultFeeStructure" disabled class="form-control">'
									+'<option value="is">International Schooling</option>'
									+'<option value="AYO">Add Your Own</option>'
								+'</select>'
							+'</div>'
							+'<div class="col-12 text-right">'
								+'<button type="button" class="btn btn-success  float-right pr-4 pl-4" id="createUserB2B">'+buttonTitle+'</button>'
							+'</div>'
						+'</div>'
					+'</form>'
				+'</div>'
			+'</div>'
		+'</div>'
	return html;
}

function getSetCommissionRateContent(){
	var html = 
		'<div class="tab-pane" id="setCommissionRate" role="tabpanel">'
			+'<div class="card-header card-header-tabe">'
				+'<ul class="nav">'
					+'<li class="nav-item"><a data-toggle="tab" href="#addForm" class="nav-link active">Add Commission</a></li>'
					// +'<li class="nav-item"><a data-toggle="tab" href="#filterBy" class="nav-link">Filter By</a></li>'
				+'</ul>'
			+'</div>'
			+'<div class="tab-content p-4">'
				+getAddFormContent()
				//+getFilterByContent()
			+'</div>'
		+'</div>';
	return html;
}

function getAddFormContent(){
	var html = 
		'<div class="tab-pane active" id="addForm" role="tabpanel">'
			+'<div class="col-xl-5 mt-2 mb-2 mx-auto">'
				+'<div class="p-1 bg-light-primary border border-primary rounded-10 card">'	
					+'<form class="col-12 mt-2 mb-2" id="saveCommissionRateForm" autocomplete="off" action="javascript:void(0);">'
						+'<div class="row">'
							+'<div class="col-12 mb-2 pr-0">'
								+'<label class="m-0">Lead Provided By Partner</label>'
								+'<div class="d-flex flex-wrap">'
									+'<div class="col-9 mb-2 pl-0">'
										+'<select name="byPartnerType" id="byPartnerType" class="form-control">'
											+'<option value="P">Percentage</option>'
											+'<option value="F">Amount in USD</option>'
										+'</select>'
									+'</div>'
									+'<div class="col-3 mb-2 pl-0">'
										+'<input type="text" name="byPartnerValue" id="byPartnerValue" value="" onkeyup="getNum(this,\'\',\'byPartnerType\')" class="form-control">'
									+'</div>'
								+'</div>'
							+'</div>'
							+'<div class="col-12 mb-2 pr-0">'
								+'<label class="m-0">Lead Provided By IS</label>'
								+'<div class="d-flex flex-wrap">'
									+'<div class="col-9 mb-2 pl-0">'
										+'<select name="bySchoolType" id="bySchoolType" class="form-control">'
											+'<option value="P">Percentage</option>'
											+'<option value="F">Amount in USD</option>'
										+'</select>'
									+'</div>'
									+'<div class="col-3 mb-2 pl-0">'
										+'<input type="text" name="bySchoolValue" id="bySchoolValue" value="" onkeyup="getNum(this,\'\',\'bySchoolType\')" class="form-control">'
									+'</div>'
								+'</div>'
							+'</div>'
							+'<div class="col-12 mb-2">'
								+'<label class="m-0">Select Learning Program</label>'
								+'<select name="learningProgram" id="learningProgram" class="form-control"' 
								// onchange="getGradesByLearningProgram(\'saveCommissionRateForm\',\'learningProgram\',\'standardId\',\'leadPartnerUserB2B\')"
								+'>'
									+'<option value="A" selected>All Program</option>'
									// +getLearningProgramContent(SCHOOL_ID)
								+'</select>'
							+'</div>'
							+'<div class="col-12 mb-2">'
								+'<label class="m-0">Select Grade</label>'
								+'<select name="standardId" id="standardId" class="form-control" multiple="multiple">'
									+'<option value="A" >ALL Grade</option>'
									// +getStandardContent(SCHOOL_ID,true)
								+'</select>'
							+'</div>'
							+'<div class="col-12 mb-2">'
								+'<div class="row">'
									+'<div class="col-12">'
										+'<label class="m-0">Enrollment Min/Max Range</label>'
									+'</div>'
									+'<div class="col-6">'
										+'<div class="full">'
											+'<input type="text" name="minRange" id="minRange" value="" onkeyup="getNum(this,\'\',\'minRange\')" class="form-control" placeholder="Min">'
										+'</div>'
									+'</div>'
									+'<div class="col-6">'
										+'<div class="full">'
											+'<input type="text" name="maxRange" id="maxRange" value="" onkeyup="getNum(this,\'\',\'maxRange\')" class="form-control" placeholder="Max">'
										+'</div>'
									+'</div>'
								+'</div>'
								
								
								// +'<select name="enrollRange" id="enrollRange" class="form-control">'
								// 	+'<option value="0">Select Range</option>'
								// 	+'<option value="1-5" >1-5</option>'
								// 	+'<option value="6-10" >6-10</option>'
								// 	+'<option value="11-20" >11-20</option>'
								// 	+'<option value="21-30" >21-30</option>'
								// 	+'<option value="31-50" >31-50</option>'
								// 	+'<option value="50-0" >50+</option>'
									
								// +'</select>'
							+'</div>'
							+'<div class="col-12 mb-2">'
								+'<label class="m-0">Applicable From</label>'
								+'<input type="text" name="startDate" id="startDate" class="datepicker form-control" readonly onkeydown="return false">'
							+'</div>'
							// +'<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12 mb-2">'
							// 	+'<label class="m-0">Applicable Till</label>'
							// 	+'<input type="text" name="endDate" id="endDate" class="datepicker form-control">'
							// +'</div>'
							+'<div class="col-12 mb-2 text-right">'
								+'<label class="m-0 full">&nbsp;</label>'
								+'<a href="javascript:void(0)" onclick="saveCommissionRate(\'saveCommissionRateForm\')" class="btn btn-success mr-1  btn-lg">Add Commission</a>'
								+'<a href="javascript:void(0)" onclick="resetCommissionRatePartner(\'saveCommissionRateForm\')" class="btn btn-primary  btn-lg">Reset</a>'
							+'</div>'
						+'</div>'
					+'</form>'
				+'</div>'
			+'</div>'
			+'<div class="col-12">'
				+'<form id="filterCommissionRate" autocomplete="off" action="javascript:void(0);">'
					+'<div class="full p-1 bg-light-primary border border-primary rounded-10 card" style="display:none">'
						+'<div class="col-12 mt-2 mb-2">'
							+'<div class="row">'
								+'<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12 mb-2">'
									+'<label class="m-0">Select Learning Program</label>'
									+'<select name="learningProgramFilter" id="learningProgramFilter" class="form-control" '
									// onchange="getGradesByLearningProgram(\'filterCommissionRate\',\'learningProgramFilter\',\'standardIdFilter\',\'leadPartnerUserB2B\')"
									+'>'
										+'<option value="A">All Program</option>'
										// +getLearningProgramContent(SCHOOL_ID)
									+'</select>'
								+'</div>'
								+'<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12 mb-2">'
									+'<label class="m-0">Select Grade</label>'
									+'<select name="standardIdFilter" id="standardIdFilter" class="form-control" multiple="multiple">'
										+'<option value="A">ALL Grade</option>'
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
						+'<a href="javascript:void(0)" class="btn btn-primary bulkEditBtn" onclick="bulkEditPartner(true)" style="display:none">Bulk Edit</a>'
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
									+'<th class="text-white bold border-bottom-0 text-center" style="width:160px;">Enrollment Min/Max Range</th>'
									+'<th class="text-white bold border-bottom-0 text-center">Applicable From</th>'
									+'<th class="text-white bold border-bottom-0 text-center">Applicable Till</th>'
									+'<th class="text-white bold border-bottom-0 rounded-top-right-10" style="border-top-color:transparent;border-right-color:transparent">Action</th>'
								+'</tr>'
							+'</thead>'
							+'<tbody class="last-tr-fist-and-last-td-rounded">'
							+'</tbody>'
						+'</table>'
						+'<div class="full text-right bulk-update-and-cancel-btn mb-4" style="display: none;">'
							+'<a href="javascript:void(0)" class="text-decoration-none btn btn-primary mr-2" onclick="cancelEitAllRowPartner()">Cancel</a>'
							+'<a href="javascript:void(0)" class="text-decoration-none btn btn-success" onclick="updateCommissionRatePartner(\'filterCommissionRate\',\'\')">Update</a>'
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
								+'<select name="learningProgramFilter" id="learningProgramFilter" class="form-control" '
								// onchange="getGradesByLearningProgram(\'filterCommissionRate\',\'learningProgramFilter\',\'standardIdFilter\',\'leadPartnerUserB2B\')"
								+'>'
									+'<option value="A">All Program</option>'
									// +getLearningProgramContent(SCHOOL_ID)
								+'</select>'
							+'</div>'
							+'<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12 mb-2">'
								+'<label class="m-0">Select Grade</label>'
								+'<select name="standardIdFilter" id="standardIdFilter" class="form-control" multiple="multiple">'
									+'<option value="A">ALL Grade</option>'
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
					+'<a href="javascript:void(0)" class="btn btn-primary bulkEditBtn" onclick="bulkEditPartner(true)" style="display:none">Bulk Edit</a>'
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
								+'<th class="text-white bold border-bottom-0 text-center" style="width:160px;">Enrollment Min/Max Range</th>'
								+'<th class="text-white bold border-bottom-0 text-center">Applicable From</th>'
								+'<th class="text-white bold border-bottom-0 text-center">Applicable Till</th>'
								+'<th class="text-white bold border-bottom-0 rounded-top-right-10" style="border-top-color:transparent;border-right-color:transparent">Action</th>'
							+'</tr>'
						+'</thead>'
						+'<tbody class="last-tr-fist-and-last-td-rounded">'
						+'</tbody>'
					+'</table>'
					+'<div class="full text-right bulk-update-and-cancel-btn mb-4" style="display: none;">'
						+'<a href="javascript:void(0)" class="text-decoration-none btn btn-primary mr-2" onclick="cancelEitAllRowPartner()">Cancel</a>'
						+'<a href="javascript:void(0)" class="text-decoration-none btn btn-success" onclick="updateCommissionRatePartner(\'filterCommissionRate\',\'\')">Update</a>'
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
										+'<option value="F">Amount in USD</option>'
									+'</select>'
								+'</div>'
								+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-12 col-12 mb-2 pl-0">'
									+'<input type="text" name="discountValue" id="discountValue" value="" onkeyup="getNum(this,\'\',\'discountType\')" class="form-control">'
								+'</div>'
							+'</div>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2">'
							+'<label class="m-0 full">&nbsp;</label>'
							+'<button type="button" class="btn btn-success  btn-lg pr-4 pl-4" onclick="saveDiscountRate(\'saveDiscountRateForm\')">Save</button>'
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
								+'<a href="javascript:void(0)" class="btn btn-danger  btn-sm" onclick="">Deactivate</a>'
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

function getCommissionRate(formId, isEdit){
	var data=fetchCommissionRate(formId, isEdit);
	var html=getFilteredCommissionRateContent(formId, data);
	$('#commissionRateFilteredData > tbody').html(html);
	$(".datepicker").datepicker({
		autoclose: true,
		format: 'M d, yyyy',
	});
	$(".bulkEditBtn").show("show");
	if($("#learningProgramFilter").val() != null && $("#learningProgramFilter").val().length != null && $("#learningProgramFilter").val().length != undefined && $("#learningProgramFilter").val().length != 0 && $("#standardIdFilter").val() != null && $("#standardIdFilter").val().length != null && $("#standardIdFilter").val().length != undefined && $("#standardIdFilter").val().length != 0){
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
										+'<option value="F" '+(commissionRate.byPartnerType=='F'?'selected':'')+'>Amount in USD</option>'
									+'</select>'
								+'</div>'
							+'</td>'
							+'<td class="border-right-0 border-bottom-0">'
								+'<div class="edit-value">'+(commissionRate.byPartnerType=='F'?'$':'')+commissionRate.byPartnerValue+(commissionRate.byPartnerType=='F'?'':'')+'</div>'
								+'<div class="edit-value-element font-12" style="display: none;">'
								+'<input type="text" oninput="allowOnlyNumbers(this)" onkeyup="getNum(this,\'\',\'byPartnerType_'+commissionRate.id+'\')" name="byPartnerValue_'+commissionRate.id+'" id="byPartnerValue_'+commissionRate.id+'" value="'+commissionRate.byPartnerValue+'" class="form-control byPartnerValue">'
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
									+'<option value="F" '+(commissionRate.bySchoolType=='F'?'selected':'')+'>Amount in USD</option>'
									+'</select>'
								+'</div>'
							+'</td>'
							+'<td class="border-right-0 border-bottom-0">'
							+'<div class="edit-value">'+(commissionRate.bySchoolType=='F'?'$':'')+commissionRate.bySchoolValue+(commissionRate.bySchoolType=='F'?'':'')+'</div>'
								+'<div class="edit-value-element font-12" style="display: none;">'
								+'<input type="text" oninput="allowOnlyNumbers(this)" onkeyup="getNum(this,\'\',\'byPartnerType_'+commissionRate.id+'\')" name="bySchoolValue_'+commissionRate.id+'" id="bySchoolValue_'+commissionRate.id+'" value="'+commissionRate.bySchoolValue+'" class="form-control bySchoolValue">'
								+'</div>'
							+'</td>'
						+'</tr>'
					+'</tbody>'
				+'</table>'
			+'</td>'
			+'<td class="border-width-1">'
				+'<div class="edit-value">'+range+'</div>'
					+'<div class="edit-value-element" style="display: none;">'
						+'<div class="full d-flex gap-5">'
							+'<input type="text" name="minEnrollRange_'+commissionRate.id+'" id="minEnrollRange_'+commissionRate.id+'" value="'+range.split("-")[0]+'" onkeyup="getNum(this,\'\',\'minRange\')" class="form-control" placeholder="Min">'
							+'<input type="text" name="maxEnrollRange_'+commissionRate.id+'" id="maxEnrollRange_'+commissionRate.id+'" value="'+range.split("-")[1]+'" onkeyup="getNum(this,\'\',\'maxRange\')" class="form-control" placeholder="Max">'
						+'</div>'
					+'</div>'
					// +'<select name="enrollRange_'+commissionRate.id+'" id="enrollRange_'+commissionRate.id+'" class="form-control bySchoolType">'
					// 	+'<option value="0">Select Range</option>'
					// 	+'<option value="1-5" '+((commissionRate.min_range+'-'+commissionRate.max_range)=='1-5'?'selected':'')+'>1-5</option>'
					// 	+'<option value="6-10" '+((commissionRate.min_range+'-'+commissionRate.max_range)=='6-10'?'selected':'')+'>6-10</option>'
					// 	+'<option value="11-20" '+((commissionRate.min_range+'-'+commissionRate.max_range)=='11-20'?'selected':'')+'>11-20</option>'
					// 	+'<option value="21-30" '+((commissionRate.min_range+'-'+commissionRate.max_range)=='21-30'?'selected':'')+'>21-30</option>'
					// 	+'<option value="31-50" '+((commissionRate.min_range+'-'+commissionRate.max_range)=='31-50'?'selected':'')+' >31-50</option>'
					// 	+'<option value="50-0" '+((commissionRate.min_range+'-'+commissionRate.max_range)=='50-0'?'selected':'')+'>50+</option>'
					// +'</select>'
				+'</div>'
			+'</td>'
			+'<td class="border-width-1">'
				+'<div class="edit-value">'+commissionRate.startDate+'</div>'
				+'<div class="edit-value-element" style="display: none;">'
					+'<input type="text" name="startDate" id="startDate_'+commissionRate.id+'" value="'+commissionRate.startDate+'" class="datepicker form-control startDate">'
				+'</div>'
			+'</td>'
			+'<td class="border-width-1">'
				// +'<div class="edit-value">'+ (commissionRate.endDate != 'Dec 31, 2999' ? commissionRate.endDate : 'N/A') +'</div>'
				+'<div class="edit-value">'+ commissionRate.endDate +'</div>'
				+'<div class="edit-value-element" style="display: none;">'
					// +'<input type="text" name="endDate" id="endDate_' + commissionRate.id + '" value="' + (commissionRate.endDate != 'Dec 31, 2999' ? commissionRate.endDate : 'N/A') + '" class="datepicker form-control endDate">'
					+'<input type="text" name="endDate" id="endDate_' + commissionRate.id + '" value="'+commissionRate.endDate+'" class="datepicker form-control endDate">'
				+'</div>'
			+'</td>'
			+'<td class="text-center border-width-1">'
				+'<a href="javascript:void(0)" class="text-decoration-none text-primary edit-value" onclick="editRowPartner(this)">'
					+'<i class="fa fa-edit"></i>'
				+'</a>&nbsp;'
				+'<a href="javascript:void(0)" class="text-decoration-none text-primary edit-value" onclick="getCommissionRateLogsPartner('+commissionRate.id+')">'
					+'<i class="fa fa-history"></i>'
				+'</a>'
				+'<div class="edit-value-element" style="display: none;">'
					+'<a href="javascript:void(0)" class="text-decoration-none btn btn-primary btn-sm mb-2" onclick="cancelEitRowPartner(this)">'
						+'Cancel'
					+'</a>'
					+'<br/>'
					+'<a href="javascript:void(0)" class="text-decoration-none btn btn-success btn-sm" onclick="updateCommissionRatePartner(\'filterCommissionRate\','+commissionRate.id+');">'
						+'Update'
					+'</a>'
				+'</div>'
			+'</td>'
		+'</tr>'
	});
	return html;
}

// commissionRateLogsContentModal()
function getCommissionRateLogsPartner(id){
	if($("#commissionRateLogs").length>0){
		$("#commissionRateLogs").remove();
	}
	$("body").append(commissionRateLogsContentModal())
	var data=commissionRateLogsPartner(id);
	var html=getCommissionRateLogsContentPartner(id, data);
	$('#commissionRateLogsTable > tbody').html(html);
	// $(".datepicker").datepicker({
	// 	autoclose: true,
	// 	format: 'M d, yyyy',
	// });
	$("#commissionRateLogs").modal("show");
}
function getCommissionRateLogsContentPartner(id, data){
	var html = '';
	$.each(data.commissionRates, function(k,commissionRate){
		html+=
		'<tr class="td-border-design border-color-gray" commissionRateId="'+commissionRate.id+'">'
			+'<td class="border-width-1">'+(k+1)+'</td>'
			+'<td class="border-width-1">'+(commissionRate.standardName == "" ? "All" : commissionRate.standardName)+'</td>'
			+'<td class="border-width-1">'+(commissionRate.learningProgramValue == "" ? "All" : commissionRate.learningProgramValue)+'</td>'
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

function getFeeStructureContent(){
	var gradesArr = ["KG","1","2","3","4","5","6","7","8","9","10","11","12"]
	var html =
		`<div class="tab-pane p-4" id="feeStructure" role="tabpanel">
			<div class="d-flex align-items-center" style="gap: 10px;">
				<select class="p-2 rounded form-control mb-4" style="width:20%" id="feeStructureLearningProgram" onchange="selectCourseProvider();"></select>
				<select class="p-2 rounded form-control mb-4" style="width:20%" id="feeStructurecourseProvider"></select>
				<button class="btn btn-lg btn-primary d-flex ml-auto" style="font-size:16px;" onclick="getStandardFee(\'fromButton\');">Get data</button>
			</div>
			<div class="overflow-auto" style="height:70vh;">
				<table id="feeStructureTable" class="table table-bordered">`
					+feeStructureTableHead()
					+feeStructureTableBody(gradesArr)
				html+=`</table>
			</div>
			<div class="full text-right">
				<button class="btn btn-lg btn-primary d-flex ml-auto mt-3" style="font-size:16px;" onclick="saveStandardFee();">Save</button>
			</div>
		</div>`
	return html;
}

function feeStructureTableHead(){
	var html=
		`<style>
			#feeStructureTable input, #feeStructureTable select {
				font-size: 12px;
			}
		</style>
		<thead class="position-sticky" style="top:0;z-index:10;">
			<tr class="bg-primary text-white text-center">
				<th>Grade</th>
				<th>Reg. Fee</th>
				<th style="width:70px;">Reserve a seat</th>
				<th>Prog Disc</th>
				<th>Course Fee</th>
				<th>Annual Discount</th>
				<th style="width:70px;">Min Credit</th>
				<th>FT</th>
				<th>CR</th>
				<th>ADV</th>
				<th>HON</th>
				<th>AP</th>
				<th>Action</th>
			</tr>
		</thead>`
	return html;
}
function feeStructureTableBody(gradesArr){
	var html=
		`<tbody>
			<tr class="bg-light text-dark">
				<td class="p-0" colspan="7"></td>
				<td class="p-0">
					<div class="w-50 text-center float-left border-right border-white">1</div>
					<div class="w-50 text-center float-left">1/2</div>
				</td>
				<td class="p-0">
					<div class="w-50 text-center float-left border-right border-white">1</div>
					<div class="w-50 text-center float-left">1/2</div>
				</td>
				<td class="p-0">
					<div class="w-50 text-center float-left border-right border-white">1</div>
					<div class="w-50 text-center float-left">1/2</div>
				</td>
				<td class="p-0">
					<div class="w-50 text-center float-left border-right border-white">1</div>
					<div class="w-50 text-center float-left">1/2</div>
				</td>
				<td class="p-0">
					<div class="w-50 text-center float-left border-right border-white">1</div>
					<div class="w-50 text-center float-left">1/2</div>
				</td>
				<td class="p-0"></td>
			</tr>`
			$.each(gradesArr, function(index, grades){
				html+=
				`<tr id="tr_${grades}">
					<td>${grades}</td>
					<td>
						<input type="hidden" id = "id_${index}" value="" />
						<input type="text" class="p-0 text-center form-control" onclick="clickedOnThis(this);" oninput="allowOnlyNumbers(this)" onblur="tempFunction('regFee_${index}')"  id = "regFee_${index}" />
					</td>
					<td>
						<input type="text" class="p-0 text-center form-control" onclick="clickedOnThis(this);" oninput="allowOnlyNumbers(this)" onblur="tempFunction('bae_${index}')" id = "bae_${index}" />
					</td>
					<td>
						<input type="text" class="p-0 text-center form-control" onclick="clickedOnThis(this);" oninput="allowOnlyNumbers(this)" onblur="tempFunction('progDisc_${index}')" id="progDisc_${index}" />
					</td>
					<td>
						<input type="text" class="p-0 text-center form-control" onclick="clickedOnThis(this);" oninput="allowOnlyNumbers(this)" onkeyup="calculateFee('${index}');" onblur="tempFunction('courseFee_${index}')" id="courseFee_${index}"/>
					</td>
					<td>
						<input type="text" class="p-0 text-center form-control" onclick="clickedOnThis(this);" oninput="allowOnlyNumbers(this)" onkeyup="calculateFee('${index}');" onblur="tempFunction('annualDiscount_${index}')" id="annualDiscount_${index}" /> 
					</td>
					<td>
						<select type="text" class="p-0 text-center form-control" onclick="clickedOnThis(this);" oninput="allowOnlyNumbers(this)" onblur="tempFunction('minCredit_${index}')" onchange="calculateFee('${index}')" id="minCredit_${index}">
							<option value="" selected>Credit</option>
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
							<option value="6">6</option>
							<option value="7">7</option>
							<option value="10">10</option>
							<option value="20">20</option>
							<!-- change in DB also if changing in the options-->
						</select>
					</td>
					<td>
						<div class="d-flex" style="gap:6px;">
							<input type="text" class="p-0 text-center form-control" onclick="clickedOnThis(this);" oninput="allowOnlyNumbers(this)" onblur="tempFunction('ftFull_${index}');" id="ftFull_${index}" />
							<input type="text" class="p-0 text-center form-control" onclick="clickedOnThis(this);" oninput="allowOnlyNumbers(this)" onblur="tempFunction('ftHalf_${index}')" id="ftHalf_${index}" />
						</div>
					</td> 
					<td>
						<div class="d-flex" style="gap:6px;">
							<input type="text" class="p-0 text-center form-control" onclick="clickedOnThis(this);" oninput="allowOnlyNumbers(this)" onblur="tempFunction('crFull_${index}')" id="crFull_${index}" />
							<input type="text" class="p-0 text-center form-control" onclick="clickedOnThis(this);" oninput="allowOnlyNumbers(this)" onblur="tempFunction('crHalf_${index}')" id="crHalf_${index}" />
						</div>
					</td>
					<td>
						<div class="d-flex" style="gap:6px;">
							<input type="text" class="p-0 text-center form-control" onclick="clickedOnThis(this);" oninput="allowOnlyNumbers(this)" onblur="tempFunction('advFull_${index}')" id="advFull_${index}" />
							<input type="text" class="p-0 text-center form-control" onclick="clickedOnThis(this);" oninput="allowOnlyNumbers(this)" onblur="tempFunction('advHalf_${index}')" id="advHalf_${index}" />
						</div>
					</td>
					<td>
						<div class="d-flex" style="gap:6px;">
							<input type="text" class="p-0 text-center form-control" onclick="clickedOnThis(this);" oninput="allowOnlyNumbers(this)" onblur="tempFunction('honFull_${index}')" id="honFull_${index}" />
							<input type="text" class="p-0 text-center form-control" onclick="clickedOnThis(this);" oninput="allowOnlyNumbers(this)" onblur="tempFunction('honHalf_${index}')" id="honHalf_${index}" />
						</div>
					</td>
					<td>
						<div class="d-flex" style="gap:6px;">
							<input type="text" class="p-0 text-center form-control" onclick="clickedOnThis(this);" oninput="allowOnlyNumbers(this)" onblur="tempFunction('apFull_${index}')" id="apFull_${index}" />
							<input type="text" class="p-0 text-center form-control" onclick="clickedOnThis(this);" oninput="allowOnlyNumbers(this)" onblur="tempFunction('apHalf_${index}')" id="apHalf_${index}" />
						</div>
					</td>
					<td>
						<div class="d-flex" style="gap:6px;">
							<button class="btn btn-sm btn-primary" onclick="disabledEnableRow('tr_${grades}','${index}')">Edit</button>
							<button class="btn btn-sm btn-outline-primary" onclick="getLogData('${index}')">Logs</button>
							${/*<button class="btn btn-sm btn-outline-primary" onclick="openFeeStructureLogsModal()">Logs</button>*/''}
						</div>
					</td>
				</tr>`
			})
		html+=`</tbody>`
	return html;
}

function getOfficeContactDetailsContent(){
	var html=
		`<div class="tab-pane p-4" id="officeContactDetails" role="tabpanel">
			<div class="col-xl-5 mx-auto">
				<div class="p-1 bg-light-primary border border-primary rounded-10 card">
					<form class="col-12 mt-2 mb-2" method="post" id="officeContactDetailsForm" action="javascript:void(0);">
						<input type="hidden" name="officeContactNumberCountryCode" id="officeContactNumberCountryCode" value="" class="form-control" maxlength="100">
						<input type="hidden" name="officeContactNumberDailCode" id="officeContactNumberDailCode" value="" class="form-control" maxlength="100">
						<input type="hidden" name="supportNumberCountryCode" id="supportNumberCountryCode" value="" class="form-control" maxlength="100">
						<input type="hidden" name="supportNumberDailCode" id="supportNumberDailCode" value="" class="form-control" maxlength="100">
						<div class="row">
							<div class="col-12 mb-2">
								<label class="m-0">School Name
									<sub class="text-danger">*</sub>
								</label>
								<input type="text" name="schoolName" id="schoolName" value="" maxlength="100" class="form-control">
							</div>
							<div class="col-12 mb-2">
								<label class="m-0">School Email
									<sub class="text-danger">*</sub>
								</label>
								<input type="email" name="officeContactEmail" id="officeContactEmail" value="" class="form-control" maxlength="100">
							</div>
							<div class="col-12 mb-2">
								<label class="m-0">
									<span>School Contact Number</span>
									<sub class="text-danger">*</sub>
									<span class="ml-2 font-12">Enabled on WhatsApp? <input type="checkbox" id="officeContactNumWtsCheck" /></span>
								</label>
								<input type="text" name="officeContactNumber" id="officeContactNumber" value="" class="form-control" maxlength="15" onkeydown="return M.digit(event);">
							</div>
							<div class="col-12 mb-2">
								<label class="m-0">School Support Email
									<sub class="text-danger">*</sub>
								</label>
								<input type="email" name="supportEmail" id="supportEmail" value="" class="form-control" maxlength="100">
							</div>
							<div class="col-12 mb-2">
								<label class="m-0">
									<span>School Support Number</span>
									<sub class="text-danger">*</sub>
									<span class="ml-2 font-12">Enabled on WhatsApp? <input type="checkbox" id="supportNumWtsCheck" /></span>
								</label>
								<input type="text" name="supportNumber" id="supportNumber" value="" class="form-control" maxlength="15" onkeydown="return M.digit(event);">
							</div>
							
							<div class="col-12 mb-2">
								<label class="m-0">School Timezone
									<sub class="text-danger">*</sub>
								</label>
								<select id="schoolTimezone" class="form-control">
								</select>
							</div>
							<div class="col-12 mb-2">
								<label class="m-0">School Website
									<sub class="text-danger">*</sub>
								</label>
								<input type="text" name="schoolWebsite" id="schoolWebsite" value="" class="form-control" maxlength="100">
							</div>
							<div class="col-12 mb-2">
								<label class="m-0">Country
									<sub class="text-danger">*</sub>
								</label>
								<select id="officeCountryId" onchange="getState();" class="form-control">
								</select>
							</div>
							<div class="col-12 mb-2">
								<label class="m-0">State
									<sub class="text-danger">*</sub>
								</label>
								<select id="officeStateId" onchange="getCity();" class="form-control">
								</select>
							</div>
							<div class="col-12 mb-2">
								<label class="m-0">City
									<sub class="text-danger">*</sub>
								</label>
								<select id="officeCityId" class="form-control">
								</select>
							</div>
							<div class="col-12 mb-2">
								<label class="m-0">Contact Us Page
									<sub class="text-danger">*</sub>
								</label>
								<input type="text" name="officeContactUs" id="officeContactUs" value="" class="form-control" maxlength="100">
							</div>
							<div class="col-12 mb-2">
								<label class="m-0">Facebook</label>
								<input type="text" name="officeFacebook" id="officeFacebook" value="" class="form-control" maxlength="100">
							</div>
							<div class="col-12 mb-2">
								<label class="m-0">Instagram</label>
								<input type="text" name="officeInsta" id="officeInsta" value="" class="form-control" maxlength="100">
							</div>
							<div class="col-12 mb-2">
								<label class="m-0">LinkedIn</label>
								<input type="text" name="officeLinkedin" id="officeLinkedin" value="" class="form-control" maxlength="100">
							</div>
							<div class="col-12 mb-2">
								<label class="m-0">X (Twitter)</label>
								<input type="text" name="officeX" id="officeX" value="" class="form-control" maxlength="100">
							</div>
							<div class="col-12 mb-2">
								<label class="m-0">Youtube</label>
								<input type="text" name="officeYoutube" id="officeYoutube" value="" class="form-control" maxlength="100">
							</div>
							<div class="col-12 mb-2">
								<label class="m-0">
									<span>School Admin Email (for creating school account)</span>
									<sub class="text-danger">*</sub>
									${/*<span class="ml-1 font-12">(for creating school account)</span>*/''}
								</label>
								<input type="email" name="superAdminEmail" id="superAdminEmail" value="" class="form-control" maxlength="100" disabled="true">
							</div>
							<div class="col-12 mb-2 mt-1">
								<label class="m-0">
									<span>School Address</span>
									<sub class="text-danger">*</sub>
								</label>
								<input type="text" placeholder="Enter your Address" name="officeAddres" id="officeAddres" value="" class="form-control" maxlength="100">
							</div>
							
							${/*<div class="col-12">
								<label class="full mb-0">School Logo</label>
								<div class="full upload-item-wrapper clone-item">
									<div class="upload-btn-wrapper mt-1 upload-item d-flex justify-content-center align-items-center bg-white rounded">
										<div class="uploaded-file valid-field valid-check w-100" id="logoUploadSpan1" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;padding-left: 5px;">Upload School Logo</div>
										<input class="file-input" type="file" name="logoUpload" id="logoUpload" fileType="51" elem-id="1" onchange="uploadDocsFun(this, 'schoolLogo');">
										
										<input class="file-input" type="file" name="logoUpload" id="logoUpload" onchange="cropImage(event, 'logoUpload', 'logoImagePartner', 'Logo Image', '')">
										<img id="logoImagePartner" name="logoImagePartner" class="user " src="${PATH_FOLDER_IMAGE}profile-picture.jpg${SCRIPT_VERSION}" alt="image" title="Logo Image" thumbType=""/>
										
										<span class="upload-btn primary-txt-color w-25 ml-2 border-left rounded">
											<i class="fa fa-upload"></i>
										</span>
									</div>
								</div>
							</div>*/''}
							<div class="col-12 text-right">
								<button type="button" id="createUpdatePartnerContactBtn" onclick="getUpdateOfficeContentDetails('officeContactDetailsForm')" class="btn btn-primary btn-shadow float-right pr-4 pl-4" id="updateOfficeContactDetails">Create</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>`
	return html;
}

var originalLearningProgramMap = {};
var updateLearningProgramMap = {};
function enrollRegContent(data) {
	var html = `<div class="col-xl-5 mx-auto"> <div class="p-2 border border-primary rounded-10 card">`;

	$.each(data, function (index, item) {
		const label = item.learningProgramLabel;
		const key = item.learningProgram;
		const enrollmentFor = item.enrollmentFor;
		const status = item.learningProgramStatus;
		const isEven = index % 2 !== 0;
		const bgClass = isEven ? 'bg-light-primary' : '';
		const isChecked = status === 'Y' ? 'checked' : '';

		originalLearningProgramMap[key] = {
			status: status,
			enrollmentFor: enrollmentFor
		};

		html += `
			<div class="d-flex justify-content-between align-items-center p-2 rounded-10 ${bgClass}">
				<h6 class="mb-0 font-weight-bold">${label}</h6>
				
				${status === 'Y' ? `
					<div class="partnerProgressBar mx-3 flex-grow-1" style="display: none;">
						<div class="d-flex align-items-center">
							<span class="partnerProgressText text-primary font-weight-bold small mr-2">0% Complete</span>
						</div>
						<div class="progress px-0" style="height: 10px;">
							<div class="progress-bar bg-primary" role="progressbar" style="width: 0%;" 
								aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
							</div>
						</div>
					</div>` : ''}
				
				<div class="d-lg-inline-block">
					<label class="switch">
						<input 
							class="switch-input" 
							type="checkbox" 
							data-key="${key}" 
							data-enroll="${enrollmentFor}" 
							${isChecked}
							onchange="trackProgramChange(this)"
						>
						<span class="switch-label" data-on="Yes" data-off="No"></span>
						<span class="switch-handle"></span>
					</label>
				</div>
			</div>`;
	});

	html += `
		<div class="d-flex justify-content-end align-items-center ml-auto">
			<button id="syncCoursesAndSubjectsBtn" type="button" class="btn btn-success btn-shadow w-max pr-4 pl-4 my-3 mr-2" style="display: none;" onclick="syncCoursesAndSubjects();">Sync Courses & Subjects</button>
			<button id="updateLearningProgramsPartnerBtn" type="button" class="btn btn-primary btn-shadow w-max pr-4 pl-4 my-3" onclick="updateLearningProgramsPartner()">Save</button>
		</div>
	</div></div>`;
	return html;
}

function paymentOptionsContent() {
	const items = [
		{ label: 'bank transfer', title: 'WIRETRANSFER' },
		{ label: 'cash', title: 'CASH' },
		{ label: 'payment gateway', title: 'PAYMENTGATEWAY' }
	];
	
	var html = `
		<div class="tab-pane p-4" id="paymentOptions" role="tabpanel">
			<div class="col-xl-5 mx-auto">
				<div class="p-2 border border-primary rounded-10 card">`;
					$.each(items, function (index, item) {
						const isEven = index % 2 !== 0;
						const bgClass = isEven ? 'bg-light-primary' : '';
						html += 
						`<div class="d-flex justify-content-between align-items-center p-2 rounded-10 ${bgClass}">
							<h6 class="mb-0 font-weight-bold">${item.label.charAt(0).toUpperCase() + item.label.slice(1)}</h6>
							<div class="d-lg-inline-block">
								<label class="switch">
									<input class="switch-input classPayment${index}" id="${item.title}" type="checkbox" onchange="checkboxChecker(this);">
									<span class="switch-label" data-on="Yes" data-off="No"></span>
									<span class="switch-handle"></span>
								</label>
							</div>
						</div>`;
						if (item.title == 'PAYMENTGATEWAY') {
							html += `
							<div id="paymentGatewaysDiv" class="pl-2 mt-1 mb-3" style="display:none;">
								<div class="bg-light-primary py-2 px-3 rounded-10 d-flex flex-column" style="gap:10px;">
									
									<div class="d-flex justify-content-between align-items-center">
										<h6 class="m-0">Stripe</h6>
										<label class="switch m-0">
											<input class="switch-input" id="stripePaymentMode" type="checkbox">
											<span class="switch-label" data-on="Yes" data-off="No"></span>
											<span class="switch-handle"></span>
										</label>
									</div>

									<div class="d-flex justify-content-between align-items-center">
										<h6 class="m-0">Airwallex</h6>
										<label class="switch m-0">
											<input class="switch-input" id="airwallexPaymentMode" type="checkbox">
											<span class="switch-label" data-on="Yes" data-off="No"></span>
											<span class="switch-handle"></span>
										</label>
									</div>

									<div class="d-flex justify-content-between align-items-center">
										<h6 class="m-0">Other</h6>
										<label class="switch m-0">
											<input class="switch-input" id="otherPaymentMode" type="checkbox">
											<span class="switch-label" data-on="Yes" data-off="No"></span>
											<span class="switch-handle"></span>
										</label>
									</div>

								</div>
								<p id="textPayment" class="my-1 text-primary ml-2" style="display:none;">
									Please Contact IT for additional payment gateway integration. Cost will be applicable.
								</p>
							</div>`;
						}
					});

					html += 
					`<button type="button" class="btn btn-primary btn-shadow w-max ml-auto pr-4 pl-4 my-3" id="updatePaymentOptions" onclick="updateEnrollmentPartnerPaymentDetails()">Save</button>
				</div>
			</div>
		</div>`;
	return html;
}

function cropModalContent(){
	var html=
	 	`<div class="modal fade crop-modal" id="cropModal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true" data-backdrop="static">
			<div class="modal-dialog modal-lg" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="modalLabel">Crop the image</h5>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body">
						<div class="img-container">
							<img id="cropModalImg" src="https://avatars0.githubusercontent.com/u/3456749">
						</div>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
						<button type="button" class="btn btn-primary" id="crop">Crop</button>
						<button type="button" class="btn btn-primary" onclick="rotateImage()">Rotate</button>
					</div>
				</div>
			</div>
		</div>`
	return html
}

function feeStructureLogsModal(changesArr){
	changesArr = [
		{	
			value: "Reg Fee",
			oldValue: "hehe",
			newValue: "hehehe"
		}
	];
	var html =
		`<div id="feeStructureLogsModal" class="modal right-slide-modal fade" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" data-backdrop="static">
			<div class="modal-dialog modal-xl">
				<div class="modal-content border-0">
					<div class="modal-header py-0 text-white card-header card-header-tabe text-dark " style="height:3.5rem !important;">
						<h5 class="font-weight-bold">Fee Structure Logs</h5>
						<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">×</span>
						</button>
					</div>
					<div class="modal-body p-0 overflow-auto pt-4 px-3">
						<table id="feeStructureLogsTable" class="table table-bordered">
							<thead class="position-sticky" style="top:0;z-index:10;">
								<tr class="bg-primary text-white text-center">
									<th>S.No.</th>
									<th>Value Changed</th>
									<th>Old Values</th>
									<th>New Values</th>
								</tr>
							</thead>
							<tbody>`
								$.each(changesArr, function(index, item){
									html+=
									`<tr>
										<td>${index + 1}</td>
										<td>${item.value}</td>
										<td>${item.oldValue}</td>
										<td>${item.newValue}</td>
									</tr>`
								})
							html+=`</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>`;
	return html;
}





function feeStructureLogsModal(){
	var html=
		`<div id="feeStructureLogsModal" class="modal right-slide-modal fade" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" data-backdrop="static">
			<div class="modal-dialog modal-xl">
				<div class="modal-content border-0 ml-auto">
					<div class="modal-header py-2 bg-primary text-white">
						<h5 class="modal-title">Fee Structure Logs</h5>
						<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body overflow-auto">
						
					</div>
				</div>
			</div>
		</div>`
	return html;
}
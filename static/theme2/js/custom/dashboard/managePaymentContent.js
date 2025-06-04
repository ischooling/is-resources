function getAddPaymentSearchResult(data) {
	var html = '';
	$.each(data.results, function (k, v) {
		html +=
			'<tr>'
			+ '<td>' + v.fullName + '</td>'
			+ '<td>' + v.studentStringId + '</td>'
			+ '<td>' + v.email + '</td>'
			+ '<td>' + v.standard + '</td>'
			+ '<td>';
			if(v.fullName!='' && v.standard!=null){
				html+= '<a id="addPaymentId" class="btn btn-info btn-sm m-0 text-white" onClick="addPayment(\'addStudentPaymentForm\',\'' + v.email + '\',' + v.studentStandardId +',\''+v.advanceOrCustom+'\', true, \''+v.eligibleForAdvance+'\')">&nbsp;Add Payment</a>';
				if (v.advanceOrCustom == 'C') {
					var url = '/dashboard/fee-calculation/?type=C&studentStandardId=' + v.studentStandardId;
					html += '<a class="btn btn-info btn-sm m-0 text-white" href="javascript:void(0)" onClick="getAsPost(' + "'" + url + "'" + ')">&nbsp;Custom Payment Details</a>';
				} else if (v.advanceOrCustom == 'A') {
					var url = '/dashboard/fee-calculation/?type=A&studentStandardId=' + v.studentStandardId;
					html += '<a class="btn btn-info btn-sm m-0 text-white" href="javascript:void(0)" onClick="getAsPost(' + "'" + url + "'" + ')">&nbsp;Advance Payment Details</a>';
				}
			}else{
				html+='Not eligible for Add payment';
			}
			html += '</td>'
			+ '</tr>';
	});
	return html;
}

function getAdvancePaymentSearchResult(formId, data) {
	roleAndModule = getUserRights(SCHOOL_ID, USER_ROLE_ID, USER_ID, moduleId);
	var html = '';
	$.each(data.advancePaymentSearchResponseDTO, function (k, apsrSingle) {
		html += '<tr id="row_'+k+'">'
			+ '<td>' + apsrSingle.serialNum + '</td>'
			+ '<td>'
			+ '<span>';
		if (null != apsrSingle.shareLink && apsrSingle.shareLink != '') {
			html += '<input type="text" id="copyId' + apsrSingle.serialNum + '" style="float:right; opacity:0; height:0;padding:0;" value="' + apsrSingle.shareLink + '">'
				+ '<div class="d-flex align-items-center mb-3">'
				+ '<a href="javascript:void(0)" class="btn btn-primary btn-sm" onclick="copyToClipboardNew(\'copyId' + apsrSingle.serialNum + '\', \'copy-message' + apsrSingle.serialNum + '\')"><i class="fa fa-clone" aria-hidden="true">Copy Payment Link</i></a>'
				+ '<span id="copy-message' + apsrSingle.serialNum + '" style="display:block; color: green; margin-left: 6px; font-weight:600;"></span>'
				+ '</div>'
		}
		html += '<strong>Trans. Ref. No.:</strong>' + apsrSingle.transactionRefNumber + '<br>'
			+ '<strong>User Ref. No.:</strong>' + apsrSingle.userRefNumber + '<br>';
		if (null != apsrSingle.signupUrl && apsrSingle.signupUrl != '') {
			html += '<input type="text" id="signupCopyId' + apsrSingle.serialNum + '" style="float:right; opacity:0; height:0;padding:0;" value="' + apsrSingle.signupUrl + '">'
				+ '</br><a href="javascript:void(0)" class="btn btn-primary btn-sm" onclick="copyToClipboard(\'signupCopyId' + apsrSingle.serialNum + '\')"><i class="fa fa-clone" aria-hidden="true">Copy Signup Url</i></a>';
		}
		html += '</span>'
			+ '</td>'
			+ '<td>'
			+ '<span>'
			+ '<strong>Student ID:</strong>' + apsrSingle.studentRollNumber + '<br>'
			+ '<strong>Name:</strong>' + apsrSingle.studentName + '<br>'
			+ '<strong>Email:</strong>' + apsrSingle.studentEmail + '<br>'
			+ '<strong>Grade:</strong>' + apsrSingle.gradeName + '<br>'
			+ '<strong>Learning Program:</strong>' + apsrSingle.registrationType + '<br>'
			+ '<strong>LMS Platform:</strong>' + apsrSingle.lmsPlatform + '<br>'
			+ '</span>'
			+ '</td>'
			+ '<td>'
			+ '<span>'
			+ '<strong>Plan Name:</strong>' + apsrSingle.planName + '<br>'
			+ '<strong>Payment Name:</strong>' + apsrSingle.paymentName + '<br>'
			+ '<strong>Payment Title:</strong>' + apsrSingle.paymentTitleLabel + '<br>'
			+ '<strong>Scheduled Payment Date:</strong>' + apsrSingle.scheduledPayDate + '<br>'
			+ '<strong>Payment Date:</strong>' + apsrSingle.payDate
			+ '</span>'
			+ '</td>'
			+ '<td>'
			+ '<span>'
			+ '<strong>Payment Amount:</strong>' + apsrSingle.payAmount + '<br>'
			+ '<strong>Additional Amount:</strong>' + apsrSingle.additionalPayment + '<br>';
		if (null != apsrSingle.selectedCurrency && apsrSingle.selectedCurrency != '') {
			html += '<strong>Selected Currency:</strong>' + apsrSingle.selectedCurrency + '-' + apsrSingle.payCurrency + '(' + apsrSingle.conversionRation + ')<br>';
		}
		html += '<strong>Payment Via:</strong>' + apsrSingle.paymentTransferType + '<br>';
		if(apsrSingle.pgName.toLowerCase() == 'WIRETRANSFER'.toLowerCase()){
			html += '<strong>Payment Gateway Used:</strong>' + 'Bank Transfer';
		}else if(apsrSingle.pgName.toLowerCase() == 'CASH'.toLowerCase()){
			html += '<strong>Payment Gateway Used:</strong>' + 'Cash';
		}else{
			html += '<strong>Payment Gateway Used:</strong>' + apsrSingle.pgName;
		}
	html += '</span>'
			+ '</td>'
			+ '<td>'
			+ '<span>';
		if (apsrSingle.paymentStatus == 'SUCCESS') {
			html += '<i id="payment-status-' + apsrSingle.serialNum + '" class="fa fa-check text-success"></i><span id="payment-status-message-' + apsrSingle.serialNum + '">&nbsp;' + apsrSingle.paymentStatus + '</span><br>';
		} else if (apsrSingle.paymentStatus == 'SCHEDULED') {
			html += '<i id="payment-status-' + apsrSingle.serialNum + '" class="fa fa-calendar-check-o text-success"></i><span id="payment-status-message-' + apsrSingle.serialNum + '">&nbsp;' + apsrSingle.paymentStatus + '</span><br>';
		} else if (apsrSingle.paymentStatus == 'INITIATED') {
			html += '<i id="payment-status-' + apsrSingle.serialNum + '" class="fa fa-hourglass-start text-success"></i><span id="payment-status-message-' + apsrSingle.serialNum + '">&nbsp;' + apsrSingle.paymentStatus + '</span><br>';
		} else if (apsrSingle.paymentStatus == 'REJECTED') {
			html += '<i id="payment-status-' + apsrSingle.serialNum + '" class="fa fa-times text-success"></i><span id="payment-status-message-' + apsrSingle.serialNum + '">&nbsp;' + apsrSingle.paymentStatus + '</span><br>';
		}
		html += '<strong>Receipt:</strong>';
		if (apsrSingle.recieptLink != 'N/A') {
			html += '<a href="' + apsrSingle.recieptLink + '" target="_blank" class="btn btn-outline-info"><i class="fa fa-eye"></i>&nbsp;View Receipt </a>';
			if (SCHOOL_ID == 1) {
				html += '<a href="' + apsrSingle.recieptLink + '&withStamp=Y" target="_blank" class="btn btn-outline-info"><i class="fa fa-eye"></i>&nbsp;View Receipt with Authorized Signatory and School Stamp </a>';
			}
		} else {
			html += apsrSingle.recieptLink;
		}
		html += '<br>';
		if ($("#" + formId + " #paymentGateway").select2('val') == 'CONVERA') {
			html += '<strong>Convera Pay Status:</strong>';
			if (apsrSingle.wurecieptLink != 'N/A') {
				html += '<a href="' + apsrSingle.wurecieptLink + '" target="_blank" ><i class="fa fa-eye"></i>&nbsp;Convera Pay Receipt </a>';
			} else {
				html += apsrSingle.wurecieptLink;
			}
			html += '<br>';
		}
		html += '<strong>Proof of Payment:';
		if (apsrSingle.paymentTransferType != 'Credit Card/Debit Card') {
			html += '</strong>' + apsrSingle.proofOfPayment + '<br>';
		} else if (apsrSingle.pgName == 'CASH') {
			html += '</strong>' + apsrSingle.proofOfPayment + '<br>';
		}else {
			html += 'N/A';
		}
		html += '</span>'
			+ '</td>'
			+ '<td>'
				+ '<span>'
					+'<strong>Added By:</strong>' + apsrSingle.paymentAddedBy + '<br>'
					+'<strong>Updated By:</strong>' + apsrSingle.paymentUpdatedBy + '<br>'
					+'<strong>Remarks:</strong><span id="remarks-' + apsrSingle.serialNum + '">' + apsrSingle.remarks + '</span><br>'
					+ '<strong>Review Payment:</strong><span id="review-' + apsrSingle.serialNum + '">';
					if (apsrSingle.paymentTransferType != 'Credit Card/Debit Card' && apsrSingle.paymentStatus == 'INITIATED' && (roleAndModule.updated == 'Y' || roleAndModule.added == 'Y')) {
						html += '<a onclick="return showPaymentRemarksModal(\'paymentRemarksForm\',\'STUDENT\',' + apsrSingle.userId + ',' + apsrSingle.userPaymentDetailsId + ',\'' + apsrSingle.studentName + '\',\'' + apsrSingle.paymentTitleLabel + '\',' + apsrSingle.serialNum + ');" href="javascript:void(0);">Review </a>';
					} else if(apsrSingle.pgName == 'CASH' && apsrSingle.paymentStatus == 'INITIATED' && (roleAndModule.updated == 'Y' || roleAndModule.added == 'Y')){
						html += '<a onclick="return showPaymentRemarksModal(\'paymentRemarksForm\',\'STUDENT\',' + apsrSingle.userId + ',' + apsrSingle.userPaymentDetailsId + ',\'' + apsrSingle.studentName + '\',\'' + apsrSingle.paymentTitleLabel + '\',' + apsrSingle.serialNum + ');" href="javascript:void(0);">Review </a>';
					}else {
						html += ' - ';
					}
			html += '</span>'
			+ '</td>'
		+ '<td>';
		html += '<span class="btn btn-sm btn-primary" onclick="showPaymentPopup(' + apsrSingle.userPaymentDetailsId + ',\'V\');">View</span>';
		if (roleAndModule.added == 'Y' || roleAndModule.updated == 'Y') {
			if(apsrSingle.paymentTitle=='CUSTOMIZED_REGISTRATION_SUBJECT_FEE' 
				|| apsrSingle.paymentTitle=='CUSTOMIZED_SUBJECT_FEE'
				){
				if(apsrSingle.standardStatus==1){
					html += '<span class="btn btn-sm btn-primary" onclick="return showWarningMessage(\'This is a customized payment plan. Would you like to make changes?\',\'getAsPost(\\\'/dashboard/fee-calculation/?type=C&studentStandardId='+ apsrSingle.studentStandardId + '\\\')\'); ">Edit Custom Payment</span>';
				}else if(apsrSingle.standardStatus==0){
					var eligibleForEdit=false;
					if (apsrSingle.paymentStatus != 'SUCCESS') {
						eligibleForEdit=true;
					}else{
						if(USER_ROLE=='DIRECTOR'){
							eligibleForEdit=true;
						}
					}
					if(eligibleForEdit){
						html += '<span class="btn btn-sm btn-primary" onclick="showPaymentPopup(' + apsrSingle.userPaymentDetailsId + ',\'E\');">Edit</span>';
					}
				}
			}else if(apsrSingle.paymentTitle=='REGISTRATION_SUBJECT_FEE_ADV' 
				|| apsrSingle.paymentTitle=='SUBJECT_FEE_ADV'
				){
				var eligibleForEdit=false;
				if(apsrSingle.standardStatus==3){
					html += '<span class="btn btn-sm btn-primary" onclick="return showWarningMessage(\'This is a advanced payment plan. Would you like to make changes?\',\'getAsPost(\\\'/dashboard/fee-calculation/?type=A&studentStandardId='+ apsrSingle.studentStandardId + '\\\')\'); ">Edit Advance Payment</span>';
				}else if(apsrSingle.standardStatus==0){
					if (apsrSingle.paymentStatus != 'SUCCESS') {
						eligibleForEdit=true;
					}else{
						if(USER_ROLE=='DIRECTOR'){
							eligibleForEdit=true;
						}
					}
				}
				if(eligibleForEdit){
					html += '<span class="btn btn-sm btn-primary" onclick="showPaymentPopup(' + apsrSingle.userPaymentDetailsId + ',\'E\');">Edit</span>';
				}
			}else if(apsrSingle.paymentTitle=='REGISTRATION_SUBJECT_FEE' 
				|| apsrSingle.paymentTitle=='SUBJECT_FEE'
				){
				var eligibleForEdit=false;
				if(apsrSingle.standardStatus==0){
					if (apsrSingle.paymentStatus != 'SUCCESS') {
						eligibleForEdit=true;
					}else{
						if(USER_ROLE=='DIRECTOR'){
							eligibleForEdit=true;
						}
					}
				}else{
					html += '<span class="btn btn-sm btn-primary" onclick="return showWarningMessage(\'Once you create a custom payment, it can not be changed. If you need to make changes, you will have to create a new one. Would you like to continue?\',\'getAsPost(\\\'/dashboard/fee-calculation/?type=C&studentStandardId='+ apsrSingle.studentStandardId + '\\\')\'); ">Create Custom Payment</span>';
				}
				if(eligibleForEdit){
					html += '<span class="btn btn-sm btn-primary" onclick="showPaymentPopup(' + apsrSingle.userPaymentDetailsId + ',\'E\');">Edit</span>';
				}
			}else{
				var eligibleForEdit=false;
				if (apsrSingle.paymentStatus != 'SUCCESS') {
					eligibleForEdit=true;
				}else{
					if(USER_ROLE=='DIRECTOR'){
						eligibleForEdit=true;
					}
				}
				if(eligibleForEdit){
					html += '<span class="btn btn-sm btn-primary" onclick="showPaymentPopup(' + apsrSingle.userPaymentDetailsId + ',\'E\');">Edit</span>';
				}
			}
		}
		if (roleAndModule.deleted == 'Y') {
			html += '<span class="btn btn-sm btn-primary" onclick="return showWarningMessage(\'Are you sure you want to delete?\',\'deletePayment(' + apsrSingle.userPaymentDetailsId + ', \\\'row_'+k+'\\\')\'); ">Delete</span>';
		}
		if (roleAndModule.added == 'Y' || roleAndModule.updated == 'Y') {
			if (apsrSingle.paymentStatus == "SUCCESS") {
				html += '<span class="btn btn-sm btn-primary"  onclick="return showWarningMessageShow(\'Are you sure you want to re-send mail?\',\'sendmail(' + apsrSingle.userPaymentDetailsId + ')\'); ">Resend Mail</span>';
			}
			if (null != apsrSingle.signupUrl && apsrSingle.signupUrl != '') {
				html += '<span class="btn btn-sm btn-primary" onclick="return mapUnregisteredUserPayment(\'mapStudentForm\',' + apsrSingle.entityId + ',' + SCHOOL_ID + ',\'STUDENT\',\'10,11,12,13,14,15,16\',\'' + apsrSingle.studentName + '\',\'' + apsrSingle.studentEmail + '\'); ">Map to Student</span>';
			}
			if (apsrSingle.isPaymentFailed != null && apsrSingle.paymentStatus != "SUCCESS") {
				html += '<span class="btn btn-sm btn-primary" onclick="return showWarningMessageShow(\'Are you sure you want to approve payment and send mails?\',\'callStudentRedirectToDashboard(' + apsrSingle.userId + ',' + apsrSingle.userPaymentDetailsId + ',\\\'Y\\\')\',false);">Approve Payment With Mail</span>';
				html += '<span class="btn btn-sm btn-primary" onclick="return showWarningMessageShow(\'Are you sure you want to approve payment witout sending mails?\',\'callStudentRedirectToDashboard(' + apsrSingle.userId + ',' + apsrSingle.userPaymentDetailsId + ',\\\'N\\\')\',false);">Approve Payment Without Mail</span>';
			}
		}
		html += '</td>'
			+ '</tr>';
	});
	return html;
}

function mapStudentModal() {
	var html =
		'<div id="mapStudentModal" class="modal fade bd-example-modal-lg fade-scale square-field" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">'
		+ '<div class="modal-dialog modal-md">'
		+ '<div class="modal-content border-0">'
		+ '<div class="modal-header theme-bg text-white">'
		+ '<h4 class="modal-title" id="exampleModalLabel">Student Payment Mapping</h4>'
		+ '<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>'
		+ '</div>'
		+ '<form action="javascript:void(0);" id="mapStudentForm" name="mapStudentForm" autocomplete="off">'
		+ '<div class="modal-body">'
		+ '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">'
		+ '<div class="form-row">'
		+ '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 mb-3">'
		+ '<p><i></i></p>'
		+ '<h3 class="text-center" id="mapToStudentId"></h3>'
		+ '<input type="hidden" id="unregistredPaymentId" name="unregistredPaymentId" value="" class="form-control">'
		+ '<input id="mapToUsers" name="mapToUsers" class="form-control" value="">'
		+ '</div>'
		+ '<div class="col-md-12">'
		+ '<button type="button" class="btn btn-sm btn-primary btn-shadow float-right pr-4 pl-4 ml-2" onclick="mapUnregisteredUserPaymentProcess(\'mapStudentForm\')">Map</button>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '</form>'
		+ '</div>'
		+ '</div>'
		+ '</div>';
	return html;
}

function getManagePaymentContent(title, roleAndModule, schoolId, userId, role) {
	var html =
		'<div class="main-card mb-3 card responsive-adv-payment">'
		+ '<div class="card-body">'
			+ '<div class="full" style="overflow-x:inherit">'
				+ '<div class="advance-serach full">';
					if (roleAndModule.viewed == 'Y') {
						html += '<a href="javascript:void(0)" class="btn btn-info" data-toggle="modal" onClick="advancePaymentSerch()"><i class="fa fa-search"></i>&nbsp;Advanced Search</a>';
					}
					if (roleAndModule.added == 'Y') {
						html += '<a href="javascript:void(0)" class="btn btn-info pull-right" onclick="addCustomPayment()">Add Payment/Custom Payment</a>';
					}
					if (SCHOOL_ID == 1) {
						if (roleAndModule.added == 'Y') {
							html += '<a href="javascript:void(0)" class="btn btn-info pull-right" onclick="addExternalPayment(\'addStudentPaymentForm\')">Add External/Unregistered Student Payment</a>';
						}
					}
					
				html +='</div>';
				if (roleAndModule.added == 'Y') {
					html+=
					 '<div class="addPayment-wrapper">'
						+ '<div class="col-md-4 col-sm-6 col-xs-12">'
							+ '<label>School Name</label>'
							+ '<select name="schoolId" id="schoolId" class="multiselect-dropdown form-control">'
								+ getSchoolContent(SCHOOL_ID)
							+ '</select>'
						+ '</div>'
						+ '<div class="col-md-4 col-sm-6 col-xs-12">'
							+ '<label>Name</label>'
							+ '<input type="text" name="firstName" id="searchName" style="text-transform:capitalize" class="form-control">'
						+ '</div>'
						+ '<div class="col-md-4 col-sm-6 col-xs-12">'
							+ '<label>Student ID</label>'
							+ '<input type="text" name="studentId" id="studentId" style="text-transform:capitalize" class="form-control">'
						+ '</div>'
						+ '<div class="col-md-4 col-sm-12 col-xs-12">'
							+ '<label>Email</label>'
							+ '<input type="text" name="firstName" id="searchEmail" class="form-control">'
						+ '</div>'
						+ '<div class="col-md-12 col-sm-12 col-xs-12 mt-2">'
							+ '<a href="javascript:void(0)" class="btn btn-info pull-right" onclick="searchStudentByNameAndEmail();">'
							+ '<i class="fa fa-search"></i>&nbsp;Search'
							+ '</a>'
						+ '</div>'
					+ '</div>'
					+ '<div class="payment-search-table mb-3" id="paymentTableSearch">'
						+ '<table class="table responsive table-bordered text-left" id="paymentTable" style="width:100%">'
							+ '<thead>'
								+ '<tr>'
									+ '<th>Name</th>'
									+ '<th>Student ID</th>'
									+ '<th>Email</th>'
									+ '<th>Grade</th>'
									+ '<th>Action</th>'
								+ '</tr>'
							+ '</thead>'
							+ '<tbody>'
							+ '</tbody>'
						+ '</table>'
					+ '</div>';
				}
				html+=
				'<div id="advance-serach-content" style="width:100%;display:inline-block;overflow-x:hidden">'
					+ '<table id="advPaymentSearch" class="table table-bordered responsive nowrap" style="width:100%">'
						+ '<thead>'
							+ '<tr>'
								+ '<th>S.No</th>'
								+ '<th>Copy link.<br>Transaction Reference No.<br>User Reference No.</th>'
								+ '<th>Student ID/Name/Email/Grade/Learning Program/LMS Platform</th>'
								+ '<th>Payment Name<br>Payment Title<br>Scheduled Payment Date<br>Payment Date</th>'
								+ '<th>Plan Name<br>Payment Amount<br>Additional Amount<br>Payment Via<br>Payment Gateway Used</th>'
								+ '<th>Payment Status<br>Receipt<br>Proof of Payment</th>'
								+ '<th>Added By<br>Updated By<br>Remarks<br>Review Payment</th>'
								+ '<th>Edit</th>'
							+ '</tr>'
						+ '</thead>'
						+ '<tbody>'
						+ '</tbody>'
					+ '</table>'
					+ '<br/>'
				+ '</div>'
			+ '</div>'
		+ '</div>'
	+ '</div>'
	+ '<div id="showEditPopupContainer"></div>'
	+ getAddPaymentModal(schoolId, roleAndModule.moduleId)
	+ getAdvancePaymentSearch(schoolId, roleAndModule.moduleId)

	+ getPaymentRemark(schoolId, moduleId)
	+ mapStudentModal();
	return html;
}

function getAddPaymentModal(schoolId, moduleId) {
	var html =
		'<div id="addPaymentModal" class="modal fade bd-example-modal-lg fade-scale square-field" tabindex="" data-backdrop="static" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">'
		+ '<div class="modal-dialog modal-lg">'
		+ '<div class="modal-content border-0">'
		+ '<div class="modal-header theme-bg text-white">'
		+ '<h4 class="modal-title" id="exampleModalLabel">Payment Details</h4>'
		+ '</div>'
		+ '<form action="javascript:void(0);" id="addStudentPaymentForm" name="addStudentPaymentForm" autocomplete="off">'
		+ '<div class="modal-body">'
		+ '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">'
		+ '<div class="form-row">'
		+ '<div class="col-lg-3 col-md-6 col-sm-12 col-xs-12" style="display:none">'
		+ '<div class="form-group mb-2 p-0">'
		+ '<label class="mb-0">Student Standard Id</label>'
		+ '<input id="studentStandardId" name="studentStandardId" type="text" class="form-control">'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-3 col-md-6 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0">'
		+ '<label class="mb-0">Student Email'
		//+'&nbsp;<a id="studentDetailsForPaymentId" href="javascript:void(0);" class="field-icon" style="position:absolute;right:8px;bottom:8px;" onclick="getStudentDetailsForPayment(\'addStudentPaymentForm\',\'true\');"> <i class="fa fa-refresh"></i></a>'
		+ '<sup class="text-danger">*</sup></label>'
		+ '<input id="studentEmail1" name="studentEmail1" type="text" class="form-control" style="padding-right:22px" onblur="getStudentDetailsForPayment(\'addStudentPaymentForm\',\'true\')">'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-3 col-md-6 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0">'
		+ '<label class="mb-0">Student Name<sup class="text-danger">*</sup></label>'
		+ '<input id="studentName1" name="studentName1" type="text" class="form-control">'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-3 col-md-6 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0">'
		+ '<label class="mb-0">Learning Program<sup class="text-danger">*</sup></label>'
		+ '<select id="learningProgram1" name="learningProgram1" class="multiselect-dropdown form-control">'
		+ '<option value="">Select Learning Program</option>'
		+ getLearningProgramContent(schoolId)
		+ '</select>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-3 col-md-6 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0">'
		+ '<label class="mb-0">Grade<sup class="text-danger hideWhenlearningProgramFlexy">*</sup></label>'
		+ '<select id="standardId1" name="standardId1" class="multiselect-dropdown form-control">'
		+ '<option value="" disabled>Select Grade*</option>'
		+ getStandardContent(schoolId, false, false)
		+ '</select>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-3 col-md-6 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0">'
		+ '<label class="mb-0">Fee Title<sup class="text-danger">*</sup></label>'
		+ '<select id="paymentType1" name="paymentType" class="multiselect-dropdown form-control">'
		// +getPaymentTitle(schoolId)
		+ '</select>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-3 col-md-6 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0">'
		+ '<label class="mb-0">Payment Name<sup class="text-danger">*</sup></label>'
		+ '<input id="paymentName1" name="paymentName1" type="text" class="form-control">'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0">'
		+ '<label class="mb-0">Alternate Payment Name</label>'
		+ '<div class="row">'
		+ '<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">'
		+ '<label style="line-height:33px; color:#000"><span id="paymentAlternateName"></span> - </label>'
		+ '</div>'
		+ '<div class="col-lg-2 col-md-2 col-sm-12 col-xs-12">'
		+ '<select id="installmentNumber1" name="installmentNumber1" class="form-control">'
		+ getIntallmentNumbre()
		+ '</select>'
		+ '</div>'
		+ '<div class="col-lg-1 col-md-1 col-sm-12 col-xs-12 p-0 text-center">'
		+ '<label style="line-height:33px; color:#000">of</label>'
		+ '</div>'
		+ '<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">'
		+ '<select id="numberOfMonth1" name="numberOfMonth1" class="form-control">'
		+ getNumberOfMonths()
		+ '</select>'
		+ '</div>'
		+ '<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 pr-0">'
		+ '<label style="line-height:33px; color:#000">Installment</label>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-2 col-md-6 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0">'
		+ '<label class="mb-0">User Reference No.</label> <input id="userRefNumber1" name="userRefNumber" type="text" class="form-control">'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-3 col-md-6 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0">'
		+ '<label class="mb-0">Fee Amount<sup class="text-danger">*</sup></label> <input id="payableAmount" name="payableAmount" type="tel" class="form-control" onkeydown="return M.floatDigit(event);">'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-3 col-md-6 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0">'
		+ '<label class="mb-0">Additional Fee</label> <input id="additionalAmount" name="additionalAmount" type="tel" class="form-control" onkeydown="return M.floatDigit(event);" disabled>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-3 col-md-6 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0">'
		+ '<label class="mb-0">Currency<sup class="text-danger">*</sup></label>'
		+ '<select id="currency1" name="currency" class="multiselect-dropdown form-control">'
		+ getCurrenciesBySchoolId(schoolId)
		+ '</select>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-3 col-md-6 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0">'
		+ '<label class="mb-0">Payment Gateway Used</label>'
		+ '<select id="paymentGateway1" name="paymentGateway" class="multiselect-dropdown form-control">'
		+ getPaymentGateway(schoolId)
		+ '</select>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-3 col-md-6 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0">'
		+ '<label class="mb-0">Status<sup class="text-danger">*</sup></label>'
		+ '<select id="status1" name="status" class="multiselect-dropdown form-control">'
		+ '<option value="0" selected >Select Status</option>'
		+ '<option value="SCHEDULED" >SCHEDULED</option>'
		+ '<option value="SUCCESS">SUCCESS</option>'
		+ '</select>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-3 col-md-6 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0">'
		+ '<label class="mb-0">Payment Date<sup class="text-danger hideWhenStatusScheduled">*</sup></label>'
		+ '<input type="text" id="paymentDate1" name="paymentDate1" class="form-control" data-toggle="datepicker" onkeydown="return false" readonly disabled>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-3 col-md-6 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0">'
		+ '<label class="mb-0">Schedule Date<sup class="text-danger">*</sup></label>'
		+ '<input type="text" id="scheduleDate1" name="scheduleDate1" class="form-control" data-toggle="datepicker" onkeydown="return false" readonly>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-3 col-md-6 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0">'
		+ '<label class="mb-0">Transaction No.</label>'
		+ '<input id="transactionNumber" name="transactionNumber" type="text" class="form-control">'
		+ '</div>'
		+ '</div>'

		+ '<div class="col-lg-9 col-md-9 col-sm-12 col-xs-12">'
		+ '<label class="mb-0">Add Description(If any):</label>'
		+ '<div name="descriptionDiv" id="descriptionDiv" style="max-height:100px"></div>'
		+ '</div>'
		+ '<div class="col-md-12">'
			+'<div class="d-flex flex-wrap">'
				+'<div style="flex:1;width:1080" id="viewPaymentUrlElementWrapper" style="display:none">'
					+'<input style="width:100%;float:left;margin-top:20px;border:none" id="viewPaymentUrlElement"  readonly="readonly">'
				+'</div>'
				+'<div style="margin-left:auto;min-width:400px">'
					+ '<button type="button" class="btn btn-danger btn-shadow float-right pr-4 pl-4 ml-2" data-dismiss="modal" id="closePaymentModal">Close</button>'
					+ '<button type="button" class="btn btn-success btn-shadow float-right pr-4 pl-4 ml-2" id="addStudentPaymentbtn" onclick="addStudentPayment(\'addStudentPaymentForm\',' + moduleId + ')">Add</button>'
					+ '<button type="button" class="btn btn-primary btn-shadow float-right pr-4 pl-4" id="copyViewPaymentUrlElement" style="display:none" onclick="copyToClipboard(\'viewPaymentUrlElement\',\'closePaymentModal\')">Copy Payment Url</button>'
				+'</div>'
			+'</div>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '</form>'
		+ '</div>'
		+ '</div>'
		+ '</div>';
	return html;
}

function getAdvancePaymentSearch(schoolId, moduleId) {
	var html =
		'<div id="advSerch" class="modal fade bd-example-modal-lg fade-scale square-field" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">'
		+ '<div class="modal-dialog modal-lg">'
		+ '<div class="modal-content border-0">'
		+ '<div class="modal-header theme-bg text-white">'
		+ '<h4 class="modal-title" id="exampleModalLabel">Advance Search</h4>'
		+ '<button type="button" class="close text-white" data-dismiss="modal" paria-label="Close"><span aria-hidden="true">×</span></button>'
		+ '</div>'
		+ '<form action="javascript:void(0);" id="advancePaymentSearchForm" name="advancePaymentSearchForm" autocomplete="off">'
		+ '<div class="modal-body">'
		+ '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">'
		+ '<div class="form-row">'
		+ '<div class="col-lg-2 col-md-3 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0 schoolName">'
		+ '<label class="mb-0">School Name</label>'
		+ '<select name="schoolId" id="schoolId" class="multiselect-dropdown form-control">'
		+ getSchoolContent(schoolId)
		+ '</select>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-2 col-md-2 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0">'
		+ '<label class="mb-0">Academic Session</label>'
		+ '<select id="academicSession" name="academicSession" class="multiselect-dropdown form-control"></select>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-2 col-md-2 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0 registeredStudent">'
		+ '<label class="mb-0">Unregistered/Registered Student</label>'
		+ '<select id="userRegistrationType" name="userRegistrationType" class="multiselect-dropdown form-control">'
		+ '<option value="Registered">Registered</option>'
		+ '<option value="Unregistered">Unregistered</option>'
		+ '</select>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-4 col-md-3 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0 paymentType">'
		+ '<label class="mb-0">Payment Title</label>'
		+ '<select id="paymentType" name="paymentType" multiple="multiple" class="multiselect-dropdown form-control">'
		// +getPaymentTitle(schoolId)
		+ '</select>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-2 col-md-3 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0 paymentVia">'
		+ '<label class="mb-0">Payment Via</label>'
		+ '<select id="paymentVia" name="paymentVia" multiple="multiple" class="multiselect-dropdown form-control">'
		+ paymentVia(schoolId)
		+ '</select>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-2 col-md-3 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0 paymentGateway">'
		+ '<label class="mb-0">Payment Gateway Used</label>'
		+ '<select id="paymentGateway" name="paymentGateway" class="multiselect-dropdown form-control">'
		+ getPaymentGateway(schoolId)
		+ '</select>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-2 col-md-2 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0 enrollmentType">'
		+ '<label class="mb-0">Select Enrollment Type</label>'
		+ '<select name="registrationType" id="registrationType" class="multiselect-dropdown form-control">'
		+ '<option value="">Select Learning Program</option>'
		+ getLearningProgramContent(schoolId)
		+ '</select>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0 gradeID">'
		+ '<label class="mb-0">Grade</label>'
		+ '<select id="gradeId" name="gradeId" multiple="multiple" class="multiselect-dropdown form-control">'
		+ '<option value="" disabled>Select Grade*</option>'
		+ getStandardContent(schoolId, true, false)
		+ '</select>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-md-3 col-sm-12 col-xs-12 enrollStatus">'
		+ '<label>Enroll Status</label>'
		+ '<select name="enrollStatus" id="enrollStatus" class="multiselect-dropdown form-control">'
		+ '<option value="">Enroll Status</option>'
		+ '<option value="0">Completed</option>'
		+ '<option value="1">Withdrawn</option>'
		+ '<option value="2">Partial entry - New enrollment</option>'
		+ '<option value="3">Partial entry - Re-enrollment</option>'
		+ '</select>'
		+ '</div>'
		+ '<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0">'
		+ '<label class="mb-0">Name</label>'
		+ '<input id="studentName" name="studentName" type="text" class="form-control" autocomplete="off">'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0">'
		+ '<label class="mb-0">Student Id</label>'
		+ '<input id="studentId" name="studentId" type="text" class="form-control" autocomplete="off">'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0">'
		+ '<label class="mb-0">Email</label>'
		+ '<input id="studentEmail" name="studentEmail" type="email" class="form-control">'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0 countryId">'
		+ '<label class="mb-0">Country</label>'
		+ '<select id="countryId" name="countryId" multiple="multiple" class="multiselect-dropdown form-control">'
		+ '</select>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0 paymentMode">'
		+ '<label class="mb-0">Student’s Selected Payment Mode</label>'
		+ '<select id="paymentMode" name="paymentMode" multiple="multiple" class="multiselect-dropdown form-control">'
		+ getPaymentMode(schoolId)
		+ '</select>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0">'
		+ '<label class="mb-0">Transaction Reference No.</label>'
		+ '<input id="transactionRefNumber" name="transactionRefNumber" type="text" class="form-control">'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0">'
		+ '<label class="mb-0">User Reference No.</label>'
		+ '<input id="userRefNumber" name="userRefNumber" type="text" class="form-control">'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-2 col-md-3 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0 paymentStatus">'
		+ '<label class="mb-0">Payment Status</label>'
		+ '<select id="paymentStatus" name="paymentStatus" multiple="multiple" class="multiselect-dropdown form-control">'
		+ '<option value="SUCCESS" selected>SUCCESS</option>'
		+ '<option value="INITIATED" selected>INITIATED</option>'
		+ '<option value="SCHEDULED">SCHEDULED</option>'
		+ '<option value="REJECTED">REJECTED</option>'
		+ '</select>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-2 col-md-2 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0">'
		+ '<label class="mb-0">Payment Date From</label>'
		+ '<input type="text" id="paymentDateFrom" name="paymentDateFrom" class="form-control" data-toggle="datepicker" onkeydown="return false" readonly>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-2 col-md-2 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0">'
		+ '<label class="mb-0">Payment Date To</label>'
		+ '<input type="text" id="paymentDateTo" name="paymentDateTo" class="form-control" data-toggle="datepicker" onkeydown="return false" readonly>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-2 col-md-2 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0 sortBy">'
		+ '<label class="mb-0">Sort in</label>'
		+ '<select id="sortBy" name="sortBy" class="multiselect-dropdown form-control">'
		+ '<option value="DESC">Descending</option>'
		+ '<option value="ASC">Ascending</option>'
		+ '</select>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-2 col-md-2 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0 orderBy">'
		+ '<label class="mb-0">Order by</label>'
		+ '<select id="orderBy" name="orderBy" class="multiselect-dropdown form-control">'
		+ '<option value="PAY_DATE">Payment Date</option>'
		+ '<option value="SCHEDULED_PAY_DATE">Scheduled Payment Date</option>'
		+ '</select>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-1 col-md-2 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0">'
		+ '<label class="mb-0">Start Position</label>'
		+ '<input type="text" id="startPosition" name="startPosition" class="form-control" value="0" onkeydown="return M.digit(event);">'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-1 col-md-2 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0">'
		+ '<label class="mb-0">No of Records</label>'
		+ '<input type="text" id="numberOfRecords" name="numberOfRecords" class="form-control" value="10" onkeydown="return M.digit(event);">'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '<button type="button" class="btn btn-danger btn-shadow float-right pr-4 pl-4 ml-2" onclick="advancePaymentSearchStudentReset(\'advancePaymentSearchForm\')">Reset</button>'
		+ '<button type="button" class="btn btn-info btn-shadow float-right pr-4 pl-4 ml-2" data-dismiss="modal">Close</button>'
		+ '<button type="button" class="btn btn-success btn-shadow float-right pr-4 pl-4" onclick="advancePaymentSearchStudent(\'advancePaymentSearchForm\',' + moduleId + ');" id="advSearchSubmitButtion">Search</button>'
		+ '</div>'
		+ '</div>'
		+ '</form>'
		+ '</div>'
		+ '</div>'
		+ '</div>';
	return html;
}

function getPaymentRemark(schoolId, moduleId) {
	var html =
		'<div class="modal fade" id="paymentRemarks" tabindex="-1" role="dialog" aria-labelledby="paymentRemarksTitle">'
		+ '<div id="proileApproval" class="modal-dialog" role="document">'
		+ '<div class="modal-content">'
		+ '<div class="modal-header">'
		+ '<h4 class="modal-title" id="paymentRemarksTitle" style="color:#fff;">Payment Approval - Student Name - Payment Title</h4>'
		+ '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true" style="color:#fff;">&times;</span></button>'
		+ '</div>'
		+ '<div class="modal-body">'
		+ '<form autocomplete="off" id="paymentRemarksForm">'
		+ '<input type="hidden" id="userPaymentDetailsId" value="">'
		+ '<input type="hidden" id="userId" value="">'
		+ '<input type="hidden" id="moduleId" value="">'
		+ '<input type="hidden" id="serialNumber" value="">'
		+ '<div class="form-group">'
		+ '<label for="remarksStatus" class="control-label">Status:</label>'
		+ '<select class="form-control" name="remarksStatus" id="remarksStatus" onchange="changeRemark();">'
		+ '<option value="">Select status</option>'
		+ '<option value="Approve">Approve</option>'
		+ '<option value="Decline">Reject</option>'
		+ '</select>'
		+ '</div>'
		+ '<div id="pendingRemark" class="form-group">'
		+ '<label for="message-text" class="control-label">Remarks:</label>'
		+ '<textarea class="form-control" id="remarks" id="message-text" maxlength="200" style="padding:6px 0"></textarea>'
		+ '</div>'
		+ '<div>'
		+ '<span><strong style="color:green"> Note: </strong> Review once submitted will not be editable until user makes payment again.</span>'
		+ '</div>'
		+ '</form>'
		+ '</div>'
		+ '<div id="showRemark" class="modal-footer">'
		+ '<button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>'
		+ '<button type="button" class="btn btn-primary" id="addApproveRejectRemarks" onclick="return updatePaymentRemarks(\'paymentRemarksForm\',\'' + moduleId + '\');">Add Remarks</button>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '</div>';
	return html;
}

function editPaymentContent(moduleId, userPayment,controlType, standardName) {
	var html =
		'<div id="editPaymentModal" class="modal fade bd-example-modal-lg fade-scale square-field" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">'
		+ '<div class="modal-dialog modal-lg">'
		+ '<div class="modal-content border-0">'
		+ '<div class="modal-header theme-bg text-white">'
		+ '<h4 class="modal-title" id="exampleModalLabel">Payment Details</h4>'
		+ '<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>'
		+ '</div>'
		+ '<form action="javascript:void(0);" id="addStudentPaymentForm" name="addStudentPaymentForm" autocomplete="off">'
		+ '<div class="modal-body">'
		+ '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">'
		+ '<div class="form-row">'
		+ '<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0">'
		+ '<label class="mb-0">Fee Title</label>'
		+ '<select id="paymentType2" name="paymentType" class="multiselect-dropdown form-control" disabled>'
		+ getPaymentTitle(userPayment.schoolId)
		+ '</select>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0">'
		+ '<label class="mb-0">Payment Name</label>';
		if(userPayment.paymentName=='Reserve an Enrollment Seat - Advance' || userPayment.paymentName=='Reserve a Seat for Next Grade'){
			html += '<input id="paymentName2" name="paymentName2" type="text" value="Reserve a Seat for Next Grade" class="form-control" disabled>';
		}else if(userPayment.paymentName=='Reserve an Enrollment Seat'){
			html += '<input id="paymentName2" name="paymentName2" type="text" value="' + userPayment.paymentName + '" class="form-control" disabled>';
		}else{
			html += '<input id="paymentName2" name="paymentName2" type="text" value="' + userPayment.paymentName + '" class="form-control">';
		}
		html += '</div>'
		+ '</div>'
		+ '<div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0">'
		+ '<label class="mb-0">Alternate Payment Name</label>'
		+ '<div class="row">'
		+ '<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">'
		+ '<label style="line-height:33px; color:#000">'+standardName+' - </label>'
		+ '</div>'
		+ '<div class="col-lg-2 col-md-2 col-sm-12 col-xs-12">'
		+ '<select id="installmentNumber2" name="installmentNumber2" class="form-control">'
		+ getIntallmentNumbre()
		+ '</select>'
		+ '</div>'
		+ '<div class="col-lg-1 col-md-1 col-sm-12 col-xs-12 p-0 text-center">'
		+ '<label style="line-height:33px; color:#000">of</label>'
		+ '</div>'
		+ '<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">'
		+ '<select id="numberOfMonth2" name="numberOfMonth2" class="form-control">'
		+ getNumberOfMonths()
		+ '</select>'
		+ '</div>'
		+ '<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 pr-0">'
		+ '<label style="line-height:33px; color:#000">Installment</label>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-2 col-md-3 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0">'
		+ '<label class="mb-0">User Reference No.</label>'
		+ '<input id="userRefNumber2" name="userRefNumber" type="text" class="form-control" value="' + userPayment.referenceNumber + '">'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0">'
		+ '<label class="mb-0">Fee Amount</label>'
		+ '<input id="payableAmount2" name="payableAmount" type="tel" class="form-control" onkeydown="return M.floatDigit(event);" value="' + userPayment.payAmount + '">'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0">'
		+ '<label class="mb-0">Additional Fee</label>'
		+ '<input id="additionalAmount2" name="additionalAmount" type="tel" class="form-control" onkeydown="return M.floatDigit(event);" value="' + userPayment.additionalPayment + '" disabled>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0">'
		+ '<label class="mb-0">Currency</label>'
		+ '<select id="currency2" name="currency2" class="multiselect-dropdown form-control">'
		+ getCurrenciesBySchoolId(userPayment.schoolId)
		+ '</select>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0">'
		+ '<label class="mb-0">Payment Gateway Used</label>'
		+ '<select id="paymentGateway2" name="paymentGateway2" class="multiselect-dropdown form-control">'
		+ getPaymentGateway(userPayment.schoolId)
		+ '</select>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0">'
		+ '<label class="mb-0">Status</label>'
		+ '<select id="status2" name="status2" class="multiselect-dropdown form-control">'
		+ getPaymentStatus()
		+ '</select>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0">'
		+ '<label class="mb-0">Payment Date</label>'
		+ '<input type="text" id="paymentDate2" name="paymentDate2" class="form-control" data-toggle="datepicker" value="" onkeydown="return false" readonly>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0">'
		+ '<label class="mb-0">Schedule Date</label>'
		+ '<input type="text" id="scheduleDate2" name="scheduleDate2" class="form-control" data-toggle="datepicker" value="" onkeydown="return false" readonly>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">'
		+ '<div class="form-group mb-2 p-0">'
		+ '<label class="mb-0">Transaction No.</label>'
		+ '<input id="transactionNumber2" name="transactionNumber2" type="text" class="form-control" value="' + userPayment.transactionId + '">'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12" style="display: none">'
		+ '<div class="form-group mb-2 p-0">'
		+ '<label class="mb-0">User Id</label>'
		+ '<input id="userIdSearch" name="userId2" type="text" class="form-control" value="' + userPayment.userId + '">'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12" style="display: none">'
		+ '<div class="form-group mb-2 p-0">'
		+ '<label class="mb-0">User Payment Id</label>'
		+ '<input id="userPayId" name="userPayId" type="text" class="form-control" value="' + userPayment.id + '">'
		+ '</div>'
		+ '</div>'
		+ '<div class="row">'
		+ '<div class="col-md-12">'
		+ '<label class="mb-0">Add Description(If any):</label>'
		+ '<div name="descriptionDiv" id="descriptionDivBox" style="max-height:100px" onkeydown="return M.isampersandDisable(event);">' + (userPayment.description != null ? userPayment.description : '') + '</div>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col-md-12">'
		+ '<button type="button" class="btn btn-danger btn-shadow float-right pr-4 pl-4 ml-2" data-dismiss="modal">Close</button>';
		if(controlType=='V'){
			html+='';
		}else{
			html+='<button type="button" class="btn btn-success btn-shadow float-right pr-4 pl-4" onclick="editStudentPayment(\'editPaymentModal\',' + moduleId + ');">Save</button>';
		}
		html+='</div>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '</form>'
		+ '</div>'
		+ '</div>'
		+ '</div>';
	return html;
}
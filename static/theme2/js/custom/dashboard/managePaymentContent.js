function getAddPaymentSearchResult(data) {
    var html = ``;
    $.each(data.results, function (k, v) {
        var rowClass = ``;
        if (data.results.length == (k + 1)) {
            rowClass = 'rounded-bottom-left-10';
        }
		var lastColumnClass = '';
        if (data.results.length == (k + 1)) {
            lastColumnClass = 'rounded-bottom-right-10';
        }
		html += 
		`<tr>
			<td class="${rowClass}">${v.fullName}</td>
			<td>${v.studentStringId}</td>
			<td>${v.email}</td>
			<td>${v.standard}</td>
			<td class="${lastColumnClass}">`;
				if(v.fullName !== '' && v.standard != null) {
					html += `<a id="addPaymentId" class="btn btn-primary btn-sm m-0 text-white mr-2" onClick="addPayment('addStudentPaymentForm','${v.email}',${v.studentStandardId},'${v.advanceOrCustom}', true, '${v.eligibleForAdvance}')">&nbsp;Add Payment</a>`;
					if(v.advanceOrCustom == 'C') {
						var url = `/dashboard/fee-calculation/?type=C&studentStandardId=${v.studentStandardId}`;
						html += `<a class="btn btn-primary btn-sm m-0 text-white mr-2" href="javascript:void(0)" onClick="getAsPost('${url}')">&nbsp;Custom Payment Details</a>`;
					} else if (v.advanceOrCustom == 'A') {
						var url = `/dashboard/fee-calculation/?type=A&studentStandardId=${v.studentStandardId}`;
						html += `<a class="btn btn-primary btn-sm m-0 text-white" href="javascript:void(0)" onClick="getAsPost('${url}')">&nbsp;Advance Payment Details</a>`;
					}
				} else {
					html += 'Not eligible for Add payment';
				}
			html += `</td>
		</tr>`;
    });
    return html;
}

function getAdvancePaymentSearchResult(formId, data) {
    const allowedUsers = getSettingsByTypeAndKey('CONFIGURATION','ALLOW_EDIT_CUSTOM_PAYMENTS');
    var allowedUserIds = JSON.parse(allowedUsers).data.metaValue.split(",").map(id => id.trim());
    const isUserAllowed = allowedUserIds.includes(USER_ID.toString());
	const roleAndModule = getUserRights(SCHOOL_ID, USER_ROLE_ID, USER_ID, moduleId);
	let html = '';
	$.each(data.advancePaymentSearchResponseDTO, function (k, apsrSingle) {
		const serialNum = apsrSingle.serialNum;
		let paymentStatusIcon = '';
		let paymentStatusText = apsrSingle.paymentStatus;
		if (paymentStatusText === 'SUCCESS') {
			paymentStatusIcon = 'fa-check';
		} else if (paymentStatusText === 'SCHEDULED') {
			paymentStatusIcon = 'fa-calendar-check-o';
		} else if (paymentStatusText === 'INITIATED') {
			paymentStatusIcon = 'fa-hourglass-start';
		} else if (paymentStatusText === 'REJECTED') {
			paymentStatusIcon = 'fa-times';
		}

		html += `
			<tr id="row_${k}">
				<td>${serialNum}</td>
				<td>
					<span>
						${apsrSingle.shareLink ? `
							<input type="text" id="copyId${serialNum}" style="float:right; opacity:0; height:0;padding:0;" value="${apsrSingle.shareLink}">
							<div class="d-flex align-items-center mb-3">
								<a href="javascript:void(0)" class="btn btn-primary btn-sm" onclick="copyToClipboardNew('copyId${serialNum}', 'copy-message${serialNum}')">
									Copy Payment Link <i class="pe-7s-copy-file" aria-hidden="true"></i>
								</a>
								<span id="copy-message${serialNum}" style="display:block; color: green; margin-left: 6px; font-weight:600;"></span>
							</div>` : ''
						}
						<strong>Trans. Ref. No.:</strong> ${apsrSingle.transactionRefNumber}<br>
						<strong>User Ref. No.:</strong> ${apsrSingle.userRefNumber}<br>
						${apsrSingle.signupUrl ? `
							<input type="text" id="signupCopyId${serialNum}" style="float:right; opacity:0; height:0;padding:0;" value="${apsrSingle.signupUrl}">
							<br><a href="javascript:void(0)" class="btn btn-primary btn-sm" onclick="copyToClipboard('signupCopyId${serialNum}')">
								Copy Signup Url <i class="pe-7s-copy-file" aria-hidden="true"></i><i class="fa fa-clone" aria-hidden="true"></i>
							</a>` : ''
						}
					</span>
				</td>
				<td>
					<span>
						<strong>Student ID:</strong> ${apsrSingle.studentRollNumber}<br>
						<strong>Name:</strong> ${apsrSingle.studentName}<br>
						<strong>Email:</strong> ${apsrSingle.studentEmail}<br>
						<strong>Grade:</strong> ${apsrSingle.gradeName}<br>
						<strong>Learning Program:</strong> ${apsrSingle.registrationType}<br>
						<strong>LMS Platform:</strong> ${apsrSingle.lmsPlatform}<br>
					</span>
				</td>
				<td>
					<span>
						<strong>Plan Name:</strong> ${apsrSingle.planName}<br>
						<strong>Payment Name:</strong> ${apsrSingle.paymentName}<br>
						<strong>Payment Title:</strong> ${apsrSingle.paymentTitleLabel}<br>
						<strong>Scheduled Payment Date:</strong> ${apsrSingle.scheduledPayDate}<br>
						<strong>Payment Date:</strong> ${apsrSingle.payDate}
					</span>
				</td>
				<td>
					<span>
						<strong>Payment Amount:</strong> ${apsrSingle.payAmount}<br>
						<strong>Additional Amount:</strong> ${apsrSingle.additionalPayment}<br>
						${apsrSingle.selectedCurrency ? `
							<strong>Selected Currency:</strong> ${apsrSingle.selectedCurrency}-${apsrSingle.payCurrency} (${apsrSingle.conversionRation})<br>` : ''
						}
						<strong>Payment Via:</strong> ${apsrSingle.paymentTransferType}<br>
						<strong>Payment Gateway Used:</strong> ${
							apsrSingle.pgName.toUpperCase() === 'WIRETRANSFER' ? 'Bank Transfer' :
							apsrSingle.pgName.toUpperCase() === 'CASH' ? 'Cash' :
							apsrSingle.pgName
						}
					</span>
				</td>
				<td>
					<span>
						<i id="payment-status-${serialNum}" class="fa ${paymentStatusIcon} text-success"></i>
						<span id="payment-status-message-${serialNum}">&nbsp;${paymentStatusText}</span><br>
						<strong>Receipt:</strong>
						${apsrSingle.recieptLink !== 'N/A' ? `
							<a href="${apsrSingle.recieptLink}" target="_blank" class="btn btn-outline-info">
								<i class="fa fa-eye"></i>&nbsp;View Receipt
							</a>
							${SCHOOL_ID == 1 ? `
								<a href="${apsrSingle.recieptLink}&withStamp=Y" target="_blank" class="btn btn-outline-info">
									<i class="fa fa-eye"></i>&nbsp;View Receipt with Authorized Signatory and School Stamp
								</a>` : ''
							}` : apsrSingle.recieptLink
						}
						<br>
						${$(`#${formId} #paymentGateway`).select2('val') == 'CONVERA' ? `
							<strong>Convera Pay Status:</strong>
							${apsrSingle.wurecieptLink !== 'N/A' ? `
								<a href="${apsrSingle.wurecieptLink}" target="_blank">
									<i class="fa fa-eye"></i>&nbsp;Convera Pay Receipt
								</a>` : apsrSingle.wurecieptLink
							}
							<br>` : ''
						}
						<strong>Proof of Payment:</strong>
						${
							(apsrSingle.paymentTransferType !== 'Credit Card/Debit Card' || apsrSingle.pgName === 'CASH') ?
							`${apsrSingle.proofOfPayment}<br>` : 'N/A'
						}
					</span>
				</td>
				<td>
					<span>
						<strong>Added By:</strong> ${apsrSingle.paymentAddedBy}<br>
						<strong>Updated By:</strong> ${apsrSingle.paymentUpdatedBy}<br>
						<strong>Remarks:</strong><span id="remarks-${serialNum}">${apsrSingle.remarks}</span><br>
						<strong>Review Payment:</strong>
						<span id="review-${serialNum}">
							${
								(apsrSingle.paymentTransferType !== 'Credit Card/Debit Card' && apsrSingle.paymentStatus === 'INITIATED' && (roleAndModule.updated === 'Y' || roleAndModule.added === 'Y')) ||
								(apsrSingle.pgName === 'CASH' && apsrSingle.paymentStatus === 'INITIATED' && (roleAndModule.updated === 'Y' || roleAndModule.added === 'Y')) ?
								`<a onclick="return showPaymentRemarksModal('paymentRemarksForm','STUDENT',${apsrSingle.userId},${apsrSingle.userPaymentDetailsId},'${apsrSingle.studentName}','${apsrSingle.paymentTitleLabel}',${serialNum});" href="javascript:void(0);">Review</a>` : ' - '
							}
						</span>
					</span>
				</td><td>`;
		html += '<span class="btn btn-sm btn-primary  mr-1" onclick="showPaymentPopup(' + apsrSingle.userPaymentDetailsId + ',\'V\');">View</span>';
		if (roleAndModule.added == 'Y' || roleAndModule.updated == 'Y') {
			if(apsrSingle.paymentTitle=='CUSTOMIZED_REGISTRATION_SUBJECT_FEE' 
				|| apsrSingle.paymentTitle=='CUSTOMIZED_SUBJECT_FEE'
				){
				var eligibleForEdit=false;	
				if(apsrSingle.standardStatus==1 || isUserAllowed){
					html += '<span class="btn btn-sm btn-primary  mr-1" onclick="return showWarningMessage(\'This is a customized payment plan. Would you like to make changes?\',\'getAsPost(\\\'/dashboard/fee-calculation/?type=C&studentStandardId='+ apsrSingle.studentStandardId + '\\\')\'); ">Edit Custom Payment</span>';
                    html += '<span class="btn btn-sm btn-primary  mr-1" onclick="showPaymentPopup(' + apsrSingle.userPaymentDetailsId + ',\'E\');">Edit</span>';
				}else if(apsrSingle.standardStatus==0){
					if (apsrSingle.paymentStatus != 'SUCCESS') {
						eligibleForEdit=true;
					}else{
						if(USER_ROLE=='DIRECTOR'){
							eligibleForEdit=true;
						}
					}
					if(eligibleForEdit || isUserAllowed){
						html += '<span class="btn btn-sm btn-primary  mr-1" onclick="showPaymentPopup(' + apsrSingle.userPaymentDetailsId + ',\'E\');">Edit</span>';
					}
				}
			}else if(apsrSingle.paymentTitle=='REGISTRATION_SUBJECT_FEE_ADV' 
				|| apsrSingle.paymentTitle=='SUBJECT_FEE_ADV'
				){
				var eligibleForEdit=false;
				if(apsrSingle.standardStatus==3 || isUserAllowed){
					html += '<span class="btn btn-sm btn-primary  mr-1" onclick="return showWarningMessage(\'This is a advanced payment plan. Would you like to make changes?\',\'getAsPost(\\\'/dashboard/fee-calculation/?type=A&studentStandardId='+ apsrSingle.studentStandardId + '\\\')\'); ">Edit Advance Payment</span>';
				}else if(apsrSingle.standardStatus==0){
					if (apsrSingle.paymentStatus != 'SUCCESS') {
						eligibleForEdit=true;
					}else{
						if(USER_ROLE=='DIRECTOR'){
							eligibleForEdit=true;
						}
					}
				}
				if(eligibleForEdit || isUserAllowed){
					html += '<span class="btn btn-sm btn-primary  mr-1" onclick="showPaymentPopup(' + apsrSingle.userPaymentDetailsId + ',\'E\');">Edit</span>';
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
					html += '<span class="btn btn-sm btn-primary  mr-1" onclick="return showWarningMessage(\'Once you create a custom payment, it can not be changed. If you need to make changes, you will have to create a new one. Would you like to continue?\',\'getAsPost(\\\'/dashboard/fee-calculation/?type=C&studentStandardId='+ apsrSingle.studentStandardId + '\\\')\'); ">Create Custom Payment</span>';
				}
				if(eligibleForEdit || isUserAllowed){
					html += '<span class="btn btn-sm btn-primary  mr-1" onclick="showPaymentPopup(' + apsrSingle.userPaymentDetailsId + ',\'E\');">Edit</span>';
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
				if(eligibleForEdit || isUserAllowed){
					html += '<span class="btn btn-sm btn-primary  mr-1" onclick="showPaymentPopup(' + apsrSingle.userPaymentDetailsId + ',\'E\');">Edit</span>';
				}
			}
		}
		if (roleAndModule.deleted == 'Y') {
			html += '<span class="btn btn-sm btn-primary  mr-1" onclick="return showWarningMessage(\'Are you sure you want to delete?\',\'deletePayment(' + apsrSingle.userPaymentDetailsId + ', \\\'row_'+k+'\\\')\'); ">Delete</span>';
		}
		if (roleAndModule.added == 'Y' || roleAndModule.updated == 'Y') {
			if (apsrSingle.paymentStatus == "SUCCESS") {
				html += '<span class="btn btn-sm btn-primary  mr-1"  onclick="return showWarningMessageShow(\'Are you sure you want to re-send mail?\',\'sendmail(' + apsrSingle.userPaymentDetailsId + ')\'); ">Resend Mail</span>';
			}
			if (null != apsrSingle.signupUrl && apsrSingle.signupUrl != '') {
				html += '<span class="btn btn-sm btn-primary  mr-1" onclick="return mapUnregisteredUserPayment(\'mapStudentForm\',' + apsrSingle.entityId + ',' + SCHOOL_ID + ',\'STUDENT\',\'10,11,12,13,14,15,16\',\'' + apsrSingle.studentName + '\',\'' + apsrSingle.studentEmail + '\'); ">Map to Student</span>';
			}
			if (apsrSingle.isPaymentFailed != null && apsrSingle.paymentStatus != "SUCCESS") {
				html += '<span class="btn btn-sm btn-primary  mr-1" onclick="return showWarningMessageShow(\'Are you sure you want to approve payment and send mails?\',\'callStudentRedirectToDashboard(' + apsrSingle.userId + ',' + apsrSingle.userPaymentDetailsId + ',\\\'Y\\\')\',false);">Approve Payment With Mail</span>';
				html += '<span class="btn btn-sm btn-primary  mr-1" onclick="return showWarningMessageShow(\'Are you sure you want to approve payment witout sending mails?\',\'callStudentRedirectToDashboard(' + apsrSingle.userId + ',' + apsrSingle.userPaymentDetailsId + ',\\\'N\\\')\',false);">Approve Payment Without Mail</span>';
			}
		}
		html += '</td></tr>';
	});
	return html;
}


function mapStudentModal() {
    const html = `
        <div id="mapStudentModal" class="modal fade bd-example-modal-lg fade-scale square-field" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-md">
                <div class="modal-content border-0">
                    <div class="modal-header py-2 bg-primary text-white">
                        <h5 class="modal-title">Student Payment Mapping</h5>
                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form action="javascript:void(0);" id="mapStudentForm" name="mapStudentForm" autocomplete="off">
                        <div class="modal-body">
                            <div class="col-lg-12 col-md-12 col-sm-12 col-12">
                                <div class="form-row">
                                    <div class="col-lg-12 col-md-12 col-sm-12 col-12 mb-3">
                                        <p><i></i></p>
                                        <h3 class="text-center" id="mapToStudentId"></h3>
                                        <input type="hidden" id="unregistredPaymentId" name="unregistredPaymentId" value="" class="form-control">
                                        <input id="mapToUsers" name="mapToUsers" class="form-control" value="">
                                    </div>
                                    <div class="col-md-12">
                                        <button type="button" class="btn btn-sm btn-primary  float-right pr-4 pl-4 ml-2" onclick="mapUnregisteredUserPaymentProcess('mapStudentForm')">Map</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    return html;
}

function getManagePaymentContent(title, roleAndModule, schoolId, userId, role) {
  var html = `
    <div class="app-page-title mb-3 py-2">
		<div class="page-title-wrapper">
			<div class="page-title-heading">
			<div class="page-title-icon"> 
				<i class="fa fa-user-plus text-primary"> </i> 
			</div>
			<div>${title}</div>
			</div>
			<div class="page-title-actions">`;
				if(roleAndModule.viewed == 'Y') {
					html += `
					<a href="javascript:void(0)" class="btn btn-primary mr-1" data-toggle="modal" onClick="advancePaymentSerch()">
						<i class="fa fa-search"></i>&nbsp;Advanced Search
					</a>`;
				}
				if (SCHOOL_ID == 1) {
					if (roleAndModule.added == 'Y') {
					html += `
					<a href="javascript:void(0)" class="btn btn-primary  mr-1" onclick="addExternalPayment('addStudentPaymentForm')">
						Add External/Unregistered Student Payment
					</a>`;
					}
				}
				if (roleAndModule.added == 'Y') {
					html += `
					<a href="javascript:void(0)" class="btn btn-primary " onclick="addCustomPayment()">
						Add Payment/Custom Payment
					</a>`;
				}
			html += `
			</div>
		</div>
	</div>
	<div class="main-card mb-3 card responsive-adv-payment">
		<div class="card-body">
			<div class="full" style="overflow-x:inherit">`;
				if(roleAndModule.added == 'Y') {
					html += `
					<div class="addPayment-wrapper row">
						<div class="col-md-3 col-sm-6 col-12">
						<label>School Name</label>
						<select name="schoolId" id="schoolId" class="multiselect-dropdown form-control">
							${getSchoolContent(SCHOOL_ID)}
						</select>
						</div>
						<div class="col-md-3 col-sm-6 col-12">
						<label>Name</label>
						<input type="text" name="firstName" id="searchName" style="text-transform:capitalize" class="form-control">
						</div>
						<div class="col-md-3 col-sm-6 col-12">
						<label>Student ID</label>
						<input type="text" name="studentId" id="studentId" style="text-transform:capitalize" class="form-control">
						</div>
						<div class="col-md-3 col-sm-12 col-12">
						<label>Email</label>
						<input type="text" name="firstName" id="searchEmail" class="form-control">
						</div>
						<div class="col-md-12 col-sm-12 col-12 mt-2">
						<a href="javascript:void(0)" class="btn btn-success pull-right mt-2" onclick="searchStudentByNameAndEmail();">
							<i class="fa fa-search"></i>&nbsp;Search
						</a>
						</div>
					</div>
					<div class="payment-search-table my-3" id="paymentTableSearch">
						<table class="table table-bordered font-12 border-radius-table" id="paymentTable" style="width:100%">
						<thead>
							<tr>
							<th class="bg-primary text-white font-weight-normal border-bottom-0 vertical-align-middle rounded-top-left-10">Name</th>
							<th class="bg-primary text-white font-weight-normal border-bottom-0 vertical-align-middle">Student ID</th>
							<th class="bg-primary text-white font-weight-normal border-bottom-0 vertical-align-middle">Email</th>
							<th class="bg-primary text-white font-weight-normal border-bottom-0 vertical-align-middle">Grade</th>
							<th class="bg-primary text-white font-weight-normal border-bottom-0 vertical-align-middle rounded-top-right-10">Action</th>
							</tr>
						</thead>
						<tbody>
							<tr>
							<td colspan="5" class="text-center font-weight-semi-bold rounded-bottom-left-10 rounded-bottom-right-10">No Record</td>
							</tr>
						</tbody>
						</table>
					</div>
					`;
				}
  			html += `
			<div id="advance-serach-content" style="width:100%;display:inline-block;overflow-x:hidden">
				<table id="advPaymentSearch" class="table table-bordered responsive border-radius-table nowrap font-12" style="width:100%">
				<thead>
					<tr>
					<th class="bg-primary text-white font-weight-normal border-bottom-0 vertical-align-middle rounded-top-left-10">S.No</th>
					<th class="bg-primary text-white font-weight-normal border-bottom-0 vertical-align-middle">
						Copy link.<br>Transaction Reference No.<br>User Reference No.
					</th>
					<th class="bg-primary text-white font-weight-normal border-bottom-0 vertical-align-middle">
						Student ID/Name/Email/Grade/Learning Program/LMS Platform
					</th>
					<th class="bg-primary text-white font-weight-normal border-bottom-0 vertical-align-middle">
						Payment Name<br>Payment Title<br>Scheduled Payment Date<br>Payment Date
					</th>
					<th class="bg-primary text-white font-weight-normal border-bottom-0 vertical-align-middle">
						Plan Name<br>Payment Amount<br>Additional Amount<br>Payment Via<br>Payment Gateway Used
					</th>
					<th class="bg-primary text-white font-weight-normal border-bottom-0 vertical-align-middle">
						Payment Status<br>Receipt<br>Proof of Payment
					</th>
					<th class="bg-primary text-white font-weight-normal border-bottom-0 vertical-align-middle">
						Added By<br>Updated By<br>Remarks<br>Review Payment
					</th>
					<th class="bg-primary text-white font-weight-normal border-bottom-0 vertical-align-middle rounded-top-right-10">
						Edit
					</th>
					</tr>
				</thead>
				<tbody>
					<tr>
					<td colspan="8" class="text-center font-weight-semi-bold rounded-bottom-left-10 rounded-bottom-right-10">No Record</td>
					</tr>
				</tbody>
				</table>
				<br/>
			</div>
		</div>
	</div>
	<div id="showEditPopupContainer"></div>
	${getAddPaymentModal(schoolId, roleAndModule.moduleId)}
	${getAdvancePaymentSearch(schoolId, roleAndModule.moduleId)}
	${getPaymentRemark(schoolId, moduleId)}
	${mapStudentModal()}`;
	return html;
}
function getAddPaymentModal(schoolId, moduleId) {
    var html = `
        <div id="addPaymentModal" class="modal fade bd-example-modal-lg fade-scale square-field" tabindex="" data-backdrop="static" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl">
                <div class="modal-content border-0">
                    <div class="modal-header py-2 bg-primary">
                        <h5 class="modal-title text-white">Payment Details</h5>
                    </div>
                    <form action="javascript:void(0);" id="addStudentPaymentForm" name="addStudentPaymentForm" autocomplete="off">
                        <div class="modal-body">
                            <div class="col-lg-12 col-md-12 col-sm-12 col-12">
                                <div class="form-row">
                                    <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12 col-12" style="display:none">
                                        <div class="form-group mb-2 p-0">
                                            <label class="mb-0">Student Standard Id</label>
                                            <input id="studentStandardId" name="studentStandardId" type="text" class="form-control">
                                        </div>
                                    </div>
                                    <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12 col-12">
                                        <div class="form-group mb-2 p-0">
                                            <label class="mb-0">Student Email<sup class="text-danger">*</sup></label>
                                            <input id="studentEmail1" name="studentEmail1" type="text" class="form-control" style="padding-right:22px" onblur="getStudentDetailsForPayment('addStudentPaymentForm', 'true')">
                                        </div>
                                    </div>
                                    <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12 col-12">
                                        <div class="form-group mb-2 p-0">
                                            <label class="mb-0">Student Name<sup class="text-danger">*</sup></label>
                                            <input id="studentName1" name="studentName1" type="text" class="form-control">
                                        </div>
                                    </div>
                                    <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12 col-12">
                                        <div class="form-group mb-2 p-0">
                                            <label class="mb-0">Learning Program<sup class="text-danger">*</sup></label>
                                            <select id="learningProgram1" name="learningProgram1" class="multiselect-dropdown form-control">
                                                <option value="">Select Learning Program</option>
                                                ${getLearningProgramContent(schoolId)}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12 col-12">
                                        <div class="form-group mb-2 p-0">
                                            <label class="mb-0">Grade<sup class="text-danger hideWhenlearningProgramFlexy">*</sup></label>
                                            <select id="standardId1" name="standardId1" class="multiselect-dropdown form-control">
                                                <option value="" disabled>Select Grade*</option>
                                                ${getStandardContent(schoolId, false, false)}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12 col-12">
                                        <div class="form-group mb-2 p-0">
                                            <label class="mb-0">Fee Title<sup class="text-danger">*</sup></label>
                                            <select id="paymentType1" name="paymentType" class="multiselect-dropdown form-control">
                                                <!-- Payment Titles go here -->
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12 col-12">
                                        <div class="form-group mb-2 p-0">
                                            <label class="mb-0">Payment Name<sup class="text-danger">*</sup></label>
                                            <input id="paymentName1" name="paymentName1" type="text" class="form-control">
                                        </div>
                                    </div>
                                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12">
                                        <div class="form-group mb-2 p-0">
                                            <label class="mb-0">Alternate Payment Name</label>
                                            <div class="d-flex align-items-center gap-10">
                                                <div class="flex-grow-1"><span id="paymentAlternateName"></span> - </div>
                                                <div class="flex-grow-1">
                                                    <select id="installmentNumber1" name="installmentNumber1" class="form-control">
                                                        ${getIntallmentNumbre()}
                                                    </select>
                                                </div>
                                                <div>of</div>
                                                <div class="flex-grow-1">
                                                    <select id="numberOfMonth1" name="numberOfMonth1" class="form-control">
                                                        ${getNumberOfMonths()}
                                                    </select>
                                                </div>
                                                <div class="flex-grow-1">
                                                    <label>Installment</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xl-2 col-lg-6 col-md-6 col-sm-12 col-12">
                                        <div class="form-group mb-2 p-0">
                                            <label class="mb-0">User Reference No.</label>
                                            <input id="userRefNumber1" name="userRefNumber" type="text" class="form-control">
                                        </div>
                                    </div>
                                    <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12 col-12">
                                        <div class="form-group mb-2 p-0">
                                            <label class="mb-0">Fee Amount<sup class="text-danger">*</sup></label>
                                            <input id="payableAmount" name="payableAmount" type="tel" class="form-control" onkeydown="return M.floatDigit(event);">
                                        </div>
                                    </div>
                                    <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12 col-12">
                                        <div class="form-group mb-2 p-0">
                                            <label class="mb-0">Additional Fee</label>
                                            <input id="additionalAmount" name="additionalAmount" type="tel" class="form-control" onkeydown="return M.floatDigit(event);" disabled>
                                        </div>
                                    </div>
                                    <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12 col-12">
                                        <div class="form-group mb-2 p-0">
                                            <label class="mb-0">Currency<sup class="text-danger">*</sup></label>
                                            <select id="currency1" name="currency" class="multiselect-dropdown form-control">
                                                ${getCurrenciesBySchoolId(schoolId)}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12 col-12">
                                        <div class="form-group mb-2 p-0">
                                            <label class="mb-0">Payment Gateway Used</label>
                                            <select id="paymentGateway1" name="paymentGateway" class="multiselect-dropdown form-control">
                                                ${getPaymentGateway(schoolId)}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12 col-12">
                                        <div class="form-group mb-2 p-0">
                                            <label class="mb-0">Status<sup class="text-danger">*</sup></label>
                                            <select id="status1" name="status" class="multiselect-dropdown form-control">
                                                <option value="0" selected>Select Status</option>
                                                <option value="SCHEDULED">SCHEDULED</option>
                                                <option value="SUCCESS">SUCCESS</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12 col-12">
                                        <div class="form-group mb-2 p-0">
                                            <label class="mb-0">Payment Date<sup class="text-danger hideWhenStatusScheduled">*</sup></label>
                                            <input type="text" id="paymentDate1" name="paymentDate1" class="form-control" data-toggle="datepicker" onkeydown="return false" readonly disabled>
                                        </div>
                                    </div>
                                    <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12 col-12">
                                        <div class="form-group mb-2 p-0">
                                            <label class="mb-0">Schedule Date<sup class="text-danger">*</sup></label>
                                            <input type="text" id="scheduleDate1" name="scheduleDate1" class="form-control" data-toggle="datepicker" onkeydown="return false" readonly>
                                        </div>
                                    </div>
                                    <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12 col-12">
                                        <div class="form-group mb-2 p-0">
                                            <label class="mb-0">Transaction No.</label>
                                            <input id="transactionNumber" name="transactionNumber" type="text" class="form-control">
                                        </div>
                                    </div>
                                    <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mb-2">
                                        <label class="mb-0">Add Description(If any):</label>
                                        <div name="descriptionDiv" id="descriptionDiv" style="max-height:100px"></div>
                                    </div>
                                    <div class="col-md-12">
                                        <div class="d-flex flex-wrap align-items-center">
                                            <div style="flex:1;width:1080" id="viewPaymentUrlElementWrapper" style="display:none">
                                                <input class="full border-0" id="viewPaymentUrlElement" readonly style="outline:none">
                                            </div>
                                            <div style="margin-left:auto;min-width:fit-content">
                                                <button type="button" class="btn btn-danger  float-right pr-4 pl-4 ml-2" data-dismiss="modal" id="closePaymentModal">Close</button>
                                                <button type="button" class="btn btn-success  float-right pr-4 pl-4 ml-2" id="addStudentPaymentbtn" onclick="addStudentPayment('addStudentPaymentForm', ${moduleId})">Add</button>
                                                <button type="button" class="btn btn-primary  float-right pr-4 pl-4" id="copyViewPaymentUrlElement" style="display:none" onclick="copyToClipboard('viewPaymentUrlElement', 'closePaymentModal')">Copy Payment Url</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    return html;
}


function getAdvancePaymentSearch(schoolId, moduleId) {
  var html = `
    <div id="advSerch" class="modal fade bd-example-modal-lg fade-scale square-field" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-xl">
        <div class="modal-content border-0">
          <div class="modal-header py-2 bg-primary">
            <h5 class="modal-title text-white">Advance Search</h5>
            <button type="button" class="close text-white" data-dismiss="modal" aria-hidden="true">&times;</button>
          </div>
          <form action="javascript:void(0);" id="advancePaymentSearchForm" name="advancePaymentSearchForm" autocomplete="off">
            <div class="modal-body">
              <div class="row">
                <div class="col-lg-2 col-md-3 col-sm-12 col-12">
                  <div class="form-group mb-2 p-0 schoolName">
                    <label class="mb-0">School Name</label>
                    <select name="schoolId" id="schoolId" class="multiselect-dropdown form-control">
                      ${getSchoolContent(schoolId)}
                    </select>
                  </div>
                </div>
                <div class="col-lg-2 col-md-2 col-sm-12 col-12">
                  <div class="form-group mb-2 p-0">
                    <label class="mb-0">Academic Session</label>
                    <select id="academicSession" name="academicSession" class="multiselect-dropdown form-control"></select>
                  </div>
                </div>
                <div class="col-lg-2 col-md-2 col-sm-12 col-12">
                  <div class="form-group mb-2 p-0 registeredStudent">
                    <label class="mb-0">Unregistered/Registered Student</label>
                    <select id="userRegistrationType" name="userRegistrationType" class="multiselect-dropdown form-control">
                      <option value="Registered">Registered</option>
                      <option value="Unregistered">Unregistered</option>
                    </select>
                  </div>
                </div>
                <div class="col-lg-4 col-md-3 col-sm-12 col-12">
                  <div class="form-group mb-2 p-0 paymentType">
                    <label class="mb-0">Payment Title</label>
                    <select id="paymentType" name="paymentType" multiple="multiple" class="multiselect-dropdown form-control">
                    </select>
                  </div>
                </div>
                <div class="col-lg-2 col-md-3 col-sm-12 col-12">
                  <div class="form-group mb-2 p-0 paymentVia">
                    <label class="mb-0">Payment Via</label>
                    <select id="paymentVia" name="paymentVia" multiple="multiple" class="multiselect-dropdown form-control">
                      ${paymentVia(schoolId)}
                    </select>
                  </div>
                </div>
                <div class="col-lg-2 col-md-3 col-sm-12 col-12">
                  <div class="form-group mb-2 p-0 paymentGateway">
                    <label class="mb-0">Payment Gateway Used</label>
                    <select id="paymentGateway" name="paymentGateway" class="multiselect-dropdown form-control">
                      ${getPaymentGateway(schoolId)}
                    </select>
                  </div>
                </div>
                <div class="col-lg-2 col-md-2 col-sm-12 col-12">
                  <div class="form-group mb-2 p-0 enrollmentType">
                    <label class="mb-0">Select Enrollment Type</label>
                    <select name="registrationType" id="registrationType" class="multiselect-dropdown form-control">
                      <option value="">Select Learning Program</option>
                      ${getLearningProgramContent(schoolId)}
                    </select>
                  </div>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-12 col-12">
                  <div class="form-group mb-2 p-0 gradeID">
                    <label class="mb-0">Grade</label>
                    <select id="gradeId" name="gradeId" multiple="multiple" class="multiselect-dropdown form-control">
                      <option value="" disabled>Select Grade*</option>
                      ${getStandardContent(schoolId, true, false)}
                    </select>
                  </div>
                </div>
                <div class="col-md-3 col-sm-12 col-12 enrollStatus">
                  <label class="mb-0">Enroll Status</label>
                  <select name="enrollStatus" id="enrollStatus" class="multiselect-dropdown form-control">
                    <option value="">Enroll Status</option>
                    <option value="0">Completed</option>
                    <option value="1">Withdrawn</option>
                    <option value="2">Partial entry - New enrollment</option>
                    <option value="3">Partial entry - Re-enrollment</option>
                  </select>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-12 col-12">
                  <div class="form-group mb-2 p-0">
                    <label class="mb-0">Name</label>
                    <input id="studentName" name="studentName" type="text" class="form-control" autocomplete="off">
                  </div>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-12 col-12">
                  <div class="form-group mb-2 p-0">
                    <label class="mb-0">Student Id</label>
                    <input id="studentId" name="studentId" type="text" class="form-control" autocomplete="off">
                  </div>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-12 col-12">
                  <div class="form-group mb-2 p-0">
                    <label class="mb-0">Email</label>
                    <input id="studentEmail" name="studentEmail" type="email" class="form-control">
                  </div>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-12 col-12">
                  <div class="form-group mb-2 p-0 countryId">
                    <label class="mb-0">Country</label>
                    <select id="countryId" name="countryId" multiple="multiple" class="multiselect-dropdown form-control"></select>
                  </div>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-12 col-12">
                  <div class="form-group mb-2 p-0 paymentMode">
                    <label class="mb-0">Student's Selected Payment Mode</label>
                    <select id="paymentMode" name="paymentMode" multiple="multiple" class="multiselect-dropdown form-control">
                      ${getPaymentMode(schoolId)}
                    </select>
                  </div>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-12 col-12">
                  <div class="form-group mb-2 p-0">
                    <label class="mb-0">Transaction Reference No.</label>
                    <input id="transactionRefNumber" name="transactionRefNumber" type="text" class="form-control">
                  </div>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-12 col-12">
                  <div class="form-group mb-2 p-0">
                    <label class="mb-0">User Reference No.</label>
                    <input id="userRefNumber" name="userRefNumber" type="text" class="form-control">
                  </div>
                </div>
                <div class="col-lg-2 col-md-3 col-sm-12 col-12">
                  <div class="form-group mb-2 p-0 paymentStatus">
                    <label class="mb-0">Payment Status</label>
                    <select id="paymentStatus" name="paymentStatus" multiple="multiple" class="multiselect-dropdown form-control">
                      <option value="SUCCESS" selected>SUCCESS</option>
                      <option value="INITIATED" selected>INITIATED</option>
                      <option value="SCHEDULED">SCHEDULED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </div>
                </div>
                <div class="col-lg-2 col-md-2 col-sm-12 col-12">
                  <div class="form-group mb-2 p-0">
                    <label class="mb-0">Payment Date From</label>
                    <input type="text" id="paymentDateFrom" name="paymentDateFrom" class="form-control" data-toggle="datepicker" onkeydown="return false" readonly>
                  </div>
                </div>
                <div class="col-lg-2 col-md-2 col-sm-12 col-12">
                  <div class="form-group mb-2 p-0">
                    <label class="mb-0">Payment Date To</label>
                    <input type="text" id="paymentDateTo" name="paymentDateTo" class="form-control" data-toggle="datepicker" onkeydown="return false" readonly>
                  </div>
                </div>
                <div class="col-lg-2 col-md-2 col-sm-12 col-12">
                  <div class="form-group mb-2 p-0 sortBy">
                    <label class="mb-0">Sort in</label>
                    <select id="sortBy" name="sortBy" class="multiselect-dropdown form-control">
                      <option value="DESC">Descending</option>
                      <option value="ASC">Ascending</option>
                    </select>
                  </div>
                </div>
                <div class="col-lg-2 col-md-2 col-sm-12 col-12">
                  <div class="form-group mb-2 p-0 orderBy">
                    <label class="mb-0">Order by</label>
                    <select id="orderBy" name="orderBy" class="multiselect-dropdown form-control">
                      <option value="PAY_DATE">Payment Date</option>
                      <option value="SCHEDULED_PAY_DATE">Scheduled Payment Date</option>
                    </select>
                  </div>
                </div>
                <div class="col-lg-1 col-md-2 col-sm-12 col-12">
                  <div class="form-group mb-2 p-0">
                    <label class="mb-0">Start Position</label>
                    <input type="text" id="startPosition" name="startPosition" class="form-control" value="0" onkeydown="return M.digit(event);">
                  </div>
                </div>
                <div class="col-lg-1 col-md-2 col-sm-12 col-12">
                  <div class="form-group mb-2 p-0">
                    <label class="mb-0">No of Records</label>
                    <input type="text" id="numberOfRecords" name="numberOfRecords" class="form-control" value="10" onkeydown="return M.digit(event);">
                  </div>
                </div>
              </div>
            </div>
          </form>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger  float-right pr-4 pl-4 ml-2" onclick="advancePaymentSearchStudentReset('advancePaymentSearchForm')"><i class="fa fa-undo"></i>&nbsp;Reset</button>
            <button type="button" class="btn btn-info  float-right pr-4 pl-4 ml-2" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-success  float-right pr-4 pl-4" onclick="advancePaymentSearchStudent('advancePaymentSearchForm', ${moduleId});" id="advSearchSubmitButtion"><i class="fa fa-search"></i>&nbsp;Search</button>
          </div>
        </div>
      </div>
    </div>
  `;
  return html;
}


function getPaymentRemark(schoolId, moduleId) {
    var html = `
    <div class="modal fade" id="paymentRemarks" tabindex="-1" role="dialog" aria-labelledby="paymentRemarksTitle">
        <div id="proileApproval" class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header py-2 bg-primary text-white">
                    <h5 class="modal-title" id="paymentRemarksTitle">Payment Approval - Student Name - Payment Title</h5>
                    <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                
                <div class="modal-body">
                    <form autocomplete="off" id="paymentRemarksForm">
                        <input type="hidden" id="userPaymentDetailsId" value="">
                        <input type="hidden" id="userId" value="">
                        <input type="hidden" id="moduleId" value="">
                        <input type="hidden" id="serialNumber" value="">
						
						<div class="form-group">
                            <label for="remarksStatus" class="control-label">Status:</label>
                            <select class="form-control" name="remarksStatus" id="remarksStatus" onchange="changeRemark();">
                                <option value="">Select status</option>
                                <option value="Approve">Approve</option>
                                <option value="Decline">Reject</option>
                            </select>
                        </div>

                        <div id="pendingRemark" class="form-group">
                            <label for="message-text" class="control-label">Remarks:</label>
                            <textarea class="form-control" id="remarks" maxlength="200" style="padding:6px 0"></textarea>
                        </div>

                        <div>
                            <span>
                                <strong style="color:green">Note:</strong>
                                Review once submitted will not be editable until user makes payment again.
                            </span>
                        </div>
                    </form>
                </div>

                <div id="showRemark" class="modal-footer">
                    <button type="button" class="btn btn-danger " data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" id="addApproveRejectRemarks" onclick="return updatePaymentRemarks('paymentRemarksForm', '${moduleId}');">
                        Add Remarks
                    </button>
                </div>
            </div>
        </div>
    </div>`;
    return html;
}

function editPaymentContent(moduleId, userPayment, controlType, standardName) {
    var html = `
    <div id="editPaymentModal" class="modal fade bd-example-modal-lg fade-scale square-field" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content border-0">
                <div class="modal-header py-2 theme-bg text-white">
                    <h5 class="modal-title">Payment Details</h5>
                    <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <form action="javascript:void(0);" id="addStudentPaymentForm" name="addStudentPaymentForm" autocomplete="off">
                    <div class="modal-body">
                        <div class="col-12">
                            <div class="form-row">
                                
                                <!-- Fee Title -->
                                <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12 col-12">
                                    <div class="form-group mb-2 p-0">
                                        <label class="mb-0">Fee Title</label>
                                        <select id="paymentType2" name="paymentType" class="multiselect-dropdown form-control" disabled>
                                            ${getPaymentTitle('addStudentPaymentForm',userPayment.schoolId)}
                                        </select>
                                    </div>
                                </div>

                                <!-- Payment Name -->
                                <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12 col-12">
                                    <div class="form-group mb-2 p-0">
                                        <label class="mb-0">Payment Name</label>
                                        <input id="paymentName2" name="paymentName2" type="text" value="${userPayment.paymentName}" class="form-control" ${userPayment.paymentName.includes('Reserve an Enrollment Seat') ? 'disabled' : ''}>
                                    </div>
                                </div>

                                <!-- Alternate Payment Name -->
                                <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12 col-12">
                                    <div class="form-group mb-2 p-0">
                                        <label class="mb-0">Alternate Payment Name</label>
                                        <div class="d-flex align-items-center gap-10">
                                            <div class="flex-grow-1"><span>${standardName}</span> - </div>
                                            <div class="flex-grow-1">
                                                <select id="installmentNumber2" name="installmentNumber2" class="form-control">
                                                    ${getIntallmentNumbre()}
                                                </select>
                                            </div>
                                            <div>of</div>
                                            <div class="flex-grow-1">
                                                <select id="numberOfMonth2" name="numberOfMonth2" class="form-control">
                                                    ${getNumberOfMonths()}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- User Reference No. -->
                                <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12 col-12">
                                    <div class="form-group mb-2 p-0">
                                        <label class="mb-0">User Reference No.</label>
                                        <input id="userRefNumber2" name="userRefNumber" type="text" class="form-control" value="${userPayment.referenceNumber}">
                                    </div>
                                </div>

                                <!-- Fee Amount -->
                                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                                    <div class="form-group mb-2 p-0">
                                        <label class="mb-0">Fee Amount</label>
                                        <input id="payableAmount2" name="payableAmount" type="tel" class="form-control" onkeydown="return M.floatDigit(event);" value="${userPayment.payAmount}">
                                    </div>
                                </div>

                                <!-- Additional Fee -->
                                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                                    <div class="form-group mb-2 p-0">
                                        <label class="mb-0">Additional Fee</label>
                                        <input id="additionalAmount2" name="additionalAmount" type="tel" class="form-control" onkeydown="return M.floatDigit(event);" value="${userPayment.additionalPayment}" disabled>
                                    </div>
                                </div>

                                <!-- Currency -->
                                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                                    <div class="form-group mb-2 p-0">
                                        <label class="mb-0">Currency</label>
                                        <select id="currency2" name="currency2" class="multiselect-dropdown form-control">
                                            ${getCurrenciesBySchoolId(userPayment.schoolId)}
                                        </select>
                                    </div>
                                </div>

                                <!-- Payment Gateway -->
                                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                                    <div class="form-group mb-2 p-0">
                                        <label class="mb-0">Payment Gateway Used</label>
                                        <select id="paymentGateway2" name="paymentGateway2" class="multiselect-dropdown form-control">
                                            ${getPaymentGateway(userPayment.schoolId)}
                                        </select>
                                    </div>
                                </div>

                                <!-- Status -->
                                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                                    <div class="form-group mb-2 p-0">
                                        <label class="mb-0">Status</label>
                                        <select id="status2" name="status2" class="multiselect-dropdown form-control">
                                            ${getPaymentStatus()}
                                        </select>
                                    </div>
                                </div>

                                <!-- Payment Date -->
                                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                                    <div class="form-group mb-2 p-0">
                                        <label class="mb-0">Payment Date</label>
                                        <input type="text" id="paymentDate2" name="paymentDate2" class="form-control" data-toggle="datepicker" onkeydown="return false" readonly>
                                    </div>
                                </div>
										
                                <!-- Schedule Date -->
                                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                                    <div class="form-group mb-2 p-0">
                                        <label class="mb-0">Schedule Date</label>
                                        <input type="text" id="scheduleDate2" name="scheduleDate2" class="form-control" data-toggle="datepicker" onkeydown="return false" readonly>
                                    </div>
                                </div>

                                <!-- Transaction No. -->
                                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                                    <div class="form-group mb-2 p-0">
                                        <label class="mb-0">Transaction No.</label>
                                        <input id="transactionNumber2" name="transactionNumber2" type="text" class="form-control" value="${userPayment.transactionId != null ? userPayment.transactionId : ''}">
                                    </div>
                                </div>

                                <!-- Hidden: User ID -->
                                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12" style="display: none">
                                    <div class="form-group mb-2 p-0">
                                        <label class="mb-0">User Id</label>
                                        <input id="userIdSearch" name="userId2" type="text" class="form-control" value="${userPayment.userId}">
                                    </div>
                                </div>

                                <!-- Hidden: User Payment ID -->
                                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12" style="display: none">
                                    <div class="form-group mb-2 p-0">
                                        <label class="mb-0">User Payment Id</label>
                                        <input id="userPayId" name="userPayId" type="text" class="form-control" value="${userPayment.id}">
                                    </div>
                                </div>

                                <!-- Description -->
                                <div class="col-12">
                                    <label class="mb-0">Add Description (If any):</label>
                                    <div id="descriptionDivBox" name="descriptionDiv" style="max-height:100px" onkeydown="return M.isampersandDisable(event);">
                                        ${userPayment.description != null ? userPayment.description : ''}
                                    </div>
                                </div>

                                <!-- Buttons -->
                                <div class="col-12 mt-3">
                                    
                                </div>

                            </div>
                        </div>
                    </div>
					<div class="modal-footer text-right">
						<button type="button" class="btn btn-danger  float-right pr-4 pl-4 ml-2" data-dismiss="modal">Close</button>
						${
							controlType !== 'V'
								? `<button type="button" class="btn btn-success  float-right pr-4 pl-4" onclick="editStudentPayment('editPaymentModal', ${moduleId});">Save</button>`
								: ''
						}
					</div>
                </form>
            </div>
        </div>
    </div>`;

    return html;
}

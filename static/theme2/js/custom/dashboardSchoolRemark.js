function changeRemark(){
	if($('#interviewApprovalId #remarksStatus').val()=="3"){
		$('#interviewApproval').addClass('modal-lg');
		$('#interviewApprovalId #pendingRemark').hide();
		$('#interviewApprovalId #techerAgreementShow').show();
		// initEditor(1, 'techerAgreementTinymce1','Please provide teacher agreement, if any', true);
		editor = new Jodit('#techerAgreementTinymce1', {
			width: 794, // A4 width in pixels
			height: 400, 
			toolbarSticky: true,
			uploader: { insertImageAsBase64URI: true },
			toolbarAdaptive: false,
			// buttons: [
			// 	'source', '|',
			// 	'bold', 'italic', 'underline', '|',
			// 	'ul', 'ol', '|',
			// 	'outdent', 'indent', '|',
			// 	'font', 'fontsize', 'brush', 'paragraph', '|',
			// 	'image', 'table', 'link', '|',
			// 	'align', 'undo', 'redo', '|',
			// 	'hr', 'eraser', 'fullsize'
			// ],
			events: {
				afterInit: function () {
					const observer = new MutationObserver(() => {
					const keepBtn = Array.from(document.querySelectorAll('.jodit-ui-button__text')).find(btn => btn.textContent.trim() === 'Keep');
						if(keepBtn) {
							keepBtn.addEventListener('click', function () {
							setTimeout(() => {
								tableCenter();

							}, 1500);
							}, { once: true });
							observer.disconnect();
						}
					});
					observer.observe(document.body, {
						childList: true,
						subtree: true
					});
				}
			}
		});
		$('#showAgreement').show();
		$('#showRemark').hide();
		$('#agreementRefNumber').val('');
		$('#agreementDate').val('');
		$('#remarksInterview').val('');
	}else{
		$('#interviewApproval').removeClass('modal-lg');
		$('#interviewApprovalId #pendingRemark').show();
		$('#showAgreement').hide();
		$('#showRemark').show();
		$('#interviewApprovalId #techerAgreementShow').hide();
	
	}
}
function redirectToBankDetailsOnProfileRequest(){
	if($('#profileApprovalId #remarksStatus').val()=="3"){
		$('#profileApproval').addClass('modal-xl');
		$('#profileApprovalId #pendingRemark').hide();
		$('#profileApprovalId #techerAgreementShow').show();
		$('#showAgreement1').show();
		$('#showRemark1').hide();
		$('#agreementRefNumber').val('');
		$('#agreementDate').val('');
		$('#remarksInterview').val('');
		$("#employeeSpecialization").select2()
		$('#employeeType').val('');
		$('#typeOfTeacher').val('');
		$('#teacherDesignation').val('');
		$('#teacherDepartment').val('');
		// initEditor(1, 'techerAgreementTinymce','Please provide teacher agreement, if any', true);
		editor = new Jodit('#techerAgreementTinymce', {
			width: 794, // A4 width in pixels
			height: 400, 
			toolbarSticky: true,
			uploader: { insertImageAsBase64URI: true },
			toolbarAdaptive: false,
			// buttons: [
			// 	'source', '|',
			// 	'bold', 'italic', 'underline', '|',
			// 	'ul', 'ol', '|',
			// 	'outdent', 'indent', '|',
			// 	'font', 'fontsize', 'brush', 'paragraph', '|',
			// 	'image', 'table', 'link', '|',
			// 	'align', 'undo', 'redo', '|',
			// 	'hr', 'eraser', 'fullsize'
			// ],
			events: {
				afterInit: function () {
					const observer = new MutationObserver(() => {
					const keepBtn = Array.from(document.querySelectorAll('.jodit-ui-button__text')).find(btn => btn.textContent.trim() === 'Keep');
						if(keepBtn) {
							keepBtn.addEventListener('click', function () {
							setTimeout(() => {
								tableCenter();

							}, 1500);
							}, { once: true });
							observer.disconnect();
						}
					});
					observer.observe(document.body, {
						childList: true,
						subtree: true
					});
				}
			}
		});
		$('#employeeSpecialization').select2({
			theme:"bootstrap4",
			dropdownParent:".employeeSpecializationWrapper"
		});
		checkAllFieldsTeacherAgreement();
		$("#agreementRefNumber, #agreementDate, #typeOfTeacher, #teacherDesignation, #teacherDepartment, #employeeType, #workingHours, #adminTaskHours, #payOut").on("change keyup", function () {
			checkAllFieldsTeacherAgreement();
		});
	}else{
		$('#profileApproval').removeClass('modal-xl');
		$('#profileApprovalId #pendingRemark').show();
		$('#showAgreement1').hide();
		$('#showRemark1').show();
		$('#profileApprovalId #techerAgreementShow').hide();
	}
}
function callRemarksModel(userId){
	$('#profileApprovalModal').modal('show');
	$('#userId').val(userId);
}

function updateSchoolRemarks(){
	if (!validateCharacters($('#schoolRemarks').val())) {
		showMessageTheme2(false, 'Please use the English Keyboard while providing information');
		return false
	}
    
	if( $('#schoolRemarks').val()=='' || $('#userId').val()=='' || $('#schoolRemarksStatus').val()==undefined ){
		showMessageTheme2(false, 'Remarks is required.');      
		return false;
	}
	var remarks=escapeCharacters($('#schoolRemarks').val());
	var userId=$('#userId').val();
	if($('#schoolApprovalId #schoolRemarksStatus').val()==1){
		callCommonAction('','approve-school-request','dashboard','approve&'+remarks,userId);
	}else{
		callCommonAction('','approve-school-request','dashboard','decline&'+remarks,userId);
	}
	$('#schoolApprovalModal').modal('hide');
	setTimeout(function(){ callDashboardPageSchool('6b'); }, 1000);
}


function submitWithDrawnRequestRemark(
  formId,
  moduleId,
  requestId,
  status,
  userId
) {
  hideMessageTheme2("");
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForHTML("dashboard", "withdrawn-request-submit"),
    data: JSON.stringify(
      getRequestForSubmitWithDrawnRemark(
        formId,
        moduleId,
        requestId,
        status,
        userId
      )
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessageTheme2(true, data["message"]);
      } else {
        showMessageTheme2(false, data["message"]);
        $("#withdrawnAppovelModal").hide();
        $(".modal-backdrop").remove();
        $("body").removeClass("modal-open");
        callDashboardPageSchool(114, "withdrawn-request-list");
      }
      return false;
    }
  });
}

function getRequestForSubmitWithDrawnRemark(
  formId,
  moduleId,
  requestId,
  status,
  userId
) {
  var request = {};
  var authentication = {};
  var withdrawnRequestDTO = {};
  withdrawnRequestDTO["requestId"] = requestId;
  withdrawnRequestDTO["status"] = status;
  withdrawnRequestDTO["userId"] = userId;
  if ($("#remarks").val() != undefined) {
    withdrawnRequestDTO["remarks"] = $("#remarks").val();
  }

  request["withdrawnRequestDTO"] = withdrawnRequestDTO;
  authentication["hash"] = getHash();
  authentication["userType"] = moduleId;
  authentication["userId"] = USER_ID;
  request["authentication"] = authentication;
  return request;
}

function checkAllFieldsTeacherAgreement() {
	var fields = [
		'#agreementRefNumber',
		'#agreementDate',
		'#typeOfTeacher',
		'#teacherDesignation',
		'#teacherDepartment',
		'#employeeType',
		'#workingHours',
		'#adminTaskHours',
		'#payOut'
	];

	var isValid = true;

	fields.forEach(function (id) {
		if ($(id).val().trim() === "") {
			isValid = false;
		}
	});

	if (isValid) {
		editor.setReadOnly(false);
		fillJoditTemplate();
	} else {
		editor.setReadOnly(true);
	}
}

function fillJoditTemplate() {
    var template = teacherAgreementOfferTemplate();

    template = template
        .replace(/#REFERENCE_NO#/g, $("#agreementRefNumber").val())
        .replace(/#DATE#/g, $("#agreementDate").val())
        .replace(/#TEACHER_NAME#/g, $("#teacherDesignation").val())
        .replace(/#TEACHER_ADDRESS_LINE1#/g, $("#teacherDepartment").val())
        // you can add more replacements here
        .replace(/#BODY_CONTENT#/g, "PLEASE WRITE YOUR OFFER LETTER BODY HERE"); // blank for now, user will type

    editor.value = template;
}

function teacherAgreementOfferTemplate(){
	var html=
		`<div style="font-family: Arial; font-size: 14px; color: #000;">

			<div style="width: 100%; display: flex; justify-content: space-between; font-size: 13px;">
				<div>
					<b>Ref No.:</b> #REFERENCE_NO#
				</div>
				<div style="text-align: right;">
					<b>Date:</b> #DATE#
				</div>
			</div>

			<br>

			<!-- Address -->
			<div style="white-space: pre-line;">
				<b>#TEACHER_NAME#</b><br>
				#TEACHER_ADDRESS_LINE1#<br>
				#TEACHER_ADDRESS_LINE2#<br>
				#TEACHER_CITY#,<br>
				#TEACHER_COUNTRY#
			</div>

			<br>

			<!-- Subject -->
			<div style="text-align: center; width: 100%;">
				<b>Sub: Offer Letter</b>
			</div>

			<br><br>

			<!-- Salutation -->
			Dear <b>#TEACHER_NAME#</b>,
			<br><br>

			<!-- Body Content -->
			#BODY_CONTENT#

			<br><br>
			With Best Regards,
			<br><br>

			<!-- Signature -->
			<img src="${PATH_FOLDER_IMAGE}${schoolSettingsTechnical.teachAgreementSign}${SCRIPT_VERSION}" style="height: 80px;"><br>

			<b>Alwin Sabu</b><br>
			International Schooling<br>
			(Authorised Signatory for International Schooling)

			<br><br><br>

			<b>Acceptance of Offer:</b><br>
			I have read the above offer letter and hereby acknowledge my acceptance of the above terms and conditions of employment.
			<br><br>

			<b>Place:</b> Singapore<br>
			<b>Date:</b> #DATE#
			<br><br>

			<div style="display: flex; justify-content: space-between; width: 100%;">
				<div></div>
				<div>
					<b>Name:</b> #TEACHER_NAME#
				</div>
			</div>

		</div>`
	return html;
}
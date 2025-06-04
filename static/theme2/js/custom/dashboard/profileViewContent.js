function teacherBankDetialsContent(bankDetails, userId){
	console.log(bankDetails.accountCurrency);
	var html = 
	'<div class="modal fade modal-design" id="editProfileModal" role="dialog">'
		+'<div class="modal-dialog modal-xl" role="document">'
			+'<div class="modal-content border-0">'
				+'<div class="modal-header  theme-bg text-white pt-2 pb-2">'
					+'<h4 class="modal-title" id="exampleModalLabel">Edit Bank Details</h4>'
					+'<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">'
						+'<span aria-hidden="true">×</span>'
					+'</button>'
				+'</div>'
				+'<div class="modal-body">'
					+'<form id="bankDetailsForm" name="bankDetailsForm" method="post" autocomplete="off" action="javascript:void(0);">'
						+'<div class="row">'
							+'<div class="col-xl-2 col-lg-6 col-md-12 col-sm-12 col-12 mb-2">'
								+'<label class="secondary-txt-color">Account Currency <sup class="sup">*</sup></label>'
								+'<select name="accountCurrency" id="accountCurrency" class="select_dropdown form-control secondary-focus-border-color">'
									+'<option value="">Select Currency</option>'
									+getCurrenciesOption(bankDetails.accountCurrency)
								+'</select>'
							+'</div>'
							+'<div class="col-xl-5 col-lg-6 col-md-12 col-sm-12 col-12 mb-2">'
								+'<label class="secondary-txt-color">Account Number<sup class="sup">*</sup></label>'
								+'<div class="full">'
									+'<input id="accountNumber" name="accountNumber" type="text" value="'+bankDetails.accountNumber+'" autocomplete="off" maxlength="200" class=" form-control secondary-focus-border-color">'
								+'</div>'
							+'</div>'
							+'<div class="col-xl-2 col-lg-6 col-md-12 col-sm-12 col-12 mb-2">'
								+'<label class="secondary-txt-color">IBAN (If Available)</label>'
								+'<div class="full">'
									+'<input id="iban" name="iban" type="text" autocomplete="off" value="'+bankDetails.iban+'" maxlength="100" class=" form-control secondary-focus-border-color">'
								+'</div>'
							+'</div>'
							+'<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12 mb-2">'
								+'<label class="secondary-txt-color">Account Type<sup class="sup">*</sup></label>'
								+'<select name="accountCategory" id="accountCategory" class="form-control secondary-focus-border-color account-type">'
									+getAccountCategoriesOption(bankDetails.accountCategory)
								+'</select>'
							+'</div>'
							+'<div class="divider"></div>'
							+'<div class="col-lg-12 col-md-12 col-sm-12 col-12 mb-2">'
								+'<h6 class="mb-1">'
									+'<b>Account Holder Name</b><i>&nbsp;(as per bank record)</i>'
								+'</h6>'
							+'</div>'
							+'<div class="col-lg-4 col-md-12 col-sm-12 col-12 mb-2">'
								+'<label class="secondary-txt-color">First <sup class="sup">*</sup></label>'
								+'<div class="full">'
									+'<input id="accountHolderFirstName" name="accountHolderFirstName" type="text" value="'+bankDetails.accountHolderFirstName+'" autocomplete="off" style="text-transform:capitalize" class=" form-control secondary-focus-border-color" onkeydown="return M.isChars(event);" maxlength="100">'
								+'</div>'
							+'</div>'
							+'<div class="col-lg-4 col-md-12 col-sm-12 col-12 mb-2">'
								+'<label class="secondary-txt-color">Middle</label>'
								+'<div class="full">'
									+'<input id="accountHolderMiddleName" name="accountHolderMiddleName" type="text" value="'+bankDetails.accountHolderMiddleName+'" autocomplete="off" style="text-transform:capitalize" class=" form-control secondary-focus-border-color" onkeydown="return M.isChars(event);" maxlength="100">'
								+'</div>'
							+'</div>'
							+'<div class="col-lg-4 col-md-12 col-sm-12 col-12 mb-2">'
								+'<label class="secondary-txt-color">Last<sup class="sup">*</sup></label>'
								+'<div class="full">'
									+'<input id="accountHolderLastName" name="accountHolderLastName" type="text" value="'+bankDetails.accountHolderLastName+'" autocomplete="off" style="text-transform:capitalize" class=" form-control secondary-focus-border-color" onkeydown="return M.isChars(event);" maxlength="100">'
								+'</div>'
							+'</div>'
							+'<div class="col-lg-12 col-md-12 col-sm-12 col-12 mb-2">'
								+'<label class="secondary-txt-color">Account Holder Address<sup class="sup">*</sup></label>'
								+'<div class="full">'
									+'<input type="text" id="accountHolderAddress" name="accountHolderAddress" style="text-transform:capitalize" value="'+bankDetails.accountHolderAddress+'" class=" form-control secondary-focus-border-color" onkeydown="return M.isAddressLine(event);" autocomplete="off"  maxlength="150">'
								+'</div>'
							+'</div>'
							+'<div class="col-lg-4 col-md-12 col-sm-12 col-12 mb-2">'
								+'<label>Country<sup class="sup">*</sup></label>'
								+'<select class="select_dropdown form-control" name="accountHolderCountryId" id="accountHolderCountryId">'
									+'<option value="">Select Country*</option>'
									+getCountriesOption(bankDetails.countries, bankDetails.accountHolderCountryId)
								+'</select>'
							+'</div>'
							+'<div class="col-lg-4 col-md-12 col-sm-12 col-12 mb-2">'
								+'<label>State<sup class="sup">*</sup></label>'
								+'<select class="select_dropdown form-control" name="accountHolderStateId" id="accountHolderStateId">'
									+'<option value="">Select State</option>'
									+getStatesOption(bankDetails.accountHolderStates, bankDetails.accountHolderStateId)
								+'</select>'
							+'</div>'
							+'<div class="col-lg-4 col-md-12 col-sm-12 col-12 mb-2">'
								+'<label>City<sup class="sup">*</sup></label>'
								+'<select class="select_dropdown form-control" name="accountHolderCityId" id="accountHolderCityId">'
									+'<option value="">Select City</option>'
									+getCitiesOption(bankDetails.accountHolderCities, bankDetails.accountHolderCityId)
								+'</select>'
							+'</div>'
							+'<div class="col-lg-4 col-md-12 col-sm-12 col-12 mb-2">'
								+'<label class="secondary-txt-color">Postal Code<sup class="sup">*</sup></label>'
								+'<div class="full">'
									+'<input id="accountHolderPostal" name="accountHolderPostal" type="text" autocomplete="off" value="'+bankDetails.accountHolderPostal+'" class="form-control secondary-focus-border-color" maxlength="12">'
								+'</div>'
							+'</div>'
							+'<div class="col-lg-4 col-md-12 col-sm-12 col-12 mb-2">'
								+'<label class="secondary-txt-color">Phone No.<sup class="sup">*</sup></label>'
								+'<div class="full">'
									+'<input id="accountHolderPhone"  name="accountHolderPhone" value="'+bankDetails.accountHolderPhone+'" type="text" autocomplete="off" style="text-transform:capitalize"class="form-control secondary-focus-border-color" onkeydown="return M.digit(event);" maxlength="15">'
								+'</div>'
							+'</div>'
							+'<div class="col-lg-4 col-md-12 col-sm-12 col-12 mb-2">'
								+'<label class="secondary-txt-color">Email-ID<sup class="sup">*</sup></label>'
								+'<div class="full">'
									+'<input id="accountHolderEmail" value="'+bankDetails.accountHolderEmail+'" name="accountHolderEmail" type="text" autocomplete="off" style="text-transform:capitalize" class=" form-control secondary-focus-border-color" onkeydown="" maxlength="120">'
								+'</div>'
							+'</div>'
							+'<div class="divider"></div>'
							+'<div class="col-lg-6 col-md-12 col-sm-12 col-12 mb-2">'
								+'<label class="secondary-txt-color">Bank Name<sup class="sup">*</sup></label>'
								+'<div class="full">'
									+'<input type="text" id="bankName" name="bankName" value="'+bankDetails.bankName+'" class=" form-control secondary-focus-border-color" onkeydown="return M.isChars(event);" style="text-transform:capitalize" autocomplete="off" maxlength="200">'
								+'</div>'
							+'</div>'
							+'<div class="col-lg-6 col-md-12 col-sm-12 col-12 mb-2">'
								+'<label class="secondary-txt-color">Bank Branch Name<sup class="sup">*</sup></label>'
								+'<div class="full">'
									+'<input class=" form-control secondary-focus-border-color" onkeydown="return M.isChars(event);" id="bankBranchName" type="text" style="text-transform:capitalize" value="'+bankDetails.bankBranchName+'" name="bankBranchName" autocomplete="off" maxlength="200">'
								+'</div>'
							+'</div>'
							+'<div class="col-lg-12 col-md-12 col-sm-12 col-12 mb-2">'
								+'<label class="secondary-txt-color">Bank Branch Address<sup class="sup">*</sup></label>'
								+'<div class="full">'
									+'<input type="text" id="bankBranchAddress" name="bankBranchAddress" style="text-transform:capitalize"  value="'+bankDetails.bankBranchAddress+'" class=" form-control secondary-focus-border-color" onkeydown="return M.isAddressLine(event);" autocomplete="off" maxlength="255">'
								+'</div>'
							+'</div>'
							+'<div class="col-lg-4 col-md-12 col-sm-12 col-12 mb-2">'
								+'<label>Country<sup class="sup">*</sup></label>'
								+'<select class="select_dropdown form-control" name="bankCountryId" id="bankCountryId">'
									+'<option value="">Select Country*</option>'
									+getCountriesOption(bankDetails.countries, bankDetails.bankCountryId)
								+'</select>'
							+'</div>'
							+'<div class="col-lg-4 col-md-12 col-sm-12 col-12 mb-2">'
								+'<label>State<sup class="sup">*</sup></label>'
								+'<select class="select_dropdown form-control" name="bankStateId" id="bankStateId">'
									+'<option value="">Select State</option>'
									+getStatesOption(bankDetails.bankStates, bankDetails.bankStateId)
								+'</select>'
							+'</div>'
							+'<div class="col-lg-4 col-md-12 col-sm-12 col-12 mb-2">'
								+'<label>City<sup class="sup">*</sup></label>'
								+'<select class="select_dropdown form-control" name="bankCityId" id="bankCityId">'
									+'<option value="">Select City</option>'
									+getCitiesOption(bankDetails.bankCities, bankDetails.bankCityId)
								+'</select>'
							+'</div>'
							+'<div class="col-lg-4 col-md-12 col-sm-12 col-12 mb-2">'
								+'<label class="secondary-txt-color">Postal Code<sup class="sup">*</sup></label>'
								+'<div class="full">'
									+'<input id="bankPostal" name="bankPostal" type="text" autocomplete="off" value="'+bankDetails.bankPostal+'" class=" form-control secondary-focus-border-color" maxlength="12">'
								+'</div>'
							+'</div>'
							+'<div class="col-lg-8 col-md-12 col-sm-12 col-12 mb-2">'
							+'<label class="secondary-txt-color">Other Details<sup class="sup"></sup></label>'
								+'<div class="full">'
									+'<input id="otherDetails" name="otherDetails" type="text" autocomplete="off" value="'+bankDetails.otherDetails+'" class=" form-control secondary-focus-border-color" maxlength="300">'
								+'</div>'
							+'</div>'
							+'<div class="divider"></div>'
							+'<div class="col-lg-4 col-md-12 col-sm-12 col-12 mb-2">'
								+'<label class="secondary-txt-color">Bank Swift Code (If Applicable)</label>'
								+'<div class="full">'
									+'<input type="text" id="swiftCode" name="swiftCode" value="'+bankDetails.swiftCode+'" class="form-control secondary-focus-border-color" autocomplete="off" onkeydown="return M.isAlphaNumericWithNoSpecialCharacter(event);" maxlength="200">'
								+'</div>'
							+'</div>'
							+'<div class="col-lg-4 col-md-12 col-sm-12 col-12 mb-2">'
								+'<label class="secondary-txt-color">Bank IFSC Code (If Applicable)</label>'
								+'<div class="full">'
									+'<input type="text" id="bankIfsc" name="bankIfsc" value="'+bankDetails.bankIfsc+'" class=" form-control secondary-focus-border-color" autocomplete="off" onkeydown="return M.isAlphaNumericWithNoSpecialCharacter(event);" maxlength="30">'
								+'</div>'
							+'</div>'
							+'<div class="col-lg-4 col-md-12 col-sm-12 col-12 mb-2">'
								+'<label class="secondary-txt-color">IBAN/Routing Number (If Applicable)</label>'
								+'<div class="full">'
									+'<input class="form-control secondary-focus-border-color" id="routeNumber" type="text" name="routeNumber" value="'+bankDetails.routeNumber+'" tabindex="8" onkeydown="return M.isAlphaNumericWithNoSpecialCharacter(event);" autocomplete="off" maxlength="200">'
								+'</div>'
							+'</div>'
						+'</div>'
					+'</form>'
				+'</div>'
				+'<div class="modal-footer">'
					+'<button class="btn btn-sm btn-success" onclick="updateBankDetails(\'bankDetailsForm\','+userId+');">Save Details</button>'
				+'</div>'
			+'</div>'
		+'</div>'
	+'</div>';
	return html;
}

function teacherBankDetailsView(bankDetails){
var html=
	'<p class="m-0">'
		+'<b>Account Details:- Bank Details</b>'
	+'</p>'
	+'<div class="Profile-field-row">'
		+'<label class="label">Account Currency</label>'
		+'<span class="field-value trans5s">'+bankDetails.accountCurrency+'</span>'
	+'</div>'
	+'<div class="Profile-field-row">'
		+'<label class="label">Account Number</label>'
		+'<span class="field-value trans5s">'+bankDetails.accountNumber+'</span>'
	+'</div>'
	+'<div class="Profile-field-row">'
		+'<label class="label">IBAN (If Available)</label>'
		+'<span class="field-value trans5s">'+bankDetails.iban+'</span>'
	+'</div>'
	+'<div class="Profile-field-row">'
		+'<label class="label">Account Type</label>'
		+'<span class="field-value trans5s">'+bankDetails.accountCategory+'</span>'
	+'</div>'
	+'<div class="Profile-field-row">'
		+'<p class="m-0 label text-uppercase">Account Holder Name<i class="text-lowercase">&nbsp;(as per bank record)</i></p>'
	+'</div>'
	+'<div class="Profile-field-row">'
		+'<label class="label">First</label>'
		+'<span class="field-value trans5s">'+bankDetails.accountHolderFirstName+'</span>'
	+'</div>'
	+'<div class="Profile-field-row">'
		+'<label class="label">Middle</label>'
		+'<span class="field-value trans5s">'+bankDetails.accountHolderMiddleName+'</span>'
	+'</div>'
	+'<div class="Profile-field-row">'
		+'<label class="label">Last</label>'
		+'<span class="field-value trans5s">'+bankDetails.accountHolderLastName+'</span>'
	+'</div>'
	+'<div class="Profile-field-row">'
		+'<label class="label">Account Holder Address</label>'
		+'<p class="m-0 label text-uppercase">'+bankDetails.accountHolderAddress+'</p>'
	+'</div>'
	+'<div class="Profile-field-row">'
		+'<label class="label">Country</label>'
		+'<span class="field-value trans5s">'+bankDetails.accountHolderCountryName+'</span>'
	+'</div>'
	+'<div class="Profile-field-row">'
		+'<label class="label">State</label>'
		+'<span class="field-value trans5s">'+bankDetails.accountHolderStateName+'</span>'
	+'</div>'
	+'<div class="Profile-field-row">'
		+'<label class="label">City</label>'
		+'<span class="field-value trans5s">'+bankDetails.accountHolderCityName+'</span>'
	+'</div>'
	+'<div class="Profile-field-row">'
		+'<label class="label">Postal Code</label>'
		+'<span class="field-value trans5s">'+bankDetails.accountHolderPostal+'</span>'
	+'</div>'
	+'<div class="Profile-field-row">'
		+'<label class="label">Phone No.</label>'
		+'<span class="field-value trans5s">'+bankDetails.accountHolderPhone+'</span>'
	+'</div>'
	+'<div class="Profile-field-row">'
		+'<label class="label">Email-ID</label>'
		+'<span class="field-value trans5s">'+bankDetails.accountHolderEmail+'</span>'
	+'</div>'
	+'<div class="Profile-field-row">'
		+'<label class="label">Bank Name</label>'
		+'<span class="field-value trans5s">'+bankDetails.bankName+'</span>'
	+'</div>'
	+'<div class="Profile-field-row">'
		+'<label class="label">Bank Branch Name</label>'
		+'<span class="field-value trans5s">'+bankDetails.bankBranchName+'</span>'
	+'</div>'
	+'<div class="Profile-field-row">'
		+'<label class="label">Bank Address</label>'
		+'<p class="m-0 label text-uppercase">'+bankDetails.bankBranchAddress+'</p>'
	+'</div>'
	+'<div class="Profile-field-row">'
		+'<label class="label">Country</label>'
		+'<span class="field-value trans5s">'+bankDetails.bankCountryName+'</span>'
	+'</div>'
	+'<div class="Profile-field-row">'
		+'<label class="label">State</label>'
		+'<span class="field-value trans5s">'+bankDetails.bankStateName+'</span>'
	+'</div>'
	+'<div class="Profile-field-row">'
		+'<label class="label">City</label>'
		+'<span class="field-value trans5s">'+bankDetails.bankCityName+'</span>'
	+'</div>'
	+'<div class="Profile-field-row">'
		+'<label class="label">Postal Code</label>'
		+'<span class="field-value trans5s">'+bankDetails.bankPostal+'</span>'
	+'</div>'
	+'<div class="Profile-field-row">'
		+'<label class="label">Bank Swift Code (If Applicable)</label>'
		+'<span class="field-value trans5s">'+bankDetails.swiftCode+'</span>'
	+'</div>'
	+'<div class="Profile-field-row">'
		+'<label class="label">Bank IFSC Code (If Applicable)</label>'
		+'<span class="field-value trans5s">'+bankDetails.bankIfsc+'</span>'
	+'</div>'
	+'<div class="Profile-field-row">'
		+'<label class="label">IBAN/Routing Number (If Applicable)</label>'
		+'<span class="field-value trans5s">'+bankDetails.routeNumber+'</span>'
	+'</div>'
	+'<div class="Profile-field-row">'
		+'<label class="label">Other Details</label>'
		+'<span class="field-value trans5s">'+bankDetails.otherDetails+'</span>'
	+'</div>'
	+'<p class="m-0">'
		+'<b>Account Details:- PayPal Details</b>'
	+'</p>'
	+'<div class="Profile-field-row">'
		+'<label class="label">PayPal Emaild=</label>'
		+'<span class="field-value trans5s">'+bankDetails.payPalEmail+'</span>'
	+'</div>'
	+'<div class="Profile-field-row">'
		+'<label class="label">PayPal Mobile Number</label>'
		+'<span class="field-value trans5s">'+bankDetails.payPalIsdCode+' - '+bankDetails.payPalMobile+'</span>'
	+'</div>'
	+'<div class="Profile-field-row">'
		+'<label class="label">PayPal Account Holder Name</label>'
		+'<span class="field-value trans5s">'+bankDetails.payPalAccountHolderName+'</span>'
	+'</div>';
return html;
}

function renderAndPermissionForAproval(src, keyId,userId,studentStandardId,roleModuleId,moduleId, showWarning){
	if($('#'+keyId).val()==1){
		var html=permissionForAprovalModal(src, keyId,userId,studentStandardId,roleModuleId,moduleId, showWarning);
		$('.profileViewWrapper').append(html);
		$('#permissionModal').modal({ backdrop: 'static', keyboard: false })
	}else{
		applyChanges(src, keyId,userId,studentStandardId,roleModuleId,moduleId, showWarning)
	}
}

function hidePermissionAndApprovalModal(){
	$('#permissionModal').modal('hide');
	window.setTimeout(function () { $('#permissionModal').remove(); }, 1000)
	
}

function permissionForAprovalModal(elementFor, keyId,userId,studentStandardId,roleModuleId,moduleId,showWarning){
	var html=
	'<div class="modal fade fade-scale" id="permissionModal" tabindex="-1" aria-hidden="true">'
		+'<div class="modal-dialog modal-lg modal-dialog-centered box-shadow-none" role="document" style="width:600px">'
			+'<div class="modal-content text-center">'
				+'<div class="modal-header py-2 bg-primary">'
					+'<h5 class="modal-title text-white">';
						if(keyId=='bookASeatNextGradeOpted'){
							html+='Reserve a Seat for Next Grade';
						}else{
							html+='Course Fee Payment for Next Grade';
						}
					html+='</h5>'
					+'<button type="button" class="close remove-backdrop" data-dismiss="modal" aria-label="Close">'
						+'<span aria-hidden="true" class="text-white">&times;</span>'
					+'</button>'
				+'</div>'
				+'<div class="modal-body">'
					+'<div class="full py-3">';
					if(keyId=='bookASeatNextGradeOpted'){
						html+='<h5>Are you sure you want to enable "Reserve a Seat for Next Grade"? Please note that "Course Fee Payment for Next Grade" will be toggled to "NO".</h5>';
					}else if(keyId=='advanceGradeOpted'){
						html+='<h5>Are you sure you want to enable "Course Fee Payment for Next Grade"? Please note that "Reserve a Seat for Next Grade" will be toggled to "NO".</h5>';
					}
					html+=
					'</div>'
				+'</div>'
				+'<div class="modal-footer">'
					+'<div class="m-auto">'
						+'<button type="button" class="btn btn-success mr-2" onclick="applyChanges(\''+elementFor+'\',\''+keyId+'\',\''+userId+'\',\''+studentStandardId+'\',\''+roleModuleId+'\',\''+moduleId+'\',\''+showWarning+'\');">Confirm</button>'
						+'<button type="button" class="btn btn-primary" onclick="hidePermissionAndApprovalModal()">Cancel</button>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>'
	+'</div>';
	return html;
}

function courseSelectionModal(data){
    var html=
    `<div class="modal modal-design fade " id="select_course" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-style">
            <div class="modal-content">
                <div class="modal-header pt-2 pb-2 theme-bg text-white">
					<h5 class="modal-title">Courses Taught</h5>
					<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">×</span>
					</button>
				</div>
                <div class="modal-body">
                    <div class="full selected_course_containter">
                        <div class="full">
                            <h5 class="text-left m-0">Selected Courses</h5>
                        </div>
                        <div class="selected_course_wrapper primary-select2-option-bg">
                            <ul class="elementary_selected_course_list m-0 p-0">
                                <li class="gray-border-color light-gray-bg">
                                    <div class="course-category-wrapper">
                                        <ul class="elementary_selected_course m-0 p-0">`;
                                            var selectedCourseArray = data.subjectDetails.elementrySelectedSubject.concat(data.subjectDetails.middleSelectedSubject,data.subjectDetails.highSelectedSubject)
                                            $.each(selectedCourseArray, function(i, sub){
                                                html+=
                                                `<li class="select2-selection__choice">
                                                    <span courseId="${sub.replace(/\s+/g, '')}" class="select2-selection__choice__display">${sub}</span>
                                                </li>`;
                                            });
                                        html+=`</ul>
                                    </div>
                                </li> 
                            </ul>
                        </div>
                    </div>
                    <div class="full">
                        <ul class="custom-tab-wrapper">
                            <li class="primary-bg secondary-bg-active active-tab" onclick="selectedCourseCategory()">
                                <a href="javascript:void(0)" id="elementary">Elementary School</a>
                            </li>
                            <li class="primary-bg secondary-bg-active" onclick="selectedCourseCategory()">
                                <a href="javascript:void(0)" id="middle_school">Middle School</a>
                            </li>
                            <li class="primary-bg secondary-bg-active" onclick="selectedCourseCategory()">
                                <a href="javascript:void(0)" id="high_school">High School</a>
                            </li>
                        </ul>
                        <div class="full courses-category-wrapper">
                            <div class="full relative-select2 custom-tab-item primary-select2-option-bg white-select2-option-txt secondary-select2-hov-option-bg" id="elementaryC">
                                <div class="full relative-wrapper course_wrapper">
                                    <div class="course-tabs-format">
                                        <ul class="course-list">
                                            <li class="elementary_course_item secondary-bg-active-tab-anchor white-txt-color  active-tab" courseType="elementary-0">
                                                <div class="course-list-wrapper elementary-0-wrapper" id="elementary_course_list_0C">
                                                    <select multiple="multiple" style="width: 100%" class="select2-multi-col elementary_list elementary-0">`;
                                                        $.each(data.subjectDetails.elementryAllSubject, function(i, status){
                                                            html+=`<option value="${status}">${status}</option>`;
                                                        })
                                                    html+=`</select>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="full relative-select2 primary-select2-option-bg white-select2-option-txt secondary-select2-hov-option-bg custom-tab-item" id="middle_schoolC">
                                <div class="full relative-wrapper course_wrapper">
                                    <div class="course-tabs-format">
                                        <ul class="course-list">
                                            <li class="elementary_course_item secondary-bg-active-tab-anchor white-txt-color active-tab" courseType="middle-school-0">
                                                <div class="course-list-wrapper middle-school-0-wrapper" id="middle_course_list_0C">
                                                    <select multiple="multiple" style="width: 100%" class="select2-multi-col middle-eng-art-list middle-school-0">`;
                                                        $.each(data.subjectDetails.middleAllSubject, function(i, status){
                                                            html+=`<option value="${status}">${status}</option>`;
                                                        });
                                                    html+=`</select>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="full relative-select2 primary-select2-option-bg white-select2-option-txt secondary-select2-hov-option-bg custom-tab-item" id="high_schoolC">
                                <div class="full relative-wrapper course_wrapper">
                                    <div class="course-tabs-format">
                                        <ul class="course-list">
                                            <li class="elementary_course_item secondary-bg-active-tab-anchor white-txt-color active-tab" courseType="high-school-0">
                                                <div class="course-list-wrapper high-school-0-wrapper" id="high_course_list_0C">
                                                    <select multiple="multiple" style="width: 100%" class="select2-multi-col high-school-eng-list high-school-0">`;
                                                        $.each(data.subjectDetails.highAllSubject, function(i, status){
                                                            html+=`<option value="${status}">${status}</option>`;
                                                        });    
                                                    html+=`</select>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <input type="submit" class="btn k8-theme-btn secondary-bg white-txt-color" onclick="getSelectedSubjectes()" value="Apply">
                        <button type="button" class="btn k8-theme-btn-alt pull-left primary-bg white-txt-color" data-dismiss="modal">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    return html;
}
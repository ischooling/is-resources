var max_age = "";

$(document).ready(function() {
	
	$("#signupParent").submit(function(event) {
		event.preventDefault();
	});
});
$("#pCountryId").unbind().bind("change",function(){
	$('#pCountryId').valid();
	callStates('signupStage2', this.value, 'pCountryId', 'pStateId', 'pCityId');
	$("#pCityId").html("<option value=''>Select City*</option>");
});
$("#pStateId").unbind().bind("change",function(){
	$('#pStateId').valid();
	callCities('signupStage2', this.value, 'pStateId', 'pCityId');
});
$("#pCityId").unbind().bind("change",function(){
	$('#pCityId').valid();
});

/* ===== Relation-based Father/Mother/Guardian parent fields =====
   #parentFirstName / #parentlastName / #parentPhoneNumber always hold whichever person is
   CURRENTLY selected in #relation (this is unchanged -- same fields, same save-parent-details
   contract as before). When Relation is Father or Mother, #otherParentFirstName /
   #otherParentLastName / #otherParentPhoneNumber additionally collect the OTHER parent's
   info, always optional. Guardian gets no extra fields.

   window.__relationData holds Father/Mother/Guardian buckets IN MEMORY so switching Relation
   back and forth during the same visit never mixes up or loses what was typed for each person
   (Father -> Mother -> Guardian -> Father must come back to the original Father values, not
   stale/blank/crossed-over ones). It is seeded from the saved signupParent record (for
   whichever relation is already saved) and from the otherParent localStorage cache (see
   getStoredRelationData in signupStudentContent.js) for the other two. */
window.__relationData = window.__relationData || { Father: {}, Mother: {}, Guardian: {} };
window.__currentParentRelation = window.__currentParentRelation || '';

function getOtherRelationName(relation){
	if(relation == 'Father'){ return 'Mother'; }
	if(relation == 'Mother'){ return 'Father'; }
	return '';
}

function readParentPrimaryFieldsFromDom(){
	return {
		firstName: $('#signupStage2 #parentFirstName').val() || '',
		lastName: $('#signupStage2 #parentlastName').val() || '',
		contactNumber: $('#signupStage2 #parentPhoneNumber').val() || '',
		countryCode: $('#signupStage2 #parentCountryDailCode').val() || '',
		countryIsdCode: $('#signupStage2 #parentCountryIsd').val() || ''
	};
}

function readParentOtherFieldsFromDom(){
	return {
		firstName: $('#signupStage2 #otherParentFirstName').val() || '',
		lastName: $('#signupStage2 #otherParentLastName').val() || '',
		contactNumber: $('#signupStage2 #otherParentPhoneNumber').val() || '',
		countryCode: $('#signupStage2 #otherParentCountryDailCode').val() || '',
		countryIsdCode: $('#signupStage2 #otherParentCountryIsd').val() || ''
	};
}

function writeParentPrimaryFieldsToDom(bucket){
	bucket = bucket || {};
	$('#signupStage2 #parentFirstName').val(bucket.firstName || '');
	$('#signupStage2 #parentlastName').val(bucket.lastName || '');
	$('#signupStage2 #parentPhoneNumber').val(bucket.contactNumber || '');
	$('#signupStage2 #parentCountryDailCode').val(bucket.countryCode || '');
	$('#signupStage2 #parentCountryIsd').val(bucket.countryIsdCode || '');
	// Default to US when this bucket has no saved country (e.g. a relation switch into a
	// person who was never filled in before), instead of leaving whatever country was
	// selected for the PREVIOUS person who occupied this same field.
	if(typeof itiSetCountry === 'function' && typeof itiParent !== 'undefined' && itiParent){
		try{ itiSetCountry(itiParent, bucket.countryIsdCode || 'us'); }catch(e){}
	}
}

function writeParentOtherFieldsToDom(bucket){
	bucket = bucket || {};
	// if(STUDENT_SINGUP_CURRENT_STEP >= 2){
	// 	bucket.firstName="";
	// 	bucket.lastName="";
	// 	bucket.contactNumber="";
	// 	bucket.firstName="";
	// 	bucket.countryIsdCode="US"
	// }
	$('#signupStage2 #otherParentFirstName').val(bucket.firstName || '');
	$('#signupStage2 #otherParentLastName').val(bucket.lastName || '');
	$('#signupStage2 #otherParentPhoneNumber').val(bucket.contactNumber || '');
	// Same US default as writeParentPrimaryFieldsToDom above.
	if(typeof itiSetCountry === 'function' && typeof itiOtherParent !== 'undefined' && itiOtherParent){
		try{ itiSetCountry(itiOtherParent, bucket.countryIsdCode || 'us'); }catch(e){}
	}
}

// Relabels the primary First/Last/Mobile fields and the "other parent" block's heading for
// the given relation, and shows/hides the "other parent" block (Guardian never gets it).
function applyParentRelationLabels(relation){
	var $firstNameLabel = $('#signupStage2 label[for="parentFirstName"] .relation-label-text');
	var $lastNameLabel = $('#signupStage2 label[for="parentlastName"] .relation-label-text');
	var $phoneLabel = $('#signupStage2 label[for="parentPhoneNumber"] .relation-label-text');
	var $otherRow = $('#signupStage2 #otherParentFieldsRow');
	var $otherLabels = $('#signupStage2 .other-parent-label-text');

	if(relation == 'Father' || relation == 'Mother'){
		$firstNameLabel.text(relation+"'s First Name");
		$lastNameLabel.text(relation+"'s Last Name");
		$phoneLabel.text(relation+"'s Mobile Number");
		var otherRelation = getOtherRelationName(relation);
		$otherLabels.each(function(){
			var base = $(this).text().replace(/^(Father's|Mother's)\s*/, '');
			$(this).text(otherRelation+"'s "+base);
		});
		$otherRow.show();
	}else if(relation == 'Guardian'){
		$firstNameLabel.text("Guardian's First Name");
		$lastNameLabel.text("Guardian's Last Name");
		$phoneLabel.text("Guardian's Mobile Number");
		$otherRow.hide();
	}else{
		// No relation chosen yet: keep the original generic labels.
		$firstNameLabel.text('First Name');
		$lastNameLabel.text('Last Name');
		$phoneLabel.text('Parent Mobile Number');
		$otherRow.hide();
	}
}

// Persists the current "other parent" field values into window.__relationData AND the
// otherParent localStorage cache (so they survive a page refresh -- see
// getStoredRelationData/saveStoredRelationBucket in signupStudentContent.js). Called on blur
// of the other-parent fields (no arg -- reads the CURRENT #relation, since it hasn't changed
// yet), and from onParentRelationChanged while switching away from a relation (passes that
// relation explicitly, since by the time this fires #relation already holds the NEW value --
// relying on re-reading it here saved the fields into the WRONG bucket, e.g. Father's other-
// parent block (Mother's data) got saved back into the Father bucket instead of the Mother
// bucket when switching Father -> Mother, making Father incorrectly show Mother's values).
function persistOtherParentFieldsToCache(relation){
	relation = relation || $('#signupStage2 #relation').val();
	var otherRelation = getOtherRelationName(relation);
	if(!otherRelation){ return; }
	var bucket = readParentOtherFieldsFromDom();
	window.__relationData[otherRelation] = bucket;
	if(typeof saveStoredRelationBucket === 'function'){
		saveStoredRelationBucket(otherRelation, bucket);
	}
}

// Sets a field's green-tick/red-cross wrapper state to match its CURRENT value, for the
// relation-switch case only (see onParentRelationChanged): empty always goes NEUTRAL (never
// red) since a programmatic switch is not the user leaving the field blank; a non-empty text
// field is always a valid tick; a non-empty phone field is checked against the passed intl-
// tel-input instance the same way the field's own blur handler does.
function refreshParentFieldValidityState(id, iti){
	var val = $('#signupStage2 #'+id).val();
	val = (val == null) ? '' : String(val);
	if(val.trim() === ''){
		validEndInvalidField(null, id);
		return;
	}
	if(typeof iti !== 'undefined'){
		var valEnabled = (typeof isPhoneValidationEnabled !== 'function') || isPhoneValidationEnabled();
		var isValid = (typeof itiIsValidNumber === 'function') ? itiIsValidNumber(iti) : null;
		validEndInvalidField(!(valEnabled && iti && isValid === false), id);
		return;
	}
	validEndInvalidField(true, id);
}

// Runs the full swap when Relation changes from one value to another: saves the DOM's current
// primary (and, if applicable, other-parent) values under the OLD relation, then loads the NEW
// relation's primary value and its other-parent value back into the DOM, then relabels.
function onParentRelationChanged(){
	var newRelation = $('#signupStage2 #relation').val();
	var oldRelation = window.__currentParentRelation;

	if(oldRelation == 'Father' || oldRelation == 'Mother' || oldRelation == 'Guardian'){
		window.__relationData[oldRelation] = readParentPrimaryFieldsFromDom();
	}
	if(oldRelation == 'Father' || oldRelation == 'Mother'){
		persistOtherParentFieldsToCache(oldRelation);
	}

	writeParentPrimaryFieldsToDom(window.__relationData[newRelation]);
	if(newRelation == 'Father' || newRelation == 'Mother'){
		var otherRelation = getOtherRelationName(newRelation);
		var cached = window.__relationData[otherRelation];
		if((!cached || (!cached.firstName && !cached.lastName && !cached.contactNumber)) && typeof getStoredRelationData === 'function'){
			cached = getStoredRelationData()[otherRelation] || {};
			window.__relationData[otherRelation] = cached;
		}
		writeParentOtherFieldsToDom(cached);
	}else{
		writeParentOtherFieldsToDom({});
	}

	applyParentRelationLabels(newRelation);
	// The swap above only changes these fields' VALUES via .val() -- it reuses the same DOM
	// nodes (no re-render), so each field's .valid-field green-tick/red-cross wrapper class
	// stays whatever it was for the PREVIOUS relation's value (e.g. Father's filled, valid
	// "parentFirstName" leaves a green tick behind even once the field is blanked out for a
	// freshly-selected Mother). Refresh each field's tick/cross to match its NEW value -- but
	// an empty field goes NEUTRAL here, not red: this is a programmatic relation switch, not
	// the user leaving a field blank on blur, so a freshly-blank mandatory field should look
	// exactly like the Father/Mother row looks the first time it is ever shown (untouched,
	// no red border) until the user actually interacts with it or clicks Next.
	refreshParentFieldValidityState('parentFirstName');
	refreshParentFieldValidityState('parentlastName');
	refreshParentFieldValidityState('parentPhoneNumber', itiParent);
	refreshParentFieldValidityState('otherParentFirstName');
	refreshParentFieldValidityState('otherParentLastName');
	refreshParentFieldValidityState('otherParentPhoneNumber', typeof itiOtherParent !== 'undefined' ? itiOtherParent : null);
	if(typeof refreshCustomFieldState === "function"){
		refreshCustomFieldState('#signupStage2');
	}
	window.__currentParentRelation = newRelation;
}

// Called once right after Stage 2 is (re)rendered (see renderParentDetails in
// signupStudentContent.js): seeds window.__relationData for the relation already saved on the
// student (signupParent.relationship/firstName/lastName/contactNumber -- the authoritative,
// backend-persisted record for whichever relation that is) and for the other relation from the
// otherParent localStorage cache, then applies the correct labels/visibility for the first time.
function initParentRelationDynamicFields(signupParent){
	window.__relationData = { Father: {}, Mother: {}, Guardian: {} };
	var relation = signupParent && signupParent.relationship;
	if(relation == 'Father' || relation == 'Mother' || relation == 'Guardian'){
		window.__relationData[relation] = {
			firstName: signupParent.firstName || '',
			lastName: signupParent.lastName || '',
			contactNumber: signupParent.contactNumber || '',
			countryCode: signupParent.countryCode || '',
			countryIsdCode: signupParent.countryIsdCode2 || ''
		};
	}
	if(typeof getStoredRelationData === 'function'){
		var stored = getStoredRelationData();
		['Father','Mother'].forEach(function(key){
			if(key != relation && stored[key]){
				window.__relationData[key] = stored[key];
			}
		});
	}
	window.__currentParentRelation = relation || '';
	if(relation == 'Father' || relation == 'Mother'){
		writeParentOtherFieldsToDom(window.__relationData[getOtherRelationName(relation)]);
	}
	applyParentRelationLabels(relation || '');
}

function callForSignUpParents(fromReview) {
	hideMessage('');
	if(!validateRequestForSignupParent()){
		return false;
	}
	// When editing from the review screen, do not navigate to step 3.
	// Note: moveStep() calls this with a string arg ('signupStage2'), so only a
	// strict boolean true (from the review inline edit) counts as fromReview.
	if(fromReview !== true){
		setActiveStep(3);
		showSkeleton(true, "step3");
	}
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/student/enrollment/save-parent-details',
		data : JSON.stringify(getRequestForSignupParent()),
		dataType : 'json',
		async : true,
		// global : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else if(data['statusCode'] == "FLAGGED"){
					$("#flaggedModal").remove();
					$("body").append(flaggedModalContent(data));
					$("#flaggedModal").modal("show");
					$(".step-3-skeleton").hide();
					$("#signupStage3").hide();
					$("#signupStage2").show();
					setActiveStep(2);
					$(".prev-btn, .next-btn").removeClass("disabled");
				} else {
					if(data['statusCode']=='ELIGIBLE_CUSTOME_PLAN' || data['statusCode']=='REDIRECT_TO_DASHBOOARD'){
						window.location.reload();
					}else{	
						showMessageTheme2(false, data['message']);
						setActiveStep(2);
					}
				}
			} else {
				var windowWidth = $(window).width();
				var msg = "";
				// Guardian saved successfully: the backend record now holds the Guardian's info
				// (it only ever stores ONE parent record), so any previously-cached Father/Mother
				// data is stale -- wipe it so switching Relation back to Father/Mother later
				// starts blank instead of resurrecting the old values.
				if($('#signupStage2 #relation').val() == 'Guardian'){
					window.__relationData.Father = {};
					window.__relationData.Mother = {};
					if(typeof clearStoredRelationData === 'function'){
						clearStoredRelationData();
					}
				}
				if(fromReview !== true){
					getAllCourseDetails('N','');
				}
				if($('#learingProgramHeader').val()=='ONE_TO_ONE_FLEX'){
					msg ="Wow! Academic & Communication Details Updated."
				}else if($("#courseProviderId").val() == 39){
					if($('.learingProgramHeader').html()=='English Learning Program - One to One'){
						msg="Wow! Communication Details Updated"
					}else if($('.learingProgramHeader').html()=='English Learning Program - Self Study'){
						msg="Wow! Communication Details Updated"
					}
				}
				else{
					msg = windowWidth>580?" Just two step away":"Just two step away"
				}
				// Show the success message only the first time step 2 is completed. Uses ONLY
				// the per-step localStorage flag (UUID-scoped, reset for a new enrollment) —
				// STUDENT_SINGUP_CURRENT_STEP is fixed for the whole page session to whatever
				// step the student resumed at, so an "&& STUDENT_SINGUP_CURRENT_STEP<2" clause
				// would wrongly block this on a student resuming exactly at step 2.
				if(typeof getEnrollmentStepFlag !== "function" || !getEnrollmentStepFlag(2)){
					if(windowWidth >580){
						// showMessageTheme2(1, msg, '', true);
					}else{
						// $("#showMessageInPopup #msgText").text(msg);
						// $("#showMessageInPopup").modal("show");
						setTimeout(function(){
							$("#showMessageInPopup").modal("hide");
						},3000);
					}
					if(typeof setEnrollmentStepFlag === "function"){
						setEnrollmentStepFlag(2, true);
					}
				}
				if(fromReview === true){
					// stay on the review screen: move the form back and refresh review
					finishReviewInlineEditSave('parent');
				}
			}
		},
		error: function(e){
			if (checkonlineOfflineStatus()) {
				return;
			}
		}
	});
}

// Red-border EVERY currently-empty required parent field so the user sees all missing fields at
// once when moving to the next step. Mirrors the exact required set (and the same conditional
// groups) checked in validateRequestForSignupParent below. Filled fields are left untouched, and
// parentPhoneNumber / referralCode are excluded — the validation does not require them non-empty.
function highlightRequiredParentFields(){
	var F = 'signupStage2';
	function emptyText(id){ var v = $("#"+F+" #"+id).val(); return (v == null || $.trim(String(v)) == ""); }
	function emptySelect(id){ var v = $("#"+F+" #"+id).val(); return (v == null || v == '' || v == 0); }
	// Only red-border the empty ones; filled fields keep whatever their own blur/change
	// handlers set (so a filled-but-format-invalid field is not wrongly cleared to green).
	function mark(id, isEmpty){ if(isEmpty){ validEndInvalidField(false, id); } }

	if($('#learingProgramHeader').val() == 'ONE_TO_ONE_FLEX'){
		mark('workingProfession', emptySelect('workingProfession'));
		mark('institutionName', emptyText('institutionName'));
		mark('institutionCountryId', emptySelect('institutionCountryId'));
	}else if($('#courseProviderId').val() == 39){
		// courseProviderId 39: no per-field requirements in this branch
	}else{
		mark('parentFirstName', emptyText('parentFirstName'));
		mark('parentlastName', emptyText('parentlastName'));
		mark('relation', emptySelect('relation'));
		mark('parentPhoneNumber', emptyText('parentPhoneNumber'));
		mark('pCountryId', emptySelect('pCountryId'));
		mark('pStateId', emptySelect('pStateId'));
		mark('pCityId', emptySelect('pCityId'));
	}
}

function validateRequestForSignupParent(){
	hideMessage('');
	// Red-border every empty required field before showing the single first-error message.
	highlightRequiredParentFields();
	// if (!validateFormAscii()) {
	// 	showMessageTheme2(0, 'Please use the English Keyboard while providing information');
	// 	return false
	// }
	if($('#learingProgramHeader').val()=='ONE_TO_ONE_FLEX' ){
		if ($("#signupStage2 #workingProfession").val()==0 || $("#signupStage2 #workingProfession").val() == '' || $("#signupStage2 #workingProfession").val()==null) {
			showMessageTheme2(0, 'Student or a working professional is required');
			return false
		}
		if ($("#signupStage2 #institutionName").val()=="") {
			showMessageTheme2(0, 'Name of the School/College/Organization is required.');
			return false
		}
		if ($("#signupStage2 #institutionCountryId").val()==0 || $("#signupStage2 #institutionCountryId").val()=='' || $("#signupStage2 #institutionCountryId").val()==null) {
			showMessageTheme2(0, 'Country of the School/College/Organization is required');
			return false
		}
	}else{
		var courseProviderId=$('#courseProviderId').val();
		if(courseProviderId==39){
	
		}else{
			if ($("#signupStage2 #parentFirstName").val()=="") {
				showMessageTheme2(0, 'First name is required.');
				return false
			}
			if ($("#signupStage2 #parentlastName").val()=="") {
				showMessageTheme2(0, 'Last name is required.');
				return false
			}
			if ($("#signupStage2 #relation").val()==0 || $("#signupStage2 #relation").val()==null) {
				showMessageTheme2(0, 'Relation with student is required');
				return false
			}
			if ($("#signupStage2 #parentPhoneNumber").val()=="") {
				showMessageTheme2(0, 'Mobile Number is required');
				return false
			}
			if ($("#signupStage2 #parentPhoneNumber").val().length <= 2 && $("#signupStage2 #parentPhoneNumber").val().length > 0) {
				showMessageTheme2(0, 'Invalid Phone Number');
				return false
			}
			// intl-tel-input v29.2 country-aware validation (parentPhoneNumber is mandatory --
			// the empty check above already returned false, so this only runs on a non-empty
			// value).
			var _phoneValEnabled2 = (typeof isPhoneValidationEnabled !== 'function') || isPhoneValidationEnabled();
			var _parentPhoneValid = (typeof itiIsValidNumber === 'function') ? itiIsValidNumber(itiParent) : (itiParent && itiParent.isValidNumber());
			if (_phoneValEnabled2 && $("#signupStage2 #parentPhoneNumber").val().length > 0 && typeof itiParent !== 'undefined' && itiParent && _parentPhoneValid === false) {
				showMessageTheme2(0, typeof getIntlPhoneValidationMessage === 'function' ? getIntlPhoneValidationMessage(itiParent.getValidationError()) : 'Please enter a valid parent phone number for the selected country');
				return false
			}
			if ($("#signupStage2 #pCountryId").val()==0 || $("#signupStage2 #pCountryId").val()=='') {
				showMessageTheme2(0, 'Country is required');
				return false
			}
			if ($("#signupStage2 #pStateId").val()==0 || $("#signupStage2 #pStateId").val()=='') {
				showMessageTheme2(0, 'State/Province is required');
				return false
			}
			if ($("#signupStage2 #pCityId").val()==0 || $("#signupStage2 #pCityId").val()=='') {
				showMessageTheme2(0, 'City is required');
				return false
			}
			// Optional "other parent" mobile number (Father/Mother relation only): same
			// reused mobile-number validation as the primary parentPhoneNumber above --
			// empty stays valid, a non-empty value must still pass country-aware validation.
			if(getOtherRelationName($("#signupStage2 #relation").val())){
				var otherPhoneVal = $("#signupStage2 #otherParentPhoneNumber").val();
				if (otherPhoneVal.length <= 2 && otherPhoneVal.length > 0) {
					showMessageTheme2(0, 'Invalid Phone Number');
					return false
				}
				var _otherPhoneValid = (typeof itiIsValidNumber === 'function') ? itiIsValidNumber(itiOtherParent) : (typeof itiOtherParent !== 'undefined' && itiOtherParent && itiOtherParent.isValidNumber());
				if (_phoneValEnabled2 && otherPhoneVal.length > 0 && typeof itiOtherParent !== 'undefined' && itiOtherParent && _otherPhoneValid === false) {
					showMessageTheme2(0, typeof getIntlPhoneValidationMessage === 'function' ? getIntlPhoneValidationMessage(itiOtherParent.getValidationError()) : 'Please enter a valid mobile number for the selected country');
					return false
				}
			}
			if ($("#signupStage2 #referralCode").val()=="") {
				// showMessageTheme2(0, 'Referral Code is required.');
				// return false
			}
		}
	}
	var pcModeWhatsapp=$('#signupStage2 #pcModeWhatsapp').is(':checked')?'Y':'N';
	var pcModeCall=$('#signupStage2 #pcModeCall').is(':checked')?'Y':'N';
	var pcModeEmail=$('#signupStage2 #pcModeEmail').is(':checked')?'Y':'N';
	if(pcModeWhatsapp == "Y" || pcModeCall == "Y" || pcModeEmail == "Y"){
		
	}else{
		showMessageTheme2(0, 'How would you like us to contact you? Please tick below ✓');
		return false
	}
//	if ($("#signupStage2 #countryCodeParent").val()==null) {
//		showMessageTheme2(0, 'ISD code is required');
//		return false
//	}
//	if ($("#signupStage2 #parentPhoneNumber").val()=="") {
//		showMessageTheme2(0, 'Phone No is required.');
//		return false
//	}

//	if ($("#signupStage2 #contactNumberAlternate").val()!="" ){
//		if ($("#signupStage2 #countryCodeAlternateParent").val()=="" ){
//			showMessageTheme2(0, 'Alternate ISD Code is required.');
//			return false
//		}else if ($("#signupStage2 #countryCodeAlternateParent").val()==null ){
//			showMessageTheme2(0, 'Alternate ISD Code is required.');
//			return false
//		}
//	}
	return true;
}

function getRequestForSignupParent(){
	var saveParentDetailsRequestDTO = {};
	var authentication = {};
	var signupParentDTO = {};
	var additionalParent = {};
	var relations;
	signupParentDTO['themeType'] = 'theme2';
	if($('#learingProgramHeader').val()=='ONE_TO_ONE_FLEX' ){
		signupParentDTO['workingProfession'] = $("#signupStage2 #workingProfession").val();
		signupParentDTO['institutionName'] = $("#signupStage2 #institutionName").val();
		signupParentDTO['institutionCountryId'] = $("#signupStage2 #institutionCountryId").val();
	}else{
		signupParentDTO['relationship'] = $("#signupStage2 #relation").val();
		relations = $("#signupStage2 #relation").val();//$("#signupStage2  #relation option:selected").text();
		if(relations == 'Other'){
			signupParentDTO['otherRelationName'] = $("#signupStage2 #otherName").val();
		}else{
			signupParentDTO['otherRelationName'] ='';
		}
		signupParentDTO['firstName'] = $("#signupStage2 #parentFirstName").val();
		signupParentDTO['lastName'] = $("#signupStage2 #parentlastName").val();
		if ($("#signupStage2 #parentSwitchIntput").is(":checked")){
			signupParentDTO['skipParent'] = "N";
			signupParentDTO['password'] = $("#signupStage2 #parentPassword").val();
			signupParentDTO['parentEmailStatus'] = $("#signupStage2 #parentEmailStatus").val();
		}else{
			signupParentDTO['skipParent'] = "Y";
		}
		var parentContactNumber = $("#signupStage2 #parentPhoneNumber").val();
		if (parentContactNumber && parentContactNumber.trim() != "") {
			signupParentDTO['countryCode'] = $("#signupStage2 #parentCountryDailCode").val();
			signupParentDTO['countryIsdCode2'] = $("#signupStage2 #parentCountryIsd").val();
		} else {
			// No number entered: never save a country code/flag with a blank number
			// (e.g. the widget's default country), otherwise it shows up against an
			// empty contact number in the Manage Users list.
			signupParentDTO['countryCode'] = '';
			signupParentDTO['countryIsdCode2'] = '';
		}
		signupParentDTO['contactNumber'] = parentContactNumber;
		signupParentDTO['gender'] = 'DONOTWANTTOSPECIFY';
		signupParentDTO['countryId'] = $("#signupStage2 #pCountryId").val();
		signupParentDTO['stateId'] = $("#signupStage2 #pStateId").val();
		signupParentDTO['cityId'] = $("#signupStage2 #pCityId").val();

		
	}

	if($("#signupStage2 #referralCode").length>0){
		signupParentDTO['referralCode'] = $("#signupStage2 #referralCode").val().trim();
	}else{
		signupParentDTO['referralCode'] = '';
	}
	var pcModeWhatsapp=$('#signupStage2 #pcModeWhatsapp').is(':checked')?'Y':'N';
	var pcModeCall=$('#signupStage2 #pcModeCall').is(':checked')?'Y':'N';
	var pcModeEmail=$('#signupStage2 #pcModeEmail').is(':checked')?'Y':'N';
	var communications='W='+pcModeWhatsapp+'|C='+pcModeCall+'|E='+pcModeEmail;
	signupParentDTO['communications']=communications;
	signupParentDTO['responsibleConfirm'] = "Yes";

	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = 'STUDENT';
	authentication['userId'] = $("#userId").val();
	saveParentDetailsRequestDTO['authentication'] = authentication;
	saveParentDetailsRequestDTO['signupParent'] = signupParentDTO;
	// Optional "other parent" info (only collected for Father/Mother, never Guardian).
	// NOTE -- backend impact: SignupParentDTO (com.c2e.is.v1.dto.SignupParentDTO) has no
	// fatherXxx/motherXxx properties yet, so the backend currently drops these extra JSON
	// properties silently (FAIL_ON_UNKNOWN_PROPERTIES is not enabled). Sending them is
	// forward-compatible and does not change the existing save-parent-details contract,
	// but they will NOT be persisted server-side until SignupParentDTO (and the
	// save-parent-details handling that maps it) is extended to store them. See the
	// localStorage-based client-side fallback used for the Review screen in
	// signupStudentContent.js (getStoredRelationData/saveStoredRelationBucket).
	var otherRelation = getOtherRelationName(relations);
	if(otherRelation && relations != "Guardian"){
		var otherFirstName = $("#signupStage2 #otherParentFirstName").val();
		var otherLastName = $("#signupStage2 #otherParentLastName").val();
		var otherContactNumber = $("#signupStage2 #otherParentPhoneNumber").val();
		
		if(otherContactNumber && otherContactNumber.trim() != ""){
			otherCountryCode = $("#signupStage2 #otherParentCountryDailCode").val();
			otherCountryIsdCode = $("#signupStage2 #otherParentCountryIsd").val();
		}
		if(otherRelation == 'Mother'){
			additionalParent['firstName'] = otherFirstName;
			additionalParent['lastName'] = otherLastName;
			additionalParent['contactNumber'] = otherContactNumber;
			additionalParent['relationship'] = "Mother";
		}else{
			additionalParent['firstName'] = otherFirstName;
			additionalParent['lastName'] = otherLastName;
			additionalParent['contactNumber'] = otherContactNumber;
			additionalParent['relationship'] = "Father";
		}

		persistOtherParentFieldsToCache();
	}else if(relations == "Guardian"){
		additionalParent['firstName'] = "";
		additionalParent['lastName'] = "";
		additionalParent['contactNumber'] = "";
		additionalParent['relationship'] = "";
	}
	saveParentDetailsRequestDTO['additionalParent'] = additionalParent;
	return saveParentDetailsRequestDTO;
}

function emailCheckForParentUser(parentEmail, module, userId, studentId, parentName) {
	var result="";
	hideMessage('');
		if (!validateEmail(parentEmail)) {
			showMessageTheme2(0, 'Parent email is either empty or invalid');
			return false;
		}
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForCommon('send-otp-for-parent-verification'),
		data : JSON.stringify(getCallRequestForEmailCheckForParentUser(parentEmail, module, userId, studentId)),
		dataType : 'json',
		async:false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				if(data['extra1']=='Y'){
					result = true;
				}else{
					result = data['extra']+'|'+ data['extra2'];
				}
			}else if (data['status'] == '3') {
				showMessageTheme2(0, data['message']);
				result = false;
			}else{
				result=true;
			}
		}
	});
	return result;
}
function getCallRequestForEmailCheckForParentUser(parentEmail, module, userId, studentId){
	var request = {};
	var authentication = {};
	var data = {};
	data['requestKey'] = 'EMAIL-AVAILABLE';
	data['email'] = parentEmail;
	data['userId'] = userId;
	data['schoolId'] = SCHOOL_ID;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = module;
	request['authentication'] = authentication;
	request['data'] = data;
	return request;
}

function proceedWithExistingMappings(){
	if(!$("#signupStage2 #checkTerms").prop("checked")){
		showModalMessage(true, 'Please click terms and conditions');
		return false
	}
	$('#parentExistModal').modal('hide');
}

function populateParentData(signupParentDTO){
	$('#signupStage2 #relation').val(signupParentDTO.relationship).trigger('change');
	$('#signupStage2 #otherName').val(signupParentDTO.otherRelationName);
	$('#signupStage2 #parentFirstName').val(signupParentDTO.firstName);
	$('#signupStage2 #parentlastName').val(signupParentDTO.lastName);
	$('#signupStage2 #parentGender').val(signupParentDTO.gender).trigger('change');
	$('#signupStage2 #responsibleConfirm').val(signupParentDTO.responsibleConfirm);
	$('#signupStage2 #skipParent').val(signupParentDTO.skipParent);
	$('#signupStage2 #countryCodeParent').val('+'+signupParentDTO.countryCode);
	$('#signupStage2 #contactNumber').val(signupParentDTO.contactNumber);
	if(signupParentDTO.countryCodeAlternate != ''){
		$('#signupStage2 #countryCodeAlternateParent').val('+'+signupParentDTO.countryCodeAlternate);
	}
	if(signupParentDTO.contactNumberAlternate != ''){
		$('#signupStage2 #contactNumberAlternate').val(signupParentDTO.contactNumberAlternate);
	}
	disabledParentData(true);
}

function disabledParentData(flag){
	$('#signupStage2 #relation').prop('disabled', flag);
	$('#signupStage2 #otherName').prop('disabled', flag);
	$('#signupStage2 #parentFirstName').prop('disabled', flag);
	$('#signupStage2 #parentlastName').prop('disabled', flag);
	$('#signupStage2 #parentGender').prop('disabled', flag);
	$('#signupStage2 #responsibleConfirm').prop('disabled', flag);
	$('#signupStage2 #skipParent').prop('disabled', flag);
	$('#signupStage2 #parentEmail').prop('disabled', flag);
	$('#signupStage2 #countryCodeParent').prop('disabled', flag);
	$('#signupStage2 #contactNumber').prop('disabled', flag);
	$('#signupStage2 #guardianConfirmation').prop('disabled', flag);
}

function sendOtpForParentUser(parentEmail, parentName, userId) {
	if (!validateEmail(parentEmail)) {
		showMessageTheme2(0, 'Parent email is empty or invalid');
		return false
	}
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForCommon('send-otp-for-parent-verification'),
		data : JSON.stringify(getDataForParentOTPVerification(parentEmail,parentName, userId)),
		dataType : 'json',
		async:false,
		success : function(data) {
			 if(data['statusCode']=="1"){
				showMessageTheme2(1, data['message'], "", true);
			}else if(data['statusCode']=="4"){
				showMessageTheme2(2, data['message'], "", true);
			}else if(data['statusCode']=="0"){
				showMessageTheme2(0, data['message'], "", true);
			}else{
				showMessageTheme2(0, data['statusCode'], "", true);
			}
		}
	});
}

function getDataForParentOTPVerification(parentEmail, parentName, userId){
	var request = {};
	var authentication = {};
	var requestData = {};
	requestData['userId'] = userId;
	requestData['email'] = parentEmail;
	requestData['schoolId'] = SCHOOL_ID;
	requestData['parentName'] = parentName;
	authentication['hash'] = getHash();
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}

// Cascades the parent's Country -> State -> City selects to match the student's current
// location (#signupStage1 #countryId/#stateId/#cityId), same as the "Change your location"
// checkbox OFF path. Each step waits for the previous select's change-triggered AJAX (states/
// cities) to populate before setting the next, so this only works while #pCountryId/#pStateId/
// #pCityId are enabled. `callback` (optional) runs once the city is set. Shared by addressSameAs()
// (checkbox toggle) and the review-screen Student Details save (student's location edited while
// "Change your location" stays unchecked -> parent location must follow it).
function syncParentLocationWithStudent(callback){
	$('#signupStage2 #pCountryId').val($('#signupStage1 #countryId').val()).trigger('change');
	window.setTimeout(function(){
		$('#signupStage2 #pStateId').val($('#signupStage1 #stateId').val()).trigger('change');
		window.setTimeout(function(){
			$('#signupStage2 #pCityId').val($('#signupStage1 #cityId').val()).trigger('change');
			if(typeof callback === 'function'){ callback(); }
		},500);
	},500);
}

function addressSameAs(){
	var flag=$('#sameAsStudentLocation').is(':checked');
	if(flag){
		// "Change your location" ON: unlock the fields and blank them so the parent
		// can enter a location different from the student's (country -> state -> city).
		IS_PARENT_COUNTRY_CHANGE=true;
		$('#signupStage2 #pStateId').html('<option value="">Select Province/State*</option>');
		$('#signupStage2 #pCityId').html('<option value="">Select City*</option>');
		$('#signupStage2 #pCountryId').prop('disabled',false);
		$('#signupStage2 #pStateId').prop('disabled',false);
		$('#signupStage2 #pCityId').prop('disabled',false);

		$('#signupStage2 #pCountryId').val('').trigger('change');
		$('#signupStage2 #pStateId').val('').trigger('change');
		$('#signupStage2 #pCityId').val('').trigger('change');

	}else{
		IS_PARENT_COUNTRY_CHANGE=false;
		// OFF: reuse the student's location and lock the fields again.
		$('#sameAsStudentLocation').prop('disabled', true);
		$('#signupStage2 #pCountryId').prop('disabled',false);
		$('#signupStage2 #pStateId').prop('disabled',false);
		$('#signupStage2 #pCityId').prop('disabled',false);
		syncParentLocationWithStudent(function(){
			$('#signupStage2 #pCountryId').prop('disabled',true);
			$('#signupStage2 #pStateId').prop('disabled',true);
			$('#signupStage2 #pCityId').prop('disabled',true).promise().done(function(){
				$('#sameAsStudentLocation').prop('disabled',false);
			});
		});
	}
}

function getRequestForParentSelection(studentUserId){
	var studentRequestDTO = {};
	if(studentUserId){
		studentRequestDTO['userId'] = studentUserId;
	}else{
		studentRequestDTO['userId'] = $('#userId').val();
	}
	return studentRequestDTO;
}
function callForParentSelection(studentUserId) {
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/student/enrollment/get-parent-details',
		data : JSON.stringify(getRequestForParentSelection(studentUserId)),
		dataType : 'json',
		async : false,
		global : false,
		success : async function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					if(data['statusCode']=='ELIGIBLE_CUSTOME_PLAN' || data['statusCode']=='REDIRECT_TO_DASHBOOARD'){
						window.location.reload();
					}else{
						showMessageTheme2(false, data['message']);
					}
				}
            	} else {
					var responseData = await getCommissionPayByData();
					SHOW_PAYMENT_OPTION = responseData.showPaymentOption;
					if(responseData.signupType == 'Online' ){
						if (SHOW_PAYMENT_OPTION == 'Y') {
							$("#finishBtnId").text('Final Step');
						} else {
							$("#finishBtnId").text('Submit Application');
						}
					}else{
						$("#finishBtnId").text('Submit Application');
					}
				renderParentDetails(data);
				$(".step-2-skeleton").html('');
				$(".step-2-skeleton").hide();
				$("#signupStage2").show();
			}
			$(".prev-btn, .next-btn").removeClass("disabled");
		},
		error: function(e){
			if (checkonlineOfflineStatus()) {
				return;
			}
		}
	});
}


function signupTeacherStage5OnLoadEvent(data){
	$('#socialMediaCheckbox').on('change', function () {
		const isChecked = $(this).is(':checked');
		const fields = [
			{ input: '#linkedinProfileUrl', sup: '#linkedinStar' },
			{ input: '#facebookProfileUrl', sup: '#facebookStar' },
			{ input: '#instagramProfileUrl', sup: '#instagramStar' },
			{ input: '#twitterProfileUrl', sup: '#twitterStar' }
		];
		fields.forEach(field => {
			if (isChecked) {
				$(field.input).val('').prop('disabled', true);
				$(field.sup).hide();
			} else {
				$(field.input).prop('disabled', false);
				$(field.sup).show();
			}
		});
	});
	$('#socialMediaCheckbox').trigger('change');

	const phoneIds = ['#reference1Phone', '#reference2Phone'];
	phoneIds.forEach((selector, index) => {
		const input = document.querySelector(selector);
		if (input) {
			const iti = window.intlTelInput(input, {
				initialCountry: 'us',
			});
			const ref = data.employeeReference[index];
			if (ref?.isdCode && ref?.isoCode) {
				if(IGNORECOUNTRYARRAY.includes(ref.isoCode.toLowerCase())) {
					ref.isoCode	= "US";
				}
				iti.setCountry(ref.isoCode.toLowerCase());
				input.value = ref.number;
				$('#countryData' + (index + 1)).val(ref.isoCode.toLowerCase());
				$('#countryIsd' + (index + 1)).val(ref.isdCode);
			}
			input.addEventListener('countrychange', function () {
				const countryData = iti.getSelectedCountryData();
				$('#countryData' + (index + 1)).val(countryData.iso2);
				$('#countryIsd' + (index + 1)).val(countryData.dialCode);
			});
		}
	});
}

async function getStage5Data(){
	setSteps(5);
	showSkeleton(true, 'step5');
	var payload = {};
	payload['userId'] = USER_ID;
	responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'get-teacher-verification-details', payload, '/teacher/signup');
	$("#teacherSignupContentStage5").html(getTeacherVerificationDetailsContent(responseData.details));
	signupTeacherStage5OnLoadEvent(responseData.details);
	$(".step-5-skeleton").hide();
	$("#teacherSignupStage5").show();
	$(".next-btn a").text("Next");
	if (typeof refreshCustomFieldState === "function") {
		refreshCustomFieldState("#teacherSignupStage5");
	}
}

function verificationValidationOnSave(formId){
    // 1. Social media validation
    if (!$('#socialMediaCheckbox').is(':checked')) {
        const socialLinks = [
            $('#linkedinProfileUrl').val().trim(),
            $('#facebookProfileUrl').val().trim(),
            $('#instagramProfileUrl').val().trim(),
            $('#twitterProfileUrl').val().trim()
        ];

        const hasOneSocial = socialLinks.some(link => link !== '');
        if (!hasOneSocial) {
            showMessageTheme2(2, 'Please provide at least one social media link.');
            return false;
        }
    }

	// 2. Recommendation Letter validation
	if (
		$("#" + formId + " #fileupload7Span").html().trim() === '' ||
		$("#" + formId + " #fileupload7Span").html().trim() === 'Upload Recommendation Letter 1'
	) {
		showMessageTheme2(2, 'Please Upload Recommendation Letter 1');
		return false;
	}

	if (
		$("#" + formId + " #fileupload8Span").html().trim() === '' ||
		$("#" + formId + " #fileupload8Span").html().trim() === 'Upload Recommendation Letter 2'
	) {
		showMessageTheme2(2, 'Please Upload Recommendation Letter 2');
		return false;
	}

	// 3. Reference validation
    const validateReference = (refNum) => {
        const name = $(`#reference${refNum}Name`).val().trim();
        const email = $(`#reference${refNum}Email`).val().trim();
        const phone = $(`#reference${refNum}Phone`).val().trim();
        const designation = $(`#reference${refNum}Designation`).val().trim();

        if (!name || !email || !phone || !designation) {
			showMessageTheme2(2, `Please fill all fields for Reference ${refNum}.`);
			return false;
		}
        return true;
    };
	if (!validateReference(1) || !validateReference(2)) {
        return false;
    }

	// 4. Police declaration checkbox
    if (!$('#policeVerificationCheck').is(':checked')) {
        showMessageTheme2(2, 'Please accept the police verification declaration.');
        return false;
    }

    // 5. File upload validation
    if (
        $("#" + formId + " #fileupload9Span").html().trim() === '' ||
        $("#" + formId + " #fileupload9Span").html().trim() === 'Upload Police Verification'
    ) {
        showMessageTheme2(2, 'Please Upload Police Verification');
        return false;
    }

    if (
        $("#" + formId + " #fileupload10Span").html().trim() === '' ||
        $("#" + formId + " #fileupload10Span").html().trim() === 'Upload Last Salary Slip'
    ) {
        showMessageTheme2(2, 'Please Upload Last Salary Slip');
        return false;
    }

	return true;
}

function getRequestForVerification() {
	const dontHaveSocial = $('#socialMediaCheckbox').is(':checked');
	const socialMediaDetails = {
		linkedIn: dontHaveSocial ? '' : $('#linkedinProfileUrl').val().trim(),
		facebook: dontHaveSocial ? '' : $('#facebookProfileUrl').val().trim(),
		instagram: dontHaveSocial ? '' : $('#instagramProfileUrl').val().trim(),
		twitter: dontHaveSocial ? '' : $('#twitterProfileUrl').val().trim(),
		dontHaveSocialMediaAccount: dontHaveSocial ? 'Y' : 'N'
	};

	const referenceDetails = [];
	const extractReference = (refNum) => {
		const name = $(`#reference${refNum}Name`).val().trim();
		const email = $(`#reference${refNum}Email`).val().trim();
		const phoneInput = document.querySelector(`#reference${refNum}Phone`);
		const designation = $(`#reference${refNum}Designation`).val().trim();

		const iti = window.intlTelInputGlobals.getInstance(phoneInput);
		const countryData = iti.getSelectedCountryData();
		const isdCode = countryData ? parseInt(countryData.dialCode) : null;
		const isoCode = countryData ? countryData.iso2 : null;

		const phone = $(phoneInput).val().trim();

		if (name && email && phone && isdCode && designation) {
			referenceDetails.push({
				name,
				email,
				isdCode,
				isoCode,
				number: phone,
				designation
			});
		}
	};
	extractReference(1);
	extractReference(2);

	const requestData = {
		requestData: {
			referenceDetails,
			socialMediaDetails,
			userId: USER_ID,
			policeVerification: $('#policeVerificationCheck').is(':checked') ? 'Y' : 'N',
			attachments: verifyUploadDocsObj
		}
	};
	return requestData;
}

async function saveVerificationDetails(formId){
	if(verificationValidationOnSave(formId)){
		const requestBody = getRequestForVerification();
		const saveResponse = await getDashboardDataBasedUrlAndPayloadWithParentUrl( true, true, 'save-teacher-verification', requestBody, 'teacher/signup');
		if (saveResponse.statusCode === "SUCCESS") {
            showMessageTheme2(1, 'Verification submitted successfully');
			$("#submitVerificationModal").modal("hide");
			setTimeout(() => {
				$('#inReviewForTeacherVerificationModal').modal({backdrop: 'static', keyboard: false});
			}, 500);
        } else {
            showMessageTheme2(0, saveResponse.message);
        }
	}
}

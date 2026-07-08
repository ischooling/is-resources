
function getRequestForStudentDashboardSelection(){
	var studentRequestDTO = {};
	studentRequestDTO['userId'] = USER_ID;
	return studentRequestDTO;
}

function getStudentDashboardOrMigrationSection() {
	if (typeof isDummyStudentMode === "function" && isDummyStudentMode() && typeof getDummyGradeKDashboardOrMigrationSection === "function") {
		return getDummyGradeKDashboardOrMigrationSection();
	}
	var returnData={};
	customLoader(true);
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : BASE_URL+CONTEXT_PATH+SCHOOL_UUID+'/student/dashboard/dashboard-or-migration',
		data : JSON.stringify(getRequestForStudentDashboardSelection()),
		dataType : 'json',
		async : false,
		global : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') {
                    redirectLoginPage();
                } else {
					showMessageTheme2(0, data['message'], '', true);
                }
            } else {
				returnData=data;
			}
			customLoader(false);
		},
		error: function(e){
			if (checkonlineOfflineStatus()) {
				return;
			}
		}
	});
	return returnData;
}

function getStudentDashboardDetails() {
	if (typeof isDummyStudentMode === "function" && isDummyStudentMode() && typeof getDummyGradeKDashboardDetails === "function") {
		return getDummyGradeKDashboardDetails();
	}
	var returnData={};
	customLoader(true);
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : BASE_URL+CONTEXT_PATH+SCHOOL_UUID+'/student/dashboard/get-student-dashboard',
		data : JSON.stringify(getRequestForStudentDashboardSelection()),
		dataType : 'json',
		async : false,
		global : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') {
                    redirectLoginPage();
                } else {
					showMessageTheme2(0, data['message'], '', true);
                }
            } else {
				returnData=data;
			}
			customLoader(false);
		},
		error: function(e){
			if (checkonlineOfflineStatus()) {
				return;
			}
		}
	});
	return returnData;
}

function getStudentMigraionOptionDetails() {
	var returnData={};
	customLoader(true);
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : BASE_URL+CONTEXT_PATH+SCHOOL_UUID+'/student/migration/get-migration-option-details',
		data : JSON.stringify(getRequestForStudentDashboardSelection()),
		dataType : 'json',
		async : false,
		global : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') {
                    redirectLoginPage();
                } else {
					showMessageTheme2(0, data['message'], '', true);
                }
            } else {
				returnData=data;
			}
			customLoader(false);
		},
		error: function(e){
			if (checkonlineOfflineStatus()) {
				return;
			}
		}
	});
	return returnData;
}

function callForStudentNextSession(nextGradeId, enrollmentType, registrationType) {
	if(enrollmentType == "REGISTRATION_IMPORVE_GRADES" && $("#selectedSubjects").attr("data-individual") != $("#selectedSubjects").val()){
		$("#selectedSubjects").val($("#selectedSubjects").attr("data-individual"));
	}
	$("#enrollmentType").val(enrollmentType);
	$('#divNextSessionCourseChoose').html("");
	hideMessage('');
	$.ajax({
		type: "POST",
		url : BASE_URL+CONTEXT_PATH+SCHOOL_UUID+'/student/migration/standard-id',
		data: JSON.stringify(getRequestForStudentNextSession(nextGradeId, enrollmentType, registrationType)),
		dataType: 'json',
		contentType: APPLICATION_JSON_VALUE,
		// global: false,
		success: function (data) {
			if(data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if(data['status'] == '3') {
					redirectLoginPage();
				}else{
					if(data['statusCode'] == 'ELIGIBLE_CUSTOME_PLAN' || data['statusCode'] == 'REDIRECT_TO_DASHBOOARD') {
						window.location.reload();
					}else{
						showMessageTheme2(0, data['message'], '', true);
					}
				}
			}else{
				if(enrollmentType == "REGISTRATION_IMPORVE_GRADES"){
					$("#courseSelectionWrapper").html(getCourseSelectionAndReviewContent());
					if(enrollmentType == "REGISTRATION_IMPORVE_GRADES"){
						TAKE_INDIVIDUAL_COURSE=true;
					}
				}else{
					TAKE_INDIVIDUAL_COURSE=false;
				}
				
				if(enrollmentType == "REGISTRATION_REPEAT_GRADE"){
					$('#gradeId').val(data.standardId);
					$('#registrationType').val(data.registrationType);
					$('#courseProviderId').val(data.courseProviderId);
					
					if(registrationType == "DUAL_DIPLOMA" || registrationType == "ONE_TO_ONE_FLEX"){
						$("#courseSelectionWrapper").html(getCourseSelectionAndReviewContent());
						showMessageTheme2(1, data['message'], '', true);
						if(data.enrollmentType != "REGISTRATION_FRESH"){
							$("#pageHeading").html(getStudentMigrationHeader(data));
						}
						
						$('#gradeId').val(data.standardId);
						displaySection2();
						getAllCourseDetails('N', '');
					}else{
						repeatGradeClick(MIGRATION_DATA.enrollmentBy, 'REGISTRATION_REPEAT_GRADE', data.standardId, data.registrationType, data.courseProviderId);
						// else{
						// }
					}
				}else{
					if(registrationType == "DUAL_DIPLOMA" || registrationType == "ONE_TO_ONE_FLEX" || registrationType == "ONE_TO_ONE"){
						$("#courseSelectionWrapper").html(getCourseSelectionAndReviewContent());
					}
					// $("#choiceForStudentModelRepeaters").modal("hide");
					showMessageTheme2(1, data['message'], '', true);
					if(data.enrollmentType != "REGISTRATION_FRESH"){
						$("#pageHeading").html(getStudentMigrationHeader(data));
					}
					
					$('#gradeId').val(data.standardId);
					displaySection2();
					getAllCourseDetails('N', '');
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

function getRequestForStudentNextSession(nextGradeId, enrollmentType, registrationType) {
	var studentCourseDetailsInfoDTO = {};
	studentCourseDetailsInfoDTO['userId'] = USER_ID;
	studentCourseDetailsInfoDTO['callFrom'] = 'dashboard';
	studentCourseDetailsInfoDTO['standardId'] = nextGradeId;
	studentCourseDetailsInfoDTO['enrollmentType'] = enrollmentType;
	studentCourseDetailsInfoDTO['registrationType'] = registrationType;
	studentCourseDetailsInfoDTO['requestFromMigration']='Y';
	return studentCourseDetailsInfoDTO;
}

function getCourseCategoryByGradeId() {
	hideMessage('');
	$.ajax({
		type: "POST",
		url : BASE_URL+CONTEXT_PATH+SCHOOL_UUID+'/student/get-course-categories',
		data: JSON.stringify(getRequestForCourseCategory()),
		dataType: 'json',
		contentType: APPLICATION_JSON_VALUE,
		global: false,
		success: function (data) {
			var dropdown = $('#courseCategory');
			dropdown.html('');
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					if (data['statusCode'] == 'ELIGIBLE_CUSTOME_PLAN' || data['statusCode'] == 'REDIRECT_TO_DASHBOOARD') {
						window.location.reload();
					} else {
						showMessageTheme2(0, data['message'], '', true);
					}
				}
			} else {
				
				$.each(data.details, function (k, v) {
					dropdown.append('<option value="' + v.id + '"> ' + v.name + '</option>');
				});
			}
		}
	});
}

function getRequestForCourseCategory() {
	var courseCategory = {};
	courseCategory['schoolId'] = SCHOOL_ID;
	var courseProviderId = [];
	if($('#gradeId').val()==19){
		courseProviderId.push(37)
	}else{
		courseProviderId.push(40)
	}
	courseCategory['courseProviderId'] = courseProviderId;
	courseCategory['learningProgram'] = $('#registrationType').val();

	var grades = [];
	grades.push($('#gradeId').val())
	courseCategory['grades'] = grades;
	return courseCategory;
}

function switchGrade(){
	var standardId = $("#gradeId").val();
	console.log('standardId=>'+standardId+", standardId field => "+$('#standardId').val().trim())
	console.log('FT => '+$('#selectedSubjects').val().trim());
	if($('#standardId').val().trim()==standardId){
		$('#standardId').val(standardId);
	}else{
		if($('#selectedSubjects').val().trim()!=''){
			$('#gradeChangeWarning').remove();
			$("body").append(switchFlexyGradeWarningModal());
			if(standardId==19){
				$('#gradeChangeWarningMessage').html('You are about to switch to Elementary School courses. Please note that your course selection will be lost. Do you wish to proceed?');
			}else if(standardId==9){
				$('#gradeChangeWarningMessage').html('You are about to switch to Middle School courses. Please note that your course selection will be lost. Do you wish to proceed?');
			}else if(standardId==10){
				$('#gradeChangeWarningMessage').html('You are about to switch to High School courses. Please note that your course selection will be lost. Do you wish to proceed?');
			}else if(standardId==20){
				$('#gradeChangeWarningMessage').html('You are about to switch to Credit Recovery courses. Please note that your course selection will be lost. Do you wish to proceed?');
			}else if(standardId==21){
				$('#gradeChangeWarningMessage').html('You are about to switch to Advanced Placement courses. Please note that your course selection will be lost. Do you wish to proceed?');
			}else {
			}
			$('#gradeChangeWarningYes').attr("onclick", "switchGradeYes('"+standardId+"')");
			$('#gradeChangeWarningNo').attr("onclick", "switchGradeNo('"+standardId+"')");
			$('#gradeChangeWarning').modal('show');
		}else{
			switchGradeYes();
		}
	}
}

function switchGradeYes(){
	$("#standardId").val($("#gradeId").val())
	$('#gradeChangeWarning').modal('hide');
	$("#selectedSubjects").val("");
	$("#controlType").val("remove");
	getAllCourseDetails('Y', '')
}

function switchGradeNo(standardId){
	$('#gradeChangeWarning').modal('hide');
	$("#gradeId").val($("#standardId").val()).trigger("change");
}

function displayCourseDetails(descriptionUrl){
	window.open(descriptionUrl);
}

const getPathNameForUrl = (url) => {
	return url
	.replace("https://internationalschooling.org/course-catalog/", "")
	.replaceAll("/", "");
};

function openCourseDetailModal(courseDescriptionUrl, subjectName) {
    if (!$('#courseDetailModal').length) {
        $('body').append(`
          <div class="modal fade" id="courseDetailModal" tabindex="-1" aria-labelledby="courseDetailModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
              <div class="modal-content">
                <div class="modal-header py-2 primary-bg white-txt-color">
                  <h5 class="modal-title" id="courseDetailModalLabel"></h5>
				  <button type="button" onclick="closeCourseDetailModal()" class="close" aria-label="Close" data-dismiss="modal"><span aria-hidden="true" style="color: #fff;">&times;</span></button>
                </div>
                <div class="modal-body">
                  <div id="courseDetailContent" class="">
                    <p>Loading...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `);
    }

    const urlPath = getPathNameForUrl(courseDescriptionUrl);
    const requestBody = { url: urlPath };

    const modalElement = $('#courseDetailModal');
    const modalTitle = $('#courseDetailModalLabel');
    const modalContent = $('#courseDetailContent');

    modalTitle.text(subjectName);
    modalContent.html("<p>Loading...</p>");
    modalElement.modal('show');
    $.ajax({
        url: BASE_URL+CONTEXT_PATH+SCHOOL_UUID+"/dashboard/get-course-summary",
        method: "POST",
        contentType: APPLICATION_JSON_VALUE,
        data: JSON.stringify(requestBody),
        success: function (response) {
            const data = JSON.parse(response);
			const overview = data.data  || "No overview available.";
            modalContent.html(`
                <p>${overview}</p>
            `);
        }
    });
	return false;
}

function closeCourseDetailModal(){
	$("#courseDetailModal").modal('hide');
}

// function fireConfetti() {
// 	confetti({
// 		particleCount: 200,
// 		angle: 120,
// 		spread: 55,
// 		origin: { x: 0.3, y: 0.75 }
// 	});
// 	confetti({
// 		particleCount: 200,
// 		angle: 60,
// 		spread: 55,
// 		origin: { x: 0.75, y: 0.75 }
// 	});
// }


const studentsData = [
		{
			"para": "Wei Zhang enrolled successfully in Grade 6 under One-to-One learning program from China.",
			"duration": "1 mins ago"
		},
		{
			"para": "Sofia Laurent enrolled successfully in English Learning under Group-Learning learning program from France.",
			"duration": "2 mins ago"
		},
		{
			"para": "Faisal Al Saud enrolled successfully in Grade 10 under Dual-Diploma learning program from Saudi Arabia.",
			"duration": "1 mins ago"
		},
		{
			"para": "Aino Virtanen enrolled successfully in Flexy - High School under Self-Study plus learning program from Finland.",
			"duration": "2 mins ago"
		},
		{
			"para": "Omar Al Rashid enrolled successfully in Grade 12 under self-Study learning program from Qatar.",
			"duration": "5 mins ago"
		},
		{
			"para": "Mariam Al Nuaimi enrolled successfully in Grade 8 under Flexy learning program from UAE.",
			"duration": "3 mins ago"
		},
		{
			"para": "Chen Hao enrolled successfully in Flexy - Middle School under One-to-One learning program from China.",
			"duration": "4 mins ago"
		},
		{
			"para": "Elena Fischer enrolled successfully in Grade 5 under Group-Learning learning program from Germany.",
			"duration": "1 mins ago"
		},
		{
			"para": "Khalid Bin Ahmed enrolled successfully in Maths Learning under Dual-Diploma learning program from Kuwait.",
			"duration": "5 mins ago"
		},
		{
			"para": "Ella Korhonen enrolled successfully in Grade 3 under Flexy learning program from Finland.",
			"duration": "2 mins ago"
		},
		{
			"para": "Abdullah Al Harbi enrolled successfully in Grade 11 under One-to-One learning program from Saudi Arabia.",
			"duration": "1 mins ago"
		},
		{
			"para": "Noura Al Mazrouei enrolled successfully in Grade 7 under Group-Learning learning program from UAE.",
			"duration": "5 mins ago"
		},
		{
			"para": "Yousef Al Thani enrolled successfully in Flexy - Advanced Placement under Flexy learning program from Qatar.",
			"duration": "3 mins ago"
		},
		{
			"para": "Fatima Al Sabah enrolled successfully in Grade 9 under Self-Study plus learning program from Kuwait.",
			"duration": "2 mins ago"
		},
		{
			"para": "Hamad Al Khalifa enrolled successfully in Flexy - High School under Dual-Diploma learning program from Bahrain.",
			"duration": "3 mins ago"
		}
	];

toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: "toast-bottom-left",
    timeOut: "10000",
    extendedTimeOut: "1000"
};

function showRandomToast() {
	var item = studentsData[Math.floor(Math.random() * studentsData.length)];

    toastr.info(
        `${item.para}<br><small>${item.duration}</small>`,
        "Recent Enrollment",
		{
			toastClass: 'bg-primary'
		}
    );
}

function getPaymentOptionCount(cdrDTO){
	var paymentOptionCount = 0;
	if(cdrDTO.bookASeatOpted == 1 && cdrDTO.enrollmentFee != null && cdrDTO.enrollmentFee != undefined && cdrDTO.enrollmentFee != "" && cdrDTO.enrollmentFee.enrollmentFee > 0 && !cdrDTO.bookAnEnrollmentPaidStatus){
		paymentOptionCount++;
	}
	if(cdrDTO.monthlyFeeDetails != null && cdrDTO.monthlyFeeDetails != undefined && cdrDTO.monthlyFeeDetails != ""){
		paymentOptionCount++;
	}
	if(cdrDTO.oneTimePayment != null && cdrDTO.oneTimePayment != undefined && cdrDTO.oneTimePayment != ""){
		paymentOptionCount++;
	}
	if(cdrDTO.customPaymentEnabled != null && cdrDTO.customPaymentEnabled != undefined && cdrDTO.customPaymentEnabled != ""){
		paymentOptionCount++;
	}
	return paymentOptionCount;
}


function getRequestForStudentDashboardSelection(){
	var studentRequestDTO = {};
	studentRequestDTO['userId'] = USER_ID;
	return studentRequestDTO;
}

function getStudentDashboardOrMigrationSection() {
	var returnData={};
	customLoader(true);
	$.ajax({
		type : "POST",
		contentType : "application/json",
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
	var returnData={};
	customLoader(true);
	$.ajax({
		type : "POST",
		contentType : "application/json",
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
		contentType : "application/json",
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

function callForStudentNextSession(nextGradeId, nextGradeName, enrollmentType, registrationType) {
	$('#divNextSessionCourseChoose').html("");
	hideMessage('');
	$.ajax({
		type: "POST",
		url : BASE_URL+CONTEXT_PATH+SCHOOL_UUID+'/student/migration/standard-id',
		data: JSON.stringify(getRequestForStudentNextSession(nextGradeId, enrollmentType, registrationType)),
		dataType: 'json',
		contentType: "application/json",
		global: false,
		success: function (data) {
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
				$("#choiceForStudentModelRepeaters").modal("hide");
				showMessageTheme2(1, data['message'], '', true);
				$("#pageHeading").html(getStudentMigrationHeader(data));
				$('#gradeId').val(data.standardId)
				displaySection2();
				getAllCourseDetails('N', '');
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
	return studentCourseDetailsInfoDTO;
}

function getCourseCategoryByGradeId() {
	hideMessage('');
	$.ajax({
		type: "POST",
		url : BASE_URL+CONTEXT_PATH+SCHOOL_UUID+'/student/get-course-categories',
		data: JSON.stringify(getRequestForCourseCategory()),
		dataType: 'json',
		contentType: "application/json",
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
        contentType: "application/json",
        data: JSON.stringify(requestBody),
        success: function (response) {
            const data = JSON.parse(response);
            modalContent.html(`
                <p>${data.data.OVERVIEW || "No overview available."}</p>
            `);
        },
        error: function (error) {
            console.error("Error fetching course details:", error);
        },
    });
	return false;
}

function closeCourseDetailModal(){
	$("#courseDetailModal").modal('hide');
}





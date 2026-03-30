var countId=[];
var selectedCoursesID = [];
var mandatoryFields=[];
var GRADES_TAUGHT = new Array();
var SUBJECTS_TAUGHT = new Array();
var GRADES_TAUGHT_NAMES = new Array();
var SUBJECTS_TAUGHT_NAMES = new Array();
var subjectsTaught = SUBJECTS_TAUGHT;
var applySubejctflag = false;
var applyGradeflag = false;
var academicUploadDocsObj = [];
var stup;
let recordingPollingInterval = null;
let demoRecordingAttempt = 1;
let selectedDemoMeetingId = null;
let selectedDemoMeetingAttempt = null;
let approvedDemoRowKey = null; 
// var entityIds = [];
var demoRecordingUrlMap = {};
var recordingIntervalCount = 0;
const meetingIdToEntityIdMap = {};
const attempts = getSettingsByTypeAndKey('CONFIGURATION','TEACHER_DEMO_RECORDING_ATTEMPTS');
const noOfAttempts = JSON.parse(attempts).data?.metaValue == "" ? 2 : parseInt(JSON.parse(attempts).data?.metaValue);
async function signupTeacherStage2OnLoadEvent(responseData){
	stup = responseData.details.teacherDetails;
	$("#highestQualificationId").change(function() {
		if ($("#highestQualificationId").val() == null || $("#highestQualificationId").val() == undefined || $("#highestQualificationId").val().trim()=="") {
			$("#highestQualificationId").valid();
			validEndInvalidField(null, "highestQualificationId");
			return false
		}else{
			validEndInvalidField(true, "highestQualificationId");
		}
	});
	$("#totalExperianceFromYYYY").change(function() {
		if ($("#totalExperianceFromYYYY").val() == null || $("#totalExperianceFromYYYY").val() == undefined || $("#totalExperianceFromYYYY").val().trim()=="") {
			$("#totalExperianceFromYYYY").valid();
			validEndInvalidField(null, "totalExperianceFromYYYY");
			return false
		}else{
			validEndInvalidField(true, "totalExperianceFromYYYY");
		}
	});
	$("#totalExperianceFromMM").change(function() {
		if ($("#totalExperianceFromMM").val() == null || $("#totalExperianceFromMM").val() == undefined || $("#totalExperianceFromMM").val().trim()=="") {
			validEndInvalidField(null, "totalExperianceFromMM");
			return false
		}else{
			validEndInvalidField(true, "totalExperianceFromMM");
		}
	});
	$("#lastOrganizationName").blur(function() {
		if ($("#lastOrganizationName").val() == null || $("#lastOrganizationName").val() == undefined || $("#lastOrganizationName").val().trim()=="") {
			$("#lastOrganizationName").valid();
			validEndInvalidField(null, "lastOrganizationName");
			return false
		}else{
			validEndInvalidField(true, "lastOrganizationName");
		}
	});
	$("#teacherSubjectSpecialization").blur(function() {
		if ($("#teacherSubjectSpecialization").val() == null || $("#teacherSubjectSpecialization").val() == undefined || $("#teacherSubjectSpecialization").val().trim()=="") {
			$("#teacherSubjectSpecialization").valid();
			validEndInvalidField(null, "teacherSubjectSpecialization");
			return false
		}else{
			validEndInvalidField(true, "teacherSubjectSpecialization");
		}
	});
	$("#lastJobTitle").blur(function() {
		if ($("#lastJobTitle").val() == null || $("#lastJobTitle").val() == undefined || $("#lastJobTitle").val().trim()=="") {
			validEndInvalidField(null, "lastJobTitle");
			return false
		}else{
			validEndInvalidField(true, "lastJobTitle");
		}
	});
	$("#lastJobFromYYYY").change(function() {
		if ($("#lastJobFromYYYY").val() == null || $("#lastJobFromYYYY").val() == undefined || $("#lastJobFromYYYY").val().trim()=="") {
			validEndInvalidField(null, "lastJobFromYYYY");
			return false
		}else{
			validEndInvalidField(true, "lastJobFromYYYY");
		}
	});
	$("#lastJobFromMM").change(function() {
		if ($("#lastJobFromMM").val() == null || $("#lastJobFromMM").val() == undefined || $("#lastJobFromMM").val().trim()=="") {
			validEndInvalidField(null, "lastJobFromMM");
			return false
		}else{
			validEndInvalidField(true, "lastJobFromMM");
		}
	});
	$("#lastJobToYYYY").change(function() {
		if ($("#lastJobToYYYY").val() == null || $("#lastJobToYYYY").val() == undefined || $("#lastJobToYYYY").val().trim()=="") {
			validEndInvalidField(null, "lastJobToYYYY");
			return false
		}else{
			validEndInvalidField(true, "lastJobToYYYY");
		}
	});
	$("#lastJobToMM").change(function() {
		if ($("#lastJobToMM").val() == null || $("#lastJobToMM").val() == undefined || $("#lastJobToMM").val().trim()=="") {
			validEndInvalidField(null, "lastJobToMM");
			return false
		}else{
			validEndInvalidField(true, "lastJobToMM");
		}
	});
	$("#lastJobDesc").blur(function() {
		if ($("#lastJobDesc").val() == null || $("#lastJobDesc").val() == undefined || $("#lastJobDesc").val().trim()=="") {
			$("#lastJobDesc").valid();
			validEndInvalidField(null, "lastJobDesc");
			return false
		}else{
			validEndInvalidField(true, "lastJobDesc");
		}
	});
	$("#demoVedioLink").blur(function() {
		if ($("#demoVedioLink").val() == null || $("#demoVedioLink").val() == undefined || $("#demoVedioLink").val().trim()=="") {
			$("#demoVedioLink").valid();
			validEndInvalidField(null, "demoVedioLink");
			return false
		}else{
			validEndInvalidField(true, "demoVedioLink");
		}
	});

	$('.currently_working').click(function(){
		if($(this).prop("checked") == true){
			$('#lastJobTo').addClass('hide');
			$('.month_from').css({"margin-right":"0"});
		}
		else{
			$('#lastJobTo').removeClass('hide');
			$('.month_from').css({"margin-right":"20px"});
		}
	});
	$('#declConfirmation').click(function(){
		if($('#declConfirmation').is(':checked')){
			$('#declConfirmation').val('Y');
		}else{
			$('#declConfirmation').val('N');
		}
	});

	var done= false;
	var doc=$('#academicDocument').val();
	//if(doc!=''&& doc!=null){
		$( ".add-upload-btn" ).trigger( "click" )
	//}

	initializeSelect2();
	
	autoSelectDropDownTeacherUpdateProfile('teacherSignupStage2', stup);
	formValdate('teacherSignupStage2', mandatoryFields, [])

	$('.select_dropdown').select2();
	$('[data-toggle="tooltip"]').tooltip().show();

	// entityIds.sort();
}

function initializeSelect2(){
	if ($('#lastJobFromYYYY').hasClass("select2-hidden-accessible")) {
		$('#lastJobFromYYYY').select2('destroy');
	}else{
		$('#lastJobFromYYYY').select2()
	}
	if ($('#lastJobFromMM').hasClass("select2-hidden-accessible")) {
		$('#lastJobFromMM').select2('destroy');
	}else{
		$('#lastJobFromMM').select2()
	}
	if ($('#lastJobToYYYY').hasClass("select2-hidden-accessible")) {
		$('#lastJobToYYYY').select2('destroy');
	}else{
		$('#lastJobToYYYY').select2()
	}
	if ($('#lastJobToMM').hasClass("select2-hidden-accessible")) {
		$('#lastJobToMM').select2('destroy');
	}else{
		$('#lastJobToMM').select2()
	}
	$('#lastJobFromYYYY').val(stup.lastJobFromYYYY);
	$('#lastJobFromMM').val(stup.lastJobFromMM);
	$('#lastJobToYYYY').val(stup.lastJobToYYYY);
	$('#lastJobToMM').val(stup.lastJobToMM);
}

function autoSelectDropDownTeacherUpdateProfile(formId, stup) {
	mandatoryFields = [];
	$('#highestQualificationId').val(stup.highestQualificationId).trigger('change');
	$('#totalExperianceFromYYYY').val(stup.totalExperianceFromYYYY).trigger('change');
	$('#totalExperianceFromMM').val(stup.totalExperianceFromMM).trigger('change');
	/*$('#lastJobFromYYYY').val(stup.lastJobFromYYYY).trigger('change');
	$('#lastJobToYYYY').val(stup.lastJobToYYYY).trigger('change');
	$('#lastJobToMM').val(stup.lastJobToMM).trigger('change'); */
	if(stup.highestQualificationId != ""){
		mandatoryFields.push("highestQualificationId");
	}
	if(stup.totalExperianceFromYYYY != ""){
		mandatoryFields.push("totalExperianceFromYYYY");
	}
	if(stup.totalExperianceFromMM != ""){
		mandatoryFields.push("totalExperianceFromMM");
	}
	if(stup.lastOrganizationName != ""){
		mandatoryFields.push("lastOrganizationName");
	}
	if(stup.teacherSubjectSpecialization != ""){
		mandatoryFields.push("teacherSubjectSpecialization");
	}
	if(stup.lastJobTitle != ""){
		mandatoryFields.push("lastJobTitle");
	}
	if(stup.lastJobFromYYYY != ""){
		mandatoryFields.push("lastJobFromYYYY");
	}
	if(stup.lastJobFromMM != ""){
		mandatoryFields.push("lastJobFromMM");
	}
	if(stup.lastJobToYYYY != ""){
		mandatoryFields.push("lastJobToYYYY");
	}
	if(stup.lastJobToMM != ""){
		mandatoryFields.push("lastJobToMM");
	}
	if(stup.lastJobDesc != ""){
		mandatoryFields.push("lastJobDesc");
	}
	if(stup.demoVedioLink != ""){
		mandatoryFields.push("demoVedioLink");
	}
	if(stup.uploadDocumentCVName != "" && stup.uploadDocumentCVName != undefined){
		$("#fileupload1Span").closest(".valid-field").addClass("true");
	}
	if(stup.uploadDocumentAcademicName != "" && stup.uploadDocumentAcademicName != undefined){
		$("#fileupload2Span").closest(".valid-field").addClass("true");
	}
	if(stup.uploadDocumentExperienceName != "" && stup.uploadDocumentExperienceName != undefined){
		$("#fileupload3Span").closest(".valid-field").addClass("true");
	}
	if(stup.uploadDocumentPassport != "" && stup.uploadDocumentPassport != undefined){
		$("#fileupload4Span").closest(".valid-field").addClass("true");
	}
	if(stup.uploadNetSpeedTestSSName != "" && stup.uploadNetSpeedTestSSName != undefined){
		$("#fileupload11Span").closest(".valid-field").addClass("true");
	}
}

function callForSignupTeacherUpdateProfile(formId, elementary_subjects,middleSchool_subjects,highSchool_subjects) {
	var flag= false;
	if ($("#"+formId+" #fileupload2Span").html()=='' || $("#"+formId+" #fileupload2Span").html()=='Upload Highest degree') {
		showMessageTheme2(2, ' Please upload your highest degree.');
		return false;
	}
	if ($("#"+formId+" #fileupload1Span").html()=='' || $("#"+formId+" #fileupload1Span").html()=='Upload CV') {
		showMessageTheme2(2, '  Please upload updated CV');
		return false;
	}
	if ($("#"+formId+" #fileupload4Span").html()=='' || $("#"+formId+" #fileupload4Span").html()=='Upload Passport/National ID') {
		showMessageTheme2(2, '  Please upload Passport/National ID');
		return false;
	}
	if ($("#"+formId+" #fileupload11Span").html()=='' || $("#"+formId+" #fileupload11Span").html()=='Upload Internet Speed Test Screenshot*') {
		showMessageTheme2(2, ' Please upload internet speed test screenshot');
		return false;
	}
	var totalSelectedSubject = elementary_subjects.length + middleSchool_subjects.length + highSchool_subjects.length;
	if (totalSelectedSubject < 1) {
		showMessageTheme2(2, ' Select taught subjects');
		return false;
	}
	if($("#demoVedioLink").length <= 0){
		if (selectedDemoMeetingId == null || selectedDemoMeetingId == undefined || selectedDemoMeetingId == "") {
			showMessageTheme2(2, 'Please give demo. If given, please select any recording');
			return false;
		}
	}else if($("#demoVedioLink").val() == ""){
		showMessageTheme2(2, 'Please provide demo video link');
		return false;
	}
	$("#nextStep").prop("disabled", true);
	$.ajax({
		type : "POST",
		url : getURLForHTML('teacher/signup','save-academic-professional-details'),
		data : JSON.stringify(getRequestForTeacherUpdateProfile(formId,elementary_subjects,middleSchool_subjects,highSchool_subjects)),
		contentType: APPLICATION_JSON_VALUE,
		cache : false,
		async:true,
		timeout : 600000,
		success : function(response) {
			var res = JSON.parse(response);
			if(res.statusCode == "FAILED"){
				if(res.status == "3"){
					redirectLoginPage();
				}else if(res.status == "0" || res.status == "3"){
					showMessageTheme2(0, res.message,"", true);
				}
				flag=false;
			}else{
				getStage3Data(getRequestForTeacherUpdateProfile(formId,elementary_subjects,middleSchool_subjects,highSchool_subjects).data);
				showMessageTheme2(1, 'Teacher professional details updated successfully.');
				flag=true;
			}
		}
	});
	return true;
}

function getRequestForTeacherUpdateProfile(formId, elementary_subjects,middleSchool_subjects,highSchool_subjects){
	var request = {};
	var authentication = {};
	var teacherUpdateProfileDTO = {};
	teacherUpdateProfileDTO['userId'] = USER_ID;
	teacherUpdateProfileDTO['attachments'] = academicUploadDocsObj;
	teacherUpdateProfileDTO['elementrySelectedSubject'] = elementary_subjects;
	teacherUpdateProfileDTO['middleSelectedSubject'] = middleSchool_subjects;
	teacherUpdateProfileDTO['highSelectedSubject'] = highSchool_subjects;
	teacherUpdateProfileDTO['selectedGrades'] = GRADES_TAUGHT.toString();
	teacherUpdateProfileDTO['highestQualificationId'] = $("#"+formId+" #highestQualificationId").val();
	teacherUpdateProfileDTO['totalExperianceFromYYYY'] = $("#"+formId+" #totalExperianceFromYYYY").val();
	teacherUpdateProfileDTO['totalExperianceFromMM'] = 0;
	teacherUpdateProfileDTO['lastOrganizationName'] = escapeCharacters(toTitleCase($("#"+formId+" #lastOrganizationName").val()));
	teacherUpdateProfileDTO['educationSpecialization'] = escapeCharacters(toTitleCase($("#"+formId+" #teacherSubjectSpecialization").val()));
	teacherUpdateProfileDTO['lastJobDesc'] = escapeCharacters(toSentenceCase($("#"+formId+" #lastJobDesc").val()));
	teacherUpdateProfileDTO['declConfirmation'] = $("#"+formId+" #declConfirmation").is(":checked") ? "Y" : "N";
	teacherUpdateProfileDTO['demoVedioLink'] = escapeCharacters($("#"+formId+" #demoVedioLink").val());
	teacherUpdateProfileDTO['demoMeetingId'] = selectedDemoMeetingId == null ? 0 : selectedDemoMeetingId;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = 'TEACHER';
	authentication['userId'] = USER_ID;
	request['authentication'] = authentication;
	request['data'] = teacherUpdateProfileDTO;
	return request;
}

function getFromMonths(formId, value, elementId) {
	if(value!='' && value!=null){
		hideMessage('');
		if($('#lastJobFromYYYY').val()==""){
			$("#lastJobFromMM").val(0);
			$("#lastJobFromMM").prop("disabled", true);
			return false;
		}
		var lastJobFromYear=$('#'+formId+' #lastJobFromYYYY').val();
		$.ajax({
			type : "POST",
			contentType : APPLICATION_JSON_VALUE,
			url : getURLForCommon('masters'),
			data : JSON.stringify(getRequestForMaster(formId, 'LAST-JOB-FROM-MONTHS', lastJobFromYear)),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			success : function(data) {
				if (data['status'] == '0' || data['status'] == '2') {
					showMessageTheme2(0, data['message']);
				} else {
					buildDropdown(data['mastersData']['lastJobFromMonths'], $('#lastJobFromMM'), 'Select Month');
				}
				$("#lastJobFromMM").prop("disabled", false);
			},
			error : function(e) {
				$("#lastJobFromMM").prop("disabled", false);
			}
		});
		$.ajax({
			type : "POST",
			contentType : APPLICATION_JSON_VALUE,
			url : getURLForCommon('masters'),
			data : JSON.stringify(getRequestForMaster(formId, 'LAST-JOB-TO-YEARS', lastJobFromYear)),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			success : function(data) {
				if (data['status'] == '0' || data['status'] == '2') {
					showMessageTheme2(0, data['message']);
				} else {
					buildDropdown(data['mastersData']['lastJobToYears'], $('#lastJobToYYYY'), 'Select Years');
				}
				$("#lastJobFromMM").prop("disabled", false);
			},
			error : function(e) {
				$("#lastJobFromMM").prop("disabled", false);
			}
		});
	}
}

function getToMonths(formId, value, elementId) {
	if(value!='' && value!=null){
		hideMessage('');
		if($('#lastJobToYYYY').val()==""){
			$("#lastJobToMM").val(0);
			$("#lastJobToMM").prop("disabled", true);
			return false;
		}
		var lastJobToYear=$('#lastJobToYYYY').val();
		$.ajax({
			type : "POST",
			contentType : APPLICATION_JSON_VALUE,
			url : getURLForCommon('masters'),
			data : JSON.stringify(getRequestForMaster(formId, 'LAST-JOB-TO-MONTHS', lastJobToYear)),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			success : function(data) {
				if (data['status'] == '0' || data['status'] == '2') {
					showMessageTheme2(0, data['message']);
				} else {
					buildDropdown(data['mastersData']['lastJobToMonths'], $('#lastJobToMM'), 'Select Month');
				}
				$("#lastJobToMM").prop("disabled", false);
			},
			error : function(e) {
				$("#lastJobToMM").prop("disabled", false);
			}
		});
	}
}

function getSelectedGrades(){
	var tempList=[];
	var tempList=GRADES_TAUGHT;
	var standardIds =[];
	standardIds =$(".course-selection-dropdown").select2('val');
	GRADES_TAUGHT=standardIds;
	if(GRADES_TAUGHT.length>0){
		applyGradeflag=true;
	}
	var count=0;
	if(tempList.length==GRADES_TAUGHT.length){
		for(i=1;i<=tempList.length;i++){
			if(GRADES_TAUGHT.includes(tempList[i-1]) ){
				count++;
			}
		}
	}
	if(count!=tempList.length){
		gradesChanged=true;
	}
	$("#select_grade").modal('hide');
}

function setSelectedGrades(){
	var gradeDropdown = $(".course-selection-dropdown").val(GRADES_TAUGHT).trigger('change');
}

function selectedCourseCategory(){
	var course_Category_Id = $('.custom-tab-wrapper li.active-tab a').attr('id');
    var course_Category = $(".courses-category-wrapper").find("#"+course_Category_Id+"C").find('ul.course-list li.active-tab').attr('coursetype');
    coursesDropdonw(course_Category, course_Category_Id);
}

function coursesDropdonw(course_type, course_category){
	var course_List = $("."+course_type).select2({
	placeholder: "Select Course",
	allowClear: true,
	minimumResultsForSearch: -1,
	dropdownParent: $('.'+course_type+'-wrapper')
      
   }).change(function(){
	   
   }).on("select2:closing", function(e) {
       e.preventDefault();
   }).on("select2:closed", function(e) {
       course_List.select2("open");
   }).on('select2:select', function(e) {
	   var selectedCourseHTML="";
	   var data = e.params.data;
	   data.id = data.id.replace(/\s+/g, '');
	   if(!countId.includes(data.id)){
		data.id =  data.id.replace(/\s+/g, '');
	    selectedCourseHTML = "<li class='select2-selection__choice'> <span courseId='"+data.id+"' class='select2-selection__choice__display'>"+ data.text+"</span> </li>"
	    countId.push(data.id);
	   }
	    if(!subjectsTaught.includes(data.id,0)){
       		subjectsTaught.splice(subjectsTaught.length, 0, data.id);
       		if(course_category=='elementary' &&  elementary_subjects.find_by_id(data.id)==false){
       			elementary_subjects.push(data.text)
       		} else if(course_category=='middle_school' && middleSchool_subjects.find_by_id(data.id)==false){
       			middleSchool_subjects.push(data.text)
       		}else{
       			if(highSchool_subjects.find_by_id(data.id)==false){
       			highSchool_subjects.push(data.text);
       			}
       		} 
       	}
		if(!selectedCoursesID.includes(data.id)){
			selectedCoursesID.push(data.id)
		}
		
	  	$('.elementary_selected_course').append(selectedCourseHTML);
	  	var selected_course_wrapper_length = $('.selected_courses li .course-category-wrapper > ul li').length ;
        var selected_course_length = $('.elementary_selected_course'+' .select2-selection__choice').length;
        if(selected_course_length > 0){
           $('.selected_course_containter').show();
           $('.elementary_selected_course').parent().closest('li').show().addClass('selectedCategory');
        }
        else if(selected_course_wrapper_length < 1){
           $('.selected_course_containter').hide();
           $('.elementary_selected_course').parent().closest('li').hide();
        }
        else{
           $('.elementary_selected_course').parent().closest('li').hide();
       	}
	  	
   }).on('select2:unselect', function(e) {
       var data = e.params.data;
	   data.id = data.id.replace(/\s+/g, '');
       subjectsTaught.remove_by_value(data.id);
       var selectedGradeType = $(this).parent().closest('li').attr('coursetype');
       var unSelectedCourse = data.id.replace(/\s+/g, '');;
       var selectedGrade = $(".selected_course_wrapper").find("[courseid='" + unSelectedCourse + "']").parent().remove();
       elementary_subjects.remove_by_object_id(data.id);
	   middleSchool_subjects.remove_by_object_id(data.id);
       highSchool_subjects.remove_by_object_id(data.id);
       countId.remove_by_value(data.id);
       var selected_course_wrapper_length = $('.selected_courses li .course-category-wrapper > ul li').length;
       var selected_course_length = $('.elementary_selected_course .select2-selection__choice').length;
       if(selected_course_length > 0){
           $('.selected_course_containter').show();
           $('.elementary_selected_course').parent().closest('li').show().addClass('selectedCategory');
       }
       else if(selected_course_wrapper_length < 1){
           $('.selected_course_containter').hide();
           $('.elementary_selected_course').parent().closest('li').hide();
       }
       else{
           $('.elementary_selected_course').parent().closest('li').hide();
       }
   }); 
   course_List.select2("open");
}
Array.prototype.remove_by_object_id = function (val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i].replace(/\s+/g, '') === val.replace(/\s+/g, '')) {
      this.splice(i, 1);
      i--;
    }
  }
  return this;
}
Array.prototype.find_by_id = function (val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] === val) {
      return true
    }
  }
  return false;
}
	
Array.prototype.remove_by_value = function (val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] === val) {
      this.splice(i, 1);
      i--;
    }
  }
  return this;
}


  
function getSelectedSubjectes(){
	SUBJECTS_TAUGHT=subjectsTaught;
	$("#select_course").modal('hide');
	applySubejctflag = true;
}

function showCourseList(){
    var course_Category_Id = $('.custom-tab-wrapper li.active-tab a').attr('id');
    var course_Category = $(".courses-category-wrapper").find("#"+course_Category_Id+"C").find('ul.course-list li.active-tab').attr('coursetype');
	$('#select_course').modal('show');
	coursesDropdonw(course_Category, course_Category_Id);
}

async function showGradeList() {
	if(!applyGradeflag){
		$("#select_grade").remove();
		$("body").append(gradeSelectionModal());
		$("#e2_2").val(GRADES_TAUGHT).trigger("change");
		var gradeList = $(".course-selection-dropdown").select2({
			placeholder: "Select Grade",
		   dropdownParent: $('#select_grade .modal-body .container-fluid .grade_selection_wrapper')
			 }).on("select2:closing", function(e) {
			   e.preventDefault();
		   }).on("select2:closed", function(e) {
			   gradeList.select2("open");
		   });
		   gradeList.select2("open");
		}
	$("#select_grade").modal("show");
}

async function showSelectedCourseList(){
	var me = $(this);
	if(me.data('requestRunning')){
		return false;
	}
	me.data('requestRunning', true);
	$('.custom-tab-wrapper li').removeClass('active-tab');
	$('.custom-tab-wrapper li a').addClass('inactive');
	var firstTab = $('.custom-tab-wrapper li:first');
	firstTab.addClass('active-tab');
	firstTab.find('a').removeClass('inactive');

	if(!applySubejctflag){
		var payload = {};
		payload['userId'] = USER_ID;
		responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'get-teacher-signup-subject-details', payload, '/teacher/signup');
		if(responseData.statusCode == "SUCCESS"){
			$("#select_course").remove();
			$("body").append(courseSelectionModal(responseData.details));
			elementary_subjects= responseData.details.subjectDetails.elementrySelectedSubject;
			middleSchool_subjects= responseData.details.subjectDetails.middleSelectedSubject;
			highSchool_subjects= responseData.details.subjectDetails.highSelectedSubject;
			SUBJECTS_TAUGHT_BACKUP=responseData.details.subjectDetails.elementrySelectedSubject.concat(responseData.details.subjectDetails.middleSelectedSubject, responseData.details.subjectDetails.highSelectedSubject);
        	SUBJECTS_TAUGHT=responseData.details.subjectDetails.elementrySelectedSubject.concat(responseData.details.subjectDetails.middleSelectedSubject, responseData.details.subjectDetails.highSelectedSubject);
			$(".elementary-0").val(responseData.details.subjectDetails.elementrySelectedSubject).trigger("change");
			$(".middle-school-0").val(responseData.details.subjectDetails.middleSelectedSubject).trigger("change");
			$(".high-school-0").val(responseData.details.subjectDetails.highSelectedSubject).trigger("change");
			var selectedCourseArray = responseData.details.subjectDetails.elementrySelectedSubject.concat(responseData.details.subjectDetails.middleSelectedSubject,responseData.details.subjectDetails.highSelectedSubject)
			if(selectedCourseArray.length>0){
				$(".selected_course_containter").show();
			}
			var course_Category_Id = $('.custom-tab-wrapper li.active-tab a').attr('id');
			var course_Category = $(".courses-category-wrapper").find("#"+course_Category_Id+"C").find('ul.course-list li.active-tab').attr('coursetype');
			coursesDropdonw(course_Category, course_Category_Id);
		}
	}
	$("#select_course").modal("show");
	me.data('requestRunning', false)
	$('.custom-tab-wrapper li a:not(:first)').addClass('inactive');
	$('.custom-tab-item').hide();
	$('.custom-tab-item:first').show();
	$('.custom-tab-wrapper li a').click(function(){
		var tabID = $(this).attr('id')
			tabFullForm = $(this).attr('full-form')
		if($(this).hasClass('inactive')){
			$('.custom-tab-wrapper li a').addClass('inactive');           
			$('.custom-tab-wrapper li').removeClass('active-tab');           
			$(this).removeClass('inactive');
			$(this).parent().addClass('active-tab');
			$('.custom-tab-item').hide();
			$('#'+tabID+"C").find('.active-tab > .course-list-wrapper').show()
			$('#'+ tabID + 'C').fadeIn();
		}
	});
	$('.course-tabs-format ul.course-list li a:not(:first)').addClass('inactive');
	$('.elementary_course_item .course-list-wrapper').hide();
	$('.elementary_course_item:first .course-list-wrapper').show();
	$('.course-tabs-format ul.course-list li a').click(function(){
		var tabID = $(this).attr('id'),
		tabParent = $(this).parent().closest('.custom-tab-item').attr('id');
		if($(this).hasClass('inactive')){
			$('.course-tabs-format ul.course-list li a').addClass('inactive');           
			$("#"+tabParent).find('.elementary_course_item').removeClass('active-tab');           
			$(this).removeClass('inactive');
			$(this).parent().addClass('active-tab').find('.elementary-wrapper').slideDown('fast');
			$('.elementary_course_item .course-list-wrapper').hide();
			$('#'+ tabID + 'C').slideDown();
		}
	});
}

async function getStage2Data(){
	setSteps(2);
	showSkeleton(true, "step2");
	var payload = {};
	payload['userId'] = USER_ID;
	responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'get-teacher-academic-professional-details', payload, 'teacher/signup');
	$("#teacherSignupContentStage2").html(getTeacherProfessionalDetailsContent(responseData));	
	signupTeacherStage2OnLoadEvent(responseData);
	loadApprovedDemoIfExists(responseData.recordingUrls);
	$("#totalExperianceFromYYYY").val(responseData.details.teacherDetails.totalExpYear).trigger("change");
	GRADES_TAUGHT = responseData.details.teacherDetails.selectedGrades != ""? responseData.details.teacherDetails.selectedGrades.replaceAll(" ", "").split(',') : [];
	responseDataSubjects = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'get-teacher-signup-subject-details', {userId: USER_ID}, '/teacher/signup');
	SUBJECTS_TAUGHT_BACKUP=responseDataSubjects.details.subjectDetails.elementrySelectedSubject.concat(responseDataSubjects.details.subjectDetails.middleSelectedSubject, responseDataSubjects.details.subjectDetails.highSelectedSubject);
	SUBJECTS_TAUGHT=responseDataSubjects.details.subjectDetails.elementrySelectedSubject.concat(responseDataSubjects.details.subjectDetails.middleSelectedSubject, responseDataSubjects.details.subjectDetails.highSelectedSubject);
	elementary_subjects= responseDataSubjects.details.subjectDetails.elementrySelectedSubject;
	middleSchool_subjects= responseDataSubjects.details.subjectDetails.middleSelectedSubject;
	highSchool_subjects= responseDataSubjects.details.subjectDetails.highSelectedSubject;
	$("#e2_2").val(GRADES_TAUGHT).trigger("change");
	$(".elementary-0").val(elementary_subjects).trigger("change");
	$(".middle-school-0").val(middleSchool_subjects).trigger("change");
	$(".high-school-0").val(highSchool_subjects).trigger("change");
	$(".step-2-skeleton").hide();
	$("#teacherSignupStage2").show();
}

async function openModalForDemoVideo(formId) {
	if ($("#"+formId+" #highestQualificationId").val()=='') {
		showMessageTheme2(2, ' Please select highest qualification.');
		return false;
	}
	if ($("#"+formId+" #teacherSubjectSpecialization").val()=='') {
		showMessageTheme2(2, ' Please enter degree specialization.');
		return false;
	}
	if ($("#"+formId+" #totalExperianceFromYYYY").val()=='') {
		showMessageTheme2(2, ' Please select experience.');
		return false;
	}
	if ($("#"+formId+" #lastOrganizationName").val()=='') {
		showMessageTheme2(2, ' Please enter your last organisation name.');
		return false;
	}
	if ($("#"+formId+" #lastJobDesc").val()=='') {
		showMessageTheme2(2, ' Please enter why should we hire you.');
		return false;
	}
	if ($("#"+formId+" #fileupload2Span").html()=='' || $("#"+formId+" #fileupload2Span").html()=='Upload Highest degree') {
		showMessageTheme2(2, ' Please upload your highest degree.');
		return false;
	}
	if ($("#"+formId+" #fileupload1Span").html()=='' || $("#"+formId+" #fileupload1Span").html()=='Upload CV') {
		showMessageTheme2(2, '  Please upload updated CV');
		return false;
	}
	if ($("#"+formId+" #fileupload4Span").html()=='' || $("#"+formId+" #fileupload4Span").html()=='Upload Passport/National ID') {
		showMessageTheme2(2, '  Please upload Passport/National ID');
		return false;
	}
	if ($("#"+formId+" #fileupload11Span").html()=='' || $("#"+formId+" #fileupload11Span").html()=='Upload Internet Speed Test Screenshot*') {
		showMessageTheme2(2, ' Please upload internet speed test screenshot');
		return false;
	}
	if(GRADES_TAUGHT.length==0){
		showMessageTheme2(2, 'Please choose grades taught');
		return false;
	}
	var totalSelectedSubject = elementary_subjects.length + middleSchool_subjects.length + highSchool_subjects.length;
	if (totalSelectedSubject < 1) {
		showMessageTheme2(2, ' Select taught subjects');
		return false;
	}
	var payload = {};
	payload = getRequestForTeacherUpdateProfile(formId, elementary_subjects, middleSchool_subjects, highSchool_subjects);
	var responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'save-academic-professional-details', payload, '/teacher/signup');
	if(responseData.statusCode == "SUCCESS"){
		$("#demoVideoWrapper").html(videoInstructionModalContent());
		await getDemoRecordings();
		$('#videoInstructionBackdrop').fadeIn();
		$('#videoInstructionModal').addClass('open');
		$("body").css("overflow", "hidden");
		// if (Array.isArray(entityIds) && entityIds.length !== 0) {
		// 	for (const meetingId of entityIds) {
		// 		await getDemoRecordings(meetingId);
		// 	}
		// }
		// else{
		// 	$('#recordYourDemoInsideBtn').attr("onclick", `startDemoRecording('1')`);
		// }
	}
}

function closeVideoInstructionModal() {
	$('#videoInstructionBackdrop').fadeOut(200);
    $('#videoInstructionModal').removeClass('open');
	setTimeout(() => {
		$("#videoInstructionModal").remove();
		$("#videoInstructionBackdrop").remove();
		$("body").css("overflow", "auto");
	}, 300);
}
const startDemoRecording = debouncing(startDemoRecordingFun, 300);
async function startDemoRecordingFun(attempt, isReattempting){
	const now = new Date();
	const startDate = changeDateFormat(now, "mm/dd/yyyy");
	let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const startTime = `${hours}:${minutes} ${ampm}`;
	const timezoneData = getTimezoneIdByTimeName(USER_TIMEZONE);

	var payload = {};
	payload['userId'] = USER_ID;
	payload['schoolId'] = SCHOOL_ID;
	payload['title'] = `Teacher Demo Video | ${!isReattempting ? "Attempt " + attempt : "Re-Attempt " + attempt} | ${USER_FULL_NAME}`;
	payload['startDate'] = startDate;
	payload['startTime'] = startTime;
	payload['duration'] = "00:30";
	payload['hostUserId'] = USER_ID;
	payload['timezone'] = timezoneData.mastersData.masterDTO.value;
	payload['meetingType'] = "1";
	payload['gmType'] = "16";
	
	responseDataDemoRecording = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'create-teacher-registration-demo-meeting', payload, '/teacher/signup');
	if(responseDataDemoRecording.status == "success"){
		const payloadToStartMeeting = {
			entityId: responseDataDemoRecording.data.meetingId,
			entityType: "GENERAL_MEETINGS"
		};
		const encodedPayload = btoa(unescape(encodeURIComponent(JSON.stringify(payloadToStartMeeting))));
		const queryParams = `?payload=${encodeURIComponent(encodedPayload)}`;
		$.ajax({
			type: "GET",
			url: `${APP_BASE_URL}${SCHOOL_UUID}/teacher/signup/start-teacher-registration-demo-meeting${queryParams}`,
			contentType: APPLICATION_JSON_VALUE,
			dataType: "json",
			success: function (response) { 
				if(response.status == 1){
					if($("#start-meeting-popup-teacher").length == 1){
						$("#start-meeting-popup-teacher").remove();
					}
					$("body").append(showStartMeetingPopupTeacher(responseDataDemoRecording.data.title, response.redirectUrl));
					setTimeout(() => {
						$("#start-meeting-popup-teacher").modal("show");
					}, 500);
					window.open(response.redirectUrl, '_blank');
					clearInterval(recordingPollingInterval);
					recordingPollingInterval = null;
					getDemoRecordings();
					recordingPollingInterval = setInterval(() => {
						getDemoRecordings();
					}, 10000);
					// $("#recordingWaitingText").html("The recording is not started yet <span><i class='fa fa-spinner fancytree-helper-spin' aria-hidden='true'></i></span>")
					// $("#recordingWaitingText").show();
					
					const maxAttempts = noOfAttempts;
					if(attempt >= maxAttempts){
						$("#recordYourDemoInsideBtn").hide();
					}
				}else{
					showMessageTheme2(0, response.message);
					if(response.status == 3){
						setTimeout(() => {
							redirectLoginPage();
						}, 3000);
					}
				}
			}
		});
	}
}

async function getDemoRecordings() {
    const payload = {
        userId: USER_ID,
		schoolId: SCHOOL_ID
    };

    const responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(false, false, 'get-teacher-demo-recordings', payload, '/teacher/signup');
	recordingIntervalCount++;
	
	if (recordingIntervalCount >= 240) {
		clearInterval(recordingPollingInterval);
		recordingPollingInterval = null;
		return;
	}
    
    if (responseData.statusCode === "SUCCESS") {
		const sessionDataList = responseData.sessionDataList || [];
		const maxAttempts = noOfAttempts;
		const completedSessions = sessionDataList.filter(session => 
			session.recordingArray && session.recordingArray.length > 0
		);
		const inProgressSessions = sessionDataList.filter(session => 
			session.meetingStatus === "IN_PROGRESS" || 
			(session.meetingStatus === "ENDED" && (!session.recordingArray || session.recordingArray.length === 0))
		);
		
		updateRecordingButtons(completedSessions.length, inProgressSessions.length, maxAttempts);
		
		if (sessionDataList.length === 0) {
			handleNoSessions();
		} else {
			handleSessionsWithData(sessionDataList, completedSessions, inProgressSessions, maxAttempts);
		}
    }
}

function updateRecordingButtons(completedCount, inProgressCount, maxAttempts) {
	const usedAttempts = completedCount + inProgressCount;
	const nextAttempt = usedAttempts + 1;
	
	if (usedAttempts >= maxAttempts) {
		$("#recordYourDemoInsideBtn").hide();
	} else {
		$("#recordYourDemoInsideBtn span").text(
			usedAttempts === 0 ? "LIVE RECORD YOUR DEMO" : 
			`LIVE RECORD YOUR DEMO (${getOrdinalSuffix(nextAttempt)} Attempt)`
		);
		$('#recordYourDemoInsideBtn').show().attr('data-attempt', nextAttempt);
		$('#recordYourDemoInsideBtn').attr("onclick", `startDemoRecording('${nextAttempt}', ${false})`);
		// $('#recordYourDemoOutsideBtn span').text($("#recordYourDemoInsideBtn span").text());
	}
}

function handleNoSessions() {
	// $("#recordingWaitingText").hide();
	$("#approveDemoBtn").hide();
	
	if ($("#mergedRecordingTable").length) {
		$("#mergedRecordingTable tbody").empty();
	}
}

function handleSessionsWithData(sessionDataList, completedSessions, inProgressSessions, maxAttempts) {
	const $videoSection = $('#recordingSection');
	
	if ($("#mergedRecordingTable").length === 0) {
		let tableWrapper = `
			<div class="mt-3 bg-white p-3 rounded shadow-sm" style="padding: 30px 0px 0px;">
				<table id="mergedRecordingTable" class="table table-bordered">
					<thead style="background-color: #027fff; color: white;">
						<tr>
							<th>Attempt</th>
							<th>Start Time</th>
							<th>End Time</th>
							<th>Duration (HH:MM:SS)</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody></tbody>
				</table>
			</div>`;
		$videoSection.append(tableWrapper);
	}

	const $tableBody = $("#mergedRecordingTable tbody");
	$tableBody.empty();

	const maxAttemptsReached = sessionDataList.length >= maxAttempts;
	const allSessionsHaveEndTime = sessionDataList.every(session => session.endDateTime);

	// FIX: Re-attempt button should show only when ALL sessions have end time AND max attempts reached
	const showReattemptButtons = maxAttemptsReached && allSessionsHaveEndTime;

	sessionDataList.forEach((session, index) => {
		const attemptNumber = index + 1;
		const attemptText = getOrdinalSuffix(attemptNumber) + " Attempt";
		const rowId = `attempt_${attemptNumber}`;
		
		let startDateTime = session.startDateTime ? 
			changeDateFormat(new Date(session.startDateTime), "MMM dd, yyyy hh:mm:ss A") : 
			`<i class='fa fa-spinner fancytree-helper-spin text-primary' aria-hidden='true'></i>`;
		
		let endDateTime = session.endDateTime ? 
			changeDateFormat(new Date(session.endDateTime), "MMM dd, yyyy hh:mm:ss A") : 
			`<i class='fa fa-spinner fancytree-helper-spin text-primary' aria-hidden='true'></i>`;

		const isInvalidRecording = session.startDateTime && session.endDateTime && new Date(session.startDateTime).getTime() === new Date(session.endDateTime).getTime();

		const isShortRecording = session.startDateTime && session.endDateTime && (new Date(session.endDateTime).getTime() - new Date(session.startDateTime).getTime()) < 60000;

		let duration = (session.startDateTime && session.endDateTime) ? 
			getDuration(session.startDateTime, session.endDateTime) : 
			`<i class='fa fa-spinner fancytree-helper-spin text-primary' aria-hidden='true'></i>`;

		let actionContent = "";
		
		if (session.meetingStatus === "IN_PROGRESS") {
			actionContent = `<i class='fa fa-spinner fancytree-helper-spin text-primary' aria-hidden='true'></i> Meeting in progress`;
		}else if (isInvalidRecording) {
            actionContent =
			`<div class="d-flex align-items-center" style="flex-direction: column; gap: 5px;">
				<div class="text-danger small mb-1">
					<i class="fa fa-exclamation-triangle" aria-hidden="true"></i> Invalid recording
				</div>
				<button onclick="reAttemptDemoRecording('${session.id}', '${attemptNumber}')" 
						class="btn btn-sm btn-warning m-0" style="width: fit-content;">
					Re-attempt
				</button>
			</div>`;
        }else if (isShortRecording) {
			actionContent = 
			`<div class="d-flex align-items-center" style="flex-direction: column; gap: 5px;">
				<div class="text-danger small mb-1">
					<i class="fa fa-exclamation-triangle" aria-hidden="true"></i> Recording should be more than 1 minute
				</div>
				<button onclick="reAttemptDemoRecording('${session.id}', '${attemptNumber}')" 
						class="btn btn-sm btn-warning m-0" style="width: fit-content;">
					Re-attempt
				</button>
			</div>`;
		} else if (session.meetingStatus === "ENDED" && (!session.recordingArray || session.recordingArray.length === 0)) {
			actionContent = `Recording in progress <i class='fa fa-spinner fancytree-helper-spin text-primary' aria-hidden='true'></i>`;
		} else if (session.recordingArray && session.recordingArray.length > 0) {
			const rowKey = `${session.id}_${index}`;
			demoRecordingUrlMap[rowKey] = session.recordingArray.map(rec => rec);
			
			const checked = session.id == selectedDemoMeetingId ? 'checked' : 
				($tableBody.find('input[name="selectedDemoRecording"]').length === 0 ? 'checked' : '');

			const radioId = `rec_${session.id}_${attemptNumber}`;
			
			// FIX: Use showReattemptButtons (for all sessions) instead of individual session check
			const reattemptButton = showReattemptButtons ? 
				`<button onclick="reAttemptDemoRecording('${session.id}', '${attemptNumber}')" class="btn btn-sm btn-warning m-0 ml-2" style="width: fit-content;">Re-attempt</button>` : 
				'';
			
			actionContent = `
				<div class="d-flex" style="flex-direction: column; gap: 5px;">
					<div>
						<a id="playBtn_${session.id}_${index}" href="javascript:void(0);" 
						onclick="openDemoRecordingModal(demoRecordingUrlMap['${rowKey}'], '${attemptText}')" 
						class="btn btn-sm btn-primary m-0">Recordings</a>
						<input class="form-check-input ml-3" type="radio" name="selectedDemoRecording" 
							id="${radioId}" value="${session.meetingId}" data-meetingid="${session.meetingId}" 
							data-attempt="${attemptNumber}" data-rowkey="${rowKey}" ${checked}>
					</div>
					${reattemptButton}
				</div>
			`;
		}

		$tableBody.append(`
			<tr id="${rowId}">
				<td>${attemptText}</td>
				<td>${startDateTime}</td>
				<td>${endDateTime}</td>
				<td>${duration}</td>
				<td>${actionContent}</td>
			</tr>
		`);
	});

	const hideStartButton = maxAttemptsReached && allSessionsHaveEndTime;
	if (hideStartButton) {
		$("#recordYourDemoInsideBtn").hide();
	} else {
		$("#recordYourDemoInsideBtn").show();
	}

	if (completedSessions.length > 0) {
		$("#approveDemoBtn").show();
		$("#approveDemoBtn").css({"display": "flex", "margin-left": "auto", "margin-bottom": "16px"});

		if (completedSessions.length > 1) {
			$('input[name="selectedDemoRecording"]').show();
		} else {
			$('input[name="selectedDemoRecording"]').hide();
		}
	} else {
		$("#approveDemoBtn").hide();
	}

	const allSessionsHaveRecordings = sessionDataList.length > 0 && 
		sessionDataList.every(session => session.recordingArray && session.recordingArray.length > 0);
	
	if (allSessionsHaveRecordings) {
		if (recordingPollingInterval) {
			clearInterval(recordingPollingInterval);
			recordingPollingInterval = null;
			recordingIntervalCount = 0;
			console.log("Polling stopped: All recordings are available");
		}
	} else {
		if (!recordingPollingInterval && (inProgressSessions.length > 0 || sessionDataList.some(session => 
			session.meetingStatus === "ENDED" && (!session.recordingArray || session.recordingArray.length === 0)))) {
			
			clearInterval(recordingPollingInterval);
			recordingPollingInterval = setInterval(() => {
				getDemoRecordings();
			}, 10000);
			console.log("Polling started/restarted: Sessions are in progress");
		}
	}
}

async function reAttemptDemoRecording(sessionId, attempt) {
	var payload = {};
	payload['sessionId'] = sessionId;

	const response = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'teacher-demo-recording-reattempt-by-teacher', payload, '/teacher/signup');

	if (response.statusCode == "SUCCESS") {
		startDemoRecording(attempt, true);
	} else {
		showMessageTheme2(0, "Failed to submit re-attempt request");
	}
}

$(document).ready(function() {
    setInterval(function() {
        const $button = $("#recordYourDemoInsideBtn");
        if ($button.is(':visible') && (!$button.attr('onclick') || $button.attr('onclick') === '')) {
            console.log("Button recovery: Setting onclick");
            const currentAttempt = $button.attr('data-attempt') || '1';
            $button.attr("onclick", `startDemoRecording('${currentAttempt}', false)`);
        }
    }, 5000);
});

function approvedDemoRecording() {
	const selectedRecording = $("input[name='selectedDemoRecording']:checked");
	if (selectedRecording.length === 0) {
		showMessageTheme2(0, "Please select a recording.");
		return;
	}

	const selectedMeetingId = selectedRecording.val();
	const selectedAttempt = selectedRecording.data('attempt');
	const selectedRowKey = selectedRecording.data('rowkey');
	
	selectedDemoMeetingAttempt = getOrdinalSuffix(selectedAttempt) + " Attempt";
	
	selectedDemoMeetingId = selectedMeetingId;
	approvedDemoRowKey = selectedRowKey;

	const row = selectedRecording.closest('tr');
	const startTime = row.find('td').eq(1).text();
	const endTime = row.find('td').eq(2).text();
	const duration = row.find('td').eq(3).text();

	const approvedTable = `
		<div class="mt-3 bg-white p-3 rounded shadow-sm" style="padding: 10px 0px;">
			<table class="table table-bordered">
				<thead style="background-color: #027fff; color: white;">
					<tr>
						<th>Attempt</th>
						<th>Start Time</th>
						<th>End Time</th>
						<th>Duration (HH:MM:SS)</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>${selectedDemoMeetingAttempt}</td>
						<td>${startTime}</td>
						<td>${endTime}</td>
						<td>${duration}</td>
						<td>
							<a href="javascript:void(0);" class="btn btn-sm btn-primary"
							   onclick="openDemoRecordingModal(demoRecordingUrlMap['${selectedRowKey}'], '${selectedDemoMeetingAttempt}')">
								Recordings
							</a>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	`;

	$("#approvedDemoRecording").html(approvedTable);
	closeVideoInstructionModal();
}

function openDemoRecordingModal(recordings, title) {
	if (recordings && recordings.length > 0) {
		populateRecordingModalForSignup(recordings, title);
	} else {
		showMessageTheme2(0, "No recordings available.");
	}
}

function playRecordingSignup(videoUrl, title) {
	var videoModal = $("#videoModal");
	$.ajax({
	  type: "GET",
	  contentType: APPLICATION_JSON_VALUE,
	  dataType: 'json',
	  url: getURLForSignVideo(videoUrl),
	  success: function (responseData) {
		if (responseData.status == 0) {
		  const signedUrl = responseData.url;
		  videoModal.remove();
			$("body").append(`
				<div id="videoModal" class="modal fade" tabindex="-1">
					<div class="modal-dialog" style="max-width:70%; width: 100%;">
						<div class="modal-content">
							<div class="" style="padding: 15px 10px; background: #027FFF; display:flex; justify-content: space-between; align-items: center;">
								<h5 class="mb-0" style="font-size: 18px; font-weight: bold; color: white;">Demo Video | ${title}</h5>
								<button onclick="closeVideoModal();" type="button" class="text-white btn btn-sm btn-danger" data-dismiss="modal" aria-label="Close" style="font-size: 20px !important; margin: 0; padding: 0px 8px;">&times;</button>
							</div>
							<div class="" style="padding: 20px;padding: 20px;display: flex;justify-content: center;">
								<video class="videoTag w-100" style="height: 70vh; overflow-y: auto;" controls>
									<source src="${signedUrl}" type="video/mp4" />
									Your browser does not support the video tag.
								</video>
							</div>
						</div>
					</div>
				</div>
			`);
		  	$("#videoModal").modal("show");
		} else {
		  showMessageTheme2(0, responseData.message || "Failed to fetch video URL");
		}
		customLoader(false);
	  },
	  error: function (e) {
		console.error("Error fetching signed video URL:", e.message);
		showMessageTheme2(0, "Error fetching video.");
		customLoader(false);
	  }
	});
}

function loadApprovedDemoIfExists(recordingData) {
	if (recordingData.urls.length === 0) return;

	const entry = recordingData;

	const selectedMeetingId = entry.meetingId;
	selectedDemoMeetingAttempt = getOrdinalSuffix(entry.attempt) + " Attempt";
	// if(selectedDemoMeetingAttempt % 2 != 0){
	// 	selectedDemoMeetingAttempt = "1st Attempt"
	// }else{
	// 	selectedDemoMeetingAttempt = "2nd Attempt"
	// }
	const startDateTime = entry.startDateTime == null ? "N/A" : changeDateFormat(new Date(entry.startDateTime), "MMM dd, yyyy hh:mm:ss A");
	const endDateTime = entry.endDateTime == null ? "N/A" : changeDateFormat(new Date(entry.endDateTime), "MMM dd, yyyy hh:mm:ss A");
	const rowKey = `${selectedMeetingId}_0`;
	demoRecordingUrlMap[rowKey] = entry.urls;

	selectedDemoMeetingId = selectedMeetingId;
	approvedDemoRowKey = rowKey;

	const approvedTable = `
		<div class="mt-3 bg-white p-3 rounded shadow-sm" style="padding: 10px 0px;">
			<table class="table table-bordered">
				<thead style="background-color: #027fff; color: white;">
					<tr>
						<th>Attempt</th>
						<th>Start Time</th>
						<th>End Time</th>
						<th>Duration (HH:MM:SS)</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>${selectedDemoMeetingAttempt}</td>
						<td>${startDateTime}</td>
						<td>${endDateTime}</td>
						<td>${getDuration(entry.startDateTime, entry.endDateTime)}</td>
						<td>
							<a href="javascript:void(0);" class="btn btn-sm btn-primary"
							   onclick="openDemoRecordingModal(demoRecordingUrlMap['${rowKey}'], '${selectedDemoMeetingAttempt}')">
								Recordings
							</a>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	`;
	$("#approvedDemoRecording").html(approvedTable);
}
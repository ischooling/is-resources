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
var entityIds = [];
var demoRecordingUrlMap = {};
var recordingIntervalCount = 0;
const meetingIdToEntityIdMap = {};
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

	entityIds.sort();
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
	var totalSelectedSubject = elementary_subjects.length + middleSchool_subjects.length + highSchool_subjects.length;
	if (totalSelectedSubject < 1) {
		showMessageTheme2(2, ' Select taught subjects');
		return false;
	}
	if($("#demoVedioLink").length <= 0){
		if (selectedDemoMeetingId == null || selectedDemoMeetingId == undefined || selectedDemoMeetingId == "") {
			showMessageTheme2(2, 'Please give demo. If given, please select the any recording');
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
		contentType: "application/json",
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
			contentType : "application/json",
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
			contentType : "application/json",
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
			contentType : "application/json",
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
	console.log('frgs');
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
	console.log(GRADES_TAUGHT);
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

	if(!applySubejctflag){
		var payload = {};
		payload['userId'] = USER_ID;
		responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(false, false, 'get-teacher-signup-subject-details', payload, '/teacher/signup');
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
	responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(false, false, 'get-teacher-academic-professional-details', payload, 'teacher/signup');
	$("#teacherSignupContentStage2").html(getTeacherProfessionalDetailsContent(responseData));	
	signupTeacherStage2OnLoadEvent(responseData);
	loadApprovedDemoIfExists(responseData.recordingUrls);
	$("#totalExperianceFromYYYY").val(responseData.details.teacherDetails.totalExpYear).trigger("change");
	GRADES_TAUGHT = responseData.details.teacherDetails.selectedGrades != ""? responseData.details.teacherDetails.selectedGrades.replaceAll(" ", "").split(',') : [];
	responseDataSubjects = await getDashboardDataBasedUrlAndPayloadWithParentUrl(false, false, 'get-teacher-signup-subject-details', {userId: USER_ID}, '/teacher/signup');
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

async function openModalForDemoVideo() {
	$("#demoVideoWrapper").html(videoInstructionModalContent());
	$('#videoInstructionBackdrop').fadeIn();
	$('#videoInstructionModal').addClass('open');
	$("body").css("overflow", "hidden");
	if (Array.isArray(entityIds) && entityIds.length !== 0) {
		for (const meetingId of entityIds) {
			await getDemoRecordings(meetingId);
		}
		// if(entityIds.length == 1){
		// 	$("#recordYourDemoInsideBtn span").text("Record Your Demo (2nd Attempt)");
		// 	$('#recordYourDemoInsideBtn').show().attr('data-attempt', '2');
		// 	$('#recordYourDemoInsideBtn').attr("onclick", `startDemoRecording('2')`);
		// }
		// if(entityIds.length == 2){
		// 	$('#recordYourDemoInsideBtn').hide();
		// }
	}else{
		$('#recordYourDemoInsideBtn').attr("onclick", `startDemoRecording('1')`);
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
async function startDemoRecordingFun(attempt){
	const now = new Date();
	const startDate = now.toLocaleDateString('en-GB');
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
	payload['title'] = `Teacher Demo Video | Attempt ${attempt} | ${USER_FULL_NAME}`;
	payload['startDate'] = startDate;
	payload['startTime'] = startTime;
	payload['duration'] = "00:30";
	payload['hostUserId'] = USER_ID;
	payload['timezone'] = timezoneData.mastersData.masterDTO.value;
	payload['meetingType'] = "1";
	payload['gmType'] = "16";
	responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(false, false, 'create-teacher-registration-demo-meeting', payload, '/teacher/signup');
	if(responseData.status == "success"){
		const payloadToStartMeeting = {
			entityId: responseData.data.meetingId,
			entityType: "GENERAL_MEETINGS"
		};
		if (!entityIds.includes(responseData.data.meetingId)) {
			entityIds.push(responseData.data.meetingId);
		}
		const encodedPayload = btoa(JSON.stringify(payloadToStartMeeting));
		const queryParams = `?payload=${encodeURIComponent(encodedPayload)}`;
		$.ajax({
			type: "GET",
			url: `${APP_BASE_URL}${SCHOOL_UUID}/teacher/signup/start-teacher-registration-demo-meeting${queryParams}`,
			contentType: "application/json",
			dataType: "json",
			success: function (response) { 
				if(response.status == 1){
					window.open(response.redirectUrl, '_blank');
					// if(responseData.data.meetingsExist == false){
					// 	if(attempt == 1){
					// 		// $("#recordYourDemoInsideBtn span").text("Record Your Demo (2nd Attempt)");
					// 		// $('#recordYourDemoInsideBtn').show().attr('data-attempt', '2');
					// 		// $('#recordYourDemoInsideBtn').attr("onclick", `startDemoRecording('2')`);
					// 	}else if(attempt == 2){
					// 		$("#recordYourDemoInsideBtn").hide();
					// 		$("#approveDemoBtn").css("margin-left", "auto");
					// 	}
					// }else{
					// 	$("#recordYourDemoInsideBtn span").text("Record Your Demo (2nd Attempt)");
					// 	$('#recordYourDemoInsideBtn').show().attr('data-attempt', '1');
					// 	$('#recordYourDemoInsideBtn').attr("onclick", `startDemoRecording('1')`);
					// }
					clearInterval(recordingPollingInterval);
					recordingPollingInterval = null;
					// setTimeout(() => {
						// if(recordingIntervalCount == 0){
							getDemoRecordings(responseData.data.meetingId);
							recordingPollingInterval = setInterval(() => {
								getDemoRecordings(responseData.data.meetingId);
							}, 10000);
						// }
					// }, 30000);
					$("#recordingWaitingText").text("The recording is not started yet")
					$("#recordingWaitingText").show();
					if(entityIds.length == 2){
						$("#recordYourDemoInsideBtn").hide();
					}
				}else{
					showMessageTheme2(0, response.message)
				}
			}
		});
	}
}

async function getDemoRecordings(meetingId) {
    const payload = {
        entityId: meetingId,
        entityName: "GENERAL_MEETINGS"
    };

    const responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(
        false,
        false,
        'get-teacher-demo-recordings',
        payload,
        '/teacher/signup'
    );
	recordingIntervalCount++;
	if (recordingIntervalCount >= 240) {
		clearInterval(recordingPollingInterval);
		recordingPollingInterval = null;
	}
	// if(recordingPollingInterval){
	// 	$("#recordingWaitingText").show();
	// }
    if (responseData.statusCode === "SUCCESS") {
		if(responseData.meetingStatus == "not start"){
			$("#recordingWaitingText").text("The recording is not started yet")
			$("#recordingWaitingText").show();
			if(entityIds.length == 1){
				$("#recordYourDemoInsideBtn span").text("Record Your Demo");
				$('#recordYourDemoInsideBtn').show().attr('data-attempt', '1');
				$('#recordYourDemoInsideBtn').attr("onclick", `startDemoRecording('1')`);
			}
		}else if(responseData.meetingStatus == "start"){
			$("#recordingWaitingText").text("The recording is not ended yet")
			$("#recordingWaitingText").show();
			$("#recordYourDemoInsideBtn span").text("Record Your Demo (2nd Attempt)");
			$('#recordYourDemoInsideBtn').show().attr('data-attempt', '2');
			$('#recordYourDemoInsideBtn').attr("onclick", `startDemoRecording('2')`);
			$("#recordYourDemoInsideBtn").attr("disabled", true);
			if(entityIds.length == 2){
				$("#recordYourDemoInsideBtn").hide();
			}
		}else{
			$("#recordYourDemoInsideBtn").attr("disabled", false);
			if(entityIds.length == 1){
				$("#recordYourDemoInsideBtn span").text("Record Your Demo (2nd Attempt)");
				$("#recordYourDemoOutsideBtn span").text("Record Your Demo (2nd Attempt)");
				$('#recordYourDemoInsideBtn').show().attr('data-attempt', '2');
				$('#recordYourDemoInsideBtn').attr("onclick", `startDemoRecording('2')`);
			}
			if(entityIds.length == 2){
				$("#recordYourDemoInsideBtn").hide();
			}
			if(responseData.recordingArray.length == 0){
				$("#recordingWaitingText").html("Please wait while we are processing your recording <span><i class='fa fa-spinner fancytree-helper-spin' aria-hidden='true'></i></span>")
				$("#recordingWaitingText").show();
			} else {
				$("#approveDemoBtn").show();
				$("#approveDemoBtn").css("margin-left", "auto");
				const recordings = responseData.recordingArray || [];
				entityIds.sort();
				const $videoSection = $('#recordingSection');

				if ($("#mergedRecordingTable").length === 0) {
					let tableWrapper = `
						<div class="mt-3 bg-white p-3 rounded shadow-sm" style="padding: 30px 0px 10px;">
							<table id="mergedRecordingTable" class="table table-bordered">
								<thead style="background-color: #027fff; color: white;">
									<tr>
										<th>Attempt</th>
										<th>Start Time</th>
										<th>End Time</th>
										<th>Action</th>
									</tr>
								</thead>
								<tbody></tbody>
							</table>
						</div>`;
					$videoSection.append(tableWrapper);
				}

				const $tableBody = $("#mergedRecordingTable tbody");

				recordings.forEach((rec, i) => {
					const existingRow = $tableBody.find(`input[data-meetingid="${rec.meetingId}"]`);
					if (existingRow.length === 0 && $tableBody.find('tr').length < 2) {
						const rowId = `rec_${meetingId}_${i}`;
						const checked = rec.meetingId == selectedDemoMeetingId ? 'checked' : 
							($tableBody.find('input[name="selectedDemoRecording"]').length === 0 ? 'checked' : '');
						const rowKey = `${meetingId}_${i}`;
						demoRecordingUrlMap[rowKey] = rec.urls;
						var startDateTime = rec.startDate == null ? "N/A" : changeDateFormat(new Date(rec.startDate), "MMM dd, yyyy hh:mm:ss A");
						var endDateTime = rec.endDate == null ? "N/A" : changeDateFormat(new Date(rec.endDate), "MMM dd, yyyy hh:mm:ss A");
						let attempt = '';
						if (meetingId == entityIds[0]) {
							attempt = 1;
						} else if (meetingId == entityIds[1]) {
							attempt = 2;
						}
						$tableBody.append(`
							<tr>
								<td>${attempt == 1 ? "1st Attempt" : "2nd Attempt"}</td>
								<td>${startDateTime}</td>
								<td>${endDateTime}</td>
								<td>
									<a id="playBtn_${meetingId}_${i}" href="javascript:void(0);" onclick="openDemoRecordingModal(demoRecordingUrlMap['${rowKey}'], '${attempt == 1 ? "1st Attempt" : "2nd Attempt"}')" class="btn btn-sm btn-primary m-0">Recordings</a>
									<input class="form-check-input ml-3" type="radio" name="selectedDemoRecording" id="${rowId}" value="${rec.meetingId}" data-meetingid="${rec.meetingId}" data-attempt="${attempt}" ${checked}>
								</td>
							</tr>
						`);
					}
				});
				const totalValid = $("#mergedRecordingTable tbody tr").length;
				if (totalValid === 0) {
					$('#recordYourDemoInsideBtn span').text('Record your Demo');
					$('#recordYourDemoInsideBtn').show().attr('data-attempt', '1');
					$('#recordYourDemoInsideBtn').attr("onclick", `startDemoRecording('1')`);
					$('input[name="selectedDemoRecording"]').hide();
					$('#recordYourDemoOutsideBtn span').text('Record your Demo');
				} else if (totalValid === 1 ) {
					$('input[name="selectedDemoRecording"]').hide();
					if(totalValid == entityIds.length){
						$('#recordYourDemoInsideBtn span').text('Record your demo (2nd Attempt)');
						$('#recordYourDemoInsideBtn').show().attr('data-attempt', '2');
						$('#recordYourDemoInsideBtn').attr("onclick", `startDemoRecording('2')`);
						$("#approveDemoBtn").show();
						if (recordingPollingInterval) {
							clearInterval(recordingPollingInterval);
							recordingPollingInterval = null;
							$('#recordYourDemoInsideBtn').prop('disabled', false);
						}
						$('#recordYourDemoOutsideBtn span').text('Record your demo (2nd Attempt)');
						$("#recordingWaitingText").hide();
						recordingIntervalCount = 0;
					}
				} else if(totalValid === 2) {
					$('#recordYourDemoInsideBtn').hide();
					if (recordingPollingInterval) {
						clearInterval(recordingPollingInterval);
						recordingPollingInterval = null;
					}
					$('input[name="selectedDemoRecording"]').show();
					$('#recordYourDemoOutsideBtn span').text('Select Recording(s)');
					$("#recordingWaitingText").hide();
					$("#approveDemoBtn").show();
					$("#approveDemoBtn").css("margin-left", "auto");
				}
			}
		}
    }
}

function approvedDemoRecording() {
	const selectedRecording = $("input[name='selectedDemoRecording']:checked");
	if (selectedRecording.length === 0) {
		showMessageTheme2(0, "Please select a recording.");
		return;
	}

	const selectedMeetingId = selectedRecording.data('meetingid');
	selectedDemoMeetingAttempt = selectedRecording.data('attempt');
	if(selectedDemoMeetingAttempt == 1){
		selectedDemoMeetingAttempt = "1st Attempt"
	}else if(selectedDemoMeetingAttempt == 2){
		selectedDemoMeetingAttempt = "2nd Attempt"
	}
	const selectedRowId = selectedRecording.attr('id').replace('rec_', '');
	selectedDemoMeetingId = selectedMeetingId;
	approvedDemoRowKey = selectedRowId;

	const row = selectedRecording.closest('tr');
	const startTime = row.find('td').eq(1).text();
	const endTime = row.find('td').eq(2).text();

	const approvedTable = `
		<div class="mt-3 bg-white p-3 rounded shadow-sm" style="padding: 10px 0px;">
			<table class="table table-bordered">
				<thead style="background-color: #027fff; color: white;">
					<tr>
						<th>Attempt</th>
						<th>Start Time</th>
						<th>End Time</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>${selectedDemoMeetingAttempt}</td>
						<td>${startTime}</td>
						<td>${endTime}</td>
						<td>
							<a href="javascript:void(0);" class="btn btn-sm btn-primary"
							   onclick="openDemoRecordingModal(demoRecordingUrlMap['${selectedRowId}'], '${selectedDemoMeetingAttempt}')">
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
		populateRecordingModal(recordings, title);
	} else {
		showMessageTheme2(0, "No recordings available.");
	}
}

function closeAllVideoModal(){
	$("#recordingModal").modal("hide");
}

function closeTranscriptModal(){
	$("#transcriptModal").modal("hide");
}

function playRecording(videoUrl, title) {
	var videoModal = $("#videoModal");
	$.ajax({
	  type: "GET",
	  contentType: "application/json",
	  dataType: 'json',
	  url: getURLForSignVideo(videoUrl),
	  success: function (responseData) {
		if (responseData.status == 0) {
		  const signedUrl = responseData.url;
		  if (videoModal.length == 0) {
			$("body").append(`
				<div id="videoModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 10000;">
					<div style="background: white; border-radius: 12px; overflow: hidden; width: 70%; max-width: 70%;margin: auto; margin-top:50px;">
						<div class="">
							<div class="" style="padding: 15px 10px; background: #027FFF; display:flex; justify-content: space-between; align-items: center;">
								<h5 class="mb-0" style="font-size: 18px; font-weight: bold; color: white;">Demo Video | ${title}</h5>
								<button onclick="closeVideoModal();" type="button" class="text-white btn btn-sm btn-danger" data-bs-dismiss="modal" aria-label="Close" style="font-size: 20px !important; margin: 0; padding: 0px 8px;">&times;</button>
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
		  } else {
			videoModal.find(".modal-title").text(title);
			videoModal.find(".videoTag source").attr("src", signedUrl);
			videoModal.find(".videoTag")[0]?.load();
		  }
  
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

function closeVideoModal(){
	const videoElement = $("#videoModal .videoTag")[0];
	if (videoElement) {
		videoElement.pause();
		videoElement.currentTime = 0;
	}
	$("#videoModal").modal("hide");
	$("#videoModal").remove();
}

function getURLForSignVideo(videoUrl) {
	const payload = JSON.stringify({ url: videoUrl });
	const encodePayload = window.btoa(payload);
	return BASE_URL + CONTEXT_PATH + "videos/signed-url?payload=" + encodePayload;
}

function getURLForSignVideo(videoUrl) {
	const payload = JSON.stringify({ url: videoUrl });
	const encodePayload = window.btoa(payload);
	return BASE_URL + CONTEXT_PATH + "videos/signed-url?payload=" + encodePayload;
}
  
function getURLForTranscriptContent(transcriptUrl) {
	var payload = JSON.stringify({ url: transcriptUrl });
	var encodePayload = window.btoa(payload);
	return BASE_URL + CONTEXT_PATH + "transcript/show-content?payload=" + encodePayload;
}
  
function convertToVTT(videoUrl) {
	if (!videoUrl.endsWith(".mp4")) {
		return null;
	}
	const urlParts = new URL(videoUrl);
	const filePath = urlParts.pathname.replace(
		/\/([^\/]+)-(\d+\.\d+)\.mp4$/,
		"/$1-transcript-$2.vtt"
	);
	let transcriptUrl = urlParts.origin + filePath;

	if (transcriptUrl === videoUrl) {
		const prefixUrl = "https://ischoolingwise.s3.us-east-1.amazonaws.com/recordings/";
		const sessionId = videoUrl.split(prefixUrl)[1].split("-")[0];
		transcriptUrl = `${prefixUrl}${sessionId}-transcript-1.1.vtt`;
	}
	return transcriptUrl;
}
  
function displayVTT(content, title) {
	const output = $("#transcript-modal-body");
	output.empty();

	if(content.includes("<Error><Code>")){
		output.append(`<p style="font-size: 18px;">No Transcript Available</p>`)
	} else {
		var lines = content.split("\n");
		lines.forEach(line => {
		var p = $("<p></p>").text(line);
		output.append(p);
		});
	}

	$("#transcriptModalTitle").html(title);
	$("#transcriptModal").modal("show");
}
  
function showVTTFile(url, title) {
	let transcriptModal = $("#transcriptModal");

	if (transcriptModal.length === 0) {
		$("body").append(`
		<div id="transcriptModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 10000;">
			<div style="background: white; border-radius: 12px; overflow: hidden; width: 70%; max-width: 70%;margin: auto; margin-top:50px;">
			<div class="" style="height: 100%; display: flex; flex-direction: column;">
				<div style="padding: 15px 10px; background: #027FFF; display: flex; justify-content: space-between; align-items: center;">
				<h5 id="transcriptModalTitle" style="font-size: 18px; font-weight: bold; color: #FFF; margin-bottom: 0px;">${title}</h5>
				<button type="button" class="text-white btn btn-sm btn-danger" data-bs-dismiss="modal" aria-label="Close" style="font-size: 20px !important; margin: 0; padding: 0px 8px;" onclick="closeTranscriptModal();">&times;</button>
				</div>
				<div id="transcript-modal-body" class="text-left" style="flex-grow: 1; padding: 20px; height: 70vh; overflow-y: auto;">
				<!-- Transcript content will be populated here -->
				</div>
			</div>
			</div>
		</div>
		`);
	}

	customLoader(true);
	const vttFile = convertToVTT(url);
	$.ajax({
		type: "GET",
		contentType: "application/json",
		dataType: 'json',
		url: getURLForTranscriptContent(vttFile),
		success: function(responseData) {
		customLoader(false);
		displayVTT(responseData.content, title);
		},
		error: function() {
		customLoader(false);
		showMessageTheme2(0, "Failed to load transcript.");
		}
	});
}

function loadApprovedDemoIfExists(recordingData) {
	if (!recordingData || !Array.isArray(recordingData) || recordingData.length === 0) return;

	const entry = recordingData[0];

	const selectedMeetingId = entry.meetingId;
	selectedDemoMeetingAttempt = entry.attempt;
	if(selectedDemoMeetingAttempt == 1){
		selectedDemoMeetingAttempt = "1st Attempt"
	}else if(selectedDemoMeetingAttempt == 2){
		selectedDemoMeetingAttempt = "2nd Attempt"
	}
	const startTime = entry.startDate == null ? "N/A" : changeDateFormat(new Date(entry.startDate), "MMM dd, yyyy hh:mm:ss A");
	const endTime = entry.endDate == null ? "N/A" : changeDateFormat(new Date(entry.endDate), "MMM dd, yyyy hh:mm:ss A");
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
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>${selectedDemoMeetingAttempt}</td>
						<td>${startTime}</td>
						<td>${endTime}</td>
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
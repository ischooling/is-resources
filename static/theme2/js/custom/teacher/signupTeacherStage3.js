
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
async function signupTeacherStage3OnLoadEvent(responseData){
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
	
	autoSelectDropDownTeacherUpdateProfile('teacherSignupStage3', stup);
	formValdate('teacherSignupStage3', mandatoryFields, [])

	$('.select_dropdown').select2();
	$('[data-toggle="tooltip"]').tooltip().show();
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
		showMessage(2, ' Please upload your highest degree.',"", true);
		return false;
	}
	if ($("#"+formId+" #fileupload1Span").html()=='' || $("#"+formId+" #fileupload1Span").html()=='Upload CV') {
		showMessage(2, '  Please upload updated CV',"",  true);
		return false;
	}
	if ($("#"+formId+" #fileupload4Span").html()=='' || $("#"+formId+" #fileupload4Span").html()=='Upload Passport/National ID') {
		showMessage(2, '  Please upload Passport/National ID',"",  true);
		return false;
	}
	var totalSelectedSubject = elementary_subjects.length + middleSchool_subjects.length + highSchool_subjects.length;
	if (totalSelectedSubject < 1) {
		showMessage(2, ' Select taught subjects',"", true);
		return false;
	}
	// if(SUBJECTS_TAUGHT < 1){
	// 	showMessage(2, ' Select taught subjects',"", true);
	// 	return false;
	// }
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
					showMessage(0, res.message,"", true);
				}
				flag=false;
			}else{
				getStage4Data(getRequestForTeacherUpdateProfile(formId,elementary_subjects,middleSchool_subjects,highSchool_subjects).data);
				showMessage(1, 'Teacher profile updated successfully.', '', true);
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
	teacherUpdateProfileDTO['attachements'] = academicUploadDocsObj;
	teacherUpdateProfileDTO['elementrySelectedSubject'] = elementary_subjects;
	teacherUpdateProfileDTO['middleSelectedSubject'] = middleSchool_subjects;
	teacherUpdateProfileDTO['highSelectedSubject'] = highSchool_subjects;
	teacherUpdateProfileDTO['selectedGrades'] = GRADES_TAUGHT.toString();
	teacherUpdateProfileDTO['highestQualificationId'] = $("#"+formId+" #highestQualificationId").val();
	teacherUpdateProfileDTO['totalExperianceFromYYYY'] = $("#"+formId+" #totalExperianceFromYYYY").val();
	teacherUpdateProfileDTO['totalExperianceFromMM'] = 0;
	teacherUpdateProfileDTO['lastOrganizationName'] = escapeCharacters(toTitleCase($("#"+formId+" #lastOrganizationName").val()));
	teacherUpdateProfileDTO['educationSpecialization'] = escapeCharacters(toTitleCase($("#"+formId+" #teacherSubjectSpecialization").val()));
	// teacherUpdateProfileDTO['currentlyWorking'] = $("#"+formId+" #currentlyWorking").is(":checked") ? "Y" : "N";
	teacherUpdateProfileDTO['lastJobDesc'] = escapeCharacters(toSentenceCase($("#"+formId+" #lastJobDesc").val()));
	teacherUpdateProfileDTO['declConfirmation'] = $("#"+formId+" #declConfirmation").is(":checked") ? "Y" : "N";
	teacherUpdateProfileDTO['demoVedioLink'] = escapeCharacters($("#"+formId+" #demoVedioLink").val());
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
					showMessage(0, data['message'],"", true);
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
					showMessage(0, data['message'],"", true);
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
					showMessage(0, data['message'],"", true);
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
	  	// var selectedGradeType = $(this).parent().closest('li').attr('coursetype'); 
		// if(!gradesTaught.includes(selectedGradeType)){
	  	// 	gradesTaught.push(selectedGradeType);
	  	// }
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
       subjectsTaught.remove_by_value(data.id);
       var selectedGradeType = $(this).parent().closest('li').attr('coursetype');
       var unSelectedCourse = data.id.replace(/\s+/g, '');;
       var selectedGrade = $(".selected_course_wrapper").find("[courseid='" + unSelectedCourse + "']").parent().remove();
       //gradesTaught.remove_by_value(selectedGradeType);
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
	// selectedCategoryLength = $('.selected_courses li.selectedCategory').length;
	// for(i=1; i<=selectedCategoryLength; i++){
	// 	var selectedCategoryType = $('.selected_courses li:nth-child('+ i + ')').attr('coursecategorytype');
	// 	courseCategoryType.push(selectedCategoryType)
	// }
	// $('.selected_courses li').attr('coursecategorytype');
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

// function changeOrgNameLabel(){
// 	if($("#currentlyWorking").is(":checked")){
// 		$("#lastCurrentOrg").text("Current");
// 		$("#lastOrganizationName").attr("placeholder","Current Organization Name *");
// 	}else{
// 		$("#lastOrganizationName").attr("placeholder","Last Organization Name *");
// 		$("#lastCurrentOrg").text("Last")
// 	}
// }

async function showGradeList() {
	// $('#select_grade').modal('show');
	// var payload = {};
	// 	payload['userId'] = USER_ID;
	// 	responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(false, false, 'get-teacher-signup-subject-details', payload, '/teacher/signup');
	// $("body").append(gradeSelectionModal(responseData.details));
	if(!applyGradeflag){
		$("#select_grade").remove();
		$("body").append(gradeSelectionModal());
		$("#e2_2").val(GRADES_TAUGHT).trigger("change");
		var gradeList = $(".course-selection-dropdown").select2({
			placeholder: "Select Grade",
			// maximumSelectionLength: 5,
		   // closeOnSelect: false,
		   // selectOnClose:false,
			// initSelection: function(element, callback) { }
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
		if($(this).hasClass('inactive')){ //this is the start of our condition 
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
		if($(this).hasClass('inactive')){ //this is the start of our condition 
			$('.course-tabs-format ul.course-list li a').addClass('inactive');           
			$("#"+tabParent).find('.elementary_course_item').removeClass('active-tab');           
			$(this).removeClass('inactive');
			$(this).parent().addClass('active-tab').find('.elementary-wrapper').slideDown('fast');
			$('.elementary_course_item .course-list-wrapper').hide();
			$('#'+ tabID + 'C').slideDown();
		}
	});
}

async function getStage3Data(){
	setSteps(2);
	showSkeleton(true, "step2");
	var payload = {};
	payload['userId'] = USER_ID;
	responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(false, false, 'get-teacher-academic-professional-details', payload, 'teacher/signup');
	$("#teacherSignupContentStage3").html(getTeacherProfessionalDetailsContent(responseData));	
	signupTeacherStage3OnLoadEvent(responseData);
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
	// var selectedCourseArray = elementary_subjects.concat(middleSchool_subjects,highSchool_subjects);
	// if(selectedCourseArray.length>0){
	// 	$(".selected_course_containter").show();
	// }
	// var course_Category_Id = $('.custom-tab-wrapper li.active-tab a').attr('id');
	// var course_Category = $(".courses-category-wrapper").find("#"+course_Category_Id+"C").find('ul.course-list li.active-tab').attr('coursetype');
	// coursesDropdonw(course_Category, course_Category_Id);
	$(".step-2-skeleton").hide();
	$("#teacherSignupStage3").show();
}


function getAdminUserList(formId, moduleId, startLimit) {
	if(!getSession()){
      redirectLoginPage();
	  return false;
    }
	
 hideMessageTheme2('');
 
 $.ajax({
	 type : "POST",
	 contentType : APPLICATION_JSON_VALUE,
	 url : getURLForHTML('dashboard','admin-user-list'),
	 data : JSON.stringify(getRequestForAdminUserList(formId, moduleId, startLimit)),
	 dataType : 'json',
	 cache : false,
	 timeout : 600000,
	 success : function(data) {
		console.log(data);
		 if (data['status'] == '0' || data['status'] == '2') {
			 showMessageTheme2(0, data['message'],'',true);
		 } else {
			 //showMessageTheme2(1, data['message'],'',true);
			//  setTimeout(function(){
			// 	 location.reload();
			//  }, 1500);
			var html=getAdminUserListHtml(data.manageProfileList);
			
			//adminManageUserListpaging
			 var htmlpage=dataAdminUserPagging(data);
            $(".adminManageUserListpaging").html(htmlpage);
			// if ($.fn.DataTable.isDataTable("#adminManageUserList")) {
			// 	$("#adminManageUserList").DataTable().clear().destroy();
			// }
			$("#adminManageUserListbody").html(html);
			// $("#adminManageUserList").DataTable({
			// 	theme: "bootstrap4"
			// });
			showDropdownCustomView('adminManageUserList')
		}
		 return false;
	 }
 });
}
function getRequestForAdminUserList(formId, moduleId, startLimit){
	var manageProfileStudentDTO = {};
  	manageProfileStudentDTO['moduleId'] = moduleId;
  	manageProfileStudentDTO['name'] = $("#"+formId+" #Name").val();
	if($("#adminUserSearch").val()!=''){
		manageProfileStudentDTO['searchName'] = $("#adminUserSearch").val();
	}else{
		manageProfileStudentDTO['userName'] = $("#"+formId+" #userName").val().trim();
	}
	manageProfileStudentDTO['addedDate'] = $("#"+formId+" #addedDate").val();
	manageProfileStudentDTO['roleName'] = $("#"+formId+" #roleUser").val();
  	manageProfileStudentDTO['userId'] = USER_ID;
	manageProfileStudentDTO['schoolId'] = SCHOOL_ID;
  	manageProfileStudentDTO['currentPage']=startLimit;
  	manageProfileStudentDTO['recordsPerPage']=$("#"+formId+" #pageSize").val();;
	return manageProfileStudentDTO;
}

function getAdminUserListHtml(userList){
	console.log(userList);
	var html='';
	if(userList.length>0){
		for (let iu = 0; iu < userList.length; iu++) {
			const adminUsr = userList[iu];
			html+=`<tr>	
             <td>${(adminUsr.sno)}</td>
             <td>${adminUsr.name}</td>
             <td>${adminUsr.userName}</td>
             <td>${adminUsr.roleName}</td>
             <td class="text-center">${adminUsr.gotoMeetingStatus}</td>
             <td>${adminUsr.referralCode}</td>
             <td>${adminUsr.profileStatus}</td>
             <td>${adminUsr.addedDate}</td>
			 <td class="text-center">${adminUsr.action}</td>
         </tr>`;
		}
	}
	return html;
}

function callManageAdminLmsPasswordModal(userId){
		var data={};
		data['userId']=userId;
		data['moduleId']=ROLE_MODULE.moduleId;
		data['sessionUserId']=USER_ID;
		data['themeType']="theme2";
		$.ajax({
			type : "POST",
			contentType: APPLICATION_JSON_VALUE,
			url : getURLForHTML('dashboard','student-view-lms-content'),
			data : JSON.stringify(data),
			dataType : 'json',
			success : function(data) {
				if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
					if(data['status'] == '3'){
						redirectLoginPage();
					}else{
						showMessageTheme2(0, data['message'],'',true);
					}
				} else {
					var html =getViewAdminUserLmsCredaintial(data);
					$('#viewAdminLmsContent').html(html);
					$("#adminViewLmsEntryModel").modal("show")
				}
				showDropdownCustomView('studentLmsContent')
			}
		});
		$('#lmsUserForm #userId1').val(userId);
	}

	function addlmsContent(controlType,studentId,roleModuleId,lmsId) {
	hideMessage('');
	console.log(controlType);
	if(lmsId==undefined){
		lmsId=0;
	}
	var data={};
	data['studentId']=studentId;
	data['controlType']=controlType;
	data['lmsId']=lmsId;
	data['userId']=USER_ID;
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard','add-lms-Content'),
		data : JSON.stringify(data),
		dataType : 'html',
		cache : false,
		success : function(htmlContent) {
			if(htmlContent!=""){
            	var stringMessage = [];
            	stringMessage = htmlContent.split("|");
        		console.log('stringMessage: '+stringMessage);
            	if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT" ){
            		showMessageTheme2(true, stringMessage[1]);
        		}else{
        			showMessageTheme2(true, stringMessage[1]);
        			if(controlType=="email"){
        				setTimeout(function(){
        					callDashboardPageSchool(roleModuleId,'manage-lms-user');
        				}, 1000);
        			}else if(controlType=="emailUser"){
        				setTimeout(function(){ $('#studentViewLmsEntryModel').modal('hide'); }, 1000)
        			}
        		}
    			return false;
			}
		}
	});
}


function callForNewUser(formId, moduleId) {
  hideMessage("");
  if (!validateRequestForNewUser(formId)) {
    //refreshCaptcha('captchaImage');
    return false;
  }
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForHTML("dashboard", "create-new-user"),
    data: JSON.stringify(getRequestForNewUser(formId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessageTheme2(0, data["message"]);
      } else {
        showMessageTheme2(1, data["message"]);
        if (data["status"] == "1") {
          resetCreateUserForm(formId);
		  if($("#" + formId + " #userId").val()!=''){
			  setTimeout(function () {
				callDashboardPageSchool(moduleId, "user-list");
			  }, 600);
		  }
        }
      }
      return false;
    }
  });
}

function resetCreateUserForm(formId) {
  $("#" + formId + " #firstName").val("");
  $("#" + formId + " #middleName").val("");
  $("#" + formId + " #lastName").val("");
  $("#" + formId + " #gender").val("0");
  $("#" + formId + " #dob").val("");
  $("#" + formId + " #roleUser").val("0");
  $("#" + formId + " #countryId").val("0");
  $("#" + formId + " #stateId").val("0");
  $("#" + formId + " #cityId").val("0");
  $("#" + formId + " #schoolId").val("0");
  $("#" + formId + " #emailId").val("");
  $("#" + formId + " #password").val("");
  $("#" + formId + " #roleUser").val(0).trigger('change');
  $("#" + formId + " #supportRoleId").val("").trigger('change');
   $("#" + formId + " #languages").val("").trigger('change');
  
}
function validateRequestForNewUser(formId) {
  if (!validateFormAscii(formId)) {
    showMessageTheme2(0,  "Please use the English Keyboard while providing information");
    return false;
  }
  if ($("#" + formId + " #firstName").val() == "") {
    showMessageTheme2(0, "First Name is required");
    return false;
  }

  if (
    $("#" + formId + " #roleUser").val() == 0 ||
    $("#" + formId + " #roleUser").val() == null
  ) {
    showMessageTheme2(0, "Role is required");
    return false;
  }

  if (!validateEmail($("#" + formId + " #emailId").val())) {
    showMessageTheme2(0, "Email is either empty or invalid");
    return false;
  }
  if ($("#" + formId + " #noOfWorkingHours").val() == "") {
    showMessageTheme2(0, "Please fill working hours in a day.");
    return false;
  }
  return true;
}

function getRequestForNewUser(formId) {
  var request = {};
  var authentication = {};
  var signupStudentDTO = {};
  var url = window.location.href;
  signupStudentDTO["userId"] = $("#" + formId + " #userId").val();
  signupStudentDTO["firstName"] = $("#" + formId + " #firstName").val();
  signupStudentDTO["middleName"] = $("#" + formId + " #middleName").val();
  signupStudentDTO["lastName"] = $("#" + formId + " #lastName").val();
  signupStudentDTO["gender"] = $("#" + formId + " #gender").val();
  signupStudentDTO["roleUserId"] = $("#" + formId + " #roleUser").val();
  signupStudentDTO["roleUser"] = $(
    "#" + formId + " #roleUser option:selected"
  ).text();
  signupStudentDTO["countryId"] = $("#" + formId + " #countryId").val();
  signupStudentDTO["stateId"] = $("#" + formId + " #stateId").val();
  signupStudentDTO["cityId"] = $("#" + formId + " #cityId").val();
  signupStudentDTO["referralCode"] = $(
    "#" + formId + " #referralCodeCheckbox"
  ).prop("checked");
  signupStudentDTO["referralCodeText"] = $( "#" + formId + " #updateReferralCode").val();
  signupStudentDTO["countryTimezone"] = $("#" + formId + " #userTimeZone option:selected").attr("data-timezone");
  signupStudentDTO["countryTimezoneId"] = $("#" + formId + " #userTimeZone").val();
  signupStudentDTO["communicationEmail"] = $("#" + formId + " #emailId").val();
  signupStudentDTO["whatsappNumber"] = $("#" + formId + " #whatsappNumber").val();
  signupStudentDTO["position"] = $("#" + formId + " #position").val();
  signupStudentDTO["countryIsdCode"] = $("#" + formId + " #isdCode").val();
  if ($("#" + formId + " #password").length) {
    signupStudentDTO["password"] = encode($("#" + formId + " #password").val());
  }
  if ($("#" + formId + " #confirmPassword").length) {
    signupStudentDTO["confirmPassword"] = encode(
      $("#" + formId + " #confirmPassword").val()
    );
  }
  if (
    $("#" + formId + " #reset").length > 0 &&
    $("#" + formId + " #reset").val() != ""
  ) {
    signupStudentDTO["reset"] = encode($("#" + formId + " #reset").val());
  }
  signupStudentDTO["dob"] = $("#" + formId + " #dob").val();
  signupStudentDTO["schoolId"] = $("#" + formId + " #schoolId").val();
  signupStudentDTO["userActive"] = $("#" + formId + " #userActive").val();
  signupStudentDTO["signupType"] = "Offline";
  signupStudentDTO["userType"] = "SCHOOL";
  signupStudentDTO["supportRoleId"] = $("#" + formId + " #supportRoleId").val();
  signupStudentDTO["languagesKnown"] = $("#" + formId + " #languages").select2('val');
  signupStudentDTO["workingHours"] = $("#" + formId + " #noOfWorkingHours").val();
  request["signupStudentDTO"] = signupStudentDTO;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = "SCHOOL";
  authentication["userId"] = USER_ID;
  request["authentication"] = authentication;
  return request;
}


function showAdminStatusPopup(message,status,gotoId,userId,meetingVendor) {
  $("#userIdforGoto").val(userId);
  $("#gotoId").val(gotoId);
  $("#meetingvendor").val(meetingVendor);
  if (status == "Active") {
    $("#statusMessage-1").html('<i class="fa fa-user-plus text-primary fa-4x"></i>');
    $("#showMessageAdminCreateUser .modal-header").addClass("bg-primary").removeClass("bg-danger, bg-success");
    $("#resetDeleteErrorWarningNo").text("Inactivate").addClass("btn-primary").removeClass("btn-danger,btn-success");
  } else if (status == "Inactive") {
    $("#statusMessage-1").html('<i class="fa fa-times text-danger fa-4x"></i>');
    $("#showMessageAdminCreateUser .modal-header").addClass("bg-danger").removeClass("bg-success, bg-primary");
    $("#resetDeleteErrorWarningNo").text("Activate").addClass("btn-danger").removeClass("btn-success, btn-primary");
  } else if (status == "create") {
    $("#statusMessage-1").html('<i class="fa fa-check text-success fa-4x"></i>');
    $("#showMessageAdminCreateUser .modal-header").addClass("bg-primary").removeClass("bg-danger, bg-success");
    $("#resetDeleteErrorWarningNo").text("Create").addClass("btn-success").removeClass("btn-danger, btn-primary");
  }
  $("#gotoMeetingUserstatus").html(message);
  $("#showMessageAdminCreateUser").modal("show");
}


function callForAdminLMSContent(userId,controllType,courseProId,lmsId){
	var data={}
	data['userId']=userId;
	data['controllType']=controllType;
	data['courseProId']=courseProId;
	data['lmsId']=lmsId;
	data['sessionUserId']=USER_ID;
	data['themeType']="theme2";
	$.ajax({
		type : "POST",
		contentType:APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard','student-lms-content'),
		data : 	JSON.stringify(data),
		dataType : 'html',
		cache : false,
		timeout : 600000,
		success : function(htmlContent) {
			if(htmlContent!=""){
            	var stringMessage = [];
            	stringMessage = htmlContent.split("|");
        		if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT"){
        			if(stringMessage[0] == "SESSIONOUT"){
        				redirectLoginPage();
        			}else{
        				showMessageTheme2(0, stringMessage[1]);
        			}
        		} else {
              if( stringMessage[1]!=undefined){
                showMessageTheme2(1, stringMessage[1]);
              }
        			if(controllType=='ACTIVE' || controllType=='INACTIVE'){
        				if(controllType=='ACTIVE'){
            				$('#lmsuserInactive'+lmsId).show();
            				$('#lmsuserActive'+lmsId).hide();
            			}else if(controllType=='INACTIVE'){
            				$('#lmsuserInactive'+lmsId).hide();
            				$('#lmsuserActive'+lmsId).show();
            			}
        			}else{
        				$('#adminViewEditLMSData').html(htmlContent)
        				if(controllType=='VIEW'){
        					$('#studentLmsContentForm .subjcheck').attr('disabled', true);
        					$("#lmsContentSave").hide();
        					$("#lmsContentAdd").hide();
        					$("#lmsContentAddNewUser").show();
        				}else if(controllType=='EDIT'){
        					$("#lmsContentSave").show();
        					$("#lmsContentAdd").hide();
        					$("#lmsContentAddNewUser").show();
        				}else{
        					$("#lmsContentAddNewUser").hide();
        					$("#lmsContentSave").hide();
        					$("#lmsContentAdd").show();
        				}
        			}
        		}
			}
		}
	});
}


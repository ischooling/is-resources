
function showManageProfileParentContentListingWithQueries(elementId, argument){
	console.log('DEFAULT_SEARCH_STATE: '+DEFAULT_SEARCH_STATE);
	var isDataTable = $.fn.dataTable.isDataTable('#'+elementId);
	console.log(elementId+ ' = ' +isDataTable);
	if(isDataTable){
		$('#'+elementId).dataTable().fnDestroy();
	}
	$('#'+elementId).DataTable( {
		"stateSave": true,
		"searching": true,
        "processing": true,
        "serverSide": true,
        "searching": true,
        "pageLength": 10,
        "stateLoadParams": function (settings, data) {
        	if (!DEFAULT_SEARCH_STATE) {
	            return false;
        	}
          },
        "ajax": {
            "url": CONTEXT_PATH+SCHOOL_UUID+"/dashboard/manage-profile-content-1/"+UNIQUEUUID+""+argument,
            "data": function ( data ) {
            	//console.log('data '+data)
            }
        },
        "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
        	$(nRow).find('td:eq(3)').css('text-align','left');
        	$(nRow).find('td:eq(4)').css('text-align','left');
        	$(nRow).find('td:eq(5)').css('text-align','left');
        	$('tr').addClass('success');
        },
        "columns": [
	         { "data": "sno", "name" : "sno", "title" : "S.No"  },
	         { "data": "name", "name" : "name" , "title" : "Parent Name"},
	         { "data": "userName", "name" : "userName" , "title" : "User Name"},
	         { "data": "studentProfile", "name" : "studentProfile" , "title" : "Student Details", 'text-align':'center'},
	         { "data": "profileStatus", "name" : "profileStatus" , "title" : "Profile Status", 'text-align':'center'},
	         { "data": "action", "name" : "action" , "title" : "Action", 'text-align':'center'},
         ],
	});
	$('#'+elementId).dataTable().fnSetFilteringEnterPress();
	bindHover();
}

function bindHover(){
	console.log('bindHover  called')
//	setTimeout(function(){
//		$('div.dropdown.tooltip-content1').hover(function() {
//			$(this).find('div.dropdown-menu').stop(true, true).delay(200).fadeIn(200);
//		}, function() {
//			$(this).find('div.dropdown-menu').stop(true, true).delay(200).fadeOut(200);
//		});
//	}, 1500);
}

function showManageProfileSchoolContentListingWithQueries(elementId, argument){
	console.log('DEFAULT_SEARCH_STATE: '+DEFAULT_SEARCH_STATE);
	var isDataTable = $.fn.dataTable.isDataTable('#'+elementId);
	console.log(elementId+ ' = ' +isDataTable);
	if(isDataTable){
		$('#'+elementId).dataTable().fnDestroy();
	}
	$('#'+elementId).DataTable( {
		"stateSave": true,
        "processing": true,
        "serverSide": true,
        "pagingType":"full",
        "searching": true,
        "pageLength": 10,
        "stateLoadParams": function (settings, data) {
        	if (!DEFAULT_SEARCH_STATE) {
	            return false;
        	}
          },
        "ajax": {
            "url": CONTEXT_PATH+SCHOOL_UUID+"/dashboard/manage-profile-content-1/"+UNIQUEUUID+""+argument,
            "data": function ( data ) {
            	//console.log('data '+data)
            }
        },
        "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
        	if (aData['viewProfile'] || aData['editProfile']){
        		$('td', nRow).css('text-align','left');
        	}
        	//$('#'+elementId+' tr:first').addClass('success');
        },
        "columns": [
	         { "data": "sno", "name" : "sno", "title" : "S.No"  },
	         { "data": "schoolName", "name" : "schoolName" , "title" : "School Name"},
	         { "data": "userName", "name" : "userName" , "title" : "User Name"},
	         { "data": "profileStatus", "name" : "profileStatus" , "title" : "Profile Status"},
	         { "data": "action", "name" : "action" , "title" : "Action"},
         ],
         /* drawCallback: function() {
     	    this.api().state.clear();
     	  } */
	});
	$('#'+elementId).dataTable().fnSetFilteringEnterPress();
}

function showManageProfileStudentContentListingWithQueries(elementId, argument){
	console.log('DEFAULT_SEARCH_STATE: '+DEFAULT_SEARCH_STATE);
	var isDataTable = $.fn.dataTable.isDataTable('#'+elementId);
	console.log(elementId+ ' = ' +isDataTable);
	if(isDataTable){
		$('#'+elementId).dataTable().fnDestroy();
	}
	console.log("referral");
	$('#'+elementId).DataTable( {
		"stateSave": true,
        "processing": true,
        "serverSide": true,
        "pagingType":"full",
        "searching": false,
        "pageLength": 10,
        "stateLoadParams": function (settings, data) {
        	if (!DEFAULT_SEARCH_STATE) {
	            return false;
        	}
          },
        "ajax": {
            "url": CONTEXT_PATH+SCHOOL_UUID+"/dashboard/manage-profile-content-1/"+UNIQUEUUID+""+argument,
            "data": function ( data ) {
            	//console.log('data '+data)
            }
        },
        "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
        	if (aData['paymentTypeApplicationFee'] || aData['parentProfile'] || aData['viewProfile']){
        		$('td', nRow).css('text-align','left');
        	}
        		if(aData['referralCode'].indexOf("N/A") != -1){}
        		else{
        			$(nRow).addClass('rowForCounselor');
        		}
        	$('#'+elementId+' tr:first').addClass('success');
        },
        "columns": [
	         { "data": "sno", "name" : "sno", "title" : "S.No"  },
	         { "data": "name", "name" : "name" , "title" : "Student Name"},
	         { "data": "userName", "name" : "userName" , "title" : "User Name"},
	         { "data": "standard", "name" : "standard" , "title" : "Grade"},
	         { "data": "profileStatus", "name" : "profileStatus" , "title" : "Profile Status"},
	         { "data": "referralCode", "name" : "referralCode" , "title" : "Counselor Name/Referral Code"},
	         { "data": "courseProviderName", "name" : "courseProviderName" , "title" : "LMS Platform 2"},
	         { "data": "action", "name" : "action" , "title" : "Action"},
         ],
        /*  drawCallback: function() {
        	    this.api().state.clear();
    	  } */
	});
	$('#'+elementId).dataTable().fnSetFilteringEnterPress();
}

function showManageProfileTeacherContentListingWithQueries(elementId, argument){
	console.log('DEFAULT_SEARCH_STATE: '+DEFAULT_SEARCH_STATE);
	var isDataTable = $.fn.dataTable.isDataTable('#'+elementId);
	console.log(elementId+ ' = ' +isDataTable);
	if(isDataTable){
		$('#'+elementId).dataTable().fnDestroy();
	}
	$('#'+elementId).DataTable( {
		"stateSave": true,
        "processing": true,
        "serverSide": true,
        "searching": true,
        "pageLength": 10,
        "stateLoadParams": function (settings, data) {
        	if (!DEFAULT_SEARCH_STATE) {
	            return false;
        	}
          },
        "ajax": {
            "url": CONTEXT_PATH+SCHOOL_UUID+"/dashboard/manage-profile-content-1/"+UNIQUEUUID+""+argument,
            "data": function ( data ) {
            	//console.log('data '+data)
            }
        },
        "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
        	$(nRow).find('td:eq(3)').css('text-align','left');
        	$(nRow).find('td:eq(4)').css('text-align','left');
        	$(nRow).find('td:eq(5)').css('text-align','left');
        	$(nRow).find('td:eq(6)').css('text-align','left');
        	$(nRow).find('td:eq(7)').css('text-align','left');
        	$('tr').addClass('success');
        },
        "columns": [
	         { data: "sno", title : "S.No"  },
	         { data: "name", title : "Teacher Name"},
	         { data: "userName", "name" : "userName" , "title" : "User Name"},
	         { data: "profileDescription", title : "Assigned Courses", 'text-align':'center'},
	         { data: "specialization", title : "Specialization", 'text-align':'center'},
	         { data: "profileStatus", title : "Profile Status", 'text-align':'center'},
	         { data: "downloadAgreement", title : "Agreement", 'text-align':'center'},
	         { data: "action", title : "Action", 'text-align':'center'},
         ],
	});
	$('#'+elementId).dataTable().fnSetFilteringEnterPress();
	bindHover();
}

function showManageProfileCommonContentListingWithQueriesWithoutGoto(elementId, argument){
	console.log('DEFAULT_SEARCH_STATE: '+DEFAULT_SEARCH_STATE);
	var isDataTable = $.fn.dataTable.isDataTable('#'+elementId);
	console.log(elementId+ ' = ' +isDataTable);
	if(isDataTable){
		$('#'+elementId).dataTable().fnDestroy();
	}
	console.log("referral");
	$('#'+elementId).DataTable( {
		"stateSave": true,
        "processing": true,
        "serverSide": true,
        "pagingType":"full",
        "searching": true,
        "pageLength": 10,
        "stateLoadParams": function (settings, data) {
        	if (!DEFAULT_SEARCH_STATE) {
	            return false;
        	}
          },
        "ajax": {
            "url": CONTEXT_PATH+UNIQUEUUID+"/"+"dashboard/user-list-content-1"+argument,
            "data": function ( data ) {
            }
        },
        "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
        	if (aData['paymentTypeApplicationFee'] || aData['parentProfile'] || aData['viewProfile']){
        		$('td', nRow).css('text-align','left');
        	}
        },
        "columns": [
	         { "data": "sno", "name" : "sno", "title" : "S.No"  },
	         { "data": "name", "name" : "name" , "title" : "Name"},
	         { "data": "userName", "name" : "userName" , "title" : "User Name"},
	         { "data": "roleName", "name" : "roleName" , "title" : "Role"},
	         { "data": "profileStatus", "name" : "profileStatus" , "title" : "Profile Status"},
	         { "data": "addedDate", "name" : "addedDate" , "title" : "Added Date"},
	         { "data": "action", "name" : "action" , "title" : "Action"},
         ],
	});
	$('#'+elementId).dataTable().fnSetFilteringEnterPress();
}

function showManageProfileCommonContentListingWithQueries(elementId, argument){
	console.log('DEFAULT_SEARCH_STATE: '+DEFAULT_SEARCH_STATE);
	var isDataTable = $.fn.dataTable.isDataTable('#'+elementId);
	console.log(elementId+ ' = ' +isDataTable);
	if(isDataTable){
		$('#'+elementId).dataTable().fnDestroy();
	}
	console.log("referral");
	$('#'+elementId).DataTable( {
		"stateSave": true,
        "processing": true,
        "serverSide": true,
        "searching": true,
        "pageLength": 10,
        "stateLoadParams": function (settings, data) {
        	if (!DEFAULT_SEARCH_STATE) {
	            return false;
        	}
          },
        "ajax": {
            "url": CONTEXT_PATH+UNIQUEUUID+"/"+"dashboard/user-list-content-1"+argument,
            "data": function ( data ) {
            }
        },
        "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
        	if (aData['paymentTypeApplicationFee'] || aData['parentProfile'] || aData['viewProfile']){
        		$('td', nRow).css('text-align','left');
        	}
        	$('#'+elementId+' tr:first').addClass('success');
        },
        "columns": [
	         { "data": "sno", "name" : "sno", "title" : "S.No"  },
	         { "data": "name", "name" : "name" , "title" : "Name"},
	         { "data": "userName", "name" : "userName" , "title" : "User Name"},
	         { "data": "roleName", "name" : "roleName" , "title" : "Role"},
	         { "data": "profileStatus", "name" : "profileStatus" , "title" : "Profile Status"},
	         { "data": "addedDate", "name" : "addedDate" , "title" : "Added Date"},
	         { "data": "action", "name" : "action" , "title" : "Action"},
         ],
	});
	$('#'+elementId).dataTable().fnSetFilteringEnterPress();
}


function advanceStudentSearch(formId, moduleId, themetype) {
	checkTextBox(formId);
	customLoader(true);
	hideMessage("");
	$.ajax({
	  type: "POST",
	  contentType: "application/json",
	  url: getURLForHTML("dashboard", "advance-student-search"),
	  data: JSON.stringify(
		getCallRequestForadvanceStudentSearch(formId, moduleId, themetype)
	  ),
	  dataType: "html",
	  async: true,
	  success: function (htmlContent) {
		if (htmlContent != "") {
		  var stringMessage = [];
		  stringMessage = htmlContent.split("|");
		  if (
			stringMessage[0] == "FAILED" ||
			stringMessage[0] == "EXCEPTION" ||
			stringMessage[0] == "SESSIONOUT"
		  ) {
			if (stringMessage[0] == "SESSIONOUT") {
			  redirectLoginPage();
			} else {
			  showMessage(true, stringMessage[1]);
			}
		  } else {
			$(".filter-fields").stop();
			$("#manageStudent").html(htmlContent);
		  }
		  customLoader(false);
		  return false;
		}
	  },
	});
  }
  
  function advanceTeacherSearch(formId, moduleId) {
	checkTextBox(formId);
	customLoader(true);
	const url = "advance-teacher-search/" + UNIQUEUUID;
	hideMessage("");
	$.ajax({
	  type: "POST",
	  contentType: "application/json",
	  url: getURLForHTML("dashboard", url),
	  data: JSON.stringify(
		getCallRequestForadvanceTeacherSearch(formId, moduleId)
	  ),
	  dataType: "json",
	  async: true,
	  success: function (data) {
		console.log(data);
		if (data.status === "success"){
		  $("#manageProfileTeacherContent").show();
		  let htmlContent = "";
		  $.each(data.manageProfileTeacher, function(index, value){
			htmlContent += 
			  '<tr>'
				+'<td>'+(index + 1)+'.</td>'
  
				+'<td>'
				  +value.applicationNo+'<br/>'
				  +value.name
				  +'<br/>'
				  +value.emailId
				  +'<br/>'
				  +value.contactNo
				  +'<br/>'
				  +value.cityName+ '/ ' + value.stateName + '/ ' + value.countryName
				  +'<br/>'
				  +value.timeZone + ' ' + value.timeOffSet
				  +'<br/>'
				+'</td>'
				
				+'<td>'
				  +value.employeeType
				+'</td>'
				+'<td>'
				+(value.assignCourseList > 0
				? '<a href="javascript:void(0);" onclick="return getTeacherSubjectList('+value.userId+');">'
					+'<i class="fa fa-eye"></i>'
					+'</a>'
				   : "N/A"
				)
				+'</td>'
  
				+'<td>'
				  +(value.specialization === "N/A"
					  ? "N/A"
					  : value.specialization.split(',')
						  .map(specialization => specialization.trim())
						  .filter(specialization => specialization.length > 0)
						  .join('<br>')
					)
				+'</td>'
  
				+'<td>'
				  +value.profileStatus
				+'</td>'
  
				+'<td style="text-align: left;">'
				  +(value.agreementUrlDownload === "N/A" && value.agreementUrlView === "N/A"
					  ? 'N/A'
					  : (value.agreementUrlDownload !== "N/A"
						  ? '<a href="' +value.agreementUrlDownload +'" target="_blank">'
							  +'<i class="fa fa-download"></i>'
							+'</a>'
						  : '')
						+(value.agreementUrlDownload !== "N/A" && value.agreementUrlView !== "N/A" ? ' | ' : '')
						+(value.agreementUrlView !== "N/A"
							? '<a href="' +value.agreementUrlView +'" target="_blank">'
								+'<i class="fa fa-eye"></i>'
							  +'</a>'
							: ''))
				+'</td>'
  
				+'<td>'
				  +'<div class="btn-group">'
					+'<button type="button" class="btn btn-danger dropdown-toggle  btn-sm" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="Action" style="background-color:#007fff !important;border-color:#007fff; box-shadow:none;"><i class="fa fa-ellipsis-v"></i></button>'
					+'<div class="dropdown-menu" x-placement="bottom-start">'
  
					  +'<a href="'+value.profileView+'" target="_blank" class="dropdown-item">'
						+'<i class="fa fa-eye">'
						+'</i>&nbsp;View Profile'
					  +'</a>'
					  +'<a href="javascript:void(0);" class="dropdown-item" onclick="return callUserActivity('+formId+','+value.userId+','+true+','+true+','+moduleId+');">'
						+'<i class="fa fa-cogs"></i>&nbsp;&nbsp;User Activity'
					  +'</a>'
					  +(value.batchReport === "N/A"
					  ? ""
					  : 
					  '<a href="'+value.batchReport+'" target="_blank" class="dropdown-item">'
						+'<i class="fa fa-eye"></i>&nbsp;View Batches'
					  +'</a>')
					  +(value.sendMail === "1" || value.sendMail ==="false"
					  ? ""
					  : '<a href="javascript:void(0);" class="dropdown-item" onclick="return sendEmailForCommon('+value.userId+');">'
						+'<i class="fa fa-envelope"></i>&nbsp;&nbsp;Send Email'
					  +'</a>')
					  +'<a href="'+value.userLogUrl+'" target="_blank" class="dropdown-item">'
						+'<i class="fa fa-eye"></i>&nbsp;Teacher Logs'
					  +'</a>'
					  +'<a href="'+value.spoofLink+'" class="dropdown-item">'
						+'<i class="bi bi-fingerprint"></i>View as Teacher'
					  +'</a>'
					+'</div>'
				  +'</div>'
				+'</td>'
  
			  +'</tr>'
		  });
		  $("#manageProfileTeacherContent").dataTable().fnDestroy();
		  $("#manageProfileTeacherContent tbody").html(htmlContent);
		  $('#manageProfileTeacherContent').dataTable();
		}else{
		  $("#manageProfileTeacherContent").show()
		  $("#manageProfileTeacherContent tbody").html('<tr class="odd"><td valign="top" colspan="9" class="dataTables_empty">No data available in table</td></tr>')
		}
	  },
	});
  }
  
  function getCallRequestForadvanceStudentSearch(formId, moduleId, themetype) {
	var request = {};
	var authentication = {};
	var studentDetailDTO = {};
	studentDetailDTO["moduleId"] = moduleId;
	studentDetailDTO["enrollType"] = $("#" + formId + " #filterEnrollType").val();
	if ($("#" + formId + " #filterEnrollType").val() == "ONE_TO_ONE_FLEX") {
	  studentDetailDTO["profileFor"] = "flexStudent";
	}
	if ($("#" + formId + " #filterEnrollType").val() == "BATCH") {
	  studentDetailDTO["profileFor"] = "batchStudent";
	} else {
	  studentDetailDTO["profileFor"] = "student";
	}
	studentDetailDTO["timZoneFrom"] = $(
	  "#" + formId + " #countryTimezoneFromId option:selected"
	).attr("data-timezone");
	studentDetailDTO["timZoneTo"] = $(
	  "#" + formId + " #countryTimezoneToId option:selected"
	).attr("data-timezone");
	studentDetailDTO["studentName"] = $("#" + formId + " #studName").val();
	studentDetailDTO["studentLastName"] = $("#" + formId + " #lastName").val();
	studentDetailDTO["standardId"] = $("#" + formId + " #filterStandardId").val();
	studentDetailDTO["schoolId"] = $("#" + formId + " #schoolId").val();
	studentDetailDTO["email"] = $("#" + formId + " #emailId").val();
	studentDetailDTO["contactNo"] = $("#" + formId + " #mobileNo").val();
	studentDetailDTO["academicYear"] = $("#" + formId + " #activeSession").val();
	studentDetailDTO["countryId"] = $("#" + formId + " #countryId").val();
	studentDetailDTO["stateId"] = $("#" + formId + " #filterStateId").val();
	studentDetailDTO["cityId"] = $("#" + formId + " #filterCityId").val();
	studentDetailDTO["enrollStatus"] = $(
	  "#" + formId + " #filterEnrollStatus"
	).val();
	studentDetailDTO["userClickFrom"] = $("#" + formId + " #userClickFrom").val();
	studentDetailDTO["lmsPlatform"] = $("#" + formId + " #filterLmsPlatform").val();
	studentDetailDTO["bookAnEnrollmentStatus"] = $("#" + formId + " #filterBookEnrollment").val();
	studentDetailDTO["page"] = $("#" + formId + " #page").val();
	studentDetailDTO["pageSize"] = $("#" + formId + " #pageSize").val();
	studentDetailDTO["applicationNo"] = $("#" + formId + " #applicationNo").val();
	studentDetailDTO["studentIdString"] = $("#" + formId + " #studentId").val();
	studentDetailDTO["studentIdString"] = $("#" + formId + " #studentId").val();
	studentDetailDTO["themetype"] = themetype;
	studentDetailDTO["schoolUUID"] = SCHOOL_UUID;
	request["studentDetailDTO"] = studentDetailDTO;
	authentication["hash"] = getHash();
	authentication["userType"] = "SCHOOL";
	authentication["schoolId"] = SCHOOL_ID;
	authentication["schoolUUID"] = SCHOOL_UUID;
	authentication["userId"] = USER_ID;
	request["authentication"] = authentication;
	return request;
  }
  
  function getCallRequestForadvanceTeacherSearch(formId, moduleId) {
	var request = {};
	var authentication = {};
	var teacherDetailsDTO = {};
	teacherDetailsDTO["moduleId"] = moduleId;
	// teacherDetailsDTO["assignedCourses"] = $(
	//   "#" + formId + " #filterAssignedCourses"
	// ).val();
	// if ($("#" + formId + " #filterAssignedCourses").val() == "Y") {
	//   teacherDetailsDTO["profileFor"] = "teacher";
	// }
	// else {
	//   teacherDetailsDTO["profileFor"] = "teacher";
	// }
	teacherDetailsDTO["themetype"]="theme2";
	teacherDetailsDTO["timZoneFrom"] = $("#" + formId + " #teacherCountryTimezoneFromId option:selected").attr("data-timezone");
	teacherDetailsDTO["timZoneTo"] = $("#" + formId + " #teacherCountryTimezoneToId option:selected").attr("data-timezone");
	teacherDetailsDTO["teacherName"] = $("#" + formId + " #teacherName").val();
	teacherDetailsDTO["schoolId"] = $("#" + formId + " #schoolId").val();
	teacherDetailsDTO["email"] = $("#" + formId + " #emailId").val();
	teacherDetailsDTO["contactNo"] = $("#" + formId + " #mobileNo").val();
	teacherDetailsDTO["academicYear"] = $("#" + formId + " #activeSession").val();
	teacherDetailsDTO["countryId"] = $("#" + formId + " #teacherCountryId").val();
	teacherDetailsDTO["stateId"] = $("#" + formId + " #teacherFilterStateId").val();
	teacherDetailsDTO["cityId"] = $("#" + formId + " #teacherFilterCityId").val();
	teacherDetailsDTO["applicationNo"] = $("#" + formId + " #applicationNo").val();
	teacherDetailsDTO["enrollStatus"] = $("#" + formId + " #filterEnrollStatus").val();
	teacherDetailsDTO["employeeType"] = $( "#" + formId + " #filterEmployeeType").val();
	teacherDetailsDTO["userClickFrom"] = $( "#" + formId + " #userClickFrom").val();
	teacherDetailsDTO["page"] = $("#" + formId + " #page").val();
	teacherDetailsDTO["pageSize"] = $("#" + formId + " #pageSize").val();
	teacherDetailsDTO["schoolUUID"] = SCHOOL_UUID;
	request["teacherDetailsDTO"] = teacherDetailsDTO;
	authentication["hash"] = getHash();
	authentication["userType"] = "SCHOOL";
	authentication["schoolId"] = SCHOOL_ID;
	authentication["schoolUUID"] = SCHOOL_UUID;
	authentication["userId"] = USER_ID;
	request["authentication"] = authentication;
	return request;
  }
  
  function advanceStudentSearchReset(formId) {
	$("#" + formId)[0].reset();
	$("#" + formId + " #schoolId")
	  .val(SCHOOL_ID)
	  .trigger("change");
	$("#" + formId + " #filterEnrollStatus")
	  .val("")
	  .trigger("change");
	$("#" + formId + " #countryTimezoneFromId")
	  .val("")
	  .trigger("change");
	$("#" + formId + " #countryTimezoneToId")
	  .val("")
	  .trigger("change");
	$("#" + formId + " #filterStandardId")
	  .val("")
	  .trigger("change");
	$("#" + formId + " #studName").val("");
	$("#" + formId + " #emailId").val("");
	$("#" + formId + " #mobileNo").val("");
	$("#" + formId + " #countryId")
	  .val("")
	  .trigger("change");
	$("#" + formId + " #filterStateId")
	  .val("")
	  .trigger("change");
	$("#" + formId + " #filterCityId")
	  .val("")
	  .trigger("change");
  }
  
  function advanceTeacherSearchReset(formId) {
	$("#" + formId)[0].reset();
	$("#" + formId + " #schoolId")
	  .val(SCHOOL_ID)
	  .trigger("change");
	$("#" + formId + " #filterEnrollStatus").val("");
	$("#" + formId + " #filterEmployeeType").val("");
	// $("#" + formId + " #filterAssignedCourses")
	//   .val("")
	//   .trigger("change");
	$("#" + formId + " #teacherCountryTimezoneFromId")
	  .val("")
	  .trigger("change");
	$("#" + formId + " #teacherCountryTimezoneToId")
	  .val("")
	  .trigger("change");
	$("#" + formId + " #TeacherName").val("");
	$("#" + formId + " #emailId").val("");
	$("#" + formId + " #mobileNo").val("");
	$("#" + formId + " #teacherCountryId")
	  .val("")
	  .trigger("change");
	$("#" + formId + " #teacherFilterStateId")
	  .val("")
	  .trigger("change");
	$("#" + formId + " #teacherFilterCityId")
	  .val("")
	  .trigger("change");
  }
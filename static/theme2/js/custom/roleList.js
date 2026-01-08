
function getAllRolesList(updated, currentPage, firstTimeCall) {
  if(!getSession()){
		redirectLoginPage();
    return false;
	}

	data={};
	data['schoolId']=SCHOOL_ID;
    data['currentPage']=currentPage;
    data['moduleSearch']=$("#moduleSearch").val();
	$.ajax({
			type : "POST",
			contentType : APPLICATION_JSON_VALUE,
			url : getURLForHTML('dashboard', 'get-roles-list'),
			data : JSON.stringify(data),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			success : function(data) {
                //console.log('get-modules-list data :: ' + data);
              
                if (data['status'] == '0' || data['status'] == '2') {
                    showMessageTheme2(0, data['message']);
                } else {

                    var rolesList=data.rolesList;
                    var html =getRoleTableHtml(rolesList, updated);
                    $("#roleListbody").html(html); 
                
                    var htmlpage=dataRolePagging(data, updated);
                    $(".rolepaging").html(htmlpage);
                    
                }
                
			}
	   });
   }


  function getRoleTableHtml(rolesList, updated){
      var html='';
      var ti=0;
      for (let m = 0; m < rolesList.length; m++) {
          const role = rolesList[m];
          html+=`<tr>	
              <td>${(role.srno)}</td>
              <td>${role.roleName}</td>
              <td>${role.parentRole!=''?role.parentRole:'N/A'}</td>
              <td>${role.countUser}</td>
              <td class="text-center">`;
                if(updated=='Y'){
                  html+= 
                  `<a href="javascript:void(0);" class="btn btn-primary btn-sm" onclick="callRoleEdit('roleFormId', '${role.roleId}');">
                      <i class="fa fa-edit" title="Edit"></i>
                  </a>`;
                }
              html+=`</td>
          </tr>`;
      }
      return html;
   }



function callRoleCreate(formId, moduleId) {
  hideMessageTheme2("");
  if (!validateRequestForNewRole(formId, moduleId)) {
    return false;
  }
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForHTML("dashboard", "submit-role"),
    data: JSON.stringify(getRequestForNewRole(formId, moduleId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessageTheme2(0, data["message"]);
      } else {
        showMessageTheme2(1, data["message"]);
        $("#" + formId)[0].reset();
        $("#roleFormModal").modal("hide");
        // $(".modal-backdrop").remove();
        // $("body").removeClass("modal-open");
        getAllRolesList(ROLE_MODULE.updated, 0, false);
      }
      return false;
    }
  });
}

function getRequestForNewRole(formId, moduleId) {
  var request = {};
  var authentication = {};
  var roleDTO = {};
  roleDTO["roleId"] = $("#" + formId + " #roleId").val();
  roleDTO["roleName"] = $("#" + formId + " #roleName").val();
  roleDTO["parentId"] = $("#" + formId + " #parentRole").val();
  roleDTO["activated"] = $("#" + formId + " #roleActive").val();
  roleDTO["schoolId"] = $("#" + formId + " #schoolId").val();

  request["roleDTO"] = roleDTO;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = moduleId;
  authentication["userId"] = USER_ID;
  request["authentication"] = authentication;
  return request;
}

function validateRequestForNewRole(formId, moduleId) {
  if (
    $("#" + formId + " #roleName").val() == 0 ||
    $("#" + formId + " #roleName").val() == ""
  ) {
    showMessageTheme2(0, "Role type is required.");
    return false;
  }


  if (
    $("#" + formId + " #roleActive").val() == undefined ||
    $("#" + formId + " #roleActive") == ""
  ) {
    showMessageTheme2(0, " Role active is required.");
    return false;
  }
  return true;
}

function callRoleEdit(formId, moduleId) {
  var result = "";
  hideMessage("");

  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForHTML("dashboard", "role-edit"),
    data: JSON.stringify(getCallRequestForRoleEdit(formId, moduleId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    async: false,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
          result = true;
      } else {
        var roleDTo=JSON.parse(data.roleDTO);
        getFormFillRole(formId, roleDTo);
        $("#roleFormModal").modal("show");
       // getAllRolesList(ROLE_MODULE.updated, 0, false);

      }
    }
  });
  return result;
}

function getCallRequestForRoleEdit(formId, roleId) {
  var request = {};
  var authentication = {};
  var requestData = {};
  request["requestKey"] = "ROLE-EDIT";
  request["requestValue"] = roleId;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = "SCHOOL";
  authentication["userId"] = USER_ID;
  request["authentication"] = authentication;
  return request;
}

function getFormFillRole(formId, roleDTO) {
  $("#" + formId + " #roleId").val(roleDTO.roleId);
  $("#" + formId + " #schoolId").val(roleDTO.schoolId);
  $("#" + formId + " #roleName").val(roleDTO.roleName);
  $("#" + formId + " #parentRole").val(roleDTO.parentId);
  $("#" + formId + " #roleActive").val(roleDTO.activated);
}

function getRequestForRole(formId, key, value) {
  var request = {};
  var authentication = {};
  var requestData = {};
  requestData["requestKey"] = key;
  requestData["requestValue"] = SCHOOL_ID;
 
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = "COMMON";
  request["authentication"] = authentication;
  request["requestData"] = requestData;
  return request;
}

function callRoleDropdown(formId, value, elementId) {
	hideMessageTheme2('');
	customLoader(false);
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForCommon('masters'),
		data: JSON.stringify(getRequestForRole(formId, 'ROLES-LIST', value)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message']);
			} else {
				//console.log(data['mastersData']['data']);
				result = data['mastersData']['data'];
				dropdown = $("#"+formId+" #"+elementId);
				dropdown.html('');
				dropdown.append('<option value="0">Select Role</option>');
				$.each(result, function (k, v) {
					dropdown.append('<option value="' + v.key + '">' + v.value + '</option>');
				});
				//buildDropdown(data['mastersData']['data'], 0, 'Select Status');
			}
		}
	});
}

function callSchoolDropdown(formId, elementId) {
	var offlineSchoolLis=schoolList.schoolList
	var dropdown = $("#"+formId+" #"+elementId);
	dropdown.html('');
	dropdown.append('<option value="0">Select School</option>');
	$.each(offlineSchoolLis, function (k, v) {
		dropdown.append('<option value="' + v.schoolId + '" '+(v.schoolId==SCHOOL_ID?'selected':'')+'>' + v.schoolName + '</option>');
	});
}

function roleFormContentModal(){
		$('#roleFormModal #moduleName').val('');
		$('#roleFormModal #pageLink').val('');
		$('#roleFormModal #moduleIcon').val('');
		$('#roleFormModal #moduleType').val('');
		$('#roleFormModal #parentModule').val('');
		$('#roleFormModal #orderSet').val('');
		$('#roleFormModal #moduleActive').val('');
		$("#roleFormModal #roleActive").val('Y')
		$('#roleFormModal').modal('show');
	}

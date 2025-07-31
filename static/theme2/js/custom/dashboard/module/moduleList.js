
function getAllModulesList(updated, currentPage, firstTimeCall) {
	if(!getSession()){
		redirectLoginPage();
    return false;
	}
  data={};
	data['schoolId']=SCHOOL_ID;
  data['currentPage']=currentPage;
  data['moduleSearch']=$("#moduleSearch").val();
  data['userId']=USER_ID;
	$.ajax({
			type : "POST",
			contentType : APPLICATION_JSON_VALUE,
			url : getURLForHTML('dashboard', 'get-modules-list'),
			data : JSON.stringify(data),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			success : function(data) {
                //console.log('get-modules-list data :: ' + data);
              
                if (data['status'] == '0' || data['status'] == '2') {
                  if(data['statusCode'] == "SESSIONOUT"){
                      redirectLoginPage();
                    }else{
                      showMessageTheme2(0, data['message']);
                    }
                } else {

                    var moduleList=data.moduleList;
                    var html =getModuleTableHtml(moduleList, updated);
                    $("#moduleListbody").html(html); 
                
                    var htmlpage=dataPagging(data, updated);
                    $(".modulepaging").html(htmlpage);
                    
                    $("#orderSet").val(data.moduleOrderNumber);
                }
                
			}
	   });
   }


function getModuleTableHtml(moduleList, updated){
  var html='';
  var ti=0;
  for(let m = 0; m < moduleList.length; m++) {
    const module = moduleList[m];
    html+=
    `<tr>	
      <td class="`+(moduleList.length == (m+1)? 'rounded-bottom-left-10':'')+`">${(module.srno)}</td>
      <td class="text-center">
        <i class="${module.moduleIcon} font-size-xlg"></i>
      </td>
      <td>${module.moduleName}</td>
      <td>${module.pageLink}</td>
      <td>${module.parentModule}</td>
      <td>${module.orderSet}</td>
      <td class="text-center">
        <span class="${module.activated !='N' ? 'mb-2 mr-2 badge badge-pill badge-success' : 'mb-2 mr-2 badge badge-pill badge-danger'} " >${module.activated=='Y'?'Active': 'inActive'}   </span>
      </td>
      <td class="text-center `+(moduleList.length == (m+1)? 'rounded-bottom-right-10':'')+`">`
        if(ROLE_MODULE.updated=='Y'){
          html+=
          ` <a href="javascript:void(0);" class="btn btn-primary btn-sm" onclick="callModuleEdit('moduleFormModal', '${module.moduleId}');">
              <i class="fa fa-edit"  title="Edit"></i>
            </a>`;
        }
      html+=`</td>
    </tr>`;
  }
  return html;
}


function callModuleCreate(formId, moduleId, roleModuleId) {
  hideMessageTheme2("");
  if (!validateRequestForNewModule(formId, moduleId)) {
    return false;
  }
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForHTML("dashboard", "submit-module"),
    data: JSON.stringify(getRequestForNewModule(formId, moduleId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessageTheme2(0, data["message"], "", true);
      }else {
        showMessageTheme2(1, data["message"], "", true);
        $("#" + formId)[0].reset();
        $("#moduleFormModal").modal("hide");
        getAllModulesList(ROLE_MODULE.updated, 0, false);
       
        //$(".modal-backdrop").remove();
        //$("body").removeClass("modal-open");
      }
      return false;
    }
  });
}

function getRequestForNewModule(formId, moduleId) {
  var request = {};
  var authentication = {};
  var requestData = {};
  var modulesRequest = {};
  modulesRequest["moduleId"] = $("#" + formId + " #moduleId").val();
  modulesRequest["moduleName"] = $("#" + formId + " #moduleName").val();
  modulesRequest["pageLink"] = $("#" + formId + " #pageLink").val();
  modulesRequest["moduleIcon"] = $("#" + formId + " #moduleIcon").val();
  modulesRequest["moduleType"] = $("#" + formId + " #moduleType").val();
  modulesRequest["parentId"] = $("#" + formId + " #parentModule").val();
  modulesRequest["orderSet"] = $("#" + formId + " #orderSet").val();
  modulesRequest["activated"] = $("#" + formId + " #moduleActive").val();

  request["modulesRequest"] = modulesRequest;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = moduleId;
  authentication["userId"] = USER_ID;
  request["authentication"] = authentication;
  return request;
}

function validateRequestForNewModule(formId, moduleId) {
  if (
    $("#" + formId + " #moduleName").val() == 0 ||
    $("#" + formId + " #moduleName").val() == ""
  ) {
     showMessageTheme2(0, "Module name is required.", "", true);
    return false;
  }

  if ($("#" + formId + " #pageLink").val() == "") {
    showMessageTheme2(0, "Page link is required.", "", true);
    return false;
  }
  if (
    $("#" + formId + " #moduleType").val() == 0 ||
    $("#" + formId + " #moduleType").val() == ""
  ) {
    showMessageTheme2(0, "Module type is required.", "", true);
    return false;
  }

  if ($("#" + formId + " #moduleType").val() == "M") {
    if (
      $("#" + formId + " #moduleIcon").val() == 0 ||
      $("#" + formId + " #moduleIcon").val() == ""
    ) {
    showMessageTheme2(0, "Module icon is required.", "", true);
      return false;
    }
  }

  if ($("#" + formId + " #parentModule").val() == "") {
    showMessageTheme2(0, "Module parent is required.", "", true);
    return false;
  }

  //	if($('#'+formId+' #orderSet').val()==0 || $('#'+formId+' #orderSet').val()==''){
  //		showMessage(true, 'Module order is required.');
  //		return false;
  //	}

  if ($("#" + formId + " #moduleActive").val() == undefined ||
    $("#" + formId + " #moduleActive") == ""
  ) {
    showMessageTheme2(0, " Module active is required.");
    
    return false;
  }
  return true;
}

function callModuleEdit(formId, moduleId) {
  var result = "";
  hideMessage("");

  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForHTML("dashboard", "module-edit"),
    data: JSON.stringify(getCallRequestForModuleEdit(formId, moduleId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    async: false,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        result = true;
      } else {
        getFormFillModule(formId, data.modulesDTO);
        $("#moduleFormModal").modal("show");

        //showMessage(true, "Email doesn't exist");
        //result=false;
      }
    }
  });
  return result;
}

function getCallRequestForModuleEdit(formId, moduleId) {
  var request = {};
  var authentication = {};
  request["requestKey"] = "MODULE-EDIT";
  request["requestValue"] = moduleId;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = "SCHOOL";
  authentication["userId"] = USER_ID;
  request["authentication"] = authentication;
  return request;
}

function getFormFillModule(formId, modulesDTO) {
var modules = JSON.parse(modulesDTO); 
  $("#" + formId + " #moduleId").val(modules.moduleId);
  $("#" + formId + " #moduleName").val(modules.moduleName);
  $("#" + formId + " #pageLink").val(modules.pageLink);
  $("#" + formId + " #moduleIcon").val(modules.moduleIcon);
  $("#" + formId + " #moduleType").val(modules.moduleType);
  $("#" + formId + " #parentModule").val(modules.parentId).trigger('change');
  $("#" + formId + " #orderSet").val(modules.orderSet);
  $("#" + formId + " #moduleActive").val(modules.activated);
}

function getRequestForModule(formId, key, value) {
  var request = {};
  var authentication = {};
  var requestData = {};
  requestData["requestKey"] = key;
  requestData["requestValue"] = value;
 
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = "COMMON";
  request["authentication"] = authentication;
  request["requestData"] = requestData;
  return request;
}

function callModuleDropdown(formId, value, elementId) {
	hideMessageTheme2('');
	customLoader(false);
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForCommon('masters'),
		data: JSON.stringify(getRequestForModule(formId, 'MODULE-LIST', value)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(true, data['message']);
			} else {
				//console.log(data['mastersData']['data']);
				result = data['mastersData']['data'];
				dropdown = $("#"+formId+" #"+elementId);
				dropdown.html('');
				dropdown.append('<option value="0">Select Parent Module</option>');
				$.each(result, function (k, v) {
					dropdown.append('<option value="' + v.key + '">' + v.value + '</option>');
				});
				//buildDropdown(data['mastersData']['data'], 0, 'Select Status');
			}
		}
	});
}

function getB2CListHeaderContent(roleAndModule, objRights) {
  var html = '<div class="row">';
  if(USER_ROLE != "B2B_PARTNER"){
    html +=
      '<div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 order-md-2 text-right">';
    html +=
      '<button class=" btn btn-primary  text-white  btn-full-mobile mb-2 mr-2" onclick="getWatiTemplates()" >Wati Broadcast</button>';
    html +=
        '<button class=" btn btn-focus text-white btn-full-mobile mb-2" onclick="getEmailTemplates(\'B2C\')" >Email Broadcast</button>';
    html += "</div>";
  }
  html += '<div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">';
  if (objRights.discardPermission) {
    if (roleAndModule.added == "Y") {
      html +=
        '<form id="leadUploadId" name="leadUploadId" action="javascript:void(0);"  >';
      html +=
        '<input type="hidden" name="userId" id="userId" value="'+USER_ID+'">';
      html += '<div class="row align-items-center" id="leadUploadId">';
      html += '<div class="ml-3">';
      html += '<div class="file-upload">';
      html += '<div class="file-select">';
      html +=
        '<div class="file-select-button" id="fileupload1Label">Choose File</div>';
      html +=
        '<div class="file-select-name" id="fileupload1ChoosenFile">No file chosen...</div>';
      html += '<input type="file" name="fileupload1" id="fileupload1">';
      html += "</div>";
      html += "</div>	";
      html += "</div>";
      html += '<div class="ml-3 text-left">';
      html +=
        '<button type="submit" class="btn btn-primary" id="uploadLeadCSV" onclick="return uploadLeads(\'leadUploadId\');">Upload Leads</button>	';
      html += "</div>";
      html += "</div>";
      html += "</form>	";
    }
  }
  html += "</div>";
  html +=
    '<div class="col-lg-12 col-md-12 col-sm-12 col-12 order-lg-6 mb-3 text-right">';
  html +=
    '<div class="d-flex justify-content-end align-items-center" style="gap:6px;">';
  if (roleAndModule.added == "Y") {
    if(USER_ROLE != "B2B_PARTNER"){
        html += '<b class="schoolDemoUrlAutoCounselor text-success"></b>';
      html +=
        '<input class="tinyUrl" type="hidden" id="school-demo-auto-counselor-url" value="' +
        objRights.schoolDemoUrlAutoCounselor +
        '" style="opacity:0;height:0px">';
      html +=
        '<button class=" btn btn-primary  text-white  btn-full-mobile mb-1" onclick="copyURL(\'school-demo-auto-counselor-url\', \'schoolDemoUrlAutoCounselor\')"  id="schoolDemoUrl">New Demo with auto counselor</button>';
    }
  }
  if (roleAndModule.added == "Y") {
    if(USER_ROLE != "B2B_PARTNER"){
      html += '<b class="schoolDemoUrl text-success d-none"></b>';
      html +=
        '<input class="tinyUrl" type="hidden" id="common-school-demo-url" value="' +
        objRights.schoolDemoUrl +
        '" style="opacity:0;height:0px">';
      html +=
        '<button class=" btn btn-primary  text-white  btn-full-mobile mb-1" onclick="copyURL(\'common-school-demo-url\', \'schoolDemoUrl\')"  id="schoolDemoUrl">Add New Demo</button>';
    }
  }
  if (roleAndModule.added == "Y") {
    if(USER_ROLE != "B2B_PARTNER"){
      html +=
        '<button class=" btn btn-primary  text-white  btn-full-mobile mb-1"  id="addNewCampaign">Campaign List</button>';
    }
  }
  if (roleAndModule.added == "Y") {
    html +=
      '<button class=" btn btn-warning  text-white  btn-full-mobile mb-1"  id="addLead">Add New Leads</button>';
  }
  //if(USER_ROLE == 'DIRECTOR' || USER_ROLE == 'LEAD_MANAGER' || USER_ROLE == 'LEAD_MANAGER_PAYMENT' || objRights.feedbackPermission==false || objRights.defaultUserId==USER_ID){
  if(objRights.leadMovePermission){
    html +=
      '<button class=" btn btn-danger  text-white btn-full-mobile mb-1" id="moveNewLead">Move Lead</button> ';
  }
  if (roleAndModule.updated == "Y") {
    html +=
      '<button class=" btn btn-focus text-white btn-full-mobile mb-1" id="mergeLead">Merge Lead</button> ';
  }
  if (USER_ROLE == "DIRECTOR") {
    html +=
      '<button class=" btn btn-success text-white mt-lg-1 btn-full-mobile mb-1" id="exportLead">Excel Export</button> ';
  }
  html += "</div>";
  html += "</div>";
  html += "</div>";
  html +=
    '<div class="full px-2 mt-2 mb-3 rounded-10 flex-column" style="background-color: #eee;box-shadow: inset 0px 4px 8px rgba(0, 0, 0, 0.2);" id="b2c-total-head">';
  html += '<div class="mt-3 d-flex" style="font-size:11px;gap:6px;">';
  html += `<div class="d-flex justify-content-between align-items-center w-100" style="background-color: #C6E2FF;border-radius: 5px;padding: 5px 10px;font-weight: bold;border: 1.5px solid #027FFF">
				<p class="mb-0">Total Lead | Today\'s Lead</p>
				<p id="totalTodayLeads" class="mb-0 text-white bg-primary px-2 rounded">- | -</p>
			</div>`;
      if(USER_ID != "19321" && USER_ID != "14388"){
        html+=
        `<div class="d-flex justify-content-between align-items-center w-100" style="background-color: #FFFFDE;border-radius: 5px;padding: 5px 10px;font-weight: bold;border: 1.5px solid #d4d481">
          <p class="mb-0">Facebook Total Lead | Today\'s Lead</p>
          <p id="fbTotalTodayLeads" class="mb-0 text-dark px-2 rounded" style="background-color:#F3F39E;">- | -</p>
			  </div>`;
      }
			
			html+=`<div class="d-flex justify-content-between align-items-center w-100" style="background-color: #FFF5DC;border-radius: 5px;padding: 5px 10px;font-weight: bold;border: 1.5px solid #d4d481">
				<p class="mb-0">Today\'s Follow-ups</p>
				<p id="todayFollowup" class="mb-0 px-2 rounded text-dark" style="background-color:#EFD597;">-</p>
			</div>
			<div class="d-flex justify-content-between align-items-center w-100" style="background-color: #D5E3FC;;border-radius: 5px;padding: 5px 10px;font-weight: bold;border: 1.5px solid #4267B2">
				<p class="mb-0">Today\'s School Demo</p>
				<p id="todaySchoolDemo" class="mb-0 px-2 rounded text-white" style="background-color:#4267B2;">-</p>
			</div>`;
  if (objRights.discardPermission) {
    html += `<div class="d-flex justify-content-between align-items-center w-100" style="background-color: #DADADA;border-radius: 5px;padding: 5px 10px;font-weight: bold;border: 1.5px solid #898989">
					<p class="mb-0">Unassigned Lead</p>
					<p id="unassignedLeads" class="mb-0 text-white px-2 rounded" style="background-color:#898989;">-</p>
				</div>`;
  }
  html += `<div class="d-flex justify-content-between align-items-center w-100" style="background-color: #FFF6DC;border-radius: 5px;padding: 5px 10px;font-weight: bold;border: 1.5px solid #EFD597">
				<p class="mb-0">Followup Lead</p>
				<p id="followupLeadsCount" class="mb-0 px-2 rounded text-dark" style="background-color:#EFD597;">-</p>
			</div>`;
  html += "</div>";
  html += `<div class="mt-2 d-flex" style="font-size:11px;gap:6px;">
        <div class="d-flex justify-content-between align-items-center w-100" style="background-color: #DADADA;border-radius: 5px;padding: 5px 10px;font-weight: bold;border: 1.5px solid #898989">
				<p class="mb-0">Unattended Lead</p>
				<p id="unattendedLeads" class="mb-0 text-white px-2 rounded" style="background-color:#898989;">-</p>
			</div>
			<div class="d-flex justify-content-between align-items-center w-100" style="background-color: #D5E3FC;border-radius: 5px;padding: 5px 10px;font-weight: bold;border: 1.5px solid #4267B2">
				<p class="mb-0">Total School Demo</p>
				<p id="totalSchoolDemo" class="mb-0 px-2 rounded text-white" style="background-color:#4267B2;">-</p>
			</div>
			<div class="d-flex justify-content-between align-items-center w-100" style="background-color: #FFFFDE;border-radius: 5px;padding: 5px 10px;font-weight: bold;border: 1.5px solid #d4d481">
				<p class="mb-0">School Demo Complete</p>
				<p id="completeLeads" class="mb-0 px-2 rounded text-dark" style="background-color:#F3F39E;">-</p>
			</div>
			<div class="d-flex justify-content-between align-items-center w-100" style="background-color: #E0FFBF;border-radius: 5px;padding: 5px 10px;font-weight: bold;border: 1.5px solid #96E640">
				<p class="mb-0">Positive To Enrollment</p>
				<p id="positiveToEnrollment" class="mb-0 px-2 rounded text-dark" style="background-color:#96E640;">-</p>
			</div>
			<div class="d-flex justify-content-between align-items-center w-100" style="background-color: #ffe5c5;border-radius: 5px;padding: 5px 10px;font-weight: bold;border: 1.5px solid #e65e12">
				<p class="mb-0">Move Lead</p>
				<p id="moveLeadsCount" class="mb-0 text-white px-2 rounded" style="background-color:#e65e12;">-</p>
			</div>
			<div class="d-flex justify-content-between align-items-center w-100" style="background-color: #FFE3E2;border-radius: 5px;padding: 5px 10px;font-weight: bold;border: 1.5px solid #FF0005">
				<p class="mb-0">Scrape</p>
				<p id="scrapeLeadsCount" class="mb-0 text-white px-2 rounded" style="background-color:#FF0005;">-</p>
			</div>`;

  html += "</div>";
  html += `<div class="mt-2 d-flex" style="font-size:11px;gap:6px;">
        <div class="d-flex justify-content-between align-items-center w-100" style="background-color: #edf3ee;border-radius: 5px;padding: 5px 10px;font-weight: bold;border: 1.5px solid #1EC749">
				<p class="mb-0">Urgent</p>
				<p id="urgentLeads" class="mb-0 px-2 rounded bg-success">-</p>
			</div>
			<div class="d-flex justify-content-between align-items-center w-100" style="background-color: #edf3ee;border-radius: 5px;padding: 5px 10px;font-weight: bold;border: 1.5px solid #F8B824">
				<p class="mb-0">Important</p>
				<p id="importantLeads" class="mb-0 px-2 rounded bg-warning">-</p>
			</div>
			<div class="d-flex justify-content-between align-items-center w-100" style="background-color: #f8ece5;border-radius: 5px;padding: 5px 10px;font-weight: bold;border: 1.5px solid #ff9433">
				<p class="mb-0">Normal</p>
				<p id="normalLeads" class="mb-0 px-2 rounded bg-orange">-</p>
			</div>`;
  html += "</div>";

  html += '<hr class="w-100">';
  html += '<div class="d-flex align mb-3" style="font-size:11px;gap:20px;">';
  html += `<div class="d-flex justify-content-between align-items-center w-100" style="border-bottom:2px solid #1EC749;padding: 5px 10px;font-weight: bold;">
				<p class="mb-0" style="color:#1EC749">Hot</p>
				<p id="hotLeadsCount" class="mb-0 text-white px-2 rounded" style="background-color:#1EC749;">-</p>
			</div>
			<div class="d-flex justify-content-between align-items-center w-100" style="border-bottom:2px solid #F8B824;padding: 5px 10px;font-weight: bold;">
				<p class="mb-0" style="color:#F8B824">Warm</p>
				<p id="warmLeadsCount" class="mb-0 text-white px-2 rounded" style="background-color:#F8B824;">-</p>
			</div>
			<div class="d-flex justify-content-between align-items-center w-100" style="border-bottom:2px solid #0279FD;padding: 5px 10px;font-weight: bold;">
				<p class="mb-0" style="color:#0279FD">Cold</p>
				<p id="coldLeadsCount" class="mb-0 text-white px-2 rounded" style="background-color:#0279FD;">-</p>
			</div>`;
      if(USER_ID != "19321" && USER_ID != "14388"){
        html+=
        `<div class="d-flex justify-content-between align-items-center w-100" style="border-bottom:2px solid #7000FF;padding: 5px 10px;font-weight: bold;">
          <p class="mb-0" style="color:#7000FF">Demo By Website</p>
          <p id="demoByWebsiteCount" class="mb-0 text-white px-2 rounded" style="background-color:#7000FF;">-</p>
        </div>`;
      }
			html+=`<div class="d-flex justify-content-between align-items-center w-100" style="border-bottom:2px solid #0051FF;padding: 5px 10px;font-weight: bold;">
				<p class="mb-0" style="color:#0051FF">Demo By Link</p>
				<p id="demoByLinkCount" class="mb-0 text-white px-2 rounded" style="background-color:#0051FF;">-</p>
			</div>`;
      if(USER_ID != "19321" && USER_ID != "14388"){
        html+=
        `<div class="d-flex justify-content-between align-items-center w-100" style="border-bottom:2px solid #686868;padding: 5px 10px;font-weight: bold;">
          <p class="mb-0" style="color:#686868">Assigned to Lead Manager</p>
          <p id="assignedToLeadManagerCount" class="mb-0 text-white px-2 rounded" style="background-color:#686868;">-</p>
        </div>`;
      }
		
  html += "</div>";
  html += "</div>";

  html += '<div class="full overflow-x-auto" id="b2c-lead-list"></div>';
  html += '<div id="supportHtmlChats"></div>';
  return html;
}

function getLeadFormPopup(objRights) {
  var html = "";
  html +=
    '<div id="leadPopupForm" class="modal fade bd-example-modal-lg fade-scale" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">' +
    '<div class="modal-dialog modal-xl">' +
    '    <div class="modal-content border-0">' +
    '        <div class="modal-header py-2 bg-primary text-white">' +
    '            <h5 class="modal-title" id="leadFormText">Update Lead</h5>' +
    '            <button type="button" class="close text-white" onClick="resetLeadUpdate()" aria-label="Close">' +
    '                <span aria-hidden="true">&times;</span>' +
    "            </button>" +
    "        </div>" +
    '        <div class="modal-body">' +
    '            <form class="col-lg-12 col-md-12 col-ms-12 col-12 pt-2 pb-2" method="post" action="javascript:void(0);" id="leadDataPopupForm">' +
    '              <input type="hidden" name="leadId" id="leadId" value="" />' +
    '              <input type="hidden" name="parentleadId" id="parentleadId" value="" />' +
    '				<input type="hidden" name="academicId" id="academicId" value="" />' +
    '				<input type="hidden" name="leadNo" id="leadNo" value="" />' +
    '				<input type="hidden" name="rawLeadId" id="rawLeadId" value="" />' +
    '				<input type="hidden" name="relationType" id="relationType" value="" />' +
    '				<input type="hidden" name="leadSourceGroup" id="leadSourceGroup" value="" />' +
    '				<input type="hidden" name="countrolType" id="countrolType" value="" />' +
    '				<input type="hidden" name="mergeLeads" id="mergeLeads" value="" />' +
    '<input type="hidden" name="isdCode" id="isdCode" value="" />' +
    '<input type="hidden" name="pCountryCode" id="pCountryCode" value="" />' +
    '<input type="hidden" name="isdCodeAlter" id="isdCodeAlter" value="" />' +
    '<input type="hidden" name="pCountryCodeAlter" id="pCountryCodeAlter" value="" />' +
    '				<input type="hidden" name="userPermission" id="userPermission" value="' +
    objRights.discardPermission +
    '" />' +
    '				<div class="row">' +
    '					<div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-12 mb-1 mt-1">' +
    '							<label class="m-0">Parent First Name*</label>' +
    '							<input type="text" name="leadGuardfname" id="leadGuardfname" value=""   class="form-control" maxlength="100" onkeydown="return M.isChars(event);">' +
    "					</div>" +
    '					<div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-12 mb-1 mt-1">' +
    '						<label class="m-0">Parent Middle Name</label>' +
    '						<input type="text" name="leadGuardmname" id="leadGuardmname" value=""  class="form-control" maxlength="100" onkeydown="return M.isChars(event);">' +
    "					</div>" +
    '					<div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-12 mb-1 mt-1">' +
    '						<label class="m-0">Parent Last Name</label>' +
    '						<input type="text" name="leadGuardlname" id="leadGuardlname" value=""  class="form-control" maxlength="100" onkeydown="return M.isChars(event);">' +
    "					</div>" +
    '					<div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-12 mb-1 mt-1">' +
    '							<label class="m-0">Child First Name*</label>' +
    '							<input type="text" name="leadstdfname" id="leadstdfname" value=""   class="form-control" maxlength="100" onkeydown="return M.isChars(event);">' +
    "					</div>" +
    '					<div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-12 mb-1 mt-1">' +
    '						<label class="m-0">Child Middle Name</label>' +
    '						<input type="text" name="leadstdmname" id="leadstdmname" value=""  class="form-control" maxlength="100" onkeydown="return M.isChars(event);">' +
    "					</div>" +
    '					<div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-12 mb-1 mt-1">' +
    '						<label class="m-0">Child Last Name</label>' +
    '						<input type="text" name="leadstdlname" id="leadstdlname" value=""  class="form-control" maxlength="100" onkeydown="return M.isChars(event);">' +
    "					</div>" +
    '					<div class="col-xl-2 col-lg-2 col-md-3 col-sm-3 col-12 mb-1 mt-1">' +
    '							<label class="m-0">Age</label>' +
    '							<input type="text" name="leadAge" id="leadAge" class="form-control" value=""  maxlength="3" >' +
    "						</div>" +
    '					<div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-12 mb-1 mt-1">' +
    '						<label class="m-0">Grade*</label>' +
    '						<select name="leadGrade" id="leadGrade" class="form-control" >' +
    '							<option value="">Select Grade</option>' +
    getStandardContent(SCHOOL_ID, true, false) +
    "						</select>" +
    "					</div>" +
    '					<div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-12 mb-1 mt-1">' +
    '							<label class="m-0">Country</label>' +
    '							<select name="countryId" id="countryId" class="form-control"  >' +
    '								<option value="0">Select country</option>' +
    "							</select>" +
    "						</div>" +
    '						<div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-12 mb-1 mt-1">' +
    '							<label class="m-0">State</label>' +
    '							<select name="stateId" id="stateId" class="form-control" >' +
    '								<option value="0">Select state</option>' +
    "							</select>" +
    "						</div>" +
    '						<div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-12 mb-1 mt-1">' +
    '							<label class="m-0">City</label>' +
    '							<select name="cityId" id="cityId" class="form-control" >' +
    '								<option value="0">Select city</option>' +
    "							</select>" +
    "						</div>" +
    
    '						<div class="col-xl-2 col-lg-2 col-md-3 col-sm-3 col-12 mb-1 mt-1">' +
    '							<label class="m-0">Email*</label>' +
    '							<input type="email" name="leademailId" id="leademailId" class="form-control" value=""  ' +
    '							maxlength="100" pattern="^([w-]+(?:.[w-]+)*)@((?:[w-]+.)*w[w-]{0,66}).([a-zA-Z]{2,10}(?:.[a-zA-z]{2})?)$">' +
    "						</div>" +
    '						<div class="col-xl-2 col-lg-2 col-md-3 col-sm-3 col-12 mb-1 mt-1">' +
    "							<label>Alt Email</label> " +
    '							<input type="email" name="leademailAlternet" id="leademailAlternet" class="form-control" value=""  maxlength="100"' +
    '						pattern="^([w-]+(?:.[w-]+)*)@((?:[w-]+.)*w[w-]{0,66}).([a-zA-Z]{2,10}(?:.[a-zA-z]{2})?)$">' +
    "						</div>" +
    '						<div class="col-xl-2 col-lg-2 col-md-3 col-sm-3 col-12 mb-1 mt-1">' +
    "							<label>Phone No.<span>*</span></label> " +
    '							<input type="text" name="phoneNo" id="phoneNo" class="form-control" value="" maxlength="15" />' +
    "						</div>" +
    '						<div class="col-xl-2 col-lg-2 col-md-3 col-sm-3 col-12 mb-1 mt-1">' +
    "							<label>Alt Phone No.</label> " +
    '							<input type="text" name="phoneNoAlter" id="phoneNoAlter" class="form-control" value=""  maxlength="15"  />' +
    "						</div>" +
    '						<div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-12 mb-1 mt-1" >' +
    '							<label class="m-0">Tagging</label>' +
    '							<select name="leadTagging" id="leadTagging" multiple class="form-control" style="width:200px !important; height:30px !important;">' +
    '								<option value="" ></option> ' +
    "						</select>" +
    "						</div>" +
    '						<div class="col-xl-3 col-lg-3 col-md-2 col-sm-2 col-12 mb-1 mt-1 b2cLeadsource" >' +
    '							<label class="m-0">Lead Source * </label>' +
    '							<select	name="leadSource" id="leadSource" class="form-control" >' +
    '								<option value="">Select Source</option>' +
    "							</select>" +
    "						</div>" +
    '						<div class="col-xl-3 col-lg-4 col-md-4 col-sm-4 col-12 mb-1 mt-1 b2cLeadstatus">' +
    '							<label class="m-0">Lead Status*</label>' +
    '							<select name="leadStatus" id="leadStatus" class="form-control">' +
    '								<option value="">Select Status</option>' +
    "							</select>" +
    "						</div>" +
    '						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 col-12 mb-1 mt-1 b2cLeadstatus">' +
    '							<label class="m-0">Lead Assigned To*</label>' +
    '							<select name="leadAssignTo" id="leadAssignTo" class="form-control" >' +
    '								<option value="">Select Assign</option>' +
    "							</select>" +
    "						</div>" +
    '						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2 b2bLeadstatus">' +
    '							<label class="m-0">Lead Support To</label>' +
    '							<select name="leadSupportTo" id="leadSupportTo" class="form-control"  >' +
    '								<option value="">Select Support</option>' +
    "							</select>" +
    "						</div>" +
    '						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2 b2bLeadCallback">' +
    '							<label class="m-0">Callback</label>' +
    '							<select name="leadCallback" id="leadCallback" class="form-control"  >' +
    '								<option value="">Select Callback</option>' +
    '								<option value="LWC">Lead With Callback</option>' +
    '								<option value="LWOC">Lead Without Callback</option>' +
    "							</select>" +
    "						</div>" +
    '						<div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-12 mb-1 mt-1" >' +
    '							<label class="m-0">Priority</label>' +
    '							<select name="leadPriority" id="leadPriority" class="form-control" >' +
    '								<option value="">Select Priority</option> ' +
    "						</select>" +
    "						</div>" +
    '						<div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 mb-2 b2cLeadstatus">' +
    "							<label>Remarks</label>" +
    '							<textarea name="leadRemark" id="leadRemark" rows="3" class="form-control" style="height:50px"></textarea>' +
    "						</div>" +
    "				</div>" +
    '				<div id="documentDiv"></div>' +
    "			</form>" +
    "        </div>" +
    '        <div class="modal-footer">' +
    '			<button type="button" class="btn btn-info  float-right pr-4 pl-4 ml-2" onClick="resetLeadUpdate()">Close</button>' +
    '			<button type="button" class="btn btn-success  float-right pr-4 pl-4" id="saveLead">Save</button>' +
    "        </div>" +
    "    </div>" +
    "</div>" +
    "</div>" +
    '<div id="supportHtmlFollowup"></div>';
  return html;
}

function getLeadFollowupFormPopup(objRights) {
  var html = "";
  html +=
    '<div id="leadFollowupForm" class="modal fade bd-example-modal-lg fade-scale" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">' +
    '<div class="modal-dialog modal-xl">' +
    '    <div class="modal-content border-0">' +
    '        <div class="modal-header py-2 bg-primary text-white">' +
    '            <h5 class="modal-title" >Follow up Form</h5>' +
    '            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">' +
    '                <span aria-hidden="true">&times;</span>' +
    "            </button>" +
    "        </div>" +
    '        <div class="modal-body">' +
    '            <form class="col-lg-12 col-md-12 col-sm-12 col-12 pt-2 pb-2" method="post" id="followupSaveForm" action="javascript:void(0);">' +
    '				<input type="hidden" name="leadId" id="leadId" value="0" />' +
    '				<input type="hidden" name="leadType" id="leadType" value="B2C" />' +
    '				<input type="hidden" name="leadAdderId" id="leadAdderId" value="' +
    USER_ID +
    '" class="form-control">' +
    '				<input type="hidden" name="currentPage" id="currentPage" value="' +
    objRights.currentPage +
    '" class="form-control">' +
    '				<div class="row">' +
    '					<div class="col-xl-2 col-lg-2 col-md-3 col-sm-3 col-12 mb-1 mt-1">' +
    '						<label class="m-0">Connected Through</label>' +
    '						<select class="form-control dropdownFontSize" id="followMed" name="followMed">' +
    '							<option value="Demo" selected>Demo</option>' +
    '							<option value="WhatsApp" >What\'sApp</option>' +
    '							<option value="Email" >Email</option>' +
    '							<option value="Call" >Call</option>' +
    "						</select>" +
    "					</div>" +
    '					<div class="col-xl-2 col-lg-2 col-md-3 col-sm-3 col-12 mb-1 mt-1">' +
    '						<label class="m-0">Connected With</label>' +
    '						<select name="callWith" id="callWith" class="form-control dropdownFontSize">' +
    '							<option value="">Select</option>' +
    '							<option value="father" >Father</option>' +
    '							<option value="father with child" >Father With Child</option>' +
    '							<option value="with child" >With Child</option>' +
    '							<option value="mother">Mother</option>' +
    '							<option value="mother with child" >Mother With Child</option>' +
    '							<option value="father mother with child" >Father Mother With Child</option>' +
    '							<option value="guardian/ relative" >Guardian/ Relative</option>' +
    '							<option value="none">None</option>' +
    "						</select>" +
    "					</div>" +
    '					<div class="col-xl-2 col-lg-2 col-md-3 col-sm-3 col-12 mb-1 mt-1">' +
    '						<label class="m-0">Lead Status*</label>' +
    '						<select name="leadStatus" id="leadStatus" class="form-control dropdownFontSize">' +
    '							<option value="">Select Status</option>' +
    "						</select>" +
    "					</div>" +
    '					<div class="col-lg-2 col-md-6 col-sm-6 col-12 mb-1 mt-1">' +
    '						<label class="m-0">Next Followup</label>' +
    '						<select class="form-control dropdownFontSize" id="nextDate" name="nextDate">' +
    '							<option value="">--Select--</option>' +
    '							<option value="NO FOLLOWUP">No Followup</option>' +
    '							<option value="CUSTOM">Choose Date</option>' +
    "						</select> " +
    "					</div>" +
    '					<div class="col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 followCall" style="display:none">' +
    '						<div class="row">' +
    '							<div class="mr-0 mr-sm-2 flex-grow-1 nextCustomDate" style="display:none">' +
    '								<label class="m-0">Date</label>' +
    '								<input type="text" name="notSureCallscheduleDate" id="notSureCallscheduleDate" class="form-control dropdownFontSize datepicker" maxlength="50" autocomplete="off" readonly onkeydown="return false">' +
    "							</div>" +
    '							<div class="mr-0 mr-sm-2 flex-grow-1">' +
    '								<label class="m-0">HH</label>' +
    '								<select class="form-control dropdownFontSize" id="notSureHours" name="notSureHours">' +
    '									<option value="00">00</option>';
  for (var i = 1; i <= 12; i++) {
    html +=
      '<option value="' +
      (i > 9 ? i : "0" + i) +
      '" >' +
      (i > 9 ? i : "0" + i) +
      "</option>";
  }
  html +=
    "								</select> " +
    "							</div>" +
    '							<div class="mr-0 mr-sm-2 flex-grow-1">' +
    '								<label class="m-0">MM</label>' +
    '								<select class="form-control dropdownFontSize" id="notSureMins" name="notSureMins">' +
    '									<option value="00">00</option>';
  for (var j = 1; j <= 59; j++) {
    html +=
      '<option value="' +
      (j > 9 ? i : "0" + i) +
      '" >' +
      (j > 9 ? j : "0" + j) +
      "</option>";
  }
  html +=
    "							</select> " +
    "							</div>" +
    '							<div class="mr-0 mr-sm-2 flex-grow-1">' +
    '								<label class="m-0">AM/PM</label>' +
    '								<select class="form-control dropdownFontSize" id="notSureAMPM" name="notSureAMPM">' +
    '									<option value="AM">AM</option>' +
    '									<option value="PM">PM</option>' +
    "								</select> " +
    "							</div>" +
    "						</div>" +
    "					</div>" +
    "				</div>" +
    '				<div class="row">' +
    '					<div class="col-lg-12">' +
    '						<div role="" class="mb-2 btn-group-sm btn-group-toggle" data-toggle="buttons">' +
    '							<label class="btn btn-outline-success leadTypeCategory">' +
    '								<input type="radio"  name="leadTypeCategory" value="Hot" id="Hot" autocomplete="off" > Hot' +
    "							</label>" +
    '							<label class="btn btn-outline-primary leadTypeCategory">' +
    '								<input type="radio"  name="leadTypeCategory" value="Cold" id="Cold" autocomplete="off" > Cold' +
    "							</label>" +
    '							<label class="btn btn-outline-warning leadTypeCategory">' +
    '								<input type="radio" name="leadTypeCategory" value="Warm" id="Warm" autocomplete="off"> Warm' +
    "							</label>" +
    "						</div>" +
    "					</div>" +
    "				</div>" +
    '				<div class="row">		' +
    '					<div class="col-lg-12">' +
    '						<div class="row">' +
    '							<div class="col-lg-12 col-md-12 col-sm-12 col-12 call-wrapper mt-2">' +
    '								<div class="row tentative_date">' +
    '									<div class="col-lg-3 col-md-3 col-sm-3 col-3">' +
    '										<label class="m-0">Tentative Date</label>' +
    '										<input type="text" name="tentativeDate" id="tentativeDate" value="" class="form-control datepicker" maxlength="50" autocomplete="off" readonly onkeydown="return false" />' +
    "									</div>" +
    "								</div>" +
    '								<div class="row">' +
    '									<div class="col-lg-12 col-md-12 col-sm-12 col-12 mb-1 mt-1">' +
    '										<div class="followRemarks">' +
    '											<label class="m-0">Remarks</label>' +
    '											<textarea class="form-control" name="followupRemarks" id="followupRemarks" rows="2" style="height: 35px !important;"></textarea>' +
    '											<small id="followupRemarksCounter" class="text-muted"></small>' +
    '											<input type="hidden" class="form-control" name="followupRemarkBy" id="followupRemarkBy" value="' +
    USER_ID +
    '" />' +
    "										</div>" +
    "									</div>" +
    "								</div>" +
    "						</div>" +
    "					</div>" +
    "				</div>" +
    "			</div>" +
    "		</form>" +
    "        </div>" +
    '        <div class="modal-footer">' +
    '			<button type="button" class="btn btn-info  float-right pr-4 pl-4 ml-2" data-dismiss="modal">Close</button>' +
    '			<button type="button" class="btn btn-success  float-right pr-4 pl-4" id="saveFollowup">Save Status</button>' +
    "        </div>" +
    '		<div class="col-lg-12 col-md-12 col-ms-12 col-12 pt-2 pb-2 table-responsive">' +
    '			<table class="table table-bordered table-striped" style="font-size:11px;">' +
    "				<thead>" +
    "					<tr>" +
    "						<th>S. No.</th>" +
    "						<th>Connected Through | Last Call at Date & Time</th>" +
    "						<th>Next Followup at Date & Time</th>" +
    "						<th>Connected With | Lead Followup Status</th>" +
    "						<th>Last Call Remarks</th>" +
    "					</tr>" +
    "				</thead>" +
    '				<tbody id="followupHistory"></tbody>' +
    "			</table>" +
    "		</div>" +
    "    </div>" +
    "</div>" +
    "</div>";
  return html;
}

function getLeadAdvanceSearchPopup(objRights) {
  var html =
    '<div id="leadAdvanceSearch" class="modal fade bd-example-modal-lg fade-scale" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">' +
    '<div class="modal-dialog modal-xl">' +
    '    <div class="modal-content border-0">' +
    '        <div class="modal-header py-2 bg-primary text-white">' +
    '            <h5 class="modal-title" >Advance Search</h5>' +
    '            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">' +
    '                <span aria-hidden="true">&times;</span>' +
    "            </button>" +
    "        </div>" +
    '        <div class="modal-body">' +
    '<form action="javascript:void(0);" id="advanceLeadNewSearchForm" name="advanceLeadNewSearchForm" autocomplete=\'off\'>' +
    '			<input type="hidden" name="restrictedDataShow" id="restrictedDataShow" value="YES">' +
    '			<input type="hidden" name="advancedformclick" id="advancedformclick" value="YES">' +
    '			<input type="hidden" name="currentPageSearch" id="currentPageSearch" value="' +objRights.currentPage +'">' +
    '			<input type="hidden" name="clickFromSearch" id="clickFromSearch" value="' +objRights.clickFrom +'">' +
    '			<input type="hidden" name="leadFromSearch" id="leadFromSearch" value="' +objRights.leadFrom +'">' +
    '			<input type="hidden" name="leadFromSearchModuleId" id="leadFromSearchModuleId" value="' +objRights.moduleId +'">' +
    '			<input type="hidden" name="leadType" id="leadType" value="' + objRights.leadType +'">' +
    '			<input type="hidden" name="userId" id="userId" value="' +USER_ID +
    '">' +
    '			<input type="hidden" name="campaignName" id="campaignName" value="">' +
    '<div class="row">' +
    '<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mb-1 mt-1">' +
    '	<div class="leadErrorText"></div>' +
    "</div>" +
    "</div>" +
    '<div class="row">' +
    '<div class="col-xl-3 col-lg-3 col-md-4 col-sm-4 col-12 mb-1 mt-1">' +
    '	<label class="m-0">Academic Year</label>' +
    '	<select	name="leadAcadmicYear" id="leadAcadmicYear" class="form-control" >' +
    "	</select>" +
    "</div>" +
    '<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12 mb-1 mt-1">' +
    '	<label class="m-0">Search with any text</label>' +
    '	<input type="text" name="leadFullSearch" id="leadFullSearch"  class="form-control"/> ' +
    "</div>" +
    '<div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-1 mt-1 leadTag">' +
    '<label class="m-0">Lead Tagging</label>' +
    '<select name="leadTagSearch" id="leadTagSearch" class="form-control" multiple ></select>' +
    "</div>" +
    "</div>" +
    '<div class="row">' +
    '<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1">' +
    '	<label class="m-0">Lead No.</label>' +
    '	<input type="text" name="leadNoSearch" id="leadNoSearch"  class="form-control" maxlength="50" /> ' +
    "</div>" +
    '<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 priority">' +
    '	<label class="m-0">Lead Type</label>' +
    '	<select name="leadType" id="leadType" class="form-control">' +
    '		<option value="">Select Type</option>' +
    '		<option value="B2C" ' +
    (objRights.leadType == "B2C" ? "selected" : "") +
    ">B2C</option>" +
    '		<option value="B2B" ' +
    (objRights.leadType == "B2B" ? "selected" : "") +
    ">B2B</option>" +
    "	</select>" +
    "</div>" +
    '<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 leadSource">' +
    '	<label class="m-0">Lead Source</label>' +
    '	<select	name="leadSourceSearch" id="leadSourceSearch" class="form-control" multiple ></select>' +
    "</div>" +
    '<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 leadStatus">' +
    '	<label class="m-0">Lead Status</label>&nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox" id="checkLeadStatus" name="checkLeadStatus" /> With Status' +
    '	<select name="leadStatusSearch" id="leadStatusSearch" class="form-control" multiple ></select>' +
    "</div>" +
    '<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1">' +
    '	<label class="m-0">Email</label>' +
    '	<input type="email" name="leademailIdSearch" id="leademailIdSearch" class="form-control"  maxlength="100">' +
    "</div>" +
    '<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1">' +
    '	<label class="m-0">Phone No.</label>' +
    '	<input type="text" name="phoneNoSearch" id="phoneNoSearch" class="form-control" maxlength="15"/>' +
    "</div>" +
    '<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1">' +
    '	<label class="m-0">Student Name</label>' +
    '	<input type="text" name="leadstdfnameSearch" id="leadstdfnameSearch" class="form-control" maxlength="100" onkeydown="return M.isChars(event);">' +
    "</div>" +
    '<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 grade">' +
    '	<label class="m-0">Grade</label>' +
    '	<select name="leadGradeSearch" id="leadGradeSearch" class="form-control" >' +
    '		<option value="0">Select Grade</option>' +getStandardContent(SCHOOL_ID, true, false) +
    "	</select>" +
    "</div>" +
    '<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 country">' +
    '	<label class="m-0">Country</label>' +
    '	<select name="countryIds" id="countryIds" class="form-control" multiple >' +
    '		<option value="0">Select country</option>' +
    "	</select>" +
    "</div>" +
    '<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 utmSource">' +
    '	<label class="m-0">Select Campaign</label>' +
    '	<select  name="leadSearchCampaign" id="leadSearchCampaign" class="form-control leadSearchCampaign" multiple ></select>' +
    "</div>" +
    // '<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 state">' +
    // '	<label class="m-0">State</label>' +
    // '	<select name="stateId" id="stateId" class="form-control" >' +
    // '		<option value="0">Select state</option>' +
    // "	</select>" +
    // "</div>" +
    // '<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 col-12 mb-1 mt-1 city">' +
    // '	<label class="m-0">City</label>' +
    // '	<select name="cityId" id="cityId" class="form-control" >' +
    // '		<option value="0">Select city</option>' +
    // "	</select>" +
    // "</div>	" +
    '<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 col-12 mb-1 mt-1 callWith">' +
    '	<label class="m-0">Connected With</label>' +
    '	<select name="callWithSearch" id="callWithSearch" class="form-control">' +
    '			<option value="">Select</option>' +
    '			<option value="father" >Father</option>' +
    '			<option value="father with child" >Father With Child</option>' +
    '			<option value="mother">Mother</option>' +
    '			<option value="mother with child" >Mother With Child</option>' +
    '			<option value="father mother with child" >Father Mother With Child</option>' +
    '			<option value="guardian/ relative" >Guardian/ Relative</option>' +
    '			<option value="none">None</option>' +
    "		</select>" +
    "</div>" +
    '<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 leadAssign">' +
    '	<label class="m-0">Lead Assign To</label>&nbsp;&nbsp;&nbsp;&nbsp;' +
    '<input type="checkbox" id="checkByLead" name="checkByLead" /> Only Lead&nbsp;' +
    '<input type="checkbox" id="checkByLeadDemo" name="checkByLeadDemo" /> Lead With Demo';
  if (objRights.leadHideRights) {
    html +=
      '<select name="leadAssignToSearch" id="leadAssignToSearch" class="form-control" multiple disabled></select>';
  } else {
    html +=
      '<select name="leadAssignToSearch" id="leadAssignToSearch" class="form-control" multiple></select>';
  }
  html += "</div>";
  html +=
    '<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 demoAssign">' +
    '<label class="m-0">Lead Added by</label>' +
    '<select	name="leadCreatedBy" id="leadCreatedBy" class="form-control" >' +
    '<option value="0">Select Assign</option>' +
    "</select>" +
    "</div>" +
    '<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 demoAssign">' +
    '	<label class="m-0">Demo Assign</label>' +
    '	<select	name="leadDemoAssignSearch" id="leadDemoAssignSearch" class="form-control" >' +
    '		<option value="0">Select Assign</option>' +
    "	</select>" +
    "</div>" +
    '						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2 b2bLeadstatus">' +
    '							<label class="m-0">Lead Support To</label>' +
    '							<select name="leadSupportTo" id="leadSupportTo" class="form-control"  >' +
    '								<option value="">Select Support</option>' +
    "							</select>" +
    "						</div>" +
    '						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2 b2bLeadCallback">' +
    '							<label class="m-0">Callback</label>' +
    '							<select name="leadCallback" id="leadCallback" class="form-control"  >' +
    '								<option value="">Select Callback</option>' +
    '								<option value="LWC">Lead With Callback</option>' +
    '								<option value="LWOC">Lead Without Callback</option>' +
    "							</select>" +
    "						</div>" +
    // '<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 utmSource">' +
    // '	<label class="m-0">UTM Source</label>' +
    // '	<select name="utmSourceSearch" id="utmSourceSearch" class="form-control"  >' +
    // '		<option value="">Select UTM Source</option>' +
    // "	</select>" +
    // "</div>" +
     '				<div class="col-xl-3 col-lg-4 col-md-2 col-sm-2 col-12 mb-1 mt-1" >' +
    '							<label class="m-0">Priority</label>' +
    '							<select name="leadPriority" id="leadPriority" class="form-control" >' +
    '								<option value="" ></option> ' +
    "						</select>" +
    "						</div>" +
    '<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1">' +
    '	<label class="m-0">Start Date</label>' +
    '	<input type="text" name="leadStartDateSearch" id="leadStartDateSearch" value="' +objRights.startDate +
    '" class="form-control datepicker" readonly onkeydown="return false">' +
    "</div>" +
    '<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1">' +
    '	<label class="m-0">To Date</label>' +
    '	<input type="text" name="leadEndDateSearch" id="leadEndDateSearch" value="' +objRights.endDate +
    '" class="form-control datepicker" readonly onkeydown="return false">' +
    "</div>" +
    '<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 utmSource">' +
    '	<label class="m-0">Date Type</label>' +
    '	<select name="searchDateType" id="searchDateType" class="form-control"  >' +
    '		<option value="">Select Date Type</option>' +
    '		<option value="create-lead" ' + (objRights.searchType == "create-lead" ? "selected" : "") +" >Created Lead</option>" +
    '		<option value="modify-lead" ' + (objRights.searchType == "modify-lead" ? "selected" : "") +">Modify Lead</option>" +
    '		<option value="demo-Book" ' +(objRights.searchType == "demo-Book" ? "selected" : "") +">Demo Book</option>" +
    '		<option value="demo-lead" ' + (objRights.searchType == "demo-lead" ? "selected" : "") + ">Demo Schedule</option>" +
    '		<option value="callschedule-lead" ' + (objRights.searchType == "callschedule-lead" ? "selected" : "") + ">Call Schedule </option>" +
    '		<option value="call-done" ' +(objRights.searchType == "call-done" ? "selected" : "") +">Call Done</option>" +
    "	</select>" +
    "</div>" +
    '<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 utmSource">' +
    '	<label class="m-0">Student Stage</label>' +
    '	<select name="studentStage" id="studentStage" class="form-control"  >' +
    '		<option value="">Select Date Type</option>' +
    '		<option value="0" >ENROLLED</option>' +
    '		<option value="10" >STUDENT DETAIL</option>' +
    '		<option value="11" >PARENT DETAIL</option>' +
    '		<option value="12" >ADDRESS DETAIL</option>' +
    '		<option value="13" >COURSE SELECTION</option>' +
    '		<option value="14,15" >REVIEW DETAIL</option>' +
    "	</select>" +
    "</div>" +
    
    '<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 utmSource">' +
    '	<label class="m-0">Select Template</label>' +
    '	<select  name="leadSearchTemplate" id="leadSearchTemplate" class="form-control leadSearchTemplate" multiple >' +
    "	</select>" +
    "</div>" +
    '<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 utmSource">' +
    '	<label class="m-0">Select Delivered Status</label>' +
    '	<select  name="leadSearchDeliveredStatus" id="leadSearchDeliveredStatus" class="form-control leadSearchDeliveredStatus"  >' +
    '		<option value="ALL"  >-- Select Delivered Status --</option>' +
    '		<option value="SUCCESS" >SUCCESS</option>' +
    '		<option value="FAIL" >FAIL</option>' +
    '		<option value="UNREACHED"  >UNREACHED</option>' +
    '		<option value="UNSUBSCRIBED" >UNSUBSCRIBED</option>' +
    "	</select>" +
    "</div>";
  if (objRights.discardPermission && USER_ROLE == "DIRECTOR") {
    html +=
      '<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 ">' +
      '<input type="radio"  name="checkLeadForZCall" value="Y" /> Zadarma Call Done' +
      '<input type="radio" name="checkLeadForZCall" value="N" /> Zadarma Call Not Done' +
      "</div>";
  }

  html +=
    "</div>" +
    '<div class="row">' +
    '<div class="col-xl-2 col-lg-2 col-md-6 col-sm-6 col-12 mb-1 mt-1 priority">' +
    '<label class="m-0">Sort by</label>' +
    '<select name="leadsShortBy" id="leadsShortBy" class="form-control">' +
    '<option value="modifydate" ' +
    (objRights.shortBy == "modifydate" ? "selected" : "") +
    ">Modified Date</option>" +
    '<option value="createdate" ' +
    (objRights.shortBy == "createdate" ? "selected" : "") +
    ">Created Date</option>" +
    '<option value="childname" ' +
    (objRights.shortBy == "childname" ? "selected" : "") +
    ">Child Name</option>" +
    '<option value="grade" ' +
    (objRights.shortBy == "grade" ? "selected" : "") +
    ">Grade</option>" +
    '<option value="country" ' +
    (objRights.shortBy == "country" ? "selected" : "") +
    ">Country</option>" +
    "</select>" +
    "</div>" +
    '<div class="col-xl-2 col-lg-2 col-md-6 col-sm-6 col-12 mb-1 mt-1 priority">' +
    '<label class="m-0">Ascending/ Descending</label>' +
    '<select name="leadsShortType" id="leadsShortType" class="form-control">' +
    '<option value="DESC" ' +
    (objRights.shortType == "DESC" ? "selected" : "") +
    ">Descending</option>" +
    '<option value="ASC" ' +
    (objRights.shortType == "ASC" ? "selected" : "") +
    ">Ascending</option>" +
    "</select>" +
    "</div>" +
    "</div>" +
    "			</form>" +
    "        </div>" +
    '        <div class="modal-footer">' +
    '            <button type="button" class="btn btn-danger  float-right pr-4 pl-4 ml-2" onclick="advanceLeadSearchStudentReset(\'advanceLeadNewSearchForm\',\'' +
    objRights.leadType +
    '\')"><i class="fa fa-undo"></i>&nbsp;Reset</button>' +
    '			<button type="button" class="btn btn-info  float-right pr-4 pl-4 ml-2" data-dismiss="modal">Close</button>' +
    '			<button type="button" class="btn btn-success  float-right pr-4 pl-4" id="btnNewClickLeadSearch"><i class="fa fa-search"></i>&nbsp;Search</button>' +
    "        </div>" +
    "    </div>" +
    "</div>" +
    "</div>";
  return html;
}

function getLeadMergeFormPopup(objRights) {
  var html = "";
  html +=
    '<div id="leadMergePopup" class="modal fade bd-example-modal-lg fade-scale" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">' +
    '<div class="modal-dialog modal-xl">' +
    '    <div class="modal-content border-0">' +
    '        <div class="modal-header py-2 bg-primary text-white">' +
    '            <h5 class="modal-title" id="leadFormText">Merge Lead Form</h5>' +
    '            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">' +
    '                <span aria-hidden="true">&times;</span>' +
    "            </button>" +
    "        </div>" +
    '       <div class="modal-body">' +
    '		<form class="col-lg-12 col-md-12 col-ms-12 col-12 pt-2 pb-2" method="post" action="javascript:void(0);" id="leadMergeDataPopupForm">' +
    '			<input type="hidden" name="leadId" id="leadId" value="" />' +
    '			<input type="hidden" name="parentleadId" id="parentleadId" value="" />' +
    '			<input type="hidden" name="academicId" id="academicId" value="" />' +
    '			<input type="hidden" name="leadNo" id="leadNo" value="" />' +
    '			<input type="hidden" name="rawLeadId" id="rawLeadId" value="" />' +
    '			<input type="hidden" name="relationType" id="relationType" value="" />' +
    '			<input type="hidden" name="leadSourceGroup" id="leadSourceGroup" value="" />' +
    '			<input type="hidden" name="countrolType" id="countrolType" value="" />' +
    '			<input type="hidden" name="mergeLeads" id="mergeLeads" value="" />' +
    '<input type="hidden" name="isdCode" id="isdCode" value="" />' +
    '<input type="hidden" name="pCountryCode" id="pCountryCode" value="" />' +
    '<input type="hidden" name="isdCodeAlter" id="isdCodeAlter" value="" />' +
    '<input type="hidden" name="pCountryCodeAlter" id="pCountryCodeAlter" value="" />' +
    '			<input type="hidden" name="leadType" id="leadType" value="' +
    objRights.leadType +
    '" />' +
    '			<div class="row">' +
    '				<div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-12 mb-1 mt-1">' +
    '						<label class="m-0">First Name*</label>' +
    '						<input type="text" name="leadstdfname" id="leadstdfname" value=""   class="form-control" maxlength="100" onkeydown="return M.isChars(event);">' +
    "				</div>" +
    '				<div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-12 mb-1 mt-1">' +
    '					<label class="m-0">Middle Name</label>' +
    '					<input type="text" name="leadstdmname" id="leadstdmname" value=""  class="form-control" maxlength="100" onkeydown="return M.isChars(event);">' +
    "				</div>" +
    '				<div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-12 mb-1 mt-1">' +
    '					<label class="m-0">Last Name</label>' +
    '					<input type="text" name="leadstdlname" id="leadstdlname" value=""  class="form-control" maxlength="100" onkeydown="return M.isChars(event);">' +
    "				</div>" +
    '				<div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-12 mb-1 mt-1">' +
    '					<label class="m-0">Grade*</label>' +
    '					<select name="leadGrade" id="leadGrade" class="form-control" >' +
    '						<option value="">Select Grade</option>' +
    getStandardContent(SCHOOL_ID, true, false) +
    "					</select>" +
    "				</div>" +
    '				<div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-12 mb-1 mt-1">' +
    '						<label class="m-0">Country</label>' +
    '						<select name="countryId" id="countryId" class="form-control"  ></select>' +
    "					</div>" +
    '					<div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-12 mb-1 mt-1">' +
    '						<label class="m-0">State</label>' +
    '						<select name="stateId" id="stateId" class="form-control" ></select>' +
    "					</div>" +
    '					<div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-12 mb-1 mt-1">' +
    '						<label class="m-0">City</label>' +
    '						<select name="cityId" id="cityId" class="form-control" ></select>' +
    "					</div>" +
    '					<div class="col-xl-2 col-lg-2 col-md-3 col-sm-3 col-12 mb-1 mt-1">' +
    '						<label class="m-0">Email*</label>' +
    '						<input type="email" name="leademailId" id="leademailId" class="form-control" value=""  ' +
    '						maxlength="100" pattern="^([w-]+(?:.[w-]+)*)@((?:[w-]+.)*w[w-]{0,66}).([a-zA-Z]{2,10}(?:.[a-zA-z]{2})?)$">' +
    "					</div>" +
    '					<div class="col-xl-2 col-lg-2 col-md-3 col-sm-3 col-12 mb-1 mt-1">' +
    "						<label>Alt Email</label> " +
    '						<input type="email" name="leademailAlternet" id="leademailAlternet" class="form-control" value=""  maxlength="100"' +
    '					pattern="^([w-]+(?:.[w-]+)*)@((?:[w-]+.)*w[w-]{0,66}).([a-zA-Z]{2,10}(?:.[a-zA-z]{2})?)$">' +
    "					</div>" +
    '					<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12 mb-1 mt-1">' +
    "						<label>Phone No.<span>*</span></label> " +
    '						<input type="text" name="phoneNo" id="phoneNo" class="form-control" value="" maxlength="15" onkeydown="return M.digit(event);" />' +
    "					</div>" +
    '					<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12 mb-1 mt-1">' +
    "						<label>Alt Phone No.</label> " +
    '						<input type="text" name="phoneNoAlter" id="phoneNoAlter" class="form-control" value=""  maxlength="15" onkeydown="return M.digit(event);" />' +
    "					</div>";

  if (objRights.discardPermission) {
    html +=
      '<div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-12 mb-1 mt-1 " >' +
      '		<label class="m-0">Lead Source * </label>' +
      '		<select	name="leadSource" id="leadSource" class="form-control" ></select>' +
      "	</div>" +
      '	<div class="col-xl-3 col-lg-4 col-md-4 col-sm-4 col-12 mb-1 mt-1">' +
      '		<label class="m-0">Lead Status*</label>' +
      '		<select name="leadStatus" id="leadStatus" class="form-control"></select>' +
      "	</div>" +
      '	<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 col-12 mb-1 mt-1">' +
      '		<label class="m-0">Lead Assigned To*</label>' +
      '		<select name="leadAssignTo" id="leadAssignTo" class="form-control" ></select>' +
      "	</div>" +
      '	<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mb-2">' +
      "		<label>Remarks</label>" +
      '		<textarea name="leadRemark" id="leadRemark" rows="3" class="form-control"></textarea>' +
      "	</div>";
  }
  html +=
    "			</div>" +
    "			</form>" +
    '		<div class="row">' +
    '			<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mb-2" id="mergeleadlist"></div>	' +
    "		</div>	" +
    "        </div>" +
    '        <div class="modal-footer">' +
    '			<button type="button" class="btn btn-info  float-right pr-4 pl-4 ml-2" data-dismiss="modal">Close</button>' +
    '			<button type="button" class="btn btn-success  float-right pr-4 pl-4" id="saveMergeLead">Save</button>' +
    "        </div>" +
    "    </div>" +
    "</div>" +
    "</div>";
  return html;
}

function getLeadCampaignListPopup() {
  var html =
    '<div id="leadCampaignPopupForm" class="modal fade bd-example-modal-lg fade-scale" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">' +
    '<div class="modal-dialog modal-lg">' +
    '<div class="modal-content border-0">' +
    '<div class="modal-header py-2 bg-primary text-white">' +
    ' <h5 class="modal-title" id="leadFormText">Campaign List</h5>' +
    '<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">' +
    '<span aria-hidden="true">&times;</span>' +
    "</button>" +
    " </div>" +
    ' <div class="modal-body">' +
    '<form class="col-lg-12 col-md-12 col-ms-12 col-12 pt-2 pb-2" method="post" action="javascript:void(0);" id="leadCampaignForm">' +
    ' <div class="row">' +
    '<div class="col-xl-6 col-lg-3 col-md-3 col-sm-3 col-3 mb-1 mt-1">' +
    '<label class="m-0">Campaign Name</label>' +
    '<input type="text" name="leadCampaignName" id="leadCampaignName" class="form-control"/> ' +
    "</div>" +
    '<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1">' +
    '<label class="m-0">Start Date</label>' +
    '<input type="text" name="campaignStartDate" id="campaignStartDate" class="form-control" readonly onkeydown="return false">' +
    "</div>" +
    '<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1">' +
    '<label class="m-0">&nbsp;</label><br/>' +
    '<button type="button" class="btn btn-success " id="btnAddCampaign">Save</button>' +
    "</div>" +
    " </div>" +
    " <hr/>" +
    '<div class="row">' +
    '<div class="col-xl-12 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1">' +
    '<table class="table table-bordered table-striped mobile-responsivei-table" id="tblCampaignList" style="font-size:11px">' +
    "<thead>" +
    "<tr>" +
    "<th>S. No.</th>" +
    "<th>Campaign Name</th>" +
    "<th>Start Date</th>" +
    "<th>End Date</th>" +
    "<th>Active | Inactive</th>" +
    "</tr>" +
    "</thead>" +
    '<tbody id="campaignlist"></tbody>' +
    "</table>  " +
    "</div>" +
    "</div>	" +
    "</form>" +
    " </div>" +
    '<div class="modal-footer">' +
    " </div>" +
    " </div>" +
    " </div>" +
    "</div>";
  return html;
}

function getB2cLeadHeaderList(leaddata, objRights, roleModule) {
  var html = "";
  html +=
    '<div class="lead-table-wrapper">' +
    '<table class="table table-bordered font-12 border-radius-table" style="min-width:1450px;width:100%" id="leadDataList">' +
    '<thead class="bg-primary">' +
    "<tr>" +
    '<th class="text-white bold rounded-top-left-10 border-bottom-0 border-primary" style="border-top-color:transparent;border-right-color:#fff !important">Lead info (IST +5:30)</th>' +
    '<th class="text-white bold border-bottom-0">Student | Parent Details</th>' +
    '<th class="text-white bold border-bottom-0">School Demo Details (IST +5:30) | Status Details</th>' +
    '<th class="text-white bold border-bottom-0 text-center">Follow Ups</th>' +
    '<th class="text-white bold border-bottom-0 rounded-top-right-10" style="border-top-color:transparent;border-right-color:transparent">Action</th>' +
    "</tr>" +
    "</thead>" +
    '<tbody class="lead-table-css">' +
    '<tr class="td-border-design">' +
    '<td style="" class="rounded-bottom-left-10 text-center bold" colspan="5">No Record found</td>' +
    "</tr>" +
    "</tbody>" +
    "</table>" +
    "</div>";
  return html;
}

function getLeadWatsApp() {
  var html = "";
  html += `<div class="modal fade pr-0 right-slide-modal safd" id="watsAppMsgModal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
	   <div class="modal-dialog modal-xl p-0 float-right">
		   <div class="modal-content">
			   <div class="modal-header bg-primary py-2">
					<h5 class="modal-title text-white w-100">
						<span class="">WhatsApp Chat log</span>
					</h5>
				   <button type="button" class="close bg-white rounded-top-left-10 rounded-bottom-left-10 opacity-10 p-2" data-dismiss="modal" aria-label="Close" style="position: absolute;left:-32px;top:62px">
					   <span aria-hidden="true">&times;</span>
				   </button>
			   </div>
			   <div class="modal-body overflow-auto chatmessage"> </div>
		   </div>
	   </div>
   </div>`;
  return html;
}

function getTotalB2CLeads(data) {
  var leadTotalData = data.leadTotalData;
  getLeadB2CTotalCountList(leadTotalData);
  getLeadB2CTotalHotCountList(leadTotalData);
}

function getLeadB2CTotalCountList(leadTotalData) {
  var totalLeadsHTML =
    leadTotalData.totalLeads > 0
      ? `<a href="javascript:void(0);" class="text-white" onclick="getTotalLead('B2C')">${leadTotalData.totalLeads}</a>`
      : "-";
  var todayLeadsHTML =
    leadTotalData.freshLead > 0
      ? `<a href="javascript:void(0);" class="text-white" onclick="clickTotalLeads('${leadTotalData.clickFrom}-${leadTotalData.clickUserid}', '0', 'freshLead','${leadTotalData.leadFrom}')">${leadTotalData.freshLead}</a>`
      : "-";
  $("#totalTodayLeads").html(`${totalLeadsHTML} | ${todayLeadsHTML}`);

  var fbTotalLeadsHTML =
    leadTotalData.totalFbLead > 0
      ? `<a href="javascript:void(0);" class="text-dark" onclick="clickTotalLeads('${leadTotalData.clickFrom}-${leadTotalData.clickUserid}', '0', 'facebooklead','${leadTotalData.leadFrom}')">${leadTotalData.totalFbLead}</a>`
      : "-";
  var fbTodayLeadsHTML =
    leadTotalData.todayFbLead > 0
      ? `<a href="javascript:void(0);" class="text-dark" onclick="clickTotalLeads('${leadTotalData.clickFrom}-${leadTotalData.clickUserid}', '0', 'fbtdlead','${leadTotalData.leadFrom}')">${leadTotalData.todayFbLead}</a>`
      : "-";
  $("#fbTotalTodayLeads").html(`${fbTotalLeadsHTML} | ${fbTodayLeadsHTML}`);

  var todayFollowupHTML =
    leadTotalData.todayScheduleCall > 0
      ? `<a href="javascript:void(0);" class="text-dark" onclick="clickTotalLeads('${leadTotalData.clickFrom}-${leadTotalData.clickUserid}', '0', 'todayScheduleCall','${leadTotalData.leadFrom}')">${leadTotalData.todayScheduleCall}</a>`
      : "-";
  $("#todayFollowup").html(`${todayFollowupHTML}`);

  var todaySchoolDemoHTML =
    leadTotalData.todayDemo > 0
      ? `<a href="javascript:void(0);" class="text-white" onclick="clickTotalLeads('${leadTotalData.clickFrom}-${leadTotalData.clickUserid}', '0', 'tdyDemo','${leadTotalData.leadFrom}')">${leadTotalData.todayDemo}</a>`
      : "-";
  $("#todaySchoolDemo").html(`${todaySchoolDemoHTML}`);

  if (leadTotalData.discardPermission) {
    var unassignedLeadsHTML =
      leadTotalData.followupLead2 > 0
        ? `<a href="javascript:void(0);" class="text-white" onclick="clickTotalLeads('${leadTotalData.clickFrom}-${leadTotalData.clickUserid}', '0', 'leadnotassign','${leadTotalData.leadFrom}')">${leadTotalData.followupLead2}</a>`
        : "-";
    $("#unassignedLeads").html(`${unassignedLeadsHTML}`);
  }

  let followupSelectHTML = `
	<select name="leadsFollowCount" id="leadsFollowCount" style="background-color: #EFD597;border: 0;" onfocus="this.style.outline='none';"  onchange="clickTotalLeads('${
    leadTotalData.clickFrom
  }-${leadTotalData.clickUserid}', '0', 'folwcount','${
    leadTotalData.leadFrom
  }')">
		<option value="0" ${
      leadTotalData.totalfollowup == 0 ? "selected" : ""
    }>0</option>
		<option value="1" ${
      leadTotalData.totalfollowup == 1 ? "selected" : ""
    }>1</option>
		<option value="2" ${
      leadTotalData.totalfollowup == 2 ? "selected" : ""
    }>2</option>
		<option value="3" ${
      leadTotalData.totalfollowup == 3 ? "selected" : ""
    }>3</option>
		<option value="4" ${
      leadTotalData.totalfollowup == 4 ? "selected" : ""
    }>4</option>
		<option value="5" ${
      leadTotalData.totalfollowup == 5 ? "selected" : ""
    }>5</option>
		<option value=">5" ${
      leadTotalData.totalfollowup == ">5" ? "selected" : ""
    }>>5</option>
	</select>`;
  $("#followupLeadsCount").html(followupSelectHTML);

  var unattendedLeadsHTML =
    leadTotalData.unattendedLead > 0
      ? `<a href="javascript:void(0);" class="text-white" onclick="clickTotalLeads('${leadTotalData.clickFrom}-${leadTotalData.clickUserid}', '0', 'unattendedLead','${leadTotalData.leadFrom}')">${leadTotalData.unattendedLead}</a>`
      : "-";
  $("#unattendedLeads").html(`${unattendedLeadsHTML}`);

  var totalSchoolDemoHTML =
    leadTotalData.demoLead > 0
      ? `<a href="javascript:void(0);" class="text-white" onclick="clickTotalLeads('${leadTotalData.clickFrom}-${leadTotalData.clickUserid}', '0', 'demoLead','${leadTotalData.leadFrom}')">${leadTotalData.demoLead}</a>`
      : "-";
  $("#totalSchoolDemo").html(`${totalSchoolDemoHTML}`);

  var completeLeadsHTML =
    leadTotalData.followupLead3 > 0
      ? `<a href="javascript:void(0);" class="text-dark" onclick="clickTotalLeads('${leadTotalData.clickFrom}-${leadTotalData.clickUserid}', '0', 'demodone','${leadTotalData.leadFrom}')">${leadTotalData.followupLead3}</a>`
      : "-";
  $("#completeLeads").html(`${completeLeadsHTML}`);

  var positiveToEnrollmentHTML =
    leadTotalData.followupLead1 > 0
      ? `<a href="javascript:void(0);" class="text-dark" onclick="clickTotalLeads('${leadTotalData.clickFrom}-${leadTotalData.clickUserid}', '0', 'followupLead1','${leadTotalData.leadFrom}')">${leadTotalData.followupLead1}</a>`
      : "-";
  $("#positiveToEnrollment").html(`${positiveToEnrollmentHTML}`);

  var moveLeadsCountHTML =
    leadTotalData.movedLead > 0
      ? `<a href="javascript:void(0);" class="text-white" onclick="clickTotalLeads('${leadTotalData.clickFrom}-${leadTotalData.clickUserid}', '0', 'movedLead','${leadTotalData.leadFrom}')">${leadTotalData.movedLead}</a>`
      : "-";
  $("#moveLeadsCount").html(`${moveLeadsCountHTML}`);

  var scrapeLeadsCountHTML =
    leadTotalData.scrapeLead > 0
      ? `<a href="javascript:void(0);" class="text-white" onclick="clickTotalLeads('${leadTotalData.clickFrom}-${leadTotalData.clickUserid}', '0', 'scrapeLead','${leadTotalData.leadFrom}')">${leadTotalData.scrapeLead}</a>`
      : "-";
  $("#scrapeLeadsCount").html(`${scrapeLeadsCountHTML}`);
}

function getLeadB2CTotalHotCountList(leadTotalData) {
  var hotLeadsCountHTML =
    leadTotalData.totalHot > 0
      ? `<a href="javascript:void(0);" class="text-white" onclick="clickTotalLeads('${leadTotalData.clickFrom}-${leadTotalData.clickUserid}', '0', 'hottotal','${leadTotalData.leadFrom}')">${leadTotalData.totalHot}</a>`
      : "-";
  $("#hotLeadsCount").html(`${hotLeadsCountHTML}`);

  var warmLeadsCountHTML =
    leadTotalData.totalWarm > 0
      ? `<a href="javascript:void(0);" class="text-white" onclick="clickTotalLeads('${leadTotalData.clickFrom}-${leadTotalData.clickUserid}', '0', 'warmtotal','${leadTotalData.leadFrom}')">${leadTotalData.totalWarm}</a>`
      : "-";
  $("#warmLeadsCount").html(`${warmLeadsCountHTML}`);

  var coldLeadsCountHTML =
    leadTotalData.totalCold > 0
      ? `<a href="javascript:void(0);" class="text-white" onclick="clickTotalLeads('${leadTotalData.clickFrom}-${leadTotalData.clickUserid}', '0', 'coldtotal','${leadTotalData.leadFrom}')">${leadTotalData.totalCold}</a>`
      : "-";
  $("#coldLeadsCount").html(`${coldLeadsCountHTML}`);

  var demoByWebsiteCountHTML =
    leadTotalData.totalWebsiteDemo > 0
      ? `<a href="javascript:void(0);" class="text-white" onclick="clickTotalLeads('${leadTotalData.clickFrom}-${leadTotalData.clickUserid}', '0', 'totalWebsiteDemo','${leadTotalData.leadFrom}')">${leadTotalData.totalWebsiteDemo}</a>`
      : "-";
  $("#demoByWebsiteCount").html(`${demoByWebsiteCountHTML}`);

  var demoByLinkCountHTML =
    leadTotalData.totalCopyUrlDemo > 0
      ? `<a href="javascript:void(0);" class="text-white" onclick="clickTotalLeads('${leadTotalData.clickFrom}-${leadTotalData.clickUserid}', '0', 'totalCopyUrlDemo','${leadTotalData.leadFrom}')">${leadTotalData.totalCopyUrlDemo}</a>`
      : "-";
  $("#demoByLinkCount").html(`${demoByLinkCountHTML}`);

  var assignedToLeadManagerCountHTML =
    leadTotalData.totalDemoSupport > 0
      ? `<a href="javascript:void(0);" class="text-white" onclick="clickTotalLeads('${leadTotalData.clickFrom}-${leadTotalData.clickUserid}', '0', 'totalDemoSupport','${leadTotalData.leadFrom}')">${leadTotalData.totalDemoSupport}</a>`
      : "-";
  $("#assignedToLeadManagerCount").html(`${assignedToLeadManagerCountHTML}`);

  var urgentLeads =
    leadTotalData.urgentLead > 0
      ? `<a href="javascript:void(0);" class="text-white" onclick="clickTotalLeads('${leadTotalData.clickFrom}-${leadTotalData.clickUserid}', '0', 'totalUrgentLead','${leadTotalData.leadFrom}')">${leadTotalData.urgentLead}</a>`
      : "-";
  $("#urgentLeads").html(`${urgentLeads}`);

  var importantLead =
    leadTotalData.importantLead > 0
      ? `<a href="javascript:void(0);" class="text-white" onclick="clickTotalLeads('${leadTotalData.clickFrom}-${leadTotalData.clickUserid}', '0', 'totalImportantLead','${leadTotalData.leadFrom}')">${leadTotalData.importantLead}</a>`
      : "-";
  $("#importantLeads").html(`${importantLead}`);

  var normalLead =
    leadTotalData.normalLead > 0
      ? `<a href="javascript:void(0);" class="text-white" onclick="clickTotalLeads('${leadTotalData.clickFrom}-${leadTotalData.clickUserid}', '0', 'totalNormalLead','${leadTotalData.leadFrom}')">${leadTotalData.normalLead}</a>`
      : "-";
  $("#normalLeads").html(`${normalLead}`);

}
function getB2cLeadList(leaddata, objRights, roleModule){
	//console.log(objRights);
	var data=leaddata.data;
	var objectRights=leaddata.objectRights;
	var b2clead=objectRights.b2cStatus;
	var b2blead=objectRights.b2bStatus;
	var ltype=objectRights.leadType.toLowerCase();
	if(b2clead){
		$(".b2clead").removeClass('d-none');
	}else{
		$(".b2clead").addClass('d-none');
	}
	if(b2blead){
		$(".b2blead").removeClass('d-none');
	}else{
		$(".b2blead").addClass('d-none');
	}
	//console.log(data);
	var campaignList = JSON.parse(leaddata.campaignList);
	var statusList = JSON.parse(leaddata.statusList);
	var html='<input type="checkbox" id="selectLeadAll" class="ml-2" />&nbsp;All'
	+'<select name="leadsPagging" id="leadsPagging" class="ml-1">'
		+'<option value="10" '+(leaddata.recordsPerPage=='10'?'selected':'')+'>10</option>'
		+'<option value="25" '+(leaddata.recordsPerPage=='25'?'selected':'')+'>25</option>'
		+'<option value="50" '+(leaddata.recordsPerPage=='50'?'selected':'')+'>50</option>'
		+'<option value="100" '+(leaddata.recordsPerPage=='100'?'selected':'')+'>100</option>'
	+'</select>'
  +'<span class="leadInfoTime ml-3 bg-dark text-white p-1"></span>'
	+'<div>'
		
	+'</div>';
	for(var i=0;i<data.length;i++){
		var leads = data[i];
		
    lScoreColor='';
    if(leads.leadScore>=80){
      lScoreColor='bg-success';
    }else if(leads.leadScore>=50 && leads.leadScore<80){
      lScoreColor='bg-warning';
    }else if(leads.leadScore<50){
      lScoreColor='bg-primary';
    }

    var childName='N/A';
    var childAge='N/A';
    var childGrade='N/A';
    var currentCurriculum='N/A';
    var agentRemark='N/A';
    var agentRecording='';
    
     if(leads.aidataList!=null && leads.aidataList.length>0){
        aidataList=leads.aidataList;
        for (let c = 0; c < aidataList.length; c++) {
          const aidata = aidataList[c];
          if(aidata.value!=''){
            if(aidata.key=='child_name'){
              childName=aidata.value;
            }else if(aidata.key=='child_age'){
              childAge=aidata.value;
            }else if(aidata.key=='updated_grade'){
              childGrade=aidata.value;
            }else if(aidata.key=='prev_curriculum'){
              currentCurriculum=aidata.value;
            }else if(aidata.key=='call_summary'){
              agentRemark=aidata.value;
            }else if(aidata.key=='recording_url'){
              agentRecording=aidata.value;
            }
          }
        }
      }
      if(leads.fname!=''){
        childName=(leads.fname+' '+leads.mname+ ' '+leads.lname);
      }
      if(leads.age!=''){
        childAge=leads.age;
      }

		var bgColorDemo="";
		html+='<div class="lead-table-wrapper">'
		+'<table class="table table-bordered font-12 border-radius-table mt-2 leadDataList" style="min-width:1450px;width:100%" id="leadDataList">'
			+'<thead class="bg-primary">'
			+'<tr>'
				+'<th class="text-white bold rounded-top-left-10 border-bottom-0 border-primary" style="border-top-color:transparent;border-right-color:#fff !important;width:230px;">';
				if(objectRights.discardPermission || USER_ID==leads.assignTo || USER_ID==leads.demoAssignTo){
					html+='<input type="hidden" value="'+leads.assignTo+'-'+leads.demoAssignTo+'" id="checkDemoMoved-'+leads.leadId+'"/>';
					html+='<input type="checkbox" class="checkLead" id="lead-'+leads.leadId+'" name="lead-move-another" value="'+leads.leadId+'" /> ';
				}else {
					html+='<input type="checkbox" disabled="disabled" class="checkLead" id="lead-'+leads.leadId+'" name="lead-move-another" value="'+leads.leadId+'" />';
				}
        // +objRights.countryOffsetTimezone
        // <span class="leadInfoTime"></span>
        // '+objRights.countryOffsetTimezone+'
				html+=''+leads.srNo+'.&nbsp;Filled details &nbsp;<span class="font-weight-bold">'+leads.leadNo+'</span> | Lead Score: <span class="'+lScoreColor+' text-white bold p-1 rounded">'+(leads.leadScore!=''?leads.leadScore:'0')+'</span><br><div class="d-flex justify-content-center"><p class="bold font-12 p-1 bg-white text-dark w-fit-content mt-1 mb-0 rounded" id="timerLeadDisplay_'+leads.leadId+'"></p></div>'
            var priorityColor='bg-warning text-dark';
            if(leads.priority=='Urgent'){
                priorityColor='bg-success';
            }else if(leads.priority=='Normal'){
                priorityColor='bg-orange';
            }else if(leads.priority=='Important'){
                priorityColor='bg-warning text-dark';
            }else{
              priorityColor='';
            }
					html+='</th>'
					+'<th class="text-white bold border-bottom-0" style="width:400px;">AI Agent updated details '+(leads.priority==''?'':'<span class="p-1 bold '+priorityColor+' rounded font-14 float-right"><i class="fa fa-paperclip fa-18"></i>&nbsp;&nbsp;'+leads.priority+'</span>')+'</th>'
					+'<th class="text-white bold border-bottom-0">Demo | call back details'
            +'<div> ';
						if(leads.demoFrom=='Demo by Website'){
							bgColorDemo="background-color:#7000FF !important;color:#fff";
							html+='<span class="float-right bold p-1 rounded" style="background-color:#7000FF !important;color:#fff">'+leads.demoFrom+'</span>';
						}else if(leads.demoFrom=='Demo by Link'){
							bgColorDemo="background-color:#2200FF !important;color:#fff";
							html+='<span class="float-right bold p-1 rounded" style="background-color:#2200FF !important;color:#fff">'+leads.demoFrom+'</span>';
						}
            html+='</div>'
          +'</th>';
					if(leads.leadLastCallList!=null && leads.leadLastCallList.length>0){
						html+='<th class="text-white bold border-bottom-0 text-center" style="width:250px;">Follow Ups</th>';
					}else{
						html+='<th class="text-white bold border-bottom-0 text-center" style="width:250px;">Follow Ups</th>';
					}
					html+='<th class="text-white bold border-bottom-0 rounded-top-right-10 text-center" style="border-top-color:transparent;border-right-color:transparent;width:90px;">Action</th>'
				+'</tr>'
			+'</thead>'
			+'<tbody class="lead-table-css" style="font-size:11px">'
			+'<input type="hidden" id="demoMovedTrue" />'
			+'<input type="hidden" id="blankDemo" />'
				+'<tr class="td-border-design ">'
					+'<td style="max-width:320px;min-width: 320px;vertical-align:top;" class="rounded-bottom-left-10 lead-row-'+leads.leadId+' '+ltype+'-'+(leads.callBadge!=''?leads.callBadge+'-bg':'')+'">'
						+'<table class="w-100">'
							+'<tbody>'

								+'<tr>'
									+'<th class="border-0 p-0"></th>'
									+'<td class="border-0 p-0 lead-row-td-'+leads.leadId+' '+ltype+'-'+(leads.callBadge!=''?leads.callBadge+'-leadno-bg':'')+'" ></td>'
								+'</tr>'

								+'<tr>'
									+'<th class="border-0 p-1">Source:</th>'
									+'<td class="border-0 p-1" >'+(leads.LeadSourceName)
                    if(objRights.discardPermission || USER_ID == leads.assignTo || USER_ID == leads.demoAssignTo){
                      html+='<span class="float-right">'
                        +'<a href="javascript:void(0);" onclick="callLeadsByLeadId(\'leadDataPopupForm\',\''+leads.leadId+'\',\''+USER_ID+'\',\'edit\',\'leadPopupForm\',\'B2C\','+objRights.discardPermission+');" >'
                          +'<i class="fa fa-edit"></i>&nbsp;Update'
                        +'</a>'
                      +'</span>';
                    }
                  +'</td>'
								+'</tr>'
                if(leads.leadOther!=''){
                  html += '<tr>'
                    +'<th class="border-0 p-1">Other Source:</th>'
                    +'<td class="border-0 p-1" >'+leads.leadOther+'</td>'
                  +'</tr>';
                }
                html+='<tr>'
									+'<th class="border-0 p-1">Created date & time:</th>'
									+'<td class="border-0 p-1">'+(leads.createdDateStr!=''?leads.createdDateStr:'N/A')+'</td>'
								+'</tr>'
                +'<tr>'
									+'<th class="border-0 p-1">Parent Name:</th>'
									+'<td class="border-0 p-1">'+(leads.gfname!=''?leads.gfname:'N/A') +' '+  leads.gmname +' '+ leads.glname +'</td>'
								+'</tr>'
                +'<tr>'
                  +'<th class="border-0 p-1">Grade: </th>'
                  +'<td class="border-0 p-1">'+(leads.standardName!=''?leads.standardName.replace('Grade',''):'N/A')+'</td>'
                +'</tr>'
                +'<tr>'
                  +'<th class="border-0 p-1">Email:</th>'
                  +'<td class="border-0 p-1">'+(leads.email!=''?leads.email:'N/A');
                  if(leads.email!=''){
                    if(leads.verifiedEmail>0){
                      html+='<span style="color:green;font-size:15px;" data-toggle="tooltip" data-placement="top" data-original-title="Email Verified"><i class="fa fa-check-circle"></i></span>';
                    }else if(leads.verifiedEmail<1){
                      html+='<span style="color:green;font-size:15px;"><i class="fa fa-remove"></i></span>';
                    }
                  }
                  html+='<br/>';
                  if(leads.emailAlternet!=''){
                    html+=(leads.emailAlternet!=''?leads.emailAlternet:'N/A');
                  }
                html+='</td>'
                +'</tr>'
                +'<tr>'
                  +'<th class="border-0 p-1">City | Country:</th>'
                  +'<td class="border-0 p-1">'+(leads.cityName!=''?leads.cityName:'N/A')+' | '+(leads.countryName!=''?leads.countryName:'N/A')+'</td>'
                +'</tr>'
                +'<tr>'
                  +'<th class="border-0 p-1">Mobile:</th>'
                  +'<td class="border-0 p-1">'+(leads.isdCode!=''?leads.isdCode:'')+' '+(leads.phone!=''?leads.phone:'N/A');
                    if(leads.isdCode!=''){
                      html+='<span>'
                        html+='<a href="https://api.whatsapp.com/send?phone='+(leads.phoneIsd!=''?leads.phoneIsd:'')+'" target="_target" class="position-relative">' 
                          html+='<img src="'+PATH_FOLDER_IMAGE+'watsapp-icon.png" width="16px" />';
                          
                            if(leads.whatsAppVerifiedStatus=='N'){}
                            else{
                              if(leads.whatsAppScbStatus=='N'){
                                html+='<span style="left: 9px;color: black;font-size: 12x;position: absolute;top: -7px;" data-toggle="tooltip" data-placement="top" data-original-title="Wati Message Sent"><i class="fa fa-minus-circle"></i></span>';
                              }else{
                                if(leads.whatsAppVerifiedStatus=='Y'){
                                  html+='<span style="left: 9px;color: green;font-size: 12x;position: absolute;top: -7px;" data-toggle="tooltip" data-placement="top" data-original-title="Wati Message Sent"><i class="fa fa-check-circle"></i></span>';
                                }else if(leads.whatsAppVerifiedStatus=='N'){
                                  html+='<span style="left: 9px;color: red;font-size: 12x;position: absolute;top: -7px;" data-toggle="tooltip" data-placement="top" data-original-title="Wati Message Not Sent"><i class="fa fa-times-circle"></i></span>';
                                }
                              }
                            }
                        html+='</a>'
                      +'</span>';
                    }
                    html+='<br/>';
                    if(leads.phoneNoAlter!=''){
                      html+=(leads.phoneNoAlter!=''?leads.isdCodeAlter:'') +' '+(leads.phoneNoAlter!=''?leads.phoneNoAlter:'') ;
                      html+='<a href="https://api.whatsapp.com/send?phone='+(leads.altrphoneIsd!=''?leads.altrphoneIsd:'')+'" target="_target"> <img src="'+PATH_FOLDER_IMAGE+'watsapp-icon.png" width="16px" /></a>';
                    }
                  html+='</td>'
                +'</tr>'
                +'<tr>'
									+'<th class="border-0 p-1">Lead Status:</th>'
									+'<td class="border-0 p-1 leadlist-status-'+leads.leadId+'">'+(leads.leadStatus!=''?leads.leadStatus:'N/A')+'</td>'
								+'</tr>'
								+'<tr>'
									+'<th class="border-0 p-1">Assigned To:</th>'
									+'<td class="border-0 p-1">'+(leads.assignName!=''?leads.assignName:'N/A')+'</td>'
								+'</tr>'
                +'<tr>'
									+'<th class="border-0 p-1">Added By:</th>'
									+'<td class="border-0 p-1">'+(leads.userName!=''?leads.userName:'N/A')+'</td>'
								+'</tr>';
								if(leads.leadSupportToName!=''){
									html+='<tr>'
										+'<th class="border-0 p-1">Supported By:</th>'
										+'<td class="border-0 p-1">'+(leads.leadSupportToName!=''?leads.leadSupportToName:'N/A')+'</td>'
									+'</tr>';
								}

								html+='<tr>'
									+'<th class="border-0 p-1">UTM:</th>'
									+'<td class="border-0 p-1">'
										+'<div class="dropdown d-inline-block">'
											+'<button type="button" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown" class="dropdown-toggle btn btn-sm btn-primary">View More Details</button>'
											+'<div tabindex="-1" role="menu" aria-hidden="true" class="dropdown-menu-md dropdown-menu p-2" x-placement="bottom-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 32px, 0px);max-width:600px;overflow-x:auto;">'
											+'<table class="w-100"><tbody>';
												if(leads.leadSourceId==4){
													html+='<tr class="border-bottom">'
																+'<th class="border-0 p-0 font-12 vertical-align-top pr-1">Source:</th>'
																+'<td class="border-0 p-0 font-12 vertical-align-top">'+(leads.utmSource!=''?leads.utmSource:'N/A')+'</td>'
															+'</tr>'
															+'<tr class="border-bottom">'
																+'<th class="border-0 p-0 font-12 vertical-align-top pr-1">Ad:</th>'
																+'<td class="border-0 p-0 font-12 vertical-align-top">'+(leads.utmMedium!=''?leads.utmMedium:'N/A')+'</td>'
															+'</tr>'
															+'<tr class="border-bottom">'
																+'<th class="border-0 p-0 font-12 vertical-align-top pr-1">Ad Set:</th>'
																+'<td class="border-0 p-0 font-12 vertical-align-top">'+(leads.utmDescription!=''?leads.utmDescription:'N/A')+'</td>'
															+'</tr>'
															+'<tr class="border-bottom">'
																+'<th class="border-0 p-0 font-12 vertical-align-top pr-1">Campaign:</th>'
																+'<td class="border-0 p-0 font-12 vertical-align-top utmCampaign-'+leads.leadId+'">'+(leads.utmCampaign!=''?leads.utmCampaign:'N/A')+'</td>'
															+'</tr>'
															+'<tr class="border-bottom">'
																+'<th class="border-0 p-0 font-12 vertical-align-top pr-1">Is Organic:</th>'
																+'<td class="border-0 p-0 font-12 vertical-align-top">'+(leads.utmTerm!=''?leads.utmTerm:'N/A')+'</td>'
															+'</tr>';
													if(leads.leadPlatform!=''){
														html+='<tr class="border-bottom">'
															+'<th class="border-0 p-0 font-12 vertical-align-top pr-1">Platform</th>'
															+'<td class="border-0 p-0 font-12 vertical-align-top"><img class="report-icon" src="'+PATH_FOLDER_IMAGE2+leads.leadPlatform+'.png'+SCRIPT_VERSION+'" width=\"16\" height=\"16\"></td>';
														+'</tr>';
													}
													if(leads.fbImageUrl!=''){
														html+='<tr>'
															+'<th colspan="2" class="border-0">'
																+'<a href="'+leads.fbImageUrl+'" class="btn btn-primary btn-sm" target="_blank">View Form Image</a>'
															+'</td>';
														+'</tr>';
													}

												}else{
													html+='<tr>'
																+'<th class="border-0 p-0 font-12">Source:</th>'
																+'<td class="border-0 p-0 font-12">'+(leads.utmSource!=''?leads.utmSource:'N/A')+'</td>'
															+'</tr>'
															+'<tr>'
																+'<th class="border-0 p-0 font-12">Medium:</th>'
																+'<td class="border-0 p-0 font-12">'+(leads.utmMedium!=''?leads.utmMedium:'N/A')+'</td>'
															+'</tr>'
															+'<tr>'
																+'<th class="border-0 p-0 font-12">Description:</th>'
																+'<td class="border-0 p-0 font-12">'+(leads.utmDescription!=''?leads.utmDescription:'N/A')+'</td>'
															+'</tr>'
															+'<tr>'
																+'<th class="border-0 p-0 font-12">Campaign:</th>'
																+'<td class="border-0 p-0 font-12 utmCampaign-'+leads.leadId+'">'+(leads.utmCampaign!=''?leads.utmCampaign:'N/A')+'</td>'
															+'</tr>'
															+'<tr>'
																+'<th class="border-0 p-0 font-12">Is Organic:</th>'
																+'<td class="border-0 p-0 font-12">'+(leads.utmTerm!=''?leads.utmTerm:'N/A')+'</td>'
															+'</tr>'
															+'<tr>'
																+'<th class="border-0 p-0 font-12">Gclid:</th>'
																+'<td class="border-0 p-0 font-12">'+(leads.gclid!=''?leads.gclid:'N/A')+'</td>'
															+'</tr>';
														
												}
												html+='<tr>'
															+'<th class="border-0 p-0 font-12">Landing URL:</th>'
															+'<td class="border-0 p-0 font-12">'+(leads.leadLandingUrl)+'</td>'
														+'</tr>'
														+'<tr>'
															+'<th class="border-0 p-0 font-12">IP:</th>'
															+'<td class="border-0 p-0 font-12">'+(leads.ip)+'</td>'
														+'</tr>'
														+'<tr>'
															+'<th class="border-0 p-0 font-12">Payment IP:</th>'
															+'<td class="border-0 p-0 font-12">'+(leads.paymentIp)+'</td>'
														+'</tr>'
														+'<tr>'
															+'<th class="border-0 p-0 font-12">OS:</th>'
															+'<td class="border-0 p-0 font-12">'+(leads.os)+'</td>'
														+'</tr>'
														+'<tr>'
															+'<th class="border-0 p-0 font-12">SOURCE:</th>'
															+'<td class="border-0 p-0 font-12">'+(leads.sourceOriginal)+'</td>'
														+'</tr>';
											html+='</tbody></table></div>'
									+'</td>'
								+'</tr>';
								
                html+='<tr><td class="border-0 p-1 bold font-14" colspan="2" id="timerLeadDisplay_'+leads.leadId+'"></td></tr>';
									if(objRights.discardPermission || USER_ID==leads.assignTo){
										html+='<tr>'
										// +'<th class="border-0 p-1">Campaign:</th>'
											+'<td class="border-0 p-1" colspan="2">'
											+'<div class="d-flex align-items-center selectcampain-wrapper" style="width: 250px;">'
												+'<select class="selectcampain" name="campainName" id="campainName_'+leads.leadId+'">'
												+'<option value="" data-campain="">--Select Campaign--</option>';
												for (let c = 0; c < campaignList.length; c++) {
													const campaign = campaignList[c];
													//console.log("value=>"+campaign.value);
													html+='<option value="'+campaign.key+'" data-campain="'+campaign.value+'" '+(leads.utmCampaign==campaign.value?'selected':'') +'>'+campaign.value+' ('+campaign.extra+')</option>';
												}
												html+='</select>'
												+'<button class="ml-2 mr-1 btn btn-sm btn-info" id="saveCampaign" onclick="saveCampaignLead(\''+leads.leadId+'\',\'campainName_'+leads.leadId+'\', \'new-leadcampaign\');">Save</button>'
											+'</div>'
											+'</td>'
										+'</tr>';
									}
									html+='<tr><td class="border-0 p-1" colspan="2">';
									if(objRights.discardPermission || USER_ID==leads.assignTo){
										html+='<div role="" class="mb-2 btn-group-sm btn-group-toggle text-left" data-toggle="buttons">'
											+'<label class="btn btn-outline-success mr-1 '+(leads.leadCategory=='Hot'?'active':'')+'">'
											+'<input type="radio"  name="leadCategory'+leads.leadId+'" id="hot'+leads.leadId+'" value="Hot" autocomplete="off" '+(leads.leadCategory=='Hot'?'checked':'')+' onchange="saveCategoryLead(\''+leads.leadId+'\',\'hot'+leads.leadId+'\');"> Hot'
											+'</label>'
											+'<label class="btn btn-outline-primary mr-1 '+(leads.leadCategory=='Cold'?'active':'')+'">'
											+'<input type="radio"  name="leadCategory'+leads.leadId+'" id="cold'+leads.leadId+'" value="Cold" autocomplete="off" '+(leads.leadCategory=='Cold'?'checked':'')+' onchange="saveCategoryLead(\''+leads.leadId+'\',\'cold'+leads.leadId+'\');"> Cold'
											+'</label>'
											+'<label class="btn btn-outline-warning mr-1 '+(leads.leadCategory=='Warm'?'active':'')+'">'
											+'<input type="radio" name="leadCategory'+leads.leadId+'" id="warm'+leads.leadId+'" value="Warm" autocomplete="off" '+(leads.leadCategory=='Warm'?'checked':'')+' onchange="saveCategoryLead(\''+leads.leadId+'\',\'warm'+leads.leadId+'\');"> Warm'
											+'</label>'
                      +'</div>';
									}
								html+='</td></tr>'
                
							+'</tbody>'
						+'</table>'
					+'</td>';
					//style="max-width: 696px;min-width: 696px;"
          
         
					html+='<td class="p-0 lead-row-'+leads.leadId+' '+ltype+'-'+(leads.callBadge!=''?leads.callBadge+'-bg':'')+'" style="vertical-align:top">'
						+'<table class="w-100">'
							+'<tbody>'
								+'<tr>'
									+'<td class="border-0">'
										+'<table class="w-100">'
											+'<tbody>'
												+'<tr>'
													+'<th class="border-0 p-1" style="width:165px">Child Name: </th>'
													+'<td class="border-0 p-1">'+(childName)
                            if(objRights.discardPermission || USER_ID == leads.assignTo || USER_ID == leads.demoAssignTo){
														  html+='<span class="float-right">'
                                +'<a href="javascript:void(0);" onclick="callLeadsByLeadId(\'leadDataPopupForm\',\''+leads.leadId+'\',\''+USER_ID+'\',\'edit\',\'leadPopupForm\',\'B2C\','+objRights.discardPermission+');" >'
                                  +'<i class="fa fa-edit"></i>&nbsp;Update'
                                +'</a>'
														  +'</span>';
													  }
                          html+='</td>'
												+'</tr>'
                        +'<tr>'
                          +'<th class="border-0 p-1" style="width:165px">Age:</th>'
                          +'<td class="border-0 p-1">'+childAge+'</td>'
                        +'</tr>'
                        +'<tr>'
                          +'<th class="border-0 p-1">Grade: </th>'
                          +'<td class="border-0 p-1">'+childGrade+'</td>'
                        +'</tr>'
                        +'<tr>'
                          +'<th class="border-0 p-1">Current Curriculum: </th>'
                          +'<td class="border-0 p-1">'+currentCurriculum+'</td>'
                        +'</tr>'
                        if(leads.learningProgram!=''){
                          html+='<tr>'
                            +'<th class="border-0 p-1" style="width:165px">Interested Learning Program: </th>'
                            +'<td class="border-0 p-1">'+(leads.learningProgram!=''?leads.learningProgram:'N/A')+'</td>'
                          +'</tr>';
                        }
                          
												// +'<tr>'
												// 	+'<th class="border-0 p-1" style="width:165px">Age: </th>'
												// 	+'<td class="border-0 p-1">'+(leads.age!=''?leads.age:'N/A')+'</td>'
												// +'</tr>'
												// +'<tr>'
												// 	+'<th class="border-0 p-1" style="width:165px">Communication Prefrence: </th>'
												// 	+'<td class="border-0 p-1">'+(leads.pref!=''?leads.pref:'N/A')+'</td>'
												// +'</tr>'
												// +'<tr>'
												// 	+'<th class="border-0 p-1" style="width:165px">Relation: </th>'
												// 	+'<td class="border-0 p-1">'+(leads.relation!=''?leads.relation:'N/A')+'</td>'
												// +'</tr>'

												html+='<tr>'
													+'<th class="border-0 p-1" style="width:165px;background-color:'+(leads.leadStatus=='Converted'?'#baf3cd':'#f0ddc1')+';">Lead To Enrolled:</th>'
													+'<td class="border-0 p-1">'+(leads.leadTotalDay!=''?leads.leadTotalDay:'0')+'</td>'
												+'</tr>'
												+'<tr>'
													+'<th class="border-0 p-1">Lead’s Current Time:</th>'
													+'<td class="border-0 p-1 font-12" id="leadCurTimeText_'+leads.leadId+'"></td>'
												+'</tr>'
                        +'<tr>'
													+'<th class="border-0 p-1">Right time to call:</th>'
													+'<td class="border-0 p-1 bold">'+(leads.leadRightStartTimeCall)+'</td>'
												+'</tr>'
												+'<tr>'
													+'<td colspan="2"  class="border-0 p-1 leadtagstatus_'+leads.leadNo+'"></td>'
												+'</tr>'
                        +'<tr>'
													+'<th class="border-0 p-1">Any remarks for the academic expert:</th>'
													+'<td class="border-0 p-1">'+agentRemark+'</td>'
												+'</tr>'
												+'<th class="border-0 p-1" style="width:165px">Message:</th>'
												+'<td class="border-0 p-1">'
													+'<div class="dropdown d-inline-block" style="position: inherit;">'
														+'<button type="button" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown" class="dropdown-toggle btn btn-sm btn-primary">View Message</button>'
														+'<div tabindex="-1" role="menu" aria-hidden="true" class="dropdown-menu-lg dropdown-menu p-2" x-placement="bottom-start" style="max-width: 250px;">'
															+'<p class="m-0">'+(leads.remarks!=''?leads.remarks:'N/A')+'</p>'
														+'</div>'
													+'</div>'
												+'</td>'
                        +'</tr>';
                        if(leads.aidataList!=null && leads.aidataList.length>0){
                        html+='<tr>'
                        +'<th class="border-0 p-1" style="width:165px">Agent:</th>'
												+'<td class="border-0 p-1">'
													+'<div class="dropdown d-inline-block" style="position: inherit;">'
														+'<button type="button" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown" class="dropdown-toggle btn btn-sm btn-primary">View Agent Detail</button>'
														+'<div tabindex="-1" role="menu" aria-hidden="true" class="dropdown-menu-lg dropdown-menu p-2" x-placement="bottom-start" style="max-width: 250px;">';
                        
                          aidataList=leads.aidataList;
                          html+='<table class="table table-bordered font-11 mt-2">';
                          for (let c = 0; c < aidataList.length; c++) {
                            const aidata = aidataList[c];
                            if(aidata.key=='total_duration_seconds'){
                              var timesend=secondsToHMS(aidata.value);
                              html+='<tr><td>total_duration (HH:MM:SS)</td><td>'+timesend+'</td></tr>';
                            }else{
                              if(aidata.value!='' 
                                && aidata.value!='Any/Both'
                                && aidata.value!='ended'
                                && aidata.value!='call_analyzed'
                                && aidata.key!='is_confirmed'
                                && aidata.key!='call_summary'
                                && aidata.key!='recording_url'
                                && aidata.key!='child_name'
                                && aidata.key!='child_age'
                              ){
                                html+='<tr><td>'+aidata.key+'</td><td>'+aidata.value+'</td></tr>';
                              }
                            }
                          }
                           html+='</table>'
														+'</div>'
													+'</div>'
												+'</td>'
											+'</tr>';
                        }
											html+='</tbody>'
										+'</table>'
                    html += 
                    '<div class="d-flex align-items-center mb-1" style="gap:10px;">'
                        +'<span class="ml-1">Call recording:</span>'
                        +( agentRecording 
                            ? '<audio controls style="height:40px; transform:scale(0.9);">'
                                +'<source src="'+agentRecording+'">'
                                +'Your browser does not support the audio element.'
                            +'</audio>'
                            : '<span style="margin-left: 22%;">N/A</span>'
                        )
                    +'</div>'
									+'</td>'
								+'</tr>'
							+'</tbody>'
						+'</table>'
					+'</td>'
					+'<td class="p-0 lead-row-'+leads.leadId+' '+ltype+'-'+(leads.callBadge!=''?leads.callBadge+'-bg':'')+'" style="width: 350px;vertical-align:top;">'
					
						+'<table class="w-100 demotable" style="border: solid #027ffe 1px;background-color: #D5E3FC;">'
							+'<tbody>';
               if(leads.language!=''){
                  html+='<tr>'
                    +'<th class="border-0 p-1" style="width:165px">Preferred Language: </th>'
                    +'<td class="border-0 p-1">'+(leads.language!=''?leads.language:'N/A')+'</td>'
                  +'</tr>';
                }
                if(leads.leadPreviousDate){
                   html+='<tr>'
                    +'<th class="border-0 p-1" style="width:165px">Previous Date & time : </th>'
                    +'<td class="border-0 p-1">'+(leads.leadPreviousDate?leads.leadPreviousDate:'N/A')+'</td>'
                  +'</tr>';
                }
							html+='<tr class="" >'
									+'<th class="border-0 p-1">Date & Time:</th>'
									+'<td class="border-0 p-1">'+(leads.leadDemoIstDate!=''?leads.leadDemoIstDate:'N/A')+'</td>'
								+'</tr>';
								html+='<tr  class="" >'
									+'<th class="border-0 p-1">Demo Status:</th>'
									+'<td class="border-0 p-1 demo-status-row-'+leads.leadId+'">'+(leads.demoStatus!=''?leads.demoStatus:'N/A')+'</td>'
								+'</tr>'
								+'<tr  class="" >'
									+'<th class="border-0 p-1">Assigned To:</th>'
									+'<td class="border-0 p-1">'+(leads.demoAssignName!=''?leads.demoAssignName:'N/A')+'</td>'
								+'</tr>'
								+'</tbody>'
							+'</table>'
							+'<table class="w-100 border-bottom demotable">'
							+'<tbody>'
              +'<tr>'
                +'<th class="border-0 p-1">Demo confirmation:</th>'
                +'<td class="border-0 p-1">'+(leads.demoConfirmation=='Y'?'Yes':'No')+'</td>'
              +'</tr>';
              if (leads.callbackConvertedDate!=="N/A"){
                html += '<tr><th class="border-0 p-1">Type:</th><td class="border-0 p-1" >Callback</td></tr>';
                html += '<tr class="bg-primary p-1 text-white">'
                  +'<th class="border-0 p-1">Callback Time:</th>'
                  +'<td class="border-0 p-1" >'+leads.callbackConvertedDate+'('+USER_TIMEZONE+')'+'</td>'
                +'</tr>';
              }
							html+='<tr>'
								if(objRights.discardPermission){
									html+='<tr>'
										+'<th class="border-0 p-1">Connected Through:</th>'
										+'<td class="border-0 p-1">'+(leads.followup!=''?leads.followup:'N/A')+'</td>'
									+'</tr>';
								}
								html+='<tr>'
										+'<th class="border-0 p-1">Last Date:</th>'
										+'<td class="border-0 p-1 nextSchedule-'+leads.leadId+' '+ltype+'-'+(leads.callBadge!=''?leads.callBadge+'-leadno-bg':'')+'">'+(leads.leadFollowDate!=''?leads.leadFollowDate:'N/A')+'</td>'
									+'</tr>';
								if(leads.tantativeDate){
									html+='<tr>'
										+'<th class="border-0 p-1">Tentative Date to Enrolled:</th>'
										+'<td class="border-0 p-1">'+(leads.tantativeDate!=''?leads.tantativeDate:'N/A')+'</td>'
									+'</tr>';
								}
								
								html+='<tr>'
										+'<th class="border-0 p-1">Next Followup:</th>'
										+'<td class="border-0 p-1  nextFollow-'+leads.leadId+' '+ltype+'-'+(leads.callBadge!=''?leads.callBadge+'-leadno-bg':'')+'">';
											if(leads.nextFollowupDate!=''){
												html+=''+leads.nextFollowupDate;
											}else if(leads.nextFollowupDate==''){
												html+=(leads.callStatus!=''?leads.callStatus:'N/A');
											}else{
												html+='N/A';
											}
										html+='</td>'
									+'</tr>';

								if(leads.leadFollowUser){
									html+='<tr>'
										+'<th class="border-0 p-1">Followup By:</th>'
										+'<td class="border-0 p-1 ">'+(leads.leadFollowUser!=''?leads.leadFollowUser:'N/A')+'</td>'
									 +'</tr>';
									
								}	
								html+='<tr>'
									+'<th class="border-0 p-1" style="width:165px">Last Remarks:</th>'
									+'<td class="border-0 p-1 leadlist-remark-'+leads.leadId+' '+ltype+'-'+(leads.callBadge!=''?leads.callBadge+'-leadno-bg':'')+'">';
                  if (leads.followupRemark.includes("Lead already exists.")) {
                      console.log("Contains jQuery!");
                      var arrf = leads.followupRemark.split("-"); 
                      var ldnoStr=arrf[0];
                      var ldno=arrf[1];
                      var urlSend = '/dashboard/lead-data-list?moduleId=111&leadId='+ldno+'&leadFrom=LEAD&clickFrom=list&startDate=&endDate=&country=0&campaign=&currentPage=0&euid='+ENCRYPTED_USER_ID+'&leadType=B2C';
                          html+=ldnoStr+" - "; 
                          html+="<a href=\"javascript:void(0)\" onclick=\"getAsPost('"+urlSend+"');\">";
                          html+=ldno;
                          html+='</a>';
                  }else{
                    html+=(leads.followupRemark!=''?leads.followupRemark:'N/A');
                  }

                  if(objRights.discardPermission ){
                    if(USER_ROLE=='DIRECTOR'){
                      html+='<tr>'
                        +'<th class="border-0 p-1">Call status:</th>'
                        +'<td class="border-0 p-1">'+(leads.zadarmaCallCount>0?'<i class="fa fa-check-circle fa-lg text-primary"></i>':'<i class="fa fa-times fa-lg text-danger" aria-hidden="true"></i>')+' ('+leads.zadarmaCallSecond+'/ '+leads.zadarmaCallCount+')</td>'
                      +'</tr>';
                    }
                    html+='<tr>'
                      +'<th class="border-0 p-1">Step:</th>'
                      +'<td class="border-0 p-1">'+(leads.curentStage!=''?leads.curentStage:'N/A')+'</td>'
                    +'</tr>';
                  }
                  html+='<tr>'
                  
										// +'<div class="dropdown d-inline-block" style="position: inherit;">'
										// 	+'<button type="button" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown" class="dropdown-toggle btn btn-sm btn-primary">View Remarks</button>'
										// 	+'<div tabindex="-1" role="menu" aria-hidden="true" class="dropdown-menu-lg dropdown-menu p-2" x-placement="bottom-start" style="max-width: 250px;">'
										// 		+'<p class="m-0 leadlist-remark-'+leads.leadId+'">'+(leads.followupRemark!=''?leads.followupRemark:'N/A')+'</p>'
										// 	+'</div>'
										// +'</div>'
									+'</td>'
								+'</tr>';
								if(objRights.discardPermission || USER_ID == leads.assignTo || USER_ID == leads.demoAssignTo  || USER_ID == leads.leadSupportTo){
									let isRemarkMandatory = (leaddata.remarkMendatory && ( leaddata.minRemarkCount > 0))
									html+='<tr>'
									+'<td colspan="2" class="border-0 p-0 pr-1">'
										+'<table style="width:100%;" id="remarkTable">'
											+'<tbody>'
												+'<tr><td>'
													+'<select name="leadStatus-'+leads.leadId+'" id="leadStatus-'+leads.leadId+'" class="leadStatus-followup" style="width:200px !important; height:30px;">'
														+'<option value="">Select Status</option>';
													for (let s = 0; s < statusList.length; s++) {
														const statusL = statusList[s];
														html+='<option value="'+statusL.value+'">'+statusL.value+'</option>';
													}	
													html+='</select>'
												+'</td></tr>'
												+'<tr>'
													+'<td>'
														+'<textarea class="form-control followupRemarks-suggestion font-12 '
														+ (isRemarkMandatory ? 'lead_list_remarks ' : '') + 'remarks" '
														+ 'data-leadid="'+leads.leadId+'" '
														+ 'name="followupRemarks-'+leads.leadId+'" '
														+ 'id="followupRemarks-'+leads.leadId+'" '
														+ 'rows="2" style="height: 50px !important;" '
														+ (isRemarkMandatory ? 'minlength="'+leaddata.minRemarkCount+'" required' : '') + '></textarea>'
														+ (isRemarkMandatory ? '<small id="leadListRemarksCounter_'+leads.leadId+'" class="text-muted">0 / '+leaddata.minRemarkCount+'</small>' : '')
														+'<div class="suggestionslead" id="suggestions-'+leads.leadId+'" style="max-height: 100px; overflow: auto;"></div>'
													+'</td>'
												+'</tr>'
												+'<tr>'
													+'<td>'
														+'<button class="ml-2 mr-1 btn btn-sm btn-info float-right" id="updateFollowup" onclick="submitFollowupSaveFromLeadList(\'followupSaveForm\', \''+leads.leadId+'\', \''+objRights.leadType+'\', \''+objRights.moduleId+'\',\'new-lead\','+leaddata.remarkMendatory+','+leaddata.minRemarkCount+');">Follow-up</button>'
													+'</td>'
												+'</tr>'
											+'</tbody>'
										+'</table>'
									+'</td>'
									+'</tr>';
								}
										
						html+='</tbody>'
						+'</table>'
					+'</td>'//margin-top:-40px !important
					+'<td class="p-0 lead-row-'+leads.leadId+' '+ltype+'-'+(leads.callBadge!=''?leads.callBadge+'-bg':'')+'" style="vertical-align:top;">'
						if((leads.leadLastCallList!='' && leads.leadLastCallList.length>0)){
							html+='<ul class="follow-up-accordian m-0 p-0 overflow-auto followup-remark-'+leads.leadNo+'" style="max-height: 325px;">';
						}else{
							html+='<ul class="follow-up-accordian m-0 p-0 overflow-auto followup-remark-'+leads.leadNo+'" style="max-height: 325px;">'
							+'<li class="follow-up-accordian-active text-center mt-2">'
							+'<span class="border p-2  d-inline-block rounded-10 font-weight-bold text-primary" style="font-size:14px; min-width: 150px;">No follow ups yet</span>'
							+'</li>';
						}

					//Follow Up-'+(leadCall.srno)+'
							for(var l=0; l<leads.leadLastCallList.length>0;l++){
								leadCall=leads.leadLastCallList[l];
								console.log(leadCall.leadFollowStatus);
								
								html+='<li class=" '+(l==0?'follow-up-accordian-active':'')+'">'
								+'<span class="cursor follow-up-no text-primary p-2 text-center border-primary full bold">'+(leadCall.leadFollowStatus)+' <i class="fa '+(l==0?'fa-angle-up':'fa-angle-down')+' float-right" style="line-height: 20px;"></i></span>'
								+'<div class="follow-up-content text-center" style="'+(l==0?'display: block':'')+'">'
									+'<div class="dropdown d-inline-block text-center my-2" style="position: inherit;">'
										+'<button type="button" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown" class="dropdown-toggle btn btn-sm btn-primary">View Follow Up</button>'
										+'<div tabindex="-1" role="menu" aria-hidden="true" class="dropdown-menu-md dropdown-menu p-2" x-placement="bottom-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 32px, 0px);font-size:11px;">'
											+'<table class="w-100">'
												+'<tr>'
													+'<th class="p-1 border-0">Last Followup Date:</th>'
													+'<td class="p-1 border-0" id="connectedTh">'+(leadCall.callscheduleDateString)+'</td>'
												+'</tr>'
												+'<tr>'
													+'<th class="p-1 border-0">Connected Through:</th>'
													+'<td class="p-1 border-0" id="connectedTh">'+(leadCall.followupBy)+'</td>'
												+'</tr>'
												+'<tr>'
													+'<th class="p-1 border-0">Connected With:</th>'
													+'<td class="p-1 border-0" id="connectWith">'+(leadCall.toCall)+'</td>'
												+'</tr>'
												+'<tr>'
													+'<th class="p-1 border-0">Lead Status & Category:</th>'
													+'<td class="p-1 border-0" id="leadFollowStatusCategory">'+(leadCall.leadFollowStatus)+'</td>'
												+'</tr>'
												+'<tr>'
													+'<th class="p-1 border-0">Next Follow-up:</th>'
													+'<td class="p-1 border-0" id="nextFollowStatus">'
													+(leadCall.callStatus!=''?leadCall.callStatus:'')
													+(leadCall.nextCallscheduleDateString!=''?leadCall.nextCallscheduleDateString:'')
													+'</td>'
												+'</tr>'
												+'<tr>'
													+'<th class="p-1 border-0">Remarks:</th>'
													+'<td class="p-1 border-0 text-justify" id="callRemark" style="max-width: 250px;">'+(leadCall.followRemarks!=''?leadCall.followRemarks:'N/A')+'</td>'
												+'</tr>'
											+'</table>'
										+'</div>'
									+'</div>'
								+'</div>'
							+'</li>';
							}	
						html+='</ul>'
					+'</td>'
					+'<td class="rounded-bottom-right-10 text-center pt-3 lead-row-'+leads.leadId+' '+ltype+'-'+(leads.callBadge!=''?leads.callBadge+'-bg':'')+'" style="vertical-align:top;">';
					if(objRights.discardPermission || USER_ID == leads.assignTo || USER_ID == leads.demoAssignTo){
						if(leads.leadStatus=='Unassigned'){
							html+='<a href="javascript:void(0);" data-toggle="tooltip" data-placement="top" data-original-title="Update" onclick="callGetOpenFollowup(\'followupSaveForm\',\''+leads.leadId+'\',\''+USER_ID+'\',\'edit\',\''+ objRights.currentPage +'\',\'leadFollowupForm\',\'B2C\',\'Y\','+leaddata.remarkMendatory+','+leaddata.minRemarkCount+');" ><i class="fa fa-edit" style="font-size:16px;margin-bottom:4px;padding:4px;"></i></a><br/>';
							if(objRights.discardPermission && objRights.leadFrom=='ARCHIVEDLEAD' && roleModule.updated=='Y'){
								var disFun = "discardLeadsData('"+leads.leadId+"','"+objRights.moduleId+"', '"+objRights.leadFrom+"','"+leads.LeadSourceName+"','"+USER_ID+"',true,'"+leaddata.currentPage+"','B2C','new-leads')";
								var discardFun ="return showNewDiscardLeadModelFunction('"+disFun+"','"+leads.LeadSourceName+"','"+leads.fname+"','"+leads.email+"', '"+leads.phone+"','"+leads.addedDateTime+"','"+leads.leadNo+"')";
								html+='<a href="javascript:void(0);" data-toggle="tooltip" data-placement="top" data-original-title="Discard" onclick="'+discardFun+'"><i class="fa fa-trash" aria-hidden="true" style="font-size:16px;margin-bottom:4px;padding:4px;"></i></a><br/>';
							}
						}else{
							if(roleModule.updated=='Y' ){
								html+='<a href="javascript:void(0);" data-toggle="tooltip" data-placement="top" data-original-title="Update" onclick="callGetOpenFollowup(\'followupSaveForm\',\''+leads.leadId+'\',\''+USER_ID+'\',\'edit\',\''+ objRights.currentPage +'\',\'leadFollowupForm\',\'B2C\',\'Y\','+leaddata.remarkMendatory+','+leaddata.minRemarkCount+');" >'
									+'<i class="fa fa-edit" style="font-size:16px;margin-bottom:4px;padding:4px;"></i></a><br/>';
							}
							if(roleModule.updated=='Y' ){
								html+='<a href="javascript:void(0);" data-toggle="tooltip" data-placement="top" data-original-title="Clone" onclick="callLeadsByLeadId(\'leadDataPopupForm\',\''+leads.leadId+'\',\''+USER_ID+'\',\'addLeadClone\',\'leadPopupForm\',\'B2C\','+objRights.discardPermission+');" >'
									+'<i class="fa fa-clone" aria-hidden="true" style="font-size:16px;margin-bottom:4px;padding:4px;"></i></a><br/>';
							}
							if(roleModule.updated=='Y' ){
                if(USER_ROLE != "B2B_PARTNER"){
                  html+='<a href="javascript:void(0);" data-toggle="tooltip" data-placement="top" data-original-title="Partner with B2B" onclick="callLeadsByLeadId(\'leadDataPopupB2BForm\',\''+leads.leadId+'\',\''+USER_ID+'\',\'addLeadClone\',\'leadPopupB2BForm\',\'B2C-B2B\','+objRights.discardPermission+');" >'
                    +'<i class="fa fa-handshake" aria-hidden="true" style="font-size:16px;margin-bottom:4px;padding:4px;"></i></a><br/>';
							  }
							}
							html+='<a href="javascript:void(0);" data-toggle="tooltip" data-placement="top" data-original-title="Activity logs" onclick="getAsPost(\'/dashboard/lead-followup-log-data?moduleId=moduleId='+objRights.moduleId+'&leadNo='+leads.leadNo+'&leadType=B2C\')">'
									+'<i class="fa fa-tasks" aria-hidden="true" style="font-size:16px;margin-bottom:4px;padding:4px;"></i></a><br/>';
							html+='<a href="javascript:void(0);" data-toggle="tooltip" data-placement="top" data-original-title="Update chat support" onclick="renderChatContent(\''+objRights.discardPermission+'\',\''+USER_ID+'\',\''+leads.leadId+'\')">'
									+'<i class="fa fa-comment" aria-hidden="true" style="font-size:16px;margin-bottom:4px;padding:4px;"></i></a><br/>';	
							if(objRights.discardPermission && objRights.leadFrom=='ARCHIVEDLEAD' && roleAndModule.updated=='Y'){
								//var disFun = "discardLeadsData('"+leads.leadId+"','"+objRights.moduleId+"', '"+objRights.leadFrom+"','"+leads.LeadSourceName+"','"+USER_ID+"',true,'"+leaddata.currentPage+"','B2C','new-leads')";
								var disFun = 'discardLeadsData(\\\''+leads.leadId+'\\\',\\\''+objRights.moduleId+'\\\',\\\''+objRights.leadFrom+'\\\',\\\''+leads.LeadSourceName+'\\\',\\\''+USER_ID+'\\\', \\\'true\\\', \\\''+leaddata.currentPage+'\\\',\\\'B2C\\\',\\\'new-leads\\\')';
								var discardFun ="return showNewDiscardLeadModelFunction(\'"+disFun+"\','"+leads.LeadSourceName+"','"+leads.fname+"','"+leads.email+"', '"+leads.phone+"','"+leads.addedDateTime+"','"+leads.leadNo+"')";
								html+='<a href="javascript:void(0);" onclick="'+discardFun+'"><i class="fa fa-trash text-danger"></i>&nbsp;Discard</a><br/>';
							}	
							if(leads.leadStatus!='Converted'){
								if(objRights.discardPermission){
									var disFun = 'discardLeadsData(\\\''+leads.leadId+'\\\',\\\''+objRights.moduleId+'\\\',\\\''+objRights.leadFrom+'\\\',\\\''+leads.LeadSourceName+'\\\',\\\''+USER_ID+'\\\', \\\'true\\\', \\\''+leaddata.currentPage+'\\\',\\\'B2C\\\',\\\'new-leads\\\')';
									var discardFun ="return showNewDiscardLeadModelFunction(\'"+disFun+"\','"+leads.LeadSourceName+"','"+leads.fname+"','"+leads.email+"', '"+leads.phone+"','"+leads.addedDateTime+"','"+leads.leadNo+"')";
									html+='<a href="javascript:void(0);" data-toggle="tooltip" data-placement="top" data-original-title="Discard" onclick="'+discardFun+'"><i class="fa fa-trash" aria-hidden="true" style="font-size:16px;margin-bottom:4px;padding:4px;"></i></a><br/>';
									// html+='<a href="javascript:void(0);" data-toggle="tooltip" data-placement="top" data-original-title="Ping to counselor" onclick="return openPopupAssignToCounselor(\''+leads.leadId+'\', \''+leads.assignTo+'\',\''+USER_ID+'\',\'1\',true,\'B2C\'); ">'
									// +'<i class="fa fa-trash text-danger"></i></a><br/>';
								}
							}
							html+='<a href="'+leads.demoSendUrl+'" data-toggle="tooltip" data-placement="top" data-original-title="Book School Demo with '+(leads.demoAssignName!=''?leads.demoAssignName:leads.assignName)+'" target="_blank"><i class="fa fa-bookmark" aria-hidden="true" style="font-size:16px;margin-bottom:4px;padding:4px;"></i></a><br/>';
							if(USER_ROLE != "B2B_PARTNER"){
                html+='<a href="'+leads.demoSendUrlForAll+'" data-toggle="tooltip" data-placement="top" data-original-title="Book School Demo for other counselor" target="_blank"><i class="fa fa-bookmark" aria-hidden="true" style="font-size:16px;margin-bottom:4px;padding:4px;"></i></a><br/>';
                html+='<a href="javascript:void(0);" data-toggle="tooltip" data-placement="top" data-original-title="WhatsApp chat log" onclick="callOpenWatsAppMessage(\'watsAppMsgModal\',\''+leads.leadId+'\');"><img src="'+PATH_FOLDER_IMAGE2+'leadlist_icons/WhatsApp.svg'+SCRIPT_VERSION+'" style="width:26px; margin-bottom: 4px;padding:4px;" /></a><br/>';
              }
							if(leads.whatsAppVerifiedStatus == 'NA'){
							}else{
								var displayCss='none';
								if(leads.watiLogsCount>0){
									displayCss='block';
								}
								html+='<a href="javascript:void(0);" data-toggle="tooltip" data-placement="top" data-original-title="Wati Logs" style="display:'+displayCss+';" id="wati_logs_link_'+leads.leadId+'" onclick="getWatiLogs(\''+leads.leadId+'\')">'
										+'<img src="'+PATH_FOLDER_IMAGE2+'leadlist_icons/Wati.svg'+SCRIPT_VERSION+'" style="width:26px; margin-bottom: 4px;padding:4px;" /></a>';
							}
							if(leads.zadarmaCount>0){
								html+='<a href="javascript:void(0);" data-toggle="tooltip" data-placement="top" data-original-title="Zadarma Logs" onclick="getZadarmaLogs(\''+leads.phone+'\')"><img src="'+PATH_FOLDER_IMAGE2+'leadlist_icons/Zadarma.svg'+SCRIPT_VERSION+'" style="width:26px; margin-bottom: 4px;padding:4px;" /></a><br/>';
							}
              if(leads.callHippoCount>0){
								html+='<a href="javascript:void(0);" data-toggle="tooltip" data-placement="top" data-original-title="Call Hippo Logs" onclick="getCallHippoLogs(\''+leads.phone+'\')"><img src="'+PATH_FOLDER_IMAGE2+'leadlist_icons/CallHippo.svg'+SCRIPT_VERSION+'" style="width:26px; margin-bottom: 4px;padding:4px;" /></a><br/>';
							}
							if(leads.emailBroadcastCount>0){
								html+='<a href="javascript:void(0);" data-toggle="tooltip" data-placement="top" data-original-title="Email Broadcast Logs" onclick="getEmailBroadcastLogs(\''+leads.email+'\',\''+(leads.fname!=''?leads.fname:'N/A') +' '+  leads.mname +' '+ leads.lname +'\',\''+leads.leadId+'\')"><i class="fa fa-envelope" aria-hidden="true" style="font-size:16px;margin-bottom:4px;padding:4px;"></i></a><br/>';
							}
						}
						
					}else{
						html+='N/A';
					}
					html+='</td>'
				+'</tr>'
			+'</tbody>'
		+'</table>'
	+'</div>';
	}
	html+=b2cleadsPagging(leaddata, objectRights);
	return html;

}

function b2cleadsPagging(leaddata, objRights){
	var recordsPerPage = leaddata.recordsPerPage;
	var noOfPages = leaddata.noOfPages;
	var currentPage = leaddata.currentPage;
	var showPageLimit = 2;
	var leftLimit=currentPage-showPageLimit;
	var rightLimit=currentPage+showPageLimit+1;
	var startPageLimit=5;
	var startDots=1;
	var leadType=objRights.leadType;
	var html='';
	if(noOfPages>1){
		html+='<div><ul class="pagination">';
			if(currentPage != 1){
				html+='<li class="page-item">'
				+'<a class="page-link" href="javascript:void(0);" onclick="clickTotalLeads(\''+objRights.clickFrom+'-'+objRights.clickUserid+'\', \''+(currentPage-1)+'\',\''+objRights.clickByLead+'\',\''+objRights.leadFrom+'\');">Previous</a>'
			 	+'</li>';
			 }
			for (let p = 1; p <= noOfPages; p++) {
				if(p < startPageLimit || p > (noOfPages -1) || (p>=leftLimit && p<rightLimit) ){
					if(p > (noOfPages -1) || (p<leftLimit && p>rightLimit)){
						html+='...';
					}
					html+='<li class="page-item">'
					+'<a href="javascript:void(0);" onclick="clickTotalLeads(\''+objRights.clickFrom+'-'+objRights.clickUserid+'\' ,\''+p+'\',\''+objRights.clickByLead+'\',\''+objRights.leadFrom+'\');" class="page-link '+(p==currentPage?'page-link-active':'')+'">'+p+'</a>'
					+'</li>';
				}else{

				}
			}
			if(currentPage<noOfPages){
				var nextPage=parseInt(currentPage)+1;
				html+='<li class="page-item">'
				+'<a class="page-link" href="javascript:void(0);" onclick="clickTotalLeads(\''+objRights.clickFrom+'-'+objRights.clickUserid+'\', \''+nextPage+'\',\''+objRights.clickByLead+'\',\''+leadType+'\');">Next</a>'
				+'</li>';
			}
		html+='</ul>'
		html+='</div>';
	}
	return html;
}

function getUpdateLeadCurrentTime(leads, leadId){
  const leaddatas=leads;
   var timerForCurTime;
    clearInterval(timerForCurTime);
    var currentTimeStr="";
    var timezoneG = getSystemTimezone();//Intl.DateTimeFormat().resolvedOptions().timeZone;
    //var leadCurrtime=changeDateFormat(new Date(), 'yyyy-mm-dd hh:mm:ss');
    var leadCurdate1=convertTime(changeDateFormat(new Date(), 'yyyy-mm-dd hh:mm:ss'), DATETIME_UTC_FORMATTER, timezoneG,  leaddatas.leadTimeZone ,"YYYY-MM-DD","HH:mm:ss");;
    var leadCurdate=leadCurdate1.date;
    var leadCurSdate=new Date(leadCurdate+' '+leaddatas.startDateTime);
    var leadCurEdate=new Date(leadCurdate+' '+leaddatas.endDateTime);

    var leadCurrDateTime;
    timerForCurTime = setInterval(function() {
        if(leaddatas.leadTimeZone!=''){
          var curentTime	=convertTime(changeDateFormat(new Date(), 'yyyy-mm-dd hh:mm:ss'), DATETIME_UTC_FORMATTER, timezoneG,  leaddatas.leadTimeZone ,DISPLAY_DATE_ONLY,DISPLAY_TIME_FORMATTER)
          var curentLeadRightTime	=convertTime(changeDateFormat(new Date(), 'yyyy-mm-dd hh:mm:ss'), DATETIME_UTC_FORMATTER, timezoneG,  leaddatas.leadTimeZone ,"YYYY-MM-DD HH:mm:ss","HH:mm:ss");
          currentTimeStr=curentTime.date+' '+curentTime.time;
          leadCurrDateTime=new Date(curentLeadRightTime.date);
        }
        //console.log("currentTimeStr "+currentTimeStr + " "+timezoneG + " "+ leaddatas.leadTimeZone+ " " +leadId);
        //console.log("leadCurrDateTime "+leadCurrDateTime);
        if(leadId==leaddatas.leadId){
            var leadrightTimeCallColor="text-danger bold";
            if(leadCurrDateTime>=leadCurSdate && leadCurrDateTime<=leadCurEdate){
                leadrightTimeCallColor="text-success bold";
            }
            $("#leadCurTimeText_"+leadId+"").html('<span class="'+leadrightTimeCallColor+'">'+currentTimeStr+'<span>');
        }
      }, 1000);

}

function getLeadStartTimer(leadstartDate, leadid){
    var timer;
    clearInterval(timer); // reset any previous timer
    const startDate = new Date(leadstartDate);

    // Update every second
    timer = setInterval(function() {
      var dateInKolkata = moment().tz("Asia/Singapore").format("YYYY-MM-DD HH:mm:ss");
      var now = new Date(dateInKolkata);
      var diff = now - startDate; // milliseconds difference

      if (diff < 0) {
        $('#timerLeadDisplay_'+leadid).text('⏳ Start time is in the future!').css('color', 'red');
        return;
      }

      // Convert milliseconds → time components
      var days = Math.floor(diff / (1000 * 60 * 60 * 24));
      var hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      var minutes = Math.floor((diff / (1000 * 60)) % 60);
      var seconds = Math.floor((diff / 1000) % 60);

      var textdays="<span class="+(days>0?'text-danger':'')+">"+days+" days <span>";
      var texthours="<span class="+(hours>0?'text-danger':'')+">"+hours+" hrs <span>";
      var textminutes="<span class="+(minutes>0?'text-danger':'')+">"+minutes+" mins <span>";
      var textseconds="<span class="+(seconds>0?'text-danger':'')+">"+seconds+" secs<span>";
      // Format display
      $('#timerLeadDisplay_'+leadid).html(`${textdays}${texthours}${textminutes}${textseconds}`)
    }, 1000);

}
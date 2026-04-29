function getDuplicateLeadRemarkHtml(remark, moduleId) {
  if (!remark) {
    return "N/A";
  }

  var duplicateLeadMatch = remark.match(/Parent Lead No\s*-\s*(\d+)/i);
  if (!duplicateLeadMatch) {
    return remark;
  }

  var parentLeadNo = duplicateLeadMatch[1];
  var urlSend =
    "/dashboard/lead-data-list?moduleId=111&leadId=" +
    parentLeadNo +
    "&leadFrom=LEAD&clickFrom=list&startDate=&endDate=&country=0&campaign=&currentPage=0&euid=" +
    ENCRYPTED_USER_ID +
    "&leadType=B2C";

  return remark.replace(
    /Parent Lead No\s*-\s*\d+/i,
    'Parent Lead No - <a href="javascript:void(0)" onclick="getAsPost(\'' +
      urlSend +
      '\');">' +
      parentLeadNo +
      "</a>"
  );
}

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
			</div>
      <div class="d-flex flex-column align-items-stretch w-100" style="background-color:#edf3ee;border-radius:5px;padding:10px;font-weight:bold;border:1.5px solid #619e70;gap:3px;">
        <div class="d-flex justify-content-between align-items-center w-100" style="gap:2px;">
          <p class="mb-0" style="color:#686868;">Direct Entry</p>
          <p id="directEntryCount" class="mb-0 text-white px-3 rounded" style="background-color:#619e70;min-width:60px;text-align:center;">-</p>
        </div>`;
    if (objRights.discardPermission) {
            html += `<div class="d-flex justify-content-between align-items-center w-100" style="gap:2px;">
              <p class="mb-0" style="color:#686868;">Payment Step</p>
              <p id="directPaySchedule" class="mb-0 text-white px-3 rounded" style="background-color:#619e70;min-width:60px;text-align:center;">-</p>
            </div>`;
    }
      html += `</div>
      <div class="d-flex justify-content-between align-items-center w-100" style="border-bottom:2px solid #B85C00;padding: 5px 10px;font-weight: bold;">
        <p class="mb-0" style="color:#B85C00">Pending Followup</p>
        <p id="pendingFollowupCount" class="mb-0 text-white px-2 rounded" style="background-color:#B85C00;">-</p>
      </div>
      `;
      // if(USER_ID != "19321" && USER_ID != "14388"){
      //   html+=
      //   `<div class="d-flex justify-content-between align-items-center w-100" style="border-bottom:2px solid #686868;padding: 5px 10px;font-weight: bold;">
      //     <p class="mb-0" style="color:#686868">Assigned to Lead Manager</p>
      //     <p id="assignedToLeadManagerCount" class="mb-0 text-white px-2 rounded" style="background-color:#686868;">-</p>
      //   </div>`;
      // }
      html+=
      `<div class="d-flex justify-content-between align-items-center w-100" style="border-bottom:2px solid #6C2BD9;padding: 5px 10px;font-weight: bold;">
        <p class="mb-0" style="color:#6C2BD9">Reminder Count</p>
        <p id="reminderCount" class="mb-0 text-white px-2 rounded" style="background-color:#6C2BD9;">-</p>
      </div>
      <div class="d-flex justify-content-between align-items-center w-100" style="border-bottom:2px solid #0E7490;padding: 5px 10px;font-weight: bold;">
        <p class="mb-0" style="color:#0E7490">Ping Popup Count</p>
        <p id="pingPopupCount" class="mb-0 text-white px-2 rounded" style="background-color:#0E7490;">-</p>
      </div>`
      
      ;
       
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
      html+=`<div class="d-flex justify-content-between align-items-center w-100" style="border-bottom:2px solid #0051FF;padding: 5px 10px;font-weight: bold;">
				<p class="mb-0" style="color:#0051FF">Demo By Agent</p>
				<p id="demoByAgentCount" class="mb-0 text-white px-2 rounded" style="background-color:#0051FF;">-</p>
			</div>`;
      
		
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
    html +='<option value="' +(i > 9 ? i : "0" + i) +'" >' + (i > 9 ? i : "0" + i) + "</option>";
  }
  html +=
    "								</select> " +
    "							</div>" +
    '							<div class="mr-0 mr-sm-2 flex-grow-1">' +
    '								<label class="m-0">MM</label>' +
    '								<select class="form-control dropdownFontSize" id="notSureMins" name="notSureMins">' +
    '									<option value="00">00</option>';
  for (var j = 1; j <= 59; j++) {
    html +='<option value="' +(j > 9 ? j : "0" + j) +'" >' +(j > 9 ? j : "0" + j) +"</option>";
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
    '       <form action="javascript:void(0);" id="advanceLeadNewSearchForm" name="advanceLeadNewSearchForm" autocomplete=\'off\'>' +
    '			<input type="hidden" name="restrictedDataShow" id="restrictedDataShow" value="YES">' +
    '			<input type="hidden" name="advancedformclick" id="advancedformclick" value="">' +
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
    '<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 priority">' +
    '	<label class="m-0">Lead Type</label>' +
    '	<select name="leadType" id="leadType" class="form-control" disabled>' +
    '		<option value="">Select Type</option>' +
    '		<option value="B2C" ' +(objRights.leadType == "B2C" ? "selected" : "") +">B2C</option>" +
    '		<option value="B2B" ' +(objRights.leadType == "B2B" ? "selected" : "") +">B2B</option>" +
    "	</select>" +
    "</div>" +
    "</div>" +
    '<div class="row">' +
    '<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 leadSource">' +
    '	<label class="m-0">Lead Source</label>' +
    '	<select	name="leadSourceSearch" id="leadSourceSearch" class="form-control" multiple ></select>' +
    "</div>" +
    '<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 leadStatus">' +
    '	<label class="m-0">Lead Status</label>&nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox" id="checkLeadStatus" name="checkLeadStatus" /> With Status' +
    '	<select name="leadStatusSearch" id="leadStatusSearch" class="form-control" multiple ></select>' +
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
    '<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 utmSource">' +
    '	<label class="m-0">Ad Set</label>' +
    '	<select  name="leadSearchAdSet" id="leadSearchAdSet" class="form-control leadSearchAdSet" multiple ></select>' +
    "</div>" +
    '<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 leadAssign">' +
    '<label class="m-0">Lead Assign To</label>&nbsp;&nbsp;&nbsp;&nbsp;' +
    '<input type="checkbox" id="checkByLead" name="checkByLead" /> Only Lead&nbsp;' +
    '<input type="checkbox" id="checkByLeadDemo" name="checkByLeadDemo" /> Lead With Demo';
  if (objRights.leadHideRights) {
    html +='<select name="leadAssignToSearch" id="leadAssignToSearch" class="form-control" multiple disabled></select>';
  } else {
    html +='<select name="leadAssignToSearch" id="leadAssignToSearch" class="form-control" multiple></select>';
  }
  html += '</div>';
  html +='<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 demoAssign">' +
    '<label class="m-0">Lead Added by</label>' +
    '<select	name="leadCreatedBy" id="leadCreatedBy" class="form-control" >' +
    '<option value="0">Select Assign</option>' +
    '</select>' +
    '</div>' +
    '<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 demoAssign">' +
    '	<label class="m-0">Demo Assign</label>' +
    '	<select	name="leadDemoAssignSearch" id="leadDemoAssignSearch" class="form-control" >' +
    '		<option value="0">Select Assign</option>' +
    '	</select>' +
    '</div>' +
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
    '						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2 b2bLeadCallback">' +
    '							<label class="m-0">Demo Book type</label>' +
    '							<select name="leadDemoBookType" id="leadDemoBookType" class="form-control"  >' +
    '								<option value="">Select Demo Book Type</option>' +
    '								<option value="AB">Demo By Website</option>' +
    '								<option value="A">Demo By Link</option>' +
    '								<option value="AG">Demo By Agent</option>' +
    "							</select>" +
    "						</div>" +
    '						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2 b2bLeadCallback">' +
    '							<label class="m-0">Lead Call By Agent</label>' +
    '							<select name="leadCallByAgent" id="leadCallByAgent" class="form-control"  >' +
    '								<option value="">Select Call Agent</option>' +
    '								<option value="Y">Yes</option>' +
    '								<option value="N">No</option>' +
    "							</select>" +
    "						</div>" +
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
    '<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12 mb-1 mt-1">' +
    '	<label class="m-0">Last Followup Days</label>' +
    '	<input type="text" name="leadFollwoupDays" id="leadFollwoupDays"  class="form-control"/> ' +
    "</div>" +
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
    '	<input type="hidden" name="leadType" id="leadType" value="' +objRights.leadType +'" />' +
    '			<div class="row">' +
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

  var demoByAgentCountHTML =
    leadTotalData.totalAgentUrlDemo > 0
      ? `<a href="javascript:void(0);" class="text-white" onclick="clickTotalLeads('${leadTotalData.clickFrom}-${leadTotalData.clickUserid}', '0', 'totalAgentUrlDemo','${leadTotalData.leadFrom}')">${leadTotalData.totalAgentUrlDemo}</a>`
      : "-";
  $("#demoByAgentCount").html(`${demoByAgentCountHTML}`);

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

  var directEntry =
    leadTotalData.totalDirectEntry > 0
      ? `<a href="javascript:void(0);" class="text-white" onclick="clickTotalLeads('${leadTotalData.clickFrom}-${leadTotalData.clickUserid}', '0', 'totalDirectEntry','${leadTotalData.leadFrom}')">${leadTotalData.totalDirectEntry}</a>`
      : "-";
  $("#directEntryCount").html(`${directEntry}`);

  var totalPaymentSchedule =
    leadTotalData.totalPaymentSchedule > 0
      ? `<a href="javascript:void(0);" class="text-white" onclick="clickTotalLeads('${leadTotalData.clickFrom}-${leadTotalData.clickUserid}', '0', 'totalDirectPaySchedule','${leadTotalData.leadFrom}')">${leadTotalData.totalPaymentSchedule}</a>`
      : "-";
  $("#directPaySchedule").html(`${totalPaymentSchedule}`);

  
  var pendingFollowup =
    leadTotalData.pendingFollowup > 0
      ? `<a href="javascript:void(0);" class="text-white" onclick="clickTotalLeads('${leadTotalData.clickFrom}-${leadTotalData.clickUserid}', '0', 'pendingFollowup','${leadTotalData.leadFrom}')">${leadTotalData.pendingFollowup}</a>`
      : "-";
  $("#pendingFollowupCount").html(`${pendingFollowup}`);

  var reminderTotal = parseInt((leadTotalData.reminder_total !== undefined ? leadTotalData.reminder_total:0));
  var reminder_followup_total = parseInt((leadTotalData.reminder_followup_total !== undefined ? leadTotalData.reminder_followup_total : 0));
  var reminderCountBadge =
    reminderTotal > 0
      ? `<a href="javascript:void(0);" class="text-white" onclick="clickTotalLeads('${leadTotalData.clickFrom}-${leadTotalData.clickUserid}', '0', 'reminderCallTotal','${leadTotalData.leadFrom}')">${reminderTotal}</a> | 
      <a href="javascript:void(0);" class="text-white" onclick="clickTotalLeads('${leadTotalData.clickFrom}-${leadTotalData.clickUserid}', '0', 'reminderFollowupTotal','${leadTotalData.leadFrom}')">${reminder_followup_total}</a>`
      : "-";
  $("#reminderCount").html(`${reminderCountBadge}`);

  var pingTotal = parseInt((leadTotalData.ping_total !== undefined ? leadTotalData.ping_total : 0) || 0, 10);
  var pingFollowupTotal = parseInt((leadTotalData.ping_followup_total !== undefined ? leadTotalData.ping_followup_total : 0) || 0, 10);
  var pingPopupCountBadge =
    pingTotal > 0
      ? `<a href="javascript:void(0);" class="text-white" onclick="clickTotalLeads('${leadTotalData.clickFrom}-${leadTotalData.clickUserid}', '0', 'pingPopupTotal','${leadTotalData.leadFrom}')">${pingTotal}</a> | 
      <a href="javascript:void(0);" class="text-white" onclick="clickTotalLeads('${leadTotalData.clickFrom}-${leadTotalData.clickUserid}', '0', 'pingPopupFollowupTotal','${leadTotalData.leadFrom}')">${pingFollowupTotal}</a>`
      : "-";
  $("#pingPopupCount").html(`${pingPopupCountBadge}`);
  //$("#pingPopupFollowupCount").html(`${pingFollowupTotal > 0 ? pingFollowupTotal : "-"}`);

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

      var facebookBadge='';
      if(leads.facebookStatus=='Enrolled'){
        facebookBadge='green';
      }else if(leads.facebookStatus=='Positive'){
        facebookBadge='#aeae64';
      }else if(leads.facebookStatus=='Demo'){
        facebookBadge='orange';
      }else if(leads.facebookStatus=='Lead'){
        facebookBadge='blue';
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
				html+='<span class="lead-no-cell lead-no-cell-'+leads.leadId+'">'+leads.srNo+'.&nbsp;Filled details &nbsp;<span class="font-weight-bold">'+leads.leadNo+'</span></span> | Lead Score: <span class="'+lScoreColor+' text-white bold p-1 rounded">'+(leads.leadScore!=''?leads.leadScore:'0')+'</span>'
				html+='<br><div class="d-flex justify-content-center"><p class="bold font-12 p-1 bg-white text-dark w-fit-content mt-1 mb-0 rounded" id="timerLeadDisplay_'+leads.leadId+'"></p></div>'
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
						}else if(leads.demoFrom=='Demo by Agent'){
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
				+(leads.leadStatus === 'Red Flag' ? '<tr class="td-border-design red-flag-lead" style="pointer-events:none;">' : '<tr class="td-border-design">')
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

                    +((leads.LeadSourceName=='Facebook' && objRights.discardPermission) ?'<span style="color: '+facebookBadge+';font-size:15px;"><i class="fa fa-check-circle"></i></span>':'')
                    
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
                  +'<td class="border-0 p-1"><span class="lead-summary-grade-'+leads.leadId+'">'+(leads.standardName!=''?leads.standardName.replace('Grade',''):'N/A')+'</span></td>'
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
                        html += '<a href="javascript:void(0);" ' +
                                  'onclick="callLeadViaCallHippo(\'' + leaddata.allowCallhippoService + '\',\'' + leaddata.callhippoBypassNumber + '\',\'' + (leads.phoneIsd || '') + '\',\'' + (leads.isdCode || '') + '\',\'' + (leads.phone || '') + '\')" ' +
                                  'data-toggle="tooltip" ' +
                                  'data-placement="top" ' +
                                  'data-original-title="Call via CallHippo" ' +
                                  'class="btn btn-sm ml-1 d-inline-flex align-items-center rounded-pill py-1" style="font-size: 10px;background-color: #c3e4ff;box-shadow:0 2px 6px rgba(0,0,0,0.3);">' +
                                    '<img src="'+PATH_FOLDER_IMAGE2+'leadlist_icons/CallHippo.svg'+SCRIPT_VERSION+'" style="width:16px; margin-right:5px"> Call' +
                                  '</a>';
                        +'</span>';
                    }
                    html+='<br/>';
                    if(leads.phoneNoAlter!=''){
                      html+=(leads.phoneNoAlter!=''?leads.isdCodeAlter:'') +' '+(leads.phoneNoAlter!=''?leads.phoneNoAlter:'') ;
                      html+='<a href="https://api.whatsapp.com/send?phone='+(leads.altrphoneIsd!=''?leads.altrphoneIsd:'')+'" target="_target"> <img src="'+PATH_FOLDER_IMAGE+'watsapp-icon.png" width="16px" /></a>';
                      html += `
                          <a href="javascript:void(0);" 
                            onclick="callLeadViaCallHippo('${leaddata.allowCallhippoService}','${leaddata.callhippoBypassNumber}','${leads.phoneIsd || ''}','${leads.isdCode || ''}','${leads.phone || ''}')"
                            data-toggle="tooltip"
                            data-placement="top"
                            data-original-title="Call via CallHippo"
                            class="btn btn-sm ml-1 d-inline-flex align-items-center rounded-pill py-1" style="font-size: 10px;background-color: #c3e4ff;box-shadow:0 2px 6px rgba(0,0,0,0.3);">

                              <img src="${PATH_FOLDER_IMAGE2}leadlist_icons/CallHippo.svg${SCRIPT_VERSION}" style="width:16px;margin-right:5px;"> Call
                          </a>
                        `;
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

                html+='<tr>'
									+'<th class="border-0 p-1">&nbsp;</th><td class="border-0 p-1 leadMultipletimes_'+leads.leadId+'">'
										
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
													+'<td class="border-0 p-1"><span class="lead-child-name-'+leads.leadId+'">'+(childName)+'</span>'
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
                          +'<td class="border-0 p-1"><span class="lead-child-grade-'+leads.leadId+'">'+childGrade+'</span></td>'
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
													+'<td class="border-0 p-1">'
														+'<div class="lead-automation-remark lead-automation-remark--scroll">'+agentRemark+'</div>'
													+'</td>'
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
                    '<div class="d-flex flex-column align-items-start mb-1" style="gap:8px;">'
                        +'<div class="d-flex align-items-center" style="gap:10px;">'
                            +'<span class="ml-1">Call recording:</span>'
                            +( agentRecording 
                                ? '<audio controls style="height:40px; transform:scale(0.9);">'
                                    +'<source src="'+agentRecording+'">'
                                    +'Your browser does not support the audio element.'
                                +'</audio>'
                                : '<span style="margin-left: 22%;">N/A</span>'
                            )
                        +'</div>';
                         if(leads.demoSummary!='' && leads.demoSummary!=null){
                         html += '<div class="ml-1 mt-1 d-block">'
                            +'<button type="button" class="btn btn-sm btn-primary font-weight-bold" style="min-width:170px; " onclick="openAutomatedFollowupPopup(\''+leads.leadId+'\', \''+leads.leadNo+'\')"><i class="fa fa-bolt mr-1"></i>Automated follow-up</button>'
                          +'</div>';
                         }
                     html += '</div>'
                    +'<div class="hold-enrollment-wrapper hold-enrollment-wrapper-'+leads.leadId+'"></div>'
									+'</td>'
								+'</tr>'
							+'</tbody>'
						+'</table>'
					+'</td>'
					+'<td class="p-0 lead-row-'+leads.leadId+' '+ltype+'-'+(leads.callBadge!=''?leads.callBadge+'-bg':'')+'" style="width: 350px;vertical-align:top;">'
					
						+'<table class="w-100 demotable" style="border: solid #027ffe 1px;background-color: #D5E3FC;">'
							+'<tbody>';
                html+='<tr>'
                  +'<th class="border-0 p-1" style="width:165px">Preferred Language: </th>'
                  +'<td class="border-0 p-1">'+(leads.language!=''?leads.language:'N/A')+'</td>'
                +'</tr>';
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
								+'</tr>';
                 if(leads.demoConfirmMessage!=''){
                    html+='<tr  class="" >'
                      +'<th class="border-0 p-1">Demo Confirm Message:</th>'
                      +'<td class="border-0 p-1">'+(leads.demoConfirmMessage!=''?leads.demoConfirmMessage:'N/A')+'</td>'
                    +'</tr>';
                 }
                //if(USER_ROLE=='DIRECTOR' || objectRights.searchUser){
                  if(leads.demoSummaryStatus){
                    html+='<tr>'
                           +'<td class="border-0 p-1">'
                          //   +'<div class="dropdown d-inline-block" style="position: inherit;">'
                          //     +'<button type="button" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown" class="dropdown-toggle btn btn-sm btn-primary">View Demo Summary</button>'
                          //     +'<div tabindex="-1" role="menu" aria-hidden="true" class="dropdown-menu-lg dropdown-menu p-2" x-placement="bottom-start" style="max-width: 250px; max-height:350px; overflow: auto;">';
                          //   demoSummary=JSON.parse(leads.demoSummary);
                          //   html+='<table class="table table-bordered font-11 mt-2">';
                          //   $.each(demoSummary.reply, function(key, value) {
                          //       html += '<tr>';
                          //       html += '<td class="bold">' + key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) + '</td>';  // Pretty key name
                                
                          //       if ($.isArray(value)) {
                          //           html += '<td class="array">[' + value.join(', ') + ']</td>';
                          //       } else if (typeof value === 'object') {
                          //           html += '<td class="nested">' + JSON.stringify(value, null, 2) + '</td>';
                          //       } else {
                          //           html += '<td>' + value + '</td>';
                          //       }
                          //       html += '</tr>';
                          //   });
                          //   html+='</table>'
                          //     +'</div>'
                          //   +'</div>'
                           +'</td>'
                          +'<td class="border-0 p-1">'
                              +'<div class="d-flex flex-column align-items-start" style="gap:8px;">'
                                  +(leads.demoTranscriptUrl
                                      ? '<button type="button" class="btn btn-sm btn-primary" style="min-width:170px;" onclick="showVTTFile(\''+leads.demoTranscriptUrl+'\', \'Transcript\',false)">Transcript</button>'
                                      : '')
                                  +'<button type="button" class="btn btn-sm btn-primary" style="min-width:170px;" onclick="callMeetingRecordingSummary(\''+leads.leadId+'\',\''+leads.leadNo+'\')">View Demo Summary</button>'
                              +'</div>'
                          +'</td>'
                        +'</tr>';
                  }
                //}
                    
								html+='</tbody>'
							+'</table>'
							+'<table class="w-100 border-bottom demotable">'
							+'<tbody>'
              +'<tr>'
                +'<th class="border-0 p-1">Demo confirmation:</th>'
                +'<td class="border-0 p-1">'+(leads.demoConfirmation=='Y'?'Yes':'No')+'</td>'
              +'</tr>';
              
              if (leads.followupMeetingDate!==""){
                //html += '<tr><th class="border-0 p-1">Type:</th><td class="border-0 p-1" >Follow-up Meeting</td></tr>';
                html += '<tr class="bg-info p-1 text-white">'
                  +'<th class="border-0 p-1">Follow-up Meeting Time:</th>'
                  +'<td class="border-0 p-1" >'+leads.followupMeetingDate+' ('+USER_TIMEZONE+')'+'</td>'
                +'</tr>';
                 html += '<tr class="bg-info p-1 text-white">'
                  +'<th class="border-0 p-1">Assign to:</th>'
                  +'<td class="border-0 p-1" >'+leads.followupAssignName+'</td>'
                +'</tr>';
                if(leads.communicationTime!=''){
                  html += '<tr class="bg-info p-1 text-white">'
                   +'<th class="border-0 p-1" style="width:165px">Communication Prefrence Time: </th>'
                   +'<td class="border-0 p-1">'+leads.communicationTime + (leads.pref!=''?' ('+(leads.pref!=''?leads.pref+')':''):'')+'</td>'
                 +'</tr>';
                }
                
              }
              if (leads.callbackConvertedDate!=="N/A"){
                html += '<tr><th class="border-0 p-1">Type:</th><td class="border-0 p-1" >Callback</td></tr>';
                html += '<tr class="bg-primary p-1 text-white">'
                  +'<th class="border-0 p-1">Callback Time:</th>'
                  +'<td class="border-0 p-1" >'+leads.callbackConvertedDate+' ('+USER_TIMEZONE+')'+'</td>'
                +'</tr>';
                if (leads.callBackRemark!==""){
                  html += '<tr class="bg-primary p-1 text-white">'
                    +'<th class="border-0 p-1">Callback Time:</th>'
                    +'<td class="border-0 p-1" >'+leads.callBackRemark+'</td>'
                  +'</tr>';
                }
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
									+'<td class="border-0 p-1 leadlist-remark-'+leads.leadId+' '+ltype+'-'+(leads.callBadge!=''?leads.callBadge+'-leadno-bg':'')+'">'
                  +'<div style="max-height: 100px; overflow-y: auto;">'
                  html+=getDuplicateLeadRemarkHtml(leads.followupRemark, objRights.moduleId);
                  html+='</div>'
									+'</td>'
								+'</tr>';

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
						if (parseInt(leads.reminderCount || 0, 10) > 0) {
							html+='<tr>'
							  +'<th class="border-0 p-1">Reminder:</th>'
							  +'<td class="border-0 p-1">'
								+'<button type="button" class="btn btn-sm btn-primary" data-toggle="tooltip" data-placement="top" data-original-title="View Reminders" onclick="openLeadReminderListPopup(\''+leads.leadId+'\', \''+leads.leadNo+'\')">View Reminder</button>'
							  +'</td>'
							+'</tr>';
						}
	                  }
                  if(leads.pendingFollowupCount>0){
                    html+='<tr>'
                        +'<th class="border-0 p-1" >Last Followup days:</th>'
                        +'<td class="border-0 p-1 text-white bold" style="background-color:#B85C00;">'+(leads.pendingFollowupCount>0?leads.pendingFollowupCount:'')+'</td>'
                      +'</tr>';
                  }
                 // html+='<tr>'
										// +'<div class="dropdown d-inline-block" style="position: inherit;">'
										// 	+'<button type="button" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown" class="dropdown-toggle btn btn-sm btn-primary">View Remarks</button>'
										// 	+'<div tabindex="-1" role="menu" aria-hidden="true" class="dropdown-menu-lg dropdown-menu p-2" x-placement="bottom-start" style="max-width: 250px;">'
										// 		+'<p class="m-0 leadlist-remark-'+leads.leadId+'">'+(leads.followupRemark!=''?leads.followupRemark:'N/A')+'</p>'
										// 	+'</div>'
										// +'</div>'
                    
								if(objRights.discardPermission || USER_ID == leads.assignTo || USER_ID == leads.demoAssignTo  || USER_ID == leads.leadSupportTo || USER_ID==leads.followupAssignTo){
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
													+'<td class="p-1 border-0 text-justify" id="callRemark" style="max-width: 250px;">'+getDuplicateLeadRemarkHtml(leadCall.followRemarks, objRights.moduleId)+'</td>'
												+'</tr>'
											+'</table>'
										+'</div>'
									+'</div>'
								+'</div>'
							+'</li>';
							}	
						html+='</ul>'
					+'</td>'
						+'<td class="rounded-bottom-right-10 text-center pt-3 lead-row-'+leads.leadId+' '+ltype+'-'+(leads.callBadge!=''?leads.callBadge+'-bg':'')+'" style="vertical-align:top;color:#027FFF;'+(leads.leadStatus === 'Red Flag' ? 'pointer-events:auto;opacity:1;' : '')+'">';
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
							html+='<a href="javascript:void(0);" data-toggle="tooltip" data-placement="top" data-original-title="Activity logs" onclick="getAsPost(\'/dashboard/lead-data-logs?moduleId=moduleId='+objRights.moduleId+'&leadNo='+leads.leadNo+'&leadType=B2C\')">'
									+'<i class="fa fa-tasks" aria-hidden="true" style="font-size:16px;margin-bottom:4px;padding:4px;"></i></a><br/>';
							html+='<a href="javascript:void(0);" data-toggle="tooltip" data-placement="top" data-original-title="Update chat support" onclick="renderChatContent(\''+objRights.discardPermission+'\',\''+USER_ID+'\',\''+leads.leadId+'\')">'
									+'<i class="fa fa-comment" aria-hidden="true" style="font-size:16px;margin-bottom:4px;padding:4px;"></i></a><br/>';	
							html+='<a href="javascript:void(0);" data-toggle="tooltip" data-placement="top" data-original-title="Set Reminder" onclick="openLeadReminderPopup(\''+leads.leadId+'\',\''+leads.leadNo+'\')">'
									+'<i class="fa fa-bell" aria-hidden="true" style="font-size:16px;margin-bottom:4px;padding:4px;"></i></a><br/>';
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
                  var disPingPup = "openPopupAssignToCounselor('"+leads.leadId+"', '"+leads.assignTo+"','"+USER_ID+"','1','true','B2C')";
									html+='<a href="javascript:void(0);" data-toggle="tooltip" data-placement="top" data-original-title="Discard" onclick="'+discardFun+'"><i class="fa fa-trash" aria-hidden="true" style="font-size:16px;margin-bottom:4px;padding:4px;"></i></a><br/>';
									html+='<a href="javascript:void(0);" data-toggle="tooltip" data-placement="top" data-original-title="Ping to counselor" onclick="'+disPingPup+'"><i class="fa fa-map-pin" aria-hidden="true" style="font-size:16px;margin-bottom:4px;padding:4px;"></i></a><br/>';
								}
							}
							html+='<a href="'+leads.demoSendUrl+'" data-toggle="tooltip" data-placement="top" data-original-title="Book School Demo with '+(leads.demoAssignName!=''?leads.demoAssignName:leads.assignName)+'" target="_blank"><i class="fa fa-bookmark" aria-hidden="true" style="font-size:16px;margin-bottom:4px;padding:4px;"></i></a><br/>';
							
							if(USER_ROLE != "B2B_PARTNER"){
                html+='<a href="'+leads.demoSendUrlForAll+'" data-toggle="tooltip" data-placement="top" data-original-title="Book School Demo for other counselor" target="_blank"><i class="fa fa-bookmark" aria-hidden="true" style="font-size:16px;margin-bottom:4px;padding:4px;"></i></a><br/>';
                html+='<a href="'+leads.followupSendUrl+'" data-toggle="tooltip" data-placement="top" data-original-title="Follow-up Meeting with '+(leads.demoAssignName!=''?leads.demoAssignName:leads.assignName)+'" target="_blank"><i class="fa fa-users" aria-hidden="true" style="font-size:16px;margin-bottom:4px;padding:4px;"></i></a><br/>';
                html+='<a href="'+leads.followupSendUrlForAll+'" data-toggle="tooltip" data-placement="top" data-original-title="Follow-up Meeting for other counselor" target="_blank"><i class="fa fa-users" aria-hidden="true" style="font-size:16px;margin-bottom:4px;padding:4px;"></i></a><br/>';
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
              // Hold Enrollment button
							var _hld = {
								leadId: leads.leadId, leadNo: leads.leadNo,
								fname: leads.fname, mname: leads.mname, lname: leads.lname,
								standard: leads.standard,
								email: leads.email, emailAlt: leads.emailAlternet,
								isdCode: leads.isdCode, isdCodeIso: (leads.isdCodeIso||''), phone: leads.phone,
								isdCodeAlter: leads.isdCodeAlter, isdCodeAlterIso: (leads.isdCodeAlterIso||''), phoneNoAlter: leads.phoneNoAlter
							};
							html+='<a href="javascript:void(0);" data-toggle="tooltip" data-placement="top" data-original-title="Hold Enrollment" onclick="openLeadEnrollmentHoldPopup('+JSON.stringify(_hld).replace(/"/g,'&quot;')+')">'
									+'<i class="fa fa-lock" aria-hidden="true" style="font-size:16px;margin-bottom:4px;padding:4px;color:#764ba2;"></i></a><br/>';
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

function openLeadReminderPopup(leadId, leadNo) {
  $("#leadReminderForm")[0].reset();
  $("#leadReminderLeadId").val(leadId || "");
  $("#leadReminderLeadNo").text(leadNo || "N/A");
  $("#saveLeadReminder").prop("disabled", false).text("Save reminder");
  $("#leadReminderPopupForm").modal("show");
}

function openAutomatedFollowupPopup(leadId, leadNo) {
  if (!$("#automatedFollowupPopupForm").length) {
    $("body").append(getAutomatedFollowupPopup());
    $("#automatedFollowupPopupForm").on("hidden.bs.modal", function () {
      destroyAutomatedFollowupBodyEditor();
      clearAutomatedFollowupCountdownTimer();
    });
  }
  $("#automatedFollowupPopupForm").attr("data-lead-id", leadId || "");
  $("#automatedFollowupPopupForm").attr("data-lead-no", leadNo || "");
  $("#automatedFollowupLeadNo").text(leadNo || "N/A");
  $("#automatedFollowupPopupBody").html(getAutomatedFollowupLoadingHtml());
  $("#automatedFollowupPopupForm").modal("show");
  // Backend restores last saved media selection from DB automatically
  loadAutomatedFollowupPopupData(leadId, leadNo, "", { templateMode: "AI" });
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
    var timezoneG = getSystemTimezone();
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

function getDemoDetailSummary(){
    var html=
        `<div class="modal fade" id="demodetailsummary" tabindex="-1" role="dialog" aria-labelledby="userActivityModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title">Demo detail summary (<span id="demosummaryleadno"></span>)</h5>
                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body" id="demosummarytxt" style="max-height: 75vh; overflow: auto;">
                        
                    </div>
                </div>
            </div>
        </div>`
    return html;
}


function getLeadReminderPopup() {
  var html =
    '<div id="leadReminderPopupForm" class="modal fade bd-example-modal-lg fade-scale" tabindex="" role="dialog" aria-labelledby="leadReminderTitle" aria-hidden="true">' +
    '<div class="modal-dialog modal-md">' +
    '    <div class="modal-content border-0">' +
    '        <div class="modal-header py-2 bg-primary text-white">' +
    '            <h5 class="modal-title" id="leadReminderTitle">Set Reminder (<span id="leadReminderLeadNo">N/A</span>)</h5>' +
    '            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">' +
    '                <span aria-hidden="true">&times;</span>' +
    "            </button>" +
    "        </div>" +
    '        <div class="modal-body">' +
    '            <form class="col-lg-12 col-md-12 col-sm-12 col-12 pt-2 pb-2" method="post" id="leadReminderForm" action="javascript:void(0);">' +
    '              <input type="hidden" name="leadId" id="leadReminderLeadId" value="" />' +
    '              <div class="row">' +
    '                <div class="col-12 mb-2">' +
    '                  <label class="m-0">Reminder Title</label>' +
    '                  <input type="text" class="form-control" name="reminderTitle" id="reminderTitle" maxlength="255" autocomplete="off" />' +
    "                </div>" +
    '                <div class="col-lg-6 col-md-6 col-sm-12 col-12 mb-2">' +
    '                  <label class="text-primary m-0">Date</label>' +
    '                  <input type="text" class="form-control datepicker" name="reminderDate" id="reminderDate" readonly onkeydown="return false" />' +
    "                </div>" +
    '                <div class="col-lg-3 col-md-6 col-sm-12 col-12 mb-2">' +
    '                  <label class="text-primary m-0">Time</label>' +
    '                  <input type="text" class="form-control timepicker" name="reminderTime" id="reminderTime" autocomplete="off" placeholder="Select time" />' +
    "                </div>" +
    "              </div>" +
    "            </form>" +
    "        </div>" +
    '        <div class="modal-footer">' +
    '          <button type="button" class="btn btn-info float-right pr-4 pl-4 ml-2" data-dismiss="modal">Cancel</button>' +
    '          <button type="button" class="btn btn-success float-right pr-4 pl-4" id="saveLeadReminder">Save reminder</button>' +
    "        </div>" +
    "    </div>" +
    "</div>" +
    "</div>";
  return html;
}

function getLeadReminderListPopup() {
  var html =
    '<div id="leadReminderListPopupForm" class="modal fade bd-example-modal-lg fade-scale" tabindex="" role="dialog" aria-labelledby="leadReminderListTitle" aria-hidden="true">' +
    '<div class="modal-dialog modal-lg">' +
    '    <div class="modal-content border-0">' +
    '        <div class="modal-header py-2 bg-primary text-white">' +
    '            <h5 class="modal-title" id="leadReminderListTitle">Reminders (<span id="leadReminderListLeadNo">N/A</span>)</h5>' +
    '            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">' +
    '                <span aria-hidden="true">&times;</span>' +
    "            </button>" +
    "        </div>" +
    '        <div class="modal-body">' +
    '            <input type="hidden" id="leadReminderListLeadId" value="0" />' +
    '            <div class="table-responsive" id="leadReminderListTableWrapper">' +
    '              <table class="table table-bordered table-striped font-12 mb-0">' +
    '                <thead class="bg-primary text-white">' +
    "                  <tr>" +
    "                    <th>Reminder Title</th>" +
    "                    <th>DateTime</th>" +
    "                    <th>Status</th>" +
    "                    <th>Created By</th>" +
    "                  </tr>" +
    "                </thead>" +
    '                <tbody id="leadReminderListBody">' +
    '                  <tr><td colspan="4" class="text-center">No reminders set for this lead</td></tr>' +
    "                </tbody>" +
    "              </table>" +
    "            </div>" +
    "        </div>" +
    '        <div class="modal-footer">' +
    '          <button type="button" class="btn btn-info float-right pr-4 pl-4" data-dismiss="modal">Close</button>' +
    "        </div>" +
    "    </div>" +
    "</div>" +
    "</div>";
  return html;
}

function getAutomatedFollowupPopup() {
  var html = '';
  html += '<div id="automatedFollowupPopupForm" class="modal fade bd-example-modal-lg fade-scale" tabindex="" role="dialog" aria-labelledby="automatedFollowupTitle" aria-hidden="true">';
  html += '  <div class="modal-dialog modal-xl" style="max-width: 1180px; width: 92%;">';
  html += '    <div class="modal-content border-0" style="background:#f7f7fb;">';
  html += '      <div class="modal-header py-2 bg-primary text-white">';
  html += '        <h5 class="modal-title" id="automatedFollowupTitle">Automated follow-up (<span id="automatedFollowupLeadNo">N/A</span>)</h5>';
  html += '        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">';
  html += '          <span aria-hidden="true">&times;</span>';
  html += '        </button>';
  html += '      </div>';
  html += '      <div class="modal-body p-2 p-md-3" style="background:#f7f7fb; max-height: calc(100vh - 140px); overflow:auto;">';
  html += '        <div id="automatedFollowupPopupBody"></div>';
  html += '      </div>';
  html += '      <div class="modal-footer py-2">';
  html += '        <button type="button" class="btn btn-info" data-dismiss="modal">Close</button>';
  html += '      </div>';
  html += '    </div>';
  html += '  </div>';
  html += '</div>';
  return html;
}

function triggerAutomatedFollowupAction(actionType) {
  var popup = $("#automatedFollowupPopupForm");
  var leadId = popup.attr("data-lead-id") || "";
  var leadNo = popup.attr("data-lead-no") || "";
  if (!leadId && !leadNo) {
    $("#automatedFollowupPopupBody").html(getAutomatedFollowupErrorHtml("Lead id or lead no is required."));
    return;
  }
  var st = window.AUTOMATED_FOLLOWUP_STATE || {};
  var customBody        = getAutomatedFollowupBodyEditorValue();
  var customSubject     = $.trim($("#automatedFollowupSubjectInput").val() || "");
  var selectedMediaIds  = Array.isArray(st.selectedMediaIds) ? st.selectedMediaIds.slice() : [];
  // Collect exact fileUrls so backend can filter multi-file media records correctly
  var selectedFileUrls  = (Array.isArray(st.selectedMediaItems) ? st.selectedMediaItems : [])
                            .map(function (m) { return m.fileUrl || ""; })
                            .filter(function (u) { return u !== ""; });
  var templateMode      = st.templateMode || null;
  var selectedTemplId   = st.selectedTemplateId || null;
  destroyAutomatedFollowupBodyEditor();
  $(".lead-automation-actionBtn").prop("disabled", true).css("opacity", "0.5");
  $("#automatedFollowupPopupBody").html(getAutomatedFollowupLoadingHtml());
  loadAutomatedFollowupPopupData(leadId, leadNo, actionType, {
    customBody:         customBody,
    customSubject:      customSubject || null,
    selectedMediaIds:   selectedMediaIds,
    selectedFileUrls:   selectedFileUrls.length ? selectedFileUrls : null,
    templateMode:       templateMode,
    selectedTemplateId: selectedTemplId
  });
}

function updateAutomatedFollowupActionState(data) {
  var sendStatus = String(data && data.sendStatus || "").toUpperCase();
  if (sendStatus === "PAUSED" || sendStatus === "SKIPPED") {
    clearAutomatedFollowupCountdownTimer();
    $("#automatedFollowupTitle").attr("data-schedule-text", "");
  } else {
    var scheduleText = sendStatus !== "NO_MATCH" && data.scheduleText ? String(data.scheduleText) : "";
    $("#automatedFollowupTitle").attr("data-schedule-text", scheduleText);
  }
}

function clearAutomatedFollowupCountdownTimer() {
  if (window.LEAD_AUTOMATION_STATE && window.LEAD_AUTOMATION_STATE.automatedFollowupCountdownTimer) {
    clearInterval(window.LEAD_AUTOMATION_STATE.automatedFollowupCountdownTimer);
    window.LEAD_AUTOMATION_STATE.automatedFollowupCountdownTimer = null;
  }
}

function formatAutomatedFollowupCountdown(totalSeconds) {
  var total = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  var days = Math.floor(total / 86400);
  var hrs = Math.floor((total % 86400) / 3600);
  var mins = Math.floor((total % 3600) / 60);
  var secs = total % 60;
  var parts = [];
  if (days > 0) parts.push(days + (days === 1 ? " Day" : " Days"));
  if (hrs > 0) parts.push(hrs + (hrs === 1 ? " Hr" : " Hrs"));
  if (mins > 0) parts.push(mins + (mins === 1 ? " Min" : " Mins"));
  parts.push(secs + (secs === 1 ? " Sec" : " Secs"));
  return parts.join(" ");
}

function getAutomatedFollowupCountdownText(schedule) {
  if (!schedule || typeof moment !== "function") {
    return String((schedule && schedule.scheduleText) || "Send now");
  }
  var currentText = String(schedule.currentLocalTime || "").trim();
  var nextText = String(schedule.nextAllowedSlot || "").trim();
  if (!currentText || !nextText) {
    return String(schedule.scheduleText || "Send now");
  }
  var currentMoment = moment(currentText, "YYYY-MM-DD HH:mm:ss", true);
  var nextMoment = moment(nextText, "YYYY-MM-DD HH:mm:ss", true);
  if (!currentMoment.isValid() || !nextMoment.isValid()) {
    return String(schedule.scheduleText || "Send now");
  }
  var totalSeconds = Math.abs(nextMoment.diff(currentMoment, "seconds"));
  if (!totalSeconds) {
    return "Send now";
  }
  return "Next send in " + formatAutomatedFollowupCountdown(totalSeconds);
}

function startAutomatedFollowupCountdown(schedule) {
  clearAutomatedFollowupCountdownTimer();
  var target = $("#automatedFollowupCountdown");
  if (!target.length || !schedule) {
    return;
  }
  var currentText = String(schedule.currentLocalTime || "").trim();
  var nextText = String(schedule.nextAllowedSlot || "").trim();
  if (!currentText || !nextText || typeof moment !== "function") {
    target.text(String(schedule.scheduleText || ""));
    return;
  }
  var currentMoment = moment(currentText, "YYYY-MM-DD HH:mm:ss", true);
  var nextMoment = moment(nextText, "YYYY-MM-DD HH:mm:ss", true);
  if (!currentMoment.isValid() || !nextMoment.isValid()) {
    target.text(String(schedule.scheduleText || ""));
    return;
  }
  var friendlyDate = nextMoment.format("ddd, DD MMM YYYY [at] hh:mm A");
  var updateCountdown = function () {
    var totalSeconds = Math.abs(nextMoment.diff(currentMoment, "seconds"));
    target.text("Next send in " + formatAutomatedFollowupCountdown(totalSeconds) + " · " + friendlyDate);
    currentMoment.add(1, "second");
    if (currentMoment.isSameOrAfter(nextMoment)) {
      target.text("Send now");
      clearAutomatedFollowupCountdownTimer();
    }
  };
  updateCountdown();
  window.LEAD_AUTOMATION_STATE = window.LEAD_AUTOMATION_STATE || {};
  window.LEAD_AUTOMATION_STATE.automatedFollowupCountdownTimer = setInterval(updateCountdown, 1000);
}

function renderAutomatedFollowupPopup(data) {
  if (!data || data.status !== "SUCCESS") {
    return getAutomatedFollowupErrorHtml((data && data.message) ? data.message : "Unable to load automated follow-up preview.");
  }
  var leadTags = Array.isArray(data.leadTags) ? data.leadTags : [];
  var logs = Array.isArray(data.logs) ? data.logs : [];
  var mediaList = Array.isArray(data.mediaList) ? data.mediaList : [];
  var template = data.template || {};
  var schedule = data.schedule || {};
  var isNoMatch = String(data.sendStatus || "") === "NO_MATCH";
  var currentSendStatus = String(data.sendStatus || "").toUpperCase();
  // After a successful send treat the lead as PAUSED for the current render
  if (currentSendStatus === "SENT") currentSendStatus = "PAUSED";
  var alertTime = (currentSendStatus === "NO_MATCH" || currentSendStatus === "PAUSED" || currentSendStatus === "SKIPPED") ? "" : getAutomatedFollowupCountdownText(schedule);
  clearAutomatedFollowupCountdownTimer();

  // ── Initialise popup state
  window.AUTOMATED_FOLLOWUP_STATE = window.AUTOMATED_FOLLOWUP_STATE || {};
  var st = window.AUTOMATED_FOLLOWUP_STATE;
  st.leadId             = data.leadId   || null;
  st.leadNo             = data.leadNo   || null;
  st.availableTemplates = Array.isArray(data.availableTemplates) ? data.availableTemplates : [];
  st.availableMedia     = Array.isArray(data.availableMedia)     ? data.availableMedia     : [];
  // Store full media objects so rendering never needs a reverse lookup (avoids 0-card bug)
  st.selectedMediaItems = mediaList.slice();
  st.selectedMediaIds   = mediaList.map(function (m) { return m.id; }).filter(function (id) { return id !== undefined && id !== null; });
  // Always default to AI Design — user can manually switch to a template
  st.selectedTemplateId = null;
  st.templateMode       = "AI";
  st.actionTaken        = false; // Allow template switching until an action button is clicked

  // Build initial body text (raw HTML for Jodit)
  var previewTemplateBody = template && template.body ? String(template.body) : "";
  var previewMessage = stripAttachmentSection(data.finalMessage || "");
  if (!String(previewMessage || "").trim()) previewMessage = stripAttachmentSection(previewTemplateBody);
  if (!String(previewMessage || "").trim()) previewMessage = "";
  st.initialBody = previewMessage;

  var html = '';
  html += '<div class="lead-automation-sectionHeader">';
  html += '  <div class="lead-automation-sectionHeader__title"><span class="lead-automation-sectionHeader__bullet"></span>AI analysis & automated follow-up</div>';
  html += '</div>';
  html += '<div class="lead-automation-followupWrap">';
  html += '  <div class="lead-automation-followupTop">';
  html += '    <div class="lead-automation-tags lead-automation-tags--tight">';
  if (leadTags.length) {
    for (var i = 0; i < leadTags.length; i++) {
      html += '<span class="lead-automation-tag">' + escapeHtml(String(leadTags[i])) + '</span>';
    }
  } else {
    html += '<span class="lead-automation-tag">No tags found</span>';
  }
  html += '    </div>';
  html += '    <div class="lead-automation-followupAlert">';
  html += '      <span class="lead-automation-followupAlert__dot"></span>';
  html += '      <span class="lead-automation-followupAlert__text">' + escapeHtml(data.message || "Follow-up preview prepared.") + '</span>';
  if (alertTime) {
    html += '      <span class="lead-automation-followupAlert__time" id="automatedFollowupCountdown">' + escapeHtml(alertTime) + '</span>';
  }
  html += '    </div>';
  html += '  </div>';
  if (isNoMatch) {
    html += '  <div class="lead-automation-followupPreview">';
    html += '    <div class="lead-automation-followupPreview__label">Matching template</div>';
    html += '    <div class="lead-automation-followupPreview__body" style="font-size:14px;font-weight:600;">No template matched the current lead tags, so no scheduled preview is available.</div>';
    html += '  </div>';
  } else {
    var previewRecipient   = data.recipientEmail      ? String(data.recipientEmail)      : "";
    var previewWindowStart = schedule.windowStart     ? String(schedule.windowStart)     : "";
    var previewWindowEnd   = schedule.windowEnd       ? String(schedule.windowEnd)       : "";

    var previewSubject = data.emailSubject ? String(data.emailSubject) : "";
    html += '  <div class="lead-automation-followupRow">';
    html += '    <div class="lead-automation-followupField lead-automation-followupField--template">';
    html += '      <label class="lead-automation-label" style="font-size:12px;font-weight:600;color:#667085;margin-bottom:4px;display:block;">Template</label>';
    html += '      <select id="automatedFollowupTemplateSelect" style="width:100%;padding:6px 10px;border:1px solid #d0d5dd;border-radius:6px;font-size:13px;">';
    html += '        <option value="" data-mode="AI" data-subject=""' + (!st.selectedTemplateId ? ' selected' : '') + '>Let AI Design ✨</option>';
    for (var ti = 0; ti < st.availableTemplates.length; ti++) {
      var tmpl = st.availableTemplates[ti];
      if (tmpl.itemType === "AI_TEMPLATE") continue; // skip sentinel from backend list
      var tmplSelected = (st.selectedTemplateId && String(st.selectedTemplateId) === String(tmpl.id || "")) ? ' selected' : '';
      html += '        <option value="' + escapeHtml(String(tmpl.id || "")) + '" data-mode="MANUAL" data-subject="' + escapeHtml(tmpl.subject || "") + '"' + tmplSelected + '>' + escapeHtml(tmpl.name || "") + '</option>';
    }
    html += '      </select>';
    html += '    </div>';

    html += '    <div class="lead-automation-followupField lead-automation-followupField--subject">';
    html += '      <label class="lead-automation-label" style="font-size:12px;font-weight:600;color:#667085;margin-bottom:4px;display:block;">Subject <span style="font-size:11px;font-weight:400;">— editable</span></label>';
    html += '      <input type="text" id="automatedFollowupSubjectInput" value="' + escapeHtml(previewSubject) + '" style="width:100%;padding:7px 10px;border:1px solid #d0d5dd;border-radius:6px;font-size:13px;" placeholder="Email subject..." />';
    html += '    </div>';
    html += '  </div>';

    // ── Editable message editor (Jodit will be initialised after DOM is ready)
    html += '  <div class="lead-automation-followupPreview">';
    html += '    <div class="lead-automation-followupPreview__label">Scheduled ' + escapeHtml(String(data.channel || "EMAIL")) + ' message <span style="font-size:11px;color:#667085;font-weight:400;">— editable</span></div>';
    html += '    <textarea id="automatedFollowupBodyEditor" style="width:100%;min-height:160px;border:1px solid #d0d5dd;border-radius:6px;padding:8px;font-size:13px;"></textarea>';
    html += '    <div class="lead-automation-followupPreview__meta" style="margin-top:6px;">';
    html += '      <span>via ' + escapeHtml(String(data.channel || "N/A")) + '</span>';
    html += '      <span>Recipient: ' + escapeHtml(previewRecipient || "N/A") + '</span>';
    html += '      <span>Window: ' + escapeHtml(previewWindowStart || "N/A") + ' – ' + escapeHtml(previewWindowEnd || "N/A") + '</span>';
    html += '    </div>';
    html += '  </div>';

    // ── Editable attachments
    html += '  <div class="lead-automation-attachments" id="automatedFollowupAttachmentsWrap">';
    html += renderAutomatedFollowupEditableAttachments();
    html += '  </div>';

    // ── Action buttons
    html += '  <div class="lead-automation-followupActions">';
    html += '    <button type="button" class="lead-automation-actionBtn lead-automation-actionBtn--primary" data-afp-action="SEND_NOW">Send now</button>';
    if (currentSendStatus === "PAUSED") {
      html += '    <button type="button" class="lead-automation-actionBtn" style="background:#22c55e;color:#fff;" data-afp-action="RESUME">&#9654; Resume</button>';
    } else {
      html += '    <button type="button" class="lead-automation-actionBtn" data-afp-action="PAUSE">Pause</button>';
    }
    html += '    <button type="button" class="lead-automation-actionBtn" data-afp-action="SKIP">Skip</button>';
    html += '  </div>';
  }
  if (!isNoMatch && currentSendStatus !== "PAUSED" && currentSendStatus !== "SKIPPED") {
    setTimeout(function () { startAutomatedFollowupCountdown(schedule); }, 0);
  }
  st.followupLogs = logs; // Store logs for eye-button detail view
  if (logs.length) {
    var stLogsCollapsed = !!(window.AUTOMATED_FOLLOWUP_STATE && window.AUTOMATED_FOLLOWUP_STATE.followupLogsCollapsed);
    html += '  <div class="lead-automation-followupLogPanel' + (stLogsCollapsed ? ' is-collapsed' : '') + '">';
    html += '    <button type="button" class="lead-automation-followupLogPanel__header" data-afp-action="toggle-logs" aria-expanded="' + (stLogsCollapsed ? 'false' : 'true') + '">';
    html += '      <span>AI automation log (' + logs.length + ' entries)</span>';
    html += '      <span class="lead-automation-followupLogPanel__chevron">⌃</span>';
    html += '    </button>';
    html += '    <div class="lead-automation-followupLogList">';
    for (var j = 0; j < logs.length; j++) {
      html += renderAutomatedFollowupLogItem(logs[j], j);
    }
    html += '    </div>';
    html += '  </div>';
  }
  html += '</div>';

  // ── Hidden media-picker modal
  html += '<div id="afpMediaPickerModal" style="display:none;position:fixed;inset:0;z-index:9999;">';
  html += '  <div style="position:absolute;inset:0;background:rgba(0,0,0,.45);" data-afp-action="close-picker"></div>';
  html += '  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;border-radius:10px;width:480px;max-width:96vw;max-height:80vh;display:flex;flex-direction:column;">';
  html += '    <div style="padding:14px 16px;border-bottom:1px solid #e4e7ec;display:flex;justify-content:space-between;align-items:center;">';
  html += '      <strong style="font-size:14px;">Add Resource</strong>';
  html += '      <button type="button" style="background:none;border:none;font-size:18px;cursor:pointer;line-height:1;" data-afp-action="close-picker">&times;</button>';
  html += '    </div>';
  html += '    <div id="afpMediaPickerList" style="overflow-y:auto;flex:1;padding:10px 16px;"></div>';
  html += '    <div style="padding:10px 16px;border-top:1px solid #e4e7ec;display:flex;gap:8px;">';
  html += '      <button type="button" class="lead-automation-actionBtn lead-automation-actionBtn--primary" data-afp-action="confirm-picker">Add selected</button>';
  html += '      <button type="button" class="lead-automation-actionBtn" data-afp-action="close-picker">Cancel</button>';
  html += '    </div>';
  html += '  </div>';
  html += '</div>';

  return html;
}

function renderAutomatedFollowupLogItem(item, index) {
  item = item || {};
  var avatarVariant = item.avatarVariant || "";
  var badgeVariant = item.badgeVariant || "";
  var isSent = String(item.badgeLabel || "").toUpperCase() === "SENT";
  var html = '';
  html += '<div class="lead-automation-followupLog">';
  html += '  <div class="lead-automation-followupLog__avatar ' + escapeHtml(avatarVariant) + '">' + escapeHtml(item.avatarText || "LG") + '</div>';
  html += '  <div class="lead-automation-followupLog__body">';
  html += '    <div class="lead-automation-followupLog__title">';
  html += '      <span class="lead-automation-followupLog__titleText">' + escapeHtml(item.title || "Log entry") + '</span>';
  html += '      <span class="lead-automation-badge ' + escapeHtml(badgeVariant) + '">' + escapeHtml(item.badgeLabel || "Info") + '</span>';
  if (item.createdByName) {
    html += '      <span style="font-size:11px;color:#667085;margin-left:6px;">by ' + escapeHtml(item.createdByName) + '</span>';
  }
  html += '    </div>';
  html += '    <div class="lead-automation-followupLog__desc">' + renderLineBreaks(item.description || "") + '</div>';
  html += '  </div>';
  html += '  <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">';
  html += '    <span class="lead-automation-followupLog__time">' + escapeHtml(item.timeLabel || "") + '</span>';
  if (isSent) {
    html += '    <button type="button" class="lead-automation-logViewBtn" data-afp-action="view-log-detail" data-log-index="' + index + '"'
         +  '      title="View detail" style="background:none;border:1px solid #d0d5dd;border-radius:6px;padding:4px 8px;cursor:pointer;font-size:14px;line-height:1;color:#475467;">&#128065;</button>';
  }
  html += '  </div>';
  html += '</div>';
  return html;
}

function renderAutomatedFollowupAttachments(mediaList) {
  var html = '';
  html += '<div class="lead-automation-attachments">';
  html += '  <div class="lead-automation-attachments__title">Attachments</div>';
  html += '  <div class="lead-automation-attachmentGrid">';
  for (var i = 0; i < mediaList.length; i++) {
    html += renderAutomatedFollowupAttachmentCard(mediaList[i]);
  }
  html += '  </div>';
  html += '</div>';
  return html;
}

function renderAutomatedFollowupAttachmentCard(item) {
  item = item || {};
  var fileUrl = String(item.fileUrl || "");
  var fileName = String(item.name || item.title || "Attachment");
  var mediaType = String(item.mediaType || "").toLowerCase();
  var isImage = /^(image|img)/.test(mediaType) || /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(fileUrl);
  var isVideo = /^(video|mp4|quicktime)/.test(mediaType) || /\.(mp4|mov|webm|m4v)$/i.test(fileUrl);
  var html = '';
  html += '<div class="lead-automation-attachmentCard" onclick="openAutomatedFollowupAttachment(\'' + escapeJs(fileUrl) + '\')">';
  html += '  <div class="lead-automation-attachmentThumb">';
  if (isImage) {
    html += '<img src="' + escapeHtml(fileUrl) + '" alt="' + escapeHtml(fileName) + '"/>';
  } else if (isVideo) {
    html += '<video src="' + escapeHtml(fileUrl) + '" muted playsinline preload="metadata"></video>';
  } else {
    html += '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:10px;text-align:center;width:100%;height:100%;">';
    html += '  <span style="font-size:26px;line-height:1;">📎</span>';
    html += '  <span>Preview</span>';
    html += '</div>';
  }
  html += '  </div>';
  html += '  <div class="lead-automation-attachmentMeta">' + escapeHtml(fileName) + '<small>' + escapeHtml(mediaType || "file") + '</small></div>';
  html += '</div>';
  return html;
}

// ── Jodit editor lifecycle ────────────────────────────────────────────────

function initAutomatedFollowupBodyEditor(initialValue) {
  destroyAutomatedFollowupBodyEditor();
  var el = document.getElementById("automatedFollowupBodyEditor");
  if (!el) return;
  if (typeof Jodit === "undefined") {
    // Jodit not available — just set textarea value for plain-text fallback
    el.value = String(initialValue || "");
    return;
  }
  var editor = new Jodit(el, {
    height: 220,
    toolbarButtonSize: "small",
    toolbarSticky: false,
    buttons: ["bold", "italic", "underline", "|", "ul", "ol", "|", "link", "|", "undo", "redo"],
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    spellcheck: false
  });
  editor.value = String(initialValue || "");
  window.AUTOMATED_FOLLOWUP_STATE = window.AUTOMATED_FOLLOWUP_STATE || {};
  window.AUTOMATED_FOLLOWUP_STATE.bodyEditorInstance = editor;
}

function destroyAutomatedFollowupBodyEditor() {
  var st = window.AUTOMATED_FOLLOWUP_STATE;
  if (st && st.bodyEditorInstance && st.bodyEditorInstance.destruct) {
    try { st.bodyEditorInstance.destruct(); } catch (e) {}
    st.bodyEditorInstance = null;
  }
}

function getAutomatedFollowupBodyEditorValue() {
  var st = window.AUTOMATED_FOLLOWUP_STATE;
  if (st && st.bodyEditorInstance && st.bodyEditorInstance.value !== undefined) {
    return st.bodyEditorInstance.value;
  }
  var el = document.getElementById("automatedFollowupBodyEditor");
  return el ? el.value : "";
}

function setAutomatedFollowupBodyEditorValue(html) {
  var st = window.AUTOMATED_FOLLOWUP_STATE;
  if (st && st.bodyEditorInstance && st.bodyEditorInstance.value !== undefined) {
    st.bodyEditorInstance.value = html || "";
  } else {
    var el = document.getElementById("automatedFollowupBodyEditor");
    if (el) el.value = html || "";
  }
}

/**
 * Called when template dropdown changes.
 * For MANUAL template → body is loaded directly from pre-fetched availableTemplates (no extra API call).
 * For "Let AI Design" → backend generates fresh AI email via dryRun API call.
 */
function reloadAutomatedFollowupBody(templateMode, templateId) {
  var st = window.AUTOMATED_FOLLOWUP_STATE || {};
  var leadId = st.leadId || null;
  var leadNo = st.leadNo || null;
  if (!leadId && !leadNo) return;

  // ── MANUAL template: use body already loaded in st.availableTemplates (fast, no API call needed)
  if (templateMode === "MANUAL" && templateId) {
    var templates = Array.isArray(st.availableTemplates) ? st.availableTemplates : [];
    for (var i = 0; i < templates.length; i++) {
      var t = templates[i];
      if (t && t.id && String(t.id) === String(templateId)) {
        var body = String(t.body || "");
        body = (typeof stripAttachmentSection === "function") ? stripAttachmentSection(body) : body;
        setAutomatedFollowupBodyEditorValue(body);
        return;
      }
    }
    // Template not found in list — clear editor
    setAutomatedFollowupBodyEditorValue("");
    return;
  }

  // ── AI mode: call backend to generate fresh AI email
  var schoolPath = (typeof SCHOOL_UUID !== "undefined" && SCHOOL_UUID)
    ? SCHOOL_UUID : ((typeof SCHOOL_ID !== "undefined" && SCHOOL_ID) ? SCHOOL_ID : "");

  setAutomatedFollowupBodyEditorValue('<p style="color:#94a3b8;font-style:italic;">Generating message…</p>');

  var reloadFileUrls = (Array.isArray(st.selectedMediaItems) ? st.selectedMediaItems : [])
                        .map(function (m) { return m.fileUrl || ""; })
                        .filter(function (u) { return u !== ""; });
  var request = {
    schoolId:           SCHOOL_ID,
    leadId:             leadId ? parseInt(leadId, 10) : null,
    leadNo:             leadNo || "",
    dryRun:             true,
    requestSource:      "",
    testEmail:          "",
    followupAction:     "",
    templateMode:       "AI",
    selectedTemplateId: null,
    customBody:         null,
    selectedMediaIds:   Array.isArray(st.selectedMediaIds) && st.selectedMediaIds.length
                          ? st.selectedMediaIds : null,
    selectedFileUrls:   reloadFileUrls.length ? reloadFileUrls : null
  };

  $.ajax({
    type:        "POST",
    url:         BASE_URL + CONTEXT_PATH + schoolPath + "/dashboard/lead-automation-followup/process",
    contentType: "application/json",
    dataType:    "json",
    data:        JSON.stringify(request),
    success: function (response) {
      var data = typeof response === "string" ? JSON.parse(response) : response;
      if (data && data.status === "SUCCESS") {
        var aiBody = data.finalMessage || "";
        aiBody = (typeof stripAttachmentSection === "function") ? stripAttachmentSection(aiBody) : aiBody;
        setAutomatedFollowupBodyEditorValue(aiBody || "");
        // Update subject from AI-generated emailSubject
        if (data.emailSubject) {
          $("#automatedFollowupSubjectInput").val(data.emailSubject);
        }
        if (Array.isArray(data.mediaList) && data.mediaList.length > 0) {
          var newIds = data.mediaList.map(function (m) { return m.id; }).filter(function (id) { return id != null; });
          if (newIds.length > 0) {
            st.selectedMediaItems = data.mediaList.slice();
            st.selectedMediaIds   = newIds;
            refreshAutomatedFollowupAttachments();
          }
        }
      } else {
        setAutomatedFollowupBodyEditorValue("");
      }
    },
    error: function () {
      setAutomatedFollowupBodyEditorValue("");
    }
  });
}

// ── Editable attachments ──────────────────────────────────────────────────

function renderAutomatedFollowupEditableAttachments() {
  var st = window.AUTOMATED_FOLLOWUP_STATE || {};

  // Primary source: full media objects. Fall back to ID-lookup in availableMedia if needed.
  var selectedItems = Array.isArray(st.selectedMediaItems) ? st.selectedMediaItems : [];
  if (selectedItems.length === 0 && Array.isArray(st.selectedMediaIds) && st.selectedMediaIds.length > 0) {
    var allMedia = Array.isArray(st.availableMedia) ? st.availableMedia : [];
    var byId = {};
    for (var k = 0; k < allMedia.length; k++) {
      if (allMedia[k].id != null) byId[String(allMedia[k].id)] = allMedia[k];
    }
    for (var ki = 0; ki < st.selectedMediaIds.length; ki++) {
      var obj = byId[String(st.selectedMediaIds[ki])];
      if (obj) selectedItems.push(obj);
    }
  }

  var html =
    '<div style="font-size:12px;font-weight:600;color:#667085;margin-bottom:10px;text-transform:uppercase;letter-spacing:.5px;">Attachments</div>' +
    '<div id="automatedFollowupAttachmentCards" style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:12px;">';

  if (selectedItems.length === 0) {
    html += '<span style="font-size:13px;color:#98a2b3;font-style:italic;">No attachments selected.</span>';
  } else {
    for (var i = 0; i < selectedItems.length; i++) {
      var m = selectedItems[i];
      var mid = m.id;
      if (!m) continue;

      var name     = escapeHtml(m.name || m.title || "File");
      var mType    = String(m.mediaType || "").toUpperCase();
      var typeText = escapeHtml((m.mediaType || "").toLowerCase()) || "file";
      var fileUrl  = escapeHtml(m.fileUrl || "");
      var isImage  = mType === "IMAGE" || mType === "IMAGES" || /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?|$)/i.test(fileUrl);
      var isVideo  = mType === "VIDEO" || mType === "VIDEOS" || /\.(mp4|webm|ogg|mov)(\?|$)/i.test(fileUrl);

      // thumbnail area content
      var thumbHtml;
      if (isImage) {
        thumbHtml =
          '<img src="' + fileUrl + '" alt="' + name + '" ' +
            'style="width:100%;height:100%;object-fit:cover;border-radius:8px;" />';
      } else if (isVideo) {
        thumbHtml =
          '<div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#f1f5f9;border-radius:8px;color:#64748b;">' +
            '<span style="font-size:28px;">&#127916;</span>' +
            '<span style="font-size:10px;margin-top:4px;">video</span>' +
          '</div>';
      } else {
        // PDF / other
        thumbHtml =
          '<div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#fef3f2;border-radius:8px;color:#b42318;">' +
            '<span style="font-size:28px;">&#128196;</span>' +
            '<span style="font-size:10px;margin-top:4px;">' + typeText + '</span>' +
          '</div>';
      }

      var aiLabel = m.aiScored
        ? '<span style="font-size:9px;background:#eff8ff;color:#175cd3;border:1px solid #b2ddff;border-radius:8px;padding:1px 5px;font-weight:700;margin-left:3px;vertical-align:middle;">AI</span>'
        : "";

      html +=
        '<div style="position:relative;width:120px;flex-shrink:0;">' +
          // card (clickable = preview)
          '<div data-afp-action="preview-attachment" data-file-url="' + fileUrl + '" data-file-name="' + name + '" data-media-type="' + escapeHtml(m.mediaType || "") + '" ' +
            'style="width:120px;height:90px;border:1px solid #e4e7ec;border-radius:10px;overflow:hidden;cursor:pointer;background:#f9fafb;" title="Preview ' + name + '">' +
            thumbHtml +
          '</div>' +
          // delete X — top-right
          '<button type="button" data-afp-action="remove-attachment" data-media-id="' + escapeHtml(String(mid)) + '" data-file-url="' + fileUrl + '" title="Remove" ' +
            'style="position:absolute;top:-7px;right:-7px;width:22px;height:22px;border-radius:50%;background:#ef4444;border:none;color:#fff;font-size:14px;font-weight:700;cursor:pointer;line-height:1;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 4px rgba(0,0,0,.2);">&times;</button>' +
          // filename below card
          '<div style="margin-top:5px;font-size:11px;color:#344054;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:120px;" title="' + name + '">' + name + aiLabel + '</div>' +
        '</div>';
    }
  }

  html +=
    '</div>' +
    '<button type="button" data-afp-action="add-attachment" ' +
      'style="font-size:12px;color:#0d6efd;background:none;border:none;cursor:pointer;padding:2px 0;font-weight:500;">+ Add Resource</button>';
  return html;
}

function afpMediaIcon(mediaType) {
  var t = String(mediaType || "").toLowerCase();
  if (t === "pdf") return "📄";
  if (t === "video" || t === "mp4") return "🎬";
  if (t === "image" || t === "jpg" || t === "png" || t === "jpeg") return "🖼️";
  return "📎";
}

function refreshAutomatedFollowupAttachments() {
  var wrap = document.getElementById("automatedFollowupAttachmentsWrap");
  if (wrap) wrap.innerHTML = renderAutomatedFollowupEditableAttachments();
}

function renderAutomatedFollowupMediaPickerList() {
  var st = window.AUTOMATED_FOLLOWUP_STATE || {};
  var allMedia    = Array.isArray(st.availableMedia)   ? st.availableMedia   : [];
  var selectedIds = Array.isArray(st.selectedMediaIds) ? st.selectedMediaIds : [];
  var html = "";
  if (allMedia.length === 0) {
    html = '<p style="padding:12px;color:#98a2b3;font-size:13px;">No media resources available.</p>';
  } else {
    for (var i = 0; i < allMedia.length; i++) {
      var m = allMedia[i];
      var isChecked = (selectedIds.indexOf(m.id) !== -1) ? "checked" : "";
      var aiLabel = m.aiScored
        ? ' <span style="font-size:10px;background:#eff8ff;color:#175cd3;border:1px solid #b2ddff;border-radius:3px;padding:1px 4px;">AI</span>'
        : "";
      html += '<label style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid #f2f4f7;cursor:pointer;font-size:13px;">';
      html += '<input type="checkbox" value="' + escapeHtml(String(m.id != null ? m.id : "")) + '" ' + isChecked + ' style="width:15px;height:15px;" />';
      html += afpMediaIcon(m.mediaType) + ' ';
      html += '<span style="flex:1;">' + escapeHtml(m.name || m.title || "File") + aiLabel + '</span>';
      html += '<span style="color:#98a2b3;font-size:11px;">' + escapeHtml(m.mediaType || "") + '</span>';
      html += '</label>';
    }
  }
  $("#afpMediaPickerList").html(html);
}

// ── Event delegation for popup actions ───────────────────────────────────
// (Attached once; guarded by data-afp-bound flag to avoid double-binding)

$(document).off("change.afp click.afp").on("change.afp", "#automatedFollowupTemplateSelect", function () {
  var st = window.AUTOMATED_FOLLOWUP_STATE = window.AUTOMATED_FOLLOWUP_STATE || {};
  // After an action (SEND_NOW/RESUME/PAUSE/SKIP), lock template changes
  if (st.actionTaken) return;
  var $opt = $(this).find("option:selected");
  st.templateMode       = $opt.data("mode") || "AI";
  st.selectedTemplateId = $(this).val() ? parseInt($(this).val(), 10) : null;
  // Update subject: MANUAL → from data-subject, AI → cleared now, set from API response
  var templateSubject = $opt.data("subject") || "";
  $("#automatedFollowupSubjectInput").val(templateSubject);
  // Reload editor body for the newly selected template / AI mode
  reloadAutomatedFollowupBody(st.templateMode, st.selectedTemplateId || null);
}).on("click.afp", "[data-afp-action]", function (e) {
  var action = $(this).data("afp-action");
  var st = window.AUTOMATED_FOLLOWUP_STATE = window.AUTOMATED_FOLLOWUP_STATE || {};

  if (action === "remove-attachment") {
    var mid = $(this).data("media-id");
    var removeUrl = String($(this).data("file-url") || "");
    var removed = false;
    // Filter the full-objects array — use fileUrl to distinguish cards that share the same media id
    // (e.g. a single media record with multiple uploaded files)
    st.selectedMediaItems = (Array.isArray(st.selectedMediaItems) ? st.selectedMediaItems : [])
      .filter(function (m) {
        if (String(m.id) !== String(mid)) return true;   // different id → always keep
        // Same id: if we have a URL to distinguish, only remove the exact file
        if (removeUrl && String(m.fileUrl || "") === removeUrl && !removed) {
          removed = true;
          return false;  // remove exactly this one card
        }
        // Same id but different URL (sibling file) → keep
        if (removeUrl && String(m.fileUrl || "") !== removeUrl) return true;
        // No URL differentiation possible → remove (fallback for legacy items)
        if (!removed) { removed = true; return false; }
        return true;
      });
    st.selectedMediaIds = st.selectedMediaItems.map(function (m) { return m.id; });
    refreshAutomatedFollowupAttachments();

  } else if (action === "add-attachment") {
    renderAutomatedFollowupMediaPickerList();
    $("#afpMediaPickerModal").show();

  } else if (action === "close-picker") {
    $("#afpMediaPickerModal").hide();

  } else if (action === "confirm-picker") {
    var checked = [];
    $("#afpMediaPickerList input[type=checkbox]:checked").each(function () {
      var v = $(this).val();
      if (v !== "") checked.push(isNaN(v) ? v : parseInt(v, 10));
    });
    st.selectedMediaIds = checked;
    // Rebuild selectedMediaItems from the picked IDs using availableMedia
    var _all = Array.isArray(st.availableMedia) ? st.availableMedia : [];
    var _byId = {};
    for (var _k = 0; _k < _all.length; _k++) { if (_all[_k].id != null) _byId[String(_all[_k].id)] = _all[_k]; }
    st.selectedMediaItems = checked.map(function (id) { return _byId[String(id)]; }).filter(Boolean);
    $("#afpMediaPickerModal").hide();
    refreshAutomatedFollowupAttachments();

  } else if (action === "preview-attachment") {
    var fileUrl  = $(this).data("file-url")  || "";
    var fileName = $(this).data("file-name") || "Attachment";
    var mType    = String($(this).data("media-type") || "").toUpperCase();
    if (!fileUrl) return;

    var isImage = /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?|$)/i.test(fileUrl) || mType === "IMAGE" || mType === "IMAGES";
    var isVideo = /\.(mp4|webm|ogg|mov|avi|mkv)(\?|$)/i.test(fileUrl) || mType === "VIDEO" || mType === "VIDEOS";

    // Remove any existing preview modal
    $("#afpPreviewModal").remove();

    var innerHtml;
    if (isImage) {
      innerHtml = '<img src="' + fileUrl + '" alt="' + fileName + '" style="max-width:100%;max-height:70vh;border-radius:6px;display:block;margin:auto;" />';
    } else if (isVideo) {
      innerHtml = '<video controls autoplay style="max-width:100%;max-height:70vh;border-radius:6px;display:block;margin:auto;">' +
                    '<source src="' + fileUrl + '">' +
                    'Your browser does not support video playback.' +
                  '</video>';
    } else {
      // PDF or other — open in new tab
      window.open(fileUrl, "_blank");
      return;
    }

    var modalHtml =
      '<div id="afpPreviewModal" style="display:flex;position:fixed;inset:0;z-index:10000;align-items:center;justify-content:center;">' +
        '<div style="position:absolute;inset:0;background:rgba(0,0,0,.7);" id="afpPreviewBackdrop"></div>' +
        '<div style="position:relative;z-index:1;background:#1e293b;border-radius:10px;padding:12px;max-width:92vw;max-height:90vh;overflow:auto;">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">' +
            '<span style="color:#f1f5f9;font-size:13px;font-weight:600;max-width:320px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="' + fileName + '">' + fileName + '</span>' +
            '<button id="afpPreviewClose" style="background:none;border:none;color:#94a3b8;font-size:22px;cursor:pointer;line-height:1;padding:0 4px;">&times;</button>' +
          '</div>' +
          innerHtml +
        '</div>' +
      '</div>';

    $("body").append(modalHtml);
    $("#afpPreviewClose, #afpPreviewBackdrop").one("click", function () {
      $("#afpPreviewModal").remove();
    });

  } else if (action === "toggle-logs") {
    st.followupLogsCollapsed = !st.followupLogsCollapsed;
    var panel = $("#automatedFollowupPopupForm .lead-automation-followupLogPanel");
    var list = panel.find(".lead-automation-followupLogList");
    panel.toggleClass("is-collapsed", st.followupLogsCollapsed);
    panel.find(".lead-automation-followupLogPanel__header").attr("aria-expanded", st.followupLogsCollapsed ? "false" : "true");
    panel.find(".lead-automation-followupLogPanel__chevron").text(st.followupLogsCollapsed ? "⌄" : "⌃");
    list.stop(true, true).slideToggle(180);

  } else if (action === "view-log-detail") {
    var logIdx = parseInt($(this).data("log-index"), 10);
    var allLogs = Array.isArray(st.followupLogs) ? st.followupLogs : [];
    var logItem = allLogs[logIdx];
    if (logItem) showAutomatedFollowupLogDetail(logItem);

  } else if (action === "SEND_NOW" || action === "PAUSE" || action === "RESUME" || action === "SKIP") {
    st.actionTaken = true; // Lock template changes after action button click
    triggerAutomatedFollowupAction(action);
  }
});

function showAutomatedFollowupLogDetail(item) {
  $("#afpLogDetailModal").remove();
  var body = item.emailBody || "";
  var recipient = item.recipientEmail || "N/A";
  var channel = item.channel || "N/A";
  var status = item.badgeLabel || "N/A";
  var time = item.timeLabel || "";
  var by = item.createdByName || "System";
  var resources = item.description || "N/A";

  var html = '';
  html += '<div id="afpLogDetailModal" style="display:flex;position:fixed;inset:0;z-index:10000;align-items:center;justify-content:center;">';
  html += '  <div style="position:absolute;inset:0;background:rgba(0,0,0,.5);" id="afpLogDetailBackdrop"></div>';
  html += '  <div style="position:relative;z-index:1;background:#fff;border-radius:12px;width:680px;max-width:96vw;max-height:88vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.2);">';
  // Header
  html += '    <div style="padding:16px 20px;border-bottom:1px solid #e4e7ec;display:flex;justify-content:space-between;align-items:center;">';
  html += '      <div>';
  html += '        <strong style="font-size:15px;">Follow-up Detail</strong>';
  html += '        <span class="lead-automation-badge ' + escapeHtml(item.badgeVariant || "") + '" style="margin-left:8px;">' + escapeHtml(status) + '</span>';
  html += '      </div>';
  html += '      <button type="button" id="afpLogDetailClose" style="background:none;border:none;font-size:22px;cursor:pointer;line-height:1;color:#667085;">&times;</button>';
  html += '    </div>';
  // Meta
  html += '    <div style="padding:12px 20px;background:#f9fafb;border-bottom:1px solid #e4e7ec;display:flex;flex-wrap:wrap;gap:16px;font-size:12px;color:#475467;">';
  html += '      <span><strong>Channel:</strong> ' + escapeHtml(channel) + '</span>';
  html += '      <span><strong>Recipient:</strong> ' + escapeHtml(recipient) + '</span>';
  html += '      <span><strong>Sent by:</strong> ' + escapeHtml(by) + '</span>';
  html += '      <span><strong>Date:</strong> ' + escapeHtml(time) + '</span>';
  html += '    </div>';
  // Resources
  html += '    <div style="padding:10px 20px;border-bottom:1px solid #e4e7ec;font-size:12px;color:#475467;">';
  html += '      <strong>Matched Resources:</strong> ' + escapeHtml(resources);
  html += '    </div>';
  // Email body + Attachments (scrollable area)
  html += '    <div style="padding:16px 20px;overflow-y:auto;flex:1;">';
  // Body
  html += '      <div style="font-size:13px;line-height:1.6;color:#1d2939;margin-bottom:16px;">';
  if (body) {
    html += body;
  } else {
    html += '<span style="color:#98a2b3;font-style:italic;">Email body not available.</span>';
  }
  html += '      </div>';
  // Attachment thumbnails
  var fileUrls = Array.isArray(item.fileUrls) ? item.fileUrls : [];
  var fileTitles = Array.isArray(item.fileTitles) ? item.fileTitles : [];
  if (fileUrls.length > 0) {
    html += '      <div style="margin-top:12px;padding-top:12px;border-top:1px solid #e4e7ec;">';
    html += '        <div style="margin-bottom:8px;font-size:12px;font-weight:600;color:#667085;text-transform:uppercase;letter-spacing:.4px;">Attachments (' + fileUrls.length + ')</div>';
    html += '        <div style="display:flex;flex-wrap:wrap;gap:12px;">';
    for (var fi = 0; fi < fileUrls.length; fi++) {
      var url  = fileUrls[fi];
      var name = fileTitles[fi] || ("File " + (fi + 1));
      var lower = url.toLowerCase();
      var isImg = /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?|$)/.test(lower);
      var isVid = /\.(mp4|webm|ogg|mov)(\?|$)/.test(lower);
      var thumb;
      if (isImg) {
        thumb = '<img src="' + escapeHtml(url) + '" alt="' + escapeHtml(name) + '" style="width:100%;height:100%;object-fit:cover;border-radius:6px;" />';
      } else if (isVid) {
        thumb = '<div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#f1f5f9;border-radius:6px;color:#64748b;"><span style="font-size:24px;">&#127916;</span><span style="font-size:10px;">video</span></div>';
      } else {
        thumb = '<div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#fef3f2;border-radius:6px;color:#b42318;"><span style="font-size:24px;">&#128196;</span><span style="font-size:10px;">pdf</span></div>';
      }
      html += '<div style="width:110px;flex-shrink:0;cursor:pointer;" onclick="window.open(\'' + escapeHtml(url) + '\',\'_blank\')" title="' + escapeHtml(name) + '">';
      html += '  <div style="width:110px;height:82px;border:1px solid #e4e7ec;border-radius:8px;overflow:hidden;background:#f9fafb;">' + thumb + '</div>';
      html += '  <div style="margin-top:4px;font-size:11px;color:#344054;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:110px;">' + escapeHtml(name) + '</div>';
      html += '</div>';
    }
    html += '        </div>';
    html += '      </div>';
  }
  html += '    </div>';
  // Footer
  html += '    <div style="padding:12px 20px;border-top:1px solid #e4e7ec;text-align:right;">';
  html += '      <button type="button" id="afpLogDetailCloseBtn" style="padding:7px 20px;border:1px solid #d0d5dd;border-radius:6px;background:#fff;cursor:pointer;font-size:13px;">Close</button>';
  html += '    </div>';
  html += '  </div>';
  html += '</div>';

  $("body").append(html);
  $("#afpLogDetailClose, #afpLogDetailBackdrop, #afpLogDetailCloseBtn").one("click", function () {
    $("#afpLogDetailModal").remove();
  });
}

function getAutomatedFollowupLoadingHtml() {
  return '<div class="lead-automation-followupWrap"><div class="p-4 text-center text-muted">Loading automated follow-up preview...</div></div>';
}

function getAutomatedFollowupErrorHtml(message) {
  return '<div class="lead-automation-followupWrap"><div class="p-4 text-center text-danger">' + escapeHtml(message || "Unable to load automated follow-up preview.") + '</div></div>';
}

function renderLineBreaks(text) {
  var value = String(text || "");
  value = value
    .replace(/<\s*br\s*\/?\s*>/gi, "\n")
    .replace(/<\s*\/p\s*>/gi, "\n\n")
    .replace(/<\s*p[^>]*>/gi, "")
    .replace(/<\s*div[^>]*>/gi, "")
    .replace(/<\s*\/div\s*>/gi, "\n")
    .replace(/<\s*li[^>]*>/gi, "• ")
    .replace(/<\s*\/li\s*>/gi, "\n")
    .replace(/<[^>]+>/g, "");
  value = value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
  return escapeHtml(value).replace(/\n/g, "<br/>");
}

function toPlainPreviewText(text) {
  var value = String(text || "");
  value = value
    .replace(/<\s*br\s*\/?\s*>/gi, "\n")
    .replace(/<\s*\/p\s*>/gi, "\n\n")
    .replace(/<\s*p[^>]*>/gi, "")
    .replace(/<\s*div[^>]*>/gi, "")
    .replace(/<\s*\/div\s*>/gi, "\n")
    .replace(/<\s*li[^>]*>/gi, "• ")
    .replace(/<\s*\/li\s*>/gi, "\n")
    .replace(/<[^>]+>/g, "");
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

function stripAttachmentSection(text) {
  var value = String(text || "");
  return value.replace(/\n{2,}\s*Attachments:\s*[\s\S]*$/i, "").trim();
}

function openAutomatedFollowupAttachment(url) {
  if (!url) {
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
}

function escapeJs(text) {
  return String(text || "")
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "");
}

function escapeHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// =============================================
// LEAD ENROLLMENT HOLD — Modal & Functions
// =============================================

function getLeadEnrollmentHoldPopup() {
  // Build HH options (00-12)
  var hhOptions = '<option value="00">00</option>';
  for (var i = 1; i <= 12; i++) {
    hhOptions += '<option value="' + (i > 9 ? i : '0' + i) + '">' + (i > 9 ? i : '0' + i) + '</option>';
  }
  // Build MM options (00-59)
  var mmOptions = '<option value="00">00</option>';
  for (var j = 1; j <= 59; j++) {
    mmOptions += '<option value="' + (j > 9 ? j : '0' + j) + '">' + (j > 9 ? j : '0' + j) + '</option>';
  }
  // Grade dropdown from masterContent.js
  var gradeOptions = getStandardContent(SCHOOL_ID, true, true);

  var html =
    `<style id="leadEnrollmentHoldPopupStyles">
      #leadEnrollmentHoldPopupForm .hold-enrollment-modal{border-radius:18px;overflow:hidden;box-shadow:0 18px 42px rgba(11,57,105,.18);background:#fff;}
      #leadEnrollmentHoldPopupForm .hold-enrollment-header{border-bottom:0;padding:10px 14px;background:linear-gradient(135deg,#0b78f2 0%,#1fa2ff 100%);}
      #leadEnrollmentHoldPopupForm .hold-enrollment-header .modal-title{font-size:1rem;font-weight:600;line-height:1.2;margin-right:10px;}
      #leadEnrollmentHoldPopupForm .hold-enrollment-close{display:flex;align-items:center;justify-content:center;align-self:center;width:24px;height:24px;margin:0 8px 0 auto;padding:0;background:transparent;border:0;color:#fff;opacity:1;text-shadow:none;font-size:24px;line-height:1;}
      #leadEnrollmentHoldPopupForm .hold-enrollment-close span{display:block;line-height:1;transform:translateY(-1px);}
      #leadEnrollmentHoldPopupForm .hold-enrollment-body{padding:12px 14px 10px;background:linear-gradient(180deg,#f6fbff 0%,#ffffff 58%);max-height:calc(100vh - 130px);overflow-y:auto;}
      #leadEnrollmentHoldPopupForm .hold-enrollment-footer{border-top:1px solid #e3edf8;padding:10px 14px 14px;background:#fff;}
      #leadEnrollmentHoldPopupForm .hold-enrollment-form{background:#fff;border:1px solid #dfebf8;border-radius:12px;padding:12px 12px 4px;box-shadow:0 8px 18px rgba(15,72,126,.06);}
      #leadEnrollmentHoldPopupForm .hold-enrollment-form-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:10px;}
      #leadEnrollmentHoldPopupForm .hold-enrollment-section-title{font-size:16px;font-weight:700;color:#16324f;line-height:1.15;margin-bottom:3px;}
      #leadEnrollmentHoldPopupForm .hold-enrollment-subtitle{font-size:11px;color:#667b93;max-width:360px;line-height:1.35;}
      #leadEnrollmentHoldPopupForm .hold-enrollment-chip{display:inline-flex;align-items:center;padding:5px 8px;border-radius:999px;background:#edf6ff;color:#1463c2;font-size:10px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;white-space:nowrap;}
      #leadEnrollmentHoldPopupForm .hold-enrollment-form label{margin-bottom:4px !important;color:#213349;font-weight:600;font-size:12px;}
      #leadEnrollmentHoldPopupForm .hold-enrollment-form .form-control{height:auto;min-height:31px;border-radius:8px;border:1px solid #cfdced;box-shadow:none;font-size:12px;color:#22384d;padding:4px 8px;}
      #leadEnrollmentHoldPopupForm .hold-enrollment-form .form-control:focus{border-color:#69a8ff;box-shadow:0 0 0 4px rgba(10,120,242,.12);}
      #leadEnrollmentHoldPopupForm .hold-enrollment-form .iti{width:100%;}
      #leadEnrollmentHoldPopupForm .hold-enrollment-form .iti input{width:100%;height:auto;min-height:31px;border-radius:8px;border:1px solid #cfdced;}
      #leadEnrollmentHoldPopupForm .hold-enrollment-form .iti--separate-dial-code .iti__selected-flag{background:#f8fafc;border-right:1px solid #cfdced;border-radius:8px 0 0 8px;padding:0 8px 0 10px;min-width:74px;justify-content:center;}
      #leadEnrollmentHoldPopupForm .hold-enrollment-form .iti--separate-dial-code .iti__selected-dial-code{font-size:11px;color:#4b5d73;margin-left:4px;}
      #leadEnrollmentHoldPopupForm .hold-enrollment-form .iti--separate-dial-code .iti__flag-container{padding:1px 0 1px 1px;}
      #leadEnrollmentHoldPopupForm .hold-enrollment-form .iti__country-list{z-index:2055;max-width:260px;}
      #leadEnrollmentHoldPopupForm .hold-enrollment-form-divider{border-top:1px solid #e5eef8;margin:10px 0 12px;}
      #leadEnrollmentHoldPopupForm .hold-enrollment-lock-panel{background:linear-gradient(135deg,#f8fbff 0%,#eef5ff 100%);border:1px solid #dbe8f9;border-radius:10px;padding:8px 10px;margin-bottom:10px;}
      #leadEnrollmentHoldPopupForm .hold-enrollment-lock-panel table{margin-bottom:0;}
      #leadEnrollmentHoldPopupForm .hold-enrollment-lock-panel th,
      #leadEnrollmentHoldPopupForm .hold-enrollment-lock-panel td{border:0;padding:4px 3px;font-size:12px;vertical-align:middle;}
      #leadEnrollmentHoldPopupForm .hold-enrollment-best-time-title{font-size:13px;font-weight:700;color:#16324f;margin-bottom:8px;}
      #leadEnrollmentHoldPopupForm .hold-enrollment-active-banner{display:block;border:1px solid #d8e7fb;border-radius:10px;padding:10px 12px;background:linear-gradient(135deg,#fffaf1 0%,#ffffff 100%);box-shadow:0 8px 18px rgba(15,72,126,.05);}
      #leadEnrollmentHoldPopupForm .hold-enrollment-active-banner.timer-only{padding:0;border:0;background:transparent;box-shadow:none;margin-bottom:0;}
      #leadEnrollmentHoldPopupForm.hold-timer-only-mode .hold-enrollment-body{padding:14px;}
      #leadEnrollmentHoldPopupForm .hold-enrollment-btn-secondary{min-width:96px;border-radius:.2rem;font-size:12px;font-weight:600;padding:.25rem .55rem;}
      #leadEnrollmentHoldPopupForm .hold-enrollment-btn-primary{min-width:112px;border-radius:.2rem;font-size:12px;font-weight:600;padding:.25rem .55rem;box-shadow:none;}
      #leadEnrollmentHoldPopupForm .hold-enrollment-btn-primary:hover,
      #leadEnrollmentHoldPopupForm .hold-enrollment-btn-secondary:hover{color:#fff;}
      #leadEnrollmentHoldPopupForm .hold-enrollment-btn-release{border-radius:.2rem;font-weight:600;font-size:12px;padding:.25rem .5rem;}
      #leadEnrollmentHoldPopupForm .hold-enrollment-btn-primary:disabled{background:#94c6a1;box-shadow:none;}
      #leadEnrollmentHoldPopupForm .bootstrap-select{width:100% !important;}
      #leadEnrollmentHoldPopupForm .bootstrap-select > .dropdown-toggle{height:31px;padding:4px 28px 4px 8px;border:1px solid #cfdced;border-radius:8px;background:#fff;font-size:12px;line-height:1.4;}
      #leadEnrollmentHoldPopupForm .bootstrap-select > .dropdown-toggle:focus{outline:0 !important;box-shadow:0 0 0 4px rgba(10,120,242,.12) !important;border-color:#69a8ff;}
      #leadEnrollmentHoldPopupForm .bootstrap-select .dropdown-menu{z-index:2055;max-height:220px !important;overflow:auto;}
      #leadEnrollmentHoldPopupForm .bootstrap-select .dropdown-menu.inner{max-height:220px !important;}
      #leadEnrollmentHoldPopupForm .bootstrap-select .dropdown-item{font-size:12px;padding:.35rem .75rem;}
      #leadEnrollmentHoldPopupForm .hold-enrollment-meta-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-top:22px;}
      #leadEnrollmentHoldPopupForm .hold-enrollment-meta-card{background:#fff;border:1px solid #dbe8f8;border-radius:18px;padding:16px 18px;text-align:left;box-shadow:0 12px 26px rgba(15,72,126,.06);}
      #leadEnrollmentHoldPopupForm .hold-enrollment-meta-card span{display:block;font-size:12px;font-weight:700;letter-spacing:.08em;color:#6d8197;text-transform:uppercase;margin-bottom:8px;}
      #leadEnrollmentHoldPopupForm .hold-enrollment-meta-card strong{display:block;font-size:16px;line-height:1.35;color:#19324d;}
      #leadEnrollmentHoldPopupForm .hold-enrollment-timer-shell{border:1px solid #dbe8fb;border-radius:30px;padding:32px 28px;background:linear-gradient(135deg,#f7fbff 0%,#ffffff 55%,#eaf4ff 100%);box-shadow:0 26px 54px rgba(13,78,141,.16);}
      #leadEnrollmentHoldPopupForm .hold-enrollment-timer-badge{display:inline-flex;align-items:center;justify-content:center;padding:8px 16px;border-radius:999px;background:#e8f8ec;color:#149245;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;}
      #leadEnrollmentHoldPopupForm .hold-enrollment-timer-title{margin-top:16px;font-size:34px;font-weight:700;color:#17334d;line-height:1.2;}
      #leadEnrollmentHoldPopupForm .hold-enrollment-timer-subtitle{margin:10px auto 0;max-width:640px;font-size:15px;color:#627892;line-height:1.6;}
      #leadEnrollmentHoldPopupForm .hold-enrollment-timer-card{max-width:540px;margin:24px auto 0;background:#fff;border:1px solid #dbe8fb;border-radius:24px;padding:22px 26px;box-shadow:0 18px 38px rgba(15,72,126,.12);}
      #leadEnrollmentHoldPopupForm .hold-enrollment-timer-label{font-size:12px;font-weight:700;letter-spacing:.18em;color:#6b8096;text-transform:uppercase;margin-bottom:10px;}
      #leadEnrollmentHoldPopupForm .hold-enrollment-timer-value{font-size:32px;font-weight:800;line-height:1.14;color:#23c245;white-space:nowrap;word-break:normal;overflow:hidden;text-overflow:ellipsis;}
      #leadEnrollmentHoldPopupForm .hold-enrollment-timer-value.is-expired{color:#d7263d;}
      @media (max-width:991px){
        #leadEnrollmentHoldPopupForm .hold-enrollment-dialog{max-width:92vw;margin:.75rem auto;}
        #leadEnrollmentHoldPopupForm .hold-enrollment-header .modal-title{font-size:.95rem;}
        #leadEnrollmentHoldPopupForm .hold-enrollment-body{padding:10px 10px 8px;max-height:calc(100vh - 100px);}
        #leadEnrollmentHoldPopupForm .hold-enrollment-footer{padding:8px 10px 10px;}
        #leadEnrollmentHoldPopupForm .hold-enrollment-form-head{display:block;}
        #leadEnrollmentHoldPopupForm .hold-enrollment-chip{margin-top:10px;}
        #leadEnrollmentHoldPopupForm .hold-enrollment-meta-grid{grid-template-columns:1fr;}
        #leadEnrollmentHoldPopupForm .hold-enrollment-timer-title{font-size:28px;}
        #leadEnrollmentHoldPopupForm .hold-enrollment-timer-value{font-size:34px;}
      }
    </style>
    <div id="leadEnrollmentHoldPopupForm" class="modal fade bd-example-modal-lg fade-scale" tabindex="" role="dialog" aria-labelledby="leadEnrollmentHoldTitle" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered hold-enrollment-dialog">
        <div class="modal-content border-0 hold-enrollment-modal">
          <div class="modal-header text-white hold-enrollment-header">
            <h5 class="modal-title" id="leadEnrollmentHoldTitle">Holding Enrollment (<span id="holdEnrollLeadNo">N/A</span>)</h5>
            <button type="button" class="close hold-enrollment-close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true" style="display:block;line-height:1;margin-top:-1px;">&times;</span>
            </button>
          </div>
          <div class="modal-body hold-enrollment-body">
            <div id="holdActiveInfoBanner" class="hold-enrollment-active-banner d-none mb-4">
              <div id="holdActiveInfoHeading"><i class="fa fa-exclamation-triangle"></i> <strong>Active Hold Exists</strong></div>
              <div id="holdActiveInfoDetails" class="mt-1"></div>
              <button type="button" class="btn btn-sm btn-outline-danger mt-3 hold-enrollment-btn-release" id="holdReleaseBtn" onclick="releaseEnrollmentHoldAction()"><i class="fa fa-unlock"></i> Release Hold</button>
            </div>
            <div id="holdEnrollmentFormSection">
              <div class="hold-enrollment-form">

              <form class="col-lg-12 col-md-12 col-sm-12 col-12 pt-1 pb-1 px-0" method="post" id="leadEnrollmentHoldForm" action="javascript:void(0);">
                <input type="hidden" name="leadId" id="holdEnrollLeadId" value="" />
                <input type="hidden" name="holdIsdCode" id="holdEnrollIsdCode" value="" />
                <input type="hidden" name="holdIsdCodeIso" id="holdEnrollIsdCodeIso" value="" />
                <input type="hidden" name="holdAltIsdCode" id="holdEnrollAltIsdCode" value="" />
                <input type="hidden" name="holdAltIsdCodeIso" id="holdEnrollAltIsdCodeIso" value="" />
                <div class="row">
                  <div class="col-lg-4 col-md-4 col-sm-12 col-12 mb-2">
                    <label class="m-0">Child First Name</label>
                    <input type="text" class="form-control form-control-sm" name="holdFname" id="holdEnrollFname" maxlength="100" autocomplete="off" />
                  </div>
                  <div class="col-lg-4 col-md-4 col-sm-12 col-12 mb-2">
                    <label class="m-0">Child Middle Name</label>
                    <input type="text" class="form-control form-control-sm" name="holdMname" id="holdEnrollMname" maxlength="100" autocomplete="off" />
                  </div>
                  <div class="col-lg-4 col-md-4 col-sm-12 col-12 mb-2">
                    <label class="m-0">Child Last Name</label>
                    <input type="text" class="form-control form-control-sm" name="holdLname" id="holdEnrollLname" maxlength="100" autocomplete="off" />
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-12 col-12 mb-2">
                    <label class="m-0">Grade</label>
                    <select class="form-control form-control-sm selectpicker" name="holdGrade" id="holdEnrollGrade" data-container="#leadEnrollmentHoldPopupForm" data-size="6" data-dropup-auto="false" data-width="100%">
                      ${gradeOptions}
                    </select>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-12 col-12 mb-2">
                    <label class="m-0">Email</label>
                    <input type="email" class="form-control form-control-sm" name="holdEmail" id="holdEnrollEmail" maxlength="200" autocomplete="off" />
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-12 col-12 mb-2">
                    <label class="m-0">Phone No</label>
                    <input type="text" class="form-control form-control-sm" name="holdPhone" id="holdEnrollPhone" maxlength="15" autocomplete="off" />
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-12 col-12 mb-2">
                    <label class="m-0">Alternate Email</label>
                    <input type="email" class="form-control form-control-sm" name="holdAltEmail" id="holdEnrollAltEmail" maxlength="200" autocomplete="off" />
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-12 col-12 mb-2">
                    <label class="m-0">Alt Phone No</label>
                    <input type="text" class="form-control form-control-sm" name="holdAltPhone" id="holdEnrollAltPhone" maxlength="200" autocomplete="off" />
                  </div>
                </div>
                <!--
                <div id="holdLockInfoSection" class="d-none hold-enrollment-lock-panel">
                  <table class="table table-sm table-bordered font-12 mb-0">
                    <tbody>
                      <tr><th class="border-0 p-1" style="width:130px;">Lock Status</th><td class="border-0 p-1" id="holdLockStatusDisplay">-</td></tr>
                      <tr><th class="border-0 p-1">Lock Duration</th><td class="border-0 p-1" id="holdLockHoursDisplay">-</td></tr>
                      <tr><th class="border-0 p-1">Holding Date</th><td class="border-0 p-1" id="holdLockDateDisplay">-</td></tr>
                      <tr><th class="border-0 p-1">Expiry Date</th><td class="border-0 p-1" id="holdLockExpiryDisplay">-</td></tr>
                    </tbody>
                  </table>
                </div>
                -->
                <div class="row">
                  <div class="col-lg-6 col-md-6 col-sm-12 col-12 mb-2">
                    <label class="m-0">Holding For</label>
                    <select class="form-control form-control-sm selectpicker" name="lockHours" id="holdEnrollLockHours" data-container="#leadEnrollmentHoldPopupForm" data-size="4" data-dropup-auto="false" data-width="100%">
                      <option value="24">24 hrs</option>
                      <option value="48">48 hrs</option>
                      <option value="72" selected>72 hrs</option>
                    </select>
                  </div>
                </div>
                <div class="hold-enrollment-form-divider"></div>
                <label class="m-0 hold-enrollment-best-time-title">Best time to connect with you</label>
                <div class="row mt-1">
                  <div class="col-lg-4 col-md-4 col-sm-12 col-12 mb-2">
                    <label class="m-0">Date</label>
                    <input type="text" class="form-control form-control-sm datepicker" name="holdBestTimeDate" id="holdEnrollBestTimeDate" maxlength="50" autocomplete="off" readonly onkeydown="return false" placeholder="MM-DD-YYYY" />
                  </div>
                  <div class="col-lg-2 col-md-2 col-sm-3 col-3 mb-2">
                    <label class="m-0">HH</label>
                    <select class="form-control form-control-sm selectpicker" id="holdEnrollBestTimeHH" name="holdBestTimeHH" data-container="#leadEnrollmentHoldPopupForm" data-size="6" data-dropup-auto="false" data-width="100%">
                      ${hhOptions}
                    </select>
                  </div>
                  <div class="col-lg-2 col-md-2 col-sm-3 col-3 mb-2">
                    <label class="m-0">MM</label>
                    <select class="form-control form-control-sm selectpicker" id="holdEnrollBestTimeMM" name="holdBestTimeMM" data-container="#leadEnrollmentHoldPopupForm" data-size="6" data-dropup-auto="false" data-width="100%">
                      ${mmOptions}
                    </select>
                  </div>
                  <div class="col-lg-2 col-md-2 col-sm-3 col-3 mb-2">
                    <label class="m-0">AM/PM</label>
                    <select class="form-control form-control-sm selectpicker" id="holdEnrollBestTimeAMPM" name="holdBestTimeAMPM" data-container="#leadEnrollmentHoldPopupForm" data-size="2" data-dropup-auto="false" data-width="100%">
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
              </form>
              </div>
            </div>
          </div>
          <div class="modal-footer hold-enrollment-footer">
            <button type="button" class="btn btn-outline-secondary btn-sm float-right px-3 ml-2 hold-enrollment-btn-secondary" id="holdEnrollmentCloseBtn" data-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-success btn-sm float-right px-3 hold-enrollment-btn-primary" id="saveEnrollmentHoldBtn" onclick="saveLeadEnrollmentHold()">Hold Enrollment</button>
          </div>
        </div>
      </div>
    </div>`;
  return html;
}

var itiHoldPhone;
var itiHoldAltPhone;

function destroyHoldIntlInstance(inputEl, instanceRef) {
  if (instanceRef && typeof instanceRef.destroy === "function") {
    try {
      instanceRef.destroy();
    } catch (e) {}
  }

  if (
    inputEl &&
    window.intlTelInputGlobals &&
    typeof window.intlTelInputGlobals.getInstance === "function"
  ) {
    try {
      var liveInstance = window.intlTelInputGlobals.getInstance(inputEl);
      if (liveInstance && typeof liveInstance.destroy === "function") {
        liveInstance.destroy();
      }
    } catch (e) {}
  }
}

function rebuildHoldPhoneInput(selector) {
  var $oldInput = $(selector);
  if (!$oldInput.length) {
    return null;
  }

  destroyHoldIntlInstance($oldInput[0], null);
  var $freshInput = $oldInput.clone(false);
  $oldInput.replaceWith($freshInput);
  return $freshInput[0];
}

function getHoldPhoneLocalValue(phoneValue, dialCode) {
  var rawValue = $.trim(phoneValue || "");
  if (!rawValue) {
    return "";
  }

  var digitsOnly = rawValue.replace(/\D/g, "");
  var cleanDialCode = (dialCode || "").replace(/\D/g, "");
  if (
    cleanDialCode &&
    digitsOnly.indexOf(cleanDialCode) === 0 &&
    digitsOnly.length > cleanDialCode.length + 4
  ) {
    digitsOnly = digitsOnly.substring(cleanDialCode.length);
  }

  return digitsOnly || rawValue;
}

function syncHoldPhoneInputPadding(inputEl) {
  if (!inputEl) {
    return;
  }

  var $input = $(inputEl);
  var $iti = $input.closest(".iti");
  var $selectedFlag = $iti.find(".iti__selected-flag");
  if (!$iti.length || !$selectedFlag.length) {
    return;
  }

  var selectedFlagWidth = $selectedFlag.outerWidth();
  if (!selectedFlagWidth || selectedFlagWidth < 40) {
    selectedFlagWidth = 74;
  }

  $input.css({
    paddingLeft: (Math.ceil(selectedFlagWidth) + 6) + "px",
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box"
  });
}

function initHoldPhoneField(selector, hiddenIsoSelector, hiddenDialSelector, countryIso, phoneValue) {
  var inputEl = rebuildHoldPhoneInput(selector);
  if (!inputEl) {
    return null;
  }

  var safeCountryIso = (countryIso || "us").toLowerCase();
  var itiInstance = window.intlTelInput(inputEl, {
    separateDialCode: true
  });
  itiInstance.setCountry(safeCountryIso);

  var selectedCountryData = itiInstance.getSelectedCountryData() || {};
  var localPhoneValue = getHoldPhoneLocalValue(phoneValue, selectedCountryData.dialCode || "");
  $(inputEl).val(localPhoneValue);

  $(hiddenIsoSelector).val(selectedCountryData.iso2 || safeCountryIso);
  $(hiddenDialSelector).val(selectedCountryData.dialCode || "");
  syncHoldPhoneInputPadding(inputEl);

  $(inputEl)
    .off("countrychange.holdEnroll")
    .on("countrychange.holdEnroll", function () {
      var latestCountryData = itiInstance.getSelectedCountryData() || {};
      $(hiddenIsoSelector).val(latestCountryData.iso2 || "");
      $(hiddenDialSelector).val(latestCountryData.dialCode || "");
      $(inputEl).val("");
      syncHoldPhoneInputPadding(inputEl);
    });

  return itiInstance;
}

function resetHoldPhoneFields() {
  var phoneEl = document.querySelector("#holdEnrollPhone");
  var altPhoneEl = document.querySelector("#holdEnrollAltPhone");

  destroyHoldIntlInstance(phoneEl, itiHoldPhone);
  destroyHoldIntlInstance(altPhoneEl, itiHoldAltPhone);

  itiHoldPhone = null;
  itiHoldAltPhone = null;
}

function getHoldEnrollmentDateRange(lockHours) {
  var hours = parseInt(lockHours, 10);
  if (isNaN(hours) || hours <= 0) {
    hours = 72;
  }
  var startMoment = moment().startOf("day");
  var endMoment = moment().startOf("day").add(Math.max(1, Math.ceil(hours / 24)), "days");
  return {
    startMoment: startMoment,
    endMoment: endMoment
  };
}

function refreshHoldEnrollmentBestTimePicker(lockHours, preserveCurrentValue) {
  var $bestTimeDate = $("#holdEnrollBestTimeDate");
  if (!$bestTimeDate.length) {
    return;
  }

  var dateRange = getHoldEnrollmentDateRange(lockHours);
  try {
    $bestTimeDate.datepicker("setStartDate", dateRange.startMoment.toDate());
    $bestTimeDate.datepicker("setEndDate", dateRange.endMoment.toDate());
  } catch (e) {}

  var currentMoment = moment($bestTimeDate.val() || "", "MM-DD-YYYY", true);
  var shouldReplaceValue = !preserveCurrentValue
    || !currentMoment.isValid()
    || currentMoment.isBefore(dateRange.startMoment, "day")
    || currentMoment.isAfter(dateRange.endMoment, "day");
  if (shouldReplaceValue) {
    var defaultDate = dateRange.startMoment.format("MM-DD-YYYY");
    $bestTimeDate.val(defaultDate);
    try {
      $bestTimeDate.datepicker("update", defaultDate);
    } catch (e) {}
  }
}

function initHoldEnrollmentSelectPickers() {
  if (!$.fn.selectpicker) {
    return;
  }

  var $selects = $("#leadEnrollmentHoldPopupForm").find(".selectpicker");
  $selects.each(function () {
    try {
      $(this).selectpicker("destroy");
    } catch (e) {}
  });

  $selects.selectpicker();
}

/**
 * Open the Hold Enrollment popup — pre-fills from lead data passed inline
 */
function openLeadEnrollmentHoldPopup(lead) {
  // Reset form
  $("#leadEnrollmentHoldForm")[0].reset();
  $("#holdEnrollLeadId").val(lead.leadId);
  $("#holdEnrollLeadNo").text(lead.leadNo || "N/A");
  $("#holdActiveInfoBanner").addClass("d-none");
  $("#holdActiveInfoDetails").html("");
  $("#holdLockInfoSection").addClass("d-none");
  $("#saveEnrollmentHoldBtn").prop("disabled", false).text("Hold Enrollment");
  $("#holdEnrollLockHours").val("72");
  if (typeof setHoldEnrollmentTimerOnlyMode === "function") {
    setHoldEnrollmentTimerOnlyMode(false);
  }
  if (typeof clearLeadHoldTimer === "function") {
    clearLeadHoldTimer("modalActiveHold");
  }

  // Pre-fill name fields
  $("#holdEnrollFname").val(lead.fname || '');
  $("#holdEnrollMname").val(lead.mname || '');
  $("#holdEnrollLname").val(lead.lname || '');
  $("#holdEnrollGrade").val(lead.standard || '');

  // Pre-fill email
  $("#holdEnrollEmail").val(lead.email || '');
  $("#holdEnrollAltEmail").val(lead.emailAlt || '');
  itiHoldPhone = initHoldPhoneField(
    "#holdEnrollPhone",
    "#holdEnrollIsdCodeIso",
    "#holdEnrollIsdCode",
    lead.isdCodeIso,
    lead.phone
  );
  itiHoldAltPhone = initHoldPhoneField(
    "#holdEnrollAltPhone",
    "#holdEnrollAltIsdCodeIso",
    "#holdEnrollAltIsdCode",
    lead.isdCodeAlterIso,
    lead.phoneNoAlter
  );

  var $bestTimeDate = $("#holdEnrollBestTimeDate");
  try {
    $bestTimeDate.datepicker("destroy");
  } catch (e) {}
  $bestTimeDate.datepicker({
    format: 'mm-dd-yyyy',
    autoclose: true,
    todayHighlight: true,
    startDate: getHoldEnrollmentDateRange($("#holdEnrollLockHours").val()).startMoment.toDate(),
    endDate: getHoldEnrollmentDateRange($("#holdEnrollLockHours").val()).endMoment.toDate(),
    orientation: 'top'
  });
  refreshHoldEnrollmentBestTimePicker($("#holdEnrollLockHours").val(), false);

  initHoldEnrollmentSelectPickers();
  if ($.fn.selectpicker) {
    $("#holdEnrollGrade").selectpicker("val", lead.standard || "");
    $("#holdEnrollLockHours").selectpicker("val", "72");
    $("#holdEnrollBestTimeHH").selectpicker("val", $("#holdEnrollBestTimeHH").val() || "00");
    $("#holdEnrollBestTimeMM").selectpicker("val", $("#holdEnrollBestTimeMM").val() || "00");
    $("#holdEnrollBestTimeAMPM").selectpicker("val", $("#holdEnrollBestTimeAMPM").val() || "AM");
  }

  // Show modal
  $("#leadEnrollmentHoldPopupForm").modal({ backdrop: 'static', keyboard: false });
  $("#leadEnrollmentHoldPopupForm")
    .off("shown.bs.modal.holdEnrollPhoneLayout")
    .on("shown.bs.modal.holdEnrollPhoneLayout", function () {
      window.requestAnimationFrame(function () {
        syncHoldPhoneInputPadding(document.querySelector("#holdEnrollPhone"));
        syncHoldPhoneInputPadding(document.querySelector("#holdEnrollAltPhone"));
      });
    })
    .off("hidden.bs.modal.holdEnrollPhoneReset")
    .on("hidden.bs.modal.holdEnrollPhoneReset", function () {
      resetHoldPhoneFields();
    });

  // Fetch existing hold data for this lead
  fetchLeadEnrollmentHold(lead.leadId);
}

$(document).off("change.holdEnrollmentDuration", "#holdEnrollLockHours").on("change.holdEnrollmentDuration", "#holdEnrollLockHours", function () {
  refreshHoldEnrollmentBestTimePicker($(this).val(), true);
});

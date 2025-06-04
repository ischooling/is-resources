


function getB2BListHeaderContent(roleAndModule, objRights){
	var html='<div class="full text-right">'
		if(roleAndModule.added=='Y'){
			html+='<button class="btn-shadow btn btn-warning text-white mt-lg-1 btn-full-mobile mb-1" id="addLead">Add New Lead</button>';
		}
		//if(USER_ROLE=='DIRECTOR' || objRights.feedbackPermission==false){
		if(roleAndModule.updated=='Y'){	
			html+='<button class="btn-shadow btn btn-danger text-white mt-lg-1 btn-full-mobile mb-1" id="moveNewLead">Move Lead</button> ';
		}
		//}
		// if(objRights.feedbackPermission==true){
			if(roleAndModule.updated=='Y'){
				html+='<button class="btn-shadow btn btn-dark text-white mt-lg-1 btn-full-mobile mb-1" id="mergeB2BLead">Merge Lead</button>  ';
			}
		// }
		html+='</div>';
		html+='<div class="row mt-2 px-2" id="b2b-total-head"></div>';
		html+='<div class="full overflow-x-auto" id="b2b-lead-list"></div>';
		
	return html;
}


function getLeadFollowupFormB2BPopup(objRights){
	var html='';
	html+='<div id="leadFollowupB2BForm" class="modal fade bd-example-modal-lg fade-scale" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">';
    html+='<div class="modal-dialog modal-xl">';
    html+='<div class="modal-content border-0">';
    html+='<div class="modal-header pt-2 pb-2 theme-bg text-white">';
	html+='<h5 class="modal-title" id="exampleModalLabel">Follow up Form</h5>';
	html+='<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">';
	html+='<span aria-hidden="true">×</span>';
	html+='</button>';
	html+='</div>';
	html+='<div class="modal-body">';
	html+='<form class="col-lg-12 col-md-12 col-sm-12 col-12 pt-2 pb-2" method="post" id="followupB2BSaveForm" action="javascript:void(0);">';
	html+='<input type="hidden" name="leadId" id="leadId" value="0" />';
	html+='<input type="hidden" name="leadType" id="leadType" value="B2B" />';
	html+='<input type="hidden" name="leadAdderId" id="leadAdderId" value="'+USER_ID+'" class="form-control">';
	html+='<input type="hidden" name="currentPage" id="currentPage" value="'+objRights.currentPage+'" class="form-control">';
	html+='<input type="hidden" name="epdetailStatus" id="epdetailStatus" value="" class="form-control"></input>';
	html+='<div class="row" >';
	html+='<div class="col-xl-2 col-lg-2 col-md-6 col-sm-6 col-12 mb-2">';
	html+='<label class="m-0">Connected Through</label>';
	html+='<select class="form-control dropdownFontSize" id="followMed" name="followMed">';
	html+='<option value="Meeting" selected>Meeting</option>';
	html+='<option value="WhatsApp" >WhatsApp</option>';
	html+='<option value="Email" >Email</option>';
	html+='<option value="Call" >Call</option>';
	html+='</select>';
	html+='</div>';
	html+='<div class="col-xl-2 col-lg-2 col-md-6 col-sm-6 col-12 mb-2">';
	html+='<label class="m-0">Connected With</label>';
	html+='<input type="text" name="callWith" id="callWith" class="form-control dropdownFontSize" required tabindex="2">';
	html+='</div>';
	html+='<div class="col-xl-2 col-lg-2 col-md-6 col-sm-6 col-12 mb-2">';
	html+='<label class="m-0">Lead Status & Category*</label>';
	html+='<select name="leadStatus" id="leadStatus" class="form-control dropdownFontSize">';
	html+='<option value="">Select Status</option>';
	html+='</select>';
	html+='</div>';
	html+='<div class="col-xl-2 col-lg-2 col-md-6 col-sm-6 col-12 mb-2">';
	html+='<label class="m-0">Next Followup</label>';
	html+='<select class="form-control dropdownFontSize" id="nextDate" name="nextDate">';
	html+='<option value="" selected>--Select--</option>';
	html+='<option value="CUSTOM">Choose Date</option>';
	html+='<option value="NO FOLLOWUP">No Followup</option>';
	html+='</select> ';
	html+='</div>';
	html+='<div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 mb-2 follow-up-date-and-time-wrapper followCall" style="display:none">';
	html+='<div class="row">';
	html+='<div class="mr-0 mr-sm-2 flex-grow-1 nextCustomDate" style="display:none">';
	html+='<label class="m-0">Date</label>';
	html+='<input type="text" name="notSureCallscheduleDate" id="notSureCallscheduleDate" class="form-control dropdownFontSize datepicker" maxlength="50" autocomplete="off">';
	html+='</div>';
	html+='<div class="mr-0 mr-sm-2 flex-grow-1">';
	html+='<label class="m-0">&nbsp;HH</label>';
	html+='<select class="form-control dropdownFontSize" id="notSureHours" name="notSureHours">';
	for(var i=1;i<=12;i++){
		html+='<option value="'+(i>9?i:'0'+i)+'" >'+(i>9?i:'0'+i)+'</option>';
	}
	
	html+='</select> ';
	html+='</div>';
	html+='<div class="mr-0 mr-sm-2 flex-grow-1">';
	html+='<label class="m-0">&nbsp;MM</label>';
	html+='<select class="form-control dropdownFontSize" id="notSureMins" name="notSureMins">';
	html+='<option value="00">00</option>';
	for(var j=1;j<=59;j++){
		html+='<option value="'+(j>9?i:'0'+i)+'" >'+(j>9?j:'0'+j)+'</option>';
	}
	html+='</select> ';
	html+='</div>';
	html+='<div class="mr-0 mr-sm-2 flex-grow-1">';
	html+='<label class="m-0">AM | PM</label>';
	html+='<select class="form-control dropdownFontSize" id="notSureAMPM" name="notSureAMPM">';
	html+='<option value="AM">AM</option>';
	html+='<option value="PM">PM</option>';
	html+='</select> ';
	html+='</div>';
	html+='</div>';
	html+='</div>';

	html+='<div class="col-12">';
	html+='<hr>';
	html+='</div>';
	html+='<div class="col-12 mb-2">';
	html+='<label class="m-0">Remarks</label>';
	html+='<textarea name="followupRemarks" id="followupRemarks" rows="3" class="form-control" tabindex="9" style="height: 35px !important;"></textarea>';
	html+='<input type="hidden" class="form-control" name="followupRemarkBy" id="followupRemarkBy" value="'+USER_ID+'" />';
	html+='</div>';
	html+='</div>';
	html+='</form>';
	html+='</div>';
	html+='<div class="modal-footer">';
	html+='<button type="button" class="btn btn-info btn-shadow float-right pr-4 pl-4 ml-2" data-dismiss="modal">Close</button>';
	html+='<button type="button" class="btn btn-success btn-shadow float-right pr-4 pl-4" id="saveB2BFollowup">Save Status</button>';
	html+='</div>';
			
    html+=' </div>';
    html+='</div>';
	html+='</div>';
return html;
}



function getLeadFormB2BPopup(objectRights){
	var html='';
	html+='<div id="leadPopupB2BForm" class="modal fade bd-example-modal-lg fade-scale" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">'
		+'<div class="modal-dialog modal-xl">'
			+'<div class="modal-content border-0">'
				+'<div class="modal-header pt-2 pb-2 theme-bg text-white">'
					+'<h5 class="modal-title" id="exampleModalLabel">Update Lead Details - <span id="leadNoText"></span></h5>'
					+'<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">'
						+'<span aria-hidden="true">×</span>'
					+'</button>'
				+'</div>'
				+'<div class="modal-body">'
					+'<form class="col-lg-12 col-md-12 col-ms-12 col-12 pt-2 pb-2" method="post" action="javascript:void(0);" id="leadDataPopupB2BForm">'
						+'<input type="hidden" name="leadId" id="leadId" value="" />'
						+'<input type="hidden" name="parentleadId" id="parentleadId" value="" />'
						+'<input type="hidden" name="academicId" id="academicId" value="" />'
						+'<input type="hidden" name="leadNo" id="leadNo" value="" />'
						+'<input type="hidden" name="rawLeadId" id="rawLeadId" value="" />'
						+'<input type="hidden" name="relationType" id="relationType" value="" />'
						+'<input type="hidden" name="leadSourceGroup" id="leadSourceGroup" value="" />'
						+'<input type="hidden" name="countrolType" id="countrolType" value="" />'
						+'<input type="hidden" name="mergeLeads" id="mergeLeads" value="" />'
						+'<input type="hidden" name="isdCode" id="isdCode" value="" />'
						+'<input type="hidden" name="pCountryCode" id="pCountryCode" value="" />'
						+'<input type="hidden" name="isdCodeAlter" id="isdCodeAlter" value="" />'
						+'<input type="hidden" name="pCountryCodeAlter" id="pCountryCodeAlter" value="" />'
						+'<input type="hidden" name="leadType" id="leadType" value="'+objectRights.leadType+'" />'
						
						+'<div class="row">'
							+'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2 b2bLeadsource">'
								+'<label class="m-0">Lead Source <sup class="text-danger">*</sup></label>'
								+'<select	name="leadSource" id="leadSource" class="form-control" >'
									+'<option value="">Select Source</option>'
									
								+'</select>'
							+'</div>'
							+'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2">'
								+'<label class="m-0">First Name<sup class="text-danger">*</sup></label>'
								+'<input type="text" name="leadstdfname" id="leadstdfname" value=""   class="form-control" maxlength="100" onkeydown="return M.isChars(event);">'
							+'</div>'
							+'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2">'
								+'<label class="m-0">Middle Name</label>'
								+'<input type="text" name="leadstdmname" id="leadstdmname" value=""  class="form-control" maxlength="100" onkeydown="return M.isChars(event);">'
							+'</div>'
							+'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2">'
								+'<label class="m-0">Last Name<sup class="text-danger">*</sup></label>'
								+'<input type="text" name="leadstdlname" id="leadstdlname" value=""  class="form-control" maxlength="100" onkeydown="return M.isChars(event);">'
							+'</div>'
							+'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2">'
								+'<label class="m-0">Email <sup class="text-danger">*</sup></label>'
								+'<input type="email" name="leademailId" id="leademailId" class="form-control" value=""  maxlength="100" pattern="^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-zA-Z]{2,10}(?:\.[a-zA-z]{2})?)$">'
							+'</div>'
							+'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2">'
								+'<label>Alternate Email</label> '
								+'<input type="email" name="leademailAlternet" id="leademailAlternet" class="form-control" value=""  maxlength="100" pattern="^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-zA-Z]{2,10}(?:\.[a-zA-z]{2})?)$">'
							+'</div>'
							+'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2">'
								+'<label>Phone No.<sup class="text-danger">*</sup></label> '
								+'<input type="text" name="phoneNo" id="phoneNo" class="form-control" value="" maxlength="15" onkeydown="return M.digit(event);" />'
							+'</div>'
							+'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2">'
								+'<label>Alternate Phone No.</label> '
								+'<input type="text" name="phoneNoAlter" id="phoneNoAlter" class="form-control" value=""  maxlength="15" onkeydown="return M.digit(event);" />'
							+'</div>'
							
							+'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2">'
								+'<label class="m-0">Country<sup class="text-danger">*</sup></label>'
								+'<select name="countryId" id="countryId" class="form-control"  >'
									+'<option value="0">Select country</option>'
								+'</select>'
							+'</div>'
							+'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2">'
								+'<label class="m-0">State<sup class="text-danger">*</sup></label>'
								+'<select name="stateId" id="stateId" class="form-control" >'
									+'<option value="0">Select state</option>'
									
								+'</select>'
							+'</div>'
							+'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2">'
								+'<label class="m-0">City<sup class="text-danger">*</sup></label>'
								+'<select name="cityId" id="cityId" class="form-control" >'
									+'<option value="0">Select city</option>'
									
								+'</select>'
							+'</div>'
							+'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2 b2bLeadstatus">'
								+'<label class="m-0">Lead Status & Category<sup class="text-danger">*</sup></label>'
								+'<select name="leadStatus" id="leadStatus" class="form-control">'
									+'<option value="">Select Status</option>'
									
								+'</select>'
							+'</div>'
							+'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-2 b2bLeadstatus">'
								+'<label class="m-0">Lead Assigned To*</label>'
								+'<select name="leadAssignTo" id="leadAssignTo" class="form-control" >'
									+'<option value="">Select Assign</option>'
									
								+'</select>'
							+'</div>'
							
							+'<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mb-2">'
								+'<label>Message</label>'
								+'<textarea name="msg" id="msg" rows="3" class="form-control"></textarea>'
							+'</div>'	
						+'</div>	'
					+'</form>'
				+'</div>'
				+'<div class="modal-footer">'
					+'<button type="button" class="btn btn-info btn-shadow float-right pr-4 pl-4 ml-2" data-dismiss="modal">Close</button>'
					+'<button type="button" class="btn btn-success btn-shadow float-right pr-4 pl-4" id="saveB2BLead">Save</button>'
				+'</div>'
			+'</div>'
		+'</div>'
	+'</div>';
	return html;
}

function getLeadAdvanceSearchB2BPopup(objectRights){
	var html='';
	html+='<div id="leadAdvanceSearch" class="modal fade bd-example-modal-lg fade-scale" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">'
    +'<div class="modal-dialog modal-xl">'
    +'    <div class="modal-content border-0">'
    +'        <div class="modal-header pt-2 pb-2 theme-bg text-white">'
    +'            <h5 class="modal-title" id="exampleModalLabel">Advance Search</h5>'
    +'            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">'
    +'                <span aria-hidden="true">×</span>'
    +'            </button>'
    +'        </div>'
    +'        <div class="modal-body">'
    +'            <form action="javascript:void(0);" id="advanceLeadNewSearchForm" name="advanceLeadNewSearchForm" autocomplete=\'off\'>'
	+'			<input type="hidden" name="currentPageSearch" id="currentPageSearch" value="'+objectRights.currentPage+'">'
	+'			<input type="hidden" name="clickFromSearch" id="clickFromSearch" value="'+objectRights.clickFrom+'">'
	+'			<input type="hidden" name="leadFromSearch" id="leadFromSearch" value="'+objectRights.leadFrom+'">'
	+'			<input type="hidden" name="userId" id="userId" value="'+USER_ID+'">'
	+'			<input type="hidden" name="leadType" id="leadType" value="'+objectRights.leadType+'">'
	+'				<div class="row">'
	+'					<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mb-1 mt-1">'
	+'						<div class="leadErrorText"></div>'
	+'					</div>'
	+'				</div>'
	+'				<div class="row text-center">'
	+'					<div class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12 mb-1 mt-1">'
	+'						<label class="m-0">Academic Year</label>'
	+'						<select	name="leadAcadmicYear" id="leadAcadmicYear" class="form-control" >'
	+'						<option value="all">All</option>'
	+'						</select>'
	+'					</div>'
	+'					<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-3 mb-1 mt-1">'
	+'						<label class="m-0">Search with any text</label>'
	+'						<input type="text" name="leadFullSearch" id="leadFullSearch"  class="form-control"/> '
	+'					</div>'
	+'					<div class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12 mb-1 mt-1"></div>'
	+'				</div>'
	+'				<div class="row">'
	+'					<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1">'
	+'						<label class="m-0">Lead No.</label>'
	+'						<input type="text" name="leadNoSearch" id="leadNoSearch"  class="form-control" maxlength="50" /> '
	+'					</div>'
	+'					<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 leadSource">'
	+'						<label class="m-0">Lead Source</label>'
	+'						<select	name="leadSourceSearch" id="leadSourceSearch" class="form-control" multiple >'
	+'							<option value="0">Select Source</option>'
	+'						</select>'
	+'					</div>'
	+'					<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 leadStatus">'
	+'						<label class="m-0">Lead Status & Category</label>'
	+'						<select name="leadStatusSearch" id="leadStatusSearch" class="form-control" multiple >'
	+'								<option value="">Select Status</option>'
	+'						</select>'
	+'					</div>'
	+'					<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 utmSource">'
	+'						<label class="m-0">Interest Form Filled As</label>'
	+'						<select name="studentStage" id="studentStage" class="form-control"  >'
	+'							<option value="">Select Filled As</option>'
	+'							<option value="Individual" >Individual</option>'
	+'							<option value="On behalf of Organization/Company" >On behalf of Organization/Company</option>'
	+'							<option value="Interest Form not filled yet" >Interest Form not filled yet</option>'
	+'						</select>'
	+'					</div>'
	+'					<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 leadAssign">'
	+'						<label class="m-0">Lead Assign To</label>'
	+'						<select name="leadAssignToSearch" id="leadAssignToSearch" class="form-control" multiple '+((objectRights.discardPermission)?'':'')+'>'
	+'							<option value="">Select Assign</option>'
	+'						</select>'
	+'					</div>'
	+'					<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 followUpMedium">'
	+'							<label class="m-0">Connected Through</label>'
	+'							<select name="followMedSearch" id="followMedSearch" class="form-control">'
	+'								<option value="">Select</option>'
	+'								<option value="Meeting" >Meeting</option>'
	+'								<option value="WhatsApp" >WhatsApp</option>'
	+'								<option value="Email" >Email</option>'
	+'								<option value="Call" >Call</option>'
	+'							</select>'
	+'					</div>'
	+'					<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1">'
	+'						<label class="m-0">Email</label>'
	+'						<input type="email" name="leademailIdSearch" id="leademailIdSearch" class="form-control"  maxlength="100">'
	+'					</div>'
	+'					<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1">'
	+'						<label class="m-0">Phone No.</label>'
	+'						<input type="text" name="phoneNoSearch" id="phoneNoSearch" class="form-control" maxlength="15"/>'
	+'					</div>'
	+'					<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1">'
	+'						<label class="m-0">Organization Name</label>'
	+'						<input type="text" name="leadstdfnameSearch" id="leadstdfnameSearch" class="form-control" maxlength="100" onkeydown="return M.isChars(event);">'
	+'					</div>'
	+'					<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 country">'
	+'						<label class="m-0">Country</label>'
	+'						<select name="countryId" id="countryId" class="form-control" >'
	+'							<option value="0">Select country</option>'
	+'						</select>'
	+'					</div>'
	+'					<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 state">'
	+'						<label class="m-0">State</label>'
	+'						<select name="stateId" id="stateId" class="form-control" >'
	+'							<option value="0">Select state</option>'
	+'						</select>'
	+'					</div>'
	+'					<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 col-12 mb-1 mt-1 city">'
	+'						<label class="m-0">City</label>'
	+'						<select name="cityId" id="cityId" class="form-control" >'
	+'							<option value="0">Select city</option>'
	+'						</select>'
	+'					</div>'
    +'            		<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 utmSource">'
	+'						<label class="m-0">UTM Source</label>'
	+'						<select name="utmSourceSearch" id="utmSourceSearch" class="form-control"  >'
	+'							<option value="">Select UTM Source</option>'
	+'						</select>'
	+'					</div>'
	+'					<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1">'
	+'						<label class="m-0">Start Date</label>'
	+'						<input type="text" name="leadStartDateSearch" id="leadStartDateSearch"  class="form-control datepicker">'
	+'					</div>'
	+'					<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1">'
	+'						<label class="m-0">To Date</label>'
	+'						<input type="text" name="leadEndDateSearch" id="leadEndDateSearch"  class="form-control datepicker">'
	+'					</div>'
	+'					<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 utmSource">'
	+'						<label class="m-0">Date Type</label>'
	+'						<select name="searchDateType" id="searchDateType" class="form-control"  >'
	+'							<option value="">Select Date Type</option>'
	+'							<option value="create-lead" >Created Lead</option>'
	+'							<option value="modify-lead" >Modify Lead</option>'
	+'							<option value="demo-lead" >Interview Book</option>'
	+'						</select>'
	+'					</div>'
	+'				</div>'
	+'			</form>'
    +'        </div>'
    +'        <div class="modal-footer">'
    +'            <button type="button" class="btn btn-danger btn-shadow float-right pr-4 pl-4 ml-2" onclick="advanceLeadSearchStudentReset(\'advanceLeadNewSearchForm\',\''+objectRights.leadType+'\')">Reset</button>'
	+'			<button type="button" class="btn btn-info btn-shadow float-right pr-4 pl-4 ml-2" data-dismiss="modal">Close</button>'
	+'			<button type="button" class="btn btn-success btn-shadow float-right pr-4 pl-4" id="btnNewClickLeadSearch">Search</button>'
    +'        </div>'
    +'    </div>'
    +'</div>'
	+'</div>';
	return html;
}


function getLeadMergeB2BFormPopup(objRights){
	var html=''
	html+='<div id="leadMergeB2BPopup" class="modal fade bd-example-modal-lg fade-scale" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">'
    +'<div class="modal-dialog modal-xl">'
    +'    <div class="modal-content border-0">'
    +'        <div class="modal-header pt-2 pb-2 theme-bg text-white">'
    +'            <h5 class="modal-title" id="leadFormText">Merge Lead Form</h5>'
    +'            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">'
    +'                <span aria-hidden="true">×</span>'
    +'            </button>'
    +'        </div>'
    +'       <div class="modal-body">'
	+'		<form class="col-lg-12 col-md-12 col-ms-12 col-12 pt-2 pb-2" method="post" action="javascript:void(0);" id="leadMergeDataPopupB2BForm">'
	+'			<input type="hidden" name="leadId" id="leadId" value="" />'
	+'			<input type="hidden" name="parentleadId" id="parentleadId" value="" />'
	+'			<input type="hidden" name="academicId" id="academicId" value="" />'
	+'			<input type="hidden" name="leadNo" id="leadNo" value="" />'
	+'			<input type="hidden" name="rawLeadId" id="rawLeadId" value="" />'
	+'			<input type="hidden" name="relationType" id="relationType" value="" />'
	+'			<input type="hidden" name="leadSourceGroup" id="leadSourceGroup" value="" />'
	+'			<input type="hidden" name="countrolType" id="countrolType" value="" />'
	+'			<input type="hidden" name="mergeLeads" id="mergeLeads" value="" />'
				+'<input type="hidden" name="isdCode" id="isdCode" value="" />'
				+'<input type="hidden" name="pCountryCode" id="pCountryCode" value="" />'
				+'<input type="hidden" name="isdCodeAlter" id="isdCodeAlter" value="" />'
				+'<input type="hidden" name="pCountryCodeAlter" id="pCountryCodeAlter" value="" />'
	+'			<input type="hidden" name="leadType" id="leadType" value="'+objRights.leadType+'" />'
	+'			<div class="row">'
	+'				<div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-12 mb-1 mt-1">'
	+'						<label class="m-0">First Name*</label>'
	+'						<input type="text" name="leadstdfname" id="leadstdfname" value=""   class="form-control" maxlength="100" onkeydown="return M.isChars(event);">'
	+'				</div>'
	+'				<div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-12 mb-1 mt-1">'
	+'					<label class="m-0">Middle Name</label>'
	+'					<input type="text" name="leadstdmname" id="leadstdmname" value=""  class="form-control" maxlength="100" onkeydown="return M.isChars(event);">'
	+'				</div>'
	+'				<div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-12 mb-1 mt-1">'
	+'					<label class="m-0">Last Name</label>'
	+'					<input type="text" name="leadstdlname" id="leadstdlname" value=""  class="form-control" maxlength="100" onkeydown="return M.isChars(event);">'
	+'				</div>'
	+'				<div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-12 mb-1 mt-1">'
	+'					<label class="m-0">Grade*</label>'
	+'					<select name="leadGrade" id="leadGrade" class="form-control" >'
	+'						<option value="">Select Grade</option>'
	+getStandardContent(objRights.schoolId,true, false)
	+'					</select>'
	+'				</div>'
	+'				<div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-12 mb-1 mt-1">'
	+'						<label class="m-0">Country</label>'
	+'						<select name="countryId" id="countryId" class="form-control"  ></select>'
	+'					</div>'
	+'					<div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-12 mb-1 mt-1">'
	+'						<label class="m-0">State</label>'
	+'						<select name="stateId" id="stateId" class="form-control" ></select>'
	+'					</div>'
	+'					<div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-12 mb-1 mt-1">'
	+'						<label class="m-0">City</label>'
	+'						<select name="cityId" id="cityId" class="form-control" ></select>'
	+'					</div>'
	+'					<div class="col-xl-2 col-lg-2 col-md-3 col-sm-3 col-12 mb-1 mt-1">'
	+'						<label class="m-0">Email*</label>'
	+'						<input type="email" name="leademailId" id="leademailId" class="form-control" value=""  '
	+'						maxlength="100" pattern="^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-zA-Z]{2,10}(?:\.[a-zA-z]{2})?)$">'
	+'					</div>'
	+'					<div class="col-xl-2 col-lg-2 col-md-3 col-sm-3 col-12 mb-1 mt-1">'
	+'						<label>Alt Email</label> '
	+'						<input type="email" name="leademailAlternet" id="leademailAlternet" class="form-control" value=""  maxlength="100"'
	+'					pattern="^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-zA-Z]{2,10}(?:\.[a-zA-z]{2})?)$">'
	+'					</div>'
	+'					<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12 mb-1 mt-1">'
	+'						<label>Phone No.<span>*</span></label> '
	+'						<input type="text" name="phoneNo" id="phoneNo" class="form-control" value="" maxlength="15" onkeydown="return M.digit(event);" />'
	+'					</div>'
	+'					<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12 mb-1 mt-1">'
	+'						<label>Alt Phone No.</label> '
	+'						<input type="text" name="phoneNoAlter" id="phoneNoAlter" class="form-control" value=""  maxlength="15" onkeydown="return M.digit(event);" />'
	+'					</div>';

			if(objRights.discardPermission){

				html+='<div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-12 mb-1 mt-1 " >'
				+'		<label class="m-0">Lead Source * </label>'
				+'		<select	name="leadSource" id="leadSource" class="form-control" ></select>'
				+'	</div>'
				+'	<div class="col-xl-3 col-lg-4 col-md-4 col-sm-4 col-12 mb-1 mt-1">'
				+'		<label class="m-0">Lead Status*</label>'
				+'		<select name="leadStatus" id="leadStatus" class="form-control"></select>'
				+'	</div>'
				+'	<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 col-12 mb-1 mt-1">'
				+'		<label class="m-0">Lead Assigned To*</label>'
				+'		<select name="leadAssignTo" id="leadAssignTo" class="form-control" ></select>'
				+'	</div>'
				+'	<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mb-2">'
				+'		<label>Remarks</label>'
				+'		<textarea name="leadRemark" id="leadRemark" rows="3" class="form-control"></textarea>'
				+'	</div>'	;
		}
	html+='			</div>'
	+'			</form>'
	+'		<div class="row">'
	+'			<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mb-2" id="mergeleadlist"></div>	'
	+'		</div>	'
    +'        </div>'
    +'        <div class="modal-footer">'
	+'			<button type="button" class="btn btn-info btn-shadow float-right pr-4 pl-4 ml-2" data-dismiss="modal">Close</button>'
	+'			<button type="button" class="btn btn-success btn-shadow float-right pr-4 pl-4" id="saveMergeB2BLead">Save</button>'
    +'        </div>'
    +'    </div>'
    +'</div>'
+'</div>';
	return html;
}

function getTotalB2BLeads(data){
	console.log(data);
	var leadTotalData=data.leadTotalData;
	var htmlt=getB2BLeadCount(leadTotalData)
	$("#b2b-total-head").html(htmlt);
}

function getB2BLeadCount(leadTotalData){
	var html='';
	
	html+='<div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 px-1">';
	html+='<div class="full p-2 bg-light-primary border border-primary rounded-10 position-relative mr-0 mr-sm-2 mb-2 shadow-sm">';
	html+='<span class="line-left bg-primary d-inline-block position-absolute rounded-10"></span>';
	html+='<p class="m-0 font-12"><b>Total</b></p>';
	html+='<p class="m-0">'
	if(leadTotalData.totalLeads>0){
		html+='<b><a href="javascript:void(0)" class="text-dark" onclick="getTotalLead(\'B2B\')">'+leadTotalData.totalLeads+'</a></b>';
	}else{
		html+='-';
	}
	html+='</p>';
	html+='</div>';
	html+='</div>';

	html+='<div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 px-1">';
	html+='<div class="full p-2 bg-white border border-secondary rounded-10 position-relative mr-0 mr-sm-2 mb-2  shadow-sm ">';
	html+='<span class="line-left bg-secondary d-inline-block position-absolute rounded-10"></span>';
	html+='<p class="m-0 font-12"><b>Today\'s Fresh Requests</b></p>';
	html+='<p class="m-0"><b>';
	if(leadTotalData.freshLead>0){
		html+='<a href="javascript:void(0)" class="text-dark" onclick="return clickTotalLeads(\''+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+'\', \'0\',\'freshLead\');">'+leadTotalData.freshLead+'</a>';
	}else{
		html+='-';
	}
	html+='</b>';
	html+='</p>';
	html+='</div>';
	html+='</div>';
	html+='<div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 px-1 ">';
	html+='<div class="full p-2 bg-light border border-secondary rounded-10 position-relative mr-0 mr-sm-2 mb-2  shadow-sm ">';
	html+='<span class="line-left bg-secondary d-inline-block position-absolute rounded-10"></span>';
	html+='<p class="m-0 font-12"><b>Basic Details not Filled</b></p>';
	html+='<p class="m-0"><b>';
	if(leadTotalData.followupLead1>0){
		html+='<a href="javascript:void(0)" class="text-dark" onclick="return clickTotalLeads(\''+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+'\', \'0\', \'leadbasicdetail\');">'+leadTotalData.followupLead1+'</a>';
	}else{
		html+='-';
	}
	html+='</b></p>';
	html+='</div>';
	html+='</div>';
	
	html+='<div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 px-1">';
	html+='<div class="full p-2 b2b-bg-review-white border b2b-border-review-dark rounded-10 position-relative mr-0 mr-sm-2 mb-2  shadow-sm">';
	html+='<span class="line-left b2b-bg-review-dark d-inline-block position-absolute rounded-10"></span>';
	html+='<p class="m-0 font-12"><b>Request Under Review</b></p>';
	html+='<p class="m-0"><b>';
	if(leadTotalData.followupLead2>0){
		html+='<a href="javascript:void(0)" class="text-dark" onclick="return clickTotalLeads(\''+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+'\', \'0\',\'leadrequestreview\');">'+leadTotalData.followupLead2+'</a>';
	}else{
		html+='-';
	}
	html+='</b></p>';
	html+='</div>';
	html+='</div>';

	html+='<div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 px-1">';
	html+='<div class="full p-2 b2b-bg-callCompleted-white border b2b-border-callCompleted-dark rounded-10 position-relative mr-0 mr-sm-2 mb-2  shadow-sm">';
	html+='<span class="line-left b2b-bg-callCompleted-dark d-inline-block position-absolute rounded-10"></span>';
	html+='<p class="m-0 font-12"><b>Call Completed</b></p>';
	html+='<p class="m-0"><b>';
	if(leadTotalData.totalCallComplete>0){
		html+='<a href="javascript:void(0)" class="text-dark" onclick="return clickTotalLeads(\''+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+'\', \'0\',\'callb2bcomplete\');">'+leadTotalData.totalCallComplete+'</a>';
	}else{
		html+='-';
	}
	html+='</b></p>';
	html+='</div>';
	html+='</div>';

	html+='<div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 px-1">';
	html+='<div class="full p-2 b2b-bg-interview-white border b2b-border-interview-dark rounded-10 position-relative mr-0 mr-sm-2 mb-2  shadow-sm ">';
	html+='<span class="line-left b2b-bg-interview-dark d-inline-block position-absolute rounded-10"></span>';
	html+='<p class="m-0 font-12"><b>Interested to Interview</b></p>';
	html+='<p class="m-0"><b>';
	if(leadTotalData.meetingResult>0){
		html+='<a href="javascript:void(0)" class="text-dark" onclick="return clickTotalLeads(\''+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+'\', \'0\',\'leadInterestedInterview\');">'+leadTotalData.meetingResult+'</a>';
	}else{
		html+='-';
	}
	html+='</b></p>';
	html+='</div>';
	html+='</div>';

	html+='<div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 px-1">';
	html+='<div class="full p-2 b2b-bg-totinterview-white border b2b-border-totinterview-dark rounded-10 position-relative mr-0 mr-sm-2 mb-2  shadow-sm ">';
	html+='<span class="line-left b2b-bg-totinterview-dark d-inline-block position-absolute rounded-10"></span>';
	html+='<p class="m-0 font-12"><b>Total Interview</b></p>';
	html+='<p class="m-0"><b>';
	if(leadTotalData.demoLead>0){
		html+='<a href="javascript:void(0)" class="text-dark" onclick="return clickTotalLeads(\''+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+'\', \'0\', \'leadInterviewBooked\');">'+leadTotalData.demoLead+'</a>';
	}else{
		html+='-';
	}
	html+='</b> | <b>';
	if(leadTotalData.followupLead3>0){	
		html+='<a href="javascript:void(0)" class="text-dark"  onclick="return clickTotalLeads(\''+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+'\', \'0\',  \'btwinterviewdone\');">'+leadTotalData.followupLead3+'</a>';
	}else{
		html+='-';
	}
			
	html+='</b></p>';
	html+='</div>';
	html+='</div>';

	html+='<div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 px-1">';
	html+='<div class="full p-2 b2b-bg-moveinterview-white border b2b-border-moveinterview-dark rounded-10 position-relative mr-0 mr-sm-2 mb-2  shadow-sm ">';
	html+='<span class="line-left b2b-bg-moveinterview-dark d-inline-block position-absolute rounded-10"></span>';
	html+='<p class="m-0 font-12"><b>Moving for the Next meeting</b></p>';
	html+='<p class="m-0"><b>';
	if(leadTotalData.totalReserved>0){	
		html+='<a href="javascript:void(0)" class="text-dark" onclick="return clickTotalLeads(\''+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+'\', \'0\', \'movingtonextinterview\');">'+leadTotalData.totalReserved+'</a>';
	}else{
		html+='-';
	}
	html+='</b></p>';
	html+='</div>';
	html+='</div>';
	
	html+='<div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 px-1">';
	html+='<div class="full  p-2 bg-light-success border border-success rounded-10 position-relative mr-0 mr-sm-2 mb-2 shadow-sm">';
	html+='<span class="line-left bg-success d-inline-block position-absolute rounded-10"></span>';
	html+='<p class="m-0 font-12"><b>Converted | Partner </b></p>';
	html+='<p class="m-0"><b>';
	if(leadTotalData.totalConverted>0){	
				html+='<a href="javascript:void(0)" class="text-dark" onclick="return clickTotalLeads(\''+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+'\', \'0\',\'totalonboarding\');">'+leadTotalData.totalConverted+'</a>';
	}else{
		html+='-';
	} 
	html+='|';
	if(leadTotalData.totalPartner>0){
		html+='<a href="javascript:void(0)" class="text-dark" onclick="return clickTotalLeads(\''+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+'\', \'0\',  \'totalonpartner\');">'+leadTotalData.totalPartner+'</a>';
	}else{
		html+='-';
	}		
	html+='</b></p>';
	html+='</div>';
	html+='</div>';

	html+='<div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 px-1">';
	html+='<div class="full p-2 bg-light-alternate border border-alternate rounded-10 position-relative mr-0 mr-sm-2 mb-2 shadow-sm ">';
	html+='<span class="line-left bg-alternate d-inline-block position-absolute rounded-10"></span>';
	html+='<p class="m-0 font-12"><b>Move Lead</b></p>';
	html+='<p class="m-0"><b>';
	if(leadTotalData.movedLead>0){
			html+='<a href="javascript:void(0)" class="text-dark" onclick="return clickTotalLeads(\''+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+'\', \'0\',\'btmovdLead\');">'+leadTotalData.movedLead+'</a>';
	}else{
		html+='-';
	}

	html+='</b></p>';
	html+='</div>';
	html+='</div>';

	html+='<div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 px-1">';
	html+='<div class="full p-2 bg-light-danger border border-danger rounded-10 position-relative mb-2 shadow-sm">';
	html+='<span class="line-left bg-danger d-inline-block position-absolute rounded-10"></span>';
	html+='<p class="m-0 font-12"><b>Scrape</b></p>';
	html+='<p class="m-0"><b>';
	if(leadTotalData.scrapeLead>0){
		html+='<a href="javascript:void(0)" class="text-dark" onclick="return clickTotalLeads(\''+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+'\', \'0\', \'scrapeLead\');">'+leadTotalData.scrapeLead+'</a>';
	}else{
		html+='-';
	}
	
	html+='</b></p>';
	html+='</div>';
	html+='</div>';

	html+='<div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 px-1">';
	html+='<div class="full p-2 b2b-bg-rejected-white border b2b-border-rejected-dark rounded-10 position-relative mb-2 shadow-sm">';
	html+='<span class="line-left b2b-bg-rejected-dark d-inline-block position-absolute rounded-10"></span>';
	html+='<p class="m-0 font-12"><b>Rejected</b></p>';
	html+='<p class="m-0"><b>';
	if(leadTotalData.totalArchive>0){
		html+='<a href="javascript:void(0)" class="text-dark" onclick="return clickTotalLeads(\''+leadTotalData.clickFrom+"-"+leadTotalData.clickUserid+'\', \'0\', \'totalArchive\');">'+leadTotalData.totalArchive+'</a>';
	}else{
		html+='-';
	}
				html+='</b>';
			html+='</p>';
		html+='</div>';
	html+='</div>';
	return html;
}



function getB2bLeadList(leaddata, objRights, roleModule){
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
	console.log(data);
	var html='';
	for(var i=0;i<data.length;i++){
		var leads = data[i];
		html+='<div class="lead-table-wrapper">'
		+'<table class="table table-bordered font-12 border-radius-table" style="min-width:1380px;width:100%" id="leadDataList">'
			+'<thead class="bg-primary">'
			+'<tr>'
					+'<th class="text-white bold rounded-top-left-10 border-bottom-0 border-primary" style="border-top-color:transparent;border-right-color:#fff !important">'
					if(objRights.discardPermission || USER_ID==leads.assignTo){
						html+='<input type="hidden" value="'+leads.assignTo+'-'+leads.demoAssignTo+'" id="checkDemoMoved-'+leads.leadId+'"/>';
						html+='<input type="checkbox" class="checkLead" id="lead-'+leads.leadId+'" name="lead-move-another" value="'+leads.leadId+'" /> ';
					}else {
						html+='<input type="checkbox" disabled="disabled" class="checkLead" id="lead-'+leads.leadId+'" name="lead-move-another" value="'+leads.leadId+'" />';
					}
					html+=''+leads.srNo+'&nbsp;Lead info <span class="b2bleadInfoTime"></span>&nbsp;&nbsp;'+objRights.countryOffsetTimezone
					+'</th>'
					+'<th class="text-white bold border-bottom-0">Individual/Organization Details</th>';
					if(leads.leadLastCallList!=null && leads.leadLastCallList.length>0){
						html+='<th class="text-white bold border-bottom-0 text-center">&nbsp;</th>';
					}else{
						html+='<th class="text-white bold border-bottom-0 text-center">Follow Ups</th>';
					}
					html+='<th class="text-white bold border-bottom-0 rounded-top-right-10" style="border-top-color:transparent;border-right-color:transparent">Action</th>'
				+'</tr>'
			+'</thead>'
			+'<tbody class="lead-table-css">'
			+'<input type="hidden" id="demoMovedTrue" />'
			+'<input type="hidden" id="blankDemo" />'
				+'<tr class="td-border-design">'
					+'<td style="max-width:320px;min-width: 320px;vertical-align:top;" class="rounded-bottom-left-10 '+ltype+'-'+(leads.callBadge!=''?leads.callBadge+'-bg':'')+'">'
						+'<table class="w-100">'
							+'<tbody>'
								+'<tr>'
									+'<th class="border-0 p-1">No.:</th>'
									+'<td class="border-0 p-1 '+ltype+'-'+(leads.callBadge!=''?leads.callBadge+'-leadno-bg':'')+'" >'+leads.leadNo+'</td>'
								+'</tr>'
								+'<tr>'
									+'<th class="border-0 p-1">Lead Status & Category:</th>'
									+'<td class="border-0 p-1">'+(leads.leadStatus!=''?leads.leadStatus:'N/A')+'</td>'
								+'</tr>'
								+'<tr>'
									+'<th class="border-0 p-1">Assigned To:</th>'
									+'<td class="border-0 p-1">'+(leads.assignName!=''?leads.assignName:'N/A')+'</td>'
								+'</tr>'
								+'<tr>'
									+'<th class="border-0 p-1">Assigned Date:</th>'
									+'<td class="border-0 p-1">'+(leads.createdDateStr!=''?leads.createdDateStr:'N/A')+'</td>'
								+'</tr>'
								+'<tr>'
									+'<th class="border-0 p-1">UTM:</th>'
									+'<td class="border-0 p-1">'
										+'<div class="dropdown d-inline-block">'
											+'<button type="button" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown" class="dropdown-toggle btn btn-sm btn-primary">View More Details</button>'
											+'<div tabindex="-1" role="menu" aria-hidden="true" class="dropdown-menu-md dropdown-menu p-2" x-placement="bottom-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 32px, 0px);">';
												if(leads.leadSourceId==4){
													html+='<table class="w-100"><tbody>'
															+'<tr>'
																+'<th class="border-0 p-0 font-12">Source:</th>'
																+'<td class="border-0 p-0 font-12">'+(leads.utmSource!=''?leads.utmSource:'N/A')+'</td>'
															+'</tr>'
															+'<tr>'
																+'<th class="border-0 p-0 font-12">Ad:</th>'
																+'<td class="border-0 p-0 font-12">'+(leads.utmMedium!=''?leads.utmMedium:'N/A')+'</td>'
															+'</tr>'
															+'<tr>'
																+'<th class="border-0 p-0 font-12">Ad Set:</th>'
																+'<td class="border-0 p-0 font-12">'+(leads.utmDescription!=''?leads.utmDescription:'N/A')+'</td>'
															+'</tr>'
															+'<tr>'
																+'<th class="border-0 p-0 font-12">Compaign</th>'
																+'<td class="border-0 p-0 font-12">'+(leads.utmCampaign!=''?leads.utmCampaign:'N/A')+'</td>'
															+'</tr>'
															+'<tr>'
																+'<th class="border-0 p-0 font-12">Is_Organic</th>'
																+'<td class="border-0 p-0 font-12">'+(leads.utmTerm!=''?leads.utmTerm:'N/A')+'</td>'
															+'</tr>'
														+'</tbody>'
													+'</table>';
												}else{
													html+='<table class="w-100"><tbody>'
															+'<tr>'
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
																+'<th class="border-0 p-0 font-12">Compaign</th>'
																+'<td class="border-0 p-0 font-12">'+(leads.gclid!=''?leads.gclid:'N/A')+'</td>'
															+'</tr>'
															+'<tr>'
																+'<th class="border-0 p-0 font-12">Compaign</th>'
																+'<td class="border-0 p-0 font-12">'+(leads.utmCampaign!=''?leads.utmCampaign:'N/A')+'</td>'
															+'</tr>'
															+'<tr>'
																+'<th class="border-0 p-0 font-12">Is_Organic</th>'
																+'<td class="border-0 p-0 font-12">'+(leads.utmTerm!=''?leads.utmTerm:'N/A')+'</td>'
															+'</tr>'
														+'</tbody>'
													+'</table>';
												}
												
											html+='</div>'
										+'</div>'
									+'</td>'
								+'</tr>'
							+'</tbody>'
						+'</table>'
					+'</td>'
					+'<td class="p-0 '+ltype+'-'+(leads.callBadge!=''?leads.callBadge+'-bg':'')+'" style="max-width: 696px;min-width: 696px;">'
						+'<table class="w-100">'
							+'<tbody>'
								+'<tr>'
									+'<td class="border-0">'
										+'<table class="w-100">'
											+'<tbody>'
												+'<tr>'
													+'<th class="border-0 p-1" style="width:165px">Name: </th>'
													+'<td class="border-0 p-1">'+(leads.fname!=''?leads.fname:'N/A')+' '+(leads.mname)+' '+(leads.lname)+'</td>'
												+'</tr>'
												+'<tr>'
													+'<th class="border-0 p-1" style="width:165px">Organization Name:</th>'
													+'<td class="border-0 p-1">'+(leads.gfname!=''?leads.gfname:'N/A')+' '+(leads.gmname)+' '+(leads.glname)+'</td>'
												+'</tr>'
												+'<tr>'
													+'<th class="border-0 p-1" style="width:165px">Designation:</th>'
													+'<td class="border-0 p-1">'+(leads.relationType!=''?leads.relationType:'N/A')+'</td>'
												+'</tr>'
												+'<tr>'
													+'<th class="border-0 p-1" style="width:165px">City | Country:</th>'
													+'<td class="border-0 p-1">'+(leads.cityName!=''?leads.cityName:'N/A')+' | '+(leads.countryName!=''?leads.countryName:'N/A')+'</td>'
												+'</tr>'
												+'<tr>'
													+'<th class="border-0 p-1" style="width:165px">Phone:</th>'
													+'<td class="border-0 p-1">'+(leads.isdCode!=''?leads.isdCode:'')+' '+(leads.phone!=''?leads.phone:'');
														if(leads.isdCode!=''){
															if(leads.verifiedWtsup>0){
																html+='<span style="color:green;font-size:15px;">'
																+'<a href="https://api.whatsapp.com/send?phone='+(leads.phoneIsd!=''?leads.phoneIsd:'')+'" target="_target"> <img src="'+PATH_FOLDER_IMAGE+'watsapp-icon.png" width="16px" /></a>'
																+'</span>';
															}
														}
													html+='</td>'
												+'</tr>'
												+'<tr>'
													+'<th class="border-0 p-1" style="width:165px">Email:</th>'
													+'<td class="border-0 p-1">'+(leads.email!=''?leads.email:'N/A');
													if(leads.email!=''){
														if(leads.verifiedEmail>0){
															html+='<i class="pe-7s-check text-success"></i>';
														}
													}
													
												html+='</td>'
												+'</tr>'
												+'<tr>'
													+'<th class="border-0 p-1" style="width:165px">Message:</th>'
													+'<td class="border-0 p-1">'
														+'<div class="dropdown d-inline-block" style="position: inherit;">'
															+'<button type="button" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown" class="dropdown-toggle btn btn-sm btn-primary">View Message</button>'
															+'<div tabindex="-1" role="menu" aria-hidden="true" class="dropdown-menu-lg dropdown-menu p-2" x-placement="bottom-start" style="max-width: 250px;">'
																+'<p class="m-0">'+(leads.remarks!=''?leads.remarks:'N/A')+'</p>'
															+'</div>'
														+'</div>'
													+'</td>'
												+'</tr>'
											+'</tbody>'
										+'</table>'
									+'</td>'
									+'<td class="border-0" style="width: 350px;vertical-align:top;">'
										+'<table class="w-100">'
											+'<tbody>';
											if(leads.partnerTypeId!='' && leads.partnerTypeId>0 ){
												html+='<tr>'
												+'<td class="border-0 p-1" colspan="2"><span class="bold">Enrollment Partner Code:</span> '+(leads.referralcode!=''?leads.referralcode:'N/A')+'</td>'
												+'</tr>';
											}
												html+='<tr>'
												+'<th class="border-0 p-1" colspan="2">Enrollment Partner Form:<a href="'+(leads.epUpdateUrl!=''?leads.epUpdateUrl:'#')+'" class="btn btn-sm btn-primary rounded-5 ml-2" target="_blank" >'+(leads.epdetailStatus=='Y'?'Update':'Not Updated')+' </a></th>'
												+'</tr>';
												if(leads.leadDemoIstTime!=''){
													html+='<tr>'
														+'<th class="border-0 p-1" colspan="2">'
															+'<table style="width:100%;" class="'+ltype+'-demotable">'
																+'<tr style="background:none"><td style="width:150px">Interview Scheduled:</td><td>'+(leads.leadDemoIstDate!=''?leads.leadDemoIstDate:'N/A')+'</td></tr>'
																+'<tr style="background:none"><td>Status:</td><td>'+(leads.demoStatus!=''?leads.demoStatus:'N/A')+'</td></tr>'
															+'</table>'
														+'</th>'
													+'</tr>';
												}
												html+='<tr>'
													+'<td rowspan="6" colspan="2" class="border-0 p-0 pr-2">'
														+'<div class="full p-1 px-2 border rounded-10 shadow-sm">'
															+'<p class="mb-1 font-weight-bold">Remarks</p>'
															+'<div class="full overflow-auto" style="max-height: 120px;">'
																+'<p class="m-0">'+(leads.followupRemark!=''?leads.followupRemark:'N/A')+'</p>'
															+'</div>'
														+'</div>'
													+'</td>'
												+'</tr>'
										+'	</tbody>'
										+'</table>'
									+'</td>'
								+'</tr>'
							+'</tbody>'
						+'</table>'
					+'</td>'
					+'<td class="p-0 '+ltype+'-'+(leads.callBadge!=''?leads.callBadge+'-bg':'')+'" style="vertical-align:top;width: 230px; '+((leads.leadLastCallList!='' && leads.leadLastCallList.length>0)?'border-top:5px solid #007fff !important':'border-top:5px solid #007fff !important')+'">'
						if((leads.leadLastCallList!='' && leads.leadLastCallList.length>0)){
							html+='<ul class="follow-up-accordian m-0 p-0 overflow-auto" style="max-height: 228px;margin-top:-40px !important">';
						}else{
							html+='<ul class="follow-up-accordian m-0 p-0 overflow-auto" style="max-height: 228px;">'
							+'<li class="follow-up-accordian-active text-center mt-2">'
							+'<span class="border p-2  d-inline-block rounded-10 font-weight-bold text-primary" style="font-size:14px; min-width: 150px;">No follow ups yet</span>'
							+'</li>';
						}
					
							for(var l=0; l<leads.leadLastCallList.length>0;l++){
								leadCall=leads.leadLastCallList[l];
							
								html+='<li class=" '+(l==0?'follow-up-accordian-active':'')+'">'
								+'<span class="cursor follow-up-no text-primary p-2 text-center border-primary full bold">Follow Up-'+(leadCall.srno)+' <i class="fa '+(l==0?'fa-angle-up':'fa-angle-down')+' float-right" style="line-height: 20px;"></i></span>'
								+'<div class="follow-up-content text-center" style="'+(l==0?'display: block':'')+'">'
									+'<div class="dropdown d-inline-block text-center my-2" style="position: inherit;">'
										+'<button type="button" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown" class="dropdown-toggle btn btn-sm btn-primary">View Follow Up</button>'
										+'<div tabindex="-1" role="menu" aria-hidden="true" class="dropdown-menu-md dropdown-menu p-2" x-placement="bottom-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 32px, 0px);">'
											+'<table class="w-100">'
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
													+'<td class="p-1 border-0 text-justify" id="callRemark" style="max-width: 250px;">'+(leadCall.followRemarks!=''?leadCall.followRemarks:'')+'</td>'
												+'</tr>'
											+'</table>'
										+'</div>'
									+'</div>'
								+'</div>'
							+'</li>';
							}	
						html+='</ul>'
					+'</td>'
					+'<td class="rounded-bottom-right-10 '+ltype+'-'+(leads.callBadge!=''?leads.callBadge+'-bg':'')+'">'
						+'<table class="w-100">'
							+'<tbody>';
							if(leads.leadStatus!='Converted & On Boarding | Hot'
								|| leads.partnerTypeId=='' || leads.partnerTypeId==0)
							{
								html+='<tr>'
								+'<td colspan="2" class="border-0 p-1">';
								if(roleModule.updated=='Y'){
									html+='<a href="javascript:void(0)" onclick="callGetOpenFollowup(\'followupB2BSaveForm\',\''+leads.leadId+'\',\''+USER_ID+'\',\'edit\',\''+leaddata.currentPage+'\',\'leadFollowupB2BForm\',\'B2B\',\''+leads.epdetailStatus+'\');" class="text-dark py-1 d-inline-block"><i class="fa fa-plus-square text-primary"></i>&nbsp;'+(leads.leadLastCallList!=''?'Add Follow Up':'Add More Follow Up')+'</a>';
								}
								var disFun = 'discardLeadsData(\\\''+leads.leadId+'\\\',\\\''+objRights.moduleId+'\\\',\\\''+objRights.leadFrom+'\\\',\\\''+leads.LeadSourceName+'\\\',\\\''+USER_ID+'\\\', \\\'true\\\', \\\''+leaddata.currentPage+'\\\',\\\'B2B\\\',\\\'new-leads\\\')';
								var discardFun ="return showNewDiscardLeadModelFunction(\'"+disFun+"\','"+leads.LeadSourceName+"','"+leads.fname+"','"+leads.email+"', '"+leads.phone+"','"+leads.createdDateStr+"','"+leads.leadNo+"')";
								html+='</td></tr>'
								+'<tr>'
									+'<td colspan="2" class="border-0 p-1">'
										+'<a href="javascript:void(0)" class="text-dark py-1 d-inline-block" onclick="callLeadsByLeadId(\'leadDataPopupB2BForm\',\''+leads.leadId+'\',\''+USER_ID+'\',\'addLeadClone\', \'leadPopupB2BForm\', \'B2B\','+objRights.discardPermission+');" >'
										+'<i class="fa fa-edit text-primary"></i>&nbsp;Clone</a>'
									+'</td>'
								+'</tr>'
								+'<tr>'
									+'<td colspan="2" class="border-0 p-1">'
										+'<a href="javascript:void(0)" class="text-dark py-1 d-inline-block" onclick="getAsPost(\'/dashboard/lead-followup-log-data?moduleId='+objRights.moduleId+'&leadNo='+leads.leadNo+'&leadType=B2B\')">'
										+'<i class="fa fa-object-ungroup text-primary"></i>&nbsp;Activity Logs</a>'
									+'</td>'
								+'</tr>'
								+'<tr>'
									+'<td colspan="2" class="border-0 p-1">'
										+'<a href="javascript:void(0)" onclick="'+discardFun+'" class="text-dark py-1 d-inline-block"><i class="fa fa-trash text-danger"></i>&nbsp;Discard</a>'
									+'</td>'
								+'</tr>'
								+'<tr>'
									+'<td colspan="2" class="border-0 p-1">'
										+'<a href="javascript:void(0)" onclick="showBasicDetailsMailWarning('+leads.rawLeadId+');" class="text-dark py-1 d-inline-block"><i class="fa fa-link text-primary"></i>&nbsp;Send Basic Details Mail</a>'
									+'</td>'
								+'</tr>';
							}else{
								html+='<tr>'
									+'<td colspan="2" class="border-0 p-1">'
										+'<a href="javascript:void(0)" class="text-dark py-1 d-inline-block" onclick="getAsPost(\'/dashboard/lead-followup-log-data?moduleId='+objRights.moduleId+'&leadNo='+leads.leadNo+'&leadType=B2B\')">'
										+'<i class="fa fa-object-ungroup text-primary"></i>&nbsp;Activity Logs</a>'
									+'</td>'
								+'</tr>'
								+'<tr>'
									+'<td colspan="2" class="border-0 p-1">'
										+'<a href="javascript:void(0)" class="text-dark py-1 d-inline-block" onclick="callLeadsByLeadId(\'leadDataPopupB2BForm\',\''+leads.leadId+'\',\''+USER_ID+'\',\'addLeadClone\', \'leadPopupB2BForm\', \'B2B\','+objRights.discardPermission+');" >'
										+'<i class="fa fa-edit text-primary"></i>&nbsp;Clone</a>'
									+'</td>'
								+'</tr>'
								+'<tr>'
									+'<td colspan="2" class="border-0 p-1">'
										+'<a href="javascript:void(0)" onclick="showResendB2BWelcomeMailWarning('+leads.rawLeadId+');" class="text-dark py-1 d-inline-block"><i class="fa fa-link text-primary"></i>&nbsp;Resend Login Details Mail</a>'
									+'</td>'
								+'</tr>';
								
							}
							if(leads.leadStatus=='Converted & On Boarding | Hot')
							{
								html+='<tr>'
									+'<td colspan="2" class="border-0 p-1">'
										+'<a href="javascript:void(0)" onclick="createPartnerUser(\'partnerUserB2BSaveForm\',\''+leads.leadId+'\',\'leadPartnerUserB2B\',\''+leads.partnerTypeId+'\',\''+leads.epdetailStatus+'\');" class="text-dark py-1 d-inline-block"><i class="fa fa-user text-primary"></i>&nbsp;'+((leads.partnerTypeId==undefined || leads.partnerTypeId=='' || leads.partnerTypeId==0)?'Create Partner':'Update Partner')+'</a>'
									+'</td>'
								+'</tr>';
							}
							html+='</tbody>'
						+'</table>'
					+'</td>'
				+'</tr>'
			+'</tbody>'
		+'</table>'
	+'</div>';
	}
	html+=b2bleadsPagging(leaddata, objRights);
	return html;

}

function b2bleadsPagging(leaddata, objRights){
	objRights=leaddata.objectRights;
	var recordsPerPage = leaddata.recordsPerPage;
	var noOfPages = leaddata.noOfPages;
	var currentPage = leaddata.currentPage;
	var showPageLimit = 2;
	var leftLimit=currentPage-showPageLimit;
	var rightLimit=currentPage+showPageLimit+1;
	var startPageLimit=5;
	var startDots=1;
	var leadType=objRights.leadType;
	var clickByLead=objRights.clickByLead!=undefined?objRights.clickByLead:'';
	var html='';
	if(noOfPages>1){

		html+='<div><ul class="pagination">';
				if(currentPage != 1){
					html+='<li class="page-item">'
					+'<a class="page-link" href="javascript:void(0);" onclick="clickTotalLeads(\''+objRights.clickFrom+'-'+objRights.clickUserid+'\', \''+(currentPage-1)+'\',\''+clickByLead+'\',\''+leadType+'\');">Previous</a>'
					 +'</li>';
				 }
			 for (let p = 1; p <= noOfPages; p++) {
				if(p < startPageLimit || p > (noOfPages -1) || (p>=leftLimit && p<rightLimit) ){
					if(p > (noOfPages -1) || (p<leftLimit && p>rightLimit)){
						html+='...';
					}
					html+='<li class="page-item">'
					+'<a class="page-link"  href="javascript:void(0);" onclick="clickTotalLeads(\''+objRights.clickFrom+'-'+objRights.clickUserid+'\' ,\''+p+'\',\''+clickByLead+'\',\''+leadType+'\');" style="'+(p==currentPage?'background-color: #cdeedd !important;':'')+'">'+p+'</a>'
					+'</li>';
				}else{
	
				}
			 }
			 if(currentPage<noOfPages){
				html+='<li class="page-item">'
				+'<a class="page-link" href="javascript:void(0);" onclick="clickTotalLeads(\''+objRights.clickFrom+'-'+objRights.clickUserid+'\', \''+currentPage+1+'\',\''+clickByLead+'\',\''+leadType+'\');">Next</a>'
				+'</li>';
			 }
			
		html+='</ul>'
		html+='</div>';
	}
	return html;
}









var LEAD_CATEGORY="B2C";
var	itiPhoneNumber;
var itiAltPhoneNumber;
var HASHTAGLIST;
async function getLeadByType(leadType){
	renderCounselorLeadListDashboard("Lead List", ROLE_MODULE, SCHOOL_ID,USER_ID,USER_ROLE, leadType)
}
async function renderCounselorLeadListDashboard(title, roleAndModule, SCHOOL_ID,USER_ID,USER_ROLE, LEAD_CATEGORY){
	//var urlLead = "lead-list?moduleId=" +roleAndModule.moduleId + "&leadFrom=LEAD&clickFrom=list&startDate=&endDate=&country=0&campaign=&currentPage=0&euid=" +ENCRYPTED_USER_ID +"&leadType=" +LEAD_CATEGORY
	var objRight= await getLeadListData(roleAndModule.moduleId, 'LEAD','list','','','0','','0', USER_ID, LEAD_CATEGORY);

	ROLE_MODULE=roleAndModule;
	var objRights = objRight.objectRights;
	OBJECT_RIGHTS=objRights;
	if(USER_ROLE == 'B2B_PARTNER'){
		objRights.leadType = 'B2C';
		objRights.b2bStatus = false
		objRights.b2cStatus = true
	}
	LEAD_CATEGORY=objRights.leadType;
	HASHTAGLIST = await getTggingMasterListPromise('');
    var html= await getLeadListMasterContent(roleAndModule, objRights);
    $('#dashboardContentInHTML').html(html);
	let allSchool = await getOfflineSchoolList(USER_ID);
	let schoolDropDown = '';
	allSchool.schoolList.forEach(school => { 
		schoolDropDown += '<option value="'+school.schoolId+'" extraschooluserid="'+school.userId+'" ' + (school.schoolId == SCHOOL_ID ? 'selected="true"' : '')+'>'+school.schoolName+'</option>';
	});
	$("#leadDemoSchoolMove").append(schoolDropDown); 
	var clickfrom='list';
	if($("#advanceLeadNewSearchForm #clickFromSearch").val()!=''){
		clickfrom=$("#advanceLeadNewSearchForm #clickFromSearch").val();
	}
	getB2CLeadPopjs(objRights, roleAndModule);
	var assignUserList = await callLeadAssignUserList('advanceLeadNewSearchForm',''+objRights.leadType+'','leadAssignToSearch', true, objRights.discardPermission, USER_ID, true);
	callTotalCountLeads('advanceLeadNewSearchForm',''+roleAndModule.moduleId+'', 'LEAD',''+objRights.clickFrom+'', '0', 'new', true,'',''+objRights.leadType+'', 'Y','0','new-lead');
	getLeadDataList('advanceLeadNewSearchForm','advance-search', clickfrom,'0', 'new', true,'', objRights, roleAndModule);
	generateTinyUrls();
	// setInterval(() => {
	// 	if(!objRights.discardPermission){
	// 		getPingPopupScheduleCall(USER_ID);
	// 	}
	// }, 2000);
	
	
	$("#btnClickLeadMove").on('click',function() {
		
		moveLeadsData(''+USER_ID+'',''+objRights.moduleId +'','new-leadmove',''+objRights.currentPage +'', true, objRights, roleAndModule);
	});

	$("#btnClickLeadUpdate").on('click', function(){
		submitLeads('updateLeadForm', ''+objRights.moduleId +'', 'new-lead-list', true, 'leadlist','updateNewLeadModal','B2C', objRights, roleAndModule);
		callTotalCountLeads('advanceLeadNewSearchForm',''+roleAndModule.moduleId+'', 'advance-search',''+objRights.clickFrom+'', '0', 'new', true,'',''+objRights.leadType+'', 'Y','0','new-lead');
	});

	$("#saveFollowup").unbind().bind("click", function(){
		submitLeadFollowupSave('followupSaveForm',''+objRights.moduleId +'', 'new-lead-list', true, 'leadFollowupForm', objRights, roleAndModule);
		callTotalCountLeads('advanceLeadNewSearchForm',''+roleAndModule.moduleId+'', 'advance-search',''+objRights.clickFrom+'', '0', 'new', true,'',''+objRights.leadType+'', 'Y','0','new-lead');
	});
	$("#saveLeadReminder").unbind().bind("click", function(){
		submitLeadReminder();
	});

	$("#saveB2BFollowup").unbind().bind("click", function(){
		submitLeadFollowupSave('followupB2BSaveForm',''+objRights.moduleId +'', 'new-lead-list', true,'leadFollowupB2BForm', objRights, roleAndModule);
		callTotalCountLeads('advanceLeadNewSearchForm',''+roleAndModule.moduleId+'', 'advance-search',''+objRights.clickFrom+'', '0', 'new', true,'',''+objRights.leadType+'', 'Y','0','new-lead');
	});
	$("#saveB2BFollowupWithoutMail").unbind().bind("click", function(){
		submitLeadFollowupSave('followupB2BSaveForm',''+objRights.moduleId +'', 'new-lead-list', true,'leadFollowupB2BForm', objRights, roleAndModule, "Y");
		callTotalCountLeads('advanceLeadNewSearchForm',''+roleAndModule.moduleId+'', 'advance-search',''+objRights.clickFrom+'', '0', 'new', true,'',''+objRights.leadType+'', 'Y','0','new-lead');
	});

	$("#btnAddCampaign").on('click', function(){
		var leadCampaignName= $("#leadCampaignName").val();
		var campaignStartDate= $("#campaignStartDate").val();
		if(leadCampaignName==''){
			showMessageTheme2(0, 'Please fill Campaign Name','',true);
			return false;
		}
		if(campaignStartDate==''){
			showMessageTheme2(0, 'Please fill Start Date','',true);
			return false;
		}

		saveCampaignMaster('leadCampaignForm', '0', 'Y');
	});
	

	$("#saveB2BLead").on('click', function(){
		submitLeads('leadDataPopupB2BForm', ''+objRights.moduleId+'', ''+objRights.leadFrom+'', true, 'new-leadlistPopup','leadPopupB2BForm','B2B', objRights, roleAndModule);
	});

	$("#saveLead").on('click', function(){
		submitLeads('leadDataPopupForm', ''+roleAndModule.moduleId+'', ''+objRights.leadFrom+'', true, 'new-leadlistPopup','leadPopupForm','B2C', objRights, roleAndModule);
	});

	$("#btnNewClickLeadSearch").unbind().bind('click',function() {
		$("#b2c-lead-list").html("");
		//localStorage.setItem("needToPaging", false);
		$("#b2c-lead-list").html('');
		$("#advancedformclick").val("YES");
		if($.inArray(USER_ROLE, ['STUDENT','TEACHER','PARENT','DIRECTOR']) == -1) {
			// for remark Demo update
			var data3 = getAllDemosForUpdateRemark(USER_ID);
			if(data3.status==1){
				var demoDetails=data3.details.demoDetails.demoDetails;
				if(demoDetails!=undefined){
					if(demoDetails.length>0){
						if($("#demo2DetailsModal").length>0){
							$("#demo2DetailsModal").remove();
						}
						$('body').append(forceDemo2UpdateModalContent(data3));
						$("#demo2DetailsModal").modal("show");
					}
				}
			}
			// for remark lead update
			var data2 = getAllLeadForUpdateRemark(USER_ID);
			if(data2.status==1){
				var leadDetails=data2.details.leadDetails.leadDetails;
				if(leadDetails!=undefined){
					if(leadDetails.length>0){
						if($("#leadDetailsModal").length>0){
							$("#leadDetailsModal").remove();
						}
						$('body').append(forceLeadUpdateModalContent(data2));
						$("#leadDetailsModal").modal("show");
					}
				}
			}
			// end
			var data = getAllDemoForUpdateStatus(USER_ID);
			if(data.status==1){
				var demoDetails=data.details.demoDetails.demoDetails;
				if(demoDetails!=undefined){
					if(demoDetails.length>0){
						if($("#demoDetailsModal").length>0){
							$("#demoDetailsModal").remove();
						}
						$('body').append(forceDemoUpdateModalContent(data));
						$("#demoDetailsModal").modal("show");
					}
				}
			}
			// for remark callback update
			var data4 = getAllCallbackForUpdateRemark(USER_ID);
			if(data4.status==1){
				if(data4.details.callbackDetails != undefined){
					var callbackDetails=data4.details.callbackDetails.callbackDetails;
					if(callbackDetails!=undefined){
						if(callbackDetails.length>0){
							if($("#callbackDetailsModal").length>0){
								$("#callbackDetailsModal").remove();
							}
							$('body').append(forceCallbackUpdateModalContent(data4));
							setTimeout(() => {
								$("#callbackDetailsModal").modal("show");
							}, 200);
						}
					}
				}
			}
		}
		getLeadDataList('advanceLeadNewSearchForm', 'advance-search', 'list', '0', 'new', true,'', objRights, roleAndModule);
		callTotalCountLeads('advanceLeadNewSearchForm',''+roleAndModule.moduleId+'', 'advance-search','list', '0', 'new', true,'',''+objRights.leadType+'', 'Y','0','new-lead');
    });
	$("#moveNewLead").on('click',function() {
		var moveleadNo = $("#leadNoMove").val();
		if(moveleadNo==''){
			showMessageTheme2(0, 'Please check any one lead','',false);
			return false;
		}
		$('#moveLeads').modal('show');
		callLeadAssignUserList('moveLeadNewForm',''+objRights.leadType+'','leadDemoAssignMove', true, objRights.discardPermission, USER_ID, false);
		$("#moveLeadNewForm #leadDemoAssignMove").select2({
			theme:"bootstrap4",
			dropdownParent:"#moveLeadNewForm"
		});
		
	});

	$('#mcustomWatiTemplatesListClose').click(function(e) { 
		$("input#selectLeadAll").prop('checked','');
		$('input[name="lead-move-another"]').prop('checked','');
		$("#leadNoMove").val("");
	});

   $("#addNewCampaign").unbind().bind('click',function() {
		$("#leadCampaignPopupForm").modal('show');
		callCampainList(false,'');
	});

	$("#addLead").unbind().bind('click',function() {
		var formId='';
		var modelForm='';
		if(LEAD_CATEGORY=='B2B'){
			$("#modelTitle").text("Add new B2B lead");
			formId='leadDataPopupB2BForm';
			modelForm='leadPopupB2BForm';
		}else{
			formId='leadDataPopupForm';
			modelForm='leadPopupForm';
		}
		$('#'+formId)[0].reset()
		$("#"+formId+" #leadId").val('')
		$("#"+formId+" #leadNo").val('')
		$("#"+formId+" #rawLeadId").val('')
		$("#"+formId+" #countrolType").val('add')
		
		$(".b2cLeadsource").show();
		$(".b2bLeadsource").show();
		$(".b2bLeadstatus").show();
		$(".b2cLeadstatus").show();
		$("#"+modelForm).modal('show');
		$("#leadFormText").text("Add new lead");
		$('#documentDiv').html('');

		$('#leadDOB').datepicker({
			autoclose: true,
			format: 'mm-dd-yyyy',
			container: '#leadPopupForm',
		});

		$("#"+formId+" #leadSource").select2({
			theme:"bootstrap4",
			dropdownParent:"#"+formId
		});
		
		$("#"+formId+" #leadStatus").select2({
			theme:"bootstrap4",
			dropdownParent:"#"+formId
		});
		$("#"+formId+" #leadAssignTo").select2({
			theme:"bootstrap4",
			dropdownParent:"#"+formId
		});

		$("#"+formId+" #countryId").select2({
			theme:"bootstrap4",
			dropdownParent:"#"+formId
		});

		$("#"+formId+" #stateId").select2({
			theme:"bootstrap4",
			dropdownParent:"#"+formId
		});

		$("#"+formId+" #cityId").select2({
			theme:"bootstrap4",
			dropdownParent:"#"+formId
		});
		$("#"+formId+" #leadTagging").select2({
			theme:"bootstrap4",
			dropdownParent:"#"+formId
		});
		$("#"+formId+" #leadSupportTo").select2({
			theme:"bootstrap4",
			dropdownParent:"#"+formId
		});
		$("#"+formId+" #leadPriority").select2({
			theme:"bootstrap4",
			dropdownParent:"#"+formId
		});

		callLeadSourceList(''+formId+'',objRights.leadType,'leadSource', true);
		callPCountries(''+formId+'', 0, 'countryId');
		callLeadStatusList(''+formId+'',objRights.leadType,'leadStatus', false);

		$("#"+formId+" #countryId").on("change",function(){
			callStates(''+formId+'', this.value, 'countryId');
		});
			
		$("#"+formId+" #stateId").on("change",function(){
			callCities(''+formId+'', this.value, 'stateId');
		});

		callLeadAssignUserList(''+formId+'',''+objRights.leadType+'','leadAssignTo', true, objRights.discardPermission, USER_ID, false);
		callLeadAssignUserList(''+formId+'',''+objRights.leadType+'','leadSupportTo', true, objRights.discardPermission, USER_ID, false);
		

		setTimeout(function() {
			$("#"+formId+" #leadAssignTo").val(USER_ID).trigger('change');
		}, 600);

		if (itiPhoneNumber && typeof itiPhoneNumber.destroy === 'function') {
			itiPhoneNumber.destroy();
		}
		var phoneNumber = document.querySelector("#"+formId+" #phoneNo");
		itiPhoneNumber = window.intlTelInput(phoneNumber, {
			//separateDialCode: true,
		});
		phoneNumber.addEventListener('countrychange', function(e) {
			$('#'+formId+' #pCountryCode').val(itiPhoneNumber.getSelectedCountryData().iso2);
			$('#'+formId+' #isdCode').val(itiPhoneNumber.getSelectedCountryData().dialCode);
		});

		if (itiAltPhoneNumber && typeof itiAltPhoneNumber.destroy === 'function') {
			itiAltPhoneNumber.destroy();
		}
		var altPhoneNumber = document.querySelector("#"+formId+" #phoneNoAlter");
		itiAltPhoneNumber= window.intlTelInput(altPhoneNumber, {
			//separateDialCode: true,
		});
		altPhoneNumber.addEventListener('countrychange', function(e) {
			console.log("itiPhone=>", itiAltPhoneNumber.getSelectedCountryData());
			$('#'+formId+' #pCountryCodeAlter').val(itiAltPhoneNumber.getSelectedCountryData().iso2);
			$('#'+formId+' #isdCodeAlter').val(itiAltPhoneNumber.getSelectedCountryData().dialCode);
		});
		getTggingMasterList(''+formId+'', 'leadTagging');
		getPriorityMasterList(''+formId+'', 'leadPriority');
		
		

	});

	$("#mergeLead").unbind().bind('click',function() {
		var moveleadNo = $("#leadNoMove").val();
		if(moveleadNo==''){
			showMessageTheme2(0, 'Please check any one lead','',false);
			return false;
		}
		var leadId =moveleadNo.substring(1,moveleadNo.lenght);
		callLeadMergeData('leadMergeDataPopupForm', leadId, ''+USER_ID+'', 'edit', 'leadMergePopup','B2C', 0);
		callPCountries('leadMergeDataPopupForm', 0, 'countryId');

		$("#leadMergeDataPopupForm #countryId").select2({
			theme:"bootstrap4",
			dropdownParent:"#leadMergeDataPopupForm"
		});

		$("#leadMergeDataPopupForm #stateId").select2({
			theme:"bootstrap4",
			dropdownParent:"#leadMergeDataPopupForm"
		});

		$("#leadMergeDataPopupForm #cityId").select2({
			theme:"bootstrap4",
			dropdownParent:"#leadMergeDataPopupForm"
		});
		$("#leadMergeDataPopupForm #leadSource").select2({
			theme:"bootstrap4",
			dropdownParent:"#leadMergeDataPopupForm"
		});
		$("#leadMergeDataPopupForm #leadStatus").select2({
			theme:"bootstrap4",
			dropdownParent:"#leadMergeDataPopupForm"
		});
		$("#leadMergeDataPopupForm #leadAssignTo").select2({
			theme:"bootstrap4",
			dropdownParent:"#leadMergeDataPopupForm"
		});

		$("#leadMergeDataPopupForm #countryId").on("change",function(){
			callStates('leadMergeDataPopupForm', this.value, 'countryId');
		});
			
		$("#leadMergeDataPopupForm #stateId").on("change",function(){
			 callCities('leadMergeDataPopupForm', this.value, 'stateId');
		});

		callLeadSourceList('leadMergeDataPopupForm',OBJECT_RIGHTS.leadType,'leadSource', true);
		callLeadStatusList('leadMergeDataPopupForm',''+OBJECT_RIGHTS.leadType+'','leadStatus', false);
		callLeadAssignUserList('leadMergeDataPopupForm',''+OBJECT_RIGHTS.leadType+'','leadAssignTo', true, OBJECT_RIGHTS.discardPermission, USER_ID);
		
	});

	$("#mergeB2BLead").unbind().bind('click',function() {
		var moveleadNo = $("#leadNoMove").val();
		if(moveleadNo==''){
			showMessageTheme2(0, 'Please check any one lead','',false);
			return false;
		}
		var leadId =moveleadNo.substring(1,moveleadNo.lenght);
		callLeadMergeData('leadMergeDataPopupB2BForm', leadId, ''+USER_ID+'', 'edit', 'leadMergeB2BPopup','B2B', 0);
		callPCountries('leadMergeDataPopupB2BForm', 0, 'countryId');

		$("#leadMergeDataPopupB2BForm #countryId").select2({
			theme:"bootstrap4",
			dropdownParent:"#leadMergeDataPopupB2BForm"
		});

		$("#leadMergeDataPopupB2BForm #stateId").select2({
			theme:"bootstrap4",
			dropdownParent:"#leadMergeDataPopupB2BForm"
		});

		$("#leadMergeDataPopupB2BForm #cityId").select2({
			theme:"bootstrap4",
			dropdownParent:"#leadMergeDataPopupB2BForm"
		});

		$("#leadMergeDataPopupB2BForm #countryId").on("change",function(){
			callStates('leadMergeDataPopupB2BForm', this.value, 'countryId');
		});
			
		$("#leadMergeDataPopupB2BForm #stateId").on("change",function(){
			 callCities('leadMergeDataPopupB2BForm', this.value, 'stateId');
		});
		callLeadSourceList('leadMergeDataPopupB2BForm',''+OBJECT_RIGHTS.leadType+'','leadSource', true);
		callLeadStatusList('leadMergeDataPopupB2BForm',''+OBJECT_RIGHTS.leadType+'','leadStatus', false);
		callLeadAssignUserList('leadMergeDataPopupB2BForm',''+OBJECT_RIGHTS.leadType+'','leadAssignTo', true, OBJECT_RIGHTS.discardPermission, USER_ID);
	});

	$('.checkRadioLead').on('click',function() {
		var leadCheckId='';	
		var leadNotCheckId='';
		var leadNewIds='';
		 $.each($("input[name='lead-merge-another']"), function(){
				 if ($(this).is(":checked")) {
					leadCheckId=leadCheckId+','+$(this).val();
				}else{
					leadNotCheckId=leadNotCheckId+','+$(this).val();
				}
				
		 });
		 leadnew = leadCheckId + leadNotCheckId;
		 var leadId =leadnew.substring(1,leadnew.lenght);
			var urlSend = '/dashboard/lead-merge-data?moduleId='+OBJECT_RIGHTS.moduleId+'&leadId='+leadId+'&leadFrom=MERGE&currentPage='+OBJECT_RIGHTS.currentPage+'&isSearch=false&countrolType=edit&leadType=B2C';
			getAsPost(urlSend,'self');
			//callLeadMergeData('leadMergeDataPopupForm', leadId, '${USER_ID}', 'edit', 'leadMergePopup','B2C',1)
	   });
	
	$('INPUT[type="file"]').change(function () {
		var ext = $('#fileupload1').val().split('.').pop().toLowerCase();
		if($.inArray(ext, ['csv','tsv']) == -1) {
			showMessageTheme2(0, 'invalid extension!','',true);
			return false;
		}
		var file =$("#leadUploadId #fileupload1").get(0).files[0];
		$("#leadUploadId #fileupload1ChoosenFile").text(file.name)
	});


	$("#saveMergeLead").on('click', function(){
		//submitLeads('leadMergeDataPopupForm', '${moduleId}', '${leadFrom}', true,'','new-leadMergePopup','B2C','','');
		submitLeads('leadMergeDataPopupForm', ''+roleAndModule.moduleId+'', ''+objRights.leadFrom+'', true, 'new-leadMergePopup','leadMergePopup','B2C', objRights, roleAndModule);
	});

	$("#saveMergeB2BLead").on('click', function(){
		submitLeads('leadMergeDataPopupB2BForm', ''+roleAndModule.moduleId+'', ''+objRights.leadFrom+'', true,'new-leadMergePopup','leadMergeB2BPopup','B2B', objRights, roleAndModule);
	});

	setTimeout(function() {
		curentTimeStamp(objRights.timeZoneOffset);
	}, 800);

	$("#leadFollowupForm #leadStatus").change(function(){
		if($('#leadFollowupForm #leadStatus').val()=="Positive to enrollment"){
			$('.tentative_date').css( "display", "block" );
			$("#tentativeDate").val('');
		}else{
			$('.tentative_date').css( "display", "none" );
		}
	});

	if($.inArray(USER_ROLE, ['STUDENT','TEACHER','PARENT','DIRECTOR']) == -1) {
		// for remark Demo update
		var data3 = getAllDemosForUpdateRemark(USER_ID);
		if(data3.status==1){
			var demoDetails=data3.details.demoDetails.demoDetails;
			if(demoDetails!=undefined){
				if(demoDetails.length>0){
					if($("#demo2DetailsModal").length>0){
						$("#demo2DetailsModal").remove();
					}
					$('body').append(forceDemo2UpdateModalContent(data3));
					$("#demo2DetailsModal").modal("show");
				}
			}
		}
		// for remark lead update
		var data2 = getAllLeadForUpdateRemark(USER_ID);
		if(data2.status==1){
			var leadDetails=data2.details.leadDetails.leadDetails;
			if(leadDetails!=undefined){
				if(leadDetails.length>0){
					if($("#leadDetailsModal").length>0){
						$("#leadDetailsModal").remove();
					}
					$('body').append(forceLeadUpdateModalContent(data2));
					$("#leadDetailsModal").modal("show");
				}
			}
		}
		// end
		var data = getAllDemoForUpdateStatus(USER_ID);
		if(data.status==1){
			var demoDetails=data.details.demoDetails.demoDetails;
			if(demoDetails!=undefined){
				if(demoDetails.length>0){
					if($("#demoDetailsModal").length>0){
						$("#demoDetailsModal").remove();
					}
					$('body').append(forceDemoUpdateModalContent(data));
					$("#demoDetailsModal").modal("show");
				}
			}
		}
		// for remark callback update
		var data4 = getAllCallbackForUpdateRemark(USER_ID);
		if(data4.status==1){
			if(data4.details.callbackDetails != undefined){
				var callbackDetails=data4.details.callbackDetails.callbackDetails;
				if(callbackDetails!=undefined){
					if(callbackDetails.length>0){
						if($("#callbackDetailsModal").length>0){
							$("#callbackDetailsModal").remove();
						}
						$('body').append(forceCallbackUpdateModalContent(data4));
						setTimeout(() => {
							$("#callbackDetailsModal").modal("show");
						}, 200);
					}
				}
			}
		}
	}
	

}



async function renderAdminLeadListDashboardSchool(title, roleAndModule, schoolId, userId, role, jsobjectRights){
	$('body').html(getLoaderContent());
	//var objRight= await getLeadListData(roleAndModule.moduleId, 'LEAD','list','','','0','','0', USER_ID, LEAD_CATEGORY);
	ROLE_MODULE=roleAndModule;
	var objRights = JSON.parse(jsobjectRights); //objRight.objectRights;
	//console.log(objRights);
	OBJECT_RIGHTS=objRights;
	var html='<div class="app-container app-theme-white body-tabs-shadow fixed-header fixed-sidebar">';
		html += await dashboardHeaderContent();
		html +='<div class="app-main  pb-4">'
				+'<div class="col p-0">'
					+'<div class="app-main__inner">';
						html +=await getLeadListMasterContent(roleAndModule, objRights);
					html +='</div>'
				+'</div>'
			+'</div>'
		+'</div>';
		html +=await dashboardFooterContent();
		$('body').append(html);
		if($('#logData').length<1){
			$("body").append(getWatiTemplatesHtml());
		}
		let allSchool = await getOfflineSchoolList(USER_ID);
		let schoolDropDown = '';
		allSchool.schoolList.forEach(school => {
			schoolDropDown += '<option value="'+school.schoolId+'" extraschooluserid="'+school.userId+'">'+school.schoolName+'</option>';
		});
		$("#leadDemoSchoolMove").append(schoolDropDown); 
		var clickfrom='list';
		if($("#advanceLeadNewSearchForm #clickFromSearch").val()!=''){
			clickfrom=$("#advanceLeadNewSearchForm #clickFromSearch").val();
		}
		getB2CLeadPopjs(objRights, roleAndModule);
		$("#advanceLeadNewSearchForm #countryId" ).val(OBJECT_RIGHTS.country).trigger('change');
		$("#advanceLeadNewSearchForm #campaignName" ).val(OBJECT_RIGHTS.utmCampName);
		var assignUserList = await callLeadAssignUserList('advanceLeadNewSearchForm',''+objRights.leadType+'','leadAssignToSearch', true, objRights.discardPermission, USER_ID, true);
		$("#advanceLeadNewSearchForm #leadAssignToSearch" ).val(OBJECT_RIGHTS.clickUserid).trigger('change');
		if(OBJECT_RIGHTS.leadId!="0"){
			$("#advanceLeadNewSearchForm #leadFullSearch" ).val(OBJECT_RIGHTS.leadId);
			$("#advanceLeadNewSearchForm #leadAcadmicYear" ).val("all");
		}
		$("#advanceLeadNewSearchForm #advancedformclick" ).val("YES");
		callTotalCountLeads('advanceLeadNewSearchForm',''+roleAndModule.moduleId+'', 'LEAD',''+objRights.clickFrom+'', '0', 'new', true,'',''+objRights.leadType+'', 'Y','0','new-lead');
		getLeadDataList('advanceLeadNewSearchForm','LEAD', clickfrom,'0', 'new', true,''+objRights.clickByLead+'', objRights, roleAndModule);
		generateTinyUrls();
		
		$("#btnClickLeadMove").on('click',function() {
			moveLeadsData(''+USER_ID+'',''+objRights.moduleId +'','new-leadmove',''+objRights.currentPage +'', true, objRights, roleAndModule);
		});

		$("#btnClickLeadUpdate").on('click', function(){
			submitLeads('updateLeadForm', ''+objRights.moduleId +'', 'new-lead-list', true, 'leadlist','updateNewLeadModal','B2C', objRights, roleAndModule);
			callTotalCountLeads('advanceLeadNewSearchForm',''+roleAndModule.moduleId+'', 'advance-search',''+objRights.clickFrom+'', '0', 'new', true,'',''+objRights.leadType+'', 'Y','0','new-lead');
		});

		$("#saveFollowup").unbind().bind("click", function(){
			submitLeadFollowupSave('followupSaveForm',''+objRights.moduleId +'', 'new-lead-list', true, 'leadFollowupForm', objRights, roleAndModule);
			callTotalCountLeads('advanceLeadNewSearchForm',''+roleAndModule.moduleId+'', 'advance-search',''+objRights.clickFrom+'', '0', 'new', true,'',''+objRights.leadType+'', 'Y','0','new-lead');
		});
		$("#saveLeadReminder").unbind().bind("click", function(){
			submitLeadReminder();
		});

		$("#saveB2BFollowup").unbind().bind("click", function(){
			submitLeadFollowupSave('followupB2BSaveForm',''+objRights.moduleId +'', 'new-lead-list', true,'leadFollowupB2BForm', objRights, roleAndModule);
			callTotalCountLeads('advanceLeadNewSearchForm',''+roleAndModule.moduleId+'', 'advance-search',''+objRights.clickFrom+'', '0', 'new', true,'',''+objRights.leadType+'', 'Y','0','new-lead');
		});
		
		$("#saveB2BFollowupWithoutMail").unbind().bind("click", function(){
			submitLeadFollowupSave('followupB2BSaveForm',''+objRights.moduleId +'', 'new-lead-list', true,'leadFollowupB2BForm', objRights, roleAndModule, "Y");
			callTotalCountLeads('advanceLeadNewSearchForm',''+roleAndModule.moduleId+'', 'advance-search',''+objRights.clickFrom+'', '0', 'new', true,'',''+objRights.leadType+'', 'Y','0','new-lead');
		});

		$("#btnAddCampaign").on('click', function(){
			var leadCampaignName= $("#leadCampaignName").val();
			var campaignStartDate= $("#campaignStartDate").val();
			if(leadCampaignName==''){
				showMessageTheme2(0, 'Please fill Campaign Name','',true);
				return false;
			}
			if(campaignStartDate==''){
				showMessageTheme2(0, 'Please fill Start Date','',true);
				return false;
			}

			saveCampaignMaster('leadCampaignForm', '0', 'Y');
		});
		

		$("#saveB2BLead").on('click', function(){
			submitLeads('leadDataPopupB2BForm', ''+objRights.moduleId+'', ''+objRights.leadFrom+'', true, 'new-leadlistPopup','leadPopupB2BForm','B2B', objRights, roleAndModule);
		});

		$("#saveLead").on('click', function(){
			submitLeads('leadDataPopupForm', ''+roleAndModule.moduleId+'', ''+objRights.leadFrom+'', true, 'new-leadlistPopup','leadPopupForm','B2C', objRights, roleAndModule);
		});

		$("#btnNewClickLeadSearch").unbind().bind('click',function() {
			$("#b2c-lead-list").html("");
			//localStorage.setItem("needToPaging", false);
			getLeadDataList('advanceLeadNewSearchForm', 'advance-search', 'list', '0', 'new', true,'', objRights, roleAndModule);
			console.log("after getLeadDataList");
			callTotalCountLeads('advanceLeadNewSearchForm',''+roleAndModule.moduleId+'', 'advance-search','list', '0', 'new', true,'',''+objRights.leadType+'', 'Y','0','new-lead');
	});

	$("#moveNewLead").on('click',function() {
		var moveleadNo = $("#leadNoMove").val();
		if(moveleadNo==''){
			showMessageTheme2(0, 'Please check any one lead','',false);
			return false;
		}
		
		$('#moveLeads').modal('show');
		callLeadAssignUserList('moveLeadNewForm',''+objRights.leadType+'','leadDemoAssignMove', true, objRights.discardPermission, USER_ID, SCHOOL_ID);
		$("#moveLeadNewForm #leadDemoAssignMove").select2({
			theme:"bootstrap4",
			dropdownParent:"#moveLeadNewForm"
		});
		
	});

	$('#mcustomWatiTemplatesListClose').click(function(e) { 
		$("input#selectLeadAll").prop('checked','');
		$('input[name="lead-move-another"]').prop('checked','');
		$("#leadNoMove").val("");
	});

	$("#addNewCampaign").unbind().bind('click',function() {
			$("#leadCampaignPopupForm").modal('show');
			callCampainList(false,'');
		});

		$("#addLead").unbind().bind('click',function() {
			var formId='';
			var modelForm='';
			if(LEAD_CATEGORY=='B2B'){
				formId='leadDataPopupB2BForm';
				modelForm='leadPopupB2BForm';
			}else{
				formId='leadDataPopupForm';
				modelForm='leadPopupForm';
			}
			$('#'+formId)[0].reset()
			$("#"+formId+" #leadId").val('')
			$("#"+formId+" #leadNo").val('')
			$("#"+formId+" #rawLeadId").val('')
			$("#"+formId+" #countrolType").val('add')
			
			$(".b2cLeadsource").show();
			$(".b2bLeadsource").show();
			$(".b2bLeadstatus").show();
			$(".b2cLeadstatus").show();
			$("#"+modelForm).modal('show');
			$("#leadFormText").text("Add new lead");
			$('#documentDiv').html('');

			$('#leadDOB').datepicker({
				autoclose: true,
				format: 'mm-dd-yyyy',
				container: '#leadPopupForm',
			});

			$("#"+formId+" #leadSource").select2({
				theme:"bootstrap4",
				dropdownParent:"#"+formId
			});
			
			$("#"+formId+" #leadStatus").select2({
				theme:"bootstrap4",
				dropdownParent:"#"+formId
			});
			$("#"+formId+" #leadAssignTo").select2({
				theme:"bootstrap4",
				dropdownParent:"#"+formId
			});

			$("#"+formId+" #countryId").select2({
				theme:"bootstrap4",
				dropdownParent:"#"+formId
			});

			$("#"+formId+" #stateId").select2({
				theme:"bootstrap4",
				dropdownParent:"#"+formId
			});

			$("#"+formId+" #cityId").select2({
				theme:"bootstrap4",
				dropdownParent:"#"+formId
			});
			$("#"+formId+" #leadTagging").select2({
				theme:"bootstrap4",
				dropdownParent:"#"+formId
			});
			$("#"+formId+" #leadPriority").select2({
				theme:"bootstrap4",
				dropdownParent:"#"+formId
			});

			callLeadSourceList(''+formId+'',objRights.leadType,'leadSource', true);
			callPCountries(''+formId+'', 0, 'countryId');
			callLeadStatusList(''+formId+'',objRights.leadType,'leadStatus', false);

			$("#"+formId+" #countryId").on("change",function(){
				callStates(''+formId+'', this.value, 'countryId');
			});
				
			$("#"+formId+" #stateId").on("change",function(){
				callCities(''+formId+'', this.value, 'stateId');
			});

			callLeadAssignUserList(''+formId+'',''+objRights.leadType+'','leadAssignTo', true, objRights.discardPermission, USER_ID);

			setTimeout(function() {
				$("#"+formId+" #leadAssignTo").val(USER_ID).trigger('change');
			}, 600);

			if (itiPhoneNumber && typeof itiPhoneNumber.destroy === 'function') {
				itiPhoneNumber.destroy();
			}
			var phoneNumber = document.querySelector("#"+formId+" #phoneNo");
			itiPhoneNumber = window.intlTelInput(phoneNumber, {
				//separateDialCode: true,
			});
			phoneNumber.addEventListener('countrychange', function(e) {
				$('#'+formId+' #pCountryCode').val(itiPhoneNumber.getSelectedCountryData().iso2);
				$('#'+formId+' #isdCode').val(itiPhoneNumber.getSelectedCountryData().dialCode);
			});

			if (itiAltPhoneNumber && typeof itiAltPhoneNumber.destroy === 'function') {
				itiAltPhoneNumber.destroy();
			}
			var altPhoneNumber = document.querySelector("#"+formId+" #phoneNoAlter");
			itiAltPhoneNumber= window.intlTelInput(altPhoneNumber, {
				//separateDialCode: true,
			});
			altPhoneNumber.addEventListener('countrychange', function(e) {
				console.log("itiPhone=>", itiAltPhoneNumber.getSelectedCountryData());
				$('#'+formId+' #pCountryCodeAlter').val(itiAltPhoneNumber.getSelectedCountryData().iso2);
				$('#'+formId+' #isdCodeAlter').val(itiAltPhoneNumber.getSelectedCountryData().dialCode);
			});
			getTggingMasterList(''+formId+'', 'leadTagging');
			getPriorityMasterList(''+formId+'', 'leadPriority');
			

		});

		$("#mergeLead").unbind().bind('click',function() {
			var moveleadNo = $("#leadNoMove").val();
			if(moveleadNo==''){
				showMessageTheme2(0, 'Please check any one lead','',false);
				return false;
			}
			var leadId =moveleadNo.substring(1,moveleadNo.lenght);
			callLeadMergeData('leadMergeDataPopupForm', leadId, ''+USER_ID+'', 'edit', 'leadMergePopup','B2C', 0);
			callPCountries('leadMergeDataPopupForm', 0, 'countryId');

			$("#leadMergeDataPopupForm #countryId").select2({
				theme:"bootstrap4",
				dropdownParent:"#leadMergeDataPopupForm"
			});

			$("#leadMergeDataPopupForm #stateId").select2({
				theme:"bootstrap4",
				dropdownParent:"#leadMergeDataPopupForm"
			});

			$("#leadMergeDataPopupForm #cityId").select2({
				theme:"bootstrap4",
				dropdownParent:"#leadMergeDataPopupForm"
			});

			$("#leadMergeDataPopupForm #countryId").on("change",function(){
				callStates('leadMergeDataPopupForm', this.value, 'countryId');
			});
				
			$("#leadMergeDataPopupForm #stateId").on("change",function(){
				callCities('leadMergeDataPopupForm', this.value, 'stateId');
			});
		});

		$("#mergeB2BLead").unbind().bind('click',function() {
			var moveleadNo = $("#leadNoMove").val();
			if(moveleadNo==''){
				showMessageTheme2(0, 'Please check any one lead','',false);
				return false;
			}
			var leadId =moveleadNo.substring(1,moveleadNo.lenght);
			callLeadMergeData('leadMergeDataPopupB2BForm', leadId, ''+USER_ID+'', 'edit', 'leadMergeB2BPopup','B2B', 0);
			callPCountries('leadMergeDataPopupB2BForm', 0, 'countryId');

			$("#leadMergeDataPopupB2BForm #countryId").select2({
				theme:"bootstrap4",
				dropdownParent:"#leadMergeDataPopupB2BForm"
			});

			$("#leadMergeDataPopupB2BForm #stateId").select2({
				theme:"bootstrap4",
				dropdownParent:"#leadMergeDataPopupB2BForm"
			});

			$("#leadMergeDataPopupB2BForm #cityId").select2({
				theme:"bootstrap4",
				dropdownParent:"#leadMergeDataPopupB2BForm"
			});

			$("#leadMergeDataPopupB2BForm #countryId").on("change",function(){
				callStates('leadMergeDataPopupB2BForm', this.value, 'countryId');
			});
				
			$("#leadMergeDataPopupB2BForm #stateId").on("change",function(){
				callCities('leadMergeDataPopupB2BForm', this.value, 'stateId');
			});
			callLeadSourceList('leadMergeDataPopupB2BForm',''+objRights.leadType+'','leadSource', true);
			callLeadStatusList('leadMergeDataPopupB2BForm',''+objRights.leadType+'','leadStatus', false);
			callLeadAssignUserList('leadMergeDataPopupB2BForm',''+objRights.leadType+'','leadAssignTo', true, objRights.discardPermission, USER_ID);
		});

		$('.checkRadioLead').on('click',function() {
			var leadCheckId='';	
			var leadNotCheckId='';
			var leadNewIds='';
			$.each($("input[name='lead-merge-another']"), function(){
					if ($(this).is(":checked")) {
						leadCheckId=leadCheckId+','+$(this).val();
					}else{
						leadNotCheckId=leadNotCheckId+','+$(this).val();
					}
					
			});
			leadnew = leadCheckId + leadNotCheckId;
			var leadId =leadnew.substring(1,leadnew.lenght);
				var urlSend = '/dashboard/lead-merge-data?moduleId='+OBJECT_RIGHTS.moduleId+'&leadId=0&leadFrom=MERGE&currentPage='+OBJECT_RIGHTS.currentPage+'&isSearch=false&countrolType=edit&leadType=B2C';
				getAsPost(urlSend,'self');
				//callLeadMergeData('leadMergeDataPopupForm', leadId, '${USER_ID}', 'edit', 'leadMergePopup','B2C',1)
		});
		
		$('INPUT[type="file"]').change(function () {
			var ext = $('#fileupload1').val().split('.').pop().toLowerCase();
			if($.inArray(ext, ['csv','tsv']) == -1) {
				showMessageTheme2(0, 'invalid extension!','',true);
				return false;
			}
			var file =$("#leadUploadId #fileupload1").get(0).files[0];
			$("#leadUploadId #fileupload1ChoosenFile").text(file.name)
		});


		$("#saveMergeLead").on('click', function(){
			//submitLeads('leadMergeDataPopupForm', '${moduleId}', '${leadFrom}', true,'','new-leadMergePopup','B2C','','');
			submitLeads('leadMergeDataPopupForm', ''+roleAndModule.moduleId+'', ''+objRights.leadFrom+'', true, 'new-leadMergePopup','leadMergePopup','B2C', objRights, roleAndModule);
		});

		$("#saveMergeB2BLead").on('click', function(){
			submitLeads('leadMergeDataPopupB2BForm', ''+roleAndModule.moduleId+'', ''+objRights.leadFrom+'', true,'new-leadMergePopup','leadMergeB2BPopup','B2B', objRights, roleAndModule);
		});

		setTimeout(function() {
			curentTimeStamp(objRights.timeZoneOffset);
		}, 800);

		

		
}


async function dashboardHeaderContent(){
	var schoolSettingsLinks = await getSchoolSettingsLinks(SCHOOL_ID);
	//console.log(schoolSettingsLinks);
	var html=
		'<div class="sticky-header">'
			+'<div class="app-header header-shadow">'
				+'<div class="app-header__logo">'
					+'<a href="'+schoolSettingsLinks.schoolWebsite+'" target="blank" class="logo-src" style="background:url('+schoolSettingsLinks.logoUrl+SCRIPT_VERSION+');"></a>'
				+'</div>'
				+'<div class="app-header__logo"></div>'
			+'</div>'
		+'</div>';
	return html;
}

async function dashboardFooterContent(){
	var schoolSettingsTechnical = await getSchoolSettingsTechnical(SCHOOL_ID);
	var html=
	'<div class="app-wrapper-footer">'
		+'<div class="app-footer">'
			+'<div class="app-footer__inner">'
				+'<div class="col">'
					+'<p style="margin: 0"> Copyright © '+schoolSettingsTechnical.copyrightYear+' '+schoolSettingsTechnical.copyrightName+' - All Rights Reserved.</p>'
				+'</div>'
			+'</div>'
		+'</div>'
		+'<div class="server-message">'
			+'<span class="msg" id="msgTheme2"></span>'
		+'</div>'
	+'</div>';
	return html;
}

function getLeadPingPopupContent(pingdata, objRights){
	var html = '';
	if(!pingdata || !Array.isArray(pingdata.leadCommonDTO) || pingdata.leadCommonDTO.length === 0){
		return html;
	}
	var currentPage = (objRights && objRights.currentPage != null) ? objRights.currentPage : '0';
	var leadType = (objRights && objRights.leadType) ? objRights.leadType : 'B2C';
	var followupFormId = leadType === 'B2B' ? 'followupB2BSaveForm' : 'followupSaveForm';
	var followupModalId = leadType === 'B2B' ? 'leadFollowupB2BForm' : 'leadFollowupForm';
	var escapeHtml = function(value){
		if(value === null || value === undefined){
			return '';
		}
		return String(value)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');
	};

	for(var i = 0; i < pingdata.leadCommonDTO.length; i++){
		var lead = pingdata.leadCommonDTO[i] || {};
		var notificationClass = i + 1;
		var leadId = lead.leadId || '';
		var leadNo = escapeHtml(lead.leadNo || 'N/A');
		var leadSourceName = escapeHtml(lead.leadSourceName || 'N/A');
		var standardName = escapeHtml(lead.standardName || 'N/A');
		var stdFname = escapeHtml(lead.stdFname || 'N/A');
		var isdCode = escapeHtml(lead.isdCode || '');
		var phoneNo = escapeHtml(lead.phoneNo || 'N/A');
		var nextCall = escapeHtml(lead.notSureCallscheduleDateString || 'N/A');
		var updateAction = "callGetOpenFollowup('"+followupFormId+"','"+leadId+"','"+USER_ID+"','edit','"+currentPage+"','"+followupModalId+"','"+leadType+"','Y')";

		html += '<div class="card notification-message '+notificationClass+' mb-1 ">';
		html += '	<div class="card-body p-3">';
		html += '		<div class="full">';
		html += '			<div class="d-flex justify-content-between">';
		html += '				<h5 class="mb-1">'+leadNo+'</h5>';
		//html += '				<button class="cursor pr-2 pl-2 close-notification btn pt-0" value="'+notificationClass+'" onclick="closeNotification(this.value)"><i class="fa fa-times"></i></button>';
		html += '			</div>';
		html += '			<p>Lead Source: '+leadSourceName+'<br/>Grade: '+standardName+'<br/>Student name: '+stdFname+'<br/>Phone No: '+isdCode+' '+phoneNo+'<br/>Next Call: '+nextCall+'<br/></p>';
		html += '			<a href="javascript:void(0);" onclick="'+updateAction+'" class="btn btn-primary mb-0">Update</a>';
		html += '		</div>';
		html += '	</div>';
		html += '</div>';
	}
	return html;
}

function getLeadListMasterContent(roleAndModule, objRights){
	var b2clead=objRights.b2cStatus;
	var b2blead=objRights.b2bStatus;
	var b2cnone='d-none';
	var b2bnone='d-none';
	if(b2clead){
		b2cnone='';
	}else{
		b2cnone='d-none';
	}
	if(b2blead){
		b2bnone='';
	}else{
		b2bnone='d-none';
	}
	var html='<div class="app-page-title mb-3 py-2">'
	+'<div class="page-title-wrapper">'
	+'		<div class="page-title-heading">'
	+'			<div class="page-title-icon">'
	+'				<i class="fas fa-university text-primary"></i>'
	+'			</div>'
	+'			<div>Lead List </div>'
	+'			<div class="btn-actions-pane-right">'
	+'				<a href="javascript:void(0)" class="ml-2 btn-transition btn btn-sm b2clead '+b2cnone+' '+(objRights.leadType=='B2C'?'btn-primary':'btn-outline-primary')+'" onclick="getLeadByType(\'B2C\')">B2C</a>'
	+'				<a href="javascript:void(0)" class="ml-2 btn-transition btn btn-sm b2blead '+b2bnone+' '+(objRights.leadType=='B2B'?'btn-primary':'btn-outline-primary')+'" onclick="getLeadByType(\'B2B\')">B2B</a>'
	+'			</div>'
	+'		</div>';
	html+='	<div class="page-title-actions">';
	html+='	<div class="btn-actions-pane-right text-capitalize d-flex flex-wrap justify-content-center" style="gap:10px">'
		// +'	<button class=" btn btn-primary" onclick="window.close();"><i class="fa fa-arrow-left"></i>&nbsp;Back</button>'
		+'	<button class=" btn btn-primary" onclick="openPopup(\'leadAdvanceSearch\',\''+objRights.leadType+'\');"><i class="fa fa-search"></i>&nbsp;Advance Search</button>'
		+'	<button class=" btn btn-primary" onclick="renderTimzoneConverter()"><i class="fa fa-clock"></i>&nbsp;Time Zone Converter</button>'
		+'</div>';
	html+='</div>'
	+'	</div>'
	+'</div>';
	html+=getCounselorListHeaderContent(objRights.leadType, roleAndModule, objRights);
	if(objRights.leadType=='B2B'){
		html+=getLeadAdvanceSearchB2BPopup(objRights);
		html+=getLeadFollowupFormB2BPopup(objRights);
		html+=getLeadFormB2BPopup(objRights);
		html+=getLeadMergeB2BFormPopup(objRights);
		html+='<div id="LeadPartnerUserFormB2BPopup"></div>';
		
		
	}else{
			html+=getLeadAdvanceSearchPopup(objRights);
			html+=getLeadFollowupFormPopup(objRights);
			html+=getLeadReminderPopup();
			html+=getLeadReminderListPopup();
			html+=getLeadFormB2BPopup(objRights);
			html+=getLeadFormPopup(objRights);
		html+=getLeadMergeFormPopup(objRights);
		html+=getLeadCampaignListPopup();
		html+=getLeadWatsApp();
		html+=getLeadEnrollmentHoldPopup();
		html+=getAutomatedFollowupPopup();
		
	}
	html+=getMoveLeadsPopup(objRights);
	html+=getDiscardLeadModel();
	html+=deleteWarning();
	html+=getDemoDetailSummary();
	html+=getLeadPingShowPopup();
	
	if($('#logData').length<1){
		$("body").append(getWatiTemplatesHtml());
	}
	return html;
}


function getLeadPingShowPopup(){
    var html=`
        <div id="leadPingShowPopup" class="modal right-slide-modal fade" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content border-0">
                <div class="modal-header py-2 h-auto text-white">
                    <h5 class="text-white modal-title">Add Sub Partner</h5>
                    <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body p-0 overflow-auto" id="schedulePingMessageContent">
                    
                </div>
            </div>
        </div>
    </div>`;
    return html;
}

function getWatiTemplatesHtml(){
	var html='';
	html+='<div class="for_watiLogsTableData done" id="logData"> </div>'
	+'<div class="for_allWatiTemplatesList done" id="allWatiTemplatesList"> </div>'
	+'<div class="for_mbroadcastWatiSendTable done" id="usrPopData"> </div>'
	+'<div class="for_userPopDataEmaildone" id="userPopDataEmail"> </div>'
	+'<div id="allWatiUsersList"> </div>'
	+'<div class="for_successFailedWatiMessagesModal done" id="usrPopDataOnResend"> </div>'
	+'<div class="for_successFailedEmailMessagesModal done" id="usrPopDataOnResendEmail"> </div>'
	+'<div class="for_allEmailTemplatesList done" id="allEmailTemplatesList"></div>';
	return html;
}



function getCounselorListHeaderContent(leadType, roleAndModule, objRights){
	var html=
		`<div class="main-card mb-3 card">
			<div class="card-body">`;
				if(leadType=='B2B'){
					html+=getB2BListHeaderContent(roleAndModule, objRights);
				}else{
					html+=getB2CListHeaderContent(roleAndModule, objRights);
				}
			html+=`</div>`	
	html+='</div>'
	return html;
}


function getMoveLeadsPopup(objRights){
	var html='';
	html+='<div class="modal fade" id="moveLeads">'
		+'<div class="modal-dialog modal-md" role="document">'
		+'	<div class="modal-content">'
		+'		<div class="modal-header p-2 bg-primary text-white">'
		+'			<h5 class="m-0">Move Lead</h5>'
		+'		</div>'
		+'		<form class="custom-field-scope" action="javascript:void(0);" id="moveLeadNewForm" name="moveLeadNewForm" autocomplete=\'off\'>'
		+'			<input type="hidden" name="leadNoMove" id="leadNoMove"/>'
		+'			<input type="hidden" name="discardPermission" id="discardPermission" value="'+objRights.discardPermission+'"/>'
		+'			<div class="modal-body delete-modal">'
		+'				<div class="row">'
		+'					<div class="col-lg-6 col-md-12 col-sm-12 col-12">'
		+'<div class="form-group custom-field mb-2">'
		+'						<select	name="leadDemoAssignMove" id="leadDemoAssignMove" class="form-control" >'
		+'							<option value="0">Select Assign</option>'
		+'						</select>'
		+'<label for="leadDemoAssignMove">Move Lead Assign to</label>'
		+'</div>'
		+'					</div>';
						// if(objRights.leadType=='B2B'){
					html+= '<div class="col-lg-6 col-md-12 col-sm-12 col-12">'
					+'<div class="form-group custom-field mb-2">'
		+'						<select	name="leadDemoSchoolMove" id="leadDemoSchoolMove" class="form-control" onchange="callLeadAssignUserListBySchoolId(\'moveLeadNewForm\', \''+objRights.leadType+'\', \'leadDemoAssignMove\', \''+true+'\', \''+objRights.discardPermission+'\', \''+USER_ID+'\', \''+false+'\')">'
		+'							<option value="0">Select School</option>'
		+'						</select>'
					+'<label for="leadDemoSchoolMove">Select School</label>'
					+'</div>'
		+'					</div>';
						// }
					html += '<div class="col-lg-6 col-md-12 col-sm-12 col-12">'
					+'<div class="form-group custom-field mb-2">'
		+'						<select	name="leadIntrestedTo" id="leadIntrestedTo" class="form-control" >'
		+'							<option value="B2C" '+(objRights.leadType=='B2C'?'selected':'')+'>B2C</option>'
		+'							<option value="B2B" '+(objRights.leadType=='B2B'?'selected':'')+'>B2B</option>'
		+'						</select>'
					+'<label for="leadIntrestedTo">Interested To</label>'
					+'</div>'
		+'					</div>';
						if(objRights.leadType=='B2C'){
							html+=' <div class="form-group my-2 pl-3">'
							// +' <label class="m-0">Also Move Demo</label>'
							// +' <input type="checkbox" name="leadDemoAssignTo" id="leadDemoAssignTo" checked />'
							+'<input type="radio" name="leadDemoAssignTo" id="leadDemoAssignToWithDemo" value="withDemo" /> &nbsp; Move Lead With Demo &nbsp;'
							+'<input type="radio" name="leadDemoAssignTo" id="leadDemoAssignToWithOutDemo" value="withoutDemo" /> &nbsp; Move Lead Without Demo &nbsp;'
							+'<input type="radio" name="leadDemoAssignTo" id="leadDemoAssignToOnlyDemo" value="OnlyDemo" checked /> &nbsp; Move Only Demo<br/>'
							+'<input type="checkbox" name="leadWithRemark" id="leadWithRemark" value="N" /> &nbsp; Move Without Remark &nbsp;'
							+' </div>';
						}
						html+=' <div class="mt-1 col-lg-12 col-md-12 col-sm-12 col-12">'
							+'<div class="form-group custom-field mb-2">'
								+'<textarea class="form-control" name="moveRemarks" id="moveRemarks" rows="2" placeholder=" " style="height: 50px !important;"></textarea>'
								+'<label for="moveRemarks">Remarks</label>'
							+'</div>'
						+'</div>'
		+'</div>'
		+'				<div class="full mt-1">'
		+'					<button type="button" class="btn btn-success  float-right pr-4 pl-4" id="btnClickLeadMove">Move</button>'
		+'					<button type="button" class="btn btn-info  float-right pr-4 pl-4 mr-2" data-dismiss="modal">Close</button>'
		+'				</div>'
		+'			</div>'
		+'		</form>'
		+'	</div>'
		+'</div>'
	+'</div>';
	return html;
}

function openPopup(formId, leadType){
	$('#'+formId).modal('show');
	$("#advanceLeadNewSearchForm #leadAssignToSearch").select2({
		theme:"bootstrap4",
		dropdownParent:"#advanceLeadNewSearchForm",
		placeholder:"Select Assign"
	});
	$("#advanceLeadNewSearchForm #leadCreatedBy").select2({
		theme:"bootstrap4",
		dropdownParent:"#advanceLeadNewSearchForm",
		placeholder:"Select Assign"
	});

	
	$("#advanceLeadNewSearchForm #leadDemoAssignSearch").select2({
		theme:"bootstrap4",
		dropdownParent:"#advanceLeadNewSearchForm",
		placeholder:"Select Assign"
	});

	
	$("#advanceLeadNewSearchForm #followUpMedium").select2({
		theme:"bootstrap4",
		dropdownParent:"#advanceLeadNewSearchForm"
		
	});
	$("#advanceLeadNewSearchForm #grade").select2({
		theme:"bootstrap4",
		dropdownParent:"#advanceLeadNewSearchForm",
		placeholder:"Select Grade"
	});
	$("#advanceLeadNewSearchForm #countryId").select2({
		theme:"bootstrap4",
		dropdownParent:"#advanceLeadNewSearchForm"
	});
	$("#advanceLeadNewSearchForm #countryIds").select2({
		theme:"bootstrap4",
		dropdownParent:"#advanceLeadNewSearchForm"
	});	
	$("#advanceLeadNewSearchForm #stateId").select2({
		theme:"bootstrap4",
		dropdownParent:"#advanceLeadNewSearchForm"
	});
	$("#advanceLeadNewSearchForm #cityId").select2({
		theme:"bootstrap4",
		dropdownParent:"#advanceLeadNewSearchForm"
	});
	$("#advanceLeadNewSearchForm #priority").select2({
		theme:"bootstrap4",
		dropdownParent:"#advanceLeadNewSearchForm"
	});
	$("#advanceLeadNewSearchForm #callWith").select2({
		dropdownParent:".callWith"
	});
	$("#advanceLeadNewSearchForm #followupStatus").select2({
		dropdownParent:".followupStatus"
	});
	$("#advanceLeadNewSearchForm #demoAssign").select2({
		dropdownParent:".demoAssign"
	});
	$("#advanceLeadNewSearchForm #leadDemoAssignMove").select2({
		dropdownParent:"#moveLeadNewForm"
	});
	$("#advanceLeadNewSearchForm #leadUpdateSource").select2({
		dropdownParent:"#updateLeadForm",
	});

	$("#advanceLeadNewSearchForm #leadSourceSearch").select2({
		theme:"bootstrap4",
		dropdownParent:"#advanceLeadNewSearchForm"
	});
	$("#advanceLeadNewSearchForm #leadStatusSearch").select2({
		theme:"bootstrap4",
		dropdownParent:"#advanceLeadNewSearchForm"
	});
	$("#advanceLeadNewSearchForm #leadTagSearch").select2({
		theme:"bootstrap4",
		dropdownParent:"#advanceLeadNewSearchForm"
	});
	$("#advanceLeadNewSearchForm #leadSearchAdSet").select2({
		theme:"bootstrap4",
		dropdownParent:"#advanceLeadNewSearchForm"
	});

	$('#leadStartDateSearch').datepicker({
			autoclose: true,
			format: 'dd-mm-yyyy',
			container: '#leadAdvanceSearch',
	});

	$('#leadEndDateSearch').datepicker({
		autoclose: true,
		format: 'dd-mm-yyyy',
		container: '#leadAdvanceSearch',
	});
}

function getB2CLeadPopjs(objectRights, roleAndModule){

	$("#advanceLeadNewSearchForm #countryId").on("change",function(){
		callStates('advanceLeadNewSearchForm', this.value, 'countryId');
	});
		
	$("#advanceLeadNewSearchForm #stateId").on("change",function(){
		callCities('advanceLeadNewSearchForm', this.value, 'stateId');
	});
	
	$("#leadAssignToSearch").unbind().bind('change',function() {
		callTemplateList(true, 'leadSearchTemplate', $("#leadAssignToSearch").val());
	});

	$('#tentativeDate').datepicker({
		container: '#leadFollowupForm',
		autoclose: true,
		format: 'mm-dd-yyyy',
	});
	$('#reminderDate').datepicker({
		container: '#leadReminderPopupForm',
		autoclose: true,
		format: 'dd-mm-yyyy',
		startDate: new Date(),
	});
	if($('#reminderTime').length > 0){
		if(typeof $.fn.timepicker === "function"){
			if(!$('#reminderTime').data('timepicker')){
				$('#reminderTime').timepicker({
					format:'hh:mm p',
				});
			}
			$('#reminderTime').off('click.reminderTime').on("click.reminderTime",function(){
				var zIndex = parseInt($(this).closest(".modal.fade.show").css("z-index")) + 1999;
				$(".popover.timepicker-popover").css({"z-index":zIndex});
			});
		}else{
			$('#reminderTime').attr('type', 'time').attr('step', '60').removeClass('timepicker');
		}
	}

	$('#campaignStartDate').datepicker({
			autoclose: true,
			format: 'mm-dd-yyyy',
			container: '#leadCampaignPopupForm',
	});

	$('#campaignEndDate').datepicker({
		autoclose: true,
		format: 'mm-dd-yyyy',
		container: '#leadCampaignPopupForm',
	});

	// function editLeadSource(leadId, leadSourceId){
	// 	$("#leadUpdateId").val(leadId);
	// 	$("#leadUpdateSource").val(leadSourceId).trigger('change');
	// 	$("#updateNewLeadModal").modal('show');	
	// }
	$("#advanceLeadNewSearchForm .leadSearchCampaign").select2({
		theme:"bootstrap4",
		dropdownParent:"#advanceLeadNewSearchForm"
	});
	$("#advanceLeadNewSearchForm .leadSearchAdSet").select2({
		theme:"bootstrap4",
		dropdownParent:"#advanceLeadNewSearchForm"
	});
	$("#advanceLeadNewSearchForm .leadSearchTemplate").select2({
		theme:"bootstrap4",
		dropdownParent:"#advanceLeadNewSearchForm"
	});
	$("#advanceLeadNewSearchForm .leadSearchDeliveredStatus").select2({
		theme:"bootstrap4",
		dropdownParent:"#advanceLeadNewSearchForm",
		placeholder:"-- Select Delivered Status --"
	});

	$("#advanceLeadNewSearchForm #leadSupportTo").select2({
		theme:"bootstrap4",
		dropdownParent:"#advanceLeadNewSearchForm"
	});

	
	

	getSessionMasterList('advanceLeadNewSearchForm', 'leadAcadmicYear', true);
	getTggingMasterList('advanceLeadNewSearchForm', 'leadTagSearch')
	getPriorityMasterList('advanceLeadNewSearchForm', 'leadPriority');
	
	callLeadSourceList('advanceLeadNewSearchForm',''+objectRights.leadType+'','leadSourceSearch', true);
	
	callLeadStatusList('advanceLeadNewSearchForm',''+objectRights.leadType+'','leadStatusSearch', false);
	callPCountries('advanceLeadNewSearchForm', 0, 'countryIds');
	callPCountries('advanceLeadNewSearchForm', 0, 'countryId');
	callUTMSourceList('advanceLeadNewSearchForm',''+objectRights.leadType+'','utmSourceSearch', true);
	
	callLeadAssignUserList('advanceLeadNewSearchForm',''+objectRights.leadType+'','leadCreatedBy', true, objectRights.discardPermission,USER_ID, false);
	callLeadAssignUserList('advanceLeadNewSearchForm',''+objectRights.leadType+'','leadDemoAssignSearch', true, objectRights.discardPermission, USER_ID, false);
	callLeadAssignUserList('advanceLeadNewSearchForm',''+objectRights.leadType+'','leadSupportTo', true, objectRights.discardPermission, USER_ID, false);

	
	//callTemplateList(true, 'leadSearchTemplate', $("#leadAssignToSearch").val());
	//callCampainList(true,'advanceLeadNewSearchForm');
	callMasterCampainList('advanceLeadNewSearchForm','','leadSearchCampaign');
	callMasterAdSetList('advanceLeadNewSearchForm','','leadSearchAdSet');
	setTimeout(function() {
		if(objectRights.discardPermission){
			if(objectRights.clickUserid>0){
				$("#advanceLeadNewSearchForm #leadAssignToSearch").val(objectRights.clickUserid).trigger('change');
			}
		}else{
			$("#advanceLeadNewSearchForm #leadAssignToSearch").val(USER_ID).trigger('change');
		}
	}, 1000);

	

	

	$("#moveNewLead").on('click',function() {
		var moveleadNo = $("#leadNoMove").val();
		$("#btnClickLeadMove").prop("disabled", false);
		if(!$("#blankDemo").val().includes('blank')){ // demo not blank
			$("#leadDemoAssignToWithDemo").prop('disabled', false)
			$("#leadDemoAssignToOnlyDemo").prop('disabled', false);
			$("#leadDemoAssignToWithOutDemo").prop('disabled', false);
			$("#leadDemoAssignToOnlyDemo").prop('checked', true);
			if(OBJECT_RIGHTS.discardPermission == false){ //condition for counselor only
				if($("#demoMovedTrue").val().includes("moved")){ // demo not blank and moved 
					$("#leadDemoAssignToWithDemo").prop('disabled', true)
					$("#leadDemoAssignToWithOutDemo").prop('disabled', true);
					$("#leadDemoAssignToOnlyDemo").prop('checked', true);
				}else{
					$("#leadDemoAssignToWithDemo").prop('disabled', false)
					$("#leadDemoAssignToWithOutDemo").prop('disabled', false);
				}
			}
		}else{ // demo blank
			$("#leadDemoAssignToWithDemo").prop('disabled', true)
			$("#leadDemoAssignToOnlyDemo").prop('disabled', true);
			$("#leadDemoAssignToWithOutDemo").prop('disabled', false);
			$("#leadDemoAssignToWithOutDemo").prop('checked', true);
			if(OBJECT_RIGHTS.discardPermission == false && $("#demoMovedTrue").val().includes("moved")){ // both blank and moved demo
				$("#leadDemoAssignToWithDemo").prop('disabled', true)
				$("#leadDemoAssignToWithOutDemo").prop('disabled', true);
				$("#leadDemoAssignToWithOutDemo").prop('checked', false);
				$("#leadDemoAssignToOnlyDemo").prop('checked', false);
				$("#btnClickLeadMove").prop("disabled", true);
			}
		}
		if(moveleadNo==''){
			showMessageTheme2(0, 'Please check any one lead','',false);
			return false;
		}
		$('#moveLeads').modal('show');
		
	});

	

	$('#leadDOB').datepicker({
		autoclose: true,
		format: 'mm-dd-yyyy',
		container: '#leadPopupForm',
	});

	$("#leadMergeDataPopupB2BForm #countryId").on("change",function(){
		callStates('leadMergeDataPopupB2BForm', this.value, 'countryId');
	});
		
	$("#leadMergeDataPopupB2BForm #stateId").on("change",function(){
		callCities('leadMergeDataPopupB2BForm', this.value, 'stateId');
	});


		$("#exportLead").unbind().bind('click',function(){
		$("#errMsg").text('')
		
		var formId = 'advanceLeadNewSearchForm'; 
		var moduleId=OBJECT_RIGHTS.moduleId; 
		var leadFrom=OBJECT_RIGHTS.leadFrom;
		var clickFrom=OBJECT_RIGHTS.clickFrom +'-'+OBJECT_RIGHTS.clickUserid; 
		var currentPage=currentPage; 
		var typeTheme='new'; 
		var newTheme=true; 
		var callbadge ='totalleads';
		
		var callBadge = '';
		var calbag = clickFrom.split("-");
		if(calbag[0]=='totalGreen'){
			callBadge = "green";
		}else if(calbag[0]=='totalYellow'){
			callBadge = "yellow";
		}else if(calbag[0]=='totalRed'){
			callBadge = "red";
		}else if(calbag[0]=='totalWhite'){
			callBadge = "white";
		}else{
			callBadge = $("input[name='callBadgeSearch']:checked").val();
		}
		if(callBadge==undefined){
			callBadge='';
		}
		var clickBy = 'totalleads'; 
		if(OBJECT_RIGHTS.clickFrom!=''){
			clickBy=OBJECT_RIGHTS.clickFrom;
		}
		var newTheme = typeTheme;
		var leadFrom=leadFrom;
		var clickFrom =clickFrom;
		var moduleId = moduleId;
		if(currentPage==undefined){
			currentPage=0;
		}
		var leadsFollowCount=0;
		
		var leadNo = $("#"+formId+" #leadNoSearch").val()!=undefined?$("#"+formId+" #leadNoSearch").val():"";
		var leadSorc="";
		var lSource = $("#"+formId+" #leadSourceSearch").val()!=undefined?$("#"+formId+" #leadSourceSearch").val():"";
		if(lSource.length>0){
			leadSorc=lSource.join('@');
		}
		
		var leadStatus=""; 
		var leadSts= $("#"+formId+" #leadStatusSearch").val()!=undefined?$("#"+formId+" #leadStatusSearch").val():"";
		if(leadSts.length>0){
			leadStatus=leadSts.join('@');
		}
		var sbsbStatus="N";
		if($("#"+formId+" #leadStatusSearch").val()=='SCHOLARSHIP'){
			sbsbStatus="Y";
		}
		//var assignTo = $("#"+formId+" #leadAssignToSearch").val();
		var assignTo=""; 
		var assignTos= $("#"+formId+" #leadAssignToSearch").val()!=undefined?$("#"+formId+" #leadAssignToSearch").val():"";
		if(assignTos.length>0){
			assignTo=assignTos.join('@');
		}
		var followupBy =$("#"+formId+" #followMedSearch option:selected").val()!=undefined?$("#"+formId+" #followMedSearch option:selected").val():"";
		var email = $("#"+formId+" #leademailIdSearch").val()!=undefined?$("#"+formId+" #leademailIdSearch").val():"";
		var phoneNo = $("#"+formId+" #phoneNoSearch").val()!=undefined?$("#"+formId+" #phoneNoSearch").val():"";
		var stdFname = $("#"+formId+" #leadstdfnameSearch").val()!=undefined?$("#"+formId+" #leadstdfnameSearch").val():"";
		var gurdianFname = '';//$("#"+formId+" #leadParentfnameSearch").val();
		var standard = $("#"+formId+" #leadGradeSearch option:selected").val()!=undefined?$("#"+formId+" #leadGradeSearch option:selected").val():"";
		var country = $("#"+formId+" #countryIds").val()!=undefined?$("#"+formId+" #countryIds").val():'';
		var state = $("#"+formId+" #stateId option:selected").val()!=undefined?$("#"+formId+" #stateId option:selected").val():"";
		if(state==undefined){
			state="";
		}
		var city = $("#"+formId+" #cityId option:selected").val()!=undefined?$("#"+formId+" #cityId option:selected").val():"";
		if(city==undefined){
			city="";
		}
		var priority = '';//$("#"+formId+" #leadPrioritySearch").val();
		var toCall = $("#"+formId+" #callWithSearch").val()!=undefined?$("#"+formId+" #callWithSearch").val():"";
		var leadFollowStatus = '';///$("#"+formId+" #searchStatusOfLead").val();
		var demoAssignTo = $("#"+formId+" #leadDemoAssignSearch option:selected").val()!=undefined?$("#"+formId+" #leadDemoAssignSearch option:selected").val():"";
		
		var leadStartDate = $("#"+formId+" #leadStartDateSearch").val()!=undefined?$("#"+formId+" #leadStartDateSearch").val():"";
		var leadEndDate = $("#"+formId+" #leadEndDateSearch").val()!=undefined?$("#"+formId+" #leadEndDateSearch").val():"";
		
		var searchDateType = $("#"+formId+" #searchDateType option:selected").val()!=undefined?$("#"+formId+" #searchDateType option:selected").val():"";
		
		var lastTotalCallDay = '';//$("#"+formId+" #lastTotalCallDay").val();
		var acadmicYear = $("#"+formId+" #leadAcadmicYear").val()!=undefined?$("#"+formId+" #leadAcadmicYear").val():"";
		if($("#leadsFollowCount").val()!=undefined){
			leadsFollowCount=$("#leadsFollowCount").val();
		}
		var leadFullSearch=$("#"+formId+" #leadFullSearch").val()!=undefined?$("#"+formId+" #leadFullSearch").val():"";
		var utmSource = $("#"+formId+" #utmSourceSearch").val()!=undefined?$("#"+formId+" #utmSourceSearch").val():"";
		var utmCampaign ="";
		var utmCam= $("#"+formId+" #leadSearchCampaign").val()!=undefined?$("#"+formId+" #leadSearchCampaign").val():"";
		if(utmCam.length>0){
			utmCampaign=utmCam.join('@');
		}

		var leadTemplate = $("#"+formId+" #leadSearchTemplate").val()!=undefined?$("#"+formId+" #leadSearchTemplate").val():"";


		var sendQuery='callBadge='+callBadge+'&clickBy='+clickBy+'&leadFrom='+leadFrom+'&clickFrom='+clickFrom+'&currentPage='+currentPage+'&leadNo='+leadNo;
		sendQuery = sendQuery +'&leadSource='+leadSorc+'&leadStatus='+leadStatus+'&assignTo='+assignTo+'&followupBy='+followupBy+'&email='+email;
		sendQuery = sendQuery +'&phoneNo='+phoneNo+'&stdFname='+stdFname+'&gurdianFname='+gurdianFname+'&standard='+standard;
		sendQuery = sendQuery +'&country='+country+'&state='+state+'&city='+city+'&priority='+priority+'&toCall='+toCall;
		sendQuery = sendQuery +'&leadFollowStatus='+leadFollowStatus+'&demoAssignTo='+demoAssignTo;
		sendQuery = sendQuery +'&leadStartDate='+leadStartDate+'&leadEndDate='+leadEndDate+'&searchDateType='+searchDateType+'&utmSource='+utmSource+'&lastTotalCallDay='+lastTotalCallDay+'&acadmicYear='+acadmicYear;
		sendQuery = sendQuery +'&totalCallDay='+leadsFollowCount+'&leadFullSearch='+leadFullSearch+'&utmSource='+utmSource+'&utmCampaign='+utmCampaign+'&leadTemplate='+leadTemplate;
		//console.log(sendQuery);
		var urlSend = '/dashboard/report/lead-search-record-list?'+sendQuery;
		getAsPost(urlSend);
	});


}
function getTotalLead(leadType){
	$("#advancedformclick").val("")
	if($.inArray(USER_ROLE, ['STUDENT','TEACHER','PARENT','DIRECTOR']) == -1) {
		// for remark Demo update
		var data3 = getAllDemosForUpdateRemark(USER_ID);
		if(data3.status==1){
			var demoDetails=data3.details.demoDetails.demoDetails;
			if(demoDetails!=undefined){
				if(demoDetails.length>0){
					if($("#demo2DetailsModal").length>0){
						$("#demo2DetailsModal").remove();
					}
					$('body').append(forceDemo2UpdateModalContent(data3));
					$("#demo2DetailsModal").modal("show");
				}
			}
		}
		// for remark lead update
		var data2 = getAllLeadForUpdateRemark(USER_ID);
		if(data2.status==1){
			var leadDetails=data2.details.leadDetails.leadDetails;
			if(leadDetails!=undefined){
				if(leadDetails.length>0){
					if($("#leadDetailsModal").length>0){
						$("#leadDetailsModal").remove();
					}
					$('body').append(forceLeadUpdateModalContent(data2));
					$("#leadDetailsModal").modal("show");
				}
			}
		}
		// end
		var data = getAllDemoForUpdateStatus(USER_ID);
		if(data.status==1){
			var demoDetails=data.details.demoDetails.demoDetails;
			if(demoDetails!=undefined){
				if(demoDetails.length>0){
					if($("#demoDetailsModal").length>0){
						$("#demoDetailsModal").remove();
					}
					$('body').append(forceDemoUpdateModalContent(data));
					$("#demoDetailsModal").modal("show");
				}
			}
		}
		// for remark callback update
		var data4 = getAllCallbackForUpdateRemark(USER_ID);
		if(data4.status==1){
			if(data4.details.callbackDetails != undefined){
				var callbackDetails=data4.details.callbackDetails.callbackDetails;
				if(callbackDetails!=undefined){
					if(callbackDetails.length>0){
						if($("#callbackDetailsModal").length>0){
							$("#callbackDetailsModal").remove();
						}
						$('body').append(forceCallbackUpdateModalContent(data4));
						setTimeout(() => {
							$("#callbackDetailsModal").modal("show");
						}, 200);
					}
				}
			}
		}
	}
	getLeadDataList('advanceLeadNewSearchForm','advance-search', 'list','0', 'new', true,'', OBJECT_RIGHTS, ROLE_MODULE);
}
function nextPage(currentPage){
	if(OBJECT_RIGHTS.leadFrom=='advance-search'){
		getLeadDataList('advanceLeadNewSearchForm', 'advance-search', ''+OBJECT_RIGHTS.clickFrom+'-'+OBJECT_RIGHTS.clickUserid+'', '0', 'new', true,'totalleads', OBJECT_RIGHTS, ROLE_MODULE);
	}else{
		var urlSend = '/dashboard/lead-data-list?moduleId=111&leadId=0&leadFrom='+OBJECT_RIGHTS.leadFrom+'&clickFrom='+OBJECT_RIGHTS.clickFrom+'&currentPage='+currentPage+'&euid='+encuid+'&leadType=B2B';
		getAsPost(urlSend);
		customLoader(false)
	}
}

function clickTotalLeads(clickFrom, currentPage, callbadge, leadfrom){
	if($("#leadSourceSearch").val().length>0){
		if($("#leadSourceSearch").val()[0]==18){}
		else{
			$("#advancedformclick").val("")
		}
	}else{
		$("#advancedformclick").val("")
	}

	leadfrom=leadfrom==undefined?'advance-search':leadfrom;
	//console.log(leadfrom);
	if(callbadge == "unattendedLead" || callbadge == "totalWebsiteDemo" || callbadge == "freshLead" || callbadge == "demoLead" || callbadge == "tdyDemo"){
		if($.inArray(USER_ROLE, ['STUDENT','TEACHER','PARENT','DIRECTOR']) == -1) {
			// for remark Demo update
			var data3 = getAllDemosForUpdateRemark(USER_ID);
			if(data3.status==1){
				var demoDetails=data3.details.demoDetails.demoDetails;
				if(demoDetails!=undefined){
					if(demoDetails.length>0){
						if($("#demo2DetailsModal").length>0){
							$("#demo2DetailsModal").remove();
						}
						$('body').append(forceDemo2UpdateModalContent(data3));
						$("#demo2DetailsModal").modal("show");
					}
				}
			}
			// for remark lead update
			var data2 = getAllLeadForUpdateRemark(USER_ID);
			if(data2.status==1){
				var leadDetails=data2.details.leadDetails.leadDetails;
				if(leadDetails!=undefined){
					if(leadDetails.length>0){
						if($("#leadDetailsModal").length>0){
							$("#leadDetailsModal").remove();
						}
						$('body').append(forceLeadUpdateModalContent(data2));
						$("#leadDetailsModal").modal("show");
					}
				}
			}
			// end
			var data = getAllDemoForUpdateStatus(USER_ID);
			if(data.status==1){
				var demoDetails=data.details.demoDetails.demoDetails;
				if(demoDetails!=undefined){
					if(demoDetails.length>0){
						if($("#demoDetailsModal").length>0){
							$("#demoDetailsModal").remove();
						}
						$('body').append(forceDemoUpdateModalContent(data));
						$("#demoDetailsModal").modal("show");
					}
				}
			}
			// for remark callback update
			var data4 = getAllCallbackForUpdateRemark(USER_ID);
			if(data4.status==1){
				if(data4.details.callbackDetails != undefined){
					var callbackDetails=data4.details.callbackDetails.callbackDetails;
					if(callbackDetails!=undefined){
						if(callbackDetails.length>0){
							if($("#callbackDetailsModal").length>0){
								$("#callbackDetailsModal").remove();
							}
							$('body').append(forceCallbackUpdateModalContent(data4));
							setTimeout(() => {
								$("#callbackDetailsModal").modal("show");
							}, 200);
						}
					}
				}
			}
		}
	}
	getLeadDataList('advanceLeadNewSearchForm',leadfrom, clickFrom, currentPage, 'new', true, callbadge, OBJECT_RIGHTS, ROLE_MODULE);
	
}


function getDiscardLeadModel() {
	var html='';
	html+=`<div class="modal fade" id="discardLeadModel">
		<div class="modal-dialog modal-md modal-notify modal-danger" role="document">
			<div class="modal-content">
				<div class="modal-header py-2 bg-primary text-white">
					<h5 class="modal-title" >Are you sure you want to discard this Lead?</h5>
				</div>
				<div id="statusMessage-2" class="modal-body delete-modal" style="padding-top:12px">
					<p><b>You are discarding the following Lead:</b></p>
					<p><b>Lead No: </b> <span id="leadDisplayNo"></span></p>
					<p><b>Lead Source: </b> <span id="leadDisplaySource"></span></p>
					<p><b>Name: </b> <span id="studentName"></span></p>
					<p><b>Email: </b> <span id="studentEmail"></span></p>
					<p><b>Phone no.: </b> <span id="studentPhoneNo"></span></p>
					<p><b>Created Date & Time: </b><span id="createdDate"></span></p>
				</div>
				<div class="modal-footer text-center">
					<div style="width:100%;float:left; text-align:right">	
						<button type="button" class="btn btn-primary" id='discardLeadWarningYes'>Yes</button>
						<button type="button" class="btn btn-danger  waves-effect text-right" data-dismiss="modal">No</button>
					</div>
				</div>
			</div>
		</div>
	</div>`;
	return html;
}

function showNewDiscardLeadModelFunction(functionName,leadSource,studentName,studentEmail,studentPhoneNo,createdDate,leadNo) {
	functionName = "$('#discardLeadModel').modal('hide');" + functionName + ";";
	$("#discardLeadWarningYes").attr("onclick", functionName);
	$("#leadDisplayNo").html(leadNo);
	$("#leadDisplaySource").html(leadSource);
	$("#studentName").html(studentName);
	$("#studentEmail").html(studentEmail);
	$("#studentPhoneNo").html(studentPhoneNo);
	$("#createdDate").html(createdDate);
	$("#discardLeadModel").modal("show");
}

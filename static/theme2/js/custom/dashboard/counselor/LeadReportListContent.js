
var LEAD_CATEGORY="B2C";
var ROLE_MODULE="";
var OBJECT_RIGHTS="";
async function renderCounselorLeadReportDashboard(title, roleAndModule, SCHOOL_ID, USER_ID,USER_ROLE, LEAD_CATEGORY){
	//var urlLead = "lead-list?moduleId=" +roleAndModule.moduleId + "&leadFrom=LEAD&clickFrom=list&startDate=&endDate=&country=0&campaign=&currentPage=0&euid=" +ENCRYPTED_USER_ID +"&leadType=" +LEAD_CATEGORY
  	var objRight= await getLeadReportData(roleAndModule.moduleId, USER_ID);
	var objectRights=objRight.objectRights;
	OBJECT_RIGHTS=objectRights;
	var html=getLeadReportMasterContent(title, objectRights);
    $('#dashboardContentInHTML').html(html);


	$("#counselorStartDate").datepicker({
			format : 'dd-mm-yyyy',
			autoclose: true,
	});
	$("#counselorEndDate").datepicker({
		format : 'dd-mm-yyyy',
		autoclose: true,
	});

	$("#syncZadarmaDate").datepicker({
			format : 'yyyy-mm-dd',
			autoclose: true,

	}).datepicker('setDate', new Date());

    callLeadCounselorsList('leadReportSearch',"DAY",'','','listCounselorTbody', false, 0, 0);
    $("#searchLeadCounselorType").on("change", function(){
        if($("#searchLeadCounselorType").val()=='CUSTOM'){
            $(".hidecounselorLead").css({"display":"block"});
            $("#zadarmaCallSync").addClass('hidden');
        }else{
            $(".hidecounselorLead").css({"display":"none"})
            callLeadCounselorsList('leadReportSearch',$("#searchLeadCounselorType").val(),'','','listCounselorTbody', false, 0, 0);
        }
    });

    $("#searchLeadCounselorReportType").on("change", function(){
        if($("#searchLeadCounselorReportType").val()=='Counselor'){
            $(".changeHeadText").text('Academic Counselor');
        }else if($("#searchLeadCounselorReportType").val()=='LOGS'){
            $(".changeHeadText").text('User');
        } else{
            $(".changeHeadText").text($("#searchLeadCounselorReportType").val());
        }
        
        var startDate=$("#counselorStartDate").val();
        var endDate=$("#counselorEndDate").val();
         if($("#counselorStartDate").val()=='' && $("#counselorStartDate").val()==undefined){
           startDate='';
        }
        if($("#counselorEndDate").val()=='' && $("#counselorEndDate").val()==undefined){
            endDate='';
        }
       callLeadCounselorsList('leadReportSearch',$("#searchLeadCounselorType").val(), startDate, endDate, 'listCounselorTbody',false, 0, 0);
    });
    

    $("#btnLeadCounselorWiseSubmit").on("click",function(){
        var startDate = $("#counselorStartDate").val();
        var endDate = $("#counselorEndDate").val();
        var searchCountrytype = $("#searchLeadCounselorType").val();
       
        if($("#counselorStartDate").val()=='' && $("#counselorStartDate").val()==undefined){
            showMessageTheme2(1, 'Please choose start date','',true);
		    return false;
        }
        if($("#counselorEndDate").val()=='' && $("#counselorEndDate").val()==undefined){
            showMessageTheme2(1, 'Please choose end date','',true);
		    return false;
        }
        callLeadCounselorsList('leadReportSearch',$("#searchLeadCounselorType").val(), startDate, endDate, 'listCounselorTbody', false, 0, 0);
    });
    
	$("#exportCounselorLead").unbind().bind('click',function(){
			
		var leadStartDate = $("#counselorStartDate").val();
		var leadEndDate = $("#counselorEndDate").val();
		var searchCountrytype = $("#searchLeadCounselorType").val();
		var assignTo=""; 
		var assignTos= $("#leadReportSearch #assignToSearch").val();
		if(assignTos.length>0){
			assignTo=assignTos.join('@');
		}
		var leadSorc="";
		var lSource = $("#leadReportSearch #sourceSearch").val();
		if(lSource.length>0){
			leadSorc=lSource.join('@');
		}
		var leadStatuses = $("#leadReportSearch #statusSearch").val();
		var standard = $("#leadReportSearch #gradeSearch").val();
		var demoAssignTo = $("#leadReportSearch #leadDemoAssign").val();
		var acadmicYear = $("#leadReportSearch #acadmicYear").val();
		var country = $("#leadReportSearch #countryId").val();
		var utmCampaign="";
		var utmCam = $("#leadReportSearch #searchCampaign").val();
		if(utmCam.length>0){
			utmCampaign=utmCam.join('@');
		}
		var reportType = $("#searchLeadCounselorReportType").val();

		var sendQuery='userId='+USER_ID+'&schoolId='+SCHOOL_ID+'&assignTo='+assignTo+'&leadStartDate='+leadStartDate+'&leadEndDate='+leadEndDate+'&leadSources='+leadSorc+'&leadStatuses='+leadStatuses;
		sendQuery = sendQuery +'&standard='+standard+'&demoAssignTo='+demoAssignTo+'&acadmicYear='+acadmicYear+'&country='+country+'&utmCampaigns='+utmCampaign+'&searchCountrytype='+searchCountrytype+'&reportType='+reportType;
		console.log(sendQuery);
			var urlSend = '/dashboard/report/counselor-lead-export?'+sendQuery;
			getAsPost(urlSend);
	});

	$("#acadmicYear").select2({
		theme:"bootstrap4",
		dropdownParent:"#leadReportSearch"
	});

	$("#sourceSearch").select2({
		theme:"bootstrap4",
		dropdownParent:"#leadReportSearch"
	});
	
	$("#statusSearch").select2({
		theme:"bootstrap4",
		dropdownParent:"#leadReportSearch"
	});
	
	$("#assignToSearch").select2({
		theme:"bootstrap4",
		dropdownParent:"#leadReportSearch"
	});	
	
	$("#countryId").select2({
		theme:"bootstrap4",
		dropdownParent:"#leadReportSearch"
	});
	$("#leadDemoAssign").select2({
		theme:"bootstrap4",
		dropdownParent:"#leadReportSearch"
	});

    $("#searchReportCampaign").select2({
        theme:"bootstrap4",
        dropdownParent:"#leadReportSearch"
    });

	$("#dataChartStartDate").datepicker({
        format : 'dd-mm-yyyy',
        autoclose: true,
	});
	$("#dataChartEndDate").datepicker({
		format : 'dd-mm-yyyy',
		autoclose: true,
	});
	$("#dataStartDate").datepicker({
        format : 'dd-mm-yyyy',
        autoclose: true,
    });
    $("#dataEndDate").datepicker({
        format : 'dd-mm-yyyy',
        autoclose: true,
    });

	$("#dataStudentStartDate").datepicker({
            format : 'dd-mm-yyyy',
            autoclose: true,
    });
    $("#dataStudentEndDate").datepicker({
        format : 'dd-mm-yyyy',
        autoclose: true,
    });

	$("#dataSchoolDemoStartDate").datepicker({
        format : 'dd-mm-yyyy',
        autoclose: true,
	});
	$("#dataSchoolDemoEndDate").datepicker({
		format : 'dd-mm-yyyy',
		autoclose: true,
	});
	$("#daywiseStartDate").datepicker({
        format : 'dd-mm-yyyy',
        autoclose: true,
	});
	$("#daywiseEndDate").datepicker({
		format : 'dd-mm-yyyy',
		autoclose: true,
	});
	$("#searchCampaignType").select2({
        theme:"bootstrap4",
		placeholder:"Select Campaign"
        //dropdownParent:"#leadCounselorDataForm"
    });
    $("#dataLeadCampaignStartDate").datepicker({
        format : 'dd-mm-yyyy',
        autoclose: true,
    });
    $("#dataLeadCampaignEndDate").datepicker({
        format : 'dd-mm-yyyy',
        autoclose: true,
    });


	getSessionMasterList('reportLeadSearchForm', 'acadmicYear', true);
	callLeadSourceList('reportLeadSearchForm','B2C','sourceSearch', true);
	callLeadStatusList('reportLeadSearchForm','B2C','statusSearch', false);
	callPCountries('reportLeadSearchForm', 0, 'countryId');
	callLeadAssignUserList('reportLeadSearchForm',''+OBJECT_RIGHTS.leadType+'','assignToSearch', true, OBJECT_RIGHTS.discardPermission, USER_ID);
	callLeadAssignUserList('reportLeadSearchForm',''+OBJECT_RIGHTS.leadType+'','leadDemoAssign', true, OBJECT_RIGHTS.discardPermission, USER_ID);
	callMasterCampainList('reportLeadSearchForm','','searchReportCampaign');
	
	
	callDaywiseLead("DAY","chart-pie-days",'','');
	callCampainWise("DAY", "lead-source","chart-lead-source",'','');

	$("#searchtypeTotalLead").on("change", function(){
		if($("#searchtypeTotalLead").val()=='CUSTOM'){
			$(".hideChartdate").css({"display":"block"});
		}else{
			$(".hideChartdate").css({"display":"none"})
			callDaywiseLead($("#searchtypeTotalLead").val(),"chart-pie-days",'','');
			callCampainWise($("#searchtypeTotalLead").val(), "lead-source","chart-lead-source",'','');
		}
	});

	$("#btnChartWiseSubmit").on("click",function(){
        var startDate = $("#dataChartStartDate").val();
        var endDate = $("#dataChartEndDate").val();
        var searchCountrytype = $("#searchtypeTotalLead").val();
        if($("#dataChartStartDate").val()=='' && $("#dataChartStartDate").val()==undefined){
            showMessageTheme2(1, 'Please choose start date','',true);
		        return false;
        }
        if($("#dataChartEndDate").val()=='' && $("#dataChartEndDate").val()==undefined){
            showMessageTheme2(1, 'Please choose end date','',true);
		        return false;
        }
        callDaywiseLead($("#searchtypeTotalLead").val(),"chart-pie-days",startDate,endDate);
        callCampainWise($("#searchtypeTotalLead").val(), "lead-source","chart-lead-source",startDate,endDate);
    });

	
    callLeadtimecountry("DAY",'','');
    $("#searchtype").on("change", function(){
        if($("#searchtype").val()=='CUSTOM'){
            $(".hidetimeCountrydate").css({"display":"block"});
        }else{
             $(".hidetimeCountrydate").css({"display":"none"})
            callLeadtimecountry($("#searchtype").val(),'','');
        }
    });

    $("#btnTimeCountrySubmit").on("click",function(){
        var startDate = $("#dataStartDate").val();
        var endDate = $("#dataEndDate").val();

        if($("#dataStartDate").val()=='' && $("#dataStartDate").val()==undefined){
            showMessageTheme2(1, 'Please choose start date','',true);
		        return false;
        }
        if($("#dataEndDate").val()=='' && $("#dataEndDate").val()==undefined){
            showMessageTheme2(1, 'Please choose end date','',true);
		        return false;
        }
        callLeadtimecountry($("#searchtype").val(), startDate, endDate);
    });

	
    callLeadEnrolled('',"DAY",'','');
    $("#searchStudenttype").on("change", function(){
        if($("#searchStudenttype").val()=='CUSTOM'){
            $(".hidestudentdate").css({"display":"block"});
        }else{
            $(".hidestudentdate").css({"display":"none"})
            callLeadEnrolled('',$("#searchStudenttype").val(),'','');
        }
    });

    $("#btnStudentWiseSubmit").on("click",function(){
        var startDate = $("#dataStudentStartDate").val();
        var endDate = $("#dataStudentEndDate").val();
        var searchCountrytype = $("#searchStudenttype").val();
        if($("#dataStudentStartDate").val()=='' && $("#dataStudentStartDate").val()==undefined){
            showMessageTheme2(1, 'Please choose start date','',true);
                return false;
        }
        if($("#dataStudentEndDate").val()=='' && $("#dataStudentEndDate").val()==undefined){
            showMessageTheme2(1, 'Please choose end date','',true);
                return false;
        }
        callLeadEnrolled('', $("#searchStudenttype").val(), startDate, endDate);
    });

	
    callLeadDemoList("DAY",'','');
    $("#searchSchoolDemoType").on("change", function(){
        if($("#searchSchoolDemoType").val()=='CUSTOM'){
            $(".hideschooldemo").css({"display":"block"});
        }else{
            $(".hideschooldemo").css({"display":"none"})
            callLeadDemoList($("#searchSchoolDemoType").val(),'','');
        }
    });

    $("#btnSchoolDemoWiseSubmit").on("click",function(){
        var startDate = $("#dataSchoolDemoStartDate").val();
        var endDate = $("#dataSchoolDemoEndDate").val();
        var searchCountrytype = $("#searchSchoolDemoType").val();
        if($("#dataSchoolDemoStartDate").val()=='' && $("#dataSchoolDemoStartDate").val()==undefined){
            showMessageTheme2(1, 'Please choose start date','',true);
		        return false;
        }
        if($("#dataSchoolDemoEndDate").val()=='' && $("#dataSchoolDemoEndDate").val()==undefined){
            showMessageTheme2(1, 'Please choose end date','',true);
		        return false;
        }
        callLeadDemoList($("#searchSchoolDemoType").val(), startDate, endDate);
    });
	if(objectRights.permissioncolumn=='Y'){
		callEnrollmentListDaywise('Enrollment', 'DAY','','');
		$("#searchDaywise").on("change", function(){
			if($("#searchDaywise").val()=='CUSTOM'){
				$(".hidedaywise").css({"display":"block"});
			}else{
				$(".hidedaywise").css({"display":"none"})
				callEnrollmentListDaywise($("#searchDaywiseReportType").val(), $("#searchDaywise").val(),'','');
			}
		});

		$("#searchDaywiseReportType").on("change", function(){
			var startDate=$("#daywiseStartDate").val();
			var endDate=$("#daywiseEndDate").val();
			if(startDate=='' && startDate==undefined){
			startDate='';
			}
			if(endDate=='' && endDate==undefined){
				endDate='';
			}
			callEnrollmentListDaywise($("#searchDaywiseReportType").val(), $("#searchDaywise").val(),startDate,endDate);
		});

		$("#btnDayWiseSubmit").on("click",function(){
			var startDate = $("#daywiseStartDate").val();
			var endDate = $("#daywiseEndDate").val();
			var searchCountrytype = $("#searchDaywise").val();
			if(startDate=='' && startDate==undefined){
				showMessageTheme2(1, 'Please choose start date','',true);
					return false;
			}
			if(endDate=='' && endDate==undefined){
				showMessageTheme2(1, 'Please choose end date','',true);
					return false;
			}
			callEnrollmentListDaywise($("#searchDaywiseReportType").val(), $("#searchDaywise").val(), startDate, endDate);
		});

	}
    callLeadCampaignList("DAY",'','','','');
    $("#searchLeadCampaignType").on("change", function(){
        if($("#searchLeadCampaignType").val()=='CUSTOM'){
            $(".hidecampaignLead").css({"display":"block"});
        }else{
            $(".hidecampaignLead").css({"display":"none"})
            callLeadCampaignList($("#searchLeadCampaignType").val(),'','','','');
        }
    });
    $("#searchCampaignType").on("change", function(){
        var startDate = $("#dataLeadCampaignStartDate").val();
        var endDate = $("#dataLeadCampaignEndDate").val();
        
        if($("#dataLeadCampaignStartDate").val()!='' && $("#dataLeadCampaignStartDate").val()!=undefined){
            startDate = $("#dataLeadCampaignStartDate").val();
        }
        if($("#dataLeadCampaignEndDate").val()!='' && $("#dataLeadCampaignEndDate").val()!=undefined){
            endDate = $("#dataLeadCampaignEndDate").val();
        }
        callLeadCampaignList($("#searchLeadCampaignType").val(), startDate, endDate,'','');
    });

    $("#btnLeadCampaignWiseSubmit").on("click",function(){
        var startDate = $("#dataLeadCampaignStartDate").val();
        var endDate = $("#dataLeadCampaignEndDate").val();
        var searchCountrytype = $("#searchLeadCampaignType").val();
       
        if($("#dataLeadCampaignStartDate").val()=='' && $("#dataLeadCampaignStartDate").val()==undefined){
            showMessageTheme2(1, 'Please choose start date','',true);
		    return false;
        }
        if($("#dataLeadCampaignEndDate").val()=='' && $("#dataLeadCampaignEndDate").val()==undefined){
            showMessageTheme2(1, 'Please choose end date','',true);
		    return false;
        }
        callLeadCampaignList($("#searchLeadCampaignType").val(), startDate, endDate,'','');
    });
}

function getLeadReportMasterContent(title, objectRights){
	
var html='<div class="app-page-title mb-3 py-2">'
	+'<div class="page-title-wrapper">'
	+'		<div class="page-title-heading">'
	+'			<div class="page-title-icon">'
	+'				<i class="fas fa-university text-primary"></i>'
	+'			</div>'
	+'			<div>'+title+'</div>'
	+'		</div>'
	+'	</div>'
	+'</div>';
	html+=getMainReportCard(objectRights);
	html+=counselorReportPopup();
	html+=getLeadReportSearchPopup(objectRights);
	return html;
}

function getMainReportCard(objRight){
	var html='';
		html+='<div class="main-card mb-3 card">';
			html+='<div class="card-body">';
			html+=getReportsTab(objRight);
			html+='</div>';
		html+='</div>';
		
	return html;
}

function getReportsTab(objRight){
	var html='';
	html+='<form action="javascript:void(0);" id="schoolDataReportForm" name="schoolDataReportForm" autocomplete="off" >'
		+'<div  class="text-center" id="ErrorMsg"><span class="text-warning" style="font-weight:bold;color:red;" id="errMsg"></span> </div>'
		+'<ul class="body-tabs body-tabs-layout tabs-animated body-tabs-animated nav">';
		if(objRight.permissioncolumn=='Y'){
			html+='<li class="nav-item">'
				+'<a role="tab" class="nav-link active" id="tab-1" data-toggle="tab" href="#tab-content-1">'
					+'<span>Lead Report</span>'
				+'</a>'
			+'</li>'
			+'<li class="nav-item">'
				+'<a role="tab" class="nav-link" id="tab-2" data-toggle="tab" href="#tab-content-2">'
					+'<span>Lead chart</span>'
				+'</a>'
			+'</li>';
		}else{
			html+='<li class="nav-item">'
				+'<a role="tab" class="nav-link active" id="tab-2" data-toggle="tab" href="#tab-content-2">'
					+'<span>Lead chart</span>'
				+'</a>'
			+'</li>';
		}
			html+=`<li class="nav-item">
				<a role="tab" class="nav-link" id="tab-3" data-toggle="tab" href="#tab-content-3">
					<span>Time wise Country</span>
				</a>
			</li>
			<li class="nav-item">
				<a role="tab" class="nav-link" id="tab-5" data-toggle="tab" href="#tab-content-5">
					<span>Enrolled List</span>
				</a>
			</li>
			<li class="nav-item">
				<a role="tab" class="nav-link" id="tab-6" data-toggle="tab" href="#tab-content-6">
					<span>School Demo List</span>
				</a>
			</li>`;
			if(objRight.permissioncolumn=='Y'){
				html+=`<li class="nav-item">
					<a role="tab" class="nav-link" id="tab-7" data-toggle="tab" href="#tab-content-7">
						<span>School Enrollment List Day wise</span>
					</a>
				</li>`;
			}
			html+=`<li class="nav-item">
				<a role="tab" class="nav-link" id="tab-8" data-toggle="tab" href="#tab-content-8">
					<span>Lead Detail By Campaign</span>
				</a>
			</li>
		</ul>
		<div class="tab-content p-3 border">`;
		if(objRight.permissioncolumn=='Y'){
			html+='<div class="tab-pane tabs-animation fade show active" id="tab-content-1" role="tabpanel">'
				+'<div class="tabs-animation">';
					html+=getLeadCounselorReportData(objRight);
				html+=`</div>
			</div>
			<div class="tab-pane tabs-animation fade show " id="tab-content-2" role="tabpanel">
				<div class="tabs-animation">`;
				html+=getLeadReportChart(objRight)
				html+=`</div>
			</div>`;
		}else{
			html+=`<div class="tab-pane tabs-animation fade show active" id="tab-content-2" role="tabpanel">
					<div class="tabs-animation">`;
						html+=getLeadReportChart(objRight)
					html+=`</div>
				</div>`;
		}
		html+=`<div class="tab-pane tabs-animation fade show " id="tab-content-3" role="tabpanel">
				<div class="tabs-animation">`
					html+=getLeadCountryTime(objRight);
				html+=`</div>
			</div>
			<div class="tab-pane tabs-animation fade show ${USER_ROLE == 'LEAD_AND_DEMO'?'active':''}" id="tab-content-5" role="tabpanel">
				<div class="tabs-animation">`
					html+=getLeadEnrollmentList(objRight);
				html+=`</div>
			</div>
			<div class="tab-pane tabs-animation fade show " id="tab-content-6" role="tabpanel">
				<div class="tabs-animation">`
					html+=getLeadSchoolDemoList(objRight);
				html+=`</div>
			</div>`;
			if(objRight.permissioncolumn=='Y'){
				html+=`<div class="tab-pane tabs-animation fade show " id="tab-content-7" role="tabpanel">
						<div class="tabs-animation">`
							html+=getLeadEnrollmentYearWise(objRight);
						html+=`</div>
					</div>	`;
			}
			html+=`<div class="tab-pane tabs-animation fade show " id="tab-content-8" role="tabpanel">
				<div class="tabs-animation">`
					html+=getLeadCampaignPriceList(objRight);
				html+=`</div>
			</div>
		</div>
		</form>	`;
		return html;
	}

	function counselorReportPopup(){
		var html='';
		html+=`<div id="counselorReport" class="modal fade bd-example-modal-lg fade-scale" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" style="top:40px">
		<div class="modal-dialog modal-xl">
		<div class="modal-content" id="counselorRptcontent">
			
		</div>
		</div>
		</div>`;
		return html;
	}

	function getLeadCounselorReportData(objRight){
		var html='';
		html+=`<div class="row" style="align-items: center;">
			<div class="col-md-12 col-lg-2">
				<select class="form-control mr-1" id="searchLeadCounselorReportType" name="searchLeadCounselorReportType">
					<option value="Counselor" ${objRight.searchtype == 'Counselor'?'selected':''}>COUNSELOR</option>
					<option value="Country" ${objRight.searchtype == 'Country'?'selected':''}>COUNTRY</option>
					<option value="Campaign" ${objRight.searchtype == 'CAMPAIGN'?'selected':''}>CAMPAIGN</option>
					<option value="LOGS" ${objRight.searchtype == 'LOGS'?'selected':''}>LOGS</option>
				</select>
			</div>
			<div class="col-md-12 col-lg-2">
				<select class="form-control mr-1" id="searchLeadCounselorType" name="searchLeadCounselorType">
					<option value="DAY" ${objRight.searchtype == 'DAY'?'selected':''}>Today</option>
					<option value="WEEK" ${objRight.searchtype == 'WEEK'?'selected':''}>Week</option>
					<option value="MONTH" ${objRight.searchtype == 'MONTH'?'selected':''}>Month</option>
					<option value="CUSTOM" ${objRight.searchtype == 'CUSTOM'?'selected':''}>Custom</option>
				</select>
			</div>
			<div class="col-md-6 col-lg-3 hidden" id="zadarmaCallSync"> 
				<input type="text" name="syncZadarmaDate" id="syncZadarmaDate" class="hidden" style="width:90px; margin-right: 12px;" readonly onkeydown="return false" />
				<button class=" btn btn-info " onclick="syncZadarmaCall()"><i class="fas fa-sync " id="callSyncRotate"></i></button>
			</div>
			<div class="col-md-6 col-lg-5"> 
				<div class="row" style="align-items: center;">
					<div class="col-md-12 col-lg-6 hidecounselorLead text-center">
						<input type="text" name="counselorStartDate" id="counselorStartDate" style="width:90px; margin-right: 6px;" readonly onkeydown="return false" /> To 
						<input type="text" name="counselorEndDate" id="counselorEndDate" style="width:90px; margin-left: 6px;" readonly onkeydown="return false"  />
					</div>
					<div class="col-md-12 col-lg-6 hidecounselorLead">
						<button class="btn btn-primary" id="btnLeadCounselorWiseSubmit">Submit</button>
					</div> 
				</div>         
			</div>
			<div class="col-md-6 col-lg-3" id="advanceSearchAndExport12"> 
				<button class=" btn btn-info" onclick="openModal('leadReport')"><i class="fa fa-search"></i>&nbsp;Advance Search</button>`;
				if(USER_ROLE == 'DIRECTOR'){
					html+=`<button class=" btn btn-success text-white mt-lg-1 mb-1" id="exportCounselorLead">Excel Export</button>`;
				}
			html+=`</div>
		</div>
	<hr/>
	<div class="row">
		<div class="col-lg-12 col-md-12 p-0">
			<table class="table table-bordered table-striped" id="counselor-list" style="font-size:11px !important" >
				<thead id="listCounselorTfoot"></thead>
				<thead id="listCounselorTheader">
					<tr>
						<th style="5% !important" class="text-center bg-primary text-white">Sr no.</th>
						<th class="text-center bg-primary text-white" style="width:110px;"><span class="changeHeadText">Counselor</span> Name</th>
						<th class="bg-primary text-white"><span class="text-left">Total Leads</span>   <span class="float-right"> U | D</span> </th>
						<th class="bg-primary text-white"><span class="text-left">Total</span>   <span class="float-right">FB | IG</span></th>
						<th class="text-center bg-primary text-white">Unattended</th>
						<th class="text-center bg-primary text-white">
							<table class="w-100 table mb-0 bg-transparent">
								<tbody>
									<tr>
										<td class="font-10" style="width:11%;border:0;border-right: 1px solid;border-radius:0 ">Demo Booked</td>
										<td class="font-10" style="width:11%;border:0;border-right: 1px solid;border-radius:0;">Completed</td>
										<td class="font-10" style="width:11%;border:0;border-right: 1px solid;border-radius:0;">Confirmed</td>
										<td class="font-10" style="width:11%;border:0;border-right: 1px solid;border-radius:0;">Not Confirmed</td>
										<td class="font-10" style="width:11%;border:0;border-right: 1px solid;border-radius:0;">Reschedule</td>
										<td class="font-10" style="width:11%;border:0;border-right: 1px solid;border-radius:0;">No-Show</td>
										<td class="font-10" style="width:11%;border:0;border-right: 1px solid;border-radius:0;">Cancelled</td>
										<td class="font-10" style="width:11%;border:0;border-right: 1px solid;border-radius:0;">Not Interested</td>
										<td class="font-10" style="width:11%;border:0;border-radius:0;">No Status</td>
									</tr>
								</tbody>
							</table>
						</th>
						<th class="text-center bg-primary text-white">Hot | Warm | Cold</th>
						<th class="text-center bg-primary text-white">Positive Enrollment</th>
						<th class="text-center bg-primary text-white">Reserved</th>
						<th class="text-center bg-primary text-white">Converted</th>
					</tr>
				</thead>
				<thead id="listCounselorTheader_log" class="hidden" >
					<tr>
						<th style="5% !important" class="text-center bg-primary text-white">Sr no.</th>
						<th class="text-center bg-primary text-white"><span class="changeHeadText">Counselor</span> Name</th>
						<th class="text-center bg-primary text-white">Call</th>
						<th class="text-center bg-primary text-white">Wati</th>
						<th class="text-center bg-primary text-white">Whatsapp</th>
						<th class="text-center bg-primary text-white">Mail</th>

					</tr>
				</thead>
				<tbody id="listCounselorTbody"></tbody>
			</table>
		</div>
	</div>`;
	return html;
}

function getLeadReportSearchPopup(objRights){
	var html='';
	html+=`<div id="leadReportSearch" class="modal fade bd-example-modal-lg fade-scale" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
	<input type="hidden" id="callFrom"/>
    <div class="modal-dialog modal-xl">
        <div class="modal-content border-0">
            <div class="modal-header py-2 bg-primary text-white">
                <h5 class="modal-title" >Advance Search</h5>
                <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form action="javascript:void(0);" id="reportLeadSearchForm" name="reportLeadSearchForm" autocomplete='off'>
				<input type="hidden" name="userId" id="userId" value="${USER_ID}">
					<div class="row">
						<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mb-1 mt-1">
							<div class="leadErrorText"></div>
						</div>
					</div>
					
					<div class="row">
						<div class="col-xl-3 col-lg-3 col-md-4 col-sm-4 col-12 mb-1 mt-1 acadmicYearDiv">
							<label class="m-0">Academic Year</label>
							<select	name="acadmicYear" id="acadmicYear" class="form-control" >
							<option value="all">All</option>
							</select>
						</div>
						<div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-1 mt-1 enrollType">
							<label class="m-0">Enrollment Type</label>
							<select	name="enrollmentSearch" id="enrollmentSearch" class="form-control">
								<option value="" >Select</option>
								<option value="fresh" >Fresh</option>
								<option value="reEnroll" >Re-Enroll</option>
							</select>
						</div>
						<div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-1 mt-1 leadSource">
							<label class="m-0">Lead Source</label>
							<select	name="sourceSearch" id="sourceSearch" class="form-control" multiple ></select>
						</div>
						<div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-1 mt-1 leadStatus">
							<label class="m-0">Lead Status</label>
							<select name="statusSearch" id="statusSearch" class="form-control" multiple ></select>
						</div>
						
						<div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 mb-1 mt-1 leadAssign">
							<label class="m-0">Lead Assign To</label>
							 <select name="assignToSearch" id="assignToSearch" class="form-control" multiple></select>
						</div>
						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 grade">
							<label class="m-0">Grade</label>
							<select name="gradeSearch" id="gradeSearch" class="form-control" >
							<option value="0">Select Grade</option>`;
							html+=getStandardContent(objRights.schoolId,true, false)
							html+=`</select>
						</div>
						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 country">
							<label class="m-0">Country</label>
							<select name="countryId" id="countryId" class="form-control" >
								<option value="0">Select country</option>
								<option value="-1">N/A</option>
							</select>
						</div>
                		<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 demoAssign">
							<label class="m-0">Demo Assign</label>
							<select	name="leadDemoAssign" id="leadDemoAssign" class="form-control" >
								<option value="0">Select Assign</option>
							</select>
                		</div>
						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1">
							<label class="m-0">Select Campaign</label>
							<select  name="searchReportCampaign" id="searchReportCampaign" class="form-control searchReportCampaign" multiple ></select>
						</div>
					</div>
				</form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger  float-right pr-4 pl-4 ml-2" onclick="reportLeadSearchReset('leadReportSearch')"><i class="fa fa-undo"></i>&nbsp;Reset</button>
				<button type="button" class="btn btn-info  float-right pr-4 pl-4 ml-2" data-dismiss="modal">Close</button>
				<button type="button" class="btn btn-success  float-right pr-4 pl-4" id="btnClickLeadReportSearch" onclick="submitFunction()"><i class="fa fa-search"></i>&nbsp;Search</button>
            </div>
        </div>
    </div>
</div>`;
return html;
}

function getLeadReportChart(objRights){
	var html='';
	html+=`<div class="row">
		<div class="col-md-12 col-lg-12">
			<div class="d-flex align-items-center flex-wrap justify-content-end" style="gap:0.5rem">
				<select class="form-control form-control-sm mr-1" id="searchtypeTotalLead" name="searchtypeTotalLead" style="width:fit-content">
					<option value="DAY" ${objRights.searchtype == 'DAY'?'selected':''}>Today</option>
					<option value="WEEK" ${objRights.searchtype == 'WEEK'?'selected':''}>Week</option>
					<option value="MONTH" ${objRights.searchtype == 'MONTH'?'selected':''}>Month</option>
					<option value="CUSTOM" ${objRights.searchtype == 'CUSTOM'?'selected':''}>Custom</option>
				</select>
				<div class="hideChartdate">
					<div class="d-flex align-items-center flex-wrap" style="gap:0.5rem">
						<div class="d-inline-flex align-items-center flex-wrap" style="gap:0.5rem">
							<input type="text" name="dataChartStartDate" class="form-control form-control-sm" id="dataChartStartDate" placeholder="Start Date" style="width:100px" readonly onkeydown="return false" />
							<div class="mx-1">To</div>
							<input type="text" name="dataChartEndDate" class="form-control form-control-sm" id="dataChartEndDate" placeholder="End Date" style="width:100px" readonly onkeydown="return false" />
						</div>
						<button class="btn btn-primary" id="btnChartWiseSubmit">Submit</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<hr/>
	<div class="row">
		<div class="col-lg-6 col-md-12">
		<div class="main-card mb-3 card">
			<div class="card-body">
			<h5 class="card-title">Day Wise</h5>
				<div id="chart-pie-days"></div>
			</div>  
		</div>   
		</div>
		<div class="col-lg-6 col-md-12">
			<div class="main-card mb-3 card">
			<div class="card-body">
				<h5 class="card-title">Lead Source</h5>
				<div id="chart-lead-source"></div>
			</div>   
			</div>   
		</div>
	</div>`;
	return html;
}

function getLeadCountryTime(objRights){
	var html='';
	html+=`<div class="row">
    <div class="col-md-12 col-lg-12">
        <div class="d-flex align-items-center flex-wrap justify-content-end" style="gap:0.5rem">
            <select class="form-control form-control-sm mr-1" id="searchtype" name="searchtype" style="width:fit-content">
                <option value="DAY" ${objRights.searchtype == 'DAY'?'selected':''}>Today</option>
                <option value="WEEK" ${objRights.searchtype == 'WEEK'?'selected':''}>Week</option>
                <option value="MONTH" ${objRights.searchtype == 'MONTH'?'selected':''}>Month</option>
                <option value="CUSTOM" ${objRights.searchtype == 'CUSTOM'?'selected':''}>Custom</option>
            </select>
            <div class="hidetimeCountrydate">
                <div class="d-flex align-items-center flex-wrap" style="gap:0.5rem">
                    <div class="d-inline-flex align-items-center flex-wrap" style="gap:0.5rem">
                        <input type="text" name="dataStartDate" id="dataStartDate" class="form-control form-control-sm" placeholder="Start Date" style="width:100px" readonly onkeydown="return false" />
                        <div class="mx-1">To</div> 
                        <input type="text" name="dataEndDate" id="dataEndDate" class="form-control form-control-sm" placeholder="End Date" style="width:100px" readonly onkeydown="return false" />
                    </div>
                    <button class="btn btn-primary" id="btnTimeCountrySubmit">Submit</button>
                </div>
            </div>
        </div>
    </div>
</div>
<hr/>
<div class="row">
    <div class="col-md-12 col-lg-12">
		<table class="table table-bordered table-striped" style="font-size:12px" >
           <thead>
                <tr>
                    <th style="width:15%">Time (Total Leads)</th>
                    <th class="">Countries (Total Leads)</th>
                </tr>
            </thead>
            <tbody id="timescountry"></tbody>
        </table>
    </div>
</div>`;
return html;
}
function getLeadEnrollmentList(objRights){
	var html='';
	html+=`<div class="row">
    <div class="col-md-12 col-lg-12">
        <div class="d-flex align-items-center flex-wrap justify-content-end" style="gap:0.5rem">
            <select class="form-control form-control-sm mr-1" id="searchStudenttype" name="searchStudenttype" style="width:fit-content">
                <option value="DAY" ${objRights.searchtype == 'DAY'?'selected':''}>Today</option>
                <option value="WEEK" ${objRights.searchtype == 'WEEK'?'selected':''}>Week</option>
                <option value="MONTH" ${objRights.searchtype == 'MONTH'?'selected':''}>Month</option>
                <option value="CUSTOM" ${objRights.searchtype == 'CUSTOM'?'selected':''}>Custom</option>
            </select>
            <div class="hidestudentdate">
                <div class="d-flex align-items-center flex-wrap" style="gap:0.5rem">
                    <div class="d-inline-flex align-items-center flex-wrap" style="gap:0.5rem">
                        <input type="text" name="dataStudentStartDate" class="form-control form-control-sm" id="dataStudentStartDate" placeholder="Start Date" style="width:100px" readonly onkeydown="return false" /> 
                        <div class="mx-1">To</div> 
                        <input type="text" name="dataStudentEndDate" class="form-control form-control-sm mr-1" id="dataStudentEndDate" placeholder="End Date" style="width:100px" readonly onkeydown="return false" />
                    </div>
                    <button class="btn btn-primary" id="btnStudentWiseSubmit">Submit</button>
                </div>
            </div>
            <button class=" btn btn-info" onclick="openModal('enrollmentList')"><i class="fa fa-search"></i>&nbsp;Advance Search</button>
        </div>
    </div>
</div>
<hr/>
<div class="row">
    <div class="col-lg-12 col-md-12">
        <table class="table table-bordered table-striped" id="enrolled-student" style="font-size:12px" >
           <thead>
                <tr>
                    <th class="">Sr no.</th>
                    <th>Student Name<br/>Grade Name</th>
                    <th>Email<br/>Country</th>
                    <th>Parent Name</th>
                    <th>Enrollment Type<br/>Learning Mode</th>
                    <th>Enrollment Date</th>
                    <th>Assign Name</th>
                    <th>System Training Date</th>
                    <th>System Training Status</th>
                </tr>
            </thead>
            <tbody id="enrollLeads"></tbody>
        </table>
    </div>
</div>`;
return html;
}

function getLeadSchoolDemoList(objRights){
	var html='';
	html+=`<div class="row">
    <div class="col-md-12 col-lg-12">
        <div class="d-flex align-items-center flex-wrap justify-content-end" style="gap:0.5rem">
            <select class="form-control form-control-sm mr-1" id="searchSchoolDemoType" name="searchSchoolDemoType" style="width:fit-content">
                <option value="DAY" ${objRights.searchtype == 'DAY'?'selected':''}>Today</option>
                <option value="WEEK" ${objRights.searchtype == 'WEEK'?'selected':''}>Week</option>
                <option value="MONTH" ${objRights.searchtype == 'MONTH'?'selected':''}>Month</option>
                <option value="CUSTOM" ${objRights.searchtype == 'CUSTOM'?'selected':''}>Custom</option>
            </select>
            <div class="hideschooldemo">
                <div class="d-flex align-items-center flex-wrap" style="gap:0.5rem">
                    <div class="d-inline-flex align-items-center flex-wrap" style="gap:0.5rem">
                        <input type="text" name="dataSchoolDemoStartDate" class="form-control form-control-sm" id="dataSchoolDemoStartDate" placeholder="Start Date" style="width:100px" readonly onkeydown="return false" />
                        <div class="mx-1">To</div>
                        <input type="text" name="dataSchoolDemoEndDate" class="form-control form-control-sm" id="dataSchoolDemoEndDate" placeholder="End Date" style="width:100px" readonly onkeydown="return false" />
                    </div>
                    <button class="btn btn-primary" id="btnSchoolDemoWiseSubmit">Submit</button>
                </div>
            </div>
        </div>
    </div>
</div>
<hr/>
<div class="row">
    <div class="col-lg-12 col-md-12">
        <table class="table table-bordered table-striped" id="school-demo-list" style="font-size:12px" >
           <thead>
                <tr>
                    <th style="width:5%" class="text-center bg-primary text-white">Sr no.</th>
                    <th style="width:15%" class="text-center bg-primary text-white">Meeting Date & Time(+05:30)<br/>Meeting From</th>
                    <th style="width:15%" class="text-center bg-primary text-white">Name Host | Attendee<br/>Email</th>`;
                    if(objRights.permissioncolumn == 'Y'){
						html+='<th style="width:30%" class="text-center bg-primary text-white">Join Time(+05:30)<br/>Host | Attendee</th>';
					}
                        
                   html+=`<th style="width:5%" class="text-center bg-primary text-white">Meeting Status</th>
                    <th style="width:30%" class="text-center bg-primary text-white">Meeting Remarks</th>
                </tr>
            </thead>
            <tbody id="schoolDemoListTbody"></tbody>
        </table>
    </div>
</div>`;
return html;
}

function getLeadEnrollmentYearWise(objRights){
	// <option value="ReEnrollment" ${searchtype eq 'ReEnrollment'?'selected':''}>Re-Enrollment</option>
    // <option value="Campaign" ${searchtype eq 'CAMPAIGN'?'selected':''}>CAMPAIGN</option>
	var html='';
	html+=`<div class="row">
        <div class="col-md-12 col-lg-2">
            <select class="form-control mr-1" id="searchDaywiseReportType" name="searchDaywiseReportType">
                <option value="Enrollment" ${objRights.searchtype == 'Enrollment'?'selected':''}>Fresh Enrollment</option>
                <option value="Leads" ${objRights.searchtype == 'Leads'?'selected':''}>Leads</option>
            </select>
        </div>
        <div class="col-md-12 col-lg-2">
            <select class="form-control mr-1" id="searchDaywise" name="searchDaywise">
                <option value="DAY" ${objRights.searchtype == 'DAY'?'selected':''}>Today</option>
                <option value="WEEK" ${objRights.searchtype == 'WEEK'?'selected':''}>Week</option>
                <option value="MONTH" ${objRights.searchtype == 'MONTH'?'selected':''}>Month Wise</option>
                <option value="CUSTOM" ${objRights.searchtype == 'CUSTOM'?'selected':''}>Custom</option>
            </select>
        </div>
        <div class="col-md-6 col-lg-5"> 
            <div class="row">
                <div class="col-md-12 col-lg-6 hidedaywise text-center">
                    <input type="text" name="daywiseStartDate" id="daywiseStartDate" style="width:90px" readonly onkeydown="return false" /> To 
                    <input type="text" name="daywiseEndDate" id="daywiseEndDate" style="width:90px" readonly onkeydown="return false" />
                </div>
                <div class="col-md-12 col-lg-6 hidedaywise">
                    <button class="btn btn-primary" id="btnDayWiseSubmit">Submit</button>
                </div> 
            </div>         
        </div>
    </div>
<hr/>
<div class="col-sm-12 col-md-12 col-lg-12 px-0">
    <div class="mb-3 card">
        <div class="pt-0 px-0 card-body">
            <div id="chart-enroll-yearwise"></div>
        </div>
    </div>	
</div>`;
return html;
}

function getLeadCampaignPriceList(objRights){
	var utmCampaignList = JSON.parse(objRights.utmCampaignList);	
	var html='';
	html+=`<div class="row">
        <div class="col-md-12 col-lg-12">
            <div class="d-flex align-items-center flex-wrap justify-content-end" style="gap:0.5rem">
                <div class="col-xl-4 col-lg-6 col-md-12 p-0">
                    <select class="form-control  mr-1 searchCampaignType" id="searchCampaignType" name="searchCampaignType" multiple="multiple">
						<option></option>`
						for(let u = 0; u < utmCampaignList.length; u++) {
							const elementCamp = utmCampaignList[u];
							html+=` <option value="${elementCamp.key}" data-campaign-name="${elementCamp.value}">${elementCamp.value} (${elementCamp.extra})</option>`;
						}
                   html+=` </select>
                </div>
                <div class="d-inline-flex align-items-center flex-wrap" style="gap:0.5rem">
                    <select class="form-control  mr-1" id="searchLeadCampaignType" name="searchLeadCampaignType" style="width:fit-content">
                        <option value="DAY" ${objRights.searchtype == 'DAY'?'selected':''}>Today</option>
                        <option value="WEEK" ${objRights.searchtype == 'WEEK'?'selected':''}>Week</option>
                        <option value="MONTH" ${objRights.searchtype == 'MONTH'?'selected':''}>Month</option>
                        <option value="CUSTOM" ${objRights.searchtype == 'CUSTOM'?'selected':''}>Custom</option>
                    </select>
                    <div class="hidecampaignLead">
                        <div class="d-flex align-items-center flex-wrap" style="gap:0.5rem">
                            <div class="d-inline-flex align-items-center flex-wrap" style="gap:0.5rem">
                                <input type="text" name="dataLeadCampaignStartDate" class="form-control" placeholder="Start Date" id="dataLeadCampaignStartDate" style="width:100px" readonly onkeydown="return false" />
                                <div class="mx-1">To</div>
                                <input type="text" name="dataLeadCampaignEndDate" class="form-control" placeholder="End Date" id="dataLeadCampaignEndDate" style="width:100px" readonly onkeydown="return false" />
                            </div>
                            <button class="btn btn-primary" id="btnLeadCampaignWiseSubmit">Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-12 col-lg-3">
            
        </div>
    </div>
    <hr/>
<div class="row">
    <div class="col-lg-12 col-md-12 ">
    <div id="accordion" class="accordion-wrapper">
        <table class="table table-bordered table-striped" id="lead-campaign-list" style="font-size:11px !important;" >
         <thead id="listCampaignTfoot"></thead>
           <thead>
                <tr>
                    <th class="text-center bg-primary text-white" style="max-width:70px;min-width:70px">Sr no.</th>
                    <th class="text-center bg-primary text-white">Campaign Name</th>
                    <th class="text-center bg-primary text-white">ACTIVE + IN-ACTIVE = Total Lead | FB API</th>
                    <th class="text-center bg-primary text-white">Amount Spent<br/>Cost per Lead SMS | Cost per Lead FB</th>
                    <th class="text-center bg-primary text-white" style="max-width:590px !important;width:590px">Counselor Name<br/>Lead | Active | In-active</th>
                </tr>
            </thead>
            <tbody id="leadCampaignListTbody">
                <tr>
                    <td colspan="9" class="text-center">
                        <div class="loader-wrapper d-flex justify-content-center align-items-center w-100"><div class="loader">Loading...'
                        <div class="line-scale"><div></div><div></div><div></div><div></div><div></div></div></div> </div>
                    </td>
                </tr>
            </tbody>
        </table>
        </div>
    </div>
</div>`;
return html;
}






var LEAD_CATEGORY="B2C";
var ROLE_MODULE="";
var OBJECT_RIGHTS="";
async function renderCounselorDailyReportDashboard(title, roleAndModule, SCHOOL_ID, USER_ID,USER_ROLE, jsobjectRights){
    ROLE_MODULE=roleAndModule;
  	//var objRight= await getLeadReportData(roleAndModule.moduleId, USER_ID, 'report');
    var objRights = JSON.parse(jsobjectRights);
	OBJECT_RIGHTS=objRights;
	var html ='<div class="app-container app-theme-white body-tabs-shadow fixed-header fixed-sidebar">';
		html += await dashboardHeaderContent();
		html +='<div class="app-main  pb-4">'
				+'<div class="col p-0">'
					+'<div class="app-main__inner">';
						html +=await getLeadReportMasterContent(title, objRights);
					html +='</div>'
				+'</div>'
			+'</div>'
		+'</div>';
		html +=await dashboardFooterContent();
		$('body').html(html);

        getcounselorReportList('0','DAY','','','','');

	$("#dataStartDate").datepicker({
        format : 'dd-mm-yyyy',
        autoclose: true,
	});
	$("#dataEndDate").datepicker({
		format : 'dd-mm-yyyy',
		autoclose: true,
	});

	$(".hidedate").css({"display":"none"})
	$("#searchtypeTotalLead").on("change", function(){
		if($("#searchtypeTotalLead").val()=='CUSTOM'){
			$(".hidedate").css({"display":"block"});
		}else{
			$(".hidedate").css({"display":"none"})
			getcounselorReportList('0',$("#searchtypeTotalLead").val(),'','','','');
			
		}
	});

	$("#btnWiseSubmit").on("click",function(){
        var startDate = $("#dataStartDate").val();
        var endDate = $("#dataEndDate").val();
        var searchCountrytype = $("#searchtypeTotalLead").val();
        if($("#dataStartDate").val()=='' && $("#dataStartDate").val()==undefined){
            showMessageTheme2(1, 'Please choose start date','',true);
		        return false;
        }
        if($("#dataEndDate").val()=='' && $("#dataEndDate").val()==undefined){
            showMessageTheme2(1, 'Please choose end date','',true);
		        return false;
        }
		getcounselorReportList('0',searchCountrytype,startDate,endDate,'','');
    });

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
					+'<p style="margin: 0">Copyright © '+schoolSettingsTechnical.copyrightYear+' '+schoolSettingsTechnical.copyrightName+' - All Rights Reserved.</p>'
				+'</div>'
			+'</div>'
		+'</div>'
		+'<div class="server-message">'
			+'<span class="msg" id="msgTheme2"></span>'
		+'</div>'
	+'</div>';
	return html;
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
		return html;
}

function getMainReportCard(objRight){
	var html='';
		html+='<div class="main-card mb-3 card">';
			html+='<div class="card-body">';
			html+=getCounslorDailyReport();
			html+='</div>';
		html+='</div>';
		
	return html;
}

function getCounslorDailyReport(){
	var html=`<div class="d-flex align-items-center flex-wrap justify-content-end" style="gap:0.5rem" >
						<select class="form-control form-control-sm mr-1 mb-2" id="searchtypeTotalLead" name="searchtypeTotalLead" style="width:fit-content">
							<option value="DAY" >Today</option>
							<option value="WEEK" >Week</option>
							<option value="MONTH" >Month</option>
							<option value="CUSTOM">Custom</option>
						</select>
						<div class="hidedate">
							<div class="d-flex align-items-center flex-wrap" style="gap:0.5rem">
								<div class="d-inline-flex align-items-center flex-wrap" style="gap:0.5rem">
									<input type="text" name="dataStartDate" class="form-control form-control-sm" id="dataStartDate" placeholder="Start Date" style="width:100px" readonly onkeydown="return false" />
									<div class="mx-1">To</div>
									<input type="text" name="dataEndDate" class="form-control form-control-sm" id="dataEndDate" placeholder="End Date" style="width:100px" readonly onkeydown="return false" />
								</div>
								<button class="btn btn-primary" id="btnWiseSubmit">Submit</button>
							</div>
						</div>
					</div>
					<div class="row" id="counselor-list-report"></div>
			`;
	return html;
}




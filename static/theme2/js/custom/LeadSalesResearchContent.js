
var LEAD_CATEGORY="B2C";
async function renderSalesResearchDashboard(title, roleAndModule, SCHOOL_ID, USER_ID,USER_ROLE, jsobjectRights){
    ROLE_MODULE=roleAndModule;
  	//var objRight= await getLeadReportData(roleAndModule.moduleId, USER_ID, 'report');
    var objRights = JSON.parse(jsobjectRights);
	OBJECT_RIGHTS=objRights;
	var html ='<div class="app-container app-theme-white body-tabs-shadow fixed-header fixed-sidebar">';
		html += await dashboardHeaderContent();
		html +='<div class="app-main  pb-4">'
				+'<div class="col p-0">'
					+'<div class="app-main__inner">';
						html +=await getSalesResearchMasterContent(title, objRights);
					html +='</div>'
				+'</div>'
			+'</div>'
		+'</div>';
		html +=await dashboardFooterContent();
		$('body').html(html);

		//getAdminReportList('0','DAY','','','','');
        //getcounselorReportList('0','DAY','','','','');
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
	html +=getLoaderContent();
	return html;
}

function getSalesResearchMasterContent(title, objectRights){
	
	var html='';
		// +'<div class="app-page-title mb-3 py-2">'
		// +'<div class="page-title-wrapper">'
		// +'		<div class="page-title-heading">'
		// +'			<div class="page-title-icon">'
		// +'				<i class="fas fa-university text-primary"></i>'
		// +'			</div>'
		// +'			<div>'+title+'</div>'
		// +'		</div>'
		// +'	</div>'
		// +'</div>';
		html+=getMainSalesCard(objectRights);
		return html;
}

function getMainSalesCard(objRight){
	var html='';
		html+=`<div class="main-card mb-3 card">
				<div class="card-body">
					<ul class="body-tabs body-tabs-layout tabs-animated body-tabs-animated nav">
						<li class="nav-item">
							<a role="tab" class="nav-link active" id="tab-1" data-toggle="tab" href="#tab-content-1">
								<span>Sales Research</span>
							</a>
						</li>
					</ul>
					<div class="tab-content p-3 border">
						<div class="tab-pane tabs-animation fade show active" id="tab-content-1" role="tabpanel">
							`;
						html+=getLeadSalesResearchSection();
						html+=`</div>
					</div>
				</div>
			</div>`;
		
	return html;
}

function getLeadSalesResearchSection(){
	var html=`<div class="row" id="lead-sales-research">
		<div class="col-3 border-right" >	</div>
		<div class="col-9">
			<div class="chat-wrapper" id="lead-sales-research-text"></div>
			<hr>
			<div class="app-inner-layout__bottom-pane d-block text-center">
				<div class="mb-0 position-relative row form-group">
					<div class="col-sm-12 d-flex">
						<input placeholder="Ask for help..." type="text" class="form-control" id="salesresearch" />
						<button class="btn btn-primary" onclick="getAskDataFromLLM()">Send</button>
					</div>
				</div>
			</div>
		</div>			
	
	</div>`;
	return html;
}





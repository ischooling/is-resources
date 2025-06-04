
var LEAD_CATEGORY="B2C";
var ROLE_MODULE="";
var OBJECT_RIGHTS="";
function renderCounselorLeadReportDashboard(title, roleAndModule, SCHOOL_ID,USER_ID,USER_ROLE, LEAD_CATEGORY){
	//var urlLead = "lead-list?moduleId=" +roleAndModule.moduleId + "&leadFrom=LEAD&clickFrom=list&startDate=&endDate=&country=0&campaign=&currentPage=0&euid=" +ENCRYPTED_USER_ID +"&leadType=" +LEAD_CATEGORY
    var html=getLeadReportMasterContent(title);
    $('#dashboardContentInHTML').html(html);
}

function getLeadReportMasterContent(title){
var html='<div class="app-page-title">'
	+'<div class="page-title-wrapper">'
	+'		<div class="page-title-heading">'
	+'			<div class="page-title-icon">'
	+'				<i class="fas fa-university text-primary"></i>'
	+'			</div>'
	+'			<div>'+title+'</div>'
	+'		</div>'
	+'	</div>'
	+'</div>';
	html+=getMainReportCard();
	return html;
}

function getMainReportCard(){
	var html='';
		html+='<div class="main-card mb-3 card">';
			html+='<div class="card-body">';

			html+='</div>';
		html+='</div>';
	return html;
}





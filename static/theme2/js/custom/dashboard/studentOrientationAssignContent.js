
var ROLE_MODULE="";
var OBJECT_RIGHTS="";
async function renderStudentOrientationAssignDashboard(title, roleAndModule, SCHOOL_ID, USER_ID,USER_ROLE){
  	var objRight= await getStudentOrientData(roleAndModule.moduleId, USER_ID);
	var objectRights=objRight.objectRights;
	OBJECT_RIGHTS=objectRights;

	ROLE_MODULE=roleAndModule;
	var html=await getStudentOrientationAssignContent(title);
    $('#dashboardContentInHTML').html(html);
	getOrientaionAssignUser();

	$(".leadCountry").select2({
		theme:"bootstrap4",
		dropdownParent:"#leadCounselorDataForm"
	});
	$("#formdate").val(todayAssignDate());
	$('#formdate').datepicker({
		container: '#studentAssignCounselorDataForm',
		autoclose: true,
		format: 'mm-dd-yyyy',
	}).on('changeDate', function() {
		var dateFrom=this.value;
		getOrientaionAssignUser();
		// var urlSend = '/dashboard/orientation-assign-form/?moduleId='+moduleId+'&todayDate='+dateFrom;
		// getAsPost(urlSend,'_self');
	});

	$("#saveLeadAssignUser").on('click', function(){
		saveLeadAssignToCounselor(USER_ID,'studentAssignCounselor','', 'ORIENT');
	});


}

function activeOrientCounselor(chckValue, userId, orderBy) {
	if (chckValue=='N') {
		chckValue='Y';
	}else if (chckValue=='Y') {
		chckValue='N';
	}
	saveInactiveAssignCounselorOrient(userId, chckValue, orderBy, 'ORIENT');
}
function getAvailability(userId){
	// $("#timeAvailabilityPopup").modal("show");
	getAsPost('/timeavailability/time-availability?moduleId='+moduleId+'&schoolId=' + SCHOOL_ID +'&euid='+userId);
	customLoader(false)
}

function todayAssignDate(){

	var d = new Date();
	var day = d.getDate();
	var month = d.getMonth() + 1;
	var year = d.getFullYear();
	if (day < 10) {
		day = "0" + day;
	}
	if (month < 10) {
		month = "0" + month;
	}
	var date = month + "-" + day + "-" + year ;
	return date;
}
function getSelectGrade(id, selectedValues){
	var selValues = selectedValues.replace("'","");
	var selectValue = selValues.split(',');
	$('#'+id).val(selectValue).trigger("change");
}
function getSelectCountries(id, selectedValues){
	var selValues = selectedValues.replace("'","");
	var selectValue = selValues.split(',');
	$('#'+id).val(selectValue).trigger("change");
}
function getStudentOrientationAssignContent(title){
	var html='<div class="app-page-title mb-3 py-2">'
		+'<div class="page-title-wrapper">'
		+'		<div class="page-title-heading">'
		+'			<div class="page-title-icon">'
		+'				<i class="fas fa-university text-primary"></i>'
		+'			</div>'
		+'			<div>'+title+'</div>'
		+'		</div>'
		+'		<div class="page-title-actions"></div>'
		+'	</div>'
		+'</div>';
	html+=getStudentOrientationAssignContentCard();
	// html+=getStudentOrientAdvanceSearchPopup();
	// html+=getOrientationUpdatePopup();
	// html+=getOrientationMovePopup();
	return html;
}

function getStudentOrientationAssignContentCard(){
	var html='';
		html+='<div class="main-card mb-3 card">';
			html+='<div class="card-body">';
			html+=getStudentOrientationAssignDataList();
			html+='</div>';
		html+='</div>';
		html+='<div id="scheduleMessageContent"></div>';
		html+='<div id="schedulePingMessageContent"></div>';
		
	return html;
}

function getStudentOrientationAssignDataList(){
	var html='';
	html+=`
		<div class="row">
			<div class="col-lg-12 col-md-12">
				<div class="d-flex align-items-center flex-wrap justify-content-end" style="gap:0.5rem">
					<input type="text" name="formdate" id="formdate" class="width:fit-content" readonly onkeydown="return false" />
				</div>
				<form class="form-horizontal w-100" method="post" action="javascript:void(0);" id="studentAssignCounselorDataForm">
					<input type="hidden" name="leadId" id="leadId" value="0" />
					<table class="table table-bordered table-striped text-center" id="studentAssignCounselor" style="width:100%;min-width:1200px;font-size:11px">
						<thead class="bg-primary text-white">
							<tr>
								<th style="width:5% !important">S. No.</th>
								<th style="width:10% !important">Counselor Name</th>
								<th style="width:5% !important">Order</th>
								<th style="width:5% !important">Total Student Assign </th>
								<th style="width:5% !important">Active/ Inactive</th>
								<th style="width:5% !important">Assign/ Total</th>
								<th style="width:8%">Time Prefrence</th>
							</tr>
						</thead>
						<tbody id="orientAssignUser">
							
						</tbody>
					</table>
					
				</form>	
			</div>
		</div>
		<div class="row">
			<div class="col-lg-6">
			</div>
			<div class="col-lg-6">
				<button class="btn btn-primary pull-right" id="saveLeadAssignUser">Save</button>
			</div>
		</div>
		<div class="modulepaging"></div>`;
		
	return html;
}






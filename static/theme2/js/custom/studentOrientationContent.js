
async function renderStudentOrientationListDashboard(title, roleAndModule, SCHOOL_ID, USER_ID,USER_ROLE){
  	var objRight= await getStudentOrientData(roleAndModule.moduleId, USER_ID);
	var objectRights=objRight.objectRights;
	OBJECT_RIGHTS=objectRights;

	ROLE_MODULE=roleAndModule;
	var html=await getStudentOrientationContent(title);
    $('#dashboardContentInHTML').html(html);
	$('#chooseDateToStartSemster').datepicker({
		autoclose: true,
		startDate: new Date(),
		format: 'M dd, yyyy',
		container: '#orientStatusUpdate',
	}).on('changeDate',function(){
		$("")	
		//callOrientationtime();
	});
	$("#schoolSettigsSelection").select2({
		theme:"bootstrap4",
		dropdownParent:".app-header"
	});

	$(".clear-all-btn button").on('click',function(){
		$('.custom-overlay').hide();
		$("body").removeClass("position-fixed");
		$('.notification-message').remove();
	});
	if(USER_ROLE=='STUDENT_COUNSELOR'){
		$("#commonloaderIdNewLoader").hide();
		$('#commonloaderId').hide();
		$('#commonloaderBody').hide();
	} 
	$('#gradeSearch').append(getStandardContent(SCHOOL_ID_OF_USER,true));
	$("#statusSearch").select2({
		theme:"bootstrap4",
		dropdownParent:"#orientationSearchForm"
	});
	
	$("#gradeSearch").select2({
		theme:"bootstrap4",
		dropdownParent:"#orientationSearchForm"
	});
	
	$("#countryId").select2({
		theme:"bootstrap4",
		dropdownParent:"#orientationSearchForm"
	});	
	$("#state").select2({
		theme:"bootstrap4",
		dropdownParent:"#orientationSearchForm"
	});
	$("#city").select2({
		theme:"bootstrap4",
		dropdownParent:"#orientationSearchForm"
	});
	advanceSearchStudentOrient('orientationSearchForm', roleAndModule.moduleId, 'full-search', '', 0,  OBJECT_RIGHTS.userWiseStatus, true ); 
	
	$("#btnClickOrientSearch").unbind().bind('click',function() {
		advanceSearchStudentOrient('orientationSearchForm',roleAndModule.moduleId, 'advance-search','', 0, OBJECT_RIGHTS.userWiseStatus,true);;
	});

	$('#startDateSearch').datepicker({
			autoclose: true,
			format: 'mm-dd-yyyy',
			container: '#orientationSearchForm',
	});

	$('#endDateSearch').datepicker({
		autoclose: true,
		format: 'mm-dd-yyyy',
		container: '#orientationSearchForm',
	});
	if(typeof refreshCustomFieldState === 'function'){
		refreshCustomFieldState($("#orientationSearchForm"));
		setTimeout(function(){
			refreshCustomFieldState($("#orientationSearchForm"));
			refreshCustomFieldState($("#orientStatusUpdateForm"));
			refreshCustomFieldState($("#moveOrientationNewForm"));
		}, 0);
	}

	var result = JSON.parse( OBJECT_RIGHTS.assignList);
	if(result.length>0){
		var dropdown = $('#moveOrientationNewForm #orientationAssignMove');
		dropdown.html('');
		dropdown.append('<option value="">Select Assignee</option>');
		$.each(result, function(k, v) {
			dropdown.append('<option value="' + v.id + '">'+ v.userFullName + ' </option>');
		});
	}


	getAllCountryList('orientationSearchForm','countryId');
	$("select#countryId").on("change",function(){
		callStates('orientationSearchForm', this.value, 'countryId');
	});
		
	$("select#stateId").on("change",function(){
		callCities('orientationSearchForm', this.value, 'stateId');
	});
	
	$("#saveOrient").on('click',function() {
		saveOrientStatus('orientStatusUpdateForm', roleAndModule.moduleId);
	});
	
	$("#moveOrientation").on('click',function() {
		//var  assignTo = []
		var orientationNo = "";
		$.each($("input[name='orientation-move-another']:checked"), function(){
				orientationNo = orientationNo+','+$(this).val();
				//assignTo.push($(this).attr("data-assignToUserId"));
		});
		if(orientationNo=="" || orientationNo==undefined){
			showMessageTheme2(2,"Please choose atleast one system training to move");
			return false;
		}
		$("#orientationNoMove").val(orientationNo);
		$('#moveOrientations').modal('show');
		// for (var i = 0; i < assignTo.length; i++) {
		// 	$("#orientationAssignMove option[value='" + assignTo[i] + "']").remove();
		// }
		
	});


$("#btnClickOrientationMove").on('click',function() {
	moveOrientationData(USER_ID,ROLE_MODULE.moduleId,'',0, true);
});

$("#selectAllOrientation").click(function () {
	 var newOrientation = $("#orientationNoMove").val();
     var chkAll = this;
     var chkRows = $("#orientTbl").find(".checkOrientation");
     chkRows.each(function () {
         $(this)[0].checked = chkAll.checked;
     });
     var orientationNo = "";
	 $.each($("input[name='orientation-move-another']:checked"), function(){
		if(newOrientation.indexOf($(this).val()) != -1){
     	}else{
            orientationNo = orientationNo+','+$(this).val();
		}
     });
     newOrientation = newOrientation + orientationNo;
     $("#orientationNoMove").val(newOrientation);
 });
 
	$(".checkLead").click(function () {
	 	  var leadnew = $("#leadNoMove").val();
	       var chkAll = $("#selectLeadAll");
       chkAll.attr("checked", "checked");
       var chkRows = $("#leadDataList").find(".checkLead");
       chkRows.each(function () {
           if (!$(this).is(":checked")) {
          	   chkAll.prop('checked', false);
               chkAll.removeAttr("checked", "checked");
                if(leadnew.indexOf($(this).val()) != -1){
     				leadnew = leadnew.replace(","+$(this).val(), '')
     			}
               return;
           }
       });
     var leadNo='';
     $.each($("input[name='lead-move-another']:checked"), function(){
     		if(leadnew.indexOf($(this).val()) != -1){
     		}else{
     			leadNo = leadNo+','+$(this).val();
     		}
            
     });
	     leadnew = leadnew + leadNo;
	     $("#leadNoMove").val(leadnew);
	   });
	if(typeof refreshCustomFieldState === 'function'){
		setTimeout(function(){
			refreshCustomFieldState($("#orientationSearchForm"));
			refreshCustomFieldState($("#orientStatusUpdateForm"));
			refreshCustomFieldState($("#moveOrientationNewForm"));
		}, 0);
	}

}
function toggleOption(checkbox) {
	var value = $(checkbox).attr("data-assigntouserid");
	if (checkbox.checked) {
		// If checked, remove the corresponding option
		$("#orientationAssignMove option[value='" + value + "']").remove();
	} else {
		// If unchecked, clear the select element and append the original options
		$('#orientationAssignMove').html(originalOptions);
	}
}
function clearAllNotifications(){
		$('.custom-overlay').hide();
		$("body").removeClass("position-fixed");
		$('.notification-message').remove();
   }
	function showAdvanceSearchModel(){
		//advanceOrientationSearchStudentReset('orientationSearch');
		$('#orientationSearch').modal('show');
	}
   function closeNotification(clicked_id){
	   var notificationLength = $('.notification-message').length;
	   $("."+clicked_id).remove();
	   if(notificationLength < 2){
			$('.custom-overlay').hide();
			$("body").removeClass("position-fixed");
		}
   }

function getStudentOrientationContent(title){
	var html='<div class="app-page-title mb-3 py-2">'
		+'<div class="page-title-wrapper">'
		+'		<div class="page-title-heading">'
		+'			<div class="page-title-icon">'
		+'				<i class="fas fa-university text-primary"></i>'
		+'			</div>'
		+'			<div>'+title+'</div>'
		+'		</div>'
		+'		<div class="page-title-actions">'
		+'			<button class=" btn btn-primary" onclick="return showAdvanceSearchModel();"><i class="fa fa-search"></i>&nbsp;Advance Search</button>';
			if(roleAndModule.updated=='Y'){
					html+=' <button class="btn btn-danger " id="moveOrientation">Move System Training</button>';
			}

		 html+='</div>'
		+'	</div>'
		+'</div>';
	html+=getStudentOrientationContentCard();
	html+=getStudentOrientAdvanceSearchPopup();
	html+=getOrientationUpdatePopup();
	html+=getOrientationMovePopup();
	return html;
}

function getStudentOrientationContentCard(){
	var html='';
		html+='<div class="main-card mb-3 card">';
			html+='<div class="card-body">';
			html+=getStudentOrientationDataList();
			html+='</div>';
		html+='</div>';
		html+='<div id="scheduleMessageContent"></div>';
		html+='<div id="schedulePingMessageContent"></div>';
		
	return html;
}

function getStudentOrientationDataList(){
	var html='';
	html+=`
		<div class="row">
			<div class="col-lg-12 col-md-12">
				<table class="table table-bordered table-striped border-radius-table font-12 responsive nowrap annoucement-table-details" id="orientTbl" style="font-size:11px">
					<thead>
						<tr class="bg-primary text-white">
							<th class="font-weight-normal border-bottom-0 vertical-align-middle rounded-top-left-10">All&nbsp;<input type="checkbox" id="selectAllOrientation" class="position-relative" style="top:2px" /></th>
							<th class="font-weight-normal border-bottom-0 vertical-align-middle text-center">Sr No.</th>
							<th class="font-weight-normal border-bottom-0 vertical-align-middle">Student Name<br/>Learning Program<br/>Grade<br/>Student Id</th>
							<th class="font-weight-normal border-bottom-0 vertical-align-middle">Counselor Meeting Date<br/>Time<br/>Asia/Kolkata</th>
							<th class="font-weight-normal border-bottom-0 vertical-align-middle">Student System Training Date<br/>Time</th>
							<th class="font-weight-normal border-bottom-0 vertical-align-middle">Assign Name</th>
							<th class="font-weight-normal border-bottom-0 vertical-align-middle">Status/ Meeting Link Status/ Update</th>
							<th class="font-weight-normal border-bottom-0 vertical-align-middle">Action</th>
							<th class="font-weight-normal border-bottom-0 vertical-align-middle">Remarks</th>
							<th class="font-weight-normal border-bottom-0 vertical-align-middle rounded-top-right-10">Create Time</th>
						</tr>
					</thead>	
					<tbody id="studentOrientList">
						
					</tbody>
				</table>
			</div>
		</div>
		<div class="modulepaging"></div>`;
		
	return html;
}


function getStudentOrientAdvanceSearchPopup(){
	var html=''
	html+=`<div id="orientationSearch" class="modal fade bd-example-modal-lg fade-scale" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" data-backdrop="static">
    <div class="modal-dialog modal-xl">
        <div class="modal-content border-0">
            <div class="modal-header py-2 bg-primary text-white">
                <h5 class="modal-title" >Advance Search</h5>
                <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form action="javascript:void(0);" id="orientationSearchForm" name="orientationSearchForm" autocomplete='off' class="custom-field-scope">
				<input type="hidden" name="userId" id="userId" value="${USER_ID }">
					<div class="row">
						<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mb-1 mt-1">
							<div class="orientationErrorText"></div>
						</div>
					</div>
					<div class="row custom-field-scope">
						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 leadStatus">
							<div class="input-group position-relative custom-field mb-2 mt-3 p-0">
								<select name="statusSearch" id="statusSearch" class="form-control">
										<option value="">Select Status</option>
										<option value="PENDING">Pending</option>
										<option value="COMPLETED">Completed</option>
										<option value="RESCHEDULE">Reschedule</option>
								</select>
								<label class="m-0">Status</label>
							</div>
						</div>
						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1">
							<div class="input-group position-relative custom-field mb-2 mt-3 p-0">
								<input type="text" name="studentIdSearch" id="studentIdSearch" class="form-control" maxlength="100" placeholder=" ">
								<label class="m-0">Student ID</label>
							</div>
						</div>
						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1">
							<div class="input-group position-relative custom-field mb-2 mt-3 p-0">
								<input type="text" name="phoneNoSearch" id="phoneNoSearch" class="form-control" onkeydown="return M.digit(event);" maxlength="15" placeholder=""/>
								<label class="m-0">Phone No.</label>
							</div>
						</div>
						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1">
							<div class="input-group position-relative custom-field mb-2 mt-3 p-0">
								<input type="text" name="stdfnameSearch" id="stdfnameSearch" class="form-control" maxlength="100" onkeydown="return M.isChars(event);" placeholder=" ">
								<label class="m-0">Student Name</label>
							</div>
						</div>
						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1">
							<div class="input-group position-relative custom-field mb-2 mt-3 p-0">
								<input type="text" name="parentfnameSearch" id="parentfnameSearch" class="form-control" maxlength="100" onkeydown="return M.isChars(event);" placeholder=" ">
								<label class="m-0">Parent Name</label>
							</div>
						</div>
						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 grade">
							<div class="input-group position-relative custom-field mb-2 mt-3 p-0">
								<select name="gradeSearch" id="gradeSearch" class="form-control" >
									<option value="0">Select Grade</option>
								</select>
								<label class="m-0">Grade</label>
							</div>
						</div>
						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 country">
							<div class="input-group position-relative custom-field mb-2 mt-3 p-0">
								<select name="countryId" id="countryId" class="form-control" >
									<option value="0">Select country</option>
								</select>
								<label class="m-0">Country</label>
							</div>
						</div>
						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 state">
							<div class="input-group position-relative custom-field mb-2 mt-3 p-0">
								<select name="stateId" id="stateId" class="form-control" >
									<option value="0">Select state</option>
								</select>
								<label class="m-0">State</label>
							</div>
						</div>
						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 col-12 mb-1 mt-1 city">
							<div class="input-group position-relative custom-field mb-2 mt-3 p-0">
								<select name="cityId" id="cityId" class="form-control" >
									<option value="0">Select city</option>
								</select>
								<label class="m-0">City</label>
							</div>
						</div>
						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 col-12 mb-1 mt-1 city">
							<div class="input-group position-relative custom-field mb-2 mt-3 p-0">
								<select class="form-control" name="selectedType" id="selectedType" onchange="selectDateOnTypeChange(this)">
									<option value="today">Today</option>    
									<option value="yesterday">Yesterday</option>    
									<option value="week">Week</option>    
									<option value="month">Month</option>    
									<option value="custom" selected>Custom</option>    
								</select>
								<label class="m-0">Select Date Type</label>
							</div>
						</div>
						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 datepickerStartWrapper">
							<div class="input-group position-relative custom-field mb-2 mt-3 p-0">
								<input type="text" name="startDateSearch" id="startDateSearch"  class="form-control datepicker" readonly onkeydown="return false" placeholder=" ">
								<label class="m-0">Start Date</label>
							</div>
						</div>
						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 datepickerEndWrapper">
							<div class="input-group position-relative custom-field mb-2 mt-3 p-0">
								<input type="text" name="endDateSearch" id="endDateSearch"  class="form-control datepicker" readonly onkeydown="return false" placeholder=" ">
								<label class="m-0">To Date</label>
							</div>
						</div>	
					</div>
				</form>
            </div>
            <div class="modal-footer">
				<button type="button" class="btn btn-success  float-right pr-4 pl-4" id="btnClickOrientSearch"><i class="fa fa-search"></i>&nbsp;Search</button>
                <button type="button" class="btn btn-danger  float-right pr-4 pl-4 ml-2" onclick="advanceOrientationSearchStudentReset('orientationSearch')"><i class="fa fa-undo"></i>&nbsp;Reset</button>
            </div>
        </div>
    </div>
</div>`;
		return html;
}

// function getStudentOrientAdvanceSearchPopup(){
// 	var html=''
// 	html+=`<div id="orientationSearch" class="modal fade bd-example-modal-lg fade-scale" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" data-backdrop="static">
//     <div class="modal-dialog modal-xl">
//         <div class="modal-content border-0">
//             <div class="modal-header py-2 bg-primary text-white">
//                 <h5 class="modal-title" >Advance Search</h5>
//                 <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
//                     <span aria-hidden="true">&times;</span>
//                 </button>
//             </div>
//             <div class="modal-body">
//                 <form action="javascript:void(0);" id="orientationSearchForm" name="orientationSearchForm" autocomplete='off'>
// 				<input type="hidden" name="userId" id="userId" value="${USER_ID }">
// 					<div class="row">
// 						<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mb-1 mt-1">
// 							<div class="orientationErrorText"></div>
// 						</div>
// 					</div>
// 					<div class="row">
// 						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 leadStatus">
// 							<label class="m-0">Status</label>
// 							<select name="statusSearch" id="statusSearch" class="form-control">
// 									<option value="">Select Status</option>
// 									<option value="PENDING">Pending</option>
// 									<option value="COMPLETED">Completed</option>
// 									<option value="RESCHEDULE">Reschedule</option>
// 							</select>
// 						</div>
// 						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1">
// 							<label class="m-0">Email</label>
// 							<input type="email" name="emailIdSearch" id="emailIdSearch" class="form-control"  maxlength="100">
// 						</div>
// 						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1">
// 							<label class="m-0">Phone No.</label>
// 							<input type="text" name="phoneNoSearch" id="phoneNoSearch" class="form-control" onkeydown="return M.digit(event);" maxlength="15"/>
// 						</div>
// 						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1">
// 							<label class="m-0">Student Name</label>
// 							<input type="text" name="stdfnameSearch" id="stdfnameSearch" class="form-control" maxlength="100" onkeydown="return M.isChars(event);">
// 						</div>
// 						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1">
// 							<label class="m-0">Parent Name</label>
// 							<input type="text" name="parentfnameSearch" id="parentfnameSearch" class="form-control" maxlength="100" onkeydown="return M.isChars(event);">
// 						</div>
// 						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 grade">
// 							<label class="m-0">Grade</label>
// 							<select name="gradeSearch" id="gradeSearch" class="form-control" >
// 								<option value="0">Select Grade</option>
// 							</select>
// 						</div>
// 						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 country">
// 							<label class="m-0">Country</label>
// 							<select name="countryId" id="countryId" class="form-control" >
// 								<option value="0">Select country</option>
// 							</select>
// 						</div>
// 						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 state">
// 							<label class="m-0">State</label>
// 							<select name="stateId" id="stateId" class="form-control" >
// 								<option value="0">Select state</option>
// 							</select>
// 						</div>
// 						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1 city">
// 							<label class="m-0">City</label>
// 							<select name="cityId" id="cityId" class="form-control" >
// 								<option value="0">Select city</option>
// 							</select>
// 						</div>
// 						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1">
// 							<label class="m-0">Start Date</label>
// 							<input type="text" name="startDateSearch" id="startDateSearch"  class="form-control datepicker" readonly onkeydown="return false">
// 						</div>
// 						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 mt-1">
// 							<label class="m-0">To Date</label>
// 							<input type="text" name="endDateSearch" id="endDateSearch"  class="form-control datepicker" readonly onkeydown="return false">
// 						</div>	
// 					</div>
// 				</form>
//             </div>
//             <div class="modal-footer">
// 				<button type="button" class="btn btn-success  float-right pr-4 pl-4" id="btnClickOrientSearch"><i class="fa fa-search"></i>&nbsp;Search</button>
//                 <button type="button" class="btn btn-danger  float-right pr-4 pl-4 ml-2" onclick="advanceOrientationSearchStudentReset('orientationSearch')"><i class="fa fa-undo"></i>&nbsp;Reset</button>
//             </div>
//         </div>
//     </div>
// </div>`;
// 		return html;
// }

function getOrientationUpdatePopup(){
	var html='';
	html+=`<div id="orientStatusUpdate" class="modal fade bd-example-modal-lg fade-scale" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" data-backdrop="static">
    <div class="modal-dialog modal-lg">
        <div class="modal-content border-0">
            <div class="modal-header py-2 bg-primary text-white">
                <h5 class="modal-title" >Update System Training Status</h5>
                <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form class="col-lg-12 col-md-12 col-ms-12 col-12 pt-2 pb-2 custom-field-scope" method="post" action="javascript:void(0);" id="orientStatusUpdateForm">
					<input type="hidden" name="orientId" id="orientId" value="" />
					<input type="hidden" name="totalRescheduleNumber" id="totalRescheduleNumber" value="" />
					<input type="hidden" name="rescheduleNumber" id="rescheduleNumber" value="" />
					
					<div class="row custom-field-scope">
						<div class="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12 mb-1 mt-1">
							<div class="input-group position-relative custom-field mb-2 mt-3 p-0">
								<select name="orientStatus" id="orientStatus" class="form-control" onchange="updateOrientStatus(this)">
									<option value="">Select Status</option>
									<!-- <option value="PENDING">Pending</option> -->
									<option value="COMPLETED">Completed</option>
									<option value="RESCHEDULE">Reschedule</option>
								</select>
								<label class="m-0">Status</label>
							</div>
						</div>
						<div class="col-xl-8 col-lg-8 col-md-8 col-sm-12 col-12 mb-1 mt-1">
							<div class="input-group position-relative custom-field mb-2 mt-3 p-0">
								<input type="text" name="orientRemark" id="orientRemark"  class="form-control" placeholder=" " />
								<label class="m-0">Remark</label>
							</div>
						</div>
						<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mb-1 mt-1 checkboxStatus" style="display:none;">
							<div class="checkbox-type">
								<!-- <span class="checkmark"></span> -->
								<label for="rescheduleFeeStatus" class="cursor">
									<input type="checkbox" id="rescheduleFeeStatus" name="checkbox" class="position-relative" style="opacity: 1;"  />&nbsp; Please Check if student has paid fee for rescheduling system training.
								</label>
								
							</div>	
						</div>
						<div class="full mt-2" style="max-height: 200px;overflow-y: auto;">
							<div class="viewOrientFreeSlot d-flex flex-wrap justify-content-center"></div>
						</div>
					</div>	
				</form>
            </div>
            <div class="modal-footer">
				<button type="button" class="btn btn-info  float-right pr-4 pl-4 ml-2" data-dismiss="modal">Close</button>
				<button type="button" class="btn btn-success  float-right pr-4 pl-4" id="saveOrient">Save</button>
            </div>
        </div>
    </div>
</div>`;
return html;
}

function getOrientationMovePopup(){
	var html='';
	html+=`<div class="modal fade" id="moveOrientations">
	<div class="modal-dialog modal-md" role="document">
		<div class="modal-content">
			<div class="modal-header p-2 bg-primary text-white">
				<h5 class="m-0">Move Orientation</h5>
			</div>
			<form action="javascript:void(0);" id="moveOrientationNewForm" name="moveLeadNewForm" autocomplete='off' class="custom-field-scope">
				<input type="hidden" name="orientationNoMove" id="orientationNoMove"/>
				<div class="modal-body delete-modal custom-field-scope">
					<div class="full">
						<div class="input-group position-relative custom-field mb-2 mt-3 p-0">
							<select	name="orientationAssignMove" id="orientationAssignMove" class="form-control" >
									<option value="0">Select Assignee</option>
								</select>
							<label class="mb-0">Move Assigned Orientation to</label> 
						</div>
					</div>
					<div class="full mt-1">
						<button type="button" class="btn btn-success  float-right pr-4 pl-4" id="btnClickOrientationMove">Move</button>
						<button type="button" class="btn btn-info  float-right pr-4 pl-4 mr-2" data-dismiss="modal">Close</button>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>`;
return html;
}

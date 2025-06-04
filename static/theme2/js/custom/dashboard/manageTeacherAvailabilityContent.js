async function renderTeacherAvailability(moduleId){
	roleAndModule = getUserRights(SCHOOL_ID_OF_USER, USER_ROLE_ID, USER_ID, moduleId);
	var html= await teacherTimeAvailabilityContent('Teacher Availability Management')
	$('body').append(html);
	
	// get Recommended Teacher form bind start here
		$("#recommendedTeacherlistForm").html(recommendedTeacherlistFilterForm());
		callSlotList('recommendedTeacherlistForm','addPreferenceStartTime');
		//callSlotList('recommendedTeacherlistForm','addPreferenceEndTime');
		if($('#addPreferenceStartTime').data('select2')){
			$("#addPreferenceStartTime").select2("destroy");
		}
		if($('#addPreferenceEndTime').data('select2')){
			$("#addPreferenceEndTime").select2("destroy");
		}
		$("#addPreferenceStartTime").select2({
			theme:"bootstrap4",
			placeholder: "Select start time",
			dropdownParent:"#recommendedTeacherlistForm"
		}).on('change', function() {
			var startTime = $(this).val();
			var endTimeDropdown = $('#addPreferenceEndTime');
			endTimeDropdown.empty();
			var firstTime = $("#addPreferenceStartTime option:nth-child(2)").val();
			var secondTime = $("#addPreferenceStartTime option:nth-child(3)").val();
			var timeGap = calculateTimeGap(firstTime, secondTime);
			if (startTime) {
				var startMinutes = parseTime(startTime) + timeGap;
				endTimeDropdown.append(getEndTimeDropdownValue(startMinutes,timeGap));
				endTimeDropdown.append(`<option value="11:59 PM">11:59 PM</option>`);
				$("#addPreferenceEndTime").prop("disabled", false).trigger("change");
			}
			// Trigger the change event to update Select2
			$('#addPreferenceEndTime').trigger('change');
			$("#addPreferenceEndTime").select2("destroy").select2({
				theme:"bootstrap4",
				placeholder: "Select end time",
				dropdownParent:"#recommendedTeacherlistForm"
			});
		});
		$("#addPreferenceEndTime").select2({
			theme:"bootstrap4",
			placeholder: "Select end time",
			dropdownParent:"#recommendedTeacherlistForm"
		});
		$("#addPreferenceEndTime").val("").trigger("change");
		$("#courseName").select2({
			theme:"bootstrap4",
			dropdownParent:"#recommendedTeacherlistForm"
		});
		initializeTypeahead('recommendedTeacherlistForm','courseName');
	// get Recommended Teacher form bind end here
	$('#teacherProfileStatus').select2({
		theme:"bootstrap4"
	});
	// var leadTable = $('.lead-table-wrapper');
	// var cardOffsetTop = leadTable.offset().top - 6;
	// $(window).on('scroll', function() {
	// 	var scrollTop = $(window).scrollTop();
	// 	if (scrollTop > cardOffsetTop) {
	// 		leadTable.css({
	// 			'position': 'sticky',
	// 			'top': '0px',
	// 			'left': '0',
	// 			'right': '0',
	// 			'margin':'0 auto',
	// 			'padding':'1.25rem',
	// 			'background':'white',
	// 			'border-radius':'.25rem',
	// 			'width':'calc(100% - 50px)'
	// 		});
	// 		$("#for-scroll-to-fixed-height").show();
	// 		$(".dataTables_scrollBody").css({"height":"520px", "overflow-y":"auto"});
	// 		$(".scrollFixedTable > thead").css({"position":"sticky","top":"0px","z-index":"1"});
	// 		$(".scrollFixedTable > thead td").css({"background":"#fff"});
	// 	} else {
	// 		leadTable.css({
	// 			'position': 'relative',
	// 			'top': 'auto',
	// 			'left': 'auto',
	// 			'right': 'auto',
	// 			'padding':'1.25rem',
	// 			'margin':'0rem',
	// 			'background':'iherit',
	// 			'border-radius':'0rem',
	// 			'width':'100%'
	// 		});
	// 		$("#for-scroll-to-fixed-height").hide();
	// 		$(".dataTables_scrollBody").css({"height":"inherit", "overflow-y":"inherit"});
	// 		$(".scrollFixedTable > thead").css({"position":"inherit","top":"inherit","z-index":"inherit"});
	// 		$(".scrollFixedTable > thead td").css({"background":"inherit"});
	// 	}
	// });
	
   
	if($('.timepicker').length>0){
		$('.timepicker').timepicker({
			 format:'hh:mm',
		});
		$('.timepicker').on("click",function(){
			 var zIndex = parseInt($(this).closest(".modal.fade.show").css("z-index"))+1999;
			 $(".popover.timepicker-popover").css({"z-index":zIndex});
		});
	}

	function parseTime(time) {
		// var timePeriods = ["AM", "PM"];
		let [t, period] = time.split(' ');
		let [hour, minutes] = t.split(':').map(Number);

		if (period === "PM" && hour !== 12) hour += 12;
		if (period === "AM" && hour === 12) hour = 0;

		return hour * 60 + minutes;
	}

	function getEndTime(startMins){
		var html = '';
		for (var i = startMins; i < 24 * 60; i += 30) {
				var endHour = Math.floor(i / 60);
				var endMinutes = i % 60;
				var endPeriod = endHour >= 12 ? "PM" : "AM";
				if (endHour > 12) endHour -= 12;
				if (endHour === 0) endHour = 0;
				var formattedEndTime = `${endHour}:${endMinutes.toString().padStart(2, '0')} ${endPeriod}`;
				html += `<option value="${formattedEndTime}">${formattedEndTime}</option>`;
				//$('.endTime').append("<option value="+endHour+":"+endMinutes.toString().padStart(2, '0')+"_"+endPeriod+">"+formattedEndTime+"</option>");
			}
		return html;	
	}

   $("#startTime").select2({
	   theme:"bootstrap4",
   }).on('change', function() {
		var startDate = new Date($("#timeAvailableDateFrom").val());
		var endDate = new Date($("#timeAvailableDateTo").val());
		if( startDate.valueOf() == endDate.valueOf()){
			var startTime = $(this).val();
			var endTimeDropdown = $('#endTime');
			endTimeDropdown.empty();
			if (startTime) {
				var startMinutes = parseTime(startTime) + 30;
				endTimeDropdown.append(getEndTime(startMinutes));
				endTimeDropdown.append(`<option value="11:59 PM">11:59 PM</option>`);
			}
			// Trigger the change event to update Select2
			$('#endTime').trigger('change');
			$("#endTime").select2("destroy").select2({
				theme:"bootstrap4"
			});
		}else{
			if(!$("#timeAvailableDateTo").val() == ""){
				var dropdownHtml = $("#startTime").html();
				$('#endTime').empty();
				$('#endTime').append(dropdownHtml)
				// Trigger the change event to update Select2
				$('#endTime').trigger('change');
				$("#endTime").select2("destroy").select2({
					theme:"bootstrap4"
				});
			}
		}
	});

   $("#endTime").select2({
	   theme:"bootstrap4",
   }).on("change",function(){
		var startTime = $('#startTime').val();
		var endTime = $(this).val();
		if (startTime && endTime) {
			var startMinutes = parseTime(startTime);
			var endMinutes = parseTime(endTime);
			if (startMinutes >= endMinutes) {
				//showMessageTheme2(0, "End time must be greater than start time.")
				//$(this).val('').trigger('change');
			}
		}
   });

	$("#timeAvailableDateFrom").datepicker({
	   autoclose: true,
	   format: 'M dd, yyyy',
   }).on('changeDate', function (selected) {
		$('#endTime').empty();
		setTimeAvailableDateTo(selected.date.valueOf());
   });

   $("#timeAvailableDateTo").datepicker({
	   autoclose: true,
	   format: 'M dd, yyyy',
	   startDate:new Date(),
	}).on('changeDate', function (selected) {
		var startDate = new Date($("#timeAvailableDateFrom").val());
		if(startDate.valueOf() == selected.date.valueOf()){
			var startTime = $("#startTime").val();
			var endTimeDropdown = $('#endTime');
			endTimeDropdown.empty();
			if (startTime) {
				var startMinutes = parseTime(startTime) + 30;
				endTimeDropdown.append(getEndTime(startMinutes));
				endTimeDropdown.append(`<option value="11:59 PM">11:59 PM</option>`);
			}
			// Trigger the change event to update Select2
			$('#endTime').trigger('change');
			$("#endTime").select2("destroy").select2({
				theme:"bootstrap4"
			});
		}else{
			var dropdownHtml = $("#startTime").html();
			$('#endTime').empty();
			$('#endTime').append(dropdownHtml)
			// Trigger the change event to update Select2
			$('#endTime').trigger('change');
			$("#endTime").select2("destroy").select2({
				theme:"bootstrap4"
			});
		}
	});
   function setTimeAvailableDateTo(selectedDateStart){
	$('#timeAvailableDateTo').val("");
	$('#timeAvailableDateTo').datepicker("destroy");
	var startDateA1 = new Date(selectedDateStart);
	startDateA1.setDate(startDateA1.getDate())
	$("#timeAvailableDateTo").datepicker({
		autoclose: true,
		startDate: startDateA1,
		format: 'M dd, yyyy',
	})
   }
	

	getAllTimeZone("timeZoneFrom");
	getAllTimeZone("timeZoneTo");

	courseProviderList('teacherFilterTime','lmsPlatform');

	$("#timeZoneFrom").select2({
	   theme: "bootstrap4",
   }).on("change", function(){
		var selectedHtml = $('#timeZoneFrom option:selected').clone();
		var options = $('#timeZoneFrom option:selected').nextAll().clone();
		$("#timeZoneTo").select2("destroy").select2();
		//$('#timeZoneTo').empty().append('<option value="">Select Timezone</option>');
		$('#timeZoneTo').empty().append(selectedHtml);

		options.each(function() {
			$('#timeZoneTo').append($(this));
		});
		$("#timeZoneTo").select2({
			theme: "bootstrap4",		
		});
		$('#timeZoneTo').trigger('change');					
   });
   $("#timeZoneTo").select2({
	   theme: "bootstrap4",		
   });

//   $("#standardId").select2({
// 		theme: "bootstrap4",		
// 	});

$("#subjectId").select2({
		theme: "bootstrap4",		
});



   
	
	var dateFrom=new Date();
	dateFrom =dateFrom.toString().split(" ")[1]+' '+dateFrom.toString().split(" ")[2]+', '+dateFrom.toString().split(" ")[3];
	$("#timeAvailableDateFrom").val(dateFrom)
	$("#timeAvailableDateTo").val(dateFrom)

	$(document).on('show.bs.modal', '.modal', function (e) {
	   if ($(e.target).hasClass('datepicker') || $(e.target).closest('.modal').length === 0) {
		   return;
	   }
	   var zIndex = 1050 + $('.right-slide-modal:visible').length * 20;
	   var modalEle = $(this);
	   customModalShow(modalEle, zIndex);
	   setTimeout(function(){
		   //$('.slick-slider-time-availiblity').slick('setPosition');
	   },500);
   });

   
   $(document).on('hidden.bs.modal', '.modal', function () {
	   var index =$(this).css('z-index')-1;
	   $("body").find('.'+index).remove();
   });

     $("#teacherTimeSearch").on('click',function(){
		$("#totalTeacher").text("0");
		$("#agreedHrs").text("0");
		$("#availableHrs").text("0");
		$("#occupiedHrs").text("0");
		$("#unoccupiedHrs").text("0");
		$("#remaining").text("0");
		
		$("#availableHrs").attr('data-available-second',0);
		$("#occupiedHrs").attr('data-occupied-second',0);
		$("#unoccupiedHrs").attr('data-unoccupied-second',0);
		$("#remaining").attr('data-remaining-second',0);
		$("#totalTeacher").attr('data-total-teacher',0);


		if($('#timeAvailableDateFrom').val()==''){
			showMessageTheme2(false, 'Please select start date');
			return false;
		}
	
		if($('#timeAvailableDateTo').val()==''){
			showMessageTheme2(false, 'Please select End date');
			return false;
		}
		var startTime = new Date($('#timeAvailableDateFrom').val());
		var endTime = new Date($('#timeAvailableDateTo').val());
	
		if(startTime > endTime){
			showMessageTheme2(false, 'Start date must be less than End date.');
			return false;
		}
		
        callTeacherListForAvailability('teacherFilterTime','');
     })

	 
	 $("#teacherTimeSearchReset").on('click',function(){
		$("#timeZoneFrom").val('').trigger('change');
		$("#timeZoneTo").val('').trigger('change');
		$("#teacherName").val('');
		$("#teacherEmail").val('');
		$("#teacherProfileStatus").val('').trigger('change');
		$("#timeAvailableSearchtype").val('TODAY').trigger('change');

	 });

	 $("#timeAvailableSearchtype").on("change", function(){
		var dateType=$("#timeAvailableSearchtype").val();
		var weekDates = getStartAndEndDate(dateType);
		var dateTypeText=$("#timeAvailableSearchtype option:selected").text();
		if(dateType=='MONTH'){
			$(".daywisezoom").text('Total');
		}else{
			$(".daywisezoom").text(dateTypeText+' | Total');
			$(".daywisezoom").css({"display":"block"});
		}

		if(dateType=='TODAY'){
            $(".hideTimeAvailableDate").css({"display":"none"});
        }else if(dateType=='WEEK' || dateType=='MONTH'){
			$("#timeAvailableDateFrom").attr("disabled","true");
			$("#startTime").attr("disabled","true");
			$("#timeAvailableDateTo").attr("disabled","true");
			$("#endTime").attr("disabled","true");
			$(".hideTimeAvailableDate").css({"display":"block"});
		}else{
			$("#timeAvailableDateFrom").removeAttr("disabled");
			$("#startTime").removeAttr("disabled");
			$("#timeAvailableDateTo").removeAttr("disabled");
			$("#endTime").removeAttr("disabled");
			$(".hideTimeAvailableDate").css({"display":"block"});
		}
		$("#timeAvailableDateFrom").val(weekDates.start);
		$("#timeAvailableDateTo").val(weekDates.end);
		
        // if($("#timeAvailableSearchtype").val()=='CUSTOM'){
        //     $(".hideTimeAvailableDate").css({"display":"block"});
        // }else{
		// 	$(".hideTimeAvailableDate").css({"display":"none"});
		// }
    });


	function getStartAndEndDate(type) {
		var firstOfWeek = "";
		var lastOfWeek = "";
		var strDate=[];
		var endDate=[];
		if(type=='WEEK'){
			const currentDate = new Date();
			const dayOfWeek = currentDate.getDay(); // 0 (Sun) to 6 (Sat)
	
			const startOfWeek = new Date(currentDate);
			startOfWeek.setDate(currentDate.getDate() - dayOfWeek); // Adjust for Sunday
	
			const endOfWeek = new Date(startOfWeek);
			endOfWeek.setDate(startOfWeek.getDate() + 6);
	
			const formatDate = (date) => date.toISOString().split('T')[0];
			strDate = startOfWeek.toDateString().split(" ");
			endDate = endOfWeek.toDateString().split(" ");
		}else if(type=='MONTH'){
			const currentDate = new Date();
			// First date of the month
			const firstDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
			// Last date of the month
			const lastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
			// Format dates to YYYY-MM-DD
			const formatDate = (date) => {
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
				const day = String(date.getDate()).padStart(2, '0');
				return `${year}-${month}-${day}`;
			};
			strDate = firstDate.toDateString().split(" ");
			endDate = lastDate.toDateString().split(" ");
		}else{
			var dateFrom=new Date();
			strDate =dateFrom.toString().split(" ");
			endDate=strDate;
		}

		firstOfWeek = strDate[1]+" "+strDate[2]+", "+strDate[3];
		lastOfWeek = endDate[1]+" "+endDate[2]+", "+endDate[3];

        return {
            start: firstOfWeek,//formatDate(startOfWeek),
            end: lastOfWeek//formatDate(endOfWeek)
        };
    }


	 getTimeForDropdown("startTime");
	 getTimeForDropdown("endTime");
	 $("#startTime").val("00:00 AM");
	 $("#endTime").val("11:59 PM");

	
	$('#teacherTimeSearchReset').trigger('click');
	// $('#teacherTimeSearch').trigger('click');
	$("select#standardId").unbind('change').bind("change",function(){
		var providerId = 37//$('#lmsPlatform').val();
		callSubjectsByGradeId('teacherFilterTime', this.value, 'standardId','subjectId','','', providerId);
	});
}

function getTimeForDropdown(elemntid){
   var $select = $('#'+elemntid);
   var start = 0; // Start time in minutes (0 minutes past midnight)
   var end = 1440; // End time in minutes (1440 minutes in a day)
   var interval = 30; // Interval in minutes

   // for (var minutes = start; minutes < end; minutes += interval) {
   //     var hours = Math.floor(minutes / 60);
   //     var mins = minutes % 60;
   //     var timeString = ('0' + hours).slice(-2) + ':' + ('0' + mins).slice(-2);
   //     $select.append($('<option></option>').val(timeString).html(timeString));
   // }
   for (var hour = 0; hour < 24; hour++) {
	   for (var minutes = 0; minutes < 60; minutes += interval) {
		   var ampm = hour < 12 ? 'AM' : 'PM';
		   var displayHour = hour % 12;
		   displayHour = displayHour ? displayHour : '00'; // the hour '0' should be '12'
		   var displayMinutes = minutes < 10 ? '0' + minutes : minutes;
		   var timeString = displayHour + ':' + displayMinutes + ' ' + ampm;
		   $select.append($('<option></option>').val(timeString).html(timeString));
	   }
   }
   $select.append('<option value="11:59 PM">11:59 PM</option>');
}


async function teacherTimeAvailabilityContent(title){
	var html=
	'<div class="app-container app-theme-white body-tabs-shadow fixed-header fixed-sidebar">'
		 	+await dashboardHeader()
		 	+'<div class="app-main pb-4">'
			  +'<div class="col p-0">'
				   +'<div class="app-main__inner pt-2">'
						+'<div class="app-page-title">'
							 +'<div class="page-title-wrapper">'
								  +'<div class="page-title-heading">'
									   +'<div class="page-title-icon"><i class="fas fa-user-cog text-primary"></i></div>'
									   +'<div>'+title+'</div>'
								  +'</div>'
								// +'<div class="page-title-actions">'
								// 	+'<div class="d-inline-block">Singapore (UTC +8)</div>'
								// +'</div>'
							 +'</div>'
						+' </div>'
						+'<div class="main-card mb-3 card">'
							 +'<div class="card-body bg-light-primary">'
							 +'<div class="full text-right">'
							 	+'<a href="javascript:void(0)" class="btn btn-primary" onclick="getRecommendedTeacherListModal()">Get Recommended Teacher</a>'
							 +'</div>'
							 +'<form id="teacherFilterTime">'
								+'<div class="row mt-2">'
									+'<div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 mb-2">'
										+'<label class="full text-primary m-0">Teacher Name</label>'
										+'<input type="text" class="form-control" name="teacherName" id="teacherName" value="">'
									+'</div>'
									+'<div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 mb-2">'
										+'<label class="full text-primary m-0">Teacher Email</label>'
										+'<input type="text" class="form-control" name="teacherEmail" id="teacherEmail" value="">'
									+'</div>'
									+'<div class="col-xl-2 col-lg-4 col-md-4 col-sm-6 col-12 mb-2">'
										+'<label class="full text-primary m-0">LMS Platform</label>'
										+'<select name="lmsPlatform" id="lmsPlatform" class="form-control"></select>'
									+'</div>'
									+'<div class="col-md-2 col-sm-6 col-xs-12">'
										+'<label>Select Grade</label>'
										+'<select name="standardId" id="standardId" class=" multiselect-dropdown form-control">'
										+'<option value="">Select Grade</option>'
											+getStandardContent(SCHOOL_ID,true)
										+'</select>'
									+'</div>'
									+'<div class="col-md-2 col-sm-6 col-xs-12">'
										+'<label>Select Course</label>'
										+'<select name="subjectId" id="subjectId" class="form-control">'
											
										+'</select>'
									+'</div>'
									+'<div class="col-xl-2 col-lg-4 col-md-4 col-sm-6 col-12 mb-2">'
										+'<label class="full text-primary m-0">Profile Status</label>'
										+'<select class="form-control" id="teacherProfileStatus" name="teacherProfileStatus" multiple="multiple">'
											+'<option value="0">On Boarded</option>'
											+'<option value="1">Under Training</option>'
											+'<option value="2">On Hold</option>'
										+'</select>'
									+'</div>'
									+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-2">'
										+'<label class="full text-primary m-0">Time Zone From</label>'
										+'<select class="form-control" name="timeZoneFrom" id="timeZoneFrom"></select>'
									+'</div>'
									+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-2">'
										+'<label class="full text-primary m-0">Time Zone To</label>'
										+'<select class="form-control" name="timeZoneTo" id="timeZoneTo"></select>'
									+'</div>'
									+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-2"></div>'
									+'<div class="col-xl-2 col-lg-4 col-md-4 col-sm-6 col-12 mb-2">'
										+'<label class="full text-primary m-0">Select Date <span class="font-weight-bold text-dark ml-2 d-inline-block"style="font-size:10px">(UTC +8:00) - Singapore</span></label>'	
										+'<select class="form-control" id="timeAvailableSearchtype" name="timeAvailableSearchtype">'
												+'<option value="TODAY">Today</option>'
												+'<option value="WEEK">Week</option>'
												+'<option value="MONTH">Month</option>'
												+'<option value="CUSTOM">Custom</option>'
										+'</select>'
									+'</div>'
									+'<div class="col-xl-10 col-lg-8 col-md-8 col-lg-8"> '
										+'<div class="row">'
											+'<div class="col-xl-2 col-lg-4 col-md-4 col-sm-6 col-12 mb-2 ">'
													+'<div class="w-100 hideTimeAvailableDate">'
														+'<label class="full text-primary m-0">Start Date</label>'
														+'<input type="text" class="form-control" name="timeAvailableDateFrom" id="timeAvailableDateFrom">'
													+'</div>'
											+'</div>'
											+'<div class="col-xl-2 col-lg-4 col-md-4 col-sm-6 col-12 mb-2 ">'
												+'<div class="w-100 hideTimeAvailableDate">'
													+'<label class="full text-primary m-0">Start Time</label>'
													+'<select class="form-control" name="startTime" id="startTime" style="font-size:11px !important"></select>'
												+'</div>'
											+'</div>'
											+'<div class="col-xl-2 col-lg-4 col-md-4 col-sm-6 col-12 mb-2 ">'
												+'<div class="w-100 hideTimeAvailableDate">'
													+'<label class="full text-primary m-0">End Date</label>'
													+'<input type="text" class="form-control" name="timeAvailableDateTo" id="timeAvailableDateTo">'
												+'</div>'
											+'</div>'
											+'<div class="col-xl-2 col-lg-4 col-md-4 col-sm-6 col-12 mb-2 ">'
												+'<div class="w-100 hideTimeAvailableDate">'
													+'<label class="full text-primary m-0">End Time</label>'
													+'<select class="form-control" name="endTime" id="endTime" style="font-size:11px !important"></select>'
												+'</div>'
											+'</div>'
											+'<div class="col-xl-4 col-lg-12 col-md-12 col-sm-12 col-12 mb-2">'
												+'<div class="w-100 text-right">'
													+'<label class="full text-primary m-0">&nbsp;</label>'
													+'<a href="javascript:void(0)" id="teacherTimeSearchReset" class="btn btn-success">Reset</a>'
													+'&nbsp;&nbsp;'
													+'<a href="javascript:void(0)" id="teacherTimeSearch" class="btn btn-primary">Apply</a>'
												+'</div>'
											+'</div>'
										+'</div>'      
									+'</div>'
								+'</div>'
								+'<hr/>'	
								+'</form>'
								  +'<div class="row">'
										   +'<div class="col-12 px-2 d-flex flex-wrap mt-4 justify-content-center">'
											   +'<div class="border-dark border p-2 rounded flex-grow-1 mx-2 mb-2" style="border-top-width:6px !important">'
											   +'<h6>Total Teacher</h6>'
											   // +'<a href="" class="text-decoration-none font-weight-bold text-dark" id="totalTeacher">0</a>'
											   +'<span class="text-decoration-none font-weight-bold text-success d-none" style="padding:2px;" data-total-teacher="0" id="totalTeacher">0</span>'
											   +'<span class="text-decoration-none font-weight-bold text-dark float-right" id="totalTeacherLive">0</span>'
											   +'<div class="mb-3 progress progress-bar bg-success" id="teacherCountProgress" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">&nbsp;</div>'
										   +'</div>' 
										//    +'<div class="bg-light-dark border-dark border p-2 rounded flex-grow-1 mx-2 mb-2" style="border-top-width:6px !important">'
										// 		 +'<h6>Agreed Hours</h6>'
										// 	   //   +'<a href="" class="text-decoration-none font-weight-bold text-dark" id="agreedHrs">0</a>'
										// 		 +'<span class="text-decoration-none font-weight-bold text-dark" id="agreedHrs">0</span>'
										// 	+'</div>'
											+' <div class="bg-light-primary border-primary border p-2 rounded flex-grow-1 mx-2 mb-2" style="border-top-width:6px !important">'
												 +'<h6>Availability (hh:mm)</h6>'
											   //   +'<a href="" class="text-decoration-none font-weight-bold text-dark" id="availableHrs">0</a>'
												 +'<span class="text-decoration-none font-weight-bold text-dark" data-available-second="0" id="availableHrs">0</span>'
											+' </div>'
											+'<div class="bg-light-danger border-danger border p-2 rounded flex-grow-1 mx-2 mb-2" style="border-top-width:6px !important">'
												 +'<h6>Booked (hh:mm)</h6>'
											   //   +'<a href="" class="text-decoration-none font-weight-bold text-dark" id="occupiedHrs">0</a>'
											   +'<span class="text-decoration-none font-weight-bold text-dark" data-occupied-second="0" id="occupiedHrs">0</span>'
											+'</div>'

											+'<div class="bg-light-success border-success border p-2 rounded flex-grow-1 mx-2 mb-2" style="border-top-width:6px !important">'
												 +'<h6>Remaining (hh:mm)</h6>'
											   //   +'<a href="" class="text-decoration-none font-weight-bold text-dark" id="unoccupiedHrs">0</a>'
												 +'<span class="text-decoration-none font-weight-bold text-dark"  data-unoccupied-second="0" id="unoccupiedHrs">0</span>'
											+' </div>'
											+'<div class="bg-light-warning border-warning border p-2 rounded flex-grow-1 mx-2 mb-2" style="border-top-width:6px !important">'
												 +'<h6>Total Availability Not Given (hh:mm)</h6>'
											   //   +'<a href="" class="text-decoration-none font-weight-bold text-dark" id="remaining">0</a>'
												 +'<span class="text-decoration-none font-weight-bold text-dark"  data-remaining-second="0" id="remaining">0</span>'
											+'</div>'
									   +'</div>'
								  +'</div>'
								 
								  +'<div class="row">'
									   +'<div class="col-12 lead-table-wrapper mt-3 table-responsive" style="max-height: 70vh;">'
									//    
											+'<table class="table table-bordered font-12 border-radius-table border-0 table-hover scrollFixedTable " style="min-width: 1300px;width: 100%;" id="teacher-available-timelist">'
												 +'<thead style="position: sticky; top: 0; left: 0; z-index: 1;">'
													  +'<tr>'
														   +'<th class="bg-primary font-weight-bold text-white rounded-top-left-10 border-bottom-0" style="width:5% !important">S.No.</th>'
														   +'<th class="bg-primary font-weight-bold text-white border-bottom-0" style="width:25% !important">Teacher Name<br/>Grade | Course<br/>Country | TimeZone</th>'
														   +'<th class="bg-primary font-weight-bold text-white border-bottom-0" style="width:30% !important">Contract Hours = Live Class+Admin Task'
														   	// +'<br/>Student To be assign <span class="badge badge-dot badge-alternate" title="Student To be assign" style="border-radius: 0px;">Student To be assign</span> | '
															+'<br/>Assigned <span class="badge badge-dot badge-info" title="Assigned" style="border-radius: 0px;">Student Assigned</span> = 1:1 <span class="badge badge-dot badge-dark" title="1:1" style="border-radius: 0px;">1:1</span> + Group <span class="badge badge-dot" title="Group" style="border-radius: 0px;background-color: #ff059d;">Group</span>'
															+'</th>'
														   +'<th class="bg-primary font-weight-bold text-white border-bottom-0" style="width:10% !important">Availability<br/>live Class (hh:mm)</th>'
														   +'<th class="bg-primary font-weight-bold text-white border-bottom-0" style="width:5% !important">Booked<br/>(hh:mm)</th>'
														   +'<th class="bg-primary font-weight-bold text-white border-bottom-0" style="width:5% !important">Remaining<br/>(hh:mm)</th>'
														   +'<th class="bg-primary font-weight-bold text-white border-bottom-0" style="width:10% !important">Availability Not Given (hh:mm)</th>'//Day Wise | Total
														   +'<th class="bg-primary font-weight-bold text-white border-bottom-0" style="width:10% !important; border-radius: 0px 12px 0px 0px;">Submitted Zoom Hours (hh:mm)<br/><span class="daywisezoom">Day Wise | Total</span></th>'
														//    +'<th class="bg-primary font-weight-bold text-white border-bottom-0">Deducted Hours<br/>(hh:mm)</th>'
														//    +'<th class="bg-primary font-weight-bold text-white border-bottom-0 rounded-top-right-10">Accepted Hours<br/>(hh:mm)</th>'
													  +'</tr>'
												 +'</thead>'
												 +'<tbody class="teacher-time-body">'
													+'<tr class="td-border-design">'
															+'<td class="bold" style="border-width:1px;border-color:#eee; text-align:center;" colspan="10">No Record found</td>'
													+'</tr>'
												 +'</tbody>'
											+ '</table>'
									   + '</div>'
								  + '</div>'
							+ '</div>'
							+'<div id="for-scroll-to-fixed-height" style="height: 1500px;display: none;"></div>'
					   + '</div>'
				  + '</div>'
			 + '</div>'
		+ '</div>'
   + '</div>'
   +TeacherTimeAvailabilityPopup()
   +teacherTimeAvailabilityValidClassPopup()
   +teacherTimeAvailabilityBookClass()
   +teacherTimeAvailabilityAddPopup()
   +getStudentListPopup()
   +await dashboardFooter()
   +warningModelContent()
   +loaderContent()
   +recommendedTeacherlistModal()
   return html;
}

async function dashboardHeader(){
   var schoolSettingsLinks = await getSchoolSettingsLinks(SCHOOL_ID);
	var html=
	'<div class="sticky-header">'
		 +'<div class="app-header header-shadow">'
			  +'<div class="app-header__logo">'
				   +'<a href="'+schoolSettingsLinks.schoolWebsite+'" target="blank" class="logo-src" style="background:url('+schoolSettingsLinks.logoUrl+SCRIPT_VERSION+');"></a>'
			  +'</div>'
		 +'</div>'
	+'</div>';
	return html;
}

async function dashboardFooter(){
	var schoolSettingsTechnical = await getSchoolSettingsTechnical(SCHOOL_ID);
	var html=
	'<div class="app-wrapper-footer">'
	// 	 +'<div class="app-footer">'
	// 		  +'<div class="app-footer__inner">'
	// 			   +'<div class="col">'
	// 					+'<p style="margin: 0">'+schoolSettingsTechnical.copyrightYear+' © '+schoolSettingsTechnical.copyrightUrl+'</p>'
	// 			   +'</div>'
	// 	   +'</div>'
	//    +'</div>'
	   +'<div class="server-message">'
			  +'<span class="msg" id="msgTheme2"></span>'
		 +'</div>'
	+'</div>';
	return html;
}

function warningModelContent(){
	var html=
	'<div class="modal fade fade-scale" id="remarksresetDelete" tabindex="-1">'
	   +'<div class="modal-dialog modal-sm modal-dialog-centered box-shadow-none" role="document">'
		   +'<div class="modal-content text-center">'
			   +'<div class="modal-header pt-2 pb-2 bg-danger text-white justify-content-center">'
				   +'<h5 class="heading" id="warningMessage">Are you sure?</h5>'
			   +'</div>'
			   +'<div id="statusMessage-1" class="modal-body delete-modal">'
				   +'<i class="fa fa-times fa-4x text-danger"></i>'
			   +'</div>'
			   +'<div class="modal-footer">'
				   +'<div class="m-auto">'
					   +'<button id="resetDeleteErrorWarningYes" type="button" class="btn btn-outline-danger">Yes</button>'
					   +'<button id="resetDeleteErrorWarningNo" type="button" class="btn btn-danger" onclick="selfCloseModal(this, \'remarksresetDelete\');" >No</button>'
					   +'<button id="resetDeleteErrorWarningCancel" type="button" class="btn btn-success" data-dismiss="modal" style="">Close</button>'
				   +'</div>'
			   +'</div>'
		   +'</div>'
	   +'</div>'
   +'</div>';
	return html;
}

function loaderContent(){
   var html='<div id="commonloaderIdNewLoader" class="loader-wrapper d-flex justify-content-center align-items-center loader-style hide-loader">'
			   if(SCHOOL_ID == 1){
				   html+='<img src="'+PATH_FOLDER_IMAGE2+'loader-new.gif" alt="'+SCHOOL_NAME+' Loader" class="new-loader-2024" />'
			   }else{
				   html+='<div class="ball-rotate">'
						   +'<div style="background-color: rgb(247, 185, 36);"></div>'
					   +'</div>'
					   +'<p>Loading ...</p>';
			   }
		   html+=
	   '</div>';
   return html;
}

function teacherTimeAvailabilityValidClassPopup(){
	var html = '<div class="modal fade pr-0 right-slide-modal" id="teacherOccupiedClass" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">'
			+'<div class="modal-dialog modal-lg p-0 float-right">'
			  +'<div class="modal-content">'
				+'<div class="modal-header bg-primary py-2">'
				  +'<h5 class="modal-title text-white">Teacher Occupied Class</h5>'
				  +'<button type="button" class="close bg-white rounded-top-left-10 rounded-bottom-left-10 opacity-10 p-2" data-dismiss="modal" aria-label="Close" style="position: absolute;left:-32px;top:62px">'
					+'<span aria-hidden="true">&times;</span>'
				  +'</button>'
				+'</div>'
				+'<div class="modal-body overflow-auto">'
				  +'<div class="row">'
					+'<div class="col-12 overflow-auto">'
				   +'<table class="table table-bordered table-striped font-12 " style="min-width: 1000px;width: 100%;">'
						 +'<thead>'
						   +'<tr>'
							 +'<th>S.No.</th>'
							 +'<th>Class With</th>'
							 +'<th>Course Name</th>'
							 +'<th>Class Timings</th>'
						   +'</tr>'
						 +'</thead>'
						 +'<tbody class="tblTimeBookList">'
						  
						 +'</tbody>'
					   +'</table>'
					   // +'<div class="full text-right">'
					   //   +'<a href="javascript:void(0)" class="btn btn-success">Save</a>'
					   // +'</div>'
					 +'</div>'
				   +'</div>'
				 +'</div>'
			   //   +'<div class="modal-footer">'
			   //     +'<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'
			   //     +'<button type="button" class="btn btn-primary">Save changes</button>'
			   //   +'</div>'
			   +'</div>'
			 +'</div>'
		   +'</div>';
	return html;
}

function teacherTimeAvailabilityBookClass(){
	var html ='<div class="modal fade pr-0 right-slide-modal" id="bookAClassModal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">'
		   +'<div class="modal-dialog modal-lg p-0 float-right">'
			   +'<div class="modal-content">'
				   +'<div class="modal-header bg-primary py-2">'
					   +'<h5 class="modal-title text-white">Book A Class</h5>'
					   +'<button type="button" class="close bg-white rounded-top-left-10 rounded-bottom-left-10 opacity-10 p-2" data-dismiss="modal" aria-label="Close" style="position: absolute;left:-32px;top:62px">'
						   +'<span aria-hidden="true">&times;</span>'
					   +'</button>'
				   +'</div>'
				   +'<div class="modal-body overflow-auto">'
					   +'<div class="row">'
						   +'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-2">'
							   +'<label class="m-0">Create Class for</label>'
							   +'<select name="day" id="day" class="form-control"></select>'
						   +'</div>'
						   +'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-2">'
							   +'<label class="m-0">Type of Class</label>'
							   +'<select name="task" id="task" class="form-control">'
								   +'<option value="">One Day Class</option>'
								   +'<option value="">Parent Teacher Meeting</option>'
								   +'<option value="">Demo Class</option>'
								   +'<option value="">Custom</option>'
							   +'</select>'
						   +'</div>'
						   +'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-2">'
							   +'<label class="m-0">Grade</label>'
							   +'<select name="task" id="task" class="form-control"></select>'
						   +'</div>'
						   +'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-2">'
							   +'<label class="m-0">Student Name</label>'
							   +'<select name="studentName" id="studentName" class="form-control"></select>'
						   +'</div>'
						   +'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-2">'
							   +'<label class="m-0">Course Name</label>'
							   +'<select name="courseName" id="courseName" class="form-control"></select>'
						   +'</div>'
						   +'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-2">'
							   +'<label class="m-0">Start Time</label>'
							   +'<input type="text" class="form-control datepicker" name="meetingDate" id="meetingDate" autocomplete="off">'
						   +'</div>'
						   +'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-2">'
							   +'<label class="m-0">Start Time</label>'
							   +'<input type="text" class="form-control timepicker" name="statrTime" id="statrTime" autocomplete="off">'
						   +'</div>'
						   +'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-2">'
							   +'<label class="m-0">Duration <i>(mins)</i></label>'
							   +'<input type="text" class="form-control" value="50" name="duration" id="duration" disabled>'
						   +'</div>'
						   +'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-2 ml-auto text-right">'
							   +'<a href="javascript:void(0)" class="btn btn-primary" onclick="$(/"#validateClassModal/").modal(/"show/")">Validate Class</a>'
						   +'</div>'
					   +'</div>'
				   +'</div>'
			   +'</div>'
		   +'</div>'
	   +'</div>';
	return html;
}

function teacherTimeAvailabilityAddPopup(){
	var html = '<div class="modal fade pr-0 right-slide-modal" id="addAvailiblityModal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">'
		   +'<div class="modal-dialog modal-lg p-0 float-right">'
			   +'<div class="modal-content">'
				   +'<div class="modal-header bg-primary py-2">'
					   +'<h5 class="modal-title text-white">Add Availability</h5>'
					   +'<button type="button" class="close bg-white rounded-top-left-10 rounded-bottom-left-10 opacity-10 p-2" data-dismiss="modal" aria-label="Close" style="position: absolute;left:-32px;top:62px">'
						   +'<span aria-hidden="true">&times;</span>'
					   +'</button>'
				   +'</div>'
				   +'<div class="modal-body overflow-auto">'
					   +'<div class="row">'
						   +'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-2">'
							   +'<label class="m-0">Select a day</label>'
							   +'<select name="day" id="day" class="form-control">'
								   +'<option value="sun">Sunday</option>'
								   +'<option value="mon">Mondal</option>'
								   +'<option value="tue">Tuesday</option>'
								   +'<option value="wed">Wednesday</option>'
								   +'<option value="thr">Thursday</option>'
								   +'<option value="fri">Friday</option>'
								   +'<option value="sat">Saturday</option>'
							   +'</select>'
						   +'</div>'
						   +'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-2">'
							   +'<label class="m-0">Select a task</label>'
							   +'<select name="task" id="task" class="form-control">'
								   +'<option value="lc">Live Classes</option>'
								   +'<option value="at">Admin Task</option>'
							   +'</select>'
						   +'</div>'	
						   +'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-2">'
							   +'<label class="m-0">Start Time</label>'
							   +'<input type="text" class="form-control timepicker" name="statrTime" id="statrTime" autocomplete="off">'
						   +'</div>'
						   +'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-2">'
							   +'<label class="m-0">End Time</label>'
							   +'<input type="text" class="form-control timepicker" name="endTime" id="endTime" autocomplete="off">'
						   +'</div>'
						   +'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-2 ml-auto text-right">'
							   +'<a href="javascript:void(0)" class="btn btn-primary">ADD</a>'
							   +'<a href="javascript:void(0)" class="btn btn-outline-primary mr-2">Close</a>>'
						   +'</div>'
						   +'<div class="col-12 mt-2">'
							   +'<table class="table table-bordered font-12 border-radius-table border-0">'
								   +'<thead>'
									   +'<tr>'
										   +'<th class="bg-primary font-weight-bold text-white text-center rounded-top-left-10 border-bottom-0">Date & Time</th>'
										   +'<th class="bg-primary font-weight-bold text-white text-center border-bottom-0">Task Name</th>'
										   +'<th class="bg-primary font-weight-bold text-white text-center border-bottom-0">Slot</th>'
										   +'<th class="bg-primary font-weight-bold text-white text-center border-bottom-0">Total Time</th>'
										   +'<th class="bg-primary font-weight-bold text-white text-center border-bottom-0 rounded-top-right-10">Action</th>'
									   +'</tr>'
								   +'</thead>'
								   +'<tbody class="lead-table-css">'
									   +'<tr class="td-border-design">'
										   +'<td class="rounded-bottom-left-10 text-center" style="border-width: 1px;border-color:#eee">Sun May 19, 2024</td>'
										   +'<td class="text-center" style="border-width: 1px;border-color:#eee">Live Classes</td>'
										   +'<td class="text-center" style="border-width: 1px;border-color:#eee">'
											   +'<span class="p-1 mb-1 mr-1 text-center font-weight-semi-bold d-inline-block text-success border border-success rounded-5 font-10" data-teach-strtime="20:28:00" data-teach-entime="22:28:00">08:28 PM - 10:28 PM</span>'
										   +'</td>'
										   +'<td class="text-center" style="border-width: 1px;border-color:#eee">2h</td>'
										   +'<td class="text-center rounded-bottom-right-10" style="border-width: 1px;border-color:#eee">'
											   +'<a href="javascript:void(0)" class="ml-1 text-danger" tabindex="0"><i class="lnr-trash"></i></a>'
										   +'</td>'
									   +'</tr>'
								   +'</tbody>'
							   +'</table>'
							   +'<div class="full text-right">'
								   +'<a href="javascript:void(0)" class="btn btn-outline-success">Save</a>'
							   +'</div>'
						   +'</div>'
					   +'</div>'
				   +'</div>'
				   +'<div class="modal-footer">'
					   +'<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'
					   +'<button type="button" class="btn btn-primary">Save changes</button>'
				   +'</div>'
			   +'</div>'
		   +'</div>'
	   +'</div>';
	return html;
}

function TeacherTimeAvailabilityPopup(){
	var html = '<div class="modal fade pr-0 right-slide-modal safd" id="availiblityModal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">'
	   +'<div class="modal-dialog modal-xl p-0 float-right">'
		   +'<div class="modal-content">'
			   +'<div class="modal-header bg-primary py-2">'
					+'<h5 class="modal-title text-white w-100">'
						+'<span class="teacherNameClass">--</span>'
						+'<span class="d-inline-block ml-2 agreedHourLabel"></span>'
						+'<span class="timezoneWithOffset pull-right">--</span>'
					+'</h5>'
				   +'<button type="button" class="close bg-white rounded-top-left-10 rounded-bottom-left-10 opacity-10 p-2" data-dismiss="modal" aria-label="Close" style="position: absolute;left:-32px;top:62px">'
					   +'<span aria-hidden="true">&times;</span>'
				   +'</button>'
			   +'</div>'
			   +'<div class="modal-body overflow-auto">'
				   +'<div class="row">'
					   +'<div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 mb-2 mb-md-0 text-center text-md-left">'
						   +'<span class="slider-navigation"></span>'
					   +'</div>'
					   +'<div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 mb-2 mb-md-0 text-center text-md-right">'
						   // +'<a href="javascript:void(0)" class="btn btn-primary btn-sm blink-btn" onclick="$(/"#addAvailiblityModal/").modal(/"show")">ADD NEXT AVAILABILITY</a>'
					   +'</div>'
				   +'</div>'
				   +'<div class="slider-wrapper slick-slider-time-availiblity pt-4 timeOccupied">'
					   +'<div class="timeOccupiedCurrent overflow-auto"></div>'
					   +'<div class="timeOccupiedNext overflow-auto"></div>'
				   +'</div>'
			   +'</div>'
			   // +'<div class="modal-footer">'
			   // 	+'<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'
			   // 	+'<button type="button" class="btn btn-primary">Save changes</button>'
			   // +'</div>'
		   +'</div>'
	   +'</div>'
   +'</div>';  
  return html;
}

function recommendedTeacherlistModal(){
	var html = '<div class="modal fade pr-0 right-slide-modal" id="recommendedTeacherlistModal" tabindex="-1" role="dialog">'
	   +'<div class="modal-dialog modal-xl p-0 float-right">'
		   +'<div class="modal-content">'
			   +'<div class="modal-header bg-primary py-2">'
					+'<h5 class="modal-title text-white w-100">'
						+'Get Recommended Teachers'
					+'</h5>'
				    +'<button type="button" class="close bg-white rounded-top-left-10 rounded-bottom-left-10 opacity-10 p-2" data-dismiss="modal" aria-label="Close" style="position: absolute;left:-32px;top:62px">'
					   +'<span aria-hidden="true">&times;</span>'
				    +'</button>'
			   +'</div>'
			   +'<div class="modal-body overflow-y-auto">'
				    +'<form id="recommendedTeacherlistForm" class="full">'

					+'</form>'
				   +'<div class="row">'
				   		+'<div class="col-12">'
				   			+'<hr/>'
							+'<label class="m-0 full font-weight-bold mb-2 selected-student" style="display:none">Recommended Teachers for <span id="selectedStudentTime"></span></label>'
						+'</div>'
						+'<div class="col-12 overflow-y-auto" style="height:425px">'
							+'<table class="table table-bordered font-12 border-radius-table border-0 table-hover" id="recommendedTeachers" style="min-width: 1300px; width: 100%;table-layout:fixed" id="recommendedTeacherTable">'
								+'<thead>'
									+'<tr>'
										+'<th style="top:0;left:0;z-index:1;width:4%" class="position-sticky bg-primary font-weight-bold text-white rounded-top-left-10 border-bottom-0 ">S. No.</th>'
										+'<th style="top:0;left:0;z-index:1;width:12%" class="position-sticky bg-primary font-weight-bold text-white border-bottom-0">Course Name</th>'
										+'<th style="top:0;left:0;z-index:1;width:19%" class="position-sticky bg-primary font-weight-bold text-white border-bottom-0">Assigned Teacher</th>'
										+'<th style="top:0;left:0;z-index:1;width:18%" class="position-sticky bg-primary font-weight-bold text-white border-bottom-0">Selected Teacher</th>'
										+'<th style="top:0;left:0;z-index:1;width:47%" class="position-sticky bg-primary font-weight-bold text-white border-bottom-0 rounded-top-right-10">Available Teachers (Approximate hours based on matched time preferences are listed below).</th>'
									+'</tr>'
								+'</thead>'
								+'<tbody class="" style="max-height:420px;">'
									
								+'</tbody>'
							+'</table>'
						+'</div>'
						+'<div class="col-12 text-right mt-2 bulkUpdateBtnWrapper">'
				   			+'<a href="javascript:void(0)" class="btn btn-primary p-1 mr-1 disabled" onclick="saveAutoAssignTeacherRequest(\'recommendedTeacherlistForm\',0,0,0,\'true\')" >Update</a>'
							// +'<a href="javascript:void(0)" class="btn btn-danger p-1 disabled" onclick="resetAll()" >Remove</a>'
						+'</div>'
				   +'</div>'
			   +'</div>'
			   // +'<div class="modal-footer">'
			   // 	+'<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'
			   // 	+'<button type="button" class="btn btn-primary">Save changes</button>'
			   // +'</div>'
		   +'</div>'
	   +'</div>'
   +'</div>';  
  return html;
}

function recommendedTeacherTr(data, standardId){
	var tr=1;
	var html = '';
	var elementrySubjectID = [];
	if(standardId>10 && standardId<18){
		$.each(data, function(index,value){
			elementrySubjectID.push(value.subjectId);
		})
		getAllRecommendedTeacherBySubject(data[0].subjectId, "recommended"+data[0].subjectId+"", elementrySubjectID,0,data[0].assignedTeacher.teacherUserId);
		getTeacherTimeAvailable(data[0].assignedTeacher.teacherUserId,data[0].subjectId);
		html+= '<tr>'
			+'<td class="rounded-bottom-left-10" style="width:4%">'+(tr++)+'</td>';
			html+='<td style="width:12%" class="font-weight-semi-bold font-size-md">All Courses</td>'
			html+='<td class="assignedTeacherTd'+data[0].subjectId+'" style="width:19%">';
			if(data[0].assignedTeacher.teacherUserId!=0){	
				html+= '<div class="border bg-white rounded-5 w-100 mr-2 recommended-teacher-thumb" style="max-width:230px;min-width:230px;" id="clone-0-0'+data[0].subjectId+'" data-order="'+data[0].assignedTeacher.orderId+'">'
						+'<div class="card-body d-flex px-2 pt-2 align-items-center pb-0">'
							+'<span>'
								+'<img  width="42" class="rounded-circle user-header-img" src="'+data[0].assignedTeacher.profilePic+'" alt="">'
								+'<div class="custom-checkbox custom-control mt-3">'
									+'<input type="checkbox" id="0-0'+data[0].subjectId+'-checkbox" class="custom-control-input" onchange="selecteTeacher(\'clone-0-0'+data[0].subjectId+'\',\'0-0'+data[0].subjectId+'-checkbox\',\'update-and-reset-0-0'+data[0].subjectId+'\', \'selectedTeacherTd'+data[0].subjectId+'\')">'
									+'<label class="custom-control-label" for="0-0'+data[0].subjectId+'-checkbox" style="display:none">&nbsp;</label>'
								+'</div>'
							+'</span>'
							+'<div class="pl-2">'
								+'<div class="teacher-name font-weight-semi-bold font-size-md">'+data[0].assignedTeacher.teacherName+'</div>'
								+'<div class="teacher-timezone" style="word-break:break-all">'+data[0].assignedTeacher.timeZone+'</div>'
								+'<div class="teacher-availability">'
									// +'<span class="total-hour text-primary available-'+data[0].assignedTeacher.teacherUserId+'">'+data[0].assignedTeacher.availability+' | </span>'
									// +'<span class="total-hour text-success">'+data[0].assignedTeacher.remaining+' | </span>'
									// +'<span class="total-hour text-danger">'+data[0].assignedTeacher.booked+'</span>'
									
									+'<span class="total-hour text-primary available-'+data[0].assignedTeacher.teacherUserId+'">'+data[0].assignedTeacher.availability+'</span> | '
									+'<span class="total-hour text-success remaining-'+data[0].assignedTeacher.teacherUserId+'">'+data[0].assignedTeacher.remaining+'</span> | '
									+'<span class="total-hour text-danger booked-'+data[0].assignedTeacher.teacherUserId+'">'+data[0].assignedTeacher.booked+'</span>'
								+'</div>'
								// +'<div>'
								// 	+'<div class="Stars d-flex align-items-center" style="--rating: '+data[0].assignedTeacher.rating+'"><span class="font-11 pt-1">'+data[0].assignedTeacher.rating+'</span></div>'
								// +'</div>'
								+'<div class="mb-2">'
									+'<a href="javascript:void(0)" class="btn btn-sm btn-primary p-1 mt-1" style="font-size:11px; font-weight:300px;line-height:1" onclick="viewWeeklyTimeDetails(\''+data[0].assignedTeacher.teacherName+'\', \''+data[0].assignedTeacher.teacherUserId+'\',\''+data[0].subjectId+'\');">View Weekly Calendar</a>'
									+'<a href="javascript:void(0)" class="btn btn-sm btn-success p-1 mt-1 sendMail" id="send-0-0'+data[0].subjectId+'" style="font-size:11px; font-weight:300px;line-height:1" onclick="sendMailFromAutoTeacherAssign(\'0\')">Send Mail</a>'
								+'</div>'
							+'</div>'
							// +'<div class="ml-auto">'
							// 	+'<div class="custom-checkbox custom-control">'
							// 		+'<input type="checkbox" id="0-0'+data[0].subjectId+'-checkbox" class="custom-control-input" onchange="selecteTeacher(\'clone-0-0'+data[0].subjectId+'\',\'0-0'+data[0].subjectId+'-checkbox\',\'update-and-reset-0-0'+data[0].subjectId+'\', \'selectedTeacherTd'+data[0].subjectId+'\')">'
							// 		+'<label class="custom-control-label" for="0-0'+data[0].subjectId+'-checkbox" style="display:none">&nbsp;</label>'
							// 	+'</div>'
							// +'</div>'
						+'</div>'
					+'<div class="full text-center pb-2" id="update-and-reset-0-0'+data[0].subjectId+'" style="display:none">'
						+'<a href="javascript:void(0)" class="btn btn-sm btn-primary p-1 mr-1" style="font-size:11px; font-weight:300px;line-height:1" onclick="assignTeacher(\'clone-0-0'+data[0].subjectId+'\',\'0-0'+data[0].subjectId+'-checkbox\',\'update-and-reset-0-0'+data[0].subjectId+'\', \'assignedTeacherTd'+data[0].subjectId+'\', \'selectedTeacherTd'+data[0].subjectId+'\', \'recommended'+data[0].subjectId+'\',\''+data[0].subjectId+'\', \''+data[0].assignedTeacher.teacherUserId+'\',\''+elementrySubjectID+'\',\'send-0-0'+data[0].subjectId+'\')">Update</a>'
						+'<a href="javascript:void(0)" class="btn btn-sm btn-danger p-1" style="font-size:11px; font-weight:300px;line-height:1" onclick="reset(\'clone-0-0'+data[0].subjectId+'\',\'0-0'+data[0].subjectId+'-checkbox\',\'update-and-reset-0-0'+data[0].subjectId+'\', \'recommended'+data[0].subjectId+'\', \'selectedTeacherTd'+data[0].subjectId+'\',\'""\',\'send-0-0'+data[0].subjectId+'\')">Remove</a>'
					+'</div>'
				+'</div>';
			}else{
				html+='<div class="card-body d-flex px-2 pt-2 align-items-center pb-0">Teacher Not Assigned</div>';
			}
			html+='</td>'
			+'<td class="selectedTeacherTd'+data[0].subjectId+'" style="width:18%">'
				+'<span class="blankText font-weight-semi-bold font-size-md">Teacher Not Selected</span>'
			+'</td>'
			+'<td class="rounded-bottom-right-10 overflow-x-auto" style="width:47%">'
				+'<div class="full">'
					+'<div class="d-flex recommended'+data[0].subjectId+'">'
						+'<div class="loader-wrapper d-flex justify-content-center align-items-center"><div class="loader">Getting best results...'
						+'<div class="line-scale"><div></div><div></div><div></div><div></div><div></div></div></div> </div>';
						
					html+='</div>'
				+'</div>'
			+'</td>'
		+'</tr>';
	}
	else{
		$.each(data, function(i,v){
			getAllRecommendedTeacherBySubject(v.subjectId, "recommended"+v.subjectId+"","",i, v.assignedTeacher.teacherUserId);
			getTeacherTimeAvailable(v.assignedTeacher.teacherUserId,v.subjectId);
			html+= '<tr>'
				+'<td class="rounded-bottom-left-10" style="width:4%">'+(tr++)+'</td>'
				+'<td style="width:12%" class="font-weight-semi-bold font-size-md subject-name-'+v.subjectId+'">'+v.subjectName+'<input type="hidden" class="form-control subjectId" id="hiddenSubjectId" name="hiddenSubjectId" value="'+v.subjectId+'"/></td>'
				+'<td class="assignedTeacherTd'+v.subjectId+'" style="width:19%">';
				
				if(v.assignedTeacher.teacherUserId!=0){	
					html+= '<div class="border bg-white rounded-5 w-100 mr-2 recommended-teacher-thumb" style="max-width:230px;min-width:230px;" id="clone-0-0'+v.subjectId+'" data-order="'+v.assignedTeacher.orderId+'">'
						+'<div class="card-body d-flex px-2 pt-2 align-items-center pb-0">'
							+'<span>'
								+'<img  width="42" class="rounded-circle user-header-img" src="'+v.assignedTeacher.profilePic+'" alt="">'
								+'<div class="custom-checkbox custom-control mt-3">'
									+'<input type="checkbox" id="0-0'+v.subjectId+'-checkbox" class="custom-control-input" onchange="selecteTeacher(\'clone-0-0'+v.subjectId+'\',\'0-0'+v.subjectId+'-checkbox\',\'update-and-reset-0-0'+v.subjectId+'\', \'selectedTeacherTd'+v.subjectId+'\')">'
									+'<label class="custom-control-label" for="0-0'+v.subjectId+'-checkbox" style="display:none">&nbsp;</label>'
								+'</div>'
							+'</span>'
							+'<div class="pl-2">'
								+'<div class="teacher-name font-weight-semi-bold font-size-md">'+v.assignedTeacher.teacherName+'</div>'
								+'<div class="teacher-timezone" style="word-break:break-all">'+v.assignedTeacher.timeZone+'</div>'
								+'<div class="teacher-availability">'
									+'<span class="total-hour text-primary available-'+v.assignedTeacher.teacherUserId+'">'+v.assignedTeacher.availability+'</span> | '
									+'<span class="total-hour text-success remaining-'+v.assignedTeacher.teacherUserId+'">'+v.assignedTeacher.remaining+'</span> | '
									+'<span class="total-hour text-danger booked-'+v.assignedTeacher.teacherUserId+'">'+v.assignedTeacher.booked+'</span>'
								+'</div>'
								// +'<div>'
								// 	+'<div class="Stars d-flex align-items-center" style="--rating: '+v.assignedTeacher.rating+'"><span class="font-11 pt-1">'+v.assignedTeacher.rating+'</span></div>'
								// +'</div>'
								+'<div class="mb-2">'
									+'<a href="javascript:void(0)" class="btn btn-sm btn-primary p-1 mt-1" style="font-size:11px; font-weight:300px;line-height:1" onclick="viewWeeklyTimeDetails(\''+v.assignedTeacher.teacherName+'\', \''+v.assignedTeacher.teacherUserId+'\',\''+v.subjectId+'\')">View Weekly Calendar</a>'
									+'<a href="javascript:void(0)" class="btn btn-sm btn-success p-1 mt-1 sendMail" id="send-0-0'+v.subjectId+'"  style="font-size:11px; font-weight:300px;line-height:1;" onclick="sendMailFromAutoTeacherAssign('+v.subjectId+')">Send Mail</a>'
								+'</div>'
							+'</div>'
							// +'<div class="ml-auto">'
							// 	+'<div class="custom-checkbox custom-control">'
							// 		+'<input type="checkbox" id="0-0'+v.subjectId+'-checkbox" class="custom-control-input" onchange="selecteTeacher(\'clone-0-0'+v.subjectId+'\',\'0-0'+v.subjectId+'-checkbox\',\'update-and-reset-0-0'+v.subjectId+'\', \'selectedTeacherTd'+v.subjectId+'\')">'
							// 		+'<label class="custom-control-label" for="0-0'+v.subjectId+'-checkbox" style="display:none">&nbsp;</label>'
							// 	+'</div>'
							// +'</div>'
						+'</div>'
						+'<div class="full text-center pb-2" id="update-and-reset-0-0'+v.subjectId+'" style="display:none">'
							+'<a href="javascript:void(0)" class="btn btn-sm btn-primary p-1 mr-1" style="font-size:11px; font-weight:300px;line-height:1" onclick="assignTeacher(\'clone-0-0'+v.subjectId+'\',\'0-0'+v.subjectId+'-checkbox\',\'update-and-reset-0-0'+v.subjectId+'\', \'assignedTeacherTd'+v.subjectId+'\', \'selectedTeacherTd'+v.subjectId+'\', \'recommended'+v.subjectId+'\',\''+v.subjectId+'\', \''+v.assignedTeacher.teacherUserId+'\',\'send-0-0'+v.subjectId+'\')">Update</a>'
							+'<a href="javascript:void(0)" class="btn btn-sm btn-danger p-1" style="font-size:11px; font-weight:300px;line-height:1" onclick="reset(\'clone-0-0'+v.subjectId+'\',\'0-0'+v.subjectId+'-checkbox\',\'update-and-reset-0-0'+v.subjectId+'\', \'recommended'+v.subjectId+'\', \'selectedTeacherTd'+v.subjectId+'\',\'""\',\'send-0-0'+v.subjectId+'\')">Remove</a>'
						+'</div>'
					+'</div>';
					}else{
						html+='<div class="card-body d-flex px-2 pt-2 align-items-center pb-0">Teacher Not Assigned</div>';
					}
					html+='</td>'
				+'<td class="selectedTeacherTd'+v.subjectId+'" style="width:18%">'
					+'<span class="blankText font-weight-semi-bold font-size-md">Teacher Not Selected</span>'
					+'<input type="hidden" class="form-control selectedTeacherUserId" id="selectedTeacherUserId-'+i+'" name="selectedTeacherUserId-'+i+'" value="" />'
				+'</td>'
				+'<td class="rounded-bottom-right-10 overflow-x-auto" style="width:47%">'
				+'<div class="recommended-total-'+v.subjectId+'"></div>'
					+'<div class="full">'
						+'<div class="d-flex recommended'+v.subjectId+'">'
							+'<div class="loader-wrapper d-flex justify-content-center align-items-center"><div class="loader">Getting best results... '
							+'<div class="line-scale"><div></div><div></div><div></div><div></div><div></div></div></div> </div>';
							
						html+='</div>'
					+'</div>'
				+'</td>'
			+'</tr>';
		});
	}
	return html;
}

function recommendedTeacherBySubjectTr(data, subjectId, elementrySubjectID,uppderIndex, teacherUserId){
	var tr=0;
	var html = '';
		$.each(data.recommendedTeachers, function(index, value){
			if(value.teacherUserId!=teacherUserId){
				
				html+='<div class="border bg-white rounded-5 w-100 mr-2 recommended-teacher-thumb" style="max-width:230px;min-width:230px;" id="clone-'+value.teacherId+"-"+index+subjectId+'" data-order="'+value.orderId+'">'
						+'<div class="card-body d-flex px-2 pt-2 align-items-center pb-0">'
							+'<span>'
								+'<img  width="42" class="rounded-circle user-header-img" src="'+value.profilePic+'" alt="">'
								+'<div class="custom-checkbox custom-control mt-3">'
									+'<input type="checkbox" id="'+value.teacherId+"-"+index+subjectId+'-checkbox" class="custom-control-input" onchange="selecteTeacher(\'clone-'+value.teacherId+"-"+index+subjectId+'\',\''+value.teacherId+"-"+index+subjectId+'-checkbox\',\'update-and-reset-'+value.teacherId+"-"+index+subjectId+'\', \'selectedTeacherTd'+subjectId+'\',\''+value.teacherUserId+'\','+uppderIndex+')">'
									+'<label class="custom-control-label" for="'+value.teacherId+"-"+index+subjectId+'-checkbox">&nbsp;</label>'
								+'</div>'
							+'</span>'
							+'<div class="pl-2">'
								+'<div class="teacher-name font-weight-semi-bold font-size-md">'+value.teacherName+'</div>'
								+'<div class="teacher-timezone" style="word-break:break-all">'+value.timeZone+'</div>'
								+'<div class="teacher-availability">'
									+'<span class="total-hour text-primary available-'+value.teacherUserId+'">'+value.availability+' | </span>'
									+'<span class="total-hour text-success remaining-'+value.teacherUserId+'">'+value.remaining+' | </span>'
									+'<span class="total-hour text-danger booked-'+value.teacherUserId+'">'+value.booked+'</span>'
								+'</div>'
								// +'<div>'
								// 	+'<div class="Stars d-flex align-items-center" style="--rating: '+value.rating+'"><span class="font-11 pt-1">'+value.rating+'</span></div>'
								// +'</div>'
								+'<div class="mb-2">'
									+'<a href="javascript:void(0)" class="btn btn-sm btn-primary p-1 mt-1" style="font-size:11px; font-weight:300px;line-height:1" onclick="viewWeeklyTimeDetails(\''+value.teacherName+'\', \''+value.teacherUserId+'\',\''+subjectId+'\')">View Weekly Calendar</a>'
									+'<a href="javascript:void(0)" class="btn btn-sm btn-success p-1 mt-1 sendMail" id="send-0-0'+value.teacherId+"-"+index+subjectId+'" style="font-size:11px; font-weight:300px;line-height:1;display:none" onclick="sendMailFromAutoTeacherAssign(\''+subjectId+'\')">Send Mail</a>'
								+'</div>'
							+'</div>'
							// +'<div class="ml-auto">'
							// 	+'<div class="custom-checkbox custom-control">'
							// 		+'<input type="checkbox" id="'+value.teacherId+"-"+index+subjectId+'-checkbox" class="custom-control-input" onchange="selecteTeacher(\'clone-'+value.teacherId+"-"+index+subjectId+'\',\''+value.teacherId+"-"+index+subjectId+'-checkbox\',\'update-and-reset-'+value.teacherId+"-"+index+subjectId+'\', \'selectedTeacherTd'+subjectId+'\',\''+value.teacherUserId+'\','+uppderIndex+')">'
							// 		+'<label class="custom-control-label" for="'+value.teacherId+"-"+index+subjectId+'-checkbox">&nbsp;</label>'
							// 	+'</div>'
							// +'</div>'
						+'</div>'
						+'<div class="full text-center pb-2" id="update-and-reset-'+value.teacherId+"-"+index+subjectId+'" style="display:none">'
							+'<a href="javascript:void(0)" class="btn btn-sm btn-primary p-1 mr-1" style="font-size:11px; font-weight:300px;line-height:1" onclick="assignTeacher(\'clone-'+value.teacherId+"-"+index+subjectId+'\',\''+value.teacherId+"-"+index+subjectId+'-checkbox\',\'update-and-reset-'+value.teacherId+"-"+index+subjectId+'\', \'assignedTeacherTd'+subjectId+'\', \'selectedTeacherTd'+subjectId+'\', \'recommended'+subjectId+'\',\''+subjectId+'\', \''+value.teacherUserId+'\', \''+elementrySubjectID+'\',\'send-0-0'+value.teacherId+"-"+index+subjectId+'\')">Update</a>'
							+'<a href="javascript:void(0)" class="btn btn-sm btn-danger p-1 3" style="font-size:11px; font-weight:300px;line-height:1" onclick="reset(\'clone-'+value.teacherId+"-"+index+subjectId+'\',\''+value.teacherId+"-"+index+subjectId+'-checkbox\',\'update-and-reset-'+value.teacherId+"-"+index+subjectId+'\', \'recommended'+subjectId+'\', \'selectedTeacherTd'+subjectId+'\',\'selectedTeacherUserId-'+uppderIndex+'\',\'send-0-0'+value.teacherId+"-"+index+subjectId+'\')">Remove</a>'
						+'</div>'
					+'</div>'
					tr=tr+1;
				}
			});
			$(".recommended-total-"+subjectId).html(tr+ " Teachers found");
	return html;
}

function recommendedTeacherlistFilterForm(){
	var html = '<div class="row">'
					+'<div class="col-xl-5 col-lg-5 col-md-6 col-sm-12 col-12 mb-2">'
						+'<label class="m-0 font-weight-bold">Student Name</label>'
						+'<input type="hidden" class="form-control" id="standardIdInput" name="standardIdInput"  />'
						+'<input type="hidden" class="form-control" id="studentStandardId" name="studentStandardId"  />'
						+'<input type="hidden" class="form-control" id="studentUserId" name="studentUserId"  />'
						+'<input type="text" class="form-control" id="typeahead" name="typeahead" placeholder="Search by Student Name or student ID" />'
					+'</div>'
					+'<div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 mb-2 flex-column align-items-center gradeAndLearningProgram" style="display:none">'
						+'<label class="m-0 full font-weight-bold">Grade | Learning program | LMS Platform</label>'
						+'<div class="mt-2 text-left w-100"><label class="m-0" id="gradeName"></label> | <label class="m-0" id="enrollDetails"></label></div>'
					+'</div>'
					+'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12 mb-2">'
						+'<label class="m-0 font-weight-bold">Course Name</label>'
						+'<select class="form-control" id="courseName" name="courseName"></select>'
					+'</div>'
				+'</div>'
				+'<div class="row">'
					+'<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">'
						+'<label class="m-0 font-weight-bold">Add Student Preference (You can add upto 3 preferences)</label>'
					+'</div>'
					+'<div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-6 mb-2">'
						+'<label class="m-0 full">&nbsp;</label>'
						+'<select class="form-control" id="addPreferenceStartTime"><option></option></select>'
					+'</div>'
					+'<div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-6 mb-2">'
						+'<label class="m-0 full">&nbsp;</label>'
						+'<select class="form-control" id="addPreferenceEndTime" disabled><option></option></select>'
					+'</div>'
					+'<span class="d-inline-block">'
						+'<label class="m-0 full">&nbsp;</label>'
						+'<a href="javascript:void(0)" class="btn btn-primary btn-lg p-2" onclick="addTimePreference(\'addPreferenceStartTime\',\'addPreferenceEndTime\')"><i class="fa fa-plus"></i></a>'
					+'</span>'
					+'<div class="d-inline-block" id="timePreferenceSlotWrapper"><span id="notSlotAdd" class="d-inline-block position-relative font-weight-bold" style="top:30px">No Time Preference Added.</span></div>'
					+'<span class="d-block ml-auto pr-3">'
						+'<label class="m-0 full">&nbsp;</label>'
						+'<a href="javascript:void(0)" class="btn btn-success mr-1" onclick="recommendedTeachersResetForm();">Reset</a>'
						+'<a href="javascript:void(0)" class="btn btn-primary" onclick="getAllRecommendedTeacher(\'recommendedTeacherlistForm\');">Get Available Teachers</a>'
					+'</span>'
				+'</div>';  
  return html;
}

function recommendedTeacherAvailabilityModal(data){
	var html = 
			'<div class="modal fade" id="recommendedTeacherAvailabilityModal" tabindex="-1" role="dialog" aria-modal="true" >'
				+'<div class="modal-dialog h-auto modal-dialog-centered modal-xl" role="document" style="box-shadow:none !important">'
					+'<div class="modal-content h-auto">'
						+'<div class="modal-header bg-primary py-2 align-items-center">'
							+'<h6 class="modal-title text-white font-weight-semi-bold teacherName" data-teacherUserId=""></h6>'
							// +'<p class="modal-title text-white flex-grow-1 m-0 text-right">This calendar is for display purpose only</p>'
							+'<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">'
								+'<span aria-hidden="true">&times;</span>'
							+'</button>'
						+'</div>'
						+'<div class="modal-body">'
							+recommendedTeacherAvailabilityModalBody(data)
						+'</div>'
						+'<div class="modal-footer justify-content-between">'
							+'<p class="font-dark font-weight-bold m-0">**All slots are in the '+data.timeZoneName+' timezone</p>'
							+'<p class="font-dark font-weight-bold m-0"><span class="bg-success d-inline-block rounded-circle" style="width:8px;height:8px;"></span> Available &nbsp;<span class="bg-danger d-inline-block rounded-circle" style="width:8px;height:8px;"></span> Booked &nbsp;<span class="d-inline-block rounded-circle" style="width:8px;height:8px;background:#d6d3d3"></span> Not Available</p>'
							+'<p class="font-dark font-weight-bold m-0 invisible">**All slots are in the '+data.timeZoneName+' timezone</p>'
						+'</div>'
					+' </div>'
				+'</div>'
			+'</div>';
		return html;
}

function recommendedTeacherAvailabilityModalBody(data){
	var possibleMatchFlag = false;
	var i=0;
	var k=0;
	var hourCount = 0;
	var listSize=data.teacherWeeklyTimeCurrLiveClass.teacherAssignTimeWeekList.length;
	var html=
		'<div class="recommendedTeacher-availability-slider w-100 position-relative">'
			+'<button class="slick-prev slick-arrow" aria-label="Previous" type="button" aria-disabled="true" style="" onclick="prevWeeklyTimeDetails(\''+data.previousDateOfWeekFirstDay+'\')">Previous</button>'
			+'<button class="slick-next slick-arrow" aria-label="Previous" type="button" aria-disabled="true" style="" onclick="nextWeeklyTimeDetails(\''+data.nextDateOfWeekLasttDay+'\')">Next</button>'
			+'<div class="overflow-y-auto" style="height:425px">'
				+'<table class="table font-12 border-0">'
					+'<thead>'
						+'<tr>';
							while(i<=listSize-1){
								$.each(data.teacherWeeklyTimeCurrLiveClass.teacherAssignTimeWeekList[i].teacherAllDataInOneList, function(index, value){
									
									var date =  value.displayStartDate.split(",");
									date = date[0].split(" ");
									var dateText = date[1]+" "+date[2];
									var dayName = date[0]
									html+='<td class="px-1 py-2 border-0 position-sticky" style="top:0;left:0;z-index:1; background:#f3f3f3">'
										+'<div class="font-weight-bold text-center font-12" style="line-height:1">'+dateText+'</div>'
										+'<div class="text-center font-12" style="line-height:1">'+dayName+'</div>'
									+'</td>'
								});
								i++;
							}
						html+='</tr>'
					+'</thead>'
					+'<tbody>'
						+'<tr>';
							while(k<=listSize-1){ 
								$.each(data.teacherWeeklyTimeCurrLiveClass.teacherAssignTimeWeekList[k].teacherAllDataInOneList, function(index, value){
									html+='<td class="border-0 vertical-align-top">';
									var isPastDate = checkdateIsPastOrNot(value.displayStartDateWithoutDay);
											if(value.dayWiseAllData.length>0){
												$.each(value.dayWiseAllData, function(i, v){
													if(v.status=="Booked"){
														html+='<div class="d-flex align-items-center"><div class="border rounded-5 px-2 py-1 mb-1 text-center ml-4" style="width:fit-content;'+(isPastDate? "background:#f5f5f5;color:#c0c0c0;border-color:#c0c0c0 !important":"background:#ffd6d6;color:#ff0000;border-color:#ff0000 !important")+'">'+v.displayStartTime+' - '+v.displayEndTime+'</div></div>';
													}else if(v.status=="Available" && v.timerange == "outside"){
														html+='<div class="d-flex align-items-center"><div class="border rounded-5 px-2 py-1 mb-1 text-center ml-4" style="width:fit-content;'+(isPastDate? "background:#f5f5f5;color:#c0c0c0;border-color:#c0c0c0 !important":"background:#d7f1d6;color:#06a700;border-color:#06a700 !important")+'">'+v.displayStartTime+' - '+v.displayEndTime+'</div></div>';
													}else{
														if(!isPastDate){
															possibleMatchFlag = true;
															hourCount++;
														}else{
															possibleMatchFlag = false;
														}
														html+='<div class="d-flex align-items-center"><div class="border rounded-5 px-2 py-1 mb-1 text-center ml-4 " style="width:fit-content;'+(isPastDate? "background:#f5f5f5;color:#c0c0c0;border-color:#c0c0c0 !important":"background:#d7f1d6;color:#06a700;border-color:#06a700 !important;border-width:2px !important;font-weight:bold")+'">'+v.displayStartTime+' - '+v.displayEndTime+' </div> '+(isPastDate? '':'<i class="fa fa-check text-primary ml-1"></i>')+'</div>';
													}
												});
											}
											// if(value.timeUnOccupied.length>0){
											// 	$.each(value.timeUnOccupied, function(i, v){
											// 		html+='<div class="border rounded-5 px-2 py-1 mb-1 mx-auto" style="width:fit-content;'+(isPastDate? "background:#f5f5f5;color:#c0c0c0;border-color:#c0c0c0 !important":"background:#d7f1d6;color:#06a700;border-color:#06a700 !important")+'">'+v.displayStartTime+' - '+v.displayEndTime+'</div>';
											// 	});
											// }
											if(value.dayWiseAllData.length<1){
												html+='<div class="rounded-5 px-2 py-1 mb-1 mx-auto text-center" style="width:129px; color:#c0c0c0">----</div>';
											}
									html+='</td>'
								});
								k++;
							}
						html+='</tr>'
					+'</tbody>'
				+'</table>'
			+'</div>';
			if(possibleMatchFlag){
				html+='<div class="font-weight-bold py-2 d-flex align-items-center justify-content-center"><i class="fa fa-check text-primary mr-1"></i> <span> '+hourCount+' possible matches ('+hourCount+' hrs) have been found for the selected preference from '+data.teacherWeeklyTimeCurrLiveClass.teacherAssignTimeWeekList[0].weeklyStartDateStandardFormat+' to '+data.teacherWeeklyTimeCurrLiveClass.teacherAssignTimeWeekList[0].weeklyEndDateStandardFormat+'</span></div>';
			}
		html+='</div>';
	return html;
}



function timePreferenceSlots(slotList){
	var html = '';
		$.each(slotList, function(i, v){
			html+='<span class="d-inline-block ml-2 selectedPreferenceSlot" id="selectedPreferenceSlot'+i+'" startTime="'+v.startTime+'" endTime="'+v.endTime+'">'
					+'<div class="m-0 font-weight-bold">Preference '+(i+1)+'</div>'
					+'<label class="bg-light-primary text-primary rounded-5 d-inline-block p-1 border border-primary px-2">'
						+'<span class="d-inline-block startTimeText">'+v.startTime+'</span> - <span class="d-inline-block endTimeText">'+v.endTime+'</span>'
						+'<a href="javascript:void(0)" class="d-inline-block bg-white text-danger p-1 border border-danger ml-1 rounded-5" style="line-height:14px" onclick="removeSelectTimeSlot(\'selectedPreferenceSlot'+i+'\')"><i class="fa fa-times"></i></a>'
					+'</label>'
				+'</span>';
		});
	return html;
}

function getTeacherCurrentAvailability(weekDataList){
   //console.log(weekDataList);
   var html='';
   $.each(weekDataList.teacherAssignTimeWeekList, function (keyweek, valueweek) {
	   html+='<div class="full">'
		   +'<table class="table mb-0 table-bordered font-12 border-0" style="width: 100%;min-width: 940px;">'
			   +'<tbody>';
			   		if(keyweek == 0){
						html+='<tr>'
							+'<td class="border-0 p-0">&nbsp;</td>'
							+'<td class="border-0 p-0">'
								+'<table class="table roop-table mb-0 border-radius-table border-0">'
									+'<tbody>'
										+'<tr>'
											+'<td colspan="2" class="border-0" style="width:30%">'
												+'<h5>'+weekDataList.reportStartEndDate+'</h5>'
											+'</td>'
											+'<td class="border-0 text-center" style="width:calc(18% + 83px)">'
												+'<div class="bg-light-primary border-primary border p-1 rounded flex-grow-1 mx-2 mb-2" style="border-top-width:6px !important">'
													+'<h6 class="m-0" style="font-size:14px">Total Availability Given (hh:mm)<br/><span class="text-decoration-none font-weight-bold text-dark" id="availableHrs">'+weekDataList.totalTimeHrs+'</span></h6> '
												+'</div>'
											+'</td>'
											+'<td class="border-0 text-center" style="width:calc(18% + 83px)">'
												+'<div class="bg-light-danger border-danger border p-1 rounded flex-grow-1 mx-2 mb-2" style="border-top-width:6px !important">'
													+'<h6 class="m-0" style="font-size:14px">Total Availability Occupied (hh:mm)<br/><span class="text-decoration-none font-weight-bold text-dark" id="occupiedHrs">'+weekDataList.totalTimeOcupHrs+'</span></h6>'
												+'</div>'
											+'</td>'
											+'<td class="border-0 text-center" style="width:calc(18% + 83px)">'
												+'<div class="bg-light-success border-success border p-1 rounded flex-grow-1 mx-2 mb-2" style="border-top-width:6px !important">'
													+'<h6 class="m-0" style="font-size:14px">Total Availability Unoccupied (hh:mm)<br/><span class="text-decoration-none font-weight-bold text-dark" id="unoccupiedHrs">'+weekDataList.totalTimeUnOcupHrs+'</span></h6> '
												+'</div>'
											+'</td>'
										+'</tr>'
									+'</tbody>'
								+'</table>'
							+'</td>'
						+'</tr>';
					}
					
				    html+='<tr>'
				   		+'<td rowspan="5" class="font-weight-semi-bold bg-dark text-white font-size-lg position-relative availability-week-row rounded-top-left-10 rounded-bottom-left-10 border-0">'
						   +'<span class="availability-week">WEEK ' + (keyweek + 1) + '</span>'
					   +'</td>'
					   +'<td class="border-0 p-0">'
						   +'<table class="table roop-table mb-0 border-radius-table border-0" style="'+(valueweek.weeklyTime!=null?"table-layout:fixed":"")+'">'
							   +'<thead>'
							   +'<tr class="text-white">'
								   +'<th valign="middle" class="bg-primary" style="width: 15%;border-width: 0;">Day &amp; Date</th>'
								   +'<th valign="middle" class="bg-primary" style="width: 15%;border-width: 0;">Task Name</th>'
								   +'<th valign="middle" class="text-right bg-primary" style="border-width: 0;width: 18% !important;">Availability Given</th>'
								   +'<th valign="middle" class="text-left bg-primary availability-total-hour-th" style="border-width: 0;width: 83px !important;">Total Hour</th>'
								   +'<th valign="middle" class="text-right bg-primary" style="border-width: 0;width: 18% !important;">Availability Occupied</th>'
								   +'<th valign="middle" class="text-left bg-primary availability-total-hour-th" style="border-width: 0;width: 83px !important;">Total Hour</th>'
								   +'<th valign="middle" class="text-right bg-primary" style="border-width: 0;width: 18% !important;">Availability Unoccupied</th>'
								   +'<th valign="middle" class="text-left bg-primary availability-total-hour-th" style="border-width: 0;width: 83px !important;">Total Hour</th>'
							   +'</tr>'
							   +'</thead>'
							   +'<tbody>';
							   if(valueweek.weeklyTime!=null){
								   $.each(valueweek.weeklyTime, function (keysingle, itemsingle) {
									var startdateid=itemsingle.startDate.toString().replace("-","");
								   	html+='<tr>'
									   +'<td class="bg-primary cursor text-center px-0 expandable-row border-right-0 border-left-0 border-bottom">'
										   +'<div class="squeezed-details text-white">' + itemsingle.displayStartDate + '&nbsp;<i class="fa fa-angle-down"></i></div>'
										   +'<div class="expandable-details">' + itemsingle.displayStartDate + '&nbsp;<i class="fa fa-angle-up"></i></div>'
									   +'</td>'
									   +'<td class="vertical-align-top border-right-0 border-left-0 border-bottom p-0" colspan="2">'
										   +'<div class="squeezed-details font-weight-semi-bold text-primary">'
											   +'<table class="table roop-table mb-0">'
												   +'<tbody>'
													   +'<tr>'
														   +'<td class="border-0" style="width:43%">';
														   		var sltType= itemsingle.slotType;
																const sltArray = sltType.split(",");
														   		if(itemsingle.dayCheck == "N"){
																	sltType= "";
																}
															   if(sltArray.length>1){
																   for (let ins = 0; ins < sltArray.length; ins++) {
																	   const elSlt = sltArray[ins];
																	   html += elSlt+"<br/>";
																   }
															   }else{
																   html += sltType;
															   }
															   
														   html += '</td>'
														   +'<td class="text-right border-0" style="width:57%">';
														   		if(itemsingle.dayCheck != "N"){
																	$.each(itemsingle.teacherPreferTime, function (keyslot, valueslot) {
																		if(keyslot==0){
																			var border = valueslot.entityId>0?'btn-dashed':'border';
																			html += '<span class="p-1 mb-1 mr-1 text-center font-weight-semi-bold d-inline-block text-primary '+border+' border-primary rounded-5 font-10" data-teach-strtime="' + valueslot.startTime + '" data-teach-entime="' + valueslot.endTime + '">' + valueslot.displayStartTime + ' - ' + valueslot.displayEndTime+'</span>';
																		}
																	});
																}
													   html+='</td>'
													   +'</tr>'
												   +'</tbody>'
											   +'</table>'
										   +'</div>'
										   +'<div class="expandable-details font-weight-semi-bold text-primary">'
											   +'<table class="table roop-table mb-0">'
												   +'<tbody>';
															var adminInc=0;
													   html += '<tr>'
														   +'<td class="border-0" style="width:43%">';
														   if(itemsingle.dayCheck != "N"){
																$.each(itemsingle.teacherPreferTime, function (kslot, vlue) {
																	if(vlue.slotType=='Live Classes'){
																		if(kslot==0){
																			html+=vlue.slotType;
																		}
																	}else{
																		adminInc=adminInc+1;
																	}
																});
														   }else{
															adminInc=adminInc+1;
														   }
														   html += '</td>'
														   +'<td class="text-center border-0" style="width:57%">'
															   +'<div class="expandable-details">'
																   +'<div class="overflow-auto full" style="'+(adminInc>0?'max-height: 95px':'max-height: 212px')+';">';
																		if(itemsingle.dayCheck != "N"){	
																			$.each(itemsingle.teacherPreferTime, function (keyslot, valueslot) {
																				if(valueslot.slotType=='Live Classes'){
																					var border = valueslot.entityId>0?'btn-dashed':'border';
																					html += '<span class="p-1 mb-1 mr-1 text-center font-weight-semi-bold d-inline-block text-primary '+border+' border-primary rounded-5 font-10" data-teach-strtime="' + valueslot.startTime + '" data-teach-entime="' + valueslot.endTime + '">' + valueslot.displayStartTime + ' - ' + valueslot.displayEndTime+'</span>';
																				}
																			});	
																		}
																   html+='</div>'
															   +'</div>'
														   +'</td>'
													   +'</tr>';
												   
													   html += '<tr>'
														   +'<td class="border-0" style="width:43%">';
														  		var adVal=0;
																if(itemsingle.dayCheck != "N"){
																	$.each(itemsingle.teacherPreferTime, function (kslot, vlue) {
																		if(vlue.slotType=='Admin Task'){
																			if(adVal==0){
																				html+=vlue.slotType;
																			}
																			adVal=adVal+1;
																		}
																	});
																}else{
																	adVal=adVal+1;
																}
														   html += '</td>'
														   +'<td class="text-center border-0" style="width:57%">'
															   +'<div class="expandable-details">'
																   +'<div class="overflow-auto full" style="max-height: 95px;">';
																   		if(itemsingle.dayCheck != "N"){	
																	   		$.each(itemsingle.teacherPreferTime, function (keyslot, valueslot) {
																				if(valueslot.slotType=='Admin Task'){
																					var border = valueslot.entityId>0?'btn-dashed':'border';
																					html += '<span class="p-1 mb-1 mr-1 text-center font-weight-semi-bold d-inline-block text-primary '+border+' border-primary rounded-5 font-10" data-teach-strtime="' + valueslot.startTime + '" data-teach-entime="' + valueslot.endTime + '">' + valueslot.displayStartTime + ' - ' + valueslot.displayEndTime+'</span>';
																				}
																			});	
																		}
																   html+='</div>'
															   +'</div>'
														   +'</td>'
													   +'</tr>';
													   // html += '<tr>'
													   // 	+'<td class="px-0 border-0 text-dark">Total Hours</td>'
													   // 	+'<td class="px-0 border-0 text-center text-dark">=9hr</td>'
													   // +'</tr>';
												   html += '</tbody>'
											   +'</table>'
										   +'</div>'
									   +'</td>'
									   +'<td class="text-left px-0 vertical-align-top position-relative border-right-0 border-left-0 border-bottom availability-total-hour-td" style="width: 200px;">'
											   +'<div class="squeezed-details">'
												   +'<span class="p-1 mb-1 mr-1 text-center font-weight-semi-bold d-inline-block text-primary border border-primary rounded-5 font-10">' + itemsingle.totalHrsSpent + '</span>'
											   +'</div>'
											   +'<div class="expandable-details">'
												   +'<span class="p-1 mb-1 mr-1 text-center font-weight-semi-bold d-inline-block text-primary border border-primary rounded-5 font-10">' + itemsingle.totalHrsSpent + '</span>'
											   +'</div>'
									   +'</td>'
									   +'<td class="text-right px-0 vertical-align-top position-relative border-right-0 border-left-0 border-bottom" style="width: 200px;">'
										   +'<div class="squeezed-details">';
											   $.each(itemsingle.timeOccupied, function (keyslot, vaslot) {
												    if(keyslot == 0){
													   //var functim = "getTeacherTimeBooked('"+vaslot.bookedId+"', '"+vaslot.bookedType+"','"+itemsingle.startDate+"');";
													   getTeacherTimeBooked( ""+vaslot.bookedId+"", ""+vaslot.bookedType+"",""+itemsingle.startDate+"",""+startdateid+"");
													   html+='<span class="dropdown d-inline-block">'
															   +'<a href="javascript:void(0);" class="p-1 mb-1 mr-1 text-center font-weight-semi-bold d-inline-block text-danger border border-danger rounded-5 font-10 text-decoration-none" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown" data-meeting-id="' + vaslot.bookedId + '" data-meeting-type="' + vaslot.bookedType + '" data-teach-strtime="' + vaslot.startTime + '" data-teach-entime="' + vaslot.endTime + '">' + vaslot.displayStartTime + ' - ' + vaslot.displayEndTime+'</a>'
															   +'<div tabindex="-1" role="menu" aria-hidden="true" class="dropdown-menu-lg dropdown-menu notResponsive p-2 border-primary bg-light-primary" style="box-shadow:0px 0px 4px 1px rgb(0 127 255 / 65%) !important">'
															   +'<div class="arrow"></div>'
															   +'<table class="w-100">'
															   +'<tbody>'
																   +'<tr class="hideClassWith'+startdateid+'_'+vaslot.bookedId+'">'
																	   +'<th class="border-0 p-1 vertical-align-top text-left font-11">Class With:</th>'
																	   +'<td class="border-0 p-1 vertical-align-top text-left font-11 withClass'+startdateid+'_'+vaslot.bookedId+'"></td>'
																   +'</tr>'
																   +'<tr>'
																	   +'<th class="border-0 p-1 vertical-align-top text-left font-11 textCoursename'+startdateid+'_'+vaslot.bookedId+'">Course Name:</th>'
																	   +'<td class="border-0 p-1 vertical-align-top text-left font-11 courseName'+startdateid+'_'+vaslot.bookedId+'"></td>'
																   +'</tr>'
																   +'<tr>'
																	   +'<th class="border-0 p-1 vertical-align-top text-left font-11">Class Type:</th>'
																	   +'<td class="border-0 p-1 vertical-align-top text-left font-11 classType'+startdateid+'_'+vaslot.bookedId+'"></td>'
																   +'</tr>'
																   +'<tr class="hideStudentTime'+startdateid+'_'+vaslot.bookedId+'">'
																	   +'<th class="border-0 p-1 vertical-align-top text-left font-11">Student Timings:</th>'
																	   +'<td class="border-0 p-1 vertical-align-top text-left font-11 classStudentTime'+startdateid+'_'+vaslot.bookedId+'"></td>'
																   +'</tr>'
																   +'<tr>'
																	   +'<th class="border-0 p-1 vertical-align-top text-left font-11">Admin Timings:</th>'
																	   +'<td class="border-0 p-1 vertical-align-top text-left font-11 classAdminTime'+startdateid+'_'+vaslot.bookedId+'"></td>'
																   +'</tr>'
																   +'<tr class="hideClassBuffer'+startdateid+'_'+vaslot.bookedId+'">'
																	   +'<th class="border-0 p-1 vertical-align-top text-left font-11">Buffer Time:</th>'
																	   +'<td class="border-0 p-1 vertical-align-top text-left font-11 bufferTime'+startdateid+'_'+vaslot.bookedId+'"></td>'
																   +'</tr>'
															   +'</tbody>'
															   +'</table>'
															   +'</div>'
														   +'</span>';
												   }
											   });
											   var viewOccupiedStatus=false;
										   html += '</div>'
										   +'<div class="expandable-details">'
											   +'<div class="overflow-auto full overflow-div" style="max-height: 212px;">'
												   $.each(itemsingle.timeOccupied, function (keyslot, vaslot) {
														//var functim = "getTeacherTimeBooked('"+vaslot.bookedId+"', '"+vaslot.bookedType+"','"+itemsingle.startDate+"');";
													   getTeacherTimeBooked( ""+vaslot.bookedId+"", ""+vaslot.bookedType+"",""+itemsingle.startDate+"",""+startdateid+"");
													   html+='<span class="dropdown d-inline-block">'
															   +'<a href="javascript:void(0);" class="p-1 mb-1 mr-1 text-center font-weight-semi-bold d-inline-block text-danger border border-danger rounded-5 font-10 text-decoration-none" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown" data-meeting-id="' + vaslot.bookedId + '" data-meeting-type="' + vaslot.bookedType + '" data-teach-strtime="' + vaslot.startTime + '" data-teach-entime="' + vaslot.endTime + '" >' + vaslot.displayStartTime + ' - ' + vaslot.displayEndTime+'</a>'
															   +'<div tabindex="-1" role="menu" aria-hidden="true" class="dropdown-menu-lg dropdown-menu notResponsive p-2 border-primary bg-light-primary" style="box-shadow:0px 0px 4px 1px rgb(0 127 255 / 65%) !important">'
																   +'<div class="arrow"></div>'	
																   +'<table class="w-100">'
																   +'<tbody>'
																	   +'<tr class="hideClassWith'+startdateid+'_'+vaslot.bookedId+'">'
																		   +'<th class="border-0 p-1 vertical-align-top text-left font-11">Class With:</th>'
																		   +'<td class="border-0 p-1 vertical-align-top text-left font-11 withClass'+startdateid+'_'+vaslot.bookedId+'"></td>'
																	   +'</tr>'
																	   +'<tr>'
																		   +'<th class="border-0 p-1 vertical-align-top text-left font-11 textCoursename'+startdateid+'_'+vaslot.bookedId+'">Course Name:</th>'
																		   +'<td class="border-0 p-1 vertical-align-top text-left font-11 courseName'+startdateid+'_'+vaslot.bookedId+'"></td>'
																	   +'</tr>'
																	   +'<tr>'
																		   +'<th class="border-0 p-1 vertical-align-top text-left font-11">Class Type:</th>'
																		   +'<td class="border-0 p-1 vertical-align-top text-left font-11 classType'+startdateid+'_'+vaslot.bookedId+'"></td>'
																	   +'</tr>'
																	   +'<tr class="hideStudentTime'+startdateid+'_'+vaslot.bookedId+'">'
																		   +'<th class="border-0 p-1 vertical-align-top text-left font-11">Student Timings:</th>'
																		   +'<td class="border-0 p-1 vertical-align-top text-left font-11 classStudentTime'+startdateid+'_'+vaslot.bookedId+'"></td>'
																	   +'</tr>'
																	   +'<tr>'
																		   +'<th class="border-0 p-1 vertical-align-top text-left font-11">Admin Timings:</th>'
																		   +'<td class="border-0 p-1 vertical-align-top text-left font-11 classAdminTime'+startdateid+'_'+vaslot.bookedId+'"></td>'
																	   +'</tr>'
																	   +'<tr class="hideClassBuffer'+startdateid+'_'+vaslot.bookedId+'">'
																		   +'<th class="border-0 p-1 vertical-align-top text-left font-11">Buffer Time:</th>'
																		   +'<td class="border-0 p-1 vertical-align-top text-left font-11 bufferTime'+startdateid+'_'+vaslot.bookedId+'"></td>'
																	   +'</tr>'
																   +'</tbody>'
																   +'</table>'
															   +'</div>'
														   +'</span>';
												   });		
												   if(viewOccupiedStatus){
													   html += '<a href="javascript:void(0)" class="btn btn-primary view-all-time-slots">View More</a>';
												   }
										   html += '</div>'
										   +'</div>'
									   +'</td>'
									   +'<td class="text-left px-0 vertical-align-top position-relative border-right-0 border-left-0 border-bottom availability-total-hour-td" style="width: 200px;">'
											   +'<div class="squeezed-details">'
												   +'<span class="p-1 mb-1 mr-1 text-center font-weight-semi-bold d-inline-block text-danger border border-danger rounded-5 font-10 text-decoration-none">' + itemsingle.totalHrsOccupied + '</span>'
											   +'</div>'
											   +'<div class="expandable-details">'
												   +'<span class="p-1 mb-1 mr-1 text-center font-weight-semi-bold d-inline-block text-danger border border-danger rounded-5 font-10 text-decoration-none">' + itemsingle.totalHrsOccupied + '</span>'
											   +'</div>'
									   +'</td>'
									   +'<td class="text-right border-right-0 border-left-0 border-bottom px-0 vertical-align-top position-relative" style="width: 200px;">'
										   +'<div class="squeezed-details">';
										   if(itemsingle.dayCheck != "N"){
												$.each(itemsingle.timeUnOccupied, function (keyslot, vaslot) {
												if(keyslot == 0){
													html += '<span class="p-1 mb-1 mr-1 text-center font-weight-semi-bold d-inline-block text-success border border-success rounded-5 font-10" data-teach-strtime="' + vaslot.startTime + '" data-teach-entime="' + vaslot.endTime + '">' + vaslot.displayStartTime + ' - ' + vaslot.displayEndTime;
													html += '</span>';
												}
												});
										   }
										   var viewUnOccupiedStatus=false;
										   html += '</div>'
										   +'<div class="expandable-details">'
											   +'<div class="overflow-auto full" style="max-height: 212px;">';
										   			if(itemsingle.dayCheck != "N"){
														$.each(itemsingle.timeUnOccupied, function (keyslot, vaslot) {
															html+='<span class="p-1 mb-1 mr-1 text-center font-weight-semi-bold d-inline-block text-success border border-success rounded-5 font-10" data-teach-strtime="' + vaslot.startTime + '" data-teach-entime="' + vaslot.endTime + '">' + vaslot.displayStartTime + ' - ' + vaslot.displayEndTime+'</span>';
														});	
														if(viewUnOccupiedStatus){
															html += '<a href="javascript:void(0)" class="btn btn-primary view-all-time-slots">View More</a>';
														}
													}
												html += '</div>'
										   +'</div>'
									   +'</td>'
									   +'<td class="text-left px-0 vertical-align-top position-relative border-right-0 border-left-0 border-bottom availability-total-hour-td" style="width: 100px;">'
											   +'<div class="squeezed-details">'
												   +'<span class="p-1 mb-1 mr-1 text-center font-weight-semi-bold d-inline-block text-success border border-success rounded-5 font-10">' + itemsingle.totalHrsUnOccupied + '</span>'
											   +'</div>'
											   +'<div class="expandable-details">'
												   +'<span class="p-1 mb-1 mr-1 text-center font-weight-semi-bold d-inline-block text-success border border-success rounded-5 font-10">' + itemsingle.totalHrsUnOccupied + '</span>'
											   +'</div>'
									   +'</td>'
								   +'</tr>'
							   });
							   html+='<tr>'
								   +'<td colspan="2" class="border-top-0 border-right-0 text-center bold">'
									   +'&nbsp;'
								   +'</td>'
								   +'<td colspan="" class="border-top-0 border-right-0 text-right bold">Total</td>'
								   +'<td class="text-left pl-0 border-right-0 border-left-0">'
								   		+'<span class="p-1 mb-1 mr-1 text-center font-weight-semi-bold d-inline-block text-white bg-primary rounded-5 font-10">'+valueweek.totalWeekTimeHrs+'</span>'
								   +'</td>'
								   +'<td class="border-top-0 border-right-0 border-left-0 text-right bold">Total</td>'
								   +'<td class="text-left pl-0 border-right-0 border-left-0">'
							   			+'<span class="p-1 mb-1 mr-1 text-center font-weight-semi-bold d-inline-block text-white bg-danger rounded-5 font-10">'+valueweek.totalWeekTimeOcupHrs+'</span>'
									+'</td>'
								   +'<td class="border-right-0 border-left-0 text-right bold">Total</td>'
								   +'<td class="rounded-bottom-right-10 border-left-0 text-left pl-0">'
							   			+'<span class="p-1 mb-1 mr-1 text-center font-weight-semi-bold d-inline-block text-white bg-success rounded-5 font-10">'+valueweek.totalWeekTimeUnOcupHrs+'</span>'
									+'</td>'
							   +'</tr>';
						   }else{
							   html+='<tr>'
									   +'<td colspan="6" class="rounded-bottom-right-10 border-top-0 text-center bold">'
										   +'No Availability'
									   +'</td>'
								   +'</tr>';
						   }
					   html+='</tbody>'
						   +'</table>'
					   +'</td>'
				   +'</tr>';
			   html+='</tbody>'
		   +'</table>'
	   +'</div>';
   });
   return html;
}

function getTeacherNextAvailablity(weekDataList){
   //console.log(weekDataList);
   var html='';
   $.each(weekDataList.teacherAssignTimeWeekList, function (keyweek, valueweek) {
	html+='<div class="full">'
		   +'<table class="table mb-0 table-bordered font-12 border-0" style="width: 100%;min-width: 940px;">'
			   +'<tbody>';
			   		if(keyweek == 0){
			   		html+='<tr>'
							+'<td class="border-0 p-0">&nbsp;</td>'
							+'<td class="border-0 p-0">'
								+`<table class="table roop-table mb-0 border-radius-table border-0">
									<tbody>
										<tr>
											<td colspan="2" class="border-0" style="width:30%">
												<h5>September 27, 2024</h5>
											</td>
											<td class="border-0 text-center" style="width:calc(18% + 83px)">
												<div class="bg-light-primary border-primary border p-1 rounded flex-grow-1 mx-2 mb-2" style="border-top-width:6px !important">
													<h6 class="m-0" style="font-size:14px">Total Availability Given (hh:mm) <span class="text-decoration-none font-weight-bold text-dark" id="availableHrs">0</span></h6> 
												</div>
											</td>
											<td class="border-0 text-center" style="width:calc(18% + 83px)">
												<div class="bg-light-danger border-danger border p-1 rounded flex-grow-1 mx-2 mb-2" style="border-top-width:6px !important">
													<h6 class="m-0" style="font-size:14px">Total Availability Occupied (hh:mm) <span class="text-decoration-none font-weight-bold text-dark" id="occupiedHrs">0</span></h6>
												</div>
											</td>
											<td class="border-0 text-center" style="width:calc(18% + 83px)">
												<div class="bg-light-success border-success border p-1 rounded flex-grow-1 mx-2 mb-2" style="border-top-width:6px !important">
													<h6 class="m-0" style="font-size:14px">Total Availability Unoccupied (hh:mm) <span class="text-decoration-none font-weight-bold text-dark" id="unoccupiedHrs">0</span></h6> 
												</div>
											</td>
										</tr>
									</tbody>
								</table>`
							+'</td>'
						+'</tr>';
					}
				    html+='<tr>'
				   		+'<td rowspan="5" class="font-weight-semi-bold bg-dark text-white font-size-lg position-relative availability-week-row rounded-top-left-10 rounded-bottom-left-10 border-0">'
						   +'<span class="availability-week">WEEK ' + (keyweek + 1) + '</span>'
					   +'</td>'
					   +'<td class="border-0 p-0">'
						   +'<table class="table roop-table mb-0 border-radius-table border-0" style="'+(valueweek.weeklyTime!=null?"table-layout:fixed":"")+'">'
							   +'<thead>'
							   +'<tr class="text-white">'
								   +'<th valign="middle" class="bg-primary" style="width: 15%;border-width: 0;">Day &amp; Date</th>'
								   +'<th valign="middle" class="bg-primary" style="width: 15%;border-width: 0;">Task Name</th>'
								   +'<th valign="middle" class="text-right bg-primary" style="border-width: 0;width: 18% !important;">Availability Given</th>'
								   +'<th valign="middle" class="text-left bg-primary availability-total-hour-th" style="border-width: 0;width: 83px !important;">Total Hour</th>'
								   +'<th valign="middle" class="text-right bg-primary" style="border-width: 0;width: 18% !important;">Availability Occupied</th>'
								   +'<th valign="middle" class="text-left bg-primary availability-total-hour-th" style="border-width: 0;width: 83px !important;">Total Hour</th>'
								   +'<th valign="middle" class="text-right bg-primary" style="border-width: 0;width: 18% !important;">Availability Unoccupied</th>'
								   +'<th valign="middle" class="text-left bg-primary availability-total-hour-th" style="border-width: 0;width: 83px !important;">Total Hour</th>'
							   +'</tr>'
							   +'</thead>'
							   +'<tbody>';
							   if(valueweek.weeklyTime!=null){
								   $.each(valueweek.weeklyTime, function (keysingle, itemsingle) {
								   var startdateid=itemsingle.startDate.toString().replace("-","");
								   html+='<tr>'
									   +'<td class="bg-primary cursor text-center px-0 expandable-row border-right-0 border-left-0 border-bottom">'
										   +'<div class="squeezed-details text-white">' + itemsingle.displayStartDate + '&nbsp;<i class="fa fa-angle-down"></i></div>'
										   +'<div class="expandable-details">' + itemsingle.displayStartDate + '&nbsp;<i class="fa fa-angle-up"></i></div>'
									   +'</td>'
									   +'<td class="vertical-align-top border-right-0 border-left-0 border-bottom p-0" colspan="2">'
										   +'<div class="squeezed-details font-weight-semi-bold text-primary">'
											   +'<table class="table roop-table mb-0">'
												   +'<tbody>'
													   +'<tr>'
														   +'<td class="border-0" style="width:43%">';
															   var sltType= itemsingle.slotType;
															   const sltArray = sltType.split(",");
															   if(sltArray.length>1){
																   for (let ins = 0; ins < sltArray.length; ins++) {
																	   const elSlt = sltArray[ins];
																	   html += elSlt+"<br/>";
																   }
															   }else{
																   html += sltType;
															   }
															   
														   html += '</td>'
														   +'<td class="text-right border-0" style="width:57%">';
															   $.each(itemsingle.teacherPreferTime, function (keyslot, valueslot) {
																   if(keyslot==0){
																	   var border = valueslot.entityId>0?'btn-dashed':'border';
																	   html += '<span class="p-1 mb-1 mr-1 text-center font-weight-semi-bold d-inline-block text-primary '+border+' border-primary rounded-5 font-10" data-teach-strtime="' + valueslot.startTime + '" data-teach-entime="' + valueslot.endTime + '">' + valueslot.displayStartTime + ' - ' + valueslot.displayEndTime+'</span>';
																   }
															   });
													   html+='</td>'
													   +'</tr>'
												   +'</tbody>'
											   +'</table>'
										   +'</div>'
										   +'<div class="expandable-details font-weight-semi-bold text-primary">'
											   +'<table class="table roop-table mb-0">'
												   +'<tbody>';
															var adminInc=0;
													   html += '<tr>'
														   +'<td class="border-0" style="width:43%">';
														   $.each(itemsingle.teacherPreferTime, function (kslot, vlue) {
															   if(vlue.slotType=='Live Classes'){
																   if(kslot==0){
																	   html+=vlue.slotType;
																   }
															   }else{
																	adminInc=adminInc+1;
															   }
														   });
														   html += '</td>'
														   +'<td class="text-center border-0" style="width:57%">'
															   +'<div class="expandable-details">'
																   +'<div class="overflow-auto full" style="'+(adminInc>0?'max-height: 95px':'max-height: 212px')+';">';
																	   $.each(itemsingle.teacherPreferTime, function (keyslot, valueslot) {
																		   if(valueslot.slotType=='Live Classes'){
																			   var border = valueslot.entityId>0?'btn-dashed':'border';
																			   html += '<span class="p-1 mb-1 mr-1 text-center font-weight-semi-bold d-inline-block text-primary '+border+' border-primary rounded-5 font-10" data-teach-strtime="' + valueslot.startTime + '" data-teach-entime="' + valueslot.endTime + '">' + valueslot.displayStartTime + ' - ' + valueslot.displayEndTime+'</span>';
																		   }
																	   });	
																   html+='</div>'
															   +'</div>'
														   +'</td>'
													   +'</tr>';
												   
													   html += '<tr>'
														   +'<td class="border-0" style="width:43%">';
														   var adVal=0
														   $.each(itemsingle.teacherPreferTime, function (kslot, vlue) {
															   if(vlue.slotType=='Admin Task'){
																   if(adVal==0){
																	   html+=vlue.slotType;
																   }
																   adVal=adVal+1;
															   }
														   });
														   html += '</td>'
														   +'<td class="text-center border-0" style="width:57%">'
															   +'<div class="expandable-details">'
																   +'<div class="overflow-auto full" style="max-height: 95px;">';
																	   $.each(itemsingle.teacherPreferTime, function (keyslot, valueslot) {
																		   if(valueslot.slotType=='Admin Task'){
																			   var border = valueslot.entityId>0?'btn-dashed':'border';
																			   html += '<span class="p-1 mb-1 mr-1 text-center font-weight-semi-bold d-inline-block text-primary '+border+' border-primary rounded-5 font-10" data-teach-strtime="' + valueslot.startTime + '" data-teach-entime="' + valueslot.endTime + '">' + valueslot.displayStartTime + ' - ' + valueslot.displayEndTime+'</span>';
																		   }
																	   });	
																   html+='</div>'
															   +'</div>'
														   +'</td>'
													   +'</tr>';
													   // html += '<tr>'
													   // 	+'<td class="px-0 border-0 text-dark">Total Hours</td>'
													   // 	+'<td class="px-0 border-0 text-center text-dark">=9hr</td>'
													   // +'</tr>';
												   html += '</tbody>'
											   +'</table>'
										   +'</div>'
									   +'</td>'
									   +'<td class="text-left px-0 vertical-align-top position-relative border-right-0 border-left-0 border-bottom availability-total-hour-td" style="width: 200px;">'
											   +'<div class="squeezed-details">'
												   +'<span class="p-1 mb-1 mr-1 text-center font-weight-semi-bold d-inline-block text-primary border border-primary rounded-5 font-10">' + itemsingle.totalHrsSpent + '</span>'
											   +'</div>'
											   +'<div class="expandable-details">'
												   +'<span class="p-1 mb-1 mr-1 text-center font-weight-semi-bold d-inline-block text-primary border border-primary rounded-5 font-10">' + itemsingle.totalHrsSpent + '</span>'
											   +'</div>'
									   +'</td>'
									   +'<td class="text-right px-0 vertical-align-top position-relative border-right-0 border-left-0 border-bottom" style="width: 200px;">'
										   +'<div class="squeezed-details">';
											   $.each(itemsingle.timeOccupied, function (keyslot, vaslot) {
												   
												   if(keyslot == 0){
													   //var functim = "getTeacherTimeBooked('"+vaslot.bookedId+"', '"+vaslot.bookedType+"','"+itemsingle.startDate+"');";
													   getTeacherTimeBooked( ""+vaslot.bookedId+"", ""+vaslot.bookedType+"",""+itemsingle.startDate+"",""+startdateid+"");
													   html+='<span class="dropdown d-inline-block">'
															   +'<a href="javascript:void(0);" class="p-1 mb-1 mr-1 text-center font-weight-semi-bold d-inline-block text-danger border border-danger rounded-5 font-10 text-decoration-none" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown" data-meeting-id="' + vaslot.bookedId + '" data-meeting-type="' + vaslot.bookedType + '" data-teach-strtime="' + vaslot.startTime + '" data-teach-entime="' + vaslot.endTime + '">' + vaslot.displayStartTime + ' - ' + vaslot.displayEndTime+'</a>'
															   +'<div tabindex="-1" role="menu" aria-hidden="true" class="dropdown-menu-lg dropdown-menu notResponsive p-2 border-primary bg-light-primary" style="box-shadow:0px 0px 4px 1px rgb(0 127 255 / 65%) !important">'
															   +'<div class="arrow"></div>'
															   +'<table class="w-100">'
															   +'<tbody>'
																   +'<tr class="hideClassWith'+startdateid+'_'+vaslot.bookedId+'">'
																	   +'<th class="border-0 p-1 vertical-align-top text-left font-11">Class With:</th>'
																	   +'<td class="border-0 p-1 vertical-align-top text-left font-11 withClass'+startdateid+'_'+vaslot.bookedId+'"></td>'
																   +'</tr>'
																   +'<tr>'
																	   +'<th class="border-0 p-1 vertical-align-top text-left font-11 textCoursename'+startdateid+'_'+vaslot.bookedId+'">Course Name:</th>'
																	   +'<td class="border-0 p-1 vertical-align-top text-left font-11 courseName'+startdateid+'_'+vaslot.bookedId+'"></td>'
																   +'</tr>'
																   +'<tr>'
																	   +'<th class="border-0 p-1 vertical-align-top text-left font-11">Class Type:</th>'
																	   +'<td class="border-0 p-1 vertical-align-top text-left font-11 classType'+startdateid+'_'+vaslot.bookedId+'"></td>'
																   +'</tr>'
																   +'<tr class="hideStudentTime'+startdateid+'_'+vaslot.bookedId+'">'
																	   +'<th class="border-0 p-1 vertical-align-top text-left font-11">Student Timings:</th>'
																	   +'<td class="border-0 p-1 vertical-align-top text-left font-11 classStudentTime'+startdateid+'_'+vaslot.bookedId+'"></td>'
																   +'</tr>'
																   +'<tr>'
																	   +'<th class="border-0 p-1 vertical-align-top text-left font-11">Admin Timings:</th>'
																	   +'<td class="border-0 p-1 vertical-align-top text-left font-11 classAdminTime'+startdateid+'_'+vaslot.bookedId+'"></td>'
																   +'</tr>'
																   +'<tr class="hideClassBuffer'+startdateid+'_'+vaslot.bookedId+'">'
																	   +'<th class="border-0 p-1 vertical-align-top text-left font-11">Buffer Time:</th>'
																	   +'<td class="border-0 p-1 vertical-align-top text-left font-11 bufferTime'+startdateid+'_'+vaslot.bookedId+'"></td>'
																   +'</tr>'
															   +'</tbody>'
															   +'</table>'
															   +'</div>'
														   +'</span>';
												   }
											   });
											   var viewOccupiedStatus=false;
										   html += '</div>'
										   +'<div class="expandable-details">'
											   +'<div class="overflow-auto full overflow-div" style="max-height: 212px;">'
												   $.each(itemsingle.timeOccupied, function (keyslot, vaslot) {
													   //var functim = "getTeacherTimeBooked('"+vaslot.bookedId+"', '"+vaslot.bookedType+"','"+itemsingle.startDate+"');";
													   getTeacherTimeBooked( ""+vaslot.bookedId+"", ""+vaslot.bookedType+"",""+itemsingle.startDate+"",""+startdateid+"");
													   html+='<span class="dropdown d-inline-block">'
															   +'<a href="javascript:void(0);" class="p-1 mb-1 mr-1 text-center font-weight-semi-bold d-inline-block text-danger border border-danger rounded-5 font-10 text-decoration-none" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown" data-meeting-id="' + vaslot.bookedId + '" data-meeting-type="' + vaslot.bookedType + '" data-teach-strtime="' + vaslot.startTime + '" data-teach-entime="' + vaslot.endTime + '" >' + vaslot.displayStartTime + ' - ' + vaslot.displayEndTime+'</a>'
															   +'<div tabindex="-1" role="menu" aria-hidden="true" class="dropdown-menu-lg dropdown-menu notResponsive p-2 border-primary bg-light-primary" style="box-shadow:0px 0px 4px 1px rgb(0 127 255 / 65%) !important">'
																   +'<div class="arrow"></div>'	
																   +'<table class="w-100">'
																   +'<tbody>'
																	   +'<tr class="hideClassWith'+startdateid+'_'+vaslot.bookedId+'">'
																		   +'<th class="border-0 p-1 vertical-align-top text-left font-11">Class With:</th>'
																		   +'<td class="border-0 p-1 vertical-align-top text-left font-11 withClass'+startdateid+'_'+vaslot.bookedId+'"></td>'
																	   +'</tr>'
																	   +'<tr>'
																		   +'<th class="border-0 p-1 vertical-align-top text-left font-11 textCoursename'+startdateid+'_'+vaslot.bookedId+'">Course Name:</th>'
																		   +'<td class="border-0 p-1 vertical-align-top text-left font-11 courseName'+startdateid+'_'+vaslot.bookedId+'"></td>'
																	   +'</tr>'
																	   +'<tr>'
																		   +'<th class="border-0 p-1 vertical-align-top text-left font-11">Class Type:</th>'
																		   +'<td class="border-0 p-1 vertical-align-top text-left font-11 classType'+startdateid+'_'+vaslot.bookedId+'"></td>'
																	   +'</tr>'
																	   +'<tr class="hideStudentTime'+startdateid+'_'+vaslot.bookedId+'">'
																		   +'<th class="border-0 p-1 vertical-align-top text-left font-11">Student Timings:</th>'
																		   +'<td class="border-0 p-1 vertical-align-top text-left font-11 classStudentTime'+startdateid+'_'+vaslot.bookedId+'"></td>'
																	   +'</tr>'
																	   +'<tr>'
																		   +'<th class="border-0 p-1 vertical-align-top text-left font-11">Admin Timings:</th>'
																		   +'<td class="border-0 p-1 vertical-align-top text-left font-11 classAdminTime'+startdateid+'_'+vaslot.bookedId+'"></td>'
																	   +'</tr>'
																	   +'<tr class="hideClassBuffer'+startdateid+'_'+vaslot.bookedId+'">'
																		   +'<th class="border-0 p-1 vertical-align-top text-left font-11">Buffer Time:</th>'
																		   +'<td class="border-0 p-1 vertical-align-top text-left font-11 bufferTime'+startdateid+'_'+vaslot.bookedId+'"></td>'
																	   +'</tr>'
																   +'</tbody>'
																   +'</table>'
															   +'</div>'
														   +'</span>';
												   });		
												   if(viewOccupiedStatus){
													   html += '<a href="javascript:void(0)" class="btn btn-primary view-all-time-slots">View More</a>';
												   }
										   html += '</div>'
										   +'</div>'
									   +'</td>'
									   +'<td class="text-left px-0 vertical-align-top position-relative border-right-0 border-left-0 border-bottom availability-total-hour-td" style="width: 200px;">'
											   +'<div class="squeezed-details">'
												   +'<span class="p-1 mb-1 mr-1 text-center font-weight-semi-bold d-inline-block text-danger border border-danger rounded-5 font-10 text-decoration-none">' + itemsingle.totalHrsOccupied + '</span>'
											   +'</div>'
											   +'<div class="expandable-details">'
												   +'<span class="p-1 mb-1 mr-1 text-center font-weight-semi-bold d-inline-block text-danger border border-danger rounded-5 font-10 text-decoration-none">' + itemsingle.totalHrsOccupied + '</span>'
											   +'</div>'
									   +'</td>'
									   +'<td class="text-right border-right-0 border-left-0 border-bottom px-0 vertical-align-top position-relative" style="width: 200px;">'
										   +'<div class="squeezed-details">';
										   $.each(itemsingle.timeUnOccupied, function (keyslot, vaslot) {
											   if(keyslot == 0){
												   html += '<span class="p-1 mb-1 mr-1 text-center font-weight-semi-bold d-inline-block text-success border border-success rounded-5 font-10" data-teach-strtime="' + vaslot.startTime + '" data-teach-entime="' + vaslot.endTime + '">' + vaslot.displayStartTime + ' - ' + vaslot.displayEndTime;
												   html += '</span>';
											   }
										   });
										   var viewUnOccupiedStatus=false;
										   html += '</div>'
										   +'<div class="expandable-details">'
											   +'<div class="overflow-auto full" style="max-height: 212px;">'
											   $.each(itemsingle.timeUnOccupied, function (keyslot, vaslot) {
												   html+='<span class="p-1 mb-1 mr-1 text-center font-weight-semi-bold d-inline-block text-success border border-success rounded-5 font-10" data-teach-strtime="' + vaslot.startTime + '" data-teach-entime="' + vaslot.endTime + '">' + vaslot.displayStartTime + ' - ' + vaslot.displayEndTime+'</span>';
											   });	
											   if(viewUnOccupiedStatus){
												   html += '<a href="javascript:void(0)" class="btn btn-primary view-all-time-slots">View More</a>';
											   }
											   html += '</div>'
										   +'</div>'
									   +'</td>'
									   +'<td class="text-left px-0 vertical-align-top position-relative border-right-0 border-left-0 border-bottom availability-total-hour-td" style="width: 100px;">'
											   +'<div class="squeezed-details">'
												   +'<span class="p-1 mb-1 mr-1 text-center font-weight-semi-bold d-inline-block text-success border border-success rounded-5 font-10">' + itemsingle.totalHrsUnOccupied + '</span>'
											   +'</div>'
											   +'<div class="expandable-details">'
												   +'<span class="p-1 mb-1 mr-1 text-center font-weight-semi-bold d-inline-block text-success border border-success rounded-5 font-10">' + itemsingle.totalHrsUnOccupied + '</span>'
											   +'</div>'
									   +'</td>'
								   +'</tr>'
							   });
							   html+='<tr>'
								   +'<td colspan="2" class="border-top-0 border-right-0 text-center bold">'
									   +'&nbsp;'
								   +'</td>'
								   +'<td colspan="" class="border-top-0 border-right-0 text-right bold">Total</td>'
								   +'<td class="text-left pl-0 border-right-0 border-left-0">'
								   		+'<span class="p-1 mb-1 mr-1 text-center font-weight-semi-bold d-inline-block text-white bg-primary rounded-5 font-10">'+valueweek.totalWeekTimeHrs+'</span>'
								   +'</td>'
								   +'<td class="border-top-0 border-right-0 border-left-0 text-right bold">Total</td>'
								   +'<td class="text-left pl-0 border-right-0 border-left-0">'
							   			+'<span class="p-1 mb-1 mr-1 text-center font-weight-semi-bold d-inline-block text-white bg-danger rounded-5 font-10">'+valueweek.totalWeekTimeOcupHrs+'</span>'
									+'</td>'
								   +'<td class="border-right-0 border-left-0 text-right bold">Total</td>'
								   +'<td class="rounded-bottom-right-10 border-left-0 text-left pl-0">'
							   			+'<span class="p-1 mb-1 mr-1 text-center font-weight-semi-bold d-inline-block text-white bg-success rounded-5 font-10">'+valueweek.totalWeekTimeUnOcupHrs+'</span>'
									+'</td>'
							   +'</tr>';
						   }else{
							   html+='<tr>'
									   +'<td colspan="6" class="rounded-bottom-right-10 border-top-0 text-center bold">'
										   +'No Availability'
									   +'</td>'
								   +'</tr>';
						   }
					   html+='</tbody>'
						   +'</table>'
					   +'</td>'
				   +'</tr>';
			   html+='</tbody>'
		   +'</table>'
	   +'</div>';
   });
   return html;
   
}

function resetTeacherTimeAvailability(){

}

function getStudentListPopup(){
	var html="";
	html=html+'<div id="studentListAvailablePopup" class="modal fade bd-example-modal-lg fade-scale" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">';
	html=html+'<div class="modal-dialog modal-dialog-centered modal-lg mt-4" style="height: 90vh;">';
	html=html+'<div class="modal-content border-0">';
	html=html+'<div class="modal-header pt-2 pb-2 theme-bg text-white">';
	html=html+'<h5 class="modal-title" id="teacherAssignName"></h5>';
	html=html+'<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">';
	html=html+'<span aria-hidden="true">×</span>';
	html=html+'</button>';
	html=html+'</div>';
	html=html+'<div class="modal-body" style="overflow-y: auto;">';
	html=html+'<table class="table table-bordered" id="stdAssignToTimeAvailList">';
	html=html+'<thead>';
	html=html+'<th width="80px">Sr.no.</th>';
	html=html+'<th>Student Name</th>';
	html=html+'<th>Grade</th>';
	html=html+'<th>Learning Mode</th>';
	html=html+'</thead>';
	html=html+'<tbody style="font-size:11px;" id="studentTeachAssignList">';

	html=html+'</tbody>';
	html=html+'</table>';
	html=html+'</div>';
	html=html+' </div>';
	html=html+'</div>';
	html=html+'</div>';
	return html;
}
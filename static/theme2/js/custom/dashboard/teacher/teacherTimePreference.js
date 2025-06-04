function teacherTimepreferencePageOnLoadEvent(details){
    $("#saveFeedbackPop").on("click", function(){
		saveFeedbackQuestion();
	});
	$("#btnAvailability").on('click',function(){
		$("#warningMsgPopup").modal("hide");
		callDashboardPageSchool(moduleId,'teacher-manage-slot');
		setTimeout(function(){
			$("html, body").animate({ scrollTop: 0 }, "slow");
		},4000)
	});
	$(".leaveDates").datepicker({ 
		//autoclose: true,// 
		startDate:new Date(),
		multidate:true, 
		format: 'M dd, yyyy',
		container:'#timePreferencePopup .modal-body'
	}).on('change', function(e) {
		LEAVE_DATES=$(this).val();
		LEAVE_DATES = LEAVE_DATES.match(/[^,]+,[^,]+/g);
		$(".leave_dates").show();
		$(".leave_dates").html("")
		$.each(LEAVE_DATES, function(index, value){
			$(".leave_dates").append("<p class='mb-0 full font-weight-bold text-left'>"+value+"</p>");
		});
	});

    $('.play-icon').click(function() {
        $(this).parent().fadeOut(); // Hide play button overlay
        var videoSrc = $('#video-player').attr('src');
        $('#videoIframe').attr('src', videoSrc + '&autoplay=1'); // Add autoplay parameter to start video
    });
    $("#teacherTimeSaveDismiss").hide();
    $("#teacherTimeSave").hide();
    $(".leave_dates").hide();
    var showTimePrefModal = $('#showTimePrefModal').val();
    var isAgreementUpdated = $("#isAgreementUpdated").val();
    if(showTimePrefModal==undefined){
        showTimePrefModal=details.showTimePrefModal;
    }
    if(showTimePrefModal=='true' && isAgreementUpdated == 'false'){
        
    	$("#timePreferencePopup").modal("show");
    }else{
        $("#timePreferencePopup").modal("hide");
    }
    if(details.changeNextSlot=='Y'){
        $("#warningMsgPopup").modal("show");
        $("#warningMsgPopup #monthName").text(details.monthName);
        $("#warningMsgPopup #contractHour").text(details.agreedHours);
        $("#warningMsgPopup #availabilityGiven").text(getTimeFormat(details.totalAvailabelHrs));
    }else{
        $("#warningMsgPopup").modal("hide");
    }

    if($('.timepicker').length>0){
	    $('.timepicker').timepicker({
		   format:'HH:mm',
	    });
	    $('.timepicker').on("click",function(){
		   var zIndex = parseInt($(this).closest(".modal.fade-scale").css("z-index"))+1999;
		   $(".popover.timepicker-popover").css({"z-index":zIndex});
	    });
    }
    $(".startTime").empty();
    $(".startTime").html('<option value="">Select Start Time</option>');
    $(".startTime").append(getHoursAndMinsWithGapDuration(0,0,30));
    
    
    $('.endTime').on('change', function() {
        var startTime = $('#startTime').val();
        var endTime = $(this).val();
        if (startTime && endTime) {
            var startMinutes = parseTime(startTime);
            var endMinutes = parseTime(endTime);
            if (startMinutes >= endMinutes) {
                $(this).val('').trigger('change');
            }
        }
    });

    $('.startTime').on('change', function() {
		var startTime = $(this).val();
		$('.endTime').empty();
		$('.endTime').append('<option value="">Select End Time</option>');
		if(startTime) {
			var startMinutes = parseTime(startTime) + 30;
			for (var i = startMinutes; i < 24 * 60; i += 30) {
				var endHour = Math.floor(i / 60);
				var endMinutes = i % 60;
				var endPeriod = endHour >= 12 ? "PM" : "AM";
				if (endHour > 12) endHour -= 12;
				if (endHour === 0) endHour = 12;
				var formattedEndTime = endHour+":"+endMinutes.toString().padStart(2, '0')+" "+endPeriod;
				$('.endTime').append("<option value="+endHour+":"+endMinutes.toString().padStart(2, '0')+"_"+endPeriod+">"+formattedEndTime+"</option>");
			}
		}
	});
    $("#teacherTimeSave").on('click',function(){
		var controlType = $("#timePreferencePopup #controlType").val();
		var stilDate = $("#slotTillDate").val();
		var dval = new Date(stilDate);
		var dateFormt = dval.toDateString().split(" ");
		dateFormt = dateFormt[1] + ' ' + dateFormt[2] + ', ' + dateFormt[3];
		var alertMsg = 'Are you sure want to lock your availability till - '+dateFormt+'?';
		if(controlType==undefined){
			alertMsg = 'You have added more available times for Classes/Admin Tasks. Please note that once you click on Confirm, you won\'t be able to edit/delete this time slot.';
		}else{
			if(controlType=='edit'){
				alertMsg = 'You have added more available times for Classes/Admin Tasks. Please note that once you click on Confirm, you won\'t be able to edit/delete this time slot.';
			}
		}
		showWarningMessage(alertMsg,'saveTeacherTimePreference(\'TEACHER\',\'timePreferencePopup\',\'true\')');
		// $(document).on('show.bs.modal', '.modal', function() {
		// 		const zIndex = 1040 + 10 * $('.modal:visible').length;
		// 		$(this).css('z-index', zIndex);
		// 		setTimeout(() => $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack'));
		// 	});
	});
    $("#remarksresetDelete").on("hidden.bs.modal", function(){
		var modalLength = $(".modal.show").length;
		if(modalLength>0){
			$("body").addClass("modal-open");
		}
	});

    if($("#orientStartDate").length>0){
		$("#orientStartDate").datepicker({ 
			//autoclose: true,// 
			startDate:new Date(),
			multidate:true, 
			format: 'M dd, yyyy',
			container:'#timePreferencePopup .modal-body'
		});
	}

    $(window).resize(function(){
		if($(window).width() < 600){
			if($("#thankyouClassesMsg p .circle-info").length<1){
				$("#thankyouClassesMsg p").prepend('<svg xmlns="http://www.w3.org/2000/svg" class="circle-info mr-2 mb-1" width="16px"  viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>');
			}
			$("#thankyouClassesMsg p").css({"text-overflow":"ellipsis","-webkit-line-clamp":"1","white-space":"normal","max-height":"38px","overflow":"hidden","word-break":"break-word","display":"-webkit-box","-webkit-box-orient":"vertical"});
			$("#thankyouClassesMsg p").addClass('btn btn-outline-primary');
			$("#thankyouClassesMsg p").removeClass("text-primary");
		}else{
			if($("#thankyouClassesMsg p .circle-info").length>0){
				$("#thankyouClassesMsg p .circle-info").remove();
			}
			$("#thankyouClassesMsg p").css({"text-overflow":"inherit","-webkit-line-clamp":"inherit","white-space":"inherit","max-height":"inherit","overflow":"inherit","word-break":"inherit","display":"block","-webkit-box-orient":"inherit"});
			$("#thankyouClassesMsg p").removeClass('btn btn-outline-primary');
			$("#thankyouClassesMsg p").addClass("text-primary");
		}
	})
    
}

function parseTime(timeStr) {
    var parts = timeStr.split(':');
    var date = new Date();
    date.setHours(parseInt(parts[0], 10));
    date.setMinutes(parseInt(parts[1], 10));
    return date;
}

function selfCloseModal(src, modalId){
    $("#"+modalId).modal('hide');
}
function showAddNewAvailabilityModal(modalId){
    $("#"+modalId).modal("show");
}

function callTeacherAvailabilityMenu(modalID){
    $("#"+modalID).modal("hide");
    callDashboardPageSchool(moduleId,'teacher-manage-slot');
}


async function getTeacherTimePreference(){
    var data={}; data['userId']=USER_ID;
    var responseData = await getDashboardDataBasedUrlAndPayload(false, false,'get-teacher-time-preference', data);
    if(responseData.status == '1'){
        if($("#timePreferencePopup").length>0){
            $("#timePreferencePopup").remove();
        }
        $("body").append(renderTeacherTimepreferenceContent(responseData.details));
        teacherTimepreferencePageOnLoadEvent(responseData.details);
    }
}
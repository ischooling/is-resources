function studentTimepreferencePageOnLoadEvent(){
    $('.play-icon').click(function() {
        $(this).parent().fadeOut(); // Hide play button overlay
        var videoSrc = $('#video-player').attr('src');
        $('#videoIframe').attr('src', videoSrc + '&autoplay=1'); // Add autoplay parameter to start video
    });
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
	
	function parseTime(timeStr) {
		var parts = timeStr.split(':');
		var date = new Date();
		date.setHours(parseInt(parts[0], 10));
		date.setMinutes(parseInt(parts[1], 10));
		return date;
	}
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
	});

    
}


async function getStudentTimePreference(studentId, standardId, providerId){
    var data={};
	data['studentId']=studentId;
	data['standardId']=standardId;
	data['providerId']=providerId;
	data['userId']=USER_ID;
    var responseData = await getDashboardDataBasedUrlAndPayload(false, false,'student-course-selection-content-theme2', data);
    if(responseData.status == '1'){
        if($("#timePreferencePopup").length>0){
            $("#timePreferencePopup").remove();
        }
        $("body").append(renderStudentTimepreferenceContent());
        studentTimepreferencePageOnLoadEvent();
        studentSystemTrainingShowHide(responseData)
    }
}

function studentSystemTrainingShowHide(data){
    $('#hideAllData').hide();
    if(data.systemTrainingStatus == "Skipped") {
        isSkipped = true;
        return false;
    }
    if(data['registrationType'] == 'BATCH'){

    }else{
        if(data.videoUrl == "N"){
            $("#timePreferencePopup .modal-dialog").removeClass("modal-xl");
            $("#timePreferencePopup .modal-dialog").addClass("modal-lg");
            $("#thumbnailFrameDiv").hide()
            $("#timePreferenceDiv").removeClass("col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12");
            $("#timePreferenceDiv").addClass("col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12");
        }else{
            if(data.vedioWatchedStatus != null && data.vedioWatchedStatus != undefined && data.vedioWatchedStatus == 'Y'){
                flagWatchVideo = true;
            }else{
                flagWatchVideo = false;
            }
            $("#timePreferencePopup .modal-dialog").addClass("modal-xl");
            $("#timePreferencePopup .modal-dialog").removeClass("modal-lg");
            $("#thumbnailFrameDiv").show()
            $("#timePreferenceDiv").addClass("col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12");
            $("#timePreferenceDiv").removeClass("col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12");
        }
        if((data['showAcademicYearSelectionModel']=='N' && data['showSystemTrainingSelectionModel']=='N') || (data['systemTrainingStatus'] == "Skipped")) {
            $("#timePreferencePopup").modal("hide");
            $("#timePreferencePopup").addClass("d-none");
            return false;
        }
        if(data['enrollmentType']!='REGISTRATION_FRESH' && data['enrollmentType']!='REGISTRATION_FLEX_COURSE'){
            $("#timePreferencePopup").modal("hide");
            $("#timePreferencePopup").addClass("d-none");
            return false;
        }
        $("#closeButton").hide();
        $("#enrollmentType").val(data['enrollmentType']);
        $("#regstrationType").val(data['registrationType']);
        if(data['enrollmentType']=='REGISTRATION_FRESH' || data['enrollmentType']=='REGISTRATION_FLEX_COURSE'){
            $('#orientAndSemesterChangeSpan').html('I want to schedule my school system training on');
            $('#orientAndSemesterChangeSpanHeading').html('CHOOSE YOUR SCHOOL SYSTEM TRAINING DATE');
            if(data['orientationAcceptanceStatus']=='N' || data['orientationAcceptanceStatus']=='NA'){
                $("#timePreferencePopup").removeClass("d-none");
                $("#timePreferencePopup").modal("show");
                $("#closeButton").hide();
                $("#orientationSelectedTime").text(data['orientationdateTimeInStudentTimeZone']);
                $("#odt").text(data['orientationdateTimeInStudentTimeZone']);
                $("#orientationClassLink").attr("href",data['joinOrientationUrl']);
                $("#orientationInputID").val(data['orientationId'])
                $('#orientationAcceptanceStatusDiv').show();
                $('#orientationDateWrapper').hide();
                $('#orientationTimeWrapper').hide();
                $("#studentTimeSave").text("Confirm");
            }else if(data['orientationAcceptanceStatus']=='A'){
                var msgHtml ="";
                if(data['orientStatus']!='COMPLETED'){
                    $("#timePreferencePopup").removeClass("d-none");
                    $("#timePreferencePopup").modal("show");
                }else{
                    $("#timePreferencePopup").modal("hide");
                    $("#timePreferencePopup").addClass("d-none");
                    return false;
                }
                $("#orientAndSemesterChangeSpanHeading").text("School System Training");
                if(data['orientStatus']=='RESCHEDULE'){
                    msgHtml =msgHtml +"<div class='p-2 border rounded-10' style='border-color: #007fff !important;'><p class='mb-2 text-primary font-weight-semi-bold' style='font-size:18px'>Your school System Training has been rescheduled. </p><p class='mb-0 text-primary font-weight-semi-bold' style='font-size:18px'>Please click below and select another date for the training.</p><p class='mt-3 mb-0'><a href='"+data.rescheduleOrientationUrl+"' class='btn btn-success font-size-lg py-1 px-5' target='_blank'>Reschedule</a></p></div>";
                }else{
                    msgHtml+="<div class='p-2 border rounded-10' style='border-color: #007fff !important;'> <p class='mb-3 text-primary font-weight-semi-bold' style='font-size:18px'>Your School System Training is on "+data['orientationdateTimeInStudentTimeZone']+".</p><p class='mt-3 mb-1'><a  href='javascript:void(0);' onclick='classDetailsOnModal(\""+data.joinOrientationUrl+"\");' class='btn btn-success font-size-lg py-1 px-3'>Join</a></p></div>";
                        msgHtml+="<p class='mb-0 mt-2 text-primary font-weight-semi-bold' style='font-size:16px'>If you wish to reschedule,  please <a href='"+data.rescheduleOrientationUrl+"' class='text-primary' style='text-decoration:underline' target='_blank'>click here</a></p>";
                }
                $("#thankyouClassesMsg").html(msgHtml);
                $("#thankyouClassesMsg").show();
                $("#sartDateWrapper, .timeSlotWrapper").hide();
                $("#studentTimeSkipPrev").hide();
                $("#studentTimeSkipNext").hide();
                $('#startTimeAndEndTimeWrapper').show();
                $('#hideAllData').hide();
                $("#studentTimeSave").hide();
                $("#closeButton").show();
                $("#studentTimeSave").text("Confirm");
            }else{
                if(data['timePrefrenceSelectionStatus'] == 'Y'){
                    $('#startTimeAndEndTimeWrapper').hide();
                    $("#studentTimeSkipNext").show();
                    $("#thankyouClassesMsg").html("<p class='full text-center border border-primary rounded p-2 text-primary' style='font-size:16px' onclick='showMobileViewSystemTrainingInfo()'>Join your School System Training where the School Administration will tell you how to book classes, join classes, access progress reports & course material, appear for assessments, etc.</p>");
                    $("#mobileViewSystemTrainingInfo .modal-body").html("<p class='full text-center text-primary' style='font-size:16px'>Join your School System Training where the School Administration will tell you how to book classes, join classes, access progress reports & course material, appear for assessments, etc.</p>")
                    if($(window).width()<600){
                        if($("#thankyouClassesMsg p .circle-info").length<1){
                            $("#thankyouClassesMsg p").prepend('<svg xmlns="http://www.w3.org/2000/svg" class="circle-info mr-2 mb-1" width="16px" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>');
                        }
                        $("#thankyouClassesMsg p").css({"text-overflow":"ellipsis","-webkit-line-clamp":"1","white-space":"normal","max-height":"38px","overflow":"hidden","word-break":"break-word","display":"-webkit-box","-webkit-box-orient":"vertical"});
                        $("#thankyouClassesMsg p").addClass('btn btn-outline-primary mb-2');
                        $("#thankyouClassesMsg p").removeClass("text-primary");
                    }
                    $('#thankyouClassesMsg, #studentTimeSkipNext').show();
                    $("#chooseDateToStartSemster-wrapper").removeClass("d-inline-block").addClass("d-none");
                    $("#chooseDateSystemTrainingDate-wrapper").removeClass("d-none").addClass("d-inline-block");
                }
                $('#orientationDateWrapper').show();
                $('#orientationTimeWrapper').show();
                $('#orientationAcceptanceStatusDiv').hide();
            }
        }else{
            $('#orientAndSemesterChangeSpan').html('I would like to start my academic year on');
            $('#orientAndSemesterChangeSpanHeading').html('CHOOSE YOUR ACADEMIC YEAR START DATE');
            studentTimeSkipNext('STUDENT','timePreferencePopup',true);
            $("#studentTimeSkipPrev").hide();
            $("#studentTimeSkipNext").hide();
            $("#studentTimeSave").text("Confirm");
        }
        $('#academicYearBlockDate').val(data['academicYearBlockDate']);
        $('#daysCount').val(data['daysCount']);
        $('#daysCountMax').val(data['daysCountMax']);
        var datesForDisable =data['academicYearBlockDate'].split(',');
        var date = data['paymentCompletedDate'].split("-");
        var startDate = new Date(parseInt(date[2]), parseInt(date[0])-1, parseInt(date[1]));
        var endDate = new Date(parseInt(date[2]), parseInt(date[0])-1, parseInt(date[1]));
        if(data['semesterStartDate'] != null){
            var semesterStartDate = data['semesterStartDate'].split("-");
            var systrainingStartDate = new Date(parseInt(semesterStartDate[2]), parseInt(semesterStartDate[0])-1, parseInt(semesterStartDate[1]));
            var systrainingEndDate = new Date(parseInt(semesterStartDate[2]), parseInt(semesterStartDate[0])-1, parseInt(semesterStartDate[1]));
        }
        startDate.setDate(startDate.getDate()+data['daysCount']);
        endDate.setDate(endDate.getDate()+data['daysCountMax']);
        $('#chooseDateToStartSemster').datepicker('destroy').datepicker({
                autoclose: true,
                container: '#timePreferencePopup .modal-body',
                format: 'M dd, yyyy',
                startDate: startDate,
                endDate:endDate,
                beforeShowDay: function (currentDate) {
                    var dayNr = currentDate.getDay();
                    var dateNr = moment(currentDate.getDate()).format("YYYY-MM-DD");
                    if (datesForDisable.length > 0 && datesForDisable !="") {
                        for (var i = 0; i < datesForDisable.length; i++) {
                            if (moment(currentDate).unix()==moment(datesForDisable[i],'YYYY-MM-DD').unix()){
                                return false;
                            }
                        }
                    }
                    return true;
                    }
        });
        if(data['semesterStartDate'] != null){
            systrainingEndDate.setDate(systrainingEndDate.getDate()+(data['activeNumberOfDaysForSystemTraining']-1));
            $('#chooseDateSystemTrainingDate').datepicker('destroy').datepicker({
                autoclose: true,
                container: '#timePreferencePopup .modal-body',
                format: 'M dd, yyyy',
                startDate: systrainingStartDate,
                endDate:systrainingEndDate,
                
            }).on('changeDate',function(){
                if($("#saveType").val() == 'ORIENT'){
                    $("#timePreferencePopup .modal-body").css({"max-height":"500px","overflow-y":"auto"});
                    if(data['enrollmentType']=='REGISTRATION_FRESH' || data['enrollmentType']=='REGISTRATION_FLEX_COURSE'){
                        callOrientationtime();
                    }else{
                    }
                }
                
            });
        }
        $("#timePreferencePopup").removeClass("d-none");
        $("#timePreferencePopup").modal("show");
    }		
				
			
}

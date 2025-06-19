var highSchoolGrade=[];
highSchoolGrade.push(4);
highSchoolGrade.push(5);
highSchoolGrade.push(6);
highSchoolGrade.push(7);
function showSkeleton (isShow, skeletonType){
	if(isShow && skeletonType == "step1"){
		$(".step-1-skeleton").html(skeletonStudent());
		//$("#signupStage1").hide();
	}else if(isShow && skeletonType == "step2"){
		$(".step-2-skeleton").html(skeletonParent());
		//$("#signupStage2").hide();
	}else if(isShow && skeletonType == "step3"){
		$(".step-3-skeleton").html(skeletonCourseSelection());
		$("#divNextSessionCourseChoose").show();
		$("#courseSubjectDetails, #divNextSession").hide();
	}else if(isShow && skeletonType == "fee-details-modal"){
		$(".step-feeDetails-skeleton").show();
		$(".feeDetailsContentDiv").hide();
	}else if(isShow && skeletonType == "step4"){
		$("#divNextSessionCourseChoose").hide();
		$("#divNextSessionCourseReview").show();
		$(".ReviewAndPayContent, #divNextSessionCourseChoose").hide();
		$(".step-4-skeleton").html(skeletonReviewPayment());
	}
}

function renderMigrationDetailsOptionContent(data) {
	var html='';
	if(data.customPaymentEnabled){
		html+=
		'<div id="divNextSessionCourseReview" style="display:'+(data.pageNumberToDisplay==3?'block;':'none;')+'">'
			+'<div class="full step-4-skeleton skeleton-wrapper"></div>'
		+'</div>';
		$('#dashboardContentInHTML').html(html);
		callForReviewAndPaymentSelection('N');
	}else{
		html+=
		'<div id="divNextSession" style="display:'+(data.pageNumberToDisplay<=1?'block;':'none;')+'">'
        	+migrationDetailsOptionContent(data)
		+'</div>'
		+'<div id="divNextSessionCourseWrapper" style="display:'+(data.pageNumberToDisplay==2?'block;':'none;')+'">'
				+'<div class="mb-3 card">'
					+'<div class="card-body">'
						+'<div id="pageHeading"></div>'
						+'<div id="courseFilterFormWrapper"></div>'
						+'<div id="divNextSessionCourseChoose" style="display:'+(data.pageNumberToDisplay==2?'block;':'none;')+'"></div>'
						+removeAllCorusesModal()
						html+='<div id="payment-selection-details"></div>'
					+'</div>'
				+'</div>'
		+'</div>'
		+'<div id="divNextSessionCourseReview" style="display:'+(data.pageNumberToDisplay==3?'block;':'none;')+'">'
			+'<div class="full step-4-skeleton skeleton-wrapper"></div>'
		+'</div>'
		+'<div id="addAndRemoveLoader" class="loader-wrapper d-flex justify-content-center align-items-center loader-style hide-loader">'
			// +'<div class="loader primary-border-top-color">';
				if(SCHOOL_ID == 1){
					// html+=
					// '<div class="full">'
					// 	+'<img src="'+PATH_FOLDER_IMAGE2+'is_loader.gif" alt="'+SCHOOL_NAME+' Loader"/>'
					// +'</div>';
					html+=`
						<img src="`+PATH_FOLDER_IMAGE2+`loader-new.gif" alt="`+SCHOOL_NAME+` Loader" class="new-loader-2024" />
					`
				}else{
					html+=
					'<div class="ball-rotate">'
						+'<div style="background-color: rgb(247, 185, 36);"></div>'
					+'</div>'
					+'<p>Loading ...</p>';
				}
			html+=
			// '</div>'
		'</div>';
		$('#dashboardContentInHTML').html(html);
		$("#pageHeading").html(getStudentMigrationHeader(data));
		$("#grade").select2({
			theme:"bootstrap4",
		})
		$('#gradeId').val(data.standardId)
		if(data.pageNumberToDisplay>=2){
			getAllCourseDetails('N', '');
		}
		if(data.pageNumberToDisplay==3){
			callForReviewAndPaymentSelection('N');
		}
	}
}

function migrationDetailsOptionContent(data) {
	var studentCredit=data.studentCredit;
	var disabledAdmission=data.disabledAdmission;
	var html =
	'<div class="app-page-title">'
		+'<div class="page-title-wrapper">'
			+'<div class="page-title-heading">'
				+'<div class="page-title-icon">'
					+'<i class="pe-7s-users icon-gradient bg-ripe-malin"></i>'
				+'</div>';
				if(data.isParent){
                    html += '<div> You are observing '+data.name+'\'s dashboard </div>';
                }else{
                    html += '<div>'+data.name+'</div>';
                }
			html+= '</div>'
		+'</div>'
	+'</div>'
	+'<div class="main-card mb-3 card mx-auto" style="max-width:650px;width:100%">'
		+'<div class="col-md-12 col-sm-12 col-xs-12">'
			+'<div class="row">'
				+'<div class="card-body student-report">'
					+'<div class="row">'
						+'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 report-head">'
							+'<h4 class="student-name">Hi '+data.name+'!</h4>'
							+'<span class="report-message">'
								+'You have earned '+studentCredit.totalStringCredit+' credits in <b>'+studentCredit.currentGrade+'</b>'
							+'</span>'
						+'</div>'
						+'<div class="col-md-6 col-sm-12 col-12 row-in-br mb-3">'
							+'<div class="col-in row justify-content-center">'
								+'<div class="d-inline-block pX-4 pt-4 pb-0 bg-light-success border border-success rounded text-center" style="min-width:220px">'
									+'<span class="circle-border">'
										+'<img class="report-icon" src="'+PATH_FOLDER_IMAGE2+'exam.png">'
									+'</span>'
									+'<span class="d-inline-block px-2 mt-3  bg-success text-white text-center" style="border-top-left-radius:4px;border-top-right-radius:4px">'
										+'<label class="w-100 d-inline-block font-12 m-0 font-weight-semi-bold">PASSED</label>'
										+'<label class="w-100 d-inline-block m-0 font-weight-semi-bold">'+studentCredit.passSubject+' COURSES</label>'
									+'</span>'
								+'</div>'
							+'</div>'
						+'</div>'
						+'<div class="col-md-6 col-sm-12 col-12 row-in-br mb-3">'
							+'<div class="col-in row justify-content-center">'
								+'<div class="d-inline-block pX-4 pt-4 pb-0 bg-light-danger border border-danger rounded text-center" style="min-width:220px">'
									+'<span class="circle-border">'
										+'<img class="report-icon" src="'+PATH_FOLDER_IMAGE2+'failed.png">'
									+'</span>'
									+'<span class="d-inline-block px-2 mt-3  bg-danger text-white text-center" style="border-top-left-radius:4px;border-top-right-radius:4px">'
										+'<label class="w-100 d-inline-block font-12 m-0 font-weight-semi-bold">FAILED</label>'
										+'<label class="w-100 d-inline-block m-0 font-weight-semi-bold">'+studentCredit.failSubject+' COURSES</label>'
									+'</span>'
								+'</div>'
							+'</div>'
						+'</div>';
						// +'<div class="col-md-4 col-sm-12 col-xs-12 row-in-br mb-3">'
						// 	+'<div class="col-in row justify-content-center">'
						// 		+'<div class="d-inline-block pX-4 pt-4 pb-0 bg-light-warning border border-warning rounded text-center" style="min-width:220px">'
						// 			+'<span class="circle-border">'
						// 				+'<img class="report-icon" src="'+PATH_FOLDER_IMAGE2+'withdrawn-course.png">'
						// 			+'</span>'
						// 			+'<span class="d-inline-block px-2 mt-3  bg-warning text-white text-center" style="border-top-left-radius:4px;border-top-right-radius:4px">'
						// 				+'<label class="w-100 d-inline-block font-12 m-0 font-weight-semi-bold">Withdrawn</label>'
						// 				+'<label class="w-100 d-inline-block m-0 font-weight-semi-bold">'+studentCredit.withDrawSubject+' COURSES</label>'
						// 			+'</span>'
						// 		+'</div>'
						// 	+'</div>'
						// +'</div>'
						if(data.registrationType!="ONE_TO_ONE_FLEX"){
							if(studentCredit.currentGradeId != 7){
								html+='<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 required-credits mt-0 mb-3">'
									+'<span class="required-credits-message">';
										if(data.migrationOptionsForNextGrade!=undefined && data.migrationOptionsForNextGrade.length>0){
											html+='Number of credits required to enroll in <b>'+studentCredit.nextGrade+'</b> = '+studentCredit.balanceCredit+' Credits';
										}
										// var checkCondtion=studentCredit.minmumCreditLimit;
										// if(studentCredit.currentGradeId<11){
											
										// }else{
										// 	var checkCondtion=0.0;
										// 	if(studentCredit.studentPreviousCourseProvider==31){
										// 		if(studentCredit.currentGradeId==12 || studentCredit.currentGradeId==13){
										// 			checkCondtion=3.25;
										// 		}else if(studentCredit.currentGradeId==14){
										// 			checkCondtion=3.75;
										// 		}else if(studentCredit.currentGradeId==15){
										// 			checkCondtion=4.00;
										// 		}else if(studentCredit.currentGradeId==16){
										// 			checkCondtion=4.25;
										// 		}else{
										// 			checkCondtion=0.0;
										// 		}
										// 	}else{
										// 		if(studentCredit.currentGradeId==12){
										// 			checkCondtion=3.0;
										// 		}else if(studentCredit.currentGradeId==13){
										// 			checkCondtion=3.5;
										// 		}else if(studentCredit.currentGradeId==14){
										// 			checkCondtion=4.0;
										// 		}else if(studentCredit.currentGradeId==15){
										// 			checkCondtion=4.5;
										// 		}else if(studentCredit.currentGradeId==15){
										// 			checkCondtion=5.0;
										// 		}else{
										// 			checkCondtion=0.0;
										// 		}
										// 	}
										// }
										// if(parseFloat(studentCredit.totalCredit)<parseFloat(checkCondtion)){
										// 	if(studentCredit.totalStringCredit=='0.0'){
										// 		html+=checkCondtion+'.0';
										// 	}else{
										// 		html+=checkCondtion+' - '+studentCredit.totalStringCredit;
										// 	}
										// }else{
										// 	html+='0.00';
										// }
										// html+=' Credits';
									html+=
									'</span>'
								+'</div>';
							}
						}
						html+='<div class="progression-button-wrapper">'
							+'<div class="col text-center">'
								+'<a class="design-btn bg-primary" href="javascript:void(0);" onclick="callChoiceForStudentModelRepeaters(\'improve\');"> IMPROVE PAST GRADES</a>'
								// +'<h6 class="mt-1 font-weight-semi-bold">Improve your grade in past enrollments</h6>'
							+'</div>';
							if(parseFloat(studentCredit.totalCredit) < studentCredit.minmumCreditLimit  && (studentCredit.withDrawSubject != 0 || studentCredit.incomplteSubject !=0)){
								html+=
								'<div class="col text-center">';
									if(studentCredit.currentGradeId==8 || studentCredit.currentGradeId==9 || studentCredit.currentGradeId==10 || studentCredit.currentGradeId==19 || studentCredit.currentGradeId==20 || studentCredit.currentGradeId==21){
										html+='<a class="design-btn" href="javascript:void(0);" onclick="callForStudentNextSession('+studentCredit.currentGradeId+',\''+studentCredit.currentGrade+'\',\'REGISTRATION_REPEAT_GRADE\',\'ONE_TO_ONE\');"> COMPLETE YOUR CREDITS </a>';
									}else if(studentCredit.currentGradeId>=11 && studentCredit.currentGradeId<=17){
										html+='<a class="design-btn" href="javascript:void(0);" onclick="callForStudentNextSession('+studentCredit.currentGradeId+',\''+studentCredit.currentGrade+'\',\'REGISTRATION_REPEAT_GRADE\',\'ONE_TO_ONE\');"> COMPLETE YOUR CREDITS </a>';
									}else{
										html+='<a class="design-btn bg-primary" href="javascript:void(0);" onclick="callChoiceForStudentModelRepeaters(\'complete\');">COMPLETE YOUR CREDITS </a>';
									}
									html+='<h6 class="mt-1 font-weight-semi-bold">Re-take a withdrawn/incomplete course or study another course</h6>'
								+'</div>';
							}
							// if(studentCredit.currentGradeId != studentCredit.nextGradeId){
								if(studentCredit.currentGradeId==8 || studentCredit.currentGradeId==9 || studentCredit.currentGradeId==10 || studentCredit.currentGradeId==19 || studentCredit.currentGradeId==20 || studentCredit.currentGradeId==21){
									html+=
										'<div class="col text-center">'
											+'<a class="design-btn bg-success" href="javascript:void(0);" onclick="callChoiceForStudentModel();">ENROLL IN HIGHER GRADE</a>'
										+'</div>';
								}else if(parseFloat(studentCredit.totalCredit) >= studentCredit.minmumCreditLimit && studentCredit.currentGradeId<=6){
									if(studentCredit.currentGradeId<3 
										|| (studentCredit.currentGradeId==3 && data.cgpaRule == 'Dont Apply') 
										|| (studentCredit.currentGradeId==3 && studentCredit.avgCumulativeGpa > 2.0 && data.cgpaRule == 'Apply')
										|| (studentCredit.currentGradeId>3) ){
											if(data.migrationOptionsForNextGrade!=undefined && data.migrationOptionsForNextGrade.length>0){
												html+=
												'<div class="col text-center">'
													+'<a class="design-btn bg-success" href="javascript:void(0);" onclick="callChoiceForStudentModel();">ENROLL IN HIGHER GRADE</a>'
												+'</div>';
											}
									}
								}else if(studentCredit.withDrawSubject == 0 ){
									if(studentCredit.currentGradeId==17 
										|| (studentCredit.currentGradeId>=11 && studentCredit.currentGradeId<16)
										|| (studentCredit.currentGradeId==16  && data.cgpaRule == 'Apply' && studentCredit.avgCumulativeGpa>2.0)
										|| (studentCredit.currentGradeId==16  && data.cgpaRule == 'Dont Apply')){
									if(data.migrationOptionsForNextGrade!=undefined && data.migrationOptionsForNextGrade.length>0){
										html+=
											'<div class="col text-center">'
												+'<a class="design-btn" href="javascript:void(0);" onclick="callChoiceForStudentModel();">ENROLL IN NEXT GRADE</a>'
											+'</div>';
									}
									}
								}
							// }
							html+=
						'</div>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>'
	+'</div>';
	html+='<div class="modal fade fade-scale" tabindex="-1" role="dialog" id="choiceForStudentModel">'
		+'<div class="modal-dialog modal-dialog-centered modal-md box-shadow-none">'
			+'<div class="modal-content">'
				+'<div class="modal-header pt-2 pb-2 bg-info text-center text-white">'
					+'<h5 class="modal-title" id="myLargeModalLabel">Learning Programs &nbsp;|&nbsp; Enroll In Higher Grade</h5>'
					+'<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>'
				+'</div>'
				+'<div class="modal-body">'
					+'<div class="d-flex flex-wrap justify-content-center">';
						$.each(data.migrationOptionsForNextGrade, function(k, migrationOption) {
							var displayFlag=false;
							if (migrationOption.isEligibleForMigration === 'Y') {
								if(migrationOption.learningProgram=='DUAL_DIPLOMA'){
									if(jQuery.inArray(studentCredit.nextGradeId, highSchoolGrade) !== -1) {
										displayFlag=true;
									}
								}else{
									displayFlag=true;
								}
							}
							if (displayFlag) {
								html +=
									'<div class="mb-2 text-center">'
										+ '<button type="button" class="send btn btn-info mb-2 btn-lg text-uppercase text-center mr-2" id="choiceBatch" data-dismiss="modal" '
											+ (migrationOption.learningProgram == 'BATCH' && data.matchSubjectCount > 0 ? 'disabled ' : '')
											+ 'onclick="callForStudentNextSession(' + migrationOption.nextGradeId + ',\'' + migrationOption.nextGradeName + '\',\'REGISTRATION_NEXT_GRADE\',\'' + migrationOption.learningProgram + '\');">'
											+ migrationOption.learningProgramLabel
										+ '</button>';
			
									if (data.matchSubjectCount > 0 && migrationOption.learningProgram == 'BATCH') {
										html += '<br/>Not eligible for this program';
									}
								html += '</div>';
							}
						});
						html+=
					'</div>'
					+'<div><span>If you wish to change your learning program, you can reach out to us at <a href="mailto:'+data.emailAccountSupport+'"> '+data.emailAccountSupport+'</a></span></div>'
				+'</div>'
				+'<div class="modal-footer"><button type="button" class="btn btn-danger btn-shadow pr-4 pl-4" data-dismiss="modal">Close</button></div>'
				+'<div style="clear: both"></div>'
			+'</div>'
		+'</div>'
	+'</div>'

	+'<div class="modal fade fade-scale" tabindex="-1" role="dialog" id="choiceForStudentModelRepeatersPAndC">'
		+'<div class="modal-dialog modal-dialog-centered modal-md box-shadow-none">'
			+'<div class="modal-content">'
				+'<div class="modal-header pt-2 pb-2 bg-info text-center text-white">'
					+'<h5 class="modal-title" id="myLargeModalLabel">Learning Programs &nbsp;|&nbsp; Repeat The Entire Grade</h5>'
					+'<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>'
				+'</div>'
				+'<div class="modal-body">'
					+'<div class="row">'
						+'<div class="col-md-12 mb-3 col-sm-12 col-12 mt-2 text-center">'
							+'<div class="d-flex justify-content-center flex-wrap">';
								$.each(data.migrationOptionsForImproveGrade, function(k, migrationOption){
									var displayFlag=false;
									if (migrationOption.isEligibleForMigration === 'Y') {
										if(migrationOption.learningProgram=='DUAL_DIPLOMA'){
											if(jQuery.inArray(studentCredit.currentGradeId, highSchoolGrade) !== -1) {
												displayFlag=true;
											}
										}else{
											displayFlag=true;
										}
									}
									if(displayFlag){
										html+=
										'<div class="mb-2 text-center">'
											+'<button type="button" class="send btn btn-info mb-2 btn-lg text-uppercase text-center mr-2" id="choice'+migrationOption.learningProgram+'" data-dismiss="modal" '
											+' onclick="callForStudentNextSession('+migrationOption.currentGradeId+',\''+migrationOption.currentGradeName	+'\',\'REGISTRATION_REPEAT_GRADE\',\''+migrationOption.learningProgram+'\');">'
												+migrationOption.learningProgramLabel
											+'</button>';
											// if (data.matchSubjectCount > 0 && migrationOption.learningProgram == 'BATCH') {
											// 	html += '<br/>Not eligible for this program';
											// }
										html += '</div>';
									}
								});
							html+=
							'</div>'
						+'</div>'
					+'</div>'
					+'<div><span>If you wish to change your learning program, you can reach out to us at <a href="mailto:'+data.emailAccountSupport+'"> '+data.emailAccountSupport+'</a></span></div>'
				+'</div>'
				+'<div class="modal-footer">'
					+'<button type="button" class="btn btn-danger btn-shadow pr-4 pl-4" onclick="callChoiceForStudentModelRepeatersPAndCBack(\'improve\');">Back</button>'
				+'</div>'
				+'<div style="clear: both"></div>'
			+'</div>'
		+'</div>'
	+'</div>'
	
	+'<div class="modal fade fade-scale" tabindex="-1" role="dialog" id="choiceForStudentModelRepeaters">'
		+'<div class="modal-dialog modal-dialog-centered modal-md box-shadow-none">'
			+'<div class="modal-content">'
				+'<div class="modal-header pt-2 pb-2 bg-info text-center text-white">'
					+'<h5 class="modal-title" id="myLargeModalLabel">Learning Programs &nbsp;|&nbsp; Improve Past Grades</h5>'
					+'<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>'
				+'</div>'
				+'<div class="modal-body">'
					+'<div class="row">'
						+'<div class="col-md-12 mb-3 col-sm-12 col-12 mt-2 text-center">'
							+'<div class="d-flex justify-content-center flex-wrap">';
								if(studentCredit.takeIndividualButton == 'Y'){
									html+=
									'<button type="button" class="send btn btn-info  btn-lg text-uppercase text-center mr-2" id="choiceIndividualCourseImprove" data-dismiss="modal" '
										+'onclick="callForStudentNextSession('+studentCredit.currentGradeId+',\''+studentCredit.currentGrade+'\',\'REGISTRATION_IMPORVE_GRADES\',\''+data.registrationType+'\');">'
										+'Take an individual course'
									+'</button>';
								}
								html+=
								'<button type="button" class="send btn btn-info ml-1  btn-lg text-uppercase text-center mr-2" id="choiceRepeatEntire" data-dismiss="modal" onclick="callChoiceForStudentModelRepeatersPAndC();">'
									+'Repeat the entire grade'
								+'</button>'
							+'</div>'
						+'</div>'
					+'</div>'
					+'<div><span>If you wish to change your learning program, you can reach out to us at <a href="mailto:'+data.emailAccountSupport+'"> '+data.emailAccountSupport+'</a></span></div>'
				+'</div>'
				+'<div class="modal-footer"><button type="button" class="btn btn-danger btn-shadow pr-4 pl-4" data-dismiss="modal">Close</button></div>'
				+'<div style="clear: both"></div>'
			+'</div>'
		+'</div>'
	+'</div>';
	return html;
}

function getStudentMigrationHeader(csr){
	var html=
	'<input type="hidden" id="userId" name="userId" value="'+csr.userId+'">'
	+'<input type="hidden" id="standardId" name="standardId" value="'+csr.standardId+'" min_limit="'+csr.minCourseLimitMigration+'" max_limit="'+csr.maxCourseLimitMigration+'" upper_band="'+csr.upperBandLimitMigration+'">'
	+'<input type="hidden" id="enrollmentType" name="enrollmentType" value="'+csr.enrollmentType+'">'
	+'<input type="hidden" id="registrationType" name="registrationType" value="'+csr.registrationType+'">'
	+'<input type="hidden" id="courseProviderId" name="courseProviderId" value="'+csr.courseProviderId+'">'
	+'<input type="hidden" id="selectedSubjects" name="selectedSubjects" value="'+csr.selectedSubjectsAsString+'">'
	+'<input type="hidden" id="payMode" name="payMode" value="'+csr.paymentMode+'" data-paymode="'+csr.paymentMode+'">'
	+'<input type="hidden" id="controlType" name="controlType" value="">'
	+'<input type="hidden" id="totalCreditInput" name="totalCreditInput" value="'+csr.totalCredit+'">'
    +'<div class="app-page-title m-0 pl-0">'
        +'<div class="page-title-wrapper">'
            +'<div class="page-title-heading w-100">'
                +'<div class="page-title-icon">'
                    +'<i class="fa fa-book text-primary"> </i>'
                +'</div>'
                +'<div class="flex-grow-1">'
                    +csr.enrollmentTypeString
                    +'<span class="text-primary d-inline-block ml-1">';
					if(csr.registrationType=='ONE_TO_ONE_FLEX'){
						html+=
						`<select class="form-control" name="gradeId" id="gradeId" onchange="switchGrade()" `+(csr.enrollmentType=='REGISTRATION_IMPORVE_GRADES'?'disabled':'')+`>`
							+getStandardContentForFlexy()
						html+=`</select>`;
					}else{
						html+=' ( '+csr.standardName+' )';
					}
				html+=
                    '</span>'
                    +' - '
                    +csr.registrationTypeString
                +'</div>'
            +'</div>'
        +'</div>'
    +'</div>'
    return html;
}

function renderCourseSelectionContent(csr) {
	displaySection2()
	var html=getCourseSelectionContent(csr);
    $('#divNextSessionCourseChoose').html(html);   
    $('#courseFirstListOpen').val(1);
    $(".btn-finish").hide();
    $('[data-toggle="tooltip"]').tooltip({
		html: true
	});
    var mandatoryCount=0;
	var totalSelectedCourseCount=csr.selectedSubjects!=null?csr.selectedSubjects.length:0;
	$.each(csr.selectedSubjects, function(k, courseDetails) {
		if(courseDetails.courseTypeOriginal == 'Advanced Placement'){
			apCourseSelectionFlag=true;
		}
		if(courseDetails.courseMandatory==1){
			mandatoryCount++;
		}
	});
	if(totalSelectedCourseCount==mandatoryCount){
		$('.removeAllCourses').hide()
	}
	// setTimeout(function(){
	// 	removeSlideAnimationClass();
	// },1500);
	// if($("#migrationCourseSelectDiv .migration-Content").length<1){
	// 	$($("#migrationCourseSelectDiv").html(migrationCourseSelection(csr)))
	// }
	$('.accordion .a-title').unbind().bind('click', function(){
        $(this).parent().closest('li').find('.a-content').stop().slideToggle();
        $(this).find('.plus-icon').toggleClass('fa-minus fa-plus')
        $(this).parent().closest('li').siblings().find('.plus-icon').removeClass('fa-plus');
        $(this).parent().closest('li').siblings().find('.plus-icon').removeClass('fa-minus');
        $(this).parent().closest('li').siblings().find('.a-content').slideUp();
    });

    $('.custom-tab-wrapper li a:not(:first)').addClass('inactive');
    $('.custom-tab-item').hide();
    $('.custom-tab-item:first').show();
    $('.custom-tab-wrapper li a').unbind().bind('click', function(){
        var tabID = $(this).attr('id'), tabFullForm = $(this).attr('full-form')
        if ($(this).hasClass('inactive')) {
            $('.custom-tab-wrapper li a').addClass('inactive');
            $('.custom-tab-wrapper li').removeClass('active-tab');
            $(this).removeClass('inactive')
            $(this).parent().addClass('active-tab')

            $('.custom-tab-item').hide();
            $('#' + tabID + 'C').slideDown('slow');
            $('.accordion li:first-child .a-content').show();
        }
    });
    // $(".course-radio-btn-wrapper ul li").unbind().bind('click', function(){
    // 	if($('.course-radio-btn-wrapper ul li input').is(":checked", true) ){
    // 		$(this).parent().parent().removeClass('deactive-course-selection')
    // 	}
    // })

    $("#noTeacherAssistanceAvailableNo").on("click", function(){
        $(".course-check-box input").prop("checked", false);
    });

    $('.course-name').click(function(){
        if($(this).hasClass('open-dropdown')){
            $(this).parent().css({"border-color":"#dcdcdc"});
            $(this).parent().parent().css({"border-color":"#dcdcdc"});
            $(this).parent().parent().siblings().find('.bg-border').css({"border-color":"#e6d7fb", "background":"transparent"});
            $(this).parent().parent().siblings().css({"border-color":"#e6d7fb"});
            // $('.course-radio-btn-wrapper').parent().find(".course-name a").css({"color":"#333"});
        }
        else{
            $(this).parent().css({"border-color":"#e6d7fb"});
            $(this).parent().parent().css({"border-color":"#e6d7fb"});
        }
    });
    	var standardId=$('#standardId').val();
	var totalCredit=$('#totalCreditInput').val();
	var creditsLimitsOver=creditLimitOver(standardId, totalCredit-1);
	if(creditsLimitsOver){
		$("#oneTimeModal").val(true);
	}else{
		$("#oneTimeModal").val(false);
	}
}

function getCourseSelectionContent(csr){
	var html=''
	// if(csr.registrationType=='ONE_TO_ONE' || csr.registrationType=='BATCH' || csr.registrationType=='SCHOLARSHIP' || csr.registrationType=='SSP'){
		html+=
       	'<div class="mb-3 card">'
			+'<div class="card-body migration-Content">'
				+'<div class="full step-3-skeleton skeleton-wrapper"></div>'
				+'<div id="courseSubjectDetails">'
					if(csr.standardId<11 && csr.enrollmentType!='REGISTRATION_IMPORVE_GRADES'){
						if(csr.minCourseLimit>csr.totalCredit){
							html+=
							'<div class="form-row m-0">'
								+'<div class="form-holder w-100 selected-course-view">'
									+'<div class="full">'
										+'<h3 class="use-credit white-txt-color" style="background:#001b47">'
											+'YOU NEED A MINIMUM OF '+csr.minCourseLimit+' CREDITS'
										+'</h3>'
									+'</div>'
								+'</div>'
							+'</div>';
						}
					}
					html+=
					'<div class="course-img-wrapper" style="min-height:275px;display:'+((csr.standardId>=11 && csr.standardId<=17)?"block;":"none;")+'">'
						+'<div class="form-row" style="justify-content: space-between;">'	
							+'<div class="form-holder selected-course-view" style="width:100%">'
								+'<div class="fixed-item full">'
									+'<div class="full selected-course primary-bg primary-border-color head">'
										+'<h4 id="totalCredit" totalCredit="'+csr.totalCredit+'" class="title angle-arrow primary-bg white-txt-color">';
											if(csr.selectedSubjects!=null && csr.selectedSubjects.length>0){
												if(csr.registrationType=='BATCH'){
													html+=csr.selectedSubjects.length;
													html+=' Mandatory / Fixed ';
													if(csr.selectedSubjects.length>1){
														html+=' Courses';
													}else{
														html+=' Course';
													}
													html+=' worth '+csr.totalCredit+' credits';
												}else{
													html+='You have '+csr.selectedSubjects.length;
													if(csr.selectedSubjects.length>1){
														html+=' Courses';
													}else{
														html+=' Course';
													}
													html+=' worth '+csr.totalCredit+' credits';
												}
											}else{
												html+='Please select a course';
											}
										html+=
										'</h4>';
										// if(csr.selectedSubjects!=null && csr.selectedSubjects.length>0){
										// 	html+='<span class="removeAllCourses" title="Remove All Selected Courses" onclick="removeAllCourseWarning()">Remove ALL&nbsp;<i class="fa fa-trash"></i></span>';
										// }
									html+='</div>'
									+'<div class="full selected-course-view">'
										+'<div class="selected-course primary-border-color">'
											+'<div class="selected-course-list">';
												if(csr.selectedSubjects!=null && csr.selectedSubjects.length>0){
													html+=
													'<div class="course-category">';
														$.each(csr.selectedSubjects, function(k, courseDetails) {
															html+=
															'<div class="course-item'+(csr.controlType=="add" && csr.lastCourseId == courseDetails.courseId?' slide-animation':'')+'" seletedSubject="'+courseDetails.courseId+'">'
																+'<div class="bhagat">'
																	+'<span class="count">'+(k+1)+'.&nbsp;</span>'
																	+'<div class="course-name-wrapper">'
																		+'<h4 class="course-name">'
																			+ courseDetails.courseName + ' (' + courseDetails.creditScore + ' Credit) '
																			+'<span class="price">'
																				+' <b class="ml-1">';
																					if(csr.showCourseFee =='Y'){
																						html+=courseDetails.coursePriceSelectedString;
																					}
																					html+=
																				'</b>'
																			+'</span>'
																		+'</h4>'
																	+'</div>'
																+'</div>'
																+'<div class="add-course-btn">'
																	// +'<span class="white-txt-color mr-1"><i class="fa fa-check"></i></span>';
																	if(courseDetails.upgradeCourses!=null && courseDetails.upgradeCourses.length>0){
																		$.each(courseDetails.upgradeCourses, function(k, upgradeCourse) {
																			html+=
																			'<span class="remove-icon upgradeCourses primary-txt-color" ';
																				if(upgradeCourse.warningMessage==''){
																					html+='onclick="confirmUpgradeCourse('+courseDetails.categoryId+','+courseDetails.courseId+','+upgradeCourse.courseId+')">';
																				}else{
																					html+='onclick="upgradeCourse('+courseDetails.categoryId+','+courseDetails.courseId+','+upgradeCourse.courseId+',\''+upgradeCourse.warningMessage+'\')">';
																				}
																				html+=upgradeCourse.buttonLabel;
																				if(courseDetails.courseTypeOriginal == 'Regular'){
																					html+=' <i class="fa fa-arrow-up" title="'+upgradeCourse.buttonLabel+'"></i>';
																				}else{
																					html+=' <i class="fa fa-arrow-down" title="'+upgradeCourse.buttonLabel+'"></i>';
																				}
																			html+=
																			'</span>';
																			if(upgradeCourse.courseType == "ADV"){
																				html+='<span class="remove-icon text-primary white-bg upgradeCourses" style="display:inline-block;border-radius:4px;" data-toggle="tooltip" title="Advanced courses have more assessments & assignments as compared to regular courses and contribute to a higher GPA."><i class="fa fa-info-circle m-0"></i></span>';
																			}else if(upgradeCourse.courseType == "HON"){
																				html+='<span class="remove-icon text-primary white-bg upgradeCourses" style="display:inline-block;border-radius:4px;" data-toggle="tooltip" title="Honors courses have more assessments & assignments as compared to regular courses and contribute to a higher GPA."><i class="fa fa-info-circle m-0"></i></span>';
																			};
																		});
																	}
																	if(courseDetails.courseDescriptionUrl!=null && courseDetails.courseDescriptionUrl!=''){
																		// html+='<a href="'+courseDetails.courseDescriptionUrl+'" target="_blank" class="white-txt-color" style="font-weight:500;text-decoration:underline;display:inline-block;padding:0px 5px;font-size:13px">View Course Details</a>';
																		html+=`<a href="javaScript:void(0);" onclick="openCourseDetailModal('`+courseDetails.courseDescriptionUrl+`', '`+courseDetails.courseName+`')" class="white-txt-color" style="font-weight:500;text-decoration:underline;display:inline-block;padding:0px 5px;font-size:13px">Course Summary</a>`;
																	}
																html+=
																'</div>'
															+'</div>';
														});
													html+=
														// '<div id="addAndRemoveLoader" class="loader-bg" style="display: none;">'
														// 	+'<div class="loader">Please Wait... <span></span></div>'
														// +'</div>'
													'</div>';
													if(csr.courseMaterialFeeDetails!=null && csr.courseMaterialFeeDetails.totalEntityFee>0){
														html+=
														'<div class="course-category">'
															+'<span class="category-name">External Material Fee</span>'
															+'<div class="course-item">'
																+'<div class="course-name-wrapper" id="totalEntityFee">';
																$.each(csr.courseMaterialFeeDetails.description, function(k, desc) {
																	html+=
																	'<h4 class="course-name">'
																		+desc
																	+'</h4>';
																});
																html+=
																'</div>'
															+'</div>'
															+'<div class="course-item">'
																+'<div class="course-name-wrapper">'
																	+'<h4 class="course-name">External Material Fee: <span class="price"> '+csr.courseMaterialFeeDetails.totalEntityFeeString+'</span></h4>'
																+'</div>'
															+'</div>'
														+'</div>';
													}
												}
											html+=
											'</div>'
										+'</div>'
									+'</div>'
								+'</div>'
							+'</div>'		
						+'</div>' 
					+'</div>'

					+'<div class="course-selection-wrapper" style="min-height:275px; display:'+((csr.standardId>=11 && csr.standardId<=17)?"none;":"block;")+'">'
						+'<div class="form-row m-0" style="justify-content: space-between;">'
							+'<div class="form-holder selected-course-view">'
								+'<div class="fixed-item full">'
									+'<div class="full selected-course primary-bg primary-border-color head bg-info">'
									+'<h4 id="totalCredit" totalCredit="'+csr.totalCredit+'" class="title angle-arrow primary-bg white-txt-color">';
										if(csr.selectedSubjects!=null && csr.selectedSubjects.length>0){
											if(csr.registrationType=='BATCH'){
												html+=csr.selectedSubjects.length;
												html+=' Mandatory / Fixed ';
												if(csr.selectedSubjects.length>1){
													html+=' Courses';
												}else{
													html+=' Course';
												}
												html+=' worth '+csr.totalCredit+' credits';
											}else{
												html+='You have '+csr.selectedSubjects.length;
												if(csr.selectedSubjects.length>1){
													html+=' Courses';
												}else{
													html+=' Course';
												}
												html+=' worth '+csr.totalCredit+' credits';
											}
										}else{
											html+='Please select a course';
										}
										html+=
										'</h4>';
										if(csr.selectedSubjects!=null && csr.selectedSubjects.length>0){
											html+='<span class="removeAllCourses text-danger" title="Remove All Selected Courses" onclick="removeAllCourseWarning()">Remove ALL&nbsp;<i class="fa fa-trash"></i></span>';
										}
									html+=
									'</div>'
									+'<div class="full selected-course-view">'
										+'<div class="selected-course primary-border-color">'
											+'<div class="selected-course-list">';
												if(csr.selectedSubjects!=null && csr.selectedSubjects.length>0){
													html+=
													'<div class="course-category">';
														$.each(csr.selectedSubjects, function(k, courseDetails) {
															html+=
															'<div class="course-item'+(csr.controlType=="add" && csr.lastCourseId == courseDetails.courseId?' slide-animation':'')+'" seletedSubject="'+courseDetails.courseId+'">'
																+'<div class="bhagat">'
																	+'<span class="count">'+(k+1)+'.&nbsp;</span>'
																	+'<div class="course-name-wrapper">'
																		+'<h4 class="course-name">'
																			+ courseDetails.courseName + ' (' + courseDetails.creditScore + ' Credit) '
																			+'<span class="price">'
																				+' <b class="ml-1">';
																					if(csr.showCourseFee =='Y'){
																						html+=courseDetails.coursePriceSelectedString;
																					}
																					html+=
																				'</b>'
																			+'</span>'
																		+'</h4>'
																	+'</div>'
																+'</div>'
																+'<div class="add-course-btn">';
																	//+'<span class="white-txt-color mr-1"><i class="fa fa-check"></i></span>';
																	if(courseDetails.upgradeCourses!=null && courseDetails.upgradeCourses.length>0){
																		$.each(courseDetails.upgradeCourses, function(k, upgradeCourse) {
																			html+=
																			'<span class="remove-icon upgradeCourses primary-txt-color text-info" ';
																				if(upgradeCourse.warningMessage==''){
																					html+='onclick="confirmUpgradeCourse('+courseDetails.categoryId+','+courseDetails.courseId+','+upgradeCourse.courseId+')">';
																				}else{
																					html+='onclick="upgradeCourse('+courseDetails.categoryId+','+courseDetails.courseId+','+upgradeCourse.courseId+',\''+upgradeCourse.warningMessage+'\')">';
																				}
																				html+=upgradeCourse.buttonLabel;
																				if(courseDetails.courseTypeOriginal == 'Regular'){
																					html+='&nbsp;'
																					+'<i class="fa fa-arrow-up" title="'+upgradeCourse.buttonLabel+'"></i>';
																				}else{
																					html+='&nbsp;'
																					+'<i class="fa fa-arrow-down" title="'+upgradeCourse.buttonLabel+'"></i>';
																				}
																			html+=
																			'</span>';
																			if(upgradeCourse.courseType == "ADV"){
																				html+='<span class="remove-icon text-primary white-bg upgradeCourses" style="display:inline-block;border-radius:4px;" data-toggle="tooltip" title="Advanced courses have more assessments & assignments as compared to regular courses and contribute to a higher GPA."><i class="fa fa-info-circle m-0"></i></span>';
																			}else if(upgradeCourse.courseType == "HON"){
																				html+='<span class="remove-icon text-primary white-bg upgradeCourses" style="display:inline-block;border-radius:4px;" data-toggle="tooltip" title="Honors courses have more assessments & assignments as compared to regular courses and contribute to a higher GPA."><i class="fa fa-info-circle m-0"></i></span>';
																			};
																		});
																	}
																	if(courseDetails.courseMandatory==1){
																		if(csr.registrationType != 'BATCH'){
																			html+=
																		'<span class="mandatory-btn">Mandatory</span>';
																		}
																	}else if(courseDetails.courseMandatory==0){
																		html+=
																		'<span class="remove-icon removeAllCourses text-danger" onclick="removeCourse(\''+courseDetails.courseId+'\',\''+courseDetails.categoryId+'\',\'ft_courses\')">Remove&nbsp;<i class="fa fa-trash" title="Remove Course"></i></span>';
																	}
																	if(courseDetails.courseDescriptionUrl!=null && courseDetails.courseDescriptionUrl!=''){
																		// html+='<a href="'+courseDetails.courseDescriptionUrl+'" target="_blank" class="white-txt-color" style="font-weight:500;text-decoration:underline;display:inline-block;padding:0px 5px;font-size:13px">View Course Details</a>';
																		if(csr.registrationType == 'BATCH'){
																			html+=`<a href="javaScript:void(0);" onclick="openCourseDetailModal('`+courseDetails.courseDescriptionUrl+`', '`+courseDetails.courseName+`')" class="white-txt-color" style="font-weight:500;text-decoration:underline;display:inline-block;padding:0px 5px;font-size:13px">Course Summary</a>`;
																		}
																	}
																html+=
																'</div>'
															+'</div>';
														});
													html+=
													'</div>';
													if(csr.courseMaterialFeeDetails!=null && csr.courseMaterialFeeDetails.totalEntityFee>0){
														html+=
														'<div class="course-category">'
															+'<span class="category-name">External Material Fee</span>'
															+'<div class="course-item">'
																+'<div class="course-name-wrapper" id="totalEntityFee">';
																$.each(csr.courseMaterialFeeDetails.description, function(k, desc) {
																	html+=
																	'<h4 class="course-name">'
																		+desc
																	+'</h4>';
																});
																html+=
																'</div>'
															+'</div>'
															+'<div class="course-item">'
																+'<div class="course-name-wrapper">'
																	+'<h4 class="course-name">External Material Fee: <span class="price"> '+csr.courseMaterialFeeDetails.totalEntityFeeString+'</span></h4>'
																+'</div>'
															+'</div>'
														+'</div>';
													}
												}
											html+=
											'</div>'
										+'</div>'
									+'</div>'
								+'</div>'
							+'</div>';
							var availeCourseForSelection=false;
							$.each(csr.availableCourses, function(availableCoursesLoop, courseDetails) {
								if(courseDetails.subjects.length>0){
									availeCourseForSelection=true;
								}
							});
							if(availeCourseForSelection){
								html+=
								'<div class="form-holder course-selection-list">'
									+'<ul class="custom-tab-wrapper">'
										+'<li class="primary-bg white-txt-color active-tab">'
										+'<a href="javascript:void(0)" id="ft_courses">'
											+'<label class="full_form">';
												if(csr.minCourseLimit>csr.totalCredit){
													if(csr.maxCourseLimit-csr.totalCredit <= 1){
														html+='PLEASE SELECT A COURSE ';
													}else{
														html+='PLEASE SELECT COURSES ';
													}
													if(csr.totalCredit<csr.maxCourseLimit){
														if(csr.totalCredit==0){
															html+='WORTH '+(csr.minCourseLimit);
														}else{
															html+='WORTH '+(csr.maxCourseLimit-csr.totalCredit);
														}
													}
													if(csr.maxCourseLimit-csr.totalCredit <= 1){
														html+=' CREDIT';
													}else{
														html+=' CREDITS';
													}
												}else{
													html+='SELECT EXTRA COURSES';
												}
												html+='<br>'
													+'<span style="font-size:12px">';
														if(csr.registrationType == 'SCHOLARSHIP'){
															html+=
															'(PLEASE NOTE - LIVE CLASSES ARE NOT OFFERED IN THIS PROGRAM)';
														}
														
													html+='</span>'
												+'</label>';
												if(csr.eligibleForRecommendedCourse){
													if(csr.enrollmentType=='REGISTRATION_IMPORVE_GRADES'){

													}else{
														html+='<button class="btn white-bg primary-txt-color pull-right" style="margin:0px;font-weight:bold;padding:4px !important;text-transform:capitalize;box-shadow:0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.70);font-size:13px" onclick="recommendedCourse()">Add Recommended Courses</button>'
													}
												}
											html+=
											'</a>'
										+'</li>'
									+'</ul>'
									+'<div id="ft_coursesC" class="full-time-courses custom-tab-item">'
										+'<div class="course-selection-list">'
											+'<ul class="accordion">';
												$.each(csr.availableCourses, function(availableCoursesLoop, courseDetails) {
													if(courseDetails.subjects.length>0){
														html+=
														'<li>'
															+'<div class="student-details-info">'
																+'<div class="full">'
																	+'<h4 id="'+(availableCoursesLoop+1)+'" class="a-title courseSelectId-'+courseDetails.courseId+'" courseCreditLimit="'+courseDetails.courseCreditLimit+'" parentSubjectId="'+courseDetails.parentSubjectId+'">'
																		+courseDetails.courseName;
																		if(courseDetails.courseDescription!=null && courseDetails.courseDescription!=''){
																			html+='<i class="fa fa-info-circle" data-toggle="tooltip" title="'+courseDetails.courseDescription+'"></i>';
																		}
																		html+=
																		'<i class="fa plus-icon fa-angle-down text-primary"></i>'
																	+'</h4>'
																+'</div>'
																+'<div class="a-content'+(courseDetails.subjects>6?'overflow-auto':'')+'">';
																	$.each(courseDetails.subjects, function(loop1, subject) {
																		html+=
																		'<div class="course-item border-around">'
																				+'<div class="course-icon"><i class="fa fa-book"></i></div>'
																				+'<div class="course-name-wrapper bg-border">'
																					+'<h4 class="course-name open-dropdown d-flex align-items-center">'
																						+'<div  style="margin-right:auto">'
																							+'<label id="course_name_'+subject.subjectId+'" for="course_id_'+subject.subjectId+'" class="m-0 course-type-title primary-txt-color">'
																								+subject.subjectName
																							+'</label>'
																							+'<ul class="no-teacher pl-0">';
																								if(subject.remarks == '0' && csr.registrationType != 'SCHOLARSHIP'){
																									html+='<li style="float:none;">&#8226; This course does not offer live classes</li>';
																								}
																								if(SHOW_PAYMENT_OPTION=='Y'){
																									if(subject.materialFee >0 ){
																										html+='<li style="float:none;">&#8226; '+subject.materialFeeString+' extra for External Materials.</li>';
																									}
																									if($('#registrationType').val()!="ONE_TO_ONE_FLEX"){
																										if(subject.additionalFee !=null && subject.additionalFee > 0){
																											var creditsLimitsOver=creditLimitOver(csr.standardId, csr.totalCredit);
																											if(creditsLimitsOver){
																												html+='<li style="float:none;">&#8226; '+subject.subjectPriceString+' extra for '+subject.courseType+' Courses.</li>';
																											}else{
																												html+='<li style="float:none;">&#8226; '+subject.additionalFeeString+' extra for '+subject.courseType+' Courses.</li>';
																											}
																										}
																									}
																								}
																								if(csr.enrollmentType=='REGISTRATION_IMPORVE_GRADES'){
																									html+='<li style="float:none;">&#8226; Live classes with teacher is not available.</li>';
																								}
																								html+=
																							'</ul>'
																						+'</div>'
																						+'<div style="text-align: center;display: flex;flex-direction: column;width: 20%;align-items: center;">'
																							+'<label class="m-0 course-type-title primary-txt-color pull-right">';
																								if(csr.showCourseFee =='Y'){
																									html+=`<p class="mb-1">`+subject.subjectPriceString+`</p>`;
																								}
																								html+=
																								subject.subjectCredit+' Credit&nbsp;'
																							+'</label>';
																							if(subject.courseDescriptionUrl!=null && subject.courseDescriptionUrl!=''){
																								html+=`<a href="javaScript:void(0);" onclick="openCourseDetailModal('`+subject.courseDescriptionUrl+`', '`+subject.subjectName+`')" class="view-course-details theme-text" style="font-size:11px; color:#007fff !important;">Course Summary</a>`;
																								// html+='<a href="'+subject.courseDescriptionUrl+'" target="_blank" class="view-course-details theme-text">View Course Details</a>'
																							}
																						html+=
																						'</div>'
																						+'<div>'
																							+'<label for="course_id_'+subject.subjectId+'" class="m-0 add-course-button primary-bg secondary-hov-bg white-txt-color bg-info text-white cursor">'
																								+'<input class="add-course-checkbox" id="course_id_'+subject.subjectId+'"'
																								+' value="'+subject.subjectId+'" onclick="assignEvent('+(loop1+1)+','+subject.subjectId+','+courseDetails.courseId+',\'ft_courses\','+courseDetails.userReachedMaxLimit+','+courseDetails.courseCreditLimit+','+courseDetails.courseSelectedCredit+','+subject.subjectCredit+','+(csr.registrationType=='SCHOLARSHIP' ? 1 : subject.remarks)+',\''+subject.courseType+'\',\'add\','+csr.standardId+','+csr.totalCredit+',\''+subject.courseFeeString+'\')" type="radio" name="course_id_'+courseDetails.courseId+'">'
																								+'<p><i class="fa fa-plus white-txt-color" title="add Course"></i></p>'
																								+'<p>Add</p>'
																							+'</label>'
																						+'</div>'
																					+'</h4>'	
																				+'</div>'
																		+'</div>';
																	});
																	html+=
																'</div>'
															+'</div>'
														+'</li>';
													}
												});
											html+=
											'</ul>'
										+'</div>'
									+'</div>'
								+'</div>';
							}
						html+=
						'</div>'
					+'</div>'
				+'</div>'
				
				+'<div class="full mt-2">'
					+'<button class="btn theme-bg text-white pl-4 pr-4 pull-left" onclick="backCourseSelection(1);">Back</button>'
					+'<input type="submit" class="btn btn-next btn-fill pl-4 pr-4 btn-wd pull-right text-white" style="background-color:#007fff !important" name="sessionPaymentSubmit" id="nextSesionStep" value="Next" onclick="submitCourse();">'
				+'</div>'
				+noTeacherAssistanceAvailableModal(csr)
				+apCourseSelectionWarningModal()
				+removeAllCorusesModal()
				+creditsLimitsModal()
				+creditsLimitsOverModal()
				+changeSelectedGradeModal()
				+upgradeCorusesModal()
				+'<div id="payment-selection-details"></div>'
			+'</div>'	
		+'</div>';
	// }
	return html;
}

// function getFlexyCourseSelectionContent(csr){
// 	var html=
// 		`<div class="full my-3">
// 			<h3 class="text-primary mb-0 font-weight-semi-bold">COURSE SELECTION</h3>
// 			<p class="font-size-lg mb-0">Select Course form the following grade and options provided below.</p>
// 		</div>
// 		<div class="row">
// 			<div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
// 				<label class="full">Select Flexy Grade</label>
// 				<select class="form-control" name="gradeId" id="gradeId" onchange="getCourseCategoryByGradeId()">`
// 					+getStandardContentForFlexy()
// 				html+=`</select>
// 			</div>
// 			<div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
// 				<label class="full">Category</label>
// 				<select class="form-control" name="courseCategory" id="courseCategory">
// 				</select>
// 			</div>
// 			<div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
// 				<label>Keyword</label>
// 				<input type="text" name="courseName" id="courseName" class="form-control" />
// 			</div>
// 			<div class="col-12 text-right">
// 				<label class="full">&nbsp;</label>
// 				<a href="javascript:void(0)" class="btn btn-primary" onclick="getAllCourseDetails('N', '');">Search</a>
// 			</div>
// 		</div>`;
// 	return html;
// }


function migrationCourseSelection(csr){
	
	var html = 
		'<div class="migration-Content mt-3">'
			+'<div id="courseSubjectDetails">'
				+'<div class="course-selection-wrapper" style="min-height:275px; display:'+((csr.standardId>=11 && csr.standardId<=17)?"none;":"block;")+'">'
					+'<div class="form-row m-0" style="justify-content: space-between;">'
						+'<div class="form-holder selected-course-view">'
							+'<div class="fixed-item full">'
								+'<div class="full selected-course primary-bg primary-border-color head bg-info">'
								+'<h4 id="totalCredit" totalCredit="'+csr.totalCredit+'" class="title angle-arrow primary-bg white-txt-color">';
									if(csr.selectedSubjects!=null && csr.selectedSubjects.length>0){
										if(csr.registrationType=='BATCH'){
											html+=csr.selectedSubjects.length;
											html+=' Mandatory / Fixed ';
											if(csr.selectedSubjects.length>1){
												html+=' Courses';
											}else{
												html+=' Course'; 
											}
											html+=' worth '+csr.totalCredit+' credits';
										}else{
											html+='You have '+csr.selectedSubjects.length;
											if(csr.selectedSubjects.length>1){
												html+=' Courses';
											}else{
												html+=' Course';
											}
											html+=' worth '+csr.totalCredit+' credits';
										}
									}else{
										html+='Please select a course';
									}
								html+=
								'</h4>';
								if(csr.selectedSubjects!=null && csr.selectedSubjects.length>0){
									html+='<span class="removeAllCourses text-danger" title="Remove All Selected Courses" onclick="removeAllCourseWarning()">Remove ALL&nbsp;<i class="fa fa-trash"></i></span>';
								}
								html+=
								'</div>'
								+'<div class="full selected-course-view">'
									+'<div class="selected-course primary-border-color">'
										+'<div class="selected-course-list">';
											if(csr.selectedSubjects!=null && csr.selectedSubjects.length>0){
												html+=
												'<div class="course-category">';
													$.each(csr.selectedSubjects, function(k, courseDetails) {
														html+=
														'<div class="course-item'+(csr.controlType=="add" && csr.lastCourseId == courseDetails.courseId?' slide-animation':'')+'" seletedSubject="'+courseDetails.courseId+'">'
															+'<div class="bhagat">'
																+'<span class="count">'+(k+1)+'.&nbsp;</span>'
																+'<div class="course-name-wrapper">'
																	+'<h4 class="course-name">'
																		+ courseDetails.courseName + ' (' + courseDetails.creditScore + ' Credit) '
																		+'<span class="price">'
																			+' <b class="ml-1">';
																				if(csr.showCourseFee =='Y'){
																					html+=courseDetails.coursePriceSelectedString;
																				}
																				html+=
																			'</b>'
																		+'</span>'
																	+'</h4>'
																+'</div>'
															+'</div>'
															+'<div class="add-course-btn">'
																//+'<span class="white-txt-color mr-1"><i class="fa fa-check"></i></span>';
																if(courseDetails.upgradeCourses!=null && courseDetails.upgradeCourses.length>0){
																	$.each(courseDetails.upgradeCourses, function(k, upgradeCourse) {
																		html+=
																		'<span class="remove-icon upgradeCourses primary-txt-color text-info" ';
																			if(upgradeCourse.warningMessage==''){
																				html+='onclick="confirmUpgradeCourse('+courseDetails.categoryId+','+courseDetails.courseId+','+upgradeCourse.courseId+')">';
																			}else{
																				html+='onclick="upgradeCourse('+courseDetails.categoryId+','+courseDetails.courseId+','+upgradeCourse.courseId+',\''+upgradeCourse.warningMessage+'\')">';
																			}
																			html+=upgradeCourse.buttonLabel;
																			if(courseDetails.courseTypeOriginal == 'Regular'){
																				html+='&nbsp;'
																				+'<i class="fa fa-arrow-up" title="'+upgradeCourse.buttonLabel+'"></i>';
																			}else{
																				html+='&nbsp;'
																				+'<i class="fa fa-arrow-down" title="'+upgradeCourse.buttonLabel+'"></i>';
																			}
																		html+=
																		'</span>';
																	});
																}
																if(courseDetails.courseMandatory==1){
																	if(csr.registrationType != 'BATCH'){
																		html+=
																	'<span class="mandatory-btn">Mandatory</span>';
																	}
																}else if(courseDetails.courseMandatory==0){
																	html+=
																	'<span class="remove-icon removeAllCourses text-danger" onclick="removeCourse(\''+courseDetails.courseId+'\',\''+courseDetails.categoryId+'\',\'ft_courses\')">Remove&nbsp;<i class="fa fa-trash" title="Remove Course"></i></span>';
																}
																if(courseDetails.courseDescriptionUrl!=null && courseDetails.courseDescriptionUrl!=''){
																	html+='<a href="'+courseDetails.courseDescriptionUrl+'" target="_blank" class="white-txt-color" style="font-weight:400;text-decoration:underline;display:inline-block;padding:0px 5px;font-size:13px">View Course Details</a>';
																}
															html+=
															'</div>'
														+'</div>';
													});
												html+=
												'</div>';
												if(csr.courseMaterialFeeDetails!=null && csr.courseMaterialFeeDetails.totalEntityFee>0){
													html+=
													'<div class="course-category">'
														+'<span class="category-name">External Material Resource Fee</span>'
														+'<div class="course-item">'
															+'<div class="course-name-wrapper" id="totalEntityFee">';
															$.each(csr.courseMaterialFeeDetails.description, function(k, desc) {
																html+=
																'<h4 class="course-name">'
																	+desc
																+'</h4>';
															});
															html+=
															'</div>'
														+'</div>'
														+'<div class="course-item">'
															+'<div class="course-name-wrapper">'
																+'<h4 class="course-name">External Material Fee: <span class="price"> '+csr.courseMaterialFeeDetails.totalEntityFeeString+'</span></h4>'
															+'</div>'
														+'</div>'
													+'</div>';
												}
											}
										html+=
										'</div>'
									+'</div>'
								+'</div>'
							+'</div>'
						+'</div>';
						var availeCourseForSelection=false;
						$.each(csr.availableCourses, function(availableCoursesLoop, courseDetails) {
							if(courseDetails.subjects.length>0){
								availeCourseForSelection=true;
							}
						});
						if(availeCourseForSelection){
							html+=
							'<div class="form-holder course-selection-list">'
								+'<div class="flexy-course-wrapper">'
									+'<div class="flexy-course-view-wrapper overflow-y-auto rounded-10 p-4">'
										+'<div class="row">';
											$.each(csr.availableCourses, function(availableCoursesLoop, courseDetails) {
												if(courseDetails.subjects.length>0){
													$.each(courseDetails.subjects, function(loop1, subject){
														html+='<div class="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12 mb-4 px-2">'
																+'<div class="full bg-light-primary rounded p-2 position-relative h-100">'
																	// +'<img class="flexy-course-img w-100 position-relative" style="top:-15px" src="'+PATH_FOLDER_IMAGE2+'course_img.png" />'
																	+'<div class="flexy-course-details px-2 pt-2 pb-3 h-100" style="background-image :url('+PATH_FOLDER_IMAGE2+'course_img.png);min-height:80px;">'
																		+'<div class="text-center"><span class="d-inline-block rounded py-1 px-2 bg-primary text-white text-center font-weight-semi-bold">'+subject.subjectName+'</span></div>'
																		+'<div class="text-center"><span class="d-inline-block rounded py-1 px-2 bg-primary text-white text-center mt-1">'+subject.subjectPriceString+' | '+subject.subjectCredit+' Credit</span></div>'
																	+'</div>'
																	+'<div class="w-100 text-center position-absolute" style="bottom:-10px">'
																		+'<label for="course_id_'+subject.subjectId+'" class="m-0 add-course-button white-bg  white-hov-txt primary-txt-color cursor">'
																			+'<input class="add-course-checkbox" id="course_id_'+subject.subjectId+'"'
																			+' value="'+subject.subjectId+'" onclick="assignEvent('+(loop1+1)+','+subject.subjectId+','+courseDetails.courseId+',\'ft_courses\','+courseDetails.userReachedMaxLimit+','+courseDetails.courseCreditLimit+','+courseDetails.courseSelectedCredit+','+subject.subjectCredit+','+(csr.registrationType=='SCHOLARSHIP' ? 1 : subject.remarks)+',\''+subject.courseType+'\',\'add\','+csr.standardId+','+csr.totalCredit+',\''+subject.courseFeeString+'\')" type="radio" name="course_id_'+courseDetails.courseId+'">'
																			+'<p class="font-12">Add&nbsp;<i class="fa fa-plus" title="add Course"></i></p>'
																		+'</label>'
																	+'</div>'
																+'</div>'
															+'</div>';
															if(subject.courseDescriptionUrl!=null && subject.courseDescriptionUrl!='' && subject.courseDescriptionUrl!=''){
																html+='<div class="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12 mb-4 px-2">'
																	+'<div class="full bg-light-primary rounded p-2 position-relative h-100">'
																		+'<div class="flexy-course-details px-2 pt-2 pb-3 h-100" style="background-image :url('+PATH_FOLDER_IMAGE2+'course_img.png);min-height:80px;">'
																			+'<div class="text-center w-100"><span class="d-inline-block rounded py-1 px-2 bg-primary text-white text-center font-weight-semi-bold">'+subject.subjectName+'</span></div>'
																		+'</div>'
																		+'<div class="w-100 text-center position-absolute" style="bottom:-10px"><a href="'+subject.courseDescriptionUrl+'" target="_blank" class="white-bg add-course-button text-decoration-none white-hov-txt primary-txt-color cursor font-12 d-inline-block" style="line-height:12px">View Details</a></div>'
																	+'</div>'
																+'</div>';
															}
													});
												}
											});
										html+='</div>'
									+'</div>'
								+'</div>'
							+'</div>';
						}
					html+=
					'</div>'
				+'</div>'
			+'</div>'
			+'<div class="full mt-2">'
				+'<button class="btn theme-bg text-white pl-4 pr-4 pull-left" onclick="backCourseSelection(1);">Back</button>'
				+'<input type="submit" class="btn btn-next btn-fill pl-4 pr-4 btn-wd pull-right text-white" style="background-color:#007fff !important" name="sessionPaymentSubmit" id="nextSesionStep" value="Next" onclick="submitCourse();">'
			+'</div>'
		+'</div>';
	return html;
}

function switchFlexyGradeWarningModal(){
	var html=
		`<div class="modal fade fade-scale" tabindex="-1" role="dialog" id="gradeChangeWarning" aria-hidden="true" data-backdrop="static">
			<div class="modal-dialog modal-dialog-centered modal-sm box-shadow-none">
				<div class="modal-content">
					<div class="modal-header pt-2 pb-2 bg-primary justify-content-center text-white">
						<h5 class="modal-title" id="myLargeModalLabel">Information!</h5>
					</div>
					<div class="modal-body">
						<h6 id="gradeChangeWarningMessage" class="text-center"></h6>
					</div>
					<div class="modal-footer justify-content-center">
						<button type="button" id="gradeChangeWarningYes" class="btn btn-success btn-shadow pr-4 pl-4">Yes</button>
						<button type="button" id="gradeChangeWarningNo" class="btn btn-primary btn-shadow pr-4 pl-4">No</button>
					</div>
				</div>
			</div>
		</div>`;
	return html;
}

function noTeacherAssistanceAvailableModal(csr){
	var html = 
		'<div class="modal fade" id="noTeacherAssistanceAvailable" tabindex="-1">'
			+'<div class="modal-dialog modal-sm modal-dialog-centered" role="document"style="box-shadow:none; width:450px; max-width:100%;">'
				+'<div class="modal-content text-center">'
					+'<div class="modal-header justify-content-center" style="width:100% !important; padding: 0 0 !important; height: 45px; border:none;">'
						+'<i class="fa fa-info" style="color: #fff !important; background: #f44336;padding: 20px 30px; border-radius: 50%; font-size: 40px; margin-top: -46px; margin-bottom: 20px;"></i>'
					+'</div>'
					+'<div id="statusMessage-1" class="modal-body delete-modal">'
						+'<p class="heading" style="color: #f44336;font-family: arial; font-size: 18px; line-height: 28px; letter-spacing: 0.3px;" id="noTeacherAssistanceAvailableMessage">';
							if(csr.schoolId==1){
								html+='This course does not offer live classes. Do you wish to select this course?';
							}else{
								html+='This course does not offer live classes. Do you wish to select this course?';
							}
						html+=
						'</p>'
					+'</div>'
					+'<div class="modal-footer text-center" style="border:none; padding:0; margin-bottom:15px;">'
						+'<div class="text-center" style="margin: 0 auto;">'
							+'<button id="noTeacherAssistanceAvailableYes" type="button" class="btn mr-1" style="color:#f44336 !important;border:1px solid #f44336 !important;background:transparent !important;">I understand and agree</button>'
							+'<button id="noTeacherAssistanceAvailableNo" type="button" class="btn btn-danger" data-dismiss="modal">No</button>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>';
		return html;
}

function apCourseSelectionWarningModal(){
	var html = 
		'<div class="modal fade" id="apCourseSelectionWarning" tabindex="-1">'
			+'<div class="modal-dialog modal-sm modal-dialog-centered" role="document"style="box-shadow:none; width:450px; max-width:100%;">'
				+'<div class="modal-content text-center">'
					+'<div class="modal-header justify-content-center" style="padding: 0 0 !important;height: 45px; border:none;">'
						+'<i class="fa fa-info" style="color: #fff !important; width:80px;height:80px;line-height:78px; background: #f44336;border-radius: 50%; font-size: 40px; margin-top: -46px; margin-bottom: 20px;"></i>'
					+'</div>'
					+'<div id="statusMessage-2" class="modal-body delete-modal">'
						+'<p class="heading" style="color: #f44336;font-family: arial; font-size: 18px; line-height: 28px; letter-spacing: 0.3px;" id="apCourseSelectionWarningMessage">'
							+SCHOOL_NAME+' is approved by College Board to offer AP courses. Kindly '
							+'<a target="_blank" href="https://about.collegeboard.org/contact-us" style="color: #007fff !important;">contact</a>'
							+' an authorized test centre for AP exams. AP courses are college level and approved by the College Board.'
						+'</p>'
					+'</div>'
					+'<div class="modal-footer text-center" style="border:none; padding:0; margin-bottom:15px;">'
						+'<div class="text-center" style="margin: 0 auto;">'
							+'<button id="apCourseSelectionWarningClose" type="button" class="btn btn-outline-danger mr-1" data-dismiss="modal">I understand and agree</button>'
							+'<button id="apCourseSelectionWarningNo" type="button" class="btn btn-danger" data-dismiss="modal">No</button>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>'
		return html;
}
function removeAllCorusesModal(){
	var html =
		'<div class="modal fade" id="removeAllCoruses">'
			+'<div class="modal-dialog modal-sm modal-dialog-centered" role="document" style="box-shadow: none; width: 450px; max-width: 100%;">'
				+'<div class="modal-content text-center">'
					+'<div class="modal-header justify-content-center" style="width: 100% !important; padding: 0 0 !important; height: 45px; border: none;"></div>'
						+'<div class="modal-body delete-modal">'
							+'<i class="fa fa-info" style="color: #fff !important; background: #f44336; border-radius: 50%; font-size: 40px; position: absolute; top: -85px; right: 0; left: 0; margin: 0 auto; width: 75px; line-height: 75px;"></i>'
							+'<p class="heading" style="color: #f44336; font-family: arial; font-size: 18px; line-height: 28px; letter-spacing: 0.3px;" id="apCourseSelectionWarningMessage">Are you sure you want to remove all selected courses?</p>'
						+'</div>'
						+'<div class="modal-footer text-center" style="border: none; padding: 0; margin-bottom: 15px;">'
							+'<div class="text-center" style="margin: 0 auto;">'
								+'<button type="button" class="btn mr-1" style="color: #f44336 !important; border: 1px solid #f44336 !important; background: transparent !important;"onclick="removeAllCourse()">Yes</button>'
								+'<button type="button" class="btn btn-danger" data-dismiss="modal">No</button>'
							+'</div>'
						+'</div>'
				+'</div>'
			+'</div>'
		+'</div>'; 
		return html;
}
function creditsLimitsModal(){
	var html = 
		'<div class="modal fade" id="creditsLimitsModal">'
			+'<div class="modal-dialog modal-sm modal-dialog-centered" role="document" style="box-shadow: none; width: 450px; max-width: 100%;">'
				+'<div class="modal-content text-center">'
					+'<div class="modal-header justify-content-center" style="width: 100% !important; padding: 0 0 !important; height: 45px; border: none;"></div>'
					+'<div class="modal-body delete-modal">'
						+'<input type="hidden"  id="oneTimeModal" name="oneTimeModal" value="false"/>'
						+'<i class="fa fa-info" style="color: #fff !important; background: #f44336; border-radius: 50%; font-size: 40px; position: absolute; top: -85px; right: 0; left: 0; margin: 0 auto; width: 75px; line-height: 75px;"></i>'
						+'<p class="heading" style="color: #f44336; font-family: arial; font-size: 18px; line-height: 28px; letter-spacing: 0.3px;" id="creditsLimitsModalMessage">You have selected 6 courses worth 6 credits. Now extra fee will be charged for choosing extra courses.</p>'
					+'</div>'
					+'<div class="modal-footer text-center" style="border: none; padding: 0; margin-bottom: 15px;">'
						+'<div class="text-center" style="margin: 0 auto;">'
							+'<button type="button" id="addCourseLimitBtn" data-dismiss="modal" class="btn mr-1" style="color: #f44336 !important; border: 1px solid #f44336 !important; background: transparent !important;"onclick="updateCourseLimit()">I UNDERSTAND AND AGREE</button>'
							+'<button type="button" class="btn text-white" style="background:#f44336" data-dismiss="modal">CLOSE</button>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>';
		return html;
}
function creditsLimitsOverModal(){
	var html = 
		'<div class="modal fade" id="creditsLimitsOverModal">'
			+'<div class="modal-dialog modal-sm modal-dialog-centered" role="document" style="box-shadow: none; width: 450px; max-width: 100%;">'
				+'<div class="modal-content text-center">'
					+'<div class="modal-header justify-content-center" style="width: 100% !important; padding: 0 0 !important; height: 45px; border: none;"></div>'
					+'<div class="modal-body delete-modal">'
						+'<i class="fa fa-info" style="color: #fff !important; background: #007000; border-radius: 50%; font-size: 40px; position: absolute; top: -85px; right: 0; left: 0; margin: 0 auto; width: 75px; line-height: 75px;"></i>'
						+'<p class="heading" style="color: #007000; font-family: arial; font-size: 18px; line-height: 28px; letter-spacing: 0.3px;" id="creditsLimitsOverModalMessage">You have x courses worth x credits. Extra fee of $ x will be charged for selecting <course name>. Kindly confirm this selection. </p>'
					+'</div>'
					+'<div class="modal-footer text-center" style="border: none; padding: 0; margin-bottom: 15px;">'
						+'<div class="text-center" style="margin: 0 auto;">'
							+'<button type="button" id="addCourseOverLimitBtn" class="btn mr-1" style="color: #007000 !important; border: 1px solid #007000 !important; background: transparent !important;">Confirm & Add</button>'
							+'<button type="button" class="btn text-white" style="background:#007000" data-dismiss="modal">CLOSE</button>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>';
		return html;
}
function changeSelectedGradeModal(){
	var html = 
		'<div class="modal fade" id="changeSelectedGrade">'
			+'<div class="modal-dialog modal-md modal-dialog-centered" role="document" >'
				+'<div class="modal-content text-center">'
					+'<div class="modal-header justify-content-center" style="width: 100% !important; padding: 0 0 !important; height: 45px; border: none;"></div>'
					+'<div class="modal-body delete-modal">'
						+'<i aria-hidden="true" class="fa fa-exchange text-white primary-bg white-txt-color theme-bg" style="border-radius: 50%; font-size: 40px; position: absolute; top: -85px; right: 0; left: 0; margin: 0 auto; width: 75px; line-height: 75px;"></i>'
						+'<p class="heading theme-text primary-txt-color" id="changeSelectedGradeMessage">Are you sure you want to change the grade? <br> You will be re-directed to Step 1 of the enrollment process.</p>'
					+'</div>'
					+'<div class="modal-footer text-center" style="border: none; padding: 0; margin-bottom: 15px;">'
						+'<div class="text-center" style="margin: 0 auto;">'
							+'<button type="button" class="btn theme-bg primary-bg text-white" onclick="proceedToChangeGrade()">Yes</button>'
							+'<button type="button" class="btn" data-dismiss="modal">No</button>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>';
		return html;
}
function upgradeCorusesModal(){
	var html = 
		'<div class="modal fade" id="upgradeCoruses">'
			+'<div class="modal-dialog modal-sm modal-dialog-centered" role="document" style="box-shadow: none; width: 450px; max-width: 100%;">'
				+'<div class="modal-content text-center">'
					+'<div class="modal-header justify-content-center" style="width: 100% !important; padding: 0 0 !important; height: 45px; border: none;"></div>'
					+'<div class="modal-body delete-modal">'
						+'<i class="fa fa-check" style="color: #fff !important; background: green; border-radius: 50%; font-size: 40px; position: absolute; top: -85px; right: 0; left: 0; margin: 0 auto; width: 75px; line-height: 75px;"></i>'
						+'<p class="heading" id="upgradeCorusesMessage" style="color: green; font-family: arial; font-size: 18px; line-height: 28px; letter-spacing: 0.3px;"></p>'
					+'</div>'
					+'<div class="modal-footer text-center" style="border: none; padding: 0; margin-bottom: 15px;">'
						+'<div class="text-center" style="margin: 0 auto;">'
							+'<button id="changeCourseYes" type="button" class="btn mr-1" style="color: green !important; border: 1px solid green !important; background: transparent !important;">Upgrade</button>'
							+'<button id="changeCourseNo" type="button" class="btn" style="color: red !important; border: 1px solid red !important; background: transparent !important;" data-dismiss="modal">No</button>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>';
		return html;
}


function renderPaymentMode(){
	$('#payment-selection-details').html(getPaymentModeContent());
	$("#studentPaymentModal").modal("show");
}

function getPaymentModeContent(cdrDTO){
	var html=
	'<div class="modal fade theme-modal fade-scale max-size-modal" id="studentPaymentModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">'
		+'<div class="modal-dialog modal-xl" role="document">'
			+'<div class="modal-content">'
				+'<div class="modal-header py-2 primary-bg white-txt-color">'
					+'<h5 class="modal-title" style=" margin-left: 10px;">Fee Details</h5>'
					+'<button type="button" class="close" aria-label="Close" data-dismiss="modal"><span aria-hidden="true" style="color: #fff;">&times;</span></button>'
				+'</div>'
				+'<div class="modal-body" style="display:inline-block;width:100%;">'
					+skeletonFeeDetails()
				+'</div>'
			+'</div>'
		+'</div>'
	+'</div>';
	return html;
}

function paymentModalContentWithData(cdrDTO){
	$(".feeDetailsContentDiv").remove();
	var html = 
	'<div class="col-md-12 col-sm-12 col-xs-12 feeDetailsContentDiv">'
		+'<div class="label-floating feePayMode">'
			+'<div class="col-md-12 col-sm-12 col-xs-12 p-0">'
				+'<div class="payment-item">';
				if(cdrDTO.bookASeatOpted == 1 && !cdrDTO.bookAnEnrollmentPaidStatus){
					html+=
					'<div class="radio radio-payment-option white-txt-color">'
						+'<input id="pay-registration" value="1" type="radio" name="payModeCheckboxes">'
						+'<label for="pay-registration" class="primary-border-color" onclick="displayScholorshipDetails(\'dtl-registration\');">'
							+'<span class="circle primary-border-color"></span>'
							+'<span class="check primary-bg-checked"></span>'
							+'<span class="checked-font-style primary-txt-color" style="margin-left: 35px; line-height:21px" id="payFive"> <b> Reserve an Enrollment Seat</b><br>'
								+'('+cdrDTO.enrollmentFee.enrollmentFeeString+')'
							+'</span>'
						+'</label>'
					+'</div>';
				}
				if(cdrDTO.oneTimePayment!=''){
					html+=
					'<div class="radio radio-payment-option white-txt-color">'
						+'<input id="pay-one" value="1" type="radio" name="payModeCheckboxes">'
						+'<label for="pay-one" class="primary-border-color" onclick="displayScholorshipDetails(\'dtl-one\');">'
							+'<span class="circle primary-border-color"></span>'
							+'<span class="check primary-bg-checked"></span>'
							+'<span class="checked-font-style primary-txt-color" style="margin-left: 35px; line-height:21px" id="payOne">';
								//+'<b>'+cdrDTO.oneTimePayment.paymentMode+'</b>';
								if(cdrDTO.oneTimePayment.paymentOptionDiscount>0){
									html+=
									'<b>Pay one time & save '
									+cdrDTO.oneTimePayment.paymentOptionDiscountString+'</b><br>';
								}else{
									html+='<b>Pay one time</b><br>';
								}
								html+= 
								cdrDTO.oneTimePayment.payableFeeString
							+'</span>'
						+'</label>'
					+'</div>';
				}
				if(cdrDTO.monthlyFeeDetails!=null && cdrDTO.monthlyFeeDetails!=''){
					html+=
					'<div class="radio radio-payment-option white-txt-color">'
						+'<input id="pay-three" value="2" type="radio" name="payModeCheckboxes">'
						+'<label for="pay-three" class="primary-border-color" onclick="displayScholorshipDetails(\'dtl-three\');">'
							+'<span class="circle primary-border-color"></span>'
							+'<span class="check primary-bg-checked"></span>'
							+'<span class="checked-font-style primary-txt-color" style="margin-left: 35px; line-height:21px">'
								+'<b>'
								// +cdrDTO.monthlyFeeDetails.paymentMode;
								// if(cdrDTO.schoolId==5){
								// 	html+='(4 Installments, every 3 months)';
								// }else{
									html+='Pay in easy installments';
								// }
								html+='</b><br>'+cdrDTO.monthlyFeeDetails.payableFeeString
							+'</span>'
						+'</label>'
					+'</div>';
				}
				if(cdrDTO.customPaymentEnabled!=null && cdrDTO.customPaymentEnabled!=''){
					html+=
					'<div class="radio radio-payment-option white-txt-color">'
						+'<input id="pay-custom" value="5" type="radio" name="payModeCheckboxes">'
						+'<label for="pay-custom" class="primary-border-color" onclick="displayScholorshipDetails(\'dtl-custom\');">'
							+'<span class="circle primary-border-color"></span>'
							+'<span class="check primary-bg-checked"></span>'
							+'<span class="checked-font-style primary-txt-color" style="margin-left: 35px; line-height:21px">'
								+'<b>Customized plan (Pay in easy installments)</b> <br>'
								+paymentCalculationResponse.paymentDetails.totalPayableAmountString
							+'</span>'
						+'</label>'
					+'</div>';
				}
				html+=
				'</div>'
			+'</div>';
			html+=
			'<div class="col-md-12 col-sm-12 col-xs-12 p-0">'
				+'<div class="row">'
					+'<div class="col-md-12 col-sm-12 col-xs-12">'
						+'<div class="scholarship-details">'
							+'<div class="row">'
								+'<div class="col-md-12">'
									+'<div class="table-responsive">';
									if(cdrDTO.bookAnEnrollmentPaidStatus!=null && !cdrDTO.bookAnEnrollmentPaidStatus){
										html+=
										'<table id="book-seat-fee-details" class="table table-bordered table-striped" style="display: none;">'
											+'<thead class="theme-bg primary-bg white-txt-color" style="color: #fff;">'
												+'<tr>'
													+'<th style="width: 60%;">Description</th>'
													+'<th style="width: 20%;text-align:center"><span class="previewPaymentOption"></span> Fee ('+cdrDTO.currencyIsoCode+')</th>'
													+'<th style="width: 20%; text-align:center">Total Fee</th>'
												+'</tr>'
											+'</thead>'
											+'<tbody>'
												+getBookAnEnrollmentTable(cdrDTO)
											+'</tbody>'
										+'</table>'
										+'<div id="BookEnrollmentSeat">‘Reserve an Enrollment Seat’ Fee of&nbsp;<b>'+cdrDTO.enrollmentFee.enrollmentFeeString+'</b>&nbsp;is non-refundable.</div>';
									}
									if(cdrDTO.oneTimePayment!=''){
										html+=
										'<table id="annual-course-fee-details" class="table table-bordered table-striped without_h_scroll" style="display: none;">'
											+'<thead class="theme-bg primary-bg white-txt-color">'
												+'<tr>'
													+'<th style="width: 60%;">Description</th>'
													+'<th style="width: 20%;text-align:center"><span class="previewPaymentOption"></span> Fee ('+cdrDTO.currencyIsoCode+')</th>'
													+'<th style="width: 20%; text-align:center">Total Fee</th>'
												+'</tr>'
											+'</thead>'
											+'<tbody>'
												+getAnnualPaymentTable(cdrDTO);
											+'</tbody>'
										+'</table>';
									}
									if(cdrDTO.monthlyFeeDetails!=null &&  cdrDTO.monthlyFeeDetails!=''){
										html+=
										'<table id="installment3-course-fee-details" class="installment3-course-fee-details table table-bordered table-striped without_h_scroll" style="display: none;">'
											+'<thead class="theme-bg primary-bg white-txt-color">'
												+'<tr>'
													+'<th style="width: 60%;">Description</th>'
													+'<th style="width: 20%;text-align:center"><span class="previewPaymentOption"></span> Fee ('+cdrDTO.currencyIsoCode+')</th>'
													+'<th style="width: 20%; text-align:center">Total Fee</th>'
												+'</tr>'
											+'</thead>'
											+'<tbody>'
												+getMonthlyPaymentTable(cdrDTO)
											+'</tbody>'
										+'</table>'
										+'<div class="full installment3-course-fee-details" style="display: none;">'
											+'<div>'
												+'<h3 class="primary-txt-color" style="margin-bottom:0 !important;text-align:left">FEE SCHEDULE</h3>'
											+'</div>'
											+'<table class="table table-bordered table-striped without_h_scroll">'
												+'<thead class="theme-bg primary-bg white-txt-color">'
													+'<tr>'
														+'<th style="width: 60%;">DESCRIPTION</th>'
														+'<th style="width: 20%;text-align:center"><span class="previewPaymentOption"></span>TOTAL FEE</th>'
														+'<th style="width: 20%; text-align:center">PAYING NOW</th>'
													+'</tr>'
												+'</thead>'
												+'<tbody>'
													+monthlyFeeShchedule(cdrDTO)
												+'</tbody>'
											+'</table>'
										+'</div>';
									}
									if(cdrDTO.paymentCalculationResponse!=''){
										html+=
										'<table id="custom-course-fee-details" class="table table-bordered table-striped without_h_scroll" style="display: none;">'
											+'<thead class="theme-bg primary-bg white-txt-color">'
												+'<tr>'
													+'<th style="width: 60%;">Description</th>'
													+'<th style="width: 20%;text-align:center"><span class="previewPaymentOption"></span> Fee ('+cdrDTO.currencyIsoCode+')</th>'
													+'<th style="width: 20%; text-align:center">Total Fee</th>'
												+'</tr>'
											+'</thead>'
											+'<tbody>'
												+getCustomizedPaymentTable(cdrDTO)
											+'</tbody>'
										+'</table>';
									}
									html+=
									'</div>'
								+'</div>'
							+'</div>'
						+'</div>'
						+'<div>'
							+'<p><b>Thank you so much for trusting and choosing  '+SCHOOL_NAME+'.</b></p>'
						+'</div>'
					+'</div>'
					+'<div class="col-md-12 col-sm-12 col-xs-12">'
						+'<div class="row">'
							+'<div class="col-md-10"></div>'
							+'<div class="col-md-2 text-right">'
								+'<button type="button" class="btn theme-bg primary-bg white-txt-color" onclick="choosePaymentOption();">Next</button>'
							+'</div>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>'
	+'</div>';
	$("#studentPaymentModal .modal-body").append(html);
}

function getReviewAndPayRendered(data){
	$('#divNextSessionCourseReview').html(getReviewAndPayContent(data));
    displaySection3();
	$(".step-4-skeleton").html('');
	$(".ReviewAndPayContent").show();
	$('.accordion .a-title').unbind().bind('click', function(){
		$(this).parent().closest('li').find('.a-content').stop().slideToggle();
		$(this).find('.plus-icon').toggleClass('fa-minus fa-plus')
		$(this).parent().closest('li').siblings().find('.plus-icon').removeClass('fa-minus')
		$(this).parent().closest('li').siblings().find('.plus-icon').addClass('fa-plus')
		$(this).parent().closest('li').siblings().find('.a-content').slideUp();
	});

	if(data.pgs!=null || data.pgswu!=null || data.pgswt!=null){
		// bindFileUploadNew1('8', '32', data.userId, 4);
		// bindFileUploadNew1('9', '33', data.userId, 4);
		if(data.isOptedAlternetPaymentMethod==1){
			$('#logout_modal_logout').modal('show');
		}else if(data.isOptedAlternetPaymentMethod==2){
			$('#wu_payment_warning').modal('show');
		}
	}
	
	if(data.schoolId==5){
		var scriptEle = document.createElement("script");
		scriptEle.setAttribute("src", "https://js.yoco.com/sdk/v1/yoco-sdk-web.js");
		document.body.appendChild(scriptEle);

		var yocoData = data.yocoData;
		function initiateYocoPaymentGateway(){
			var yoco = new window.YocoSDK({
				publicKey : data.pgs.clientId,
			});
			var checkoutButton = document.querySelector('#yocopaymentbutton');
			checkoutButton.addEventListener('click', function() {
				$('#callPaymentStudentModal').modal('hide');
				yoco.showPopup({
					amountInCents : yocoData.amountInCents,
					currency : yocoData.currency,
					name : yocoData.name,
					description : yocoData.name,
					customer : {
						email: yocoData.email,
						phone: yocoData.phone,
						firstName: yocoData.firstName,
						lastName: yocoData.lastName
					},
					callback : function(result) {
						// This function returns a token that your server can use to capture a payment
						if (result.error) {
							const errorMessage = result.error.message;
							// alert(yocoData.failureUrl+" , errorMessage = "+errorMessage);
							window.location.replace(yocoData.failureUrl);
						} else {
							//alert(yocoData.successsUrl+'&yocoToken='+result.id);
							window.location.replace(yocoData.successsUrl+'&yocoToken='+result.id);
						}
						// In a real integration - you would now pass this chargeToken back to your
						// server along with the order/basket that the customer has purchased.
					}
				})
			});
		}
		customLoader(true);
		window.setTimeout(function(){customLoader(false);initiateYocoPaymentGateway();},1000)
	}
}

function getReviewAndPayContent(data){
	var html=
    '<div class="mb-3 card">'
		+'<div class="card-body">'
			+'<div class="full step-4-skeleton skeleton-wrapper"></div>'
			+'<section class="ReviewAndPayContent">'
				+'<h5 class="text-center font-weight-bold">Kindly Review your details</h5>'
				+'<div class="form-row m-0">'
					+'<div class="form-holder w-100">'
						+'<div class="full">'
							+'<ul class="accordion mob-scroll">'
								+'<li>'
									+courseDetailsPreview(data)
								+'</li>'
							+'</ul>';
							// if(data.returnUrl !=''){
							// 	html+=
							// 	'<hr>'
							// 	+'<div class="edit-btn" style="margin-bottom:20px;">'
							// 		+'<a class="primary-bg white-txt-color" target="_blank" href="'+data.returnUrl+'">Download Reserve an Enrollment Seat Receipt <i class="fa fa-download"></i></a>';
							// 	+'</div>';
							// 	if(data.paymentExpire !=''){
							// 		html+='<div><strong>Note: </strong>Please note that the enrollment seat will be valid till <strong>'+data.expiryDate+'</strong>  after which you will have to pay the course fee in full to complete the enrollment process.</div>';
							// 	}
							// 	html+=
							// 	'<hr>';
							// }
							if(SHOW_PAYMENT_OPTION=='Y'){
								html+=feePaymentReview(data)
							}
						html+=
						'</div>'
					+'</div>'
				+'</div>'
				+'</section>'
				+' <div class="col-md-12 col-sm-12 p-0 mt-3">';
					if(!data.customPaymentEnabled){
						html+='<button class="btn theme-bg text-white pl-4 pr-4 pull-left" onclick="backCourseSelection(2);">Back</button>';
					}
					var paynow=true
					if(data.advanceFeeEnabled){
						if(data.feePaymentDetailsResponse.advanceFeeDetails.payableFee<=0){
							paynow=false;
						}
					}
					if(data.advanceFeeEnabled){
						html+='<button class="btn theme-bg text-white pl-4 pr-4 pull-right ml-2" onclick="callForProgressionToDashboard();">'+(paynow?'Pay Later':'Proceed to Dashboard')+'</button>';
					}
					if(paynow){
						html+='<button class="btn theme-bg text-white pl-4 pr-4 pull-right" onclick="callClientCommonPaymentGateway(\'\',\'student\','+data.userId+','+data.userPaymentDetailsId+',\''+data.paymentType+'\','+data.paymentByUserId+');">Pay Now</button>';
					}
				html+=
				'</div>'
		+'</div>'
	+'</div>'	

	// +courseFeeModal(data)
	// +bookAnEnrollmentTNCModal(data)
	// +callPaymentStudentModal(data)
	// +commonYocoCheckout(data)
	// +referenceNumberModal(data)
	// +logoutModalLogout(data)
	+wuPaymentWarningModal(data)
	// +k12EnrollFeeModal(data)
	+goToDashboardWarningMessageModal(data)
	// +smoovPayContent(data);
	return html;
}

function courseDetailsPreview(data){
	var signupCourse=data.signupCourse;
	var html =
	'<div class="student-courses-info">'
		+'<div class="full">'
			+'<h4 class="a-title">Selected Courses <i class="fa fa-plus plus-icon"></i></h4>'
			+'<div class="h_scroll primary-bg">'
				+'<img src="'+PATH_FOLDER_IMAGE2+'h_scroll.png">'
			+'</div>'
		+'</div>'
		+'<div class="a-content">'
			+'<div class="table-responsive course-selection-wrapper" style="display:block;">'
				+'<h3 class="selected-grade font-weight-bold text-center" style="margin-bottom:15px; font-size:16px">'
					+signupCourse.standardName
				+'</h3>'
				+'<table class="table-style">'
					+'<thead>'
						+'<tr>'
							+'<th>Course Name</th>';
							if($.inArray(signupCourse.standardId, [17,11,12,13,14,15,16]) == -1) {
								html+='<th>Credit</th>';
							}
							html+=
						'</tr>'
					+'</thead>'
					+'<tbody>';
						$.each(signupCourse.courseDTO, function(k, courseDt) {
							if(courseDt.courseName.startsWith('Spanish') && (data.schoolId==1 || data.schoolId==3) && data.standardId>=11 && data.standardId<=17){

							}else{
								html+=
								'<tr>'
									+'<td>'+courseDt.courseName+'</td>';
									if($.inArray(signupCourse.standardId, [17,11,12,13,14,15,16]) == -1) {
										html+='<td>'+courseDt.creditScore+'</td>'
									}
								html+=
								'</tr>';
							}
						});
					html+='</tbody>';
					if($.inArray(signupCourse.standardId, [17,11,12,13,14,15,16]) == -1) {
						html+=
						'<tfoot>'
							+'<tr>'
								+'<th>Total Credit</th>'
								+'<th>'+signupCourse.totalCredit+'</th>'
							+'</tr>'
						+'</tfoot>';
					}
				html+='</table>'
			+'</div>';
			if(!data.customPaymentEnabled){
				// html+=
				// '<div class="edit-btn">'
				// 	+'<button class="primary-bg white-txt-color" onclick="displaySection(2)">Edit <i class="fa fa-edit"></i></button>'
				// +'</div>';
			}
			html+=
		'</div>'
	+'</div>';
	return html;
}
		
function feePaymentReview(data){
	var signupCourse=data.signupCourse;
	var cdrDTO=data.feePaymentDetailsResponse;
	var html=
	'<div class="full amount-description">'
		+'<h5 class="font-weight-bold text-center" style="margin-bottom:15px;">'
			+data.feeSetionTitile;
			if(!data.customPaymentEnabled || (cdrDTO.advanceFeeEnabled && (cdrDTO.advanceFeeDetails.monthlyFees==null || cdrDTO.advanceFeeDetails.monthlyFees.length==0) ) ){
				if(cdrDTO.monthlyFeeDetails!=null && cdrDTO.monthlyFeeDetails.monthlyFees.length>0){
					html+='<span class="primary-bg change-grade" onclick="backCourseSelection(\'2\', true)">Change Plan <i class="fa fa-exchange" style="font-family:FontAwesome"></i></span>';
				}
			}
		html+='</h5>'
		+'<div class="table-responsive">'
			+'<table class="table-style">'
				+'<thead>'
					+'<tr>'
						+'<th class="th" style="width:60%">Description</th>'
						+'<th class="th" style="text-align:center;width:20%">Fee ('+data.currencyIsoCode+')</th>'
						+'<th class="th" style="text-align:center;width:20%">Total Fee</th>'
					+'</tr>'
				+'</thead>'
				+'<tbody>';
				if(signupCourse.payMode == 'registration'){
					html+=getBookAnEnrollmentTable(cdrDTO);
				}else if(signupCourse.payMode == 'annually'){
					html+=getAnnualPaymentTable(cdrDTO);
				}else if(signupCourse.payMode == 'threeMonthly' || signupCourse.payMode == 'sixMonthly'){
					html+=getMonthlyPaymentTable(cdrDTO);
				}else if(signupCourse.payMode == 'c_installment' || signupCourse.payMode == 'c_annually'){
					html+=getCustomizedPaymentTable(cdrDTO);
				}else if(signupCourse.payMode == 'a_partially' || signupCourse.payMode == 'a_installment' || signupCourse.payMode == 'a_annually'){
					html+=getAdvancePaymentTable(cdrDTO);
				}
				html+=
				'</tbody>'
			+'</table>';
			var eligibleForInstallment=false;
			if(signupCourse.payMode == 'threeMonthly' || signupCourse.payMode == 'sixMonthly'){
				eligibleForInstallment=true;
			}else if(
				(signupCourse.payMode == 'a_partially' || signupCourse.payMode == 'a_installment' || signupCourse.payMode == 'a_annually')
				&& (cdrDTO.advanceFeeDetails.monthlyFees!=null && cdrDTO.advanceFeeDetails.monthlyFees.length>0) ){
				eligibleForInstallment=true;
			}
			if(eligibleForInstallment){
				html+=
				'<div class="full">'
					+'<div class="full">'
						+'<br/>'
						+'<h3 class="primary-txt-color" style="margin-bottom:0 !important;text-align:left">FEE SCHEDULE</h3>'
					+'</div>'
					+'<table class="table-style">'
						+'<thead>'
							+'<tr>'
								+'<th style="width: 60%;">DESCRIPTION</th>'
								+'<th style="width: 20%;text-align:center"><span class="previewPaymentOption"></span>TOTAL FEE</th>';
								if(signupCourse.payMode == 'a_partially' || signupCourse.payMode == 'a_installment' || signupCourse.payMode == 'a_annually'){
									html+='<th style="width: 20%; text-align:center">STATUS</th>';
								}else{
									html+='<th style="width: 20%; text-align:center">PAYING NOW</th>';
								}
								html+=
							'</tr>'
						+'</thead>'
						+'<tbody>';
							if(signupCourse.payMode == 'a_partially' || signupCourse.payMode == 'a_installment' || signupCourse.payMode == 'a_annually'){
								html+=advanceFeeShchedule(cdrDTO);
							}else{
								html+=monthlyFeeShchedule(cdrDTO);
							}
							html+=
						'</tbody>'
					+'</table>'
				+'</div>';
			}	
		html+='</div>'
	+'</div>';
	return html;
}

function getBookAnEnrollmentTable(cdrDTO){
	var html=
		// '<tr>'
		// 	+'<td>Reserve an Enrollment Seat</td>'
		// 	+'<td style="text-align:right">'+cdrDTO.enrollmentFee.enrollmentFeeString+'</td>'
		// 	+'<td style="text-align:right">'+cdrDTO.enrollmentFee.enrollmentFeeString+'</td>'
		// +'</tr>'
		'<tr>'
			+'<td><b>Payable Fee</b></td>'
			+'<td style="text-align:right">'+cdrDTO.enrollmentFee.enrollmentFeeString+'</td>'
			+'<td style="text-align:right">'+cdrDTO.enrollmentFee.enrollmentFeeString+'</td>'
		+'</tr>';
		
	return html;
}

function commonPaymentTable(cdrDTO, prefix){
	var html ='';
	if(!cdrDTO.requestFromMigration){
		html +='<tr>'
			+'<td>'+cdrDTO.enrollmentFee.label+'</td>'
			+'<td style="text-align:right">'
				+cdrDTO.enrollmentFee.enrollmentFeeString
			+'</td>'
			+'<td style="text-align:right">'
				+cdrDTO.enrollmentFee.enrollmentFeeString
			+'</td>'
		+'</tr>';
	}
	html +='<tr>'
			+'<td>Course Fee</td>'
			+'<td style="text-align:right">'+cdrDTO.courseFeeString+'</td>'
			+'<td style="text-align:right">'+cdrDTO.courseFeeString+'</td>'
		+'</tr>';
	if(cdrDTO.courseExtraFeeDetails!=null && cdrDTO.courseExtraFeeDetails.totalEntityFee>0){
		html+=
		'<tr>'
			+'<td>';
				if(cdrDTO.courseExtraFeeDetails!=null && cdrDTO.courseExtraFeeDetails.totalEntityFee>0){
					html+=
					'<div id="'+prefix+'_extra">'
						+'<span>Extra Course Fee</span>'
						+'<ol class="extra-course-ol">';
							$.each(cdrDTO.courseExtraFeeDetails.description, function(k, desc) {
								html+='<li class="extra-course-name">'+desc+'</li>';
							});
							html+=
						'</ol>'
						+'<span>Total Extra Course Fee</span>'
					+'</div>';
				}
			html+=
			'</td>'
			+'<td>';
				if(cdrDTO.courseExtraFeeDetails!=null && cdrDTO.courseExtraFeeDetails.totalEntityFee>0){
					html+=
					'<div id="'+prefix+'_extra_price">'
					+'<span>&nbsp;</span>'
					+'<ul class="extra-course-price-ul">';
						$.each(cdrDTO.courseExtraFeeDetails.entityFees, function(k, fee) {
							html+='<li class="extra-course-price" style="text-align:right"> + '+fee+'</li>';
						});
						html+=
					'</ul>'
				+'</div>';
				}
			html+=
			'</td>'
			+'<td style="vertical-align:bottom;text-align:right"> + '+cdrDTO.courseExtraFeeDetails.totalEntityFeeString+'</td>'
		+'</tr>';
	}
	if(cdrDTO.courseMaterialFeeDetails!=null && cdrDTO.courseMaterialFeeDetails.totalEntityFee>0){
		html+=
		'<tr>'
			+'<td>';
				if(cdrDTO.courseMaterialFeeDetails!=null && cdrDTO.courseMaterialFeeDetails.totalEntityFee>0){
					html+=
					'<div id="'+prefix+'_external_material">'
						+'<span>External Material Fee</span>'
						+'<ol class="external-course-ol">';
							$.each(cdrDTO.courseMaterialFeeDetails.description, function(k, desc) {
								html+='<li class="external-course-name">'+desc+'</li>';
							});
							html+=
						'</ol>'
						+'<span>Total External Material Fee</span>'
					+'</div>';
				}
			html+=
			'</td>'
			+'<td>';
				if(cdrDTO.courseMaterialFeeDetails!=null && cdrDTO.courseMaterialFeeDetails.totalEntityFee>0){
					html+=
					'<div id="'+prefix+'_external_material_price">'
						+'<span>&nbsp;</span>'
						+'<ul class="external-course-price-ul">';
							$.each(cdrDTO.courseMaterialFeeDetails.entityFees, function(k, fee) {
								html+='<li class="external-course-price" style="text-align:right"> + '+fee+'</li>';
							});
							html+=
						'</ul>'
					+'</div>';
				}
			html+=
			'</td>'
			+'<td style="vertical-align:bottom;text-align:right"> + '+cdrDTO.courseMaterialFeeDetails.totalEntityFeeString+'</td>'
		+'</tr>';
	}
	if(cdrDTO.feeAlreayPaid!=null && cdrDTO.feeAlreayPaid.totalEntityFee>0){
		html+=
		'<tr>'
			+'<td>';
				if(cdrDTO.feeAlreayPaid!=null && cdrDTO.feeAlreayPaid.totalEntityFee>0){
					html+=
					'<div id="'+prefix+'_feeAlreadyPaidDesc">'
						+'<span>Fee Already Paid</span>'
						+'<ol class="extra-course-ol">';
							$.each(cdrDTO.feeAlreayPaid.description, function(k, desc) {
								html+='<li class="extra-course-name">'+desc+'</li>';
							});
							html+=
						'</ol>'
						+'<span>Total Paid</span>'
					+'</div>';
				}
			html+=
			'</td>'
			+'<td>';
				if(cdrDTO.feeAlreayPaid!=null && cdrDTO.feeAlreayPaid.totalEntityFee>0){
					html+=
					'<div id="'+prefix+'_feeAlreadyPaidDescPrice">'
					+'<span>&nbsp;</span>'
					+'<ul class="extra-course-price-ul">';
						$.each(cdrDTO.feeAlreayPaid.entityFees, function(k, fee) {
							html+='<li class="extra-course-price" style="text-align:right"> - '+fee+'</li>';
						});
						html+=
					'</ul>'
				+'</div>';
				}
			html+=
			'</td>'
			+'<td style="vertical-align:bottom;text-align:right"> - '+cdrDTO.feeAlreayPaid.totalEntityFeeString+'</td>'
		+'</tr>';
	}
	return html;
}

function getAnnualPaymentTable(cdrDTO){
	var html= commonPaymentTable(cdrDTO,'annually');
	// if(cdrDTO.schoolId==1 || cdrDTO.schoolId==3 || cdrDTO.schoolId==3){
		if(cdrDTO.oneTimePayment!=null && cdrDTO.oneTimePayment.youSave!=null){
			if(cdrDTO.oneTimePayment.youSave.description!=null && cdrDTO.oneTimePayment.youSave.description.length>0){
				html+=
				'<tr>'
					+'<td>'
						+'<table class="payment-table-inside-table">'
							+'<tbody>'
								+'<tr>'
									+'<td>Fee Waiver & Discounts</td>';
								+'</tr>'		
								$.each(cdrDTO.oneTimePayment.youSave.description, function(k, desc) {
									html+='<tr><td class="pl-4">'+(parseInt(k)+1)+". "+desc+'</td></tr>';
								});
							html+='</tbody>'
							+'<tfoot>'
								+'<tr>'
									+'<td>Total You Saved</td>'
								+'</tr>'
							+'</tfoot>'
						+'</table>'
					+'</td>'
					+'<td>'
						+'<table class="payment-table-inside-table">'
							+'<tbody>'
								+'<tr>'
									+'<td>&nbsp;</td>';
								+'</tr>'		
								$.each(cdrDTO.oneTimePayment.youSave.entityFees, function(k, fee) {
									html+='<tr><td style="text-align:right">- '+fee+'</td></tr>';
								});
							html+='</tbody>'
							+'<tfoot>'
								+'<tr>'
									+'<td>&nbsp;</td>'
								+'</tr>'
							+'</tfoot>'
						+'</table>'
					+'</td>'
					+'<td style="vertical-align:bottom;text-align:right"> - '+cdrDTO.oneTimePayment.youSave.totalEntityFeeString+'</td>'
				+'</tr>';
			}
		}
		html+=
		'<tr>'
			+'<td>'
				+'<strong>Payable Fee</strong>'
			+'</td>'
			+'<td style="text-align:right"><b>'+cdrDTO.oneTimePayment.payableFeeString+'</b></td>'
			+'<td style="text-align:right"><b>'+cdrDTO.oneTimePayment.payableFeeString+'</b></td>'
		+'</tr>';
	// }else if(cdrDTO.schoolId==4){
	// }else if(cdrDTO.schoolId==5){
	// }
	return html;
}

function getMonthlyPaymentTable(cdrDTO){
	var html= commonPaymentTable(cdrDTO,'monthly');
	// if(cdrDTO.schoolId==1 || cdrDTO.schoolId==3 || cdrDTO.schoolId==3){
		if(cdrDTO.monthlyFeeDetails!=null && cdrDTO.monthlyFeeDetails.youSave!=null){
			if(cdrDTO.monthlyFeeDetails.youSave.description!=null &&  cdrDTO.monthlyFeeDetails.youSave.description.length>0){
				html+=
				'<tr>'
					+'<td>'
						+'<table class="payment-table-inside-table">'
							+'<tbody>'
								+'<tr>'
									+'<td>Fee Waiver & Discounts</td>'
								+'</tr>'
								$.each(cdrDTO.monthlyFeeDetails.youSave.description, function(k, desc) {
									html+='<tr><td class="pl-4">'+(parseInt(k)+1)+". "+desc+'</td></tr>';
								});
							html+='</tbody>'
							+'<tfoot>'
								+'<tr>'
									+'<td>Total You Saved</td>'
								+'</tr>'
							+'</tfoot>'
						+'</table>'
					+'</td>'
					+'<td>'
						+'<table class="payment-table-inside-table">'
							+'<tbody>'
								+'<tr>'
									+'<td>&nbsp;</td>';
								+'</tr>'		
								$.each(cdrDTO.monthlyFeeDetails.youSave.entityFees, function(k, fee) {
									html+='<tr><td style="text-align:right">- '+fee+'</td></tr>';
								});
							html+='</tbody>'
							+'<tfoot>'
								+'<tr>'
									+'<td>&nbsp;</td>'
								+'</tr>'
							+'</tfoot>'
						+'</table>'
					+'</td>'
					+'<td style="vertical-align:bottom;text-align:right"> - '+cdrDTO.monthlyFeeDetails.youSave.totalEntityFeeString+'</td>'
				+'</tr>';
			}
		}
		html+=
		'<tr>'
			+'<td>'
				+'<strong>Payable Fee</strong>'
			+'</td>'
			+'<td style="text-align:right"><b>'+cdrDTO.monthlyFeeDetails.payableFeeString+'</b></td>'
			+'<td style="text-align:right"><b>'+cdrDTO.monthlyFeeDetails.payableFeeString+'</b></td>'
		+'</tr>';
	// }else if(cdrDTO.schoolId==4){
	// }else if(cdrDTO.schoolId==5){
	// }
	return html;
}

function monthlyFeeShchedule(cdrDTO){
	var html = '';
		$.each(cdrDTO.monthlyFeeDetails.monthlyFees, function(k, monthlyFee) {
			html+=
			'<tr>'
				+'<td>'
					+monthlyFee.paymentLabel
				+'</td>'
				+'<td style="text-align:right"><b>'+monthlyFee.amountString+'</b></td>'
				+'<td style="text-align:right"><b>';
				if(k==0){
					html+=monthlyFee.amountString;
				}
				html+=
				'</b></td>'
			+'</tr>';
		});
		
	return html;
}

function getCustomizedPaymentTable(data){
	var html='';
	if(data.customPaymentEnabled){
		var paymentDetails = data.paymentCalculationResponse.paymentDetails
		$.each(paymentDetails.schedulePayments, function(loop, schedulePayment) {
			html+=
			'<tr>'
				+'<td>'
					+schedulePayment.paymentTitle
					+' '
					+(loop==0?' (to be paid at the time of enrollment)':'')
				+'</td>'
				+'<td style="text-align:right">'
					+schedulePayment.payAmountString
				+'</td>'
				+'<td style="text-align:right">'
					+schedulePayment.payAmountString
				+'</td>'
			+'</tr>';
		});
		html+=
		'<tr>'
			+'<td><strong>Payable Fee</strong></td>'
			+'<td style="text-align:right">'
				+'<strong>';
					// if(paymentDetails.schedulePayments!=null
					// 	 && paymentDetails.schedulePayments.length>1){
					// 	$.each(paymentDetails.schedulePayments, function(loop, schedulePayment) {
					// 		html+=schedulePayment.payAmountString;
					// 		var isLastElement = loop == paymentDetails.schedulePayments.length -1;
					// 		if(!isLastElement){
					// 			html+=' + ';
					// 		}else{
					// 			html+=' = ';
					// 		}
					// 	});
					// }
					html+=paymentDetails.totalPayableAmountString
				+'</strong>'
			+'</td>'
			+'<td style="text-align:right">'
				+'<strong>'
					html+=paymentDetails.totalPayableAmountString
				+'<strong>'
			+'</td>'
		+'</tr>';
	}
	$('#custom-payment-button').show();
	return html;
}

function getAdvancePaymentTable(cdrDTO){
	var html= commonPaymentTable(cdrDTO,'advanceFee');
	// if(cdrDTO.schoolId==1 || cdrDTO.schoolId==3 || cdrDTO.schoolId==3){
		if(cdrDTO.advanceFeeDetails!=null && cdrDTO.advanceFeeDetails.youSave!=null){
			if(cdrDTO.advanceFeeDetails.youSave.description!=null &&  cdrDTO.advanceFeeDetails.youSave.description.length>0){
				html+=
				'<tr>'
					+'<td>'
						+'<table class="payment-table-inside-table">'
							+'<tbody>'
								+'<tr>'
									+'<td>Fee Waiver & Discounts</td>'
								+'</tr>'
								$.each(cdrDTO.advanceFeeDetails.youSave.description, function(k, desc) {
									html+='<tr><td class="pl-4">'+(parseInt(k)+1)+". "+desc+'</td></tr>';
								});
							html+='</tbody>'
							+'<tfoot>'
								+'<tr>'
									+'<td>Total You Saved</td>'
								+'</tr>'
							+'</tfoot>'
						+'</table>'
					+'</td>'
					+'<td>'
						+'<table class="payment-table-inside-table">'
							+'<tbody>'
								+'<tr>'
									+'<td>&nbsp;</td>';
								+'</tr>'		
								$.each(cdrDTO.advanceFeeDetails.youSave.entityFees, function(k, fee) {
									html+='<tr><td style="text-align:right">- '+fee+'</td></tr>';
								});
							html+='</tbody>'
							+'<tfoot>'
								+'<tr>'
									+'<td>&nbsp;</td>'
								+'</tr>'
							+'</tfoot>'
						+'</table>'
					+'</td>'
					+'<td style="vertical-align:bottom;text-align:right"> - '+cdrDTO.advanceFeeDetails.youSave.totalEntityFeeString+'</td>'
				+'</tr>';
			}
		}
		html+=
		'<tr>'
			+'<td>'
				+'<strong>Payable Fee</strong>'
			+'</td>'
			+'<td style="text-align:right"><b>'+cdrDTO.advanceFeeDetails.payableFeeString+'</b></td>'
			+'<td style="text-align:right"><b>'+cdrDTO.advanceFeeDetails.payableFeeString+'</b></td>'
		+'</tr>';
	// }else if(cdrDTO.schoolId==4){
	// }else if(cdrDTO.schoolId==5){
	// }
	return html;
}

function advanceFeeShchedule(cdrDTO){
	var html = '';
		$.each(cdrDTO.advanceFeeDetails.monthlyFees, function(k, monthlyFee) {
			html+=
			'<tr>'
				+'<td>'
					+monthlyFee.paymentLabel
				+'</td>'
				+'<td style="text-align:right"><b>'+monthlyFee.amountString+'</b></td>'
				+'<td style="text-align:right"><b>';
				if(monthlyFee.status == 'SUCCESS'){
					html+='Paid ('+monthlyFee.paidDate+')';
				}else{
					html+='Scheduled ('+monthlyFee.scheduledDate+')';
				}
				html+=
				'</b></td>'
			+'</tr>';
		});
		
	return html;
}
// function courseFeeModal(data){
// 	var html ='';
// 	if(data.pgs!=null || data.pgswu!=null || data.pgswt!=null){
// 		html='<div class="modal fade theme-modal fade-scale " id="courseFeeModalTNC" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">'
// 			+'<div class="modal-dialog modal-lg" role="document" style="top:50%;transform: translateY(-50%);">'
// 				+'<div class="modal-content" style="border-radius: 0; border: 0; margin-top:0 !important;">'
// 					+'<div class="modal-header theme-header white-text" style="width: 97%; margin: 0 auto; border-radius: 0;position:relative;top:-25px;">'
// 						+'<h4 class="modal-title" style="color: #fff; margin-left: 10px;">Further to my Enrollment with '+SCHOOL_NAME+', I agree to comply with the following as stated below, without any exceptions:</h4>'
// 						+'<button type="button" class="close" data-dismiss="modal" style="color:#fff">×</button>'
// 					+'</div>'
// 					+'<div class="modal-body" style="height:auto; max-height:60vh; overflow:auto;">'
// 						+'<!-<p class="scroll-down" style="margin-top:5px;"><a href="#" class="animat=e"></a></p> -->'
// 						+'<form id="signupStage4" name="signupCourse" method="post" autocomplete="off">'
// 							+'<div class="full theme-text scroll-down-animatoin">'
// 								+'<h4><i class="fa fa-arrow-down faa-falling animated"></i></h4>'
// 							+'</div>'
// 							+'<div class="agree">'
// 								+'<ol>'
// 									+'<li>I will submit only original academic work, documents and materials.</li>'
// 									+'<li>I will complete all academic work/tasks independently without any support from any other individual(s) or resources.</li>'
// 									+'<li>I agree to be reviewed by '+SCHOOL_NAME+' (or its authorized individuals/bodies) to review/verify the authenticity (or quantity/parameters) of my academic work at any point during my learning period (or after completion of learning period or even after issuance of qualification certificates).</li>'
// 									+'<li>I agree that if my academic work (or any of its components as prescribed/required by '+SCHOOL_NAME+' for my particular course/grade/subject of study) is found to be misrepresented, counterfeit, copied, incomplete (or if there is a mismatch between the quality/quantity/nature of my academic work and the parameters prescribed/required by International Schooling), then my enrollment will be cancelled with immediate effect (irrespective of which stage my enrollment/learning is and even after the completion of my academic work) and I will not hold '+SCHOOL_NAME+' (or its authorized individuals/bodies) responsible/liable for the above actions taken by '+SCHOOL_NAME+'.</li>'
// 									+'<li>I may be asked to provide additional information, proof, material in support of the information provided by me (especially related to but not limited to academic credentials, coursework and other relevant information in support of my eligibility/candidature with '+SCHOOL_NAME+') especially if the information provided by me is incomplete, inconsistent (or with discrepancies) or not as per the prescribed requirements of '+SCHOOL_NAME+'.</li>'
// 									+'<li>I agree to complete all the credit/course requirements (including assessments) in the prescribed time/duration to earn my credits, in the absence of which I shall not be awarded any credits and I take complete responsibility of completing my coursework to be awarded credits (or my failure to earn credit due to the non-adherence to prescribed requirements of '+SCHOOL_NAME+') for the same.</li>'
// 									+'<li>I will not misrepresent any facts or details to '+SCHOOL_NAME+' and not forge/misrepresent any documents, signatures or credentials and any deviation from the above (or from any other truthful representation of details) shall render my candidature to be cancelled (null/void) by '+SCHOOL_NAME+' with immediate effect upon discovery of such misrepresentation(s).</li>'
// 									+'<li>I understand that all materials of International Schooling (including but not limited to all study materials used by me during my learning/coursework) are the sole and complete property of '+SCHOOL_NAME+' and I will not make any ‘commercial’ use of any of the '+SCHOOL_NAME+' courses, assignments, audio-visual resources, materials or any other collaterals.</li>'
// 									+'<li>It’s the responsibility of students and parents to go through the website for any upcoming notifications.</li>'
// 								+'</ol>'
// 								+'<div class="modal-footer" style="text-align: left;">'
// 									// +'<%--<div class="col-sm-2 col-xs-12" style="flex:1">'
// 									// 	+'<img src="'+PATH_FOLDER_IMAGE2+data.pgName+'.png" align="left" width="150px">'
// 									// +'</div> --%>'
// 									+'<div class="col-sm-12 col-xs-12" style="flex: 1; display: flex; align-items: center">'
// 										+'<span class="col-sm-12 col-xs-12">'
// 											+'<input type="checkbox" id="chkval" name="chkval" class="checkbox-lg" />'
// 											+'<label for="chkval" style="position:relative;top:-0.5px;color:#333;cursor:pointer">By clicking (ticking) the box here, I agree to abide by the above mentioned policies/points</label>'
// 										+'</span>'
// 										+'<button type="button" id="payTabData" class="btn btn-success" data-dismiss="modal" disabled="disabled" onclick="callSigninStudentPay(this,"signup");">Proceed</button>'
// 									+'</div>'
// 								+'</div>'
// 							+'</div>'
// 						+'</form>'
// 					+'</div>'
// 				+'</div>'
// 			+'</div>'
// 		+'</div>'
// 	}
// 	return html;
// }
			
// function bookAnEnrollmentTNCModal(data){
// 	var html ='';
// 	if(data.pgs!=null || data.pgswu!=null || data.pgswt!=null){
// 		'<div class="modal fade theme-modal fade-scale" id="bookAnEnrollmentTNC" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">'
// 			+'<div class="modal-dialog modal-lg" role="document" style="top:50%;transform: translateY(-50%);">'
// 				+'<div class="modal-content" style="border-radius: 0; border: 0; margin-top:0 !important;">'
// 					+'<div class="modal-header theme-header white-text primary-bg white-txt-color" style="width: 97%; margin: 0 auto; border-radius: 0;position:relative;top:-25px;">'
// 						+'<h4 class="modal-title" style="color: #fff; margin-left: 10px;padding-right: 20px;"> Further to my successful completion of the ‘Reserve an Enrollment Seat’ process with '+SCHOOL_NAME+',  I agree to comply with the following as stated below, without any exceptions:</h4>'
// 						+'<button type="button" class="close" data-dismiss="modal" style="color:#fff">×</button>'
// 					+'</div>'
// 					+'<div class="modal-body" style="height:auto; max-height:60vh; overflow:auto;">'
// 						+'<form id="signupStage4" name="signupCourse" method="post" autocomplete="off">'
// 							+'<div class="agree">'
// 								+'<ol>'
// 									+'<li>I understand that by paying the ‘Reserve an Enrollment Seat’ Fee, I am only reserving my Enrollment Seat at '+SCHOOL_NAME+' and I will only get access to the learning platform once the Course Fee is paid in full.</li>'
// 									+'<li>I may be asked to provide additional information, and documents ( including but not limited to Age Proof, Address Proof, and Last Academic Proof) in support of the information provided by me (especially related to but not limited to academic credentials, coursework and other relevant information in support of my eligibility/candidature with '+SCHOOL_NAME+') especially if the information provided by me is incomplete, inconsistent (or with discrepancies) or not as per the prescribed requirements of '+SCHOOL_NAME+'.</li>'
// 									+'<li>I will not misrepresent any facts or details to '+SCHOOL_NAME+'. and not forge/misrepresent any documents, signatures, or credentials and any deviation from the above (or from any other truthful representation of details) shall render my candidature to be canceled (null/void) by '+SCHOOL_NAME+' with immediate effect upon discovery of such misrepresentation(s).</li>'
// 									+'<li>I understand that all materials of '+SCHOOL_NAME+' (including but not limited to all study materials used by me during my learning/coursework) are the sole and complete property of '+SCHOOL_NAME+' and I will not make any ‘commercial’ use of any of the '+SCHOOL_NAME+' courses, assignments, audio-visual resources, materials, or any other collaterals.</li>'
// 									+'<li>I understand that the ‘Reserve an Enrollment Seat’ amount will be deducted from the Course Fee (which is subject to changes) once paid.</li>'
// 									+'<li>It is my responsibility to go through the website for any upcoming notifications.</li>'
// 									+'<li>‘Reserve an Enrollment Seat’ fee is valid till '+data.bookEnrollmentDuration+' days from the date of payment. My candidature shall be rendered null/void in case I fail to complete the Enrollment process.</li>'
// 									+'<li>Under any circumstances/conditions, the fee paid for "Reserve an Enrollment Seat" is non-refundable and non-transferable.</li>'
// 									+'<li>'+SCHOOL_NAME+' reserves the right to amend, limit or revoke this offer at any time prior to purchase and accepts no responsibility for any technical issues resulting in the failure to pay.</li>'
// 								+'</ol>'
// 								+'<div class="modal-footer" style="text-align: left;">'
// 									// +'<div class="col-sm-2 col-xs-12" style="flex:1">'
// 									// 	+'<img src="'+PATH_FOLDER_IMAGE2+data.pgName+'.png'+SCRIPT_VERSION+'" align="left">'
// 									// +'</div>'
// 									+'<div class="col-sm-12 col-xs-12" style="flex: 1; display: flex; align-items: center">'
// 										+'<span class="col-sm-12 col-xs-12" style="flex: auto;">'
// 										+'<input type="checkbox" id="chkvalBook" class="checkbox-lg" name="chkvalBook" style="text-align: left"/>'
// 											+'<label for="chkvalBook" style="position:relative;top:-0.5px;color:#333;cursor:pointer">By clicking (ticking) the box here, I agree to abide by the above mentioned policies/points</label>'
// 										+'</span>'
// 										+'<button type="button" id="payTabData" class="btn btn-success"data-dismiss="modal" disabled="disabled"onclick="callSigninStudentPay(this,\'signup\');">Pay Now</button>'
// 									+'</div>'
// 								+'</div>'
// 							+'</div>'
// 						+'</form>'
// 					+'</div>'
// 				+'</div>'
// 			+'</div>'
// 		+'</div>';
// 	}
// 	return html;
// }

// function callPaymentStudentModal(data){
// 	var html ='';
// 	if(data.pgs!=null || data.pgswu!=null || data.pgswt!=null){
// 		html=
// 		'<div id="callPaymentStudentModal" class="modal theme-modal fade payment-opiton-modal" role="dialog" data-backdrop="static" data-keyboard="false">'
// 			+'<div class="modal-dialog modal-lg">'
// 				+'<div class="modal-content">'
// 					+'<div class="modal-header primary-bg white-txt-color" style="padding: 10px;">'
// 						+'<button type="button" class="close" data-dismiss="modal" aria-label="Close">'
// 							+'<span aria-hidden="true" style="color: #fff;">×</span>'
// 						+'</button>'
// 						+'<h4 class="modal-title" style="font-size: 14px">Payment</h4>'
// 					+'</div>'
// 					+'<div class="modal-body" style="margin-top: 0 !important; position: relative; padding: 15px !important; overflow-y: auto; height: 450px">'
// 						+'<section class="payment-option-wrapper">'
// 							+'<div class="full">'
// 								+'<h4 class="section-heading primary-bg-before primary-bg-after">PAYMENT OPTIONS</h4>'
// 								+'<button type="button" class="close" data-dismiss="modal" style="margin-top: -50px; color: #fff">&times;</button>'
// 							+'</div>'
// 							+'<div class="tab-wrapper">'
// 								+'<div class="payment-tabs">'
// 									+'<ul class="nav-tabs" role="tablist">';
// 										if(data.pgs!=null){
// 											html+=
// 											'<li role="presentation" class="'+(data.pgs!=null?"active":"")+' primary-bg-active">'
// 												+'<a href="#credit-card-payment" aria-controls="uploadTab" role="tab" data-toggle="tab" class="payment-option-itme active-tab primary-border-color ">Credit Card / Debit Card</a>'
// 											+'</li>';
// 										}
// 										if(data.pgswu!=null){
// 											html+=
// 											'<li class="tab-item '+(data.pgs==null?"active":"")+' primary-bg-active primary-border-color">'
// 												+'<a href="#westernUnion" aria-controls="browseTab" role="tab" data-toggle="tab" class="payment-option-itme primary-border-color">Convera</a>'
// 											+'</li>';
// 										}
// 										if(data.pgswt!=null){
// 											html+=
// 											'<li class="tab-item '+(data.pgs==null && data.pgswu==null?"active":"")+' primary-bg-active">'
// 												+'<a href="#wire-payment" aria-controls="browseTab" role="tab" data-toggle="tab" class="payment-option-itme primary-border-color">Wire Transfer</a>'
// 											+'</li>';
// 										}
// 										if(data.pgsAlternate!=null){
// 											html+=
// 											'<li class="tab-item primary-border-color'+(data.pgs==null && data.pgswu==null?"active":"")+' primary-bg-active">'
// 												+'<a href="#alternate-payment" aria-controls="browseTab" role="tab" data-toggle="tab" class="payment-option-itme primary-border-color">'+toTitleCase(data.pgsAlternate.gatewayName)+'</a>'
// 											+'</li>';
// 										}
// 										html+=
// 									'</ul>'
// 								+'</div>'
// 								+'<div class="payment-option tab-content">'
// 									+'<div role="tabpanel" id="credit-card-payment" class="tab-pane '+(data.pgs!=null?"active":"")+' credit-card-payment flex-item primary-border-color">'
// 										+'<div id="primary-pg" style="display:block;">'
// 											+'<div class="payment-icon lg">';
// 												if(data.pgName=='STRIPE'){
// 													html+='<img src="'+PATH_FOLDER_IMAGE+'STRIPE.png"/>';
// 												}else if(data.pgName=='Smoovpay'){
// 													html+='<img src="'+PATH_FOLDER_IMAGE+'SMOOVPAY.png"/>';
// 												}else if(data.pgName=='WELLSFARGO'){
// 													html+='<img src="'+PATH_FOLDER_IMAGE+'wells_fargo.png"/>';
// 												}
// 												html+=
// 											'</div>'
// 											+'<div class="payment-icon">'
// 												+'<h3 class="fw-600">We accept Mastercard and Visa</h3>'
// 												+'<img src="'+PATH_FOLDER_IMAGE+'visa.png"/>'
// 												+'<img src="'+PATH_FOLDER_IMAGE+'master-card.png"/>'
// 											+'</div>';
// 											if(data.enrollmentType!='REGISTRATION_REGISTER'){
// 												html+='<p>Your SMS profile will be created instantly after successful payment</p>';
// 											}
// 											if(data.cr !=null && data.pgs.gatewayName=='Smoovpay'){
// 												html+=
// 												'<div class="full">'
// 													+'<p>Our payment partner will display the Course Fees in Singapore Dollars on the payment page. The current Singapore Dollar rate is:</p>'
// 													+'<p> <strong>1 '+data.fromCurrency+' = '+data.cr.conversionRation+' '+data.toCurrency+'</strong> </p>'
// 													+'<p> <strong>Total payable fee: '+data.finalPayableAmountAfterCalculation+' '+data.toCurrency+'</strong></p>'
// 												+'</div>';
// 											}
// 											if(data.schoolId==1){
// 												html+=
// 												'<div class="payment-icon " style="margin-top:0;margin-bottom:10px">'
// 													+'<div class="smoov lg primary-bg white-txt-color" onclick="callCommonPaymentGateway(\'signupStage4\',\'student\',\'type=REGISTRATION_SUBJECT_FEE&userId='+data.userId+'&payId='+data.userPaymentDetailsId+'&paymentType='+data.paymentType+'&paymentByUserId='+data.paymentByUserId+'&entityType='+data.entityType+'&entityId='+data.entityId+'\', \''+data.pgs.gatewayName+'\');">'
// 														+'<span class="paypal-button-text" optional="">Pay Now</span>'
// 													+'</div>'
// 												+'</div>';
												
// 											}else if(data.pgs.gatewayName=='YOCO'){
// 												html+=commonYocoCheckout(data);
// 											}
// 											html+=
// 										'</div>'
// 									+'</div>';
// 									if(data.pgswu!=null){
// 										html+=
// 										'<div role="tabpanel" id="westernUnion" class="tab-pane '+(data.pgs==null?'active':'')+' credit-card-payment flex-item primary-border-color">'
// 											+'<div class="payment-icon lg">'
// 												+'<img src="'+PATH_FOLDER_IMAGE+'/convera-logo.svg">'
// 												+'<p>&nbsp;</p>'
// 												+'<h4 class="full fw-600 text-left">Payment Processing Time:</h4>'
// 												+'<strong class="full fw-600">Card Payments: Upto 3 business days</strong>'
// 												+'<strong class="full fw-600">Bank Transfer: 2-7 business days</strong>'
// 											+'</div>'
// 											+'<div class="payment-icon" style="margin-bottom:0">'
// 												+'<h3 class="fw-600 text-left">Pay money from the comfort of your own home – Reliable, convenient international money transfer using your home/local currency</h3>'
// 												+'<p>&nbsp;</p>'
// 												+'<div class="row">'
// 													+'<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">'
// 														+'<ul class="full mt-4">'
// 															+'<li>'
// 																+'<h4 class="fw-600 text-left full">Step 1</h4>'
// 																+'<strong class="full">Select your preferred currency and click on Get Quote</strong>'
// 															+'</li>'
// 															+'<p style="margin:0">&nbsp;</p>'
// 															+'<li>'
// 																+'<h4 class="fw-600 text-left full">Step 2</h4>'
// 																+'<strong class="full">Verify your details – Student Name, Registered Email.</strong>'
// 															+'</li>'
// 															+'<li>'
// 																+'<br/>'
// 																+'<p>You can use a wide variety of services to complete your transactions. You can pay with your bank account or a credit/debit card* or use cash at your nearest in-person Convera agent location.</p>'
// 															+'</li>'
// 														+'</ul>'
// 													+'</div>'
// 													+'<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">'
// 														//+'<iframe width="100%" height="225" src="https://www.youtube.com/embed/6XcIHVAaa04" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
// 													+'</div>'
// 												+'</div>'
// 											+'</div>'
// 											+'<div class="payment-icon" style="margin-top:0">'
// 												+'<h3 class="fw-600">We accept Mastercard and Visa</h3>'
// 												+'<img src="'+PATH_FOLDER_IMAGE+'visa.png"/>'
// 												+'<img src="'+PATH_FOLDER_IMAGE+'master-card.png"/>'
// 											+'</div>'
// 											+'<div class="payment-icon" style="margin-top:0">'
// 												+'<div class="smoov lg primary-bg white-txt-color" onclick="callCommonPaymentGateway(\'signupStage4\',\'student\',\'type=INSTALLMENT-FEE&userId='+data.userId+'&payId='+data.userPaymentDetailsId+'&paymentType='+data.paymentType+'&paymentByUserId='+data.paymentByUserId+'&entityType='+data.entityType+'&entityId='+data.entityId+'\', \'CONVERA\');">'
// 													+'<span class="paypal-button-text" optional="" style="font-size: 18px; color:#fff; vertical-align: bottom;">Pay Now </span>'
// 												+'</div>'
// 											+'</div>'
// 										+'</div>';
// 									}
// 									if(data.pgswt!=null){
// 										html+=
// 										'<div role="tabpanel" id="wire-payment" class="tab-pane '+(data.pgs==null && data.pgswu ==null?'active':'')+' wire-payment flex-item primary-border-color">'
// 											+'<div class="payment-icon lg" style="mragin-top:0">'
// 												+'<img src="'+PATH_FOLDER_IMAGE+'wt.png"/>'
// 											+'</div>'
// 											+'<div class="full">'
// 												+'<p>If you choose this method, please add US $35.00 to cover the bank’s fees for wire transfer charges. Here are the banking instructions for your payment:</p>'
// 												+'<ul>'
// 													+'<li>'
// 														+'<strong>BIC Name: Oversea-Chinese BankingCorporation Limited</strong>'
// 													+'</li>'
// 													+'<li>'
// 														+'<strong>Bank Address: 63 Chulia Street, #11-01, OCBC Centre East, Singapore - 049514</strong>'
// 													+'</li>'
// 													+'<li>'
// 														+'<strong>Swift Code: OCBCSGSG </strong>'
// 													+'</li>'
// 													+'<li>'
// 														+'<strong>Bank Code: 7339 </strong>'
// 													+'</li>'
// 													+'<li>'
// 														+'<strong>Branch Code: 503</strong></li>'
// 													+'<li>'
// 														+'<strong>Account Name: INTERNATIONAL SCHOOLING PTE. LTD.</strong>'
// 													+'</li>'
// 													+'<li>'
// 														+'<strong>Account Number: 503396020301</strong>'
// 													+'</li>'
// 												+'</ul>'
// 												+'<p>Please clearly identify Student Name and City/State/Country in the reference information that accompanies the wire transfer, so that we can properly credit your account.</p>'
// 												+'<p>Your SMS profile will be created after the complete payment is processed in '+SCHOOL_NAME+'\'s bank Account</p>'
// 											+'</div>'
// 											+'<div class="payment-form">'
// 												+'<form id="wirePaymentForm" name="wirePaymentForm" method="post">'
// 													+'<input type="hidden" name="userPaymentDetailsId" id="userPaymentDetailsId" value="'+data.userPaymentDetailsId+'" />'
// 													+'<input type="hidden" name="paymentTitle" id="paymentTitle" value="'+data.paymentTitle+'" />'
// 													+'<ul>'
// 														+'<li>'
// 															+'<label>Payable Fee &nbsp;<b> '+data.currencyIsoCode+'</b></label>'
// 															+'<input type="text" name="wireTransferAmount" disabled placeholder="Fee" id="wireTransferAmount" required="" value="'+data.wireTransferAmount+'"/>'
// 														+'</li>'
// 														+'<li>'
// 															+'<label>Reference Number</label>'
// 															+'<input type="text" id="referenceNumber" name="referenceNumber" placeholder="Reference Number" maxlength="150" required="" onKeyDown="hideModalMessage(\'\');"/>'
// 														+'</li>'
// 														+'<li>'
// 															+'<label>Proof of Payment</label>'
// 															+'<div class="upload-btn-wrapper">'
// 																+'<div class="file-btn">'
// 																	+'<span id="fileName9" class="fileName" style="display: none;"></span> '
// 																	+'<input type="file" name="fileupload9" id="fileupload9" value="Upload Proof of Payment"/> '
// 																	+'<span class="btn primary-bg white-txt-color">Upload Proof of Payment</span>'
// 																+'</div>'
// 																+'<div id="divshowDocument9" class="custom-btn" style="display: none;">'
// 																	+'<div>'
// 																		+'<a id="showDocument9" href="javascript:showDocument(\'\');" target="_self" data-toggle="tooltip" title="View"> '
// 																			+'<i class="fa fa-eye"></i>'
// 																		+'</a>'
// 																	+'</div>'
// 																+'</div>'
// 																+'<div id="divdeleteDocument9" class="custom-btn" style="display: none;">'
// 																	+'<div>'
// 																		+'<a id="deleteDocument9" href="javascript.void(0)" data-toggle="tooltip" title="Delete"> '
// 																			+'<i class="fa fa-trash"></i>'
// 																		+'</a>'
// 																	+'</div>'
// 																+'</div>'
// 																+'<p>Please upload files in following formats (jpg, jpeg, pdf or png) with maximum size of 5 MB</p>'
// 															+'</div>'
// 														+'</li>'
// 														+'<li>'
// 															+'<label>&nbsp;</label>'
// 															+'<div class="pay-now-btn primary-border-color">'
// 																+'<span class="btn ref-no-btn primary-bg white-txt-color" data-toggle="modal" onclick="callStudentTransferSubmitSignup(\'wirePaymentForm\',2,\'signup\','+data.paymentByUserId+',\''+data.pgswt.gatewayName+'\');">Submit</span>'
// 															+'</div>'
// 														+'</li>'
// 													+'</ul>'
// 												+'</form>'
// 											+'</div>'
// 										+'</div>';
// 									}
// 									if(data.pgsAlternate!=null){
// 										html+=
// 										'<div role="tabpanel" id="alternate-payment" class="tab-pane '+(data.pgs==null && data.pgswu ==null?'active':'')+' wire-payment flex-item primary-border-color">'
// 											+'<div id="alternate-pg">'
// 												+'<div class="payment-icon lg">';
// 													if(data.pgsAlternate.pgName=='Stripe'){
// 														html+='<img src="'+PATH_FOLDER_IMAGE+'STRIPE.png"/>';
// 													}else if(data.pgsAlternate.pgName=='Smoovpay'){
// 														html+='<img src="'+PATH_FOLDER_IMAGE+'SMOOVPAY.png"/>';
// 													}else if(data.pgsAlternate.pgName=='WELLSFARGO'){
// 														html+='<img src="'+PATH_FOLDER_IMAGE+'wells_fargo.png"/>';
// 													}
// 													html+=
// 												'</div>'
// 												+'<div class="payment-icon">'
// 													+'<h3 class="fw-600">We accept Mastercard and Visa</h3>'
// 													+'<img src="'+PATH_FOLDER_IMAGE+'visa.png"/>'
// 													+'<img src="'+PATH_FOLDER_IMAGE+'master-card.png"/>'
// 												+'</div>';
// 												if(data.enrollmentType!='REGISTRATION_REGISTER'){
// 													html+='<p>Your SMS profile will be created instantly after successful payment</p>';
// 												}
// 												if(data.cr && data.pgsAlternate.gatewayName=="Smoovpay"){
// 													html+=
// 													'<div class="full">'
// 														+'<p>Our payment partner will display the Course Fees in Singapore Dollars on the payment page. The current Singapore Dollar rate is:</p>'
// 														+'<p> <strong>1 '+data.fromCurrency+' = '+data.cr.conversionRation+' '+data.toCurrency+'</strong> </p>'
// 														+'<p> <strong>Total payable fee: '+data.finalPayableAmountAfterCalculation+' '+data.toCurrency+'</strong></p>'
// 													+'</div>';
// 												}
// 												html+=
// 												'<div class="payment-icon " style="margin-top:0;margin-bottom:10px">'
// 													+'<div class="smoov lg primary-bg white-txt-color" onclick="callCommonPaymentGateway(\'signupStage4\',\'student\',\'type=REGISTRATION_SUBJECT_FEE&userId='+data.userId+'&payId='+data.userPaymentDetailsId+'&paymentType='+data.paymentType+'&paymentByUserId='+data.paymentByUserId+'&entityType='+data.entityType+'&entityId='+data.entityId+'\', \''+data.pgsAlternate.gatewayName+'\');">'
// 														+'<span class="paypal-button-text" optional="" style="font-size: 18px; color:#fff; vertical-align: bottom;">Pay Now</span>'
// 													+'</div>'
// 												+'</div>'
// 											+'</div>'
// 										+'</div>'
// 									}
// 									html+=
// 								'</div>'
// 							+'</div>'
// 						+'</section>'
// 					+'</div>'
// 				+'</div>'
// 			+'</div>'
// 		+'</div>';
// 	}
// 	return html;	
// }

// function commonYocoCheckout(data){
// 	var html = '';
// 	if(data.yocoData != null){
// 		html+=
// 		'<div class="payment-icon " style="margin-top:0;margin-bottom:10px" style="display:none;">'
// 			+'<div id="yocopaymentbutton" class="smoov lg primary-bg white-txt-color">'
// 				+'<span class="paypal-button-text" optional="">Pay Now</span>'
// 			+'</div>'
// 		+'</div>';
// 	}
// 	return html;
// }

// function referenceNumberModal(data){
// 	var html = '';
// 	if(data.pgs!=null || data.pgswu!=null || data.pgswt!=null){
// 		+'<div class="modal fade theme-modal fade-scale " id="reference_number" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">'
// 			+'<div class="modal-dialog modal-lg" role="document" style="top:50%;transform: translateY(-50%);">'
// 				+'<div class="modal-content" style="border-radius: 0; border: 0; margin-top:0 !important;">'
// 					+'<div class="modal-header theme-header white-text" style="width: 97%; margin: 0 auto; border-radius: 0;position:relative;top:-25px;">'
// 						+'<h4 class="modal-title" style="color: #fff; margin-left: 10px;">Confirmation!</h4>'
// 						+'<button type="button" class="close" data-dismiss="modal" aria-label="Close">'
// 							+'<span aria-hidden="true" style="color: #fff;">×</span>'
// 						+'</button>'
// 					+'</div>'
// 					+'<div class="modal-body" style="height:auto; max-height:60vh; overflow:auto;">'
// 						+'<div class="full form">'
// 							+'<h4 class="modal-title fw-600">Are you sure you want to submit this reference number? Once submitted, you won’t be able to change this number again.</h4>'
// 							+'<hr/>'
// 							+'<div class="full text-right">'
// 								+'<button type="button" class="btn bg-primary text-white" id="proceedStudentPayment" data-dismiss="modal" style="background: #5cb85c !important">Yes</button>'
// 								+'<button type="button" class="btn bg-primary text-white" id="cancelStudentPayment" data-dismiss="modal" style="background: #da5652 !important">No</button>'
// 							+'</div>'
// 						+'</div>'
// 					+'</div>'
// 				+'</div>'
// 			+'</div>'
// 		+'</div>';
// 	}
// 	return html;	
// }

// function logoutModalLogout(data){
// 	var html = '';
// 	if(data.pgs!=null || data.pgswu!=null || data.pgswt!=null){
// 		html='<div class="modal fade theme-modal fade-scale " id="logout_modal_logout" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">'
// 			+'<div class="modal-dialog modal-lg" role="document" style="top:50%;transform: translateY(-50%);">'
// 				+'<div class="modal-content" style="border-radius: 0; border: 0; margin-top:0 !important;">'
// 					+'<div class="modal-header theme-header white-text" style="width: 97%; margin: 0 auto; border-radius: 0;position:relative;top:-25px;">'
// 						+'<h4 class="modal-title" style="color: #fff; margin-left: 10px;">Payment Under Verification</h4>'
// 					+'</div>'
// 					+'<div class="modal-body" style="height:auto; max-height:60vh; overflow:auto;">'
// 						+'<div class="full text-center">'
// 							+'<br/>'
// 							+'<h2 class="modal-title  text-center fw-600 " style="margin-bottom: 15px;">Your payment is under verification.</h2>'
// 							+'<h4 class="modal-title  text-center">';
// 								if(data.enrollmentType!='REGISTRATION_REGISTER'){
// 									html+='You will be able to access the dashboard once the payment is received.'
// 								}
// 								html+=
// 								'You can contact us at ' 
// 								+'<b>'
// 									+' <a href="mailto:'+data.contactEmail+'" target="_blank">'+data.contactEmail+'</a>'
// 								+'</b> for more information'
// 							+'</h4>'
// 							+'<br/>'
// 							+'<p class="text-center">'
// 								+'<button type="button" class="btn bg-primary text-white" onclick="logout();">Log out</button>'
// 							+'</p>'
// 						+'</div>'
// 					+'</div>'
// 				+'</div>'
// 			+'</div>'
// 		+'</div>';
// 	}
// 	return html;	
// }

function wuPaymentWarningModal(data){
	var html = '';
	if(data.pgswu!=null){
		html='<div class="modal fade fade-scale" id="wu_payment_warning" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">'
			+'<div class="modal-dialog modal-lg  modal-dialog-centered box-shadow-none" role="document">'
				+'<div class="modal-content">'
					+'<div class="modal-header pt-2 pb-2 theme-bg text-white">'
						+'<h5 class="modal-title">Payment Under Verification</h5>'
					+'</div>'
					+'<div class="modal-body" style="height:auto; max-height:60vh; overflow:auto;">'
						+'<div class="full text-center">'
							+'<br/>'
							+'<h2 class="modal-title  text-center fw-600" style="margin-bottom: 15px;">Your payment is under verification.</h2>'
							+'<h4 class="modal-title  text-center">';
							if(data.enrollmentType!='REGISTRATION_REGISTER'){
								html+='Your payment is under verification. You will be able to access the dashboard once the payment is received.';
							}else{
								html+='Your payment is under verification.';
							}
							html+=
								'You can contact us at '
								+'<b> <a href="mailto:'+data.contactEmail+'" target="_blank">'+data.contactEmail+'</a></b>'
								+'for more information'
							+'</h4>'
							+'If you would like to choose another payment method, kindly <a href="javascript:void(0);" onclick="$(\'#wu_payment_warning\').modal(\'hide\');callSigninStudentPay(this,\'signup\');" class="anchor-color">click here</a>'
							+'<br/>'
							+'<p class="text-center">'
								+'<button type="button" class="btn bg-primary text-white" onclick="logout();">Log out</button>'
							+'</p>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>';
	}
	return html;
}

function skeletonCourseSelection(){
	var html=
	'<div class="step3-skeleton">'
		+'<div class="skeleton" style="height:39px;margin-bottom:25px"></div>'
		+'<div class="form-row">'
			+'<div class="form-holder selected-course-view" style="padding:20px; margin-right:20px;min-height:250px;background:#f6f6f6;">'
				+'<ul>'
					+'<li class="skeleton" style="margin-bottom:5px;height: 21px;"></li>'
					+'<li class="skeleton" style="margin-bottom:5px;height: 21px;"></li>'
					+'<li class="skeleton" style="margin-bottom:5px;height: 21px;"></li>'
					+'<li class="skeleton" style="margin-bottom:5px;height: 21px;"></li>'
					+'<li class="skeleton" style="margin-bottom:5px;height: 21px;"></li>'
					+'<li class="skeleton" style="margin-bottom:5px;height: 21px;"></li>'
					+'<li class="skeleton" style="margin-bottom:5px;height: 21px;"></li>'
					+'<li class="skeleton" style="margin-bottom:5px;height: 21px;"></li>'
				+'</ul>'
			+'</div>'
			+'<div class="form-holder selected-course-view" style="padding:20px; margin-right:20px; min-height:250px;background:#f6f6f6;">'
				+'<ul>'
					+'<li class="skeleton" style="margin-bottom:5px;height: 37px;"></li>'
					+'<li class="skeleton" style="margin-bottom:5px;height: 37px;"></li>'
					+'<li class="skeleton" style="margin-bottom:5px;height: 37px;"></li>'
					+'<li class="skeleton" style="margin-bottom:5px;height: 37px;"></li>'
					+'<li class="skeleton" style="margin-bottom:5px;height: 37px;"></li>'
					+'<li class="skeleton" style="margin-bottom:5px;height: 37px;"></li>'
				+'</ul>'
			+'</div>'
		+'</div>'
	+'</div>';
	return html;
}
function skeletonFeeDetails(){
	var html =
	'<div class="full step-feeDetails-skeleton">'
		+'<div class="fee-details-skeletion">'
			+'<div class="payment-item">'
				+'<div class="radio-payment-option skeleton" style="height:88px;border-right:2px solid #fff;"></div>'
				+'<div class="radio-payment-option skeleton" style="height:88px"></div>'
			+'</div>'
			+'<div class="table-responsive">'
				+'<table class="table table-bordered table-striped without_h_scroll" style="">'
					+'<thead class="theme-bg primary-bg white-txt-color">'
						+'<tr>'
						+'<th style="width: 60%;" class="skeleton">&nbsp;</th>'
						+'<th style="width: 20%;" class="skeleton">&nbsp;</th>'
						+'<th style="width: 20%;" class="skeleton">&nbsp;</th>'
						+'</tr>'
					+'</thead>'
					+'<tbody>'
						+'<tr>'
							+'<td class="skeleton" height="31px"></td>'
							+'<td class="skeleton" height="31px"></td>'
							+'<td class="skeleton" height="31px"></td>'
						+'</tr>'
						+'<tr>'
							+'<td class="skeleton" height="31px"></td>'
							+'<td class="skeleton" height="31px"></td>'
							+'<td class="skeleton" height="31px"></td>'

						+'</tr>'
						+'<tr>'
							+'<td class="skeleton" height="85px"></td>'
							+'<td class="skeleton" height="85px"></td>'
							+'<td class="skeleton" height="85px"></td>'
							
						+'</tr>'
						+'<tr>'
							+'<td class="skeleton" height="85px"></td>'
							+'<td class="skeleton" height="85px"></td>'
							+'<td class="skeleton" height="85px"></td>'
						+'</tr>'
						+'<tr>'
							+'<td class="skeleton" height="31px"></td>'
							+'<td class="skeleton" height="31px"></td>'
							+'<td class="skeleton" height="31px"></td>'
						+'</tr>'
					+'</tbody>'
				+'</table>'
			+'</div>'
			+'<div class="full">'
				+'<div class="form-holder skeleton" style="height:22px;width:75%"></div>'
			+'</div>'
		+'</div>'
	+'</div>';
	return html
}
function skeletonReviewPayment(){
	var html=
	'<div class="step1-skeleton">'
		+'<div class="form-row">'
			+'<div class="form-holder skeleton" style="height:42px; margin:0px 5px 12px;width:auto;flex:1"></div>'
			+'<div class="form-holder skeleton" style="height:42px; margin:0px 5px 12px;width:auto;flex:1"></div>'
			+'<div class="form-holder skeleton" style="height:42px; margin:0px 5px 12px;width:auto;flex:1"></div>'
		+'</div>'
		+'<div class="form-row">'
			+'<div class="form-holder skeleton" style="height:42px; margin:0px 5px 12px;width:auto;flex:1"></div>'
			+'<div class="form-holder skeleton" style="height:42px; margin:0px 5px 12px;width:auto;flex:1"></div>'
			+'<div class="form-holder skeleton" style="height:42px; margin:0px 5px 12px;width:auto;flex:1"></div>'
		+'</div>'
		+'<div class="form-row m-2 ml-0 mb-4  skeleton" style="width:125px;height:21px"></div>'
		+'<div class="form-row">'
			+'<div class="form-holder skeleton" style="height:42px; margin:0px 5px 12px;width:auto;flex:1"></div>'
			+'<div class="form-holder skeleton" style="height:42px; margin:0px 5px 12px;width:auto;flex:1"></div>'
			+'<div class="form-holder skeleton" style="height:42px; margin:0px 5px 12px;width:auto;flex:1"></div>'
		+'</div>'
		+'<div class="form-row">'
			+'<div class="form-holder skeleton" style="height:42px; margin:0px 5px 12px;width:auto;flex:1"></div>'
			+'<div class="form-holder skeleton" style="height:42px; margin:0px 5px 12px;width:auto;flex:1"></div>'
		+'</div>'
	+'</div>';
	return html;
}

function renderCustomizedCourse(data){
	$('#recommendedCourseModal').remove();
	$("#divNextSessionCourseChoose").append(recommendedCourseModalContent(data));
	recommendedCourseContent(data);
	$("#recommendedCourseModal").modal("show");
}

function recommendedCourseContent(data){
	var html='';
	$('#recomendedCourses tbody').html(html);
	var courses='';
	var totalCredit = 0;
	$.each(data.recommendedCourses, function(k, recommendedCourse) {
		courses+=recommendedCourse.subjectId+',';
		totalCredit+=(parseFloat(recommendedCourse.subjectCredit));
		html+=
		'<tr>'
			+'<td>'+(k+1)+'.</td>'
			+'<td>'
				+recommendedCourse.subjectName
			+'</td>'
			+'<td>'
				+recommendedCourse.subjectCredit
			+'</td>'
			+'<td class="text-center">'
				if(recommendedCourse.courseMandatory === 1 ){
					html+='<label for="add_recommended_course_id_'+(k+1)+'" class="btn btn-sm btn-success white-txt-color" style="margin:0" disabled>'
							+'<input type="checkbox" class="add-recommended-course add-recommended-course-mandatory position-absolute" id="add_recommended_course_id_'+(k+1)+'" value="'+recommendedCourse.subjectId+'" style="opacity:0;width:1px;height:1px" checked disabled>'
						+'<span>Mandatory</span></label>';
				}else{

					html+='<label for="add_recommended_course_id_'+(k+1)+'" class="btn btn-sm primary-bg white-txt-color" style="margin:0">'
						+'<input type="checkbox" class="add-recommended-course add-recommended-course-not-mandatory" id="add_recommended_course_id_'+(k+1)+'" value="'+recommendedCourse.subjectId+'" style="opacity:0;width:1px;height:1px" onchange="addRecommendedCourse(this)">'
					+'<span><i class="fa fa-plus"></i>&nbsp;Add</span></label>';
				}
			html+='</td>'
		+'</tr>';
	});
	html+=
	'<tr>'
		+'<td>&nbsp;</td>'
		+'<td><b>Total Credit</b></td>'
		+'<td><b>'
			+totalCredit
		+'</b></td>'
		+'<td>&nbsp;</td>'
	+'</tr>';
	$('#recomendedCourses tbody').html(html);
	$('#recomendedCourses').attr('courses',courses);
}

function recommendedCourseModalContent(data){
	var html=
	'<div class="modal fade" id="recommendedCourseModal" tabindex="-1">'
		+'<div class="modal-dialog modal-lg modal-dialog-centered shadow-none" role="document">'
			+'<div class="modal-content">'
				+'<div class="modal-header primary-bg white-txt-color py-2" style="display:flex;justify-content:space-between;border-top-left-radius:6px;border-top-right-radius:6px">'
					+'<h5 class="modal-title">Recommended Courses</h5>'
					+'<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">'
						+'<span aria-hidden="true">×</span>'
					+'</button>'
				+'</div>'
				+'<div  class="modal-body" courses="">'
					+'<h4 class="full text-center mb-2"><b>We recommend these courses for '+data.gradeName+'</b></h4>'
					+'<table id="recomendedCourses" class="table recommend-course-table table-bordered table-striped" courses="">'
						+'<thead>'
							+'<tr class="primary-bg white-txt-color">'
								+'<th>S.No.</th>'
								+'<th>Course Name</th>'
								+'<th>Credits</th>'
								+'<th class="text-center">'
										+'<label id="addAllRecommendedCourse" class="btn btn-sm white-bg primary-txt-color" style="margin:0" onclick="addAllRecommendedCourse()">'
											+'<span>Add All</span>'
										+'</label>'
										+'<label id="reomveAllRecommendedCourse" class="btn btn-sm bg-danger text-white" style="margin:0;display:none" onclick="reomveAllRecommendedCourse()">'
											+'<span>Remove All</span>'
										+'</label>'
								+'</th>'
							+'</tr>'
						+'</thead>'
						+'<tbody>'
						+'</tbody>'
					+'</table>'
					+'<p class="m-0"><b>Note: By adding the above recommended courses, your current course selection will be replaced. You can still add or remove courses.</b</p>'
				+'</div>';
				var confirmBtn = false;
				$.each(data.recommendedCourses, function(k, subject){
					if(subject.courseMandatory === 1){
						confirmBtn=true;
						return false;
					}
				});
				if(confirmBtn){
					html+='<div class="modal-footer py-2" style="background-color:#f8f9fa;border-top:1px solid #e9ecef;">'
						+'<a href="javascript:void(0)" class="btn btn-success white-txt-color" id="confirmAndAddRecommendedCourse" onclick="chooseRecomendedCourse()"><b>Confirm</b></a>'
					+'</div>'
				}else{
					html+='<div class="modal-footer py-2" style="background-color:#f8f9fa;border-top:1px solid #e9ecef;">'
						+'<a href="javascript:void(0)" class="btn btn-light text-dark;" id="confirmAndAddRecommendedCourse" onclick="chooseRecomendedCourse()" disabled><b>Confirm</b></a>'
					+'</div>';
				}
			html+='</div>'
		+'</div>'
	+'</div>';
	return html;
}
// function k12EnrollFeeModal(data){
// 	var html = '';
// 	if(data.pgs!=null || data.pgswu!=null || data.pgswt!=null){
// 		html='<div class="modal fade theme-modal fade-scale " id="k12EnrollFee" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">'
// 			+'<div class="modal-dialog modal-lg" role="document" style="top:50%;transform: translateY(-50%);">'
// 				+'<div class="modal-content" style="border-radius: 0; border: 0; margin-top:0 !important;">'
// 					+'<div class="modal-header theme-header white-text" style="width: 97%; margin: 0 auto; border-radius: 0;position:relative;top:-25px;">'
// 						+'<h4 class="modal-title" style="color: #fff; margin-left: 10px;">Registration with '+SCHOOL_NAME+'</h4>'
// 					+'</div>'
// 					+'<div class="modal-body" style="height:auto; max-height:60vh; overflow:auto;">'
// 						+'<form id="signupStage4" name="signupCourse" method="post" autocomplete="off">'
// 							+'<div class="agree">'
// 								+'<span style="margin-top: 25px; width: 100%; padding: 25px; color: #0056ad; font-weight: 550; font-size: 15px; line-height: 30px; background: #ebf5ff; float: left;">'
// 									+'We confirm your online payment of '
// 									+'<span style="color: #0e0f10; font-size: 17px;">US $100.0</span> '
// 									+'is completed successfully. Your enrollment seat has been successfully booked. You can download the receipt by clicking on the button below.<br> '
// 									+'<span style="text-align: center; padding: 0 0 0 0 0">';
// 										if(data.returnUrl!=null){
// 											html+='<a target="_blank" href="'+data.returnUrl+'" class="btn btn-default btn-md" style="width: 100%;">Download Reserve an Enrollment Seat receipt</a>';
// 										}
// 										html+=
// 									'</span>'
// 									+'<br/>'
// 									+'You can contact us at <u>'+data.contactEmail+'</u> for more information regarding elementary enrollment.'
// 								+'</span>'
// 								+'<p class="text-center">'
// 									+'<button type="button" class="btn bg-primary text-white" onclick="logout();">Log out</button>'
// 								+'</p>'
// 							+'</div>'
// 						+'</form>'
// 					+'</div>'
// 				+'</div>'
// 			+'</div>'
// 		+'</div>';
// 	}
// 	return html;	
// }

function goToDashboardWarningMessageModal(data){
	var html='<div class="modal fade theme-modal fade-scale" id="goToDashboardWarningMessage" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">'
		+'<div class="modal-dialog modal-lg" role="document" style="top:50%;transform: translateY(-50%);">'
			+'<div class="modal-content" style="border-radius: 0; border: 0; margin-top:0 !important;">'
				+'<div class="modal-header theme-header white-text" style="width: 97%; margin: 0 auto; border-radius: 0;position:relative;top:-25px;">'
					+'<h5 class="modal-title" style="color: #fff; margin-left: 10px;">Confirmation!</h5>'
					+'<button type="button" class="close" data-dismiss="modal" aria-label="Close">'
						+'<span aria-hidden="true" style="color: #fff;">×</span>'
					+'</button>'
				+'</div>'
				+'<div class="modal-body" style="height:auto; max-height:60vh; overflow:auto;">'
					+'<div class="full form">'
						+'<h4 class="modal-title fw-600" id="submitApplicationMsg"></h4>'
						+'<hr />'
						+'<div class="full text-right">'
							+'<button type="button" class="btn bg-primary text-white" id="proceedStudentPayment" style="background: #5cb85c !important" onclick="callForSignupToDashboard();" >Yes</button>'
							+'<button type="button" class="btn bg-primary text-white" id="cancelStudentPayment" data-dismiss="modal" style="background: #da5652 !important">No</button>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>'
	+'</div>';
	return html;
}

// function smoovPayContent(data){
// 	var html =
// 		'<form id="smoovpayForm" action="" method="post">'
// 			+'<input type="hidden" name="action" value="pay" />'
// 			+'<input type="hidden" name="currency" value="'+data.currencyIsoCode+'" />'
// 			+'<input type="hidden" name="version" value="2.0" />'
// 			+'<input type="hidden" name="item_name_1" value="" />'
// 			+'<input type="hidden" name="item_description_1" value="" />'
// 			+'<input type="hidden" name="item_quantity_1" value="" />'
// 			+'<input type="hidden" name="item_amount_1" value="" />'
// 			+'<input type="hidden" name="merchant" value="" />'
// 			+'<input type="hidden" name="ref_id" value="" />'
// 			+'<input type="hidden" name="delivery_charge" value="" />'
// 			+'<input type="hidden" name="tax_amount" value="" />'
// 			+'<input type="hidden" name="tax_percentage" value="" />'
// 			+'<input type="hidden" name="total_amount" value="" />'
// 			+'<input type="hidden" name="str_url" value="" />'
// 			+'<input type="hidden" name="success_url" value="" />'
// 			+'<input type="hidden" name="cancel_url" value="" />'
// 			+'<input type="hidden" name="signature" value="" />'
// 			+'<input type="hidden" name="signature_algorithm" value="" />'
// 			+'<input type="hidden" name="submit v2" alt="SmoovPay!" />'
// 			+'<input type="hidden" name="skip_success_page" value="1" />'
// 		+'</form>';
// 	return html;	
// }


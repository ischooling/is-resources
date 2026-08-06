console.log('content')
var highSchoolGrade=[];
highSchoolGrade.push(4);
highSchoolGrade.push(5);
highSchoolGrade.push(6);
highSchoolGrade.push(7);
var GRADE_FEE_DONE;
var PROGRESSION_DISCOUNT=0;
var TAKE_INDIVIDUAL_COURSE=false;
const discountTimeLimitSettings = getSettingsByTypeAndKey('CONFIGURATION','DISCOUNT_TIME_LIMIT');
var discountTimeLimitDays = JSON.parse(discountTimeLimitSettings).data.metaValue;
var SIGNUPTYPE;
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
		// $("#courseSubjectDetails, #divNextSession").hide();
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

async function renderMigrationDetailsOptionContent(data) {
	GRADE_FEE_DONE = data.gradeFeeDone;
	var payload = {
		'userId' : USER_ID
	};  
	var responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true,true,'get-commission-pay-by',payload,'student/enrollment');
	SIGNUPTYPE = responseData.signupType
	// if(responseData.signupType == "Online"){
	// 	if(responseData.commissionPayBy == "PWP" || responseData.commissionPayBy == ""){
	// 		SHOW_PAYMENT_OPTION = "N";
	// 	}else{
	// 		SHOW_PAYMENT_OPTION = "Y";
	// 	}
	// }else{
	// 	SHOW_PAYMENT_OPTION = "N";
	// }
	SHOW_PAYMENT_OPTION = responseData.showPaymentOption;
	var html='';
	if(data.customPaymentEnabled){
		html+=
		'<div id="divNextSessionCourseReview">'
			+'<div class="full step-4-skeleton skeleton-wrapper"></div>'
		+'</div>';
		$('#dashboardContentInHTML').html(html);
		callForReviewAndPaymentSelection('N');
	}
	else{
		html+=
		'<input type="hidden" id="userId" name="userId" value="'+data.userId+'">'
		+'<input type="hidden" id="standardId" name="standardId" value="'+data.standardId+'" min_limit="'+data.minCourseLimitMigration+'" max_limit="'+data.maxCourseLimitMigration+'" upper_band="'+data.upperBandLimitMigration+'">'
		+'<input type="hidden" id="enrollmentType" name="enrollmentType" value="'+data.enrollmentType+'">'
		+'<input type="hidden" id="registrationType" name="registrationType" value="'+data.registrationType+'">'
		+'<input type="hidden" id="courseProviderId" name="courseProviderId" value="'+data.providerId+'">'
		+'<input type="hidden" id="selectedSubjects" name="selectedSubjects" value="" data-entiresubject="" data-individual="">'
		+'<input type="hidden" id="payMode" name="payMode" value="'+data.signupCourse.payMode+'" data-paymode="'+data.signupCourse.payMode+'">'
		+'<input type="hidden" id="controlType" name="controlType" value="">'
		+'<input type="hidden" id="totalCreditInput" name="totalCreditInput" value="">';
		if(!GRADE_FEE_DONE || (data.migrationOptionsForImproveGrade != null && data.migrationOptionsForImproveGrade != undefined && data.migrationOptionsForImproveGrade.length>0)){
			if(MIGRATION_DATA.migrationOptionsForNextGrade.length<1 || !GRADE_FEE_DONE){
				html+=
				'<div id="divNextSession" style="display:block">'
					+migrationDetailsOptionContent(data)
				+'</div>'
				+'<div id="payment-selection-details"></div>'
				+'<div id="courseSelectionWrapper"></div>';
			}else{
				html+=getCourseSelectionAndReviewContent()
			}
			
		}else{
			html+=getCourseSelectionAndReviewContent()
		}
		html+='<div id="addAndRemoveLoader" class="loader-wrapper d-flex justify-content-center align-items-center loader-style hide-loader">'
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
		'</div>'
		+'</div>';
		$('#dashboardContentInHTML').html(html);
		// if(data.pageNumberToDisplay==2){
		// 	$("#pageHeading").html(getStudentMigrationHeader(data));
		// }
		if(GRADE_FEE_DONE && (data.migrationOptionsForNextGrade != null && data.migrationOptionsForNextGrade != undefined && data.migrationOptionsForNextGrade.length>0)){
			$("#pageHeading").html(getStudentMigrationHeader(data));
		}
		$("#grade").select2({
			theme:"bootstrap4",
		})
		$('#gradeId').val(data.standardId)
		// if(data.pageNumberToDisplay>=2){
		// 	getAllCourseDetails('N', '');
		// }

		if(GRADE_FEE_DONE && (data.migrationOptionsForNextGrade != null && data.migrationOptionsForNextGrade != undefined && data.migrationOptionsForNextGrade.length>0)){
			getAllCourseDetails('N', '');
		}
		// if(data.pageNumberToDisplay==3){
		// 	callForReviewAndPaymentSelection('N', responseData.enrollmentBy, SIGNUPTYPE);
		// }
	}
}

function migrationDetailsOptionContent(data) {
	console.log(data)
	var chatBaseUrl = (typeof CHAT_URL !== "undefined" && CHAT_URL) ? CHAT_URL : "https://is-chat-react.vercel.app";
    	var chatSupportUrl = chatBaseUrl + "/onboarding-support?uuid=" + UNIQUEUUID;
	var studentCredit=data.studentCredit;
	var disabledAdmission=data.disabledAdmission;
	var html =
	'<div class="app-page-title mb-3 mt-2 py-2">'
		+'<div class="page-title-wrapper">'
			+'<div class="page-title-heading">'
				+'<div class="page-title-icon">'
					+'<i class="fa fa-user text-primary font-20"></i>'
				+'</div>';
				if(data.isParent){
                    html += '<div> You are observing '+data.name+'\'s dashboard </div>';
                }else{
                    html += '<div>'+data.name+'</div>';
                }
			html+= '</div>'
		+'</div>'
	+'</div>'
	+'<div class="main-card mb-3 mx-auto">'
		+'<div class="row">'
			+'<div class="col-xl-9 col-lg-9 col-md-12 col-12 mb-3 mb-xl-0">'
				+'<div class="card rounded-15 shadow-lg" style="margin:0;">'
					+'<div class="row">'
						+'<div class="card-body student-report">'
							+'<div class="row">'
								+'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 report-head mb-1">'
									if(data.migrationOptionsForNextGrade!=undefined && data.migrationOptionsForNextGrade.length>0 && data.pageNumberToDisplay == 1){
										// html+='<h2 class="text-primary font-weight-bold text-center">Congratulations!</h2>'
										// setTimeout(fireConfetti, 1000);
										// setTimeout(fireConfetti, 3000);
									}
									// html+='<h4 class="text-center font-weight-semi-bold mb-3">'+data.name+'!</h4>'
									if(data.migrationOptionsForNextGrade!=undefined && data.migrationOptionsForNextGrade.length>0){
										html+='<p class="mb-0 font-18 text-center">'
											// +'You have successfully completed <b>'+studentCredit.currentGrade+'</b> with <b>'+parseInt(studentCredit.totalStringCredit)+' Credits</b>'
											// +'<img data-emoji="🎉" alt="🎉" aria-label="🎉" draggable="false" src="https://fonts.gstatic.com/s/e/notoemoji/17.0/1f389/72.png" style="width:25px" loading="lazy">&nbsp;<span class="font-weight-semi-bold">'+studentCredit.currentGrade+' Completed!</span>'
											// +'<span class="font-weight-semi-bold d-inline-block p-1 px-3 rounded-20 bg-light-success border-success border text-success font-14">'+studentCredit.currentGrade+' - Promoted</span>'
											+'<span class="font-weight-semi-bold d-inline-block mb-4 px-4 rounded-20 bg-light-success border-success border font-20 text-dark font-weight-bold">Promoted</span>'
										+'</p>'
									}else{
										html+='<p class="font-18 text-center mb-2">'
											// +'You have earned <b>'+parseInt(studentCredit.totalStringCredit)+' Credits</b> in <b>'+studentCredit.currentGrade+'</b>'
											+'<span class="font-weight-semi-bold d-inline-block p-1 px-3 rounded-20 bg-light-warning border-warning border text-gray font-14">Not Promoted</span>'
										+'</p>'
									}
								html+='</div>'
								+'<div class="mx-auto mb-2">'
								if(data.migrationOptionsForNextGrade!=undefined && data.migrationOptionsForNextGrade.length>0){
									// html+='<img class="p-3 bg-light-success border border-success" src="'+PATH_FOLDER_IMAGE2+'passed-badge.png" alt="passed_badge" style="width: 130px; height: 130px; object-fit: contain; border-radius: 100px;" />'
									// html+='<img src="'+PATH_FOLDER_IMAGE2+'pass_icon.png" alt="passed_badge" style="width: 100px; height: 100px; object-fit: contain;" />'
									html+='<h4 class="font-weight-bold font-26">Very well done!</h4>';
								}
								html+='</div>'
								
								if(data.registrationType!="ONE_TO_ONE_FLEX"){
									if(data.migrationOptionsForNextGrade!=undefined && data.migrationOptionsForNextGrade.length>0){
										html+='<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 required-credits mt-0 mb-3">'
											+'<h6 class="text-center font-18 font-weight-semi-bold">';
												html+='You are successfully promoted to <span class="font-weight-semi-bold">'+studentCredit.nextGrade+'!</span>'
											+'</h6>'
										+'</div>';
									}else{
										html+='<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 required-credits mt-0 mb-3">'
											+'<h2 class="text-center font-28 font-weight-bold mb-2">'
												+'Don\'t give up'
											+'</h2>'
											+'<h6 class="text-center font-18 font-weight-bold text-muted">'
												+'Retake your courses and earn your way to the next grade'
											+'</h6>'
										+'</div>';
									}
								}
								if(parseFloat(studentCredit.totalCredit) < studentCredit.minmumCreditLimit  && (studentCredit.withDrawSubject != 0 || studentCredit.incomplteSubject !=0)){
									if(studentCredit.currentGradeId==8 || studentCredit.currentGradeId==9 || studentCredit.currentGradeId==10 || studentCredit.currentGradeId==19 || studentCredit.currentGradeId==20 || studentCredit.currentGradeId==21){
										// only for flexy grade
									}else if(studentCredit.currentGradeId>=11 && studentCredit.currentGradeId<=17){
										// only for elementry grade
									}else{
										// only for middle & high grade 
									}
								}
								if(data.forcefulRepeatOrImprove == "Y"){
									// only for force improve grade 
								}else{
									if(studentCredit.currentGradeId==8 || studentCredit.currentGradeId==9 || studentCredit.currentGradeId==10 || studentCredit.currentGradeId==19 || studentCredit.currentGradeId==20 || studentCredit.currentGradeId==21){
										// only for flexy grade
									}
									else if(parseFloat(studentCredit.totalCredit) >= studentCredit.minmumCreditLimit){
										if(studentCredit.currentGradeId<3 
											|| (studentCredit.currentGradeId==3 && data.cgpaRule == 'Dont Apply') 
											|| (studentCredit.currentGradeId==3 && studentCredit.avgCumulativeGpa > 2.0 && data.cgpaRule == 'Apply')
											|| (studentCredit.currentGradeId>3))
										{
											if(data.migrationOptionsForNextGrade!=undefined && data.migrationOptionsForNextGrade.length>0){
												// only for flexy grade
												if(data.registrationType=="BATCH" || data.registrationType=="ONE_TO_ONE"){
													html+=getMigrationCountdownWapper(data);
												}
											}
										}
									}else if(studentCredit.withDrawSubject == 0 ){
											if(studentCredit.currentGradeId==17 
												|| (studentCredit.currentGradeId>=11 && studentCredit.currentGradeId<16)
												|| (studentCredit.currentGradeId==16  && data.cgpaRule == 'Apply' && studentCredit.avgCumulativeGpa>2.0)
												|| (studentCredit.currentGradeId==16  && data.cgpaRule == 'Dont Apply'))
											{
												if(data.migrationOptionsForNextGrade!=undefined && data.migrationOptionsForNextGrade.length>0){
													if(data.registrationType=="BATCH" || data.registrationType=="ONE_TO_ONE"){
														html+=getMigrationCountdownWapper(data);
													}
												}
											}
									}else{

									}
								}
								html+='<div class="progression-button-wrapper">'
									if(parseFloat(studentCredit.totalCredit) < studentCredit.minmumCreditLimit  && (studentCredit.withDrawSubject != 0 || studentCredit.incomplteSubject !=0)){
										html+=
										'<div class="col text-center">';
											if(studentCredit.currentGradeId==8 || studentCredit.currentGradeId==9 || studentCredit.currentGradeId==10 || studentCredit.currentGradeId==19 || studentCredit.currentGradeId==20 || studentCredit.currentGradeId==21){
												html+='<a class="design-btn" href="javascript:void(0);" onclick="callForStudentNextSession('+studentCredit.currentGradeId+',\'REGISTRATION_REPEAT_GRADE\',\'ONE_TO_ONE\');"> COMPLETE YOUR CREDITS </a>';
											}else if(studentCredit.currentGradeId>=11 && studentCredit.currentGradeId<=17){
												html+='<a class="design-btn" href="javascript:void(0);" onclick="callForStudentNextSession('+studentCredit.currentGradeId+',\'REGISTRATION_REPEAT_GRADE\',\'ONE_TO_ONE\');"> COMPLETE YOUR CREDITS </a>';
											}else{
												html+='<a class="design-btn bg-primary " href="javascript:void(0);" onclick="callChoiceForStudentModelRepeaters(\'complete\');">COMPLETE YOUR CREDITS </a>';
											}
											html+='<h6 class="mt-1 font-weight-semi-bold">Re-take a withdrawn/incomplete course or study another course</h6>'
										+'</div>';
									}
									if(data.forcefulRepeatOrImprove == "Y"){
										html+='<div class="d-flex mx-auto flex-column flex-md-row">'
											+'<a class="design-btn bg-primary font-weight-semi-bold font-size-lg p-2 rounded-15 mr-md-3 mr-0 mb-2 mb-md-0" href="javascript:void(0);" onclick="callChoiceForStudentModelRepeaters(\'improve\');">1 Continue in '+studentCredit.currentGrade+'</a>'
											+'<a class="design-btn bg-primary font-weight-semi-bold font-size-lg p-2 rounded-15 mt-2" href="javascript:void(0);" onclick="submitCourse(\'' + data.enrollmentBy + '\');">';
											if(data.registrationType!="ONE_TO_ONE_FLEX"){
												if(studentCredit.currentGradeId != 7 && data.migrationOptionsForNextGrade!=undefined && data.migrationOptionsForNextGrade.length>0){
													html+='<i class="fa fa-rocket mr-2"></i>';
												}
											}
											html+='2 Continue in '+studentCredit.nextGrade+'</a>'
										+'</div>'
									}
									else {
										if(studentCredit.currentGradeId==8 || studentCredit.currentGradeId==9 || studentCredit.currentGradeId==10 || studentCredit.currentGradeId==19 || studentCredit.currentGradeId==20 || studentCredit.currentGradeId==21){
											html+=
												'<div class="col text-center">'
													if(studentCredit.currentLearningProgram == "ONE_TO_ONE_FLEX"){
														if(data.migrationOptionsForNextGrade!=undefined && data.migrationOptionsForNextGrade.length>0){
															html+='<a class="design-btn bg-primary font-weight-semi-bold font-size-lg p-2 rounded-15" href="javascript:void(0);" onclick="callForStudentNextSession(' + studentCredit.nextGradeId + ',\'REGISTRATION_NEXT_GRADE\',\'' + studentCredit.currentLearningProgram + '\');">'
															html+='<i class="fa fa-rocket mr-2"></i>';
														}else{
															html+='<a class="design-btn bg-primary font-weight-semi-bold font-size-lg p-2 rounded-15" href="javascript:void(0);" onclick="callChoiceForStudentModelRepeaters(\'improve\');">'
														}
														// if(data.registrationType!="ONE_TO_ONE_FLEX"){
															// if(studentCredit.currentGradeId != 7 && data.migrationOptionsForNextGrade!=undefined && data.migrationOptionsForNextGrade.length>0){
															// 	html+='<i class="fa fa-rocket mr-2"></i>';
															// }
														// }
														html+='Continue in '+(studentCredit.currentLearningProgram == "ONE_TO_ONE_FLEX" ? studentCredit.currentGrade:studentCredit.nextGrade)+'</a>';
													}else{
														html+='<a class="design-btn bg-primary font-weight-semi-bold font-size-lg p-2 rounded-15" href="javascript:void(0);" onclick="submitCourse(\'' + data.enrollmentBy + '\')">'
														if(data.registrationType!="ONE_TO_ONE_FLEX"){
															if(studentCredit.currentGradeId != 7 && data.migrationOptionsForNextGrade!=undefined && data.migrationOptionsForNextGrade.length>0){
																html+='<i class="fa fa-rocket mr-2"></i>';
															}
														}
														html+='4 Continue in '+studentCredit.nextGrade+'</a>';
													}
													// +'<a class="design-btn bg-primary font-weight-semi-bold font-size-lg p-2 rounded-15" href="javascript:void(0);" onclick="submitCourse(\'' + data.enrollmentBy + '\')"><i class="fa fa-rocket mr-2"></i>5 Continue in '+studentCredit.nextGrade+'</a>'
												html+='</div>';
										// }else if(parseFloat(studentCredit.totalCredit) >= studentCredit.minmumCreditLimit && studentCredit.currentGradeId<=6){
										}
										else if(parseFloat(studentCredit.totalCredit) >= studentCredit.minmumCreditLimit){
											
											if(studentCredit.currentGradeId<3 
												|| (studentCredit.currentGradeId==3 && data.cgpaRule == 'Dont Apply') 
												|| (studentCredit.currentGradeId==3 && studentCredit.avgCumulativeGpa > 2.0 && data.cgpaRule == 'Apply')
												|| (studentCredit.currentGradeId>3) ){
													if(data.migrationOptionsForNextGrade!=undefined && data.migrationOptionsForNextGrade.length>0){
														$.each(data.migrationOptionsForNextGrade, function(k, migrationOption) {
															
															html+=
															'<div class="col text-center mt-2">'
																+'<a class="design-btn bg-primary font-weight-semi-bold font-size-lg p-2 rounded-15" href="javascript:void(0);"'
																if($.inArray(migrationOption.nextGradeId, [9,10,19,20,21])>=0){
																	html+='onclick="callForStudentNextSession(' + migrationOption.nextGradeId + ',\'REGISTRATION_NEXT_GRADE\',\'' + migrationOption.learningProgram + '\');"';
																}else{
																	if(migrationOption.isEligibleForMigration === 'Y') {
																		if(migrationOption.learningProgram == "DUAL_DIPLOMA"){
																			html+='onclick="callForStudentNextSession(' + migrationOption.nextGradeId + ',\'REGISTRATION_NEXT_GRADE\',\'' + migrationOption.learningProgram + '\');"';
																		}else{
																			html+='onclick="submitCourse(\'' + data.enrollmentBy + '\',\'REGISTRATION_NEXT_GRADE\');"';
																		}
																	}else{
																		html+='onclick="submitCourse(\'' + data.enrollmentBy + '\',\'REGISTRATION_NEXT_GRADE\');"';
																	}
																}
																html+='>'
																
																// html+='Continue in '+studentCredit.nextGrade+'</a>'
																html+='Re-Enroll Today Before Too Late</a>'
															+'</div>';
														});
													}
													else if(data.migrationOptionsForImproveGrade!=undefined && data.migrationOptionsForImproveGrade.length>0){
														html+='<div class="col text-center mt-3">';
															$.each(data.migrationOptionsForImproveGrade, function(k, migrationOption) {
																html+=
																'<div class="col text-center mt-2">'
																	+'<a class="design-btn bg-primary font-weight-semi-bold font-size-lg p-2 rounded-15" href="javascript:void(0);"'
																		// if(migrationOption.learningProgram == "DUAL_DIPLOMA" || migrationOption.learningProgram == "ONE_TO_ONE_FLEX"){
																		// 	html+='onclick="callForStudentNextSession(' + migrationOption.currentGradeId + ',\'REGISTRATION_NEXT_GRADE\',\'' + migrationOption.learningProgram + '\');"';
																		// }
																		// // if($.inArray(migrationOption.currentGradeId, [9,10,19,20,21])>=0){
																		// // 	html+='onclick="callForStudentNextSession(' + migrationOption.currentGradeId + ',\'REGISTRATION_NEXT_GRADE\',\'' + migrationOption.learningProgram + '\');"';
																		// // }
																		// // html+='onclick="callForStudentNextSession(' + migrationOption.currentGradeId + ',\'REGISTRATION_NEXT_GRADE\',\'' + migrationOption.learningProgram + '\');"';
																		// else{
																		// 	if($.inArray(migrationOption.currentGradeId, [1,2,3,4,5,6,7,9,10,19,20,21])>=0){
																		// 		html+='onclick="callChoiceForStudentModelRepeaters(\'improve\');"';
																		// 	}else{
																		// 		html+='onclick="submitCourse(\'' + data.enrollmentBy + '\', \'REGISTRATION_REPEAT_GRADE\');"';
																		// 	}
																		// }
																		if($.inArray(migrationOption.currentGradeId, [1,2,3,4,5,6,7,9,10,19,20,21])>=0){
																			html+='onclick="callChoiceForStudentModelRepeaters(\'improve\');"';
																		}else{
																			html+='onclick="submitCourse(\'' + data.enrollmentBy + '\', \'REGISTRATION_REPEAT_GRADE\');"';
																		}
																	html+='>'
																	if(data.registrationType!="ONE_TO_ONE_FLEX"){
																		if(studentCredit.currentGradeId != 7 && data.migrationOptionsForNextGrade!=undefined && data.migrationOptionsForNextGrade.length>0){
																			html+='<i class="fa fa-rocket mr-2"></i>';
																		}
																	}
																	html+='Continue in '+studentCredit.nextGrade+'</a>'
																+'</div>';
															});
														html+='</div>';
													}else{
														html+='<div class="col text-center mt-3">'
															+'<a class="design-btn bg-primary font-weight-semi-bold font-size-lg p-2 rounded-15" href="javascript:void(0);" onclick="callChoiceForStudentModelRepeaters(\'improve\');">8 Continue in '+studentCredit.currentGrade+'</a>'
														+'</div>';
													}
											}
										}
										else if(studentCredit.withDrawSubject == 0 ){
											if(studentCredit.currentGradeId==17 
												|| (studentCredit.currentGradeId>=11 && studentCredit.currentGradeId<16)
												|| (studentCredit.currentGradeId==16  && data.cgpaRule == 'Apply' && studentCredit.avgCumulativeGpa>2.0)
												|| (studentCredit.currentGradeId==16  && data.cgpaRule == 'Dont Apply')){
											if(data.migrationOptionsForNextGrade!=undefined && data.migrationOptionsForNextGrade.length>0){
												html+=
													'<div class="col text-center">'
														+'<a class="design-btn bg-primary font-weight-semi-bold font-size-lg p-2 rounded-15 mt-2" href="javascript:void(0);" onclick="submitCourse(\'' + data.enrollmentBy + '\');">'
														if(data.registrationType!="ONE_TO_ONE_FLEX"){
															if(studentCredit.currentGradeId != 7 && data.migrationOptionsForNextGrade!=undefined && data.migrationOptionsForNextGrade.length>0){
																html+='<i class="fa fa-rocket mr-2"></i>';
															}
														}
														html+='9 Continue in '+studentCredit.nextGrade+'</a>'
													+'</div>';
											}
											}else{
												html+='<div class="col text-center mt-3">'
													+'<a class="design-btn bg-primary font-weight-bold" href="javascript:void(0);" onclick="callChoiceForStudentModelRepeaters(\'improve\');">10 Continue in '+studentCredit.currentGrade+'</a>'
												+'</div>';
											}
										}else{
											html+=+'<div class="col text-center mt-3">'
												+'<a class="design-btn bg-primary font-weight-bold" href="javascript:void(0);" onclick="callChoiceForStudentModelRepeaters(\'improve\');">11 Continue in '+studentCredit.currentGrade+'</a>'
											+'</div>';
										}
									}
									html+=
								'</div>'
								// +'<div class="w-100 text-center font-weight-semi-bold mb-2"><img src="'+PATH_FOLDER_IMAGE2+'shield-svg.svg" width="14" /> Trusted Online School Since 2014</div>'
							+'</div>';
							// if(data.migrationOptionsForNextGrade!=undefined && data.migrationOptionsForNextGrade.length>0){
							// 	if($.inArray(data.migrationOptionsForNextGrade[0].learningProgram, ['ONE_TO_ONE','BATCH'])>=0){
							// 		html+='<p class="mt-1 mb-3 font-weight-semi-bold text-center font-italic font-18 blink text-success">Re-Enrollment Discount available for a limited time! Only '+ discountTimeLimitDays +' days left!</p>';
							// 	}
							// }
						html+='</div>'
					+'</div>'
				+'</div>'
			+'</div>'
			+'<div class="col-xl-3 col-lg-3 col-md-12 col-12 d-flex flex-column">';
				html+=
				`<div class="support-side-card shadow-lg">
					<div class="d-flex align-items-center mb-3">
						${/*<i class="fa fa-headphones support-side-icon mr-3 fa-1x"></i>*/''}
						<h4 class="support-side-heading m-0 font-weight-bold font-16">Need Support?</h4>
					</div>
					<a target="_blank" href="${chatSupportUrl}" class="support-side-item support-side-chat-primary scale-animate">
						<i class="fa fa-comments support-side-icon"></i>
						<div class="support-side-label m-0 font-weight-semi-bold font-11">Live Chat with School Administration</div>
					</a>
					<div class="support-side-item">
						<i class="fa fa-phone support-side-icon fa-1x" style="transform:none;"></i>
						<div>
							<div class="support-side-label font-weight-semi-bold">Phone Support</div>
							<div class="support-side-value font-size-md ">+15854990662</div>
						</div>
					</div>
					<div class="support-side-item">
						<i class="fa fa-envelope support-side-icon fa-1x"></i>
						<div>
							<div class="support-side-label font-weight-semi-bold">Email Support</div>
							<div class="support-side-value font-size-md email-support-value"><a href="mailto:admin.support@internationalschooling.org" style="color:inherit;text-decoration:none;white-space:normal;word-break:break-word">admin.support@internationalschooling.org</a></div>
						</div>
					</div>
				</div>`;
			html+='</div>'
		+'</div>'
	+'</div>';
	html+='<div>'
		// +'<p class="my-3 font-weight-semi-bold text-center font-italic font-18 blink text-success">Re-Enrollment Discount available for a limited time!</p>'
	+'</div>'
	html+='<div class="modal fade fade-scale" tabindex="-1" role="dialog" id="choiceForStudentModel">'
		+'<div class="modal-dialog modal-dialog-centered modal-md box-shadow-none">'
			+'<div class="modal-content">'
				+'<div class="modal-header pt-2 pb-2 bg-primary text-center text-white">'
					+'<h5 class="modal-title" id="myLargeModalLabel">Learning Programs &nbsp;|&nbsp; Enroll In Higher Grade</h5>'
					+'<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
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
										+ '<button type="button" class="send btn btn-primary mb-2 btn-lg text-uppercase text-center mr-2" id="choiceBatch" data-dismiss="modal" '
											+ (migrationOption.learningProgram == 'BATCH' && data.matchSubjectCount > 0 ? 'disabled ' : '')
											+ 'onclick="callForStudentNextSession(' + migrationOption.nextGradeId + ',\'REGISTRATION_NEXT_GRADE\',\'' + migrationOption.learningProgram + '\');">'
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
					// +'<div><span>If you wish to change your learning program, you can reach out to us at <a href="mailto:'+data.emailAccountSupport+'"> '+data.emailAccountSupport+'</a></span></div>'
				+'</div>'
				+'<div class="modal-footer"><button type="button" class="btn btn-danger  pr-4 pl-4" data-dismiss="modal">Close</button></div>'
				+'<div style="clear: both"></div>'
			+'</div>'
		+'</div>'
	+'</div>'

	+'<div class="modal fade fade-scale" tabindex="-1" role="dialog" id="choiceForStudentModelRepeatersPAndC">'
		+'<div class="modal-dialog modal-dialog-centered modal-md box-shadow-none">'
			+'<div class="modal-content">'
				+'<div class="modal-header pt-2 pb-2 bg-primary text-center text-white">'
					+'<h5 class="modal-title" id="myLargeModalLabel">Learning Programs &nbsp;|&nbsp; Repeat The Entire Grade</h5>'
					+'<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
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
											+'<button type="button" class="send btn btn-primary mb-2 btn-lg text-uppercase text-center mr-2" id="choice'+migrationOption.learningProgram+'" data-dismiss="modal" '
											+' onclick="callForStudentNextSession('+migrationOption.currentGradeId+',\'REGISTRATION_REPEAT_GRADE\',\''+migrationOption.learningProgram+'\');">'
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
					// +'<div><span>If you wish to change your learning program, you can reach out to us at <a href="mailto:'+data.emailAccountSupport+'"> '+data.emailAccountSupport+'</a></span></div>'
				+'</div>'
				+'<div class="modal-footer">'
					+'<button type="button" class="btn btn-danger  pr-4 pl-4" onclick="callChoiceForStudentModelRepeatersPAndCBack(\'improve\');">Back</button>'
				+'</div>'
				+'<div style="clear: both"></div>'
			+'</div>'
		+'</div>'
	+'</div>'
	
	+'<div class="modal fade fade-scale" tabindex="-1" role="dialog" id="choiceForStudentModelRepeaters">'
		+'<div class="modal-dialog modal-dialog-centered modal-md box-shadow-none">'
			+'<div class="modal-content">'
				+'<div class="modal-header pt-2 pb-2 bg-primary text-center text-white">'
					+'<h5 class="modal-title" id="myLargeModalLabel">12 Continue in '+studentCredit.currentGrade+'</h5>'
					+'<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
				+'</div>'
				+'<div class="modal-body">'
					+'<div class="row">'
						+'<div class="col-md-12 mb-3 col-sm-12 col-12 mt-2 text-center">'
							+'<div class="d-flex justify-content-center flex-wrap">';
								if(studentCredit.takeIndividualButton == 'Y'){
									html+=
									'<div class="mb-2 text-center">'
										+'<button type="button" class="send btn btn-primary  btn-lg text-uppercase text-center mr-2" id="choiceIndividualCourseImprove" data-dismiss="modal" '
											+'onclick="callForStudentNextSession('+studentCredit.currentGradeId+',\'REGISTRATION_IMPORVE_GRADES\',\''+data.registrationType+'\');">'
											+'Take an individual course'
										+'</button>'
									+'</div>';
								}
								// html+=
								// '<button type="button" class="send btn btn-primary ml-1  btn-lg text-uppercase text-center mr-2" id="choiceRepeatEntire" data-dismiss="modal" onclick="callChoiceForStudentModelRepeatersPAndC();">'
								// 	+'Repeat the entire grade'
								// +'</button>'
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
										'<div class="mb-2 text-center">';
											if(migrationOption.learningProgram=='DUAL_DIPLOMA' || migrationOption.learningProgram == 'ONE_TO_ONE_FLEX'){
												html+='<button type="button" class="send btn btn-primary mb-2 btn-lg text-uppercase text-center mr-2" id="choice'+migrationOption.learningProgram+'" data-dismiss="modal" '
													+' onclick="callForStudentNextSession('+migrationOption.currentGradeId+',\'REGISTRATION_REPEAT_GRADE\',\''+migrationOption.learningProgram+'\');">'
														+'Repeat the entire grade'
													+'</button>';
											}else{
												html+='<button type="button" class="send btn btn-primary mb-2 btn-lg text-uppercase text-center mr-2" id="choice'+migrationOption.learningProgram+'"" '
												+' onclick="callForStudentNextSession('+studentCredit.currentGradeId+',\'REGISTRATION_REPEAT_GRADE\',\''+data.registrationType+'\');">'
													+'Repeat the entire grade'
												+'</button>';
											}
											// +'<button type="button" class="send btn btn-primary mb-2 btn-lg text-uppercase text-center mr-2" id="choice'+migrationOption.learningProgram+'" data-dismiss="modal" '
											// +' onclick="callForStudentNextSession('+migrationOption.currentGradeId+',\'REGISTRATION_REPEAT_GRADE\',\''+migrationOption.learningProgram+'\');">'
											// 	+'Repeat the entire grade'
											// +'</button>';
											
											// if (data.matchSubjectCount > 0 && migrationOption.learningProgram == 'BATCH') {
											// 	html += '<br/>Not eligible for this program';
											// }
										html += '</div>';
									}
								});
							html+='</div>'
						+'</div>'
					+'</div>'
					// +'<div><span>If you wish to change your learning program, you can reach out to us at <a href="mailto:'+data.emailAccountSupport+'"> '+data.emailAccountSupport+'</a></span></div>'
				+'</div>'
				+'<div class="modal-footer"><button type="button" class="btn btn-danger  pr-4 pl-4" data-dismiss="modal">Close</button></div>'
				+'<div style="clear: both"></div>'
			+'</div>'
		+'</div>'
	+'</div>';
	return html;
}

function getCourseSelectionAndReviewContent(){
	var html=
		'<div id="divNextSessionCourseWrapper" style="display:block">'
			+'<div id="pageHeading"></div>'
			+'<div class="mb-3 card">'
				+'<div class="card-body">'
					+'<div id="courseFilterFormWrapper"></div>'
					+'<div id="divNextSessionCourseChoose" style="display:block"></div>'
					+removeAllCorusesModal()
					+'<div id="payment-selection-details"></div>'
				+'</div>'
			+'</div>'
		+'</div>'
		+'<div id="divNextSessionCourseReview" style="display:none">'
			+'<div class="full step-4-skeleton skeleton-wrapper"></div>'
		+'</div>';
	return html;
}


function getStudentMigrationHeader(csr){
	var html=
	'<div class="app-page-title mb-3 mt-2 py-2">'
        +'<div class="page-title-wrapper">'
            +'<div class="page-title-heading w-100">'
                +'<div class="page-title-icon">'
                    +'<i class="fa fa-book text-primary"> </i>'
                +'</div>'
                +'<div class="mx-auto text-center">'
                    // +csr.enrollmentTypeString
                    // +'<span class="text-primary d-inline-block ml-1">';
					// if(csr.registrationType=='ONE_TO_ONE_FLEX'){
					// 	html+=
					// 	`<select class="form-control" name="gradeId" id="gradeId" onchange="switchGrade()" `+(csr.enrollmentType=='REGISTRATION_IMPORVE_GRADES'?'disabled':'')+`>`
					// 		+getStandardContentForFlexy()
					// 	html+=`</select>`;
					// }else{
					// 	html+=' ( '+csr.standardName+' )';
					// }
					if(csr.registrationType=='ONE_TO_ONE_FLEX'){
						html+=`<div class="w-100"><span class="d-inline-block bg-primary px-2 font-size-lg rounded text-white">${csr.registrationTypeString}</span></div>`;
					}else{
						html+=`<div class="w-100"><span class="d-inline-block bg-primary px-2 font-size-lg rounded text-white">${csr.registrationTypeString}</span></div>`;
					}
					html+='<span class="text-primary d-inline-block ml-1">';
						if(csr.registrationType=='ONE_TO_ONE_FLEX'){
							html+=
							`<div class="d-inline-flex align-items-center">
							<label class="m-0 font-16 font-weight-semi-bold">Course Selection For</label>&nbsp;
							<select class="form-control" style="width:fit-content !important" name="gradeId" id="gradeId" onchange="switchGrade()" `+(csr.enrollmentType=='REGISTRATION_IMPORVE_GRADES'?'disabled':'')+`>`
								+getStandardContentForFlexy()
							html+=`</select>
							</div>`;
						}else{
							html+=`<label class="m-0 font-16 font-weight-semi-bold">Select Your Courses for&nbsp;</label><b>${csr.standardName}</b>`;
						}
					html+='</span>'
                +'</div>'
				+'<div class="page-title-icon opacity-0">'
                    +'<i class="fa fa-book text-primary"> </i>'
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
       		'<div class="full migration-Content">'
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
																+'<div class="flex">'
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
									+'<div class="full selected-course primary-bg primary-border-color head bg-primary">'
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
																+'<div class="flex">'
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
																								html+=`<a href="javaScript:void(0);" onclick="openCourseDetailModal('`+subject.courseDescriptionUrl+`', '`+subject.subjectName+`')" class="view-course-details theme-text" style="font-size:11px; color:var(--pc) !important;">Course Summary</a>`;
																								// html+='<a href="'+subject.courseDescriptionUrl+'" target="_blank" class="view-course-details theme-text">View Course Details</a>'
																							}
																						html+=
																						'</div>'
																						+'<div>'
																							+'<label for="course_id_'+subject.subjectId+'" class="m-0 add-course-button primary-bg secondary-hov-bg white-txt-color bg-primary text-white cursor">'
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
				+'<div class="full mt-2">';
					html+='<input type="submit" class="btn btn-next btn-fill pl-4 pr-4 btn-wd pull-right text-white" style="background-color:var(--pc) !important" name="sessionPaymentSubmit" id="nextSesionStep" value="Next" onclick="submitCourse(\'' + csr.enrollmentBy + '\');">'
					+getCourseSelectionBackButtonContent(csr)
				+'</div>'
				+noTeacherAssistanceAvailableModal(csr)
				+apCourseSelectionWarningModal()
				+removeAllCorusesModal()
				+creditsLimitsModal()
				+creditsLimitsOverModal()
				+changeSelectedGradeModal()
				+upgradeCorusesModal()
				+'<div id="payment-selection-details"></div>'
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
								+'<div class="full selected-course primary-bg primary-border-color head bg-primary">'
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
															+'<div class="flex">'
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
				+'<input type="submit" class="btn btn-next btn-fill pl-4 pr-4 btn-wd pull-right text-white" style="background-color:#007fff !important" name="sessionPaymentSubmit" id="nextSesionStep" value="Next" onclick="submitCourse();">'
				+getCourseSelectionBackButtonContent(csr)
			+'</div>'
		+'</div>';
	return html;
}

function getCourseSelectionBackButtonContent(csr){
	if(csr.registrationType=='BATCH' || csr.registrationType=='ONE_TO_ONE'){
		return '';
	}
	return '<div class="mb-2"><button type="button" class="btn theme-bg text-white pl-4 pr-4" onclick="displaySection1();">Back</button></div>';
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
						<button type="button" id="gradeChangeWarningYes" class="btn btn-success  pr-4 pl-4">Yes</button>
						<button type="button" id="gradeChangeWarningNo" class="btn btn-primary  pr-4 pl-4">No</button>
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
							+'<button id="noTeacherAssistanceAvailableNo" type="button" class="btn btn-danger " data-dismiss="modal">No</button>'
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
							+'<button id="apCourseSelectionWarningNo" type="button" class="btn btn-danger " data-dismiss="modal">No</button>'
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
								+'<button type="button" class="btn btn-danger " data-dismiss="modal">No</button>'
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
				+'<div class="modal-content rounded-10 text-center">'
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

function submitApplicationWarningModal(){
	var html = 
		'<div class="modal fade" id="submitApplicationWarning">'
			+'<div class="modal-dialog modal-sm modal-dialog-centered" role="document" style="box-shadow: none; width: 450px; max-width: 100%;">'
				+'<div class="modal-content text-center">'
					+'<div class="modal-header bg-white justify-content-center" style="width: 100% !important; padding: 0 0 !important; height: 45px; border: none;"></div>'
						+'<div class="modal-body delete-modal">'
							+'<i class="fa fa-info" style="color: #fff !important; background: #f44336; border-radius: 50%; font-size: 40px; position: absolute; top: -85px; right: 0; left: 0; margin: 0 auto; width: 75px; line-height: 75px;"></i>'
							+'<p class="heading" style="color: #f44336; font-family: arial; font-size: 18px; line-height: 28px; letter-spacing: 0.3px;">Are you sure you want to submit your application form? Once you proceed, the details entered during the enrollment process will not be changed.</p>'
						+'</div>'
						+'<div class="modal-footer text-center" style="border: none; padding: 0; margin-bottom: 15px;">'
							+'<div class="text-center" style="margin: 0 auto;">'
								+'<button type="button" class="btn mr-2" style="color: #f44336 !important; border: 1px solid #f44336 !important; background: transparent !important;"onclick="callForApplicationSubmit()">Yes</button>'
								+'<button type="button" class="btn btn-danger " data-dismiss="modal">No</button>'
							+'</div>'
						+'</div>'
				+'</div>'
			+'</div>'
		+'</div>';
		return html;
}

function logoutModalLogout(data){
	var html = '';
	html='<div class="modal fade theme-modal fade-scale " id="logout_modal_logout" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" data-keyboard="false">'
		+'<div class="modal-dialog modal-lg" role="document" style="top:50%;transform: translateY(-50%);">'
			+'<div class="modal-content" style="border-radius: 0; border: 0; margin-top:0 !important;">'
				+'<div class="modal-header theme-header white-text" style="width: 97%; margin: 0 auto; border-radius: 0;position:relative;top:-25px;">'
					+'<h4 class="modal-title" style="color: #fff; margin-left: 10px;">Payment Under Review</h4>'
				+'</div>'
				+'<div class="modal-body" style="height:auto; max-height:60vh; overflow:auto;">'
					+'<div class="full text-center">'
						+'<br/>'
						+'<h2 class="modal-title  text-center fw-600 " style="margin-bottom: 15px;">Your payment is under review.</h2>'
						+'<h4 class="modal-title  text-center">';
							if(data.enrollmentType!='REGISTRATION_REGISTER'){
								html+='You will be able to access the dashboard once the payment is received.';
							}
							html+=
							'You can contact us at ' 
							+'<b>'
								+' <a href="mailto:'+data.contactEmail+'" target="_blank">'+data.contactEmail+'</a>'
							+'</b> for more information'
						+'</h4>'
						+'<br/>'
						+'<p class="text-center">'
							+'<button type="button" class="btn bg-primary  text-white" onclick="logout();">Log out</button>'
						+'</p>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>'
	+'</div>';
	return html;	
}

function openStudentPaymentModalSafely(){
	var $paymentModal = $("#studentPaymentModal");
	if($paymentModal.length === 0){
		return;
	}
	// Clear stale modal artifacts (common after refresh/partial reloads on some UAT setups).
	$(".modal-backdrop").remove();
	$("body").removeClass("modal-open").css("padding-right", "");
	$paymentModal.removeClass("show in").hide();
	$paymentModal.removeData("bs.modal");

	$paymentModal.modal({
		backdrop: "static",
		keyboard: false,
		show: false
	});
	// Support both Bootstrap 4(.show) and Bootstrap 3(.in) modal visible classes.
	var $otherOpenModals = $(".modal.show, .modal.in").not($paymentModal);
	if($otherOpenModals.length > 0){
		var remaining = $otherOpenModals.length;
		var showPaymentModal = function(){
			if(remaining <= 0){
				window.setTimeout(function(){
					$paymentModal.modal("show");
				}, 0);
			}
		};
		$otherOpenModals.one("hidden.bs.modal", function(){
			remaining--;
			showPaymentModal();
		});
		$otherOpenModals.modal("hide");
		// Fallback for environments where hidden event may not reliably fire.
		window.setTimeout(function(){
			if(remaining > 0){
				remaining = 0;
			}
			showPaymentModal();
		}, 400);
		return;
	}
	window.setTimeout(function(){
		$paymentModal.modal("show");
	}, 0);
}

async function renderPaymentMode(){
	console.log("Modal open function called")
	$("#studentPaymentModal").remove();
	$("body").append(await getPaymentModeContent());
	if(SHOW_PAYMENT_OPTION == 'Y'){
		openStudentPaymentModalSafely();
	}
}

function repeatGradeClick(enrollmentBy, enrollmentType, standardId, registrationType, courseProviderId) {
    $('#choiceForStudentModelRepeaters').one('hidden.bs.modal', function () {
		if(MIGRATION_DATA.registrationType != "DUAL_DIPLOMA"  || MIGRATION_DATA.registrationType != "ONE_TO_ONE_FLEX"){
			if(GRADE_FEE_DONE && MIGRATION_DATA.migrationOptionsForNextGrade.length<1){
				if($("#divNextSessionCourseChoose").length<1){
					$("#courseSelectionWrapper").html(getCourseSelectionAndReviewContent());
				}
				// $('#gradeId').val(standardId);
				// $('#registrationType').val(registrationType);
				// $('#courseProviderId').val(courseProviderId);
				displaySection2();
				getAllCourseDetails('N', '');
			}else{
				submitCourse(enrollmentBy, enrollmentType);
			}
		}
	}).modal('hide');
}

async function getPaymentModeContent(cdrDTO){
	var html=
	'<div class="modal fade max-size-modal" id="studentPaymentModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">'
		+'<div class="modal-dialog modal-md" role="document" style="max-width:550px">'
			+'<div class="modal-content rounded-20">'
				+'<div class="modal-header py-2 rounded-10 bg-white text-dark">'
					+'<h5 class="modal-title payment-option-modal-title" style=" margin-left: 10px;">Payment Option</h5>'
					+'<button type="button" class="close opacity-10" aria-label="Close" data-dismiss="modal"><span aria-hidden="true" class="text-white d-inline-block bg-red ">&times;</span></button>'
				+'</div>'
				+'<div class="modal-body pt-1" style="display:inline-block;width:100%;">'
					+skeletonFeeDetails()
				+'</div>'
			+'</div>'
		+'</div>'
	+'</div>';
	return html;
}

async function paymentModalContentWithData(cdrDTO){
	$(".feeDetailsContentDiv").remove();
	var html = 
	`<div class="col-md-12 col-sm-12 col-xs-12 p-0 feeDetailsContentDiv">
		<div class="label-floating feePayMode">
			<div class="col-md-12 col-sm-12 col-xs-12 p-0">
				<div class="text-dark mb-2 font-weight-semi-bold">You have to choose from ${getPaymentOptionCount(cdrDTO)} option</div>
				<div class="payment-item flex-column">`;
				if(cdrDTO.bookASeatOpted == 1 && cdrDTO.enrollmentFee != null && cdrDTO.enrollmentFee.enrollmentFee>0 && !cdrDTO.bookAnEnrollmentPaidStatus){
					html+=
					`<div class="radio radio-payment-option white-txt-color my-0 mb-2" style="height:inherit">
						<input id="pay-registration" value="1" type="radio" name="payModeCheckboxes">
						<label for="pay-registration" class="payment-card border rounded-10 d-flex align-items-center justify-content-between w-100 px-3 py-1" style="min-height:inherit" onclick="displayScholorshipDetails(\'dtl-registration\');">
							<div class="d-flex align-items-center">
								<span class="circle border ml-0 checkbox-border" style="top:inherit"></span>
								<span class="check" style="top:inherit"></span>
								<div class="ml-3" id="payFive"> 
									<b class="text-dark d-block ml-2 font-weight-semi-bold"> Reserve an Enrollment Seat</b>
								</div>
							</div>
							<div class="text-right">
								<div class="d-flex align-items-center justify-content-end text-dark">
									<div class="font-weight-bold font-20 amount">${cdrDTO.enrollmentFee.enrollmentFeeString}</div>
								</div>
							</div>
						</label>
					</div>`;
				}
				if(cdrDTO.oneTimePayment!=''){
					html+=
					`<div class="radio radio-payment-option white-txt-color my-0 mb-2" style="height:inherit">
						<input id="pay-one" value="1" type="radio" name="payModeCheckboxes">
						<label for="pay-one" class="payment-card border rounded-10 d-flex align-items-center justify-content-between w-100 px-3 py-1" style="min-height:inherit" onclick="displayScholorshipDetails(\'dtl-one\');">
							<div class="d-flex align-items-center">
								<span class="circle border ml-0 checkbox-border" style="top:inherit"></span>
								<span class="check" style="top:inherit"></span>
								<div class="ml-3" id="payOne">`;
									if(cdrDTO.oneTimePayment.paymentOptionDiscount > 0){
										html+=`<div class="text-dark d-block ml-2 font-weight-semi-bold">Pay one time & <b class="text-success font-weight-semi-bold">save ${cdrDTO.oneTimePayment.paymentOptionDiscountString}</b></div>`;
									}else{
										html+=`<b class="text-dark d-block ml-2">Pay one time</b>`;
									}
									html+=`<div class="text-muted small ml-2 font-12">Best value option</div>
								</div>
							</div>
							<div class="text-right">
								<div class="d-flex align-items-center justify-content-end text-dark">
									<div class="font-weight-bold font-20 amount">${cdrDTO.oneTimePayment.payableFeeString}</div>`;
									// if(cdrDTO.oneTimePayment.paymentOptionDiscount > 0){
									// 	html+=`<div class="badge ml-2 bg-success rounded-20 font-normal text-capitalize text-white">Save ${cdrDTO.oneTimePayment.youSave.totalEntityFeeString}</div>`;
									// }
								html+=`</div>`;
								// if(cdrDTO.oneTimePayment.paymentOptionDiscount > 0){
								// 	html+=`<div class="old-price font-12 text-dark">${cdrDTO.courseFeeString}</div>`;
								// }
							html+=`</div>
						</label>
					</div>`;
				}
				if(cdrDTO.monthlyFeeDetails!=null && cdrDTO.monthlyFeeDetails!=''){
					html+=
					`<div class="radio radio-payment-option white-txt-color my-0 mb-2" style="height:inherit">
						<input id="pay-three" value="2" type="radio" name="payModeCheckboxes">
						<label for="pay-three" class="payment-card border rounded-10 d-flex align-items-center justify-content-between w-100 px-3 py-1" style="min-height:inherit" onclick="displayScholorshipDetails(\'dtl-three\');">
							<div class="d-flex align-items-center">
								<span class="circle border ml-0 checkbox-border" style="top:inherit"></span>
								<span class="check" style="top:inherit"></span>
								<div class="ml-3">
									<b class="text-dark d-block ml-2 font-weight-semi-bold">
										${/*
											${cdrDTO.monthlyFeeDetails.paymentMode}`;
											if(cdrDTO.schoolId==5){
												html+=`(4 Installments, every 3 months)`;
											}else{
												html+=`Pay in easy installments`;
											}	
										*/''}
										Pay in easy installments
									</b>
									<div class="text-muted small ml-2 font-12">Flexible payment plan</div>
								</div>
							</div>
							<div class="text-right">
								<div class="d-flex align-items-center justify-content-end text-dark">
									<div class="font-weight-bold font-20 amount">${cdrDTO.monthlyFeeDetails.payableFeeString}</div>
								</div>
								<div class="text-muted small ml-2 font-12">Monthly payments available</div>
							</div>
						</label>
					</div>`;
				}
				if(cdrDTO.customPaymentEnabled!=null && cdrDTO.customPaymentEnabled!=''){
					html+=
					`<div class="radio radio-payment-option white-txt-color my-0 mb-2" style="height:inherit">
						<input id="pay-custom" value="5" type="radio" name="payModeCheckboxes">
						<label for="pay-custom" class="primary-border-color border rounded-10" onclick="displayScholorshipDetails(\'dtl-custom\');">
							<span class="circle primary-border-color ml-0"></span>
							<span class="check"></span>
							<span class="checked-font-style primary-txt-color" style="margin-left: 35px; line-height:21px">
								<b>Customized plan (Pay in easy installments)</b><br>
								${paymentCalculationResponse.paymentDetails.totalPayableAmountString}
							</span>
						</label>
					</div>`;
				}
				html+=`</div>
			</div>
			<div class="col-md-12 col-sm-12 col-xs-12 p-0">
				<div class="row">
					<div class="col-md-12 col-sm-12 col-xs-12">
						<div class="scholarship-details">`;
							if(cdrDTO.oneTimePayment!=null){
								html+=
								`<div class="w-100 p-2 pb-3 rounded-10 border annual-course-fee-details" style="display: none;background-color:#F9FAFB;">
									<h5 class="text-dark font-weight-semi-bold font-16 mb-2 font-16">Fee Breakdown</h5>
									<div class="d-flex flex-wrap">
										<span class="text-muted">${(parseInt($('#gradeId').val()) == 20) ? 'Course Fee + Enrollment Fee' : 'Course Fee'}</span>
										<span class="font-weight-semi-bold text-dark ml-auto d-inline-block">${cdrDTO.courseFeeString}</span>
									</div>`;
									if(cdrDTO.oneTimePayment!='' && (cdrDTO.feeAlreayPaid!=null && cdrDTO.feeAlreayPaid.totalEntityFee>0)){
										html+=`<hr class="my-1" />
										${commonPaymentTableForPaymentModal(cdrDTO, "annually")}`
									}
								html+=`</div>`;
							} 
							if(cdrDTO.monthlyFeeDetails!=null &&  cdrDTO.monthlyFeeDetails!=''){
								html+=
								`<div class="w-100 bg-light p-2 pb-3 rounded-10 border installment3-course-fee-details" id="installment3-course-fee-details" style="display: none;">
									<h5 class="text-dark font-weight-semi-bold font-16 mb-2 font-16">Fee Breakdown</h5>
									<div class="d-flex flex-wrap">
										<span class="text-muted">${(parseInt($('#gradeId').val()) == 20) ? 'Course Fee + Enrollment Fee' : 'Course Fee'}</span>
										<span class="font-weight-semi-bold text-dark ml-auto d-inline-block">${cdrDTO.courseFeeString}</span>
									</div>`;
									if(cdrDTO.monthlyFeeDetails!=null &&  cdrDTO.monthlyFeeDetails!=''){
										html+=`<hr class="my-1" />
										${commonPaymentTableForPaymentModal(cdrDTO,'monthly')}`
									}
								html+=`</div>`;
							}
							html+=`<div class="row">
								<div class="col-md-12">
									<div class="table-responsive">`;
									if(cdrDTO.bookAnEnrollmentPaidStatus!=null && cdrDTO.enrollmentFee != null && cdrDTO.enrollmentFee.enrollmentFee>0 && !cdrDTO.bookAnEnrollmentPaidStatus){
										html+=
										`<div  id="book-seat-fee-details" class="full" style="display: none;">
											${getBookAnEnrollmentTable(cdrDTO)}
										</div>
										<div id="BookEnrollmentSeat" class="mb-1 full" style="display: none;">‘Reserve an Enrollment Seat’ Fee of&nbsp;<b>${cdrDTO.enrollmentFee.enrollmentFeeString}</b>&nbsp;is non-refundable.</div>`;
									}
									console.log(cdrDTO);
									if(cdrDTO.oneTimePayment!='' && cdrDTO.oneTimePayment.paymentOptionDiscount > 0){
										html+=
										`<div class="w-100 annual-course-fee-details" id="annual-course-fee-details" style="display:none">
											<div class="w-100 p-2 rounded-10 border border-success mt-2" style="background-color:#F0FDF4;">
												<h5 class="text-dark font-weight-semi-bold font-16 mb-2">Fee Discount</h5>`;
													if(cdrDTO.oneTimePayment.youSave != null){
														if(cdrDTO.oneTimePayment.youSave.description!=null && cdrDTO.oneTimePayment.youSave.description.length>0){
															$.each(cdrDTO.oneTimePayment.youSave.entityDescriptions, function(k, item) {
																html+=
																`<div class="d-flex flex-wrap my-1">
																	<span class="text-dark">${parseInt(k)+1}. ${item.entityDescription}</span>
																	<span class="font-weight-semi-bold text-dark ml-auto d-inline-block">-${item.entityFee}</span>
																</div>`;
															});
															// $.each(cdrDTO.oneTimePayment.youSave.entityFees, function(k, fee) {
															// 	html+=`<span class="font-weight-semi-bold text-dark ml-auto d-inline-block">${fee}</span>`;
															// });
														}
													}
													html+=`<hr class="mb-0"/>
														<div class="d-flex flex-wrap my-1">
															<span class="text-dark font-16 font-weight-bold">Total Discount</span>
															<span class="font-18 font-weight-bold text-dark ml-auto d-inline-block">-${cdrDTO.oneTimePayment.youSave.totalEntityFeeString}</span>
														</div>`
													console.log(cdrDTO)
											html+=`</div>
											<div class="full">
												<div class="d-flex flex-wrap my-1">
													<span class="text-dark font-16 font-weight-semi-bold">Payable Fee</span>
													<span class="font-24 font-weight-bold text-dark ml-auto d-inline-block">${cdrDTO.oneTimePayment.payableFeeString}</span>
												</div>
											</div>
										</div>
										${/*
											<table id="annual-course-fee-details" class="table table-bordered table-striped without_h_scroll" style="display: none;">
												<thead class="theme-bg primary-bg white-txt-color">
													<tr>
														<th style="width: 60%;">Fee Description</th>
														<th style="width: 20%;text-align:center"><span class="previewPaymentOption"></span> Fee (${cdrDTO.currencyIsoCode})</th>
														<th style="width: 20%; text-align:center">Total Fee</th>
													</tr>
												</thead>
												<tbody>
													${getAnnualPaymentTable(cdrDTO)}
												</tbody>
											</table>
										*/''}`;
									}
									if(cdrDTO.monthlyFeeDetails!=null &&  cdrDTO.monthlyFeeDetails!=''){
										if(cdrDTO.monthlyFeeDetails.youSave.description!=null){
											html+=
											`<div class="w-100 installment3-course-fee-details" id="installment3-course-fee-details" style="display:none">
												<div class="w-100 bg-light-success p-2 rounded-10 border border-success mt-2">
													<h5 class="text-dark font-weight-semi-bold font-16 mb-2">Fee Discount</h5>`;
													
														if(cdrDTO.monthlyFeeDetails!=null && cdrDTO.monthlyFeeDetails.youSave!=null){
															if(cdrDTO.monthlyFeeDetails.youSave.description.length>0){
																$.each(cdrDTO.monthlyFeeDetails.youSave.entityDescriptions, function(k, item) {
																	html+=
																	`<div class="d-flex flex-wrap my-1">
																		<span class="text-dark">${parseInt(k)+1}. ${item.entityDescription}</span>
																		<span class="font-weight-semi-bold text-dark ml-auto d-inline-block">-${item.entityFee}</span>
																	</div>`;
																});
																html+=`<hr class="mb-0"/>
																<div class="d-flex flex-wrap my-1">
																	<span class="text-dark font-16 font-weight-bold">Total Discount</span>
																	<span class="font-18 font-weight-bold text-dark ml-auto d-inline-block">-${cdrDTO.monthlyFeeDetails.youSave.totalEntityFeeString}</span>
																</div>`;
															}
														}
												html+=`</div>
												<div class="full">
													<div class="d-flex flex-wrap my-1">
														<span class="text-dark font-16 font-weight-semi-bold">Payable Fee</span>
														<span class="font-24 font-weight-bold text-dark ml-auto d-inline-block">${cdrDTO.monthlyFeeDetails.payableFeeString}</span>
													</div>
												</div>
											</div>`;
										}
										html+=
										`<div class="full installment3-course-fee-details mt-2" style="display:none">
											<table class="table table-bordered table-striped without_h_scroll border-radius-table">
												<thead>
													<tr>
														<th colspan="3" class="font-18 font-weight-bold text-dark bg-light">Fee Schedule</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td class="theme-bg primary-bg white-txt-color">Fee Description</td>
														<td class="theme-bg primary-bg white-txt-color" style="text-align:center"><span class="previewPaymentOption"></span>Total Fee</td>
														<td class="theme-bg primary-bg white-txt-color" style="text-align:center">Paying Now</td>
													</tr>
													${monthlyFeeShchedule(cdrDTO)}
												</tbody>
											</table>
										</div>`;
									}
									if(cdrDTO.paymentCalculationResponse!=''){
										html+=
										`<table id="custom-course-fee-details" class="table table-bordered table-striped without_h_scroll" style="display: none;">
											<thead class="theme-bg primary-bg white-txt-color">
												<tr>
													<th>Fee Description</th>
													<th style="text-align:center"><span class="previewPaymentOption"></span> Fee ${cdrDTO.currencyIsoCode}</th>
													<th style="text-align:center">Total Fee</th>
												</tr>
											</thead>
											<tbody>
												${getCustomizedPaymentTable(cdrDTO)}
											</tbody>
										</table>`;
									}
									html+=`</div>
								</div>
							</div>
						</div>
						<div>
							<p class="py-1 rounded bg-light text-center thank_trusting font-12 font-weight-normal ${cdrDTO.oneTimePayment.paymentOptionDiscount > 0 ? "":"mt-2"}" style="display:none"><i class="fa fa-heart text-primary"></i>&nbsp;Thank you so much for trusting and choosing <b class="text-primary">${SCHOOL_NAME}</b></p>
						</div>
					</div>
					<div class="col-md-12 col-sm-12 col-xs-12">
						<div class="row">
							<div class="col-12 text-center thank_trusting" style="display:none">
								<button type="button" class="btn btn-lg theme-bg primary-bg white-txt-color font-18" onclick="choosePaymentOption();">Continue <i class="fa fa-arrow-right"></i></button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>`;
	$("#studentPaymentModal .modal-body").append(html);
}

function getReviewAndPayRendered(data, partnerEnrollmentFlag, signupType){
	if($("#divNextSessionCourseChoose").length<1){
		$("#courseSelectionWrapper").html(getCourseSelectionAndReviewContent());
	}
	$('#divNextSessionCourseReview').html(getReviewAndPayContent(data, partnerEnrollmentFlag, signupType)+submitApplicationWarningModal());
	// divNextSessionCourseReview divNextSessionCourseChoose
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
	

	if(data.isOptedAlternetPaymentMethod==1){
		$('#logout_modal_logout').modal('show');
	}else if(data.isOptedAlternetPaymentMethod==2){
		$('#wu_payment_warning').modal('show');
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

function getReviewAndPayContent(data, partnerEnrollmentFlag, signupType){
	var signupCourse=data.signupCourse;
	var html=
    `<div class="app-page-title my-2">
		<div class="page-title-wrapper">
			<div class="page-title-heading">
				<div>Kindly Review Your Details</div>
			</div>
		</div>
	</div>
	<div class="form-row">
		<input type="hidden" value="${signupType}" id="signupType"/>`;
		if(data.signupCourse.courseDTO.length>0){
			html+=
			`<div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
				${courseDetailsPreview(data, partnerEnrollmentFlag)}
			</div>`;
		}
		if(SHOW_PAYMENT_OPTION=='Y'){
			html+=
			`<div class="${data.signupCourse.courseDTO.length<1? 'col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12':'col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12'} ">
				<div class="mb-3 card rounded-15">
					<div class="card-header bg-primary text-white rounded-top-left-15 rounded-top-right-15 py-2 h-auto font-weight-semi-bold text-transform-none">${data.feeSetionTitile}</div>
					<div class="card-body py-2 px-3 ">
						${SHOW_PAYMENT_OPTION=='Y' ? feePaymentReview1(data):""}
					</div>
				</div>
			</div>`;
		}
	html+=`</div>
	<div class="col-md-12 col-sm-12 p-0 mt-3">`;
		if(partnerEnrollmentFlag != "P" && SHOW_PAYMENT_OPTION == 'Y'){
			if(data.advanceFeeEnabled && $("#divNextSession").length>0 && !TAKE_INDIVIDUAL_COURSE){
				html+=`<button class="btn theme-bg text-white pl-4 pr-4 pull-left" onclick="backCourseSelection(1);">Back</button>`;
			}else if(!data.customPaymentEnabled){
				console.log("data", data)
				html+=`<button class="btn theme-bg text-white pl-4 pr-4 pull-left" onclick="backCourseSelection(2);">Back</button>`;
			}
			var hasAdvance = data.advanceFeeEnabled || data.gradeFeeDone || data.advancePaymentApplied;
			var paynow=true;
			// TIC / Repeat: advance already paid → no extra payment needed, takes priority
			if(data.advancePaymentApplied && !data.extraCoursePaymentRequired){
				paynow=false;
			} else if(data.advanceFeeEnabled || data.gradeFeeDone){
				if(data.feePaymentDetailsResponse.advanceFeeDetails!=null && data.feePaymentDetailsResponse.advanceFeeDetails.payableFee<=0){
					paynow=false;
				}
			}
			if(hasAdvance){
				html+=`<button class="btn theme-bg text-white pl-4 pr-4 pull-right ml-2" onclick="callForProgressionToDashboard();">${(paynow?'Pay Later':'Proceed to Dashboard')}</button>`;
			}
			if(paynow){
				html+=`<button class="btn bg-success text-white pl-4 pr-4 pull-right" onclick="getPaymentGatewaysOptions(\'${data.schoolId}\',\'${data.schoolId}\',\'${data.userPaymentDetailsId}\',\'${data.entityType}\',\'${data.entityId}\',\'${USER_ID}\');">Pay Now</button>`;
			}
		}else{
			html+=`<button class="btn theme-bg text-white pl-4 pr-4 pull-left" onclick="backCourseSelection(2);">Back</button>
			<button class="btn theme-bg text-white pl-4 pr-4 pull-right" onclick="showPaymentModal();">Submit Application</button>`;
		}
	html+=
	`</div>`;

	html += wuPaymentWarningModal(data);
	html += logoutModalLogout(data);
	html += goToDashboardWarningMessageModal(data);
	// html += smoovPayContent(data);

	return html;
}

function courseDetailsPreview(data, partnerEnrollmentFlag){
	var signupCourse=data.signupCourse;
	var cdrDTO=data.feePaymentDetailsResponse;
	var html =
	`<div class="mb-3 card rounded-15">
		<div class="card-header bg-primary text-white rounded-top-left-15 rounded-top-right-15 py-2 h-auto d-flex flex-wrap"><span class="d-inline-flex font-weight-semi-bold text-transform-none">Selected Courses</span><span class="d-inline-flex py-1 px-2 rounded bg-white text-primary ml-auto font-weight-semi-bold">${signupCourse.standardName}</span></div>
		<div class="card-body card-body py-2 px-3 ">
			<div>
				<table class="table border-radius-table font-12 border rounded-10 overflow-hidden">
					<thead class="bg-light">
						<tr>
							<th><b>Course Name</b></th>`;
							if($.inArray(signupCourse.standardId, [17,11,12,13,14,15,16]) == -1) {
								html+=`<th><b>Credit</b></th>`;
							}
							html+=
						`</tr>
					</thead>
					<tbody>`;
						$.each(signupCourse.courseDTO, function(k, courseDt) {
							if(courseDt.courseName.startsWith('Spanish') && (data.schoolId==1 || data.schoolId==3) && data.standardId>=11 && data.standardId<=17){

							}else{
								html+=
								`<tr>
									<td>${courseDt.courseName}</td>`;
									if($.inArray(signupCourse.standardId, [17,11,12,13,14,15,16]) == -1) {
										html+=`<td>${courseDt.creditScore}</td>`
									}
								html+=
								`</tr>`;
							}
						});
					html+=`</tbody>`;
					if($.inArray(signupCourse.standardId, [17,11,12,13,14,15,16]) == -1) {
						html+=
						`<tfoot class="overflow-hidden" style="border-top-left-radius:0px !important;border-top-right-radius:0px !important">
							<tr class="bg-light" style="border-top-left-radius:0px !important;border-top-right-radius:0px !important">
								<th style="border-top-left-radius:0px !important;border-top-right-radius:0px !important">Total Credit</th>
								<th style="border-top-left-radius:0px !important;border-top-right-radius:0px !important">${signupCourse.totalCredit}</th>
							</tr>
						</tfoot>`;
					}
				html+=`</table>
			</div>`;
			if(cdrDTO.feeAlreayPaid!=null && cdrDTO.feeAlreayPaid.totalEntityFee>0){
				html+=
				`<div class="mt-2 border border-success rounded-10 p-2" style="background-color:#F0FDF4;">
					<div class="d-flex w-100 flex-nowrap align-items-center gap-10">
						<div class="d-inline-flex border border-dark-success p-1 rounded-circle flex-shrink-0" style="width:40px;height:40px">
							<span class="d-inline-flex bg-dark-success w-100 text-white rounded-circle justify-content-center align-items-center">
								<i class="fa fa-check font-16"></i>
							</span>
						</div>
						<div class="d-inline-flex flex-nowrap align-items-center flex-grow-1 gap-10">
							<div class="d-inline-flex flex-column px-2 flex-grow-1">
								<h6 class="font-12 font-weight-semi-bold text-dark">Fee Already Paid (Advance Fee)</h6>
								<p class="m-0 font-10">Your advance fee has been received successfully</p>
								<span class="font-weight-bold font-12 text-dark">THANK YOU!</span>
							</div>`;
							if(cdrDTO.feeAlreayPaid!=null && cdrDTO.feeAlreayPaid.totalEntityFee>0){
								html+=
								`<div class="d-inline-flex text-dark flex-grow-0 flex-shrink-0 border-left btn-dashed border-success flex-column px-2 justify-content-center" style="min-width:100px">
									<span class="font-weight-bold font-10">PAID AMOUNT</span>
									<h6 class="font-weight-bold font-14">${cdrDTO.feeAlreayPaid.totalEntityFeeString}</h6>
								</div>`;
							}
						html+=`</div>
					</div>
				</div>`;
			}
		html+=`</div>
	</div>`;
	return html;
}
		
function feePaymentReview(data){
	var signupCourse=data.signupCourse;
	var cdrDTO=data.feePaymentDetailsResponse;
	var html=
	'<div class="full amount-description">'
		+'<h5 class="font-weight-bold text-center" style="margin-bottom:15px;">'
			+data.feeSetionTitile;
			if(!data.customPaymentEnabled || ((cdrDTO.advanceFeeEnabled || cdrDTO.gradeFeeDone) && (cdrDTO.advanceFeeDetails.monthlyFees==null || cdrDTO.advanceFeeDetails.monthlyFees.length==0) ) ){
				if(cdrDTO.monthlyFeeDetails!=null && cdrDTO.monthlyFeeDetails.monthlyFees.length>0){
					html+='<span class="primary-bg change-grade" onclick="backCourseSelection(\'2\', true)">Change Plan <i class="fa fa-exchange" style="font-family:FontAwesome"></i></span>';
				}
			}
		html+='</h5>'
		+'<div class="table-responsive">'
			+'<table class="table-style">'
				+'<thead>'
					+'<tr>'
						+'<th class="th">Fee Description</th>'
						+'<th class="th" style="text-align:center;">Fee ('+data.currencyIsoCode+')</th>'
						+'<th class="th" style="text-align:center;">Total Fee</th>'
					+'</tr>'
				+'</thead>'
				+'<tbody>';
				
				if($("#enrollmentType").val() == "REGISTRATION_NEXT_GRADE" || $("#enrollmentType").val() == "REGISTRATION_REPEAT_GRADE"){
					if(signupCourse.payMode == 'registration'){
						html+=getBookAnEnrollmentTable(cdrDTO);
					}else if(signupCourse.payMode == 'annually'){
						html+=getAdvancePaymentTable(cdrDTO);
					}else if(signupCourse.payMode == 'threeMonthly' || signupCourse.payMode == 'sixMonthly'){
						html+=getAdvancePaymentTable(cdrDTO);
					}else if(signupCourse.payMode == 'c_installment' || signupCourse.payMode == 'c_annually'){
						html+=getAdvancePaymentTable(cdrDTO);
					}else if(signupCourse.payMode == 'a_partially' || signupCourse.payMode == 'a_installment' || signupCourse.payMode == 'a_annually'){
						html+=getAdvancePaymentTable(cdrDTO);
					}
				}else{
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
				`<div class="full">
					<table class="table border-radius-table table-bordered">
						<thead>
							<tr>
								<th colspan="3" class="bg-light py-1 font-16">Fee Schedule</th>
							</tr>
						</thead>
						<thead>
							
						</thead>
						<tbody>
							<tr class="bg-primary text-white">
								<th>Fee Description</th>
								<th style="text-align:center"><span class="previewPaymentOption"></span>Total Fee</th>`;
								// if(signupCourse.payMode == 'a_partially' || signupCourse.payMode == 'a_installment' || signupCourse.payMode == 'a_annually'){
									html+=`<th style="text-align:center">Status</th>`;
								// }else{
									// html+='<th style="width: 20%; text-align:center">Paying Now</th>';
								// }
								html+=
							`</tr>`;
							// if(signupCourse.payMode == 'a_partially' || signupCourse.payMode == 'a_installment' || signupCourse.payMode == 'a_annually'){
								html+=advanceFeeShchedule(cdrDTO);
							// }else{
								// html+=monthlyFeeShchedule(cdrDTO);
							// }
							html+=
						`</tbody>
					</table>
				</div>`;
			}	
		html+=`</div>
	</div>`;
	return html;
}
function feePaymentReview1(data){
	var signupCourse=data.signupCourse;
	var cdrDTO=data.feePaymentDetailsResponse;
	var html=
		`<div class="full">`;
			if(!data.customPaymentEnabled || ((cdrDTO.advanceFeeEnabled || cdrDTO.gradeFeeDone) && (cdrDTO.advanceFeeDetails.monthlyFees==null || cdrDTO.advanceFeeDetails.monthlyFees.length==0) ) ){
				if(cdrDTO.monthlyFeeDetails!=null && cdrDTO.monthlyFeeDetails.monthlyFees.length>0){
					html+=
					`<h5 class="font-weight-bold text-center" style="margin-bottom:15px;">
						<span class="primary-bg change-grade" onclick="backCourseSelection(\'2\', true)">Change Plan <i class="fa fa-exchange" style="font-family:FontAwesome"></i></span>
					</h5>`;
				}
			}
			html+=
			`<div class="full">
				<div>`;
					// TIC / Repeat with advance already paid and no extra fee → show $0 payable
				var zeroPayableStr = (data.advancePaymentApplied && !data.extraCoursePaymentRequired)
					? (data.currencySymbol + '0.00') : undefined;
				if($("#enrollmentType").val() == "REGISTRATION_IMPORVE_GRADES"){
						html+=getAnnualPaymentTable(cdrDTO, zeroPayableStr);
					}else if($("#enrollmentType").val() == "REGISTRATION_NEXT_GRADE" || $("#enrollmentType").val() == "REGISTRATION_REPEAT_GRADE"){
						if(signupCourse.payMode == 'registration'){
							html+=getBookAnEnrollmentTable(cdrDTO);
						}else if(signupCourse.payMode == 'annually'){
							html+=getAdvancePaymentTable(cdrDTO);
						}else if(signupCourse.payMode == 'threeMonthly' || signupCourse.payMode == 'sixMonthly'){
							html+=getAdvancePaymentTable(cdrDTO);
						}else if(signupCourse.payMode == 'c_installment' || signupCourse.payMode == 'c_annually'){
							html+=getCustomizedPaymentTable(cdrDTO);
						}else if(signupCourse.payMode == 'a_partially' || signupCourse.payMode == 'a_installment' || signupCourse.payMode == 'a_annually'){
							html+=getAdvancePaymentTable(cdrDTO);
						}
					}else{
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
					}
				html+=`</div>`;
				
				var eligibleForInstallment=false;
				if(signupCourse.payMode == 'threeMonthly' || signupCourse.payMode == 'sixMonthly'){
					eligibleForInstallment=true;
				}else if(
					(signupCourse.payMode == 'a_partially' || signupCourse.payMode == 'a_installment' || signupCourse.payMode == 'a_annually')
					&& (cdrDTO.advanceFeeDetails != null && cdrDTO.advanceFeeDetails.monthlyFees!=null && cdrDTO.advanceFeeDetails.monthlyFees.length>0) ){
					eligibleForInstallment=true;
				}
				if(eligibleForInstallment){
					html+=
					`<div class="full">
						<table class="table border-radius-table table-bordered">
							<thead>
								<tr>
									<th colspan="3" class="bg-light py-1 font-16">Fee Schedule</th>
								</tr>
								
							</thead>
							<tbody>
								<tr class="bg-primary text-white">
									<td>Fee Description</td>
									<td style="text-align:left"><span class="previewPaymentOption"></span>Total Fee</td>`;
									// if(signupCourse.payMode == 'a_partially' || signupCourse.payMode == 'a_installment' || signupCourse.payMode == 'a_annually'){
										html+=`<td style="text-align:left">Status</td>`;
									// }else{
										// html+='<th style="width: 20%; text-align:center">Paying Now</th>';
									// }
									html+=
								`</tr>`;
								// if(signupCourse.payMode == 'a_partially' || signupCourse.payMode == 'a_installment' || signupCourse.payMode == 'a_annually'){
									html+=advanceFeeShchedule(cdrDTO);
								// }else{
									// html+=monthlyFeeShchedule(cdrDTO);
								// }
								html+=
							`</tbody>
						</table>
					</div>`;
				}	
			html+=`</div>
		</div>`;
	return html;
}

function getBookAnEnrollmentTable(cdrDTO){
	var html=
		`<div class="full">
			<div class="d-flex flex-wrap my-1">
				<span class="text-dark font-16 font-weight-semi-bold">Payable Fee</span>
				<span class="font-24 font-weight-bold text-dark ml-auto d-inline-block">${cdrDTO.enrollmentFee.enrollmentFeeString}</span>
			</div>
		</div>`;
	return html;
}

function commonPaymentTableForPaymentModal(cdrDTO, prefix){
	console.log("cdrDTO",cdrDTO)
	var html ='';
		if(cdrDTO.courseExtraFeeDetails!=null && cdrDTO.courseExtraFeeDetails.totalEntityFee>0){
			html+=
			`<div id="${prefix}_extra">
				<div class="font-14 font-weight-semi-bold text-black-80 mb-1">Extra Course Fee</div>
				<div class="d-flex">`;
					if(cdrDTO.courseExtraFeeDetails!=null && cdrDTO.courseExtraFeeDetails.totalEntityFee>0){
						html+=`<div>`;
							$.each(cdrDTO.courseExtraFeeDetails.description, function(k, desc) {
								html+=`<span class="full my-1 text-black-70">${desc}</span>`;
							});
						html+=`</div>`;
					}
					if(cdrDTO.courseExtraFeeDetails!=null && cdrDTO.courseExtraFeeDetails.totalEntityFee>0){
						html+=
						`<div class="ml-auto" id="${prefix}_extra_price">`;
							$.each(cdrDTO.courseExtraFeeDetails.entityFees, function(k, fee) {
								html+=`<span class="full my-1 text-right">+${fee}</span>`;
							});
						html+=`</div>`
					}
				html+=`</div>
				<hr class="my-2"/>
				<div class="d-flex">
					<span class="full my-1 font-weight-semi-bold text-black-80">Total Extra Course Fee</span>
					<span class="full my-1 ml-auto text-right">${cdrDTO.courseExtraFeeDetails.totalEntityFeeString}</span>
				</div>
			</div>
			<hr class="my-2"/>`;
		}
		if(cdrDTO.courseMaterialFeeDetails!=null && cdrDTO.courseMaterialFeeDetails.totalEntityFee>0){
			html+=
			`<div id="${prefix}_external_material">
				<div class="font-14 font-weight-bold text-black-80">External Material Fee</div>
				<div class="d-flex">`;
					if(cdrDTO.courseExtraFeeDetails!=null && cdrDTO.courseExtraFeeDetails.totalEntityFee>0){
						html+=`<div>`;
							$.each(cdrDTO.courseMaterialFeeDetails.description, function(k, desc) {
								html+=`<span class="full my-1 text-black-70">${desc}</span>`;
							});
						html+=`</div>`;
					}
					if(cdrDTO.courseMaterialFeeDetails!=null && cdrDTO.courseMaterialFeeDetails.totalEntityFee>0){
						html+=
						`<div class="ml-auto" id="${prefix}_extra_price">`;
							$.each(cdrDTO.courseMaterialFeeDetails.entityFees, function(k, fee) {
								html+=`<span class="full my-1 text-right"> + ${fee}</span>`;
							});
						html+=`</div>`
					}
				html+=`</div>
				<hr class="my-2"/>
				<div class="d-flex">
					<span class="full my-1 font-weight-semi-bold text-black-80">Total Extra Course Fee</span>
					<span class="full my-1 ml-auto text-right">${cdrDTO.courseMaterialFeeDetails.totalEntityFeeString}</span>
				</div>
			</div>
			<hr class="my-2"/>`;
		}
		if(cdrDTO.feeAlreayPaid!=null && cdrDTO.feeAlreayPaid.totalEntityFee>0){
			html+=
			`<div id="${prefix}_feeAlreadyPaidDesc">
				<div class="d-flex">
					<span class="full my-1 text-success">Fee Already Paid `;
						$.each(cdrDTO.feeAlreayPaid.description, function(k, desc) {
							html+=`(${desc})`;
						});
					html+=`</span>`;
					if(cdrDTO.feeAlreayPaid!=null && cdrDTO.feeAlreayPaid.totalEntityFee>0){
						html+=
						`<div id="${prefix}_feeAlreadyPaidDescPrice" class="w-100">`;
							$.each(cdrDTO.feeAlreayPaid.entityFees, function(k, fee) {
								html+=`<span class="full my-1 text-right font-weight-bold text-success"> - ${fee}</span>`;
							});
						html+=`</div>`
					}
				html+=`</div>
			</div>`
		}
	return html;
}


function commonPaymentTable(cdrDTO, prefix){
	console.log("cdrDTO",cdrDTO)
	var html ='';
	// if(!cdrDTO.requestFromMigration){
	// 	html +='<tr>'
	// 		+'<td>'+cdrDTO.enrollmentFee.label+'</td>'
	// 		+'<td style="text-align:right">'
	// 			+cdrDTO.enrollmentFee.enrollmentFeeString
	// 		+'</td>'
	// 		+'<td style="text-align:right">'
	// 			+cdrDTO.enrollmentFee.enrollmentFeeString
	// 		+'</td>'
	// 	+'</tr>';
	// }
	html+=
	`<div class="border rounded-15 p-2 mb-2" style="background:#f9fafb">
		<div>
			<h5 class="font-weight-semi-bold font-16 mb-2">Fee Breakdown</h5>
		</div>
		<div class="d-flex">
			<span>Course Fee</span>
			<span class="d-inline-flex ml-auto">${cdrDTO.courseFeeString}</span>
		</div>
		<hr class="my-2"/>`
		if(cdrDTO.courseExtraFeeDetails!=null && cdrDTO.courseExtraFeeDetails.totalEntityFee>0){
			html+=
			`<div id="${prefix}_extra">
				<div class="font-14 font-weight-semi-bold text-black-80 mb-1">Extra Course Fee</div>
				<div class="d-flex">`;
					if(cdrDTO.courseExtraFeeDetails!=null && cdrDTO.courseExtraFeeDetails.totalEntityFee>0){
						html+=`<div>`;
							$.each(cdrDTO.courseExtraFeeDetails.description, function(k, desc) {
								html+=`<span class="full my-1 text-black-70">${desc}</span>`;
							});
						html+=`</div>`;
					}
					if(cdrDTO.courseExtraFeeDetails!=null && cdrDTO.courseExtraFeeDetails.totalEntityFee>0){
						html+=
						`<div class="ml-auto" id="${prefix}_extra_price">`;
							$.each(cdrDTO.courseExtraFeeDetails.entityFees, function(k, fee) {
								html+=`<span class="full my-1 text-right">+${fee}</span>`;
							});
						html+=`</div>`
					}
				html+=`</div>
				<hr class="my-2"/>
				<div class="d-flex">
					<span class="full my-1 font-weight-semi-bold text-black-80">Total Extra Course Fee</span>
					<span class="full my-1 ml-auto text-right">${cdrDTO.courseExtraFeeDetails.totalEntityFeeString}</span>
				</div>
			</div>
			<hr class="my-2"/>`;
		}
		if(cdrDTO.courseMaterialFeeDetails!=null && cdrDTO.courseMaterialFeeDetails.totalEntityFee>0){
			html+=
			`<div id="${prefix}_external_material">
				<div class="font-14 font-weight-bold text-black-80">External Material Fee</div>
				<div class="d-flex">`;
					if(cdrDTO.courseExtraFeeDetails!=null && cdrDTO.courseExtraFeeDetails.totalEntityFee>0){
						html+=`<div>`;
							$.each(cdrDTO.courseMaterialFeeDetails.description, function(k, desc) {
								html+=`<span class="full my-1 text-black-70">${desc}</span>`;
							});
						html+=`</div>`;
					}
					if(cdrDTO.courseMaterialFeeDetails!=null && cdrDTO.courseMaterialFeeDetails.totalEntityFee>0){
						html+=
						`<div class="ml-auto" id="${prefix}_extra_price">`;
							$.each(cdrDTO.courseMaterialFeeDetails.entityFees, function(k, fee) {
								html+=`<span class="full my-1 text-right"> + ${fee}</span>`;
							});
						html+=`</div>`
					}
				html+=`</div>
				<hr class="my-2"/>
				<div class="d-flex">
					<span class="full my-1 font-weight-semi-bold text-black-80">Total Extra Course Fee</span>
					<span class="full my-1 ml-auto text-right">${cdrDTO.courseMaterialFeeDetails.totalEntityFeeString}</span>
				</div>
			</div>
			<hr class="my-2"/>`;
		}
		if(cdrDTO.feeAlreayPaid!=null && cdrDTO.feeAlreayPaid.totalEntityFee>0){
			html+=
			`<div id="${prefix}_feeAlreadyPaidDesc">
				<div class="d-flex">
					<span class="full my-1 text-success">Fee Already Paid `;
						$.each(cdrDTO.feeAlreayPaid.description, function(k, desc) {
							html+=`(${desc})`;
						});
					html+=`</span>`;
					if(cdrDTO.feeAlreayPaid!=null && cdrDTO.feeAlreayPaid.totalEntityFee>0){
						html+=
						`<div id="${prefix}_feeAlreadyPaidDescPrice" class="w-100">`;
							$.each(cdrDTO.feeAlreayPaid.entityFees, function(k, fee) {
								html+=`<span class="full my-1 text-right font-weight-bold text-success"> - ${fee}</span>`;
							});
						html+=`</div>`
					}
				html+=`</div>
			</div>`
		}
	html+=`</div>` 
	return html;
}

function getAnnualPaymentTable(cdrDTO, overridePayableFeeStr){
	var html= commonPaymentTable(cdrDTO,'annually');
	// if(cdrDTO.schoolId==1 || cdrDTO.schoolId==3 || cdrDTO.schoolId==3){
		if(cdrDTO.oneTimePayment!=null && cdrDTO.oneTimePayment.youSave!=null){
			if(cdrDTO.oneTimePayment.youSave.description!=null && cdrDTO.oneTimePayment.youSave.description.length>0){
				html+=
				`<div class="full p-2 border border-success rounded-15" style="background-color:#F0FDF4;">
					<div>
						<h5 class="font-weight-semi-bold font-16 mb-2 text-dark">Fee Discounts</h5>
					</div>
					<div class="d-flex">
						<div>`;
							$.each(cdrDTO.oneTimePayment.youSave.description, function(k, desc) {
								html+=`<span class="full my-1 text-dark">${(parseInt(k)+1)}. ${desc}</span>`
							});
						html+=`</div>
						<div class="ml-auto">`;
							$.each(cdrDTO.oneTimePayment.youSave.entityFees, function(k, fee) {
								html+=`<span class="full my-1 text-right text-dark">-${fee}</span>`
							});
						html+=`</div>
					</div>
					<hr class="m-0"/>
					<div class="d-flex align-items-center mt-1">
						<h5 class="font-weight-bold font-18 mb-0 text-dark">Total Discount</h5>
						<span class="d-inline-flex my-1 font-weight-bold font-18 text-right text-dark ml-auto">-${cdrDTO.oneTimePayment.youSave.totalEntityFeeString}</span>
					</div>
				</div>`;
			}
		}
		var displayPayableFee = (overridePayableFeeStr !== undefined) ? overridePayableFeeStr : cdrDTO.oneTimePayment.payableFeeString;
		html+=
		`<div class="d-flex align-items-center">
			<h5 class="font-weight-bold font-16 my-2 text-dark">Payable Fee</h5>
			<span class="d-inline-flex my-1 font-weight-bold font-20 text-right text-dark ml-auto">${displayPayableFee}</span>
		</div>`;
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
				`<div class="full p-2 border border-success rounded-15" style="background-color:#F0FDF4;">
					<div>
						<h5 class="font-weight-semi-bold font-16 mb-2 text-dark">Fee Discounts</h5>
					</div>
					<div class="d-flex">
						<div>`;
							$.each(cdrDTO.monthlyFeeDetails.youSave.description, function(k, desc) {
								html+=`<span class="full my-1 text-dark">${(parseInt(k)+1)}. ${desc}</span>`
							});
						html+=`</div>
						<div class="ml-auto">`;
							$.each(cdrDTO.monthlyFeeDetails.youSave.entityFees, function(k, fee) {
								html+=`<span class="full my-1 text-right text-dark">-${fee}</span>`
							});
						html+=`</div>
					</div>
					<hr class="m-0"/>
					<div class="d-flex align-items-center mt-1">
						<h5 class="font-weight-bold font-18 mb-0 text-dark">Total Discount</h5>
						<span class="d-inline-flex my-1 font-weight-bold font-18 text-right text-dark ml-auto">-${cdrDTO.monthlyFeeDetails.youSave.totalEntityFeeString}</span>
					</div>
				</div>`;
			}
		}
		html+=
		`
		<div class="d-flex align-items-center">
			<h5 class="font-weight-bold font-16 my-2 text-dark">Payable Fee</h5>
			<span class="d-inline-flex my-1 font-weight-bold font-20 text-right text-dark ml-auto">${cdrDTO.monthlyFeeDetails.payableFeeString}</span>
		</div>`;
		
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
	var html=``;
	if(data.customPaymentEnabled){
		var paymentDetails = data.paymentCalculationResponse.paymentDetails;
		if(paymentDetails.schedulePayments.length>0){
			html+=
			`<div class="full">
				<table class="table border-radius-table table-bordered m-0">
					<thead>
						<tr>
							<th colspan="3" class="bg-light py-1 font-16">Fee Schedule</th>
						</tr>
						
					</thead>
					<tbody>`;
						$.each(paymentDetails.schedulePayments, function(loop, schedulePayment) {
							html+=
							`<tr>
								<td>
									${schedulePayment.paymentTitle}
									${loop==0?' (to be paid at the time of enrollment)':''}
								</td>
								<td style="text-align:right">
									${schedulePayment.payAmountString}
								</td>
								<td style="text-align:right">
									${schedulePayment.payAmountString}
								</td>
							</tr>`;
						});
					html+=`</tbody>
				</table>
			</div>
			<div class="d-flex align-items-center">
				<h5 class="font-weight-bold font-16 my-2 text-dark">Payable Fee</h5>
				<span class="d-inline-flex my-1 font-weight-bold font-20 text-right text-dark ml-auto">${paymentDetails.totalPayableAmountString}</span>
			</div>`;
		}
	}
	// if(data.customPaymentEnabled){
	// 	var paymentDetails = data.paymentCalculationResponse.paymentDetails
	// 	$.each(paymentDetails.schedulePayments, function(loop, schedulePayment) {
	// 		html+=
	// 		'<tr>'
	// 			+'<td>'
	// 				+schedulePayment.paymentTitle
	// 				+' '
	// 				+(loop==0?' (to be paid at the time of enrollment)':'')
	// 			+'</td>'
	// 			+'<td style="text-align:right">'
	// 				+schedulePayment.payAmountString
	// 			+'</td>'
	// 			+'<td style="text-align:right">'
	// 				+schedulePayment.payAmountString
	// 			+'</td>'
	// 		+'</tr>';
	// 	});
	// 	html+=
	// 	'<tr>'
	// 		+'<td><strong>Payable Fee</strong></td>'
	// 		+'<td style="text-align:right">'
	// 			+'<strong>';
	// 				// if(paymentDetails.schedulePayments!=null
	// 				// 	 && paymentDetails.schedulePayments.length>1){
	// 				// 	$.each(paymentDetails.schedulePayments, function(loop, schedulePayment) {
	// 				// 		html+=schedulePayment.payAmountString;
	// 				// 		var isLastElement = loop == paymentDetails.schedulePayments.length -1;
	// 				// 		if(!isLastElement){
	// 				// 			html+=' + ';
	// 				// 		}else{
	// 				// 			html+=' = ';
	// 				// 		}
	// 				// 	});
	// 				// }
	// 				html+=
	// 			+'</strong>'
	// 		+'</td>'
	// 		+'<td style="text-align:right">'
	// 			+'<strong>'
	// 				html+=paymentDetails.totalPayableAmountString
	// 			+'<strong>'
	// 		+'</td>'
	// 	+'</tr>';
	// }
	$('#custom-payment-button').show();
	return html;
}

function getAdvancePaymentTable(cdrDTO){
	var html= commonPaymentTable(cdrDTO,'advanceFee');
	// if(cdrDTO.schoolId==1 || cdrDTO.schoolId==3 || cdrDTO.schoolId==3){
		if(cdrDTO.advanceFeeDetails!=null && cdrDTO.advanceFeeDetails.youSave!=null){
			if(cdrDTO.advanceFeeDetails.youSave.description!=null &&  cdrDTO.advanceFeeDetails.youSave.description.length>0){
				html+=
				`<div class="full p-2 border border-success rounded-15"style="background-color:#F0FDF4;">
					<div>
						<h5 class="font-weight-semi-bold font-16 mb-2 text-dark">Fee Discounts</h5>
					</div>
					<div class="d-flex">
						<div>`;
							$.each(cdrDTO.advanceFeeDetails.youSave.description, function(k, desc) {
								html+=`<span class="full my-1 text-dark">${(parseInt(k)+1)}. ${desc}</span>`
							});
						html+=`</div>
						<div class="ml-auto">`;
							$.each(cdrDTO.advanceFeeDetails.youSave.entityFees, function(k, fee) {
								html+=`<span class="full my-1 text-right text-dark">-${fee}</span>`
							});
						html+=`</div>
					</div>
					<hr class="m-0"/>
					<div class="d-flex align-items-center mt-1">
						<h5 class="font-weight-bold font-18 mb-0 text-dark">Total Discount</h5>
						<span class="d-inline-flex my-1 font-weight-bold font-18 text-right text-dark ml-auto">-${cdrDTO.advanceFeeDetails.youSave.totalEntityFeeString}</span>
					</div>
				</div>`;
			}
		}
		html+=
		`<div class="d-flex align-items-center">
			<h5 class="font-weight-bold font-16 my-2 text-dark">Payable Fee</h5>
			<span class="d-inline-flex my-1 font-weight-bold font-20 text-right text-dark ml-auto">${cdrDTO.advanceFeeDetails.payableFeeString}</span>
		</div>`;
		
	// }else if(cdrDTO.schoolId==4){
	// }else if(cdrDTO.schoolId==5){
	// }
	return html;
}

function advanceFeeShchedule(cdrDTO){
	var html = '';
		$.each(cdrDTO.advanceFeeDetails.monthlyFees, function(k, monthlyFee) {
			html+=
			`<tr>
				<td>
					${monthlyFee.paymentLabel}
				</td>
				<td class="font-weight-semi-bold text-left">${monthlyFee.amountString}</td>
				<td class="font-weight-semi-bold text-left ${monthlyFee.status == "SUCCESS" ? "text-success":"text-warning"}">`;
				if(monthlyFee.status == 'SUCCESS'){
					html+=`Paid (${monthlyFee.paidDate})`;
				}else{
					html+=`Scheduled (${monthlyFee.scheduledDate})`;
				}
				html+=
				`</td>
			</tr>`;
		});
		
	return html;
}

function wuPaymentWarningModal(data){
	var html = '';
	html='<div class="modal fade fade-scale" id="wu_payment_warning" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">'
		+'<div class="modal-dialog modal-lg  modal-dialog-centered box-shadow-none" role="document">'
			+'<div class="modal-content">'
				+'<div class="modal-header py-2 bg-primary text-white">'
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
							+'<button type="button" class="btn bg-primary  text-white" onclick="logout();">Log out</button>'
						+'</p>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>'
	+'</div>';
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
						+'<span aria-hidden="true">&times;</span>'
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

function goToDashboardWarningMessageModal(data){
	var html='<div class="modal fade theme-modal fade-scale" id="goToDashboardWarningMessage" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">'
		+'<div class="modal-dialog modal-lg" role="document">'
			+'<div class="modal-content">'
				+'<div class="modal-header justify-content-center">'
					+'<h5 class="modal-title text-white">Confirmation!</h5>'
					+'<button type="button" class="close" data-dismiss="modal" aria-label="Close">'
						+'<span aria-hidden="true" class="text-white">&times;</span>'
					+'</button>'
				+'</div>'
				+'<div class="modal-body" style="height:auto; max-height:60vh; overflow:auto;">'
					+'<div class="full form">'
						+'<h4 class="modal-title fw-600 text-center" id="submitApplicationMsg"></h4>'
						+'<hr />'
						
					+'</div>'
				+'</div>'
				+'<div class="modal-foter">'
					+'<div class="full text-center">'
						+'<button type="button" class="btn theme-bg primary-hov-bg text-white mb-3" onclick="logoutConfimation(true, \''+BASE_URL+CONTEXT_PATH+SCHOOL_UUID+'/common/logout/'+UNIQUEUUID+'\')" >Log out</button>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>'
	+'</div>';
	return html;
}

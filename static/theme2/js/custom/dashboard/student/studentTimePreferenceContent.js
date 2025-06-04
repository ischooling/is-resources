function renderStudentTimepreferenceContent(details){
    var html=``;
    html+=getStudentTimePreferencePopupContent(details)
    +getStudentMobileViewSystemTrainingInfoContent()
    return html;
}

function getStudentTimePreferencePopupContent(details){
    var html=
        `<div class="modal fade d-none" id="timePreferencePopup" data-backdrop="static">
            <div class="modal-dialog modal-xl modal-dialog-centered box-shadow-none" role="document" style="max-width:600px">
                <div class="modal-content text-center">
                    <div class="modal-header pt-2 pb-2 bg-primary text-white justify-content-center">
                        <h5 class="text-white m-0 mr-auto" style="text-transform: none;" id="orientAndSemesterChangeSpanHeading"></h5>
                    </div>
                    <div class="modal-body d-flex flex-wrap full px-1 py-3">
                        <div class="d-flex w-100 mb-2">
                            <div class="header-dots mr-0 position-relative ml-auto" style="min-width: 60px;">
                                <a target="_blank" href="https://chat.internationalschooling.org/onboarding-support?uuid=${UNIQUEUUID}" class="notify-bell-chat d-flex justify-content-center align-items-center group">
                                    <svg class="chat-logo bg-primary" width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16.0156 16.0156V16.7969C16.0156 17.4414 15.4883 17.9688 14.8438 17.9688H7.61719L7.42188 18.125L4.88281 20.0781V17.9688H3.32031C2.67578 17.9688 2.14844 17.4414 2.14844 16.7969V8.59375C2.14844 7.94922 2.67578 7.42188 3.32031 7.42188H7.8125V6.64062H3.32031C2.24609 6.64062 1.36719 7.51953 1.36719 8.59375V16.7969C1.36719 17.8711 2.24609 18.75 3.32031 18.75H4.10156V21.6797L7.89063 18.75H14.8438C15.918 18.75 16.7969 17.8711 16.7969 16.7969V16.0156H16.0156Z" fill="white"/>
                                        <path d="M21.6797 4.29688C22.3242 4.29688 22.8516 4.82422 22.8516 5.46875V13.6719C22.8516 14.3164 22.3242 14.8438 21.6797 14.8438H20.1172V16.9727L17.5781 15.0195L17.3828 14.8438H10.1562C9.51172 14.8438 8.98438 14.3164 8.98438 13.6719V5.46875C8.98438 4.82422 9.51172 4.29688 10.1562 4.29688H21.6797ZM21.6797 3.51562H10.1562C9.08203 3.51562 8.20312 4.39453 8.20312 5.46875V13.6719C8.20312 14.7461 9.08203 15.625 10.1562 15.625H17.1094L20.8984 18.5547V15.625H21.6797C22.7539 15.625 23.6328 14.7461 23.6328 13.6719V5.46875C23.6328 4.39453 22.7539 3.51562 21.6797 3.51562Z" fill="white"/>
                                    </svg>
                                    <span class="chat-message" style="box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, .5) !important;">Talk to School Administration</span>
                                    <span class="UNSEEN start-100 translate-middle badge position-absolute"></span>
                                </a>
                            </div>
                        </div>
                        <div class="row w-100 m-0">
                            <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12" id="thumbnailFrameDiv">
                                <div class="thumbnail-frame" style="height: 495px;width: 100%;border: none;overflow: hidden;display: flex;justify-content: center;align-items: center;background-color: #000;position: relative;">
                                    <div id="player1"></div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12" id="timePreferenceDiv">
                            <div class="border-primary h-100">
                                <div class="card-body active-scroll pb-0">
                                    <input type="hidden" name="submitFrom" id="submitFrom" value="" />
                                    <input type="hidden" name="enrollmentType" id="enrollmentType" />
                                    <input type="hidden" name="regstrationType" id="regstrationType" />
                                    <input type="hidden" name="chooseDateToStartSemsterClass" id="chooseDateToStartSemsterClass" />
                                    <input type="hidden" name="saveType" id="saveType" value="ORIENT" />
									<div class="d-flex align-items-center"> 
										<div class="text-center font-weight-bold full" id="thankyouClassesMsg" style="display: none;"></div> 
									</div>
									<div class="full" id="sartDateWrapper">
										<h6 class="text-center text-primary font-weight-semi-bold mb-3" id="orientAndSemesterChangeSpan"></h6>
										<div class="d-flex flex-wrap full">
											<div class="col-lg-6 col-md-12 col-sm-12 col-12 m-auto mb-1">
												<input type="hidden" name="timeStuStandardId" id="timeStuStandardId" />
												<span class="d-inline-block" id='chooseDateToStartSemster-wrapper'>
													<input id="chooseDateToStartSemster" name="chooseDateToStartSemster" placeholder="Select date" required readonly="" type='text' class="bg-white form-control datepicker" />
												</span>
												<span class="d-none" id='chooseDateSystemTrainingDate-wrapper'>
													<input id="chooseDateSystemTrainingDate" name="chooseDateSystemTrainingDate" placeholder="Select date" required readonly="" type='text' class="bg-white form-control datepicker" />
												</span>
											</div>
										</div>
									</div>
                                    <div class="full mt-2 d-none timeSlotWrapper">
                                        <h6 class="text-center text-primary font-weight-semi-bold mt-3">As per your request, Available Time Slots in your timezone</h6>
                                        <div class="mt-1">
                                            <div class="time-slot col-lg-12 col-md-12 col-sm-12">
                                                <div class="form-check bg-primary text-white py-2 px-0 viewOrientFreeSlot flex-row" style="max-height: inherit;overflow: visible;">

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="d-flex flex-wrap full">
										<div class="col-lg-12 col-md-12 col-sm-12 col-12" id="startTimeAndEndTimeWrapper">
											<div id="hideAllData">
												<div>
													<h6 class="text-center text-primary font-weight-semi-bold my-3">I want to schedule my live classes between</h6>
												</div>
												<div class="d-flex full align-items-center text-left">
													<span class="w-50 pr-1" id="startTimepicker">
														<select id="startTime${USER_ID}" name="startTime" class="form-control timepicker startTime"></select>
													</span> AND&nbsp;
													<span class="w-50 pr-1" id="endTimepicker">
														<select id="endTime${USER_ID}" name="endTime"  class="form-control timepicker endTime"></select>
													</span>
												</div>
											</div>
										</div>
									</div>
								</div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer justify-content-center">
                        <button id="studentTimeSkipNext" type="button" class="btn btn-outline-primary font-size-lg py-1" onClick="showWarningMessage('Are you sure you want to skip your school system training? We recommend completing it to understand the functionalities of our platform.', 'orientationSkip()')">Skip System Training</button>
						<button id="studentTimeSave" type="button" class="btn btn-outline-success font-size-lg py-1" onClick="saveTeacherTimePreference('${USER_ROLE}','timePreferencePopup',true);">Confirm</button>
						<button id="closeButton" type="button" class="btn btn-outline-primary font-size-lg py-1 ml-auto" data-dismiss="modal" aria-label="Close">Close</button>
                    </div>
                </div>
            </div>
        </div>`;
    return html;
}

function getStudentMobileViewSystemTrainingInfoContent(){
    var html=
        `<div class="modal fade" id="mobileViewSystemTrainingInfo" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered box-shadow-none modal-lg" role="document">
                <div class="modal-content text-center">
                    <div class="modal-body d-flex flex-wrap px-1 full py-3"></div>
                </div>
            </div>
        </div>`;
    return html;
}
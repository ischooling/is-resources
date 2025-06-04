function renderTeacherTimepreferenceContent(details){
    var html=``;
    html+=getTeacherTimePreferencePopupContent(details)
    +getTeacherMobileViewSystemTrainingInfoContent()
    return html;
}

function getTeacherTimePreferencePopupContent(details){
    var html=
        `<div class="modal fade fade-scale" id="timePreferencePopup" data-backdrop="static">
            <div class="modal-dialog modal-lg  modal-dialog-centered box-shadow-none" role="document">
                <div class="modal-content text-center">
                    <div class="modal-header pt-2 pb-2 bg-primary text-white justify-content-center">
					    <h5 class=" text-white m-0">Welcome to the ${SCHOOL_NAME} Family, ${USER_FULL_NAME}!</h5>
                    </div>
                    <div class="modal-body d-flex flex-wrap full px-0">
                        <div class="row w-100 m-0">
                            <div class="col-xl-12 col-lg-12 p-0">
                                <div class="border-primary h-100">
                                    <div class="card-body active-scroll p-0">
                                        <input type="hidden" name="submitFrom" id="submitFrom" value="" />
                                        <input type="hidden" name="enrollmentType" id="enrollmentType" />
                                        <input type="hidden" name="regstrationType" id="regstrationType" />
                                        <input type="hidden" name="chooseDateToStartSemsterClass" id="chooseDateToStartSemsterClass" />
                                        <div class="row m-0">
                                            <input type="hidden" name="isAgreementUpdated" id="isAgreementUpdated" value="${details.isAgreementUpdated}"/>	
                                            <input type="hidden" name="showTimePrefModal" id="showTimePrefModal" value="${details.showTimePrefModal}"/>	
                                            <input type="hidden" name="changeSlotLimit" id="changeSlotLimit" value="${details.changeSlotLimit}" />
                                            <input type="hidden" name="changeSlotStartDay" id="changeSlotStartDay" value="${details.changeSlotStartDay}" />
                                            <input type="hidden" name="changeSlotValid" id="changeSlotValid" value="${details.changeSlotValid}" />
                                            <input type="hidden" name="changeSlotDate" id="changeSlotDate" value="${details.changeSlotDate}" />
                                            <input type="hidden" name="updateSlotDate" id="updateSlotDate" value="" />
                                            <input type="hidden" name="controlType" id="controlType" value="add" />
                                            <input type="hidden" name="timeSaveTeacherId" id="timeSaveTeacherId" value="" />
                                            <input type="hidden" name="timeSaveTeacherUserId" id="timeSaveTeacherUserId" value="${USER_ID}" />
                                            <input type="hidden" name="slotTillDate" id="slotTillDate" value="${details.slotTillDDate}" />
                                            <input type="hidden" name="slotLimitHrs" id="slotLimitHrs" value="${details.slotLimitHrs}" />
                                            <input type="hidden" name="slotLimitMaxHrs" id="slotLimitMaxHrs" value="${details.slotLimitMaxHrs}" />
                                            <input type="hidden" name="timeSlotType" id="timeSlotType" value="" />
                                            <input type="hidden" name="agreedHrs" id="agreedHrs" value="${details.agreedHrs}" />
                                            <input type="hidden" name="agreedHalfHrs" id="agreedHalfHrs" value="${details.agreedHalfHrs}" />
                                            <input type="hidden" name="agreedAvgHrs" id="agreedAvgHrs" value="${details.agreedAvgHrs}" />
                                            <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mb-3 mt-2 text-right remainhrs"></div>
                                            <div class="col-12">
                                                <p class="text-primary font-weight-semi-bold text-center">Before we begin, please add your availability for live classes with our students. This helps us better align students with you based on your availability. Once added, you can explore your dashboard. Our School Administration team will reach out shortly to schedule a teacher training session.</p>
                                                <a onclick="callTeacherAvailabilityMenu('timePreferencePopup');" href="javascript:void(0);" name="showTimePrefModalHref" id="showTimePrefModalHref" class="btn btn-outline-primary">Add Availability</a>
                                            </div>
                                            <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mb-3 mt-2">
                                                <div class="added-availability"></div>
                                            </div>
                                        </div>
                                        <div class="full mt-2 d-none timeSlotWrapper">
                                            <h6 class="text-center text-primary font-weight-semi-bold mt-3">As per your request, Available Time Slots in your timezone</h6>
                                            <div class="mt-1">
                                                <div class="time-slot col-lg-12 col-md-12 col-sm-12">
                                                    <div class="form-check bg-primary text-white py-2 px-0 viewOrientFreeSlot flex-row" style="max-height: inherit;overflow: visible;"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    return html;
}

function getTeacherMobileViewSystemTrainingInfoContent(){
    var html=
        `<div class="modal fade fade-scale" id="mobileViewSystemTrainingInfo" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered box-shadow-none modal-lg" role="document">
                <div class="modal-content text-center">
                    <div class="modal-body d-flex flex-wrap px-1 full py-3"></div>
                </div>
            </div>
        </div>`;
    return html;
}
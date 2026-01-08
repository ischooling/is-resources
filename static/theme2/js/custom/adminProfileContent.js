var callFrom="";
async function renderProfilePage(arg0){
    var arg1=arg0.split("&");
    var userId=arg1[0];
    if(arg1[1]=="callFrom="){
       callFrom=''; 
    }else{
        callFrom=arg1[1];
    }

	//console.log(arg1);
    $("#cropModal").remove();
    $("body").append(cropperImageModalContent())
    var payload = {
        userId: userId,
        userIdSession: USER_ID
    };
    var responseData = await getDashboardDataBasedUrlAndPayload(true, false, 'get-common-profile-details', payload);
    var html= getProfilePageContent(responseData.details, callFrom, arg0);
    $("#dashboardContentInHTML").html(html);
    if(USER_ROLE == "B2B_PARTNER"){
        var payloadBank = {
        userId: USER_ID,
        };
        var responseDataBank = await getDashboardDataBasedUrlAndPayload(true, false, 'get-partner-bank-details', payloadBank);
        $("#bankDetailsWrapper").html(getProfileBankDetailsContent(responseDataBank.bankDetails));
        cancelBankDetailsUpdation();
    }
    $("#addedDate").datepicker({
        autoclose: true,
        format: "M dd, yyyy",
        startDate: new Date(),
        endDate: new Date()
    });
    getAllCountryList('profilePageFromTag','country')
    await getAllCountryTimezone('profilePageFromTag','','countryTimezoneId');
    $('#country').select2({
        theme:"bootstrap4",
    }).on("change", function(){
        var selectedCountryID= $(this).val()
        callStates('profilePageFromTag',selectedCountryID, 'country', 'state', 'city')
        if ($("#state").hasClass("select2-hidden-accessible")) {
            $("#state").select2("destroy");
        }
        $("#state").select2({
            theme:"bootstrap4",
        });
        $("#state").attr("disabled",false);
    });
    $("#state").select2({
        theme:"bootstrap4",
    }).on("change", function(){
        var selectedStateID= $(this).val()
        callCities('profilePageFromTag',selectedStateID, 'state', 'city')
        if ($("#city").hasClass("select2-hidden-accessible")) {
            $("#city").select2("destroy");
        }
        $("#city").select2({
            theme:"bootstrap4",
        });
        $("#city").attr("disabled",false);
    });
    $("#city").select2({
        theme:"bootstrap4",
    });
    $('#countryTimezoneId').select2({
        theme:"bootstrap4",
    });
    $("#languages").select2({
        theme:"bootstrap4",
    });
    $("#country").val(responseData.details.countryId).trigger("change");
    $("#state").val(responseData.details.stateId).trigger("change");
    $("#city").val(responseData.details.cityId).trigger("change");
    $("#countryTimezoneId").val(responseData.details.countryTimezone).trigger("change");
    if(responseData.details.languagesKnown!=''){
        var lang = responseData.details.languagesKnown.split(',');
        $("#languages").val(lang).trigger("change");
        // $.each(lang, function(i,e){
        //     $("#languages option[value='" + e + "']").prop("selected", true);
        // });
    }
    //return html;
    corpAdminProfile();
}

function getProfilePageContent(data, callFrom, arg0){
    console.log(data)
    var html=
        `<div class="main-card mb-3 p-3">
            <div class="card">
                <div class="card-body p-0 pb-4">
                    <div class="profile-head bg-primary p-4 rounded-top">`;
                        if(callFrom=='callFrom=admin'){
                            html+= `<a href="javascript:void(0)" onClick="return callDashboardPageSchool('87','user-list');" class="btn btn-pill btn-outline-white pull-right"><i class="fa fa-arrow-left"></i>&nbsp;Back</a>`;
                        }
                   html+= `</div>
                    <form class="full admin-profile-wrapper px-4 position-relative" id="profilePageFromTag" style="margin-top:-95px">
                        <div class="profile-picture-wrapper">
                            <div class="profile-picture">
                                <div class="full">
                                    <div class="user-img admin-proifle">
                                        <img id="profileImageStudent" name="profileImageStudent" class="user profile-pic" src="${data.profileImage}" alt="image" title="Profile Image" thumbtype="">
                                        <div class="edit-user-img trans5s">
                                        <input class="file-input" type="file" name="fileupload1" id="fileupload1" onchange="cropImage(event, 'fileupload1', 'profileImageStudent', 'Profile Image', '15808')">
                                        <span class="upload-img-btn">
                                            <i class="fa fa-upload"></i> Upload </span>
                                        </div>
                                    </div>
                                    <p class="text-center img-notification">Profile Image (Max size 5MB)</p>
                                </div>
                                <div class="profile-name text-primary text-center font-weight-semi-bold font-size-lg mt-2 userNameLabel">${data.userFullName}</div>
                                <div class="profile-name text-dark text-center font-size-12 mb-1">Recognition</div>    
                            </div>    
                        </div>
                        <div class="d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center">
                                <i class="fa fa-user font-24 bg-light-primary text-primary rounded p-1 mr-2" aria-hidden="true"></i>
                                <h5 class="font-weight-bold text-dark">Personal Details</h5>
                            </div>`
                            if(callFrom==''){
                                html+=`<a href="javascript:void(0)" class="btn btn-pill btn-outline-primary float-right editProfileBtn" onclick="editProfilePage()">
                                    <i class="fa fa-edit"></i>&nbsp; Edit
                                </a>`;
                            }
                        html+=`</div>
                        <div class="profile-details-wrapper float-left w-100">
                            <input type="hidden" id="pCountryCode" value="${data.countryCode}"/>
                            <input type="hidden" id="isdCode" value="${data.dialCode}"/>
                            <input type="hidden" id="userId" value="${data.userId}"/>
                            <div class="row mt-4 ">
                                <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                                    <div class="form-group">
                                        <label class="m-0">User Name</label>
                                        <div class="profile-label field-value font-weight-semi-bold text-dark userNameLabel">${data.userFullName}</div> 
                                        <div class="field-input w-100">
                                            <input type="text" id="userName" name="userName" class="form-control field-input" value="${data.userFullName}"/>
                                        </div>
                                    </div>  
                                </div>
                                <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                                    <div class="form-group">
                                        <label class="m-0">Gender</label>
                                        <div class="profile-label field-value font-weight-semi-bold text-dark genderLabel">${data.gender}</div> 
                                        <div class="field-input w-100">
                                            <select id="gender" name="gender" class="form-control field-input">
                                                <option value="MALE" ${data.gender == "MALE"? 'selected':''}>MALE</option>
                                                <option value="FEMALE" ${data.gender == "FEMALE"? 'selected':''}>FEMALE</option>
                                                <option value="TRANSGENDER" ${data.gender == "TRANSGENDER"? 'selected':''}>TRANSGENDER</option>
                                                <option value="DONOTWANTTOSPECIFY" ${data.gender == "DONOTWANTTOSPECIFY"? 'selected':''}>DO NOT WANT TO SPECIFY</option>   
                                            </select>
                                        </div>
                                    </div>  
                                </div>
                                <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-3 w-100">
                                    <div class="form-group">
                                        <label class="m-0">Phone Number</label>
                                        <div class="profile-label field-value font-weight-semi-bold text-dark phoneNumberLabel">${data.contactNumber !=''? data.contactNumber:'N/A' }</div> 
                                        <div class="w-100;">
                                            <input type="text" id="phoneNumber" name="phoneNumber" class="form-control field-input" value="${data.contactNumber}"/>
                                        </div>  
                                    </div>  
                                </div>
                                
                                <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                                    <div class="form-group">
                                        <label class="m-0">Email</label>
                                        <div class="profile-label field-value font-weight-semi-bold text-dark emailIdLabel">${data.emailId}</div> 
                                        <div class="field-input w-100">
                                            <input type="text" id="emailId" name="emailId" class="form-control field-input" value="${data.emailId}" disabled/>
                                        </div>  
                                    </div>  
                                </div>
                                <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                                    <div class="form-group">
                                        <label class="m-0">User name</label>
                                        <div class="profile-label field-value font-weight-semi-bold text-dark useremailIdLabel">${data.userName}</div> 
                                        <div class="field-input w-100">
                                            <input type="text" id="userEmailId" name="userEmailId" class="form-control field-input" value="${data.userName}" disabled/>
                                        </div>  
                                    </div>  
                                </div>
                                <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                                    <div class="form-group">
                                        <label class="m-0">Added Date</label>
                                        <div class="profile-label field-value font-weight-semi-bold text-dark addedDateLabel">Added Date</div> 
                                        <div class="field-input w-100">
                                            <input type="text" id="addedDate" name="addedDate" class="form-control field-input" value="${data.addedDate}" readonly onkeydown="return false"/>
                                        </div>  
                                    </div>  
                                </div>
                                <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                                    <div class="form-group">
                                        <label class="m-0">Country</label>
                                        <div class="profile-label field-value font-weight-semi-bold text-dark countryLabel">${data.country !=""?data.country:"N/A"}</div> 
                                        <div class="field-input w-100">
                                            <select id="country" name="country" class="form-control field-input"></select>
                                        </div>  
                                    </div>  
                                </div>
                                <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                                    <div class="form-group">
                                        <label class="m-0">State</label>
                                        <div class="profile-label field-value font-weight-semi-bold text-dark stateLabel">${data.state !=""?data.state:"N/A"}</div> 
                                        <div class="field-input w-100">
                                            <select id="state" name="state" class="form-control field-input" disabled></select>
                                        </div> 
                                    </div>  
                                </div>
                                <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                                    <div class="form-group">
                                        <label class="m-0">City</label>
                                        <div class="profile-label field-value font-weight-semi-bold text-dark cityLabel">${data.city !=""?data.city:"N/A"}</div> 
                                        <div class="field-input w-100">
                                            <select id="city" name="city" class="form-control field-input" disabled></select>
                                        </div> 
                                    </div>  
                                </div>
                                <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                                    <div class="form-group">
                                        <label class="m-0">Timezone</label>
                                        <div class="profile-label field-value font-weight-semi-bold text-dark countryTimezoneIdLabel">${data.countryTimezone}</div>
                                        <div class="field-input w-100">
                                            <select id="countryTimezoneId" name="countryTimezoneId" class="form-control field-input"></select>
                                        </div> 
                                    </div>  
                                </div>
                                <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                                    <div class="form-group">
                                        <label class="m-0">Languages</label>
                                        <div class="profile-label field-value font-weight-semi-bold text-dark langKnownLabel">`+getLanguagesValueByCode(data.languagesKnown)+`</div>
                                        <div class="field-input w-100">
                                             <select id="languages" name="languages" class="form-control field-input" multiple>`+getLanguages(false)+`</select>
                                        </div> 
                                    </div>  
                                </div>
                            </div>
                            <div class="row mt-2">
                                <div class="col-12 text-right save-proifle-btn-row" style="display:none">
                                    <a href="javascript:void(0)" class="btn btn-pill btn-outline-primary cancelEditProfileBtn" style="display:none" onclick="cancelEditProfilePage()">Cancel</a>
                                    <a href="javascript:void(0)" class="btn btn-outline-success btn-pill" onclick="saveProfileDetails('profilePageFromTag', \'${arg0}\')">Save</a>    
                                </div>    
                            </div>
                        </div>
                    </form>
                </div>`
                if(USER_ROLE == "B2B_PARTNER"){
                    html+=`<div id="bankDetailsWrapper"></div>`;
                }
            html+=`</div>    
        </div>`;
    return html;
}

function cropperImageModalContent(){
    var html=
        `<div class="modal fade" id="adminImgCropModal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true" data-backdrop="static">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalLabel">Crop the image</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="img-container">
                            <img id="cropModalImg" src="https://avatars0.githubusercontent.com/u/3456749" class="w-100">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary " data-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="cropProfileImg">Crop</button>
                        <button type="button" class="btn btn-primary" onclick="rotateImage()">Rotate</button>
                    </div>
                </div>
            </div>
        </div>`;
    return html;
}

function serverMessageContent(){
    var html=
        '<div class="server-message">'
            +'<span class="msg" id="msgTheme2"></span>'
        +'</div>';
    return html;	
}

function getProfileBankDetailsContent(data){
    var html=
        `<hr>
        <div class="px-4 mb-4">
            <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                    <i class="fa fa-university font-24 bg-light-primary text-primary rounded p-1 mr-2" aria-hidden="true"></i>
                    <h5 class="font-weight-bold text-dark">Bank Details</h5>
                </div>
                <a href="javascript:void(0)" class="btn btn-pill btn-outline-primary float-right editBankDetailsBtn" onclick="editBankDetailsProfile();">
                    <i class="fa fa-edit"></i>&nbsp; Edit
                </a>
            </div>
            <div class="row mt-4">
                <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                    <div class="form-group">
                        <label class="m-0">BIC Name</label>
                        <div id="bicNameLabel" class="font-weight-semi-bold text-dark bank-details-field">${data == "N/A" ? "" : data.iban}</div> 
                        <div class="w-100 bank-details-input-field">
                            <input type="text" id="bicNameB2b" name="bicNameB2b" class="form-control" value="${data == "N/A" ? "" : data.iban}"/>
                        </div>
                    </div>  
                </div>
                <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                    <div class="form-group">
                        <label class="m-0">Bank Address</label>
                        <div id="bankAddressLabel" class="font-weight-semi-bold text-dark bank-details-field">${data == "N/A" ? "" : data.bankBranchAddress}</div> 
                        <div class="w-100 bank-details-input-field">
                            <input type="text" id="bankAddressB2b" name="bankAddressB2b" class="form-control" value="${data == "N/A" ? "" : data.bankBranchAddress}"/>
                        </div>
                    </div>  
                </div>
                <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                    <div class="form-group">
                        <label class="m-0">Swift Code</label>
                        <div id="swiftCodeLabel" class="font-weight-semi-bold text-dark bank-details-field">${data == "N/A" ? "" : data.swiftCode}</div> 
                        <div class="w-100 bank-details-input-field">
                            <input type="text" id="swiftCodeB2b" name="swiftCodeB2b" class="form-control" value="${data == "N/A" ? "" : data.swiftCode}"/>
                        </div>
                    </div>  
                </div>
                <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                    <div class="form-group">
                        <label class="m-0">Bank Code</label>
                        <div id="bankCodeLabel" class="font-weight-semi-bold text-dark bank-details-field">${data == "N/A" ? "" : data.bankIfsc}</div> 
                        <div class="w-100 bank-details-input-field">
                            <input type="text" id="bankCodeB2b" name="bankCodeB2b" class="form-control" value="${data == "N/A" ? "" : data.bankIfsc}"/>
                        </div>
                    </div>  
                </div>
                <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                    <div class="form-group">
                        <label class="m-0">Branch Code</label>
                        <div id="branchCodeLabel" class="font-weight-semi-bold text-dark bank-details-field">${data == "N/A" ? "" : data.routeNo}</div> 
                        <div class="w-100 bank-details-input-field">
                            <input type="text" id="branchCodeB2b" name="branchCodeB2b" class="form-control" value="${data == "N/A" ? "" : data.routeNo}"/>
                        </div>
                    </div>  
                </div>
                <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                    <div class="form-group">
                        <label class="m-0">Account Holder Name</label>
                        <div id="accountNameLabel" class="font-weight-semi-bold text-dark bank-details-field">${data == "N/A" ? "" : data.accountHolderFirstName}</div> 
                        <div class="w-100 bank-details-input-field">
                            <input type="text" id="accountNameB2b" name="accountNameB2b" class="form-control" value="${data == "N/A" ? "" : data.accountHolderFirstName}"/>
                        </div>
                    </div>  
                </div>
                <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                    <div class="form-group">
                        <label class="m-0">Account Number</label>
                        <div id="accountNumberLabel" class="font-weight-semi-bold text-dark bank-details-field">${data == "N/A" ? "" : data.accountNo}</div> 
                        <div class="w-100 bank-details-input-field">
                            <input type="text" id="accountNumberB2b" name="accountNumberB2b" class="form-control" value="${data == "N/A" ? "" : data.accountNo}" onkeydown="return M.digit(event);"/>
                        </div>
                    </div>  
                </div>
            </div>
            <div id="bankDetailsAction" class="d-flex justify-content-end align-items-center gap-5">
                <button class="btn btn-sm btn-danger" onclick="cancelBankDetailsUpdation();">Cancel</button>
                <button class="btn btn-sm btn-primary" onclick="saveB2bBankDetails('fromProfile');">Update</button>
            </div>
        </div>`
    return html;
}
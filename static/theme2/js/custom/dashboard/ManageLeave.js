function getUserLeaveData(id, userId) {
    if (userId == undefined || userId == null) {
        userId = ''
    }
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: getURLForHTML('dashboard', 'get-user-leave-list?teacherId=' + id + "&userId=" + userId),
        data: "",
        dataType: 'json',
        async: false,
        success: function (data) {
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') {
                    redirectLoginPage();
                } else {
                    if (tt == 'theme1') {
                        showMessage(false, data['message']);
                    } else {
                        showMessageTheme2(0, data['message'], '', true);
                    }
                }
            } else {
                $("#teacherLeaveTable tbody").html("");
                bindLeaveData(data.userLeaveDTO);
                return data;
            }
        }
    });
}


function saveLeaveForm(userId) {
    if (validateRequestForSaveLeave()) {
        return false;
    }
    $.ajax({
        type: "POST",
        url: getURLForHTML('dashboard', 'leave-form-save'),
        data: JSON.stringify(setUserLeaveData(userId)),
        dataType: 'json',
        contentType: "application/json",
        async: false,
        success: function (data) {
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') {
                    redirectLoginPage();
                } else {
                    if (tt == 'theme1') {
                        showMessage(false, data['message']);
                    } else {
                        showMessageTheme2(0, data['message'], '', true);
                    }
                }
            } else {
                if (tt == 'theme1') {
                    showMessage(false, data['message']);
                } else {
                    showMessageTheme2(1, data['message'], '', true);
                }
                $('#leaveFromModal').modal('hide');
                $("#teacherid").val();
                getUserLeaveData(userId, userId)
            }
        }
    });
}

function validateRequestForSaveLeave() {
    // if ($('#enddate').val() != "") {
    //     // var enddate = getDateInDateFormat($("#signupStage1").val());
    //     var enddate = changeDateFormat(enddate, 'mm-dd-yyyy')
    //     var enddate1 = enddate.split("-");
    //     dobd = enddate.split("-").length;
    //     if (parseInt(enddate) != 3 || parseInt(enddate1[1]) > 31 || parseInt(enddate1[0]) > 12) {
    //         showMessage(0, 'End Date is not valid');
    //         return false;
    //     }
    // }
    //     if ($('#startdate').val() != "") {
    //     // var startdate = getDateInDateFormat($("#signupStage1").val());
    //     var startdate = changeDateFormat(startdate, 'mm-dd-yyyy')
    //     var startdate1 = startdate.split("-");
    //     startdate = startdate.split("-").length;
    //     if (parseInt(startdate) != 3 || parseInt(startdate1[1]) > 31 || parseInt(startdate1[0]) > 12) {
    //         showMessage(0, 'Start Date is not valid');
    //         return false;
    //     }
    // }

    // if(USER_ROLE === 'Teacher'){
    //     if(compareDates(changeDateFormat(new Date(), 'mm-dd-yyyy'),$('#enddate').val())){
    //         showMessage(0, 'Start Date should be greater than Current Date');
    //         return false;
    //     }
    // }
    if ($("#leaveReason").val() == "" || $("#leaveReason").val() == undefined || $("#leaveReason").val() == 'undefined') {
        showMessageTheme2(0, "Reason is required");
        return false;
    }

}

function setUserLeaveData(userId) {
    data = {}
    data['userId'] = userId;
    data['userRole'] = USER_ROLE
    data['schoolId'] = SCHOOL_ID
    data['leaveDate'] = $("#leaveDates").val();
    data['reason'] = $("#leaveReason").val();
    data['createdBy'] = userId;
    data['updatedBy'] = userId;
    data['dataType'] = 'LEAVE';
    data['control'] = $("#control").val();
    data['actionId'] = $("#leaveid").val();
    return data;
}
const compareDates = (d1, d2) => {
    let date1 = new Date(d1).getTime();
    let date2 = new Date(d2).getTime();

    if (date1 == date2) {
        return true;
    } else if (date1 > date2) {
        return false;
    } else {
        return true;
    }
}

function showModel(teacherName, control, leaveid, leaveDate, leaveReason,status,remark) {
    console.log("clicked");
    $('#leaveFromModal').remove();
    if(USER_ROLE == "TEACHER"){
        $("body").append(modelForSaveAndUpdateLeave(USER_ID, leaveid, USER_ROLE));
        $("#leaveStartTime, #leaveEndTime").select2({
            theme:"bootstrap4",
            dropdownParent:"#leaveFromModal",
        })
    }else{
        $("body").append(modelForUpdateLeaveStatus(USER_ID, leaveid, USER_ROLE));
    }
    $('#leaveFromModal').modal('show');
    $("#teacherName").val(teacherName);
    $("#control").val(control);
    // $("#leaveid").val(leaveid);
    $("#leaveDates").val(leaveDate);
    $("#leaveReason").val(leaveReason);
    
    
    $("#leaveDates").datepicker('destroy').datepicker({
        //autoclose: true,//
        startDate: new Date(),
        multidate: true,
        format: 'M dd, yyyy',
        container: '#leaveFromModal .modal-body'
    });
    if (USER_ROLE == "TEACHER" || control == "update") {
        var sDate = $("#leaveDates").val();
        sDate = sDate.match(/[^,]+,[^,]+/g);
        var dateArray = [];
        sDate.forEach(element => {
            dateArray.push(new Date(element))
        });
        $("#leaveDates").datepicker('destroy').datepicker({
            //autoclose: true,//
            startDate: new Date(),
            multidate: true,
            format: 'M dd, yyyy',
            container: '#leaveFromModal .modal-body'
        });
        $("#leaveDates").datepicker("setDates", dateArray);
    }else{
        $("#leaveStatus").val(status.toLowerCase());
        $("#leaveRemark").val(remark)
    }

}

function updateLeaveStatus(userId,actionId,) {
    $.ajax({
        type: "POST",
        url: getURLForHTML('dashboard', 'leave-form-update-status'),
        data: JSON.stringify(setLeaveStatusData(userId,actionId)),
        dataType: 'json',
        contentType: "application/json",
        async: false,
        success: function (data) {
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') {
                    redirectLoginPage();
                } else {
                    if (tt == 'theme1') {
                        showMessage(false, data['message']);
                    } else {
                        showMessageTheme2(0, data['message'], '', true);
                    }
                }
            } else {
                if (tt == 'theme1') {
                    showMessage(false, data['message']);
                } else {
                    showMessageTheme2(1, data['message'], '', true);
                }
                $('#leaveFromModal').modal('hide');
                $("#teacherid").val();
                getUserLeaveData(userId)
            }
        }
    });
}

function setLeaveStatusData(userId,actionId){
data = {}
data['remark'] = $("#leaveRemark").val();
data['status'] = $("#leaveStatus").val();
data['actionId'] = actionId;
data['userId'] = userId;
return data;
}
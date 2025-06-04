// function getUserLeaveData(id, userId) {
//     if(userId == undefined || userId == null){
//         userId = ''
//     }
//     $.ajax({
//         type : "GET",
//         contentType : "application/json",
//         url: getURLForHTML('dashboard', 'get-user-leave-list?teacherId='+id+"&userId="+userId),
//         data: "",
//         dataType: 'json',
//         async: false,
//         success: function (data) {
//             if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
//                 if (data['status'] == '3') {
//                     redirectLoginPage();
//                 } else {
//                     if (tt == 'theme1') {
//                         showMessage(false, data['message']);
//                     } else {
//                         showMessageTheme2(0, data['message'], '', true);
//                     }
//                 }
//             }else{

//             console.log(data)
//                 $("#teacherLeaveTable tbody").html("");
//                 $.each(data.userLeaveDTO, function (index,value){
//                   $("#teacherLeaveTable tbody").append(
//                       '<tr>'+
//                       '<td>'+(index+1)+'</td>'+
//                       '<td>'+value.userId+'</td>'+
//                       '<td>'+value.startDate+'</td>'+
//                       '<td>'+value.createdDate+'</td>'+
//                       '<td>'+value.createdBy+'</td>'+
//                       '<td>'+value.updatedBy+'</td>'+
//                       '<td>'+value.reason+'</td>'+
//                       '<td>'+value.status+'</td>'+
//                       '<td>'+
//                             '<div class="btn-group">'+
//                                 '<button type="button" class="btn btn-danger dropdown-toggle  btn-sm"data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-toggle="tooltip" title="Action" style="background-color:#007fff !important;border-color:#007fff;box-shadow:none;">'+
//                                     '<i class="fa fa-ellipsis-v"></i>'+
//                                 '</button>'+
//                                 '<div class="dropdown-menu">'+
//                                     '<a class="dropdown-item" href="javascript:void(0);" onclick="saveLeaveForm('+USER_ID+','+value.id+')">Update Leave</a>'+
//                                 '</div>'+ 
//                             '</div>'+       
//                         '</td>'+    
//                     '</tr>')
//                 })
//                 return data;
//             }
//         }
//     });
// }


// function saveLeaveForm(userId, teacherId, leaveId) {
//     if(validateRequestForSaveLeave()){
//         return false;
//     }
//     $.ajax({
//         type: "POST",
//         url: getURLForHTML('dashboard', 'leave-form-save'),
//         data: JSON.stringify(setUserLeaveData(userId, teacherId)),
//         dataType: 'json',
//         contentType: "application/json",
//         async: false,
//         success : function(data) {
//             if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
//                 if (data['status'] == '3') {
//                     redirectLoginPage();
//                 } else {
//                     if (tt == 'theme1') {
//                         showMessage(false, data['message']);
//                     } else {
//                         showMessageTheme2(0, data['message'], '', true);
//                     }
//                 }
//             }else{
//                 if (tt == 'theme1') {
//                     showMessage(false, data['message']);
//                 } else {
//                     showMessageTheme2(1, data['message'], '', true);
//                 }
//                 $('#leaveFromModal').modal('hide');
//                 getUserLeaveData(userId, teacherId)
//             }
//         }
//     });
// }

// function validateRequestForSaveLeave() {
//     // if ($('#enddate').val() != "") {
//     //     // var enddate = getDateInDateFormat($("#signupStage1").val());
//     //     var enddate = changeDateFormat(enddate, 'mm-dd-yyyy')
//     //     var enddate1 = enddate.split("-");
//     //     dobd = enddate.split("-").length;
//     //     if (parseInt(enddate) != 3 || parseInt(enddate1[1]) > 31 || parseInt(enddate1[0]) > 12) {
//     //         showMessage(0, 'End Date is not valid');
//     //         return false;
//     //     }
//     // }
//     //     if ($('#startdate').val() != "") {
//     //     // var startdate = getDateInDateFormat($("#signupStage1").val());
//     //     var startdate = changeDateFormat(startdate, 'mm-dd-yyyy')
//     //     var startdate1 = startdate.split("-");
//     //     startdate = startdate.split("-").length;
//     //     if (parseInt(startdate) != 3 || parseInt(startdate1[1]) > 31 || parseInt(startdate1[0]) > 12) {
//     //         showMessage(0, 'Start Date is not valid');
//     //         return false;
//     //     }
//     // }

//     // if(USER_ROLE === 'Teacher'){
//     //     if(compareDates(changeDateFormat(new Date(), 'mm-dd-yyyy'),$('#enddate').val())){
//     //         showMessage(0, 'Start Date should be greater than Current Date');
//     //         return false;
//     //     }
//     // }
//     if($("#leaveReason").val() == "" || $("#leaveReason").val() == undefined || $("#leaveReason").val() == 'undefined'){
//         showMessageTheme2(0,"Reason is required");
//         return false;
//     }

// }

// function  setUserLeaveData(userId,teacherId){
//     data = {}
//     let createdby;
//     let updatedby;
//     if(teacherId === userId){
//         createdby = teacherId;
//         updatedby = teacherId;
//     }else{
//         createdby = userId;
//         updatedby = userId;
//     }
//     data['teacherId'] = teacherId;
//     data['userId'] = userId;
//     data['userRole'] = USER_ROLE
//     data['schoolId'] = SCHOOL_ID
//     data['endDate'] = $("#leaveDates").val();
//     // data['startDate'] = $("#startdate").val();
//     data['reason'] = $("#leaveReason").val();
//     data['createdBy'] = createdby;
//     data['updatedBy'] = updatedby;
//     data['dataType'] = 'LEAVE';
//     return data;
// }
// const compareDates = (d1, d2) => {
//     let date1 = new Date(d1).getTime();
//     let date2 = new Date(d2).getTime();

//     if (date1 == date2) {
//         return true;
//     }else if (date1 > date2) {
//         return false;
//     } else {
//         return true;
//     }
// }

// function showModel(teacherName){
//     console.log("clicked");
//     $('#leaveFromModal').modal('show');
//     $("#teacherName").val(teacherName);
// }
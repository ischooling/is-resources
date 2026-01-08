function getReview(userId) {
    if (userId == undefined || userId == null) {
        userId = ''
    }
    $.ajax({
        type: "GET",
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForWithoutUnique('review', 'get-review?&userId=' + userId),
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
                $.each(data.reviewDTOs, function (index, value) {
                      var tableHtml =  '<tr>' +
                        '<td>' + (index + 1) + '</td>' +
                        '<td>' + value.userName + '</td>' +
                        '<td>' + value.eventName + '</td>' +
                        '<td>'+
                        '<div class="btn-group">'+
                        '<button type="button" class="btn btn-danger  dropdown-toggle  btn-sm"data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-toggle="tooltip" title="Action" style="background-color:var(--pc) !important;border-color:var(--pc);box-shadow:none;">' +
                        '<i class="fa fa-ellipsis-v"></i>'+
                        '</button>'+
                        '<div class="dropdown-menu">'+
                        '<a class="dropdown-item" href="javascript:void(0);" onclick="showModel()">View Review</a>'+
                        '</div>'+
                        '</div>' +
                        '</td>' +
                        '</tr>';
                        $("#teacherLeaveTable tbody").append(tableHtml);
                })
                return data;
            }
        }
    });
}


function showModel() {
    $('#leaveFromModal').modal('show');
}
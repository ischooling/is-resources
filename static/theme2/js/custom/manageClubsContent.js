function renderManageClubsPage(title){
    $('#dashboardContentInHTML').html(getManageClubsContent(title));
    manageClubsOnLoad();
}

function getManageClubsContent(title){
    var html=
        `<div class="app-page-title mb-3 py-2">
            <div class="page-title-wrapper">
                <div class="page-title-heading">
                  <div class="page-title-icon">
                     <img src="${PATH_FOLDER_IMAGE2}/Icon/sidebar/Manage_club_icon.png" style="max-width:200px; width: 90%; margin-right: auto; display: flex;">
                     </div>
                    <div>
                        <span class="text-primary welcome-name-text">${title}</span>
                    </div>
                </div>
            </div>
        </div>
        <div id="manageClubsCardsWrapper"></div>`
        +getManageClubsTable()
    return html;   
}

function getManageClubsFilter(countObj){
    var totalCount = 0;
    $.each(countObj, function(clubName, count){
        totalCount += count;
    });
    var html = `
    <div class="row mb-3">
        <div class="col-md-4">
            <label class="font-weight-bold mb-1">Filter by Club</label>
            <select class="form-control shadow-sm" 
                    style="border-radius:10px;"
                    onchange="getAllClubsData(this.value)">
                <option value="">All Clubs (${totalCount})</option>`;
                $.each(countObj, function(clubName, count){
                    html+=
                    `<option value="${clubName}">
                        ${clubName} (${count})
                    </option>`;
                });
                html+=`</select>
            </div>
        </div>`;
    return html;
}

// function getManageClubsCards(countObj){
//     var colors = [
//         'bg-primary',
//         'bg-success',
//         'bg-info',
//         'bg-warning',
//         'bg-danger',
//         'bg-secondary',
//         'bg-dark'
//     ];
//     var html='<div class="row">';
//     var i = 1;
//     var totalCount = 0;
//     $.each(countObj, function(clubName, count){
//         totalCount += count;
//     });
//     html+=`<div class="col-md-2 mb-3 px-1">
//         <div class="card text-white ${colors[0]} shadow-sm cursor club-cards"
//                 style="border-radius:14px;"
//                 onclick="getAllClubsData('')">
//             <div class="card-body d-flex justify-content-between align-items-center py-2 px-4">
//                 <p class="mb-1 font-14 font-weight-bold">All Clubs</p>
//                 <p class="mb-0 font-weight-bold font-14">${totalCount}</p>
//             </div>
//         </div>
//     </div>`;
//     $.each(countObj, function(clubName, count){
//         var colorClass = colors[i % colors.length];
//         html+=`<div class="col-md-2 mb-3 px-1">
//             <div class="card text-white ${colorClass} shadow-sm cursor club-cards" style="border-radius:14px;" onclick="getAllClubsData('${clubName}')">
//                 <div class="card-body d-flex justify-content-between align-items-center py-2 px-4">
//                     <p class="mb-1 font-weight-bold font-14">${clubName}</p>
//                     <p class="mb-0 font-weight-bold font-14">${count}</p>
//                 </div>
//             </div>
//         </div>`;
//         i++;
//     });
//     html += '</div>';

//     return html;
// }

function getManageClubsTable(){
    var html=
        `<div id="manageClubsTableWrapper" class="table-responsive">
            <table id="manageClubsTable" class="table table-bordered border-radius-table font-12">
                <thead class="bg-primary text-white">
                    <tr>
                        <th>S.No.</th>
                        <th>Name</th>
                        <th>Grade</th>
                        <th>Club Name</th>
                        <th>Registration Date</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>`
    return html;
}

function getManageClubsTbody(data){
    if ($.fn.DataTable.isDataTable('#manageClubsTable')) {
        $('#manageClubsTable').DataTable().clear().destroy();
    }
    var tbodyHtml = '';
    if (data && data.length > 0) {
        $.each(data, function(index, item){
            tbodyHtml+=`<tr>
                <td>${index + 1}</td>
                <td>${item.studentName}</td>
                <td>${item.standard}</td>
                <td>${item.clubName}</td>
                <td>${changeDateFormat(new Date(item.createdDate), "MMM dd, yyyy hh:mm:ss A")}</td>
            </tr>`;
        });
    } else {
        tbodyHtml=`<tr>
            <td colspan="5" class="text-center text-muted">
                No records found
            </td>
        </tr>`;
    }
    $('#manageClubsTable tbody').html(tbodyHtml);
    $('#manageClubsTable').DataTable({
        theme: "bootstrap4"
    });
}
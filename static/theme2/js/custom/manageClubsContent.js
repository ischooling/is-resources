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
        <div id="manageClubsFilterWrapper"></div>`
        +getManageClubsTable();
        html+=`<div id="manageClubsPagination"></div>`
    return html;   
}

function getManageClubsFilter(countObj) {
    var totalCount = 0;
    $.each(countObj, function(clubName, count){
        totalCount += count;
    });
    var html=`
        <div class="card shadow-sm mb-3" style="border-radius:12px;">
            <div class="card-body">
                <div class="row custom-field-scope">

                    <div class="col-md-3 mb-2">
                        <div class="position-relative custom-field mb-2 mt-3 p-0">
                            <input type="text" class="form-control" id="filterClubStudentName" placeholder=" ">
                            <label class="font-weight-bold mb-1">Student Name</label>
                        </div>
                    </div>

                    <div class="col-md-3 mb-2">
                        <div class="position-relative custom-field mb-2 mt-3 p-0">
                            <input type="text" class="form-control" id="filterClubStudentEmail" placeholder=" ">
                            <label class="font-weight-bold mb-1">Student Email</label>
                        </div>
                    </div>

                    <div class="col-md-3 mb-2">
                        <div class="position-relative custom-field mb-2 mt-3 p-0">
                            <select class="form-control" id="filterClubName">
                                <option value="">All Clubs</option>`;
                                $.each(countObj, function(clubName, count){
                                html+=`<option value="${clubName}">
                                    ${clubName}
                                </option>`;
                                });
                            html+=`</select>
                            <label class="font-weight-bold mb-1">Club</label>
                        </div>
                    </div>

                    <div class="col-md-3 mb-2">
                        <div class="position-relative custom-field mb-2 mt-3 p-0">
                            <select class="form-control" id="filterClubCountryId"></select>
                            <label class="font-weight-bold mb-1">Country</label>
                        </div>
                    </div>

                    <div class="col-md-3 mb-2">
                        <div class="position-relative custom-field mb-2 mt-3 p-0">
                            <select class="form-control" id="filterClubStandardId">
                                <option value="0">Select Grade</option>
                            </select>
                            <label class="font-weight-bold mb-1">Grade</label>
                        </div>
                    </div>

	                    <div class="col-12 col-md-auto mb-2 d-flex align-items-end px-1">
	                        <button class="btn btn-primary mr-2" style="width: 100px !important; max-width: 100% !important;" onclick="applyClubFilter();">Apply Filter</button>
	                    </div>

	                    <div class="col-12 col-md-auto mb-2 d-flex align-items-end px-1">
	                        <button class="btn btn-danger" style="width: 80px !important; max-width: 100% !important;" onclick="resetClubFilters();">Reset</button>
	                    </div>
                </div>
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
                        <th>Email</th>
                        <th>Country</th>
                        <th>Grade</th>
                        <th>Club Name</th>
                        <th>Registration Date</th>
                    </tr>
                </thead>
                <tbody class="bg-white"></tbody>
            </table>
        </div>`
    return html;
}

function getManageClubsTbody(data){
    var tbodyHtml = '';
    if (data && data.length > 0) {
        $.each(data, function(index, item){
            tbodyHtml+=`<tr>
                <td>${(CURRENT_PAGE_MANAGE_CLUBS - 1) * 20 + index + 1}</td>
                <td>${item.studentName}</td>
                <td>${item.email}</td>
                <td>${item.countryName}</td>
                <td>${item.standard}</td>
                <td>${item.clubName}</td>
                <td>${changeDateFormat(new Date(item.createdDate), "MMM dd, yyyy hh:mm:ss A")}</td>
            </tr>`;
        });
        $("#manageClubsPagination").show()
    } else {
        tbodyHtml=`<tr>
            <td colspan="7" class="text-center text-muted">
                No records found
            </td>
        </tr>`;
        $("#manageClubsPagination").hide();
    }
    $('#manageClubsTable tbody').html(tbodyHtml);
}

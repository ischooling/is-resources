function renderWatiNumbersContent(){
  $("#dashboardContentInHTML").html(getWatiNumbersContent())
  $("body").append(addWatiNumber());
  getBodyOfTable();
  $("#filterStatus").select2({
    theme:"bootstrap4",
  });
}
function getWatiNumbersContent() {
  var html = 
  `<div class="app-page-title mb-3 py-2">
		<div class="page-title-wrapper">
				<div class="page-title-heading">
					<div class="page-title-icon">
						<i class="fas fa-university text-primary"></i>
					</div>
					<div>Manage Numbers with Users</div>
				</div>
				<div class="page-title-actions">
          <button onclick="$('#addWatiNumberModal').modal('show');" class="btn btn-warning">Add Wati Number <span><i class="fa fa-plus" aria-hidden="true"></i></span></button>
        </div>
			</div>
		</div>

    <div class="main-card mb-3 card">
      <div class="card-body">
        <div class="filter-container mb-3 custom-field-scope">
          <div class="form-row">
            <div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12 mb-2 mb-lg-0">
              <div class="form-group custom-field mb-0">
                <input type="text" id="filterName" class="form-control" placeholder=" " autocomplete="off">
                <label for="filterName" class="m-0">Name</label>
              </div>
            </div>
            <div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12 mb-2 mb-lg-0">
              <div class="form-group custom-field mb-0">
                <input type="text" id="filterNumber" class="form-control" placeholder=" " autocomplete="off">
                <label for="filterNumber" class="m-0">Number</label>
              </div>
            </div>
            <div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12 mb-2 mb-lg-0">
              <div class="form-group custom-field mb-0">
                <select id="filterStatus" class="form-control">
                  <option value="">Select Status</option>
                  <option value="A">Active</option>
                  <option value="I">Inactive</option>
                </select>
                <label for="filterStatus" class="m-0">Status</label>
              </div>
            </div>
            <div class="col-xl-3 col-lg-3 col-md-12 col-sm-6 col-12 mb-2 mb-lg-0">
              <button onclick="showFilterData();" class="btn btn-lg btn-success ">Search <i class="fa fa-search"></i></button>
              <button onclick="resetField();" class="btn btn-lg btn-danger ">Reset <i class="fa fa-sync"></i></button>
            </div>
          </div>
        </div>

      <div class="table-responsive">
        <table class="table table-bordered table-striped border-radius-table font-12 nowrap" style="100% !important;min-width:1000px">
          <thead>
            <tr class="bg-primary text-white">
              <th>#</th>
              <th>Number</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="watiNumbersBody">
            <tr>
              <td colspan="4" class="text-center py-3">Loading...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>`;
  return html;
}

function getBodyOfTable() {
  $.ajax({
    type: "GET",
    url: BASE_URL + CONTEXT_PATH + "wati/api/get-all-numbers",
    dataType: "json",
    success: function (response) {
      var list = response.list;
      if(list.length == 0){
        $("#watiNumbersBody").html('<tr><td colspan="4" class="text-center text-danger">No Data Found</td></tr>');
      } else {
        var tableBody = list
          .map((item, index) => {
            const waNumber = item.waNumber.replace(/'/g, "\\'");
            const watiToken = item.watiToken.replace(/'/g, "\\'");
            const watiUrl = item.watiUrl.replace(/'/g, "\\'");
            const status = item.status.replace(/'/g, "\\'");
            const studentWati = item.studentWati.replace(/'/g, "\\'");

            return `
              <tr>
                <td>${index + 1}</td>
                <td>${item.waNumber}</td>
                <td style="font-size: 14px;">
                  ${item.status === "A" 
                    ? `<span class="text-success fw-bold">Active <i class="fa fa-check-circle"></i></span>` 
                    : `<span class="text-danger fw-bold">Inactive <i class="fa fa-times-circle"></i></span>`
                  }
                </td>
                <td style="width:30%;">
                  <button onclick="updateWati('${waNumber}', '${watiToken}', '${watiUrl}', '${status}', '${studentWati}');" class="update-btn btn btn-sm btn-primary " style="background-color:#1F509A" data-id="${item.id}">
                    Update <i class="fa fa-pencil"></i>
                  </button>
                  <button onclick="showFilterData(true, '${item.waNumber}');" class="btn btn-sm btn-alternate ">
                    About Number <i class="fa fa-info-circle"></i>
                  </button>
                  <button onclick="addWatiUser('${item.waNumber}');" class="btn btn-sm btn-success ">
                    Add User <i class="fa fa-plus"></i>
                  </button>
                </td>
              </tr>`;
          })
          .join("");
        $("#watiNumbersBody").html(tableBody);
      }
    }
  });
}

function showFilterData(isAboutNumber = false, numberOnly = null) {
  var html = `
    <div class="modal fade" id="filteredNumbersModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-modal="true">
      <div class="modal-dialog modal-xl modal-dialog-centered box-shadow-none" role="document" style="max-width:1000px !important">
        <div class="modal-content">
          <div class="modal-header py-2 bg-primary text-white">
              <h5 class="modal-title">List</h5>
              <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
              </button>
          </div>
          <div class="modal-body">
              <table class="table table-bordered table-striped border-radius-table font-12 responsive nowrap w-100">
                <thead class="position-sticky" style="top: 0;left:0;">
                  <tr class="bg-primary text-white">
                    <th>#</th>
                    <th>Name</th>
                    <th>Number</th>
                    ${/*<th>Status</th>*/''}
                    <th>User Linking</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody id="filteredNumbersBody">
                  <tr>
                    <td colspan="6" class="text-center py-3">Loading...</td>
                  </tr>
                </tbody>
              </table>
          </div>
        </div>
      </div>  
    </div>  
  `;
  $('body').append(html);
  getFilteredNumbers(isAboutNumber, numberOnly)
}

function getFilteredNumbers(isAboutNumber, numberOnly) {
  var body = {
    name: isAboutNumber ? "" : $("#filterName").val().trim(),
    number: numberOnly || $("#filterNumber").val().trim(),
    status: isAboutNumber ? "" : $("#filterStatus").val().trim()
  };

  $.ajax({
    type: "POST",
    url: BASE_URL + CONTEXT_PATH + "wati/api/get-numbers-by-filter",
    data: JSON.stringify(body),
    contentType: APPLICATION_JSON_VALUE,
    dataType: "json",
    success: function (response) {
      var list = response.data;
     if (list.length == 0) {
      $("#filteredNumbersBody").html(
        '<tr><td colspan="6" class="text-center">No Data Found For Searched Entries.</td></tr>'
      );
      } else {
        var modalBody = list
          .map((item, index) => {
            var formattedDate = changeDateFormat(new Date(item.date), "MMM-dd-yyyy");
            return `
              <tr>
                <td>${index + 1}</td>
                <td>${item.name || "N/A"}</td>
                <td>${item.number}</td>
                ${/*<td style="font-size: 14px;">
                  ${item.status === "A" 
                    ? `<span class="text-success fw-bold">Active <i class="fa fa-check-circle"></i></span>` 
                    : `<span class="text-danger fw-bold">Inactive <i class="fa fa-times-circle"></i></span>`}
                </td>*/''}
                <td class="linkingStatus" data-status="${item.userLinkingStatus}" style="font-size: 14px;">
                  ${item.userLinkingStatus === "A" 
                    ? `<span class="text-success fw-bold">Linked <i class="fa fa-check"></i></span>` 
                    : `<span class="text-danger fw-bold">Unlinked <i class="fa fa-times"></i></span>`}
                </td>
                <td>${formattedDate || "N/A"}</td>
                <td>
                  <button onclick="changeLinkingStatus(this, '${item.number}', '${item.uId}');" class="border-0 rounded px-3 py-2 text-white" style="background-color:#027FFF;">Change Linking Status</button>
                </td>
              </tr>`;
          })
          .join("");

        $("#filteredNumbersBody").html(modalBody);
      }
      $("#filteredNumbersModal").modal("show");
    }
  });
}

function changeLinkingStatus(btn, number, userId) {
  var row = $(btn).closest("tr");
  var currentStatus = row.find(".linkingStatus").attr("data-status");

  var dropdownHtml = `
    <select class="rounded border p-2 w-50 linkingStatusDropdown">
      <option value="A" ${currentStatus === "A" ? "selected" : ""}>Linked</option>
      <option value="I" ${currentStatus === "I" ? "selected" : ""}>Unlinked</option>
    </select>
    <button class="border-0 rounded px-3 py-2 text-white saveStatusBtn btn-success">Save</button>
  `;

  row.find(".linkingStatus").html(dropdownHtml);

  row.find(".saveStatusBtn").on("click", function () {
    saveLinkingStatus(row, number, userId);
  });
}

function saveLinkingStatus(row, number, userId) {
  var newStatus = row.find(".linkingStatusDropdown").val();
  var body = {
    number: number,
    userId: userId,
    status: newStatus,
  };

  $.ajax({
    type: "POST",
    url: BASE_URL + CONTEXT_PATH + "wati/api/update-wati-user",
    data: JSON.stringify(body),
    contentType: APPLICATION_JSON_VALUE,
    dataType: "json",
    success: function (response) {
      if (response.status === "success") {
        showMessageTheme2(1, "Status updated successfully!");
        var updatedStatusHtml = newStatus === "A"
          ? `<span class="text-success fw-bold linkingStatus" data-status="A">Linked <i class="fa fa-check"></i></span>`
          : `<span class="text-danger fw-bold linkingStatus" data-status="I">Unlinked <i class="fa fa-times"></i></span>`;

        row.find(".linkingStatus").html(updatedStatusHtml);
      } else {
        showMessageTheme2(0, response.message);
      }
    }
  });
}

function resetField(){
  $("#filterName").val("");
  $("#filterNumber").val("");
  $("#filterStatus").val("");
}

function addWatiNumber() {
  var html = 
    `<div class="modal fade" id="addWatiNumberModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-modal="true">
      <div class="modal-dialog modal-lg modal-dialog-centered box-shadow-none" role="document" style="max-width:800px !important">
        <div class="modal-content">
          <div class="modal-header py-2 bg-primary text-white">
              <h5 class="modal-title">List</h5>
              <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
              </button>
          </div>
          <div class="modal-body">
            <form action="javascript:void(0);" id="addWatiNumberForm" class="custom-field-scope">
              <div class="mb-3 form-group custom-field">
                <input type="text" id="addNumber" class="form-control" placeholder=" " required autocomplete="off">
                <label for="addNumber" class="m-0">Wati Number</label>
              </div>
              <div class="mb-3 form-group custom-field">
                <input type="text" id="addWUrl" class="form-control" placeholder=" " required autocomplete="off">
                <label for="addWUrl" class="m-0">Wati URL</label>
              </div>
              <div class="mb-3 form-group custom-field">
                <input type="text" id="addWToken" class="form-control" placeholder=" " required autocomplete="off">
                <label for="addWToken" class="m-0">Wati Token</label>
              </div>
            </form>
          </div>
          <div class="modal-footer text-right">
            <button type="submit" class="btn btn-primary " onclick="submitAddNumberForm(event);">Add Number</button>
            <button type="button"  class="btn btn-danger " data-dismiss="modal">Cancel</button>
          </div>
        </div>
      </div>  
    </div>`;
  return html;
}

function submitAddNumberForm(e){
  e.preventDefault();
  var body = {
    number: $("#addNumber").val().trim(),
    wUrl: $("#addWUrl").val().trim(),
    wToken: $("#addWToken").val().trim()
  }
  $.ajax({
    type: "POST",
    url: BASE_URL + CONTEXT_PATH + "wati/api/add-number",
    data: JSON.stringify(body),
    contentType: APPLICATION_JSON_VALUE,
    dataType: "json",
    success: function(response) {
      if (response.status == "success") {
        showMessageTheme2(1,"Wati number added successfully!");
        $('#addWatiNumberModal').modal("hide");
        getBodyOfTable();
      } else {
        showMessageTheme2(0,"Failed to add Wati number.");
      }
    }
  });
}

function updateWati(number, watiToken, watiUrl, status,studentWati) {
  var html = 
    `<div class="modal fade" id="updateWatiNumberModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-modal="true">
      <div class="modal-dialog modal-lg modal-dialog-centered box-shadow-none" role="document" style="max-width:800px !important">
        <div class="modal-content">
          <div class="modal-header py-2 bg-primary text-white">
              <h5 class="modal-title">Update Wati Number</h5>
              <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
              </button>
          </div>
          <div class="modal-body">
            <form action="javascript:void(0);" id="updateWatiNumberForm" class="custom-field-scope">
              <div class="mb-3 form-group custom-field">
                <input type="text" id="updateNumber" class="form-control" value="${number}" placeholder=" " required autocomplete="off" readonly>
                <label for="updateNumber" class="m-0">Wati Number</label>
              </div>
              <div class="mb-3 form-group custom-field">
                <input type="text" id="updateWUrl" class="form-control" value="${watiUrl}" placeholder=" " required autocomplete="off">
                <label for="updateWUrl" class="m-0">Wati URL</label>
              </div>
              <div class="mb-3 form-group custom-field">
                <input type="text" id="updateWToken" class="form-control" value="${watiToken}" placeholder=" " required autocomplete="off">
                <label for="updateWToken" class="m-0">Wati Token</label>
              </div>
              <div class="mb-3 form-group custom-field">
                <select id="updateStatus" class="form-control">
                  <option value="A" ${status == "A" ? "selected" : ""}>Active</option>
                  <option value="I" ${status == "I" ? "selected" : ""}>Inactive</option>
                </select>
                <label for="updateStatus" class="m-0">Status</label>
              </div>
              <div class="mb-3 form-group custom-field">
                <select id="studentWati" class="form-control">
                  <option value="Y" ${studentWati == "Y" ? "selected" : ""}>Active</option>
                  <option value="N" ${studentWati == "N" ? "selected" : ""}>Inactive</option>
                </select>
                <label for="studentWati" class="m-0">Eligible for Wati Broadcast in Student List and Teacher List</label>
              </div>
            </form>
          </div>
          <div class="modal-footer text-right">
            <button type="submit" class="btn btn-primary " onclick="submitUpdateNumberForm(event, '${number}', '${watiToken}', '${watiUrl}', '${status}');">Update Number</</button>
            <button type="button"  class="btn btn-danger " data-dismiss="modal">Cancel</button>
          </div>
        </div>
      </div>  
    </div>`;
  if($("#updateWatiNumberModal").length == 1){
    $("#updateWatiNumberModal").remove();
  }
  $("body").append(html);
  $("#updateWatiNumberModal").modal("show");
}

function submitUpdateNumberForm(e, number, watiToken, watiUrl, status){
  e.preventDefault();
  var body = {
    number: $("#updateNumber").val().trim(),
    wUrl: $("#updateWUrl").val().trim(),
    wToken: $("#updateWToken").val().trim(),
    status: $("#updateStatus").val(),
    studentWati: $("#studentWati").val()
  };

  $.ajax({
    type: "POST",
    url: BASE_URL + CONTEXT_PATH + "wati/api/update-number",
    data: JSON.stringify(body),
    contentType: APPLICATION_JSON_VALUE,
    dataType: "json",
    success: function(response) {
      if (response.status == "success") {
        showMessageTheme2(1, response["message"]);
        $('#updateWatiNumberModal').modal("hide");
        getBodyOfTable();
      } else {
        showMessageTheme2(0, "Failed to update Wati number.");
      }
    }
  });
}

var selectedUserKeys = [];
function addWatiUser(number){
  if($('#addWatiUserModal').length > 0){
    $('#addWatiUserModal').remove()
  }
  var html = 
    `<div class="modal fade" id="addWatiUserModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-modal="true">
      <div class="modal-dialog modal-lg modal-dialog-centered box-shadow-none" role="document" style="max-width:800px !important">
        <div class="modal-content">
          <div class="modal-header py-2 bg-primary text-white">
              <h5 class="modal-title">Add Wati User</h5>
              <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
              </button>
          </div>
          <div class="modal-body">
    <form action="javascript:void(0);" id="addWatiUserForm" class="custom-field-scope">
              <div class="mb-3 form-group custom-field">
                <input type="text" id="addWatiUserNumber" class="form-control" style="cursor:not-allowed;" value="${number}" placeholder=" " required disabled autocomplete="off">
                <label for="addWatiUserNumber" class="m-0">Wati Number</label>
              </div>
              <div class="mb-3 form-group custom-field">
                <select id="addUsers" class="form-control" autocomplete="off"></select>
                <label for="addUsers" class="m-0">Add Users</label>
              </div>
            </form>
          </div>
          <div class="modal-footer text-right">
            <button type="submit" class="btn btn-primary " onclick="submitAddWatiUserForm(event,'${number}');">Update Number</button>
            <button type="button"  class="btn btn-danger " data-dismiss="modal">Cancel</button>
          </div>
        </div>
      </div>  
    </div>`;
  $("body").append(html);
  $("#addWatiUserModal").modal("show");
  $.ajax({
    type: "POST",
    url: BASE_URL + CONTEXT_PATH + "wati/api/get-user-list",
    data: JSON.stringify({name:""}),
    contentType: APPLICATION_JSON_VALUE,
    dataType: "json",
    success: function(response) {
      if (response && response.data.length > 0) {
        response.data.forEach(user => {
          var displayText = `${user.name} (${user.role})`;
          $("#addUsers").append(new Option(displayText, user.id));
        });
      }
      
      $("#addUsers").select2({
        placeholder: "Select Users",
        theme:"bootstrap4",
        multiple: true
      });

      $("#addUsers").on("change", function() {
        selectedUserKeys = $(this).val() || [];
      }).val(null).trigger("change");
    }
  });
}

function submitAddWatiUserForm(e, number){
  e.preventDefault();
  if(selectedUserKeys.length == 0){
    showMessageTheme2(0, "Select Users")
  }else{
    var body = {
      number: number,
      ids: selectedUserKeys.join(",")
    };

    $.ajax({
      type: "POST",
      url: BASE_URL + CONTEXT_PATH + "wati/api/save-wati-user",
      data: JSON.stringify(body),
      contentType: APPLICATION_JSON_VALUE,
      dataType: "json",
      success: function(response) {
        if (response.status == "success") {
          showMessageTheme2(1, "User added successfully!");
          getBodyOfTable();
          $("#addWatiUserModal").modal("hide");
        } else {
          showMessageTheme2(0, "Failed to add user.");
        }
      }
    });
  }
}

function getLeadDemoReportCountryContent(title) {
    return ''
        + '<div class="app-page-title mb-3 py-2">'
            + '<div class="page-title-wrapper">'
                + '<div class="page-title-heading">'
                    + '<div class="page-title-icon"><i class="pe-7s-graph3 text-primary"></i></div>'
                    + '<div>' + title + '</div>'
                + '</div>'
            + '</div>'
        + '</div>'

        // ── Filter Card ───────────────────────────────────────────────────
        + '<div class="main-card mb-3 card">'
            + '<div class="card-body">'
                + '<form id="leadDemoReportCountryFilterForm" class="row align-items-end custom-field-scope">'

                    + '<div class="col-xl-2 col-lg-2 col-md-4 col-sm-6 col-12 mb-2">'
                        + '<div class="custom-field mb-0">'
                            + '<select class="form-control" id="leadDemoReportCountryDateRange">'
                                + '<option value="today">Today</option>'
                                + '<option value="yesterday">Yesterday</option>'
                                + '<option value="week">Week</option>'
                                + '<option value="month">Month</option>'
                                + '<option value="custom">Custom</option>'
                            + '</select>'
                            + '<label class="text-primary m-0" for="leadDemoReportCountryDateRange">Date Range</label>'
                        + '</div>'
                    + '</div>'

                    + '<div class="col-xl-2 col-lg-2 col-md-4 col-sm-6 col-12 mb-2" id="leadDemoReportCountryFromDateCol" style="display:none;">'
                        + '<div class="custom-field mb-0">'
                            + '<input type="text" class="form-control" id="leadDemoReportCountryStartDate" placeholder=" " readonly onkeydown="return false" />'
                            + '<label class="text-primary m-0" for="leadDemoReportCountryStartDate">From Date</label>'
                        + '</div>'
                    + '</div>'

                    + '<div class="col-xl-2 col-lg-2 col-md-4 col-sm-6 col-12 mb-2" id="leadDemoReportCountryToDateCol" style="display:none;">'
                        + '<div class="custom-field mb-0">'
                            + '<input type="text" class="form-control" id="leadDemoReportCountryEndDate" placeholder=" " readonly onkeydown="return false" />'
                            + '<label class="text-primary m-0" for="leadDemoReportCountryEndDate">To Date</label>'
                        + '</div>'
                    + '</div>'

                    + '<div class="col-xl-2 col-lg-2 col-md-4 col-sm-6 col-12 mb-2">'
                        + '<div class="custom-field mb-0">'
                            + '<select class="form-control" id="leadDemoReportCountryCounselorId"></select>'
                            + '<label class="text-primary m-0" for="leadDemoReportCountryCounselorId">Academic Counselor</label>'
                        + '</div>'
                    + '</div>'

                    + '<div class="col-xl-2 col-lg-2 col-md-4 col-sm-6 col-12 mb-2">'
                        + '<div class="custom-field mb-0">'
                            + '<select class="form-control" id="leadDemoReportCountryCountryId"></select>'
                            + '<label class="text-primary m-0" for="leadDemoReportCountryCountryId">Country</label>'
                        + '</div>'
                    + '</div>'

                    + '<div class="col-xl-2 col-lg-2 col-md-4 col-sm-6 col-12 mb-2">'
                        + '<div class="d-inline-flex align-items-center flex-nowrap" style="gap:10px;">'
                            + '<button type="button" class="btn btn-success px-3" id="leadDemoReportCountrySearchBtn" style="min-width:62px;"><i class="fa fa-search"></i></button>'
                            + '<button type="button" class="btn btn-danger px-3" id="leadDemoReportCountryResetBtn" style="min-width:62px;"><i class="fa fa-undo"></i></button>'
                        + '</div>'
                    + '</div>'

                + '</form>'
            + '</div>'
        + '</div>'

        // ── Summary Cards ─────────────────────────────────────────────────
        + '<div class="row mb-3">'
            + '<div class="col-xl col-lg col-md-3 col-sm-6 col-12 mb-2">'
                + '<div class="card text-center py-3 px-2" style="border-radius:8px;border:none;background:#e8f0fe;">'
                    + '<div style="color:#3d5af1;font-size:11px;font-weight:500;">Total Lead</div>'
                    + '<div id="ldrcCardTotalLead" style="color:#3d5af1;font-size:26px;font-weight:700;">0</div>'
                + '</div>'
            + '</div>'
            + '<div class="col-xl col-lg col-md-3 col-sm-6 col-12 mb-2">'
                + '<div class="card text-center py-3 px-2" style="border-radius:8px;border:none;background:#fff3e0;">'
                    + '<div style="color:#e65100;font-size:11px;font-weight:500;">Demo Book</div>'
                    + '<div id="ldrcCardDemoBook" style="color:#e65100;font-size:26px;font-weight:700;">0</div>'
                + '</div>'
            + '</div>'
            + '<div class="col-xl col-lg col-md-3 col-sm-6 col-12 mb-2">'
                + '<div class="card text-center py-3 px-2" style="border-radius:8px;border:none;background:#eaf6ee;">'
                    + '<div style="color:#2e7d32;font-size:11px;font-weight:500;">Demo Complete</div>'
                    + '<div id="ldrcCardDemoComplete" style="color:#2e7d32;font-size:26px;font-weight:700;">0</div>'
                + '</div>'
            + '</div>'
            + '<div class="col-xl col-lg col-md-3 col-sm-6 col-12 mb-2">'
                + '<div class="card text-center py-3 px-2" style="border-radius:8px;border:none;background:#ede7f6;">'
                    + '<div style="color:#4527a0;font-size:11px;font-weight:500;">Enrolled</div>'
                    + '<div id="ldrcCardEnrolled" style="color:#4527a0;font-size:26px;font-weight:700;">0</div>'
                + '</div>'
            + '</div>'
            + '<div class="col-xl col-lg col-md-3 col-sm-6 col-12 mb-2">'
                + '<div class="card text-center py-3 px-2" style="border-radius:8px;border:none;background:#e0f7fa;">'
                    + '<div style="color:#00695c;font-size:11px;font-weight:500;">Conversion Rate</div>'
                    + '<div id="ldrcCardConversionRate" style="color:#00695c;font-size:26px;font-weight:700;">0%</div>'
                    + '<div style="color:#00695c;font-size:10px;opacity:0.75;">(Enrolled &divide; Total Lead) &times; 100</div>'
                + '</div>'
            + '</div>'
        + '</div>'

        // ── Table Card ────────────────────────────────────────────────────
        + '<div class="main-card mb-3 card">'
            + '<div class="card-body">'
                + '<div class="d-flex justify-content-end align-items-center flex-wrap mb-2" style="gap:10px;">'
                    + '<button type="button" class="btn btn-outline-primary px-3 py-2" id="leadDemoReportCountryExportCsv"><i class="fa fa-download"></i> CSV</button>'
                    + '<button type="button" class="btn btn-outline-primary px-3 py-2" id="leadDemoReportCountryExportExcel"><i class="fa fa-file-excel"></i> Excel</button>'
                    + '<div id="leadDemoReportCountryCountLabel" class="d-inline-flex align-items-center text-dark border rounded px-2 py-1" style="font-size:18px; font-weight:500;">'
                        + '<span class="mr-1">Total:</span>'
                        + '<span id="leadDemoReportCountryCountValue" class="font-weight-bold text-primary" style="font-size:20px;">0</span>'
                    + '</div>'
                + '</div>'
                + '<div class="table-responsive mt-2">'
                    + '<table class="table table-bordered table-hover" id="leadDemoReportCountryTable" style="width:100%;font-size:12px;">'
                        + '<thead>'
                            + '<tr class="bg-primary text-white">'
                                + '<th>S.No.</th>'
                                + '<th>Country</th>'
                                + '<th class="text-center">Total Lead</th>'
                                + '<th class="text-center">Demo Book</th>'
                                + '<th class="text-center">Demo Complete</th>'
                                + '<th class="text-center">Enrolled</th>'
                                + '<th class="text-center">Conversion Rate</th>'
                            + '</tr>'
                        + '</thead>'
                        + '<tbody id="leadDemoReportCountryTableBody">'
                            + '<tr><td colspan="7" class="text-center">No records found</td></tr>'
                        + '</tbody>'
                    + '</table>'
                + '</div>'
            + '</div>'
        + '</div>';
}

function getLeadDemoReportCountryConversionRate(item) {
    var totalLead = item.totalLead || 0;
    var enrolled = item.enrolled || 0;
    if (!totalLead) {
        return '0%';
    }
    return ((enrolled * 100) / totalLead).toFixed(1) + '%';
}

function getLeadDemoReportCountryRowHtml(reportRows, linkDateRange) {
    if (!reportRows || reportRows.length === 0) {
        return '<tr><td colspan="7" class="text-center">No records found</td></tr>';
    }
    linkDateRange = linkDateRange || {};
    var rowHtml = '';
    $.each(reportRows, function (index, item) {
        // Same clickLeadsLink(...) helper the counselor-wise Lead Demo Report uses for its Total Demo
        // link — opens the Lead List pre-filtered to this country + the report's date range.
        var urlClick = "/dashboard/lead-data-list?moduleId=" + (ROLE_MODULE ? ROLE_MODULE.moduleId : '') + "&leadId=0&leadFrom=LEAD&currentPage=0&euid=" + ENCRYPTED_USER_ID + "&leadType=B2C";
        var totalLeadLink = "clickLeadsLink('" + urlClick + "','" + (linkDateRange.startDate || '') + "', '" + (linkDateRange.endDate || '') + "','list-" + index + "','" + (item.countryId || 0) + "', '0')";
        rowHtml += '<tr>'
            + '<td>' + (index + 1) + '</td>'
            + '<td>' + (item.country || 'Unknown') + '</td>'
            + '<td class="text-center"><a href="javascript:void(0)" onclick="' + totalLeadLink + '">' + (item.totalLead || 0) + '</a></td>'
            + '<td class="text-center">' + (item.demoBook || 0) + '</td>'
            + '<td class="text-center">' + (item.demoComplete || 0) + '</td>'
            + '<td class="text-center"><b>' + (item.enrolled || 0) + '</b></td>'
            + '<td class="text-center">' + getLeadDemoReportCountryConversionRate(item) + '</td>'
        + '</tr>';
    });
    return rowHtml;
}

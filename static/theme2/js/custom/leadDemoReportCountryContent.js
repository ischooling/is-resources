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
                            + '<label class="text-primary m-0" for="leadDemoReportCountryCounselorId">Academic Expert</label>'
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
                + '<div class="card text-center py-2 px-2" style="border-radius:8px;border:none;background:#e8f0fe;">'
                    + '<div style="color:#3d5af1;font-size:11px;font-weight:500;">Total Lead</div>'
                    + '<div id="ldrcCardTotalLead" style="color:#3d5af1;font-size:22px;font-weight:700;">0</div>'
                + '</div>'
            + '</div>'
            + '<div class="col-xl col-lg col-md-3 col-sm-6 col-12 mb-2">'
                + '<div class="card text-center py-2 px-2" style="border-radius:8px;border:none;background:#eaf6ee;">'
                    + '<div style="color:#2e7d32;font-size:11px;font-weight:500;">Demo Scheduled</div>'
                    + '<div id="ldrcCardDemoSchedule" style="color:#2e7d32;font-size:22px;font-weight:700;">0</div>'
                + '</div>'
            + '</div>'
            + '<div class="col-xl col-lg col-md-3 col-sm-6 col-12 mb-2">'
                + '<div class="card text-center py-2 px-2" style="border-radius:8px;border:none;background:#ede7f6;">'
                    + '<div style="color:#4527a0;font-size:11px;font-weight:500;">Lead &rarr; Demo</div>'
                    + '<div id="ldrcCardLeadToDemo" style="color:#4527a0;font-size:22px;font-weight:700;">0%</div>'
                + '</div>'
            + '</div>'
            + '<div class="col-xl col-lg col-md-3 col-sm-6 col-12 mb-2">'
                + '<div class="card py-2 px-1" style="border-radius:8px;border:none;background:#eaf6ee;">'
                    + '<div class="d-flex text-center">'
                        + '<div class="flex-fill" style="border-right:1px solid rgba(46,125,50,0.25);">'
                            + '<div style="color:#2e7d32;font-size:10px;font-weight:500;white-space:nowrap;">Demo Completed</div>'
                            + '<div id="ldrcCardDemoComplete" style="color:#2e7d32;font-size:20px;font-weight:700;">0</div>'
                        + '</div>'
                        + '<div class="flex-fill">'
                            + '<div style="color:#2e7d32;font-size:10px;font-weight:500;white-space:nowrap;">No Show</div>'
                            + '<div id="ldrcCardDemoNoShow" style="color:#2e7d32;font-size:20px;font-weight:700;">0</div>'
                        + '</div>'
                    + '</div>'
                + '</div>'
            + '</div>'
            + '<div class="col-xl col-lg col-md-3 col-sm-6 col-12 mb-2">'
                + '<div class="card text-center py-2 px-2" style="border-radius:8px;border:none;background:#fdeaea;">'
                    + '<div style="color:#c62828;font-size:11px;font-weight:500;">Demo Completed</div>'
                    + '<div id="ldrcCardNotEnrolled" style="color:#c62828;font-size:22px;font-weight:700;">0</div>'
                    + '<div style="color:#c62828;font-size:10px;opacity:0.75;">Not Enrolled</div>'
                + '</div>'
            + '</div>'
            + '<div class="col-xl col-lg col-md-3 col-sm-6 col-12 mb-2">'
                + '<div class="card text-center py-2 px-2" style="border-radius:8px;border:none;background:#ede7f6;">'
                    + '<div style="color:#4527a0;font-size:11px;font-weight:500;">Enrolled</div>'
                    + '<div id="ldrcCardEnrolled" style="color:#4527a0;font-size:22px;font-weight:700;">0</div>'
                + '</div>'
            + '</div>'
            
            + '<div class="col-xl col-lg col-md-3 col-sm-6 col-12 mb-2">'
                + '<div class="card text-center py-2 px-2" style="border-radius:8px;border:none;background:#eaf6ee;">'
                    + '<div style="color:#2e7d32;font-size:11px;font-weight:500;">Demo &rarr; Convert</div>'
                    + '<div id="ldrcCardDemoToConvert" style="color:#2e7d32;font-size:22px;font-weight:700;">0%</div>'
                + '</div>'
            + '</div>'
        + '</div>'

        // ── Table Card ────────────────────────────────────────────────────
        + '<div class="main-card mb-3 card">'
            + '<div class="card-body">'
                + '<div class="table-responsive mt-2">'
                    + '<table class="table table-bordered table-hover" id="leadDemoReportCountryTable" style="width:100%;font-size:12px;">'
                        + '<thead>'
                            + '<tr class="bg-primary text-white">'
                                + '<th>S.No.</th>'
                                + '<th>Country</th>'
                                + '<th class="text-center">Total Lead</th>'
                                + '<th class="text-center">Demo Scheduled</th>'
                                + '<th class="text-center">Demo Completed</th>'
                                + '<th class="text-center">No Show</th>'
                                + '<th class="text-center">Enrolled</th>'
                                + '<th class="text-center">Conversion Rate</th>'
                            + '</tr>'
                        + '</thead>'
                        + '<tbody id="leadDemoReportCountryTableBody">'
                            + '<tr><td colspan="8" class="text-center">No records found</td></tr>'
                        + '</tbody>'
                    + '</table>'
                + '</div>'
            + '</div>'
        + '</div>';
}

// Aggregate-level formulas for the 3 summary cards above — mirrors the "Lead & Demo Dashboard" page's
// Lead→Demo / Lead→Convert / Demo→Convert KPI tiles, computed here from this report's own totals
// (data.totalLead / demoSchedule / demoComplete / enrolled) instead of a per-country breakdown.
function getLeadDemoReportCountryLeadToDemoRate(data) {
    var totalLead = data.totalLead || 0;
    var demoSchedule = data.demoSchedule || 0;
    var rate = totalLead ? (demoSchedule * 100) / totalLead : 0;
    return rate.toFixed(1) + '%';
}

function getLeadDemoReportCountryLeadToConvertRate(data) {
    var totalLead = data.totalLead || 0;
    var enrolled = data.enrolled || 0;
    var rate = totalLead ? (enrolled * 100) / totalLead : 0;
    return rate.toFixed(1) + '%';
}

function getLeadDemoReportCountryDemoToConvertRate(data) {
    var demoComplete = data.demoComplete || 0;
    var enrolled = data.enrolled || 0;
    var rate = demoComplete ? (enrolled * 100) / demoComplete : 0;
    return rate.toFixed(1) + '%';
}

function getLeadDemoReportCountryRowHtml(reportRows, linkDateRange) {
    if (!reportRows || reportRows.length === 0) {
        return '<tr><td colspan="8" class="text-center">No records found</td></tr>';
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
            + '<td class="text-center" style="background:#eaf6ee;color:#2e7d32;font-weight:600;">' + (item.demoSchedule || 0) + '</td>'
            + '<td class="text-center" style="background:#eaf6ee;color:#2e7d32;font-weight:600;">' + (item.demoComplete || 0) + '</td>'
            + '<td class="text-center" style="background:#eaf6ee;color:#2e7d32;font-weight:600;">' + (item.noShow || 0) + '</td>'
            + '<td class="text-center" style="background:#ede7f6;color:#4527a0;"><b>' + (item.enrolled || 0) + '</b></td>'
            + '<td class="text-center">' + getLeadDemoReportCountryDemoToConvertRate(item) + '</td>'
        + '</tr>';
    });
    return rowHtml;
}

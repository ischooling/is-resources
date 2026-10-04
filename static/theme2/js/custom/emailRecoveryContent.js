function getEmailRecoveryContent(title) {
    return `
        <div class="email-recovery-page">
            <div class="app-page-title mb-3 py-2">
                <div class="page-title-wrapper">
                    <div class="page-title-heading">
                        <div class="page-title-icon"><i class="fas fa-envelope-open-text text-primary" aria-hidden="true"></i></div>
                        <div>${title}</div>
                    </div>
                </div>
            </div>
            <form id="emailRecoveryFilterForm" action="javascript:void(0);" class="border rounded bg-white p-3 mb-3 custom-field-scope" onsubmit="searchEmailRecovery(); return false;">
                <div class="row">
                    <div class="col-lg-4 col-md-6 col-12 email-recovery-main-field">
                        <div class="custom-field email-recovery-field">
                            <input type="text" id="emailRecoveryEmail" class="form-control" placeholder=" " autocomplete="off">
                            <label for="emailRecoveryEmail">Email</label>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6 col-12 email-recovery-main-field email-recovery-subject-field d-none">
                        <div class="custom-field email-recovery-field">
                            <input type="text" id="emailRecoverySubject" class="form-control" placeholder=" ">
                            <label for="emailRecoverySubject">Subject</label>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6 col-12 email-recovery-main-field">
                        <div class="custom-field email-recovery-field">
                            <select id="emailRecoveryDuration" class="form-control">
                                <option value="today">Today</option>
                                <option value="yesterday" selected>Yesterday</option>
                                <option value="week">Weekly</option>
                                <option value="custom">Custom</option>
                                <option value="">All</option>
                            </select>
                            <label for="emailRecoveryDuration">Duration</label>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6 col-12 email-recovery-main-field">
                        <div class="custom-field email-recovery-field">
                            <input type="number" min="1" step="1" id="emailRecoveryPageSize" class="form-control" value="25" placeholder=" ">
                            <label for="emailRecoveryPageSize">Page Size</label>
                        </div>
                    </div>
                </div>
                <div class="email-recovery-filter-footer">
                    <div class="email-recovery-date-fields d-none">
                        <div class="custom-field email-recovery-field">
                            <input type="text" id="emailRecoveryStartDate" class="form-control" placeholder=" " autocomplete="off" readonly onkeydown="return false">
                            <label for="emailRecoveryStartDate">Start Date</label>
                        </div>
                        <div class="custom-field email-recovery-field">
                            <input type="text" id="emailRecoveryEndDate" class="form-control" placeholder=" " autocomplete="off" readonly onkeydown="return false">
                            <label for="emailRecoveryEndDate">End Date</label>
                        </div>
                    </div>
                    <div class="email-recovery-actions">
                        <button type="submit" class="btn btn-primary email-recovery-search"><i class="fa fa-search" aria-hidden="true"></i><span>Search</span></button>
                        <button type="button" class="btn btn-outline-secondary email-recovery-reset" title="Reset filters" aria-label="Reset filters" onclick="resetEmailRecoveryFilters()"><i class="fa fa-undo" aria-hidden="true"></i></button>
                    </div>
                </div>
            </form>
            <div class="email-recovery-workspace bg-white p-3">
                <div class="email-recovery-result-heading">
                    <ul class="nav nav-tabs" id="emailRecoveryTabs" role="tablist" aria-label="Email recovery views">
                        <li class="nav-item" role="presentation">
                            <button type="button" class="nav-link active" role="tab" aria-selected="true" aria-controls="emailRecoveryTableWrapper" data-target="unverified" onclick="switchEmailRecoveryTab('unverified')">Unverified Emails <span class="badge badge-primary ml-1" id="emailRecoveryUnverifiedCount">0</span></button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button type="button" class="nav-link" role="tab" aria-selected="false" aria-controls="emailRecoveryTableWrapper" data-target="captured" onclick="switchEmailRecoveryTab('captured')">Captured Emails <span class="badge badge-primary ml-1" id="emailRecoveryCapturedCount">0</span></button>
                        </li>
                    </ul>
                    <div class="email-recovery-ready text-success">Ready to resend: <strong id="emailRecoveryReadyCount">0</strong></div>
                </div>
                <div id="emailRecoveryTableWrapper" class="email-recovery-results" role="tabpanel" aria-live="polite" aria-busy="false"></div>
            </div>
        </div>`;
}

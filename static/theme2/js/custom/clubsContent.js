function renderClubsPage(title){
    $('#dashboardContentInHTML').html(getClubsContent(title));
}

function getClubsContent(title){
    var html=
        `<div class="app-page-title mb-3 py-2">
            <div class="page-title-wrapper">
                <div class="page-title-heading">
                    <div class="page-title-icon"><i class="pe-7s-cash text-primary"></i></div>
                    <div>
                        <span class="text-primary welcome-name-text">${title}</span>
                    </div>
                </div>
            </div>
        </div>`;
        html+=getClubsDataContent()
    return html;   
}

function getClubsDataContent(){
	var html=
	`<div class="main-card mb-3">
		<div class="mb-3 card border rounded-10">
            <div class="card-body">
				<div class="full">
                    <h4 class="font-weight-semi-bold text-dark text-center mb-3">Explore the clubs and activities</h4>
                    <div class="row" id="clubsRow"></div>
                </div>
            </div>
        </div>
	</div>`;
	return html;
}
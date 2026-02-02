function finalSlotConfirmationModal(){
    var html=
        `<div class="modal fade" id="finalSlotConfirmModal" tabindex="-1">
            <div class="modal-dialog" style="max-width: 500px;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirm Slots</h5>
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                    </div>

                    <div class="modal-body">
                        <p>
                            Are you sure you want to assign these slots?  
                            They cannot be changed before the validity expires.
                        </p>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="finalSlotNoBtn">
                            No
                        </button>
                        <button type="button" class="btn btn-primary" id="finalSlotYesBtn">
                            Yes
                        </button>
                    </div>
                </div>
            </div>
        </div>`
    return html;
}
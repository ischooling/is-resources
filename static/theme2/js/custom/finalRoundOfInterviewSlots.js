function renderFinalInterviewSlots(formId, finalSlots) {
    var parsedSlots = [];
    if (finalSlots && finalSlots.trim() !== "") {
        parsedSlots = finalSlots.split(",").map(slot => {
            const [date, time] = slot.trim().split(" ");
            return {
                date: date,
                time: time ? time.substring(0, 8) : ""
            };
        });
    }

    var html = `<label>Slots</label>`;

    for (let i = 0; i < FINAL_INTERVIEW_SLOTS_COUNT; i++) {

        let slotDate = "";
        let slotTime = "";

        if (parsedSlots[i]) {
            const istDate = convertDatetimeWithFormat(
                parsedSlots[i].date + " " + parsedSlots[i].time,
                "UTC",
                "Asia/Kolkata",
                DATE_UTC
            );

            slotTime = convertDatetimeWithFormat(
                parsedSlots[i].date + " " + parsedSlots[i].time,
                "UTC",
                "Asia/Kolkata",
                TIME_UTC
            );
            slotDate = moment(istDate, "YYYY-MM-DD").format("MMM DD, YYYY");
        }

        html += `
        <div class="form-row mb-3 slot-row" data-index="${i}">
            <div class="col-md-4">
                <input 
                    type="text"
                    class="form-control slot-date"
                    readonly
                    onkeydown="return false"
                    placeholder="Start Date for Slot ${i + 1}"
                    value="${slotDate}"
                    onchange="onSlotStartTimeChange(this);"
                />
            </div>

            <div class="col-md-4">
                <select 
                    class="form-control slot-start-time"
                    onchange="onSlotStartTimeChange(this);"
                >
                    ${generateTimeOptions(FINAL_INTERVIEW_SLOTS_INTERVAL, slotTime)}
                </select>
            </div>

            <div class="col-md-4">
                <input 
                    type="text"
                    class="form-control slot-end-time d-none"
                    readonly
                    placeholder="Auto (30 mins)" 
                />
            </div>
        </div>`;
    }

    $("#" + formId + " #finalInterviewSlotsWrapper").empty().append(html);
    $("#" + formId + " #finalInterviewSlotsWrapper").find(".slot-date").datepicker({
        format: "M dd, yyyy",
        autoclose: true,
        todayHighlight: true,
        startDate: new Date()
    });
}

function onSlotStartTimeChange(el) {
    const row = $(el).closest(".slot-row");

    const dateInput = row.find(".slot-date");
    const startSelect = row.find(".slot-start-time");
    const endInput = row.find(".slot-end-time");

    const dateVal = dateInput.val();
    const startMin = parseInt(startSelect.val());

    if (!dateVal) {
        showMessageTheme2(2, "Please select date first");
        startSelect.val("");
        endInput.val("").removeData("endMin");
        return;
    }

    if (isNaN(startMin)) {
        endInput.val("").removeData("endMin");
        return;
    }

    const endMin = startMin + 30;
    if (endMin > 1440) {
        showMessageTheme2(2, "Slot cannot exceed 11:30 PM");
        startSelect.val("");
        endInput.val("").removeData("endMin");
        return;
    }

    if (isExactStartConflict(row.data("index"), dateVal, startMin)) {
        showMessageTheme2(2, "This start time is already selected");
        startSelect.val("");
        endInput.val("").removeData("endMin");
        return;
    }
    endInput.val(minutesTo12Hr(endMin)).data("endMin", endMin);
}

function isExactStartConflict(currentIndex, date, startMin) {
    let conflict = false;
    $(".slot-row").each(function (i) {
        if (i === currentIndex) return;
        const row = $(this);
        const rowDate = row.find(".slot-date").val();
        const rowStart = parseInt(row.find(".slot-start-time").val());

        if (rowDate === date && rowStart === startMin) {
            conflict = true;
            return false;
        }
    });
    return conflict;
}

function buildFinalSlotArray(formId) {
    debugger;
    let slots = [];
    const totalSlots = $("#" + formId + " .slot-row").length;

    for (let i = 0; i < totalSlots; i++) {
        const row = $("#" + formId + " .slot-row").eq(i);

        const date = row.find(".slot-date").val();
        const startMin = parseInt(row.find(".slot-start-time").val());

        let endMin = row.find(".slot-end-time").data("endMin");

        if (!isNaN(startMin) && endMin === undefined) {
            endMin = startMin + 30;

            if (endMin > 1440) {
                showMessageTheme2(2, `Slot ${i + 1} cannot exceed 11:30 PM`);
                return false;
            }

            row.find(".slot-end-time").val(minutesTo12Hr(endMin)).data("endMin", endMin);
        }

        if (!date || isNaN(startMin) || endMin === undefined) {
            showMessageTheme2(2, `Please select date and time for slot ${i + 1}`);
            return false;
        }

        var slotDateSelected = changeDateFormat(new Date(date), "yyyy-mm-dd");
        var startTime24 = minutesTo24Hrs(startMin);
        var endTime24 = minutesTo24Hrs(endMin % 1440);

        var slotStartDate = convertDatetimeWithFormat(new Date(slotDateSelected + ' ' + startTime24), 'Asia/Kolkata', 'UTC', DATETIME_UTC_FORMATTER);
        var slotEndDate = convertDatetimeWithFormat(new Date(slotDateSelected + ' ' + endTime24), 'Asia/Kolkata', 'UTC', DATETIME_UTC_FORMATTER);

        slots.push({
            slotDate: slotStartDate.split(' ')[0],
            startTime: slotStartDate.split(' ')[1],
            slotEndDate: slotEndDate.split(' ')[0],
            endTime: slotEndDate.split(' ')[1]
        });
    }

    if (slots.length !== FINAL_INTERVIEW_SLOTS_COUNT) {
        showMessageTheme2(2, "Please select all required interview slots");
        return false;
    }

    return slots;
}

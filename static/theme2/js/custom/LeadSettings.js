



function saveCountryRightTime(righttimecallid, callType) {
	data={};
	data['schoolId']=SCHOOL_ID;
	data['userId']=USER_ID;
	data['righttimecallid']=righttimecallid;
	data['callType']=callType;
	data['countryId']=$("#countryId").val();;
	data['fromTime']=$(".fromTime").val();
	data['toTime']=$(".toTime").val();
	$.ajax({
			type : "POST",
			contentType : APPLICATION_JSON_VALUE,
			url : getURLForHTML('dashboard', 'save-country-righttime'),
			data : JSON.stringify(data),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			success : function(data) {
                if (data['status'] == '0' || data['status'] == '2') {
                    showMessageTheme2(0, data['message']);
                } else {
                    showMessageTheme2(1, data['message']);
					getCountryRightTimeList(OBJECT_RIGHTS);
                }
                
			}
	   });
   }

function getCountryRightTimeList(objectRights) {
	data={};
	data['schoolId']=SCHOOL_ID;
	data['userId']=USER_ID;
	$.ajax({
			type : "POST",
			contentType : APPLICATION_JSON_VALUE,
			url : getURLForHTML('dashboard', 'country-righttime-list'),
			data : JSON.stringify(data),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			success : function(data) {
				console.log(data)
                if (data['status'] == '0' || data['status'] == '2') {
                    showMessageTheme2(0, data['message']);
                } else {
                    //showMessageTheme2(1, data['message']);
					var html=getListOfCountryRightTimeCall(data.countryCallTimeList, objectRights);
					$("#countryRightCallList").html(html);

					$("#countryId").select2({
						theme:"bootstrap4",
						dropdownParent:"#country-time-list"
					});

					$(".fromTime").select2({
						theme:"bootstrap4",
						dropdownParent:"#country-time-list"
					});

					$(".toTime").select2({
						theme:"bootstrap4",
						dropdownParent:"#country-time-list"
					});

					callPCountries('country-time-list', 0, 'countryId',0);
					$("#country-time-list #countryId").val(0).trigger('change')
                }
                
			}
	   });
   }

   function getListOfCountryRightTimeCall(countryRightCallList, objectRights){
	var timeslotlist=objectRights.timeslotlist;
	var preStartTime=objectRights.leadRightTimeCall.split('-')[0];
	var preEndTime=objectRights.leadRightTimeCall.split('-')[1];
	var html=`<tr>
				<td>1</td>
				<td>
					<select name="countryId" id="countryId" class="form-control"></select>
				</td>
				<td>
					<div class="my-1 mx-0 row align-items-center justify-content-sm-start available-dropdown-Wrapper justify-content-around">
						<div class="flex-grow-1 flex-sm-grow-0">
							<select class="form-control font-12 fromTime">
								<option value="">Start Time</option>`;
								if(timeslotlist.length>0){
									for (let i = 0; i < timeslotlist.length; i++) {
										const timeopt = timeslotlist[i];
										var startTime=convertTo24Hour(timeopt);
										var strSelect = (preStartTime==startTime)?'selected':'';
										html+=`<option value="${startTime}" ${strSelect}>${timeopt}</option>`;
									}
								}
							html+=`</select>
						</div>-
						<div class="flex-grow-1 flex-sm-grow-0"> 
							<select class="form-control font-12 toTime">
								<option value="">End Time</option>`;
								if(timeslotlist.length>0){
									for (let i = 0; i < timeslotlist.length; i++) {
										const timeopt = timeslotlist[i];
										var startTime=convertTo24Hour(timeopt);
										var strSelect = (preEndTime==startTime)?'selected':'';
										html+=`<option value="${startTime}" ${strSelect}>${timeopt}</option>`;
									}
								}
							html+=`</select>
						</div>
					</div>
				</td>
				<td><a href="javascript:void(0)" class="btn btn-lg btn-outline-primary btn-sm mr-2 saveCountryTimeBtn" onclick="saveCountryRightTime();" style="line-height:0;"><i class="icon ion-android-add" style="font-size:15px;line-height:13px"></i><span class="d-md-none">&nbsp; Add</span></a></td>
			</tr>`;
			if(countryRightCallList.length>0){
				var i=2;
				for (let j = 0; j < countryRightCallList.length; j++) {
					const rightCall = countryRightCallList[j];
					html+=`<tr>
						<td>${i++}</td>
						<td class="text-center bold">${rightCall.countryName}</td>
						<td class="text-center bold">${rightCall.startCall} - ${rightCall.endCall}</td>
						<td><a href="javascript:void(0);" data-toggle="tooltip" data-placement="top" data-original-title="Discard" onclick="return showDeleteCountryRightTimeModelFunction('saveCountryRightTime(\\\'${rightCall.righttimecallid}\\\',\\\'delete\\\')','${rightCall.countryName}','${rightCall.startCall} - ${rightCall.endCall}')"><i class="fa fa-trash" aria-hidden="true" style="font-size:16px;margin-bottom:4px;padding:4px;"></i></a></td>
						</tr>`;
				}
			}
			
			return html;
   }

   function showDeleteCountryRightTimeModelFunction(functionName,countryName,rightTimeTocall) {
	functionName = "$('#discardCountryRightTime').modal('hide');" + functionName + ";";
	$("#discardLeadWarningYes").attr("onclick", functionName);
	$("#countryName").html(countryName);
	$("#rightTimeTocall").html(rightTimeTocall);
	$("#discardCountryRightTime").modal("show");
}


function updatePriority(priorityId) {
	data={};
	data['schoolId']=SCHOOL_ID;
	data['userId']=USER_ID;
	data['priorityId']=priorityId;
	data['minRange']=$("#minRange_"+priorityId).val();
	data['maxRange']=$("#maxRange_"+priorityId).val();
	data['leadCateUnit']=$("#leadCateUnit_"+priorityId).val();

	$.ajax({
			type : "POST",
			contentType : APPLICATION_JSON_VALUE,
			url : getURLForHTML('dashboard', 'save-lead-priority'),
			data : JSON.stringify(data),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			success : function(data) {
                if (data['status'] == '0' || data['status'] == '2') {
                    showMessageTheme2(0, data['message']);
                } else {
                    showMessageTheme2(1, data['message']);
					var priorityList = data.priorityList;
					html='';
					if(priorityList!=null && priorityList.length>0){
						var i=1;
						for (let k = 0; k < priorityList.length; k++) {
							const priority = priorityList[k];
							html+=`<tr>
									<td>${i++}</td>
									<td>${priority.priority}</td>
									<td><input type="text" class="form-control form-control-sm" name="minRange" id="minRange_${priority.priorityId}"  value="${priority.minRange}"/></td>
									<td><input type="text" class="form-control form-control-sm" name="maxRange" id="maxRange_${priority.priorityId}" value="${priority.maxRange}"/></td>
									<td>
										<select class="form-control form-control-sm" name="leadCateUnit" id="leadCateUnit_${priority.priorityId}">
											<option value="per" ${priority.rangeUnit=='per'?'selected':''}>%</option>
											<option value="price" ${priority.rangeUnit=='price'?'selected':''}>Price</option>
										</select>
									</td>
									<td><a href="javascript:void(0);" data-toggle="tooltip" data-placement="top" data-original-title="Discard" onclick="return updatePriority('${priority.priorityId}')">Update</a></td>
								</tr>`;
						}
						$("#priority-list").html(html);
					}
                }
			}
	   });
   }


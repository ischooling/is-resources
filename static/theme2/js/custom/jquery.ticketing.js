//ENVIRONMENT = 'dev';
TICKET_BASE_URL = '';
if (ENVIRONMENT == 'dev') {
	TICKET_BASE_URL = 'http://localhost:8127/service-ticketing/';
	TICKET_BASE_URL = 'http://164.52.216.248:8080/service-ticketing/';
}else if (ENVIRONMENT == 'uat') {
	TICKET_BASE_URL = 'http://164.52.198.42:8080/service-ticketing/';
}else if (ENVIRONMENT == 'uat2') {
	TICKET_BASE_URL = 'http://164.52.216.248:8080/service-ticketing/';
}else if (ENVIRONMENT == 'prod') {
	TICKET_BASE_URL = 'https://help.internationalschooling.org/';
} else {
	TICKET_BASE_URL = 'http://localhost:8127/service-ticketing/';
}
USER_ID_FOR_TICKET='';
VERNDOR_ID_FOR_TICKET='1';
function callIframeOption(elementId, iframeId){
	var selectVal = $('#'+elementId+' option:selected').val();
	if(selectVal==0){
		$('#'+iframeId).attr("src",'');
	}else{
		var params = $('#'+elementId+' option:selected').attr('encryptedPageId');	
		$('#'+iframeId).attr("src",TICKET_BASE_URL+"ticket/ticket-raise?params="+params);
	}
	return false;
}

function callForTicketPageCategory(pageType, elementId, lidiv) {
	hideMessage('');
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url	:(TICKET_BASE_URL+'api/auth/pageCategoryByVendorId?vendorId='+VERNDOR_ID_FOR_TICKET+'&uuid='+SCHOOL_UUID),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		global : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				if(pageType=='internal'){
					var indexPosition=1;
					var html='';
					$.each(data['pageListByVendorId'], function(k, v) {
						html+='<li id="sub-li-id-'+indexPosition+'" class="nav-item"><a href="javascript:void(\'0\');" class="nav-link m-0" onclick="return renderIframe(\''+v.encryptedPageId+'\',\''+SCHOOL_UUID+'\');"> <span>'+v.pageName+'</span></a></li>';
						indexPosition++;
					});
					$('#'+elementId).html(html);
				} else if(pageType=='external'){
					$('#'+elementId).html('');
					$('#'+elementId).append('<option value="0">Please select</option>');
					$.each(data['pageListByVendorId'], function(k, v) {
						$('#'+elementId).append('<option value="' + v.ticketType + '" encryptedPageId="'+v.encryptedPageId+'">' + v.pageName + '</option>');
					});
				}
			}
			return false;
		},
		error : function(e) {
			if (checkonlineOfflineStatus()) {
				return;
			}else{
				showMessage(true, SERVICE_UNAVAILABLE);
				return false;
			}
		}
	});
}
function showRaisedTicketByUser(src){
	$('#iframeIdByLinks').hide();
	$('#rasisedTicketsDiv').show();
	callForDashboardData('formIdIfAny','ticket-raised-listing?themeType=theme2');
	$(src).addClass('active');
	
}
function renderIframe(params, uuid){
	$('#iframeIdByLinks').show();
	$('#rasisedTicketsDiv').hide();
	$('#iframeIdByLinks').attr('src',TICKET_BASE_URL+'ticket/ticket-raise?params='+params+'&userId='+USER_ID_FOR_TICKET+'&isDemo=false&uuid='+uuid);
}
function callForTicketList(elementId) {
	hideMessage('');
	$.ajax({
		type : "GET",
		contentType : "application/json",
		url	:(TICKET_BASE_URL+'api/auth/ticketListing?userId='+USER_ID_FOR_TICKET+'&vendorId='+VERNDOR_ID_FOR_TICKET+'&uuId='+SCHOOL_UUID),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				var html='';
				var indexPosition=1;
				$('#'+elementId).html('');
				$.each(data['ticketListDetailDTO'], function(k, v) {
					html+='<tr>'+
						'<td style="text-align:center;">'+indexPosition+'</td>'+
							'<td>'+v.pageName+'</td>'+
							'<td>'+v.refrenceNo+'</td>'+
							'<td>'+v.creadetDate+'</td>'+
							'<td class="text-center">'+
							'<a onclick="callForDashboardData(\'formIdIfAny\',\'ticket-raised-user-info?ticketId='+v.ticketId+'\', \'tickerRaiseInfoDiv\')" href="javascript:void(0);"  class="btn btn-outline-primary pr-4 pl-4">'+
									'<i class="fa fa-eye"></i>'+ " " + "view" +
							'</a>'+
						'</td>'+
					'</tr>';
					indexPosition++;
				});
				$('#'+elementId).html(html);
				$('#ticketListTable').DataTable({
					responsive: true,
			        scrollY: "330px"
				}); 
				/*$('.dt-responsive tbody tr td:first-child').addClass('dtr-control');*/
			}
			return false;
		},
		error : function(e) {
			//showMessage(true, SERVICE_UNAVAILABLE);
			return false;
		}
	});
}
function getRequestForTicketDetailsRequest(ticketId){
	var TicketListInfoRequest = {};
	TicketListInfoRequest['ticketId'] = ticketId;
	return TicketListInfoRequest;
}
function callForTicketViewDetails(ticketId, elementId) {
	hideMessage('');
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url	:TICKET_BASE_URL+'api/auth/ticketUserListInfo',
		data : JSON.stringify(getRequestForTicketDetailsRequest(ticketId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				$('#ticketStatusForm #ticketId').val(ticketId);
				var fieldDetailsHTML='';
				$.each(data['ticketDetailsListDTO']['ticketDetailsListContentDTO'], function(k, v) {
					if(v.columnValue!=null){
						if( v.columnValue.endsWith('.pdf')){
							var styles=((v.columnValue!=null && v.columnValue1!="")?"block":"none");
							fieldDetailsHTML+='<div class="col-6">'+
								'<p class="view-label">'+v.columnName+':'+
									'<a class="view stu-view" href="'+data['ticketDetailsListDTO']['uploadPath']+v.columnValue+'" '+
										'target="_blank" style="display:'+styles+';position: absolute;top: -5px;left: 130px;background-color:#fff !important;color:green !important" '+
										'data-toggle="tooltip" title="View">'+
									'<i class="fa fa-eye"></i></a> '+
								'</p>'+	
							'</div>';
						}else if(v.columnValue.endsWith('.jpg') 
								|| v.columnValue.endsWith('.JPEG')
								|| v.columnValue.endsWith('.JPE')
								|| v.columnValue.endsWith('.jpeg')
								|| v.columnValue.endsWith('.png') 
								|| v.columnValue.endsWith('PNG')
								|| v.columnValue.endsWith('.gif')
								|| v.columnValue.endsWith('.GIF')){
							var styles=((v.columnValue!=null && v.columnValue1!="")?"block":"none");
							fieldDetailsHTML+='<div class="col-6">'+
								'<p class="view-label">'+v.columnName+':'+
									'<a class="view stu-view" '+
										'href="javascript:showDocument(\''+data['ticketDetailsListDTO']['uploadPath']+v.columnValue+'\');" '+
										'target="_self" style="display:'+styles+';position: absolute;top: -5px;left: 130px;background-color:#fff !important;color:green !important" '+
										'data-toggle="tooltip" title="View"><i class="fa fa-eye"></i></a>'+
								'</p>'+
							'</div>';
						}else{
							fieldDetailsHTML+='<div class="col-6">'+
								'<p class="view-label">'+v.columnName+':'+
									'<span class="view-data">'+v.columnValue+'</span>'+
								'</p>'+
							'</div>'
						}
					}
				});
				fieldDetailsHTML+='<div class="col-6">'+
						'<p class="view-label">'+
							'Current Status: <span class="view-data" id="ticketStatus">'+data['ticketDetailsListDTO']['status']+'</span>'+
						'</p>'+
					'</div>';
				$('#fieldDetails').html(fieldDetailsHTML);
				var indexPosition=1;
				$.each(data['ticketInfoStatusLogDTO'], function(k, v) {
					var tableHTML='<tr>'+
						'<td style="text-align:center;">'+indexPosition+'</td>'+
						'<td>'+v.status+'</td>'+
						'<td>'+v.comments+'</td>'+
						'<td>'+v.createdDate+'</td>'+
						'<td>'+v.updatedDate+'</td>'+
					'</tr>';
					indexPosition++;
					$('#ticketInfoLogs').append(tableHTML);
				})
				
				$('#ticketRaiseLogDetails').DataTable();
				$('#ticketStatusModel').modal('show');
			}
			return false;
		},
		error : function(e) {
		    //showMessage(true, e.responseText);
			return false;
		}
	});
}
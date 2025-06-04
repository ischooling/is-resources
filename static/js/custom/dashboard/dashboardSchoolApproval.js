 function callSchoolRemarksModel(userId){
	$('#schoolApprovalId #schoolRemarksStatus').val('0');
	$('#schoolApprovalId #schoolRemarks').val('');
	$('#schoolApprovalModal').modal('show');
	$('#userId').val(userId);
}
 
	function showSchoolProfileReqContentListingWithQueries(elementId, argument){
		$('#'+elementId).DataTable( {
			stateSave: true,
	        "processing": true,
	        "serverSide": true,
	        "searching": true,
	        "pageLength": 10,
	        "ajax": {
	            "url": CONTEXT_PATH+UNIQUEUUID+"/"+"dashboard/school-profile-request-content-1"+argument,
	            "data": function ( data ) {
	            	//console.log('data '+data)
	            }
	        },
	        "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
	        	/* if (aData['paymentTypeApplicationFee'] || aData['parentProfile'] || aData['viewProfile']){
	        		$('td', nRow).css('text-align','center');
	        	} */
	        	$('tr:first').addClass('success');
	        },
	        "columns": [
		         { "data": "sno", "name" : "sno", "title" : "S.No"  },
		         { "data": "schoolName", "name" : "schoolName" , "title" : "School Name"},
		         { "data": "userName", "name" : "userName" , "title" : "User name"},
		         { "data": "action", "name" : "action" , "title" : "Action"},
		         { "data": "profileView", "name" : "profileView" , "title" : "View Details"},
	         ],
	         drawCallback: function() {
	        	    this.api().state.clear();
	        	  }
		});
		$('#'+elementId).dataTable().fnSetFilteringEnterPress();
	}
	function showSchoolSignedContractContentListingWithQueries(elementId, argument){
		
		$('#'+elementId).DataTable( {
			stateSave: true,
	        "processing": true,
	        "serverSide": true,
	        "searching": true,
	        "pageLength": 10,
	        "ajax": {
	            "url": CONTEXT_PATH+UNIQUEUUID+"/"+"dashboard/school-signedContract-request-content-1"+argument,
	            "data": function ( data ) {
	            	//console.log('data '+data)
	            }
	        },
	        "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
	        	/* if (aData['paymentTypeApplicationFee'] || aData['parentProfile'] || aData['viewProfile']){
	        		$('td', nRow).css('text-align','center');
	        	} */
	        	$('tr:first').addClass('success');
	        },
	        "columns": [
		         { "data": "sno", "name" : "sno", "title" : "S.No"  },
		         { "data": "schoolName", "name" : "schoolName" , "title" : "School Name"},
		         { "data": "userName", "name" : "userName" , "title" : "User Name"},
		         { "data": "action", "name" : "action" , "title" : "View Contract"},
		         
	         ],
	         drawCallback: function() {
	        	    this.api().state.clear();
	        	  }
		});
		$('#'+elementId).dataTable().fnSetFilteringEnterPress();
	}
	function showSchoolRejectedContentListingWithQueries(elementId, argument){
		$('#'+elementId).DataTable( {
			stateSave: true,
	        "processing": true,
	        "serverSide": true,
	        "searching": true,
	        "pageLength": 10,
	        "ajax": {
	            "url": CONTEXT_PATH+UNIQUEUUID+"/"+"dashboard/rejected-school-profile-content-1"+argument,
	            "data": function ( data ) {
	            	//console.log('data '+data)
	            }
	        },
	        "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
	        	/* if (aData['paymentTypeApplicationFee'] || aData['parentProfile'] || aData['viewProfile']){
	        		$('td', nRow).css('text-align','center');
	        	} */
	        	$('tr').addClass('success');
	        },
	        "columns": [
		         { "data": "sno", "name" : "sno", "title" : "S.No"  },
		         { "data": "schoolName", "name" : "schoolName" , "title" : "School Name"},
		         { "data": "userName", "name" : "userName" , "title" : "User Name"},
		         { "data": "action", "name" : "action" , "title" : "Action"},
		         { "data": "activityLog", "name" : "activityLog" , "title" : "Activity Log"},
		         { "data": "profileView", "name" : "profileView" , "title" : "View Details"},
	         ],
	         drawCallback: function() {
	        	    this.api().state.clear();
	        	  }
		});
		$('#'+elementId).dataTable().fnSetFilteringEnterPress();
	}
	
    function updateRemarks(){
    	if (!validateCharacters($('#remarks').val())) {
    		showMessage(false, 'Please use the English Keyboard while providing information');
    		return false
    		}

        
    	if($('#remarksStatus').val()==undefined || $('#remarks').val()=='' || $('#userId').val()==''){
    		showMessage(false, 'Remarks is required.');      
    		return false;
		   }
		   var remarks=escapeCharacters($('#remarks').val());
		   var userId=$('#userId').val();
		  console.log('userId: '+userId);
		   var meetingId=$('#meetingId').val();
		   if($('#profileApprovalId #remarksStatus').val()==1){
			   callCommonAction('','approve-school-request','dashboard','approve&'+remarks,userId);
		   }else{
			   callCommonAction('','approve-school-request','dashboard','decline&'+remarks,userId);
		   }
		   $('#profileApprovalModal').modal('hide');
		   setTimeout(function(){ callDashboardPageSchool(roleModuleId,'approved-teachers'); }, 1000);
		   
    }
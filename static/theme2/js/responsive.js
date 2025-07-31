$(document).ready(function(){
	var window_width = $(window).outerWidth();
	$('.mobile-toggle-header-nav').click(function(){
//		$('html').addClass('nav-open')
		$('#divhtml').addClass('header-mobile-open');	
	});
	if($(window).width() < 991){
		$('.dropdown-toggle.profile-pic').click().promise().done(function(){
			$(this).parent().removeClass('open');
		});
	}
	$('#cssmenu ul li a').click(function(){
		if(window_width < 992){	
			if(!$(this).parent().hasClass('has-sub')){
				$('.close-layer').trigger('click');
			}
			else{
				return false;
			}
		}
		else{
			return false;
		}
	});
	$('#divhtml .navbar-nav .nav-item ul.dropdown-menu li a').click(function(){
		$('#divhtml').removeClass('header-mobile-open');
	});
});


$(document).mouseup(function(e){
	var container = $("#divhtml");
	
	// if the target of the click isn't the container nor a descendant of the container
	    if (!container.is(e.target) && container.has(e.target).length === 0){
	        container.removeClass('header-mobile-open');	
	    }
});
/*$('td a').click(function(){
	alert('saf')
	$('html,body').animate({
        scrollTop: $("#unenrolledUsersDetailsList").offset().top
      },'slow');
});
*/
$(document).click(function(){
	setTimeout(function(){ 
		if($('.modal').hasClass('show')){
			$($.fn.dataTable.tables(true)).DataTable()
		       .columns.adjust()
		       .responsive.recalc();
		}
	}, 1500);
	
});
/*$(document).ready(function(){
	$("ul li a").click(function(){
		setTimeout(function(){ 
			$($.fn.dataTable.tables(true)).DataTable()
		       .columns.adjust()
		       .responsive.recalc();
		}, 1500);
		
	});
});*/

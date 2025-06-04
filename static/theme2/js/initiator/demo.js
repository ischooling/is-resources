$(document).ready(() => {
    $('.close-sidebar-btn').click(function () {
    	$('.student-grievience').hide();
        var classToSwitch = $(this).attr('data-class');
        var containerElement = '.app-container';
        $(containerElement).toggleClass(classToSwitch);

        var closeBtn = $(this);

        if (closeBtn.hasClass('is-active')) {
            closeBtn.removeClass('is-active');
            $('.student-grievience').show();
        } else {
            closeBtn.addClass('is-active');
        }
    });
    $('a[data-toggle="tab"]').on('shown.bs.tab', function(e){
               
        $($.fn.dataTable.tables(true)).DataTable()
          .columns.adjust()
          .responsive.recalc();  
        $("table.dataTable thead>tr>th:nth-child(1)").trigger('click');
        $("table.dataTable thead>tr>th:nth-child(1)").trigger('click');    
    });
});
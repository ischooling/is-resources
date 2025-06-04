          var elementaryList = $(".elementary_list").select2({
            placeholder: "Select Course",
            allowClear: true,
            minimumResultsForSearch: -1,
             // maximumSelectionLength: 5,
            // closeOnSelect: false,
            // selectOnClose:false,
             // initSelection: function(element, callback) { }
            dropdownParent: $('#elementary_course_listC')
             
          }).change(function(){
            var selected_mail_id = $('<li/>').append($('#elementaryC .select2-selection__choice').clone()).html();
            $('.kindergarten_selected_course').html(selected_mail_id).promise().done(function(){
              var selected_course_wrapper_length = $('.selected_courses li .course-category-wrapper > ul li').length;
              var selected_course_length = $('.kindergarten_selected_course  .select2-selection__choice').length;
                if(selected_course_length > 0){
                  $('.selected_course_containter').show();
                  $('.kindergarten_selected_course').parent().closest('li').show();
                }
                else if(selected_course_wrapper_length < 1){
                  $('.selected_course_containter').hide();
                  $('.kindergarten_selected_course').parent().closest('li').hide();
                }
                else{
                  $('.kindergarten_selected_course').parent().closest('li').hide();
                }
              
            });
           }).on("select2:closing", function(e){
              e.preventDefault();
            }).on("select2:closed", function(e){
              elementaryList.select2("open");
            });
            elementaryList.select2("open");


        var elementaryList = $(".grade_1_list").select2({
            placeholder: "Select Course",
             // maximumSelectionLength: 5,
            // closeOnSelect: false,
            // selectOnClose:false,
             // initSelection: function(element, callback) { }
            dropdownParent: $('#grade_1_listC')
             
          }).change(function(){
            var selected_mail_id = $('<li/>').append($('#elementaryC .select2-selection__choice').clone()).html();
            $('.selected_course_containter').show();
            $('.kindergarten_selected_course').parent().closest('li').show();
            $('.kindergarten_selected_course').html(selected_mail_id).promise().done(function(){
              var selected_course_wrapper_length = $('.selected_courses li .course-category-wrapper > ul li').length;
              var selected_course_length = $('.kindergarten_selected_course  .select2-selection__choice').length;
              if(selected_course_length > 0){
                  $('.selected_course_containter').show();
                  $('.kindergarten_selected_course').parent().closest('li').show();
                }
                else if(selected_course_wrapper_length < 1){
                  $('.selected_course_containter').hide();
                  $('.kindergarten_selected_course').parent().closest('li').hide();
                  
                }
                else{
                  $('.kindergarten_selected_course').parent().closest('li').hide();
                }
            });
    
          }).on("select2:closing", function(e) {
              e.preventDefault();
            }).on("select2:closed", function(e) {
              elementaryList.select2("open");
            });
            elementaryList.select2("open"); 

        
        var elementaryList = $(".grade_2_list").select2({
            placeholder: "Select Course",
             // maximumSelectionLength: 5,
            // closeOnSelect: false,
            // selectOnClose:false,
             // initSelection: function(element, callback) { }
            dropdownParent: $('#grade_2_listC')
             
          }).change(function(){
            var selected_mail_id = $('<li/>').append($('#elementaryC .select2-selection__choice').clone()).html();
            $('.selected_course_containter').show();
            $('.kindergarten_selected_course').parent().closest('li').show();
            $('.kindergarten_selected_course').html(selected_mail_id).promise().done(function(){
              var selected_course_wrapper_length = $('.selected_courses li .course-category-wrapper > ul li').length;
              var selected_course_length = $('.kindergarten_selected_course  .select2-selection__choice').length;
              if(selected_course_length > 0){
                  $('.selected_course_containter').show();
                  $('.kindergarten_selected_course').parent().closest('li').show();
                }
                else if(selected_course_wrapper_length < 1){
                  $('.selected_course_containter').hide();
                  $('.kindergarten_selected_course').parent().closest('li').hide();
                  
                }
                else{
                  $('.kindergarten_selected_course').parent().closest('li').hide();
                }
            });
          }).on("select2:closing", function(e) {
              e.preventDefault();
            }).on("select2:closed", function(e) {
              elementaryList.select2("open");
            });
            elementaryList.select2("open"); 


        var elementaryList = $(".grade_3_list").select2({
            placeholder: "Select Course",
             // maximumSelectionLength: 5,
            // closeOnSelect: false,
            // selectOnClose:false,
             // initSelection: function(element, callback) { }
            dropdownParent: $('#grade_3_listC')
             
          }).change(function(){
            var selected_mail_id = $('<li/>').append($('#elementaryC .select2-selection__choice').clone()).html();
            $('.selected_course_containter').show();
            $('.kindergarten_selected_course').parent().closest('li').show();
            $('.kindergarten_selected_course').html(selected_mail_id).promise().done(function(){
              var selected_course_wrapper_length = $('.selected_courses li .course-category-wrapper > ul li').length;
              var selected_course_length = $('.kindergarten_selected_course  .select2-selection__choice').length;
              if(selected_course_length > 0){
                  $('.selected_course_containter').show();
                  $('.kindergarten_selected_course').parent().closest('li').show();
                }
                else if(selected_course_wrapper_length < 1){
                  $('.selected_course_containter').hide();
                  $('.kindergarten_selected_course').parent().closest('li').hide();
                  
                }
                else{
                  $('.kindergarten_selected_course').parent().closest('li').hide();
                }
            });
          }).on("select2:closing", function(e) {
              e.preventDefault();
            }).on("select2:closed", function(e) {
              elementaryList.select2("open");
            });
            elementaryList.select2("open"); 
            


        var elementaryList = $(".grade_4_list").select2({
            placeholder: "Select Course",
             // maximumSelectionLength: 5,
            // closeOnSelect: false,
            // selectOnClose:false,
             // initSelection: function(element, callback) { }
            dropdownParent: $('#grade_4_listC')
             
          }).change(function(){
            var selected_mail_id = $('<li/>').append($('#elementaryC .select2-selection__choice').clone()).html();
            $('.selected_course_containter').show();
            $('.kindergarten_selected_course').parent().closest('li').show();
            $('.kindergarten_selected_course').html(selected_mail_id).promise().done(function(){
              var selected_course_wrapper_length = $('.selected_courses li .course-category-wrapper > ul li').length;
              var selected_course_length = $('.kindergarten_selected_course  .select2-selection__choice').length;
              if(selected_course_length > 0){
                  $('.selected_course_containter').show();
                  $('.kindergarten_selected_course').parent().closest('li').show();
                }
                else if(selected_course_wrapper_length < 1){
                  $('.selected_course_containter').hide();
                  $('.kindergarten_selected_course').parent().closest('li').hide();
                  
                }
                else{
                  $('.kindergarten_selected_course').parent().closest('li').hide();
                }
            });
          }).on("select2:closing", function(e) {
              e.preventDefault();
            }).on("select2:closed", function(e) {
              elementaryList.select2("open");
            });
            elementaryList.select2("open"); 
            



        var elementaryList = $(".grade_5_list").select2({
            placeholder: "Select Course",
             // maximumSelectionLength: 5,
            // closeOnSelect: false,
            // selectOnClose:false,
             // initSelection: function(element, callback) { }
            dropdownParent: $('#grade_5_listC')
             
          }).change(function(){
            var selected_mail_id = $('<li/>').append($('#elementaryC .select2-selection__choice').clone()).html();
            $('.selected_course_containter').show();
            $('.kindergarten_selected_course').parent().closest('li').show();
            $('.kindergarten_selected_course').html(selected_mail_id).promise().done(function(){
              var selected_course_wrapper_length = $('.selected_courses li .course-category-wrapper > ul li').length;
              var selected_course_length = $('.kindergarten_selected_course  .select2-selection__choice').length;
              if(selected_course_length > 0){
                  $('.selected_course_containter').show();
                  $('.kindergarten_selected_course').parent().closest('li').show();
                }
                else if(selected_course_wrapper_length < 1){
                  $('.selected_course_containter').hide();
                  $('.kindergarten_selected_course').parent().closest('li').hide();
                  
                }
                else{
                  $('.kindergarten_selected_course').parent().closest('li').hide();
                }
            });
          }).on("select2:closing", function(e) {
              e.preventDefault();
            }).on("select2:closed", function(e) {
              elementaryList.select2("open");
            });
            elementaryList.select2("open"); 



        //------------------------------------------------------------ Middel School Dropdown ---------------------------------- //


        var elementaryList = $(".middle-eng-art-list").select2({
            placeholder: "Select Course",
             // maximumSelectionLength: 5,
            // closeOnSelect: false,
            // selectOnClose:false,
             // initSelection: function(element, callback) { }
            dropdownParent: $('#middle-eng-artC')
             
          }).change(function(){
            var selected_mail_id = $('<li/>').append($('#middle_schoolC .select2-selection__choice').clone()).html();
            $('.selected_course_containter').show();
            $('.middle_selected_course').parent().closest('li').show();
            $('.middle_selected_course').html(selected_mail_id).promise().done(function(){
              var selected_course_wrapper_length = $('.selected_courses li .course-category-wrapper > ul li').length;
              var selected_course_length = $('.middle_selected_course  .select2-selection__choice').length;
              if(selected_course_length > 0){
                  $('.selected_course_containter').show();
                  $('.middle_selected_course').parent().closest('li').show();
                }
                else if(selected_course_wrapper_length < 1){
                  $('.selected_course_containter').hide();
                  $('.middle_selected_course').parent().closest('li').hide();
                  
                }
                else{
                  $('.middle_selected_course').parent().closest('li').hide();
                }
            })
          }).on("select2:closing", function(e) {
              e.preventDefault();
            }).on("select2:closed", function(e) {
              elementaryList.select2("open");
            });
            elementaryList.select2("open");


        var elementaryList = $(".middle-math-list").select2({
            placeholder: "Select Course",
             // maximumSelectionLength: 5,
            // closeOnSelect: false,
            // selectOnClose:false,
             // initSelection: function(element, callback) { }
            dropdownParent: $('#middle-mathC')
             
          }).change(function(){
            var selected_mail_id = $('<li/>').append($('#middle_schoolC .select2-selection__choice').clone()).html();
            $('.selected_course_containter').show();
            $('.middle_selected_course').parent().closest('li').show();
            $('.middle_selected_course').html(selected_mail_id).promise().done(function(){
              var selected_course_wrapper_length = $('.selected_courses li .course-category-wrapper > ul li').length;
              var selected_course_length = $('.middle_selected_course  .select2-selection__choice').length;
              if(selected_course_length > 0){
                  $('.selected_course_containter').show();
                  $('.middle_selected_course').parent().closest('li').show();
                }
                else if(selected_course_wrapper_length < 1){
                  $('.selected_course_containter').hide();
                  $('.middle_selected_course').parent().closest('li').hide();
                  
                }
                else{
                  $('.middle_selected_course').parent().closest('li').hide();
                }
            });
          }).on("select2:closing", function(e) {
              e.preventDefault();
            }).on("select2:closed", function(e) {
              elementaryList.select2("open");
            });
            elementaryList.select2("open"); 

        
        var elementaryList = $(".middle-science-list").select2({
            placeholder: "Select Course",
             // maximumSelectionLength: 5,
            // closeOnSelect: false,
            // selectOnClose:false,
             // initSelection: function(element, callback) { }
            dropdownParent: $('#middle-scienceC')
             
          }).change(function(){
            var selected_mail_id = $('<li/>').append($('#middle_schoolC .select2-selection__choice').clone()).html();
            $('.selected_course_containter').show();
            $('.middle_selected_course').parent().closest('li').show();
            $('.middle_selected_course').html(selected_mail_id).promise().done(function(){
              var selected_course_wrapper_length = $('.selected_courses li .course-category-wrapper > ul li').length;
              var selected_course_length = $('.middle_selected_course  .select2-selection__choice').length;
              if(selected_course_length > 0){
                  $('.selected_course_containter').show();
                  $('.middle_selected_course').parent().closest('li').show();
                }
                else if(selected_course_wrapper_length < 1){
                  $('.selected_course_containter').hide();
                  $('.middle_selected_course').parent().closest('li').hide();
                  
                }
                else{
                  $('.middle_selected_course').parent().closest('li').hide();
                }
            });
          }).on("select2:closing", function(e) {
              e.preventDefault();
            }).on("select2:closed", function(e) {
              elementaryList.select2("open");
            });
            elementaryList.select2("open"); 


        var elementaryList = $(".middle-ss-list").select2({
            placeholder: "Select Course",
             // maximumSelectionLength: 5,
            // closeOnSelect: false,
            // selectOnClose:false,
             // initSelection: function(element, callback) { }
            dropdownParent: $('#middle-ssC')
             
          }).change(function(){
            var selected_mail_id = $('<li/>').append($('#middle_schoolC .select2-selection__choice').clone()).html();
            $('.selected_course_containter').show();
            $('.middle_selected_course').parent().closest('li').show();
            $('.middle_selected_course').html(selected_mail_id).promise().done(function(){
              var selected_course_wrapper_length = $('.selected_courses li .course-category-wrapper > ul li').length;
              var selected_course_length = $('.middle_selected_course  .select2-selection__choice').length;
              if(selected_course_length > 0){
                  $('.selected_course_containter').show();
                  $('.middle_selected_course').parent().closest('li').show();
                }
                else if(selected_course_wrapper_length < 1){
                  $('.selected_course_containter').hide();
                  $('.middle_selected_course').parent().closest('li').hide();
                  
                }
                else{
                  $('.middle_selected_course').parent().closest('li').hide();
                }
            });
          }).on("select2:closing", function(e) {
              e.preventDefault();
            }).on("select2:closed", function(e) {
              elementaryList.select2("open");
            });
            elementaryList.select2("open"); 
            


        var elementaryList = $(".middgle-health-edu-list").select2({
            placeholder: "Select Course",
             // maximumSelectionLength: 5,
            // closeOnSelect: false,
            // selectOnClose:false,
             // initSelection: function(element, callback) { }
            dropdownParent: $('#middgle-health-eduC')
             
          }).change(function(){
            var selected_mail_id = $('<li/>').append($('#middle_schoolC .select2-selection__choice').clone()).html();
            $('.selected_course_containter').show();
            $('.middle_selected_course').parent().closest('li').show();
            $('.middle_selected_course').html(selected_mail_id).promise().done(function(){
              var selected_course_wrapper_length = $('.selected_courses li .course-category-wrapper > ul li').length;
              var selected_course_length = $('.middle_selected_course  .select2-selection__choice').length;
              if(selected_course_length > 0){
                  $('.selected_course_containter').show();
                  $('.middle_selected_course').parent().closest('li').show();
                }
                else if(selected_course_wrapper_length < 1){
                  $('.selected_course_containter').hide();
                  $('.middle_selected_course').parent().closest('li').hide();
                  
                }
                else{
                  $('.middle_selected_course').parent().closest('li').hide();
                }
            });
          }).on("select2:closing", function(e) {
              e.preventDefault();
            }).on("select2:closed", function(e) {
              elementaryList.select2("open");
            });
            elementaryList.select2("open"); 
            



        var elementaryList = $(".middle-wl-list").select2({
            placeholder: "Select Course",
             // maximumSelectionLength: 5,
            // closeOnSelect: false,
            // selectOnClose:false,
             // initSelection: function(element, callback) { }
            dropdownParent: $('#middle-wlC')
             
          }).change(function(){
            var selected_mail_id = $('<li/>').append($('#middle_schoolC .select2-selection__choice').clone()).html();
            $('.selected_course_containter').show();
            $('.middle_selected_course').parent().closest('li').show();
            $('.middle_selected_course').html(selected_mail_id).promise().done(function(){
              var selected_course_wrapper_length = $('.selected_courses li .course-category-wrapper > ul li').length;
              var selected_course_length = $('.middle_selected_course  .select2-selection__choice').length;
              if(selected_course_length > 0){
                  $('.selected_course_containter').show();
                  $('.middle_selected_course').parent().closest('li').show();
                }
                else if(selected_course_wrapper_length < 1){
                  $('.selected_course_containter').hide();
                  $('.middle_selected_course').parent().closest('li').hide();
                  
                }
                else{
                  $('.middle_selected_course').parent().closest('li').hide();
                }
            });
          }).on("select2:closing", function(e) {
              e.preventDefault();
            }).on("select2:closed", function(e) {
              elementaryList.select2("open");
            });
            elementaryList.select2("open"); 



        var elementaryList = $(".middle-electives-list  ").select2({
            placeholder: "Select Course",
             // maximumSelectionLength: 5,
            // closeOnSelect: false,
            // selectOnClose:false,
             // initSelection: function(element, callback) { }
            dropdownParent: $('#middle-electivesC')
             
          }).change(function(){
            var selected_mail_id = $('<li/>').append($('#middle_schoolC .select2-selection__choice').clone()).html();
            $('.selected_course_containter').show();
            $('.middle_selected_course').parent().closest('li').show();
            $('.middle_selected_course').html(selected_mail_id).promise().done(function(){
              var selected_course_wrapper_length = $('.selected_courses li .course-category-wrapper > ul li').length;
              var selected_course_length = $('.middle_selected_course  .select2-selection__choice').length;
              if(selected_course_length > 0){
                  $('.selected_course_containter').show();
                  $('.middle_selected_course').parent().closest('li').show();
                }
                else if(selected_course_wrapper_length < 1){
                  $('.selected_course_containter').hide();
                  $('.middle_selected_course').parent().closest('li').hide();
                  
                }
                else{
                  $('.middle_selected_course').parent().closest('li').hide();
                }
            });
          }).on("select2:closing", function(e) {
              e.preventDefault();
            }).on("select2:closed", function(e) {
              elementaryList.select2("open");
            });
            elementaryList.select2("open");  





 //------------------------------------------------------------ High School Dropdown ---------------------------------- //


        var elementaryList = $(".high-school-eng-list").select2({
            placeholder: "Select Course",
             // maximumSelectionLength: 5,
            // closeOnSelect: false,
            // selectOnClose:false,
             // initSelection: function(element, callback) { }
            dropdownParent: $('#high-school-engC')
             
          }).change(function(){
            var selected_mail_id = $('<li/>').append($('#high_schoolC .select2-selection__choice').clone()).html();
            $('.selected_course_containter').show();
            $('.high_selected_course').parent().closest('li').show();
            $('.high_selected_course').html(selected_mail_id).promise().done(function(){
              var selected_course_wrapper_length = $('.selected_courses li .course-category-wrapper > ul li').length;
              var selected_course_length = $('.high_selected_course  .select2-selection__choice').length;
                if(selected_course_length > 0){
                  $('.selected_course_containter').show();
                  $('.high_selected_course').parent().closest('li').show();
                }
                else if(selected_course_wrapper_length < 1){
                  $('.selected_course_containter').hide();
                  $('.high_selected_course').parent().closest('li').hide();
                  
                }
                else{
                  $('.high_selected_course').parent().closest('li').hide();
                }

            });
          }).on("select2:closing", function(e) {
              e.preventDefault();
            }).on("select2:closed", function(e) {
              elementaryList.select2("open");
            });
            elementaryList.select2("open");


        var elementaryList = $(".high-school-math-list").select2({
            placeholder: "Select Course",
             // maximumSelectionLength: 5,
            // closeOnSelect: false,
            // selectOnClose:false,
             // initSelection: function(element, callback) { }
            dropdownParent: $('#high-school-mathC')
             
          }).change(function(){
            var selected_mail_id = $('<li/>').append($('#high_schoolC .select2-selection__choice').clone()).html();
            $('.selected_course_containter').show();
            $('.high_selected_course').parent().closest('li').show();
            $('.high_selected_course').html(selected_mail_id).promise().done(function(){
              var selected_course_wrapper_length = $('.selected_courses li .course-category-wrapper > ul li').length;
              var selected_course_length = $('.high_selected_course  .select2-selection__choice').length;
              if(selected_course_length > 0){
                  $('.selected_course_containter').show();
                  $('.high_selected_course').parent().closest('li').show();
                }
                else if(selected_course_wrapper_length < 1){
                  $('.selected_course_containter').hide();
                  $('.high_selected_course').parent().closest('li').hide();
                  
                }
                else{
                  $('.high_selected_course').parent().closest('li').hide();
                }
            });
          }).on("select2:closing", function(e) {
              e.preventDefault();
            }).on("select2:closed", function(e) {
              elementaryList.select2("open");
            });
            elementaryList.select2("open"); 

        
        var elementaryList = $(".high-school-science-list").select2({
            placeholder: "Select Course",
             // maximumSelectionLength: 5,
            // closeOnSelect: false,
            // selectOnClose:false,
             // initSelection: function(element, callback) { }
            dropdownParent: $('#high-school-scienceC')
             
          }).change(function(){
            var selected_mail_id = $('<li/>').append($('#high_schoolC .select2-selection__choice').clone()).html();
            $('.selected_course_containter').show();
            $('.high_selected_course').parent().closest('li').show();
            $('.high_selected_course').html(selected_mail_id).promise().done(function(){
              var selected_course_wrapper_length = $('.selected_courses li .course-category-wrapper > ul li').length;
              var selected_course_length = $('.high_selected_course  .select2-selection__choice').length;
              if(selected_course_length > 0){
                  $('.selected_course_containter').show();
                  $('.high_selected_course').parent().closest('li').show();
                }
                else if(selected_course_wrapper_length < 1){
                  $('.selected_course_containter').hide();
                  $('.high_selected_course').parent().closest('li').hide();
                  
                }
                else{
                  $('.high_selected_course').parent().closest('li').hide();
                }
            });
          }).on("select2:closing", function(e) {
              e.preventDefault();
            }).on("select2:closed", function(e) {
              elementaryList.select2("open");
            });
            elementaryList.select2("open"); 


        var elementaryList = $(".high-school-ss-list").select2({
            placeholder: "Select Course",
             // maximumSelectionLength: 5,
            // closeOnSelect: false,
            // selectOnClose:false,
             // initSelection: function(element, callback) { }
            dropdownParent: $('#high-school-ssC')
             
          }).change(function(){
            var selected_mail_id = $('<li/>').append($('#high_schoolC .select2-selection__choice').clone()).html();
            $('.selected_course_containter').show();
            $('.high_selected_course').parent().closest('li').show();
            $('.high_selected_course').html(selected_mail_id).promise().done(function(){
              var selected_course_wrapper_length = $('.selected_courses li .course-category-wrapper > ul li').length;
              var selected_course_length = $('.high_selected_course  .select2-selection__choice').length;
              if(selected_course_length > 0){
                  $('.selected_course_containter').show();
                  $('.high_selected_course').parent().closest('li').show();
                }
                else if(selected_course_wrapper_length < 1){
                  $('.selected_course_containter').hide();
                  $('.high_selected_course').parent().closest('li').hide();
                  
                }
                else{
                  $('.high_selected_course').parent().closest('li').hide();
                }
            });
          }).on("select2:closing", function(e) {
              e.preventDefault();
            }).on("select2:closed", function(e) {
              elementaryList.select2("open");
            });
            elementaryList.select2("open"); 
            


        var elementaryList = $(".high-school-health-eduC-list").select2({
            placeholder: "Select Course",
             // maximumSelectionLength: 5,
            // closeOnSelect: false,
            // selectOnClose:false,
             // initSelection: function(element, callback) { }
            dropdownParent: $('#high-school-health-eduC')
             
          }).change(function(){
            var selected_mail_id = $('<li/>').append($('#high_schoolC .select2-selection__choice').clone()).html();
            $('.selected_course_containter').show();
            $('.high_selected_course').parent().closest('li').show();
            $('.high_selected_course').html(selected_mail_id).promise().done(function(){
              var selected_course_wrapper_length = $('.selected_courses li .course-category-wrapper > ul li').length;
              var selected_course_length = $('.high_selected_course  .select2-selection__choice').length;
              if(selected_course_length > 0){
                  $('.selected_course_containter').show();
                  $('.high_selected_course').parent().closest('li').show();
                }
                else if(selected_course_wrapper_length < 1){
                  $('.selected_course_containter').hide();
                  $('.high_selected_course').parent().closest('li').hide();
                  
                }
                else{
                  $('.high_selected_course').parent().closest('li').hide();
                }
            });
          }).on("select2:closing", function(e) {
              e.preventDefault();
            }).on("select2:closed", function(e) {
              elementaryList.select2("open");
            });
            elementaryList.select2("open"); 
            



        var elementaryList = $(".high-school-wl-list").select2({
            placeholder: "Select Course",
             // maximumSelectionLength: 5,
            // closeOnSelect: false,
            // selectOnClose:false,
             // initSelection: function(element, callback) { }
            dropdownParent: $('#high-school-wlC')
             
          }).change(function(){
            var selected_mail_id = $('<li/>').append($('#high_schoolC .select2-selection__choice').clone()).html();
            $('.selected_course_containter').show();
            $('.high_selected_course').parent().closest('li').show();
            $('.high_selected_course').html(selected_mail_id).promise().done(function(){
              var selected_course_wrapper_length = $('.selected_courses li .course-category-wrapper > ul li').length;
              var selected_course_length = $('.high_selected_course  .select2-selection__choice').length;
              if(selected_course_length > 0){
                  $('.selected_course_containter').show();
                  $('.high_selected_course').parent().closest('li').show();
                }
                else if(selected_course_wrapper_length < 1){
                  $('.selected_course_containter').hide();
                  $('.high_selected_course').parent().closest('li').hide();
                  
                }
                else{
                  $('.high_selected_course').parent().closest('li').hide();
                }
            });
          }).on("select2:closing", function(e) {
              e.preventDefault();
            }).on("select2:closed", function(e) {
              elementaryList.select2("open");
            });
            elementaryList.select2("open"); 



        var elementaryList = $(".high-school-electives-list").select2({
            placeholder: "Select Course",
             // maximumSelectionLength: 5,
            // closeOnSelect: false,
            // selectOnClose:false,
             // initSelection: function(element, callback) { }
            dropdownParent: $('#high-school-electivesC')
             
          }).change(function(){
            var selected_mail_id = $('<li/>').append($('#high_schoolC .select2-selection__choice').clone()).html();
            $('.selected_course_containter').show();
            $('.high_selected_course').parent().closest('li').show();
            $('.high_selected_course').html(selected_mail_id).promise().done(function(){
              var selected_course_wrapper_length = $('.selected_courses li .course-category-wrapper > ul li').length;
              var selected_course_length = $('.high_selected_course  .select2-selection__choice').length;
              if(selected_course_length > 0){
                  $('.selected_course_containter').show();
                  $('.high_selected_course').parent().closest('li').show();
                }
                else if(selected_course_wrapper_length < 1){
                  $('.selected_course_containter').hide();
                  $('.high_selected_course').parent().closest('li').hide();
                  
                }
                else{
                  $('.high_selected_course').parent().closest('li').hide();
                }
            })
          }).on("select2:closing", function(e) {
              e.preventDefault();
            }).on("select2:closed", function(e) {
              elementaryList.select2("open");
            });
            elementaryList.select2("open"); 


       var elementaryList = $(".high-school-advp-list").select2({
            placeholder: "Select Course",
             // maximumSelectionLength: 5,
            // closeOnSelect: false,
            // selectOnClose:false,
             // initSelection: function(element, callback) { }
            dropdownParent: $('#high-school-advpC')
             
          }).change(function(){
            var selected_mail_id = $('<li/>').append($('#high_schoolC .select2-selection__choice').clone()).html();
            $('.selected_course_containter').show();
            $('.high_selected_course').parent().closest('li').show();
            $('.high_selected_course').html(selected_mail_id).promise().done(function(){
              var selected_course_wrapper_length = $('.selected_courses li .course-category-wrapper > ul li').length;
              var selected_course_length = $('.high_selected_course  .select2-selection__choice').length;
              if(selected_course_length > 0){
                  $('.selected_course_containter').show();
                  $('.high_selected_course').parent().closest('li').show();
                }
                else if(selected_course_wrapper_length < 1){
                  $('.selected_course_containter').hide();
                  $('.high_selected_course').parent().closest('li').hide();
                  
                }
                else{
                  $('.high_selected_course').parent().closest('li').hide();
                }
            })
          }).on("select2:closing", function(e) {
              e.preventDefault();
            }).on("select2:closed", function(e) {
              elementaryList.select2("open");
            });
            elementaryList.select2("open");       

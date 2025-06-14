$(document).ready((()=>{$('[data-toggle="datepicker"]').datepicker(),$('[data-toggle="datepicker-year"]').datepicker({startView:2}),$('[data-toggle="datepicker-month"]').datepicker({startView:1}),$('[data-toggle="datepicker-inline"]').datepicker({inline:!0}),$('[data-toggle="datepicker-icon"]').datepicker({trigger:".datepicker-trigger"}),$('[data-toggle="datepicker-button"]').datepicker({trigger:".datepicker-trigger-btn"}),$('input[name="daterange"]').daterangepicker(),$('input[name="datetimes"]').daterangepicker({timePicker:!0,startDate:moment().startOf("hour"),endDate:moment().startOf("hour").add(32,"hour"),locale:{format:"M/DD hh:mm A"}}),$('input[name="birthday"]').daterangepicker({singleDatePicker:!0,showDropdowns:!0,minYear:1901,maxYear:parseInt(moment().format("YYYY"),10)},(function(t,e,a){var r=moment().diff(t,"years");alert("You are "+r+" years old!")}));var t=moment().subtract(29,"days"),e=moment();function a(t,e){$("#reportrange span").html(t.format("MMMM D, YYYY")+" - "+e.format("MMMM D, YYYY"))}$("#reportrange").daterangepicker({startDate:t,endDate:e,opens:"right",ranges:{Today:[moment(),moment()],Yesterday:[moment().subtract(1,"days"),moment().subtract(1,"days")],"Last 7 Days":[moment().subtract(6,"days"),moment()],"Last 30 Days":[moment().subtract(29,"days"),moment()],"This Month":[moment().startOf("month"),moment().endOf("month")],"Last Month":[moment().subtract(1,"month").startOf("month"),moment().subtract(1,"month").endOf("month")]}},a),a(t,e),$('input[name="daterange-centered"]').daterangepicker({timePicker:!0,buttonClasses:"btn btn-success",cancelClass:"btn-link bg-transparent rm-border text-danger",opens:"center",drops:"up",startDate:"12/12/2018",endDate:"12/18/2018"})}));
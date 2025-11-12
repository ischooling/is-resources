

function slideMenu(val){
    $("#main-nav1").metisMenu({
        toggle: false // disable the auto collapse. Default: true.
    });
}

function getRequestForSchoolDashboard(moduleId , userId){
	if(userId=='' || userId==undefined){
		userId=USER_ID;
	}
	var data={};
	data['userId']=userId;
	data['moduleId'] = moduleId;
	data['schoolId'] = SCHOOL_ID;
	return data;
}

function getShoolDashboardData(moduleId, userId) {
	return new Promise(function(resolve, reject){
		$.ajax({
			type : "POST",
			contentType : APPLICATION_JSON_VALUE,
			url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/dashboard/school-dashboard-data',
			data : JSON.stringify(getRequestForSchoolDashboard(moduleId, userId)),
			dataType : 'json',
			async:true,
			global : true,
			success : function(data) {
				//console.log(data);
				if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
					if (data['status'] == '3') {
						redirectLoginPage();
					} 
					return reject()
				}else{
					resolve(data)
				}
			}
		});
	});
}


function getSchoolUserCountData() {

	return new Promise(function(resolve, reject){
		data={};
		data['schoolId']=SCHOOL_ID;
		data['userId']=USER_ID;
		$.ajax({
			type : "POST",
			contentType : APPLICATION_JSON_VALUE,
			url : getURLForHTML('dashboard', 'school-user-count'),
			data : JSON.stringify(data),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			success : function(data) {
				//console.log(data);
				if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
					if (data['status'] == '3') {
						redirectLoginPage();
					} 
					return reject()
				}else{
					resolve(data)
				}
			},error: function(xhr, status, error) {
				if (checkonlineOfflineStatus()) {
					return;
				}
				console.error('Error: ' + error);
				reject(error);
			}
		});
	});
	
}

function getStudentYearChartData(eventid) {
	data={};
	data['schoolId']=SCHOOL_ID;
	data['userId']=USER_ID;
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard', 'student-yearwise-count'),
		data : JSON.stringify(data),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message']);
			} else {
				var userCountList= data.userCountList;
				var totalStudent=[];
				var activeStudent=[];
				var withdrwanStudent=[];
				var fresh_student=[];
				var reenroll_student=[];
				var catYear=[];
				if(userCountList.length>0){
					for (let u = 0; u < userCountList.length; u++) {
						const userCount = userCountList[u];
						catYear.push(userCount.sessionYear);
						totalStudent.push(userCount.totalStudent);
						activeStudent.push(userCount.student);
						withdrwanStudent.push(userCount.withdraw);
						fresh_student.push(userCount.fresh_student);
						reenroll_student.push(userCount.reenroll_student);
					}
				}
				getStudentChart(eventid, totalStudent,activeStudent,  withdrwanStudent, catYear, fresh_student, reenroll_student);
			}
			
		}
	});
}
function getStudentChart(eventid, totalStudent, activeStudent, withdrwanStudent, catYear, fresh_student, reenroll_student) {
    var maxval = Math.max.apply(Math, totalStudent);

    var options = {
        series: [
            {
                name: "Total Enrollment",
                data: totalStudent
            },
            {
                name: "Fresh Enrollment",
                data: fresh_student
            },
            {
                name: "Re-Enrollment",
                data: reenroll_student
            },
            {
                name: "Withdrawn",
                data: withdrwanStudent
            }
        ],
        chart: {
            height: 350,
            type: 'line',
            fontFamily: 'Roboto, sans-serif',
            dropShadow: {
                enabled: true,
                color: '#000',
                top: 18,
                left: 7,
                blur: 10,
                opacity: 0.5
            },
            zoom: {
                enabled: false
            },
            toolbar: {
                show: false
            }
        },
        colors: ['#007fff', '#3a9102', '#F8C581', '#f62727'],
        dataLabels: {
            enabled: true,
        },
        stroke: {
            curve: 'smooth'
        },
        title: {
            text: 'Total Enrollment & Withdrawn',
            align: 'center'
        },
        grid: {
            borderColor: '#e7e7e7',
            row: {
                colors: ['#f3f3f3', 'transparent'],
                opacity: 0.5
            },
        },
        markers: {
            size: 1
        },
        xaxis: {
            categories: catYear,
            title: {
                text: 'Year'
            }
        },
        yaxis: {
            title: {
                text: 'Students'
            },
            min: 0,
            max: maxval
        },
        legend: {
            position: 'top',
            floating: true,
            offsetY: -14,
            offsetX: -5
        },

        // ✅ Responsive Options
        responsive: [
            {
                breakpoint: 768,
                options: {
                    chart: {
                        height: 300
                    },
                    legend: {
                        position: 'bottom',
                        floating: false,
                        offsetY: 0,
                        offsetX: 0
                    },
                    dataLabels: {
                        style: {
                            fontSize: '10px'
                        }
                    },
                    title: {
                        style: {
                            fontSize: '14px'
                        }
                    }
                }
            },
            {
                breakpoint: 480,
                options: {
                    chart: {
                        height: 280
                    },
                    legend: {
                        position: 'bottom'
                    },
                    dataLabels: {
                        style: {
                            fontSize: '9px'
                        }
                    },
                    title: {
                        style: {
                            fontSize: '12px'
                        }
                    }
                }
            }
        ]
    };

    var chart = new ApexCharts(document.querySelector("#" + eventid), options);
    chart.render();
}


function getStudentGradeChartData(eventid) {
	data={};
	data['schoolId']=SCHOOL_ID;
	data['userId']=USER_ID;
	$.ajax({
			type : "POST",
			contentType : APPLICATION_JSON_VALUE,
			url : getURLForHTML('dashboard', 'student-gradewise-count'),
			data : JSON.stringify(data),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			success : function(data) {
				
                if (data['status'] == '0' || data['status'] == '2') {
                    showMessageTheme2(0, data['message']);
                } else {
					var userCountList= data.userCountList;
                    var series=[];
					var lable=[];
					var grade_k_lable="";
					var grade_6_lable="";
					var grade_9_lable="";
					var grade_flexy_lable="";
					var grade_k_total=0;
					var grade_6_total=0;
					var grade_9_total=0;
					var grade_flexy_total=0;
					if(userCountList.length>0){
						
						for (let u = 0; u < userCountList.length; u++) {
							const gradeWiseStudent = userCountList[u];
							//catYear.push(userCount.sessionYear);
							//totalStudent.push(userCount.totalStudent);
							if(gradeWiseStudent.standardId==11 || gradeWiseStudent.standardId==12 
								|| gradeWiseStudent.standardId==13 || gradeWiseStudent.standardId==14
								|| gradeWiseStudent.standardId==15 || gradeWiseStudent.standardId==16
							){
								grade_k_total=grade_k_total+ parseInt(gradeWiseStudent.totalStudent);
								grade_k_lable="Grade K - 5";
							}else if(gradeWiseStudent.standardId==1 || gradeWiseStudent.standardId==2 || gradeWiseStudent.standardId==3){
								grade_6_total=grade_6_total+ parseInt(gradeWiseStudent.totalStudent);
								grade_6_lable="Grade 6 - 8";
							}else if(gradeWiseStudent.standardId==4 || gradeWiseStudent.standardId==5 || gradeWiseStudent.standardId==6 
								|| gradeWiseStudent.standardId==7){
									grade_9_total=grade_9_total+ parseInt(gradeWiseStudent.totalStudent);
									grade_9_lable="Grade 9 - 12";
							}else if(gradeWiseStudent.standardId==9 || gradeWiseStudent.standardId==10 || gradeWiseStudent.standardId==19 
								|| gradeWiseStudent.standardId==20 || gradeWiseStudent.standardId==21){
									grade_flexy_total=grade_flexy_total+ parseInt(gradeWiseStudent.totalStudent);
									grade_flexy_lable="Flexy Program";
							}
						}
						lable=[grade_k_lable, grade_6_lable, grade_9_lable, grade_flexy_lable];
						series=[grade_k_total, grade_6_total, grade_9_total, grade_flexy_total];
					}
					getEnrollmentInGradeChart(eventid, lable,series);
                }
                
			}
	   });
   }


function getEnrollmentInGradeChart(eventid, lable, series){
	var options = {
		series: series,// [44, 55, 41, 17],
		labels: lable,//['Grade K - 5', 'Grade 6 - 8', 'Grade 9 - 12', 'Flexy Program'],
		chart: {
			type: 'donut',
			height: 360,
		},
		dataLabels: {
			enabled: false,
		},
		title: {
          text: 'Total Student Grade wise',
          align: 'center'
        },
		plotOptions: {
			pie: {
				donut: {
					size: '75%',
					style: {
						display:"none"
					},
					labels: {
						show: true,
						name: {
							//show: true,
						},
						//   value: {
						// 	show: true,
						// 	formatter: function (val) {
						// 	  return val
						// 	}
						//   },
						total: {
							show: true,
							label: 'Total',
							fontSize: '13px',
							fontWeight: 400,
							
						},
					}
				}
			}
		},
		responsive: [{
			breakpoint: 480,
			options: {
				chart: {
					// width: 100+"%",
					height: 150,
					
				},
				legend: {
					show:false,
					position: 'bottom'
				}
			}
		}]
	  };
	var chart = new ApexCharts(document.querySelector("#"+eventid), options);
	chart.render();
	chart.update();
}

function getStudentWordMapChartData(eventid) {
	data={};
	data['schoolId']=SCHOOL_ID;
	data['userId']=USER_ID;
	$.ajax({
			type : "POST",
			contentType : APPLICATION_JSON_VALUE,
			url : getURLForHTML('dashboard', 'student-countrywise-count'),
			data : JSON.stringify(data),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			success : function(data) {
				
                if (data['status'] == '0' || data['status'] == '2') {
                    showMessageTheme2(0, data['message']);
                } else {
					var countryCountList= data.countryCountList;
                   console.log(countryCountList);
				   var countryData=[];
				   var countryObj=[];
				   var cobj1=['Country', 'Enrollment'];
				   countryData.push(cobj1);
				   for (let u = 0; u < countryCountList.length; u++) {
						var country=countryCountList[u];
						var cobj=[country.country, country.totalStudent];
						countryData.push(cobj);
				   }
				   console.log(countryData);
					getStudentMap(eventid, countryData)
                }
                
			}
	   });
   }
function getStudentMap(eventid, countryData){
	// var cname=[
    //       ['Country', 'Popularity'],
    //       ['DE', 200],
    //       ['US', 300],
    //       ['BR', 400],
    //       ['CA', 500],
    //       ['FR', 600],
    //       ['RU', 700]
    //     ];
	// 	console.log(cname);

	google.charts.load('current', {
        'packages':['geochart'],
      });
      google.charts.setOnLoadCallback(drawRegionsMap);

      function drawRegionsMap() {
        var data = google.visualization.arrayToDataTable(countryData);

        var options = {
			width: 500,
  			height: 400,
			colors: ['#2162D3'],
			legend: 'none',
		};
        var chart = new google.visualization.GeoChart(document.getElementById(eventid));
        chart.draw(data, options);
      }
}

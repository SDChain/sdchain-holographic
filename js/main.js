// var img_h = $('#img').height();
// $(window).resize(function() {
//     img_h = $('#img').height();
//     $("#wrap").css("height", img_h);

// });
// $("#wrap").css("height", img_h);

$(window).resize(function() {


});
var myChart = echarts.init(document.getElementById('main'));

var dataApiUrl=Constant.data.dataApiUrl;

var xAxisData=new Array();
var seriesData=new Array();


option = {
    tooltip: {
        trigger: 'axis'
    },
    grid: {
        left: '1.5%',
        right: '4.5%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['1'],

    },

    yAxis: {
        type: 'value'
    },
    series: [{
        name: '',
        data: [66],
        type: 'line',
        // symbol:'none',
        itemStyle: {
            normal: {
                color: "#9bb2d5",
                lineStyle: {
                    color: "#9bb2d5"
                }
            }
        },
        areaStyle: {
            normal: {

                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(40, 182, 252, 0.85)'
                }, {
                    offset: 1,
                    color: 'rgba(28, 159, 255, 0.2)'
                }])

            }
        }
    }],

};


myChart.setOption(option);
window.onresize = myChart.resize;

$(".paging_info .pull-left a").on('click', function(event) {
    $(this).addClass('active').siblings().removeClass('active');
    if ($(this).html() == "更多") {
        $(".paging_num").css("opacity", "1");
    } else {
        $(".paging_num").css("opacity", "0");
    }
});
$(".data_info ul li").on('click', function(event) {
    $(this).addClass('active').siblings().removeClass('active');
    var limit=$(this).attr("target_val");
    var interval="day";
    if(limit=="12"){
        interval="month";
    }
   initCharts(interval,limit);
});

function GetDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
 
    var m = dd.getMonth()+1;//获取当前月份的日期
    var d = dd.getDate();
    if(d<10){
        d="0"+d;
    }

    if(m<10){
        m="0"+m;
    }
    return m+"-"+d;
}

function GetDateStr2(AddDayCount) {
    var dd = new Date();
    console.log(dd);
    dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth()+1;//获取当前月份的日期
    var d = dd.getDate();
    if(d<10){
        d="0"+d;
    }

    if(m<10){
        m="0"+m;
    }
    return y+"-"+m+"-"+d+"T16:00:00Z";
}

function initCharts(interval,limit){
     $.ajax({
        "dataType" : 'json',
        "type" : "GET",
        "url" : dataApiUrl+"/v2/payments?start="+GetDateStr2(-7)+"&end="+GetDateStr2(0)+"&descending=true&limit=1000000",
        "success" : function(data) {
            option.xAxis.data=new Array();
            option.series[0].data=new Array();
            for(var i = 6;i>=0;i--){
                option.xAxis.data.push(GetDateStr(-i));
                option.series[0].data.push(0);
            }
            var time1=new Date().getTime();
            var payments = data.payments;
            var j=0;
            for(var i=0;i<payments.length;i++){
                var date = payments[i].executed_time;
                 date = new Date(date).format("MM-dd");

                
                      // console.log(date+"---"+GetDateStr(-j));
                    if(date==GetDateStr(-j)){

                        option.series[0].data[6-j]++;
                        // break;
                     }else{
                        i--;
                        j++;
                     }
              
                 
                //  if(date<GetDateStr(-j)){
                //         j--;
                // }
                

            }
             myChart.setOption(option);
            window.onresize = myChart.resize;
        }
    });
}
 initCharts("day","7");


var table_h,item_h;

$(window).resize(function() {
    item_h = $(".table_tbody .table_row ul").height();

});

    // table_h = $(".scrooleTable").height();
    item_h = $(".table_tbody .table_row ul").height();
    
function AutoScroll(obj) {
    $(obj).find(".table_row").animate({
        marginTop: "63px"
    },
    500,
    function() {
        $(this).css({
            marginTop: "0px"
        }).find("ul:last").insertBefore(".table_tbody .table_row ul:first");
    });
}
$(document).ready(function() {
    // setInterval('AutoScroll(".table_tbody")', 3000);
});


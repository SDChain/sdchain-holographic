var IndexManager = new function() {

    return {
         pageData:{

            dataApiUrl:Constant.data.dataApiUrl,
            restApiUrl:Constant.data.restApiUrl,
            page:1

        },
        // main function to initiate the module
        init : function() {
            this.searchTxs();
            this.initListener();
            this.searchCurrentLedger();
        },
        searchTxs : function() {
            $.ajax({
                "dataType" : 'json',
                 "async": false,
                "type" : "GET",
                "url" : IndexManager.pageData.dataApiUrl+"/v2/payments?limit=10&descending=true",
                "success" : function(data) {
                    var html ="";

                    var _transactions=data.payments;
                    for(var i=0;i<_transactions.length;i++){
                        var _time = _transactions[i].executed_time;
                        var time = new Date(_time).format("yyyy-MM-dd hh:mm:ss");
                        html += '<ul>'
                            +'<li><img src="images/success.png" alt=""></li>'
                            +'<li><a href="txSearch.html?tx='+_transactions[i].tx_hash+'">'+_transactions[i].tx_hash+'</a></li>'
                            +'<li>'+_transactions[i].ledger_index+'</li>'
                            +'<li>'+_transactions[i].currency+'</li>'
                            +'<li>'+_transactions[i].delivered_amount+'</li>'
                            +'<li>'+time+'</li>'
                            +'</ul>';
                    }
                    $(".table_tbody .table_row").prepend(html);
                    $(".table_tbody .table_row ul:eq(9)").nextAll().remove();

                    
                }
            });
        },
        searchCurrentLedger : function() {
            $.ajax({
                "dataType" : 'json',
                "type" : "GET",
                //"url" : dataApiUrl+"/v2/ledgers",
                "url" : IndexManager.pageData.dataApiUrl+"/v2/ledgers",
                "success" : function(data) {
                    var ledger =data.ledger.ledger_index;
                    $(".block_height p:first-child").text(ledger);
                  setTimeout(function(){
                        IndexManager.searchCurrentLedger();
                    },10000);
                }
            });
        },
        search:function(){
                var text = $("#searchText").val().trim();
                if(text==""){
                    return;
                }
                var href="";
                if(text.length>40){
                    href="txSearch.html?tx="+text;
                }else{
                     href="accountSearch.html?account="+text;
                }
                window.location.href=href;
        },
        initListener : function() {
            $(".record table tr td:nth-child(2)").click(function() {
                window.location.href="txSearch.html?tx="+$(this).text().trim();
            });
            $(".search_img").click(function(){
               IndexManager.search();
            });
            // setInterval(
            //     function(){
            //        IndexManager.searchCurrentLedger();
            //     }
            //     ,3000);

           // $('form[name="searchForm"]').submit(function () {
           //     IndexManager.search();
           //  });
           $(document).keyup(function(event){
              if(event.keyCode ==13){
                $(".search_img").trigger("click");
              }
            });
                               setInterval(function(){
                        
                        IndexManager.searchTxs();
                    },3000);
        }
    };
}();
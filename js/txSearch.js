var TsManager = new function() {
    function prePro(data)
    {
      if (data.length % 2) return '';
      var tmp='';
      for(i=0;i<data.length;i+=2)
      {
        tmp += '%' + data.charAt(i) + data.charAt(i+1);
      }
      return tmp;
    }
    return {
         pageData:{

            dataApiUrl:Constant.data.dataApiUrl,
            restApiUrl:Constant.data.restApiUrl,
            txHash:"",
            marker:"",
            page:1

        },
        // main function to initiate the module
        init : function() {
           this.initHash();
            this.initListener();
        },
        searchTx : function() {
            var tx = TsManager.pageData.txHash;
            var i18nLanguage = "zh-CN";
            if (getCookie("userLanguage")) {
            i18nLanguage = getCookie("userLanguage");
             } 
             var paymentStr_p,successStr_s,paymentStr_q,successStr_f="";
             if(i18nLanguage=="zh-CN"){
                paymentStr_p="转账";
                paymentStr_q="其他";
                successStr_s="成功";
                successStr_f="其他";
             }else{
                paymentStr_p="Payment";
                paymentStr_q="Other";
                successStr_s="Success";
                successStr_f="Fail";
             }
            $.ajax({
                "dataType" : 'json',
                "type" : "GET",
                "url" : TsManager.pageData.dataApiUrl+"/v2/transactions/"+tx,
                "success" : function(data) {
                    var tx = data.transaction;
                    var _time = tx.date;
                    var time = new Date(_time).format("yyyy-MM-dd hh:mm:ss");
                    var amount = "";
                    var currency = "SDA";
                       if(typeof tx.tx.Amount =='string'){
                        amount=parseInt(tx.tx.Amount)/1000000
                       }else if(typeof tx.tx.Amount =='object'){
                        amount=tx.tx.Amount.value;
                        currency=tx.tx.Amount.currency;
                       }
                       if(tx.tx.Memos){
                        $(".table_wrap table tr:nth-child(11) td:nth-child(2) .remark").text(decodeURI(prePro(tx.tx.Memos[0].Memo.MemoData)));
                       }
                    $(".table_wrap table tr:nth-child(1) td:nth-child(2)").text(tx.hash);
                    $(".table_wrap table tr:nth-child(2) td:nth-child(2)").html("<a href='accountSearch.html?account="+tx.tx.Account+"'>"+tx.tx.Account+"</a>");
                    $(".table_wrap table tr:nth-child(3) td:nth-child(2)").html("<a href='accountSearch.html?account="+tx.tx.Destination+"'>"+tx.tx.Destination+"</a>");
                    $(".table_wrap table tr:nth-child(4) td:nth-child(2)").text(tx.tx.TransactionType=="Payment"?paymentStr_p:paymentStr_q);
                    $(".table_wrap table tr:nth-child(5) td:nth-child(2)").text(tx.ledger_index);
                    $(".table_wrap table tr:nth-child(6) td:nth-child(2)").text(tx.meta.TransactionResult=="tesSUCCESS"?successStr_s:successStr_f);
                    $(".table_wrap table tr:nth-child(7) td:nth-child(2)").text(tx.tx.Fee/1000000);
             

                    $(".table_wrap table tr:nth-child(8) td:nth-child(2)").text(currency);
                    $(".table_wrap table tr:nth-child(9) td:nth-child(2)").text(amount);
                    $(".table_wrap table tr:nth-child(10) td:nth-child(2)").text(time);
                  
                },
                "error":function(){
                    var html="";
                    var error1,error2="";
                   if(i18nLanguage=="zh-CN"){
                      error1="您输入的：";
                      error2="是一个无效搜索字符串！";
                   }else{
                      error1="You entered：";
                      error2="is an invalid search string!";
                   }
                    html+='<div class="wrap_error">'
                                            +'<div class="error_pos">'
                                                +'<h2><img src="images/error.png"></h2>'
                                                +'<p>'+error1+'</p>'
                                                +'<h2>'+tx+'</h2>'
                                                +'<p>'+error2+'</p>'
                                            +'</div>'
                                        +'</div>';
                   $(".search_wrap_1 table").html(html);
                   $(".search_wrap_1 table").css("overflow-y","scroll");
                }
            });
        },
       initHash : function() {
            var name, value;
            var str = location.href; //取得整个地址栏
            var num = str.indexOf("?")
            str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]

            var arr = str.split("&"); //各个参数放到数组里
            console.log(arr)
            for (var i = 0; i < arr.length; i++) {
                num = arr[i].indexOf("=");
                if (num > 0) {
                    name = arr[i].substring(0, num);
                    value = arr[i].substr(num + 1);
                    this[name] = value;
                }
            }
           var txHash =this["tx"];
           if(txHash.length>64){
            txHash=txHash.substring(0,64)+"...";
           }
           $(".address em").text(txHash);
           TsManager.pageData.txHash = txHash;
           TsManager.searchTx();


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
            $(".search_img").click(function(){
               TsManager.search();
            });

          $(document).keyup(function(event){
              if(event.keyCode ==13){
                $(".search_img").trigger("click");
              }
            });
        }
    };
}();
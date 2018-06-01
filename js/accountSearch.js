var TsManager = new function() {

    return {
        pageData:{

            dataApiUrl:Constant.data.dataApiUrl,
            restApiUrl:Constant.data.restApiUrl,
            account:"",
            marker:"",
            page:1

        },
        // main function to initiate the module
        init : function() {
            this.initAccount();
            this.initListener();
            this.searchAccount();
           
        },
        searchAccount : function() {
            var account = TsManager.pageData.account;
            var html ="";
            $.ajax({
                "dataType" : 'json',
                "type" : "GET",
                "url" : TsManager.pageData.dataApiUrl+"/v2/accounts/"+account+"/balances",
                "success" : function(data) {
                    
                    console.log(data);
                    if(data.result=="error"){
                         html+='<div class="wrap_error">'
                                            +'<div class="error_pos">'
                                                +'<h2><img src="images/error.png"></h2>'
                                                +'<p>您输入的:</p>'
                                                +'<h2>JSHE54148dhklshdkshdkshdkJDLSJDLSDJLSJDLS</h2>'
                                                +'<p>是一个无效搜索字符串!</p>'
                                            +'</div>'
                                        +'</div>';
                    }else{
                        var _balances=data.balances;
                    $(".balance em").text(_balances[0].value+" "+_balances[0].currency);
                     TsManager.searchTxs();
                    }
                   
                    
                },
                "error":function(){
                  var i18nLanguage = "zh-CN";
                  if (getCookie("userLanguage")) {
                     i18nLanguage = getCookie("userLanguage");
                   } 
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
                                                +'<h2>'+account+'</h2>'
                                                +'<p>'+error2+'</p>'
                                            +'</div>'
                                        +'</div>';
                   $(".table_wrap tbody").html(html);
                   $(".table_wrap tHead").remove();
                   $(".table_wrap tbody").css("overflow-y","hidden");
                }
            });
        },
        searchTxs : function() {
            var account = TsManager.pageData.account;
            var marker = TsManager.pageData.marker;
            if(marker===undefined){
                return;
            }
           
            $.ajax({
                "dataType" : 'json',
                "type" : "GET",
                "url" : TsManager.pageData.dataApiUrl+"/v2/accounts/"+account+"/payments?limit=11&descending=true&marker="+TsManager.pageData.marker,
                "success" : function(data) {
                    var i18nLanguage = "zh-CN";
                    if (getCookie("userLanguage")) {
                     i18nLanguage = getCookie("userLanguage");
                   } 
                   var outStr,inStr="";
                   // if(i18nLanguage=="zh-CN"){
                   //    outStr="付款";
                   //    inStr="收款";
                   // }else{
                      outStr='<img class="" src="images/out.png" alt="" style="margin-top:10px">';
                      inStr='<img class="" src="images/in.png" alt="" style="margin-top:10px">';
                   // }
                    var html ="";

                    var _transactions=data.payments;
              
                    for(var i=0;i<_transactions.length;i++){
                        var _time = _transactions[i].executed_time;
                        var time = new Date(_time).format("yyyy-MM-dd hh:mm:ss");
                        html += '<tr>'
                          
                            +'<td><a href="txSearch.html?tx='+_transactions[i].tx_hash+'">'+_transactions[i].tx_hash+'</a></td>'
                            +'<td>'+_transactions[i].ledger_index+'</td>'
                            +'<td>'+_transactions[i].currency+'</td>'
                            +'<td>'+(_transactions[i].source==account?outStr:inStr)+'</td>'
                            +'<td>'+_transactions[i].delivered_amount+'</td>'
                            +'<td>'+time+'</td>'
                            +'</tr>';
                    }
                    if(_transactions.length<11&&TsManager.pageData.page==1){
                        $(".table_wrap tbody").css("overflow-y","hidden");
                        for(var i=0;i<10-_transactions.length;i++){


                         html += '<tr>'
                            +'<td>&nbsp;</td>'
                            +'<td> </td>'
                            +'<td> </td>'
                            +'<td> </td>'
                            +'<td> </td>'
                              +'<td> </td>'
                            +'</tr>';
                            }
                    }else{
                        $(".table_wrap tbody").css("overflow-y","scroll");
                    }
           
                    if(marker==""){
                        $(".table_wrap tbody").html(html);
                    }else{
                        $(".table_wrap tbody").append(html);
                    }
                    TsManager.pageData.marker=data.marker;
                     TsManager.pageData.page++;
                 
                    
                }
            });
        },
       initAccount : function() {
            var name, value;
            var str = location.href; //取得整个地址栏
            var num = str.indexOf("?")
            str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]

            var arr = str.split("&"); //各个参数放到数组里
            for (var i = 0; i < arr.length; i++) {
                num = arr[i].indexOf("=");
                if (num > 0) {
                    name = arr[i].substring(0, num);
                    value = arr[i].substr(num + 1);
                    this[name] = value;
                }
            }
           var account =this["account"];
           if(account.length>64){
            account=account.substring(0,64)+"...";
           }
           $(".address em").text(account);
           TsManager.pageData.account=account;
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
           $("#next").click(function(){
               
           });
            var nDivHight = $("table tbody").height();
            $("table tbody").scroll(function(){
              nScrollHight = $(this)[0].scrollHeight;
              nScrollTop = $(this)[0].scrollTop;
             
              if(nScrollTop + nDivHight >= nScrollHight)
                TsManager.searchTxs();
              });
        }
    };
}();
/**
 * Created by zwq on 2016/10/14.
 */

/**
 前端js中文字国际化
 2017.7.21 ct
 */
/**
 * 页面所属左侧菜单使用方法
 找到对应菜单对象，在pathname中添加需要匹配索引的url片段即可
 配置文件/static/data/menu.json
 说明
 menu：菜单对应的选择器
 ch_name:菜单中文名，方便查找
 pathname:数组，需要使用此菜单页面的url索引片段
 特殊：1、有父级菜单需要展开的添加
 2、需同时满足多个匹配项的 配置matchingAll:["str1","str2"]
 */
if($.i18n){
    //console.log(currentLocale)
    var currentLocale = currentLocale ? currentLocale : $.i18n.browserLang();
        currentLocale = currentLocale.replace(/-/g, '_');
    var thisidpVersion='';
    if(typeof idpVersion!='undefined'){
        thisidpVersion=idpVersion
    }
    jQuery.i18n.properties({
        name: 'lang',  // 资源文件名称
        path: contextPath + '/static/plugins/jquery.i18n/lang/',  // 资源文件所在目录路径
        mode: 'map',  // 模式：变量或 Map
        language: currentLocale,  // 对应的语言包
        cache: true,
        encoding: 'UTF-8',
        version:thisidpVersion,
        callback: function() {}
    });
}

function initFormValidator(){
    //表单校验初始化
    var hasFormValidator=false;
    $('input,select,textarea').each(function (index,ele) {
        if(!hasFormValidator){
            if($(ele).attr('data-validation')){
                hasFormValidator=true;
                $.validate({
                    modules : 'location, date, security, file',
                    onModulesLoaded : function() {
                        $('#country').suggestCountry();
                    }
                });
            }
        }
    });
}
$(function () {
    //AJAX全局错误信息提示
    $.ajaxSetup({
        complete:function(XMLHttpRequest,textStatus){

            if(XMLHttpRequest.responseText.indexOf('accountNotEmptyMsg')!=-1){
                // console.log(XMLHttpRequest.responseText)
                $.message($.i18n.prop('msg.close.data.error'), function () {
                    
                });
            }
            //if(this.url)
        },
        error: function(jqXHR, textStatus, errorThrown){
            //window.localStorage.status=jqXHR.status;
            switch (jqXHR.status){
                case (0):
                    return;
                break;
                case(404):
                    $.message($.i18n.prop('ui.desc.ajax.error.404'))
                    break;
                case(500):
                    $.message($.i18n.prop('ui.desc.ajax.error.500'));
                    break;
                case(403):
                    $.message($.i18n.prop('ui.desc.ajax.error.403'));
                    break;
                case(408):
                    $.message($.i18n.prop('ui.desc.ajax.error.408'));
                    break;
            }
        }
    });
    initFormValidator();
})

//IE8-，在html上添加class
if( $.isIE<9 && $.isIE!=0 ) $('html').addClass('ie8');
if( $.isIE==7 ) {
    $('html').addClass('ie7');
    $('.fa').append( '<b class="ie7-before"></b>' );
}


/**
 * 语言切换
 */
$(".login-con-lang, .topbar-lang").on("click",function(){
    var url = location.href;
    var hash = location.hash;
    var lan = $(this).attr("lan");

    if(!hash==""){
        url = url.replace(hash,"");
    }
    if(url.indexOf("?") > 0){
        if(url.indexOf("_lang") > 0){
            if(url.indexOf("_lang=zh") > 0){
                //url = url.replace("_lang=zh","_lang=en");
                url= $.UrlUpdateParams(url,"_lang","en");
            }else{
                //url = url.replace("_lang=en","_lang=zh")
                url=$.UrlUpdateParams(url,"_lang","zh");
            }
        }else{
            url = $.UrlUpdateParams(url,"_lang",lan);
        }
    }else{
        url += "?_lang=" + lan;
    }
    if(!hash==""){
        url = url+hash;
    }
    location.href = url;
});



//datables数据为空不提示；
if ($.fn.dataTable) {
    $.fn.dataTable.ext.errMode = 'none';
}
$(function () {
    new Desc();
    alertOk();
    $('.st-switcher').switcher();

});

function Desc() {
    this.activeMenu();
    this.helperMenu();
    this.search_pc();
    this.search_input();
    this.others();
    //this.modal_conter();
    this.InitiateSimpleDataTable('.datatables-search');
    this.evBind();
}

Desc.prototype = {
    activeMenu: function () {
        var self=this;
        var href = location.pathname;

        $.get(contextPath+'/static/data/menu.json', function (data) {
            if(href.indexOf("/enterprise") != -1){
                self.Ergodicpathname(data['enterprise'],href)
            }else{
                self.Ergodicpathname(data['user'],href)
                self.Ergodicpathname(data['developer'],href)
            }
        })
    },
    Ergodicpathname: function (arr,href) {
        //console.log(11)
        $.each(arr,function (index,val) {
            $.each(val.pathname, function (index,name) {
                if((href.indexOf(name) != -1)){
                    //console.log(name,val.pathname)
                    if(typeof val.parentActive!="undefined"){
                        $.each(val.parentActive,function (index,ele) {
                            $(ele).addClass('active');
                        })
                    }
                    $(val.menu).addClass('active');
                }
            })
            if(typeof val.matchingAll!="undefined"){
                $.each(val.matchingAll, function (index,data) {
                    var  key=false;
                    $.each(data, function (index,item) {
                        if((href.indexOf(item) == -1)){
                            key=true;
                        }
                    })
                    if(!key){
                        $(val.menu).addClass('active');
                        if(typeof val.parentActive!="undefined"){
                            $.each(val.parentActive,function (index,ele) {
                                $(ele).addClass('active');
                            })
                        }
                    }
                })
            }

        })
    },
    evBind: function () {

        var self = this;
    },
    helperMenu: function () {
        $("[data-toggle='control-sidebar']").click(function () {
            $(".control-sidebar.control-sidebar-dark").toggleClass("control-sidebar-open")
        });
        $("[data-toggle='offcanvas']").click(function () {
            $("body").toggleClass("sidebar-collapse");
        });
        $(".admin-set").hover(function () {
            var active = $(this).addClass("active");
            $(this).find(".treeview-menu").show();
            if (!active) {
                $.AdminLTE.layout.fix();
            }
        }, function () {
            var active = $(this).hasClass("active");
            if (!active) {
                $(this).find(".treeview-menu").hide();
            }
        });
    },
    search_pc: function () {
        // NEW selector
        jQuery.expr[':'].Contains = function (a, i, m) {
            return jQuery(a).text().toUpperCase()
                    .indexOf(m[3].toUpperCase()) >= 0;
        };

        // OVERWRITES old selecor
        jQuery.expr[':'].contains = function (a, i, m) {
            return jQuery(a).text().toUpperCase()
                    .indexOf(m[3].toUpperCase()) >= 0;
        };
        /*书签搜索*/
        $(".serach-appList").on("input propertychange", function () {
            var _val = $.trim($(this).val());
            $(".btn-add-box").show();
            $(".ui-appList-box").each(function () {
                $(this).hide().filter(":contains('" + _val + "')").show();
                if ($(this).parent().find(".ui-appList-box").is(":visible") == 0) {
                    $(this).siblings(".alert.alert-info.marginLR15").hide();
                    $(this).siblings(".alert.alert-info.marginLR15.text-search-error").show();
                } else {
                    $(this).siblings(".alert.alert-info.marginLR15.text-search-error").hide();
                }
            });


        });
        $(".serach-ulList").on("input propertychange", function () {
            var _this = $.trim($(this).val());
            var _serchLength = $(this).closest(".box").find(".list-group .list-group-item-text").css({"display": "none"}).find(".list-group-item-text").end().filter(":contains('" + _this + "')").show();
            $(".btn-add-box").show();
            if (_serchLength.length) {
                $(this).closest(".box").find(".text-search-error").hide();
            } else {
                $(this).closest(".box").find(".text-search-error").show();
            }
        });
        $(".searchQuery").on("input propertychange", function () {
            var _this = $.trim($(this).val());
            if ($(this).closest(".box").has("table")) {
                var _serchLength = $(this).closest(".box").find("table").css({"display": "none"}).find("tr").end().filter(":contains('" + _this + "')").show();
                $(".btn-add-box").show();
                if (_serchLength.length) {
                    $(this).closest(".box").find(".text-search-error").hide();
                } else {
                    $(this).closest(".box").find(".text-search-error").show();
                }

            } else if ($(this).closest(".box").has(".list-group-item-text")) {
                // alert(".list-group-item-text");
            }
        });
    },
    search_input: function () {
        jQuery.fn.serach_input = function (serchObject) {
            return $(this).each(function () {

                $(this).on("input propertychange", function () {
                    var _me = $(this);
                    inputChange(_me);
                    window.setTimeout(function () {
                        scrollingTable_th_height(_me)
                    }, 300)
                });
                /*搜索*/
                function inputChange(obj) {
                    var _me = obj;
                    var _this = $.trim(_me.val());
                    var searchItem,
                        parent_isModalBody = _me.closest(".modal-body").length, /*当前被搜索元素，的父元素是否是弹出框*/
                        _errorText; /*是否有"未找到数据"的提示*/
                    /*搜索到多少条数据*/
                    searchItem = _me.closest(".modal-body").find(serchObject);//默认
                    if (parent_isModalBody > 0) {
                        searchItem = _me.closest(".modal-body").find(serchObject);

                    } else if (parent_isModalBody == 0) {
                        searchItem = _me.closest(".box-body").next(".box-body").find(serchObject);
                    }
                    searchItem.hide().removeClass("serchItem-show");
                    searchItem.each(function () {
                        $(this).text().toUpperCase().indexOf(_this.toUpperCase()) != -1 && $(this).show().addClass("serchItem-show");
                    });

                    /*
                     *被隐藏的那一行的checkbox去掉选中状态,
                     *如果checkbox包含no-search-checkbox 类名则不去掉中状态。
                     * */
                    searchItem.each(function (i, obj) {
                        if ($(obj).find(".no-search-checkbox").size() == 0) {
                            if ($(obj).is(":hidden")) {
                                $(obj).find("input[type=checkbox]").prop("checked", false).addClass("nochecked");
                                $(obj).removeClass("tr-visible")
                            } else {
                                $(obj).addClass("tr-visible");
                            }
                        }

                    });

                    /*如果没有找到数据加一个“未找到数据”的提示*/
                    _errorText = searchItem.siblings(".search-text-error").length;
                    if (searchItem.parent().find(".serchItem-show").length == 0) {

                        if (_errorText == 0) {
                            searchItem.parent().append('<tr class="search-text-error"><td colspan="5">'+ $.i18n.prop('ui.desc.inputChange.no.search')+'</td></tr>');
                        } else {
                            searchItem.siblings(".search-text-error").show();
                        }

                    } else {
                        searchItem.siblings(".search-text-error").hide();
                    }
                }

                /*固定表头宽度计算*/
                function scrollingTable_th_height(obj) {
                    var _me;
                    _me = $(obj).closest(".modal-body").find(".clone-box>table");//默认
                    if ($(obj).closest(".modal-body").length > 0) {
                        _me = $(obj).closest(".modal-body").find(".clone-box>table");
                    } else if ($(obj).closest(".modal-body").length == 0) {
                        _me = $(obj).closest(".box").find(".clone-box>table");
                    }

                    $(_me).siblings(".scrolling-table-box").find(".scrolling-table").css({
                        "width": _me.outerWidth() + 1 + "px",
                        "max-width": _me.outerWidth() + 1 + "px"
                    });
                    $(_me).find("th").each(function (i, obj) {
                        $(_me).siblings(".scrolling-table-box").find(".scrolling-table-th:eq(" + i + ")").css({
                            "max-width": $(obj).outerWidth() + "px",
                            "width": $(obj).outerWidth() + "px"
                        })
                    });
                }
            })
        };

        $(".serach-ulMenu").serach_input($(".nav.nav-pills.nav-stacked li"));
        $(".serach-table").serach_input($("table tbody tr"));
    },
    others: function () {
        var win_width = document.documentElement.clientWidth || document.body.clientWidth;//获取当前窗口(屏幕)的高度
        if (win_width < 768) {
            $(".control-sidebar.control-sidebar-dark").removeClass("control-sidebar-open");
        }
    },
    modal_conter: function () {
        /*
         * 提示框居中
         * 2017.02.21
         * zwq
         */
        return;
    },
    InitiateSimpleDataTableModel: function () {
        window.setTimeout(function () {
            var _oTable_box = $(".datatables-search-model-sync");
            //console.log("sync")
            if (_oTable_box.hasClass("dataTable") == false && typeof ($.fn.dataTable) != 'undefined') {
                window.oTable = $(".datatables-search-model-sync").DataTable({
                    "bSort": false,//禁用排序
                    "iDisplayLength": 9,//一页多少条数据
                    "pagingType":'full_numbers',
                    "language": {
                        "sProcessing": $.i18n.prop('ui.desc.InitiateSimpleDataTableModel.sProcessing'),
                        "sLengthMenu": $.i18n.prop('ui.desc.InitiateSimpleDataTableModel.sLengthMenu'),
                        "sZeroRecords": $.i18n.prop('ui.desc.InitiateSimpleDataTableModel.sZeroRecords'),
                        "sInfo": $.i18n.prop('ui.desc.InitiateSimpleDataTableModel.sInfo'),
                        "sInfoEmpty": $.i18n.prop('ui.desc.InitiateSimpleDataTableModel.sInfoEmpty'),
                        "sInfoFiltered": "",
                        "sInfoPostFix": "",
                        "sSearch": "<i class='idpicon i-search-bold text-default serch-icon'></i>",
                        "sUrl": "",
                        "sEmptyTable": $.i18n.prop('ui.desc.InitiateSimpleDataTableModel.sEmptyTable'),
                        "sLoadingRecords": $.i18n.prop('ui.desc.InitiateSimpleDataTableModel.sLoadingRecords'),
                        "sInfoThousands": ",",
                        "oPaginate": {
                            "sFirst": '<i class="glyphicon glyphicon-fast-backward"></i>',
                            "sPrevious": '<i class="glyphicon glyphicon-backward"></i>',
                            "sNext": '<i class="glyphicon glyphicon-forward"></i>',
                            "sLast": '<i class="glyphicon glyphicon-fast-forward"></i>'
                        },
                        "oAria": {
                            "sSortAscending": ": "+ $.i18n.prop('ui.desc.InitiateSimpleDataTableModel.sSortAscending'),
                            "sSortDescending": ": "+ $.i18n.prop('ui.desc.InitiateSimpleDataTableModel.sSortDescending')
                        }
                    },
                    "rowCallback":function(row,data, index){
                        //渲染行ListOu
                        if($(row).find('.branch').length!=0){
                            var ouDirectory = $(row).find('.branch').html();
                            $(row).find('.branch').html($.splitRoute(ouDirectory))
                        }
                    }
                });
                $(document).ready(function () {
                    //因为搜索框是js拼接的，等等会导致搜索框加载出来之前按钮和表格重叠在一起影响美观，
                    // 所以等搜索框加载完成之后在将编辑按钮显示出来
                    $(".box .padding10 .datatable-search-box .box-tools").css({"opacity": "1"});

                    $(".datatables-search-model-sync").css({"margin-top": "0"})
                    $(".dataTables_wrapper .dataTables_filter input").attr("placeholder", $.i18n.prop('ui.desc.InitiateSimpleDataTableModel.search.placeholder'))
                })
            };
        }, 500)
    },
    InitiateSimpleDataTable: function (obj) {
        //var self = this;
        /*
         *datatable搜索
         * 2017.03.03-zwq
         * */
         //nta
         if( typeof ($.fn.dataTable) != 'undefined' ) {
             window.ouTableData = $(obj).DataTable({
                "bSort": false,//禁用排序
                "iDisplayLength": 9,//一页多少条数据
                 "pagingType":'full_numbers',
                "language": {
                    "sProcessing": $.i18n.prop('ui.desc.InitiateSimpleDataTable.sProcessing'),
                    "sLengthMenu": $.i18n.prop('ui.desc.InitiateSimpleDataTable.sLengthMenu'),
                    "sZeroRecords": $.i18n.prop('ui.desc.InitiateSimpleDataTable.sZeroRecords'),
                    "sInfo": $.i18n.prop('ui.desc.InitiateSimpleDataTable.sInfo'),
                    "sInfoEmpty": $.i18n.prop('ui.desc.InitiateSimpleDataTable.sInfoEmpty'),
                    "sInfoFiltered": "",
                    "sInfoPostFix": "",
                    "sSearch": "<i class='idpicon i-search-bold text-default serch-icon' style='margin-top:-3px;'></i>",
                    "sUrl": "",
                    "sEmptyTable": $.i18n.prop('ui.desc.InitiateSimpleDataTable.sEmptyTable'),
                    "sLoadingRecords": $.i18n.prop('ui.desc.InitiateSimpleDataTable.sLoadingRecords'),
                    "sInfoThousands": ",",
                    "oPaginate": {
                        "sFirst": '<i class="glyphicon glyphicon-fast-backward"></i>',
                        "sPrevious": '<i class="glyphicon glyphicon-backward"></i>',
                        "sNext": '<i class="glyphicon glyphicon-forward"></i>',
                        "sLast": '<i class="glyphicon glyphicon-fast-forward"></i>'
                    },
                    "oAria": {
                        "sSortAscending": ": "+$.i18n.prop('ui.desc.InitiateSimpleDataTable.sSortAscending'),
                        "sSortDescending": ": "+$.i18n.prop('ui.desc.InitiateSimpleDataTable.sSortDescending')
                    }
                },
                 "rowCallback":function(row,data, index){
                     //渲染行ListOu
                     if($(row).find('.branch').length!=0){
                         var ouDirectory = $(row).find('.branch').html();

                         $(row).find('.branch').html($.splitRoute(ouDirectory))
                     }

                 }
            });
        }


        $(document).ready(function () {
            //因为搜索框是js拼接的，等等会导致搜索框加载出来之前按钮和表格重叠在一起影响美观，
            // 所以等搜索框加载完成之后在将编辑按钮显示出来
            $(".box .padding10 .datatable-search-box .box-tools").css({"opacity": "1"});

            $(".dataTables_wrapper .dataTables_filter input").attr("placeholder", $.i18n.prop('ui.desc.InitiateSimpleDataTable.search.placeholder'));
            $(".datatables-search").css({"margin-top": "0"});
        });
        //loaded.bs.modal数据加载完后执行
        $(".modal").on("show.bs.modal", function (e) {
            //var str = $(this).html();
            window.setTimeout(function () {
                var _oTable_box = $(".datatables-search-model");
                if (_oTable_box.hasClass("dataTable") == false && typeof ($.fn.dataTable) != 'undefined'&&_oTable_box.length!=0) {
                    //console.log("show")
                    oTable = $(".datatables-search-model").DataTable({
                        "bSort": false,//禁用排序
                        "iDisplayLength": 9,//一页多少条数据
                        "pagingType":'full_numbers',
                        "language": {
                            "sProcessing": $.i18n.prop('ui.desc._oTable_box.sProcessing'),
                            "sLengthMenu": $.i18n.prop('ui.desc._oTable_box.sLengthMenu'),
                            "sZeroRecords": $.i18n.prop('ui.desc._oTable_box.sZeroRecords'),
                            "sInfo": $.i18n.prop('ui.desc._oTable_box.sInfo'),
                            "sInfoEmpty": $.i18n.prop('ui.desc._oTable_box.sInfoEmpty'),
                            "sInfoFiltered": "",
                            "sInfoPostFix": "",
                            "sSearch": "<i class='idpicon i-search-bold text-default serch-icon'></i>",
                            "sUrl": "",
                            "sEmptyTable": $.i18n.prop('ui.desc._oTable_box.sEmptyTable'),
                            "sLoadingRecords": $.i18n.prop('ui.desc._oTable_box.sLoadingRecords'),
                            "sInfoThousands": ",",
                            "oPaginate": {
                                "sFirst": '<i class="glyphicon glyphicon-fast-backward"></i>',
                                "sPrevious": '<i class="glyphicon glyphicon-backward"></i>',
                                "sNext": '<i class="glyphicon glyphicon-forward"></i>',
                                "sLast": '<i class="glyphicon glyphicon-fast-forward"></i>'
                            },
                            "oAria": {
                                "sSortAscending": ": "+$.i18n.prop('ui.desc._oTable_box.sSortAscending'),
                                "sSortDescending": ": "+$.i18n.prop('ui.desc._oTable_box.sSortDescending')
                            }
                        },
                         "rowCallback":function(row,data, index){
                             //渲染行ListOu
                             if($(row).find('.branch').length!=0){
                                 var ouDirectory = $(row).find('.branch').html();
                                 $(row).find('.branch').html($.splitRoute(ouDirectory))
                             }
                         },
                        "fnDrawCallback": function () {
                            if($('#childrensFormDataTable').length>0){
                                $('.checkChildrenFormAlls').prop("checked", false);
                            }else if($('#parentFormDataTable').length>0){
                                $('.checkParentFormAlls').prop("checked", false);
                            }
                        }
                    });
                    //console.log(oTable.$('input').length)
                    $(document).ready(function () {
                        //因为搜索框是js拼接的，等等会导致搜索框加载出来之前按钮和表格重叠在一起影响美观，
                        // 所以等搜索框加载完成之后在将编辑按钮显示出来
                        $(".box .padding10 .datatable-search-box .box-tools").css({"opacity": "1"});

                        $(".datatables-search-model").css({"margin-top": "0"})
                        $(".dataTables_wrapper .dataTables_filter input").attr("placeholder", $.i18n.prop('ui.desc._oTable_box.search.placeholder'))
                    })
                };
            }, 500)

        })
    },
    //json数据datatables
    InitJsDataTable: function (obj,datas,columns,renderCol) {
        //var self = this;
        /*
         *datatable搜索
         * 2017.03.03-zwq
         * */
        //nta
        if( typeof ($.fn.dataTable) != 'undefined' ) {
            var index_row = 0;
            var JsDataTable=null;
            ouTableData = JsDataTable= $(obj).dataTable({
                "data":datas,
                "bSort": false,//禁用排序
                //"search":true,
                "iDisplayLength": 9,//一页多少条数据
                "pagingType":'full_numbers',
                "language": {
                    "sProcessing": $.i18n.prop('ui.desc.InitJsDataTable.sProcessing'),
                    "sLengthMenu": $.i18n.prop('ui.desc.InitJsDataTablex.sLengthMenu'),
                    "sZeroRecords": $.i18n.prop('ui.desc.InitJsDataTable.sZeroRecords'),
                    "sInfo": $.i18n.prop('ui.desc.InitJsDataTable.sInfo'),
                    "sInfoEmpty": $.i18n.prop('ui.desc.InitJsDataTable.sInfoEmpty'),
                    "sInfoFiltered": "",
                    "sInfoPostFix": "",
                    "sSearch": "<i class='idpicon i-search-bold text-default serch-icon'></i>",
                    "sUrl": "",
                    "sEmptyTable": $.i18n.prop('ui.desc.InitJsDataTable.sEmptyTable'),
                    "sLoadingRecords": $.i18n.prop('ui.desc.InitJsDataTable.sLoadingRecords'),
                    "sInfoThousands": ",",
                    "oPaginate": {
                        "sFirst": '<i class="glyphicon glyphicon-fast-backward"></i>',
                        "sPrevious": '<i class="glyphicon glyphicon-backward"></i>',
                        "sNext": '<i class="glyphicon glyphicon-forward"></i>',
                        "sLast": '<i class="glyphicon glyphicon-fast-forward"></i>'
                    },
                    "oAria": {
                        "sSortAscending": ": "+$.i18n.prop('ui.desc.InitJsDataTable.sSortAscending'),
                        "sSortDescending": ": "+$.i18n.prop('ui.desc.InitJsDataTable.sSortDescending')
                    }
                },
                "columns":columns,
                "rowCallback":function(row,data, index){
                    //渲染行
                    if(renderCol){
                        renderCol(row,data);
                    }
                    index_row++;
                },
                "fnInitComplete": function () {
                }
            });
            return JsDataTable;
        }

        $(document).ready(function () {
            //因为搜索框是js拼接的，等等会导致搜索框加载出来之前按钮和表格重叠在一起影响美观，
            // 所以等搜索框加载完成之后在将编辑按钮显示出来
            $(".box .padding10 .datatable-search-box .box-tools").css({"opacity": "1"});

            $(".dataTables_wrapper .dataTables_filter input").attr("placeholder", $.i18n.prop('ui.desc.InitJsDataTable.search.placeholder'));
            $(".datatables-search").css({"margin-top": "0"});
        });
        //$(".modal").on("show.bs.modal", function (e) {
        //    var str = $(this).html();
        //    window.setTimeout(function () {
        //        var _oTable_box = $(".datatables-search-model");
        //        if (_oTable_box.hasClass("dataTable") == false && typeof ($.fn.dataTable) != 'undefined') {
        //            var oTable = $(".datatables-search-model").DataTable({
        //                "bSort": false,//禁用排序
        //                "iDisplayLength": 9,//一页多少条数据
        //                "language": {
        //                    "sProcessing": "处理中...",
        //                    "sLengthMenu": "显示 _MENU_ 项结果",
        //                    "sZeroRecords": "没有匹配的数据",
        //                    "sInfo": "共 _TOTAL_ 条数据",
        //                    "sInfoEmpty": "共 0 条数据",
        //                    "sInfoFiltered": "",
        //                    "sInfoPostFix": "",
        //                    "sSearch": "<i class='idpicon i-search-bold text-default serch-icon'></i>",
        //                    "sUrl": "",
        //                    "sEmptyTable": "表中数据为空",
        //                    "sLoadingRecords": "载入中...",
        //                    "sInfoThousands": ",",
        //                    "oPaginate": {
        //                        "sFirst": "首页",
        //                        "sPrevious": "<i class='glyphicon glyphicon-triangle-left'></i>",
        //                        "sNext": "<i class='glyphicon glyphicon-triangle-right'></i>",
        //                        "sLast": "末页"
        //                    },
        //                    "oAria": {
        //                        "sSortAscending": ": 以升序排列此列",
        //                        "sSortDescending": ": 以降序排列此列"
        //                    }
        //                }
        //            });
        //
        //
        //            $(document).ready(function () {
        //                //因为搜索框是js拼接的，等等会导致搜索框加载出来之前按钮和表格重叠在一起影响美观，
        //                // 所以等搜索框加载完成之后在将编辑按钮显示出来
        //                $(".box .padding10 .datatable-search-box .box-tools").css({"opacity": "1"});
        //
        //                $(".datatables-search-model").css({"margin-top": "0"})
        //                $(".dataTables_wrapper .dataTables_filter input").attr("placeholder", "请输入名称或者关键字进行查找")
        //            })
        //        }
        //        ;
        //    }, 500)
        //
        //})
    }
}
;


/**
 * 模块内部加载中效果
 * 20161229
 */

jQuery.fn.extend({
    //option="hide" 不传为显示loader效果,传hide为隐藏
    //$("select").loader()
    loader: function (options) {
        var txt = typeof options != 'undefined' && options != 'show' ? options : $.i18n.prop('msg.loading');

        this.loaderDom = function () {
            return '<div class="loader-box"><div class="loader-inner"><img src= "'+contextPath+'/static/images/loader32.gif" alt="Loading" class="img" /><p class="txt">' + txt + '</p></div></div>';
        }

        this.loaderShow = function () {
            this.append(this.loaderDom()).addClass('disabled loader')
        }

        this.loaderHide = function (obj) {
            obj.removeClass('loader disabled')
            obj.find('.loader-box').fadeOut(200, function () {
                $(this).remove();
            });

        }
        options == 'hide' ? (this.loaderHide(this)) : this.loaderShow();
    }
});


/**
 统一提示信息
 20160726
 */

(function ($) {
    $.extend({

        alert: function (msg, flag, fn) {
            /*$.alert(msg,flag,fn)
             msg:提示框内容消息
             flag:true 绿色字体，false 警告字体，function:回调
             fn:回调函数
             */
            switch (typeof flag) {
                case 'undefined':
                    fn = null
                    flag = false
                    break;

                case 'function':
                    fn = flag
                    break;
            }

            var content = flag ?
            '<p class="text-success"><i class="idpicon i-ok"></i> ' + msg + '</p>' :
            '<p class="text-warning"><i class="idpicon i-warning"></i> ' + msg + '</p>';


            this.modal({
                title: $.i18n.prop('msg.modal.system.tips','param'),
                content: content,
                size: 'sm',
                disabled: true,
                cancel: fn
            })
        },
        confirm: function (msg, flag, oper, type, fire) {
            /*
             $.confirm(msg,fn(flag),oper)
             msg：string 对话框内容
             fn:function(flag){}回调函数，flag为true/flase,
             oper:{btnSubTxt: '确定1', btnCalTxt: '取消1'}按钮
             */
            var typeBoolean = type ? type : false;
            typeof oper == 'boolean' && (typeBoolean = oper);
            typeof oper == 'function' && (fire = oper);

            var modalFooter = oper ? oper : false;
            var typeIcon = typeBoolean ? '<i class="idpicon i-ok text-success" style="font-size: 36px;"></i>' : '<i class="fa fa-exclamation-circle text-warning"></i>';

            var msgHeader = '';
            typeof msg == 'object' && (msgHeader = msg.head, msg = msg.content);
            msg = msgHeader + '<div class="modal-confirm-inner"><table><tbody><tr><td class="td-icon">'+ typeIcon +'</td><td>'+msg+'</td></tr></tbody></table></div>';

            this.modal({
                title: $.i18n.prop('msg.modal.system.tips'),
                content: msg,
                size: 'sm',
                cancel: function () {
                    typeof flag != 'undefined' && flag(false)
                },
                callback: function () {
                    typeof flag != 'undefined' && flag(true)
                },
                fire: function (modal){
                    typeof fire != 'undefined' && fire(modal);
                },
                modalFooter: modalFooter
            })
        },

        message: function(msg, flag, fn) {
            /*
             $.message(msg, flag, fn)
             msg:string消息内容，
             flag:true为一般信息提示框 false为警告消息提示框
             fn:function(){}回调函数
             */
            switch (typeof flag) {
                case 'undefined':
                    fn = null
                    flag = false
                    break;

                case 'function':
                    fn = flag
                    break;
            }

            this.messageHide = function (obj) {
                setTimeout(function() {
                    obj.addClass('out');
                    setTimeout(function() {
                        obj.remove();
                        fn && fn();
                    }, 200);
                }, 2000);
            }

            var timer = new Date().getTime();
            var content = typeof flag == 'boolean' && flag == true ?
            '<div id="alertMsg'+ timer +'" class="alert alert-message alert-success fixed in"><i class="idpicon i-ok"></i> ' + msg + '</div>' :
            '<div id="alertMsg'+ timer +'" class="alert alert-message alert-warning fixed in"><i class="idpicon i-warning"></i> ' + msg + '</div>';

            $('.alert-message').remove();

            var self = this;
            setTimeout(function(){
                $('body').append(content);

                var thisMsg = $('#alertMsg'+ timer +'');
                self.messageHide( thisMsg );
            }, 0);
        },

        modalLen: 0,

        modal: function (options) {
            /**
             == options ==
             {
                 title: '系统提示',          // 标题，不填则为"系统提示" (可选)
                 class: 'modal-custom',      // 自定义弹框类名 (可选)
                 classname:'asd'            //替换class
                 content: msg,               // 内容，可以有DOM
                 size: 'lg',                 // lg|sm，大框|小框，不填则为中型 (可选)
                 disabled: false,            // false|true，隔3秒自动消失，默认为false (可选)
                 cancel: function() {},      // 取消或者没有点确定时回调
                 callback: function() {},    // 确定之后的回调
                 modalFooter: {btnSubTxt: '确定', btnCalTxt: '取消'},    // 自定义操作按钮名称 (可选)
                 fire: function () {}      // 模态框显示时触发
             }
             */
            options['class']=options['classname'];
            this.modalLen++;

            var btnSubTxt = (options.modalFooter && typeof options.modalFooter.btnSubTxt != 'undefined') ?
                (
                    options.modalFooter.btnSubTxt != '' ? ('<button type="button" class="btn btn-primary" id="modalTipsSub' + this.modalLen + '" data-dismiss="modal">' + options.modalFooter.btnSubTxt + '</button> ') : ''
                ) : ('<button type="button" class="btn btn-primary" id="modalTipsSub' + this.modalLen + '" data-dismiss="modal">'+ $.i18n.prop('msg.modal.confirm') +'</button>');

            var btnCalTxt = (options.modalFooter && typeof options.modalFooter.btnCalTxt != 'undefined') ?
                (
                    options.modalFooter.btnCalTxt != '' ? ('<button type="button" class="btn btn-default" id="modalTipsCal' + this.modalLen + '" data-dismiss="modal">' + options.modalFooter.btnCalTxt + '</button>') : ''
                ) : ('<button type="button" class="btn btn-default" id="modalTipsCal' + this.modalLen + '" data-dismiss="modal">'+ $.i18n.prop('msg.modal.cancel') +'</button>');


            typeof options['class'] == 'undefined' && (options['class'] = '');
            typeof options['title'] == 'undefined' && (options['title'] = $.i18n.prop('msg.modal.system.tips'));
            options['size'] = typeof options['size'] != 'undefined' ? 'modal-' + options['size'] : '';

            var modalHTML = '<div class="modal fade ' + options['class'] + '" id="modalTips' + this.modalLen + '" tabindex="-1" role="dialog" style="z-index: ' + (10000 + this.modalLen) + '"><div class="modal-dialog ' + options['size'] + '"><div class="modal-content"><div class="modal-header"><h4 class="modal-title">' + options['title'] + '</h4></div> <div class="modal-body">' + options.content + '</div> <div class="modal-footer">'+ btnSubTxt + btnCalTxt +'</div></div></div></div>';

            $('body').append(modalHTML);

            var thisModal = $('#modalTips' + this.modalLen + '');
            var modalTipsSub = $('#modalTipsSub' + this.modalLen + '');

            thisModal.modal({
                backdrop: false
            });

            /*
             * 提示框居中
             * 2017.02.21
             * zwq
             */
            var $modal = $(".modal:visible");
            var $modal_dialog = $modal.find(".modal-dialog");
            var m_top = parseInt(($modal.height() - $modal_dialog.height()) / 2.118);
            //$modal_dialog.css({"margin": (m_top - 40) + "px auto"});

            // 弹出框初始化触发
            thisModal.on('shown.bs.modal', function (e) {
                options.fire && options.fire(thisModal);
            });

            // 点击确认按钮及回调
            if (options.callback) {
                modalTipsSub.on('click', function () {
                    thisModal.on('hide.bs.modal', function (e) {
                        options.callback(thisModal);
                    })
                })
            }

            modalTipsSub.on('click', function () {
                $(this).attr('data-sub', 1);
            });

            // 自动消失
            if (options.disabled) {
                thisModal.find('.modal-footer').empty();

                setTimeout(function () {
                    thisModal.modal('hide');
                }, 2000)
            }

            // 销毁modal及回调
            thisModal.on('hidden.bs.modal', function (e) {
                (modalTipsSub.attr('data-sub') != 1 && options.cancel) && options.cancel(thisModal);
                $(this).remove();
            })
        },
        splitRoute:function(allrote){
            /*
                $.splitRoute(string)
                根目录替换为/
                string为完整的目录
             */
            var  ouarr =  allrote.split('/');
            if(ouarr.length>1){
                ouarr[0]='';
            }else{
                ouarr[0]='/';
            }
            var newstr = ouarr.join("/");
            return newstr
        },
        getUrlParam : function (name) {
            /*
                $.getUrlParam(name)
                获取地址栏参数
                name:参数名
             */
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;
        },
        replaceParamVal : function(oldUrl, paramName, replaceWith) {
                /*
                $.replaceParamVal(oldUrl, paramName, replaceWith)
                oldUrl,旧的url,完整的
                 paramName：参数名，
                 replaceWith：将要修改的参数值
                修改参数
                 */
                var re = eval('/(' + paramName + '=)([^&]*)/gi');
                var nUrl = oldUrl.replace(re, paramName + '=' + replaceWith);
                return nUrl;
        },
        searchTimeOut: function (searchEle,event,fun) {
            /*
                延时搜索
                $.searchTimeOut(searchEle,event,fun),
                searchEle:绑定事件的元素“select”
                fun:回调函数
             */

            var ev, timer = null;
            typeof event != 'function' ? (
                ev = event
            ) : (
                ev = 'keyup',
                event && (fun = event)
            );
            $('body').unbind(ev).on(ev,searchEle, function (e){
                clearTimeout(timer);
                timer=setTimeout(function(){
                    //console.log("执行搜索")
                    fun && fun(e);
                }, 600);
            });
        },
        UrlUpdateParams: function (url, name, value) {
            /*
             添加参数或修改参数
             $.UrlUpdateParams(url, name, value)
             url:完整的url
             name:要添加的参数名称，
             value:参数值
             */
            var r = url;
            if (r != null && r != 'undefined' && r != "") {
                value = encodeURIComponent(value);
                var reg = new RegExp("(^|)" + name + "=([^&]*)(|$)");
                var tmp = name + "=" + value;
                if (url.match(reg) != null) {
                    r = url.replace(eval(reg), tmp);
                }
                else {
                    if (url.match("[\?]")) {
                        r = url + "&" + tmp;
                    } else {
                        r = url + "?" + tmp;
                    }
                }
            }
            return r;
        },
        cookie:function(parms){
            /**
             cookie使用方法
             $.cookie(parms)
             parms:{
                name:cookie名字，必须
                val:要设置的值，如果不传,则为取cookie值
                expires:设置失效时间单位为小时，如果不传，默认浏览器关闭时失效 -1为删除本条cookie
                domain：设置cookie域，默认为请求地址
                path：设置cookie在服务器路径，默认为根目录
         }
             */
            if(typeof parms != 'object'|| typeof parms.name=="undefined"){
                return false;
            }
            if(typeof parms.val!="undefined"){
               if(typeof parms.expires!="undefined" ){
                   var exp = new Date();
                   exp.setTime(exp.getTime() + parms.expires*60*60*1000);
                   var exptime ="";
                       exptime = exp.toUTCString();

               }else{
                   parms.expires=null;
               }
               parms.domain ? parms.domain=parms.domain:parms.domain=null;
               parms.path ? parms.path=parms.path:parms.path=null;
                var str = parms.name+ "=" +parms.val+
                    ((parms.expires==null) ? "" : ";expires="+exptime)+
                    ((parms.domain==null) ? "" : ";domain="+parms.domain)+
                    ((parms.path==null) ? "" : ";domain="+parms.path);
                document.cookie=str;
            }else{
                $.getCookie(parms.name)
            }
        },
        setDropDriect: function (table) {
            var uls =$(table).find('tbody tr .app-dtl-triangle');
            var length = uls.length;
            $.each(uls, function (index,ele) {
                if(index<=Math.floor(length/2)+1){
                    $(ele).addClass('dropdown')
                }else{
                    $(ele).addClass('dropup');
                }
            })
        },
        getCookie: function (name) {
            var cookieValue ="";
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');//将获得的所有cookie切割成数组
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = cookies[i];//得到某下标的cookies数组
                    if (cookie.split("=")[0]== name) {//如果存在该cookie的话就将cookie的值拿出来
                        cookieValue = cookie.split("=")[1];
                        return cookieValue;
                    }
                }
            }
        },
        preventDefaultIE:function(event){
                if(event && event.preventDefault){
                    event.preventDefault();
                }else{
                    window.event.returnValue=false;
                }
        }
    });

    $.fn.confirmA =function(mess, callback){
        /*
        a标签跳转href使用confirm
        $(ele).confirmA(msg)
        msg:提示内容
         */
        $(this).on('click',function(e){
            var self = this;

            if( e && e.preventDefault){
                e.preventDefault();
            }else{
                window.event.returnValue=false;
            }
            $.confirm(mess, function (flag){
                if (callback) callback(flag)
                if(flag){
                    location.href = $(self).attr('href')
                }else{
                    return false;
                }
            })
        })
    }

})(jQuery);

/*固定表格表头*/
jQuery.fn.FixedThead = function () {
    var _me = $(this);
    _me.each(function () {
        var _clone_width = _me.outerWidth();
        var size = $(_me).find("th").length - 2;
        var _siblings = _me.siblings(".scrolling-table");
        _me.siblings(".scrolling-table-box").remove();

        if (_siblings.length == 0) {
            add_scrollingTable_box();
        } else {
            if (_siblings.find(".scrolling-table-th").length != 0) {
                scrollingTable_th_height();
            }
        }

        /*创建表头盒子*/
        function add_scrollingTable_box() {
            var _table_title = "<div class='scrolling-table-box'><div class='table table-bordered scrolling-table' style='max-width:" + (_clone_width + size - 2) + "px;width: " + (_clone_width + size + 4) + "px'><div class='scrolling-table-tr'></div></div></div>";
            _me.before(_table_title);

            //如果是弹出窗口就延时500毫秒，等待弹出框加载完毕
            _me.each(function (obj) {
                if (_me.closest(".modal-body").length == 0) {
                    add_scrollingTable_th(_me);
                    // scrollingTable_th_height();
                } else {

                    window.setTimeout(function () {
                        add_scrollingTable_th(_me);
                        scrollingTable_th_height();
                    }, 500);
                }
            });

        }

        /*创建表头的列*/
        function add_scrollingTable_th(obj_th) {
            if ($(obj_th).siblings(".scrolling-table-box").find(".scrolling-table-th").size() == 0) {
                $(obj_th).find("th").each(function (i, obj) {
                    var _scrollingTable_th="";
                    if ($(obj).find("input[type=checkbox]")) {
                        var str = $(obj).html();
                        var _id = $(obj).find("input[type=checkbox]").attr("id");
                        var _check = (str).replace(_id, _id + "Clone");
                         _scrollingTable_th = "<div class='scrolling-table-th scrolling-table-th-check' style='max-width:" + $(obj).outerWidth() + "px;width: " + $(obj).outerWidth() + "px;'>" + _check + "</div>";
                    } else {
                         _scrollingTable_th = "<div class='scrolling-table-th' style='max-width: " + $(obj).outerWidth() + "px;width: " + $(obj).outerWidth() + "px;'>" + $(obj).html() + "</div>";
                    }
                    $(obj_th).siblings(".scrolling-table-box").find(".scrolling-table-tr").append(_scrollingTable_th);
                });
            }

        }

        /*列宽度*/
        function scrollingTable_th_height() {
            $(_me).siblings(".scrolling-table-box").find(".scrolling-table").css({
                "width": _me.outerWidth() + 3 + "px",
                "max-width": _me.outerWidth() + 3 + "px"
            });
            $(_me).find("th").each(function (i, obj) {
                $(_me).siblings(".scrolling-table-box").find(".scrolling-table-th:eq(" + i + ")").css({
                    "max-width": $(obj).outerWidth() + "px",
                    "width": $(obj).outerWidth() + "px"
                })
            });
        }

        //全选，拼接的固定表头会覆盖掉原本的全选
        $(_me).siblings(".scrolling-table-box").click(function () {
            var _scrolling_table = $(this);
            var _checked = _scrolling_table.find("input[type]").is(":checked");
            var _id = _scrolling_table.find("input[type]").attr("id");
            if (_id) {
                (_scrolling_table.find("input[type]").attr("id")).replace("Clone", _id + "Clone");
            }
            _scrolling_table.siblings(".table").find("input[type]").not("[disabled]").not(":hidden").prop("checked", _checked);
        });

        /*窗口大小改变时重新加载表头宽度*/
        window.onresize = function () {
            scrollingTable_th_height();
        };

        /*当元素被搜索导致宽度变化*/
        _me.resize(function () {
            scrollingTable_th_height();
        });
        /*拖动滚动条始时终在顶部*/
        _me.parent().scroll(function () {
            // 设置div的top值为滚动条距离滚动条容器顶部的距离值
            $(_me).siblings(".scrolling-table-box").css({"top": _me.parent().scrollTop() + "px"});
        });
    })

};

/*搜索*/
jQuery.fn.jquqerySearch = function (obj) {
    $(this).on("input propertychange", function () {
        var _me = $(this);
        var _val = $.trim(_me.val());
        var searchItem = $(obj);
        searchItem.hide().removeClass("serchItem-show");
        searchItem.each(function () {
            $(this).text().toUpperCase().indexOf(_val.toUpperCase()) != -1 && $(this).show().addClass("serchItem-show");
        });
        if (searchItem.parent().find(".serchItem-show").length == 0) {
            searchItem.siblings(".text-search-error").show();
        } else {
            searchItem.siblings(".text-search-error").hide();
        }

    });
}


$(function () {
    //处理后端分页当前页数据为空时跳转问题
    function tableEmpty(){
        var currentNumber=HtmlUtil.htmlEncode($.getUrlParam('pageNumber'));
        var pathname=location.pathname;
        if(pathname.indexOf('root/user/employee/list')!=-1){
            return false;
        }
        if(currentNumber&&$('.table').length!=0){
            if($('.table').find('tbody').find('.empty').length!=0){
                if(currentNumber!=1){
                    window.location.href=$.replaceParamVal(window.location.href,'pageNumber',currentNumber-1)
                }
            }
        }
    }
    //处理dom元素内部表单提交confirm
    function confirmForm(){
        var forms = $("form[onsubmit*='confirm']")
        if($("form[onsubmit*='confirm']").length==0){
            return false;
        }
        forms.each(function (index,ele) {
            var longSubmitAttr="";
            var submitAttr=$(ele).attr('onsubmit');
            longSubmitAttr=submitAttr;
            submitAttr=submitAttr.replace("return confirm(","")
            submitAttr=submitAttr.substring(1,submitAttr.length-2);


            if(longSubmitAttr.indexOf('confirm')!=-1&& typeof $.confirm!="undefined"){
                $(ele).removeAttr('onsubmit');
                $(ele).unbind('submit').on('submit', function (event) {
                    if(event.preventDefault){
                        event.preventDefault();
                    }else{
                        window.event.returnValue=false;
                    }
                    $.confirm(submitAttr, function (flag) {
                        if(flag){
                            $(ele).unbind('submit')
                            $(ele).submit();
                        }else{
                            return false;
                        }
                    })
                })
            }
        })

    }
    confirmForm();
    tableEmpty();

//    分页插件渲染
    /*
    function renderPaginated(){
        var paginatedObj=[];
        $('.admin-paginated').each(function (index,ele) {
            var option={};
            option.obj=ele;
            option.perPageSize=$(ele).attr('perPageSize');
            option.totalSize = $(ele).attr('totalSize');
            option.current = $(ele).attr('current')
            paginatedObj[index]  = new AdminPaginated(option);
        })
    }
    */

    //后端分页统一，此插件暂不使用
    //renderPaginated();

})

//更新ud选择项
//现在Ud的选中ou是用sessionStorage存储的，其他页面跳转到listall时如果想指定选中ou,可在页面跳转前调用一下方法
//参数：ztreeId     指定选中ou的ouUuid 默认为根节点

function UpdateCurrentZtreeId(ztreeId){
    if(ztreeId=="" || !ztreeId){
        sessionStorage.clear('currentZtreeId');
    }else{
        sessionStorage.currentZtreeId=ztreeId;
    }
}


/**
 *
 * @param apps
 * @param ouUuid
 * @param removeUuids
 * @param url
 * @constructor 处理删除成员过后的同步SP
 */
function HandleSCIM(result, ouUuid, removeUuids, url, params) {
    var apps = result.applications;
    if (apps.length > 0) {
        var options = $.i18n.prop('enterprise.ud.HandleSCIM.options');
        for (var i = 0; i < apps.length; i++) {
            options += "<input type='checkbox' checked name='applications' value='" + apps[i].applicationUuid +
            "' > " + apps[i].name + "&nbsp;";
        }
        $("#appListDiv").html(options);
        $("#addOUModal").modal("hide");
        $("#ouUuid").val(ouUuid);
        $('#scimChildrensModel').modal({backdrop: 'static', keyboard: false});
        $("#scimChildrensModel").modal("show");
        if (params) {
            for (var key in params) {
                $('#scimChildrensModel').find("#" + key).text(params[key]);
            }
        }
        var formDataStr = "uuid=" + ouUuid + "&_csrf=" + $('input[name="_csrf"]').val() + "&removeUuids=" + removeUuids;
        $.each($("input[name=applications]:checked"), function () {
            formDataStr += "&applications=" + $(this).val();
        });
        if (result.accountLinkings.length > 0) {
            var serializationAry = [];
            var accountLinkings = result.accountLinkings;
            $.each(accountLinkings, function (index) {
                var serializationStr = "accountLinkings[" + index + "].applicationUuid=" + accountLinkings[index].applicationUuid +
                    "&accountLinkings[" + index + "].idpUsername=" + accountLinkings[index].idpUsername +
                    "&accountLinkings[" + index + "].applicationUsername=" + accountLinkings[index].applicationUsername;
                serializationAry.push(serializationStr);
            });
            formDataStr += "&" + serializationAry.join("&");
        }
        //console.log(formDataStr);
        //alert(formDataStr);
        HandleSCIM.prototype.bindSubmitDelete(formDataStr, url);
    } else {
        $("#myTabContent").loader("hide");
        if (url) {
            window.location.href = url;
        }
        else {
            window.location.reload();
        }
    }
}
HandleSCIM.prototype = {

    bindSubmitDelete: function (formDataStr, url) {
        $("#scimChildrensModalSubmit").unbind('click').bind("click", function () {
            var form = $("#scimChildrensModalForm");
            $("#scimChildrensBody").loader($.i18n.prop('enterprise.ud.HandleSCIM.bindSubmitDelete.loader'));
            form.attr("action", contextPath + "/enterprise/ud/ad/delete/submit_sync_members");

            $.post($(form).attr('action'), formDataStr, function (data) {
                $("#scimChildrensBody").loader("hide");
                $.alert($.i18n.prop('enterprise.ud.HandleSCIM.bindSubmitDelete.alert'), true, function () {
                    if (url) {
                        window.location.href = url;
                    }
                    else {
                        window.location.reload();
                    }
                });
            });

        });
        $("#scimChildrensModelCancel").on("click",function(){
            $("#scimChildrensModel").modal("hide");
            if (url) {
                window.location.href = url;
            }
            else {
                window.location.reload();
            }
        });
    }
}



/**
 * 使用Iframe异步上传文件，
 * @param settings
 */
$.fn.iframeFile = function( settings ){
    var _form = $(this);

    settings = settings || {};
    var opts = {
        target : _form.selector+' '+'[type="file"]',
        evType : 'change',
        timeout : 0,
        success : function(data){},
        error : function(data){}
    };
    $.extend( opts, settings );

    //响应方法
    $.fn.iframeFile.response = function(){
        $('#iframeFileIframe').remove();
        var data = $.fn.iframeFile.data;
        data==null ? opts.error( data ) : opts.success( data );
    }

    //触发表单提交
    $(opts.target).on(opts.evType,function(){
        if( $(this).val().length<=0 ) return;
        _form.submit();
    });

    //监听表单提交
    _form.on('submit',function(){
        $('#iframeFileIframe').remove();
        $('body').append('<iframe id="iframeFileIframe" name="iframeFileIframe" style="display:none;"></iframe>');
    });

    return _form;
};


/**
 * IE7+，部分功能IE9+
 * 滑块开关
 * @return {[type]} [null]
 * Notice :
 * 	① 修改input的value，最好同时对应地修改父元素.st-switcher的active
 */
$.fn.switcher = function(options){
    var er = $(this);
    var ops = options;

    //$(function(){
    //    bindStatus();
    //    $(document).on('DOMNodeInserted',bindStatus);
    //});

    bindStatus();

    function bindStatus() {
        $(er.selector).each(function(index,ele){
            if( $(ele).attr('data-switcher-status')!='ok' ) {
                $(ele).attr('data-switcher-status','ok');
                $(ele).find('.st-switcher-control').val()=='true' ? $(ele).addClass('active') : $(ele).removeClass('active');
            }
        });

        er.on('click',function(){
            if($(this).hasClass('disabled')||$(this).attr('disabled')) return;

            $(this).find('.st-switcher-control').val()=='true' ?
                (
                    // 为 false
                    $(this).removeClass('active').find('.st-switcher-control').val('false'),
                    ops && ops.isFalse && ops.isFalse()
                ) : (
                // 为 true
                $(this).addClass('active').find('.st-switcher-control').val('true'),
                ops && ops.isTrue && ops.isTrue()
            );
        });
    }
};


/**
 * 遍历tabs标签页分页，如果该页上的有“带有required属性的控件为空”，或者有.label-warning元素出现（block），那么切换到该页
 * @param tabs    切换器选择器，'.nav-tabs'
 * @param tabsContentParent，内容父选择器，'.tab-content'
 */
$.tabToggleByCheck = function(tabs, tabsContentParent){
    var prt = $(tabsContentParent)
    var cons = prt.children('.tab-pane')
    var tabs = $(tabs).children('li')
    for(var a=0; a<cons.length; a++) {
        if(!tabPaneRequiredCheck(cons.eq(a))) {
            cons.removeClass('active')
            cons.eq(a).addClass('active')
            tabs.removeClass('active')
            tabs.eq(a).addClass('active')
            break
        }
    }

    function tabPaneRequiredCheck(tab_pane) {
        var reqs = tab_pane.find('[required]')
        var warns = tab_pane.find('.label-warning')
        var res = 0
        for(var a=0; a<reqs.length; a++) {
            if(reqs.eq(a).prop('disabled')==false) {
                if(reqs.eq(a).prop('required')==true&&reqs.eq(a).val().length==0) {
                    res++
                }
            }
        }
        for(var a=0; a<warns.length; a++) {
            if(warns.eq(a).css('display')!='none') {
                res++
            }
        }
        return res==0
    }
}


/**
 * 设置获取脚本可以从缓存读取
 * 用法：
 * $.cachedScript('xxx.js').success(function (script, status){ });
 * 2017.9.13
 */

jQuery.cachedScript = function(url, options) {
    options = $.extend(options || {}, {
        dataType: "script",
        cache: true,
        url: url
    });

    return jQuery.ajax(options);
};


/**
 * 获取汉字转换拼音
 * 用法：
 * $.getChartConvert({
 *  from: '.control-a',  // 输入的对象
 *  to: '.control-b',  // 需要回显转换后的dom对象
 *  callback: function (obj, res) {}
 * })
 * 2017.9.13
 */


(function ($) {
    $.extend({
        getChartConvert: function (options) {
            var self = this;
            //var timerOn = new Date().getTime();
            //var timerDown;

            // 执行销毁
            if(options.ruin) {
                $(options.from).unbind('input propertychange');
                return;
            }
            // 直接转换对象不经过事件
            options.convert && this.pinyin(options.from, options.convert);

            // 加载转换插件，获取转换结果
            this.pinyin = function (obj, val) {
                $.cachedScript( contextPath+ '/static/plugins/pinyin/pinyin.js')
                    .success( function (script, statusTxt) {
                        // 汉字转拼音，需要加载插件pinyin.js
                        var view = pinyin.getFullChars(val);

                        // 给目标对象赋值
                        self.toValue(options['to'], view);

                        // 回调
                        options.callback && options.callback(obj, view);
                    })
                    .fail(function(xhr, statusTxt){
                        $.message($.i18n.prop('enterprise.getChartConvert.fail'), false);
                    });
            }

            // 给目标对象赋值
            this.toValue = function (obj, txt) {
                // 如果设置了最大长度，则截取到最大长度止
                options.maxlength && (
                    txt.length > options.maxlength && (txt = txt.substring(0, options.maxlength))
                );
                txt   =   txt.replace(/\s+/g,"")
                $(obj)[0].tagName == 'INPUT' ?
                    ($(obj)[0].value = txt) : ($(obj)[0].innerHTML = txt);
            }

            // 绑定控件的事件
            $.searchTimeOut( options.from, 'input propertychange', function (e) {
                var sVal = $(e.target).val();
                self.pinyin(e.target, sVal);
            });
        }
    });
})(jQuery);


//点击账户及组，跳转到重置localStorage
;(function bindReloadeCurrentId(){
    $('#admin-mainMenu .admin-ud-ad').find('a').on('click', function (e) {
        window.sessionStorage.currentZtreeId=sessionStorage.rootZtreeId;
    });
})();
function clearLocalStorage(){
    sessionStorage.removeItem("currentZtreeId");
    sessionStorage.removeItem("rootZtreeId");
}


/**
 * 自定义事件(发布/订阅/退订)
 * 用法：
 * $.publish('xxx', fn);  // 发布
 * $.subscribe('xxx', function(e, obj) { });  // 订阅
 * $.unsubscribe('xxx');  // 退订
 * 2017.9.19
 */
;(function($) {
    var b = $({});
    $.each({
        trigger: "publish",
        on: "subscribe",
        off: "unsubscribe"
    }, function(a, c) {
        jQuery[c] = function() {
            b[a].apply(b, arguments);
        }
    })
})(jQuery);


// 设置保存成功时候的提示 2017.10.24 ct
function alertOk(){
    var search = window.location.search;
    var mess="";
    var flag = true;
    if(search.match(/\=save[OKokOkoK]/)){
        mess= $.i18n.prop('msg.save.success');
    }else if(search.match(/\=create[OKokOkoK]/)){
        mess= $.i18n.prop('msg.create.success');
    }else if(search.match(/\=update[OKokOkoK]/)){
        mess= $.i18n.prop('msg.update.success');
    }else if(search.match(/\=remove[OKokOkoK]/)){
        mess= $.i18n.prop('msg.remove.success');
    }else if(search.match(/\=reset[Failed]/)){
        mess= $.i18n.prop('msg.reset.failed');
        flag =false;
    }else if(search.match(/\=resetOTPSecret[OKokOkoK]/)){
        mess= $.i18n.prop('msg.resetOTP.success');
    }else if(search.match(/\=reset[OKokOkoK]/)){
        mess= $.i18n.prop('msg.reset.success');
    }else if(search.match(/\=close[OKokOkoK]/)){
        mess= $.i18n.prop('msg.close.success');
    }
    if(mess!=""){
        $.message(mess,flag);
    }
}

//字符串转义 HtmlUtil.htmlDecode("&mdash;")

var HtmlUtil = {
    /*1.用浏览器内部转换器实现html转码*/
    htmlEncode:function (html){
        //1.首先动态创建一个容器标签元素，如DIV
        var temp = document.createElement ("div");
        //2.然后将要转换的字符串设置为这个元素的innerText(ie支持)或者textContent(火狐，google支持)
        (temp.textContent != undefined ) ? (temp.textContent = html) : (temp.innerText = html);
        //3.最后返回这个元素的innerHTML，即得到经过HTML编码转换的字符串了
        var output = temp.innerHTML;
        temp = null;
        return output;
    },
    /*2.用浏览器内部转换器实现html解码*/
    htmlDecode:function (text){
        //1.首先动态创建一个容器标签元素，如DIV
        var temp = document.createElement("div");
        //2.然后将要转换的字符串设置为这个元素的innerHTML(ie，火狐，google都支持)
        temp.innerHTML = text;
        //3.最后返回这个元素的innerText(ie支持)或者textContent(火狐，google支持)，即得到经过HTML解码的字符串了。
        var output = temp.innerText || temp.textContent;
        temp = null;
        return output;
    },
    /*3.用正则表达式实现html转码*/
    htmlEncodeByRegExp:function (str){
        var s = "";
        if(str.length == 0) return "";
        s = str.replace(/&/g,"&");
        s = s.replace(/</g,"<");
        s = s.replace(/>/g,">");
        s = s.replace(/ /g," ");
        s = s.replace(/\'/g,"'");
        s = s.replace(/\"/g,'"');
        return s;
    },
    /*4.用正则表达式实现html解码*/
    htmlDecodeByRegExp:function (str){
        var s = "";
        if(str.length == 0) return "";
        s = str.replace(/&/g,"&");
        s = s.replace(/</g,"<");
        s = s.replace(/>/g,">");
        s = s.replace(/ /g," ");
        s = s.replace(/'/g,"\'");
        s = s.replace(/"/g,"\"");
        return s;
    }
};



//分页插件
/*
 使用方法
 new AdminPaginated({
 obj:'.M-box1', //dom元素
 perPageSize:10,//每页条数
 totalSize:'${paginated.totalSize}', //总页数
 current:'${paginated.pageNumber}'  //当前页
 })

function AdminPaginated(option){
    this.option = option
    this.init();
}
AdminPaginated.prototype={
    init: function () {
        var self = this;
        if(!jQuery.fn.pagination){
            $.alert('初始化分页插件失败，请先引入插件')
            return false;
        }
        if(!this.option.perPageSize||this.option.perPageSize==''||!this.option.totalSize||this.option.totalSize==''||!this.option.current||this.option.current==''){
            $.alert('初始化分页插件失败，参数不正确')
            console.log(this.option);
            return false;
        }


        $(this.option.obj).pagination({
            totalData: Number(this.option.totalSize),
            showData: Number(this.option.perPageSize),
            coping: true,
            current:Number(this.option.current),
            prevContent:'<i class="glyphicon glyphicon-triangle-left"></i>',
            nextContent:'<i class="glyphicon glyphicon-triangle-right"></i>',
            keepShowPN:true,
            callback: function (api) {
                self.pageTurn(api)
            }
        });
    },
    pageTurn: function (api) {
        var nowIndex = api.getCurrent();
        //var url = window.location.href;
        //window.location.href = $.UrlUpdateParams(url,'pageNumber',nowIndex);
        displaytagform('filterForm',[{f:'pageNumber',v:nowIndex}])
    }
}
 */
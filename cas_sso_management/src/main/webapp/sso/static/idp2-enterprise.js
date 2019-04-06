/*
 * Initial pages
 * */
$(function () {
    new IDP2();

    //IDP - 应用授权 - 左侧zTree - 【点击某一项，页面重载后，该项要显示在zTree盒子的中央位置】
    new StScrollerTargetMiddle({
        outer : '#stScrollerTargetMiddleAppAuth',
        targ : '.box-table-limith li.active',
        delta : 210
    });

});


//【Site】 点击某一项，页面重载后，该项要显示在zTree盒子的中央位置
function StScrollerTargetMiddle( opts ) {
    if( $(opts.outer).length>0&&$(opts.targ).length>0 ) $(opts.outer).scrollTop( $(opts.outer).find(opts.targ).position().top-opts.delta );
}





/**
 * displaytag paginated use it.
 * Don't change it
 *
 * @param formId
 * @param data
 */
function displaytagform(formId, data) {
    var $form = $("#" + formId);
    var action = $form.attr("action");
    var params = action.indexOf('?') == -1 ? '?' : '&';
    $.map(data, function (d) {
        if(d.f!='alert'){
            params += (d.f + "=" + d.v + "&");
        }

    });
    var url = action + params;
    var $targetDiv = $("div.displayTarget");
    if ($targetDiv.length > 0) {
        //if exist, load  the content to the div
        $targetDiv.load(url);
    } else {
        location.href = url;
    }
}


/**
 * 对分页模块进行DOM XSS字符替换
 * ct 2018.2.23
 */

$(function(){
    $('.pagination a').each(function (i, v) {
        var thisHref = $(this).attr('href');

        if(thisHref.indexOf('javascript:void(0)') == -1 && thisHref.indexOf('displaytagform') != -1) {
            // 把属性值进行拆分
            var thisParms = $(this).attr('href').replace('javascript:displaytagform', '');
            var parmDot = thisParms.indexOf(',');
            var parmFirt = thisParms.slice(2, parmDot-1);
            var parmLast = thisParms.slice(parmDot+2, -2);

            // 替换危险字符并索引出位置
            parmLast = parmLast.replace(/[()]/g,'');
            var hackStart = (/:[a-zA-Z\d]{1,18}/).test(parmLast) ? parmLast.match(/:[a-zA-Z\d]{1,18}/).index : false;
            var hackEnd = (/[a-zA-Z\d"],[a-zA-Z\d]/).test(parmLast) ? parmLast.match(/[a-zA-Z\d"],[a-zA-Z\d]/).index : false;
            var hacksStr = parmLast.slice(hackStart + 1, hackEnd + 1);
            var hacksStrLimit = hacksStr.replace(/"/g, '');

            // 重新进行字符拼接
            parmLast = hackStart ? parmLast.replace(hacksStr, '"'+ hacksStrLimit +'"') : parmLast;
            $(this).attr('href', 'javascript:displaytagform("'+ parmFirt +'", ['+ parmLast +'])');
        }
    });
});


function IDP2() {
    this.activeMenu();
    this.idpNotice();
    this.latestLoginTime();
    this.license();
}

IDP2.prototype = {
    license: function () {
        $("#licenseDiv").load(contextPath + "/enterprise/decorator_license", function(data, status){
            if(status=='success') {
                var userCurrent = parseInt($('#licenseDivUserNumberCurrent').text());
                var userTotal = parseInt($('#licenseDivUserNumberTotal').text());

                $('.license-div-process>div').css('width', function(){
                    return userCurrent / userTotal * 100 +'%';
                });

                userCurrent == userTotal && $('.license-div-process').addClass('peak');
            }
        });
    },
    idpNotice: function () {
        $(".idpNotice").removeClass("hidden").slideUp(4000);
    },
    activeMenu: function () {
        //Active main menu
        var href = location.pathname;
        if (href.indexOf("/admin/system/") != -1) {
            $("#mainMenu li#systemMenu").addClass("active");
        } else if (href.indexOf("/admin/vulnerabilit") != -1) {
            $("#mainMenu li#vulnerMenu").addClass("active");
        } else if (href.indexOf("/admin/product/") != -1) {
            $("#mainMenu li#productMenu").addClass("active");
        } else if (href.indexOf("/admin/company/") != -1) {
            $("#mainMenu li#companyMenu").addClass("active");
        } else {
            $("#mainMenu li:eq(0)").addClass("active");
        }
    },
    latestLoginTime: function () {
        var url = contextPath + "/enterprise/load_commons";
        $.get(url, function (data) {
            $('#last_login_time_area').html(data.lastLoginTime);
            if (data.notificationSize != 0) {
                /*$('#top_notificationSize').html(data.notificationSize).css("display","inline");*/
                $('#top_notificationSizeBox').html('<i class="idpicon i-bell"></i><span class="label label-warning" id="top_notificationSize">' + data.notificationSize + '</span>');
            }
            if (data.notificationSize < 1) {
                $("#notificationList").append('<li><a>'+ $.i18n.prop('idp2.enduser.loadCommons.no.notifications')+'</a></li>');
            } else {
                for (var i = 0; i < data.notificationSize; i++) {
                    var single = data.notifications[i];
                    $("#notificationList").append("<li><a href='" + contextPath + "/enterprise/notification/detail_" + single.uuid + "'>" + "<span>" + single.title + "</span>" + "<span>" + single.createTime + "</span>" + "</a></li>");
                }
            }
            $('span#enterprise_name_span').text(data.enterpriseShortName).attr("title", data.enterpriseShortName);
            $('#enterprise_logo').attr("src", data.enterpriseLogoUrl);
        });
    }
};


/**
 * enterprise_update.jsp
 * @constructor
 */
function EnterpriseUpdate() {
    this.uploadLogo();
}

EnterpriseUpdate.prototype = {
    uploadLogo: function () {
        if( $.isIE!=0&& $.isIE<10 ) {
            $('[name="useIframeUpload"]').val('true');
            var $imageForm = $('#imageForm');
            $imageForm.prop('target','iframeFileIframe');
            $imageForm.prop('action',$imageForm.prop('action')+'_iframe');
            $imageForm.iframeFile({
                success : function(data){
                    cb_success(data, $imageForm.find('[type="file"]'));
                },
                error : function(){
                    $.message( 'Error !' );
                }
            });
        } else {
            $("#logoFile").change(function () {
                if( $(this).val().length<=0 ) return;
                var $this = $(this);
                $("#imageForm").ajaxSubmit({
                    url: "upload_logo",
                    dataType: "json",
                    type: "post",
                    success: function (data) {
                        cb_success(data, $this);
                    },
                    error : function(){
                        $.message( 'Error !' );
                    }
                });
            });
        }
        function cb_success(data, $this) {
            if (data.message == null) {
                var img = new Image();
                img.onload = function () {
                    var w = img.width;
                    var h = img.height;
                    if (w / h < 0.3 || h / w < 0.3) {
                        $this.val('');
                        $.message($.i18n.prop('idp2.enterprise.EnterpriseUpdate.alert'));
                    } else {
                        $('#logoFileWrap').addClass('active').css('background-image', "url(../../../public/image/" + data.uuid + "?w=80)");
                        $("#logoUuid").val(data.uuid);
                    }
                };
                img.src = contextPath + "/public/image/" + data.uuid + "?w=80";
            } else {
                $.message(data.message);
            }
        }
    }
};

/**
 * login_logout_log_list.jsp
 */
function LoginLogoutLogList() {
    this.searchBtn();
    this.enterBtn();
//    时间插件初始化
    this.initDatePicker();
//    左侧数据
    this.initUsers();


}

LoginLogoutLogList.prototype = {
    initDatePicker: function () {
        $('input.datepicker').datepicker({
            language: 'zh-CN',
            format: "yyyy-mm-dd",
            todayHighlight: true,
            autoclose:true,
            endDate:new Date(),
            toggleActive:true
        });
        if($('input[name="startDate"]').val()){
            $('input[name="endDate"]').datepicker('setStartDate',$('input[name="startDate"]').val())
        }
        $('input[name="startDate"]').datepicker()
            .on('changeDate', function(e) {
                $('input[name="endDate"]').datepicker('setStartDate',$('input[name="startDate"]').val())
            });
    },
    initUsers: function () {
        var self = this;
        var option = {
            dataUrl: contextPath + "/enterprise/audit/employee/login_logout_list/query",//数据接口,
            length: 13,//每次加载数据条数
            content: $('.groupMore'),//容器，数据显示的dom节点
            searchEle:'.serach-input-user',//搜索框
            get_more_btn: $('#loadMore'),//触发请求数据的dom节点
            data:{
                pageNumber:null,
                groupName:null,
                name:null,
                perPageSize:13,
                thisPerPageSize:13
            },
            dataCallBack:function(data,option){
//                数据加载完处理回调函数
                self.dataCallBack(data,option)
            },
            searchCallBack:function(data,option){
//                  搜索数据加载完的回调函数
                self.searchCallBack(data,option)
            }
        };
        new LoadeMore(option)
    },
    searchBtn: function () {
        $("button#searchBtn").on("click", function () {
            var $form = $(this).parent('form');
            $form.attr('action', '');
            $form.submit();
        });
    },
    enterBtn: function () {
        $(document).keydown(function (e) {
            if (e.which == 13) {
                $("button#searchBtn").click();
            }
        });
    },
    //搜索完的回调
    searchCallBack: function (data,option) {
        var str ='';
        if(data.fullListSize==0){
            str = '<li class="" style="padding: 0 15px;"><p>'+ $.i18n.prop('ui.desc.inputChange.no.search') +'</p> </li>'
            option.content.html(str)
            $('#loadMore').hide();
        }else if(data.fullListSize!=0){
            str = this.renderUl(data,option);
            option.content.html(str);
            if(data.totalPages<=1){
                $('#loadMore').hide();
            }else{
                $('#loadMore').show();
            }
        }
    },
    //加载数据完的回调
    dataCallBack: function (data,option) {
        $('#userNum').html("("+data.fullListSize+")")
        var str ='';
        if(data.fullListSize==0){
            str = '<li class="active text-search-error" style="padding: 0 15px;"><p>未找到匹配的数据</p></li>'
            $(str).appendTo(option.content)
            $('#loadMore').hide();
        }else if(data.fullListSize!=0){
            this.selectCurrentApp(data.list);
            str = this.renderUl(data,option);
            $(str).appendTo(option.content);
            if(!this.isfirst){
                var currentApp =$('.list-group-item-text.active');
                if(currentApp.length!=0){
                    this.isfirst=true;
                    $('.scrollBox').scrollTop(currentApp.offset().top-500)
                }
            }
            if(data.totalPages==1){
                $('#loadMore').hide();
            }
        }
        this.bindClick();
    },
    //左侧点击事件
    bindClick: function () {
        var self = this;
        $('body').unbind().on('click','.list-group-item-text', function (event) {
            //console.log(11)
        })
    },
    //渲染左侧列表
    renderUl: function (datas,option) {
        var str="";
        $.each(datas.list, function (index,val) {
            if(val.active){
                str+='<li class="active list-group-item-text"><a href="?who='+val.username+'"title="'+val.username+'"> <h5 class="list-group-item-heading" style="display: inline-block;">'+val.username+'</h5> <i class="fa fa-angle-right pull-right"></i> </a> </li>'

            }else{
                str+='<li class="list-group-item-text"><a href="?who='+val.username+'"title="'+val.username+'"> <h5 class="list-group-item-heading" style="display: inline-block;">'+val.username+'</h5> <i class="fa fa-angle-right pull-right"></i> </a> </li>'
            }
        })
        return str;
    },
    //定位到之前选中的应用
    selectCurrentApp: function (data) {
        var self = this;
        var who = $.getUrlParam("who");
        if(who && !/[`<>\/()]/.test(who)){
            var isfind = false;
            if(!this.isGetData){
                //循环找左侧对应的组
                for(var i=0;i<data.length;i++){
                    if(data[i].username==who){
                        data[i].active=true;
                        isfind = true;
                        this.isGetData=true;
                        break;
                    }
                }
                if(!isfind){
                    $('#loadMore').click();
                }
            }
        }
        //else{
        //    //页面第一次加载加载第一条个组的数据
        //    if(!this.isGetData){
        //
        //        this.isGetData=true;
        //        data[0].active=true;
        //    }
        //}
        return data;
    }

};

/**
 * operation_log_list.jsp
 * @constructor
 */
function OperationLogList() {
    this.searchBtn();
}

OperationLogList.prototype = {
    searchBtn: function () {
        $("div.displayTarget").on("click", "button#searchBtn", function () {
            var $form = $(this).parent('form');
            $form.attr('action', '');
            $form.submit();
        });
    }
};


/**
 * application_api.jsp
 * @param applicationUuid
 * @constructor
 */
function ApplicationApi(applicationUuid) {
    // this.enableAPI(applicationUuid);
}

ApplicationApi.prototype = {
    // enableAPI: function (applicationUuid) {
    //     $("input[name='enabledAPI']").change(function () {
    //         var value = $(this).val();
    //         location.href = "switch_api_" + applicationUuid + "_" + value;
    //     })
    // }
};

/**
 * enterprise_authentication.jsp
 * @constructor
 */
function EnterpriseAuthentication() {
    this.enabledAuthenticate();
    this.alertSetting();
    this.fromSubmit();
    this.addAuthenticate();
    this.updateAuthenticate();
}

EnterpriseAuthentication.prototype = {
    fromSubmit: function () {
        $('.auStart').find('button').on('click', function (e) {
            var self = this;
            if (e && e.preventDefault) {
                e.preventDefault();
            } else {
                window.event.returnValue = false;
            }
            var infName = $(self).attr('infName');
            $.confirm(EnterpriseAuthenticationMsgs.ConfirmEnableSourceFirst + infName + EnterpriseAuthenticationMsgs.ConfirmEnableSourceScond, function (flag) {
                if (flag) {
                    $(self).parent().submit();
                } else {
                    return false;
                }
            });

        })
    },
    enabledAuthenticate: function () {
        $("input[name='enabledAuthenticate']").change(function () {
            var _ts = $(this);
            if ('true'==_ts.val()) {
                $.confirm(EnterpriseAuthenticationMsgs.ConfirmEnableOutside, function (flag) {
                    if (flag) {
                        modalAuthState( 'change_authentication_true' );
                    } else {
                        _ts.prop('checked',false);
                        $("input[name='enabledAuthenticate'][value='false']").prop('checked',true);
                        return false;
                    }
                })
            } else {
                $.confirm(EnterpriseAuthenticationMsgs.ConfirmEnableSystem, function (flag) {
                    if (flag) {
                        modalAuthState( 'change_authentication_false' );
                    } else {
                        _ts.prop('checked',false);
                        $("input[name='enabledAuthenticate'][value='true']").prop('checked',true);
                        return false;
                    }
                })
            }
        });
        function modalAuthState( url ) {
            $.modal({
                content: EnterpriseAuthenticationMsgs.settingAuthState,
                size: 'sm',
                disabled: true,
                cancel: function() {location.href = url;}
            });
        }

    },
    alertSetting: function () {
        $("#not_setting").bind("click", function () {
            $.message(EnterpriseAuthenticationMsgs.ConfirmNoAuthority, false);
            $(this).removeAttr("checked");
        });
    },
    addAuthenticate: function () {
        $('.addAuthenticate').on('click', function (e) {
            //console.log(AuthenticationPlusMsgs)
            var self = this;
            if (e && e.preventDefault) {
                e.preventDefault();
            } else {
                window.event.returnValue = false;
            }
            var auName = $(self).attr('auName');
            $.confirm(AuthenticationPlusMsgs.ConfirmAddFirst+" " + auName +" " +AuthenticationPlusMsgs.ConfirmAddSecond, function (flag) {
                //console.log(flag);
                if (flag) {
                    location.href = $(self).attr('href');
                } else {
                    return false;
                }
            })

        })
    },
    updateAuthenticate: function () {
        $('.edit-auth').on('click', function (e) {
            if(e.preventDefault){
                e.preventDefault();
            }else{
                window.event.returnValue=false;
            }
            $.confirm($.i18n.prop('idp2.enterprise.auth.update.alert'),function(flag){
                if(flag){

                    return false;
                }
            })
        })
    }
};


/**
 * employee_group_form.jsp
 * @constructor
 */
function EmployeeGroupForm() {
    this.singleSelect();
    this.multipleSelect();
}

EmployeeGroupForm.prototype = {
    singleSelect: function () {
        $('#groupManagerUuid').select2({
            language: 'zh-CN'
        });
    },
    multipleSelect: function () {
        $('#employeeUuids').select2({
            language: 'zh-CN',
            placeholder: $.i18n.prop('idp2.enterprise.EmployeeGroupForm.alert'),
            allowClear: true
        });
    }
};


/**
 * radius_user_mgt.jsp
 * @constructor
 */
function RadiusUserMgt() {
    this.resetPassword();
    this.bindConfidm();
    this.userOTP();
}

RadiusUserMgt.prototype = {
    userOTP: function () {
        $("a.userOTP").click(function () {
            var $this = $(this);
            var uuid = $this.attr("uuid");
            $.modal({
                title: "OTP",
                size: 'sm',
                content: "<div class='text-center'> <img src='user_qrcode_" + uuid + "'/></div>",
                modalFooter: {btnSubTxt: '', btnCalTxt: RadiusUserMGTMsgs.ConfirmResetPassModleClose}
            });
        });
    },
    resetPassword: function () {
        $("a.resetPassword").click(function () {
            var $this = $(this);
            var uuid = $this.attr("uuid");
            var configUuid = $this.attr("configUuid");
            var account = $this.attr("account");

            //console.log(1)

            $.confirm(RadiusUserMGTMsgs.ConfirmResetPassFirst +" "+ account +" "+ RadiusUserMGTMsgs.ConfirmResetPassSecond, function (flag) {
                if (flag) {
                    $.post("user_reset_password_" + uuid + "/" + configUuid, {"_csrf": $("input[name='_csrf']").val()}, function (data) {
                        var json = $.parseJSON(data);
                        $.modal({
                            title: RadiusUserMGTMsgs.ConfirmResetPassModleTitle,
                            content: RadiusUserMGTMsgs.ConfirmResetPassModleSuccessFirst +" "+ json.account +"'s "+ RadiusUserMGTMsgs.ConfirmResetPassModleSuccessSecond+" <strong>" + json.newPassword + "</strong>",
                            modalFooter: {btnSubTxt: RadiusUserMGTMsgs.ConfirmResetPassModleClose, btnCalTxt: ''}
                        });
                    });
                } else {
                    return false;
                }
            });

        });
    },
    bindConfidm: function () {
        $('.delete_user').each(function (index, ele) {
            //console.log($(ele))
            var userName=$(ele).attr('userName')
            var mess=RadiusUserMGTMsgs.ConfirmDelateFirst+" "+userName+" "+RadiusUserMGTMsgs.ConfirmDelateSecond
            $(ele).confirmA(mess)
        });
    }
};

/**
 *
 * @constructor radius_authorization.jsp
 */
function RadiusAuthorization() {
    this.isGetData=false;
    this.isfirst=false;
    var self = this;
    var option = {
        dataUrl: contextPath + "/enterprise/radius/authorization/config/query",//数据接口,
        length: 13,//每次加载数据条数
        content: $('.radiusMore'),//容器，数据显示的dom节点
        searchEle:'.serach-input-app',//搜索框
        get_more_btn: $('#loadMore'),//触发请求数据的dom节点
        data:{
            pageNumber:null,
            groupName:null,
            name:null,
            perPageSize:13,
            thisPerPageSize:13
        },
        dataCallBack:function(data,option){
//                数据加载完处理回调函数
            self.dataCallBack(data,option)
        },
        searchCallBack:function(data,option){
//                  搜索数据加载完的回调函数
            self.searchCallBack(data,option)
        }
    };
    new LoadeMore(option)

    this.init();
}


RadiusAuthorization.prototype = {
    init: function () {
        this.bindConfirm();
        this.bindClick();
    },
    //定位到之前选中的应用
    selectCurrentApp: function (data) {
        var self = this;
        var configUuid = $.getUrlParam("configUuid");
        if(configUuid && !/[`<>\/()]/.test(configUuid) ){
            var isfind = false;
            if(!this.isGetData){
                //循环找左侧对应的组
                for(var i=0;i<data.length;i++){
                    if(data[i].uuid==configUuid){
                        self.getData(data[i].uuid)
                        data[i].active=true;
                        isfind = true;
                        this.isGetData=true;
                        break;
                    }
                }
                if(!isfind){
                    $('#loadMore').click();
                }
            }
        }else{
            //页面第一次加载加载第一条个组的数据
            if(!this.isGetData){
                this.getData(data[0].configUuid)
                this.isGetData=true;
                data[0].active=true;
            }
        }
        return data;
    },
//加载数据完的回调
    dataCallBack: function (data,option) {
        this.leftData=data;
        $('#radiusNums').html(data.fullListSize);
        var str='';
        if(data.fullListSize==0){
            str = '<li class="active"><a href="${contextPath}/enterprise/radius/form/create">'+ $.i18n.prop('enterprise.radius.authorization.page.list.btn.empty.tips')+'</a></li>'
            $(str).appendTo(option.content)
            $('#loadMore').hide();
        }else if(data.fullListSize!=0){
            this.selectCurrentApp(data.list);
            str = this.renderUl(data,option);
            $(str).appendTo(option.content);
            if(!this.isfirst){
                var currentApp =$('.list-group-item-text.active');
                if(currentApp.length!=0){
                    this.isfirst=true;
                    $('.st-scroller-targ-middle').scrollTop(currentApp.offset().top-500)
                }
            }
            if(data.totalPages==1){
                $('#loadMore').hide();
            }
        }

    },
    bindConfirm: function () {
        var _self = this;
        $('#radiusTable').on('click','.delate_user', function (e) {
            var self = this;
            if(e&& e.preventDefault){
                e.preventDefault();
            }else{
                window.event.returnValue = false;
            }
            var userName = $(self).attr('username');
            //console.log(userName)
            var mess=RadiusAuthorizationMsgs.ConfirmDeleteFirst+" "+userName+" "+RadiusAuthorizationMsgs.ConfirmDeleteSecond
            $.confirm(mess,function(flag){
                if(flag){
                    $('.box.box-primary.min-height350').loader()
                    var action = $(self).parent().attr('action');
                    var _csrf = $('#csrfHidden').val();
                    var groupUuid = $(self).parent().find('input[name="groupUuid"]').val();
                    var configUuid = $(self).parent().find('input[name="configUuid"]').val();
                    $.post(action,{_csrf:_csrf,groupUuid:groupUuid,configUuid:configUuid},function(){
                        _self.getData(configUuid);
                        $('.box.box-primary.min-height350').loader('hide')
                    })
                }else{
                    return false;
                }
            });
        })
        $('input[name="useIDPUserLogin"]').on('change', function (e) {
            var useIDPUserLogin = $(this).prop('checked')
            var action =$(this).parents('.auth_all_group_form').attr('action');
            var _csrf = $('#csrfHidden').val();
            var configUuid = _self.datas.configUuid;
            $.post(action,{_csrf:_csrf,configUuid:configUuid,useIDPUserLogin:useIDPUserLogin}, function (data) {
                if(useIDPUserLogin){
                    $('#UpdateGorup').hide();
                }else{
                    $('#UpdateGorup').show().attr('href','user_mgt_group?configUuid='+configUuid);
                }


            })
        })
    },
    //搜索完的回调
    searchCallBack: function (data,option) {
        var str ='';
        if(data.fullListSize==0){
             str = '<li class="" style="padding: 0 15px;"><p>'+ $.i18n.prop('enterprise.account.parents.form.modal.table.search.empty')+'</p> </li>'
            option.content.html(str)
            $('#loadMore').hide();
        }else if(data.fullListSize!=0){
             str = this.renderUl(data,option);
            option.content.html(str);
            if(data.totalPages<=1){
                $('#loadMore').hide();
            }else{
                $('#loadMore').show();
            }
        }
    },
    //渲染左侧列表
    renderUl: function (datas,option) {
        var str="";
        $.each(datas.list, function (index,val) {
            if(val.active){
                str+='<li class="list-group-item-text active"> <a href="javascript:void(0);" configuuid="'+val.uuid+'"> <h5 class="list-group-item-heading">'+val.name+'<small data-toggle="tooltip" class="branch" data-original-title="'+val.authPort+'" style="padding-left:5px;">('+ $.i18n.prop("enterprise.radius.authorization.port")+':'+val.authPort+')</small></h5> <i class="fa fa-angle-right pull-right"></i> </a> </li>'

            }else{
                str+='<li class="list-group-item-text"> <a href="javascript:void(0);" configuuid="'+val.uuid+'"> <h5 class="list-group-item-heading">'+val.name+'<small data-toggle="tooltip" class="branch" data-original-title="'+val.authPort+'" style="padding-left:5px;">('+ $.i18n.prop("enterprise.radius.authorization.port")+':'+val.authPort+')</small></h5> <i class="fa fa-angle-right pull-right"></i> </a> </li>'
            }
        })
        return str;
    },
    bindClick: function () {
        var self = this;
        $('.box-table-limith').unbind().on('click','.list-group-item-text', function (event) {
            var configuuid = $(this).find('a').attr('configuuid');
            self.getData(configuuid);
            $('.list-group-item-text').removeClass('active');
            $(this).addClass('active')
        })
    },
    getData: function (configUuid) {
        var self = this;
        if(typeof ouTableData.fnClearTable!="undefined"){
            ouTableData.fnClearTable()
            ouTableData.fnDestroy()
        }
        $.get(contextPath+'/enterprise/radius/authorization/json',{configUuid:configUuid}, function (data) {
            self.datas=data;
            var option =self.getOption()
            Desc.prototype.InitJsDataTable(option.obj,option.data,option.columns);
            self.updateInfo(data);
        })
    },
    getOption: function () {
        var self = this;
        return {
            obj:"#radiusTable",
            data:self.datas.udGroupDtos,
            columns:[
                {
                    "data": "groupName"//设置此项搜索功能才可用
                },
                {
                    "data": null,
                    "render": function (td, cellData, rowData, row, col) {
                        switch (rowData.type){
                            case 'SELF_GROUP':
                                return $.i18n.prop('enterprise.ud.ListAll.type.self.group');
                                break;
                            case 'DEFAULT_GROUP':
                                return $.i18n.prop('enterprise.ud.ListAll.type.default.group');
                                break;
                            case 'EXTERNAL_GROUP':
                                return $.i18n.prop('enterprise.ud.ListAll.type.external.group');
                                break;
                        }
                    }
                },{
                    "data": null,
                    "render": function (td, cellData, rowData, row, col) {
                        var path = $.splitRoute(rowData.ouDirectory)
                        var str='<span class="branch" title="'+rowData.ouDirectory+'" data-toggle="tooltip">'+path+'</span>'
                        return str;
                    }
                },
                {
                    "data":null,
                    "render": function (td, cellData, rowData, row, col) {
                        var str="";
                        var _csrf=$('#csrfHidden').val();
                        str+='<form id="submit-delete" action="delete_radius_group" method="post">'
                        str+='<input id="csrfHidden" type="hidden" name="_csrf" value="'+_csrf+'">'
                        str+='<input type="hidden" name="groupUuid" value="'+rowData.uuid+'">'
                        str+='<input type="hidden" name="configUuid" value="'+self.datas.enterpriseConfigurationDto.uuid+'">'
                        str+='<button type="submit" class="btn btn-sm btn-danger-border delate_user" username="'+rowData.groupName+'">'
                        str+='<span><i class="idpicon i-cha"></i></span> <span>'+ $.i18n.prop("enterprise.ud.ListAll.btn.delete")+'</span> </button> </form>'
                        return str;
                    }
                }
            ]
        }
    },
    //更新页面信息
    updateInfo: function (data) {
        if(this.leftData.fullListSize == 0||this.datas.enterpriseConfigurationDto.useIDPUserLogin){
            $('#UpdateGorup').hide();
        }else{
            $('#UpdateGorup').show();
            $('#UpdateGorup').attr('href',"user_mgt_group?configUuid="+data.configUuid);
        }
        $('.auth_all_group_form').find('input[name="configUuid"]').val(this.datas.configUuid);
        $('.auth_all_group_form').find('input[name="useIDPUserLogin"]').prop('checked',this.datas.enterpriseConfigurationDto.useIDPUserLogin)
        $('#groupsNums').html(data.udGroupDtos.length);
    }
}

/**
 * employee_group_update_form.jsp
 * @constructor
 */
function EmployeeGroupUpdateForm() {
    this.singleSelect();
}

EmployeeGroupUpdateForm.prototype = {
    singleSelect: function () {
        $('#groupManager').select2({
            language: 'zh-CN'
        });
    }
};

/**
 * application_plus.jsp
 * @param name
 * @constructor
 */
function ApplicationPlus(name, custom) {
    this.loadMore(name, custom);
    this.submitApply();
    this.menueActive();
}

ApplicationPlus.prototype = {
    menueActive: function () {
      var custom= HtmlUtil.htmlEncode($.getUrlParam("custom")) ;
       if(!custom){
           $('#myTab .all').addClass('active');
           return;
       }
        switch(custom){
            case "":
                $('#myTab .all').addClass('active');
                break;
            case "false":
                $('#myTab .standard').addClass('active');
                break;
            case "true":
                $('#myTab .enterprise').addClass('active');
                break;
        }

    },
    submitApply: function () {
        $("a#submitApply").click(function () {
            $("#entModalBody").load("load_application_apply", function () {
                $("#entModalLabel").html(""+ ApplicationApplyFormMsgs.submitApplication +"");
                $("#enterpriseModal").modal("show");
                $("#enterpriseModal").on('shown.bs.modal',function(e){
                    $(e.target).find('#applyName').focus();
                })
            });

            $("#entModalSubmit").click(function () {
                var result = true;
                var $name = $("input#applyName");
                if ($.trim($name.val()) == '') {
                    $name.parent().parent().addClass("has-error");
                    $name.focus();
                    result = false;
                } else {
                    $name.parent().parent().removeClass("has-error");
                }

                var $description = $("textarea#description");
                if ($.trim($description.val()) == '') {
                    $description.parent().parent().addClass("has-error");
                    $description.focus();
                    result = false;
                } else {
                    $description.parent().parent().removeClass("has-error");
                }

                if (result) {
                    var $this = $(this);
                    $("#applyAppForm").ajaxSubmit({
                        url: "submit_application_apply",
                        dataType: "json",
                        type: "post",
                        success: function (data) {
                            if (data.success) {
                                $("div#applyFormDiv").addClass("hidden");
                                $("div#applySuccessDiv").removeClass("hidden");
                                $this.hide();
                            } else {
                                $("#modalMsg").html(data.message).addClass("label label-warning");
                            }
                        }
                    });
                }
            });
        });
    },
    loadMore: function (name, custom) {
        $('#more').more({'address': 'get_load_data', 'name': name, 'custom': custom});
    }
};

/**
 * enterprise_invitation.jsp
 * @constructor
 */
function EnterpriseInvitation() {
    this.addOrRemove();
    this.sendEmail();
    this.sendMessTimer = null;
}

EnterpriseInvitation.prototype = {
    addOrRemove: function () {
        $("body").on("click", ".addButton", function () {
            var index = $(this).data("index");
            if (!index) {
                index = 1;
                $(this).data("index", 1)
            }
            index++;
            $(this).data("index", index);
            var template = $(this).attr("id"),
                $templateEle = $("#" + template + 'Template'),
                $row = $templateEle.clone().removeAttr("id").insertBefore($templateEle).removeClass("hide");
            var length = $('.error_message').length;
            var id = length - 1;
            $row.find('span').eq(0).attr('id', 'message' + id);

            $row.on("click", ".removeButton", function () {
                $row.remove();
            })
        });
    },
    sendEmail: function () {
        var self = this;
        $('#submitBtn').click(function () {

            $('.error_message').each(function () {
                $(this).html('');
            });
            var _this = this;
            $(this.form).ajaxSubmit({
                url: "enterprise_invitation",
                dataType: "json",
                type: "post",
                success: function (data) {
                    $(_this).attr("disabled", "");
                    if (data.success) {
                        clearTimeout(self.sendMessTimer)
                        self.sendMessTimer = setTimeout(function () {
                            $(_this).removeAttr("disabled");
                        }, 10000)

                        var $success = $('#success');
                        $success.html($.i18n.prop('enterprise.setting.enterprise.invitation.page.prompt.success'));
                        $success.addClass("label");
                        $success.addClass("label-success");
                    } else {
                        $(_this).removeAttr("disabled");
                        var map = data.map;
                        $(map).each(function () {
                            $.each(this, function (key, value) {
                                var $2 = $('#message' + key);
                                $2.html(value);
                                $2.addClass('label');
                                $2.addClass('label-warning');
                            });
                        });
                    }
                }
            });
        });
    }

};

/**
 * employee_group_users.jsp
 * @constructor
 */
function EmployeeGroupUsers() {
    this.multiSelect();
    this.selectAll();
    this.deselectAll();
}

EmployeeGroupUsers.prototype = {
    multiSelect: function () {
        $('.searchable').multiSelect({
            selectableHeader: "<input type='text' class='form-control' autocomplete='off' placeholder='"+ $.i18n.prop("idp2.enterprise.input.placeholder.staffname")+"'>",
            selectionHeader: "<input type='text' class='form-control' autocomplete='off' placeholder='"+ $.i18n.prop("idp2.enterprise.input.placeholder.staffname")+"'>",
            afterInit: function (ms) {
                var that = this,
                    $selectableSearch = that.$selectableUl.prev(),
                    $selectionSearch = that.$selectionUl.prev(),
                    selectableSearchString = '#' + that.$container.attr('id') + ' .ms-elem-selectable:not(.ms-selected)',
                    selectionSearchString = '#' + that.$container.attr('id') + ' .ms-elem-selection.ms-selected';

                that.qs1 = $selectableSearch.quicksearch(selectableSearchString)
                    .on('keydown', function (e) {
                        if (e.which === 40) {
                            that.$selectableUl.focus();
                            return false;
                        }
                        if (e.keyCode == 13) {
                            $selectableSearch.focus();
                            return false;
                        }
                    });

                that.qs2 = $selectionSearch.quicksearch(selectionSearchString)
                    .on('keydown', function (e) {
                        if (e.which == 40) {
                            that.$selectionUl.focus();
                            return false;
                        }

                        if (e.keyCode == 13) {
                            $selectionSearch.focus();
                            return false;
                        }
                    });
            },
            afterSelect: function () {
                this.qs1.cache();
                this.qs2.cache();
            },
            afterDeselect: function () {
                this.qs1.cache();
                this.qs2.cache();
            }
        });
    },
    selectAll: function () {
        $('#select-all').click(function () {
            $('#employeeUuids').multiSelect('select_all');
            return false;
        });
    },
    deselectAll: function () {
        $('#deselect-all').click(function () {
            $('#employeeUuids').multiSelect('deselect_all');
            return false;
        });
    }


};

function EnterpriseReportForm(legendData, seriesData, histogramData, reportType) {
    this.pieChart(legendData, seriesData, histogramData, reportType);
    this.changeReport();
    this.initDatepicker()
}

EnterpriseReportForm.prototype = {
    pieChart: function (legendData, seriesData, histogramData, reportType) {
        $().ready(
            function () {
                var chart = echarts.init(document.getElementById("pieChart"));
                var option;
                if (reportType == 'PieChart') {
                    option = {
                        title: {
                            text: ReportMsgs.pieChartTitle,
                            subtext: ReportMsgs.pieChartType,
                            x: 'center'
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: "{b} : {c} ({d}%)"
                        },
                        legend: {
                            orient: 'vertical',
                            left: 'left',
                            data: legendData
                        },
                        series: [
                            {
                                name: ReportMsgs.pieChartSource,
                                type: 'pie',
                                radius: '55%',
                                center: ['50%', '60%'],
                                data: seriesData
                                ,
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ]
                    };
                } else {
                    option = {
                        color: ['#3398DB'],
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: [
                            {
                                type: 'category',
                                data: legendData,
                                axisTick: {
                                    alignWithLabel: true
                                }
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value'
                            }
                        ],
                        series: [
                            {
                                name: ReportMsgs.pieChartNum,
                                type: 'bar',
                                barWidth: '60%',
                                data: histogramData
                            }
                        ]
                    };

                }

                chart.setOption(option);
            }
        );
    },

    changeReport: function () {
        $("#reportType").change(function () {
            $("#submitButton").click();
        });
    },
    initDatepicker: function () {
        if($.fn.datepicker){
            $('input.datepicker').datepicker({
                language: 'zh-CN',
                format: "yyyy-mm-dd",
                todayHighlight: true,
                autoclose:true
            });
        }else if($.fn.datetimepicker){
            var date = new Date();
            $('input.datepicker').datetimepicker({
                language : "zh-CN",
                format: 'yyyy-mm-dd hh:ii',
                endDate:date,
                todayBtn:  1,
                autoclose: 1,
                todayHighlight: 1,
                forceParse: 0,
                showMeridian: 1,
                pickerPosition:'bottom-right',
                initialDate:date
            });
        }



    }

};

/**
 * announcement_form.jsp
 * @constructor
 */
function AnnouncementForm() {
    this.uploadImage();
    this.searchReceiver();
    this.updateType();
    this.submitBtnDisable();
}

AnnouncementForm.prototype = {
    submitBtnDisable: function () {
      $('#formDto').on('submit', function (e) {
          $(this).find('button[type="submit"]').addClass('disabled').attr('disabled','disabled');

      })
    },
    uploadImage: function () {
        $("#imageFile").change(function () {
            var $this = $(this);
            $(this.form).ajaxSubmit({
                url: "upload_image",
                dataType: "json",
                type: "post",
                success: function (data) {
                    //console.log("Msg: " + data.message);
                    if (data.message == null) {
                        $this.next().removeClass("hidden").attr("src", "../../../../public/image/" + data.uuid + "?w=80");
                        $("#imageUuid").val(data.uuid);
                    } else {
                        $.message(data.message);
                    }
                }
            });
        });
    },
    searchReceiver:function(){
        $("#receiver").select2SearchInit({
            url: contextPath + '/enterprise/setting/announcement/receiver/search',
            searchField: 'items',  // 查找时的数据组
            viewField: 'name'  // 选中后要显示的字段
        });
    },
    updateType:function(){
        $(".type_radio").change(function(){
            var type = $(this).val();
            if(type == 'NOTICE'){
                $("#receiverDiv").show()
            }else{
                $("#receiverDiv").hide();
            }
        });
    }
};

function Datepicker() {
    this.initDatepicker();
}
Datepicker.prototype = {
    initDatepicker: function () {
        $('input.datepicker').datepicker({
            autoclose: true,
            language: 'zh-CN',
            format: 'yyyy-mm-dd',
            startDate: '+1d',
            todayHighlight: true
        });
    }
};


/**
 * edit_ou.jsp
 * @constructor
 */
function EditOU() {
    this.selectAccount();
    this.clickSubmit();
}

EditOU.prototype = {
    selectAccount: function () {
        var oUUuid = $("#oUUuid").val();
        $("#mgtSelect").select2SearchInit({
            url: contextPath + '/enterprise/ud/ad/account/organizationUnit/manager/search?oUUuid=' + oUUuid,
            searchField: 'items',  // 查找时的数据组
            viewField: 'username'  // 选中后要显示的字段
        });

    },clickSubmit: function(){
        $("#scimOrganBtn").unbind("click").on("click", function () {
            //var form = $("#scimOrganFormDto");
            //$("#myTabContent").loader("正在修改并且同步数据...");
            //$("#scimOrganFormDto").submit();
            //$.post($(form).attr('action'), $(form).serialize(), function (data) {
            //    if(data.ouUuid != ''){
            //        EditOU.prototype._showSCIMModel(data);
            //    }else{
            //        $("#myTabContent").loader("hide");
            //        $("#submitResult").html("修改成功");
            //        //window.location.reload();
            //    }
            //
            //});
        });
    }, _showSCIMModel:function(organSuccessCount,organFailedCount){
        $("#myTabContent").loader("hide");
        $("#organEditSuccessCount").text(organSuccessCount);
        $("#organEditFailedCount").text(organFailedCount);
        $("#scimEditResultModel").modal("show");
    }
};

function UpdateApplicationStatus() {
    //this.updateStatus();
}
UpdateApplicationStatus.prototype = {
    updateStatus: function () {
        /**
         * 启用应用
         */
        $(".enabled_app").unbind("click").on("click", function () {
            $(this).parent(".enabled_form").ajaxSubmit({
                success: function () {
                    location.reload(true);
                }
            });

        });
        /**
         * 禁用应用
         */
        $(".disable_app").unbind("click").on("click", function () {
            var name = $(this).attr("name");
            var self = this;
            $.confirm('确认禁用 (' + name + ')?', function (flag) {
                if (flag) {
                    $(self).parent(".disable_form").ajaxSubmit({
                        success: function () {
                            location.reload(true);
                        }
                    });
                } else {
                    return false;
                }
            });
        });
        /**
         * 启用SSO
         */
        $(".enabled_sso").unbind("click").on("click", function () {
            $(this).parent(".enabled_form").ajaxSubmit({
                success: function () {
                    location.reload(true);
                }
            });

        });
        /**
         * 禁用SSO
         */
        $(".disable_sso").unbind("click").on("click", function () {
            var name = $(this).attr("name");
            var self = this;
            $.confirm($.i18n.prop('idp2.enterprise.close.2factor', name), function (flag) {
                if (flag) {
                    $(self).parent(".disable_form").ajaxSubmit({
                        success: function () {
                            location.reload(true);
                        }
                    });
                }
            });

        });
    }
}

function EnterpriseConfigSCIM() {
    this.initialTime();
    this.sysnchronizationAccountLinking();
}

EnterpriseConfigSCIM.prototype = {
    initialTime: function () {
        var date = new Date();
        $('#datepicker').val("");
        $('#datepicker').datetimepicker({
            language: "zh-CN",
            format: 'yyyy-mm-dd hh:ii',
            startDate: date,
            weekStart: 0,
            todayBtn: 1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 2,
            forceParse: 0,
            showMeridian: 1,
            pickerPosition: 'top-right',
            initialDate: date
        });
    },
    sysnchronizationAccountLinking: function () {
        $("#submit").unbind("click").on("click", function () {
            var size = $(this).attr("size");
            if (size > 0) {
                var pushType = $("input[name='pushType']:checked").val();
                if (pushType == "NOW") {
                    $(".log-mss-box").loader($.i18n.prop('idp2.enterprise.syncing'));
                }

                return true;
            } else {
                $.message($.i18n.prop('idp2.enterprise.syncing.none'))
                return false;
            }

        });
    }
}

//auth_applications.jsp
function AuthApplication(){
    var self=this;
    this.isGetData=false;
    this.isfirst=false;

    var option = {
        dataUrl: contextPath + "/enterprise/authorization/applications/query",//数据接口,
        length: 13,//每次加载数据条数
        content: $('.groupMore'),//容器，数据显示的dom节点
        searchEle:'.serach-input-app',//搜索框
        get_more_btn: $('#loadMore'),//触发请求数据的dom节点
        data:{
            pageNumber:null,
            groupName:null,
            name:null,
            perPageSize:13,
            thisPerPageSize:13
        },
        dataCallBack:function(data,option){
//                数据加载完处理回调函数
            self.dataCallBack(data,option)
        },
        searchCallBack:function(data,option){
//                  搜索数据加载完的回调函数
            self.searchCallBack(data,option)
        }
    };
    new LoadeMore(option)
    this.bindConfirm();

}
AuthApplication.prototype = {
    //定位到之前选中的应用
    selectCurrentApp: function (data) {
        var appUuid = $.getUrlParam("appUuid");
        if(appUuid && !/[`<>\/()]/.test(appUuid)){
            var isfind = false;
            if(!this.isGetData){
                //循环找左侧对应的组
                for(var i=0;i<data.length;i++){
                    if(data[i].applicationUuid==appUuid){
                        this.getData(data[i].applicationUuid)
                        data[i].active=true;
                        isfind = true;
                        this.isGetData=true;
                        break;
                    }
                }
                if(!isfind){
                    $('#loadMore').click();
                }
            }
        }else{
            //页面第一次加载加载第一条个组的数据
            if(!this.isGetData){
                this.getData(data[0].applicationUuid)
                this.isGetData=true;
                data[0].active=true;
            }
        }
        return data;
    },
    //删除授权组
    bindConfirm: function () {
        var _self = this;
        $('#groupList').on('click','.delate_user', function (e) {
            var self = this;
            if(e&& e.preventDefault){
                e.preventDefault();
            }else{
                window.event.returnValue = false;
            }
            var userName = $(self).attr('userName');
            //console.log(userName)
            $.confirm($.i18n.prop('enterprise.authorization.application.page.confirm.delete',userName),function(flag){
                if(flag){
                    $('.box.box-primary.min-height350').loader()
                    var action = $(self).parent().attr('action');
                    var _csrf = $('#csrfHidden').val();
                    var employeeGroupUuid = $(self).parent().find('input[name="employeeGroupUuid"]').val();
                    var applicationUuid = $(self).parent().find('input[name="applicationUuid"]').val();
                    $.post(action,{_csrf:_csrf,employeeGroupUuid:employeeGroupUuid,applicationUuid:applicationUuid},function(){
                        _self.getData(applicationUuid);
                        $('.box.box-primary.min-height350').loader('hide')
                    })
                }else{
                    return false;
                }
            });
        })
    },
    //加载数据完的回调
    dataCallBack: function (data,option) {
        $('#appNum').html(data.fullListSize)
        var str ='';
        if(data.fullListSize==0){
            str = '<li class="active noGroup hidden"><a href="'+contextPath+'"/enterprise/index">'+ $.i18n.prop('enterprise.authorization.application.form.page.table.empty') +'</a></li>'
            $(str).appendTo(option.content)
            $('#loadMore').hide();
        }else if(data.fullListSize!=0){
            this.selectCurrentApp(data.list);
             str = this.renderUl(data,option);
            $(str).appendTo(option.content);
            if(!this.isfirst){
                var currentApp =$('.list-group-item-text.active');
                if(currentApp.length!=0){
                    this.isfirst=true;
                    $('#stScrollerTargetMiddleAppAuth').scrollTop(currentApp.offset().top-500)
                }
            }
            if(data.totalPages==1){
                $('#loadMore').hide();
            }
        }
        this.bindClick();
    },
    //搜索完的回调
    searchCallBack: function (data,option) {
        var str ='';
        if(data.fullListSize==0){
             str = '<li class="" style="padding: 0 15px;"><p>'+ $.i18n.prop('ui.desc.inputChange.no.search') +'</p> </li>'
            option.content.html(str)
            $('#loadMore').hide();
        }else if(data.fullListSize!=0){
             str = this.renderUl(data,option);
            option.content.html(str);
            if(data.totalPages<=1){
                $('#loadMore').hide();
            }else{
                $('#loadMore').show();
            }
        }
    },
    //渲染左侧列表
    renderUl: function (datas,option) {
        var str="";
        $.each(datas.list, function (index,val) {

            if(val.active){
                str+='<li class="list-group-item-text active"> <a href="javascript:void(0);" appUuid="'+val.applicationUuid+'"> <h5 class="list-group-item-heading">'+val.name+'<small data-toggle="tooltip" class="branch" data-original-title="'+val.purchaseId+'" style="padding-left:5px;">('+val.purchaseId+')</small></h5> <i class="fa fa-angle-right pull-right"></i> </a> </li>'

            }else{
                str+='<li class="list-group-item-text"> <a href="javascript:void(0);" appUuid="'+val.applicationUuid+'"> <h5 class="list-group-item-heading">'+val.name+'<small data-toggle="tooltip" class="branch" data-original-title="'+val.purchaseId+'" style="padding-left:5px;">('+val.purchaseId+')</small></h5> <i class="fa fa-angle-right pull-right"></i> </a> </li>'
            }
        })
        return str;
    },
    //左侧点击事件
    bindClick: function () {
        var self = this;
        $('body').unbind().on('click','.list-group-item-text', function (event) {
            var appuuid = $(this).find('a').attr('appuuid');
            self.getData(appuuid);
            $('.list-group-item-text').removeClass('active');
            $(this).addClass('active')
        })
    },
    //拉取右侧表格数据
    getData: function (appuuid) {
        var self = this;
        if(typeof ouTableData.fnClearTable!="undefined"){
            ouTableData.fnClearTable()
            ouTableData.fnDestroy()
        }
        $('.table-responsive').loader($.i18n.prop('enterprise.ps.permission.list.page.datatable.loadMsg'))
        $.get(contextPath+"/enterprise/authorization/applications/json",{"appUuid":appuuid}, function (data) {
            if(!data.udGroupDtos){
                return;
            }
            self.datas=data.udGroupDtos;
            $('.table-responsive').loader('hide');
            $.each(self.datas, function (index,val) {
                val.currentAppUuid=data.currentAppUuid
            })
            var option =self.optionFn()
            Desc.prototype.InitJsDataTable(option.obj,option.data,option.columns)
            self.updateInfo(data);
        })
    },
    //datatables 参数配置
    optionFn: function () {
        var self=this;
        return {
            obj:"#groupList",
            data:self.datas,
            columns:[
                {
                    "data": "groupName"//设置此项搜索功能才可用
                },
                {
                    "data": null,
                    "render": function (td, cellData, rowData, row, col) {
                        switch (rowData.type){
                            case 'SELF_GROUP':
                                return $.i18n.prop('enterprise.ud.ListAll.type.self.group');
                                break;
                            case 'DEFAULT_GROUP':
                                return $.i18n.prop('enterprise.ud.ListAll.type.default.group');
                                break;
                            case 'EXTERNAL_GROUP':
                                return $.i18n.prop('enterprise.ud.ListAll.type.external.group');
                                break;
                        }
                    }
                },{
                    "data": null,
                    "render": function (td, cellData, rowData, row, col) {
                        var path = $.splitRoute(rowData.ouDirectory)
                        var str='<span class="branch" title="'+rowData.ouDirectory+'" data-toggle="tooltip">'+path+'</span>'
                        return str;
                    }
                },
                {
                    "data":"childrenUDAccountNumber"
                },
                {
                    "data":null,
                    "render": function (td, cellData, rowData, row, col) {
                        var str="";
                        var _csrf=$('#csrfHidden').val();
                        str+='<form id="submit-delete" action="delete_application_group" method="post">'
                        str+='<input id="csrfHidden" type="hidden" name="_csrf" value="'+_csrf+'">'
                        str+='<input type="hidden" name="employeeGroupUuid" value="'+rowData.uuid+'">'
                        str+='<input type="hidden" name="applicationUuid" value="'+rowData.currentAppUuid+'">'
                        str+='<button type="submit" class="btn btn-danger-border delate_user" username="'+rowData.groupName+'">'
                        str+='<span><i class="idpicon i-cha"></i></span> <span>'+ $.i18n.prop("enterprise.ud.ListAll.btn.delete")+'</span> </button> </form>'
                        return str;
                    }
                }
            ]
        }
    },
    //更新页面信息
    updateInfo: function (data) {
        if(data.appList.length == 0){
            $('#upDateApp').hide();
        }else{
            $('#upDateApp').show();
            $('#upDateApp').attr('href',"users_"+data.currentAppUuid)
        }
        $('#appHasAuth').html(data.udGroupDtos.length);
    }
}

//auth_user_groups.jsp
function AuthUserGroup(){
    this._csrf=$('#csrfHidden').val()
    var self=this;
    this.isGetData=false;
    this.isfirst=false;
    var option = {
        dataUrl: contextPath + "/enterprise/authorization/groups/query",//数据接口,
        length: 13,//每次加载数据条数
        content: $('.groupMore'),//容器，数据显示的dom节点
        searchEle:'.serach-input-user',//搜索框
        get_more_btn: $('#loadMore'),//触发请求数据的dom节点
        data:{
            pageNumber:null,
            groupName:null,
            perPageSize:13,
            thisPerPageSize:13
        },
        dataCallBack:function(data,option){
//                数据加载完处理回调函数
           var newdata = self.selectCurrentGroup(data);
            self.dataCallBack(newdata,option);

        },
        searchCallBack:function(data,option){
//                  搜索数据加载完的回调函数
            self.searchCallBack(data,option)
        }
    };
    new LoadeMore(option);
    this.bindConfirm();
}
AuthUserGroup.prototype={
    selectCurrentGroup: function (data) {
        var currGroupUuid = $.getUrlParam("userGroupUuid");
        if(currGroupUuid && !/[`<>\/()]/.test(currGroupUuid)){
            var isfind = false;
            if(!this.isGetData){
                //循环找左侧对应的组
                for(var i=0;i<data.list.length;i++){
                    if(data.list[i].uuid==currGroupUuid){
                        this.getData(data.list[i].uuid)
                        data.list[i].active=true;
                        isfind = true;
                        this.isGetData=true;
                        break;
                    }
                }
                if(!isfind){
                    $('#loadMore').click();
                }
            }
        }else{
            //页面第一次加载加载第一条个组的数据
            if(!this.isGetData){
                this.getData(data.list[0].uuid)
                this.isGetData=true;
                data.list[0].active=true;
            }
        }
        return data;
    },
    bindConfirm: function () {
        var _self =this;
        $('#appJsonTable').on('click','.delate_app', function (e) {
            var self = this;
            if(e&& e.preventDefault){
                e.preventDefault();
            }else{
                window.event.returnValue = false;
            }
            var appName = $(self).attr('appName');
            $.confirm($.i18n.prop('enterprise.authorization.user.group.page.confirm.delete',appName),function(flag){
                if(flag){
                    $('.box.box-primary.min-height350').loader();
                    var action = $(self).parent().attr('action');
                    var data={
                        "_csrf":$(self).parent().find("input[name='_csrf']").val(),
                        "userGroupUuid":$(self).parent().find("input[name='userGroupUuid']").val(),
                        "applicationUuid":$(self).parent().find("input[name='applicationUuid']").val()
                    }
                    $.post(action,data, function (result) {
                        if(result){
                            _self.getData(data.userGroupUuid);
                            $('.box.box-primary.min-height350').loader('hide')
                        }
                    })
                }else{
                    return false;
                }
            });
        })
    },
    dataCallBack: function (data,option) {
        $('#groupNum').html(data.fullListSize)
        var str=''
        if(data.fullListSize==0){
            str = '<li class="active noGroup hidden"><a href="'+contextPath+'/enterprise/index">'+$.i18n.prop('enterprise.authorization.application.form.page.table.empty')+'</a></li>'
            $(str).appendTo(option.content)
            $('#loadMore').hide();
        }else if(data.fullListSize!=0){
            str = this.renderUl(data,option);
            $(str).appendTo(option.content);
            if(!this.isfirst){
                var currentGroupObj =$('.list-group-item-text.active')
                if(currentGroupObj.length!=0){
                    this.isfirst=true;
                    $('.st-scroller-targ-middle').scrollTop(currentGroupObj.offset().top-500)
                }
            }
            if(data.totalPages==1){
                $('#loadMore').hide();
            }
        }
        this.bindClick();
    },
    searchCallBack: function (data,option) {
        var str='';
        if(data.list.length==0){
            str = '<li class="text-search-error" style="padding: 0 15px;"><p>'+ $.i18n.prop('ui.desc.inputChange.no.search')+'</p> </li>'
            option.content.html(str);
            $('#loadMore').hide();
        }else if(data.fullListSize!=0){
            str = this.renderUl(data,option);
            option.content.html(str);
            if(data.totalPages<=1){
                $('#loadMore').hide();
            }else{
                $('#loadMore').show();
            }
        }
    },
    renderUl: function (datas,option) {
        var str="";
        $.each(datas.list, function (index,val) {
            var samllDirectory=$.splitRoute(val.ouDirectory)
            if(val.active){
                str+='<li class="list-group-item-text active"> <a href="javascript:void(0);" uuid="'+val.uuid+'"> <h5 class="list-group-item-heading">'+val.groupName+'<small data-toggle="tooltip" class="branch" data-original-title="'+val.ouDirectory+'" style="padding-left:5px;">('+samllDirectory+')</small></h5> <i class="fa fa-angle-right pull-right"></i> </a> </li>'

            }else{
                str+='<li class="list-group-item-text"> <a href="javascript:void(0);" uuid="'+val.uuid+'"> <h5 class="list-group-item-heading">'+val.groupName+'<small data-toggle="tooltip" class="branch" data-original-title="'+val.ouDirectory+'" style="padding-left:5px;">('+samllDirectory+')</small></h5> <i class="fa fa-angle-right pull-right"></i> </a> </li>'
            }
        })
        return str;
    },
    bindClick: function () {
        var self = this;
        $('body').unbind().on('click','.list-group-item-text', function (event) {
            var uuid = $(this).find('a').attr('uuid');
            self.getData(uuid);
            $('.list-group-item-text').removeClass('active');
            $(this).addClass('active')
        })
    },
    getData: function (uuid) {
        var self = this;
        if(typeof ouTableData.fnClearTable!="undefined"){
            ouTableData.fnClearTable()
            ouTableData.fnDestroy()
        }
        $.get(contextPath+"/enterprise/authorization/user_groups/json",{"userGroupUuid":uuid}, function (data) {
            self.datas=data;
            var option =self.optionFn()
            Desc.prototype.InitJsDataTable(option.obj,data.appList,option.columns)
            self.updateInfo(data);
        })
    },
    optionFn: function () {
        var self=this;
        return {
            obj:"#appJsonTable",
            data:self.datas,
            columns:[
                {
                    "data": "name"//设置此项搜索功能才可用
                },
                {
                    "data": 'purchaseId'
                },{
                    "data": null,
                    "render": function (td, cellData, rowData, row, col) {
                        var str = '<form id="submit-delete" action="delete_application_info" method="post"><input  type="hidden" name="_csrf" value="'+self._csrf+'"> <input type="hidden" name="userGroupUuid" value="'+self.datas.currentUserGroupUuid+'"> <input type="hidden" name="applicationUuid" value="'+rowData.applicationUuid+'"> <button type="submit" class="btn btn-danger-border delate_app" appname="'+rowData.name+'"> <span><i class="idpicon i-cha"></i></span> <span>'+ $.i18n.prop("enterprise.ud.ListAll.btn.delete")+'</span> </button> </form>'
                        return str;
                    }
                }
            ]
        }
    },
    updateInfo: function (data) {
        if(data.currentUserGroupUuid == ""){
            $('#upDateApp').hide();
        }else{
            $('#upDateApp').show();
            $('#upDateApp').attr('href',"groups_"+data.currentUserGroupUuid)
        }
        $('#appHasAuth').html(data.appList.length);
        $('#userNum').html(data.currentAccountNumber);
    }

}
//pki_users.jsp
function PkiUser(){
    this.bindConfirm();
}
PkiUser.prototype={
    bindConfirm:function(){
        $('.reset-common').on('click', function (e) {
            //console.log(1);
            if(e&& e.preventDefault){
                e.preventDefault()
            }else{
                window.event.returnValue=false;
            }
            var self= this;
            $.confirm(PkiUserMsgs.ConfirmResetFirst+$(self).attr('commName')+PkiUserMsgs.ConfirmResetSecend,function(flag){
                if(flag){
                    $(self).parent().submit();
                }else{
                    return false;
                }
            })
        })
    }
};

//pc_pki_users.jsp
function PCPkiUser(){
    this.bindConfirm();
}
PCPkiUser.prototype={
    bindConfirm:function(){
        $('.reset-common').on('click', function (e) {
            //console.log(1);
            if(e&& e.preventDefault){
                e.preventDefault()
            }else{
                window.event.returnValue=false;
            }
            var self= this;
            $.confirm(PCPkiUserMsgs.ConfirmResetFirst+$(self).attr('commName')+PCPkiUserMsgs.ConfirmResetSecend,function(flag){
                if(flag){
                    $(self).parent().submit();
                }else{
                    return false;
                }
            })
        })
    }
};

//ps_member_relation_ud_account_form.jsp
function PsMemRelationUdAccoForm(){
    this.select2SearchInit();
    this.bindConfirm();
}
PsMemRelationUdAccoForm.prototype={
    select2SearchInit:function(){
        $("#memberRelationUDAccount").select2SearchInit({
            url: '../member_relation_account/search',
            searchField: 'items',  // 查找时的数据组
            viewField: 'name'  // 选中后要显示的字段
        });
    },
    bindConfirm: function () {
        $("a#cancelUDPSMember").click(function () {
            var accountName = $(this).attr('accName');
            $.confirm($.i18n.prop('enterprise.ps.member.relate.modal.confirm.cancel.relation',accountName), function (flag) {
                if (flag) {
                    $.get("../cancel_bind/${formDto.uuid}/${formDto.udAccountUuid}", function () {
                        //完成后重新加载
                        $("#psModalBody").load("../relation_ud_account/${formDto.uuid}");
                    });
                }
            });
        });
    }
}
//employess.jsp
function Employees(){
    this.bindConfirm();
    this.setDropDriect();
    this.updateAccountTwoFactor();
}
Employees.prototype={
    setDropDriect:function(){
        $.setDropDriect('.accunt_table')
    },
    updateAccountTwoFactor: function () {
        $(".accountTwoFactor").click(function(){
            var div = $(this);
            var accountUuid = div.attr("uuid");
            var enable = div.hasClass('active');
            var username = div.attr("username");
            var url ;
            var content;
            if(enable){
                url = contextPath+"/enterprise/user/employee/user2factor/" + accountUuid;
                content = $.i18n.prop('enterprise.user.employee.list.two.factor.confirm',username);
            }else{
                return;
            }
            $.confirm(content, function (flag) {
                if (flag) {
                    $.ajax({
                        url: url,
                        type: "GET",
                        success: function (strData) {
                            window.location.reload();
                        }
                    });
                } else {
                    div.addClass("active").find(".st-switcher-control").val('true');
                }
            })

        });
    },
    bindConfirm:function(){
        var self = this;
        $('.close-secend').each(function (index, ele) {
            var mess = EmployeesMsgs.ConfirmCloseTwofacotrFirst + $(ele).attr('userName') + EmployeesMsgs.ConfirmCloseTwofacotrScend;
            $(ele).confirmA(mess)
        });
        $('.delate-user').each(function (index, ele) {
            var mess = $(ele).attr('firstmess') +" "+ $(ele).attr('secendmess') +" "+ $(ele).attr('thirdmess') + "?";
            $(ele).deleteUser(mess)
        });
        $('.lock-user').each(function (index, ele) {
            var mess = EmployeesMsgs.ConfirmDisableUserFirst + $(ele).attr('userName') + EmployeesMsgs.ConfirmDisableUserSecend;
            var uuid = $(ele).attr('uuid');
            $(ele).on('click', function () {
                $.confirm(mess, function (flag) {
                    if(flag){
                        self.LockUser(uuid);
                    }
                })
            })

        });

        $('.unlock-user').each(function (index, ele) {
            var mess = EmployeesMsgs.ConfirmEableUserFirst + $(ele).attr('userName') + EmployeesMsgs.ConfirmEableUserSecend;
            var uuid = $(ele).attr('uuid');
            $(ele).on('click', function () {
                $.confirm(mess, function (flag) {
                    if(flag){
                        self.UnLockUser(uuid);
                    }
                })
            })

        });

        $('.resetpass').on('click', function () {
            self.clickReset($(this).attr('uuid'),$(this).attr('username'))
        })

        $('.expireTimeBtn').on('click',function(){
            self.expireTime($(this).attr('uuid'),$(this).attr('username'),$(this).attr('expireTime'),$(this).attr('description'))
        });
    },
    LockUser: function (uuid) {
        var self = this;
        $.get("lock_"+uuid ,function (result) {
                if (result.result) {
                    if(result.applications.length>0){
                        self.HandleUserSCIM(result.uuid,result.applications);
                    }else{
                        location.reload()
                        return;
                    }
                }
        })
    },
    UnLockUser: function (uuid) {
        var self = this;
        $.get("unlock_"+uuid,function (result) {
            if (result.result) {
                if(result.applications.length>0){
                    self.HandleUserSCIM(result.uuid,result.applications);
                }else{
                    location.reload();
                    return;
                }
            }
        })
    },
    HandleUserSCIM: function (updateUuids,applistions) {
        var self = this;
        $("#modalUserlock").find('#uuid').val(uuid);
        var options = $.i18n.prop('enterprise.ud.HandleOUCreateMemberSCIM');
        for (var i = 0; i < applistions.length; i++) {
            options += "<label><input type='checkbox' checked name='applications' value='" + applistions[i].applicationUuid +
            "' > " + applistions[i].name + "</label>&nbsp;";
        }
        $('#appListbody').html(options);
        $('#modalUserlock').modal('show');
        var formDataStr= "_csrf=" + $('input[name="_csrf"]').val() + "&updateUuids=" + updateUuids ;
        self.submitScimUser(formDataStr);
    },
    submitScimUser: function (formDataStr) {
        var self = this;
      $('#modalUserlockSubmit').unbind().on('click', function () {
          $("#modalUserlockBody").loader($.i18n.prop('enterprise.ud.HandleOUCreateMemberSCIM.loader'));
          $.each($("input[name=applications]:checked"), function () {
              formDataStr += "&applications=" + $(this).val();
          });
          var action = contextPath+'/enterprise/ud/ad/update/submit_sync_members';
          $.post(action,formDataStr, function (data) {
              $("#modalUserlockBody").loader('hide');
              $('#modalUserlock').modal('hide');
              $.message($.i18n.prop('enterprise.ud.EnterpriseUD.addUDAccount.operate.success'), true,function () {
                  location.reload();
              })
          })
      })
      $('#modalUserlockCancel').unbind().on('click', function () {
          $('#modalUserlock').modal('hide');
          location.reload();
      })
    },
    scimUserResult: function (data) {
        $("#successCount").text(data.successCount);
        $("#failedCount").text(data.failedCount);
        $("#scimResultModel").modal("show");
        $('#scimResultModel').on('hidden.bs.modal', function (e) {
            location.reload();
        })
    },
    clickReset:function(uuid, fullName) {
        //console.log(1);
    $.confirm(EmployeesMsgs.ConfirmResetPassFirst + fullName + EmployeesMsgs.ConfirmResetPassSecend, function (flag) {
        if (flag) {
            var url = contextPath+"/enterprise/user/employee/reset_password/" + uuid;
            $.ajax({
                url: url,
                type: "GET",
                success: function (strData) {
                    //console.log(strData)
                    $("#entModalLabel").html(EmployeesMsgs.ConfirmResetPassModleFirst +strData.name + EmployeesMsgs.ConfirmResetPassModleSecend);
                    //$("#reset-name").html(strData.name);
                    $("#reset-password").text(strData.password);
                }
            });
            $("#enduserModal").modal("show");
            return false;
        } else {
            return false;
        }
    })
    },
    expireTime:function(uuid,username,expireTime,employeeDescription){
        $("#modalUserExpired").modal("show");
        $("#username").text(username);
        $("#employeeUuid").val(uuid);
        $("#employeeExpireTime").val(expireTime);
        $("#employeeDescription").val(employeeDescription);
        $("#modalUserExpiredSubmit").bind("click",function(){
            var form = $("#modalUserExpiredForm");
            $.post($(form).attr('action'), $(form).serialize(), function (result) {
                $.message($.i18n.prop('msg.save.success'), true);
                window.location.reload();
            });
        });

        $("#modalUserExpiredCancel").bind("click",function(){
            window.location.reload();
        });
    }
}

//radius_list
function RadiusList(){
    this.setDropDriect()
}
RadiusList.prototype={
    setDropDriect: function () {
        $.setDropDriect('.radius_list_table')
    }
}


$.fn.deleteUser =function(mess){
    $(this).on('click',function(e){
        var self = this;

        if( e && e.preventDefault){
            e.preventDefault();
        }else{
            window.event.returnValue=false;
        }
        $.confirm(mess, function (flag){
            if(flag){
                $.get($(self).attr('href'),function(result){
                    if(result.applications.length > 0){
                        HandleSCIM(result, result.ouUuid, result.removeUuids.join("&"), null, {"scimHandleMsg": $.i18n.prop('enterprise.ud.removeUDAccount.confirm.scimHandleMsg')});
                    }else{
                        window.location.reload();
                    }
                });
            }else{
                return false;
            }
        })
    })
}


//announcement_list.jsp
function AnnouncementList(){
    this.bindConfirm();
}
AnnouncementList.prototype={
    bindConfirm:function(){
        $('.delate_d').each(function(index,ele){
             var mess = $.i18n.prop('enterprise.setting.announcement.list.page.delete.confirm',$(ele).attr('dName'));
            $(ele).confirmA(mess)
        })
    }
};

/**
 * session_user_list.jsp
 * @constructor
 */
function SessionUserList() {
    this.forceLogoff();
    this.dateTimeInit();
}

SessionUserList.prototype = {
    forceLogoff: function () {
        $("a.forceLogoff").click(function () {
            var sessionId = $(this).attr("sessionId");
            var name = $(this).attr("name");
            $.confirm( $.i18n.prop('idp2.enterprise.mandatory.offline',name), function (flag) {
                if (flag) {
                    location.href="force_off_"+sessionId;
                }
            });
        });
    },
    dateTimeInit:function(){
        $('input.datepicker').datepicker({
            language: 'zh-CN',
            format: "yyyy-mm-dd",
            todayHighlight: true,
            autoclose:true,
            endDate:new Date(),
            toggleActive:true
        });
        if($('input[name="startDate"]').val()){
            $('input[name="endDate"]').datepicker('setStartDate',$('input[name="startDate"]').val())
        }
        $('input[name="startDate"]').datepicker()
            .on('changeDate', function(e) {
                $('input[name="endDate"]').datepicker('setStartDate',$('input[name="startDate"]').val())
            });
    }
};


//accountlinking_list.jsp
function AccountlinkingList(){
    this.bindConfirm();
    this.bindCheckAccount();
    this.bindCheckAll();
    this.bindDeleteMore();
}
AccountlinkingList.prototype={
    bindConfirm:function(){
        $('.delate-user').each(function(index,ele){
            var mess = $.i18n.prop('enterprise.application.linking.list.delete.msg',HtmlUtil.htmlEncode($(ele).attr('userName')));
            $(ele).confirmA(mess)
        })
    },
    bindCheckAll: function () {
        var self = this;
        $('#d .checkAllAccount').on('change', function () {
            var isChecked = $(this).prop('checked');
            $('#d input[name="uuid"]').prop('checked',isChecked);
            self.isShowBtn();
        })
    },
    bindDeleteMore: function () {
        $('.accountlinking_list_btn').on('click', function () {
            var url=contextPath+'/enterprise/application/accountlinking/batch_remove';
            var removeUuidList=[];

            $('#d input[name="uuid"]').each(function (index,ele) {
                if($(ele).prop('checked')){
                    removeUuidList.push($(ele).val());
                }
            })

            $.confirm($.i18n.prop('idp2.application.accountlinking.confirm',removeUuidList.length), function (flag) {
                if(flag){
                    $.ajax({
                        type:'post',
                        data:{
                            removeUuidList:removeUuidList,
                            isSync:false,
                            _csrf:$('input[name="_csrf"]').val()
                        },
                        url:url,
                        traditional: true,
                        success: function () {
                            location.reload();
                        }
                    })
                }
            })


        })
    },
    bindCheckAccount: function () {
        var self = this;
        $('#d input[name="uuid"]').on('change', function () {
            self.isShowBtn();
        })
    },
    isShowBtn: function () {
        var key = false;
        $('#d input[name="uuid"]').each(function (index,ele) {
            if($(ele).prop('checked')){
                key=true;
            }
        })
        if(key){
            $('.operate-list-btn').show();
        }else{
            $('.operate-list-btn').hide();
        }
    }
};

//accountlinking_approve.jsp
function AccountlinkingApprove(){
    this.bindConfirm();
}
AccountlinkingApprove.prototype={
    bindConfirm:function(){
        $('.agree-user').each(function(index,ele){
            var name =HtmlUtil.htmlEncode($(ele).attr('applicationUsername'));
            var mess = $.i18n.prop('idp2.enterprise.agree.account.linking',name);
            $(ele).confirmA(mess)
        })
        $('.refuse-user').each(function(index,ele){
            var name=HtmlUtil.htmlEncode($(ele).attr('applicationUsername'));
            var mess = $.i18n.prop('idp2.enterprise.disagree.account.linking',name);
            $(ele).confirmA(mess)
        })
    }
}

//devices.jsp
function EnterpriseUserDevices(){
    this.bindConfirm();
}
EnterpriseUserDevices.prototype={
    bindConfirm: function () {
        var msg=$('.delete_all_device').attr('msg')
        $('.delete_all_device').confirmA(msg)
    }
}
//application_bookmarks.jsp
function ApplicationBookmarks(){
    this.bindConfirm();
}
ApplicationBookmarks.prototype={
    bindConfirm: function () {
        $('.delate_book').each(function(index,ele){
            var mess = ApplicationBookmarksMsgs.DelateConfirmMes+"（"+$(ele).attr('bookName')+"）?";
            $(ele).confirmA(mess)
        })
    }
}


//notification_read_list.jsp

function NotificationReadList(){
    this.bindConfirm();
}
NotificationReadList.prototype={
    bindConfirm:function(){
        $('.delate_mess').each(function(index,ele){
            var mess = $.i18n.prop('enterprise.notification.list.page.confirm.delete',$(this).attr('messtitle'));
            $(ele).confirmA(mess)
        })
    }
}
//radius 授权
var radiusUserGroup={
    init: function () {
        this.authGroupUuids=[];
        this.checkAll=false;
        this.totalSize=null;
        this.checkallinput();
        this.getAllAuthGroup()
    },
    //authGroupUuids:[],
    checkallinput: function () {
        var self =this;
        $('#thisPageCheck').on('change', function () {
            var prop = $(this).prop('checked');
            $('.radius_auth_table').find('input[name="addUDGroupUuids"]').each(function (index,ele) {
                $(ele).prop('checked',prop)
                radiusUserGroup.changeInputVal(ele);
            })
        })
        $('#submitUpdate').on('click', function (e) {
            if(e||e.preventDefault){
                e.preventDefault();
            }else{
                window.event.returnValue=false;
            }
            // 将选中的数组拼接到action中
            var action=$('#formDto').attr('action');
            var name = $('#name').val();
            var _csrf = $('#csrfHidden').val();
            var data={
                name:name,
                _csrf:_csrf,
                addUDGroupUuids:self.authGroupUuids,
                "customFieldValueDtos[0].value":$('.customFieldValueDtosvalue').val(),
                "customFieldValueDtos[0].customFieldId":$('#customFieldId').val(),
                "customFieldValueDtos[0].vendor":$('#vendor').val()
            };
            $('#home').loader();
            $.ajax({
                type:"post",
                url:action,
                data:data,
                traditional: true,//必须指定为true
                success:function(data){
                    if(data){
                        $('#home').loader("hide")

                        window.location.href="authorization?configUuid="+configUuid;
                    }
                }
            });
        })
    },
    getAllAuthGroup: function () {
        var self=this;
        $.get(contextPath + "/enterprise/radius/user_mgt_group/query",{"configUuid":configUuid}, function (data) {
            self.authGroupUuids=data.addedGroupUuids;
            //异步分页
            ajaxtable();
        })
    },
    changeInputVal: function (ele) {
        this.updateAuthGroupUuids($(ele).val(),$(ele).prop('checked'));
    },
    updateAuthGroupUuids:function(uuid,bool){
        var self=this;
        if(self.authGroupUuids.length==0&&bool){
            self.authGroupUuids.push(uuid)
        }else{
            var index=self.getArrVal(self.authGroupUuids,uuid);
            if(index=="undefined"&&bool){
                self.authGroupUuids.push(uuid)
            }else if(index!="undefined"&&!bool){
                self.authGroupUuids.splice(index,1);
            }
        }

    },
    getArrVal:function(arr,val){
        var x = 'undefined';
        for(var i=0;i<arr.length;i++){
            if(arr[i]==val){
                x=i;
                break;
            }
        }
        return x;
    }
}
//application_groups_form.jsp
//var authGroupUuids=[];
var  ApplicationGroupsForm={
    init: function () {
        this.addGroupUuids=[];
        this.removeGroupUuids=[];
        this.hasauthGroupUuids=[];
        this.authGroupUuids=[];
        this.checkAll=false;
        this.totalSize=null;
        this.checkallinput();
        this.getAllAuthGroup()
    },
    //authGroupUuids:[],
    checkallinput: function () {
        var self =this;
        $('#allPlusCheckbox').on('change', function () {
            if($(this).prop('checked')){
                $('#submitUpdate').addClass('disabled')
                $.get(contextPath + "/enterprise/authorization/groups/query",{"thisPerPageSize":self.totalSize}, function (data) {
                    self.authGroupUuids=[];
                    $.each(data.list, function (index,val) {
                        //拿到全部已经授权的应用
                        self.authGroupUuids.push(val.uuid);
                    })
                    $('#submitUpdate').removeClass('disabled')
                })
            }else{
                self.authGroupUuids=[];
            }
            self.checkAll=$(this).prop('checked');
            $('#exampleTable').find('.no-search-checkbox').prop('checked', $(this).prop('checked'))

            //var isallChecked=$(this).prop('checked')
            //for (var a = 0; a < ouTableData.data().length; a++) {
            //    if(!$(ouTableData.context[0].aoData[a].anCells[0]).find('[type="checkbox"]').prop('disabled')){
            //        $(ouTableData.context[0].aoData[a].anCells[0]).find('[type="checkbox"]').prop('checked', isallChecked)
            //    }
            //}
        })
        $('#thisPageCheck').on('change', function () {
            var prop = $(this).prop('checked');
            $('#exampleTable').find('input[name="addUDGroupUuids"]').each(function (index,ele) {
                $(ele).prop('checked',prop)
                    ApplicationGroupsForm.changeInputVal(ele);
            })
        })
        $('#submitUpdate').on('click', function (e) {
            if(e||e.preventDefault){
                e.preventDefault();
            }else{
                window.event.returnValue=false;
            }
           // 将选中的数组拼接到action中
            var action=$('#formDto').attr('action');
            var name = $('#name').val();
            var purchaseId=$('#purchaseId').val();
            var _csrf = $('input[name="_csrf"]').val();
            var key = self.checkHasChange();
            var data={
                name:name,
                purchaseId:purchaseId,
                _csrf:_csrf,
                change:key,
                addUDGroupUuids:self.addGroupUuids,
                removeGroupUuids:self.removeGroupUuids
            };
            $('#home').loader();
            $.ajax({
                type:"post",
                url:action,
                data:data,
                traditional: true,//必须指定为true
                success:function(data){
                    if(data){
                        $('#home').loader("hide")
                        window.location.href="applications?appUuid="+appUuid;
                    }
                }
            });
        })
    },
    getAllAuthGroup: function () {
        var self=this;
        var applicationUuid=$('#AppUuid').val();
        $.get(contextPath + "/enterprise/authorization/groups/query",{"applicationUuid":applicationUuid}, function (data) {
            if(data.authGroupUuids){
                self.authGroupUuids=data.authGroupUuids;
                self.hasauthGroupUuids=JSON.parse(JSON.stringify(data.authGroupUuids));
                //异步分页
                ajaxtable();
            }
        })
    },
    checkHasChange: function () {
        var self = this;
        var key = false;
        $.each(self.hasauthGroupUuids, function (index, val) {
            if(self.getArrVal(self.authGroupUuids,val)=='undefined'){
                self.removeGroupUuids.push(val);
                key=true;
            }
        });
        $.each(self.authGroupUuids, function (index,val) {
            if(self.getArrVal(self.hasauthGroupUuids,val)=='undefined'){
                self.addGroupUuids.push(val);
                key=true;
            }
        })
        return key;
    },
    changeInputVal: function (ele) {
        this.updateAuthGroupUuids($(ele).val(),$(ele).prop('checked'));
    },
    updateAuthGroupUuids:function(uuid,bool){
        var self=this;
        if(self.authGroupUuids.length==0&&bool){
            self.authGroupUuids.push(uuid)
        }else{
            var index=self.getArrVal(self.authGroupUuids,uuid);
            if(index=="undefined"&&bool){
                self.authGroupUuids.push(uuid)
            }else if(index!="undefined"&&!bool){
                self.authGroupUuids.splice(index,1);
            }
        }

    },
    getArrVal:function(arr,val){
        var x = 'undefined';
        for(var i=0;i<arr.length;i++){
            if(arr[i]==val){
                x=i;
                break;
            }
        }
        return x;
    }
}

//应用授权按账户组更新
function AuthorizationGroups(){
    this.init();

}
AuthorizationGroups.prototype={
    init: function () {
        this.getData();
        this.bindCheckAll();
        this.bindSubmitForm();
        this.bindCheckBox();
    },
    getData: function () {
        var self = this;
        $.get(contextPath+"/enterprise/authorization/groups_"+groupUuid+"/json", function (data) {
            var option = self.dataTablesOption(data);
            self.data=data
            if(data.appList.length==0){
                $("#plusMemberTbody").html('<tr><td colspan="3" style="text-align: center">'+ $.i18n.prop("enterprise.authorization.groups.form.page.table.empty")+'</td> </tr>')
            }else{
                self.jsonTable = Desc.prototype.InitJsDataTable(option.obj,data.appList,option.columns)
            }
        })
    },
    dataTablesOption: function (data) {
        var self = this;
        var option = {
            obj:'#AppTables',
            columns:
                [
                    {
                        "data": "null",
                        "render": function (td, cellData, rowData, row, col){
                            if(self.isInArray(data.addedApplicationUuids,rowData.applicationUuid)!=-1){
                                return '<input type="checkbox" checked="checked" class="no-search-checkbox" name="addedApplicationUuids" value="'+rowData.applicationUuid+'" />'
                            }else{
                                return '<input type="checkbox" class="no-search-checkbox" name="addedApplicationUuids" value="'+rowData.applicationUuid+'" />'
                            }
                        }
                    },
                    {
                        "data":'name'
                    },
                    {
                        "data":'purchaseId'
                    }
                ]
        }
        return option;
    },
    isInArray: function (arr,val) {
        var  key = -1;
        for(var i=0;i<arr.length;i++){
            if(arr[i]==val){
                key=i;
                break;
            }
        }
        return key;
    },
    bindCheckAll: function () {
        var self = this;
        $('#allPlusCheckbox').unbind().on('change', function () {
            var isChecked = $(this).prop('checked');
            var checkboxs=$('#plusMemberTbody').find('input[name="addedApplicationUuids"]')
            checkboxs.prop('checked',isChecked);
            checkboxs.each(function (index,ele) {
                var addedApplicationUuids = $(this).val();
                self.changeArrVal(self.data.addedApplicationUuids,addedApplicationUuids,isChecked);
            })
        })
    },
    bindSubmitForm: function () {
        var self = this;
        $('#submitApp').unbind().on('click', function (e) {
            if(e.preventDefault){
                e.preventDefault();
            }else{
                window.event.returnValue=false;
            }
            var action=$('#formDto').attr('action');
            //var str="";
            var name = $('#groupName').val();
            var _csrf = $('input[name="_csrf"]').val();
            var data={
                name:name,
                _csrf:_csrf,
                addedApplicationUuids:self.data.addedApplicationUuids
            };
            $('#home').loader();
            $.ajax({
                type:"post",
                url:action,
                data:data,
                traditional: true,//必须指定为true
                success:function(data){
                    if(data){
                        $('#home').loader("hide")
                        window.location.href=backHref;
                    }
                }
            });
        })
    },
    bindCheckBox: function () {
        var self = this;
        $('#AppTables').on('change',"input[name='addedApplicationUuids']", function () {
            var isCheck = $(this).prop("checked");
            var addedApplicationUuids = $(this).val();
            self.changeArrVal(self.data.addedApplicationUuids,addedApplicationUuids,isCheck);
        })
    },
    changeArrVal: function (arr,val,key) {
        var self = this;
        if(key&&self.isInArray(arr,val)==-1){
            arr.push(val);
        }else if(!key&&self.isInArray(arr,val)!=-1){
            arr.splice(self.isInArray(arr,val),1);
        }
    }
}


//统一二次认证设置
function Enterprise2Factory(){
    this.init();
}
Enterprise2Factory.prototype={
    init: function () {
        var user2factor = $('input[name="user2factor"]').val();
        this.isShowAllowSwitch(user2factor);
        this.bindUserChange();
    },
    bindUserChange: function () {
        var self = this;
        $('#user2factorSwitch').on('click', function () {
            var user2factor =$('input[name="user2factor"]').val();
            self.isShowAllowSwitch(user2factor);
        })
    },
    isShowAllowSwitch: function (user2factor) {
        if(user2factor=='false'){
            $('#allowUser2factorClose').hide();
            $('#allowUser2factorClose').find('.st-switcher').addClass('active');
            $('#allowUser2factorClose').find('input[name="allowUser2factorClose"]').val('true');
        }else if(user2factor=='true'){
            $('#allowUser2factorClose').show();
        }
    }
    
}


//登录登出日志
function OperationLogs(){
    this.init();
    LoginLogoutLogList.prototype.initDatePicker();
}
OperationLogs.prototype={
    init: function () {
        //this.initSelectUser();
    },
    initSelectUser: function () {
        //初始化select2插件
        $(".js-data-example-ajax").select2({
            language:'zh-CN',
            ajax: {
                url: "search_enterprise",
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        search: params.term // search term
                        //page: params.page
                    };
                },
                processResults: function (data) {
                    $.each(data.items,function(index,val){
                        val.id=val.name;
                    })
                    return {
                        results: data.items
                    };
                },
                cache: true
            },
            escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
            minimumInputLength: 1,
            templateResult: formatRepo, // omitted for brevity, see the source of this page
            templateSelection: formatRepoSelection // omitted for brevity, see the source of this page
        });
        function formatRepo(repo){
            if (repo.loading) return $.i18n.prop('enterprise.statistics.searching')
            var markup = "<div class='select2-result-repository clearfix'>" +
                "<div class='select2-result-repository__avatar'>" + repo.name + "</div>";
            return markup
        }
        function formatRepoSelection(repo){
            return repo .name || repo.text;
        }
    }
}



/**
 * Created by wangsir on 2017/8/11.
 */
'use strict';
if($.i18n){
    var currentLocale = currentLocale ? currentLocale : $.i18n.browserLang();
    currentLocale = currentLocale.replace(/-/g, '_');
    var thisIdpVersion=""
    if(typeof idpVersion !="undefined"){
        thisIdpVersion = idpVersion
    }
    jQuery.i18n.properties({
        name: 'lang',  // 资源文件名称
        path: contextPath +'/static/plugins/jquery.i18n/lang/',  // 资源文件所在目录路径
        mode: 'map',  // 模式：变量或 Map
        language: currentLocale,  // 对应的语言包
        cache: true,
        version:thisIdpVersion,
        encoding: 'UTF-8',
        callback: function() {}
    });
}

var Fn = {
    init: function () {
        $('.i18n').length > 0 && this.render();
    },
    render: function () {
        $('.i18n').each(function (i, obj) {
            var arr = [], text = '';
            var code = $(this).attr('code');

            typeof $(this).attr('arguments') != 'undefined' && (arr = $(this).attr('arguments').split(',') );

            if(typeof $.i18n.map[code]=='undefined' && typeof $(this).attr('text')!='undefined'){
                text=$(this).attr('text');
            }else if(typeof $.i18n.map[code]=='undefined' && typeof $(this).attr('text')=='undefined'){
                return;
            }else{
                arr.unshift(code);
                text = $.i18n.prop.apply(null,arr);
            }

            if($(this).hasClass('placeholder')){
                $(this).attr('placeholder',text)
            }else if($(this).hasClass('value')){
                $(this).attr('value',text)
            }else {
                $(this)[0].innerHTML = text;
            }
        });
    }
}

$(function () {
    Fn.init();
})

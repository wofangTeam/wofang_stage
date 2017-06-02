/**
 * Created by Administrator on 2017/4/7.
 */

var tab;

layui.config({
    base: '/js/',
    version:new Date().getTime()
}).use(['jquery','element','layer', 'navbar', 'tab', 'util'],function(){

    window.jQuery = window.$ = layui.jquery;
    window.layer = layui.layer;
    var element = layui.element(),
        $ = layui.jquery,
        layer = layui.layer,
        navbar = layui.navbar(),
        util = layui.util;
    tab = layui.tab({
        elem: '.dinner-tab-box' //设置选项卡容器
        ,
        // maxSetting: {
        // 	max: 5,
        // 	tipMsg: '只能开5个哇，不能再开了。真的。'
        // },
        contextMenu:true
    });

    //使用内部工具组件
    util.fixbar({
        // bar1: true,
        bar2: true,
        css: {right: 15, bottom: 55},
        click: function(type){
            if(type === 'bar1'){
                console.log('点击了bar1');
            }else if (type === 'bar2'){
                console.log('点击了bar2');
            }else if (type === 'top'){
                console.log('点击了top');
            }
        }
    });

    //iframe自适应
    $(window).on('resize', function() {
        var $content = $('#dinner-tab .layui-tab-content');
        $content.height($(this).height() - 190);
        $content.find('iframe').each(function() {
            $(this).height($content.height());
        });
        var tab_W = $('#dinner-tab').width();
        // dinner-footer：p-admin宽度设定
        var dinnerFoot = $('#dinner-footer').width();
        // $('#dinner-footer .dinner-footer-body').width(dinnerFoot - 300);
    }).resize();

    //设置数据源有两个方式。
    //第一：在此页面通过ajax读取设置  举个例子：
    //---------这是第一个例子----------
    /*$.getJSON('/api/xxx',{moduleId:id},function(data){
     navbar.set({
     elem: '#side',
     data: data
     });
     navbar.render();
     navbar.on('click(side)', function(data) {
     tab.tabAdd(data.field);
     });
     });*/
    //------------例子结束--------------
    //第二：设置url
    //---------这是第二个例子----------
    /*navbar.set({
     elem: '#side',
     url: '/api/xxx?moduleId='+id
     });
     navbar.render();
     navbar.on('click(side)', function(data) {
     tab.tabAdd(data.field);
     });*/
    //------------例子结束--------------
    //本扩展 是使用第二例子方式 设置navbar
    var navs = [];
    navbar.set({
        spreadOne: true,
        header:'#dinner-nav-side-header',
        elem: '#dinner-nav-side',
        // data: navs,
        cached: true,
        url: '/js/slider.json'
    });

    // 左侧菜单导航-->tab
    //渲染navbar
    navbar.render();
    //监听点击事件
    navbar.on('click(side)', function(data) {
        tab.tabAdd(data.field);
    });

    // //模拟点击内容管理
    // $('.beg-layout-menu').find('a[data-module-id=1]').click();
    // element.on('nav(user)', function(data) {
    //     var $a = data.children('a');
    //     if($a.data('tab') !== undefined && $a.data('tab')) {
    //         tab.tabAdd({
    //             title: $a.children('cite').text(),
    //             //icon: 'fa-user',
    //             href: $a.data('url')
    //         });
    //     }
    // });


    // dinner-side-menu向左折叠
    $('.dinner-side-toggle').click(function() {
        var sideWidth = $('#dinner-side').width();
        var icon = $(this).find('i');
        if(sideWidth === 200) {
            $('#dinner-body').animate({
                left: '0'
            }); //admin-footer
            $('#dinner-footer').animate({
                left: '0'
            });
            $('#dinner-side').animate({
                width: '0'
            });
            $(this).animate({
                left: '15'
            });
            $('#dinner-side-logo img').animate({
                width: '0'
            });
            icon.attr('class',icon.attr('data-close'));
        } else {
            $('#dinner-body').animate({
                left: '200px'
            });
            $('#dinner-footer').animate({
                left: '200px'
            });
            $('#dinner-side').animate({
                width: '200px'
            });
            $(this).animate({
                left: '215'
            });
            $('#dinner-side-logo img').animate({
                width: '150'
            });
            icon.attr('class',icon.attr('data-open'));
        }
    });

    $(function(){
        // 刷新iframe操作
        $("#refresh_iframe").click(function(){
            $(".layui-tab-content .layui-tab-item").each(function(){
                if($(this).hasClass('layui-show')){
                    $(this).children('iframe')[0].contentWindow.location.reload(true);
                }
            });
        });

        //锁屏
        $('#lock').mouseover(function(){
            layer.tips('请按Alt+L快速锁屏！', '#lock', {
                tips: [1, '#44576b'],
                time: 4000
            });
        }).on('click', function() {
            lock($, layer);
        });

        $(document).on('keydown', function() {
            var e = window.event;
            if(e.keyCode === 76 && e.altKey) {
                //alert("你按下了alt+l");
                lock($, layer);
            }
        });

        //手机设备的简单适配
        var treeMobile = $('.site-tree-mobile'),
            shadeMobile = $('.site-mobile-shade');
        treeMobile.on('click', function() {
            $('body').addClass('site-mobile');
        });
        shadeMobile.on('click', function() {
            $('body').removeClass('site-mobile');
        });

    });

    $(function (){

        $('.dinner-side-full').on('click', function() {
            var docElm = document.documentElement;
            //W3C
            if(docElm.requestFullscreen) {
                docElm.requestFullscreen();
            }
            //FireFox
            else if(docElm.mozRequestFullScreen) {
                docElm.mozRequestFullScreen();
            }
            //Chrome等
            else if(docElm.webkitRequestFullScreen) {
                docElm.webkitRequestFullScreen();
            }
            //IE11
            else if(elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
            layer.msg('按Esc即可退出全屏');
        });
    });

});

var isShowLock = false;
function lock($, layer) {
    if(isShowLock)
        return;
    //自定页
    layer.open({
        title: false,
        type: 1,
        closeBtn: 0,
        anim: 6,
        content: $('#lock-temp').html(),
        shade: [0.9, '#393D49'],
        success: function(layero, lockIndex) {
            isShowLock = true;
            //给显示用户名赋值
            layero.find('div#lockUserName').text('dinner');
            layero.find('input[name=lockPwd]').on('focus', function() {
                var $this = $(this);
                if($this.val() === '输入密码解锁..') {
                    $this.val('').attr('type', 'password');
                }
            })
                .on('blur', function() {
                    var $this = $(this);
                    if($this.val() === '' || $this.length === 0) {
                        $this.attr('type', 'text').val('输入密码解锁..');
                    }
                });
            //在此处可以写一个请求到服务端删除相关身份认证，因为考虑到如果浏览器被强制刷新的时候，身份验证还存在的情况
            //do something...
            //e.g.
            /*
             $.post(url,params,callback,'json');
             */
            //绑定解锁按钮的点击事件
            layero.find('button#unlock').on('click', function() {
                var $lockBox = $('div#lock-box');

                var userName = $lockBox.find('div#lockUserName').text();
                var pwd = $lockBox.find('input[name=lockPwd]').val();
                if(pwd === '输入密码解锁..' || pwd.length === 0) {
                    layer.msg('请输入密码..', {
                        icon: 2,
                        time: 1000
                    });
                    return;
                }
                unlock(userName, pwd);
            });
            /**
             * 解锁操作方法
             * @param {String} 用户名
             * @param {String} 密码
             */
            var unlock = function(un, pwd) {
                //这里可以使用ajax方法解锁
                /*$.post('api/xx',{username:un,password:pwd},function(data){
                 //验证成功
                 if(data.success){
                 //关闭锁屏层
                 layer.close(lockIndex);
                 }else{
                 layer.msg('密码输入错误..',{icon:2,time:1000});
                 }
                 },'json');
                 */
                isShowLock = false;
                //演示：默认输入密码都算成功
                //关闭锁屏层
                layer.close(lockIndex);
            };
        }
    });
};
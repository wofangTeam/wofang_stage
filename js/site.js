var layer = window.parent.layer ? window.parent.layer : window.layer;
// var _width = document.documentElement.clientWidth;//获取页面可见宽度
// var _height = document.documentElement.clientHeight;//获取页面可见高度

$(function() {
    //layui
    layui.config({
        base: '/js/',
        version:new Date().getTime()
    }).use(['jquery','element','layer', 'util', 'code', 'form','laydate'],function(){
        window.jQuery = window.$ = layui.jquery;
        window.layer = layui.layer;
        var element = layui.element(),
            $ = layui.jquery,
            util = layui.util,
            layer = layui.layer,
            form = layui.form(),
            device = layui.device();

        //阻止IE7以下访问
        if(device.ie && device.ie < 8){
            layer.alert('Layui最低支持ie8，您当前使用的是古老的 IE'+ device.ie + '，依旧怀旧');
        }
        //手机设备的简单适配
        var treeMobile = $('.site-tree-mobile');
        var shadeMobile = $('.site-mobile-shade');

        treeMobile.on('click', function(){
            $('body').addClass('site-mobile');
        });

        shadeMobile.on('click', function(){
            $('body').removeClass('site-mobile');
        });
    });
});

function loadScript(url) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    document.body.appendChild(script);
}

function showUrl(title,url,width,height,type,parentWin,maxmin,ele) {
    var content = '',stop = true,shade;
    var myLayer = window.layer ? window.layer : top.window.layer;
    if(!myLayer) {
        myLayer = layer;
    }
    type = type || 1;
    type = parseInt(type);
    if (type != 2){
        $.post(url,{},function(data) {
            content = data;
            stop = false;
        },"html");
    }else {
        content = [url, 'no'];
        stop = false;
    }
    if (stop){return;}
    width = width || '800px';
    height = height || '500px';
    maxmin = maxmin !== undefined && maxmin === true && type == 2;
    shade = maxmin !== undefined && maxmin === true && type == 2 ? 0 : 0.3;
    if (parentWin){
        myLayer = top.window.layer ? top.window.layer : window.layer;
    }
    myLayer.open({
        type: type,
        area: [width,height],
        maxmin: maxmin,
        shade: shade,
        id: ele,
        title:'<p style="text-align: center;">'+title+'</p>',
        content: content
    });
}

function msg(content) {
    var myLayer = window.layer ? window.layer : top.window.layer;
    if(!myLayer) {
        myLayer = layer;
    }
    myLayer.msg(content, {time: 2000});
}

function wait(content) {
    var myLayer = window.layer ? window.layer : top.window.layer;
    if(!myLayer) {
        myLayer = layer;
    }
    if(!content) {
        content = "请稍后....";
    }
    myLayer.msg(content,{shade:0.3,time: 10000});
}

function loading(icon) {
    var myLayer = window.layer ? window.layer : top.window.layer;
    if(!myLayer) {
        myLayer = layer;
    }
    icon = icon || 1;
    myLayer.load(icon,{type: 3,icon: icon,shade:0.3});
}

function load(url,content) {
    var myLayer = window.layer ? window.layer : top.window.layer;
    if(!myLayer) {
        myLayer = layer;
    }
    if(!content) {
        content = "加载中....";
    }
    myLayer.msg(content,{shade:0.3,time: 1000});
    setTimeout(function () {
        window.location.href=url;
    },1000);
}

function loadFrame(title,url,width,height,ele,btn) {
    var content = '';
    var myLayer = window.layer ? window.layer : top.window.layer;
    if(!myLayer) {
        myLayer = layer;
    }
    title = title || '标题';
    content = [url, 'no'];
    width = width || '800px';
    height = height || '500px';
    btn = btn ===true ? ['全部关闭'] : undefined;

    //多窗口模式，层叠置顶
    myLayer.open({
        type: 2 //此处以iframe举例
        ,title: title
        ,area: [width, height]
        ,shade: 0
        ,maxmin: true
        ,id:ele
        ,content: content
        ,btn: btn //只是为了演示
        ,yes: function(){
            layer.closeAll();
        }
        ,zIndex: myLayer.zIndex //重点1
    });
}

function hide() {
    var myLayer = window.layer ? window.layer : top.window.layer;
    if(!myLayer) {
        myLayer = layer;
    }
    myLayer.closeAll();
}

function error(content) {
    var myLayer = window.layer ? window.layer : top.window.layer;
    if(!myLayer) {
        myLayer = layer;
    }
    myLayer.msg(content, {icon: 2,time:20000});
}

function success(content) {
    var myLayer = window.layer ? window.layer : top.window.layer;
    if(!myLayer) {
        myLayer = layer;
    }
    myLayer.msg(content, {icon: 1,time:2000});
}

function tip(content) {
    var myLayer = window.layer ? window.layer : top.window.layer;
    if(!myLayer) {
        myLayer = layer;
    }
    myLayer.msg(content, {icon: 0,time:20000});
}

//确认对话框
function confirm(url,msg) {
    var myLayer = layer;
    myLayer.open({
        content:msg,
        yes:function() {
            window.location.href=url;
            return false;
        }
    });
}

function showDialog(title,msg,callBack) {
    var myLayer = layer;
    myLayer.open({
        title:title,
        content:msg,
        yes:function(index) {
            myLayer.close(index);
            if(callBack) {
                callBack();
            }
            return false;
        }
    });
}

function resizeShowTab() {
    if(window.parent) {
        window.parent.$(".layui-show").find("iframe").load();
    }
    else {
        $(".layui-show").find("iframe").load();
    }
}

$.getUrlParam = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
};

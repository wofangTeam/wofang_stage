layui.define(['element','layer'], function(exports) {
	"use strict";
	var $ = layui.jquery,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		element = layui.element(),
		cacheName = 'navbar';

	var Navbar = function() {
		/**
		 *  默认配置 
		 */
		this.config = {
			header: undefined, //前缀HTML容器
			elem: undefined, //容器
			data: undefined, //数据源
			url: undefined, //数据源地址
			type: 'GET', //读取方式
			cached: false, //是否使用缓存
			spreadOne:false //设置是否只展开一个二级菜单
		};
		this.v = '0.0.1';
	};
	Navbar.prototype.render = function() {
		var _that = this;
		var _config = _that.config;
		if(typeof(_config.elem) !== 'string' && typeof(_config.elem) !== 'object') {
            layer.msg('Navbar error:事件名配置出错，请参考API文档.');
		}
		var $container;
		if(typeof(_config.elem) === 'string') {
			$container = $('' + _config.elem + '');
		}
		if(typeof(_config.elem) === 'object') {
			$container = _config.elem;
		}
		if($container.length === 0) {
            layer.msg('Navbar error:找不到elem参数配置的容器，请检查.');
		}
		var header;
		if(typeof(_config.header) === 'string') {
            header = $('' + _config.header + '');
		}
		if(typeof(_config.header) === 'object') {
            header = _config.header;
		}
		if(header.length === 0) {
            header = '';
		}else {
            header = header.html();
		}
		if(_config.data === undefined && _config.url === undefined) {
            layer.msg('Navbar error:请为Navbar配置数据源.');
		}
        layui.data(cacheName, null);
		if(_config.data !== undefined && typeof(_config.data) === 'object') {
			var html = getHtml(_config.data);
            $container.html(header+html);
			element.init();
			_that.config.elem = $container;
		} else {
			if(_config.cached) {
				var cacheNavbar = layui.data(cacheName);
				if(cacheNavbar.navbar === undefined) {
					$.ajax({
						type: _config.type,
						url: _config.url,
						async: false, //_config.async,
						dataType: 'json',
						success: function(result, status, xhr) {
							//添加缓存
							// console.log(result);
							layui.data(cacheName, {
								key: 'navbar',
								value: result
							});
							var html = getHtml(result);
                            $container.html(header+html);
                            element.init();
						},
						error: function(xhr, status, error) {
                            layer.msg('Navbar error:' + error);
						},
						complete: function(xhr, status) {
							_that.config.elem = $container;
						}
					});
				} else {
					var html = getHtml(cacheNavbar.navbar);
                    $container.html(header+html);
					element.init();
					_that.config.elem = $container;
				}
			} else {
				//清空缓存
				layui.data(cacheName, null);
				$.ajax({
					type: _config.type,
					url: _config.url,
					async: false, //_config.async,
					dataType: 'json',
					success: function(result, status, xhr) {
                        // console.log(result);
						var html = getHtml(result);
                        $container.html(header+html);
                        element.init();
					},
					error: function(xhr, status, error) {
                        layer.msg('Navbar error:' + error);
					},
					complete: function(xhr, status) {
						_that.config.elem = $container;
					}
				});
			}
		}

		//只展开一个二级菜单
		if(_config.spreadOne){
			var $ul = $container.children('ul');
			$ul.find('li.layui-nav-item').each(function(){
				$(this).on('click',function(){
					$(this).siblings().removeClass('layui-nav-itemed');
				});
			});
		}
		return _that;
	};

	/**
	 * 配置Navbar
	 * @param {Object} options
	 */
	Navbar.prototype.set = function(options) {
		var that = this;
		that.config.data = undefined;
		$.extend(true, that.config, options);
		return that;
	};
	/**
	 * 绑定事件
	 * @param {String} events
	 * @param {Function} callback
	 */
	Navbar.prototype.on = function(events, callback) {
		var that = this;
		var _con = that.config.elem;
		if(typeof(events) !== 'string') {
            layer.msg('Navbar error:事件名配置出错，请参考API文档.');
		}
		var lIndex = events.indexOf('(');
		var eventName = events.substr(0, lIndex);
		var filter = events.substring(lIndex + 1, events.indexOf(')'));
		if(eventName === 'click') {
			if(_con.attr('lay-filter') !== undefined) {
				_con.children('ul').find('li').each(function() {
					var $this = $(this);
					if($this.find('dl').length > 0) {
						var $dd = $this.find('dd').each(function() {
							$(this).on('click', function() {
								var $a = $(this).children('a');
								var href = $a.data('url');
								var icon = $a.children('i:first').data('icon');
								var title = $a.children('cite').text();
								var data = {
									elem: $a,
									field: {
										href: href,
										icon: icon,
										title: title
									}
								}
								callback(data);
							});
						});
					} else {
						$this.on('click', function() {
							var $a = $this.children('a');
							var href = $a.data('url');
							var icon = $a.children('i:first').data('icon');
							var title = $a.children('cite').text();
							var data = {
								elem: $a,
								field: {
									href: href,
									icon: icon,
									title: title
								}
							}
							callback(data);
						});
					}
				});
			}
		}
	};
	/**
	 * 清除缓存
	 */
	Navbar.prototype.cleanCached = function(){
		layui.data(cacheName,null);
	};
	/**
	 * 获取html字符串
	 * @param {Object} data
	 */
	function getHtml(data) {
		var _options= data.attr || {}, _prefix= data.prefix || '', _suffix= data.suffix || '', menu= data.menus || {},  optionStr = '', ulHtml = '';
        for (var _item in _options) {
            optionStr += _item + '="'+_options[_item]+'"';
        }
        ulHtml += '<ul '+ optionStr +'>';
		for(var i in menu) {
			ulHtml += getItem(menu[i]);
		}
		ulHtml += '</ul>';

		return ulHtml;

        /**
         * 获取每个菜单html字符串
         * @param {Object} item
         */
		function getItem(item) {
            var  itemTag = 'li', itemHtml = '', _aClass ='', _iClass ='', _liClass ='', _itemUrl;
			if (item.data !== undefined && (item.data !== '' || item.data !== null)){
				_liClass = (item.data.li_class !== undefined && item.data.li_class !== '') ? item.data.li_class : 'layui-nav-item';
                _aClass = (item.data.a_class !== undefined && item.data.a_class !== '') ? item.data.a_class : '';
                _iClass = (item.data.i_class !== undefined && item.data.i_class !== '' ) ? item.data.i_class : '';
			}
            if(item.parent !== undefined && item.parent !== null) {
                _liClass = 'layui-nav-child-item';
                itemTag = 'dd';
            }
            if(item.children !== undefined && item.children.length > 0) {
            	itemHtml += '<a class="'+ _aClass +'" href="javascript:;">' +
                    '<i class="'+ _iClass +'"></i> ' +
                    '<cite class="title">'+ item.text +'</cite> ' +
					'<em class="layui-nav-more"></em>' +
                    '</a>';
                itemHtml += '<dl class="layui-nav-child">';
                for(var j in item.children) {
                    itemHtml += getItem(item.children[j]);
                }
                itemHtml += '</dl>';
            } else {
				_itemUrl = _prefix + item.url + _suffix;
				if (item.url.indexOf('.html?') !== -1 || item.url.indexOf('?') !== -1){
                    _itemUrl = _prefix + item.url + _suffix.replace(/\.html\?/,'&');
				}
                itemHtml += '<a class="'+ _aClass +'" href="javascript:;" data-url="'+ _itemUrl +'">' +
					'<i class="'+ _iClass +'"></i> ' +
					'<cite class="title">'+ item.text +'</cite> ' +
					'</a>';
            }
            if(item.spread) {
                itemHtml = '<'+ itemTag +' class="'+ _liClass +' layui-nav-itemed">'+ itemHtml +'</'+ itemTag + '>';
            } else {
                itemHtml = '<'+ itemTag +' class="'+ _liClass +'">'+ itemHtml +'</'+ itemTag + '>';
            }
            return itemHtml;
        }
	}

	var navbar = new Navbar();

	exports('navbar', function(options) {
		return navbar.set(options);
	});
});
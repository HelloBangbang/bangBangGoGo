(function (global, mainFnc){//整体自调防止局部变量污染
    //模块化环境判断(环境可能是node.js或者桌面应用或其他的平台)
    if ( typeof module === "object" && typeof module.exports === "object" ) {
		module.exports = global.document ? mainFnc( global, true ) : function( w ) {
				if ( !w.document ) {
					throw new Error( "BB 需要一个有document属性的window" );
				}
				return mainFnc( w );
			};
	} else {
		mainFnc( global );
	}
})(typeof window !== "undefined" ? window : this,function(w,noGlobal){//支持模块化,把主体函数当做参数了
    //工厂函数
    function BB(parameter){
        //把创建构造函数实例的过程进行了封装,可以简化创建实例
        return new BB_Init(parameter);
    }
    //构造函数
    function BB_Init(parameter){
        // 如果参数为真则进一步判断,否则无需处理
        if(parameter){
            if(typeof parameter === 'function'){//函数

            }else if(typeof parameter === 'string'){//字符串
                //html字符串
                if(isHTMLStr(parameter)){
                    [].push.apply(this,parseHTMLStr(parameter));
                }else{//普通字符串认为是选择器
                    [].push.apply(this,document.querySelectorAll(parameter));
                }
            }else if(''){//数组或伪数组

            }else{//dom元素或其他
                [].push.call(this,parameter);
            }
        }
    }
    //工厂函数和构造函数共享同一原型(方便用户外部找到原型添加方法(插件)),并重新设置属性指回函数,还给原型加了一个fn的简写(简便)
    BB.fn = BB.prototype = BB_Init.prototype = {
        //分别在指回去
        constructBB:BB,
        constructInit:BB_Init
    }
    
    //暴露接口
    if ( !noGlobal ) {
        //浏览器环境
        w.BB = BB;
    }
    //暴露模块化接口
    return BB;

    //接收一个字符串参数,判断是否是html字符串,是为true,否为false;
    function isHTMLStr(htmlStr){
        if(htmlStr && htmlStr[0] === '<' && htmlStr[htmlStr.length - 1] === '>' && htmlStr.length >= 3){//bug 这里的字符串判断显然不是特别严谨
            return true;
        }else{
            return false;
        }
    }

    //接收一个html字符串参数,转化为html元素后返回;
    function parseHTMLStr(htmlStr){
        var div = document.createElement('div');//bug div内部无法直接放置的某些元素例如:li td 之类的
        div.innerHTML = htmlStr;
        return div.children;
    }

    //接收一个参数,判断参数是不是对象(函数,数组,自定义对象);
    function isObj(obj){
        return typeof obj === 'object' && obj !== null;
    }

    //接收一个参数,判断是不是window
    function isWindow(w){
        //window有个window属性指向window所以 window.window.window === window.window === window;
        return !!w && w.window === w;
    }

    //接收一个对象,判断返回其具体类型的字符串
    function getObjType(obj){
        //这种方法不能确定自定义的构造函数类型
        return Object.prototype.toString.call(obj).slice(8,-1);
    }

    //接收一个参数,判断是否是数组或伪数组
    
});
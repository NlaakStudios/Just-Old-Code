(function(f){f.fn.disableSelection_dropotron=function(){return f(this).css("user-select","none").css("-khtml-user-select","none").css("-moz-user-select","none").css("-o-user-select","none").css("-webkit-user-select","none")};f.fn.dropotron=function(l){l=f.extend({selectorParent:f(this)},l);return f.dropotron(l)};f.dropotron=function(l){var a=f.extend({selectorParent:null,baseZIndex:1E3,menuClass:"dropotron",expandMode:"hover",hoverDelay:150,hideDelay:250,openerClass:"opener",openerActiveClass:"active",
submenuClassPrefix:"dropotron-level-",mode:"slide",speed:"fast",easing:"swing",alignment:"left",offsetX:0,offsetY:0,globalOffsetY:0,IEOffsetX:0,IEOffsetY:0,noOpenerFade:!1,detach:!0},l),e=a.selectorParent,p=e.find("ul"),q=f("html"),g=!1,t=null,r=null;e.bind("doCollapseAll",function(){p.trigger("doCollapse")});p.each(function(){var b=f(this),c=b.parent();0<a.hideDelay&&b.add(c).mouseleave(function(c){window.clearTimeout(r);r=window.setTimeout(function(){b.trigger("doCollapse")},a.hideDelay)});b.disableSelection_dropotron().hide().addClass(a.menuClass).css("position",
"absolute").mouseenter(function(b){window.clearTimeout(r)}).bind("doExpand",function(){if(b.is(":visible"))return!1;window.clearTimeout(r);p.each(function(){var b=f(this);f.contains(b.get(0),c.get(0))||b.trigger("doCollapse")});var h,n,d,e,l=b.css("z-index")==a.baseZIndex;d=c.offset();var s=c.position();c.parent().position();var k=c.outerWidth(),m=b.outerWidth();if(l){h=a.detach?d:s;e=h.top+c.outerHeight()+a.globalOffsetY;n=a.alignment;b.removeClass("left").removeClass("right").removeClass("center");
switch(a.alignment){case "right":d=h.left-m+k;0>d&&(d=h.left,n="left");break;case "center":d=h.left-Math.floor((m-k)/2);0>d?(d=h.left,n="left"):d+m>q.width()&&(d=h.left-m+k,n="right");break;default:d=h.left,d+m>q.width()&&(d=h.left-m+k,n="right")}b.addClass(n)}else switch("relative"==c.css("position")||"absolute"==c.css("position")?(e=a.offsetY,d=-1*s.left):(e=s.top+a.offsetY,d=0),a.alignment){case "right":d+=-1*c.parent().outerWidth()+a.offsetX;break;default:d+=c.parent().outerWidth()+a.offsetX}navigator.userAgent.match(/MSIE ([0-9]+)\./)&&
8>RegExp.$1&&(d+=a.IEOffsetX,e+=a.IEOffsetY);b.css("left",d+"px").css("top",e+"px");b.css("opacity","0.01").show();k=!1;d="relative"==c.css("position")||"absolute"==c.css("position")?-1*s.left:0;0>b.offset().left?(d+=c.parent().outerWidth()-a.offsetX,k=!0):b.offset().left+m>q.width()&&(d+=-1*c.parent().outerWidth()-a.offsetX,k=!0);k&&b.css("left",d+"px");b.hide().css("opacity","1");switch(a.mode){case "zoom":g=!0;c.addClass(a.openerActiveClass);b.animate({width:"toggle",height:"toggle"},a.speed,a.easing,
function(){g=!1});break;case "slide":g=!0;c.addClass(a.openerActiveClass);b.animate({height:"toggle"},a.speed,a.easing,function(){g=!1});break;case "fade":g=!0;l&&!a.noOpenerFade?(k="slow"==a.speed?80:"fast"==a.speed?40:Math.floor(a.speed/2),c.fadeTo(k,0.01,function(){c.addClass(a.openerActiveClass);c.fadeTo(a.speed,1);b.fadeIn(a.speed,function(){g=!1})})):(c.addClass(a.openerActiveClass),c.fadeTo(a.speed,1),b.fadeIn(a.speed,function(){g=!1}));break;default:c.addClass(a.openerActiveClass),b.show()}return!1}).bind("doCollapse",
function(){if(!b.is(":visible"))return!1;b.hide();c.removeClass(a.openerActiveClass);b.find("."+a.openerActiveClass).removeClass(a.openerActiveClass);b.find("ul").hide();return!1}).bind("doToggle",function(a){b.is(":visible")?b.trigger("doCollapse"):b.trigger("doExpand");return!1});c.disableSelection_dropotron().addClass("opener").css("cursor","pointer").bind("click",function(a){g||(a.preventDefault(),a.stopPropagation(),b.trigger("doToggle"))});"hover"==a.expandMode&&c.hover(function(c){g||(t=window.setTimeout(function(){b.trigger("doExpand")},
a.hoverDelay))},function(b){window.clearTimeout(t)})});p.find("a").css("display","block").click(function(b){g||(e.trigger("doCollapseAll"),b.stopPropagation(),1>f(this).attr("href").length&&b.preventDefault())});e.find("li").css("white-space","nowrap").each(function(){var b=f(this),a=b.children("a"),h=b.children("ul");a.click(function(a){1>f(this).attr("href").length?a.preventDefault():a.stopPropagation()});0<a.length&&0==h.length&&b.click(function(a){g||(e.trigger("doCollapseAll"),a.stopPropagation())})});
e.children("li").each(function(){var b=f(this).children("ul");if(0<b.length){a.detach&&b.detach().appendTo("body");for(var c=a.baseZIndex,e=1;0<b.length;e++)b.css("z-index",c++),a.submenuClassPrefix&&b.addClass(a.submenuClassPrefix+(c-1-a.baseZIndex)),b=b.find("> li > ul")}});q.click(function(){g||e.trigger("doCollapseAll")}).keypress(function(a){g||27!=a.keyCode||(a.preventDefault(),e.trigger("doCollapseAll"))})}})(jQuery);
(function(t){function e(e){for(var o,r,a=e[0],c=e[1],s=e[2],h=0,d=[];h<a.length;h++)r=a[h],Object.prototype.hasOwnProperty.call(i,r)&&i[r]&&d.push(i[r][0]),i[r]=0;for(o in c)Object.prototype.hasOwnProperty.call(c,o)&&(t[o]=c[o]);u&&u(e);while(d.length)d.shift()();return l.push.apply(l,s||[]),n()}function n(){for(var t,e=0;e<l.length;e++){for(var n=l[e],o=!0,a=1;a<n.length;a++){var c=n[a];0!==i[c]&&(o=!1)}o&&(l.splice(e--,1),t=r(r.s=n[0]))}return t}var o={},i={main:0},l=[];function r(e){if(o[e])return o[e].exports;var n=o[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,r),n.l=!0,n.exports}r.m=t,r.c=o,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="";var a=window["webpackJsonp"]=window["webpackJsonp"]||[],c=a.push.bind(a);a.push=e,a=a.slice();for(var s=0;s<a.length;s++)e(a[s]);var u=c;l.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){n("487f"),n("48a2"),t.exports=n("64b5")},1:function(t,e){},1493:function(t,e,n){"use strict";n.r(e),n.d(e,"group",(function(){return a}));n("cb29"),n("a15b"),n("d81d");var o=n("4aad"),i=n("8a2f"),l=n("8bbf"),r=n.n(l);e["default"]={title:"advance"};var a=function(){return r.a.extend({data:function(){return{selection:[]}},render:function(){var t=this,e=arguments[0];return e("div",[e("div",["selected: ",this.selection.join(",")]),e(o["a"],{model:{value:t.selection,callback:function(e){t.selection=e}}},[Array(10).fill(0).map((function(t,n){return e("div",{style:{border:"1px solid #000000",margin:"10px"}},[e(i["a"],{attrs:{itemKey:2*n}},[2*n]),e(i["a"],{attrs:{itemKey:2*n+1}},[2*n+1])])}))])])}})}},"4aad":function(t,e,n){"use strict";var o=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"drag-select__wrapper"},[n("div",{ref:"content",staticClass:"drag-select",staticStyle:{position:"relative"},on:{mousedown:t._onMousedown}},[t._t("default"),n("div",{staticClass:"drag-select__area",class:t.dragAreaClass,style:t.dragSelectAreaStyles})],2)])},i=[],l=(n("4160"),n("4ec9"),n("b64b"),n("d3b7"),n("3ca3"),n("159b"),n("ddb0"),n("5530")),r=n("3835"),a=n("b85c"),c=n("d4ec"),s=n("bee2"),u=n("257e"),h=n("262e"),d=n("2caf"),f=n("9ab4"),v=n("60a3"),p=(n("caad"),n("2532"),function(t){return"undefined"===typeof document?null:t&&t.ownerDocument?t.ownerDocument:document}),b="data-is-scrollable",y=function(t){var e=p(t);if(null===e)return null;var n=t;while(n&&n!==e.body){if("true"===n.getAttribute(b))return n;n=n.parentElement}n=t;while(n&&n!==e.body){if("false"!==n.getAttribute(b)){var o=window.getComputedStyle(n),i=o.getPropertyValue("overflow");if(i.includes("auto")||i.includes("scroll"))return n}n=n.parentElement}return e.body},g=function(t,e){return Math.abs(2*t.left+t.width-2*e.left-e.width)<=t.width+e.width&&Math.abs(2*t.top+t.height-2*e.top-e.height)<=t.height+e.height},m=function(){function t(e){var n=this,o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:15,l=arguments.length>3&&void 0!==arguments[3]?arguments[3]:15;Object(c["a"])(this,t),this.xScrollVelocity=0,this.yScrollVelocity=0,this._onMouseMove=function(t){n._computeScrollVelocity(t),n.needXScroll||n.needYScroll?(t.preventDefault(),t.stopPropagation(),n.startScroll()):n.stopScroll()},this.doScroll=function(){n.scrollableParent&&(n.needXScroll&&(n.scrollableParent.scrollLeft+=n.xScrollVelocity),n.needYScroll&&(n.scrollableParent.scrollTop+=n.yScrollVelocity)),n.cancelScrollId=window.requestAnimationFrame(n.doScroll)},this.scrollGutter=o,this.maxScrollVelocity=l,this.maxScrollSpacing=i,this.scrollableParent=y(e),this.scrollableParent&&(this.scrollableParentRect={left:this.scrollableParent.offsetLeft+this.scrollableParent.clientLeft,top:this.scrollableParent.offsetTop+this.scrollableParent.clientTop,width:this.scrollableParent.clientWidth,height:this.scrollableParent.clientHeight},window.addEventListener("mousemove",this._onMouseMove))}return Object(s["a"])(t,[{key:"dispose",value:function(){window.removeEventListener("mousemove",this._onMouseMove),this.stopScroll()}},{key:"_computeScrollVelocity",value:function(t){var e,n;if(!this.scrollableParentRect)return this.xScrollVelocity=0,void(this.yScrollVelocity=0);var o={top:this.scrollableParentRect.top+this.scrollGutter,bottom:this.scrollableParentRect.top+this.scrollableParentRect.height-this.scrollGutter,left:this.scrollableParentRect.left+this.scrollGutter,right:this.scrollableParentRect.left+this.scrollableParentRect.width-this.scrollGutter},i=p(this.scrollableParent),l=null===i||void 0===i||null===(e=i.scrollingElement)||void 0===e?void 0:e.scrollTop,r=void 0===l?0:l,a=null===i||void 0===i||null===(n=i.scrollingElement)||void 0===n?void 0:n.scrollLeft,c=void 0===a?0:a;t.clientY+r<o.top?this.yScrollVelocity=-Math.min(this.maxScrollVelocity,this.maxScrollVelocity*-(t.clientY+r-o.top)/this.maxScrollSpacing):t.clientY+r>o.bottom?this.yScrollVelocity=Math.min(this.maxScrollVelocity,this.maxScrollVelocity*(t.clientY+r-o.bottom)/this.maxScrollSpacing):this.yScrollVelocity=0,t.clientX+c<o.left?this.xScrollVelocity=-Math.min(this.maxScrollVelocity,this.maxScrollVelocity*-(t.clientX+c-o.left)/this.maxScrollSpacing):t.clientX+c>o.right?this.xScrollVelocity=Math.min(this.maxScrollVelocity,this.maxScrollVelocity*(t.clientX+c-o.right)/this.maxScrollSpacing):this.xScrollVelocity=0}},{key:"startScroll",value:function(){this.cancelScrollId||this.doScroll()}},{key:"stopScroll",value:function(){this.cancelScrollId&&(window.cancelAnimationFrame(this.cancelScrollId),this.cancelScrollId=void 0)}},{key:"needXScroll",get:function(){return 0!==this.xScrollVelocity}},{key:"needYScroll",get:function(){return 0!==this.yScrollVelocity}}]),t}(),S=function(t){Object(h["a"])(n,t);var e=Object(d["a"])(n);function n(){var t;return Object(c["a"])(this,n),t=e.apply(this,arguments),t.dragSelect=Object(u["a"])(t),t.startPoint=null,t.endPoint=null,t.options=new Map,t.optionRectCache=null,t}return Object(s["a"])(n,[{key:"mounted",value:function(){this._scrollableParent=y(this.contentRef)}},{key:"beforeDestroy",value:function(){window.removeEventListener("mousemove",this._onMousemove),window.removeEventListener("mouseup",this._onMouseup),this._scrollableParent.removeEventListener("scroll",this._onScrollableParentScroll)}},{key:"_getSelfRect",value:function(){var t=this.contentRef;return{left:t.offsetLeft,top:t.offsetTop,width:t.getBoundingClientRect().width,height:t.getBoundingClientRect().height}}},{key:"_getCurrentPoint",value:function(t){var e=this.contentRef.getBoundingClientRect(),n=e.left,o=e.top,i=e.width,l=e.height;return{x:Math.max(0,Math.min(t.clientX-n-this.contentRef.clientLeft,i)),y:Math.max(0,Math.min(t.clientY-o-this.contentRef.clientTop,l))}}},{key:"_isMouseEventInClientArea",value:function(t){var e,n,o=p(this.contentRef),i=null===o||void 0===o||null===(e=o.scrollingElement)||void 0===e?void 0:e.scrollTop,l=void 0===i?0:i,r=null===o||void 0===o||null===(n=o.scrollingElement)||void 0===n?void 0:n.scrollLeft,a=void 0===r?0:r,c=this.contentRef;return!(t.clientX+a<c.offsetLeft+c.clientLeft||t.clientX+a>c.offsetLeft+c.clientLeft+c.clientWidth)&&!(t.clientY+l<c.offsetTop+c.clientTop||t.clientY+l>c.offsetTop+c.clientTop+c.clientHeight)}},{key:"_onMousedown",value:function(t){this.cleanDrag(),this._isMouseEventInClientArea(t)&&(this.startPoint=this._getCurrentPoint(t),this.autoScroll=new m(this.contentRef),window.addEventListener("mousemove",this._onMousemove),window.addEventListener("mouseup",this._onMouseup),this._scrollableParent.addEventListener("scroll",this._onScrollableParentScroll))}},{key:"_onMousemove",value:function(t){this._drag(t),t.preventDefault(),t.stopPropagation()}},{key:"_onMouseup",value:function(){this.cleanDrag()}},{key:"_onScrollableParentScroll",value:function(t){this._drag(t)}},{key:"_drag",value:function(t){void 0!==t.clientX&&(this.lastMouseEvent=t),this.endPoint=this._getCurrentPoint(this.lastMouseEvent);var e,n={},o={},i=Object(a["a"])(this.options);try{for(i.s();!(e=i.n()).done;){var l=Object(r["a"])(e.value,2),c=l[0],s=l[1];if(this.optionRectCache||(this.optionRectCache=new Map),!this.optionRectCache.has(c)){var u=s.$el;this.optionRectCache.set(c,{left:u.offsetLeft,top:u.offsetTop,width:u.offsetWidth,height:u.offsetHeight})}var h=g(this.dragSelectAreaRect,this.optionRectCache.get(c));h&&(n[c]=!0,o[c]=!0)}}catch(p){i.e(p)}finally{i.f()}var d=!1;if(!d)for(var f in this.selectedOptionKeys)if(delete o[f],this.selectedOptionKeys[f]!==n[f]){d=!0;break}for(var v in o)if(this.selectedOptionKeys[v]!==n[v]){d=!0;break}d&&(this.selectedOptionKeys=n)}},{key:"cleanDrag",value:function(){var t;this.startPoint=null,this.endPoint=null,null===(t=this.autoScroll)||void 0===t||t.dispose(),window.removeEventListener("mousemove",this._onMousemove),window.removeEventListener("mouseup",this._onMouseup),this._scrollableParent.removeEventListener("scroll",this._onScrollableParentScroll),this.optionRectCache=null}},{key:"dragSelectAreaRect",get:function(){return this.startPoint&&this.endPoint?{left:Math.min(this.startPoint.x,this.endPoint.x),top:Math.min(this.startPoint.y,this.endPoint.y),width:Math.abs(this.startPoint.x-this.endPoint.x),height:Math.abs(this.startPoint.y-this.endPoint.y)}:null}},{key:"dragSelectAreaStyles",get:function(){if(!this.dragSelectAreaRect)return{display:"none"};var t=this.dragSelectAreaRect,e=t.left,n=t.top,o=t.width,i=t.height;return Object(l["a"])(Object(l["a"])({position:"absolute"},this.dragAreaStyle),{},{left:"".concat(e,"px"),top:"".concat(n,"px"),width:"".concat(o,"px"),height:"".concat(i,"px")})}},{key:"selectedOptionKeys",get:function(){var t={};return this.value.forEach((function(e){t[e]=!0})),t},set:function(t){this.$emit("change",Object.keys(t))}}]),n}(v["g"]);Object(f["a"])([Object(v["f"])("content")],S.prototype,"contentRef",void 0),Object(f["a"])([Object(v["e"])()],S.prototype,"dragSelect",void 0),Object(f["a"])([Object(v["c"])("change",{required:!0,default:[]})],S.prototype,"value",void 0),Object(f["a"])([Object(v["d"])()],S.prototype,"dragAreaClass",void 0),Object(f["a"])([Object(v["d"])({type:Object,default:function(){return{}}})],S.prototype,"dragAreaStyle",void 0),Object(f["a"])([Object(v["d"])({default:""})],S.prototype,"SelecteditemClass",void 0),S=Object(f["a"])([Object(v["a"])({name:"DragSelect"})],S);var O=S,w=O,j=n("2877"),x=Object(j["a"])(w,o,i,!1,null,null,null);e["a"]=x.exports},"64b5":function(t,e,n){"use strict";n.r(e),function(t){var e=n("7d14");t._StorybookPreserveDecorators=!0,Object(e["configure"])([n("6886"),n("c2a7")],t)}.call(this,n("dd40")(t))},6886:function(t,e,n){var o={"./base.stories.jsx":"c892"};function i(t){var e=l(t);return n(e)}function l(t){if(!n.o(o,t)){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}return o[t]}i.keys=function(){return Object.keys(o)},i.resolve=l,t.exports=i,i.id="6886"},7037:function(t,e){t.exports=React},"7dac":function(t,e){t.exports=ReactDOM},"8a2f":function(t,e,n){"use strict";var o=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{class:t.itemClass},[t._t("default")],2)},i=[],l=(n("c975"),n("a434"),n("ade3")),r=n("d4ec"),a=n("bee2"),c=n("262e"),s=n("2caf"),u=n("9ab4"),h=n("60a3"),d=function(t){Object(c["a"])(n,t);var e=Object(s["a"])(n);function n(){return Object(r["a"])(this,n),e.apply(this,arguments)}return Object(a["a"])(n,[{key:"created",value:function(){this.dragSelect.options.set(this.itemKey,this)}},{key:"beforeDestroy",value:function(){var t;this.dragSelect.options.delete(this.itemKey),null===(t=this.dragSelect.optionRectCache)||void 0===t||t.delete(this.itemKey);var e=this.dragSelect.value.indexOf(this.itemKey);e>-1&&this.dragSelect.value.splice(e,1)}},{key:"itemClass",get:function(){var t;return t={"drag-select__option":!0,"drag-select__option--selected":this.isSelected},Object(l["a"])(t,this.dragSelect.SelecteditemClass,this.isSelected),Object(l["a"])(t,this.selectedClass,this.isSelected),t}},{key:"isSelected",get:function(){return!!this.dragSelect.selectedOptionKeys[this.itemKey]}}]),n}(h["g"]);Object(u["a"])([Object(h["b"])()],d.prototype,"dragSelect",void 0),Object(u["a"])([Object(h["d"])({required:!0})],d.prototype,"itemKey",void 0),Object(u["a"])([Object(h["d"])({default:""})],d.prototype,"selectedClass",void 0),d=Object(u["a"])([Object(h["a"])({name:"DragSelectOption"})],d);var f=d,v=f,p=n("2877"),b=Object(p["a"])(v,o,i,!1,null,null,null);e["a"]=b.exports},"8bbf":function(t,e){t.exports=Vue},c2a7:function(t,e,n){var o={"./advance.stories.jsx":"1493"};function i(t){var e=l(t);return n(e)}function l(t){if(!n.o(o,t)){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}return o[t]}i.keys=function(){return Object.keys(o)},i.resolve=l,t.exports=i,i.id="c2a7"},c892:function(t,e,n){"use strict";n.r(e),n.d(e,"base",(function(){return a})),n.d(e,"scroll",(function(){return c})),n.d(e,"scrollOnParent",(function(){return s})),n.d(e,"dragOnlyInRect",(function(){return u}));n("cb29"),n("a15b"),n("d81d");var o=n("4aad"),i=n("8a2f"),l=(n("d4b2"),n("8bbf")),r=n.n(l);e["default"]={title:"base"};var a=function(){return r.a.extend({data:function(){return{value:[]}},methods:{handleChange:function(t){this.value=t}},render:function(){var t=arguments[0];return t("div",[t("div",["selected: ",this.value.join(",")]),t(o["a"],{attrs:{value:this.value},on:{change:this.handleChange}},[Array(20).fill(0).map((function(e,n){return t(i["a"],{attrs:{itemKey:n}},[n])}))])])}})},c=function(){return r.a.extend({data:function(){return{value:[]}},methods:{handleChange:function(t){this.value=t}},render:function(){var t=arguments[0];return t("div",[t("div",["scroll on dragSelect compoent itself"]),t("div",["selected: ",this.value.join(",")]),t(o["a"],{attrs:{value:this.value},style:{height:"300px",overflow:"auto"},on:{change:this.handleChange}},[Array(30).fill(0).map((function(e,n){return t(i["a"],{attrs:{itemKey:n}},[n])}))])])}})},s=function(){return r.a.extend({data:function(){return{value:[]}},methods:{handleChange:function(t){this.value=t}},render:function(){var t=arguments[0];return t("div",{style:{height:"300px",overflow:"auto"}},[t("div",["scroll on dragSelect compoent parent"]),t("div",["selected: ",this.value.join(",")]),t(o["a"],{attrs:{value:this.value},on:{change:this.handleChange}},[Array(30).fill(0).map((function(e,n){return t(i["a"],{attrs:{itemKey:n}},[n])}))])])}})},u=function(){return r.a.extend({data:function(){return{value:[]}},methods:{handleChange:function(t){this.value=t}},render:function(){var t=arguments[0];return t("div",[t("div",["drag only in client(mousedown event will not trigger on scrollbar or border)"]),t("div",["selected: ",this.value.join(",")]),t(o["a"],{attrs:{value:this.value},style:{height:"300px",overflow:"auto",border:"20px solid #d83512"},on:{change:this.handleChange}},[Array(30).fill(0).map((function(e,n){return t(i["a"],{attrs:{itemKey:n}},[n])}))])])}})}},d4b2:function(t,e,n){}});
//# sourceMappingURL=main.f15d924df6dc94aa6ad5.bundle.js.map
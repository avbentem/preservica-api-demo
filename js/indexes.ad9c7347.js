(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["indexes"],{6062:function(e,t,n){"use strict";var r=n("6d61"),i=n("6566");e.exports=r("Set",(function(e){return function(){return e(this,arguments.length?arguments[0]:void 0)}}),i)},6566:function(e,t,n){"use strict";var r=n("9bf2").f,i=n("7c73"),o=n("e2cc"),a=n("0366"),l=n("19aa"),u=n("2266"),c=n("7dd0"),s=n("2626"),d=n("83ab"),f=n("f183").fastKey,b=n("69f3"),p=b.set,v=b.getterFor;e.exports={getConstructor:function(e,t,n,c){var s=e((function(e,r){l(e,s,t),p(e,{type:t,index:i(null),first:void 0,last:void 0,size:0}),d||(e.size=0),void 0!=r&&u(r,e[c],{that:e,AS_ENTRIES:n})})),b=v(t),m=function(e,t,n){var r,i,o=b(e),a=h(e,t);return a?a.value=n:(o.last=a={index:i=f(t,!0),key:t,value:n,previous:r=o.last,next:void 0,removed:!1},o.first||(o.first=a),r&&(r.next=a),d?o.size++:e.size++,"F"!==i&&(o.index[i]=a)),e},h=function(e,t){var n,r=b(e),i=f(t);if("F"!==i)return r.index[i];for(n=r.first;n;n=n.next)if(n.key==t)return n};return o(s.prototype,{clear:function(){var e=this,t=b(e),n=t.index,r=t.first;while(r)r.removed=!0,r.previous&&(r.previous=r.previous.next=void 0),delete n[r.index],r=r.next;t.first=t.last=void 0,d?t.size=0:e.size=0},delete:function(e){var t=this,n=b(t),r=h(t,e);if(r){var i=r.next,o=r.previous;delete n.index[r.index],r.removed=!0,o&&(o.next=i),i&&(i.previous=o),n.first==r&&(n.first=i),n.last==r&&(n.last=o),d?n.size--:t.size--}return!!r},forEach:function(e){var t,n=b(this),r=a(e,arguments.length>1?arguments[1]:void 0,3);while(t=t?t.next:n.first){r(t.value,t.key,this);while(t&&t.removed)t=t.previous}},has:function(e){return!!h(this,e)}}),o(s.prototype,n?{get:function(e){var t=h(this,e);return t&&t.value},set:function(e,t){return m(this,0===e?0:e,t)}}:{add:function(e){return m(this,e=0===e?0:e,e)}}),d&&r(s.prototype,"size",{get:function(){return b(this).size}}),s},setStrong:function(e,t,n){var r=t+" Iterator",i=v(t),o=v(r);c(e,t,(function(e,t){p(this,{type:r,target:e,state:i(e),kind:t,last:void 0})}),(function(){var e=o(this),t=e.kind,n=e.last;while(n&&n.removed)n=n.previous;return e.target&&(e.last=n=n?n.next:e.state.first)?"keys"==t?{value:n.key,done:!1}:"values"==t?{value:n.value,done:!1}:{value:[n.key,n.value],done:!1}:(e.target=void 0,{value:void 0,done:!0})}),n?"entries":"values",!n,!0),s(t)}}},"6d61":function(e,t,n){"use strict";var r=n("23e7"),i=n("da84"),o=n("94ca"),a=n("6eeb"),l=n("f183"),u=n("2266"),c=n("19aa"),s=n("861d"),d=n("d039"),f=n("1c7e"),b=n("d44e"),p=n("7156");e.exports=function(e,t,n){var v=-1!==e.indexOf("Map"),m=-1!==e.indexOf("Weak"),h=v?"set":"add",j=i[e],O=j&&j.prototype,y=j,x={},g=function(e){var t=O[e];a(O,e,"add"==e?function(e){return t.call(this,0===e?0:e),this}:"delete"==e?function(e){return!(m&&!s(e))&&t.call(this,0===e?0:e)}:"get"==e?function(e){return m&&!s(e)?void 0:t.call(this,0===e?0:e)}:"has"==e?function(e){return!(m&&!s(e))&&t.call(this,0===e?0:e)}:function(e,n){return t.call(this,0===e?0:e,n),this})};if(o(e,"function"!=typeof j||!(m||O.forEach&&!d((function(){(new j).entries().next()})))))y=n.getConstructor(t,e,v,h),l.REQUIRED=!0;else if(o(e,!0)){var w=new y,E=w[h](m?{}:-0,1)!=w,k=d((function(){w.has(1)})),S=f((function(e){new j(e)})),V=!m&&d((function(){var e=new j,t=5;while(t--)e[h](t,t);return!e.has(-0)}));S||(y=t((function(t,n){c(t,y,e);var r=p(new j,t,y);return void 0!=n&&u(n,r[h],{that:r,AS_ENTRIES:v}),r})),y.prototype=O,O.constructor=y),(k||V)&&(g("delete"),g("has"),v&&g("get")),(V||E)&&g(h),m&&O.clear&&delete O.clear}return x[e]=y,r({global:!0,forced:y!=j},x),b(y,e),m||n.setStrong(y,e,v),y}},7156:function(e,t,n){var r=n("861d"),i=n("d2bb");e.exports=function(e,t,n){var o,a;return i&&"function"==typeof(o=t.constructor)&&o!==n&&r(a=o.prototype)&&a!==n.prototype&&i(e,a),e}},"8c18":function(e,t,n){"use strict";n.r(t);var r=n("7a23"),i={class:"indexes intro p-mb-6"},o=Object(r["m"])("h1",null,"Indexed fields",-1),a=Object(r["m"])("p",null,[Object(r["l"])(" The "),Object(r["m"])("a",{href:"https://developers.preservica.com/api-reference/8-content-api"},"Content API"),Object(r["l"])(" can return the indexed fields, which can be used for search facets. ")],-1),l={key:0},u={style:{"text-align":"right"}},c=Object(r["m"])("i",{class:"pi pi-search",style:{margin:"4px 4px 0px 0px"}},null,-1),s={class:"json"};function d(e,t,n,d,f,b){var p=Object(r["E"])("AuthWarning"),v=Object(r["E"])("Button"),m=Object(r["E"])("InputText"),h=Object(r["E"])("Column"),j=Object(r["E"])("MultiSelect"),O=Object(r["E"])("Dropdown"),y=Object(r["E"])("DataTable"),x=Object(r["E"])("AccordionTab"),g=Object(r["E"])("Accordion");return Object(r["w"])(),Object(r["h"])(r["a"],null,[Object(r["m"])("div",i,[o,a,Object(r["m"])(p),e.configured?(Object(r["w"])(),Object(r["h"])(v,{key:0,icon:"pi pi-cloud-download",onClick:e.getFields,label:"Get indexed fields"},null,8,["onClick"])):Object(r["i"])("",!0)]),e.fields?(Object(r["w"])(),Object(r["h"])("div",l,[Object(r["m"])(g,{activeIndex:0},{default:Object(r["P"])((function(){return[Object(r["m"])(x,{header:"Table"},{default:Object(r["P"])((function(){return[Object(r["m"])(y,{value:e.fields.value,autoLayout:!0,sortMode:"multiple",multiSortMeta:e.multiSortMeta,filters:e.filters},{header:Object(r["P"])((function(){return[Object(r["m"])("div",u,[c,Object(r["m"])(m,{modelValue:e.filters["global"],"onUpdate:modelValue":t[1]||(t[1]=function(t){return e.filters["global"]=t}),placeholder:"all-column search",size:"50"},null,8,["modelValue"])])]})),default:Object(r["P"])((function(){return[Object(r["m"])(h,{field:"index",header:"index",sortable:!0,filterMatchMode:"contains"},{filter:Object(r["P"])((function(){return[Object(r["m"])(m,{type:"text",modelValue:e.filters["index"],"onUpdate:modelValue":t[2]||(t[2]=function(t){return e.filters["index"]=t}),class:"p-column-filter"},null,8,["modelValue"])]})),_:1}),Object(r["m"])(h,{field:"shortName",header:"short name",sortable:!0,filterMatchMode:"contains"},{filter:Object(r["P"])((function(){return[Object(r["m"])(m,{type:"text",modelValue:e.filters["shortName"],"onUpdate:modelValue":t[3]||(t[3]=function(t){return e.filters["shortName"]=t}),class:"p-column-filter"},null,8,["modelValue"])]})),_:1}),Object(r["m"])(h,{field:"displayName",header:"display name",sortable:!0,filterMatchMode:"contains"},{filter:Object(r["P"])((function(){return[Object(r["m"])(m,{type:"text",modelValue:e.filters["displayName"],"onUpdate:modelValue":t[4]||(t[4]=function(t){return e.filters["displayName"]=t}),class:"p-column-filter"},null,8,["modelValue"])]})),_:1}),Object(r["m"])(h,{field:"type",header:"type",sortable:!0,filterMatchMode:"in"},{filter:Object(r["P"])((function(){return[Object(r["m"])(j,{modelValue:e.filters["type"],"onUpdate:modelValue":t[5]||(t[5]=function(t){return e.filters["type"]=t}),options:e.types,placeholder:"All"},null,8,["modelValue","options"])]})),_:1}),Object(r["m"])(h,{field:"facetable",header:"facet",sortable:!0,filterMatchMode:"equals"},{filter:Object(r["P"])((function(){return[Object(r["m"])(O,{modelValue:e.filters["facetable"],"onUpdate:modelValue":t[6]||(t[6]=function(t){return e.filters["facetable"]=t}),options:[!0,!1],placeholder:"All",showClear:!0},null,8,["modelValue"])]})),_:1})]})),_:1},8,["value","multiSortMeta","filters"])]})),_:1}),Object(r["m"])(x,{header:"JSON"},{default:Object(r["P"])((function(){return[Object(r["m"])("div",s,Object(r["I"])(e.fields),1)]})),_:1})]})),_:1})])):Object(r["i"])("",!0)],64)}n("d81d"),n("d3b7"),n("6062"),n("3ca3"),n("ddb0");var f=n("6b75");function b(e){if(Array.isArray(e))return Object(f["a"])(e)}n("a4d3"),n("e01a"),n("d28b"),n("a630");function p(e){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}var v=n("06c5");function m(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function h(e){return b(e)||p(e)||Object(v["a"])(e)||m()}n("96cf");var j=n("1da1"),O=n("34f5"),y=n("d0f2"),x=Object(r["n"])({components:{AuthWarning:O["a"]},setup:function(){var e=Object(y["b"])(),t=e.configured,n=e.fetchWithToken,i=Object(r["B"])(void 0),o=Object(r["B"])([]),a=Object(r["B"])([]),l=Object(r["B"])({}),u=Object(r["B"])([{field:"shortName",order:1},{field:"displayName",order:1}]),c=function(){var e=Object(j["a"])(regeneratorRuntime.mark((function e(){var t,r,l;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,n("api/content/indexed-fields");case 2:return l=e.sent,e.next=5,l.json();case 5:i.value=e.sent,o.value=h(new Set(null===i||void 0===i||null===(t=i.value)||void 0===t?void 0:t.value.map((function(e){return e.shortName})))),a.value=h(new Set(null===i||void 0===i||null===(r=i.value)||void 0===r?void 0:r.value.map((function(e){return e.type}))));case 8:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return{configured:t,fields:i,filters:l,multiSortMeta:u,shortNames:o,types:a,getFields:c}}});x.render=d;t["default"]=x},bb2f:function(e,t,n){var r=n("d039");e.exports=!r((function(){return Object.isExtensible(Object.preventExtensions({}))}))},d81d:function(e,t,n){"use strict";var r=n("23e7"),i=n("b727").map,o=n("1dde"),a=n("ae40"),l=o("map"),u=a("map");r({target:"Array",proto:!0,forced:!l||!u},{map:function(e){return i(this,e,arguments.length>1?arguments[1]:void 0)}})},f183:function(e,t,n){var r=n("d012"),i=n("861d"),o=n("5135"),a=n("9bf2").f,l=n("90e3"),u=n("bb2f"),c=l("meta"),s=0,d=Object.isExtensible||function(){return!0},f=function(e){a(e,c,{value:{objectID:"O"+ ++s,weakData:{}}})},b=function(e,t){if(!i(e))return"symbol"==typeof e?e:("string"==typeof e?"S":"P")+e;if(!o(e,c)){if(!d(e))return"F";if(!t)return"E";f(e)}return e[c].objectID},p=function(e,t){if(!o(e,c)){if(!d(e))return!0;if(!t)return!1;f(e)}return e[c].weakData},v=function(e){return u&&m.REQUIRED&&d(e)&&!o(e,c)&&f(e),e},m=e.exports={REQUIRED:!1,fastKey:b,getWeakData:p,onFreeze:v};r[c]=!0}}]);
//# sourceMappingURL=indexes.ad9c7347.js.map
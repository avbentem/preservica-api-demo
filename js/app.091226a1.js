(function(e){function t(t){for(var r,o,i=t[0],s=t[1],u=t[2],l=0,d=[];l<i.length;l++)o=i[l],Object.prototype.hasOwnProperty.call(a,o)&&a[o]&&d.push(a[o][0]),a[o]=0;for(r in s)Object.prototype.hasOwnProperty.call(s,r)&&(e[r]=s[r]);p&&p(t);while(d.length)d.shift()();return c.push.apply(c,u||[]),n()}function n(){for(var e,t=0;t<c.length;t++){for(var n=c[t],r=!0,o=1;o<n.length;o++){var i=n[o];0!==a[i]&&(r=!1)}r&&(c.splice(t--,1),e=s(s.s=n[0]))}return e}var r={},o={app:0},a={app:0},c=[];function i(e){return s.p+"js/"+({curl:"curl",indexes:"indexes","oai-pmh":"oai-pmh",search:"search"}[e]||e)+"."+{curl:"150d5ca7",indexes:"5413b497","oai-pmh":"c1dc02b3",search:"7eeee692"}[e]+".js"}function s(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.e=function(e){var t=[],n={search:1};o[e]?t.push(o[e]):0!==o[e]&&n[e]&&t.push(o[e]=new Promise((function(t,n){for(var r="css/"+({curl:"curl",indexes:"indexes","oai-pmh":"oai-pmh",search:"search"}[e]||e)+"."+{curl:"31d6cfe0",indexes:"31d6cfe0","oai-pmh":"31d6cfe0",search:"3ed78218"}[e]+".css",a=s.p+r,c=document.getElementsByTagName("link"),i=0;i<c.length;i++){var u=c[i],l=u.getAttribute("data-href")||u.getAttribute("href");if("stylesheet"===u.rel&&(l===r||l===a))return t()}var d=document.getElementsByTagName("style");for(i=0;i<d.length;i++){u=d[i],l=u.getAttribute("data-href");if(l===r||l===a)return t()}var p=document.createElement("link");p.rel="stylesheet",p.type="text/css",p.onload=t,p.onerror=function(t){var r=t&&t.target&&t.target.src||a,c=new Error("Loading CSS chunk "+e+" failed.\n("+r+")");c.code="CSS_CHUNK_LOAD_FAILED",c.request=r,delete o[e],p.parentNode.removeChild(p),n(c)},p.href=a;var f=document.getElementsByTagName("head")[0];f.appendChild(p)})).then((function(){o[e]=0})));var r=a[e];if(0!==r)if(r)t.push(r[2]);else{var c=new Promise((function(t,n){r=a[e]=[t,n]}));t.push(r[2]=c);var u,l=document.createElement("script");l.charset="utf-8",l.timeout=120,s.nc&&l.setAttribute("nonce",s.nc),l.src=i(e);var d=new Error;u=function(t){l.onerror=l.onload=null,clearTimeout(p);var n=a[e];if(0!==n){if(n){var r=t&&("load"===t.type?"missing":t.type),o=t&&t.target&&t.target.src;d.message="Loading chunk "+e+" failed.\n("+r+": "+o+")",d.name="ChunkLoadError",d.type=r,d.request=o,n[1](d)}a[e]=void 0}};var p=setTimeout((function(){u({type:"timeout",target:l})}),12e4);l.onerror=l.onload=u,document.head.appendChild(l)}return Promise.all(t)},s.m=e,s.c=r,s.d=function(e,t,n){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},s.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(s.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)s.d(n,r,function(t){return e[t]}.bind(null,r));return n},s.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="/preservica-api-demo/",s.oe=function(e){throw console.error(e),e};var u=window["webpackJsonp"]=window["webpackJsonp"]||[],l=u.push.bind(u);u.push=t,u=u.slice();for(var d=0;d<u.length;d++)t(u[d]);var p=l;c.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("cd49")},"27d5":function(e,t,n){},"2af1":function(e,t,n){"use strict";n("94c2")},"34f5":function(e,t,n){"use strict";var r=n("7a23"),o={key:0},a=Object(r["l"])(" You need to "),c=Object(r["l"])("configure this demo"),i=Object(r["l"])(" to access your data. ");function s(e,t,n,s,u,l){var d=Object(r["E"])("router-link");return e.configured?Object(r["i"])("",!0):(Object(r["w"])(),Object(r["h"])("p",o,[a,Object(r["m"])(d,{to:"/config"},{default:Object(r["P"])((function(){return[c]})),_:1}),i]))}var u=n("d0f2"),l=Object(r["n"])({setup:function(){var e=Object(u["b"])(),t=e.configured;return{configured:t}}});l.render=s;t["a"]=l},"94c2":function(e,t,n){},cd49:function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var r=n("7a23"),o=n("de53"),a=n("c8c8"),c=n("bb57"),i=n("2052"),s=n("6f85"),u=n("1f80"),l=n("5b2c"),d=n("0100"),p=n("3822"),f=n("8398"),h=n("4147"),m=n("c1e1"),b=n("a034"),v=n("9319"),g=n("c982"),O=n("eeae"),j=n("20de"),w=n("4c62"),y=n("b3b6"),k=n("485c"),x=n("6b8c"),P=n("71bf"),T={id:"nav"},S=Object(r["l"])("home"),A=Object(r["l"])(" | "),C=Object(r["l"])("configuration"),I=Object(r["l"])(" | "),R=Object(r["l"])("indexed fields"),E=Object(r["l"])(" | "),U=Object(r["l"])("search"),_=Object(r["l"])(" | "),V=Object(r["l"])("oai-pmh"),L=Object(r["l"])(" | "),F=Object(r["l"])("curl");function N(e,t,n,o,a,c){var i=Object(r["E"])("router-link"),s=Object(r["E"])("router-view"),u=Object(r["E"])("Toast");return Object(r["w"])(),Object(r["h"])(r["a"],null,[Object(r["m"])("div",T,[Object(r["m"])(i,{to:"/"},{default:Object(r["P"])((function(){return[S]})),_:1}),A,Object(r["m"])(i,{to:"/config"},{default:Object(r["P"])((function(){return[C]})),_:1}),I,Object(r["m"])(i,{to:"/indexes"},{default:Object(r["P"])((function(){return[R]})),_:1}),E,Object(r["m"])(i,{to:"/search"},{default:Object(r["P"])((function(){return[U]})),_:1}),_,Object(r["m"])(i,{to:"/oai-pmh"},{default:Object(r["P"])((function(){return[V]})),_:1}),L,Object(r["m"])(i,{to:"/curl"},{default:Object(r["P"])((function(){return[F]})),_:1})]),Object(r["m"])(s,null,{default:Object(r["P"])((function(e){var t=e.Component;return[(Object(r["w"])(),Object(r["h"])(r["b"],null,[(Object(r["w"])(),Object(r["h"])(Object(r["G"])(t)))],1024))]})),_:1}),Object(r["m"])(u)],64)}var D=n("d0f2"),q={setup:function(){Object(D["a"])()}};n("d13f");q.render=N;var W=q,B=(n("d3b7"),n("6c02")),H=Object(r["T"])("data-v-3d41e234");Object(r["z"])("data-v-3d41e234");var M={class:"home intro"},Q=Object(r["m"])("h1",null,"Preservica APIs demo",-1),J=Object(r["m"])("p",null,[Object(r["l"])(" This is a (work in progress) kitchen sink showing various usage examples for some of the Preservica APIs as documented "),Object(r["m"])("a",{href:"https://developers.preservica.com/api-reference"},"on their website"),Object(r["l"])(" and in the Swagger UI interfaces "),Object(r["m"])("a",{href:"https://eu.preservica.com/api/documentation.html"},"on your own instance"),Object(r["l"])(" (adjust URL to match your Cloud Edition domain). ")],-1),z=Object(r["m"])("p",null," This demo application runs in your browser, but for a typical use case the APIs would be accessed from a server application instead. ",-1),G=Object(r["m"])("p",{class:"affiliation"},[Object(r["l"])(" Preservica™ is a trademark of "),Object(r["m"])("a",{href:"https://preservica.com/"},"Preservica Ltd"),Object(r["l"])(". The creator of this application is not affiliated with that organisation. ")],-1);Object(r["x"])();var Y=H((function(e,t,n,o,a,c){var i=Object(r["E"])("AuthWarning");return Object(r["w"])(),Object(r["h"])("div",M,[Q,J,z,Object(r["m"])(i),G])})),K=n("34f5"),X=Object(r["n"])({name:"Home",components:{AuthWarning:K["a"]}});n("2af1");X.render=Y,X.__scopeId="data-v-3d41e234";var $=X,Z={class:"configuration intro"},ee=Object(r["m"])("h1",null,"Configuration",-1),te={key:0},ne={key:1},re=Object(r["k"])('<p> The Preservica APIs needs authorization, even for anonymous access. Above you need to set credentials, which this demo will use whenever it needs a new &quot;access token&quot; on the other pages of this demo. This demo will also show when a new token is created, but in this demo you don&#39;t need to do anything with that yourself. </p><p> When logged in to Preservica Cloud Edition, the session cookie <a href="https://eu.preservica.com/OAI-PMH/?verb=Identify">will be used</a> when accessing the APIs in a browser directly. But for most use cases, a successful login on <a href="https://developers.preservica.com/api-reference/6-access-token-api">the Access Token API</a> is required and yields an access token and a refresh token. An access token is valid for 15 minutes and can be used in an HTTP header. However, the refresh token is valid for the same short period as the access token (and can only be used once), so is only useful when continuously accessing the API. In this demo the refresh token is ignored, and instead a new login is performed whenever the access token has expired. </p><p> An access token is also used for Preservica-provided thumbnails and embedded document viewer. Prior to Preservica 6.3.1, keeping that viewer open beyond the token&#39;s lifetime, may have made the viewer prompt for credentials. (Since 6.3.1 <a href="https://usergroup.preservica.com/forums/topic/viewing-content-in-external-viewer/page/2/#post-5863">the token is refreshed and stored in a cookie if it was about to expire</a>. For older versions, a sane browser should also warn you that any credentials will not be sent to this demo application, but to the Preservica server that hosts the embedded viewer.) </p><p> A token can also be generated through the externally authenticated acquisition API. This allows a trusted external application to acquire Preservica access rights without being authenticated by Preservica. See the documentation linked above. For Cloud Edition this is only available when using SAML in conjunction with Universal Access. </p><p> Even though the Swagger UI interface for the Authentication API uses the wrong Content Type and throws a 400 Bad Request, a token created above can often (for a short time) be used when clicking the &quot;Authorize&quot; button in <a href="https://eu.preservica.com/api/documentation.html">the Swagger UI interfaces</a> for the other APIs (adjust URL to match your Cloud Edition domain). </p>',5);function oe(e,t,n,o,a,c){var i=Object(r["E"])("ConfigInput");return Object(r["w"])(),Object(r["h"])("div",Z,[ee,Object(r["m"])(i),e.configured?Object(r["i"])("",!0):(Object(r["w"])(),Object(r["h"])("h2",te,'Please complete the form and hit "Save" or "Log in"')),e.user?(Object(r["w"])(),Object(r["h"])("h2",ne,"Welcome, "+Object(r["I"])(e.user.fullName)+" (on "+Object(r["I"])(e.user.tenant)+")",1)):Object(r["i"])("",!0),re])}var ae={class:"configinput"},ce=Object(r["m"])("h2",null,"Server and credentials",-1),ie={class:"p-fluid p-formgrid p-grid p-text-left"},se={class:"p-field p-col-12"},ue=Object(r["m"])("label",{for:"proxy"},"CORS proxy",-1),le=Object(r["m"])("small",{id:"proxy-help"},[Object(r["l"])(" This demo runs in your browser, but the Preservica APIs do not support "),Object(r["m"])("a",{href:"https://developer.mozilla.org/docs/Web/HTTP/CORS"},"CORS"),Object(r["l"])(". A proxy server can add CORS headers to use a browser on a different domain. The full API URL will be appended without any encoding. "),Object(r["m"])("strong",null,"A third-party proxy may log your credentials."),Object(r["l"])(" To avoid the need for a third-party proxy, you can "),Object(r["m"])("a",{href:"https://github.com/avbentem/preservica-api-demo#development"},"run this project locally"),Object(r["l"])(". ")],-1),de={class:"p-field p-col-12"},pe=Object(r["m"])("label",{for:"host"},"API host",-1),fe={class:"p-field p-col-12 p-md-3"},he=Object(r["m"])("label",{for:"tenant"},"Tenant",-1),me={class:"p-field p-col-12 p-md-5"},be=Object(r["m"])("label",{for:"username"},"Username",-1),ve={class:"p-field p-col-12 p-md-4"},ge=Object(r["m"])("label",{for:"password"},"Password",-1),Oe=Object(r["m"])("small",{id:"password-help"}," If saved, this is not encrypted ",-1),je=Object(r["l"])("   "),we=Object(r["l"])("   ");function ye(e,t,n,o,a,c){var i=Object(r["E"])("InputText"),s=Object(r["E"])("Button"),u=Object(r["F"])("tooltip");return Object(r["w"])(),Object(r["h"])("div",ae,[ce,Object(r["m"])("div",ie,[Object(r["m"])("div",se,[ue,Object(r["m"])(i,{id:"proxy",type:"text",modelValue:e.config.proxy,"onUpdate:modelValue":t[1]||(t[1]=function(t){return e.config.proxy=t}),"aria-describedby":"proxy-help"},null,8,["modelValue"]),le]),Object(r["m"])("div",de,[pe,Object(r["Q"])(Object(r["m"])(i,{id:"host",type:"text",modelValue:e.config.host,"onUpdate:modelValue":t[2]||(t[2]=function(t){return e.config.host=t}),placeholder:"https://example.com/"},null,8,["modelValue"]),[[u,"The base URL of your Preservica instance, with trailing slash"]])]),Object(r["m"])("div",fe,[he,Object(r["Q"])(Object(r["m"])(i,{id:"tenant",type:"text",modelValue:e.config.tenant,"onUpdate:modelValue":t[3]||(t[3]=function(t){return e.config.tenant=t}),placeholder:"code"},null,8,["modelValue"]),[[u,"Optional since 6.2.2, but validated if specified; a short code, not a domain or URL (the same code is also configured in Universal Access)"]])]),Object(r["m"])("div",me,[be,Object(r["Q"])(Object(r["m"])(i,{id:"username",type:"text",modelValue:e.config.username,"onUpdate:modelValue":t[4]||(t[4]=function(t){return e.config.username=t})},null,8,["modelValue"]),[[u,"Usually an email address"]])]),Object(r["m"])("div",ve,[ge,Object(r["m"])(i,{id:"password",type:"password",modelValue:e.config.password,"onUpdate:modelValue":t[5]||(t[5]=function(t){return e.config.password=t}),"aria-describedby":"password-help"},null,8,["modelValue"]),Oe])]),Object(r["Q"])(Object(r["m"])(s,{icon:"pi pi-save",onClick:e.save,label:"Save"},null,8,["onClick"]),[[u,"Save the configuration, including your non-encrypted password, in all your browser windows that run this app (and use that to log in when needed)",void 0,{top:!0}]]),je,Object(r["Q"])(Object(r["m"])(s,{icon:"pi pi-user",onClick:e.login,label:"Log in"},null,8,["onClick"]),[[u,"Do not save the configuration, but log in right now",void 0,{top:!0}]]),we,Object(r["Q"])(Object(r["m"])(s,{icon:"pi pi-lock",onClick:e.getToken,label:"Get token"},null,8,["onClick"]),[[u,"Show the current token, or refresh it using the current configuration if it expired",void 0,{top:!0}]])])}n("96cf");var ke=n("1da1"),xe=n("5530"),Pe=n("5502"),Te=n("18cb"),Se=n("32e8"),Ae=Object(r["n"])({setup:function(){var e=Object(Te["b"])(),t=Object(Pe["b"])(),n=Object(D["b"])(),o=Object(r["B"])();Object(r["O"])((function(){o.value&&!Object(Se["a"])(o.value,t.state.config)&&(e.add({severity:"warn",summary:"Configuration was updated from another browser window",detail:"If you want to use different settings in multiple browser windows, then use different browsers, or do not use Save after making the changes."}),n.clearAuth()),o.value=Object(xe["a"])({},t.state.config)}));var a=function(){var r=Object(ke["a"])(regeneratorRuntime.mark((function r(){return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:n.clearAuth(),t.commit("persistInStorage",o.value),e.add({severity:"info",summary:"Saved new configuration",detail:"But did not yet log in using that new configuration",life:3e3});case 3:case"end":return r.stop()}}),r)})));return function(){return r.apply(this,arguments)}}(),c=function(){var r=Object(ke["a"])(regeneratorRuntime.mark((function r(){var a;return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return e.add({severity:"info",summary:"Logging in",detail:null===(a=o.value)||void 0===a?void 0:a.username,life:3e3}),t.commit("setConfig",o.value),r.next=4,n.login();case 4:case"end":return r.stop()}}),r)})));return function(){return r.apply(this,arguments)}}(),i=function(){var r=Object(ke["a"])(regeneratorRuntime.mark((function r(){var a;return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return t.commit("setConfig",o.value),r.next=3,n.getToken();case 3:a=r.sent,e.add({severity:"info",summary:"Token",detail:a});case 5:case"end":return r.stop()}}),r)})));return function(){return r.apply(this,arguments)}}();return{config:o,save:a,login:c,getToken:i}}});Ae.render=ye;var Ce=Ae,Ie=Object(r["n"])({setup:function(){var e=Object(D["b"])(),t=e.configured,n=e.user;return{configured:t,user:n}},components:{ConfigInput:Ce}});Ie.render=oe;var Re=Ie,Ee=[{path:"/",name:"Home",component:$},{path:"/config",name:"Configuration",component:Re},{path:"/indexes",name:"Indexed fields",component:function(){return n.e("indexes").then(n.bind(null,"8c18"))}},{path:"/oai-pmh",name:"OAI-PMH",component:function(){return n.e("oai-pmh").then(n.bind(null,"a905"))}},{path:"/search",name:"Search",component:function(){return n.e("search").then(n.bind(null,"2d3b"))}},{path:"/curl",name:"curl",component:function(){return n.e("curl").then(n.bind(null,"52a2"))}}],Ue=Object(B["a"])({history:Object(B["b"])("/preservica-api-demo/"),routes:Ee}),_e=Ue,Ve=(n("8a79"),function(e){var t="preservica-api-demo-config";if(window.localStorage){var n=window.localStorage.getItem(t);n&&e.commit("loadFromStorage",JSON.parse(n)),window.addEventListener("storage",(function(n){n.key===t&&e.commit("loadFromStorage",n.newValue?JSON.parse(n.newValue):void 0)}))}e.subscribe((function(e){window.localStorage&&"persistInStorage"===e.type&&window.localStorage.setItem(t,JSON.stringify(e.payload))}))}),Le=function(e){null!==e&&void 0!==e&&e.host&&!e.host.endsWith("/")&&(e.host+="/")},Fe=Object(Pe["a"])({strict:!1,state:{config:{proxy:"https://proxy.arjanvanbentem.nl/",host:"https://eu.preservica.com/",username:"",password:"",tenant:""},persisted:!1},getters:{configured:function(e){var t=e.config;return!!t.host&&!!t.username&&!!t.password}},mutations:{setConfig:function(e,t){Le(t),e.config=t},loadFromStorage:function(e,t){e.config=t},persistInStorage:function(e,t){Le(t),e.config=t}},plugins:[Ve]}),Ne=(n("bddf"),n("4121"),n("098b"),n("e1ae"),Object(r["g"])(W));Ne.use(Fe),Ne.use(_e),Ne.use(v["a"],{ripple:!0}),Ne.use(k["a"]),Ne.component("Accordion",o["a"]),Ne.component("AccordionTab",a["a"]),Ne.component("Button",c["a"]),Ne.component("Column",s["a"]),Ne.component("ColumnGroup",u["a"]),Ne.component("Checkbox",i["a"]),Ne.component("DataTable",l["a"]),Ne.component("Dropdown",d["a"]),Ne.component("InputNumber",p["a"]),Ne.component("InputText",f["a"]),Ne.component("MultiSelect",h["a"]),Ne.component("Paginator",m["a"]),Ne.component("Password",b["a"]),Ne.component("TabPanel",g["a"]),Ne.component("TabView",O["a"]),Ne.component("Tag",j["a"]),Ne.component("Textarea",w["a"]),Ne.component("Toast",y["a"]),Ne.component("TriStateCheckbox",P["a"]),Ne.directive("tooltip",x["a"]),Ne.mount("#app")},d0f2:function(e,t,n){"use strict";n.d(t,"a",(function(){return h})),n.d(t,"b",(function(){return m}));n("a4d3"),n("e01a"),n("d3b7");var r=n("7a23"),o=(n("99af"),n("caad"),n("a15b"),n("fb6a"),n("ac1f"),n("2532"),n("5319"),n("2ca0"),n("ddb0"),n("3835")),a=n("b85c"),c=n("5530"),i=(n("96cf"),n("1da1")),s=n("d4ec"),u=n("18cb"),l=n("5502"),d=6e5,p=function e(){var t=this;Object(s["a"])(this,e),this.store=Object(l["b"])(),this.toast=Object(u["b"])(),this.user=Object(r["B"])(void 0),this.configured=Object(r["f"])((function(){return t.store.getters.configured})),this.lastCurls=Object(r["B"])([]),this.clearAuth=function(){t.user.value=void 0},this.login=Object(i["a"])(regeneratorRuntime.mark((function e(){var n,r,o,a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t.clearAuth(),n=t.store.state.config,r="username=".concat(encodeURIComponent(n.username),"&password=").concat(encodeURIComponent(n.password)).concat(n.tenant?"&tenant=".concat(encodeURIComponent(n.tenant)):"","&includeUserDetails=true"),e.next=5,t.fetchWithDefaults("api/accesstoken/login",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:r});case 5:return o=e.sent,e.next=8,o.json();case 8:a=e.sent,t.user.value={user:a.user,fullName:a.fullName,email:a.email,tenant:a.tenant,roles:a.roles,token:a.token,refreshToken:a["refresh-token"],validForMinutes:a.validFor,validFrom:Date.now(),validUntil:Date.now()+60*a.validFor*1e3},t.toast.add({severity:"success",summary:"Got new token",detail:t.user.value.token,life:2e3});case 11:case"end":return e.stop()}}),e)}))),this.getToken=Object(i["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(t.store.getters.configured){e.next=3;break}throw t.toast.add({severity:"error",summary:"Not configured",detail:"You need to set the configuration first"}),"No credentials set";case 3:if(t.user.value&&!(t.user.value.validUntil-Date.now()<d)){e.next=6;break}return e.next=6,t.login();case 6:if(t.user.value){e.next=8;break}throw"Failed to authenticate";case 8:return e.abrupt("return",t.user.value.token);case 9:case"end":return e.stop()}}),e)}))),this.fetchWithToken=function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(n,r){var o,a,c=arguments;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return o=c.length>2&&void 0!==c[2]?c[2]:[],e.next=3,t.getToken();case 3:return a=e.sent,e.abrupt("return",t.fetchWithDefaults(n,r,a,o));case 5:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),this.pathWithToken=function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(n){var r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.getToken();case 2:return r=e.sent,e.abrupt("return",n.replace("{token}",r));case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),this.fullUrl=function(e){var n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],r=t.store.state.config,o=e.startsWith("http")?e:r.host+e;return n&&r.proxy?"".concat(r.proxy).concat(o):o},this.fetchWithDefaults=function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(n,r,i){var s,u,l,d,p,f,h,m,b,v,g,O=arguments;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:s=O.length>3&&void 0!==O[3]?O[3]:[],u={headers:{Accept:"application/json"}},l=new Request(t.fullUrl(n),Object(c["a"])(Object(c["a"])(Object(c["a"])({},u),r),{},{headers:Object(c["a"])(Object(c["a"])(Object(c["a"])({},u.headers),null===r||void 0===r?void 0:r.headers),i?{"Preservica-Access-Token":i}:null)})),t.lastCurls.value=t.lastCurls.value.slice(0,24),d=[],p=Object(a["a"])(l.headers.entries());try{for(p.s();!(f=p.n()).done;)h=Object(o["a"])(f.value,2),m=h[0],b=h[1],d.push("-H '".concat(m,": ").concat(b,"'"))}catch(j){p.e(j)}finally{p.f()}return v=null!==r&&void 0!==r&&r.body?" --data '".concat(r.body.replace(/(password=)([^&]+)/,"$1SECRET"),"'"):"",t.lastCurls.value.unshift({timestamp:(new Date).toISOString(),command:"curl -v '".concat(t.fullUrl(n,!1),"' -X ").concat(l.method," ").concat(d.join(" ")).concat(v)}),e.next=11,fetch(l).catch((function(e){throw t.toast.add({severity:"error",summary:"Failed to connect to proxy or server",detail:e}),new Error("Failed to connect to proxy or Preservica server")}));case 11:if(g=e.sent,g.ok||s.includes(g.status)){e.next=25;break}return e.t0=t.toast,e.t1="Error ".concat(g.status),e.next=17,g.text();case 17:if(e.t2=e.sent,e.t2){e.next=20;break}e.t2=n;case 20:throw e.t3=e.t2,e.t4={severity:"error",summary:e.t1,detail:e.t3,life:3e4},e.t0.add.call(e.t0,e.t4),console.error(g),new Error(g.statusText);case 25:return e.abrupt("return",g);case 26:case"end":return e.stop()}}),e)})));return function(t,n,r){return e.apply(this,arguments)}}()},f=Symbol();function h(){Object(r["y"])(f,new p)}function m(){var e=Object(r["q"])(f);if(!e)throw Error("plugins/Auth not provided");return e}},d13f:function(e,t,n){"use strict";n("27d5")}});
//# sourceMappingURL=app.091226a1.js.map
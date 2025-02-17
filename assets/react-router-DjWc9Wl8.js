import{r as u}from"./react-DnEnySv6.js";import"./cookie-59rrEzcK.js";import"./react-dom-a42CcBC8.js";/**
 * react-router v7.1.5
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */var ae="popstate";function Pe(e={}){function t(a,n){let{pathname:o,search:s,hash:c}=a.location;return G("",{pathname:o,search:s,hash:c},n.state&&n.state.usr||null,n.state&&n.state.key||"default")}function r(a,n){return typeof n=="string"?n:M(n)}return Se(t,r,null,e)}function E(e,t){if(e===!1||e===null||typeof e>"u")throw new Error(t)}function P(e,t){if(!e){typeof console<"u"&&console.warn(t);try{throw new Error(t)}catch{}}}function Le(){return Math.random().toString(36).substring(2,10)}function oe(e,t){return{usr:e.state,key:e.key,idx:t}}function G(e,t,r=null,a){return{pathname:typeof e=="string"?e:e.pathname,search:"",hash:"",...typeof t=="string"?I(t):t,state:r,key:t&&t.key||a||Le()}}function M({pathname:e="/",search:t="",hash:r=""}){return t&&t!=="?"&&(e+=t.charAt(0)==="?"?t:"?"+t),r&&r!=="#"&&(e+=r.charAt(0)==="#"?r:"#"+r),e}function I(e){let t={};if(e){let r=e.indexOf("#");r>=0&&(t.hash=e.substring(r),e=e.substring(0,r));let a=e.indexOf("?");a>=0&&(t.search=e.substring(a),e=e.substring(0,a)),e&&(t.pathname=e)}return t}function Se(e,t,r,a={}){let{window:n=document.defaultView,v5Compat:o=!1}=a,s=n.history,c="POP",l=null,i=f();i==null&&(i=0,s.replaceState({...s.state,idx:i},""));function f(){return(s.state||{idx:null}).idx}function h(){c="POP";let d=f(),p=d==null?null:d-i;i=d,l&&l({action:c,location:v.location,delta:p})}function g(d,p){c="PUSH";let x=G(v.location,d,p);i=f()+1;let y=oe(x,i),R=v.createHref(x);try{s.pushState(y,"",R)}catch(C){if(C instanceof DOMException&&C.name==="DataCloneError")throw C;n.location.assign(R)}o&&l&&l({action:c,location:v.location,delta:1})}function m(d,p){c="REPLACE";let x=G(v.location,d,p);i=f();let y=oe(x,i),R=v.createHref(x);s.replaceState(y,"",R),o&&l&&l({action:c,location:v.location,delta:0})}function w(d){let p=n.location.origin!=="null"?n.location.origin:n.location.href,x=typeof d=="string"?d:M(d);return x=x.replace(/ $/,"%20"),E(p,`No window.location.(origin|href) available to create URL for href: ${x}`),new URL(x,p)}let v={get action(){return c},get location(){return e(n,s)},listen(d){if(l)throw new Error("A history only accepts one active listener");return n.addEventListener(ae,h),l=d,()=>{n.removeEventListener(ae,h),l=null}},createHref(d){return t(n,d)},createURL:w,encodeLocation(d){let p=w(d);return{pathname:p.pathname,search:p.search,hash:p.hash}},push:g,replace:m,go(d){return s.go(d)}};return v}function se(e,t,r="/"){return ke(e,t,r,!1)}function ke(e,t,r,a){let n=typeof t=="string"?I(t):t,o=$(n.pathname||"/",r);if(o==null)return null;let s=ce(e);$e(s);let c=null;for(let l=0;c==null&&l<s.length;++l){let i=We(o);c=Oe(s[l],i,a)}return c}function ce(e,t=[],r=[],a=""){let n=(o,s,c)=>{let l={relativePath:c===void 0?o.path||"":c,caseSensitive:o.caseSensitive===!0,childrenIndex:s,route:o};l.relativePath.startsWith("/")&&(E(l.relativePath.startsWith(a),`Absolute route path "${l.relativePath}" nested under path "${a}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`),l.relativePath=l.relativePath.slice(a.length));let i=k([a,l.relativePath]),f=r.concat(l);o.children&&o.children.length>0&&(E(o.index!==!0,`Index routes must not have child routes. Please remove all child routes from route path "${i}".`),ce(o.children,t,f,i)),!(o.path==null&&!o.index)&&t.push({path:i,score:Me(i,o.index),routesMeta:f})};return e.forEach((o,s)=>{var c;if(o.path===""||!((c=o.path)!=null&&c.includes("?")))n(o,s);else for(let l of fe(o.path))n(o,s,l)}),t}function fe(e){let t=e.split("/");if(t.length===0)return[];let[r,...a]=t,n=r.endsWith("?"),o=r.replace(/\?$/,"");if(a.length===0)return n?[o,""]:[o];let s=fe(a.join("/")),c=[];return c.push(...s.map(l=>l===""?o:[o,l].join("/"))),n&&c.push(...s),c.map(l=>e.startsWith("/")&&l===""?"/":l)}function $e(e){e.sort((t,r)=>t.score!==r.score?r.score-t.score:Ae(t.routesMeta.map(a=>a.childrenIndex),r.routesMeta.map(a=>a.childrenIndex)))}var Fe=/^:[\w-]+$/,Te=3,Ie=2,De=1,Ne=10,Be=-2,le=e=>e==="*";function Me(e,t){let r=e.split("/"),a=r.length;return r.some(le)&&(a+=Be),t&&(a+=Ie),r.filter(n=>!le(n)).reduce((n,o)=>n+(Fe.test(o)?Te:o===""?De:Ne),a)}function Ae(e,t){return e.length===t.length&&e.slice(0,-1).every((a,n)=>a===t[n])?e[e.length-1]-t[t.length-1]:0}function Oe(e,t,r=!1){let{routesMeta:a}=e,n={},o="/",s=[];for(let c=0;c<a.length;++c){let l=a[c],i=c===a.length-1,f=o==="/"?t:t.slice(o.length)||"/",h=K({path:l.relativePath,caseSensitive:l.caseSensitive,end:i},f),g=l.route;if(!h&&i&&r&&!a[a.length-1].route.index&&(h=K({path:l.relativePath,caseSensitive:l.caseSensitive,end:!1},f)),!h)return null;Object.assign(n,h.params),s.push({params:n,pathname:k([o,h.pathname]),pathnameBase:ze(k([o,h.pathnameBase])),route:g}),h.pathnameBase!=="/"&&(o=k([o,h.pathnameBase]))}return s}function K(e,t){typeof e=="string"&&(e={path:e,caseSensitive:!1,end:!0});let[r,a]=Ue(e.path,e.caseSensitive,e.end),n=t.match(r);if(!n)return null;let o=n[0],s=o.replace(/(.)\/+$/,"$1"),c=n.slice(1);return{params:a.reduce((i,{paramName:f,isOptional:h},g)=>{if(f==="*"){let w=c[g]||"";s=o.slice(0,o.length-w.length).replace(/(.)\/+$/,"$1")}const m=c[g];return h&&!m?i[f]=void 0:i[f]=(m||"").replace(/%2F/g,"/"),i},{}),pathname:o,pathnameBase:s,pattern:e}}function Ue(e,t=!1,r=!0){P(e==="*"||!e.endsWith("*")||e.endsWith("/*"),`Route path "${e}" will be treated as if it were "${e.replace(/\*$/,"/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${e.replace(/\*$/,"/*")}".`);let a=[],n="^"+e.replace(/\/*\*?$/,"").replace(/^\/*/,"/").replace(/[\\.*+^${}|()[\]]/g,"\\$&").replace(/\/:([\w-]+)(\?)?/g,(s,c,l)=>(a.push({paramName:c,isOptional:l!=null}),l?"/?([^\\/]+)?":"/([^\\/]+)"));return e.endsWith("*")?(a.push({paramName:"*"}),n+=e==="*"||e==="/*"?"(.*)$":"(?:\\/(.+)|\\/*)$"):r?n+="\\/*$":e!==""&&e!=="/"&&(n+="(?:(?=\\/|$))"),[new RegExp(n,t?void 0:"i"),a]}function We(e){try{return e.split("/").map(t=>decodeURIComponent(t).replace(/\//g,"%2F")).join("/")}catch(t){return P(!1,`The URL path "${e}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${t}).`),e}}function $(e,t){if(t==="/")return e;if(!e.toLowerCase().startsWith(t.toLowerCase()))return null;let r=t.endsWith("/")?t.length-1:t.length,a=e.charAt(r);return a&&a!=="/"?null:e.slice(r)||"/"}function He(e,t="/"){let{pathname:r,search:a="",hash:n=""}=typeof e=="string"?I(e):e;return{pathname:r?r.startsWith("/")?r:_e(r,t):t,search:Ke(a),hash:Je(n)}}function _e(e,t){let r=t.replace(/\/+$/,"").split("/");return e.split("/").forEach(n=>{n===".."?r.length>1&&r.pop():n!=="."&&r.push(n)}),r.length>1?r.join("/"):"/"}function j(e,t,r,a){return`Cannot include a '${e}' character in a manually specified \`to.${t}\` field [${JSON.stringify(a)}].  Please separate it out to the \`to.${r}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`}function Ve(e){return e.filter((t,r)=>r===0||t.route.path&&t.route.path.length>0)}function he(e){let t=Ve(e);return t.map((r,a)=>a===t.length-1?r.pathname:r.pathnameBase)}function de(e,t,r,a=!1){let n;typeof e=="string"?n=I(e):(n={...e},E(!n.pathname||!n.pathname.includes("?"),j("?","pathname","search",n)),E(!n.pathname||!n.pathname.includes("#"),j("#","pathname","hash",n)),E(!n.search||!n.search.includes("#"),j("#","search","hash",n)));let o=e===""||n.pathname==="",s=o?"/":n.pathname,c;if(s==null)c=r;else{let h=t.length-1;if(!a&&s.startsWith("..")){let g=s.split("/");for(;g[0]==="..";)g.shift(),h-=1;n.pathname=g.join("/")}c=h>=0?t[h]:"/"}let l=He(n,c),i=s&&s!=="/"&&s.endsWith("/"),f=(o||s===".")&&r.endsWith("/");return!l.pathname.endsWith("/")&&(i||f)&&(l.pathname+="/"),l}var k=e=>e.join("/").replace(/\/\/+/g,"/"),ze=e=>e.replace(/\/+$/,"").replace(/^\/*/,"/"),Ke=e=>!e||e==="?"?"":e.startsWith("?")?e:"?"+e,Je=e=>!e||e==="#"?"":e.startsWith("#")?e:"#"+e;function Ye(e){return e!=null&&typeof e.status=="number"&&typeof e.statusText=="string"&&typeof e.internal=="boolean"&&"data"in e}var me=["POST","PUT","PATCH","DELETE"];new Set(me);var je=["GET",...me];new Set(je);var D=u.createContext(null);D.displayName="DataRouter";var J=u.createContext(null);J.displayName="DataRouterState";var pe=u.createContext({isTransitioning:!1});pe.displayName="ViewTransition";var qe=u.createContext(new Map);qe.displayName="Fetchers";var Ge=u.createContext(null);Ge.displayName="Await";var L=u.createContext(null);L.displayName="Navigation";var A=u.createContext(null);A.displayName="Location";var S=u.createContext({outlet:null,matches:[],isDataRoute:!1});S.displayName="Route";var Q=u.createContext(null);Q.displayName="RouteError";function Xe(e,{relative:t}={}){E(O(),"useHref() may be used only in the context of a <Router> component.");let{basename:r,navigator:a}=u.useContext(L),{hash:n,pathname:o,search:s}=U(e,{relative:t}),c=o;return r!=="/"&&(c=o==="/"?r:k([r,o])),a.createHref({pathname:c,search:s,hash:n})}function O(){return u.useContext(A)!=null}function F(){return E(O(),"useLocation() may be used only in the context of a <Router> component."),u.useContext(A).location}var ye="You should call navigate() in a React.useEffect(), not when your component is first rendered.";function ge(e){u.useContext(L).static||u.useLayoutEffect(e)}function Qe(){let{isDataRoute:e}=u.useContext(S);return e?ft():Ze()}function Ze(){E(O(),"useNavigate() may be used only in the context of a <Router> component.");let e=u.useContext(D),{basename:t,navigator:r}=u.useContext(L),{matches:a}=u.useContext(S),{pathname:n}=F(),o=JSON.stringify(he(a)),s=u.useRef(!1);return ge(()=>{s.current=!0}),u.useCallback((l,i={})=>{if(P(s.current,ye),!s.current)return;if(typeof l=="number"){r.go(l);return}let f=de(l,JSON.parse(o),n,i.relative==="path");e==null&&t!=="/"&&(f.pathname=f.pathname==="/"?t:k([t,f.pathname])),(i.replace?r.replace:r.push)(f,i.state,i)},[t,r,o,n,e])}u.createContext(null);function Gt(){let{matches:e}=u.useContext(S),t=e[e.length-1];return t?t.params:{}}function U(e,{relative:t}={}){let{matches:r}=u.useContext(S),{pathname:a}=F(),n=JSON.stringify(he(r));return u.useMemo(()=>de(e,JSON.parse(n),a,t==="path"),[e,n,a,t])}function et(e,t){return ve(e,t)}function ve(e,t,r,a){var x;E(O(),"useRoutes() may be used only in the context of a <Router> component.");let{navigator:n,static:o}=u.useContext(L),{matches:s}=u.useContext(S),c=s[s.length-1],l=c?c.params:{},i=c?c.pathname:"/",f=c?c.pathnameBase:"/",h=c&&c.route;{let y=h&&h.path||"";we(i,!h||y.endsWith("*")||y.endsWith("*?"),`You rendered descendant <Routes> (or called \`useRoutes()\`) at "${i}" (under <Route path="${y}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${y}"> to <Route path="${y==="/"?"*":`${y}/*`}">.`)}let g=F(),m;if(t){let y=typeof t=="string"?I(t):t;E(f==="/"||((x=y.pathname)==null?void 0:x.startsWith(f)),`When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${f}" but pathname "${y.pathname}" was given in the \`location\` prop.`),m=y}else m=g;let w=m.pathname||"/",v=w;if(f!=="/"){let y=f.replace(/^\//,"").split("/");v="/"+w.replace(/^\//,"").split("/").slice(y.length).join("/")}let d=!o&&r&&r.matches&&r.matches.length>0?r.matches:se(e,{pathname:v});P(h||d!=null,`No routes matched location "${m.pathname}${m.search}${m.hash}" `),P(d==null||d[d.length-1].route.element!==void 0||d[d.length-1].route.Component!==void 0||d[d.length-1].route.lazy!==void 0,`Matched leaf route at location "${m.pathname}${m.search}${m.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`);let p=ot(d&&d.map(y=>Object.assign({},y,{params:Object.assign({},l,y.params),pathname:k([f,n.encodeLocation?n.encodeLocation(y.pathname).pathname:y.pathname]),pathnameBase:y.pathnameBase==="/"?f:k([f,n.encodeLocation?n.encodeLocation(y.pathnameBase).pathname:y.pathnameBase])})),s,r,a);return t&&p?u.createElement(A.Provider,{value:{location:{pathname:"/",search:"",hash:"",state:null,key:"default",...m},navigationType:"POP"}},p):p}function tt(){let e=ct(),t=Ye(e)?`${e.status} ${e.statusText}`:e instanceof Error?e.message:JSON.stringify(e),r=e instanceof Error?e.stack:null,a="rgba(200,200,200, 0.5)",n={padding:"0.5rem",backgroundColor:a},o={padding:"2px 4px",backgroundColor:a},s=null;return console.error("Error handled by React Router default ErrorBoundary:",e),s=u.createElement(u.Fragment,null,u.createElement("p",null,"💿 Hey developer 👋"),u.createElement("p",null,"You can provide a way better UX than this when your app throws errors by providing your own ",u.createElement("code",{style:o},"ErrorBoundary")," or"," ",u.createElement("code",{style:o},"errorElement")," prop on your route.")),u.createElement(u.Fragment,null,u.createElement("h2",null,"Unexpected Application Error!"),u.createElement("h3",{style:{fontStyle:"italic"}},t),r?u.createElement("pre",{style:n},r):null,s)}var rt=u.createElement(tt,null),nt=class extends u.Component{constructor(e){super(e),this.state={location:e.location,revalidation:e.revalidation,error:e.error}}static getDerivedStateFromError(e){return{error:e}}static getDerivedStateFromProps(e,t){return t.location!==e.location||t.revalidation!=="idle"&&e.revalidation==="idle"?{error:e.error,location:e.location,revalidation:e.revalidation}:{error:e.error!==void 0?e.error:t.error,location:t.location,revalidation:e.revalidation||t.revalidation}}componentDidCatch(e,t){console.error("React Router caught the following error during render",e,t)}render(){return this.state.error!==void 0?u.createElement(S.Provider,{value:this.props.routeContext},u.createElement(Q.Provider,{value:this.state.error,children:this.props.component})):this.props.children}};function at({routeContext:e,match:t,children:r}){let a=u.useContext(D);return a&&a.static&&a.staticContext&&(t.route.errorElement||t.route.ErrorBoundary)&&(a.staticContext._deepestRenderedBoundaryId=t.route.id),u.createElement(S.Provider,{value:e},r)}function ot(e,t=[],r=null,a=null){if(e==null){if(!r)return null;if(r.errors)e=r.matches;else if(t.length===0&&!r.initialized&&r.matches.length>0)e=r.matches;else return null}let n=e,o=r==null?void 0:r.errors;if(o!=null){let l=n.findIndex(i=>i.route.id&&(o==null?void 0:o[i.route.id])!==void 0);E(l>=0,`Could not find a matching route for errors on route IDs: ${Object.keys(o).join(",")}`),n=n.slice(0,Math.min(n.length,l+1))}let s=!1,c=-1;if(r)for(let l=0;l<n.length;l++){let i=n[l];if((i.route.HydrateFallback||i.route.hydrateFallbackElement)&&(c=l),i.route.id){let{loaderData:f,errors:h}=r,g=i.route.loader&&!f.hasOwnProperty(i.route.id)&&(!h||h[i.route.id]===void 0);if(i.route.lazy||g){s=!0,c>=0?n=n.slice(0,c+1):n=[n[0]];break}}}return n.reduceRight((l,i,f)=>{let h,g=!1,m=null,w=null;r&&(h=o&&i.route.id?o[i.route.id]:void 0,m=i.route.errorElement||rt,s&&(c<0&&f===0?(we("route-fallback",!1,"No `HydrateFallback` element provided to render during initial hydration"),g=!0,w=null):c===f&&(g=!0,w=i.route.hydrateFallbackElement||null)));let v=t.concat(n.slice(0,f+1)),d=()=>{let p;return h?p=m:g?p=w:i.route.Component?p=u.createElement(i.route.Component,null):i.route.element?p=i.route.element:p=l,u.createElement(at,{match:i,routeContext:{outlet:l,matches:v,isDataRoute:r!=null},children:p})};return r&&(i.route.ErrorBoundary||i.route.errorElement||f===0)?u.createElement(nt,{location:r.location,revalidation:r.revalidation,component:m,error:h,children:d(),routeContext:{outlet:null,matches:v,isDataRoute:!0}}):d()},null)}function Z(e){return`${e} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`}function lt(e){let t=u.useContext(D);return E(t,Z(e)),t}function it(e){let t=u.useContext(J);return E(t,Z(e)),t}function ut(e){let t=u.useContext(S);return E(t,Z(e)),t}function ee(e){let t=ut(e),r=t.matches[t.matches.length-1];return E(r.route.id,`${e} can only be used on routes that contain a unique "id"`),r.route.id}function st(){return ee("useRouteId")}function ct(){var a;let e=u.useContext(Q),t=it("useRouteError"),r=ee("useRouteError");return e!==void 0?e:(a=t.errors)==null?void 0:a[r]}function ft(){let{router:e}=lt("useNavigate"),t=ee("useNavigate"),r=u.useRef(!1);return ge(()=>{r.current=!0}),u.useCallback(async(n,o={})=>{P(r.current,ye),r.current&&(typeof n=="number"?e.navigate(n):await e.navigate(n,{fromRouteId:t,...o}))},[e,t])}var ie={};function we(e,t,r){!t&&!ie[e]&&(ie[e]=!0,P(!1,r))}u.memo(ht);function ht({routes:e,future:t,state:r}){return ve(e,void 0,r,t)}function dt(e){E(!1,"A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>.")}function mt({basename:e="/",children:t=null,location:r,navigationType:a="POP",navigator:n,static:o=!1}){E(!O(),"You cannot render a <Router> inside another <Router>. You should never have more than one in your app.");let s=e.replace(/^\/*/,"/"),c=u.useMemo(()=>({basename:s,navigator:n,static:o,future:{}}),[s,n,o]);typeof r=="string"&&(r=I(r));let{pathname:l="/",search:i="",hash:f="",state:h=null,key:g="default"}=r,m=u.useMemo(()=>{let w=$(l,s);return w==null?null:{location:{pathname:w,search:i,hash:f,state:h,key:g},navigationType:a}},[s,l,i,f,h,g,a]);return P(m!=null,`<Router basename="${s}"> is not able to match the URL "${l}${i}${f}" because it does not start with the basename, so the <Router> won't render anything.`),m==null?null:u.createElement(L.Provider,{value:c},u.createElement(A.Provider,{children:t,value:m}))}function Xt({children:e,location:t}){return et(X(e),t)}function X(e,t=[]){let r=[];return u.Children.forEach(e,(a,n)=>{if(!u.isValidElement(a))return;let o=[...t,n];if(a.type===u.Fragment){r.push.apply(r,X(a.props.children,o));return}E(a.type===dt,`[${typeof a.type=="string"?a.type:a.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`),E(!a.props.index||!a.props.children,"An index route cannot have child routes.");let s={id:a.props.id||o.join("-"),caseSensitive:a.props.caseSensitive,element:a.props.element,Component:a.props.Component,index:a.props.index,path:a.props.path,loader:a.props.loader,action:a.props.action,hydrateFallbackElement:a.props.hydrateFallbackElement,HydrateFallback:a.props.HydrateFallback,errorElement:a.props.errorElement,ErrorBoundary:a.props.ErrorBoundary,hasErrorBoundary:a.props.hasErrorBoundary===!0||a.props.ErrorBoundary!=null||a.props.errorElement!=null,shouldRevalidate:a.props.shouldRevalidate,handle:a.props.handle,lazy:a.props.lazy};a.props.children&&(s.children=X(a.props.children,o)),r.push(s)}),r}var V="get",z="application/x-www-form-urlencoded";function Y(e){return e!=null&&typeof e.tagName=="string"}function pt(e){return Y(e)&&e.tagName.toLowerCase()==="button"}function yt(e){return Y(e)&&e.tagName.toLowerCase()==="form"}function gt(e){return Y(e)&&e.tagName.toLowerCase()==="input"}function vt(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)}function wt(e,t){return e.button===0&&(!t||t==="_self")&&!vt(e)}var _=null;function xt(){if(_===null)try{new FormData(document.createElement("form"),0),_=!1}catch{_=!0}return _}var Et=new Set(["application/x-www-form-urlencoded","multipart/form-data","text/plain"]);function q(e){return e!=null&&!Et.has(e)?(P(!1,`"${e}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${z}"`),null):e}function Rt(e,t){let r,a,n,o,s;if(yt(e)){let c=e.getAttribute("action");a=c?$(c,t):null,r=e.getAttribute("method")||V,n=q(e.getAttribute("enctype"))||z,o=new FormData(e)}else if(pt(e)||gt(e)&&(e.type==="submit"||e.type==="image")){let c=e.form;if(c==null)throw new Error('Cannot submit a <button> or <input type="submit"> without a <form>');let l=e.getAttribute("formaction")||c.getAttribute("action");if(a=l?$(l,t):null,r=e.getAttribute("formmethod")||c.getAttribute("method")||V,n=q(e.getAttribute("formenctype"))||q(c.getAttribute("enctype"))||z,o=new FormData(c,e),!xt()){let{name:i,type:f,value:h}=e;if(f==="image"){let g=i?`${i}.`:"";o.append(`${g}x`,"0"),o.append(`${g}y`,"0")}else i&&o.append(i,h)}}else{if(Y(e))throw new Error('Cannot submit element that is not <form>, <button>, or <input type="submit|image">');r=V,a=null,n=z,s=e}return o&&n==="text/plain"&&(s=o,o=void 0),{action:a,method:r.toLowerCase(),encType:n,formData:o,body:s}}function te(e,t){if(e===!1||e===null||typeof e>"u")throw new Error(t)}async function Ct(e,t){if(e.id in t)return t[e.id];try{let r=await import(e.module);return t[e.id]=r,r}catch(r){return console.error(`Error loading route module \`${e.module}\`, reloading page...`),console.error(r),window.__reactRouterContext&&window.__reactRouterContext.isSpaMode,window.location.reload(),new Promise(()=>{})}}function bt(e){return e==null?!1:e.href==null?e.rel==="preload"&&typeof e.imageSrcSet=="string"&&typeof e.imageSizes=="string":typeof e.rel=="string"&&typeof e.href=="string"}async function Pt(e,t,r){let a=await Promise.all(e.map(async n=>{let o=t.routes[n.route.id];if(o){let s=await Ct(o,r);return s.links?s.links():[]}return[]}));return $t(a.flat(1).filter(bt).filter(n=>n.rel==="stylesheet"||n.rel==="preload").map(n=>n.rel==="stylesheet"?{...n,rel:"prefetch",as:"style"}:{...n,rel:"prefetch"}))}function ue(e,t,r,a,n,o){let s=(l,i)=>r[i]?l.route.id!==r[i].route.id:!0,c=(l,i)=>{var f;return r[i].pathname!==l.pathname||((f=r[i].route.path)==null?void 0:f.endsWith("*"))&&r[i].params["*"]!==l.params["*"]};return o==="assets"?t.filter((l,i)=>s(l,i)||c(l,i)):o==="data"?t.filter((l,i)=>{var h;let f=a.routes[l.route.id];if(!f||!f.hasLoader)return!1;if(s(l,i)||c(l,i))return!0;if(l.route.shouldRevalidate){let g=l.route.shouldRevalidate({currentUrl:new URL(n.pathname+n.search+n.hash,window.origin),currentParams:((h=r[0])==null?void 0:h.params)||{},nextUrl:new URL(e,window.origin),nextParams:l.params,defaultShouldRevalidate:!0});if(typeof g=="boolean")return g}return!0}):[]}function Lt(e,t){return St(e.map(r=>{let a=t.routes[r.route.id];if(!a)return[];let n=[a.module];return a.imports&&(n=n.concat(a.imports)),n}).flat(1))}function St(e){return[...new Set(e)]}function kt(e){let t={},r=Object.keys(e).sort();for(let a of r)t[a]=e[a];return t}function $t(e,t){let r=new Set;return new Set(t),e.reduce((a,n)=>{let o=JSON.stringify(kt(n));return r.has(o)||(r.add(o),a.push({key:o,link:n})),a},[])}function Ft(e){let t=typeof e=="string"?new URL(e,typeof window>"u"?"server://singlefetch/":window.location.origin):e;return t.pathname==="/"?t.pathname="_root.data":t.pathname=`${t.pathname.replace(/\/$/,"")}.data`,t}function Tt(){let e=u.useContext(D);return te(e,"You must render this element inside a <DataRouterContext.Provider> element"),e}function It(){let e=u.useContext(J);return te(e,"You must render this element inside a <DataRouterStateContext.Provider> element"),e}var re=u.createContext(void 0);re.displayName="FrameworkContext";function xe(){let e=u.useContext(re);return te(e,"You must render this element inside a <HydratedRouter> element"),e}function Dt(e,t){let r=u.useContext(re),[a,n]=u.useState(!1),[o,s]=u.useState(!1),{onFocus:c,onBlur:l,onMouseEnter:i,onMouseLeave:f,onTouchStart:h}=t,g=u.useRef(null);u.useEffect(()=>{if(e==="render"&&s(!0),e==="viewport"){let v=p=>{p.forEach(x=>{s(x.isIntersecting)})},d=new IntersectionObserver(v,{threshold:.5});return g.current&&d.observe(g.current),()=>{d.disconnect()}}},[e]),u.useEffect(()=>{if(a){let v=setTimeout(()=>{s(!0)},100);return()=>{clearTimeout(v)}}},[a]);let m=()=>{n(!0)},w=()=>{n(!1),s(!1)};return r?e!=="intent"?[o,g,{}]:[o,g,{onFocus:B(c,m),onBlur:B(l,w),onMouseEnter:B(i,m),onMouseLeave:B(f,w),onTouchStart:B(h,m)}]:[!1,g,{}]}function B(e,t){return r=>{e&&e(r),r.defaultPrevented||t(r)}}function Nt({page:e,...t}){let{router:r}=Tt(),a=u.useMemo(()=>se(r.routes,e,r.basename),[r.routes,e,r.basename]);return a?u.createElement(Mt,{page:e,matches:a,...t}):null}function Bt(e){let{manifest:t,routeModules:r}=xe(),[a,n]=u.useState([]);return u.useEffect(()=>{let o=!1;return Pt(e,t,r).then(s=>{o||n(s)}),()=>{o=!0}},[e,t,r]),a}function Mt({page:e,matches:t,...r}){let a=F(),{manifest:n,routeModules:o}=xe(),{loaderData:s,matches:c}=It(),l=u.useMemo(()=>ue(e,t,c,n,a,"data"),[e,t,c,n,a]),i=u.useMemo(()=>ue(e,t,c,n,a,"assets"),[e,t,c,n,a]),f=u.useMemo(()=>{if(e===a.pathname+a.search+a.hash)return[];let m=new Set,w=!1;if(t.forEach(d=>{var x;let p=n.routes[d.route.id];!p||!p.hasLoader||(!l.some(y=>y.route.id===d.route.id)&&d.route.id in s&&((x=o[d.route.id])!=null&&x.shouldRevalidate)||p.hasClientLoader?w=!0:m.add(d.route.id))}),m.size===0)return[];let v=Ft(e);return w&&m.size>0&&v.searchParams.set("_routes",t.filter(d=>m.has(d.route.id)).map(d=>d.route.id).join(",")),[v.pathname+v.search]},[s,a,n,l,t,e,o]),h=u.useMemo(()=>Lt(i,n),[i,n]),g=Bt(i);return u.createElement(u.Fragment,null,f.map(m=>u.createElement("link",{key:m,rel:"prefetch",as:"fetch",href:m,...r})),h.map(m=>u.createElement("link",{key:m,rel:"modulepreload",href:m,...r})),g.map(({key:m,link:w})=>u.createElement("link",{key:m,...w})))}function At(...e){return t=>{e.forEach(r=>{typeof r=="function"?r(t):r!=null&&(r.current=t)})}}var Ee=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u";try{Ee&&(window.__reactRouterVersion="7.1.5")}catch{}function Qt({basename:e,children:t,window:r}){let a=u.useRef();a.current==null&&(a.current=Pe({window:r,v5Compat:!0}));let n=a.current,[o,s]=u.useState({action:n.action,location:n.location}),c=u.useCallback(l=>{u.startTransition(()=>s(l))},[s]);return u.useLayoutEffect(()=>n.listen(c),[n,c]),u.createElement(mt,{basename:e,children:t,location:o.location,navigationType:o.action,navigator:n})}var Re=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,Ce=u.forwardRef(function({onClick:t,discover:r="render",prefetch:a="none",relative:n,reloadDocument:o,replace:s,state:c,target:l,to:i,preventScrollReset:f,viewTransition:h,...g},m){let{basename:w}=u.useContext(L),v=typeof i=="string"&&Re.test(i),d,p=!1;if(typeof i=="string"&&v&&(d=i,Ee))try{let b=new URL(window.location.href),T=i.startsWith("//")?new URL(b.protocol+i):new URL(i),ne=$(T.pathname,w);T.origin===b.origin&&ne!=null?i=ne+T.search+T.hash:p=!0}catch{P(!1,`<Link to="${i}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`)}let x=Xe(i,{relative:n}),[y,R,C]=Dt(a,g),W=Ht(i,{replace:s,state:c,target:l,preventScrollReset:f,relative:n,viewTransition:h});function N(b){t&&t(b),b.defaultPrevented||W(b)}let H=u.createElement("a",{...g,...C,href:d||x,onClick:p||o?t:N,ref:At(m,R),target:l,"data-discover":!v&&r==="render"?"true":void 0});return y&&!v?u.createElement(u.Fragment,null,H,u.createElement(Nt,{page:x})):H});Ce.displayName="Link";var Ot=u.forwardRef(function({"aria-current":t="page",caseSensitive:r=!1,className:a="",end:n=!1,style:o,to:s,viewTransition:c,children:l,...i},f){let h=U(s,{relative:i.relative}),g=F(),m=u.useContext(J),{navigator:w,basename:v}=u.useContext(L),d=m!=null&&Jt(h)&&c===!0,p=w.encodeLocation?w.encodeLocation(h).pathname:h.pathname,x=g.pathname,y=m&&m.navigation&&m.navigation.location?m.navigation.location.pathname:null;r||(x=x.toLowerCase(),y=y?y.toLowerCase():null,p=p.toLowerCase()),y&&v&&(y=$(y,v)||y);const R=p!=="/"&&p.endsWith("/")?p.length-1:p.length;let C=x===p||!n&&x.startsWith(p)&&x.charAt(R)==="/",W=y!=null&&(y===p||!n&&y.startsWith(p)&&y.charAt(p.length)==="/"),N={isActive:C,isPending:W,isTransitioning:d},H=C?t:void 0,b;typeof a=="function"?b=a(N):b=[a,C?"active":null,W?"pending":null,d?"transitioning":null].filter(Boolean).join(" ");let T=typeof o=="function"?o(N):o;return u.createElement(Ce,{...i,"aria-current":H,className:b,ref:f,style:T,to:s,viewTransition:c},typeof l=="function"?l(N):l)});Ot.displayName="NavLink";var Ut=u.forwardRef(({discover:e="render",fetcherKey:t,navigate:r,reloadDocument:a,replace:n,state:o,method:s=V,action:c,onSubmit:l,relative:i,preventScrollReset:f,viewTransition:h,...g},m)=>{let w=zt(),v=Kt(c,{relative:i}),d=s.toLowerCase()==="get"?"get":"post",p=typeof c=="string"&&Re.test(c),x=y=>{if(l&&l(y),y.defaultPrevented)return;y.preventDefault();let R=y.nativeEvent.submitter,C=(R==null?void 0:R.getAttribute("formmethod"))||s;w(R||y.currentTarget,{fetcherKey:t,method:C,navigate:r,replace:n,state:o,relative:i,preventScrollReset:f,viewTransition:h})};return u.createElement("form",{ref:m,method:d,action:v,onSubmit:a?l:x,...g,"data-discover":!p&&e==="render"?"true":void 0})});Ut.displayName="Form";function Wt(e){return`${e} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`}function be(e){let t=u.useContext(D);return E(t,Wt(e)),t}function Ht(e,{target:t,replace:r,state:a,preventScrollReset:n,relative:o,viewTransition:s}={}){let c=Qe(),l=F(),i=U(e,{relative:o});return u.useCallback(f=>{if(wt(f,t)){f.preventDefault();let h=r!==void 0?r:M(l)===M(i);c(e,{replace:h,state:a,preventScrollReset:n,relative:o,viewTransition:s})}},[l,c,i,r,a,t,e,n,o,s])}var _t=0,Vt=()=>`__${String(++_t)}__`;function zt(){let{router:e}=be("useSubmit"),{basename:t}=u.useContext(L),r=st();return u.useCallback(async(a,n={})=>{let{action:o,method:s,encType:c,formData:l,body:i}=Rt(a,t);if(n.navigate===!1){let f=n.fetcherKey||Vt();await e.fetch(f,r,n.action||o,{preventScrollReset:n.preventScrollReset,formData:l,body:i,formMethod:n.method||s,formEncType:n.encType||c,flushSync:n.flushSync})}else await e.navigate(n.action||o,{preventScrollReset:n.preventScrollReset,formData:l,body:i,formMethod:n.method||s,formEncType:n.encType||c,replace:n.replace,state:n.state,fromRouteId:r,flushSync:n.flushSync,viewTransition:n.viewTransition})},[e,t,r])}function Kt(e,{relative:t}={}){let{basename:r}=u.useContext(L),a=u.useContext(S);E(a,"useFormAction must be used inside a RouteContext");let[n]=a.matches.slice(-1),o={...U(e||".",{relative:t})},s=F();if(e==null){o.search=s.search;let c=new URLSearchParams(o.search),l=c.getAll("index");if(l.some(f=>f==="")){c.delete("index"),l.filter(h=>h).forEach(h=>c.append("index",h));let f=c.toString();o.search=f?`?${f}`:""}}return(!e||e===".")&&n.route.index&&(o.search=o.search?o.search.replace(/^\?/,"?index&"):"?index"),r!=="/"&&(o.pathname=o.pathname==="/"?r:k([r,o.pathname])),M(o)}function Jt(e,t={}){let r=u.useContext(pe);E(r!=null,"`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?");let{basename:a}=be("useViewTransitionState"),n=U(e,{relative:t.relative});if(!r.isTransitioning)return!1;let o=$(r.currentLocation.pathname,a)||r.currentLocation.pathname,s=$(r.nextLocation.pathname,a)||r.nextLocation.pathname;return K(n.pathname,s)!=null||K(n.pathname,o)!=null}new TextEncoder;export{Qt as B,Ce as L,Xt as R,dt as a,Gt as u};

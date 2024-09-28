import{r as _,j as D}from"./react-DvsdDthM.js";import{L as ie,T as qe,R as Ge,U as Ue,a as We,O as Ve,P as Xe,S as we,b as se,N as $e,A as Ye,B as Ke,M as Je,C as Qe,W as Ze,c as et,d as tt,e as rt,V as nt,f as Y,g as ot,h as it,i as st}from"./three-7QjQTuvD.js";import{c as ye}from"./debounce-DH428MTX.js";import{F as at,u as ct}from"./its-fine-z8kMFGEH.js";import{R as lt,c as G}from"./react-reconciler-C16tENYH.js";import{s as be}from"./scheduler-CzFDRTuY.js";import"./react-dom-C30jrkNp.js";import{_ as Oe}from"./@babel-CF3RwP-h.js";import{T as ft,p as ut}from"./troika-three-text-CAv-DnXU.js";import{s as dt}from"./suspend-react-DF1CRDJi.js";import{c as pt}from"./zustand-D0D0Oln6.js";const ge={},vt=e=>void Object.assign(ge,e);function ht(e,r){function i(t,{args:n=[],attach:a,...d},p){let g=`${t[0].toUpperCase()}${t.slice(1)}`,l;if(t==="primitive"){if(d.object===void 0)throw new Error("R3F: Primitives without 'object' are invalid!");const o=d.object;l=N(o,{type:t,root:p,attach:a,primitive:!0})}else{const o=ge[g];if(!o)throw new Error(`R3F: ${g} is not part of the THREE namespace! Did you forget to extend? See: https://docs.pmnd.rs/react-three-fiber/api/objects#using-3rd-party-objects-declaratively`);if(!Array.isArray(n))throw new Error("R3F: The args prop must be an array!");l=N(new o(...n),{type:t,root:p,attach:a,memoizedProps:{args:n}})}return l.__r3f.attach===void 0&&(l instanceof Ke?l.__r3f.attach="geometry":l instanceof Je&&(l.__r3f.attach="material")),g!=="inject"&&le(l,d),l}function s(t,n){let a=!1;if(n){var d,p;(d=n.__r3f)!=null&&d.attach?ce(t,n,n.__r3f.attach):n.isObject3D&&t.isObject3D&&(t.add(n),a=!0),a||(p=t.__r3f)==null||p.objects.push(n),n.__r3f||N(n,{}),n.__r3f.parent=t,me(n),q(n)}}function u(t,n,a){let d=!1;if(n){var p,g;if((p=n.__r3f)!=null&&p.attach)ce(t,n,n.__r3f.attach);else if(n.isObject3D&&t.isObject3D){n.parent=t,n.dispatchEvent({type:"added"}),t.dispatchEvent({type:"childadded",child:n});const l=t.children.filter(f=>f!==n),o=l.indexOf(a);t.children=[...l.slice(0,o),n,...l.slice(o)],d=!0}d||(g=t.__r3f)==null||g.objects.push(n),n.__r3f||N(n,{}),n.__r3f.parent=t,me(n),q(n)}}function v(t,n,a=!1){t&&[...t].forEach(d=>w(n,d,a))}function w(t,n,a){if(n){var d,p,g;if(n.__r3f&&(n.__r3f.parent=null),(d=t.__r3f)!=null&&d.objects&&(t.__r3f.objects=t.__r3f.objects.filter(C=>C!==n)),(p=n.__r3f)!=null&&p.attach)Pe(t,n,n.__r3f.attach);else if(n.isObject3D&&t.isObject3D){var l;t.remove(n),(l=n.__r3f)!=null&&l.root&&Et(re(n),n)}const f=(g=n.__r3f)==null?void 0:g.primitive,y=!f&&(a===void 0?n.dispose!==null:a);if(!f){var o;v((o=n.__r3f)==null?void 0:o.objects,n,y),v(n.children,n,y)}if(delete n.__r3f,y&&n.dispose&&n.type!=="Scene"){const C=()=>{try{n.dispose()}catch{}};typeof IS_REACT_ACT_ENVIRONMENT>"u"?be.unstable_scheduleCallback(be.unstable_IdlePriority,C):C()}q(t)}}function c(t,n,a,d){var p;const g=(p=t.__r3f)==null?void 0:p.parent;if(!g)return;const l=i(n,a,t.__r3f.root);if(t.children){for(const o of t.children)o.__r3f&&s(l,o);t.children=t.children.filter(o=>!o.__r3f)}t.__r3f.objects.forEach(o=>s(l,o)),t.__r3f.objects=[],t.__r3f.autoRemovedBeforeAppend||w(g,t),l.parent&&(l.__r3f.autoRemovedBeforeAppend=!0),s(g,l),l.raycast&&l.__r3f.eventCount&&re(l).getState().internal.interaction.push(l),[d,d.alternate].forEach(o=>{o!==null&&(o.stateNode=l,o.ref&&(typeof o.ref=="function"?o.ref(l):o.ref.current=l))})}const h=()=>console.warn("Text is not allowed in the R3F tree! This could be stray whitespace or characters.");return{reconciler:lt({createInstance:i,removeChild:w,appendChild:s,appendInitialChild:s,insertBefore:u,supportsMutation:!0,isPrimaryRenderer:!1,supportsPersistence:!1,supportsHydration:!1,noTimeout:-1,appendChildToContainer:(t,n)=>{if(!n)return;const a=t.getState().scene;a.__r3f&&(a.__r3f.root=t,s(a,n))},removeChildFromContainer:(t,n)=>{n&&w(t.getState().scene,n)},insertInContainerBefore:(t,n,a)=>{if(!n||!a)return;const d=t.getState().scene;d.__r3f&&u(d,n,a)},getRootHostContext:()=>null,getChildHostContext:t=>t,finalizeInitialChildren(t){var n;return!!((n=t==null?void 0:t.__r3f)!=null?n:{}).handlers},prepareUpdate(t,n,a,d){var p;if(((p=t==null?void 0:t.__r3f)!=null?p:{}).primitive&&d.object&&d.object!==t)return[!0];{const{args:l=[],children:o,...f}=d,{args:y=[],children:C,...S}=a;if(!Array.isArray(l))throw new Error("R3F: the args prop must be an array!");if(l.some((x,R)=>x!==y[R]))return[!0];const E=De(t,f,S,!0);return E.changes.length?[!1,E]:null}},commitUpdate(t,[n,a],d,p,g,l){n?c(t,d,g,l):le(t,a)},commitMount(t,n,a,d){var p;const g=(p=t.__r3f)!=null?p:{};t.raycast&&g.handlers&&g.eventCount&&re(t).getState().internal.interaction.push(t)},getPublicInstance:t=>t,prepareForCommit:()=>null,preparePortalMount:t=>N(t.getState().scene),resetAfterCommit:()=>{},shouldSetTextContent:()=>!1,clearContainer:()=>!1,hideInstance(t){var n;const{attach:a,parent:d}=(n=t.__r3f)!=null?n:{};a&&d&&Pe(d,t,a),t.isObject3D&&(t.visible=!1),q(t)},unhideInstance(t,n){var a;const{attach:d,parent:p}=(a=t.__r3f)!=null?a:{};d&&p&&ce(p,t,d),(t.isObject3D&&n.visible==null||n.visible)&&(t.visible=!0),q(t)},createTextInstance:h,hideTextInstance:h,unhideTextInstance:h,getCurrentEventPriority:()=>r?r():G.DefaultEventPriority,beforeActiveInstanceBlur:()=>{},afterActiveInstanceBlur:()=>{},detachDeletedInstance:()=>{},now:typeof performance<"u"&&M.fun(performance.now)?performance.now:M.fun(Date.now)?Date.now:()=>0,scheduleTimeout:M.fun(setTimeout)?setTimeout:void 0,cancelTimeout:M.fun(clearTimeout)?clearTimeout:void 0}),applyProps:le}}var _e,Ce;const ae=e=>"colorSpace"in e||"outputColorSpace"in e,je=()=>{var e;return(e=ge.ColorManagement)!=null?e:null},Re=e=>e&&e.isOrthographicCamera,mt=e=>e&&e.hasOwnProperty("current"),K=typeof window<"u"&&((_e=window.document)!=null&&_e.createElement||((Ce=window.navigator)==null?void 0:Ce.product)==="ReactNative")?_.useLayoutEffect:_.useEffect;function Te(e){const r=_.useRef(e);return K(()=>void(r.current=e),[e]),r}function gt({set:e}){return K(()=>(e(new Promise(()=>null)),()=>e(!1)),[e]),null}class ke extends _.Component{constructor(...r){super(...r),this.state={error:!1}}componentDidCatch(r){this.props.set(r)}render(){return this.state.error?null:this.props.children}}ke.getDerivedStateFromError=()=>({error:!0});const ze="__default",Ee=new Map,wt=e=>e&&!!e.memoized&&!!e.changes;function Le(e){var r;const i=typeof window<"u"?(r=window.devicePixelRatio)!=null?r:2:1;return Array.isArray(e)?Math.min(Math.max(e[0],i),e[1]):e}const X=e=>{var r;return(r=e.__r3f)==null?void 0:r.root.getState()};function re(e){let r=e.__r3f.root;for(;r.getState().previousRoot;)r=r.getState().previousRoot;return r}const M={obj:e=>e===Object(e)&&!M.arr(e)&&typeof e!="function",fun:e=>typeof e=="function",str:e=>typeof e=="string",num:e=>typeof e=="number",boo:e=>typeof e=="boolean",und:e=>e===void 0,arr:e=>Array.isArray(e),equ(e,r,{arrays:i="shallow",objects:s="reference",strict:u=!0}={}){if(typeof e!=typeof r||!!e!=!!r)return!1;if(M.str(e)||M.num(e)||M.boo(e))return e===r;const v=M.obj(e);if(v&&s==="reference")return e===r;const w=M.arr(e);if(w&&i==="reference")return e===r;if((w||v)&&e===r)return!0;let c;for(c in e)if(!(c in r))return!1;if(v&&i==="shallow"&&s==="shallow"){for(c in u?r:e)if(!M.equ(e[c],r[c],{strict:u,objects:"reference"}))return!1}else for(c in u?r:e)if(e[c]!==r[c])return!1;if(M.und(c)){if(w&&e.length===0&&r.length===0||v&&Object.keys(e).length===0&&Object.keys(r).length===0)return!0;if(e!==r)return!1}return!0}};function yt(e){e.dispose&&e.type!=="Scene"&&e.dispose();for(const r in e)r.dispose==null||r.dispose(),delete e[r]}function N(e,r){const i=e;return i.__r3f={type:"",root:null,previousAttach:null,memoizedProps:{},eventCount:0,handlers:{},objects:[],parent:null,...r},e}function he(e,r){let i=e;if(r.includes("-")){const s=r.split("-"),u=s.pop();return i=s.reduce((v,w)=>v[w],e),{target:i,key:u}}else return{target:i,key:r}}const Se=/-\d+$/;function ce(e,r,i){if(M.str(i)){if(Se.test(i)){const v=i.replace(Se,""),{target:w,key:c}=he(e,v);Array.isArray(w[c])||(w[c]=[])}const{target:s,key:u}=he(e,i);r.__r3f.previousAttach=s[u],s[u]=r}else r.__r3f.previousAttach=i(e,r)}function Pe(e,r,i){var s,u;if(M.str(i)){const{target:v,key:w}=he(e,i),c=r.__r3f.previousAttach;c===void 0?delete v[w]:v[w]=c}else(s=r.__r3f)==null||s.previousAttach==null||s.previousAttach(e,r);(u=r.__r3f)==null||delete u.previousAttach}function De(e,{children:r,key:i,ref:s,...u},{children:v,key:w,ref:c,...h}={},m=!1){const t=e.__r3f,n=Object.entries(u),a=[];if(m){const p=Object.keys(h);for(let g=0;g<p.length;g++)u.hasOwnProperty(p[g])||n.unshift([p[g],ze+"remove"])}n.forEach(([p,g])=>{var l;if((l=e.__r3f)!=null&&l.primitive&&p==="object"||M.equ(g,h[p]))return;if(/^on(Pointer|Click|DoubleClick|ContextMenu|Wheel)/.test(p))return a.push([p,g,!0,[]]);let o=[];p.includes("-")&&(o=p.split("-")),a.push([p,g,!1,o]);for(const f in u){const y=u[f];f.startsWith(`${p}-`)&&a.push([f,y,!1,f.split("-")])}});const d={...u};return t!=null&&t.memoizedProps&&t!=null&&t.memoizedProps.args&&(d.args=t.memoizedProps.args),t!=null&&t.memoizedProps&&t!=null&&t.memoizedProps.attach&&(d.attach=t.memoizedProps.attach),{memoized:d,changes:a}}const bt=typeof process<"u"&&!1;function le(e,r){var i;const s=e.__r3f,u=s==null?void 0:s.root,v=u==null||u.getState==null?void 0:u.getState(),{memoized:w,changes:c}=wt(r)?r:De(e,r),h=s==null?void 0:s.eventCount;e.__r3f&&(e.__r3f.memoizedProps=w);for(let t=0;t<c.length;t++){let[n,a,d,p]=c[t];if(ae(e)){const f="srgb",y="srgb-linear";n==="encoding"?(n="colorSpace",a=a===3001?f:y):n==="outputEncoding"&&(n="outputColorSpace",a=a===3001?f:y)}let g=e,l=g[n];if(p.length&&(l=p.reduce((o,f)=>o[f],e),!(l&&l.set))){const[o,...f]=p.reverse();g=f.reverse().reduce((y,C)=>y[C],e),n=o}if(a===ze+"remove")if(g.constructor){let o=Ee.get(g.constructor);o||(o=new g.constructor,Ee.set(g.constructor,o)),a=o[n]}else a=0;if(d&&s)a?s.handlers[n]=a:delete s.handlers[n],s.eventCount=Object.keys(s.handlers).length;else if(l&&l.set&&(l.copy||l instanceof ie)){if(Array.isArray(a))l.fromArray?l.fromArray(a):l.set(...a);else if(l.copy&&a&&a.constructor&&(bt?l.constructor.name===a.constructor.name:l.constructor===a.constructor))l.copy(a);else if(a!==void 0){const o=l instanceof Qe;!o&&l.setScalar?l.setScalar(a):l instanceof ie&&a instanceof ie?l.mask=a.mask:l.set(a),!je()&&v&&!v.linear&&o&&l.convertSRGBToLinear()}}else if(g[n]=a,g[n]instanceof qe&&g[n].format===Ge&&g[n].type===Ue&&v){const o=g[n];ae(o)&&ae(v.gl)?o.colorSpace=v.gl.outputColorSpace:o.encoding=v.gl.outputEncoding}q(e)}if(s&&s.parent&&e.raycast&&h!==s.eventCount){const t=re(e).getState().internal,n=t.interaction.indexOf(e);n>-1&&t.interaction.splice(n,1),s.eventCount&&t.interaction.push(e)}return!(c.length===1&&c[0][0]==="onUpdate")&&c.length&&(i=e.__r3f)!=null&&i.parent&&me(e),e}function q(e){var r,i;const s=(r=e.__r3f)==null||(i=r.root)==null||i.getState==null?void 0:i.getState();s&&s.internal.frames===0&&s.invalidate()}function me(e){e.onUpdate==null||e.onUpdate(e)}function _t(e,r){e.manual||(Re(e)?(e.left=r.width/-2,e.right=r.width/2,e.top=r.height/2,e.bottom=r.height/-2):e.aspect=r.width/r.height,e.updateProjectionMatrix(),e.updateMatrixWorld())}function ee(e){return(e.eventObject||e.object).uuid+"/"+e.index+e.instanceId}function Ct(){var e;const r=typeof self<"u"&&self||typeof window<"u"&&window;if(!r)return G.DefaultEventPriority;switch((e=r.event)==null?void 0:e.type){case"click":case"contextmenu":case"dblclick":case"pointercancel":case"pointerdown":case"pointerup":return G.DiscreteEventPriority;case"pointermove":case"pointerout":case"pointerover":case"pointerenter":case"pointerleave":case"wheel":return G.ContinuousEventPriority;default:return G.DefaultEventPriority}}function Ae(e,r,i,s){const u=i.get(r);u&&(i.delete(r),i.size===0&&(e.delete(s),u.target.releasePointerCapture(s)))}function Et(e,r){const{internal:i}=e.getState();i.interaction=i.interaction.filter(s=>s!==r),i.initialHits=i.initialHits.filter(s=>s!==r),i.hovered.forEach((s,u)=>{(s.eventObject===r||s.object===r)&&i.hovered.delete(u)}),i.capturedMap.forEach((s,u)=>{Ae(i.capturedMap,r,s,u)})}function St(e){function r(h){const{internal:m}=e.getState(),t=h.offsetX-m.initialClick[0],n=h.offsetY-m.initialClick[1];return Math.round(Math.sqrt(t*t+n*n))}function i(h){return h.filter(m=>["Move","Over","Enter","Out","Leave"].some(t=>{var n;return(n=m.__r3f)==null?void 0:n.handlers["onPointer"+t]}))}function s(h,m){const t=e.getState(),n=new Set,a=[],d=m?m(t.internal.interaction):t.internal.interaction;for(let o=0;o<d.length;o++){const f=X(d[o]);f&&(f.raycaster.camera=void 0)}t.previousRoot||t.events.compute==null||t.events.compute(h,t);function p(o){const f=X(o);if(!f||!f.events.enabled||f.raycaster.camera===null)return[];if(f.raycaster.camera===void 0){var y;f.events.compute==null||f.events.compute(h,f,(y=f.previousRoot)==null?void 0:y.getState()),f.raycaster.camera===void 0&&(f.raycaster.camera=null)}return f.raycaster.camera?f.raycaster.intersectObject(o,!0):[]}let g=d.flatMap(p).sort((o,f)=>{const y=X(o.object),C=X(f.object);return!y||!C?o.distance-f.distance:C.events.priority-y.events.priority||o.distance-f.distance}).filter(o=>{const f=ee(o);return n.has(f)?!1:(n.add(f),!0)});t.events.filter&&(g=t.events.filter(g,t));for(const o of g){let f=o.object;for(;f;){var l;(l=f.__r3f)!=null&&l.eventCount&&a.push({...o,eventObject:f}),f=f.parent}}if("pointerId"in h&&t.internal.capturedMap.has(h.pointerId))for(let o of t.internal.capturedMap.get(h.pointerId).values())n.has(ee(o.intersection))||a.push(o.intersection);return a}function u(h,m,t,n){const a=e.getState();if(h.length){const d={stopped:!1};for(const p of h){const g=X(p.object)||a,{raycaster:l,pointer:o,camera:f,internal:y}=g,C=new Y(o.x,o.y,0).unproject(f),S=P=>{var b,j;return(b=(j=y.capturedMap.get(P))==null?void 0:j.has(p.eventObject))!=null?b:!1},E=P=>{const b={intersection:p,target:m.target};y.capturedMap.has(P)?y.capturedMap.get(P).set(p.eventObject,b):y.capturedMap.set(P,new Map([[p.eventObject,b]])),m.target.setPointerCapture(P)},x=P=>{const b=y.capturedMap.get(P);b&&Ae(y.capturedMap,p.eventObject,b,P)};let R={};for(let P in m){let b=m[P];typeof b!="function"&&(R[P]=b)}let O={...p,...R,pointer:o,intersections:h,stopped:d.stopped,delta:t,unprojectedPoint:C,ray:l.ray,camera:f,stopPropagation(){const P="pointerId"in m&&y.capturedMap.get(m.pointerId);if((!P||P.has(p.eventObject))&&(O.stopped=d.stopped=!0,y.hovered.size&&Array.from(y.hovered.values()).find(b=>b.eventObject===p.eventObject))){const b=h.slice(0,h.indexOf(p));v([...b,p])}},target:{hasPointerCapture:S,setPointerCapture:E,releasePointerCapture:x},currentTarget:{hasPointerCapture:S,setPointerCapture:E,releasePointerCapture:x},nativeEvent:m};if(n(O),d.stopped===!0)break}}return h}function v(h){const{internal:m}=e.getState();for(const t of m.hovered.values())if(!h.length||!h.find(n=>n.object===t.object&&n.index===t.index&&n.instanceId===t.instanceId)){const a=t.eventObject.__r3f,d=a==null?void 0:a.handlers;if(m.hovered.delete(ee(t)),a!=null&&a.eventCount){const p={...t,intersections:h};d.onPointerOut==null||d.onPointerOut(p),d.onPointerLeave==null||d.onPointerLeave(p)}}}function w(h,m){for(let t=0;t<m.length;t++){const n=m[t].__r3f;n==null||n.handlers.onPointerMissed==null||n.handlers.onPointerMissed(h)}}function c(h){switch(h){case"onPointerLeave":case"onPointerCancel":return()=>v([]);case"onLostPointerCapture":return m=>{const{internal:t}=e.getState();"pointerId"in m&&t.capturedMap.has(m.pointerId)&&requestAnimationFrame(()=>{t.capturedMap.has(m.pointerId)&&(t.capturedMap.delete(m.pointerId),v([]))})}}return function(t){const{onPointerMissed:n,internal:a}=e.getState();a.lastEvent.current=t;const d=h==="onPointerMove",p=h==="onClick"||h==="onContextMenu"||h==="onDoubleClick",l=s(t,d?i:void 0),o=p?r(t):0;h==="onPointerDown"&&(a.initialClick=[t.offsetX,t.offsetY],a.initialHits=l.map(y=>y.eventObject)),p&&!l.length&&o<=2&&(w(t,a.interaction),n&&n(t)),d&&v(l);function f(y){const C=y.eventObject,S=C.__r3f,E=S==null?void 0:S.handlers;if(S!=null&&S.eventCount)if(d){if(E.onPointerOver||E.onPointerEnter||E.onPointerOut||E.onPointerLeave){const x=ee(y),R=a.hovered.get(x);R?R.stopped&&y.stopPropagation():(a.hovered.set(x,y),E.onPointerOver==null||E.onPointerOver(y),E.onPointerEnter==null||E.onPointerEnter(y))}E.onPointerMove==null||E.onPointerMove(y)}else{const x=E[h];x?(!p||a.initialHits.includes(C))&&(w(t,a.interaction.filter(R=>!a.initialHits.includes(R))),x(y)):p&&a.initialHits.includes(C)&&w(t,a.interaction.filter(R=>!a.initialHits.includes(R)))}}u(l,t,o,f)}}return{handlePointer:c}}const Be=e=>!!(e!=null&&e.render),Fe=_.createContext(null),Pt=(e,r)=>{const i=pt((c,h)=>{const m=new Y,t=new Y,n=new Y;function a(o=h().camera,f=t,y=h().size){const{width:C,height:S,top:E,left:x}=y,R=C/S;f instanceof Y?n.copy(f):n.set(...f);const O=o.getWorldPosition(m).distanceTo(n);if(Re(o))return{width:C/o.zoom,height:S/o.zoom,top:E,left:x,factor:1,distance:O,aspect:R};{const P=o.fov*Math.PI/180,b=2*Math.tan(P/2)*O,j=b*(C/S);return{width:j,height:b,top:E,left:x,factor:C/j,distance:O,aspect:R}}}let d;const p=o=>c(f=>({performance:{...f.performance,current:o}})),g=new ot;return{set:c,get:h,gl:null,camera:null,raycaster:null,events:{priority:1,enabled:!0,connected:!1},xr:null,scene:null,invalidate:(o=1)=>e(h(),o),advance:(o,f)=>r(o,f,h()),legacy:!1,linear:!1,flat:!1,controls:null,clock:new it,pointer:g,mouse:g,frameloop:"always",onPointerMissed:void 0,performance:{current:1,min:.5,max:1,debounce:200,regress:()=>{const o=h();d&&clearTimeout(d),o.performance.current!==o.performance.min&&p(o.performance.min),d=setTimeout(()=>p(h().performance.max),o.performance.debounce)}},size:{width:0,height:0,top:0,left:0,updateStyle:!1},viewport:{initialDpr:0,dpr:0,width:0,height:0,top:0,left:0,aspect:0,distance:0,factor:0,getCurrentViewport:a},setEvents:o=>c(f=>({...f,events:{...f.events,...o}})),setSize:(o,f,y,C,S)=>{const E=h().camera,x={width:o,height:f,top:C||0,left:S||0,updateStyle:y};c(R=>({size:x,viewport:{...R.viewport,...a(E,t,x)}}))},setDpr:o=>c(f=>{const y=Le(o);return{viewport:{...f.viewport,dpr:y,initialDpr:f.viewport.initialDpr||y}}}),setFrameloop:(o="always")=>{const f=h().clock;f.stop(),f.elapsedTime=0,o!=="never"&&(f.start(),f.elapsedTime=0),c(()=>({frameloop:o}))},previousRoot:void 0,internal:{active:!1,priority:0,frames:0,lastEvent:_.createRef(),interaction:[],hovered:new Map,subscribers:[],initialClick:[0,0],initialHits:[],capturedMap:new Map,subscribe:(o,f,y)=>{const C=h().internal;return C.priority=C.priority+(f>0?1:0),C.subscribers.push({ref:o,priority:f,store:y}),C.subscribers=C.subscribers.sort((S,E)=>S.priority-E.priority),()=>{const S=h().internal;S!=null&&S.subscribers&&(S.priority=S.priority-(f>0?1:0),S.subscribers=S.subscribers.filter(E=>E.ref!==o))}}}}}),s=i.getState();let u=s.size,v=s.viewport.dpr,w=s.camera;return i.subscribe(()=>{const{camera:c,size:h,viewport:m,gl:t,set:n}=i.getState();if(h.width!==u.width||h.height!==u.height||m.dpr!==v){var a;u=h,v=m.dpr,_t(c,h),t.setPixelRatio(m.dpr);const d=(a=h.updateStyle)!=null?a:typeof HTMLCanvasElement<"u"&&t.domElement instanceof HTMLCanvasElement;t.setSize(h.width,h.height,d)}c!==w&&(w=c,n(d=>({viewport:{...d.viewport,...d.viewport.getCurrentViewport(c)}})))}),i.subscribe(c=>e(c)),i};let te,Mt=new Set,xt=new Set,Ot=new Set;function fe(e,r){if(e.size)for(const{callback:i}of e.values())i(r)}function $(e,r){switch(e){case"before":return fe(Mt,r);case"after":return fe(xt,r);case"tail":return fe(Ot,r)}}let ue,de;function pe(e,r,i){let s=r.clock.getDelta();for(r.frameloop==="never"&&typeof e=="number"&&(s=e-r.clock.elapsedTime,r.clock.oldTime=r.clock.elapsedTime,r.clock.elapsedTime=e),ue=r.internal.subscribers,te=0;te<ue.length;te++)de=ue[te],de.ref.current(de.store.getState(),s,i);return!r.internal.priority&&r.gl.render&&r.gl.render(r.scene,r.camera),r.internal.frames=Math.max(0,r.internal.frames-1),r.frameloop==="always"?1:r.internal.frames}function jt(e){let r=!1,i=!1,s,u,v;function w(m){u=requestAnimationFrame(w),r=!0,s=0,$("before",m),i=!0;for(const n of e.values()){var t;v=n.store.getState(),v.internal.active&&(v.frameloop==="always"||v.internal.frames>0)&&!((t=v.gl.xr)!=null&&t.isPresenting)&&(s+=pe(m,v))}if(i=!1,$("after",m),s===0)return $("tail",m),r=!1,cancelAnimationFrame(u)}function c(m,t=1){var n;if(!m)return e.forEach(a=>c(a.store.getState(),t));(n=m.gl.xr)!=null&&n.isPresenting||!m.internal.active||m.frameloop==="never"||(t>1?m.internal.frames=Math.min(60,m.internal.frames+t):i?m.internal.frames=2:m.internal.frames=1,r||(r=!0,requestAnimationFrame(w)))}function h(m,t=!0,n,a){if(t&&$("before",m),n)pe(m,n,a);else for(const d of e.values())pe(m,d.store.getState());t&&$("after",m)}return{loop:w,invalidate:c,advance:h}}function Ie(){const e=_.useContext(Fe);if(!e)throw new Error("R3F: Hooks can only be used within the Canvas component!");return e}function Rt(e=i=>i,r){return Ie()(e,r)}function er(e,r=0){const i=Ie(),s=i.getState().internal.subscribe,u=Te(e);return K(()=>s(u,r,i),[r,s,i]),null}const U=new Map,{invalidate:Me,advance:xe}=jt(U),{reconciler:ne,applyProps:I}=ht(U,Ct),H={objects:"shallow",strict:!1},Tt=(e,r)=>{const i=typeof e=="function"?e(r):e;return Be(i)?i:new Ze({powerPreference:"high-performance",canvas:r,antialias:!0,alpha:!0,...e})};function kt(e,r){const i=typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement;if(r){const{width:s,height:u,top:v,left:w,updateStyle:c=i}=r;return{width:s,height:u,top:v,left:w,updateStyle:c}}else if(typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement&&e.parentElement){const{width:s,height:u,top:v,left:w}=e.parentElement.getBoundingClientRect();return{width:s,height:u,top:v,left:w,updateStyle:i}}else if(typeof OffscreenCanvas<"u"&&e instanceof OffscreenCanvas)return{width:e.width,height:e.height,top:0,left:0,updateStyle:i};return{width:0,height:0,top:0,left:0}}function zt(e){const r=U.get(e),i=r==null?void 0:r.fiber,s=r==null?void 0:r.store;r&&console.warn("R3F.createRoot should only be called once!");const u=typeof reportError=="function"?reportError:console.error,v=s||Pt(Me,xe),w=i||ne.createContainer(v,G.ConcurrentRoot,null,!1,null,"",u,null);r||U.set(e,{fiber:w,store:v});let c,h=!1,m;return{configure(t={}){let{gl:n,size:a,scene:d,events:p,onCreated:g,shadows:l=!1,linear:o=!1,flat:f=!1,legacy:y=!1,orthographic:C=!1,frameloop:S="always",dpr:E=[1,2],performance:x,raycaster:R,camera:O,onPointerMissed:P}=t,b=v.getState(),j=b.gl;b.gl||b.set({gl:j=Tt(n,e)});let L=b.raycaster;L||b.set({raycaster:L=new We});const{params:W,...J}=R||{};if(M.equ(J,L,H)||I(L,{...J}),M.equ(W,L.params,H)||I(L,{params:{...L.params,...W}}),!b.camera||b.camera===m&&!M.equ(m,O,H)){m=O;const z=O instanceof et,T=z?O:C?new Ve(0,0,0,0,.1,1e3):new Xe(75,0,.1,1e3);z||(T.position.z=5,O&&(I(T,O),("aspect"in O||"left"in O||"right"in O||"bottom"in O||"top"in O)&&(T.manual=!0,T.updateProjectionMatrix())),!b.camera&&!(O!=null&&O.rotation)&&T.lookAt(0,0,0)),b.set({camera:T}),L.camera=T}if(!b.scene){let z;d instanceof we?z=d:(z=new we,d&&I(z,d)),b.set({scene:N(z)})}if(!b.xr){var V;const z=(k,oe)=>{const Z=v.getState();Z.frameloop!=="never"&&xe(k,!0,Z,oe)},T=()=>{const k=v.getState();k.gl.xr.enabled=k.gl.xr.isPresenting,k.gl.xr.setAnimationLoop(k.gl.xr.isPresenting?z:null),k.gl.xr.isPresenting||Me(k)},F={connect(){const k=v.getState().gl;k.xr.addEventListener("sessionstart",T),k.xr.addEventListener("sessionend",T)},disconnect(){const k=v.getState().gl;k.xr.removeEventListener("sessionstart",T),k.xr.removeEventListener("sessionend",T)}};typeof((V=j.xr)==null?void 0:V.addEventListener)=="function"&&F.connect(),b.set({xr:F})}if(j.shadowMap){const z=j.shadowMap.enabled,T=j.shadowMap.type;if(j.shadowMap.enabled=!!l,M.boo(l))j.shadowMap.type=se;else if(M.str(l)){var Q;const F={basic:tt,percentage:rt,soft:se,variance:nt};j.shadowMap.type=(Q=F[l])!=null?Q:se}else M.obj(l)&&Object.assign(j.shadowMap,l);(z!==j.shadowMap.enabled||T!==j.shadowMap.type)&&(j.shadowMap.needsUpdate=!0)}const A=je();A&&("enabled"in A?A.enabled=!y:"legacyMode"in A&&(A.legacyMode=y)),h||I(j,{outputEncoding:o?3e3:3001,toneMapping:f?$e:Ye}),b.legacy!==y&&b.set(()=>({legacy:y})),b.linear!==o&&b.set(()=>({linear:o})),b.flat!==f&&b.set(()=>({flat:f})),n&&!M.fun(n)&&!Be(n)&&!M.equ(n,j,H)&&I(j,n),p&&!b.events.handlers&&b.set({events:p(v)});const B=kt(e,a);return M.equ(B,b.size,H)||b.setSize(B.width,B.height,B.updateStyle,B.top,B.left),E&&b.viewport.dpr!==Le(E)&&b.setDpr(E),b.frameloop!==S&&b.setFrameloop(S),b.onPointerMissed||b.set({onPointerMissed:P}),x&&!M.equ(x,b.performance,H)&&b.set(z=>({performance:{...z.performance,...x}})),c=g,h=!0,this},render(t){return h||this.configure(),ne.updateContainer(D.jsx(Lt,{store:v,children:t,onCreated:c,rootElement:e}),w,null,()=>{}),v},unmount(){He(e)}}}function Lt({store:e,children:r,onCreated:i,rootElement:s}){return K(()=>{const u=e.getState();u.set(v=>({internal:{...v.internal,active:!0}})),i&&i(u),e.getState().events.connected||u.events.connect==null||u.events.connect(s)},[]),D.jsx(Fe.Provider,{value:e,children:r})}function He(e,r){const i=U.get(e),s=i==null?void 0:i.fiber;if(s){const u=i==null?void 0:i.store.getState();u&&(u.internal.active=!1),ne.updateContainer(null,s,null,()=>{u&&setTimeout(()=>{try{var v,w,c,h;u.events.disconnect==null||u.events.disconnect(),(v=u.gl)==null||(w=v.renderLists)==null||w.dispose==null||w.dispose(),(c=u.gl)==null||c.forceContextLoss==null||c.forceContextLoss(),(h=u.gl)!=null&&h.xr&&u.xr.disconnect(),yt(u),U.delete(e)}catch{}},500)})}}ne.injectIntoDevTools({bundleType:0,rendererPackageName:"@react-three/fiber",version:_.version});const ve={onClick:["click",!1],onContextMenu:["contextmenu",!1],onDoubleClick:["dblclick",!1],onWheel:["wheel",!0],onPointerDown:["pointerdown",!0],onPointerUp:["pointerup",!0],onPointerLeave:["pointerleave",!0],onPointerMove:["pointermove",!0],onPointerCancel:["pointercancel",!0],onLostPointerCapture:["lostpointercapture",!0]};function Dt(e){const{handlePointer:r}=St(e);return{priority:1,enabled:!0,compute(i,s,u){s.pointer.set(i.offsetX/s.size.width*2-1,-(i.offsetY/s.size.height)*2+1),s.raycaster.setFromCamera(s.pointer,s.camera)},connected:void 0,handlers:Object.keys(ve).reduce((i,s)=>({...i,[s]:r(s)}),{}),update:()=>{var i;const{events:s,internal:u}=e.getState();(i=u.lastEvent)!=null&&i.current&&s.handlers&&s.handlers.onPointerMove(u.lastEvent.current)},connect:i=>{var s;const{set:u,events:v}=e.getState();v.disconnect==null||v.disconnect(),u(w=>({events:{...w.events,connected:i}})),Object.entries((s=v.handlers)!=null?s:[]).forEach(([w,c])=>{const[h,m]=ve[w];i.addEventListener(h,c,{passive:m})})},disconnect:()=>{const{set:i,events:s}=e.getState();if(s.connected){var u;Object.entries((u=s.handlers)!=null?u:[]).forEach(([v,w])=>{if(s&&s.connected instanceof HTMLElement){const[c]=ve[v];s.connected.removeEventListener(c,w)}}),i(v=>({events:{...v.events,connected:void 0}}))}}}}function At({debounce:e,scroll:r,polyfill:i,offsetSize:s}={debounce:0,scroll:!1,offsetSize:!1}){const u=i||typeof window<"u"&&window.ResizeObserver,[v,w]=_.useState({left:0,top:0,width:0,height:0,bottom:0,right:0,x:0,y:0});if(!u)return v.width=1280,v.height=800,[()=>{},v,()=>{}];const c=_.useRef({element:null,scrollContainers:null,resizeObserver:null,lastBounds:v}),h=e?typeof e=="number"?e:e.scroll:null,m=e?typeof e=="number"?e:e.resize:null,t=_.useRef(!1);_.useEffect(()=>(t.current=!0,()=>void(t.current=!1)));const[n,a,d]=_.useMemo(()=>{const o=()=>{if(!c.current.element)return;const{left:f,top:y,width:C,height:S,bottom:E,right:x,x:R,y:O}=c.current.element.getBoundingClientRect(),P={left:f,top:y,width:C,height:S,bottom:E,right:x,x:R,y:O};c.current.element instanceof HTMLElement&&s&&(P.height=c.current.element.offsetHeight,P.width=c.current.element.offsetWidth),Object.freeze(P),t.current&&!Ht(c.current.lastBounds,P)&&w(c.current.lastBounds=P)};return[o,m?ye(o,m):o,h?ye(o,h):o]},[w,s,h,m]);function p(){c.current.scrollContainers&&(c.current.scrollContainers.forEach(o=>o.removeEventListener("scroll",d,!0)),c.current.scrollContainers=null),c.current.resizeObserver&&(c.current.resizeObserver.disconnect(),c.current.resizeObserver=null)}function g(){c.current.element&&(c.current.resizeObserver=new u(d),c.current.resizeObserver.observe(c.current.element),r&&c.current.scrollContainers&&c.current.scrollContainers.forEach(o=>o.addEventListener("scroll",d,{capture:!0,passive:!0})))}const l=o=>{!o||o===c.current.element||(p(),c.current.element=o,c.current.scrollContainers=Ne(o),g())};return Ft(d,!!r),Bt(a),_.useEffect(()=>{p(),g()},[r,d,a]),_.useEffect(()=>p,[]),[l,v,n]}function Bt(e){_.useEffect(()=>{const r=e;return window.addEventListener("resize",r),()=>void window.removeEventListener("resize",r)},[e])}function Ft(e,r){_.useEffect(()=>{if(r){const i=e;return window.addEventListener("scroll",i,{capture:!0,passive:!0}),()=>void window.removeEventListener("scroll",i,!0)}},[e,r])}function Ne(e){const r=[];if(!e||e===document.body)return r;const{overflow:i,overflowX:s,overflowY:u}=window.getComputedStyle(e);return[i,s,u].some(v=>v==="auto"||v==="scroll")&&r.push(e),[...r,...Ne(e.parentElement)]}const It=["x","y","top","bottom","left","right","width","height"],Ht=(e,r)=>It.every(i=>e[i]===r[i]),Nt=_.forwardRef(function({children:r,fallback:i,resize:s,style:u,gl:v,events:w=Dt,eventSource:c,eventPrefix:h,shadows:m,linear:t,flat:n,legacy:a,orthographic:d,frameloop:p,dpr:g,performance:l,raycaster:o,camera:f,scene:y,onPointerMissed:C,onCreated:S,...E},x){_.useMemo(()=>vt(st),[]);const R=ct(),[O,P]=At({scroll:!0,debounce:{scroll:50,resize:0},...s}),b=_.useRef(null),j=_.useRef(null);_.useImperativeHandle(x,()=>b.current);const L=Te(C),[W,J]=_.useState(!1),[V,Q]=_.useState(!1);if(W)throw W;if(V)throw V;const A=_.useRef(null);K(()=>{const z=b.current;P.width>0&&P.height>0&&z&&(A.current||(A.current=zt(z)),A.current.configure({gl:v,events:w,shadows:m,linear:t,flat:n,legacy:a,orthographic:d,frameloop:p,dpr:g,performance:l,raycaster:o,camera:f,scene:y,size:P,onPointerMissed:(...T)=>L.current==null?void 0:L.current(...T),onCreated:T=>{T.events.connect==null||T.events.connect(c?mt(c)?c.current:c:j.current),h&&T.setEvents({compute:(F,k)=>{const oe=F[h+"X"],Z=F[h+"Y"];k.pointer.set(oe/k.size.width*2-1,-(Z/k.size.height)*2+1),k.raycaster.setFromCamera(k.pointer,k.camera)}}),S==null||S(T)}}),A.current.render(D.jsx(R,{children:D.jsx(ke,{set:Q,children:D.jsx(_.Suspense,{fallback:D.jsx(gt,{set:J}),children:r})})})))}),_.useEffect(()=>{const z=b.current;if(z)return()=>He(z)},[]);const B=c?"none":"auto";return D.jsx("div",{ref:j,style:{position:"relative",width:"100%",height:"100%",overflow:"hidden",pointerEvents:B,...u},...E,children:D.jsx("div",{ref:O,style:{width:"100%",height:"100%"},children:D.jsx("canvas",{ref:b,style:{display:"block"},children:i})})})}),tr=_.forwardRef(function(r,i){return D.jsx(at,{children:D.jsx(Nt,{...r,ref:i})})}),rr=_.forwardRef(({sdfGlyphSize:e=64,anchorX:r="center",anchorY:i="middle",font:s,fontSize:u=1,children:v,characters:w,onSync:c,...h},m)=>{const t=Rt(({invalidate:p})=>p),[n]=_.useState(()=>new ft),[a,d]=_.useMemo(()=>{const p=[];let g="";return _.Children.forEach(v,l=>{typeof l=="string"||typeof l=="number"?g+=l:p.push(l)}),[p,g]},[v]);return dt(()=>new Promise(p=>ut({font:s,characters:w},p)),["troika-text",s,w]),_.useLayoutEffect(()=>void n.sync(()=>{t(),c&&c(n)})),_.useEffect(()=>()=>n.dispose(),[n]),_.createElement("primitive",Oe({object:n,ref:m,font:s,text:d,anchorX:r,anchorY:i,fontSize:u,sdfGlyphSize:e},h),a)});function qt(e,r){const i=e+"Geometry";return _.forwardRef(({args:s,children:u,...v},w)=>{const c=_.useRef(null);return _.useImperativeHandle(w,()=>c.current),_.useLayoutEffect(()=>void(r==null?void 0:r(c.current))),_.createElement("mesh",Oe({ref:c},v),_.createElement(i,{attach:"geometry",args:s}),u)})}const nr=qt("box");export{nr as B,tr as C,rr as T,er as u};

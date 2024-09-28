import{v as E,w as P,x as U,y as A,z as R}from"./three-7QjQTuvD.js";const K=/\bvoid\s+main\s*\(\s*\)\s*{/g;function h(n){const t=/^[ \t]*#include +<([\w\d./]+)>/gm;function i(o,r){let u=R[r];return u?h(u):o}return n.replace(t,i)}const s=[];for(let n=0;n<256;n++)s[n]=(n<16?"0":"")+n.toString(16);function N(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0,o=Math.random()*4294967295|0;return(s[n&255]+s[n>>8&255]+s[n>>16&255]+s[n>>24&255]+"-"+s[t&255]+s[t>>8&255]+"-"+s[t>>16&15|64]+s[t>>24&255]+"-"+s[i&63|128]+s[i>>8&255]+"-"+s[i>>16&255]+s[i>>24&255]+s[o&255]+s[o>>8&255]+s[o>>16&255]+s[o>>24&255]).toUpperCase()}const m=Object.assign||function(){let n=arguments[0];for(let t=1,i=arguments.length;t<i;t++){let o=arguments[t];if(o)for(let r in o)Object.prototype.hasOwnProperty.call(o,r)&&(n[r]=o[r])}return n},B=Date.now(),x=new WeakMap,D=new Map;let H=1e10;function M(n,t){const i=k(t);let o=x.get(n);if(o||x.set(n,o=Object.create(null)),o[i])return new o[i];const r=`_onBeforeCompile${i}`,u=function(e,f){n.onBeforeCompile.call(this,e,f);const l=this.customProgramCacheKey()+"|"+e.vertexShader+"|"+e.fragmentShader;let p=D[l];if(!p){const d=I(this,e,t,i);p=D[l]=d}e.vertexShader=p.vertexShader,e.fragmentShader=p.fragmentShader,m(e.uniforms,this.uniforms),t.timeUniform&&(e.uniforms[t.timeUniform]={get value(){return Date.now()-B}}),this[r]&&this[r](e)},c=function(){return _(t.chained?n:n.clone())},_=function(e){const f=Object.create(e,g);return Object.defineProperty(f,"baseMaterial",{value:n}),Object.defineProperty(f,"id",{value:H++}),f.uuid=N(),f.uniforms=m({},e.uniforms,t.uniforms),f.defines=m({},e.defines,t.defines),f.defines[`TROIKA_DERIVED_MATERIAL_${i}`]="",f.extensions=m({},e.extensions,t.extensions),f._listeners=void 0,f},g={constructor:{value:c},isDerivedMaterial:{value:!0},customProgramCacheKey:{writable:!0,configurable:!0,value:function(){return n.customProgramCacheKey()+"|"+i}},onBeforeCompile:{get(){return u},set(e){this[r]=e}},copy:{writable:!0,configurable:!0,value:function(e){return n.copy.call(this,e),!n.isShaderMaterial&&!n.isDerivedMaterial&&(m(this.extensions,e.extensions),m(this.defines,e.defines),m(this.uniforms,E.clone(e.uniforms))),this}},clone:{writable:!0,configurable:!0,value:function(){const e=new n.constructor;return _(e).copy(this)}},getDepthMaterial:{writable:!0,configurable:!0,value:function(){let e=this._depthMaterial;return e||(e=this._depthMaterial=M(n.isDerivedMaterial?n.getDepthMaterial():new P({depthPacking:U}),t),e.defines.IS_DEPTH_MATERIAL="",e.uniforms=this.uniforms),e}},getDistanceMaterial:{writable:!0,configurable:!0,value:function(){let e=this._distanceMaterial;return e||(e=this._distanceMaterial=M(n.isDerivedMaterial?n.getDistanceMaterial():new A,t),e.defines.IS_DISTANCE_MATERIAL="",e.uniforms=this.uniforms),e}},dispose:{writable:!0,configurable:!0,value(){const{_depthMaterial:e,_distanceMaterial:f}=this;e&&e.dispose(),f&&f.dispose(),n.dispose.call(this)}}};return o[i]=c,new c}function I(n,{vertexShader:t,fragmentShader:i},o,r){let{vertexDefs:u,vertexMainIntro:c,vertexMainOutro:_,vertexTransform:g,fragmentDefs:e,fragmentMainIntro:f,fragmentMainOutro:l,fragmentColorTransform:p,customRewriter:d,timeUniform:$}=o;if(u=u||"",c=c||"",_=_||"",e=e||"",f=f||"",l=l||"",(g||d)&&(t=h(t)),(p||d)&&(i=i.replace(/^[ \t]*#include <((?:tonemapping|encodings|fog|premultiplied_alpha|dithering)_fragment)>/gm,`
//!BEGIN_POST_CHUNK $1
$&
//!END_POST_CHUNK
`),i=h(i)),d){let a=d({vertexShader:t,fragmentShader:i});t=a.vertexShader,i=a.fragmentShader}if(p){let a=[];i=i.replace(/^\/\/!BEGIN_POST_CHUNK[^]+?^\/\/!END_POST_CHUNK/gm,v=>(a.push(v),"")),l=`${p}
${a.join(`
`)}
${l}`}if($){const a=`
uniform float ${$};
`;u=a+u,e=a+e}return g&&(t=`vec3 troika_position_${r};
vec3 troika_normal_${r};
vec2 troika_uv_${r};
${t}
`,u=`${u}
void troikaVertexTransform${r}(inout vec3 position, inout vec3 normal, inout vec2 uv) {
  ${g}
}
`,c=`
troika_position_${r} = vec3(position);
troika_normal_${r} = vec3(normal);
troika_uv_${r} = vec2(uv);
troikaVertexTransform${r}(troika_position_${r}, troika_normal_${r}, troika_uv_${r});
${c}
`,t=t.replace(/\b(position|normal|uv)\b/g,(a,v,O,T)=>/\battribute\s+vec[23]\s+$/.test(T.substr(0,O))?v:`troika_${v}_${r}`),n.map&&n.map.channel>0||(t=t.replace(/\bMAP_UV\b/g,`troika_uv_${r}`))),t=C(t,r,u,c,_),i=C(i,r,e,f,l),{vertexShader:t,fragmentShader:i}}function C(n,t,i,o,r){return(o||r||i)&&(n=n.replace(K,`
${i}
void troikaOrigMain${t}() {`),n+=`
void main() {
  ${o}
  troikaOrigMain${t}();
  ${r}
}`),n}function b(n,t){return n==="uniforms"?void 0:typeof t=="function"?t.toString():t}let j=0;const w=new Map;function k(n){const t=JSON.stringify(n,b);let i=w.get(t);return i==null&&w.set(t,i=++j),i}export{M as c,K as v};

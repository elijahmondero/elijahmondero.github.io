import{p as L,s as X}from"./micromark-util-chunked-DrRIdSP-.js";import{c as d}from"./micromark-util-classify-character-GCpR5yWH.js";import{r as en}from"./micromark-util-resolve-all-PQCKh0dx.js";import{a as q,b as F,c as sn,d as pn,e as b,m as z,f as hn,g as xn,h as Z,i as A}from"./micromark-util-character-Ch8j4vtg.js";import{f as y}from"./micromark-factory-space-CA-Wq7KA.js";import{d as kn}from"./decode-named-character-reference-C3-224fz.js";import{s as gn}from"./micromark-util-subtokenize-BT_fPq2G.js";import{f as un}from"./micromark-factory-destination-CkgxUJuk.js";import{f as an}from"./micromark-factory-label-U15tx9Nh.js";import{f as ln}from"./micromark-factory-title-reCpaPbc.js";import{f as G}from"./micromark-factory-whitespace-_v4v79HM.js";import{n as $}from"./micromark-util-normalize-identifier-C9ANKk3v.js";import{h as nn,a as Sn}from"./micromark-util-html-tag-name-DbKNfynz.js";const Ot={name:"attention",resolveAll:zn,tokenize:bn};function zn(n,a){let r=-1,t,l,o,u,m,g,h,x;for(;++r<n.length;)if(n[r][0]==="enter"&&n[r][1].type==="attentionSequence"&&n[r][1]._close){for(t=r;t--;)if(n[t][0]==="exit"&&n[t][1].type==="attentionSequence"&&n[t][1]._open&&a.sliceSerialize(n[t][1]).charCodeAt(0)===a.sliceSerialize(n[r][1]).charCodeAt(0)){if((n[t][1]._close||n[r][1]._open)&&(n[r][1].end.offset-n[r][1].start.offset)%3&&!((n[t][1].end.offset-n[t][1].start.offset+n[r][1].end.offset-n[r][1].start.offset)%3))continue;g=n[t][1].end.offset-n[t][1].start.offset>1&&n[r][1].end.offset-n[r][1].start.offset>1?2:1;const p={...n[t][1].end},S={...n[r][1].start};tn(p,-g),tn(S,g),u={type:g>1?"strongSequence":"emphasisSequence",start:p,end:{...n[t][1].end}},m={type:g>1?"strongSequence":"emphasisSequence",start:{...n[r][1].start},end:S},o={type:g>1?"strongText":"emphasisText",start:{...n[t][1].end},end:{...n[r][1].start}},l={type:g>1?"strong":"emphasis",start:{...u.start},end:{...m.end}},n[t][1].end={...u.start},n[r][1].start={...m.end},h=[],n[t][1].end.offset-n[t][1].start.offset&&(h=L(h,[["enter",n[t][1],a],["exit",n[t][1],a]])),h=L(h,[["enter",l,a],["enter",u,a],["exit",u,a],["enter",o,a]]),h=L(h,en(a.parser.constructs.insideSpan.null,n.slice(t+1,r),a)),h=L(h,[["exit",o,a],["enter",m,a],["exit",m,a],["exit",l,a]]),n[r][1].end.offset-n[r][1].start.offset?(x=2,h=L(h,[["enter",n[r][1],a],["exit",n[r][1],a]])):x=0,X(n,t-1,r-t+3,h),r=t+h.length-x-2;break}}for(r=-1;++r<n.length;)n[r][1].type==="attentionSequence"&&(n[r][1].type="data");return n}function bn(n,a){const r=this.parser.constructs.attentionMarkers.null,t=this.previous,l=d(t);let o;return u;function u(g){return o=g,n.enter("attentionSequence"),m(g)}function m(g){if(g===o)return n.consume(g),m;const h=n.exit("attentionSequence"),x=d(g),p=!x||x===2&&l||r.includes(g),S=!l||l===2&&x||r.includes(t);return h._open=!!(o===42?p:p&&(l||!S)),h._close=!!(o===42?S:S&&(x||!p)),a(g)}}function tn(n,a){n.column+=a,n.offset+=a,n._bufferIndex+=a}const Rt={name:"autolink",tokenize:cn};function cn(n,a,r){let t=0;return l;function l(s){return n.enter("autolink"),n.enter("autolinkMarker"),n.consume(s),n.exit("autolinkMarker"),n.enter("autolinkProtocol"),o}function o(s){return q(s)?(n.consume(s),u):s===64?r(s):h(s)}function u(s){return s===43||s===45||s===46||F(s)?(t=1,m(s)):h(s)}function m(s){return s===58?(n.consume(s),t=0,g):(s===43||s===45||s===46||F(s))&&t++<32?(n.consume(s),m):(t=0,h(s))}function g(s){return s===62?(n.exit("autolinkProtocol"),n.enter("autolinkMarker"),n.consume(s),n.exit("autolinkMarker"),n.exit("autolink"),a):s===null||s===32||s===60||sn(s)?r(s):(n.consume(s),g)}function h(s){return s===64?(n.consume(s),x):pn(s)?(n.consume(s),h):r(s)}function x(s){return F(s)?p(s):r(s)}function p(s){return s===46?(n.consume(s),t=0,x):s===62?(n.exit("autolinkProtocol").type="autolinkEmail",n.enter("autolinkMarker"),n.consume(s),n.exit("autolinkMarker"),n.exit("autolink"),a):S(s)}function S(s){if((s===45||F(s))&&t++<63){const f=s===45?S:p;return n.consume(s),f}return r(s)}}const v={partial:!0,tokenize:yn};function yn(n,a,r){return t;function t(o){return b(o)?y(n,l,"linePrefix")(o):l(o)}function l(o){return o===null||z(o)?a(o):r(o)}}const En={continuation:{tokenize:Cn},exit:wn,name:"blockQuote",tokenize:fn};function fn(n,a,r){const t=this;return l;function l(u){if(u===62){const m=t.containerState;return m.open||(n.enter("blockQuote",{_container:!0}),m.open=!0),n.enter("blockQuotePrefix"),n.enter("blockQuoteMarker"),n.consume(u),n.exit("blockQuoteMarker"),o}return r(u)}function o(u){return b(u)?(n.enter("blockQuotePrefixWhitespace"),n.consume(u),n.exit("blockQuotePrefixWhitespace"),n.exit("blockQuotePrefix"),a):(n.exit("blockQuotePrefix"),a(u))}}function Cn(n,a,r){const t=this;return l;function l(u){return b(u)?y(n,o,"linePrefix",t.parser.constructs.disable.null.includes("codeIndented")?void 0:4)(u):o(u)}function o(u){return n.attempt(En,a,r)(u)}}function wn(n){n.exit("blockQuote")}const Ht={name:"characterEscape",tokenize:An};function An(n,a,r){return t;function t(o){return n.enter("characterEscape"),n.enter("escapeMarker"),n.consume(o),n.exit("escapeMarker"),l}function l(o){return hn(o)?(n.enter("characterEscapeValue"),n.consume(o),n.exit("characterEscapeValue"),n.exit("characterEscape"),a):r(o)}}const Vt={name:"characterReference",tokenize:In};function In(n,a,r){const t=this;let l=0,o,u;return m;function m(p){return n.enter("characterReference"),n.enter("characterReferenceMarker"),n.consume(p),n.exit("characterReferenceMarker"),g}function g(p){return p===35?(n.enter("characterReferenceMarkerNumeric"),n.consume(p),n.exit("characterReferenceMarkerNumeric"),h):(n.enter("characterReferenceValue"),o=31,u=F,x(p))}function h(p){return p===88||p===120?(n.enter("characterReferenceMarkerHexadecimal"),n.consume(p),n.exit("characterReferenceMarkerHexadecimal"),n.enter("characterReferenceValue"),o=6,u=xn,x):(n.enter("characterReferenceValue"),o=7,u=Z,x(p))}function x(p){if(p===59&&l){const S=n.exit("characterReferenceValue");return u===F&&!kn(t.sliceSerialize(S))?r(p):(n.enter("characterReferenceMarker"),n.consume(p),n.exit("characterReferenceMarker"),n.exit("characterReference"),a)}return u(p)&&l++<o?(n.consume(p),x):r(p)}}const rn={partial:!0,tokenize:Ln},_t={concrete:!0,name:"codeFenced",tokenize:Tn};function Tn(n,a,r){const t=this,l={partial:!0,tokenize:N};let o=0,u=0,m;return g;function g(k){return h(k)}function h(k){const C=t.events[t.events.length-1];return o=C&&C[1].type==="linePrefix"?C[2].sliceSerialize(C[1],!0).length:0,m=k,n.enter("codeFenced"),n.enter("codeFencedFence"),n.enter("codeFencedFenceSequence"),x(k)}function x(k){return k===m?(u++,n.consume(k),x):u<3?r(k):(n.exit("codeFencedFenceSequence"),b(k)?y(n,p,"whitespace")(k):p(k))}function p(k){return k===null||z(k)?(n.exit("codeFencedFence"),t.interrupt?a(k):n.check(rn,B,R)(k)):(n.enter("codeFencedFenceInfo"),n.enter("chunkString",{contentType:"string"}),S(k))}function S(k){return k===null||z(k)?(n.exit("chunkString"),n.exit("codeFencedFenceInfo"),p(k)):b(k)?(n.exit("chunkString"),n.exit("codeFencedFenceInfo"),y(n,s,"whitespace")(k)):k===96&&k===m?r(k):(n.consume(k),S)}function s(k){return k===null||z(k)?p(k):(n.enter("codeFencedFenceMeta"),n.enter("chunkString",{contentType:"string"}),f(k))}function f(k){return k===null||z(k)?(n.exit("chunkString"),n.exit("codeFencedFenceMeta"),p(k)):k===96&&k===m?r(k):(n.consume(k),f)}function B(k){return n.attempt(l,R,_)(k)}function _(k){return n.enter("lineEnding"),n.consume(k),n.exit("lineEnding"),j}function j(k){return o>0&&b(k)?y(n,M,"linePrefix",o+1)(k):M(k)}function M(k){return k===null||z(k)?n.check(rn,B,R)(k):(n.enter("codeFlowValue"),w(k))}function w(k){return k===null||z(k)?(n.exit("codeFlowValue"),M(k)):(n.consume(k),w)}function R(k){return n.exit("codeFenced"),a(k)}function N(k,C,D){let I=0;return H;function H(c){return k.enter("lineEnding"),k.consume(c),k.exit("lineEnding"),V}function V(c){return k.enter("codeFencedFence"),b(c)?y(k,E,"linePrefix",t.parser.constructs.disable.null.includes("codeIndented")?void 0:4)(c):E(c)}function E(c){return c===m?(k.enter("codeFencedFenceSequence"),P(c)):D(c)}function P(c){return c===m?(I++,k.consume(c),P):I>=u?(k.exit("codeFencedFenceSequence"),b(c)?y(k,Q,"whitespace")(c):Q(c)):D(c)}function Q(c){return c===null||z(c)?(k.exit("codeFencedFence"),C(c)):D(c)}}}function Ln(n,a,r){const t=this;return l;function l(u){return u===null?r(u):(n.enter("lineEnding"),n.consume(u),n.exit("lineEnding"),o)}function o(u){return t.parser.lazy[t.now().line]?r(u):a(u)}}const Nt={name:"codeIndented",tokenize:Bn},Fn={partial:!0,tokenize:Mn};function Bn(n,a,r){const t=this;return l;function l(h){return n.enter("codeIndented"),y(n,o,"linePrefix",5)(h)}function o(h){const x=t.events[t.events.length-1];return x&&x[1].type==="linePrefix"&&x[2].sliceSerialize(x[1],!0).length>=4?u(h):r(h)}function u(h){return h===null?g(h):z(h)?n.attempt(Fn,u,g)(h):(n.enter("codeFlowValue"),m(h))}function m(h){return h===null||z(h)?(n.exit("codeFlowValue"),u(h)):(n.consume(h),m)}function g(h){return n.exit("codeIndented"),a(h)}}function Mn(n,a,r){const t=this;return l;function l(u){return t.parser.lazy[t.now().line]?r(u):z(u)?(n.enter("lineEnding"),n.consume(u),n.exit("lineEnding"),l):y(n,o,"linePrefix",5)(u)}function o(u){const m=t.events[t.events.length-1];return m&&m[1].type==="linePrefix"&&m[2].sliceSerialize(m[1],!0).length>=4?a(u):z(u)?l(u):r(u)}}const Qt={name:"codeText",previous:qn,resolve:Pn,tokenize:Dn};function Pn(n){let a=n.length-4,r=3,t,l;if((n[r][1].type==="lineEnding"||n[r][1].type==="space")&&(n[a][1].type==="lineEnding"||n[a][1].type==="space")){for(t=r;++t<a;)if(n[t][1].type==="codeTextData"){n[r][1].type="codeTextPadding",n[a][1].type="codeTextPadding",r+=2,a-=2;break}}for(t=r-1,a++;++t<=a;)l===void 0?t!==a&&n[t][1].type!=="lineEnding"&&(l=t):(t===a||n[t][1].type==="lineEnding")&&(n[l][1].type="codeTextData",t!==l+2&&(n[l][1].end=n[t-1][1].end,n.splice(l+2,t-l-2),a-=t-l-2,t=l+2),l=void 0);return n}function qn(n){return n!==96||this.events[this.events.length-1][1].type==="characterEscape"}function Dn(n,a,r){let t=0,l,o;return u;function u(p){return n.enter("codeText"),n.enter("codeTextSequence"),m(p)}function m(p){return p===96?(n.consume(p),t++,m):(n.exit("codeTextSequence"),g(p))}function g(p){return p===null?r(p):p===32?(n.enter("space"),n.consume(p),n.exit("space"),g):p===96?(o=n.enter("codeTextSequence"),l=0,x(p)):z(p)?(n.enter("lineEnding"),n.consume(p),n.exit("lineEnding"),g):(n.enter("codeTextData"),h(p))}function h(p){return p===null||p===32||p===96||z(p)?(n.exit("codeTextData"),g(p)):(n.consume(p),h)}function x(p){return p===96?(n.consume(p),l++,x):l===t?(n.exit("codeTextSequence"),n.exit("codeText"),a(p)):(o.type="codeTextData",h(p))}}const Wt={resolve:Rn,tokenize:Hn},On={partial:!0,tokenize:Vn};function Rn(n){return gn(n),n}function Hn(n,a){let r;return t;function t(m){return n.enter("content"),r=n.enter("chunkContent",{contentType:"content"}),l(m)}function l(m){return m===null?o(m):z(m)?n.check(On,u,o)(m):(n.consume(m),l)}function o(m){return n.exit("chunkContent"),n.exit("content"),a(m)}function u(m){return n.consume(m),n.exit("chunkContent"),r.next=n.enter("chunkContent",{contentType:"content",previous:r}),r=r.next,l}}function Vn(n,a,r){const t=this;return l;function l(u){return n.exit("chunkContent"),n.enter("lineEnding"),n.consume(u),n.exit("lineEnding"),y(n,o,"linePrefix")}function o(u){if(u===null||z(u))return r(u);const m=t.events[t.events.length-1];return!t.parser.constructs.disable.null.includes("codeIndented")&&m&&m[1].type==="linePrefix"&&m[2].sliceSerialize(m[1],!0).length>=4?a(u):n.interrupt(t.parser.constructs.flow,r,a)(u)}}const Ut={name:"definition",tokenize:Nn},_n={partial:!0,tokenize:Qn};function Nn(n,a,r){const t=this;let l;return o;function o(s){return n.enter("definition"),u(s)}function u(s){return an.call(t,n,m,r,"definitionLabel","definitionLabelMarker","definitionLabelString")(s)}function m(s){return l=$(t.sliceSerialize(t.events[t.events.length-1][1]).slice(1,-1)),s===58?(n.enter("definitionMarker"),n.consume(s),n.exit("definitionMarker"),g):r(s)}function g(s){return A(s)?G(n,h)(s):h(s)}function h(s){return un(n,x,r,"definitionDestination","definitionDestinationLiteral","definitionDestinationLiteralMarker","definitionDestinationRaw","definitionDestinationString")(s)}function x(s){return n.attempt(_n,p,p)(s)}function p(s){return b(s)?y(n,S,"whitespace")(s):S(s)}function S(s){return s===null||z(s)?(n.exit("definition"),t.parser.defined.push(l),a(s)):r(s)}}function Qn(n,a,r){return t;function t(m){return A(m)?G(n,l)(m):r(m)}function l(m){return ln(n,o,r,"definitionTitle","definitionTitleMarker","definitionTitleString")(m)}function o(m){return b(m)?y(n,u,"whitespace")(m):u(m)}function u(m){return m===null||z(m)?a(m):r(m)}}const jt={name:"hardBreakEscape",tokenize:Wn};function Wn(n,a,r){return t;function t(o){return n.enter("hardBreakEscape"),n.consume(o),l}function l(o){return z(o)?(n.exit("hardBreakEscape"),a(o)):r(o)}}const Gt={name:"headingAtx",resolve:Un,tokenize:jn};function Un(n,a){let r=n.length-2,t=3,l,o;return n[t][1].type==="whitespace"&&(t+=2),r-2>t&&n[r][1].type==="whitespace"&&(r-=2),n[r][1].type==="atxHeadingSequence"&&(t===r-1||r-4>t&&n[r-2][1].type==="whitespace")&&(r-=t+1===r?2:4),r>t&&(l={type:"atxHeadingText",start:n[t][1].start,end:n[r][1].end},o={type:"chunkText",start:n[t][1].start,end:n[r][1].end,contentType:"text"},X(n,t,r-t+1,[["enter",l,a],["enter",o,a],["exit",o,a],["exit",l,a]])),n}function jn(n,a,r){let t=0;return l;function l(x){return n.enter("atxHeading"),o(x)}function o(x){return n.enter("atxHeadingSequence"),u(x)}function u(x){return x===35&&t++<6?(n.consume(x),u):x===null||A(x)?(n.exit("atxHeadingSequence"),m(x)):r(x)}function m(x){return x===35?(n.enter("atxHeadingSequence"),g(x)):x===null||z(x)?(n.exit("atxHeading"),a(x)):b(x)?y(n,m,"whitespace")(x):(n.enter("atxHeadingText"),h(x))}function g(x){return x===35?(n.consume(x),g):(n.exit("atxHeadingSequence"),m(x))}function h(x){return x===null||x===35||A(x)?(n.exit("atxHeadingText"),m(x)):(n.consume(x),h)}}const Jt={concrete:!0,name:"htmlFlow",resolveTo:Kn,tokenize:Xn},Gn={partial:!0,tokenize:Zn},Jn={partial:!0,tokenize:Yn};function Kn(n){let a=n.length;for(;a--&&!(n[a][0]==="enter"&&n[a][1].type==="htmlFlow"););return a>1&&n[a-2][1].type==="linePrefix"&&(n[a][1].start=n[a-2][1].start,n[a+1][1].start=n[a-2][1].start,n.splice(a-2,2)),n}function Xn(n,a,r){const t=this;let l,o,u,m,g;return h;function h(i){return x(i)}function x(i){return n.enter("htmlFlow"),n.enter("htmlFlowData"),n.consume(i),p}function p(i){return i===33?(n.consume(i),S):i===47?(n.consume(i),o=!0,B):i===63?(n.consume(i),l=3,t.interrupt?a:e):q(i)?(n.consume(i),u=String.fromCharCode(i),_):r(i)}function S(i){return i===45?(n.consume(i),l=2,s):i===91?(n.consume(i),l=5,m=0,f):q(i)?(n.consume(i),l=4,t.interrupt?a:e):r(i)}function s(i){return i===45?(n.consume(i),t.interrupt?a:e):r(i)}function f(i){const U="CDATA[";return i===U.charCodeAt(m++)?(n.consume(i),m===U.length?t.interrupt?a:E:f):r(i)}function B(i){return q(i)?(n.consume(i),u=String.fromCharCode(i),_):r(i)}function _(i){if(i===null||i===47||i===62||A(i)){const U=i===47,mn=u.toLowerCase();return!U&&!o&&nn.includes(mn)?(l=1,t.interrupt?a(i):E(i)):Sn.includes(u.toLowerCase())?(l=6,U?(n.consume(i),j):t.interrupt?a(i):E(i)):(l=7,t.interrupt&&!t.parser.lazy[t.now().line]?r(i):o?M(i):w(i))}return i===45||F(i)?(n.consume(i),u+=String.fromCharCode(i),_):r(i)}function j(i){return i===62?(n.consume(i),t.interrupt?a:E):r(i)}function M(i){return b(i)?(n.consume(i),M):H(i)}function w(i){return i===47?(n.consume(i),H):i===58||i===95||q(i)?(n.consume(i),R):b(i)?(n.consume(i),w):H(i)}function R(i){return i===45||i===46||i===58||i===95||F(i)?(n.consume(i),R):N(i)}function N(i){return i===61?(n.consume(i),k):b(i)?(n.consume(i),N):w(i)}function k(i){return i===null||i===60||i===61||i===62||i===96?r(i):i===34||i===39?(n.consume(i),g=i,C):b(i)?(n.consume(i),k):D(i)}function C(i){return i===g?(n.consume(i),g=null,I):i===null||z(i)?r(i):(n.consume(i),C)}function D(i){return i===null||i===34||i===39||i===47||i===60||i===61||i===62||i===96||A(i)?N(i):(n.consume(i),D)}function I(i){return i===47||i===62||b(i)?w(i):r(i)}function H(i){return i===62?(n.consume(i),V):r(i)}function V(i){return i===null||z(i)?E(i):b(i)?(n.consume(i),V):r(i)}function E(i){return i===45&&l===2?(n.consume(i),O):i===60&&l===1?(n.consume(i),T):i===62&&l===4?(n.consume(i),W):i===63&&l===3?(n.consume(i),e):i===93&&l===5?(n.consume(i),K):z(i)&&(l===6||l===7)?(n.exit("htmlFlowData"),n.check(Gn,Y,P)(i)):i===null||z(i)?(n.exit("htmlFlowData"),P(i)):(n.consume(i),E)}function P(i){return n.check(Jn,Q,Y)(i)}function Q(i){return n.enter("lineEnding"),n.consume(i),n.exit("lineEnding"),c}function c(i){return i===null||z(i)?P(i):(n.enter("htmlFlowData"),E(i))}function O(i){return i===45?(n.consume(i),e):E(i)}function T(i){return i===47?(n.consume(i),u="",J):E(i)}function J(i){if(i===62){const U=u.toLowerCase();return nn.includes(U)?(n.consume(i),W):E(i)}return q(i)&&u.length<8?(n.consume(i),u+=String.fromCharCode(i),J):E(i)}function K(i){return i===93?(n.consume(i),e):E(i)}function e(i){return i===62?(n.consume(i),W):i===45&&l===2?(n.consume(i),e):E(i)}function W(i){return i===null||z(i)?(n.exit("htmlFlowData"),Y(i)):(n.consume(i),W)}function Y(i){return n.exit("htmlFlow"),a(i)}}function Yn(n,a,r){const t=this;return l;function l(u){return z(u)?(n.enter("lineEnding"),n.consume(u),n.exit("lineEnding"),o):r(u)}function o(u){return t.parser.lazy[t.now().line]?r(u):a(u)}}function Zn(n,a,r){return t;function t(l){return n.enter("lineEnding"),n.consume(l),n.exit("lineEnding"),n.attempt(v,a,r)}}const Kt={name:"htmlText",tokenize:$n};function $n(n,a,r){const t=this;let l,o,u;return m;function m(e){return n.enter("htmlText"),n.enter("htmlTextData"),n.consume(e),g}function g(e){return e===33?(n.consume(e),h):e===47?(n.consume(e),N):e===63?(n.consume(e),w):q(e)?(n.consume(e),D):r(e)}function h(e){return e===45?(n.consume(e),x):e===91?(n.consume(e),o=0,f):q(e)?(n.consume(e),M):r(e)}function x(e){return e===45?(n.consume(e),s):r(e)}function p(e){return e===null?r(e):e===45?(n.consume(e),S):z(e)?(u=p,T(e)):(n.consume(e),p)}function S(e){return e===45?(n.consume(e),s):p(e)}function s(e){return e===62?O(e):e===45?S(e):p(e)}function f(e){const W="CDATA[";return e===W.charCodeAt(o++)?(n.consume(e),o===W.length?B:f):r(e)}function B(e){return e===null?r(e):e===93?(n.consume(e),_):z(e)?(u=B,T(e)):(n.consume(e),B)}function _(e){return e===93?(n.consume(e),j):B(e)}function j(e){return e===62?O(e):e===93?(n.consume(e),j):B(e)}function M(e){return e===null||e===62?O(e):z(e)?(u=M,T(e)):(n.consume(e),M)}function w(e){return e===null?r(e):e===63?(n.consume(e),R):z(e)?(u=w,T(e)):(n.consume(e),w)}function R(e){return e===62?O(e):w(e)}function N(e){return q(e)?(n.consume(e),k):r(e)}function k(e){return e===45||F(e)?(n.consume(e),k):C(e)}function C(e){return z(e)?(u=C,T(e)):b(e)?(n.consume(e),C):O(e)}function D(e){return e===45||F(e)?(n.consume(e),D):e===47||e===62||A(e)?I(e):r(e)}function I(e){return e===47?(n.consume(e),O):e===58||e===95||q(e)?(n.consume(e),H):z(e)?(u=I,T(e)):b(e)?(n.consume(e),I):O(e)}function H(e){return e===45||e===46||e===58||e===95||F(e)?(n.consume(e),H):V(e)}function V(e){return e===61?(n.consume(e),E):z(e)?(u=V,T(e)):b(e)?(n.consume(e),V):I(e)}function E(e){return e===null||e===60||e===61||e===62||e===96?r(e):e===34||e===39?(n.consume(e),l=e,P):z(e)?(u=E,T(e)):b(e)?(n.consume(e),E):(n.consume(e),Q)}function P(e){return e===l?(n.consume(e),l=void 0,c):e===null?r(e):z(e)?(u=P,T(e)):(n.consume(e),P)}function Q(e){return e===null||e===34||e===39||e===60||e===61||e===96?r(e):e===47||e===62||A(e)?I(e):(n.consume(e),Q)}function c(e){return e===47||e===62||A(e)?I(e):r(e)}function O(e){return e===62?(n.consume(e),n.exit("htmlTextData"),n.exit("htmlText"),a):r(e)}function T(e){return n.exit("htmlTextData"),n.enter("lineEnding"),n.consume(e),n.exit("lineEnding"),J}function J(e){return b(e)?y(n,K,"linePrefix",t.parser.constructs.disable.null.includes("codeIndented")?void 0:4)(e):K(e)}function K(e){return n.enter("htmlTextData"),u(e)}}const on={name:"labelEnd",resolveAll:tt,resolveTo:rt,tokenize:et},vn={tokenize:it},dn={tokenize:ut},nt={tokenize:at};function tt(n){let a=-1;const r=[];for(;++a<n.length;){const t=n[a][1];if(r.push(n[a]),t.type==="labelImage"||t.type==="labelLink"||t.type==="labelEnd"){const l=t.type==="labelImage"?4:2;t.type="data",a+=l}}return n.length!==r.length&&X(n,0,n.length,r),n}function rt(n,a){let r=n.length,t=0,l,o,u,m;for(;r--;)if(l=n[r][1],o){if(l.type==="link"||l.type==="labelLink"&&l._inactive)break;n[r][0]==="enter"&&l.type==="labelLink"&&(l._inactive=!0)}else if(u){if(n[r][0]==="enter"&&(l.type==="labelImage"||l.type==="labelLink")&&!l._balanced&&(o=r,l.type!=="labelLink")){t=2;break}}else l.type==="labelEnd"&&(u=r);const g={type:n[o][1].type==="labelLink"?"link":"image",start:{...n[o][1].start},end:{...n[n.length-1][1].end}},h={type:"label",start:{...n[o][1].start},end:{...n[u][1].end}},x={type:"labelText",start:{...n[o+t+2][1].end},end:{...n[u-2][1].start}};return m=[["enter",g,a],["enter",h,a]],m=L(m,n.slice(o+1,o+t+3)),m=L(m,[["enter",x,a]]),m=L(m,en(a.parser.constructs.insideSpan.null,n.slice(o+t+4,u-3),a)),m=L(m,[["exit",x,a],n[u-2],n[u-1],["exit",h,a]]),m=L(m,n.slice(u+1)),m=L(m,[["exit",g,a]]),X(n,o,n.length,m),n}function et(n,a,r){const t=this;let l=t.events.length,o,u;for(;l--;)if((t.events[l][1].type==="labelImage"||t.events[l][1].type==="labelLink")&&!t.events[l][1]._balanced){o=t.events[l][1];break}return m;function m(S){return o?o._inactive?p(S):(u=t.parser.defined.includes($(t.sliceSerialize({start:o.end,end:t.now()}))),n.enter("labelEnd"),n.enter("labelMarker"),n.consume(S),n.exit("labelMarker"),n.exit("labelEnd"),g):r(S)}function g(S){return S===40?n.attempt(vn,x,u?x:p)(S):S===91?n.attempt(dn,x,u?h:p)(S):u?x(S):p(S)}function h(S){return n.attempt(nt,x,p)(S)}function x(S){return a(S)}function p(S){return o._balanced=!0,r(S)}}function it(n,a,r){return t;function t(p){return n.enter("resource"),n.enter("resourceMarker"),n.consume(p),n.exit("resourceMarker"),l}function l(p){return A(p)?G(n,o)(p):o(p)}function o(p){return p===41?x(p):un(n,u,m,"resourceDestination","resourceDestinationLiteral","resourceDestinationLiteralMarker","resourceDestinationRaw","resourceDestinationString",32)(p)}function u(p){return A(p)?G(n,g)(p):x(p)}function m(p){return r(p)}function g(p){return p===34||p===39||p===40?ln(n,h,r,"resourceTitle","resourceTitleMarker","resourceTitleString")(p):x(p)}function h(p){return A(p)?G(n,x)(p):x(p)}function x(p){return p===41?(n.enter("resourceMarker"),n.consume(p),n.exit("resourceMarker"),n.exit("resource"),a):r(p)}}function ut(n,a,r){const t=this;return l;function l(m){return an.call(t,n,o,u,"reference","referenceMarker","referenceString")(m)}function o(m){return t.parser.defined.includes($(t.sliceSerialize(t.events[t.events.length-1][1]).slice(1,-1)))?a(m):r(m)}function u(m){return r(m)}}function at(n,a,r){return t;function t(o){return n.enter("reference"),n.enter("referenceMarker"),n.consume(o),n.exit("referenceMarker"),l}function l(o){return o===93?(n.enter("referenceMarker"),n.consume(o),n.exit("referenceMarker"),n.exit("reference"),a):r(o)}}const Xt={name:"labelStartImage",resolveAll:on.resolveAll,tokenize:lt};function lt(n,a,r){const t=this;return l;function l(m){return n.enter("labelImage"),n.enter("labelImageMarker"),n.consume(m),n.exit("labelImageMarker"),o}function o(m){return m===91?(n.enter("labelMarker"),n.consume(m),n.exit("labelMarker"),n.exit("labelImage"),u):r(m)}function u(m){return m===94&&"_hiddenFootnoteSupport"in t.parser.constructs?r(m):a(m)}}const Yt={name:"labelStartLink",resolveAll:on.resolveAll,tokenize:ot};function ot(n,a,r){const t=this;return l;function l(u){return n.enter("labelLink"),n.enter("labelMarker"),n.consume(u),n.exit("labelMarker"),n.exit("labelLink"),o}function o(u){return u===94&&"_hiddenFootnoteSupport"in t.parser.constructs?r(u):a(u)}}const Zt={name:"lineEnding",tokenize:mt};function mt(n,a){return r;function r(t){return n.enter("lineEnding"),n.consume(t),n.exit("lineEnding"),y(n,a,"linePrefix")}}const st={name:"thematicBreak",tokenize:pt};function pt(n,a,r){let t=0,l;return o;function o(h){return n.enter("thematicBreak"),u(h)}function u(h){return l=h,m(h)}function m(h){return h===l?(n.enter("thematicBreakSequence"),g(h)):t>=3&&(h===null||z(h))?(n.exit("thematicBreak"),a(h)):r(h)}function g(h){return h===l?(n.consume(h),t++,g):(n.exit("thematicBreakSequence"),b(h)?y(n,m,"whitespace")(h):m(h))}}const ht={continuation:{tokenize:St},exit:bt,name:"list",tokenize:gt},xt={partial:!0,tokenize:ct},kt={partial:!0,tokenize:zt};function gt(n,a,r){const t=this,l=t.events[t.events.length-1];let o=l&&l[1].type==="linePrefix"?l[2].sliceSerialize(l[1],!0).length:0,u=0;return m;function m(s){const f=t.containerState.type||(s===42||s===43||s===45?"listUnordered":"listOrdered");if(f==="listUnordered"?!t.containerState.marker||s===t.containerState.marker:Z(s)){if(t.containerState.type||(t.containerState.type=f,n.enter(f,{_container:!0})),f==="listUnordered")return n.enter("listItemPrefix"),s===42||s===45?n.check(st,r,h)(s):h(s);if(!t.interrupt||s===49)return n.enter("listItemPrefix"),n.enter("listItemValue"),g(s)}return r(s)}function g(s){return Z(s)&&++u<10?(n.consume(s),g):(!t.interrupt||u<2)&&(t.containerState.marker?s===t.containerState.marker:s===41||s===46)?(n.exit("listItemValue"),h(s)):r(s)}function h(s){return n.enter("listItemMarker"),n.consume(s),n.exit("listItemMarker"),t.containerState.marker=t.containerState.marker||s,n.check(v,t.interrupt?r:x,n.attempt(xt,S,p))}function x(s){return t.containerState.initialBlankLine=!0,o++,S(s)}function p(s){return b(s)?(n.enter("listItemPrefixWhitespace"),n.consume(s),n.exit("listItemPrefixWhitespace"),S):r(s)}function S(s){return t.containerState.size=o+t.sliceSerialize(n.exit("listItemPrefix"),!0).length,a(s)}}function St(n,a,r){const t=this;return t.containerState._closeFlow=void 0,n.check(v,l,o);function l(m){return t.containerState.furtherBlankLines=t.containerState.furtherBlankLines||t.containerState.initialBlankLine,y(n,a,"listItemIndent",t.containerState.size+1)(m)}function o(m){return t.containerState.furtherBlankLines||!b(m)?(t.containerState.furtherBlankLines=void 0,t.containerState.initialBlankLine=void 0,u(m)):(t.containerState.furtherBlankLines=void 0,t.containerState.initialBlankLine=void 0,n.attempt(kt,a,u)(m))}function u(m){return t.containerState._closeFlow=!0,t.interrupt=void 0,y(n,n.attempt(ht,a,r),"linePrefix",t.parser.constructs.disable.null.includes("codeIndented")?void 0:4)(m)}}function zt(n,a,r){const t=this;return y(n,l,"listItemIndent",t.containerState.size+1);function l(o){const u=t.events[t.events.length-1];return u&&u[1].type==="listItemIndent"&&u[2].sliceSerialize(u[1],!0).length===t.containerState.size?a(o):r(o)}}function bt(n){n.exit(this.containerState.type)}function ct(n,a,r){const t=this;return y(n,l,"listItemPrefixWhitespace",t.parser.constructs.disable.null.includes("codeIndented")?void 0:5);function l(o){const u=t.events[t.events.length-1];return!b(o)&&u&&u[1].type==="listItemPrefixWhitespace"?a(o):r(o)}}const $t={name:"setextUnderline",resolveTo:yt,tokenize:Et};function yt(n,a){let r=n.length,t,l,o;for(;r--;)if(n[r][0]==="enter"){if(n[r][1].type==="content"){t=r;break}n[r][1].type==="paragraph"&&(l=r)}else n[r][1].type==="content"&&n.splice(r,1),!o&&n[r][1].type==="definition"&&(o=r);const u={type:"setextHeading",start:{...n[l][1].start},end:{...n[n.length-1][1].end}};return n[l][1].type="setextHeadingText",o?(n.splice(l,0,["enter",u,a]),n.splice(o+1,0,["exit",n[t][1],a]),n[t][1].end={...n[o][1].end}):n[t][1]=u,n.push(["exit",u,a]),n}function Et(n,a,r){const t=this;let l;return o;function o(h){let x=t.events.length,p;for(;x--;)if(t.events[x][1].type!=="lineEnding"&&t.events[x][1].type!=="linePrefix"&&t.events[x][1].type!=="content"){p=t.events[x][1].type==="paragraph";break}return!t.parser.lazy[t.now().line]&&(t.interrupt||p)?(n.enter("setextHeadingLine"),l=h,u(h)):r(h)}function u(h){return n.enter("setextHeadingLineSequence"),m(h)}function m(h){return h===l?(n.consume(h),m):(n.exit("setextHeadingLineSequence"),b(h)?y(n,g,"lineSuffix")(h):g(h))}function g(h){return h===null||z(h)?(n.exit("setextHeadingLine"),a(h)):r(h)}}export{En as a,v as b,Wt as c,Ut as d,Nt as e,Jt as f,_t as g,Gt as h,Vt as i,Ht as j,Zt as k,ht as l,Xt as m,Ot as n,Rt as o,Kt as p,Yt as q,jt as r,$t as s,st as t,on as u,Qt as v};

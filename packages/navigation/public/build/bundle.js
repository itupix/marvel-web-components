function t(){}function e(t){return t()}function n(){return Object.create(null)}function o(t){t.forEach(e)}function r(t){return"function"==typeof t}function i(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function s(t,e){t.appendChild(e)}function a(t,e,n){t.insertBefore(e,n||null)}function c(t){t.parentNode.removeChild(t)}function l(t){return document.createElement(t)}function u(t){return document.createTextNode(t)}function d(){return u(" ")}function f(t,e,n,o){return t.addEventListener(e,n,o),()=>t.removeEventListener(e,n,o)}function h(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function $(t){const e={};for(const n of t)e[n.name]=n.value;return e}let p;function m(t){p=t}function g(){const t=function(){if(!p)throw new Error("Function called outside component initialization");return p}();return(e,n)=>{const o=t.$$.callbacks[e];if(o){const r=function(t,e){const n=document.createEvent("CustomEvent");return n.initCustomEvent(t,!1,!1,e),n}(e,n);o.slice().forEach((e=>{e.call(t,r)}))}}}const b=[],y=[],v=[],x=[],_=Promise.resolve();let k=!1;function E(t){v.push(t)}let w=!1;const C=new Set;function L(){if(!w){w=!0;do{for(let t=0;t<b.length;t+=1){const e=b[t];m(e),M(e.$$)}for(m(null),b.length=0;y.length;)y.pop()();for(let t=0;t<v.length;t+=1){const e=v[t];C.has(e)||(C.add(e),e())}v.length=0}while(b.length);for(;x.length;)x.pop()();k=!1,w=!1,C.clear()}}function M(t){if(null!==t.fragment){t.update(),o(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(E)}}const T=new Set;function j(t,e){-1===t.$$.dirty[0]&&(b.push(t),k||(k=!0,_.then(L)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function z(i,s,a,l,u,d,f=[-1]){const h=p;m(i);const $=i.$$={fragment:null,ctx:null,props:d,update:t,not_equal:u,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(h?h.$$.context:s.context||[]),callbacks:n(),dirty:f,skip_bound:!1};let g=!1;if($.ctx=a?a(i,s.props||{},((t,e,...n)=>{const o=n.length?n[0]:e;return $.ctx&&u($.ctx[t],$.ctx[t]=o)&&(!$.skip_bound&&$.bound[t]&&$.bound[t](o),g&&j(i,t)),e})):[],$.update(),g=!0,o($.before_update),$.fragment=!!l&&l($.ctx),s.target){if(s.hydrate){const t=function(t){return Array.from(t.childNodes)}(s.target);$.fragment&&$.fragment.l(t),t.forEach(c)}else $.fragment&&$.fragment.c();s.intro&&((b=i.$$.fragment)&&b.i&&(T.delete(b),b.i(y))),function(t,n,i,s){const{fragment:a,on_mount:c,on_destroy:l,after_update:u}=t.$$;a&&a.m(n,i),s||E((()=>{const n=c.map(e).filter(r);l?l.push(...n):o(n),t.$$.on_mount=[]})),u.forEach(E)}(i,s.target,s.anchor,s.customElement),L()}var b,y;m(h)}let H;function N(t){let e,n,r,i,$,p,m,g,b,y,v,x;return{c(){e=l("span"),n=u(t[1]),r=u(" / "),i=u(t[0]),$=d(),p=l("button"),m=u("❮"),g=d(),b=l("button"),y=u("❯"),p.disabled=t[2],b.disabled=t[3]},m(o,c){a(o,e,c),s(e,n),s(e,r),s(e,i),a(o,$,c),a(o,p,c),s(p,m),a(o,g,c),a(o,b,c),s(b,y),v||(x=[f(p,"click",t[5]),f(b,"click",t[6])],v=!0)},p(t,e){2&e&&h(n,t[1]),1&e&&h(i,t[0]),4&e&&(p.disabled=t[2]),8&e&&(b.disabled=t[3])},d(t){t&&c(e),t&&c($),t&&c(p),t&&c(g),t&&c(b),v=!1,o(x)}}}function O(e){let n,o=e[4]&&N(e);return{c(){n=l("nav"),o&&o.c(),this.c=t},m(t,e){a(t,n,e),o&&o.m(n,null)},p(t,[e]){t[4]?o?o.p(t,e):(o=N(t),o.c(),o.m(n,null)):o&&(o.d(1),o=null)},i:t,o:t,d(t){t&&c(n),o&&o.d()}}}function P(t,e,n){let o,r,i,s,a,{details:c=null}=e,{total:l=null}=e,{offset:u=null}=e;const d=g();return t.$$set=t=>{"details"in t&&n(7,c=t.details),"total"in t&&n(8,l=t.total),"offset"in t&&n(9,u=t.offset)},t.$$.update=()=>{512&t.$$.dirty&&n(2,o=0===u?.value),256&t.$$.dirty&&n(0,r=Math.ceil(l?.value/20)),512&t.$$.dirty&&n(1,i=u?.value/20+1),3&t.$$.dirty&&n(3,s=r===i),129&t.$$.dirty&&n(4,a=r>1&&!c?.value)},[r,i,o,s,a,()=>d("onPageChange",{offset:u.value-20}),()=>d("onPageChange",{offset:u.value+20}),c,l,u]}"function"==typeof HTMLElement&&(H=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){const{on_mount:t}=this.$$;this.$$.on_disconnect=t.map(e).filter(r);for(const t in this.$$.slotted)this.appendChild(this.$$.slotted[t])}attributeChangedCallback(t,e,n){this[t]=n}disconnectedCallback(){o(this.$$.on_disconnect)}$destroy(){!function(t,e){const n=t.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}});class S extends H{constructor(t){super(),this.shadowRoot.innerHTML="<style>*{box-sizing:border-box}nav{display:flex;align-items:center;justify-content:flex-end;width:12rem}nav>*{animation:fadeIn 0.3s}span{margin-right:1rem;font-size:0.8rem}button{width:2.5rem;height:2.5rem;margin:0;padding:0;cursor:pointer;border-radius:50%;border:0;outline:none;background-color:#eee;transition:background-color linear 0.2s}button:not(:last-child){margin-right:0.5rem}button:hover,button:focus{background-color:#ddd}button:disabled{pointer-events:none}@keyframes fadeIn{0%{opacity:0}100%{opacity:1}}</style>",z(this,{target:this.shadowRoot,props:$(this.attributes),customElement:!0},P,O,i,{details:7,total:8,offset:9}),t&&(t.target&&a(t.target,this,t.anchor),t.props&&(this.$set(t.props),L()))}static get observedAttributes(){return["details","total","offset"]}get details(){return this.$$.ctx[7]}set details(t){this.$set({details:t}),L()}get total(){return this.$$.ctx[8]}set total(t){this.$set({total:t}),L()}get offset(){return this.$$.ctx[9]}set offset(t){this.$set({offset:t}),L()}}customElements.define("marvel-navigation",S);const A=new S;export default A;
//# sourceMappingURL=bundle.js.map

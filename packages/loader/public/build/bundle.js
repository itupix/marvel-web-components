function t(){}function e(t){return t()}function n(){return Object.create(null)}function o(t){t.forEach(e)}function r(t){return"function"==typeof t}function s(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function a(t,e,n){t.insertBefore(e,n||null)}function c(t){t.parentNode.removeChild(t)}function i(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function l(t){const e={};for(const n of t)e[n.name]=n.value;return e}let d;function u(t){d=t}const f=[],h=[],p=[],$=[],m=Promise.resolve();let g=!1;function b(t){p.push(t)}let x=!1;const y=new Set;function _(){if(!x){x=!0;do{for(let t=0;t<f.length;t+=1){const e=f[t];u(e),k(e.$$)}for(u(null),f.length=0;h.length;)h.pop()();for(let t=0;t<p.length;t+=1){const e=p[t];y.has(e)||(y.add(e),e())}p.length=0}while(f.length);for(;$.length;)$.pop()();g=!1,x=!1,y.clear()}}function k(t){if(null!==t.fragment){t.update(),o(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(b)}}const w=new Set;function E(t,e){-1===t.$$.dirty[0]&&(f.push(t),g||(g=!0,m.then(_)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function v(s,a,i,l,f,h,p=[-1]){const $=d;u(s);const m=s.$$={fragment:null,ctx:null,props:h,update:t,not_equal:f,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map($?$.$$.context:a.context||[]),callbacks:n(),dirty:p,skip_bound:!1};let g=!1;if(m.ctx=i?i(s,a.props||{},((t,e,...n)=>{const o=n.length?n[0]:e;return m.ctx&&f(m.ctx[t],m.ctx[t]=o)&&(!m.skip_bound&&m.bound[t]&&m.bound[t](o),g&&E(s,t)),e})):[],m.update(),g=!0,o(m.before_update),m.fragment=!!l&&l(m.ctx),a.target){if(a.hydrate){const t=function(t){return Array.from(t.childNodes)}(a.target);m.fragment&&m.fragment.l(t),t.forEach(c)}else m.fragment&&m.fragment.c();a.intro&&((x=s.$$.fragment)&&x.i&&(w.delete(x),x.i(y))),function(t,n,s,a){const{fragment:c,on_mount:i,on_destroy:l,after_update:d}=t.$$;c&&c.m(n,s),a||b((()=>{const n=i.map(e).filter(r);l?l.push(...n):o(n),t.$$.on_mount=[]})),d.forEach(b)}(s,a.target,a.anchor,a.customElement),_()}var x,y;u($)}let C;function A(e){let n,o,r;return{c(){var s,a;s="div",n=document.createElement(s),a="Chargement ...",o=document.createTextNode(a),this.c=t,i(n,"class",r="loader "+(e[0]?"loader--centered":""))},m(t,e){a(t,n,e),function(t,e){t.appendChild(e)}(n,o)},p(t,[e]){1&e&&r!==(r="loader "+(t[0]?"loader--centered":""))&&i(n,"class",r)},i:t,o:t,d(t){t&&c(n)}}}function M(t,e,n){let{centered:o}=e;return t.$$set=t=>{"centered"in t&&n(0,o=t.centered)},[o]}"function"==typeof HTMLElement&&(C=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){const{on_mount:t}=this.$$;this.$$.on_disconnect=t.map(e).filter(r);for(const t in this.$$.slotted)this.appendChild(this.$$.slotted[t])}attributeChangedCallback(t,e,n){this[t]=n}disconnectedCallback(){o(this.$$.on_disconnect)}$destroy(){!function(t,e){const n=t.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}});class T extends C{constructor(t){super(),this.shadowRoot.innerHTML="<style>.loader{width:100px;height:100px;text-align:center;line-height:100px;font-size:0.5rem;animation:fadeIn 0.3s}.loader:before,.loader:after{content:'';position:absolute;left:0;top:0;width:100%;height:100%;border-radius:50%;box-shadow:0 -5px 0 -1px #EC1D24;animation:rotate 1s infinite}.loader:before{box-shadow:0 -5px 0 -1px #EC1D24}.loader:after{box-shadow:0 5px 0 -1px #EC1D24}.loader:not(.loader--centered){position:relative}.loader--centered{position:absolute;left:50%;top:50%;transform:translateX(-50%) translateY(-50%)}@keyframes fadeIn{0%{opacity:0}100%{opacity:1}}@keyframes rotate{0%{transform:rotateZ(0)}100%{transform:rotate(360deg)}}</style>",v(this,{target:this.shadowRoot,props:l(this.attributes),customElement:!0},M,A,s,{centered:0}),t&&(t.target&&a(t.target,this,t.anchor),t.props&&(this.$set(t.props),_()))}static get observedAttributes(){return["centered"]}get centered(){return this.$$.ctx[0]}set centered(t){this.$set({centered:t}),_()}}customElements.define("marvel-loader",T);const j=new T;export default j;
//# sourceMappingURL=bundle.js.map
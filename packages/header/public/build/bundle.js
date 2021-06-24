
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
function noop$1() { }
function add_location$1(element, file, line, column, char) {
    element.__svelte_meta = {
        loc: { file, line, column, char }
    };
}
function run$1(fn) {
    return fn();
}
function blank_object$1() {
    return Object.create(null);
}
function run_all$1(fns) {
    fns.forEach(run$1);
}
function is_function$1(thing) {
    return typeof thing === 'function';
}
function safe_not_equal$1(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function is_empty$1(obj) {
    return Object.keys(obj).length === 0;
}

function append$1(target, node) {
    target.appendChild(node);
}
function insert$1(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach$1(node) {
    node.parentNode.removeChild(node);
}
function element$1(name) {
    return document.createElement(name);
}
function text$1(data) {
    return document.createTextNode(data);
}
function space$1() {
    return text$1(' ');
}
function listen$1(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function children$1(element) {
    return Array.from(element.childNodes);
}
function custom_event$1(type, detail) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, false, false, detail);
    return e;
}
function attribute_to_object$1(attributes) {
    const result = {};
    for (const attribute of attributes) {
        result[attribute.name] = attribute.value;
    }
    return result;
}

let current_component$1;
function set_current_component$1(component) {
    current_component$1 = component;
}
function get_current_component$1() {
    if (!current_component$1)
        throw new Error('Function called outside component initialization');
    return current_component$1;
}
function onMount(fn) {
    get_current_component$1().$$.on_mount.push(fn);
}
function afterUpdate(fn) {
    get_current_component$1().$$.after_update.push(fn);
}
function createEventDispatcher$1() {
    const component = get_current_component$1();
    return (type, detail) => {
        const callbacks = component.$$.callbacks[type];
        if (callbacks) {
            // TODO are there situations where events could be dispatched
            // in a server (non-DOM) environment?
            const event = custom_event$1(type, detail);
            callbacks.slice().forEach(fn => {
                fn.call(component, event);
            });
        }
    };
}

const dirty_components$1 = [];
const binding_callbacks$1 = [];
const render_callbacks$1 = [];
const flush_callbacks$1 = [];
const resolved_promise$1 = Promise.resolve();
let update_scheduled$1 = false;
function schedule_update$1() {
    if (!update_scheduled$1) {
        update_scheduled$1 = true;
        resolved_promise$1.then(flush$1);
    }
}
function add_render_callback$1(fn) {
    render_callbacks$1.push(fn);
}
let flushing$1 = false;
const seen_callbacks$1 = new Set();
function flush$1() {
    if (flushing$1)
        return;
    flushing$1 = true;
    do {
        // first, call beforeUpdate functions
        // and update components
        for (let i = 0; i < dirty_components$1.length; i += 1) {
            const component = dirty_components$1[i];
            set_current_component$1(component);
            update$1(component.$$);
        }
        set_current_component$1(null);
        dirty_components$1.length = 0;
        while (binding_callbacks$1.length)
            binding_callbacks$1.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks$1.length; i += 1) {
            const callback = render_callbacks$1[i];
            if (!seen_callbacks$1.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks$1.add(callback);
                callback();
            }
        }
        render_callbacks$1.length = 0;
    } while (dirty_components$1.length);
    while (flush_callbacks$1.length) {
        flush_callbacks$1.pop()();
    }
    update_scheduled$1 = false;
    flushing$1 = false;
    seen_callbacks$1.clear();
}
function update$1($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all$1($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback$1);
    }
}
const outroing$1 = new Set();
function transition_in$1(block, local) {
    if (block && block.i) {
        outroing$1.delete(block);
        block.i(local);
    }
}
function mount_component$1(component, target, anchor, customElement) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
        // onMount happens before the initial afterUpdate
        add_render_callback$1(() => {
            const new_on_destroy = on_mount.map(run$1).filter(is_function$1);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all$1(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
    }
    after_update.forEach(add_render_callback$1);
}
function destroy_component$1(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all$1($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty$1(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components$1.push(component);
        schedule_update$1();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init$1(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
    const parent_component = current_component$1;
    set_current_component$1(component);
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props,
        update: noop$1,
        not_equal,
        bound: blank_object$1(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        on_disconnect: [],
        before_update: [],
        after_update: [],
        context: new Map(parent_component ? parent_component.$$.context : options.context || []),
        // everything else
        callbacks: blank_object$1(),
        dirty,
        skip_bound: false
    };
    let ready = false;
    $$.ctx = instance
        ? instance(component, options.props || {}, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if (!$$.skip_bound && $$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty$1(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all$1($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            const nodes = children$1(options.target);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach$1);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in$1(component.$$.fragment);
        mount_component$1(component, options.target, options.anchor, options.customElement);
        flush$1();
    }
    set_current_component$1(parent_component);
}
let SvelteElement$1;
if (typeof HTMLElement === 'function') {
    SvelteElement$1 = class extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
        }
        connectedCallback() {
            const { on_mount } = this.$$;
            this.$$.on_disconnect = on_mount.map(run$1).filter(is_function$1);
            // @ts-ignore todo: improve typings
            for (const key in this.$$.slotted) {
                // @ts-ignore todo: improve typings
                this.appendChild(this.$$.slotted[key]);
            }
        }
        attributeChangedCallback(attr, _oldValue, newValue) {
            this[attr] = newValue;
        }
        disconnectedCallback() {
            run_all$1(this.$$.on_disconnect);
        }
        $destroy() {
            destroy_component$1(this, 1);
            this.$destroy = noop$1;
        }
        $on(type, callback) {
            // TODO should this delegate to addEventListener?
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty$1($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    };
}

function dispatch_dev$1(type, detail) {
    document.dispatchEvent(custom_event$1(type, Object.assign({ version: '3.37.0' }, detail)));
}
function append_dev$1(target, node) {
    dispatch_dev$1('SvelteDOMInsert', { target, node });
    append$1(target, node);
}
function insert_dev$1(target, node, anchor) {
    dispatch_dev$1('SvelteDOMInsert', { target, node, anchor });
    insert$1(target, node, anchor);
}
function detach_dev$1(node) {
    dispatch_dev$1('SvelteDOMRemove', { node });
    detach$1(node);
}
function listen_dev$1(node, event, handler, options, has_prevent_default, has_stop_propagation) {
    const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
    if (has_prevent_default)
        modifiers.push('preventDefault');
    if (has_stop_propagation)
        modifiers.push('stopPropagation');
    dispatch_dev$1('SvelteDOMAddEventListener', { node, event, handler, modifiers });
    const dispose = listen$1(node, event, handler, options);
    return () => {
        dispatch_dev$1('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
        dispose();
    };
}
function attr_dev(node, attribute, value) {
    attr(node, attribute, value);
    if (value == null)
        dispatch_dev$1('SvelteDOMRemoveAttribute', { node, attribute });
    else
        dispatch_dev$1('SvelteDOMSetAttribute', { node, attribute, value });
}
function prop_dev$1(node, property, value) {
    node[property] = value;
    dispatch_dev$1('SvelteDOMSetProperty', { node, property, value });
}
function validate_slots$1(name, slot, keys) {
    for (const slot_key of Object.keys(slot)) {
        if (!~keys.indexOf(slot_key)) {
            console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
        }
    }
}

(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35730/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r); })(window.document);
function noop() { }
function add_location(element, file, line, column, char) {
    element.__svelte_meta = {
        loc: { file, line, column, char }
    };
}
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function is_empty(obj) {
    return Object.keys(obj).length === 0;
}

function append(target, node) {
    target.appendChild(node);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function element(name) {
    return document.createElement(name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function children(element) {
    return Array.from(element.childNodes);
}
function custom_event(type, detail) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, false, false, detail);
    return e;
}
function attribute_to_object(attributes) {
    const result = {};
    for (const attribute of attributes) {
        result[attribute.name] = attribute.value;
    }
    return result;
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error('Function called outside component initialization');
    return current_component;
}
function createEventDispatcher() {
    const component = get_current_component();
    return (type, detail) => {
        const callbacks = component.$$.callbacks[type];
        if (callbacks) {
            // TODO are there situations where events could be dispatched
            // in a server (non-DOM) environment?
            const event = custom_event(type, detail);
            callbacks.slice().forEach(fn => {
                fn.call(component, event);
            });
        }
    };
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
let flushing = false;
const seen_callbacks = new Set();
function flush() {
    if (flushing)
        return;
    flushing = true;
    do {
        // first, call beforeUpdate functions
        // and update components
        for (let i = 0; i < dirty_components.length; i += 1) {
            const component = dirty_components[i];
            set_current_component(component);
            update(component.$$);
        }
        set_current_component(null);
        dirty_components.length = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    flushing = false;
    seen_callbacks.clear();
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}
const outroing = new Set();
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function mount_component(component, target, anchor, customElement) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
    }
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        on_disconnect: [],
        before_update: [],
        after_update: [],
        context: new Map(parent_component ? parent_component.$$.context : options.context || []),
        // everything else
        callbacks: blank_object(),
        dirty,
        skip_bound: false
    };
    let ready = false;
    $$.ctx = instance
        ? instance(component, options.props || {}, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if (!$$.skip_bound && $$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            const nodes = children(options.target);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor, options.customElement);
        flush();
    }
    set_current_component(parent_component);
}
let SvelteElement;
if (typeof HTMLElement === 'function') {
    SvelteElement = class extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
        }
        connectedCallback() {
            const { on_mount } = this.$$;
            this.$$.on_disconnect = on_mount.map(run).filter(is_function);
            // @ts-ignore todo: improve typings
            for (const key in this.$$.slotted) {
                // @ts-ignore todo: improve typings
                this.appendChild(this.$$.slotted[key]);
            }
        }
        attributeChangedCallback(attr, _oldValue, newValue) {
            this[attr] = newValue;
        }
        disconnectedCallback() {
            run_all(this.$$.on_disconnect);
        }
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            // TODO should this delegate to addEventListener?
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    };
}

function dispatch_dev(type, detail) {
    document.dispatchEvent(custom_event(type, Object.assign({ version: '3.37.0' }, detail)));
}
function append_dev(target, node) {
    dispatch_dev('SvelteDOMInsert', { target, node });
    append(target, node);
}
function insert_dev(target, node, anchor) {
    dispatch_dev('SvelteDOMInsert', { target, node, anchor });
    insert(target, node, anchor);
}
function detach_dev(node) {
    dispatch_dev('SvelteDOMRemove', { node });
    detach(node);
}
function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
    const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
    if (has_prevent_default)
        modifiers.push('preventDefault');
    if (has_stop_propagation)
        modifiers.push('stopPropagation');
    dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
    const dispose = listen(node, event, handler, options);
    return () => {
        dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
        dispose();
    };
}
function prop_dev(node, property, value) {
    node[property] = value;
    dispatch_dev('SvelteDOMSetProperty', { node, property, value });
}
function set_data_dev(text, data) {
    data = '' + data;
    if (text.wholeText === data)
        return;
    dispatch_dev('SvelteDOMSetData', { node: text, data });
    text.data = data;
}
function validate_slots(name, slot, keys) {
    for (const slot_key of Object.keys(slot)) {
        if (!~keys.indexOf(slot_key)) {
            console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
        }
    }
}

/* src/Navigation.svelte generated by Svelte v3.37.0 */
const file$1 = "src/Navigation.svelte";

// (22:2) {#if isVisible }
function create_if_block(ctx) {
	let span;
	let t0;
	let t1;
	let t2;
	let t3;
	let button0;
	let t4;
	let t5;
	let button1;
	let t6;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			span = element("span");
			t0 = text(/*currentPage*/ ctx[1]);
			t1 = text(" / ");
			t2 = text(/*numberOfPages*/ ctx[0]);
			t3 = space();
			button0 = element("button");
			t4 = text("❮");
			t5 = space();
			button1 = element("button");
			t6 = text("❯");
			add_location(span, file$1, 22, 4, 678);
			button0.disabled = /*isFirst*/ ctx[2];
			add_location(button0, file$1, 23, 4, 727);
			button1.disabled = /*isLast*/ ctx[3];
			add_location(button1, file$1, 24, 4, 790);
		},
		m: function mount(target, anchor) {
			insert_dev(target, span, anchor);
			append_dev(span, t0);
			append_dev(span, t1);
			append_dev(span, t2);
			insert_dev(target, t3, anchor);
			insert_dev(target, button0, anchor);
			append_dev(button0, t4);
			insert_dev(target, t5, anchor);
			insert_dev(target, button1, anchor);
			append_dev(button1, t6);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", /*decrement*/ ctx[5], false, false, false),
					listen_dev(button1, "click", /*increment*/ ctx[6], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*currentPage*/ 2) set_data_dev(t0, /*currentPage*/ ctx[1]);
			if (dirty & /*numberOfPages*/ 1) set_data_dev(t2, /*numberOfPages*/ ctx[0]);

			if (dirty & /*isFirst*/ 4) {
				prop_dev(button0, "disabled", /*isFirst*/ ctx[2]);
			}

			if (dirty & /*isLast*/ 8) {
				prop_dev(button1, "disabled", /*isLast*/ ctx[3]);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(span);
			if (detaching) detach_dev(t3);
			if (detaching) detach_dev(button0);
			if (detaching) detach_dev(t5);
			if (detaching) detach_dev(button1);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(22:2) {#if isVisible }",
		ctx
	});

	return block;
}

function create_fragment$1(ctx) {
	let nav;
	let if_block = /*isVisible*/ ctx[4] && create_if_block(ctx);

	const block = {
		c: function create() {
			nav = element("nav");
			if (if_block) if_block.c();
			this.c = noop;
			add_location(nav, file$1, 20, 0, 649);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, nav, anchor);
			if (if_block) if_block.m(nav, null);
		},
		p: function update(ctx, [dirty]) {
			if (/*isVisible*/ ctx[4]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block(ctx);
					if_block.c();
					if_block.m(nav, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(nav);
			if (if_block) if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$1.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$1($$self, $$props, $$invalidate) {
	let isFirst;
	let numberOfPages;
	let currentPage;
	let isLast;
	let isVisible;
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("marvel-navigation", slots, []);
	let { details = null } = $$props;
	let { total = null } = $$props;
	let { offset = null } = $$props;
	const dispatch = createEventDispatcher();
	const decrement = () => dispatch("onPageChange", { offset: offset.value - 20 });
	const increment = () => dispatch("onPageChange", { offset: offset.value + 20 });
	const writable_props = ["details", "total", "offset"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<marvel-navigation> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ("details" in $$props) $$invalidate(7, details = $$props.details);
		if ("total" in $$props) $$invalidate(8, total = $$props.total);
		if ("offset" in $$props) $$invalidate(9, offset = $$props.offset);
	};

	$$self.$capture_state = () => ({
		createEventDispatcher,
		details,
		total,
		offset,
		dispatch,
		decrement,
		increment,
		isFirst,
		numberOfPages,
		currentPage,
		isLast,
		isVisible
	});

	$$self.$inject_state = $$props => {
		if ("details" in $$props) $$invalidate(7, details = $$props.details);
		if ("total" in $$props) $$invalidate(8, total = $$props.total);
		if ("offset" in $$props) $$invalidate(9, offset = $$props.offset);
		if ("isFirst" in $$props) $$invalidate(2, isFirst = $$props.isFirst);
		if ("numberOfPages" in $$props) $$invalidate(0, numberOfPages = $$props.numberOfPages);
		if ("currentPage" in $$props) $$invalidate(1, currentPage = $$props.currentPage);
		if ("isLast" in $$props) $$invalidate(3, isLast = $$props.isLast);
		if ("isVisible" in $$props) $$invalidate(4, isVisible = $$props.isVisible);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*offset*/ 512) {
			$$invalidate(2, isFirst = offset?.value === 0);
		}

		if ($$self.$$.dirty & /*total*/ 256) {
			$$invalidate(0, numberOfPages = Math.ceil(total?.value / 20));
		}

		if ($$self.$$.dirty & /*offset*/ 512) {
			$$invalidate(1, currentPage = offset?.value / 20 + 1);
		}

		if ($$self.$$.dirty & /*numberOfPages, currentPage*/ 3) {
			$$invalidate(3, isLast = numberOfPages === currentPage);
		}

		if ($$self.$$.dirty & /*numberOfPages, details*/ 129) {
			$$invalidate(4, isVisible = numberOfPages > 1 && !details?.value);
		}
	};

	return [
		numberOfPages,
		currentPage,
		isFirst,
		isLast,
		isVisible,
		decrement,
		increment,
		details,
		total,
		offset
	];
}

class Navigation extends SvelteElement {
	constructor(options) {
		super();
		this.shadowRoot.innerHTML = `<style>*{box-sizing:border-box}nav{display:flex;align-items:center;justify-content:flex-end;width:12rem}nav>*{animation:fadeIn 0.3s}span{margin-right:1rem;font-size:0.8rem}button{width:2.5rem;height:2.5rem;margin:0;padding:0;cursor:pointer;border-radius:50%;border:0;outline:none;background-color:#eee;transition:background-color linear 0.2s}button:not(:last-child){margin-right:0.5rem}button:hover,button:focus{background-color:#ddd}button:disabled{pointer-events:none}@keyframes fadeIn{0%{opacity:0}100%{opacity:1}}</style>`;

		init(
			this,
			{
				target: this.shadowRoot,
				props: attribute_to_object(this.attributes),
				customElement: true
			},
			instance$1,
			create_fragment$1,
			safe_not_equal,
			{ details: 7, total: 8, offset: 9 }
		);

		if (options) {
			if (options.target) {
				insert_dev(options.target, this, options.anchor);
			}

			if (options.props) {
				this.$set(options.props);
				flush();
			}
		}
	}

	static get observedAttributes() {
		return ["details", "total", "offset"];
	}

	get details() {
		return this.$$.ctx[7];
	}

	set details(details) {
		this.$set({ details });
		flush();
	}

	get total() {
		return this.$$.ctx[8];
	}

	set total(total) {
		this.$set({ total });
		flush();
	}

	get offset() {
		return this.$$.ctx[9];
	}

	set offset(offset) {
		this.$set({ offset });
		flush();
	}
}

customElements.define("marvel-navigation", Navigation);

new Navigation();

/* src/Header.svelte generated by Svelte v3.37.0 */
const file = "src/Header.svelte";

function create_fragment(ctx) {
	let header;
	let h1;
	let t1;
	let form;
	let input0;
	let t2;
	let input1;
	let t3;
	let marvel_navigation;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			header = element$1("header");
			h1 = element$1("h1");
			h1.textContent = "MARVEL";
			t1 = space$1();
			form = element$1("form");
			input0 = element$1("input");
			t2 = space$1();
			input1 = element$1("input");
			t3 = space$1();
			marvel_navigation = element$1("marvel-navigation");
			this.c = noop$1;
			add_location$1(h1, file, 37, 1, 757);
			attr_dev(input0, "type", "text");
			input0.value = /*query*/ ctx[1];
			add_location$1(input0, file, 39, 3, 820);
			attr_dev(input1, "type", "submit");
			input1.value = "🔎";
			add_location$1(input1, file, 40, 3, 879);
			attr_dev(form, "class", "search");
			add_location$1(form, file, 38, 1, 774);
			add_location$1(marvel_navigation, file, 42, 1, 924);
			add_location$1(header, file, 36, 0, 747);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev$1(target, header, anchor);
			append_dev$1(header, h1);
			append_dev$1(header, t1);
			append_dev$1(header, form);
			append_dev$1(form, input0);
			append_dev$1(form, t2);
			append_dev$1(form, input1);
			append_dev$1(header, t3);
			append_dev$1(header, marvel_navigation);
			/*marvel_navigation_binding*/ ctx[7](marvel_navigation);

			if (!mounted) {
				dispose = [
					listen_dev$1(input0, "input", /*onChange*/ ctx[3], false, false, false),
					listen_dev$1(form, "submit", /*onSubmit*/ ctx[2], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*query*/ 2 && input0.value !== /*query*/ ctx[1]) {
				prop_dev$1(input0, "value", /*query*/ ctx[1]);
			}
		},
		i: noop$1,
		o: noop$1,
		d: function destroy(detaching) {
			if (detaching) detach_dev$1(header);
			/*marvel_navigation_binding*/ ctx[7](null);
			mounted = false;
			run_all$1(dispose);
		}
	};

	dispatch_dev$1("SvelteRegisterBlock", {
		block,
		id: create_fragment.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots$1("marvel-header", slots, []);
	let { details = null } = $$props;
	let { total = null } = $$props;
	let { offset = null } = $$props;
	const dispatch = createEventDispatcher$1();
	let navigation;
	let query = "";

	afterUpdate(() => {
		navigation.$set({ details, total, offset });
	});

	onMount(() => {
		navigation.$on("onPageChange", event => dispatch("onPageChange", { offset: event.detail.offset }));
	});

	const onSubmit = e => {
		dispatch("onSubmit", { query });
		e.preventDefault();
	};

	const onChange = e => {
		$$invalidate(1, query = e.target.value);
		dispatch("onChange", { query });
	};

	const writable_props = ["details", "total", "offset"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<marvel-header> was created with unknown prop '${key}'`);
	});

	function marvel_navigation_binding($$value) {
		binding_callbacks$1[$$value ? "unshift" : "push"](() => {
			navigation = $$value;
			$$invalidate(0, navigation);
		});
	}

	$$self.$$set = $$props => {
		if ("details" in $$props) $$invalidate(4, details = $$props.details);
		if ("total" in $$props) $$invalidate(5, total = $$props.total);
		if ("offset" in $$props) $$invalidate(6, offset = $$props.offset);
	};

	$$self.$capture_state = () => ({
		createEventDispatcher: createEventDispatcher$1,
		afterUpdate,
		onMount,
		details,
		total,
		offset,
		dispatch,
		navigation,
		query,
		onSubmit,
		onChange
	});

	$$self.$inject_state = $$props => {
		if ("details" in $$props) $$invalidate(4, details = $$props.details);
		if ("total" in $$props) $$invalidate(5, total = $$props.total);
		if ("offset" in $$props) $$invalidate(6, offset = $$props.offset);
		if ("navigation" in $$props) $$invalidate(0, navigation = $$props.navigation);
		if ("query" in $$props) $$invalidate(1, query = $$props.query);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		navigation,
		query,
		onSubmit,
		onChange,
		details,
		total,
		offset,
		marvel_navigation_binding
	];
}

class Header extends SvelteElement$1 {
	constructor(options) {
		super();
		this.shadowRoot.innerHTML = `<style>*{box-sizing:border-box}:host{position:sticky;top:0;z-index:1;flex:0 0 auto;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}header{display:grid;align-items:center;grid-template-columns:1fr 1fr 1fr;padding:1rem;background-color:rgba(255,255,255,0.8)}h1{justify-self:start;height:calc(2.5rem / 1.3);margin:0;font-size:1.3rem;letter-spacing:-0.2rem;color:#fff;background:#EC1D24;padding:0.05rem 0.3rem;display:inline-block;text-align:center;transform:scaleY(1.3);line-height:calc(2.5rem / 1.3)}.search{flex:0 1 20rem;position:relative;margin:0 0.5rem}input{-webkit-appearance:none;appearance:none;font-size:1rem;border:none;background-color:transparent;outline:none}[type=text]{width:100%;padding:0.5rem 3rem 0.5rem 1.25rem;border:1px solid #ccc;border-radius:1.25rem;height:2.5rem;border:0;background-color:#eee;transition:box-shadow linear 0.2s}[type=text]:focus{box-shadow:inset 0 0 0 4px #ddd}[type=submit]{position:absolute;top:1px;right:1px;width:calc(2.5rem - 2px);height:calc(2.5rem - 2px);cursor:pointer;border-radius:50%;transition:background-color linear 0.2s}[type=submit]:focus{background-color:#ddd}marvel-navigation{justify-self:end}</style>`;

		init$1(
			this,
			{
				target: this.shadowRoot,
				props: attribute_to_object$1(this.attributes),
				customElement: true
			},
			instance,
			create_fragment,
			safe_not_equal$1,
			{ details: 4, total: 5, offset: 6 }
		);

		if (options) {
			if (options.target) {
				insert_dev$1(options.target, this, options.anchor);
			}

			if (options.props) {
				this.$set(options.props);
				flush$1();
			}
		}
	}

	static get observedAttributes() {
		return ["details", "total", "offset"];
	}

	get details() {
		return this.$$.ctx[4];
	}

	set details(details) {
		this.$set({ details });
		flush$1();
	}

	get total() {
		return this.$$.ctx[5];
	}

	set total(total) {
		this.$set({ total });
		flush$1();
	}

	get offset() {
		return this.$$.ctx[6];
	}

	set offset(offset) {
		this.$set({ offset });
		flush$1();
	}
}

customElements.define("marvel-header", Header);

const app = new Header();

export default app;
//# sourceMappingURL=bundle.js.map

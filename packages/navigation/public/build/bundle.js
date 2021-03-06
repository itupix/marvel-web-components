
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35730/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
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
const file = "src/Navigation.svelte";

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
			t4 = text("???");
			t5 = space();
			button1 = element("button");
			t6 = text("???");
			add_location(span, file, 22, 4, 678);
			button0.disabled = /*isFirst*/ ctx[2];
			add_location(button0, file, 23, 4, 727);
			button1.disabled = /*isLast*/ ctx[3];
			add_location(button1, file, 24, 4, 790);
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

function create_fragment(ctx) {
	let nav;
	let if_block = /*isVisible*/ ctx[4] && create_if_block(ctx);

	const block = {
		c: function create() {
			nav = element("nav");
			if (if_block) if_block.c();
			this.c = noop;
			add_location(nav, file, 20, 0, 649);
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
		id: create_fragment.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance($$self, $$props, $$invalidate) {
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
			instance,
			create_fragment,
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

const app = new Navigation();

export default app;
//# sourceMappingURL=bundle.js.map

import { assign } from './util';
import { diff } from './diff/index';
import options from './options';
import { Fragment } from './create-element';

export function Component(props, context) {
	this.props = props;
	this.context = context;
}

Component.prototype.setState = function(update, callback) {
	let s;
	if (this._nextState != null && this._nextState !== this.state) {
		s = this._nextState;
	} else {
		s = this._nextState = assign({}, this.state);
	}

	if (typeof update == 'function') {
		update = update(assign({}, s), this.props);
	}

	if (update) {
		assign(s, update);
	}

	if (update == null) return;

	if (this._vnode) {
		if (callback) this._renderCallbacks.push(callback);
		enqueueRender(this);
	}
};

Component.prototype.render = Fragment;

export function getDomSibling(vnode, childIndex) {

	if (childIndex == null) {
		return vnode._parent
			? getDomSibling(vnode._parent, vnode._parent._children.indexOf(vnode) + 1)
			: null;
	}

	let sibling;
	for (; childIndex < vnode._children.length; childIndex++) {
		sibling = vnode._children[childIndex];

		if (sibling != null && sibling._dom != null) {
			return sibling._dom;
		}
	}

	return typeof vnode.type == 'function' ? getDomSibling(vnode) : null;
}

function renderComponent(component) {
	let vnode = component._vnode,
		parentDom = component._parentDom;

	if (parentDom) {
		const oldVNode = assign({}, vnode);
		oldVNode._original = vnode._original + 1;

		diff(
			parentDom,
			vnode,
			oldVNode,
			null
		);

	}
}


let rerenderQueue = [];

const defer =
	typeof Promise == 'function'
		? Promise.prototype.then.bind(Promise.resolve())
		: setTimeout;

let prevDebounce;

export function enqueueRender(c) {
	if (
		(!c._dirty &&
			(c._dirty = true) &&
			rerenderQueue.push(c) &&
			!process._rerenderCount++) ||
		prevDebounce !== options.debounceRendering
	) {
		prevDebounce = options.debounceRendering;
		(prevDebounce || defer)(process);
	}
}
function process() {
	let queue;
	while ((process._rerenderCount = rerenderQueue.length)) {
		queue = rerenderQueue.sort((a, b) => a._vnode._depth - b._vnode._depth);
		rerenderQueue = [];
		queue.some(c => {
			if (c._dirty) renderComponent(c);
		});
	}
}

process._rerenderCount = 0;

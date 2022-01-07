import { EMPTY_OBJ } from './constants';
import { commitRoot, diff } from './diff/index';
import { createElement, Fragment } from './create-element';

export function render(vnode, parentDom) {

	let oldVNode = parentDom._children;

	vnode = parentDom._children = createElement(Fragment, null, [vnode]);

	let commitQueue = [];

	debugger

	diff(
		parentDom,
		vnode,
		oldVNode || EMPTY_OBJ,
		EMPTY_OBJ,
		false,
		null,
		commitQueue,
		oldVNode
			? oldVNode._dom
			: parentDom.firstChild,
		false
	);

	commitRoot(commitQueue, vnode);
}
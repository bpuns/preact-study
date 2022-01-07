import { EMPTY_OBJ } from './constants';
import { diff } from './diff/index';
import { createElement, Fragment } from './create-element';

export function render(vnode, parentDom) {

	let oldVNode = parentDom._children;

	vnode = parentDom._children = createElement(Fragment, null, [vnode]);


	diff(
		parentDom,
		vnode,
		oldVNode || EMPTY_OBJ,
		oldVNode ? oldVNode._dom : null
	);

}
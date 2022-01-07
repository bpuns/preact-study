import { slice } from './util';
import options from './options';

let vnodeId = 0;

export function createElement(type, props, children) {
	let normalizedProps = {},
		key,
		ref,
		i;
	for (i in props) {
		if (i == 'key') key = props[i];
		else if (i == 'ref') ref = props[i];
		else normalizedProps[i] = props[i];
	}

	if (arguments.length > 2) {
		normalizedProps.children =
			arguments.length > 3 ? slice.call(arguments, 2) : children;
	}

	return createVNode(type, normalizedProps, key, ref, null);
}


export function createVNode(type, props, key, ref, original) {

	const vnode = {
		type,
		props,
		key,
		ref,
		_children: null,
		_parent: null,
		_dom: null,
		_nextDom: undefined,
		_component: null,
		constructor: undefined,
		_original: original == null ? ++vnodeId : original
	}

	return vnode;
}

export function Fragment(props) {
	return props.children;
}
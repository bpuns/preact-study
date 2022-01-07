import { Fragment } from './create-element';

export function Component(props) {
	this.props = props
}

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
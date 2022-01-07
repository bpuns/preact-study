import { diff, unmount } from './index';
import { createVNode, Fragment } from '../create-element';
import { EMPTY_OBJ, EMPTY_ARR } from '../constants';
import { getDomSibling } from '../component';

export function diffChildren(
	parentDom,
	renderResult,
	newParentVNode,
	oldParentVNode,
	oldDom
) {

	let i, j, oldVNode, childVNode, newDom, firstChildDom;

	let oldChildren = (oldParentVNode && oldParentVNode._children) || EMPTY_ARR;

	let oldChildrenLength = oldChildren.length;

	newParentVNode._children = [];
	for (i = 0; i < renderResult.length; i++) {
		childVNode = renderResult[i];

		if (childVNode == null || typeof childVNode == 'boolean') {
			childVNode = newParentVNode._children[i] = null;
		}
		else if (
			typeof childVNode == 'string' ||
			typeof childVNode == 'number' ||
			typeof childVNode == 'bigint'
		) {
			childVNode = newParentVNode._children[i] = createVNode(
				null,
				childVNode,
				null,
				null,
				childVNode
			);
		} else if (Array.isArray(childVNode)) {
			childVNode = newParentVNode._children[i] = createVNode(
				Fragment,
				{ children: childVNode },
				null,
				null,
				null
			);
		} else {
			childVNode = newParentVNode._children[i] = childVNode;
		}

		if (childVNode == null) {
			continue;
		}

		childVNode._parent = newParentVNode;
		childVNode._depth = newParentVNode._depth + 1;

		oldVNode = oldChildren[i];

		if (
			oldVNode === null ||
			(oldVNode &&
				childVNode.key == oldVNode.key &&
				childVNode.type === oldVNode.type)
		) {
			oldChildren[i] = undefined;
		} else {
			for (j = 0; j < oldChildrenLength; j++) {
				oldVNode = oldChildren[j];
				if (
					oldVNode &&
					childVNode.key == oldVNode.key &&
					childVNode.type === oldVNode.type
				) {
					oldChildren[j] = undefined;
					break;
				}
				oldVNode = null;
			}
		}

		oldVNode = oldVNode || EMPTY_OBJ;

		diff(
			parentDom,
			childVNode,
			oldVNode,
			oldDom
		);

		newDom = childVNode._dom;

		if (newDom != null) {
			if (firstChildDom == null) {
				firstChildDom = newDom;
			}

			oldDom = placeChild(
				parentDom,
				childVNode,
				oldVNode,
				oldChildren,
				newDom,
				oldDom
			);

			if (typeof newParentVNode.type == 'function') {
				newParentVNode._nextDom = oldDom;
			}
		} else if (
			oldDom &&
			oldVNode._dom == oldDom &&
			oldDom.parentNode != parentDom
		) {
			oldDom = getDomSibling(oldVNode);
		}
	}

	newParentVNode._dom = firstChildDom;

	for (i = oldChildrenLength; i--;) {
		if (oldChildren[i] != null) {
			if (
				typeof newParentVNode.type == 'function' &&
				oldChildren[i]._dom != null &&
				oldChildren[i]._dom == newParentVNode._nextDom
			) {
				newParentVNode._nextDom = getDomSibling(oldParentVNode, i + 1);
			}

			unmount(oldChildren[i], oldChildren[i]);
		}
	}

}

function placeChild(
	parentDom,
	childVNode,
	oldVNode,
	oldChildren,
	newDom,
	oldDom
) {

	let nextDom;
	if (childVNode._nextDom !== undefined) {
		
		nextDom = childVNode._nextDom;

		childVNode._nextDom = undefined;
	} else if (
		oldVNode == null ||
		newDom != oldDom ||
		newDom.parentNode == null
	) {
		outer: if (oldDom == null || oldDom.parentNode !== parentDom) {
			parentDom.appendChild(newDom);
			nextDom = null;
		} else {
			// `j<oldChildrenLength; j+=2` is an alternative to `j++<oldChildrenLength/2`
			for (
				let sibDom = oldDom, j = 0;
				(sibDom = sibDom.nextSibling) && j < oldChildren.length;
				j += 2
			) {
				if (sibDom == newDom) {
					break outer;
				}
			}
			parentDom.insertBefore(newDom, oldDom);
			nextDom = oldDom;
		}
	}

	if (nextDom !== undefined) {
		oldDom = nextDom;
	} else {
		oldDom = newDom.nextSibling;
	}

	return oldDom;
}

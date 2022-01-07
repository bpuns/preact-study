import { EMPTY_ARR } from "./constants";

export function assign(obj, props) {
	for (let i in props) obj[i] = props[i];
	return obj
}

export function removeNode(node) {
	let parentNode = node.parentNode;
	if (parentNode) parentNode.removeChild(node);
}

export const slice = EMPTY_ARR.slice;

import { EMPTY_OBJ } from '../constants'
import { diffChildren } from './children'
import { diffProps } from './props'

/**
 * 处理子节点
 * @param {*} parentDom        当前虚拟dom节点需要挂载在哪个真实dom下
 * @param {*} newParentVNode   新虚拟dom节点
 * @param {*} oldParentVNode   可复用的虚拟dom节点
 */
export function diff(
  parentDom,
  newVNode,
  oldVNode
) {

  debugger

  if (
    newVNode.props === oldVNode.props
  ) {
    newVNode._children = oldVNode._children;
    newVNode._dom = oldVNode._dom;
  } else {
    newVNode._dom = diffElementNodes(
      oldVNode._dom,
      newVNode,
      oldVNode
    )
  }

}

function diffElementNodes(
  dom,
  newVNode,
  oldVNode
) {
  let oldProps = oldVNode.props;
  let newProps = newVNode.props;
  let nodeType = newVNode.type;
  let i = 0;

  if (dom == null) {
    if (nodeType === null) {
      return document.createTextNode(newProps);
    }

    dom = document.createElement(nodeType);

  }

  if (nodeType === null) {
    if (oldProps !== newProps && dom.data !== newProps) {
      dom.data = newProps;
    }
  } else {

    oldProps = oldVNode.props || EMPTY_OBJ;

    diffProps(dom, newProps, oldProps);

    i = newVNode.props.children;

    diffChildren(
      dom,
      Array.isArray(i) ? i : [i],
      newVNode,
      oldVNode,
      // 如果旧节点存在子节点，那么就找到旧的第一个子节点(第一个存在_dom的子节点上)的真实dom元素
      oldVNode._children && getDomSibling(oldVNode, 0)
    )

  }

  return dom;
}

export function getDomSibling(vnode, childIndex) {

  let sibling
  for (; childIndex < vnode._children.length; childIndex++) {
    sibling = vnode._children[childIndex]
    if (sibling != null && sibling._dom != null) {
      return sibling._dom
    }
  }

}
import { EMPTY_OBJ } from './constants';
import { createElement, Fragment } from './create-element';
import { diff } from './diff'

export function render(vnode, parentDom) {

  // preact会把上一次渲染的虚拟dom节点绑定到 parentDom 上，方便diff
  let oldVNode = parentDom._children

  // 把现在的创建的虚拟dom节点包裹一层Fragment，并保存到 parentDom 上
  vnode = parentDom._children = createElement(Fragment, null, [vnode])

  let commitQueue = []

  diff(
    // parentDom
    parentDom,
    // newVNode
    vnode,
    // oldVNode
    oldVNode || EMPTY_OBJ,
    // globalContext
    EMPTY_OBJ,
    // isSvg
    false,
    // excessDomChildren 表示要移除的dom元素
    oldVNode
      ? null
      : parentDom.firstChild
        ? slice.call(parentDom.childNodes)
        : null,
    // commitQueue 
    commitQueue,
    // 原来旧容器下的第一个dom子节点
    oldVNode
      ? oldVNode._dom
      : parentDom.firstChild,
    // isHydrating
    false
  )

}
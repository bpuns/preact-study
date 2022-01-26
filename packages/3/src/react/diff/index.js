import { diffChildren } from './children'

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

  // 元素节点
  if (newVNode.type) {

    newVNode._dom = document.createElement(newVNode.type)
    // 为了方便查看，赋值className
    newVNode._dom.className = newVNode.props.className

    const children = newVNode?.props?.children

    if (children) {
      diffChildren(
        newVNode._dom,
        Array.isArray(children) ? children : [children],
        newVNode,
        oldVNode
      )
    }

  }
  // 文本节点
  else {
    newVNode._dom = document.createTextNode(newVNode.props)
  }

}
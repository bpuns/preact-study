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

  // 元素节点
  if (newVNode.type) {

    newVNode._dom = document.createElement(newVNode.type)

    diffProps(
      newVNode._dom,
      newVNode.props,
      oldVNode?.props || EMPTY_OBJ
    )

    const children = newVNode?.props?.children

    // 循环递归
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
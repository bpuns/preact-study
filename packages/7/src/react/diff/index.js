import { Component, Fragment } from '..'
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
  oldVNode,
  oldDom
) {

  // 取出当前虚拟dom节点的type，判断当前是 函数类组件 还是 原生组件
  const newType = newVNode.type

  // 如果传入的节点不是 null，undefined，boolean，数字，字符串，那么就不会转为虚拟dom
  // 每个虚拟dom中都有一个 constructor 的自定义属性，一开始为null，一般元素原型上都存在 constructor
  // 所以在这里判断 constructor , 如果不为空，说明当前节点不是合法的虚拟 dom 节点，不处理
  if (newVNode.constructor !== undefined) return null

  // 函数组件
  if (typeof newType == 'function') {

    // 保存函数组件的实例
    let c
    // 取出当前新虚拟dom的props
    let newProps = newVNode.props

    // 如果旧节点的 _component 存在（ _component 存储类组件的实例），说明实例化过，复用旧节点的实例
    if (oldVNode._component) {
      // 复用旧节点
      c = newVNode._component = oldVNode._component
      // 把 newProps 赋值给旧的实例上
      c.props = newProps
    }
    // 没有实例化过
    else {

      // 类组件
      if (newType.isReactComponent === Component.isReactComponent) {
        c = newVNode._component = new newType(newProps)
      }
      // 函数组件
      else {
        c = newVNode._component = new Component(newProps)
        c.render = newType 
      }

    }

    // 类实例上绑定当前的虚拟dom
    c._vnode = newVNode
    // 类实例上绑定当前组件的真实父节点dom指向
    c._parentDom = parentDom

    // 获取新的子节点虚拟dom
    let renderResult = c.render(newProps)

    renderResult = renderResult?.type === Fragment ? renderResult.props.children : renderResult

    // 当前节点基本处理完毕
    diffChildren(
      // 当前虚拟节点的父节点的真实dom元素
      parentDom,
      // 当前节点的子节点，如果不是数组，包裹成一个数组
      Array.isArray(renderResult) ? renderResult : [renderResult],
      // 当前的新虚拟dom节点
      newVNode,
      // 旧虚拟dom节点
      oldVNode,
      oldDom
    )

  }
  // 文本节点（可复用）
  else if (
    newVNode.props === oldVNode.props
  ) {
    newVNode._children = oldVNode._children;
    newVNode._dom = oldVNode._dom;
  }
  // 不可复用文本节点和元素节点
  else {
    // 等diffChildren执行完成之后再给 newVNode._dom 赋值，避免子节点把 newVNode._dom 重写了
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
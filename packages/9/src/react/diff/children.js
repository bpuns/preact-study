import { diff } from '.'
import { EMPTY_ARR, EMPTY_OBJ } from '../constants'
import { createVNode } from '../createElement'

/**
 * 处理子节点
 * @param {*} parentDom        子节点要挂载到哪个dom下
 * @param {*} newChildren      要处理的子节点
 * @param {*} newParentVNode   父虚拟dom节点
 * @param {*} oldParentVNode   旧的虚拟dom节点
 * @param {*} oldDom           oldDom
 * @param {*} commitQueue      存放diff完成之后需要执行的任务对象
 */
export function diffChildren(
  parentDom,
  newChildren,
  newParentVNode,
  oldParentVNode,
  oldDom,
  commitQueue
) {

  // 取到旧的虚拟dom的子节点
  let oldChildren = (oldParentVNode && oldParentVNode._children) || EMPTY_ARR

  let firstChildDom

  let oldChildrenLength = oldChildren.length

  // 1  给父节点赋值 _children， 用来存放合法的 children
  newParentVNode._children = []

  // 2  循环当前的子节点，处理子节点
  for (let i = 0; i < newChildren.length; i++) {
    // 2.1  取出当前的新节点
    let childVNode = newChildren[i]

    // 2.2  处理子节点
    // 如果是null，undefined和boolean类型
    if (childVNode == null || typeof childVNode == 'boolean') {
      childVNode = newParentVNode._children[i] = null
    }
    // 如果是数字，字符串，大整型的话，重新组合成一个新的虚拟dom节点
    else if (
      typeof childVNode == 'string' ||
      typeof childVNode == 'number' ||
      typeof childVNode == 'bigint'
    ) {
      childVNode = newParentVNode._children[i] = createVNode(
        null,
        childVNode,
        null,
        null
      )
    }
    // 剩余的虚拟dom直接赋值起来
    else {
      childVNode = newParentVNode._children[i] = childVNode
    }

    // 2.3  如果当前的子节点是null的话，直接跳过下面的代码
    if (childVNode == null) continue

    childVNode._parent = newParentVNode

    // 取旧节点，判断是否是同一个节点，为了之后diff
    let oldVNode = oldChildren[i]

    // 如果当前旧节点是 null 或者 两个节点的key，type一直，基本可以判断找到了
    if (
      oldVNode &&
      childVNode.key == oldVNode.key &&
      childVNode.type === oldVNode.type
    ) {
      // oldChildren 对应的位置清空
      oldChildren[i] = undefined
    }
    // 没找到，for循环查找
    else {

      for (let j = 0; j < oldChildrenLength; j++) {
        oldVNode = oldChildren[j]
        if (
          oldVNode &&
          childVNode.key == oldVNode.key &&
          childVNode.type === oldVNode.type
        ) {
          // 找到了，就break
          oldChildren[j] = undefined
          break
        }
        oldVNode = null
      }
    }

    // 2  循环递归
    diff(
      parentDom,
      childVNode,
      oldVNode || EMPTY_OBJ,
      oldDom,
      commitQueue
    )

    // diff后会在 虚拟dom 上挂载上一个 _dom 保存真实的dom元素，取出来，后面要用
    let newDom = childVNode._dom

    // 如果 newDom 存在
    if (newDom != null) {

      if (firstChildDom == null) {
        firstChildDom = newDom;
      }

      oldDom = placeChild(
        parentDom,
        oldVNode,
        newDom,
        oldDom,
        childVNode
      )

    }

  }

  // 把当前第一个子节点的真实dom指向父节点的 _dom
  // 如果当前父节点是真实dom的话，在 diff 中，会重新绑定 _dom
  // 如果不是真实dom的话，比如函数组件，那么函数组件的 _dom 就是自己的第一个子节点
  newParentVNode._dom = firstChildDom

  // 把没用过的子节点全部删除
  for (let i = oldChildrenLength; i--;) {
    oldChildren[i] && unmount(oldChildren[i], oldChildren[i])
  }

}

/**	
 * @param {*} parentDom    当前虚拟dom节点的《父节点》的真实dom
 * @param {*} oldVNode		 当前虚拟dom节点的《对应的旧的虚拟dom节点》
 * @param {*} newDom  		 当前虚拟dom节点的《真实dom指向》
 * @param {*} oldDom 			 当前父节点的第一个真实dom子节点
 * @returns 
 */
function placeChild(
  parentDom,
  oldVNode,
  newDom,
  oldDom,
  childVNode
) {

  // 解决函数组件重复处理的问题
  if (typeof childVNode.type === 'function') {
    return null
  } else if (
    // 旧的虚拟dom不存在
    oldVNode == null ||
    // 新的dom不等于旧的dom
    newDom != oldDom ||
    // 新的dom还没挂载到某个dom下
    newDom.parentNode == null
  ) {

    // 如果旧节点不存在，说明是第一次插入，直接appendChild到 parentDom 上
    if (oldDom == null) {
      parentDom.appendChild(newDom)
      return null;
    } else {

      let sibDom = oldDom

      while (sibDom = sibDom.nextSibling) {
        if (sibDom == newDom) {
          return newDom.nextSibling
        }
      }

      parentDom.insertBefore(newDom, oldDom)
      return oldDom
    }

  }

  return newDom.nextSibling

}

export function unmount(vnode) {

  if (vnode._dom != null) {
    vnode._dom = removeNode(vnode._dom)
  }

}

function removeNode(node) {
  let parentNode = node.parentNode;
  if (parentNode) parentNode.removeChild(node);
}
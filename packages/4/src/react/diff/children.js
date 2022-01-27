import { diff } from '.'
import { EMPTY_OBJ } from '../constants'
import { createVNode } from '../createElement'

/**
 * 处理子节点
 * @param {*} parentDom        子节点要挂载到哪个dom下
 * @param {*} newChildren      要处理的子节点
 * @param {*} newParentVNode   父虚拟dom节点
 * @param {*} oldParentVNode   旧的虚拟dom节点
 */
export function diffChildren(
  parentDom,
  newChildren,
  newParentVNode,
  oldParentVNode
) {

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
    // 如果是数字，字符串，大整型的话，重新组合从一个新的虚拟dom节点
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

    // 2.4  循环递归
    diff(
			parentDom,
			childVNode,
			EMPTY_OBJ
		)

    // 2.5  直接把diff完成之后的节点
    parentDom.appendChild(childVNode._dom)

  }

}
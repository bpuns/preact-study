import { diff } from './index'
import { EMPTY_ARR, EMPTY_OBJ } from '../constants'
import { createVNode, Fragment } from '../create-element'


export function diffChildren(
  parentDom,
  renderResult,
  newParentVNode,
  oldParentVNode,
  globalContext,
  isSvg,
  excessDomChildren,
  commitQueue,
  oldDom,
  isHydrating
) {

  // 定义一推变量
  let i, j, oldVNode, childVNode, newDom, firstChildDom, refs

  // 取出旧的虚拟 dom 的子节点，如果是第一次的话，取出来的就是空数组
  let oldChildren = (oldParentVNode && oldParentVNode._children) || EMPTY_ARR

  let oldChildrenLength = oldChildren.length

  // 给新虚拟 dom 节点绑定一个 _children 属性，方便后面进行存储节点
  newParentVNode._children = []

  //#region 遍历函数组件/类组件 render 出来的子节点
  for (i = 0; i < renderResult.length; i++) {
    childVNode = renderResult[i]

    //#region 先对当前的节点进行处理
    // 如果子节点是null，undefined，或者布尔类型，不显示
    if (childVNode == null || typeof childVNode == 'boolean') {
      childVNode = newParentVNode._children[i] = null
    }

    // 如果子节点是 string number 大整型，为了方便处理，封装成虚拟dom节点
    // 因为需要保存 创建的dom元素，基础类型无法保存
    else if (
      typeof childVNode == 'string' ||
      typeof childVNode == 'number' ||
      // eslint-disable-next-line valid-typeof
      typeof childVNode == 'bigint'
    ) {
      childVNode = newParentVNode._children[i] = createVNode(
        null,
        childVNode,
        null,
        null,
        childVNode
      )
    }

    // 如果当前子节点也是数组的话，包一层 Fragment
    else if (Array.isArray(childVNode)) {
      childVNode = newParentVNode._children[i] = createVNode(
        Fragment,
        { children: childVNode },
        null,
        null,
        null
      )
    }

    // 如果当前子节点 _depth 已经大于0，说明已经被使用过了
    else if (childVNode._depth > 0) {
      // VNode已经被使用，克隆它，在下面这种情况会发生
      //   const reuse = <div />
      //   <div>{reuse}<span />{reuse}</div>
      childVNode = newParentVNode._children[i] = createVNode(
        childVNode.type,
        childVNode.props,
        childVNode.key,
        null,
        childVNode._original
      )
    }

    // 没有特殊情况，直接赋值到 _children 上
    else {
      childVNode = newParentVNode._children[i] = childVNode;
    }
    //#endregion

    // 如果当前节点的值是null，不需要处理，跳过当前节点，处理下一个节点
    if (childVNode == null) {
      continue;
    }

    // 当前子节点上 挂载 父节点
    childVNode._parent = newParentVNode
    // 当前子节点 的 _depth 相对于父节点 +1
    childVNode._depth = newParentVNode._depth + 1

    //#region 取出旧节点对应的节点
    oldVNode = oldChildren[i]

    if (
      oldVNode === null ||
      (oldVNode &&
        childVNode.key == oldVNode.key &&
        childVNode.type === oldVNode.type)
    ) {
      // 当找到的时候，把旧节点对应的值删除
      oldChildren[i] = undefined;
    } else {
      // 一个个找
      for (j = 0; j < oldChildrenLength; j++) {
        oldVNode = oldChildren[j];
        if (
          oldVNode &&
          childVNode.key == oldVNode.key &&
          childVNode.type === oldVNode.type
        ) {
          // 当找到的时候，把旧节点对应的值删除
          oldChildren[j] = undefined
          break
        }
        oldVNode = null
      }
    }


    oldVNode = oldVNode || EMPTY_OBJ

    // 递归比较当前的节点
    diff(
      parentDom,
      childVNode,
      oldVNode,
      globalContext,
      isSvg,
      excessDomChildren,
      commitQueue,
      oldDom,
      isHydrating
    )
    //#endregion

    debugger

    // 取出来当前子节点的 _dom 
    newDom = childVNode._dom

    // 现在用不到，修改删除元素的时候用的（应该）
    if ((j = childVNode.ref) && oldVNode.ref != j) {
      debugger
    }

    // ------------ 收集依赖 ------------

    // 如果当前节点存在
    if (newDom != null) {
      // 如果 firstChildDom 为空，那么把当前的 newDom 赋值到 firstChildDom 上
      if (firstChildDom == null) {
        firstChildDom = newDom
      }

      if (
        typeof childVNode.type == 'function' &&
        childVNode._children === oldVNode._children
      ) {
        debugger
      } else {
        oldDom = placeChild(
          parentDom,
          childVNode,
          oldVNode,
          oldChildren,
          newDom,
          oldDom
        )
      }

      // 如果父节点是函数组件，那么把 oldDom 放到父节点的 _nextDom 上
      if (typeof newParentVNode.type == 'function') {
        newParentVNode._nextDom = oldDom
      }

    } else if (
      oldDom &&
      oldVNode._dom == oldDom &&
      oldDom.parentNode != parentDom
    ) {
      debugger
      oldDom = getDomSibling(oldVNode);
    }

  }
  //#endregion 循环完毕

  // 第一个子节点的真实dom赋值到 newParentVNode._dom 上
  newParentVNode._dom = firstChildDom

  // 因为上面匹配到了，直接把旧的对应节点设置为了 undefined
  // 把旧的虚拟dom下的子节点中，不等与 undefined 的元素删除
  for (i = oldChildrenLength; i--;) {
    if (oldChildren[i] != null) {
      debugger
      if (
        typeof newParentVNode.type == 'function' &&
        oldChildren[i]._dom != null &&
        oldChildren[i]._dom == newParentVNode._nextDom
      ) {
        debugger
      }

      unmount(oldChildren[i], oldChildren[i]);
    }
  }

  if (refs) {
    debugger
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
  let nextDom

  // 判断当前子节点 _nextDom 是否为空
  if (childVNode._nextDom !== undefined) {
    debugger
  }
  // 如果旧节点为空
  // 新旧dom不是同一个
  // 新dom节点的父节点不存在
  else if (
    oldVNode == null ||
    newDom != oldDom ||
    newDom.parentNode == null
  ) {
    // 旧节点不存在 或者 旧节点的父节点不等于现在的父节点，说明现在是新增节点
    outer: if (oldDom == null || oldDom.parentNode !== parentDom) {
      // 直接把当前的节点添加到 parentDom 上
      parentDom.appendChild(newDom)
      nextDom = null
    } else {
      debugger
    }
  }

  if (nextDom !== undefined) {
    oldDom = nextDom
  } else {
    oldDom = newDom.nextSibling
  }

  return oldDom

}
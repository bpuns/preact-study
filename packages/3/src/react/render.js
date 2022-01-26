import { EMPTY_OBJ } from './constants'
import { diffChildren } from './diff/children'

/**
 * render
 * @param {*} vnode      需要渲染到页面上的虚拟dom
 * @param {*} parentDom  需要渲染的容器
 */
export function render(newVnode, parentDom) {

  // 1  取出旧的虚拟dom，取不到，用空对象代替
  const oldVnode = parentDom._children || EMPTY_OBJ

  // 2  为了入口虚拟dom节点一致，所以包裹一层节点
  newVnode = parentDom._children = {
    props: {
      children: Array.isArray(newVnode) ? newVnode : [newVnode]
    },
    _dom: parentDom
  }

  // 3  开始处理子节点
  diffChildren(
    parentDom,
    newVnode.props.children,
    newVnode,
    oldVnode
  )

}
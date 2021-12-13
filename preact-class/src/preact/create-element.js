import { slice } from './util'
import options from './options'

// 虚拟dom的id
let vnodeId = 0

/** 创建虚拟dom
 * @param {*} type 
 * @param {*} props 
 * @param {*} children 
 */
export function createElement(type, props, children) {

  // 把props中的key，ref等属性取出来剩下的元素剩下的元素
  let normalizedProps = {},
    // 该组件的key
    key,
    // 该组件的ref指向
    ref,
    i

  // 把props中的key，ref等属性取出来剩下的元素
  for (i in props) {
    if (i == 'key') key = props[i]
    else if (i == 'ref') ref = props[i]
    else normalizedProps[i] = props[i]
  }

  if (arguments.length > 2) {
    normalizedProps.children =
      arguments.length > 3 ? slice.call(arguments, 2) : children
  }

  // 如果是函数或类组件，并存在defaultProps，normalizedProps中的值不存在
  // 就保存到normalizedProps中
  if (typeof type == 'function' && type.defaultProps != null) {
    for (i in type.defaultProps) {
      if (normalizedProps[i] === undefined) {
        normalizedProps[i] = type.defaultProps[i]
      }
    }
  }

  return createVNode(type, normalizedProps, key, ref, null)

}

/** 生成虚拟dom
 * @param {*} type 
 * @param {*} props 
 * @param {*} key 
 * @param {*} ref 
 * @param {*} original 
 * @returns 
 */
export function createVNode(type, props, key, ref, original) {
  const vnode = {
    /** 字符串 / 类 / 方法 */
    type,
    /** 当前节点的属性 */
    props,
    /** key */
    key,
    /** _dom / 类实例化 / 虚拟dom节点 */
    ref,
    /** 子节点 */
    _children: null,
    /** 父节点 */
    _parent: null,
    /** 保存页面上真实的dom节点指向 */
    _dom: null,
    /** 如果是函数组件或者类组件的话，保存组件的实例 */
    _component: null,
    /** 当前虚拟dom节点的id，暂时不知道干嘛用的 */
    _original: original == null ? ++vnodeId : original,
    /** 当未被使用时，这个值就是0，这个值是用来记录当前虚拟dom节点的深度 */
    _depth: 0,

    // 下面不知道干嘛用的
    _nextDom: undefined,
    _hydrating: null,
    constructor: undefined
  }

  if (original == null && options.vnode != null) {
    debugger
    options.vnode(vnode)
  }

  return vnode;
}

export function Fragment(props) {
  return props.children;
}
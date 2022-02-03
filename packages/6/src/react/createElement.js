import { slice } from './constants'

/**
 * React17 之前创建虚拟dom
 * @param {*} type 
 * @param {*} props 
 * @param {*} children 
 * @returns 
 */
export function createElement(type, props, children) {
  let key = null, ref = null, normalizedProps = {}, i

  for (i in props) {
    if (i == 'key') key = props[i];
    else if (i == 'ref') ref = props[i];
    else normalizedProps[i] = props[i];
  }

  if (arguments.length > 2) {
    normalizedProps.children =
      arguments.length > 3 ? slice.call(arguments, 2) : children
  }

  return createVNode(type, normalizedProps, key, ref)
}

/** 
 * React17 创建虚拟dom
 * @param {*} type 
 * @param {*} props 
 * @returns 
 */
export function jsx(type, props) {
  let key = null, ref = null, normalizedProps = {}, i

  for (i in props) {
    if (i === 'key') key = config[i]
    else if (i === 'ref') ref = config[i]
    else normalizedProps[i] = props[i]
  }

  return createVNode(type, normalizedProps, key, ref)
}

/**
 * 
 * @param {*} type 
 * @param {*} props 
 * @param {*} key 
 * @param {*} ref 
 * @returns 
 */
export function createVNode(type, props, key, ref) {
  return {
    type,
    props,
    key,
    ref,
    // 用来保存 props.children 中合法的转化后的子节点
    _children: null,
    // 保存当前节点的真实dom指向
    _dom: null,
    // 记录当前虚拟dom节点的父虚拟dom节点
    _parent: null,
    // 保存函数组件的实例
    _component: null,
    // 这个属性很关键
    // 如果传入的节点不是 null，undefined，boolean，数字，字符串，那么就不会转为虚拟dom
    // 每个虚拟dom中都有一个 constructor 的自定义属性，一开始为null，一般元素原型上都存在 constructor
    // 所以在这里判断 constructor , 如果不为空，说明当前节点不是合法的虚拟 dom 节点，不处理
    constructor: undefined
  }

}
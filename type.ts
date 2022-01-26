type ArrayType<T> = T | T[]

type LegalVNode = VNode | string | number | bigint | boolean | null | undefined

interface VNode {
  type: null | string | Function,
  props: Partial<{
    style: Partial<CSSStyleDeclaration>,
    className: string,
    onClick: Function,
    children: ArrayType<LegalVNode>
  }>,
  key: keyof any,
  _dom: HTMLElement,
  _parent: VNode,
  _component: any,
  constructor: null
}

/**
 * @param vnode      需要渲染到页面上的虚拟dom
 * @param parentDom  需要渲染的容器
 */
declare function render(vnode: VNode, parentDom: HTMLElement): void;

/**
 * @param parentDom       子节点要挂载到哪个dom下
 * @param newChildren     要处理的子节点
 * @param newParentVNode  新的父虚拟dom节点
 * @param oldParentVNode  旧的父虚拟dom节点
 */
declare function diffChildren(
  parentDom: HTMLElement,
  newChildren: Array<LegalVNode>,
  newParentVNode: VNode,
  oldParentVNode: VNode
): void;

/**
 * @param parentDom     当前节点需要挂在到哪个dom下
 * @param newVNode      新虚拟dom节点
 * @param oldVNode      可复用的虚拟dom节点
 */
declare function diff(
  parentDom: HTMLElement,
  newVNode: VNode,
  oldVNode: VNode
): void;
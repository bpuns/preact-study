import { Component } from '../component'
import { EMPTY_OBJ } from '../constants'
import { Fragment } from '../create-element'
import { assign } from '../util'
import { diffChildren } from './children'
import { diffProps } from './props'

export function diff(
  parentDom,
  newVNode,
  oldVNode,
  // 全局的上下文对象
  globalContext,
  isSvg,
  excessDomChildren,
  commitQueue,
  oldDom,
  isHydrating
) {

  // 判断当前diff节点的type
  let newType = newVNode.type
  let tmp

  outer: if (typeof newType == 'function') {

    let c, isNew, oldProps, oldState, snapshot, clearProcessingException
    // 取出当前新虚拟dom的props
    let newProps = newVNode.props

    // 如果 newType 是类组件的话，取出静态属性 contextType ，这上面保存需要注入的 context
    tmp = newType.contextType

    // 如果 newType.contextType 存在的话，从globalContext上取出对应的id
    // 看来在diff的时候，provider 会存在 globalContext 中，方便后面取
    let provider = tmp && globalContext[tmp._id]

    //《取出》当前类在构造的时候，要传入 constructor 中的 context
    let componentContext = tmp
      ? provider
        ? provider.props.value
        : tmp._defaultValue
      : globalContext

    // 如果旧节点的 _component 存在（ _component 存储类组件的实例），说明实例化过，复用旧节点的实例
    if (oldVNode._component) {
      c = newVNode._component = oldVNode._component
    }
    // 没有实例化，或者当前这个节点根本不是类组件
    else {
      // 判断当前是否是类组件
      if ('prototype' in newType && newType.prototype.render) {
        // 实例化
        newVNode._component = c = new newType(newProps, componentContext)
      }
      // 如果是函数组件，preact 中也会 new 实例化 Component 基类
      // 这样就能和类组件处理方式一致，有效节省代码
      else {
        newVNode._component = c = new Component(newProps, componentContext)
        // 重写构造函数，就是当前的 type 就是构造函数，方便在 c.render 中调用 newType
        c.constructor = newType
        // 重写 render 模仿类组件的 render 行为，就是把函数组件执行的结果返回
        c.render = doRender
      }

      // 发布订阅，
      // 如果当前存在内容提供者，把当前组件保存到内容提供者中，
      // 避免 shouldComponentUpdate 或 memo 阻止组件更新后，子孙组件也收不到更新
      if (provider) provider.sub(c)

      // 下面这两句话没有什么必要，因为上面实例化，已经把 props, context 保存到实例对象上去了
      c.props = newProps
      c.context = componentContext
      // 把全局的 context 也保存到实例上
      c._globalContext = globalContext

      // 如果实例对象上的 state 为 null，undefined，NaN, 0, -0, false, '' , 就会重写 state 为空对象
      if (!c.state) c.state = {}

      // 记录当前节点是脏组件（需要更新）
      isNew = c._dirty = true

      // 保存更新到页面上之后需要执行的一些回调
      c._renderCallbacks = []

    }

    // 下一次需要更新的state
    if (c._nextState == null) {
      c._nextState = c.state;
    }

    // 执行 getDerivedStateFromProps 生命周期
    if (newType.getDerivedStateFromProps != null) {
      // c._nextState 和 c.state 的 地址指向需要不同
      if (c._nextState == c.state) {
        c._nextState = assign({}, c._nextState)
      }
      // 把 getDerivedStateFromProps 的返回值 合并到 c._nextState 上
      assign(
        c._nextState,
        newType.getDerivedStateFromProps(newProps, c._nextState)
      )
    }

    // 如果第一次实例化的话，c.props 和 c.state 就是新的
    // 如果不是第一次实例化的话，c.props 和 c.state 就是旧的
    // 取出来，方便第n次时执行的时候，调用生命周期，进行新props和旧props比较
    oldProps = c.props
    oldState = c.state

    // 如果是新的组件的话，
    if (isNew) {
      // getDerivedStateFromProps 与 componentWillMount 互斥
      if (
        newType.getDerivedStateFromProps == null &&
        c.componentWillMount != null
      ) {
        // 执行component
        c.componentWillMount()
      }

      // 把 componentDidMount 放置到回调中
      if (c.componentDidMount != null) {
        c._renderCallbacks.push(c.componentDidMount)
      }
    }
    // 不是新组件
    else {
      // getDerivedStateFromProps 与 componentWillReceiveProps 互斥
      if (
        newType.getDerivedStateFromProps == null &&
        newProps !== oldProps &&
        c.componentWillReceiveProps != null
      ) {
        c.componentWillReceiveProps(newProps, componentContext)
      }

      // 判断是否需要继续往下diff
      if (
        // c._force 为 true 表示强制更新，就不需要继续判断了
        (!c._force &&
          // 判断 shouldComponentUpdate 返回值是否是false 
          c.shouldComponentUpdate != null &&
          c.shouldComponentUpdate(
            newProps,
            c._nextState,
            componentContext
          ) === false) ||
        newVNode._original === oldVNode._original
      ) {
        // 不需要更新，把新的props和state保存起来
        c.props = newProps
        c.state = c._nextState
        if (newVNode._original !== oldVNode._original) c._dirty = false
        c._vnode = newVNode
        newVNode._dom = oldVNode._dom
        newVNode._children = oldVNode._children
        newVNode._children.forEach(vnode => {
          if (vnode) vnode._parent = newVNode
        })
        // 把 _renderCallbacks 保存到 commitQueue 中
        if (c._renderCallbacks.length) {
          commitQueue.push(c)
        }

        break outer
      }

      // componentWillUpdate 生命周期
      if (c.componentWillUpdate != null) {
        c.componentWillUpdate(newProps, c._nextState, componentContext)
      }

      // componentDidUpdate 也放到 _renderCallbacks 中，等更新后执行
      if (c.componentDidUpdate != null) {
        c._renderCallbacks.push(() => {
          c.componentDidUpdate(oldProps, oldState, snapshot)
        })
      }

    }


    // componentWillUpdate 执行后，用不到 _nextState 和 newProps 的地方
    // 直接赋值到 state 和 props 上
    c.context = componentContext
    c.props = newProps
    c.state = c._nextState
    c._vnode = newVNode
    c._parentDom = parentDom
    c._dirty = false

    // 获取新的子节点虚拟dom组件
    tmp = c.render(c.props, c.state, c.context)

    // getSnapshotBeforeUpdate 必须是第二次更新+才会触发，因为这里面可能会触发dom操作
    // 下面这个应该是个bug
    if (!isNew && c.getSnapshotBeforeUpdate != null) {
      snapshot = c.getSnapshotBeforeUpdate(oldProps, oldState);
    }

    // 判断 render 返回值是否是 Fragment
    let isTopLevelFragment = tmp != null && tmp.type === Fragment && tmp.key == null
    // 如果返回值是 Fragment 的话，直接取 Fragment 的 children，否则直接取返回值
    let renderResult = isTopLevelFragment ? tmp.props.children : tmp

    // 当前节点基本处理完毕
    diffChildren(
      // 当前节点真实dom元素
      parentDom,
      // 当前节点的子节点，如果不是数组，包裹成一个数组
      Array.isArray(renderResult) ? renderResult : [renderResult],
      // 当前的新虚拟dom节点
      newVNode,
      // 旧虚拟dom节点
      oldVNode,
      // 全局上下文吧
      globalContext,
      // 是否是svg，现在不处理，是false
      isSvg,
      // null，不处理
      excessDomChildren,
      // 保存挂载到页面上的回调
      commitQueue,
      // 旧的dom节点
      oldDom,
      // false 
      isHydrating
    )


  }
  // 应该是处理文本节点的
  else if (
    excessDomChildren == null &&
    newVNode._original === oldVNode._original
  ) {
    debugger
    newVNode._children = oldVNode._children;
    newVNode._dom = oldVNode._dom;
  }
  // 真实 dom 节点
  else {
    newVNode._dom = diffElementNodes(
      oldVNode._dom,
      newVNode,
      oldVNode,
      globalContext,
      isSvg,
      excessDomChildren,
      commitQueue,
      isHydrating
    )
  }

}

/** diff 原生节点
 * @param {*} dom 
 * @param {*} newVNode 
 * @param {*} oldVNode 
 * @param {*} globalContext 
 * @param {*} isSvg 
 * @param {*} excessDomChildren 
 * @param {*} commitQueue 
 * @param {*} isHydrating 
 */
function diffElementNodes(
  dom,
  newVNode,
  oldVNode,
  globalContext,
  isSvg,
  excessDomChildren,
  commitQueue,
  isHydrating
) {

  // 取出旧的props
  let oldProps = oldVNode.props
  // 取出新的props
  let newProps = newVNode.props
  // 取出dom的类型
  let nodeType = newVNode.type

  let i = 0

  // 这里不处理svg
  if (nodeType === 'svg') isSvg = true

  // 看不懂
  if (excessDomChildren != null) {
    debugger
    for (; i < excessDomChildren.length; i++) {
      const child = excessDomChildren[i]
      if (
        child &&
        'setAttribute' in child === !!nodeType &&
        (nodeType ? child.localName === nodeType : child.nodeType === 3)
      ) {
        dom = child
        excessDomChildren[i] = null
        break
      }
    }
  }

  // 旧节点不存在，创建它
  if (dom == null) {
    // 如果是文本节点，使用 createTextNode 创建
    if (nodeType === null) {
      return document.createTextNode(newProps)
    }
    // 不处理svg，所以接下来全部看成普通元素
    else {
      dom = document.createElement(
        nodeType,
        newProps.is && newProps
      )
    }

    // 我们创建了一个新的父节点，所以以前连接的子节点都不能被重用
    excessDomChildren = null
    isHydrating = false

  }

  // 没看懂
  if (nodeType === null) {
    debugger
    if (oldProps !== newProps && (!isHydrating || dom.data !== newProps)) {
      dom.data = newProps;
    }
  }
  // nodeType 存在就会走这里
  else {
    // 如果excessDomChildren不为空，用当前元素的子元素重新填充它
    excessDomChildren = excessDomChildren && slice.call(dom.childNodes)

    // 取旧的 props
    oldProps = oldVNode.props || EMPTY_OBJ

    // 取出新旧html
    let oldHtml = oldProps.dangerouslySetInnerHTML
    let newHtml = newProps.dangerouslySetInnerHTML

    if (!isHydrating) {

      // 第一次渲染用不到
      if (excessDomChildren != null) {
        debugger
        oldProps = {};
        for (i = 0; i < dom.attributes.length; i++) {
          oldProps[dom.attributes[i].name] = dom.attributes[i].value;
        }
      }

      // 设置 innerHTML
      if (newHtml || oldHtml) {
        if (
          !newHtml ||
          ((!oldHtml || newHtml.__html != oldHtml.__html) &&
            newHtml.__html !== dom.innerHTML)
        ) {
          dom.innerHTML = (newHtml && newHtml.__html) || '';
        }
      }

    }

    // 设置属性
    diffProps(dom, newProps, oldProps, isSvg, isHydrating)

    // 如果 props 中存在 dangerouslySetInnerHTML, 那么抛弃所有子children 
    if (newHtml) {
      newVNode._children = []
    } else {
      // 取出新的虚拟dom节点的子节点
      i = newVNode.props.children

      // 继续递归子节点
      diffChildren(
        dom,
        Array.isArray(i) ? i : [i],
        newVNode,
        oldVNode,
        globalContext,
        false,
        excessDomChildren,
        commitQueue,
        excessDomChildren
          ? excessDomChildren[0]
          : oldVNode._children && getDomSibling(oldVNode, 0),
        isHydrating
      )

      // 删除子节点
      if (excessDomChildren != null) {
        debugger
        for (i = excessDomChildren.length; i--;) {
          if (excessDomChildren[i] != null) removeNode(excessDomChildren[i]);
        }
      }

    }

    // 设置属性
    if (!isHydrating) {
      if (
        'value' in newProps &&
        (i = newProps.value) !== undefined &&
        (i !== oldProps.value ||
          i !== dom.value ||
          (nodeType === 'progress' && !i))
      ) {
        setProperty(dom, 'value', i, oldProps.value, false);
      }
      if (
        'checked' in newProps &&
        (i = newProps.checked) !== undefined &&
        i !== dom.checked
      ) {
        setProperty(dom, 'checked', i, oldProps.checked, false);
      }
    }

  }

  return dom

}

/** 函数组件模仿类组件的 render 行为
 * @param {*} props 
 * @param {*} _ 
 * @param {*} context 
 * @returns 
 */
function doRender(props, _, context) {
  return this.constructor(props, context);
}
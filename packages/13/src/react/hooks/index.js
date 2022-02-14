import { createElement, PureComponent } from '..'
import { options } from '../constants'

// 记录hooks顺序
let hooksIndex = 0
// Component实例
let currentComponent = null
// 存储所有useEffect待执行的函数
let diffedQueue = []
// 存储所有useEffect cleanUp待执行的函数
let unmountedQueue = []

options._render = vnode => {
  // 保存实例
  currentComponent = vnode._component
  // 重置索引
  hooksIndex = 0
}

options._commit = commitQueue => {
  commitQueue.forEach(component => {
    component._renderCallbacks.forEach(invokeCleanup)
    // 过滤_renderCallbacks
    component._renderCallbacks = component._renderCallbacks.filter(v => {
      v._effect ? invokeEffect(v) : true
    })
  })
}

options._unmount = vnode => {
  const hooks = vnode?._component?.__hooks
  hooks && hooks._list.forEach(
    // hookState => invokeCleanup(hookState)
    hookState => hookState._isUseEffect || invokeCleanup(hookState)
  )
}

options._diffed = component => {
  const hooks = component?.__hooks
  if (hooks?._pendingEffects?.length) {
    !diffedQueue.length && setTimeout(invokeDiffedQueue)
    diffedQueue.push(hooks)
  }
  currentComponent = null
}

options._unmounted = vnode => {
  const hooks = vnode?._component?.__hooks
  if (hooks) {
    !unmountedQueue.length && setTimeout(invokeUnmountedQueue)
    unmountedQueue.push(hooks)
  }
}

function invokeDiffedQueue() {
  diffedQueue.forEach(hooks => {
    hooks._pendingEffects.forEach(invokeCleanup)
    hooks._pendingEffects.forEach(invokeEffect)
    hooks._pendingEffects = []
  })
  diffedQueue = []
}

function invokeUnmountedQueue() {
  unmountedQueue.forEach(hooks => {
    hooks._list.forEach(invokeCleanup)
  })
  unmountedQueue = []
}

function invokeCleanup(hookState) {
  if (hookState._cleanup) {
    hookState._cleanup()
    hookState._cleanup = undefined
  }
}

function invokeEffect(hookState) {
  hookState._cleanup = hookState._effect()
}

function getHookState() {

  const index = hooksIndex++

  // 获取当前实例上的 __hooks
  const hooks = currentComponent.__hooks || (
    currentComponent.__hooks = {
      // 用来保存当前函数组件上每个hooks（按顺序）需要的数据
      _list: [],
      // 存储 useEffect 或 useLayoutEffect 需要的数据
      _pendingEffects: []
    }
  )

  // 返回对应位置的hooks
  return hooks._list[index] || (hooks._list[index] = {})

}

function argsChanged(oldInputs, newInputs) {

  return (
    // 如果旧不存在，肯定需要重新渲染
    !oldInputs ||
    // 如果新旧依赖长度不一致，肯定需要重新渲染
    oldInputs.length !== newInputs.length ||
    // 只要有一个地址不一致，肯定需要重新渲染
    newInputs.some((arg, index) => arg !== oldInputs[index])
  )

}

const _reducer = (_, newState) => newState

export function useMemo(factory, inputs) {
  // 获取对应顺序上的hooks存储的数据
  const hookState = getHookState()

  // 判断依赖是否发生变化
  if (argsChanged(hookState._inputs, inputs)) {
    // 获取返回值
    hookState._value = factory()
    // 保存依赖，方便下次比较
    hookState._inputs = inputs
  }

  return hookState._value
}

export function useCallback(callback, inputs) {
  return useMemo(() => callback, inputs)
}

export function useRef(initialValue) {
  return useMemo(() => { current: initialValue }, [])
}

export function useReducer(reducer, initialState, init) {

  const hookState = getHookState()
  hookState._reducer = reducer

  if (!hookState._component) {

    hookState._value = [
      init ? init(initialState) : initialState,
      action => {
        const nextValue = hookState._reducer(hookState._value[0], action)
        if (hookState._value[0] !== nextValue) {
          hookState._value = [nextValue, hookState._value[1]]
          // 直接调用 setState 调用更新
          hookState._component.setState({})
        }
      }
    ]

    hookState._component = currentComponent
  }

  return hookState._value
}

export function useState(initialState) {
  return useReducer(_reducer, initialState)
}

export function useContext(context) {

  const hookState = getHookState()

  const provider = currentComponent._globalContext[context._id]

  // 判断是否已经订阅过了
  if (!hookState._isSub) {
    provider.sub(currentComponent)
    hookState._isSub = true
  }

  return provider.props.value

}

export function useLayoutEffect(effect, inputs) {

  const hookState = getHookState()

  if (argsChanged(hookState._inputs, inputs)) {
    hookState._effect = effect
    hookState._inputs = inputs
    currentComponent._renderCallbacks.push(hookState)
  }

}

export function useEffect(effect, inputs) {

  const hookState = getHookState()

  if (argsChanged(hookState._inputs, inputs)) {
    hookState._effect = effect
    hookState._inputs = inputs
    hookState._isUseEffect = true
    currentComponent.__hooks._pendingEffects.push(hookState)
  }

}

export function memo(component, comparer) {

  return class extends PureComponent {

    constructor() {
      super(...arguments)
      if (typeof comparer === 'function') {
        this.shouldComponentUpdate = comparer.bind(this)
      }
    }

    render() {
      return createElement(component, this.props)
    }

  }

}
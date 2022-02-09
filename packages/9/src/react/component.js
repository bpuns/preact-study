import { commitRoot, diff } from "./diff"

export function Component(props) {
  this.props = props
}

/** setState
 * @param {*} update      更新的内容  对象 | 函数
 * @param {*} callback 
 */
Component.prototype.setState = function (update, callback) {

  const type = typeof update

  // 排除不合法的 setState
  if (!update || (type !== 'object' && type !== 'function')) return

  // 保存一个 _nextState，用来存储 state 的下一个 版本
  if (!this._nextState || this._nextState === this.state) {
    this._nextState = { ...this.state }
  }

  if (type === 'function') {
    update = update(this._nextState, this.props)
    // 如果update返回不是合法对象，不处理
    if (!update || typeof update !== 'object') return
  }

  // 合并更新到 _nextState 上
  this._nextState = Object.assign(this._nextState, update)

  if (this._vnode) {
    // 添加回调
    if (callback && typeof callback === 'function') {
      this._renderCallbacks.push(callback)
    }
    // 把当前实例推送到更新队列中
    enqueueRender(this)
  }

}

/** 强制更新
 * @param {*} callback 
 */
Component.prototype.forceUpdate = function(callback) {
	if (this._vnode) {
    // 添加一个 _force 标识, 之后可以借助这个标识跳过 shouldComponentUpdate 生命周期
		this._force = true
		if (callback) this._renderCallbacks.push(callback)
		enqueueRender(this)
	}
}

// 存储一个更新队列
let rerenderQueue = []

export function enqueueRender(c) {
  if (!c._dirty) {
    c._dirty = true
    rerenderQueue.push(c)
    queueMicrotask(process)
  }
}

function process() {
  rerenderQueue.forEach(c => {
    c._dirty && renderComponent(c)
  })
  rerenderQueue = []
}

function renderComponent(component) {
  
  // diff
  const parentDom = component._parentDom
  const newVNode = component._vnode
  const oldVNode = { ...newVNode }

  if (parentDom) {
    let commitQueue = []

    diff(
      parentDom,
      newVNode,
      oldVNode,
      newVNode._dom,
      commitQueue
    )

    commitRoot(commitQueue)
  }

}

Component.isReactComponent = Symbol('isReactComponent')
/**
 * diffProps
 * @param {*} dom       当前虚拟dom对应的真实dom节点
 * @param {*} newProps  新虚拟dom节点的props属性
 * @param {*} oldProps  旧虚拟dom节点的props属性
 */
export function diffProps(dom, newProps, oldProps) {

  let i

  // 添加属性
  for (i in newProps) {
    if (
      i !== 'children' &&
      i !== 'key' &&
      i !== 'ref' &&
      oldProps[i] !== newProps[i]
    ) {
      setProperty(dom, i, newProps[i], oldProps[i])
    }
  }

}

/**
 * setProperty
 * @param {*} dom       当前虚拟dom对应的真实dom节点
 * @param {*} name      属性名
 * @param {*} newValue  要设置成的值
 * @param {*} oldValue  旧值
 */
function setProperty(dom, name, newValue, oldValue) {

  // 如果新值旧值一致，不处理
  if (newValue === oldValue) return

  // 处理style
  if (name === 'style') {
    setStyle(...arguments)
  }
  // 处理事件
  else if (name[0] === 'o' && name[1] === 'n') {
    setEventListener(...arguments)
  }
  // 处理其它属性
  else {
    if (oldValue && !newValue) {
      dom.removeAttribute(name)
    } else if (!oldValue && newValue || newValue !== oldValue) {
      dom.setAttribute(name, newValue)
    }
  }

}

/**
 * 设置样式
 * @param {*} dom       当前虚拟dom对应的真实dom节点
 * @param {*} name      属性名
 * @param {*} newValue  要设置成的值
 * @param {*} oldValue  旧值
 */
function setStyle(dom, name, newValue, oldValue) {

  let isSame = true
  let cssText = '', attribute, value

  for (attribute in newValue) {

    value = newValue[attribute]

    // 判断是否相同
    if (!oldValue || newValue[attribute] != oldValue[attribute]) {
      isSame = false
    }

    // 把驼峰转化成 - 连接
    attribute = attribute.replace(/[A-Z]/g, s => `-${s.toLocaleLowerCase()}`)
    // 连接在一起
    cssText += `${attribute}: ${value};`

  }

  // 设置样式
  isSame || (dom.style.cssText = cssText)

}

/**
 * 设置事件
 * @param {*} dom       当前虚拟dom对应的真实dom节点
 * @param {*} name      属性名
 * @param {*} newValue  要设置成的值
 * @param {*} oldValue  旧值
 */
function setEventListener(dom, name, newValue, oldValue) {

  // 判断是否是捕获阶段
  const useCapture = name !== (name = name.replace('Capture', ''))

  // 转化成小写
  name = name.slice(2).toLocaleLowerCase()

  // 给dom上添加一个_listeners属性
  if (!dom._listeners) dom._listeners = {}

  // 直接把当前的事件存储到 _listeners 中
  dom._listeners[name + (useCapture ? 'Capture' : '')] = newValue

  // 判断事件绑定
  const handler = useCapture ? eventProxyCapture : eventProxy

  if (newValue && !oldValue) {
    dom.addEventListener(name, handler, useCapture)
  } else {
    dom.removeEventListener(name, handler, useCapture)
  }

}

function eventProxy(e) {
  this._listeners[e.type](e)
}

function eventProxyCapture(e) {
  this._listeners[e.type + 'Capture'](e)
}
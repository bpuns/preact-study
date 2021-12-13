import { IS_NON_DIMENSIONAL } from '../constants'

/** diff 设置props
 * @param {*} dom 
 * @param {*} newProps 
 * @param {*} oldProps 
 * @param {*} isSvg 
 * @param {*} hydrate 
 */
export function diffProps(dom, newProps, oldProps, isSvg, hydrate) {
  let i

  // 删除掉 newProps 中不存在的属性，oldProps 存在的属性
  for (i in oldProps) {
    // 不处理children, 不处理key，只处理新props中不存在的值
    if (i !== 'children' && i !== 'key' && !(i in newProps)) {
      setProperty(dom, i, null, oldProps[i], isSvg)
    }
  }

  // 循环新节点，设置新的值
  for (i in newProps) {
    if (
      (!hydrate || typeof newProps[i] == 'function') &&
      i !== 'children' &&
      i !== 'key' &&
      i !== 'value' &&
      i !== 'checked' &&
      oldProps[i] !== newProps[i]
    ) {
      setProperty(dom, i, newProps[i], oldProps[i], isSvg)
    }
  }

}

function setStyle(style, key, value) {
  if (key[0] === '-') {
    style.setProperty(key, value);
  } else if (value == null) {
    style[key] = '';
  } else if (typeof value != 'number' || IS_NON_DIMENSIONAL.test(key)) {
    style[key] = value;
  } else {
    style[key] = value + 'px';
  }
}

/** 设置属性
 * @param {*} dom       dom元素
 * @param {*} name      要设置的属性名
 * @param {*} value     要设置的值
 * @param {*} oldValue  旧值
 * @param {*} isSvg     是否是svg
 */
export function setProperty(dom, name, value, oldValue, isSvg) {
  let useCapture

  // 处理 style 节点
  o: if (name === 'style') {
    // 如果新的 style 属性是字符串的，直接设置 cssText 
    if (typeof value == 'string') {
      dom.style.cssText = value
    }
    // style可能是对象
    else {
      if (typeof oldValue == 'string') {
        dom.style.cssText = oldValue = '';
      }

      if (oldValue) {
        for (name in oldValue) {
          if (!(value && name in value)) {
            setStyle(dom.style, name, '');
          }
        }
      }

      if (value) {
        for (name in value) {
          if (!oldValue || value[name] !== oldValue[name]) {
            setStyle(dom.style, name, value[name]);
          }
        }
      }
    }
  }
  // 绑定方法
  else if (name[0] === 'o' && name[1] === 'n') {
    // 判断是否需要在需要给事件绑定到捕获阶段触发
    // 顺便把事件中的 Capture 去掉
    useCapture = name !== (name = name.replace(/Capture$/, ''))

    // 处理名字
    if (name.toLowerCase() in dom) name = name.toLowerCase().slice(2);
    else name = name.slice(2)

    // 给当前dom绑定一个 _listeners 属性
    if (!dom._listeners) dom._listeners = {}
    // 把 "事件名+useCapture" 为 key，函数存储在 _listeners 上
    dom._listeners[name + useCapture] = value

    if (value) {
      // 如果旧节点已经绑定过了，就不需要绑定了
      if (!oldValue) {
        const handler = useCapture ? eventProxyCapture : eventProxy;
        dom.addEventListener(name, handler, useCapture);
      }
    } else {
      // 如果新的事件不存在，直接移除
      const handler = useCapture ? eventProxyCapture : eventProxy;
      dom.removeEventListener(name, handler, useCapture);
    }

  }
  // 处理剩余属性
  // 因为 dangerouslySetInnerHTML 在外面已经处理过了，所以不需要处理
  else if (name !== 'dangerouslySetInnerHTML') {

    // 设置属性
    if (
      name !== 'href' &&
      name !== 'list' &&
      name !== 'form' &&
      name !== 'tabIndex' &&
      name !== 'download' &&
      name in dom
    ) {
      try {
        dom[name] = value == null ? '' : value
        break o
      } catch (e) { }
    }

    // 不要把函数设置为属性值
    if (typeof value === 'function') {
    }
    // 设置属性
    else if (
      value != null &&
      (value !== false || (name[0] === 'a' && name[1] === 'r'))
    ) {
      dom.setAttribute(name, value);
    }
    // 如果value为null，直接移除属性
    else {
      dom.removeAttribute(name);
    }

  }

}

/** 事件代理
 * @param {*} e 
 */
function eventProxy(e) {
  this._listeners[e.type + false](options.event ? options.event(e) : e);
}

/** capture 事件代理
 * @param {*} e 
 */
function eventProxyCapture(e) {
  this._listeners[e.type + true](options.event ? options.event(e) : e);
}

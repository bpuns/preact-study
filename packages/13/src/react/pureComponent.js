import { Component } from './component'

/** 浅比较两个对象是否不同
 * @param {*} a
 * @param {*} b 
 */
export function shallowDiffers(a, b) {
  // 判断b对象中是否存在a对象中不存在的属性
  for (let key in a) if (!(key in b)) return true
  // 判断a与b的值是否相同
  for (let key in b) if (a[key] !== b[key]) return true
  return false
}

export class PureComponent extends Component {

  shouldComponentUpdate(newProps, newState) {
    return (
      shallowDiffers(this.props, newProps) ||
      shallowDiffers(this.state, newState)
    )
  }

}
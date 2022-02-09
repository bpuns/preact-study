import { enqueueRender } from './component'

let i = 1

export function createContext(defaultValue) {

  const contextId = '_ctx' + i++

  const context = {
    _id: contextId,
    _defaultValue: defaultValue,
    Consumer(props) {
      return props.children(this.context)
    },
    Provider(props) {

      if (!this.getChildContext) {

        // 存储消费此Provider的子节点们
        const subs = new Set()

        // 为了把当前的context合并到globalContext上做准备
        this.getChildContext = () => ({ [contextId]: this })

        // 重写shouldComponentUpdate方法
        this.shouldComponentUpdate = function (_props) {
          if (this.props.value !== _props.value) {
            // 把注册的子组件们推入到更新队列中
            subs.forEach(enqueueRender)
          }
        }

        // 如果从子节点中消费了此Provider，需要注册到subs中
        this.sub = c => {
          // 订阅
          subs.add(c)
          // 重写componentWillUnmount方法
          let old = c.componentWillUnmount
          c.componentWillUnmount = () => {
            // 移除订阅
            subs.delete(c)
            if (old) old.call(c)
          }
        }

      }

      return props.children

    }
  }

  // Consumer上绑定一个contextType的静态属性，就能实现对应效果
  context.Consumer.contextType = context

  return context

}
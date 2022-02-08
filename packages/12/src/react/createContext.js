import { enqueueRender } from './component'

export let i = 0

export function createContext(defaultValue) {

  const contextId = '__cC' + i++

  return {
    _id: contextId,
    _defaultValue: defaultValue,
    Provider(props) {
      if (!this.getChildContext) {
        let subs = []
        let ctx = {
          [contextId]: this
        }
        this.getChildContext = () => ctx

        this.shouldComponentUpdate = function (_props) {
          if (this.props.value !== _props.value) {
            subs.some(enqueueRender)
          }
        }

        this.sub = c => {
          subs.push(c)
          let old = c.componentWillUnmount;
          c.componentWillUnmount = () => {
            subs.splice(subs.indexOf(c), 1)
            if (old) old.call(c)
          }
        }

      }

      return props.children

    }
  }

}
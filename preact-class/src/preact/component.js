import { Fragment } from './create-element'

export function Component(props, context) {
  this.props = props
  this.context = context
}

Component.prototype.render = Fragment
import { h, Fragment, render, Component } from './preact/index'

class Father extends Component {

  render(props) {
    return (
      h(
        'div',
        null,
        h('h4', null, 'Father---' + props.change),
        props.change ? h(Son) : null
      )
    )
  }

}

function Son() {
  return (
    h(
      'h4',
      null,
      'Son',
      h(Grandson)
    )
  )
}

class Grandson extends Component {

  componentWillUnmount() {
    console.log('Grandson', 'componentWillUnmount')
  }

  render() {
    return (
      h(
        'h4',
        null,
        'Grandson'
      )
    )
  }

}

class Cps extends Component {

  state = { change: true }

  render(_, { change }) {

    const style = { border: '3px solid #D6D6D6', margin: '5px' }
    let element = (
      h(
        'ul',
        { id: 'A1', style },
        [
          h('li', { key: '1', style }, 1),
          h('li', { key: '2', style }, 2),
          h('li', { key: '3', style }, 3),
          h('li', { key: '4', style }, 4),
          h('li', { key: '5', style }, 5)
        ],
        h(Father, { change })
      )
    )

    if (!change) {
      const style = { border: '10px solid #D6D6D6', margin: '5px' }
      element = (
        h(
          'ul',
          { id: 'A1', style },
          [
            h('li', { key: '2', style }, 2),
            h('li', { key: '1', style }, 1),
            h('li', { key: '5', style }, 5),
            h('li', { key: '6', style }, 6)
          ],
          h(Father, { change })
        )
      )
    }

    return (
      h(
        Fragment,
        null,
        h(
          'button',
          {
            onClick: () => {
              const next = !change
              this.setState({ change: next })
              this.setState({ change: next })
              this.setState({ change: next })
              this.setState({ change: next })
            }
          },
          '更新'
        ),
        element
      )
    )
  }
}

const element = h(Cps)

render(element, document.querySelector('#root'))
import { h, Fragment, render, Component } from './preact/index'

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
        ]
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
          ]
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
              this.setState({ change: !this.state.change })
            }
          },
          '更新'
        ),
        element
      )
    )
  }
}

const style = { border: '3px solid #D6D6D6', margin: '5px' }
const element = h(Cps)
// const element = (
//   h(
//     'ul',
//     { id: 'A1', style },
//     [
//       h('li', { key: '1', style }, 1),
//       h('li', { key: '2', style }, 2),
//       h('li', { key: '3', style }, 3),
//       h('li', { key: '4', style }, 4),
//       h('li', { key: '5', style }, 5)
//     ]
//   )
// )

render(element, document.querySelector('#root'))

// document.querySelector('button').onclick = () => {

//   const style = { border: '10px solid #D6D6D6', margin: '5px' }
//   const element = (
//     h(
//       'ul',
//       { id: 'A1', style },
//       [
//         h('li', { key: '2', style }, 2),
//         h('li', { key: '1', style }, 1),
//         h('li', { key: '5', style }, 5),
//         h('li', { key: '6', style }, 6)
//       ]
//     )
//   )

//   render(element, document.querySelector('#root'))

// }
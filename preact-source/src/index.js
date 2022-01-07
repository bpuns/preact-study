import { h, render, Component } from './preact/src/index'

// class C1 extends Component {

//   state = {
//     show: true
//   }

//   render() {
//     return (
//       this.state.show ? h('div', { id: 'C1', onClick: ()=>{ this.setState({ show: false }) } }, 'C1', h(C2, {})) : null
//     )
//   }

// }

// class C2 extends Component {

//   render() {
//     return h('div', { id: 'C2' }, 'C2', h(C3, {}))
//   }

//   componentWillUnmount(){
//     console.log('C2 componentWillUnmount')
//   }

// }

// class C3 extends Component {

//   componentWillUnmount(){
//     console.log('C3 componentWillUnmount')
//   }

//   render() {
//     return h('div', { id: 'C3' }, 'C3')
//   }

// }

// render(h(C1), document.querySelector('#root'))

const style = { border: '3px solid #D6D6D6', margin: '5px' }
const element = (
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

render(element, document.querySelector('#root'))

document.querySelector('button').onclick = () => {

  const style = { border: '10px solid #D6D6D6', margin: '5px' }
  const element = (
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

  render(element, document.querySelector('#root'))

}
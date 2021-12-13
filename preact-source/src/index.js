import { h, render, Component } from './preact/src/index'

// class Counter extends Component {

//   constructor(props) {
//     super(props)
//     this.state = {
//       number: 1
//     }
//   }

//   add = () => {
//     this.setState({ number: this.state.number + 1 })
//     this.setState({ number: this.state.number + 1 })
//     this.setState({ number: this.state.number + 1 })
//     this.setState({ number: this.state.number + 1 })
//     setTimeout(() => {
//       this.setState({ number: this.state.number + 1 })
//       this.setState({ number: this.state.number + 1 })
//       this.setState({ number: this.state.number + 1 })
//       this.setState({ number: this.state.number + 1 })
//     }, 1000)
//   }

//   componentDidUpdate(_1, _2, ss) {
//     console.log('componentDidUpdate', ss)
//   }

//   getSnapshotBeforeUpdate(){
//     return 1
//   }

//   render() {

//     return (
//       h(
//         'div',
//         {},
//         this.state.number,
//         h(
//           'button',
//           { onClick: this.add },
//           'add'
//         )
//       )
//     )
//   }

// }

// render(h(Counter), root)

const list = [{ id: 1, name: 1 }, { id: 2, name: 2 }, { id: 3, name: 3 }]

const style = { border: '3px solid #D6D6D6', margin: '5px' }
const element = (
  h(
    'div', { id: 'A1', style },
    'A1-text',
    // list.map(item => h('div', { key: item.id }, item.name))
    // h(
    //   'div', { id: 'B1', style },
    //   'B1-text',
    //   h('div', { id: 'C1', style }, 'C1-text'),
    //   h('div', { id: 'C2', style }, 'C2-text'),

    // ),
    // h('div', { id: 'B2', style }, 'B2-text')
  )
)

console.log(element)

render(element, root)

// render2.onclick = function () {
//   const style = { border: '5px solid #D6D6D6', margin: '2px' }
//   const element = (
//     h(
//       'div', { id: 'A1', style },
//       'A1-edit',
//       h(
//         'div', { id: 'B1', style },
//         'B1-edit',
//         h('div', { id: 'C1', style }, 'C1-edit'),
//         h('div', { id: 'C2', style }, 'C2-edit')
//       ),
//       h('div', { id: 'B2', style }, 'B2')
//     )
//   )

//   render(element, root)
// }
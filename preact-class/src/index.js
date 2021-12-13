import { h, render, Component } from './preact/index'

// class Counter extends Component {

//   constructor(props) {
//     super(props)
//     this.state = {
//       number: 1
//     }
//   }

//   static getDerivedStateFromProps(){
//     console.log(1)
//   }

//   add = () => {
//     this.setState({ number: this.state.number + 1 })
//     // this.setState({ number: this.state.number + 1 })
//     // this.setState({ number: this.state.number + 1 })
//     // this.setState({ number: this.state.number + 1 })
//     // setTimeout(() => {
//     //   this.setState({ number: this.state.number + 1 })
//     //   this.setState({ number: this.state.number + 1 })
//     //   this.setState({ number: this.state.number + 1 })
//     //   this.setState({ number: this.state.number + 1 })
//     // }, 1000)
//   }

//   componentDidUpdate() {
//     console.log('componentDidUpdate')
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

// render(h(Counter, { flag: 1 }), root)

const style = { border: '3px solid #D6D6D6', margin: '5px' }
const element = (
  h(
    'div', { id: 'A1', style },
    'A1-text',
    // h(
    //   'div', { id: 'B1', style },
    //   'B1-text',
    //   h('div', { id: 'C1', style }, 'C1-text'),
    //   h('div', { id: 'C2', style }, 'C2-text')
    // ),
    // h('div', { id: 'B2', style }, 'B2-text')
  )
)

console.log(element)

render(element, root)
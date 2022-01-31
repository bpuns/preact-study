// import { createElement, render } from 'preact'

// render(
//   createElement('div', null, 1),
//   document.getElementById('root')
// )

// const div = document.querySelector('div')

// // 页面中插入一个button，点击之后重复调用render
// const button = document.createElement('button')
// button.onclick = function () {
//   render(
//     createElement('div', null, 2),
//     document.getElementById('root')
//   )
//   // 比较两个div是否是同一个
//   console.log(div === document.querySelector('div'))
// }
// document.body.appendChild(button)

// import { createElement, Component } from 'react'
// import ReactDom from 'react-dom'

// class Root extends Component {

//   state = { count: 1 }

//   render() {

//     return (
//       createElement(
//         'button',
//         {
//           onClick: () => {
//             this.setState({ count: this.state.count + 1 })
//             this.setState({ count: this.state.count + 1 })
//             setTimeout(() => {
//               this.setState({ count: this.state.count + 1 })
//               this.setState({ count: this.state.count + 1 })
//             })
//           }
//         },
//         this.state.count
//       )
//     )
//   }

// }

// ReactDom
//   .createRoot(document.getElementById('root'))
//   .render(createElement(Root))


import React, { Component } from 'react'
import { render } from 'react-dom'
// import { createElement, Component, render } from 'preact'
// const React = {
//   createElement
// }

class Root extends Component {

  state = { show: false }

  render() {

    const { show } = this.state

    // if (show) {
    //   return (
    //     <div>
    //       <div>1</div>
    //       <div>2</div>
    //       <button onClick={() => this.setState({ show: !show })}> update</button>
    //     </div>
    //   )
    // } else {
    //   return (
    //     <div>
    //       <div>2</div>
    //       <button onClick={() => this.setState({ show: !show })}> update</button>
    //     </div>
    //   )
    // }

  }

}

render(<Root />, document.getElementById('root'))

// import { createElement, render } from 'preact'

// render(
//   createElement('div', null, Error('xx')),
//   document.getElementById('root')
// )
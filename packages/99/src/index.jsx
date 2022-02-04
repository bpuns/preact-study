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

// import { Component, Fragment, createElement, render } from './react'

// const React = { createElement }

class Root extends Component {

  state = {
    a: 1
  }

  static getDerivedStateFromProps(nextProps, prevState){
    console.log(nextProps, prevState)
    return {
      ...nextProps,
      ...prevState
    }
  }

  render() {

    console.log(this.state);

    return (
      <div>test</div>
    )
  }
}

render(
  <Root b={2} />,
  root
)

// document.querySelector('button').onclick = function () {
//   render(
//     <div>
//       <FragmentTest a={true} />
//       <div key={0} id='0'>0</div>
//       <div key={4} id='4'>4</div>
//     </div>,
//     root
//   )
// }

// render(<Root />, document.getElementById('root'))

// import { createElement, render } from 'preact'

// render(
//   createElement('div', null, Error('xx')),
//   document.getElementById('root')
// )
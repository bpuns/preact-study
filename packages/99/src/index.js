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

import { createElement, Component } from 'react'
import ReactDom from 'react-dom'

class Root extends Component {

  state = { count: 1 }

  render() {

    console.log('render')

    return (
      createElement(
        'button',
        {
          onClick: () => {
            this.setState({ count: this.state.count + 1 })
            this.setState({ count: this.state.count + 1 })
            setTimeout(() => {
              this.setState({ count: this.state.count + 1 })
              this.setState({ count: this.state.count + 1 })
            })
          }
        },
        this.state.count
      )
    )
  }

}

ReactDom
  .createRoot(document.getElementById('root'))
  .render(createElement(Root))




// import { createElement, render } from 'preact'

// render(
//   createElement('div', null, Error('xx')),
//   document.getElementById('root')
// )
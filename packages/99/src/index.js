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

// import { createElement } from 'react'
// import ReactDom from 'react-dom'

// ReactDom.render(
//   createElement('div', null, {}),
//   document.getElementById('root')
// )




import { createElement, render } from 'preact'

render(
  createElement('div', null, Error('xx')),
  document.getElementById('root')
)
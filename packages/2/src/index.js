import { createElement, render } from 'preact'

render(
  createElement('div', { id: 'demo' }, 1),
  document.getElementById('root')
)

const div = document.querySelector('#demo')

// 页面中插入一个button，点击之后重复调用render
const button = document.createElement('button')
button.onclick = function () {
  render(
    createElement('div', { id: 'demo' }, 2),
    document.getElementById('root')
  )
  // 比较两个div是否是同一个
  console.log(div === document.querySelector('#demo'))
}
document.body.appendChild(button)


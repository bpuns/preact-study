import { h, render } from './preact/index'

const style1 = { border: '3px solid #D6D6D6', margin: '5px' }
let element1 = (
  h(
    'ul',
    { id: 'A1', style1 },
    [
      h('li', { key: '1', style1 }, 1),
      h('li', { key: '2', style1 }, 2),
      h('li', { key: '3', style1 }, 3),
      h('li', { key: '4', style1 }, 4),
      h('li', { key: '5', style1 }, 5)
    ]
  )
)

const style2 = { border: '10px solid #D6D6D6', margin: '5px' }
let element2 = (
  h(
    'ul',
    { id: 'A1', style2 },
    [
      h('li', { key: '2', style2 }, 2),
      h('li', { key: '1', style2 }, 1),
      h('li', { key: '5', style2 }, 5),
      h('li', { key: '6', style2 }, 6)
    ]
  )
)

let i = 0

render(element1, document.querySelector('#root'))

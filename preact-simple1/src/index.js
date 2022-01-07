import { h, render } from './preact/index'

const style1 = { border: '3px solid #D6D6D6', margin: '5px' }
let element1 = (
  h(
    'ul',
    { id: 'A1', style: style1 },
    [
      h(
        'li',
        { key: '1', style: style1 },
        h(
          'div',
          null,
          h(
            'div',
            null,
            h(
              'div',
              null,
              1
            ),
          ),
        ),
      ),
      h('li', { key: '2', style: style1 }, 2),
      h('li', { key: '3', style: style1 }, 3),
      h('li', { key: '4', style: style1 }, 4),
      h('li', { key: '5', style: style1 }, 5)
    ]
  )
)

const style2 = { border: '10px solid #D6D6D6', margin: '5px' }
let element2 = (
  h(
    'ul',
    { id: 'A1', style: style2 },
    [
      h('li', { key: '2', style: style2 }, 2),
      h(
        'li',
        { key: '1', style: style2 },
        h(
          'div',
          null,
          h(
            'div',
            null,
            h(
              'div',
              null,
              1
            ),
          ),
        )
      ),
      h('li', { key: '5', style: style2 }, 5),
      h('li', { key: '6', style: style2 }, 6)
    ]
  )
)

let i = 2

document.querySelector('button').onclick = function () {
  i = (++i % 2)

  if ((i + 1) === 1) {
    render(element1, document.querySelector('#root'))
  } else {
    render(element2, document.querySelector('#root'))
  }

}

render(element1, document.querySelector('#root'))
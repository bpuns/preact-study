import { h, render } from './preact/src/index'

const style = { border: '3px solid #D6D6D6', margin: '5px' }
const element = (
  h(
    'div', { id: 'A1', style },
    'A1',
    h(
      'div', { id: 'B1', style },
      'B1',
      h('div', { id: 'C1', style }, 'C1'),
      h('div', { id: 'C2', style }, 'C2')
    ),
    h('div', { id: 'B2', style }, 'B2')
  )
)

render(element, root)

render2.onclick = function () {
  const style = { border: '5px solid #D6D6D6', margin: '2px' }
  const element = (
    h(
      'div', { id: 'A1', style },
      'A1-edit',
      h(
        'div', { id: 'B1', style },
        'B1-edit',
        h('div', { id: 'C1', style }, 'C1-edit'),
        h('div', { id: 'C2', style }, 'C2-edit')
      ),
      h('div', { id: 'B2', style }, 'B2')
    )
  )

  render(element, root)
}
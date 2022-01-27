import { createElement, render } from './react'

const style = { border: '3px solid #D6D6D6', margin: '5px', borderBottomColor: 'red' }

const element = (
  createElement(
    'div', { className: 'A1', style },
    'A-text',
    createElement(
      'div', { className: 'B1', style },
      'B1-text',
      createElement('div', { className: 'C1', style, onClick: () => alert(1) }, 'C1-text'),
      createElement('div', { className: 'C2', style }, 'C2-text')
    ),
    createElement('div', { className: 'B2', style }, 'B2-text')
  )
)

render(element, document.getElementById('root'))
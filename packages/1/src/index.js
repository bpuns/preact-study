import { createElement, jsx } from './react'

const style = { border: '3px solid #D6D6D6', margin: '5px' }

// const jsx = (
//   <div id="A1" style={style}>
//     <div id="B1" style={style}>
//       B1-text
//       <div id="C1" style={style} onClick={() => alert(1)}>
//         C1-text
//       </div>
//       <div id="C2" style={style}>
//         C2-text
//       </div>
//     </div>
//   </div>
// )

const element = (
  createElement(
    'div', { id: 'A1', style },
    'A-text',
    createElement(
      'div', { id: 'B1', style },
      'B1-text',
      createElement('div', { id: 'C1', style, onClick: () => alert(1) }, 'C1-text'),
      createElement('div', { id: 'C2', style }, 'C2-text')
    ),
    createElement('div', { id: 'B2', style }, 'B2-text')
  )
)

const newElement = (
  jsx(
    'div',
    {
      id: 'A1',
      style,
      children: [
        'A-text',
        jsx(
          'div',
          {
            id: 'B1',
            style,
            children: [
              'B1-text',
              jsx('div', { id: 'C1', style, onClick: () => alert(1), children: 'C1-text' }),
              jsx('div', { id: 'C2', style, children: 'C2-text' })
            ]
          },
        ),
        jsx('div', { id: 'B2', style, children: 'B2-text' })
      ]
    },
  )
)

console.log(element)
console.log(newElement)
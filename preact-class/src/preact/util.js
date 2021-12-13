import { EMPTY_ARR } from './constants'

/** 合并两个对象 */
export function assign(obj, props) {
  return { ...obj, ...props }
}

/** arguments是类数组，没有slice方法 */
export const slice = EMPTY_ARR.slice
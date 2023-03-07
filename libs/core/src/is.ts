import { default as isMyPromise } from 'is-promise'
import {
  isElement as isDomElement,
  isString,
  isArray,
  isUndefined,
  isNull,
} from 'lodash-es'
import { getTypeOfValue } from './utils'

export {
  isString,
  isNumber,
  isBoolean,
  isArray,
  isDate,
  isRegExp,
  isUndefined,
  isNull,
} from 'lodash-es'

export const isPlainObject = (val: unknown): val is Record<any, any> =>
  getTypeOfValue(val) === 'object'

export const isElement = <T = unknown>(val: T): val is T => isDomElement(val)

export const isWindow = (val: unknown): val is Window =>
  typeof window !== 'undefined' && getTypeOfValue(val) === 'window'

export const isMap = (val: unknown): val is Map<any, any> =>
  getTypeOfValue(val) === 'map'

export const isServer = typeof window === 'undefined'

export const isClient = !isServer

// eslint-disable-next-line @typescript-eslint/ban-types
export const isFunction = (val: unknown): val is Function =>
  typeof val === 'function'

export const isUrl = (path: string): boolean => {
  const reg =
    // eslint-disable-next-line no-useless-escape
    /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/
  return reg.test(path)
}

/**
 * 是否为空数组 | 空字符串 | 空Map | 空Set | 空对象
 * @param val
 */
export const isEmpty = <T = unknown>(val: T): boolean => {
  if (isArray(val) || isString(val)) {
    return val.length === 0
  }

  if (val instanceof Map || val instanceof Set) {
    return val.size === 0
  }
  if (isPlainObject(val)) {
    return Object.keys(val).length === 0
  }
  return false
}

export const isNullOrUnDef = (val: unknown): val is null | undefined =>
  isUndefined(val) || isNull(val)

export const isPromise = <T = any>(val: any): val is Promise<T> =>
  isMyPromise(val)

export const isHexColor = (color: string) => {
  const reg = /^#([0-9a-fA-F]{3}|[0-9a-fA-f]{6})$/
  return reg.test(color)
}

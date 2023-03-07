/**
 * dm(data manipulate: 数据操纵)
 */

import { isEqual, flatten, cloneDeep } from 'lodash-es'
import { isArray, isNumber, isString } from './is'

/**
 * 查找数组中重复值的index
 * @param arr 要查找的数组
 * @param key 生成指定key组成的数组
 *
 * @example
 *
 * const indexes = pickDuplicate([1,2,3])  // []
 * const indexes2 = pickDuplicate([1,2,2,3])  // [1,2]
 * const indexes3 = pickDuplicate([1, 2, 10, 5, 5, 7, 7, 9, 9, 9, 10]) // [[2, 10],[3, 4],[5, 6],[7, 8, 9]]
 */
export const pickDuplicate = (arr: any[], key?: any) => {
  const result: number[][] = []
  if (arr.length === 0 || arr.length === 1) {
    return result
  }
  let i = 0
  while (i < arr.length - 1) {
    let keys: number[] = []
    const conditions = flatten(result)
    if (conditions.indexOf(i) > -1) {
      i++
      continue
    }
    let j = 0
    while (j < arr.length) {
      if (i === j) j++
      if (conditions.indexOf(j) > -1) {
        j++
        continue
      }
      if (isEqual(arr[i], arr[j])) {
        if (isString(key) || isNumber(key)) {
          if (isEqual(arr[i], key)) {
            keys.push(i, j)
            j++
            continue
          }
        } else if (isArray(key) && key.length > 0) {
          for (const k of key) {
            if (isEqual(arr[i], k)) {
              keys.push(i, j)
            }
          }
        } else {
          keys.push(i, j)
        }
      }
      j++
    }
    i++
    keys = [...new Set(keys)]
    if (keys.length > 0) {
      result.push(keys)
    }
  }
  return result
}

/**
 * 获取数组的最大深度（也就是获取数组的维度。因为至少都是一维数组，所以deep默认为1）
 */
export const getDepth = (arr: any[], deep = 1): number => {
  for (const item of arr) {
    if (Array.isArray(item)) {
      return getDepth(item, ++deep)
    } else {
      continue
    }
  }
  return deep
}

/**
 * 将数组按指定key转换成响应的对象
 * @param data
 * @param key
 */
export const arrayToObject = (data: Record<string, any>[], key: string) => {
  const obj: Recordable = {}
  for (const item of data) {
    obj[item[key]] = item
  }
  return obj
}

export const changeToTree = (
  d: Recordable[],
  key = 'id',
  pkey = 'parentId'
) => {
  const ckey = 'children'
  const data = cloneDeep(d)
  let flag = false // 字段保证顺序是否变化
  if (!key || !data) return []

  let tree: any[] = []
  const names: string[] = []
  const parents: Recordable = {}
  data.forEach(item => {
    names.push(item[key] + '_')
    // 父类相同的分类
    parents[item[pkey] + '_'] = parents[item[pkey] + '_'] || []
    parents[item[pkey] + '_'].push(item)
  })
  data.forEach(item => {
    if (parents[item[key] + '_'] && item[pkey] !== item[key]) {
      flag = true
      item[ckey] = [...parents[item[key] + '_']]
    }
  })
  // 保证顺序不能变(前提是：没有子节点)
  if (flag) {
    // 获取根节点
    for (const keyName in parents) {
      if (names.indexOf(keyName) < 0) {
        tree.push(...parents[keyName])
      }
    }
  } else {
    tree = cloneDeep(data)
  }
  return tree
}

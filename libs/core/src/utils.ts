import qs from 'qs'
import { isNumber } from './is'
import { pattern } from './validType'

interface funcObject {
  [propName: string]: any
}

interface Console<T = string> {
  log: (str: T) => void
  warn: (str: T) => void
  error: (str: T) => void
  success: (str: T) => void
}

const fileType = {
  ISSCRIPT: 'script',
  ISCSS: 'style', // 样式文件
  ISMIXINS: 'mixin', // mixin
}

function cubic(value: number) {
  return Math.pow(value, 3)
}

function easeInOutCubic(value: number) {
  return value < 0.5 ? cubic(value * 2) / 2 : 1 - cubic((1 - value) * 2) / 2
}

/***************************************************************************/

/**
 * 预定义四种console.log打印的颜色
 */
export const _console: Console<string> = {
  log(str) {
    console.log(
      `%c${str}`,
      'background:#303133;color:#fff;fontSize:14px;padding:3px 10px;'
    )
  },
  warn(str) {
    console.log(
      `%c${str}`,
      'background:#E6A23C;color:#fff;fontSize:14px;padding:3px 10px;'
    )
  },
  error(str) {
    console.log(
      `%c${str}`,
      'background:#FC0505;color:#fff;fontSize:14px;padding:3px 10px;'
    )
  },
  success(str) {
    console.log(
      `%c${str}`,
      'background:#67C23A;color:#fff;fontSize:14px;padding:3px 10px;'
    )
  },
}

/**
 * 获取值的类型
 * @param value 任意值（经过toLowerCase处理）
 */
export function getTypeOfValue(value: unknown) {
  return Object.prototype.toString.call(value).slice(8, -1).toLocaleLowerCase()
}

/**
 * 返回指定对象属性的值
 * @param obj
 * @param key
 * @returns
 */
export function getPropValue<T, K extends keyof T>(obj: T, key: K) {
  return obj[key]
}

/**
 * 一次性合并任意多个对象
 * @param target
 * @param src
 */
export function mergeAll(target: Recordable, ...sources: Recordable[]) {
  for (const src of sources) {
    for (const key in src) {
      target[key] =
        getTypeOfValue(target[key]) === 'object'
          ? mergeAll(target[key], src[key])
          : src[key]
    }
  }
  return target
}

/**
 * 什么都不做，用于占位
 */
export const noop = () => {}

/**
 * 对传入的数字，展示小数点后面的指定位数
 * @param num 要处理的数字
 * @param fixed 小数点后面的位数
 * @returns
 */
export function toFixed(num: number, fixed = 2) {
  return (Math.round(num * 100) / 100).toFixed(fixed)
}

/**
 * 数组乱序
 * @param arr
 * @returns
 */
export function arrScrambling<T>(arr: T[]): T[] {
  for (let i = 0; i < arr.length; i++) {
    const randomIndex = Math.round(Math.random() * (arr.length - 1 - i)) + i
    ;[arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]]
  }
  return arr
}

/**
 * 生成指定长度的随机字符串
 * @param len 字符串长度
 */
export function genRandomString(len = 6) {
  return Math.random().toString(36).slice(-len)
}

/**
 * 字符串首字母大写
 * @param str
 * @returns
 */
export function fistLetterUpper(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Checks if two numbers are approximately equal to each other
 * @param v1
 * @param v2
 * @param epsilon
 * @returns
 */
export function approximatelyEqual(v1: number, v2: number, epsilon = 0.001) {
  return Math.abs(v1 - v2) < epsilon
}

/**
 * javascript version sleep
 * @param ms number
 * @returns
 */
export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 滚动条平滑滚动
 */
export function scrollToTop(element: HTMLElement) {
  const el: HTMLElement = element || document.documentElement
  const beginTime = Date.now()
  const beginValue = el.scrollTop
  const rAF = window.requestAnimationFrame || (func => setTimeout(func, 16))
  const frameFunc = () => {
    const progress = (Date.now() - beginTime) / 500
    if (progress < 1) {
      el.scrollTop = beginValue * (1 - easeInOutCubic(progress))
      rAF(frameFunc)
    } else {
      el.scrollTop = 0
    }
  }
  rAF(frameFunc)
}

/**
 * webpack项目自动引入某一目录下js|ts文件或者样式文件
 * @param files require.context
 * @param typeName script 表示js文件，style 表示样式文件，mixin 表示全局混入
 * @param ignores 表示忽略的文件，哪些不需要自动引入的文件，写在这里
 *
 * @deprecated
 */
/* istanbul ignore next */
export function autoImport(
  // @ts-ignore
  files: __WebpackModuleApi.RequireContext,
  typeName: 'script' | 'style' | 'mixin',
  ignores?: string[]
): any {
  const result: unknown[] = []
  const funcObj: funcObject = {}
  files.keys().forEach(file => {
    if (typeName === fileType.ISSCRIPT) {
      const fileName: string =
        file
          ?.split('/')
          ?.pop()
          ?.replace(/\.\w+$/, '') ?? ''
      if (!ignores || ignores.indexOf(fileName) === -1) {
        const jsConfig = files(file)
        funcObj[fileName] = jsConfig?.default
      }
    } else if (typeName === fileType.ISCSS) {
      /* 引入样式文件 */
      const _tmps: string[] = file.split('/')
      if (_tmps?.length > 0) {
        if (!ignores || ignores.indexOf(_tmps[_tmps.length - 1]) !== -1)
          files(file)
      }
    } else if (typeName === fileType.ISMIXINS) {
      /* 自动混入全局（专用于vue） */
      const fileName: string =
        file
          ?.split('/')
          ?.pop()
          ?.replace(/\.\w+$/, '') ?? ''
      if (!ignores || ignores.indexOf(fileName) === -1) {
        result.push(files(file)?.default || files(file))
      }
    }
  })

  return typeName === fileType.ISMIXINS ? result : funcObj
}

/**
 * 以promise的方式在html的head中添加script文件，例如可以cdn引入echarts，这样可以显著减少打包的体积
 * @param scriptURL {string}  你的库文件的链接
 * @param placeHolder {string}  scriptURL中的一个子字符串
 */
export function loadScript(scriptURL: string, placeHolder: string) {
  return new Promise((resolve, reject) => {
    const head = document.head
    const dom = head.querySelector(`[src*="${placeHolder}"]`)
    if (dom) {
      resolve('已经加载成功')
    } else {
      const newDom: HTMLScriptElement = document.createElement('script')
      newDom.type = 'text/javascript'
      newDom.src = scriptURL
      newDom.onerror = reject
      newDom.onload = function () {
        resolve(true)
      }
      head.appendChild(newDom)
    }
  })
}

/**
 * 设置轮询
 * @param callback 轮询执行的回调函数
 * @param time  轮询的时间间隔
 * @param immediate 是否立刻执行 true: 是 | false: 否
 */
export class PollingAction {
  // 轮询间隔
  private time: number
  // 是否立即执行
  private immediate: boolean
  // 轮询执行的操作
  private callback: AnyFunction

  private timer!: ReturnType<typeof setTimeout> | null

  constructor(callback: AnyFunction, time = 1000, immediate = false) {
    this.time = time
    this.immediate = immediate
    this.callback = callback
  }

  start() {
    if (this.immediate) {
      this.callback()
    }
    this.timer = setInterval(() => {
      try {
        this.callback()
      } catch (error) {
        console.log(error)
        this.cancel()
      }
    }, this.time)
  }

  cancel() {
    this.timer && clearInterval(this.timer)
    this.timer = null
  }
}

/**
 * Add the object as a parameter to the URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * @example
 * ```ts
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 * ```
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = ''
  for (const key in obj) {
    parameters += key + '=' + encodeURIComponent(obj[key]) + '&'
  }
  parameters = parameters.replace(/&$/, '')
  return /\?$/.test(baseUrl)
    ? baseUrl + parameters
    : baseUrl.replace(/\/?$/, '?') + parameters
}

/**
 * Generates a random hexadecimal color code
 * 生成随机的十六进制颜色代码
 * @returns {string}
 */
export function randomHexColorCode() {
  const n = (Math.random() * 0xfffff * 1000000).toString(16)
  return '#' + n.slice(0, 6)
}

/**
 * Converts a color code to an rgb() or rgba() string if alpha value is provided
 * @param hex
 * @returns
 */
export function hexToRGB(hex: string) {
  let alpha = false
  let h: string = hex.slice(hex.startsWith('#') ? 1 : 0)
  if (h.length === 3) {
    const pattern = /^[A-Fa-f0-9]{3}$/
    if (!pattern.test(h)) throw new Error('输入的参数不符合16进制颜色')
    else h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
  } else if (h.length === 6) {
    const pattern = /^[A-Fa-f0-9]{6}$/
    if (!pattern.test(h)) throw new Error('输入的参数不符合16进制颜色')
  } else if (h.length === 8) {
    const pattern = /^[A-Fa-f0-9]{8}$/
    if (!pattern.test(h)) throw new Error('输入的参数不符合16进制颜色')
    else alpha = true
  } else {
    throw new Error('输入的参数不符合16进制颜色')
  }
  const n = parseInt(h, 16)
  return (
    'rgb' +
    (alpha ? 'a' : '') +
    '(' +
    (n >>> (alpha ? 24 : 16)) +
    ', ' +
    ((n & (alpha ? 0x00ff0000 : 0x00ff00)) >>> (alpha ? 16 : 8)) +
    ', ' +
    ((n & (alpha ? 0x0000ff00 : 0x0000ff)) >>> (alpha ? 8 : 0)) +
    (alpha ? `, ${n & 0x000000ff}` : '') +
    ')'
  )
}

/**
 * Converts the values of RGB components to a hexadecimal color code
 * @param r
 * @param g
 * @param b
 * @returns
 */
export function RGBToHex(r: string): string
export function RGBToHex(r: number, g: number, b: number): string
export function RGBToHex(r: string | number, g?: number, b?: number) {
  if (isNumber(r)) {
    if (g && b) {
      if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
        return `#${((r << 16) + (g << 8) + b).toString(16).padStart(6, '0')}`
      } else {
        throw new Error('非法的rgb颜色')
      }
    }
  } else {
    const result = r.match(/(?<=rgb\()(\d+),(\d+),(\d+)(?=\))/)
    if (result) {
      return RGBToHex(
        parseInt(result[1]),
        parseInt(result[2]),
        parseInt(result[3])
      )
    } else {
      throw new Error('非法的rgb颜色')
    }
  }
}

/**
 * 将一串数字转换成数字千分位的写法 '1,234'
 * @param n
 * @returns
 */
export function convertToThousands(n: number) {
  // const num2 = Math.trunc(n).toString()
  const num2 = n.toString()
  const num = pattern.testDecimal(num2) ? num2.split('.')[0] : n.toString() // 获取整数部分
  const decimal = pattern.testDecimal(num2) ? '.' + num2.split('.')[1] : '' // 获取小数部分
  const len = num.length
  if (len <= 3) {
    return num + decimal
  } else {
    const temp = ''
    const remainder = len % 3
    if (remainder > 0) {
      // 不是3的整数倍
      return (
        num.slice(0, remainder) +
        ',' +
        num.slice(remainder, len).match(/\d{3}/g)?.join(',') +
        temp +
        decimal
      )
    } else {
      // 3的整数倍
      return num.slice(0, len).match(/\d{3}/g)?.join(',') + temp + decimal
    }
  }
}

/**
 * 将字符串中间指定区间字符替换成指定字符串
 * @param str
 * @param start default 3
 * @param end default 7
 * @param fill default *
 * @returns
 */
export function convertStrToAsterisk(
  str: string,
  start = 3,
  end = 7,
  fill = '*'
) {
  if (str.length < end) {
    throw new Error('字符串长度不能小于指定的区间')
  }
  return str.slice(0, start) + ''.padStart(end - start, fill) + str.slice(end)
}

/**
 * 将数字转化为汉字大写金额
 */
export function convertChineseMoney(n: number) {
  const fraction = ['角', '分']
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟'],
  ]
  n = Math.abs(n)
  let s = ''
  for (let i = 0; i < fraction.length; i++) {
    s += (
      digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]
    ).replace(/零./, '')
  }
  s = s || '整'
  n = Math.floor(n)
  for (let i = 0; i < unit[0].length && n > 0; i++) {
    let p = ''
    for (let j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p
      n = Math.floor(n / 10)
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
  }
  return s
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整')
}

/**
 * 打开浏览器全屏
 * @deprecated
 */
/* istanbul ignore next */
export function toFullScreen() {
  const element = document.body as any
  if (element.requestFullscreen) {
    element.requestFullscreen()
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen()
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen()
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullScreen()
  }
}

/**
 * 退出浏览器全屏
 * @deprecated
 */
/* istanbul ignore next */
export function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen()
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen()
  }
}

/**
 * 打开一个新的浏览器窗体
 * @param url
 * @param windowName
 * @param width
 * @param height
 * @deprecated
 */
/* istanbul ignore next */
export function openNewWindow(
  url: string,
  windowName: string,
  width: number,
  height: number
) {
  const x = parseInt(screen.width / 2.0 + '') - width / 2.0
  const y = parseInt(screen.height / 2.0 + '') - height / 2.0
  const isMSIE = navigator.appName == 'Microsoft Internet Explorer'
  if (isMSIE) {
    let p = 'resizable=1,location=no,scrollbars=no,width='
    p = p + width
    p = p + ',height='
    p = p + height
    p = p + ',left='
    p = p + x
    p = p + ',top='
    p = p + y
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    window.open(url, windowName, p)
  } else {
    const win = window.open(
      url,
      'ZyiisPopup',
      'top=' +
        y +
        ',left=' +
        x +
        ',scrollbars=' +
        scrollbars +
        ',dialog=yes,modal=yes,width=' +
        width +
        ',height=' +
        height +
        ',resizable=no'
    )
    //     new Function('try { win.resizeTo(width, height); } catch(e) { }')()
    eval('try { win.resizeTo(width, height); } catch(e) { }')
    win ? win.focus() : ''
  }
}

export function openWindow(
  url: string,
  opt?: {
    target?: TargetContext | string
    noopener?: boolean
    noreferrer?: boolean
  }
) {
  const { target = '__blank', noopener = true, noreferrer = true } = opt || {}
  const feature: string[] = []

  noopener && feature.push('noopener=yes')
  noreferrer && feature.push('noreferrer=yes')

  window.open(url, target, feature.join(','))
}

/**
 * 获取当前URL中的query对象
 * @param type 默认是'hash'（适用于vue等单页面富应用）
 * @returns
 * @deprecated
 */
export function getUrlQuery() {
  const paramHash = window.location.href.split('?')[1] || ''
  return qs.parse(paramHash)
}

/**
 * 获取浏览器版本信息
 * @returns
 */
/* istanbul ignore next */
export function getBrowserInfo() {
  const agent = navigator.userAgent.toLowerCase()
  // var regStr_ie = /msie [\d.]+;/gi;
  const regStrFF = /firefox\/[\d.]+/gi
  const regStrChrome = /chrome\/[\d.]+/gi
  const regStrSaf = /safari\/[\d.]+/gi
  const isIE = agent.indexOf('compatible') > -1 && agent.indexOf('msie') > -1 // 判断是否IE<11浏览器
  const isEdge = agent.indexOf('edge') > -1 && !isIE // 判断是否IE的Edge浏览器
  const isIE11 = agent.indexOf('trident') > -1 && agent.indexOf('rv:11.0') > -1
  if (isIE) {
    const reIE = new RegExp('msie (\\d+\\.\\d+);')
    reIE.test(agent)
    // eslint-disable-next-line
    var fIEVersion = parseFloat(RegExp['$1'])
    if (fIEVersion * 1 === 7) {
      return 'IE/7'
    } else if (fIEVersion * 1 === 8) {
      return 'IE/8'
    } else if (fIEVersion * 1 === 9) {
      return 'IE/9'
    } else if (fIEVersion * 1 === 10) {
      return 'IE/10'
    }
  } // isIE end
  if (isIE11) {
    return 'IE/11'
  }
  if (isEdge) {
    return 'IE/edge'
  }
  // firefox
  if (agent.indexOf('firefox') > 0) {
    return agent.match(regStrFF)
  }
  // Safari
  if (agent.indexOf('safari') > 0 && agent.indexOf('chrome') < 0) {
    return agent.match(regStrSaf)
  }
  // Chrome
  if (agent.indexOf('chrome') > 0) {
    return agent.match(regStrChrome)
  }
}

/**

/**
 * 根据传入的字符串的个数，来设置初始的宽和高
 * @param text 
 * @param fontSize 
 * @returns 
 */
/* istanbul ignore next */
export function textSize(text: string, fontSize = '14px') {
  const span = document.createElement('span')
  const result = {
    width: span.offsetWidth,
    height: span.offsetHeight,
  }
  span.style.visibility = 'hidden'
  span.style.fontSize = fontSize
  document.body.appendChild(span)

  if (typeof span.textContent != 'undefined') span.textContent = text || ''
  else span.innerText = text || ''

  result.width = span.offsetWidth - result.width
  result.height = span.offsetHeight - result.height
  span.parentNode && span.parentNode.removeChild(span)
  return result
}

/**************************下面的代码是封装promise请求**************************/
// export const awaitWrap = (promise: Promise<Result<any>>) =>
//   promise
//     .then(res => ({ success: res, error: null }))
//     .catch(err => ({ success: null, error: err }))

/**
 * 返回经过封装的promise或者函数，可以被注入到vue.prototype上
 * @param {function} func:(...args:any[])=>any
 * @returns {function}
 */
// const willInject = (func: (...args: any[]) => any, successCodes?: number[]) => {
//   if (['promise', 'function'].indexOf(getTypeOfValue(func)) > -1) {
//     return async (...funcParams: any[]) => {
//       const promiseTmp = func(...funcParams)
//       if (getTypeOfValue(promiseTmp) === 'promise') {
//         if (!successCodes || successCodes.length === 0) {
//           successCodes = [200, 0]
//         } else {
//           successCodes = [...successCodes]
//         }
//         const { success, error } = await awaitWrap(promiseTmp)
//         if (!success) {
//           _console.error(
//             `Oh..., There is an error with the network request ${error}`
//           )
//           return { data: null }
//         } else {
//           const { code = 200, message = '' } = success
//           if (successCodes.indexOf(code) > -1) {
//             return success
//           } else {
//             _console.error(
//               `The network request returns a data error-->${code}-->${message}`
//             )
//           }
//         }
//       } else {
//         return func
//       }
//     }
//   } else {
//     _console.warn(
//       `An unsupported format is detected and will be skipped, expected 'promise,function'`
//     )
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     return async (...funcParams: any[]) => {
//       return func
//     }
//   }
// }

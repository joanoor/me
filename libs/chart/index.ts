import type { EChartsOption } from 'echarts'
import type { CreateChartConfig } from './src/types'
import { IChart } from './src/Chart'
import { getDefaultChartOpt } from './src/BaseChart'

// @ts-ignore
// import echarts = require('echarts') // 因为echarts中使用的时export = 这种写法，所以这里采用这种方式重新导出echarts中的内容
// export default echarts

// import * as echarts from 'echarts'

import * as echarts from 'echarts'
export { echarts }

export { registerMap } from 'echarts'
export * from './src/types'
export * from './src/Chart'
export * from './src/BaseChart'

export function createChart(
  el: HTMLElement,
  opt: EChartsOption = {},
  config: CreateChartConfig = {}
) {
  let chart: IChart
  let chartOpt: EChartsOption
  const { chartType, theme, isRealRefresh, moreOpt } = config
  if (!chartType) {
    chart = new IChart(el, isRealRefresh, theme)
    chartOpt = opt
  } else {
    chart = new IChart(el, isRealRefresh, theme)
    chartOpt = getDefaultChartOpt(opt, chartType)
  }
  chart.setOption(chartOpt, moreOpt)
  return chart
}

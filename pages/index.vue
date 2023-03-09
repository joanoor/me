<template>
  <div class="weather">
    dddd
  </div>
</template>

<script setup lang="ts">
import { GDIp, Result, ResultLast5DayStruct } from '../types';
import midpoint from '@turf/midpoint'
import { points, Point, Feature } from '@turf/helpers'

definePageMeta({
  layout: false
})

const data = reactive({
  weather: {} as ResultLast5DayStruct | undefined
})

const config = useRuntimeConfig()

const onSuccess = ({coords}: GeolocationPosition) => {
  console.log('Success retrieve your location')
  getWeather(`${coords.longitude.toFixed(2)},${coords.latitude.toFixed(2)}`)
}

const onError = () => {
  console.warn('Unable to retrieve your location')
  getUserLatInt()
}

// 通过腾讯接口获取用户经纬度
const getUserLatInt = async () => {
  const { data: dataAmap } = await useFetch<GDIp>(`https://restapi.amap.com/v3/ip?key=${config.public.gd_private}`)
  const aPoints = dataAmap.value?.rectangle.split(';')
  let tmpPoints:[number,number][]=[]
  if (aPoints) {
    aPoints.forEach(v => {
      tmpPoints.push(v.split(',').map(v2=>+v2) as [number,number])
    })
    const { features } = points(tmpPoints)
    const {geometry:{coordinates}}=midpoint(features[0],features[0])
    getWeather(`${coordinates[0].toFixed(2)},${coordinates[1].toFixed(2)}`)
  }
}


// 通过知心天气api获取最新天气实况
const getWeather = async (city: string) => {
  const { data: weatherData } = await useFetch<Result<ResultLast5DayStruct[]>>(`https://api.qweather.com/v7/weather/now?key=${config.public.qWeather_private}&location=${city}`)

  // data.weather = weatherData.value?.results[0]
}

const getSunStatus = async (location: string) => {
  const { data: sunData } = await useFetch(`https://api.seniverse.com/v4?fields=sun&key=${config.public.seniverse_private}&locations=${location}`)
}

const getMoonStatus = async (location: string) => {
  const { data: sunData } = await useFetch(`https://api.seniverse.com/v4?fields=moon&key=${config.public.seniverse_private}&locations=${location}`)
}


const run = () => {
  if (hasSupportGeo()) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    })
  }
}



onMounted(() => {
  run()
})
</script>

<style scoped></style>
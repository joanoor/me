<template>
  <div class="weather">
    dddd
  </div>
</template>

<script setup lang="ts">
import { GDIp, Result, ResultLast5DayStruct } from '../types';

definePageMeta({
  layout: false
})

const data = reactive({
  weather: {} as ResultLast5DayStruct | undefined
})

const config = useRuntimeConfig()

const onSuccess = (position: GeolocationPosition) => {
  console.log('Success retrieve your location')
  getWeather(`${position.coords.latitude}:${position.coords.longitude}`)
}

const onError = () => {
  console.warn('Unable to retrieve your location')
  getUserLatInt()
}

// 通过腾讯接口获取用户经纬度
const getUserLatInt = async () => {
  const { data: dataAmap } = await useFetch<GDIp>(`https://restapi.amap.com/v3/ip?key=${config.public.gd_private}`)
  getWeather(dataAmap.value?.city || '')
  getSunStatus((dataAmap.value?.city || ''))
}


// 通过知心天气api获取最近5天的天气
const getWeather = async (location: string) => {
  const { data: weatherData } = await useFetch<Result<ResultLast5DayStruct[]>>(`https://api.seniverse.com/v3/weather/daily.json?key=${config.public.seniverse_private}&location=${location}&language=zh-Hans&unit=c&start=0&days=5`)

  data.weather = weatherData.value?.results[0]
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
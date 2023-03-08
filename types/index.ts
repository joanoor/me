export interface Result<T=any>{
  results:T
}

export interface DayWeatherStruct {
  code_day: string
  code_night: string
  date: string
  high: string
  humidity: string
  low: string
  precip: string
  rainfall: string
  text_day: string
  text_night: string
  wind_direction: string
  wind_direction_degree: string
  wind_scale: string
  wind_speed: string
}

export interface ResultLast5DayStruct {
    daily: DayWeatherStruct[]
    last_update: string
    location: {
      country: string
      id: string
      name: string
      path: string
      timezone: string
      timezone_offset: string
    }
}

export interface GDIp {
  adcode: string
  city: string
  info: string
  infocode: string
  province: string
  rectangle: string
  status: string
}

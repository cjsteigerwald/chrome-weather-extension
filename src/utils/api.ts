const OPEN_WEATHER_API_KEY = 'e88dc2d977a365c830800b8dbe280475'

export interface OpenWeatherData {
  name: string;
  main: {
    feels_like: number;
    humidity: number;
    pressure: number;
    temp: number;
    temp_max: number;
    temp_min: number;
  }
  weather: {
    description: string;
    icon: string;
    id: number;
    main: string;
  }[]
  wind: {
    speed: number;
    degree: number;
  }
}

export type OpenWeatherTempScale = 'metric' | 'imperial';


export const fetchOpenWeatherData = async (city: string, tempScale: OpenWeatherTempScale): Promise<OpenWeatherData>  => {
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${tempScale}&appid=${OPEN_WEATHER_API_KEY}`)

  if (!res.ok) {
    throw new Error('City not found');
  }

  const data: OpenWeatherData = await res.json()
  return data;
};
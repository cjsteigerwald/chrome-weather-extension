import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardActions, Typography, Box, Button} from '@material-ui/core';
import './WeatherCard.css';
import { fetchOpenWeatherData, OpenWeatherData, OpenWeatherTempScale } from '../../utils/api';

const WeatherCardContainer: React.FC<{
  children: React.ReactNode
  onDelete?: () => void;
}> = ({ children, onDelete }) => {
  return (
    <Box sx={({ mx: '4px', my: '16px' })}>
      <Card>
        <CardContent>
          {children}
        </CardContent>
        <CardActions>
          {
            onDelete && 
            <Button size='small' color='secondary' onClick={onDelete}>Delete</Button>
          }          
        </CardActions>
      </Card>
    </Box>
  )
}

type WeatherCardState = 'loading' | 'error' | 'ready';

const WeatherCard: React.FC<{
  city: string;
  tempScale: OpenWeatherTempScale;
  onDelete?: () => void;
}> = ({ city, onDelete, tempScale }) => {
  const [weatherData, setWeatherData] = useState<OpenWeatherData | null>(null);
  const [cardState, setCardState] = useState<WeatherCardState>('loading')

  useEffect(() => {
    fetchOpenWeatherData(city, tempScale)
      .then((data) => {
        setWeatherData(data)
        setCardState('ready');
      })
      .catch((err) => setCardState('error'))
  }, [city, tempScale]) // useEffect

  if(cardState == 'loading' || cardState == 'error') {
    return (
      <WeatherCardContainer onDelete={onDelete}>
        <Typography variant="body1">
          {
            cardState == 'loading' ? 'Loading...' : 'Error: could not retrieve weather data for this city'          
          }
        </Typography>
      </WeatherCardContainer>
    )
  }

  return (
    <WeatherCardContainer onDelete={onDelete}>
      <Typography variant="h5">{weatherData.name}</Typography>
      <Typography variant="body1">{Math.round(weatherData.main.temp)}</Typography>
      <Typography variant="body1">Feels like: {Math.round(weatherData.main.feels_like)}</Typography>
    </WeatherCardContainer>
  )
}

export default WeatherCard;

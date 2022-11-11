import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Box, Grid, InputBase, IconButton, Paper } from '@material-ui/core';
import { Add as AddIcon, PictureInPicture as PictureInPictureIcon} from '@material-ui/icons';
import 'fontsource-roboto'
import './popup.css';
import WeatherCard from '../components/WeatherCard';
import { setStoredCities, getStoredCities, setStoredOptions, getStoredOptions, LocalStorageOptions } from '../utils/storage';
import { Messages } from '../utils/messages';

const App: React.FC<{}> = () => {
  const [cities, setCities] = useState<string[]>([])
  const [cityInput, setCityInput] = useState<string>('')
  const [options, setOptions] = useState<LocalStorageOptions | null>(null)

  useEffect(() => {
    getStoredCities()
      .then(cities => {
        setCities(cities)
      })
    getStoredOptions()
      .then((options) => {
        setOptions(options)})
  }, [])


  const handleCityButtonClick = () => {
    if (cityInput === '') {
      return
    }
    const updatedCities = [ ...cities, cityInput ]
    setStoredCities(updatedCities)
      .then(() => {
        setCities(updatedCities)
        setCityInput('')
      })
  }

  const handleCityDeleteButton = (index: number) => {    
    cities.splice(index, 1);
    const updatedCities = [...cities];
    setStoredCities(updatedCities)
      .then(() => {
        setCities(updatedCities)
      })
  }

  const handleTempScaleButtonClick = () => {
    const updateOptions: LocalStorageOptions = {
      ...options,
      tempScale: options.tempScale === 'metric' ? 'imperial' : 'metric',
    }
    setStoredOptions(updateOptions).then(() => {
      setOptions(updateOptions);
    })
  }

  const handleOverlayButtonClick = () => {
    chrome.tabs.query({
      active: true,
      currentWindow: true,
    }, (tabs) => {
      if (tabs.length > 0) {
        console.log('tab id: ', tabs[0].id)
        chrome.tabs.sendMessage(tabs[0].id, Messages.TOGGLE_OVERLAY)
      }
    })
  }

  if (!options) {
    return null;
  }

  return (
    <Box sx={({ mx: '8px', my: '16px' })}>
      <Grid container justifyContent='space-evenly'>
        <Grid item>
          <Paper>
            <Box sx={({ px: '15px', py: '5px' })}>
            <InputBase placeholder='Add a city name' value={cityInput} onChange={(event) => setCityInput(event.target.value)}/>
            <IconButton onClick={handleCityButtonClick}>
              <AddIcon />
            </IconButton>
            </Box>
          </Paper>
        </Grid>
        <Grid item>
          <Paper>
            <Box py='3px'>
              <IconButton onClick={handleTempScaleButtonClick}>
                {options.tempScale === 'metric' ? '\u2103' : '\u2109'}
              </IconButton>
            </Box>
          </Paper>
        </Grid>        
          <Grid item>
            <Paper>
              <Box py='5px'>
                <IconButton onClick={handleOverlayButtonClick}>
                  <PictureInPictureIcon />
                </IconButton>
              </Box>
            </Paper>
          </Grid>        
      </Grid>
      {
        options.homeCity != '' &&
        <WeatherCard city={options.homeCity} tempScale={options.tempScale}></WeatherCard>
      }
      {
        cities.map((city, index) => (
          <WeatherCard 
            city={city}
            tempScale={options.tempScale}
            key={index} 
            onDelete={() => handleCityDeleteButton(index)} />))
      }
      <Box height='16px' />
    </Box>
  )
}

const container = document.createElement('div')
document.body.appendChild(container)
const root = createRoot(container)
root.render(<App />)

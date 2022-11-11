import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Box, Button, Card, CardContent, Grid, Switch, TextField, Typography } from '@material-ui/core'
import 'fontsource-roboto'
import './options.css'
import { getStoredOptions, LocalStorageOptions, setStoredOptions } from '../utils/storage'

type FormState = 'ready' | 'saving';

const App: React.FC<{}> = () => {
  const [options, setOptions] = useState<LocalStorageOptions | null>(null)
  const [formState, setFromState] = useState<FormState>('ready')

  useEffect(() => {
    getStoredOptions().then((options) => {
      setOptions(options)
    })
  }, []) // useEffect

  const handleHomeCityChange = (homeCity: string) => {
    console.log(homeCity)
    setOptions({
      ...options,
      homeCity,
    })
  }

  const handleSaveButtonClick = () => {
    setFromState('saving');
    setStoredOptions(options).then(() => {
      setTimeout(() => {
      setFromState('ready');
      }, 1000)
    })
  }

  const handleAutoOverlayChange = (hasAutoOverlay: boolean) => {
    setOptions({
      ...options,
      hasAutoOverlay,
    })
  }

  if (!options) {
    return null;
  }

  const isFieldDisabled = formState === 'saving'

  return (
    <Box mx="10%" my="2%">
      <Card>
        <CardContent>
          <Grid container direction='column' spacing={4}>
            <Grid item>
              <Typography variant='h4'>Weather Extension Options</Typography>
            </Grid>
            <Grid item>
              <Typography variant='body1'>Home city name</Typography>
              <TextField 
                placeholder='Enter a home city' 
                value={options.homeCity} 
                onChange={event => handleHomeCityChange(event.target.value)}
                disabled={isFieldDisabled}
              />
            </Grid>
            <Grid item>
              <Typography variant='body1'>Auto toggle overlay on web page:</Typography>
              <Switch 
                color='primary'
                checked={options.hasAutoOverlay}
                onChange={(event, checked) => handleAutoOverlayChange(checked)}
                disabled={isFieldDisabled}
              />
            </Grid>
            <Grid item>
              <Button 
                variant='contained' 
                color='primary'
                onClick={handleSaveButtonClick}
                disabled={isFieldDisabled}
              >{formState === 'ready' ? 'Save' : 'Saving...'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}

const container = document.createElement('div')
document.body.appendChild(container)
const root = createRoot(container)
root.render(<App />)

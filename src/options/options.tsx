import React from 'react'
import { createRoot } from 'react-dom/client'
import 'fontsource-roboto'
import './options.css'

const App: React.FC<{}> = () => {
  return (
    <div>
      <img src="icon.png" />
    </div>
  )
}

const container = document.createElement('div')
document.body.appendChild(container)
const root = createRoot(container)
root.render(<App />)

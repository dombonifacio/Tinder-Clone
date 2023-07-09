import { useState } from 'react'


// react router dom
import { useRoutes } from 'react-router-dom'


import './App.css'

function App() {
  const [count, setCount] = useState(0)

  let element = useRoutes([
    {
      path: '/',
      element
    }
  ])

  
}

export default App

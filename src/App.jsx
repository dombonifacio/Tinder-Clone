import { useState } from 'react'


// react router dom
import { useRoutes } from 'react-router-dom'


import './App.css'
import { LoginPage } from './pages/loginPage'
import { HomePage } from './pages/HomePage'

function App() {
  const [count, setCount] = useState(0)

  let element = useRoutes([
    {
      path: '/',
      element: <LoginPage />
    },
    {
      path: '/home',
      element: <HomePage />
    }
  ])

  return element;

  
}

export default App

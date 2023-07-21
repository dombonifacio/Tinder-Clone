// hooks
import { useState } from 'react'

// react router dom
import { useRoutes } from 'react-router-dom'
import './App.css'

// contexts
import { UserInfoContext } from './context/UserInfoContext'

// pages
import { LoginPage } from './pages/loginPage'
import { HomePage } from './pages/HomePage'
import { EnterAgePage } from './pages/EnterAgePage'
import { EnterNamePage } from './pages/EnterNamePage'
import { EnterGenderPage } from './pages/EnterGenderPage'
import { EnterInterestsPage } from './pages/EnterInterestsPage'
import { ProfilePage } from './pages/ProfilePage'

function App() {
  
  const [userInfo, setUserInfo] = useState({})

  let element = useRoutes([
    {
      path: '/',
      element: <LoginPage />
    },
    {
      path: '/home',
      element: <HomePage />
    },
    {
      path: '/enterName',
      element: <EnterNamePage />
    },
    {
      path: '/enterAge',
      element: <EnterAgePage />
    },
    {
      path: '/enterGender',
      element: <EnterGenderPage />
    },
    {
      path: '/enterInterests',
      element: <EnterInterestsPage />
    },
    {
      path: '/profile',
      element: <ProfilePage />
    }
  ])


  return (
    <UserInfoContext.Provider value={{userInfo, setUserInfo}}>

      {element}
    </UserInfoContext.Provider>
  )

  
}

export default App

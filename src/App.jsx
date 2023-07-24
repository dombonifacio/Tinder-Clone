// hooks
import { useState } from 'react'

// react router dom
import { useRoutes, useNavigate } from 'react-router-dom'
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
import { useLocalStorage } from './hooks/useLocalStorage'


function App() {
  
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState({
    name: null,
    age: null,
    gender: null,
    interests: null
  })
  const [ user ] = useLocalStorage('user', null)
  // check if profile is created or not

  const isProfileCreated = Object.values(userInfo).every(value => {
    if (value === null){
      return false
    }
   
    return true
  })
  console.log('user info', userInfo)
  console.log(isProfileCreated ? 'profile is created' : 'profile is not created')
  // if user is logged in but no profile created yet, navigate them back to the enter name page
  // if user is logged in and profile is created, navigate them to the profile page
  let element = useRoutes([
    {
      path: '/',
      element: user && isProfileCreated ? <ProfilePage /> : <LoginPage />
    },
    // {
    //   path: '/home',
    //   element: <HomePage />
    // },
    {
      path: '/login',
      element: <LoginPage />
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

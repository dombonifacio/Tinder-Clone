// hooks
import { useContext, useEffect, useState } from 'react'

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
import { LoadingComponent } from './components/LoadingComponent'
import { auth } from './config/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { SignupPage } from './pages/SignupPage'
import { UserExistContext } from './context/UserExistContext'
import { UserSignedUpContext } from './context/UserSignedUpContext'
import { UserLoggedInContext } from './context/UserLoggedInContext'
import { EnterPhotosPage } from './pages/EnterPhotosPage'



function App() {
  
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState({
    name: null,
    age: null,
    gender: null,
    interests: null
  })
  const [value, setValue] = useLocalStorage('user', null)
  const [ profile, setProfile ] = useLocalStorage('profile', null)
  const [loading, setLoading] = useState(false)
  const [ userExists, setUserExists] = useState(false)
  const [ userSignedUp, setUserSignedUp ] = useState(false)
  const [ userIsLoggedIn, setUserIsLoggedIn ] = useState(false)
  useEffect(() => {
    if(userInfo.images){

      console.log('user info inside app.jsx', userInfo)
    }
  }, [userInfo])
  let element = useRoutes([
    {
      path: '/',
      // show homep
      element: userIsLoggedIn && userExists && !userSignedUp ? <HomePage /> : <LoginPage />
    },
    {
      path: '/signup',
      element: <SignupPage />
    },
    {
      path: '/home',
      element: <HomePage />
    },
    {
      path: '/enterName',
      element: userSignedUp ? <EnterNamePage /> : <LoginPage />
    },
    {
      path: '/enterAge',
      element:  userSignedUp ? <EnterAgePage /> : <LoginPage />
    },
    {
      path: '/enterGender',
      element: userSignedUp ? <EnterGenderPage /> : <LoginPage />
    },
    {
      path: '/enterInterests',
      element: userSignedUp ? <EnterInterestsPage /> : <LoginPage />
    },
    {
      path: '/enterPhotos',
      element: <EnterPhotosPage />
    },
    {
      path: '/profile',
      element: userIsLoggedIn && userExists && !userSignedUp ? <ProfilePage /> : <LoginPage />
    }
  ]);

  if (loading) {
    return <LoadingComponent />;
  }



  return (
    <UserLoggedInContext.Provider value={{userIsLoggedIn, setUserIsLoggedIn}}>
      <UserExistContext.Provider value={{userExists, setUserExists}}>
        <UserInfoContext.Provider value={{userInfo, setUserInfo}}>
          <UserSignedUpContext.Provider value={{userSignedUp, setUserSignedUp}}>

            {element}
          </UserSignedUpContext.Provider>
        </UserInfoContext.Provider>
      </UserExistContext.Provider>
    </UserLoggedInContext.Provider>
  )

  
}

export default App

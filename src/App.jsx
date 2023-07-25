// hooks
import { useEffect, useState } from 'react'

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


function App() {
  
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState({
    name: null,
    age: null,
    gender: null,
    interests: null
  })
  const [ user, setUser ] = useLocalStorage('user', null)
  const [ profile, setProfile ] = useLocalStorage('profile', null)
  const [loading, setLoading] = useState(false)

  // tracks a user auth state
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user){
        console.log("user is logged in")
        setUser(user)
      } else {
        setUser(null)
      }
    })
  }, [])
  
  let element = useRoutes([
    {
      path: '/',
      element: user && profile ? <HomePage /> : (user && !profile ? <EnterNamePage /> : <LoginPage />)
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
  ]);

  if (loading) {
    return <LoadingComponent />;
  }



  return (
    <UserInfoContext.Provider value={{userInfo, setUserInfo}}>
        
        {element}
    </UserInfoContext.Provider>
  )

  
}

export default App

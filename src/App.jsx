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
import { SignupPage } from './pages/SignupPage'



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

    

    useEffect(()=>{
      onAuthStateChanged(auth, (user) => {
        if (user){
            setUser(user)
            console.log("user is logged in")
        } else {
            console.log('user is logged out')
            setUser(null)
            setProfile(null)
        
        }
        })
    }, [user])

  
  let element = useRoutes([
    {
      path: '/',
      // show homep
      element: user && !profile ? <HomePage /> : <LoginPage />
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
      element: <EnterNamePage /> 
    },
    {
      path: '/enterAge',
      element:  <EnterAgePage /> 
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
      element: user ? <ProfilePage /> : <LoginPage />
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

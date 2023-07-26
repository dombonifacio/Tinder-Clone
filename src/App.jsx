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
  const [ userExists, setUserExists] = useState(false)
  const [ userSignedUp, setUserSignedUp ] = useState(false)
    // tracks a user auth state
    useEffect(()=>{
      onAuthStateChanged(auth, (user) => {
        if (user){
            setUser(user)
            console.log("user is logged in")
        } else {
            console.log('user is logged out')
            setUserExists(false)
            
            setUser(null)
            setProfile(null)
        
        }
        })
    }, [user])

    // if user just signed up within the enter interests page, setUserSignedUp true
    // they will then be navigated to the login page
    // once they hit the sign in setUserSignedUp to false



    console.log('user exists', userExists)
    console.log('user just signed up', userSignedUp)
  let element = useRoutes([
    {
      path: '/',
      // show homep
      element: user && userExists && !userSignedUp ? <HomePage /> : <LoginPage />
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
    <UserExistContext.Provider value={{userExists, setUserExists}}>
      <UserInfoContext.Provider value={{userInfo, setUserInfo}}>
        <UserSignedUpContext.Provider value={{userSignedUp, setUserSignedUp}}>

          {element}
        </UserSignedUpContext.Provider>
      </UserInfoContext.Provider>
    </UserExistContext.Provider>
  )

  
}

export default App

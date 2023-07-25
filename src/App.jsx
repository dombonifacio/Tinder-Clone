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


function App() {
  
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState({
    name: null,
    age: null,
    gender: null,
    interests: null
  })
  const [ user ] = useLocalStorage('user', null)
  const [ profile ] = useLocalStorage('profile', null)
  const [loading, setLoading] = useState(true)
  const hasUserAndProfile = user !== null && profile !== null
  useEffect(() => {
    
    const checkUserAndProfile = () => {
      if (user && profile) {
        setLoading(false); 
        navigate('/')
      } else {
        navigate('/')
        setTimeout(() => setLoading(false), 1000);
        
      }1
    };

    checkUserAndProfile();
  }, [user, profile]);

  useEffect(() => {
    if (user && !profile){
      navigate('/enterName')
    }
  }, [user])
 
  const handleLogout = () => {
    setUserInfo({
      name: null,
      age: null,
      gender: null,
      interests: null,
    });
    localStorage.removeItem('user');
    localStorage.removeItem('profile');
    navigate('/');
  };


  // if user is logged in but no profile created yet, navigate them back to the enter name page
  // if user is logged in and profile is created, navigate them to the profile page
  let element = useRoutes([
    {
      path: '/',
      element: user && profile ? <ProfilePage /> : <LoginPage />
    },
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

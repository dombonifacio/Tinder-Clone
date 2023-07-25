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
  const [ user, setUser ] = useLocalStorage('user', null)
  const [ profile, setProfile ] = useLocalStorage('profile', null)
  const [loading, setLoading] = useState(false)

  
  // if user is created but no profile is created yet, navigate them to the /enterName page
  // else if user is created and profile are created, show them the <ProfilePage /> component
  // else (if no user and profile created), show them the <LoginPage /> component

  // only navigate user to the /enterName page if only user has been creaetd
  
  // only navigate to /profilePage if user is created and profile is created
  

  // if user is logged in but no profile created yet, navigate them back to the enter name page
  // if user is logged in and profile is created, navigate them to the profile page
  

  // if there is user and profile, go to the homepage
  // else if there is user but not profile, only show enterName page
  // 
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === 'profile') {
        setUser(JSON.parse(localStorage.getItem('user')));
        setProfile(JSON.parse(localStorage.getItem('profile')));
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [setUser, setProfile]);
  useEffect(() => {
    if (!user) {
      console.log('there is no user! app jsx here')
      navigate('/');
    } else {
      console.log('there is user! on app')
    }
  }, [user]);

  // const check = () => {
  //   if (user && !profile){
  //     return <EnterNamePage />
  //   } else if (user && profile){
  //     return <HomePage />
  //   }
  //   else {
  //     <LoginPage />
  //   }
  // }
  
  let element = useRoutes([
    {
      path: '/',
      element: user && profile ? <HomePage /> : <LoginPage />
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

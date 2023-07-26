
// logos
import { useNavigate } from 'react-router-dom'
import logo from '../assets/icons/logo.svg'

//hooks 
import { useLocalStorage } from "../hooks/useLocalStorage"
import { useEffect, useState } from 'react'

// icons
import { BsFillPersonFill } from 'react-icons/bs'
// firebase
import { auth } from "../config/firebase"
import { signOut, onAuthStateChanged } from 'firebase/auth'


export const NavbarComponent = () =>{
    const [ user, setUser ] = useLocalStorage('user', null)
    const [ profile, setProfile ] = useLocalStorage('profile', null)
    const navigate = useNavigate()
    const handleSignOut = () => {
        // if signout is successful, navigate them back to the login page
        signOut(auth).then(() => {
          
                console.log('user signed out')
                setTimeout(() => {

                    setUser(null)
                    setProfile(null)
                    navigate('/')
                }, 2000)
                
                // console.log('User and profile cleared from local storage.');
                // navigate('/')
   
        }).catch((error) => console.log(error))
    }

    const handleNavigateProfilePage = () => {
        navigate('/profile')
    }
    


    
    return (
        <div className='flex items-center justify-center gap-x-5 fixed bottom-0'>
            <button onClick={handleSignOut}>Sign out</button>
            <button>

                <img src={logo} className='w-[2rem] h-[2rem]'/>
            </button>
            <button onClick={handleNavigateProfilePage}>

                <BsFillPersonFill size={"2rem"}/>
            </button>
        </div>
    )
} 
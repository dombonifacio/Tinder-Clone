
// logos
import { useNavigate } from 'react-router-dom'
import logo from '../assets/icons/logo.svg'


//hooks 
import { useLocalStorage } from "../hooks/useLocalStorage"
import { useContext, useEffect, useState } from 'react'

// icons
import { BsFillPersonFill } from 'react-icons/bs'
// firebase
import { auth } from "../config/firebase"
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { UserLoggedInContext } from '../context/UserLoggedInContext'


export const NavbarComponent = () =>{
    const [value, setValue] = useLocalStorage("user", null)
    const { userIsLoggedIn, setUserIsLoggedIn } = useContext(UserLoggedInContext)
    const navigate = useNavigate()
    const handleSignOut = () => {
        // if signout is successful, navigate them back to the login page
        signOut(auth).then(() => {
            console.log('user signed out')
            setValue(null)
            
            navigate('/')
                
        }).catch((error) => console.log(error))
    }

    useEffect(() => {
        if (!value){
            setUserIsLoggedIn(false)
        }
    }, [value])

    const handleNavigateProfilePage = () => {
        navigate('/profile')
    }
    return (
      
        <div className='flex  items-center justify-center gap-x-5  left-0 w-full px-4  py-2 sm:px-0'>
            <button onClick={handleSignOut}>Sign out</button>
            <button className='flex'>

                <img src={logo} className='w-[2rem] h-[2rem]'/>
               
            </button>
            <button onClick={handleNavigateProfilePage}>
            
                <BsFillPersonFill size={"2rem"} color='grey'/>
            </button>
        </div>
           

    )
} 
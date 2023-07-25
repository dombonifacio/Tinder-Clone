import { auth } from "../config/firebase"
import { signOut } from 'firebase/auth'
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from 'react'

import { useLocalStorage } from "../hooks/useLocalStorage"
import { IoIosSettings } from 'react-icons/io'

export const HomePage = () => {
    
    const navigate = useNavigate();
    
    const [ user, setUser ] = useLocalStorage('user', null)
    const [ profile, setProfile ] = useLocalStorage('profile', null)
    const handleSignOut = () => {
        // if signout is successful, navigate them back to the login page
        signOut(auth).then(() => {
            setUser(null)
            setProfile(null)
         
            console.log('user signed out');
           
            setTimeout(() => {
               
                navigate('/')
            }, 2000)
            
          
        }).catch((error) => console.log(error))
    }
    console.log(user, 'user on the home page')
    return (
        <div>
            You are on the home page
            <p>{auth.currentUser?.displayName}</p>

            <button onClick={handleSignOut}>Sign out</button>
        </div>
    )
}
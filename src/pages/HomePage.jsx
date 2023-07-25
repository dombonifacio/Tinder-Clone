import { auth } from "../config/firebase"
import { signOut } from 'firebase/auth'

import { useEffect, useState } from 'react'


import { IoIosSettings } from 'react-icons/io'
import { NavbarComponent } from "../components/NavbarComponent"

export const HomePage = () => {
    return (
        <div>
            You are on the home page
           
            <NavbarComponent />
        </div>
    )
}
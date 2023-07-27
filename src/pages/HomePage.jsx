import { auth, db } from "../config/firebase"
import { getDocs, collection, getDoc, onSnapshot } from "firebase/firestore"
import { signOut } from 'firebase/auth'

import { useEffect, useState } from 'react'


import { IoIosSettings } from 'react-icons/io'
import { NavbarComponent } from "../components/NavbarComponent"

export const HomePage = () => {
    const usersCollectionRef = collection(db, "users")
    const [users, setUsers] = useState([])
    useEffect(() => {
        const getUsersData = onSnapshot(usersCollectionRef, (doc) => {
            const readableUsersData = doc.docs.map((userInfo) => {
                return {...userInfo.data(), id: userInfo.id}
            })
            setUsers(readableUsersData)
        })

        return () => {
           
            getUsersData()
        }
    }, [])
    console.log('available users', users)
    return (
        <div>
            You are on the home page
            {users.map((user) => {
                return (
                    
                    <div>
                        {user.id}
                    </div>
                )
            })}
            <NavbarComponent />

        </div>
    )
}
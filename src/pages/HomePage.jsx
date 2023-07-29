import { auth, db } from "../config/firebase"
import { getDocs, collection, getDoc, onSnapshot } from "firebase/firestore"
import { signOut } from 'firebase/auth'

import { useEffect, useState } from 'react'


import { IoIosSettings } from 'react-icons/io'
import { NavbarComponent } from "../components/NavbarComponent"

export const HomePage = () => {
    const usersCollectionRef = collection(db, "users")
    const [users, setUsers] = useState([])
    const currentUser = auth.currentUser
    useEffect(() => {
        const getUsersData = onSnapshot(usersCollectionRef, (doc) => {
            const readableUsersData = doc.docs.map((userInfo) => {
                return {...userInfo.data()}
            })
            const removeCurrentUser = readableUsersData.filter(({userInfo}) => userInfo.id !== currentUser.uid)
            setUsers(removeCurrentUser)
        })

        return () => {
           
            getUsersData()
        }
    }, [])
    
    console.log('users', users)
    
    return (
        <div>
            You are on the home page
            {users.map((user, index) => {
                return (
                    
                    <div key={index}>
                        {user.userInfo.id}
                    </div>
                )
            })}
            <NavbarComponent />
        </div>
    )
}
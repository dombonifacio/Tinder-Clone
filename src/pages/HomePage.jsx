// database
import { auth, db } from "../config/firebase"
import { getDocs, collection, getDoc, onSnapshot, doc } from "firebase/firestore"
import { signOut } from 'firebase/auth'
// hooks
import { useEffect, useState, useMemo, useRef } from 'react'

import React from "react"

// icons

// components
import { NavbarComponent } from "../components/NavbarComponent"
import { TinderCards } from "../components/TinderCards"
import { FooterComponent } from "../components/FooterComponent"



export const HomePage = () => {
     // dummy data

     const dummyData = [
        {
            "name": "Object 1",
            "url": "https://images.unsplash.com/photo-1682685796965-9814afcbff55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        },
        {
            "name": "Object 2",
            "url": "https://plus.unsplash.com/premium_photo-1681412205172-8c06ca667689?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
        },
        {
            "name": "Object 3",
            "url": "https://images.unsplash.com/photo-1690552404017-8f262bf8658b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
        },
        {
            "name": "Object 4",
            "url": "https://images.unsplash.com/photo-1690484813045-d27df776bc8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
        },
        {
            "name": "Object 5",
            "url": "https://images.unsplash.com/photo-1690381527500-4997fb084cc0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80"
        }
    ]


    const [users, setUsers] = useState([])
    const [ swipedRightByUsers, setSwipedRightByUsers ] = useState([])
    const currentUser = auth.currentUser

    const getSwipesData = async () => {

        const data = collection(db, "swipes", currentUser.uid, "swipedRight")
        const dataTwo = await getDocs(data)

        const swipedRightData = dataTwo.docs.map((doc) => ({
            ...doc.data(), id: doc.id
        }))
        
        setSwipedRightByUsers(swipedRightData)
    }

    useEffect(() => {
        const usersCollectionRef = collection(db, "users")
        const swipesCollectionRef = collection(db, "swipes")
        const getUsersData = onSnapshot(usersCollectionRef, (doc) => {
            const readableUsersData = doc.docs.map((userInfo) => {
              // add the isSwiped
                return {...userInfo.data(), isSwipedRight: false, isSwipedLeft: false, isSwipedUp: false}
            })
            const removeCurrentUser = readableUsersData.filter((userInfo) => userInfo.id !== currentUser.uid)
            setUsers(removeCurrentUser)
        })
        return () => {
           
            getUsersData()
            getSwipesData()
        }
    }, [])

    console.log('ids')
    useEffect(() => {
        if (swipedRightByUsers){
            // only get users from users array if their user.id do not match with any of the swipedRIghtByUsersArray
            const removedSwipedUsers = users.filter((user) => !swipedRightByUsers.some((swipedUsers) => swipedUsers.id === user.id))
            setUsers(removedSwipedUsers)
            console.log('checking if users are in the swiped users', removedSwipedUsers)
            console.log('Swiped Right Array by the current user', swipedRightByUsers)
        }

    }, [swipedRightByUsers])
    
    return (
        <>
            <div className="">

              
                <TinderCards data={users} setData={setUsers} swipedRightData={swipedRightByUsers}/>
     
            
            </div>
            
            <NavbarComponent />
        </>
    )
}
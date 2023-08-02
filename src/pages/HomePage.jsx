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
     
    const [users, setUsers] = useState([])
    const [ swipedRightByUsers, setSwipedRightByUsers ] = useState([])
    const [ swipedLeftByUsers, setSwipedLeftByUsers ] = useState([])
    const [ swipedUpByUsers, setSwipedUpByUsers ] = useState([])
    const [ profile, setProfile ] = useState({})
    const currentUser = auth.currentUser?.uid

    const profileDocRef = doc(db, "users", currentUser)
    const getProfile = async () => {
        const profile = await getDoc(profileDocRef)
        if (profile.exists()){
            setProfile(profile.data())
        } else {
            console.log('profile is not there')
        }
    }

    const getSwipesData = async () => {

        // referring to each sub cols depending on the direction
        const swipedRightSubColRef = collection(db, "swipes", currentUser, "swipedRight")
        const swipedLeftSubColRef = collection(db, "swipes", currentUser, "swipedLeft")
        const swipedUpSubColRef = collection(db, "swipes", currentUser, "swipedUp")
        
        const swipedRightSnapshot = onSnapshot(swipedRightSubColRef, (snapshot) => {
            const readableSwipedRightData = snapshot.docs.map((doc) => (
                {...doc.data(), id: doc.id}
            ))
            setSwipedRightByUsers(readableSwipedRightData)
        })

        const swipedLeftSnapshot = onSnapshot(swipedLeftSubColRef, (snapshot) => {
            const readableSwipedLeftData = snapshot.docs.map((doc) => (
                {...doc.data(), id: doc.id}
            ))
            setSwipedLeftByUsers(readableSwipedLeftData)
        })

        const swipedUpSnapshot = onSnapshot(swipedUpSubColRef, (snapshot) => {
            const readableSwipedUpData = snapshot.docs.map((doc) => (
                {...doc.data(), id: doc.id}
            ))
            setSwipedUpByUsers(readableSwipedUpData)
        })


        return () => {
            swipedRightSnapshot()
            swipedLeftSnapshot()
            swipedUpSnapshot()

        }
    }

    useEffect(() => {
        const usersCollectionRef = collection(db, "users")
        const swipesCollectionRef = collection(db, "swipes")
        const getUsersData = onSnapshot(usersCollectionRef, (doc) => {
            const readableUsersData = doc.docs.map((userInfo) => {
              // add the isSwiped
                return {...userInfo.data(), isSwipedRight: false, isSwipedLeft: false, isSwipedUp: false}
            })
            const removeCurrentUser = readableUsersData.filter((userInfo) => userInfo.id !== currentUser)
            setUsers(removeCurrentUser)
        })
        return () => {
           
            getUsersData()
            getSwipesData()
            getProfile()
        }
    }, [])

    useEffect(() => {
        if (swipedRightByUsers || swipedLeftByUsers || swipedUpByUsers){
            // only get users from users array if their user.id do not match with any of the swipedRIghtByUsersArray
            // only return the users if the some returns false
            const combinedSwipedUsers = [...swipedRightByUsers, ...swipedLeftByUsers, ...swipedUpByUsers];
            const removedSwipedUsers = users.filter((user) => !combinedSwipedUsers.some((swipedUsers) => swipedUsers.id === user.id))
            setUsers(removedSwipedUsers)
            

        }

    }, [swipedRightByUsers, swipedLeftByUsers, swipedUpByUsers])

   
    

    return (
        <>
            <div className="">

              
                <TinderCards data={ users && users} setData={setUsers} profile={profile}/>
     
            
            </div>
            
            <NavbarComponent />
        </>
    )
}
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
    const [ swipedLeftByUsers, setSwipedLeftByUsers ] = useState([])
    const [ swipedUpByUsers, setSwipedUpByUsers ] = useState([])
    const currentUser = auth.currentUser.uid

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

        // // getting the docs
        // const swipedRightSubColDocs = await getDocs(swipedRightSubColRef)
        // const swipedLeftSubColDocs = await getDocs(swipedLeftSubColRef)
        // const swipedUpSubColDocs = await getDocs(swipedUpSubColRef)


        // const swipedRightReadableDocs = swipedRightSubColDocs.docs.map((doc) => ({
        //     ...doc.data(), id: doc.id
        // }))
        // const swipedLeftReadableDocs = swipedLeftSubColDocs.docs.map((doc) => ({
        //     ...doc.data(), id: doc.id
        // }))
        // const swipedUpReadableDocs = swipedUpSubColDocs.docs.map((doc) => ({
        //     ...doc.data(), id: doc.id
        // }))
        
        // setSwipedRightByUsers(swipedRightReadableDocs)
        // setSwipedLeftByUsers(swipedLeftReadableDocs)
        // setSwipedUpByUsers(swipedUpReadableDocs)
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

              
                <TinderCards data={ users && users} setData={setUsers} swipedRightData={swipedRightByUsers}/>
     
            
            </div>
            
            <NavbarComponent />
        </>
    )
}
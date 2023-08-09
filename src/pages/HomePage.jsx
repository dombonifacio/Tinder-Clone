// database
import { auth, db } from "../config/firebase"
import { getDocs, collection, getDoc, onSnapshot, doc } from "firebase/firestore"
import { signOut } from 'firebase/auth'
// hooks
import { useEffect, useState, useMemo, useRef, useContext } from 'react'

import React from "react"

// icons

// components
import { NavbarComponent } from "../components/NavbarBotComponent"
import { TinderCards } from "../components/TinderCards"
import { FooterComponent } from "../components/FooterComponent"
import { LoadingComponent } from "../components/LoadingComponent"
import { NavbarTopComponent } from "../components/NavbarTopComponent"
import { ShowSettingsContext } from "../context/ShowSettingsContext"
import { SettingsComponent } from "../components/SettingsComponent"
import { MatchComponent } from "../components/MatchComponent"
import { MatchedUserContext } from "../context/MatchedUserContext"



export const HomePage = () => {
     
    const [ users, setUsers ] = useState([])
    const [ swipedRightByUsers, setSwipedRightByUsers ] = useState([])
    const [ swipedLeftByUsers, setSwipedLeftByUsers ] = useState([])
    const [ swipedUpByUsers, setSwipedUpByUsers ] = useState([])
    const [ profile, setProfile ] = useState({})
    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState(false)
    const currentUser = auth.currentUser?.uid
    const { matchedUser, setMatchedUser } = useContext(MatchedUserContext)
    // contexts
    const { showSettings, setShowSettings } = useContext(ShowSettingsContext)

    
    const getProfile = async () => {
        try {
            setLoading(true)
            if (currentUser){

                const profileDocRef = doc(db, "users", auth.currentUser?.uid)
                const profile = await getDoc(profileDocRef)
                if (profile.exists()){
                    setProfile(profile.data())
                } else {
                    console.log('profile is not there')
                }
            }
            // TODO: GETPROFILE IS IN USEEFFECT SO IT WILL BREAK BUT  CATCH ERROR FIXES IT BUT YOU NEED TO FIX THE UI ALSO
        } catch (error) {
            console.log('error', error)
        }
        finally {
            setLoading(false)
        }
    }

    const getSwipesData = async () => {
        try {
            setLoading(true)
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


            
        } catch(error) {
            console.log(error)
            setError(true)
        } finally {
            setLoading(false)
        }
        
        return () => {
            swipedRightSnapshot()
            swipedLeftSnapshot()
            swipedUpSnapshot()

        }
    }

    // * * Filtering data. Only get the users from the database excluding the current user
    useEffect(() => {
        const usersCollectionRef = collection(db, "users")
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
    console.log('curren tprofiel', profile)


    useEffect(() => {
        if (swipedRightByUsers || swipedLeftByUsers || swipedUpByUsers){
            // * * only get users from users array if their user.id do not match with any of the swiped sub collection
            // * * only return the users if the some returns false OR get users that are not in any of the swiped sub collections of the current user
            const combinedSwipedUsers = [...swipedRightByUsers, ...swipedLeftByUsers, ...swipedUpByUsers];
            const removedSwipedUsers = users.filter((user) => !combinedSwipedUsers.some((swipedUsers) => swipedUsers.id === user.id))
            setUsers(removedSwipedUsers)
        }
    }, [swipedRightByUsers, swipedLeftByUsers, swipedUpByUsers])

    return (
        <>
            
            <div className="max-w-[500px] h-screen  mx-auto flex flex-col justify-between">

                {loading ? (
                    <LoadingComponent />
                ) : showSettings ? (
                    <SettingsComponent />
                ) : (
                    <>
                    <NavbarTopComponent />
                    <TinderCards data={users && users} setData={setUsers} profile={profile} />
                    { users.length === 0 && (

                        <NavbarComponent />
                    )}
                    </>
                )}
            </div>
            {matchedUser.isMatched && (

                <MatchComponent currentProfile={profile}/>
            )}

            
            
        </>
    )
}
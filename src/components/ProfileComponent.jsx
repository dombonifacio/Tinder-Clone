// components

// icons
import logo from '../assets/icons/logo.svg'
import { IoIosSettings } from 'react-icons/io'
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

// firebase
import { auth, db } from "../config/firebase"
import { onSnapshot, collection, doc } from 'firebase/firestore'

export const ProfileComponent = () => {
    // TODO
    // 1. Get User profile by getting specific doc from the firebase users collection
    const currentUserId = auth.currentUser.uid
    const getCurrentUserDoc = doc(db, "users", currentUserId)
    const [ userProfile, setUserProfile ] = useState()
    const [ swipedByUsers, setSwipedByUsers ] = useState([])

    // TODO: See who liked the current user
    // 1. Go to the swipes collection, check each doc and check each subcollection of them

    useEffect(() => {

        const getCurrentUserData = onSnapshot(getCurrentUserDoc, (doc) => {
            if (doc.exists()) {
                setUserProfile({...doc.data()})
            } else {
                console.log('no doc exists')
            }
        })

        const swipeColRef = collection(db, "swipes")
        const getSwipeColData = onSnapshot(swipeColRef, (snapshot) => {
            snapshot.forEach((doc) => {
              const userId = doc.id
              const user = {...doc.data()}
              const swipedRightSubColRef = collection(db, "swipes", userId, "swipedRight");
          
              const getSwipedRightSubColData = onSnapshot(swipedRightSubColRef, (subColSnapshot) => {
                const isCurrentUserSwipedRight = subColSnapshot.docs.some((subDoc) => subDoc.id === currentUserId);
          
                if (isCurrentUserSwipedRight) {
                  // If the currentUser.uid exists in the swipedRight subcollection for this user,
                  // you can access the user's ID using 'userId'
                  console.log("User ID with currentUser in swipedRight:", user);
                 // setSwipedByUsers([...swipedByUsers, userId])
                }
              });
            });
          });

        return () => {
            getCurrentUserData()

        }
    }, [])

  
    return (
        <div>
            {userProfile?.name}

        </div>
    )
}
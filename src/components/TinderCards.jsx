// third party libraries
import TinderCard from "react-tinder-card"

import React from "react";
// hooks
import { useEffect, useState, useRef, useMemo } from "react"

// firebase
import { auth, db } from "../config/firebase"
import { collection, addDoc, doc, setDoc, getDoc, getDocs } from "firebase/firestore"; 

import '../App.css'
import { Link } from "react-router-dom";

export const TinderCards = ({data, setData, profile}) => {

     // when visibleCard is set to true, don't apply the hidden className, otherwise apply it
    const [ visibleCard, setVisibleCard ] = useState(true)

    // data will not be there automatically. use the useEffect hook
    const [ currentIndex, setCurrentIndex ] = useState(null)
    const [ cardsThatLeft, setCardsThatLeft ] = useState([]) 
    const [swipedRightCards, setSwipedRightCards] = useState([])
    const [swipedLeftCards, setSwipedLeftCards ] = useState([])
    const [ swipedUpCards, setSwipedUpCards ] = useState([])
    const [ lastDirection, setLastDirection ] = useState()
    const [childRefs, setChildRefs] = useState([]);
    const currentUser = auth.currentUser
    const userId = currentUser?.uid;
    const currentIndexRef = useRef(currentIndex)
    // user can only swipe if there is at least 1 user or more than 1 users to swipe
    const canSwipe = currentIndex >= 0
    // if user undo swipe, currentIndex will increase because it will near the end of the array
    const canGoBack = currentIndex < data.length - 1
    if (!data) {
        return null; // or return some loading indicator
      }
    useEffect(() => {
        if (data) {
          // Create childRefs with the length of data
          const newChildRefs = Array(data.length).fill(0).map(() => React.createRef());
          // Update the childRefs state with the new array
          setChildRefs(newChildRefs);
          // Set the currentIndexRef.current to the current index
          currentIndexRef.current = currentIndex;
        }
      }, [data, currentIndex]);

    useEffect(() => {
        if (data && (currentIndex === null || currentIndex === -1)) {
            setCurrentIndex(data.length - 1);
            console.log('useEffect triggered ')
        } 
    }, [data, currentIndex]);

    const updateCurrentIndex = (val) => {
        setCurrentIndex(val)
        currentIndexRef.current = val
    }

    const cardLeavesScreen = (name, index) => {
        currentIndexRef.current >= index && childRefs[index].current.restoreCard()
       
    }

    const getToSwipeUser = async (user) => {

        // TODO: 
        // Check if the parameter's user's id exists in the swipes collection
        // If it does, go to the swipedRight or swipedUp subcollection
        // Now go through each document in the swipedRight subcollection and check if the current user LOGGED in exists in that subcollection
        try {

            const swipesColRef = collection(db, "swipes")
            const userToSwipeOnRef = doc(swipesColRef, user.id)
            const userToSwipeOnDoc = await getDoc(userToSwipeOnRef)
    
            
            if (userToSwipeOnDoc.exists()) {
               
                // * Now we got the current user on screen to swipe from the database.
                // * * go to this getDocRef's swipedRight subcollection
                const swipedRightSubColRef = doc(db, "swipes", userToSwipeOnDoc.id, "swipedRight", userId)
                const swipedUpSubColRef = doc(db, "swipes", userToSwipeOnDoc.id, "swipedUp", userId)
                // get docs from this swipedRightSUbColRef
                const swipedRightCurrentUser = await getDoc(swipedRightSubColRef)
                const swipedUpCurrentUser = await getDoc(swipedUpSubColRef)
                if (swipedRightCurrentUser.exists()){
                    const readableSwipedRightUser =  swipedRightCurrentUser.data()
                    console.log('current user', readableSwipedRightUser.name, 'exists in', user.name, 'swiped right')
                } 
                else if (swipedUpCurrentUser.exists()){
                    const readableSwipedUpUser =  swipedUpCurrentUser.data()
                    console.log('current user', readableSwipedUpUser.name, 'exists in', user.name, 'swiped right')
                }

                else {
                    console.log('current user does not exist in', user.name, 'swiped right sub col')
                }

                console.log(user.name, ' has logged in before and has swiped someone already.')
            } else {
                console.log(user.name, 'has not swiped right anybody.')
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    // swiped cards
    const swipedCard = (direction, index, user) => {
        

        getToSwipeUser(user)
        setLastDirection(direction)
        updateCurrentIndex(index - 1)
        console.log(user.name, 'has been swiped to the', direction, ' direction')
        
        const updatedData = data.map((user, i) => {
            if (i === index){
                if (direction === 'up'){
                    user.isSwipedUp = true
                    setSwipedUpCards([...swipedUpCards, user])
                    addSwipedDoc(user, "swipedUp")
                }
                else if (direction === 'right'){
                    user.isSwipedRight = true
                    setSwipedRightCards([...swipedRightCards, user])
                    addSwipedDoc(user, "swipedRight")
                    
                }
                else {
                    user.isSwipedLeft = true
                    setSwipedLeftCards([...swipedLeftCards, user])
                    addSwipedDoc(user, "swipedLeft")
                }

            }
            return user
        })
      
        setData(updatedData)
    }
    const swipe = async (direction) => {
        if (canSwipe && currentIndex < data.length && childRefs[currentIndex]?.current) {
          await childRefs[currentIndex].current.swipe(direction); // Swipe the card!
        }
    };

    const addSwipedDoc = async (user, direction) => {
        try {
          
            // givess a doc a specific id using the currentUser.uid
          const docRef = doc(db, "swipes", userId)
          // creates a doc using a custom id (currentUser.uid) then giving a field id
          if (profile){

              await setDoc(docRef, {...profile})
          }
          // goes to the db, swipes collection, has to refer a specific document id (currentUser), goes to that specific doc's subcollection swipedRight
          // then refers to that user.id (the user being referred to is the current user being swiped)
          // swipes -> Mark -> swipedRight -> the user Mark swiped right on
          const userDocRef = doc(db, "swipes", userId, `${direction}`, user.id)
          // removes the isSwipedProps from the user
          const {isSwipedUp, isSwipedLeft, isSwipedRight, ...newUser} = user
          await setDoc(userDocRef, {
            // removed isSwipedProps
            ...newUser, 
          })
        } catch (error) {
          console.error("Error adding document:", error);
        }
    };


    // if any of the users are in the swipedRIght, swipedLeft, swipedUp, do not render them
    return (
        <>
        <div className="h-[80vh] flex justify-center items-center">
            {data.map((user, index) => {
                if (!(user.isSwipedRight || user.isSwipedLeft || user.isSwipedUp)) {
                return (
                    <TinderCard
                        ref={childRefs[index]}
                        key={index}
                        className={`swipe`}
                        onSwipe={(dir) => swipedCard(dir, index, user)}
                        preventSwipe={"down"}
                        onCardLeftScreen={() => cardLeavesScreen(user.name, index)}
                    >
                        <div
                        style={{ backgroundImage: "url(" + user.images[0] + ")" }}
                        className="card relative w-[600px] max-w-[80vw] h-[50vh] p-20 rounded-2xl bg-cover bg-right "
                        >
                        <h3 className="absolute left-0 p-4 bottom-0 text-white">{user.name}</h3>
                        <Link to={`/${user.id}`} className="absolute text-white bottom-0 right-0">Link to profile</Link>
                        </div>
                    </TinderCard>
            );
            }
            })}
   
        </div>
        <div className='w-full flex justify-evenly mt-[-40px]'>
            <button onClick={() => swipe('left')}>Swipe left!</button>
            <button onClick={() => swipe('up')}> Super like!</button>
            <button onClick={() => swipe('right')}>Swipe right!</button>
        </div>  
        </>
    )
}


// TODO: Matching Algorithm
// 
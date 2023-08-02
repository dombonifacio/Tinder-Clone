// third party libraries
import TinderCard from "react-tinder-card"

import React from "react";
// hooks
import { useEffect, useState, useRef, useMemo } from "react"

// firebase
import { auth, db } from "../config/firebase"
import { collection, addDoc, doc, setDoc, getDoc, onSnapshot } from "firebase/firestore"; 

import '../App.css'

export const TinderCards = ({data, setData, swipedRightData}) => {

     // when visibleCard is set to true, don't apply the hidden className, otherwise apply it
    const [ visibleCard, setVisibleCard ] = useState(true)

    // data will not be there automatically. use the useEffect hook
    const [ currentIndex, setCurrentIndex ] = useState(data.length - 1)
    const [swipedRightCards, setSwipedRightCards] = useState([])
    const [swipedLeftCards, setSwipedLeftCards ] = useState([])
    const [ swipedUpCards, setSwipedUpCards ] = useState([])
    const [ lastDirection, setLastDirection ] = useState()
    const [ lastSwipedUsers, setLastSwipedUsers ] = useState([])
    const [childRefs, setChildRefs] = useState([]);
    const [ profileShown, setProfileShown ] = useState(false)
    const currentUser = auth.currentUser
    const userId = currentUser.uid;
    const currentIndexRef = useRef(currentIndex)

    useEffect(() => {
        if (data) {
          // Create childRefs with the length of data
          const newChildRefs = Array(data.length).fill(0).map(() => React.createRef());
          // Update the childRefs state with the new array
          setChildRefs(newChildRefs);
          // Set the currentIndexRef.current to the current index
          currentIndexRef.current = currentIndex;
          console.log('current index ref', currentIndexRef)
        }
      }, [data, currentIndex]);


      

    // user can only swipe if there is at least 1 user or more than 1 users to swipe
    const canSwipe = currentIndex >= 0
    // if user undo swipe, currentIndex will increase because it will near the end of the array
    const canGoBack = currentIndex < data.length - 1
    console.log('current index', currentIndex)

    useEffect(() => {
        if (data && (currentIndex === null || currentIndex === -1 || currentIndex !== data.length - 1)){
            
            setCurrentIndex(data.length - 1);
        }
        
    }, [data]);

    useEffect(() => {
        if (currentIndex){
            
            console.log('can go back', canGoBack)
        }
    }, [currentIndex])

    const updateCurrentIndex = (val) => {
        setCurrentIndex(val)
        currentIndexRef.current = val
    }

    const cardLeavesScreen = (name, index) => {
        currentIndexRef.current >= index && childRefs[index].current.restoreCard()
       
    };

    // swiped cards
    const swipedCard = (direction, index, user) => {
        setLastDirection(direction)
        updateCurrentIndex(index - 1)
        setLastSwipedUsers([...lastSwipedUsers, user])
     
        
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
        console.log('updated data', updatedData)
        setData(updatedData)
    }
    const swipe = async (direction) => {
        if (canSwipe && currentIndex < data.length && childRefs[currentIndex]?.current) {
            console.log('swiped ', direction)
          await childRefs[currentIndex].current.swipe(direction); // Swipe the card!
        }
    };

    console.log('last swiped user', lastSwipedUsers)
    console.log('data length', data.length)
    console.log('data user', data)

    const [userProfile, setUserProfile] = useState(null);

    const getCurrentUserData = async () => {
      try {
        // Create a reference to the user document
        const userDocRef = doc(db, "users", userId);
  
        // Fetch the user document once using getDoc
        const userDocSnapshot = await getDoc(userDocRef);
  
        if (userDocSnapshot.exists()) {
          // The document exists, so you can access its data using .data()
          const userData = userDocSnapshot.data();
          setUserProfile(userData);
          console.log("User Data:", userData);
        } else {
          // The document doesn't exist
          console.log("User document not found.");
        }
      } catch (error) {
        console.error("Error fetching user document:", error);
      }
    };
  
    useEffect(() => {
      getCurrentUserData();
    }, [userId]);
  


    const addSwipedDoc = async (user, direction) => {
        try {
          
            // givess a doc a specific id using the currentUser.uid
          const docRef = doc(db, "swipes", userId)
          // creates a doc using a custom id (currentUser.uid) then giving a field id
          await setDoc(docRef, {...userProfile})
          // goes to the db, swipes collection, has to refer a specific document id (currentUser), goes to that specific doc's subcollection swipedRight
          // then refers to that user.id (the user being referred to is the current user being swiped)
          // swipes -> Mark -> swipedRight -> the user Mark swiped right on
          const userDocRef = doc(db, "swipes", userId, `${direction}`, user.id)
          // removes the isSwipedProps from the user
          const {isSwipedUp, isSwipedLeft, isSwipedRight, ...newUser} = user
          // creates a document inside the 
          await setDoc(userDocRef, {
            // removed isSwipedProps
            ...newUser, 
          })
        } catch (error) {
          console.error("Error adding document:", error);
        }
    };

    const goBack = async () => {
        if (!data || currentIndex >= data.length) return 

        const newIndex = currentIndex + 1
        updateCurrentIndex(newIndex)
        await childRefs[newIndex].current.restoreCard()
    }

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
                        <div className="absolute flex items-center bottom-0 left-0 p-4 w-full justify-between">

                            <h3 className=" text-white">{user.name}</h3>
                            <button className="text-white" onClick={(user) => showProfile(user)}>Show Profile</button>
                        </div>
                        </div>
                    </TinderCard>
            );
            }
            })}
   
        </div>
        <div className='w-full flex justify-evenly mt-[-40px]'>
            <button onClick={() => swipe('left')}>Swipe left!</button>
            <button onClick={() => swipe('up')}>Swipe Up</button>
            <button onClick={() => goBack()}>Undo swipe!</button>
            <button onClick={() => swipe('right')}>Swipe right!</button>
        </div>  
        </>
    )
}

// TODO : FOLLOWERS AND FOLLOWING LIST
// 



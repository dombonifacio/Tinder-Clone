// third party libraries
import TinderCard from "react-tinder-card"

import React from "react";
// hooks
import { useEffect, useState, useRef, useMemo } from "react"

// firebase
import { auth, db } from "../config/firebase"
import { collection, addDoc, doc, setDoc, getDoc, getDocs } from "firebase/firestore"; 

// icons
import { AiTwotoneHeart } from 'react-icons/ai'
import { AiTwotoneStar } from 'react-icons/ai'
import { ImCross } from 'react-icons/im'
import { AiFillInfoCircle } from 'react-icons/ai'


import '../App.css'
import { Link } from "react-router-dom";
import { LoadingComponent } from "./LoadingComponent";
import { NavbarComponent } from "./NavbarBotComponent";
import { useContext } from "react";
import { MatchedUserContext } from "../context/MatchedUserContext";
import { LastUserContext } from "../context/LastUserContext";

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
    const [ lastUser, setLastUser ] = useState(null)
    const { lastUserInfo, setLastUserInfo } = useContext(LastUserContext)
    const { matchedUser, setMatchedUser } = useContext(MatchedUserContext)

    
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

    console.log('data', data)
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
                    const readableSwipedRightUser = swipedRightCurrentUser.data()
                    setMatchedUser({...readableSwipedRightUser, isMatched: true})
                   
                } 
                else if (swipedUpCurrentUser.exists()){
                    const readableSwipedUpUser =  swipedUpCurrentUser.data()
                    setMatchedUser({user: {...readableSwipedUpUser}, isMatched: true})
 
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
        setLastUser(user.name.charAt(0).toUpperCase() + user.name.slice(1))
        setLastUserInfo(user)
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

    useEffect(() => {
        if (matchedUser.isMatched === true){
            setTimeout(() => {
                setMatchedUser({})
            }, 3000)
        }
    }, [matchedUser])
    


    console.log('data', data[0]?.images[0])
    // if any of the users are in the swipedRIght, swipedLeft, swipedUp, do not render them
    return (
        <>
        {data.length === 0 ? 
            
            <div className="flex flex-col h-[100vh] justify-center items-center text-center text-2xl font-bold text-slate-700 my-auto">
             <p>No users to swipe on.</p>
             <div className='w-full flex gap-x-6 justify-center mt-2'>
                {lastDirection && lastUser ? (
                    <>
                        <h2 className="text-xl font-bold text-slate-700" key={lastUser}>
                            You swiped {lastDirection} on <span className="bg-gradient-to-t from-electric-pink to-fiery-rose text-transparent bg-clip-text">{lastUser}</span>
                        </h2>
                        <h2 className="text-xl font-bold text-slate-700">Swipe a user or press a button to swipe</h2>
                    </>
                ) : <></>}
              
            </div> 
            </div> : (
            <div className="h-[65vh] flex flex-col items-center ">
            
            {data?.map((user, index) => {
                if (!(user.isSwipedRight || user.isSwipedLeft || user.isSwipedUp)) {
                return (
                    <TinderCard
                        ref={childRefs[index]}
                        key={index}
                        className={`swipe mx-auto`}
                        onSwipe={(dir) => swipedCard(dir, index, user)}
                        preventSwipe={"down"}
                        onCardLeftScreen={() => cardLeavesScreen(user?.name, index)}
                    >
                        <div
                        style={{ backgroundImage: "url(" + user.images[0] + ")" }}
                        className="card relative w-[500px] max-w-[90vw] h-[65vh] mx-auto rounded-2xl bg-cover bg-center "
                        >
                        <div className="absolute bg-gradient-to-t from-black h-[70px] rounded-2xl w-full bottom-0">

                        </div>
                        <div className="absolute left-0 p-4 bottom-0 w-full flex justify-between items-end">
                            <div className="flex flex-col">

                                <div className="flex items-center gap-x-2">

                                    <h3 className=" text-white text-2xl font-bold bg-gradient-to-t from-electric-pink to-fiery-rose text-transparent bg-clip-text">{user.name?.charAt(0).toUpperCase() + user.name?.slice(1)}</h3>
                                    <h1 className="text-white text-xl font-extralight">{user.age}</h1>
                                </div>
                                <div className="font-light text-white">{user.gender}</div>
                            </div>
                            <Link to={`/${user.id}`}><AiFillInfoCircle color="white" className="" size={"1.6rem"}/></Link>
                        </div>
                        </div>
                       
                </TinderCard>
            );
            }
            })}
            
        </div>
        )}
            {data.length === 0 ? <></> : (
                <>
                <div className="flex-grow  flex flex-col justify-center items-center">
                <div className=" flex-grow flex flex-col justify-center">
                <div className=" flex justify-center gap-x-6 mt-6 w-full">      
                <button className="bg-slate-200 p-4 rounded-full hover:bg-slate-300 ease-in-out duration-300" onClick={() => swipe('left')}>
                    <ImCross size={"1.5rem"} color="#f43f5e"/>
                </button>
                <button className="bg-slate-200 p-3 rounded-full hover:bg-slate-300 ease-in-out duration-300" onClick={() => swipe('up')}>
                    <AiTwotoneStar size={"2rem"} color=" #38bdf8"/>
                </button>
                <button className="bg-slate-200 p-3 rounded-full hover:bg-slate-300 ease-in-out duration-300" onClick={() => swipe('right')}>
                    <AiTwotoneHeart size={"2rem"} color=" #4ade80"/>
                </button>
                </div>
                <div className='w-full flex gap-x-6 justify-center mt-2'>
                    
                {lastDirection && lastUser ? (

                    <h2 className="text-xl font-bold text-slate-700" key={lastUser}>
                        You swiped {lastDirection} on {lastUser}
                    </h2>
                ) : <h2 className="text-xl font-bold text-slate-700">Swipe a user or press a button to swipe</h2>}
              
                </div>  
                
                </div>
                <div className=" ">
                <NavbarComponent />
                </div>
                </div>
                </>
            )}
            

        </>
        
    )
}


// TODO: Matching Algorithm
// 
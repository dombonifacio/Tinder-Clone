// database
import { auth, db } from "../config/firebase"
import { getDocs, collection, getDoc, onSnapshot } from "firebase/firestore"
import { signOut } from 'firebase/auth'
// hooks
import { useEffect, useState, useMemo, useRef } from 'react'

import React from "react"

// icons

// components
import { NavbarComponent } from "../components/NavbarComponent"

// third party libraries
import TinderCard from "react-tinder-card"

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

    const usersCollectionRef = collection(db, "users")
    const [users, setUsers] = useState([])
    const currentUser = auth.currentUser


   
      
    // used for outOfFrame closure

    const [currentIndex, setCurrentIndex] = useState(dummyData.length - 1)
    const [lastDirection, setLastDirection] = useState()
    const currentIndexRef = useRef(currentIndex)
    const childRefs = useMemo(
        () =>
        Array(db.length)
            .fill(0)
            .map((i) => React.createRef()),
        []
    )

    const updateCurrentIndex = (val) => {
        setCurrentIndex(val)
        currentIndexRef.current = val
      
    }

    const canGoBack = currentIndex < db.length - 1

    const canSwipe = currentIndex >= 0

    // set last direction and decrease current index
    const swiped = (direction, nameToDelete, index) => {
        setLastDirection(direction)
        updateCurrentIndex(index - 1)
    }


    const outOfFrame = (name, idx) => {
        console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current)
        // handle the case in which go back is pressed before card goes outOfFrame
        currentIndexRef.current >= idx && childRefs[idx].current.restoreCard()
        // TODO: when quickly swipe and restore multiple times the same card,
        // it happens multiple outOfFrame events are queued and the card disappear
        // during latest swipes. Only the last outOfFrame event should be considered valid
    }

    const swipe = async (dir) => {
        if (canSwipe && currentIndex < db.length) {
          await childRefs[currentIndex].current.swipe(dir) // Swipe the card!
        }
    }


    const goBack = async () => {
        if (!canGoBack) return
        const newIndex = currentIndex + 1
        updateCurrentIndex(newIndex)
        await childRefs[newIndex].current.restoreCard()
    }


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

    const onSwipe = (direction) => {
        console.log('You swiped: ' + direction)
    }

    const onCardLeftScreen = (myIdentifier) => {
        console.log(myIdentifier + ' left the screen')
      }
      

    return (
        <>
            <div>

                You are on the home page
            </div>
            {/* {users.map((user, index) => {
                return (
                    
                    <div key={index}>
                        {user.userInfo.id}
                    </div>
                )
            })} */}
            <div>
                {dummyData.map((character, index) => (

                    <TinderCard
                    ref={childRefs[index]}
                    className='swipe'
                    key={character.name}
                    onSwipe={(dir) => swiped(dir, character.name, index)}
                    onCardLeftScreen={() => outOfFrame(character.name, index)}
                    >
                    <div
                    style={{ backgroundImage: 'url(' + character.url + ')' }}
                    className='card'
                    >
                    <h3>{character.name}</h3>
                    </div>
                    </TinderCard>

                ))}
            </div>

            <div className='buttons'>
        <button style={{ backgroundColor: !canSwipe && '#c3c4d3' }} onClick={() => swipe('left')}>Swipe left!</button>
        <button style={{ backgroundColor: !canGoBack && '#c3c4d3' }} onClick={() => goBack()}>Undo swipe!</button>
        <button style={{ backgroundColor: !canSwipe && '#c3c4d3' }} onClick={() => swipe('right')}>Swipe right!</button>
      </div>
      {lastDirection ? (
        <h2 key={lastDirection} className='infoText'>
          You swiped {lastDirection}
        </h2>
      ) : (
        <h2 className='infoText'>
          Swipe a card or press a button to get Restore Card button visible!
        </h2>
      )}
 
            <NavbarComponent />
        </>
    )
}
// third party libraries
import TinderCard from "react-tinder-card"

// hooks
import { useEffect, useState } from "react"

// firebase
import { auth, db } from "../config/firebase"
import { collection, addDoc, doc, setDoc } from "firebase/firestore"; 

export const TinderCards = ({data, setData, swipedRightData}) => {

     // when visibleCard is set to true, don't apply the hidden className, otherwise apply it
    const [ visibleCard, setVisibleCard ] = useState(true)
    const [ currentIndex, setCurrentIndex ] = useState(data.length - 1)
    const [ cardsThatLeft, setCardsThatLeft ] = useState([]) 
    const [swipedRightCards, setSwipedRightCards] = useState([])
    const [swipedLeftCards, setSwipedLeftCards ] = useState([])
    const [ swipedUpCards, setSwipedUpCards ] = useState([])
    const currentUser = auth.currentUser


    // TODO
    // 1. Only render user data if a user.id is not included in the currentUser's swipedRight || Up || Down subcollection
    


    const cardLeavesScreen = (name, index) => {
      
    };

    // swiped cards
    const swipedCard = (direction, index, user) => {
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
    useEffect(() => {
        console.log('swiped right cards', swipedRightCards)
    }, [swipedRightCards])
    useEffect(() => {
        console.log('swiped up cards', swipedUpCards)
    }, [swipedUpCards])
    useEffect(() => {
        console.log('swiped left cards', swipedLeftCards)
    }, [swipedLeftCards])

    const addSwipedDoc = async (user, direction) => {
        const userId = currentUser.uid;
        try {
          
          await setDoc(doc(db, "swipes", userId), {
            id: user.id
          })
          // doc that refers to db/swipes/currentUser/swipedRight||Up||Down/id of the user that's been swiped
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
            {/* tinder cards container */}
            <div className="h-[90vh] flex justify-center items-center ">
                
          
                {data.map((user, index) => {
                    // if isSwipedTop || isSwipedRight || isSwipedLeft === false
                    if (!(user.isSwipedRight || user.isSwipedLeft || user.isSwipedUp)){

                        return (
                            
                           <TinderCard
                           key={index}
                           className={`absolute pressable swipe`}
                           onSwipe={(dir) => swipedCard(dir, index, user)}
                           preventSwipe={'down'}
                           onCardLeftScreen={() => cardLeavesScreen(user.name, index)}>
                             <div style={{ backgroundImage: 'url(' + user.images[0] + ')' }} className='relative h-96 w-96 shadow-xl rounded-lg bg-cover bg-center'>
                                <h3>{user.name}</h3>
                            </div>
                           </TinderCard>
                        )
                    }
                })}
            </div>
        </>
    )
}
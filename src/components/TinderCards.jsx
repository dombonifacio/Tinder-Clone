// third party libraries
import TinderCard from "react-tinder-card"

// hooks
import { useEffect, useState } from "react"

// firebase
import { auth, db } from "../config/firebase"

export const TinderCards = ({data, setData}) => {

     // when visibleCard is set to true, don't apply the hidden className, otherwise apply it
    const [ visibleCard, setVisibleCard ] = useState(true)
    const [ currentIndex, setCurrentIndex ] = useState(data.length - 1)
    const [ cardsThatLeft, setCardsThatLeft ] = useState([]) 

    
    
    // get the speciific id of the user, if it is true of the index, then make te isSwiped to true
    // now only print out data that if their value of isSwiped is false
    const cardLeavesScreen = (name, index) => {
      
    };

    // swiped cards
    const swipedCard = (direction, index, user) => {
        console.log(user.name, 'has been swiped to the', direction, ' direction')
        const updatedData = data.map((user, i) => {
            if (i === index){
                if (direction === 'up'){
                    user.isSwipedUp = true
                }
                else if (direction === 'right'){
                    user.isSwipedRight = true
                }
                else {
                    user.isSwipedLeft = true
                }

            }
            return user
        })
        setData(updatedData)
    }

  

    // useEffect(() => {
    //     console.log(cardsThatLeft, 'cards that left')
    // }, [cardsThatLeft])
    

    useEffect(() => {
       // if their isSwiped is set to true, then add it to the swipes collection, doc id (current user uid), swipedRight
    }, [data])
   
   
    return (
        <>
            {/* tinder cards container */}
            <div className="h-[90vh] flex justify-center items-center ">
                
          
                {data.map((user, index) => {
                    // if isSwipedTop || isSwipedRight || isSwipedLeft === false
                    if (user.isSwipedRight || user.isSwipedLeft || user.isSwipedUp === false){

                        return (
                            
                           <TinderCard
                           key={index}
                           className={user.isSwiped === true ? `hidden` : `absolute pressable swipe`}
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
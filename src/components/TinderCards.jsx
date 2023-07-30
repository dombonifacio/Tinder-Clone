// third party libraries
import TinderCard from "react-tinder-card"

// hooks
import { useEffect, useState } from "react"

export const TinderCards = ({data, setData}) => {

     // when visibleCard is set to true, don't apply the hidden className, otherwise apply it
    const [ visibleCard, setVisibleCard ] = useState(true)
    const [ currentIndex, setCurrentIndex ] = useState(data.length - 1)
    const [ cardsThatLeft, setCardsThatLeft ] = useState([]) 

    
    // when card leaves screen, remove it from the index then add it to the setCardsThatLeft
    const cardLeavesScreen = (name, index) => {
        console.log(name, ' and index', index,  ' has left the screen')
        console.log('remove card', removeCard)
        setCardsThatLeft([...cardsThatLeft, index])
        setCurrentIndex(currentIndex - 1)
      
    }
    // filter the data map once the id of the cardLeavesScreen. ONLY GET THE ONES THAT DO NOT MATCH WITH THE CARDLEAVESSCREEN ID
    useEffect(() => {
        console.log(cardsThatLeft, 'cards that left')
    }, [cardsThatLeft])
    console.log('dummy data', data)
    
    return (
        <>
            {/* tinder cards container */}
            <div className="h-[90vh] flex justify-center items-center ">
                
          
                {data.map((image, index) => {
                    return (
                        
                       <TinderCard
                       key={index}
                       className={cardsThatLeft.includes(index) ? `hidden` : `absolute pressable`}
                       onCardLeftScreen={() => cardLeavesScreen(image.name, index)}>
                         <div style={{ backgroundImage: 'url(' + image.url + ')' }} className='relative h-96 w-96 shadow-xl rounded-lg bg-cover bg-center'>
                            <h3>{image.name}</h3>
                        </div>
                       </TinderCard>
                    )
                })}
            </div>
        </>
    )
}
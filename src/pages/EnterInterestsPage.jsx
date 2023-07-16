// hooks
import { useNavigate } from "react-router-dom"
import { useState } from "react"

// components
import { NextButtonComponent } from "../components/NextButtonComponent"
// interest list
import interestsData from '../interests.json'

export const EnterInterestsPage = () => {

    const [interestAmount, setInterestAmount] = useState(0)
    const [userInterest, setUserInterestList] = useState([])

    const handleCheckedInterest = (event) => {
      
        
        

    
        console.log(event, 'object input type')
    }

    const navigate = useNavigate()
    const [interestList] = useState(interestsData.interests)

    const nextPage = () => {
        navigate('/')
    }
    return (
        <>
       <div>
        <h1 className="font-bold text-4xl">Choose up to 5 interests</h1>
        <ul className="flex flex-col">
            {interestList.map((interest) => (
            <li key={interest.id}>
                <input type="checkbox" id={interest.id} name={interest.name} onChange={handleCheckedInterest}/>
                <label for={interest.id}>{interest.name}</label>
         
            </li>
            ))}
        </ul>
        </div>
        

        <NextButtonComponent onClick={nextPage}/>

        </>
    )
}
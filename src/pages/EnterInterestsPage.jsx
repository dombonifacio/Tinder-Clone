// hooks
import { useNavigate } from "react-router-dom"
import { useState, useContext, useEffect } from "react"

// contexts
import { UserInfoContext } from "../context/UserInfoContext"

// components
import { NextButtonComponent } from "../components/NextButtonComponent"
// interest list
import interestsData from '../interests.json'

// firebase/firestore
import { db } from "../config/firebase"
import { collection, addDoc } from "firebase/firestore"

export const EnterInterestsPage = () => {

    // collection ref to users when creating a new user
    const usersCollectionRef = collection(db, "users")

    const [interestAmount, setInterestAmount] = useState(0)
    const [userInterest, setUserInterestList] = useState([])
    const { userInfo, setUserInfo } = useContext(UserInfoContext)
    const handleCheckedInterest = (event) => {
        const selectedInterest = {
            name: event.target.name,
            id: event.target.id
        }
        console.log(selectedInterest, 'selected interetst')
        if(event.target.checked && !userInterest.some((interest) => interest.id === selectedInterest.id)){
           
            setUserInterestList((prevList) => [...prevList, selectedInterest])
        } else {
            // only get the ones that does not match with the selected interest (current checked interest) to remove unchecked elements
            setUserInterestList((prevList) => prevList.filter((interest) => interest.id !== selectedInterest.id));

        }
    }
    
  

    const [interestList] = useState(interestsData.interests)
    
    const handleUserInfoChange = () => {
      setUserInfo((prevState) => ({
        ...prevState,
        interests: userInterest
      }))
    }

    const handleCreateUser = async () => {
        try {
           
            await addDoc(usersCollectionRef, {
                ...userInfo,
                interests: userInterest
                
            })
        } catch (error) {
            console.log(error, 'error message')
        }
    }
 
    console.log(userInfo, 'user info')

   
    return (
        <>
       <div className="flex h-screen px-4 items-center justify-center">
            <div className="flex flex-col w-full gap-y-10">
                <div className="">

                    <h1 className="font-bold text-4xl mb-4">Choose up to 5 interests</h1>
                    <ul className="flex flex-wrap gap-y-6 gap-x-2 cbox">
                        {interestList.map((interest) => (
                        <li key={interest.id}>
                            <input type="checkbox" id={interest.id} name={interest.name}  onChange={handleCheckedInterest}/>
                             <label for={interest.id} className="label-checkbox py-2.5 px-5  text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 ">{interest.name}
                                
                            </label>
                        </li>
                        ))}
                    </ul>
                </div>
                <div>

                    <button class="bg-gradient-to-t from-electric-pink  to-fiery-rose rounded-full hover:from-pink-700 hover:to-rose-500  text-white font-bold py-3 px-4  w-full" onClick={handleCreateUser}>
                    Create User
                    </button>
                </div>
            </div>
           
               
        </div>
        

      

        </>
    )
}
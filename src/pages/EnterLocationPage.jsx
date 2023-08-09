// react hooks
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

// components
import { NextButtonComponent } from "../components/NextButtonComponent"

// contexts
import { UserInfoContext } from '../context/UserInfoContext'

// firestore
import { auth } from "../config/firebase"



export const EnterLocationPage = () => {

    const navigate = useNavigate()
    const { userInfo, setUserInfo } = useContext(UserInfoContext)    
    

    const handleUserInfoChange = (event) => {
        setUserInfo({
            ...userInfo,
            id: auth.currentUser?.uid,
            bio: "",
            location: "",
            traits: [],
            [event.target.name]: event.target.value,
        })
    }
    const nextPage = () => {
        navigate('/enterGender')
    }

    return (
        <>
            {/* container */}
            <div className="flex h-screen justify-center items-center px-4">
                {/* What's your first name section? */}
                    <div className='min-h-[50%] flex flex-col justify-between w-full'>

                        <div>
                            <h1 className="text-4xl font-bold">Where are you from?</h1>
                            <input type="text" placeholder="Enter location here" className="border-b-2 mt-2 text-black bg-white border-slate-600 p-1 w-full outline-none" required name='location' onChange={handleUserInfoChange}/>
                            <p className="mt-3 text-slate-500">Your location will appear on your profile</p>
                      
                        </div>

                        {/* Next Button */}
                        <div className="mt-8">
                            <NextButtonComponent onClick={nextPage}/>
                        </div>
                    </div>
                  
      


            </div>
        </>
    )
}
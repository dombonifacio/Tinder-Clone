// react hooks
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

// components
import { NextButtonComponent } from "../components/NextButtonComponent"

// contexts
import { UserInfoContext } from '../context/UserInfoContext'

// firestore
import { auth } from "../config/firebase"



export const EnterNamePage = () => {

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
        navigate('/enterAge')
    }

    return (
        <>
            {/* container */}
            <div className="flex h-screen justify-center items-center">
                {/* What's your first name section? */}
                    <div className='min-h-[50%] flex flex-col justify-between'>

                        <div>
                            <h1 className="text-4xl font-bold text-wi ">What's your first name?</h1>
                            <input type="text" placeholder="Enter first name" className="border-b-2 mt-2 text-white border-slate-600 p-1 w-full outline-none" required name='name' onChange={handleUserInfoChange}/>
                            <p className="mt-3 text-slate-500">This is how it'll appear on your profile.</p>
                            <p className="font-bold">Can't change it later.</p>
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
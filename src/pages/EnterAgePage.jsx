// react hooks
import { useState, useContext } from 'react'

import { useNavigate } from 'react-router-dom'
// contexts
import { UserInfoContext } from '../context/UserInfoContext'
import { NextButtonComponent } from '../components/NextButtonComponent'

export const EnterAgePage = () => {

    const { userInfo, setUserInfo } = useContext(UserInfoContext)
    const handleUserInfoChange = (event) => {
        setUserInfo({
            ...userInfo,
            [event.target.name]: event.target.value
        })
    }
    const navigate = useNavigate()
    const nextPage = () => {
        navigate('/enterLocation')
    }
    return (
        <>
            <div className='flex  h-screen items-center px-4'>
                <div className='flex min-h-[50%] flex-col justify-between w-full'>
                    <div>
                        <h1 className="text-4xl font-bold">How old are you?</h1>
                        <input type="number" placeholder="Enter age" className="border-b-2 bg-white text-black border-slate-600 p-1 w-full outline-none" required name='age' onChange={handleUserInfoChange}/>
                        <p className="mt-3 text-slate-500">Your age will appear on your profile.</p>
                        
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
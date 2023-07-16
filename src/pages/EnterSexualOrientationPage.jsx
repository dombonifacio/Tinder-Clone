// hooks
import { useNavigate } from "react-router-dom"
import { useContext } from "react"

// components
import { NextButtonComponent } from "../components/NextButtonComponent"
// contexts
import { UserInfoContext } from "../context/UserInfoContext"



export const EnterSexualOrientationPage = () => {
    const {userInfo} = useContext(UserInfoContext)
    console.log(userInfo, 'user info context')
    
    const navigate = useNavigate()
    const nextPage = () => {
        navigate('/enterInterests')
    }
    return (
        <>
            Enter Sexuality
        <NextButtonComponent onClick={nextPage}/>
        </>
    )
}
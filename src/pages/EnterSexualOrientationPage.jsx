// hooks
import { useNavigate } from "react-router-dom"

// components
import { NextButtonComponent } from "../components/NextButtonComponent"

export const EnterSexualOrientationPage = () => {
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
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../config/firebase"

// hooks
import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"

// contexts
import { UserExistContext } from "../context/UserExistContext"
import { UserSignedUpContext } from "../context/UserSignedUpContext"
import { LoginComponent } from "../components/LoginComponent"

// icons
import { IoIosArrowBack } from 'react-icons/io'

export const SignupPage = () => {

    const [user, setUser] = useState({})
    const { userExists, setUserExists } = useContext(UserExistContext)
    const { userSignedUp, setUserSignedUp } = useContext(UserSignedUpContext)
   
    const navigate = useNavigate()
    const handleUserInput = (event) => {
        setUser({
            ...user,
            [event.target.name]: event.target.value
        })
    }

    const handleSignup = () => {
        createUserWithEmailAndPassword(auth, user.name, user.password).then((response) => {
            
            console.log(response, 'response. user successfully signed up')
            setTimeout(() => {
                setUserSignedUp(true)
                navigate('/enterName')
            }, 2000)
        }).catch((error) => {
            console.log(error.code, 'error occured')
        })
    }

    const handleNavigateHomePage = () => {
        navigate('/')
    }

    return (
        <div className="max-w-[500px] mx-auto relative px-4 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-electric-pink via-pastel-red to-fiery-rose">
            //sign up page
            <input type="text" placeholder="Enter email" className="border-b-2 mt-2 text-black bg-white border-slate-600 p-1 w-full outline-none" required name='name' value={user.name} onChange={handleUserInput}/>
            <input type="password" placeholder="Enter password" className="border-b-2 mt-2 text-black bg-white border-slate-600 p-1 w-full outline-none" required name='password' value={user.password} onChange={handleUserInput}/>
            <button onClick={handleSignup} className="bg-blue-400">Sign up</button> 
            {/* <div className=" px-4 flex flex-col items-center justify-evenly min-h-[100vh] ">
            <button className="absolute top-2 left-6 text-white flex" onClick={handleNavigateHomePage}><IoIosArrowBack size={"1.5em"} color="white" />Back to home</button>
                <LoginComponent loginFunc={handleSignup} userInfoFunc={handleUserInput} message={"Sign up for an Account"} messageButton={"Sign Up"}/>
            </div> */}
       </div>
                 
  
    )
}
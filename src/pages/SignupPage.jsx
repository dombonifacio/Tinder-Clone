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
import logo from '../assets/icons/logo.svg'

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
        createUserWithEmailAndPassword(auth, user.email, user.password).then((response) => {
            
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
           
            {/* <input type="text" placeholder="Enter email" className="border-b-2 mt-2 text-black bg-white border-slate-600 p-1 w-full outline-none" required name='name' value={user.name} onChange={handleUserInput}/>
            <input type="password" placeholder="Enter password" className="border-b-2 mt-2 text-black bg-white border-slate-600 p-1 w-full outline-none" required name='password' value={user.password} onChange={handleUserInput}/>
            <button onClick={handleSignup} className="bg-blue-400">Sign up</button>  */}
            {/* <div className=" px-4 flex flex-col items-center justify-evenly min-h-[100vh] ">
            <button className="absolute top-2 left-6 text-white flex" onClick={handleNavigateHomePage}><IoIosArrowBack size={"1.5em"} color="white" />Back to home</button>
                <LoginComponent loginFunc={handleSignup} userInfoFunc={handleUserInput} message={"Sign up for an Account"} messageButton={"Sign Up"}/>
            </div> */}



<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 w-full h-screen">
            <div className="bg-white p-4 rounded-2xl">

                    <div class="sm:mx-auto sm:w-full sm:max-w-sm ">
                        <img src={logo} alt="logo tinder" className='mx-auto'/>
                        <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign up for a new account</h2>
                    </div>

                    <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
                
                        <div>
                            <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                            <div class="mt-2">

                            <input type="text" placeholder="Enter email" className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" required name='email' value={user.email} onChange={handleUserInput}></input>
                            </div>
                        </div>


                        <div>
                            <div class="flex items-center justify-between">
                            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
                            
                            </div>
                            <div class="mt-2">
                            <input type="password" placeholder="Enter password" className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" required name='password' value={user.password} onChange={handleUserInput}/>
                            </div>
                        </div>

                        <div class="mt-4">
                            <button onClick={handleSignup} class="ease-in-out mb-4 duration-300 flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-gradient-to-t from-electric-pink  to-fiery-rose hover:from-pink-700 hover:to-rose-500">Sign Up</button>
                        </div>

                    
                    </div>
                </div>
            </div>

       </div>
                 
  
    )
}
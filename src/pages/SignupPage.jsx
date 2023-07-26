import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../config/firebase"

// hooks
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export const SignupPage = () => {

    const [user, setUser] = useState({})
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
                navigate('/')
            }, 2000)
        }).catch((error) => {
            console.log(error.code, 'error occured')
        })
    }

    return (
        <div>
            sign up page
            <input type="text" placeholder="Enter email" className="border-b-2 mt-2 text-black bg-white border-slate-600 p-1 w-full outline-none" required name='name' value={user.name} onChange={handleUserInput}/>
            <input type="password" placeholder="Enter password" className="border-b-2 mt-2 text-black bg-white border-slate-600 p-1 w-full outline-none" required name='password' value={user.password} onChange={handleUserInput}/>
            <button onClick={handleSignup} className="bg-blue-400">Sign up</button>
        </div>
    )
}
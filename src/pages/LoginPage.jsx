import { auth, provider } from "../config/firebase"
// methods that allows you to sign in
import { signInWithPopup } from "firebase/auth"

// react route dom
import { useNavigate } from "react-router-dom"

export const LoginPage = () => {

    const navigate = useNavigate()
    const signInWithGoogle = () => {
        // signinWithPop method takes in two parameters: auth and the provider (the third party email login)
        signInWithPopup(auth, provider).then((response) => {
            navigate('/home')
            console.log(response)
        })
    }

    return (
        <>
            <h1>Login Page</h1>
            <div>
                <button onClick={signInWithGoogle}>Sign in with Google</button>
                
            </div>
        </>
    )
}
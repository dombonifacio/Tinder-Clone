import { auth, googleProvider, facebookProvider } from "../config/firebase"
// methods that allows you to sign in
import { signInWithPopup, signInWithRedirect } from "firebase/auth"

// react route dom
import { useNavigate } from "react-router-dom"

export const LoginPage = () => {

    const navigate = useNavigate()
    const signInWithGoogle = () => {
        // signinWithPop method takes in two parameters: auth and the provider (the third party email login)
        signInWithPopup(auth, googleProvider).then((response) => {
            navigate('/enterName')
            console.log(response, 'auth response from the login page')
        }).catch((error) => {
            console.log(error)
        })
    }

    const signInWithFacebook = () => {
        signInWithPopup(auth, facebookProvider).then((response) => {
            navigate('/enterName')
            console.log(response, 'auth facebook')
        }).catch((error) => {
            console.log(error, 'error')
        })
    }

    return (
        <>
            <h1>Login Page</h1>
            <div>
                <button onClick={signInWithGoogle}>Sign in with Google</button>
                
            </div>
            <div>
                <button onClick={signInWithFacebook}>Sign in with Facebook</button>
            </div>
        </>
    )
}
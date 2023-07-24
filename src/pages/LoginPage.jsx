import { auth, googleProvider, facebookProvider } from "../config/firebase"
// methods that allows you to sign in
import { signInWithPopup, signInWithRedirect } from "firebase/auth"

// react routes dom
import { useNavigate } from "react-router-dom"
//hooks
import { useLocalStorage } from "../hooks/useLocalStorage"
import { useEffect } from "react"

export const LoginPage = () => {

    const [user, setUser] = useLocalStorage("user", null)

    const navigate = useNavigate()
    const signInWithGoogle = () => {
        // signinWithPop method takes in two parameters: auth and the provider (the third party email login)
        signInWithPopup(auth, googleProvider).then((response) => {
            setUser(response.user)
        
        }).catch((error) => {
            console.log(error, 'error')
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

    useEffect(() => {
        if (user){
            navigate('/enterName')
        }
    }, [user])

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
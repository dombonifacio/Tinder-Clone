import { auth, googleProvider, facebookProvider, db } from "../config/firebase"
// methods that allows you to sign in
import { onAuthStateChanged, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth"

// react routes dom
import { useNavigate } from "react-router-dom"
//hooks
import { useLocalStorage } from "../hooks/useLocalStorage"
import { useEffect, useState, useContext } from "react"
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore"

// contexts
import { UserExistContext } from "../context/UserExistContext"
import { UserSignedUpContext } from "../context/UserSignedUpContext"
import { UserLoggedInContext } from "../context/UserLoggedInContext"
import { LoadingComponent } from "../components/LoadingComponent"
import { WhiteLogoComponent } from "../components/WhiteLogoComponent"

// icons
import { FcGoogle } from 'react-icons/fc'
import { AiFillFacebook } from 'react-icons/ai'
import { HiMail } from 'react-icons/hi'
import { IoIosArrowBack } from 'react-icons/io'
import { LoginButtonComponent } from "../components/LoginButtonComponent"
import { LoginComponent } from "../components/LoginComponent"


export const LoginPage = () => {

    const [value, setValue] = useLocalStorage("user", null)
    const [userInfo, setUserInfo] = useState({})
    const [showEmailLogin, setEmailLogin] = useState(false)
    const usersCollectionRef = collection(db, "users")
    

    // contexts
    const { userExists, setUserExists } = useContext(UserExistContext)
    const { userSignedUp, setUserSignedUp } = useContext(UserSignedUpContext)
    const { userIsLoggedIn, setUserIsLoggedIn } = useContext(UserLoggedInContext)
    const [ loading, setLoading ] = useState(false)

    
    const navigate = useNavigate()
    const handleUserInfo = (event) => {
        setUserInfo({
            ...userInfo,
            [event.target.name]: event.target.value
        })
    }

    const signInWithFacebook = () => {
        signInWithPopup(auth, facebookProvider).then((response) => {
            setValue(response.user)
            console.log(response, 'auth facebook')
            setTimeout(() => {
                navigate('/enterName')
            }, 2000)
        }).catch((error) => {
            console.log(error, 'error')
        })
    }

    const signInWithGoogle = () => {
        // signinWithPop method takes in two parameters: auth and the provider (the third party email login)
        signInWithPopup(auth, googleProvider).then((response) => {
            setValue(response.user)
            navigate('/')
        }).catch((error) => {
            console.log(error, 'error')
        })
    }

    const handleSignup = () => {
        navigate('/signup')
    }

    const handleSignInWithEmailAndPass = () => {

        signInWithEmailAndPassword(auth, userInfo.email, userInfo.password).then((response) => {
            setValue(response.user)
            setLoading(true)
            setTimeout(() => {

                setLoading(false)
                navigate('/')
            }, 2000)
        
        }).catch((error) => {
            console.log('error signing in', error)
        })
    }

    useEffect(() => {
        if (value){
            setUserIsLoggedIn(true)
        
        }
    }, [value])

   
    useEffect(() => {
      
        const checkIfUserExists = onAuthStateChanged(auth, (person) => {
            
            if (value){
               
                const userDocRef = doc(usersCollectionRef, person?.uid)
                getDoc(userDocRef).then((doc) => {
                    if (doc.exists()){
                        setUserSignedUp(false)
                    setUserExists(true)
                        console.log('from the login page. doc exists. user true')
                        setTimeout(() => {
                            navigate('/')
                        }, 2000)
                        console.log(value,' user is on login page local storage')
                    } else {
                        setUserExists(false)
            
                        console.log('doc doesn\'t exists')
                        setUserSignedUp(true)
                        setTimeout(() => {
                            navigate('/enterName')
                        }, 2000)
                    }
                }).catch((error) => {
                    console.log('error', error)
                }).finally(() => {
                    setLoading(false)
                })
            }
            else {

                console.log(auth, 'user is not here from the login page. onauthstatechanged useeffecct')
            }
        })
        return () => {
            // Unsubscribe from the listener when the component unmounts
            checkIfUserExists();
        };
        
    }, [value])

    return (
        <>
            { loading ? ( <LoadingComponent />) : (
                <>
                     <div className="max-w-[500px] mx-auto relative px-4 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-electric-pink via-pastel-red to-fiery-rose">
                        {showEmailLogin && <button className="absolute top-2 text-white flex" onClick={() => setEmailLogin((prevState) => !prevState)}><IoIosArrowBack size={"1.5em"} color="white" />Back to home</button> }
                            
                            <div className=" px-4 flex flex-col items-center justify-evenly min-h-[100vh] ">
                                { showEmailLogin ? <LoginComponent loginFunc={handleSignInWithEmailAndPass} userInfoFunc={handleUserInfo} message={"Sign in with email and password"} messageButton={"Sign In"}/> : (
                                    <>
                                        <WhiteLogoComponent /><div className="flex flex-col px-4 mt-20 gap-y-3">
                                            <p className="text-slate-50 text-center">By clicking Log in, you agree with our Terms. Learn how we process your data in our Privacy Policy and Cookies Policy.</p>
                                            <LoginButtonComponent message="LOG IN WITH GOOGLE" icon={<FcGoogle size={"1.5em"} />} onClick={signInWithGoogle} />
                                            <LoginButtonComponent message="LOG IN WITH FACEBOOK" icon={<AiFillFacebook size={"1.5em"} color="black" />} onClick={signInWithFacebook} />
                                            <LoginButtonComponent message="LOG IN WITH EMAIL" icon={<HiMail size={"1.5em"} color="black" />} onClick={() => setEmailLogin((prevState) => !prevState)} />

                                            <p className="text-slate-200 text-center" onClick={handleSignup}>Don't have an account? <button className="text-white hover:text-xl">Sign Up Now</button></p>

                                        </div>
                                    </>
                                )}
                            </div>
                    </div>
                </>
            )}
           
      
            
        </>
    )
}
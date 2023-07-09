import { auth } from "../config/firebase"

export const HomePage = () => {
    return (
        <div>
            You are on the home page
            <p>{auth.currentUser?.displayName}</p>
        </div>
    )
}
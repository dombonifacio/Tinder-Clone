import { LoadingComponent } from "../components/LoadingComponent"
import { LoginComponent } from "../components/LoginComponent"

export const SettingsPage = () => {
    return (
        <div className="max-w-[500px] mx-auto flex flex-col items-center justify-evenly min-h-[100vh] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-electric-pink via-pastel-red to-fiery-rose">
            <LoginComponent />
        </div>
    )
}
import { ShowSettingsContext } from "../context/ShowSettingsContext"
import { useContext } from "react"
// icons
import { AiTwotoneSetting } from 'react-icons/ai'

export const SettingsComponent = () => {
    const { showSettings, setShowSettings } = useContext(ShowSettingsContext)
    return (
        <div>
            settings component
            <button onClick={() => setShowSettings((prevState) => !prevState)}>
                    <AiTwotoneSetting color='grey' size={"1.8rem"}/>
             </button>
        </div>
    )
}
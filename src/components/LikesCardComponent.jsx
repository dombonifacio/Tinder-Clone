import { Link } from "react-router-dom"

// icons
import { AiFillInfoCircle } from 'react-icons/ai'
import { PiNotePencilFill } from 'react-icons/pi'

export const LikesCardComponent = ({user}) => {
    return (
        <div className="relative">
            <div className="bg-gradient-to-t from-black absolute h-44 bottom-0 rounded-b-lg w-full">
                <div className="flex h-full items-end px-4 py-2 justify-between ">
                    <div className="flex items-center justify-between w-full">

                        <h1 className="text-md text-slate-200 font-bold">{user.name.charAt(0).toUpperCase() + user.name.slice(1)}</h1>
                        <div className="flex gap-x-1">

                            <Link to={`/review/${user.id}`}><PiNotePencilFill color="#e2e8f0" className="hover:text-2xl" size={"1rem"} /></Link>
                            <Link to={`/${user.id}`}><AiFillInfoCircle color="#e2e8f0" className="" size={"1rem"}/></Link>
                        </div>
                    </div>
                </div>
            </div>
            <img src={user.images[0]} alt="Image of user" width={"250px"} height={"70px"} className="object-cover h-80 object-center rounded-lg"/>
        </div>
    )
}
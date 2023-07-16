// hooks
import { useNavigate } from "react-router-dom"

// components
import { NextButtonComponent } from "../components/NextButtonComponent"

export const EnterGenderPage = () => {
    const navigate = useNavigate()
    const nextPage = () => {
        navigate('/enterSexuality')
    }
    return (
        <>
            <div className="flex flex-col h-screen justify-center px-5">
                <div>
                    <h1 className="text-4xl font-bold mb-4">What's your gender?</h1>
                    <ul class="flex flex-col gap-y-4">
                    <li class="relative">
                        <input class="sr-only peer" type="radio" value="Female" name="gender" id="female" />
                        <label class="flex p-5 bg-white border border-gray-300 rounded-lg cursor-pointer focus:outline-none hover:bg-gray-50 peer-checked:ring-green-500 peer-checked:ring-2 peer-checked:border-transparent" for="female">Female</label>

                      
                    </li>

                    <li class="relative">
                        <input class="sr-only peer" type="radio" value="Male" name="gender" id="male" />
                        <label class="flex p-5 bg-white border border-gray-300 rounded-lg cursor-pointer focus:outline-none hover:bg-gray-50 peer-checked:ring-green-500 peer-checked:ring-2 peer-checked:border-transparent" for="male">Male</label>

                     
                    </li>

                    <li class="relative">
                        <input class="sr-only peer" type="radio" value="Other" name="gender" id="other" />
                        <label class="flex p-5 bg-white border border-gray-300 rounded-lg cursor-pointer focus:outline-none hover:bg-gray-50 peer-checked:ring-green-500 peer-checked:ring-2 peer-checked:border-transparent" for="other">Other</label>

                     
                    </li>
                    </ul>
                 
                </div>


                
                <div className="mt-8">

                    <NextButtonComponent onClick={nextPage}/>
                </div>
                

                
            </div>
        </>
    )
}
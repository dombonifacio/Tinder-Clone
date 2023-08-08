import logo from '../assets/icons/logo.svg'

export const LoginComponent = ({loginFunc, userInfoFunc}) => {
    return (
        <div className="flex flex-col bg-white rounded-xl w-full">
           
            {/* <input type="text" name="email" placeholder="Enter your email" required onChange={userInfoFunc}/>
                    <input type="password" name="password" placeholder="Enter your password" required onChange={userInfoFunc}/>
            <button className="bg-blue-400" >
                Log In
            </button> */}
            <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 w-full">
                <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img src={logo} alt="logo tinder" className='mx-auto'/>
                    <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
                </div>

                <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
            
                    <div>
                        <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                        <div class="mt-2">
                        <input id="email" name="email" type="email" autocomplete="email" required class="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" onChange={userInfoFunc}/>
                        </div>
                    </div>

                    <div>
                        <div class="flex items-center justify-between">
                        <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
                        
                        </div>
                        <div class="mt-2">
                        <input id="password" name="password" type="password" autocomplete="current-password" required class="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" onChange={userInfoFunc}/>
                        </div>
                    </div>

                    <div class="mt-4">
                        <button onClick={loginFunc} class="ease-in-out duration-300 flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-gradient-to-t from-electric-pink  to-fiery-rose hover:from-pink-700 hover:to-rose-500">Sign in</button>
                    </div>
                

                    <div class="text-sm text-center mt-3">
                            <a href="#" class="font-semibold text-fiery-rose hover:text-rose-700">Forgot password?</a>
                    </div>
                </div>
            </div>

        </div>
    )
}
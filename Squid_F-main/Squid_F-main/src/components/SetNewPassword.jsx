import React, { useState } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SetNewPassword({setSavePassword,setForgetPassword,useremail}) {
    const [passwordinput,setPasswordinput]=useState({password:"",confirmPassword:"",email:useremail});

    const handleChange=(e)=>{
        setPasswordinput({...passwordinput, [e.target.name]: e.target.value});
    }
    const handleSubmit=(e)=>{
        e.preventDefault();

        try{
            fetch("https://squid-b.onrender.com/user/set-password",{
                method:"POST",
                body:JSON.stringify(passwordinput),
                headers: { "Content-Type": "application/json" },
            })
            .then((res)=>res.json())
            .then((data)=>{
                if(data.status){
                    setForgetPassword(false);
                    setSavePassword(false);
                    toast(data.message);
                }
                else{
                    toast(data.message);
                }
            })
        }catch(err){
            throw err;
        }
    }

    return (
        <>
            <div className="md:mycontainer">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 text-white text-4xl p-2">Set NewPassword</h2>
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm py-2">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 text-white text-xl">New Password</label>
                            <div className="mt-2">
                                <input id="password" value={passwordinput.password} onChange={handleChange} name="password" type="password"  placeholder="••••••••" required="" className="bg-transparent border border-gray-300 text-base text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 text-white text-xl">Confirm Password</label>
                            <div className="mt-2">
                                <input id="password" value={passwordinput.confirmPassword} onChange={handleChange} name="confirmPassword" type="password"  placeholder="••••••••" required="" className="bg-transparent border border-gray-300 text-base text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                            </div>
                        </div>
                        <div>
                            <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 text-xl">Set</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default SetNewPassword
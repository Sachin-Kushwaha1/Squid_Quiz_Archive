import React, { useRef} from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function GetOTP({ setOtp, setSavePassword, useremail }) {
    const ref = useRef();
    
    const handleSubmit = (e) => {
        e.preventDefault();

        fetch("https://squid-b.onrender.com/user/verifyOtp",{
            method:"POST",
            body:JSON.stringify({email:useremail,token:ref.current.value.trim()}),
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((res)=>res.json())
        .then((data)=>{
            if(data.status){
                setOtp(false);
                toast(data.message);
            }
            else{
                toast(data.message);
            }
        })
    }

    const handleResend=()=>{
        fetch("https://squid-b.onrender.com/user/resendOtp",{
            method:"POST",
            body:JSON.stringify({email:useremail}),
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((res)=>res.json())
        .then((data)=>{
            if(data.status){
                toast(data.message);
            }
            else{
                toast(data.message);
                setSavePassword(false);
            }
        })
    }

    return (
        <>
            <div className="md:mycontainer">
                <h2 className="mt-20 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 text-white text-4xl p-2 justify-center">Email verification</h2>
                <p className='text-white-800 text-lg text-center py-4'>We have send the OTP is your register Email</p>
                <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 text-white text-xl">Enter OTP</label>
                            <div className="mt-2">
                                <input id="otp" name="otp" type="text" placeholder="OTP" required="" className="bg-transparent border border-gray-300 text-base text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" ref={ref}/>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <button className="bg-indigo-600 hover:bg-indigo-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                                Verify
                            </button>
                            <a className="inline-block align-baseline font-bold text-base text-indigo-500 hover:text-teal-800" onClick={handleResend}>
                                Resend OTP
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default GetOTP
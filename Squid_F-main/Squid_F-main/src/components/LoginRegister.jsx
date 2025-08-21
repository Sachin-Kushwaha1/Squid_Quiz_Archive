import React, { useEffect, useRef, useState } from 'react';
import Login from './Login';
import Register from './Register';
import vid4_3 from "../assets/SQ level 2.mp4"
import vid16_9 from "../assets/2level.mp4";
import ResetPassword from './ResetPassword';
import SetNewPassword from './SetNewPassword';
import GetOTP from './GetOTP';

export default function LoginRegister({ ratio, setLoginRegister, setStory, login,setLogin }) {
    const [forgetPassword,setForgetPassword]=useState(false);
    const [savePassword,setSavePassword]=useState(false);
    const [otp,setOtp]=useState(false);
    const [useremail,setUseremail]=useState();
    const videoRef=useRef();
  useEffect(()=>{
    if(videoRef.current)
      videoRef.current.src=ratio>=1.6?vid16_9:vid4_3;
  },[ratio]);
    // console.log(setUseremail);
   
    return (
        <>
            <video width="100%" height="100%" autoPlay loop muted ref={videoRef}/>
            {(login) ? ( 
                (!forgetPassword) ?
                    (<Login ratio={ratio} setLoginRegister={setLoginRegister} setStory={setStory} setLogin={setLogin} setForgetPassword={setForgetPassword}/>

                    ):((!savePassword)?(<ResetPassword setSavePassword={setSavePassword} setOtp={setOtp} setUseremail={setUseremail} />
                    ):((otp)?(<GetOTP setOtp={setOtp} useremail={useremail}/>):(<SetNewPassword setForgetPassword={setForgetPassword} setSavePassword={setSavePassword} useremail={useremail}/>)))
            ) : (
                <Register ratio={ratio} setLogin={setLogin} />
            )}
        </>
    );
}

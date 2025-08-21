import React, { useEffect, useRef, useState } from 'react';
import vid16_9 from '../assets/Start.mp4';
import vid4_3 from "../assets/SQ start.mp4";

export default function Start({setIntro, setLoginRegister, ratio}) {
  const videoRef=useRef();
  useEffect(()=>{
    if(videoRef.current)
      videoRef.current.src=ratio>=1.6?vid16_9:vid4_3;
  },[ratio]);
  const startIntro=()=>{
    setIntro(false);
    setLoginRegister(true);
  }
  return (
    <>
    <div className="video-body">
    <button className="start_btn btn" onClick={startIntro}>Start</button>
    <video width="100%" height="100%" autoPlay loop muted ref={videoRef}/>
    </div>
    </>
  )
}
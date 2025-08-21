import React, { useEffect, useState } from 'react';
import vid16_9 from '../assets/Gameintro.mp4';
import vid4_3 from "../assets/SQ intro.mp4";
import { useRef } from 'react';

export default function Story({setStory, ratio}) {
  const [pauseIndex, setPauseIndex]=useState(1);
  const videoTag=useRef();
  useEffect(()=>{
    if(videoTag.current)
      videoTag.current.src=ratio>=1.6?vid16_9:vid4_3;
  },[ratio]);
  const pauseVideo=()=>{
    if(videoTag.current.currentTime>=(pauseIndex*19))
        {
          videoTag.current.pause();
          setPauseIndex(()=>pauseIndex+1);
        }
    }
  const nextClip=()=>{
    if(videoTag.current.ended==true)
    {
        setStory(false);
    }
    if(videoTag.current.paused==true)
        videoTag.current.play();
    else
    {
      if(pauseIndex*20+5> videoTag.current.duration)
        setStory(false);
      else 
      {
        videoTag.current.currentTime=pauseIndex*20;
        setPauseIndex(()=>pauseIndex+1);
      }
    }
  }
  return (
    <>
    <div className="video-body">
    <button className="next_btn btn" onClick={nextClip}>Next</button>
    <video width="100%" height="100%" autoPlay muted onTimeUpdate={pauseVideo} ref={videoTag}/>
    </div>
    </>
  )
}



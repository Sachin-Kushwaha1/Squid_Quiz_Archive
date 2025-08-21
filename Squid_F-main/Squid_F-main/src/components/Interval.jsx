import { useEffect, useRef, useState } from "react";
import tokenVid16_9 from "../assets/entertoken.mp4";
import tokenVid4_3 from "../assets/SQ token.mp4";
import vid16_9 from "../assets/secondinst.mp4";
import vid4_3 from "../assets/SQ Instruction.mp4";
import loader from "../assets/loaders/gif3.webp";
//import React from 'react'

export default function Interval({
  setMsg,
  LevelUp,
  setLevelUp,
  setStop,
  username,
  ratio,
}) {
  // const [Seconds, setSeconds]=useState(0)
  const [Flag, setFlag] = useState(false);
  const [Intime, setIntime] = useState(60);
  const [Input, setInput] = useState(false);
  const [Penalty, setPenalty] = useState(false);
  const [currentVideo, setcurrentVideo] = useState(
    // ratio >= 1.6 ? vid16_9 : vid4_3
    "interval"
  );
  const tokenInput = useRef();
  const videoTag = useRef();
  const btnRef = useRef();
  const [click, setClick] = useState(false);

  useEffect(()=>{
    if(videoTag.current){
      if(currentVideo==="interval")
        videoTag.current.src=ratio >= 1.6 ? vid16_9 : vid4_3;
      else
        videoTag.current.src=ratio >= 1.6 ? tokenVid16_9 : tokenVid4_3;
    }
  }, [currentVideo, ratio]);
  const getToken = () => {
    // https://squid-bac.onrender.com/user/get_token
    fetch("https://squid-b.onrender.com/user/get_token", {
      method: "POST",
      body: JSON.stringify({ email: username }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMsg(() => data.token);
        setFlag(true);
        setcurrentVideo("token");
        setIntime(3);
        console.log(data.token);
      });
  };
  const enterRoundTwo = (token, email) => {
    btnRef.current.disabled = true;
    setClick(true);
    fetch("https://squid-b.onrender.com/user/verify_token", {
      method: "POST",
      body: JSON.stringify({ email: email, token: token }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data.status);
        if (data.status) {
          setLevelUp(true);
          setStop(false);
        } else {
          alert("InValid Token!");
          btnRef.current.disabled = false;
          setClick(false);
        }
      });
  };

  const createLoop = () => {
    if (Flag === false && Intime > 0 && videoTag.current.ended === true) {
      videoTag.current.currentTime = 30;
      videoTag.current.play();
    }
  };
  useEffect(() => {
    if (Intime === 0 && Flag === false) {
      getToken();
      // setFlag(true);
      // setcurrentVideo(tokenVideo);
      // setIntime(3);
    } else if (Intime === 0 && Flag === true && Penalty === false) {
      if (Input === false) {
        setMsg("");
        videoTag.current.currentTime = 5;
        setInput(true);
        setIntime(30);
        setPenalty(true);
      }
    } else if (Intime === 0 && Flag === true && Penalty === true) {
      // setStop(false);
      console.log("Penalty");
      setLevelUp(true);
      setStop(false);
    }
    const interval = setInterval(() => {
      setIntime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [setStop, Intime]);

  return (
    <>
      <video
        width="100%"
        height="100%"
        autoPlay
        muted
        type="video/mp4"
        ref={videoTag}
        onTimeUpdate={createLoop}
      />
      <div
        className={
          Intime < 11 && Flag == false
            ? "timer redtimer interval"
            : "timer interval"
        }
      >
        {Intime}
      </div>
      {Input ? (
        <>
          <div className="tokenBox">
            <input
              type="text"
              className="startInput"
              name=""
              id=""
              placeholder="Enter token"
              disabled={Intime === 0 ? true : false}
              ref={tokenInput}
            />
            <button
              id="tokenBtn"
              onClick={() => enterRoundTwo(tokenInput.current.value, username)}
              disabled={Intime === 0 ? true : false}
              ref={btnRef}
            >
              {click ? (
                <img
                  className="loader-gif show"
                  width="20px"
                  height="20px"
                  src={loader}
                  alt=""
                />
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </>
      ) : (
        <div></div>
      )}
    </>
  );
}

import { useEffect, useRef, useState } from "react";
import vid16_9 from "../assets/userID.mp4";
import vid4_3 from "../assets/SQ userID.mp4";
import loader from "../assets/loaders/gif3.webp";
export default function Begin({
  setUsername,
  LevelUp,
  setLevelUp,
  Lives,
  ratio,
}) {
  const inputRef = useRef();
  const btnRef = useRef();
  const [click, setClick] = useState(false);
  const videoRef=useRef();
  useEffect(()=>{
    if(videoRef.current)
      videoRef.current.src=ratio>=1.6?vid16_9:vid4_3;
  },[ratio]);
  // const videoDiv=window.document.querySelector("video");
  // console.log(window.videoDiv.clientWidth+" "+window.videoDiv.clientHeight);
  // console.log(window);
  // const ratio=videoDiv.clientWidth/videoDiv.clientHeight;
  // console.log(ratio);

  function enableFullscreen(element) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }

  const validateEmail = (email) => {
    const charArr = email.split("");
    const index1 = charArr.indexOf("@", 0);
    if (index1 == -1) return false;
    const index2 = charArr.indexOf(".", index1);
    if (index2 == -1 || index2 - index1 < 6) return false;
    const str = email.substring(index2 + 1);
    if (str.length < 2) return false;
    return true;
  };
  
  const handleClick = () => {
    // inputRef.current.value && setUsername(inputRef.current.value);
    const isValid = validateEmail(inputRef.current.value.trim());
    if (!isValid) {
      alert("Email is invalid!");
      return;
    }
    btnRef.current.disabled = true;
    setClick(true);

    //if(inputRef.current.value>205122000 && inputRef.current.value<205122116){
    if (inputRef.current.value !== "") {
      // fetch("https://www.version24.in/api/v1/checkuser", {
      //   // fetch("http://localhost:3000/api/v1/checkuser", {
      //   method: "POST",
      //   body: JSON.stringify({ email: inputRef.current.value.trim() }),
      //   headers: {
      //     Accept: "application/json",
      //     "Content-Type": "application/json",
      //   },
      // })
      //   .then((res) => res.json())
      //   .then((res) => {
      //     console.log(res);
      //     if (res.status == "success") {  // == "success"

            enableFullscreen(document.documentElement);

            // fetch("https://squid-bac.onrender.com/user/Start_Game", {
            fetch("https://squid-b.onrender.com/user/Start_Game", {
              method: "Post",
              body: JSON.stringify({ email: inputRef.current.value.trim() }),
              headers: { "Content-Type": "application/json" },
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.selected) {
                  setUsername(inputRef.current.value);
                } else {
                  inputRef.current.value = "";
                  alert("You have already participated!!!");
                  setClick(false);
                  btnRef.current.disabled = false;
                }
              });
          // } else {
          //   alert(res.message);
          //   btnRef.current.disabled = false;
          //   setClick(false);
          // }
        // });
    }
    // }
    else {
      inputRef.current.value = "";
      alert("Enter a valid email!!!");
      btnRef.current.disabled = false;
      setClick(false);
    }
  };
  return (
    <>
      <video width="100%" height="100%" autoPlay loop muted ref={videoRef}>
        <source type="video/mp4" />
      </video>
      <div className="square">
        <h2 className={Lives > 1 ? "total-lives" : "total-lives redtimer"}>
          No. of Lives: {Lives + 1}
        </h2>
      </div>
      <div className="Start">
        <input 
          type="email"
          placeholder="Enter your Email Id"
          className="startInput"
          ref={inputRef}
          required="true"
        />
        <button
          id="startBtn"
          className="btn"
          onClick={handleClick}
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
            "Start Level-1"
          )}
        </button>
      </div>
    </>
  );
}

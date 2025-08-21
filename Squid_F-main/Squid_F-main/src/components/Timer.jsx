import { useEffect, useState } from "react";

export default function Timer({
  setStop,
  questionNumber,
  LevelUp,
  setLevelUp,
  setMsg,
  username,
  Lives,
  setLives,
}) {
  const [timer, setTimer] = useState(40);

  function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}
  useEffect(() => {
    if (timer === 0 && Lives === 0) {
      fetch("https://squid-b.onrender.com/user/End", {
        method: "post",
        body: JSON.stringify({ email: username, question: questionNumber - 1 }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {

          exitFullscreen(document.documentElement);
          
          if (data.selected) {
            setMsg(() => data.message);
            setLevelUp(false);
            setStop(true);
          } else {
            setMsg(() => "Thank you for participating");
            setLevelUp(false);
            setStop(true);
          }
        });
    } else if (timer === 0 && Lives !== 0) {
      if (!LevelUp) setTimer(40);
      else setTimer(60);
      setLives(() => Lives - 1);
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [setStop, timer]);

  useEffect(() => {
    if (!LevelUp) setTimer(35);
    else setTimer(60);
  }, [questionNumber]);

  return timer;
}

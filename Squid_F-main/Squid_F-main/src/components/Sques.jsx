import { useEffect, useRef, useState } from "react";
import video1 from "../assets/1level.mp4";
import video1_16_9 from "../assets/SQ level 1.mp4";
import video2 from "../assets/2level.mp4";
import video2_16_9 from "../assets/SQ level 2.mp4";

export default function Sques({
  ratio,
  data,
  data1,
  setStop,
  setQuestionNumber,
  questionNumber,
  LevelUp,
  setLevelUp,
  username,
  setUsername,
  setMsg,
  Lives,
  setLives,
}) {
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [className, setClassName] = useState("ans");
  const [disabled, setDisabled] = useState(false);
  const videoRef = useRef();
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = LevelUp
        ? ratio >= 1.6
          ? video2
          : video2_16_9
        : ratio >= 1.6
        ? video1
        : video1_16_9;
    }
  }, [ratio]);
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
    if (!LevelUp) {
      setQuestion(data[questionNumber - 1]);
    } else {
      setQuestion(data1[questionNumber - 1]);
    }
  }, [data, data1, questionNumber]);

  const selectcand = async () => {
    fetch("https://squid-b.onrender.com/user/select_cand", {
      method: "POST",
      body: JSON.stringify({ email: username }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.selected) {
          setLevelUp(true);
          setQuestionNumber(1);
          setMsg(() => data.message);
          setStop(true);
        } else {
          setMsg(() => data.message);
          setStop(true);
          //setLevelUp(false);
        }
        console.log(data);
      });
  };
  const delay = (duration, callback) => {
    setTimeout(() => {
      callback();
    }, duration);
  };

  const endLevel = () => {
    setQuestionNumber(1);
    fetch("https://squid-b.onrender.com/user/End_Game", {
      method: "Post",
      body: JSON.stringify({ email: username, question: questionNumber }),
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
          setMsg(() => data.message);
          setLevelUp(false);
          setStop(true);
        }
      });
  };

  const handleClick = (a) => {
    setDisabled(true);
    setSelectedAnswer(a);
    setClassName("ans active");
    delay(150, () =>
      setClassName(() => (a.correct ? "ans correct" : "ans wrong"))
    );
    delay(900, () => {
      if (a.correct) {
        console.log(username);
        if (!LevelUp)
          setQuestionNumber((prev) =>
            data.length >= prev + 1 ? prev + 1 : selectcand()
          );
        else
          setQuestionNumber((prev) =>
            data1.length >= prev + 1 ? prev + 1 : endLevel()
          );
        setDisabled(false);
      } else {
        setDisabled(false);
        if (Lives == 0) {
          //change
          fetch("https://squid-b.onrender.com/user/End", {
            method: "post",
            body: JSON.stringify({
              email: username,
              question: questionNumber - 1,
            }),
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
        } else {
          setLives(() => Lives - 1);
          console.log(Lives + " left!");
        }
      }
    });
  };
  return (
    <>
      {/* <video width="100%" height="100%" autoPlay loop muted>
      <source src={(LevelUp)?video2:video1} type='video/mp4'/>
    </video>
    <div className="square"><h2 className={Lives>1?"total-lives":"total-lives redtimer"}>No. of Lives: {Lives+1}</h2></div> */}
      {/* <div className="squiz">
        <div className="question">{question?.question}</div>
        <div className="answer">
          {question?.answer.map((a)=>(
          <div className={selectedAnswer === a ? className:"ans"} onClick={() => handleClick(a)}>
            {a.text}</div>))}
        </div>        
    </div> */}
      {question?.question ? (
        <>
          <video
            width="100%"
            height="100%"
            autoPlay
            loop
            muted
            src={
              LevelUp
                ? ratio >= 1.6
                  ? video2
                  : video2_16_9
                : ratio >= 1.6
                ? video1
                : video1_16_9
            }
            ref={videoRef}
          />
          <div className="square">
            <h2 className={Lives > 1 ? "total-lives" : "total-lives redtimer"}>
              No. of Lives: {Lives + 1}
            </h2>
          </div>
          <div className="squiz">
            <div className="question">{question?.question}</div>
            <div className="answer">
              {question?.answer.map((a) => (
                <div
                  className={selectedAnswer === a ? className : "ans"}
                  onClick={() => {
                    handleClick(a);
                  }}
                  style={{ pointerEvents: `${disabled ? "none" : "auto"}` }}
                >
                  {a.text}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div></div>
      )}
    </>
  );
}

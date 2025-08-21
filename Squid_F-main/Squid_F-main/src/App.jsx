import { useEffect, useState, useRef } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DisableDevtool from "disable-devtool";
import "./app.css";
import Sques from "./components/Sques";
import Timer from "./components/Timer";
import Begin from "./components/Begin";
import Interval from "./components/Interval";
import Start from "./components/Start";
import Story from "./components/story";
import vid16_9 from "./assets/Thank.mp4";
import vid4_3 from "./assets/SQ thanks.mp4";
import LoginRegister from "./components/LoginRegister";
import { data, data1 } from "./quizData";

DisableDevtool();

function App() {
  const [intro, setIntro] = useState(true);
  const [story, setStory] = useState(false);
  const [loginRegister, setLoginRegister] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [stop, setStop] = useState(false);
  const [username, setUsername] = useState(null);
  const [LevelUp, setLevelUp] = useState(() => false);
  const [Msg, setMsg] = useState("Thank you for participating");
  const [Lives, setLives] = useState(4);
  const [login, setLogin] = useState(true);

  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  window.addEventListener("contextmenu", (e) => e.preventDefault());

  function ctrlShiftKey(e, keyCode) {
    return e.ctrlKey && e.shiftKey && e.keyCode === keyCode.charCodeAt(0);
  }

  window.onkeydown = (e) => {
    // Disable F12, Ctrl + Shift + I, Ctrl + Shift + J, Ctrl + U
    if (
      e.keyCode === 123 ||
      ctrlShiftKey(e, "I") ||
      ctrlShiftKey(e, "J") ||
      ctrlShiftKey(e, "C") ||
      (e.ctrlKey && e.keyCode === "U".charCodeAt(0))
    )
      return false;
  };

  // Prevent refresh when F5 key is pressed
  document.addEventListener("keydown", function (event) {
    if (event.key === "F5") {
      event.preventDefault();
    }
  });

  // Prevent refresh when Ctrl+R or Cmd+R is pressed (reloading the page)
  document.addEventListener("keydown", function (event) {
    if ((event.ctrlKey || event.metaKey) && event.key === "r") {
      event.preventDefault();
    }
  });

  // Prevent refresh when browser's refresh button is clicked
  window.addEventListener("beforeunload", function (event) {
    event.preventDefault();
  });

  // Prevent refresh when navigating away (e.g., clicking links)
  window.addEventListener("unload", function (event) {
    event.preventDefault();
  });
  const [ratio, setRatio] = useState(
    (window.innerWidth / window.innerHeight).toFixed(1)
  );

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
      setRatio((width / height).toFixed(1));
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [width, height]);
  const videoRef = useRef();
  useEffect(() => {
    if (videoRef.current)
      videoRef.current.src = ratio >= 1.6 ? vid16_9 : vid4_3;
  }, [ratio]);

  return (
    <>
      <ToastContainer />
      <div className="app">
        {/* <p>{width+" "+height+" "+ratio+" "}</p>
      <p>{ratio>=Number("1.6")?"true":"false"}</p> */}
        {username ? (
          <>
            <div className="main">
              {stop ? (
                <>
                  <h1 className="thank">{Msg}</h1>
                  {!LevelUp ? (
                    <video
                      width="100%"
                      height="100%"
                      autoPlay
                      muted
                      loop
                      ref={videoRef}
                    ></video>
                  ) : (
                    <></>
                  )}
                  {LevelUp ? (
                    <>
                      <Interval
                        setMsg={setMsg}
                        ratio={ratio}
                        setStop={setStop}
                        LevelUp={LevelUp}
                        setLevelUp={setLevelUp}
                        username={username}
                      ></Interval>
                    </>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <>
                  <div className="top">
                    <div className="timer">
                      <Timer
                        setStop={setStop}
                        setMsg={setMsg}
                        Lives={Lives}
                        setLives={setLives}
                        questionNumber={questionNumber}
                        LevelUp={LevelUp}
                        setLevelUp={setLevelUp}
                        username={username}
                      />
                    </div>
                  </div>
                  <div className="bottom">
                    <Sques
                      ratio={ratio}
                      data={data}
                      data1={data1}
                      setStop={setStop}
                      setMsg={setMsg}
                      setQuestionNumber={setQuestionNumber}
                      questionNumber={questionNumber}
                      LevelUp={LevelUp}
                      setLevelUp={setLevelUp}
                      username={username}
                      setUsername={setUsername}
                      Lives={Lives}
                      setLives={setLives}
                    />
                  </div>
                </>
              )}
            </div>
          </>
        ) : intro ? (
          <Start
            ratio={ratio}
            setIntro={setIntro}
            setLoginRegister={setLoginRegister}
          />
        ) : loginRegister ? (
          <LoginRegister
            ratio={ratio}
            setLoginRegister={setLoginRegister}
            setStory={setStory}
            login={login}
            setLogin={setLogin}
          />
        ) : story ? (
          <Story ratio={ratio} setStory={setStory} />
        ) : (
          <Begin
            ratio={ratio}
            setUsername={setUsername}
            Lives={Lives}
            LevelUp={LevelUp}
            setLevelUp={setLevelUp}
          />
        )}
      </div>
    </>
  );
}

export default App;

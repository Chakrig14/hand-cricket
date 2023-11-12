import { useNavigate } from "react-router-dom";
import "../css/game.css";
import { useEffect, useState } from "react";

const Game = ({ tossWin }) => {
    const [tossStatus, setTossStatus] = useState(tossWin);
    const [disableButton, setDisableButton] = useState(false);
    const [bowlValue, setBowlValue] = useState(0);
    const [batValue, setBatValue] = useState(0);
    const navigate = useNavigate();
    const [result, setResult] = useState("");
    const [modal, setModal] = useState(false);
    const [inningChange, setInningChange] = useState(false);
    let endInning = 6;
    let timer;
    const [gameData, setGameDate] = useState({
        player: {
            scoreArr: [],
            totalScore: 0
        },
        robot: {
            scoreArr: [],
            totalScore: 0
        }
    });
    function saveDataToLocalStorage(data) {
        localStorage.setItem("gameData", JSON.stringify(data));
    }
    useEffect(() => {
        let gameObj = {
            player: {
                scoreArr: [],
                totalScore: 0
            },
            robot: {
                scoreArr: [],
                totalScore: 0
            }
        }
        let savingData = JSON.parse(localStorage.getItem("gameData")) || gameObj;
        setGameDate(savingData);
        saveDataToLocalStorage(savingData);
    }, [])

    useEffect(() => {
        if (gameData.player.scoreArr.length === 6 && tossStatus === "Win") {
            handleEndInitialInning();
        }
        else if (gameData.robot.scoreArr.length === 6 && tossStatus === "Lose") {
            handleEndInitialInning();
        }
        checkWinner();
    }, [gameData])
    useEffect(() => {
        window.addEventListener("beforeunload", () => {
            localStorage.clear();
        })
        return () => {
            window.removeEventListener("beforeunload", () => {
                localStorage.clear();
            })
        }
    })

    function timerHomeNavigate() {
        timer = setTimeout(() => {
            setModal(false);
            setResult("");
            navigate("/");
            window.location.reload();
        }, 3000);
        return () => clearTimeout(timer);
    }

    function checkWinner() {
        const playerScoreArr = gameData.player.scoreArr;
        const robotScoreArr = gameData.robot.scoreArr;

        // Check if both players have bowled 6 balls (end of the game).
        const isGameEnd = playerScoreArr.length === 6 && robotScoreArr.length === 6;

        // Calculate the total scores for both players.
        const playerTotalScore = playerScoreArr.reduce((total, score) => {
            return total + (score === "W" ? 0 : parseInt(score));
        }, 0);
        const robotTotalScore = robotScoreArr.reduce((total, score) => {
            return total + (score === "W" ? 0 : parseInt(score));
        }, 0);

        // Check if either player has been dismissed ("W").
        const isPlayerOut = playerScoreArr.includes("W");
        const isRobotOut = robotScoreArr.includes("W");

        // Determine the winner based on the conditions.
        if (isGameEnd) {
            if (playerTotalScore > robotTotalScore) {
                console.log("Player");
                setResult("Player");
                setModal(true);
                setInningChange(false);
                timerHomeNavigate();
            } else if (robotTotalScore > playerTotalScore) {
                console.log("Robot");
                setResult("Robot");
                setModal(true);
                setInningChange(false);
                timerHomeNavigate();
            } else {
                console.log("It's a tie!");
                setResult("It's a tie");
                setModal(true);
                setInningChange(false);
                timerHomeNavigate();
            }
        } else if (isPlayerOut && robotScoreArr.length > 0 && playerTotalScore < robotTotalScore) {
            console.log(playerScoreArr.length + " " + robotScoreArr.length);
            console.log("Robot");
            setResult("Robot");
            setModal(true);
            setInningChange(false);
            timerHomeNavigate();
        } else if (isRobotOut && playerScoreArr.length > 0 && playerTotalScore > robotTotalScore) {
            console.log(playerScoreArr.length + " " + robotScoreArr.length);
            console.log("Player");
            setResult("Player");
            setModal(true);
            setInningChange(false);
            timerHomeNavigate();
        } else {
            console.log("Game in progress...");
        }
    }

    function handleEndInitialInning() {
        setBatValue(0);
        setBowlValue(0);
        setInningChange(true);
        if (tossStatus === "Win") {
            timer = setTimeout(() => {
                setTossStatus("Lose");
                setInningChange(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
        else {
            timer = setTimeout(() => {
                setTossStatus("Win");
                setInningChange(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }

    // let timer;

    function handleSelectedScore(e) {
        e.preventDefault();
        setDisableButton(true);
        let randomBowlValue = Math.floor(Math.random() * 6 + 1);
        setBatValue(e.target.value);
        setBowlValue(randomBowlValue);
        if (tossStatus === "Win") {
            if (gameData.player.scoreArr.length < endInning && randomBowlValue !== parseInt(e.target.value)) {
                let newScoreArr = [...gameData.player.scoreArr, e.target.value];
                let newTotalScore = newScoreArr.reduce((prev, curr) => {
                    return parseInt(prev) + parseInt(curr)
                })
                const newGameData = {
                    ...gameData, player: {
                        ...gameData.player,
                        scoreArr: newScoreArr,
                        totalScore: newTotalScore
                    }
                };
                timer = setTimeout(() => {
                    setGameDate(newGameData);
                    saveDataToLocalStorage(newGameData);
                }, 1500)
            }
            else if (randomBowlValue === parseInt(e.target.value)) {
                let newScore = [...gameData.player.scoreArr, "W"];
                const newGameData = {
                    ...gameData,
                    player: {
                        ...gameData.player, scoreArr: newScore
                    }
                }
                setGameDate(newGameData);
                saveDataToLocalStorage(newGameData);
                handleEndInitialInning();

            }
        }
        else if (tossStatus === "Lose") {
            if (gameData.robot.scoreArr.length < endInning && randomBowlValue !== parseInt(e.target.value)) {
                let newScore = [...gameData.robot.scoreArr, randomBowlValue.toString()];
                let newTotalScore = newScore.reduce((prev, curr) => {
                    return parseInt(prev) + parseInt(curr);
                })
                let newUpdatedData = {
                    ...gameData,
                    robot: {
                        ...gameData.robot,
                        scoreArr: newScore,
                        totalScore: newTotalScore
                    }
                }
                timer = setTimeout(() => {
                    setGameDate(newUpdatedData);
                    saveDataToLocalStorage(newUpdatedData);
                }, 1500)
            }
            else {
                if (randomBowlValue === parseInt(e.target.value)) {
                    let newScore = [...gameData.robot.scoreArr, "W"];
                    const newGameData = {
                        ...gameData,
                        robot: {
                            ...gameData.robot, scoreArr: newScore
                        }
                    }
                    setGameDate(newGameData);
                    saveDataToLocalStorage(newGameData);
                    handleEndInitialInning();
                }
            }
        }
        timer = setTimeout(() => {
            setDisableButton(false);
        }, 2000);

        return () => clearTimeout(timer);
    }
    return (
        <section className="game-section">
            <h2>Hand Cricket</h2>
            <div className="player-name">
                <div className="player-you">
                    <p>You</p>
                    {tossStatus === "Win" ? <p>Bat</p> : <p>Bowl</p>}
                    {gameData.player.totalScore !== "" && <p>{gameData.player.totalScore}</p>}
                    <div className="score-main">
                        {gameData.player.scoreArr.length > 0 ? gameData.player.scoreArr.map((item) => <p className="score-bg"><span >{item}</span></p>) : ""}
                    </div>
                </div>
                <div className="player-you">
                    <p>Opponent</p>
                    {tossStatus === "Win" ? <p>Bowl</p> : <p>Bat</p>}
                    {gameData.robot.totalScore !== "" && <p>{gameData.robot.totalScore}</p>}
                    <div className="score-main">
                        {gameData.robot.scoreArr.length > 0 ? gameData.robot.scoreArr.map((item) => <p className="score-bg"><span >{item}</span></p>) : ""}
                    </div>
                </div>
            </div>
            <div className="score-values">
                {tossStatus === "Win" ? <p>{bowlValue}</p> : <p>{batValue}</p>}
                {tossStatus === "Lose" ? <p>{bowlValue}</p> : <p>{batValue}</p>}
            </div>
            <div className="score-board">
                <div className="score-board-value">
                    {tossStatus === "Win" ? <p>You are batting</p> : <p>You are bowling</p>}
                    <div>
                        <button className={disableButton ? "btn-disable" : ""} value="1" disabled={disableButton} onClick={handleSelectedScore}>1</button>
                        <button className={disableButton ? "btn-disable" : ""} value="2" disabled={disableButton} onClick={handleSelectedScore}>2</button>
                        <button className={disableButton ? "btn-disable" : ""} value="3" disabled={disableButton} onClick={handleSelectedScore}>3</button>
                    </div>
                    <div>
                        <button className={disableButton ? "btn-disable" : ""} value="4" disabled={disableButton} onClick={handleSelectedScore}>4</button>
                        <button className={disableButton ? "btn-disable" : ""} value="5" disabled={disableButton} onClick={handleSelectedScore}>5</button>
                        <button className={disableButton ? "btn-disable" : ""} value="6" disabled={disableButton} onClick={handleSelectedScore}>6</button>
                    </div>
                </div>
            </div>
            {inningChange && <div className="result-container">
                {tossStatus === "Win" ?
                    <div>
                        <p>You are bowling now⚽</p>
                    </div>
                    :
                    <div>
                        <p>You are batting now🏏</p>
                    </div>}
            </div>}
            {modal && <div className="result-container">
                {result === "Player" ?
                    <div>
                        <p>You Won the Match🏆</p>
                    </div>
                    :
                    <div>
                        <p>You lost the match😔</p>
                    </div>}
            </div>}
        </section>
    )
}

export default Game;
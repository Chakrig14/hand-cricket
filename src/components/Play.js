
import "../css/play.css";
import { useEffect, useMemo, useState } from "react";
import Game from "./Game";

const Play = () => {
    const [timerModal, setTimerModal] = useState(true);
    const tossValue = ["Win", "Lose"];
    const tossWin = useMemo(() => tossValue[Math.round(Math.random())], []);
    const [timerReduce, setTimerReduce] = useState(3);
    useEffect(() => {
        let timer;
        if (timerReduce >= 0) {
            timer = setInterval(() => {
                setTimerReduce(timerReduce - 1);
            }, 1000);
        }
        else {
            setTimerModal(false);
        }
        return () => clearInterval(timer);
    })

    return (
        <section>
            {timerModal ? <div className="toss-modal">
                <div className="toss-modal-container">
                    {tossWin && tossWin === "Win" ? <p>You will be batting first🏏</p> : <p>You will be bowling first⚽</p>}
                    <p><span>Game starts in</span> {timerReduce}</p>
                </div>
            </div> :
                <Game tossWin={tossWin} />
            }

        </section>
    )
}

export default Play;
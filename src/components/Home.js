import { Link } from "react-router-dom";
import "../css/home.css";
import Tournament from "../images/tournament.png";

const Home = () => {
    return (
        <section className="home-bg">
            <div className="container-start">
                <img className="tour-img" src={Tournament} alt="tournament" />
                <Link to="/play"><button className="play-btn">▶️Let's Play</button></Link>
            </div>
        </section>
    )
}

export default Home;
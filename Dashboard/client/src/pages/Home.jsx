import '../styles/Home.css'
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
    <div className="home-container">
      <h1 className="home-title">Welcome to the Quiz App</h1>
      <div className="links">
        <Link to="/register" className="link-button">Register</Link>
        <Link to="/login" className="link-button">Login</Link>
      </div>
    </div>
    </>
  );
}
export default Home;

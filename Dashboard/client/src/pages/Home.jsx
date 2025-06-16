import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <div className="links">
        <Link to="/register" className="link">Register</Link>
        <br />
        <Link to="/login" className="link">Login</Link>
      </div>
    </>
  );
}
export default Home;

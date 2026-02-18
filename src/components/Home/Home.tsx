import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <h1 className="intro">Hi — I am Vernon Quan</h1>
          <p className="lead">I build thoughtful, accessible websites and apps.</p>
          <p>
            <Link className="home-cta" to="/contact">
              Get in touch
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}

import { Link, Outlet } from 'react-router-dom';
import './PageFrame.css';
import Nav from '@/components/Nav/Nav';
import { Chat } from '@/components/Chatbox/Chat';
import { HeaderActions } from '@/components/HeaderActions/HeaderActions';
import { useParticles } from '@/hooks/useParticles';
import { useTheme } from '@/hooks/useTheme';

export default function PageFrame() {
  const { theme } = useTheme();

  useParticles(theme);

  return (
    <div>
      <div id="tsparticles" className="particles-layer" />
      <header className="site-header">
        <div className="wrap header-inner">
          <div className="header-left">
            <Link to="/" className="logo">
              Vernon Quan
            </Link>
            <Nav />
          </div>
          <HeaderActions />
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>
      <Chat />
    </div>
  );
}

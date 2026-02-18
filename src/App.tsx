import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import PageFrame from '@/components/PageFrame/PageFrame';
import LoadingSpinner from '@/components/Spinner/LoadingSpinner';

const Home = lazy(() => import('./components/Home/Home'));
const About = lazy(() => import('./components/About/About'));
const ProjectsIndex = lazy(() => import('./components/projects/Index'));
const ProjectDetail = lazy(() => import('./components/projects/ProjectDetail'));
const Contact = lazy(() => import('./components/Contact/Contact'));
const Resume = lazy(() => import('./components/Resume/Resume'));
const NotFound = lazy(() => import('./components/NotFound/NotFound'));

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="suspense-spinner">
          <LoadingSpinner />
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<PageFrame />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="resume" element={<Resume />} />

          <Route path="projects">
            <Route index element={<ProjectsIndex />} />
            <Route path=":id" element={<ProjectDetail />} />
          </Route>

          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

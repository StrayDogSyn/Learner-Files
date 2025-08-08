import { ProjectShowcase } from '../../components/organisms/ProjectShowcase';

export default function ProjectsPage() {
  return (
    <main className="min-h-screen">
      <ProjectShowcase />
    </main>
  );
}

export const metadata = {
  title: 'Projects | Portfolio',
  description: 'Explore my portfolio of innovative projects, from interactive games to professional web applications. Each project demonstrates cutting-edge technologies and creative problem-solving.',
  keywords: 'projects, portfolio, web development, games, applications, React, TypeScript, Next.js',
};
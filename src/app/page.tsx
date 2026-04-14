import { hackathonDAO, projectDAO, userDAO } from '@/lib/dao';
import { HomePageClient, type Builder, type Hackathon, type HomeStats, type Project } from '@/components/home/HomePageClient';

export const dynamic = 'force-dynamic';

async function getHomeData(): Promise<{
  stats: HomeStats;
  hackathons: Hackathon[];
  projects: Project[];
  builders: Builder[];
}> {
  const [
    buildersCount,
    projectsCount,
    hackathonsCount,
    allHackathons,
    allUsers,
    hackathonPage,
    topProjects,
    topBuilders,
  ] = await Promise.all([
    userDAO.count(),
    projectDAO.count(),
    hackathonDAO.count(),
    hackathonDAO.findAll(),
    userDAO.findAll(),
    hackathonDAO.getPaginated(1, 6),
    projectDAO.getTopRanked(6),
    userDAO.getTopByAwards(6),
  ]);

  const uniqueCities = new Set(
    allHackathons
      .map((hackathon: any) => [hackathon.city, hackathon.country].filter(Boolean).join(', '))
      .filter(Boolean)
  );

  const badgesEarned = allUsers.reduce((sum: number, user: any) => {
    return sum + (user.badge_count || 0);
  }, 0);

  return {
    stats: {
      buildersConnected: buildersCount,
      projectsShipped: projectsCount,
      citiesCovered: uniqueCities.size,
      badgesEarned,
    },
    hackathons: (hackathonPage.data || []) as Hackathon[],
    projects: (topProjects || []) as Project[],
    builders: (topBuilders || []) as Builder[],
  };
}

export default async function Home() {
  const { stats, hackathons, projects, builders } = await getHomeData();

  return (
    <HomePageClient
      initialStats={stats}
      initialHackathons={hackathons}
      initialProjects={projects}
      initialBuilders={builders}
    />
  );
}

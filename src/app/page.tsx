import { hackathonDAO, projectDAO, userDAO } from '@/lib/dao';
import { HomePageClient, type Builder, type Hackathon, type HomeStats, type Project } from '@/components/home/HomePageClient';
import { talentPlanetPoints } from '@/data/talent-planet';

export const dynamic = 'force-dynamic';

function toTimestamp(value: string | undefined | null): number {
  if (!value) return 0;
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function buildTrendingProjects(projects: any[], limit: number): Project[] {
  return projects
    .filter((project) => project.status === 'published' && !project.hidden)
    .sort((left, right) => {
      const likeDelta = (right.like_count || 0) - (left.like_count || 0);
      if (likeDelta !== 0) return likeDelta;

      const leftRank = typeof left.rank_score === 'number' ? left.rank_score : Number.POSITIVE_INFINITY;
      const rightRank = typeof right.rank_score === 'number' ? right.rank_score : Number.POSITIVE_INFINITY;
      if (leftRank !== rightRank) return leftRank - rightRank;

      return toTimestamp(right.created_at) - toTimestamp(left.created_at);
    })
    .slice(0, limit) as Project[];
}

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
    allProjects,
    topBuilders,
  ] = await Promise.all([
    userDAO.count(),
    projectDAO.count(),
    hackathonDAO.count(),
    hackathonDAO.findAll(),
    userDAO.findAll(),
    hackathonDAO.getPaginated(1, 6),
    projectDAO.findAll({ status: 'published', hidden: 0 }),
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
      buildersConnected: buildersCount + talentPlanetPoints.length,
      projectsShipped: projectsCount,
      citiesCovered: uniqueCities.size,
      badgesEarned,
    },
    hackathons: (hackathonPage.data || []) as Hackathon[],
    projects: buildTrendingProjects(allProjects || [], 6),
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

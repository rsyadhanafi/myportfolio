import PortfolioApp from '@/components/portfolio/PortfolioApp'
import { getStoryData } from '@/lib/story'
import { getProjectsData } from '@/lib/projects'
import { getTalksData } from '@/lib/talks'

export default async function HomePage() {
  const [storyData, projects, talks] = await Promise.all([
    getStoryData(),
    getProjectsData(),
    getTalksData(),
  ])

  return <PortfolioApp storyData={storyData} projects={projects} talks={talks} />
}
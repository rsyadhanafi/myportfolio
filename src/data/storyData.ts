import type { StoryMilestone } from '@/payload-types'

export type StoryData = {
  id: StoryMilestone['id']
  year: string
  range: string
  start: string
  title: string
  organization: string
  points: string[]
}

export function storyGlow(year: string): string {
  if (year === '2026') return 'rgba(235, 150, 100, 0.22)'
  if (year === '2025') return 'rgba(100, 175, 170, 0.22)'
  if (year === '2024') return 'rgba(170, 150, 210, 0.20)'
  if (year === '2023') return 'rgba(220, 155, 110, 0.20)'
  if (year === '2022') return 'rgba(215, 180, 120, 0.20)'
  return 'rgba(120, 170, 140, 0.18)'
}

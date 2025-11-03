import { assetPath } from '../utils/assetPath'

export const newsItems = [
  {
    id: 1,
    teamSlug: 'atlanta-falcons',
    image: assetPath('images/penix.png'),
    alt: 'Falcons quarterback scanning the field',
    title: 'Falcons streak hits three',
    description: 'The Falcons defense clamps down again, setting the tone for a pivotal road win.',
    previewLink: `/team/atlanta-falcons`,
    newsLink: `/team/atlanta-falcons/news`
  },
  {
    id: 2,
    teamSlug: 'manchester-united',
    image: assetPath('images/amad.png'),
    alt: 'Manchester United winger attacking space',
    title: 'United holds on late',
    description: 'Back-to-back one-goal wins have Manchester climbing the standings.',
    previewLink: `/team/manchester-united`,
    newsLink: `/team/manchester-united/news`
  },
  {
    id: 3,
    teamSlug: 'atlanta-hawks',
    image: assetPath('images/hawksfan.png'),
    alt: 'Hawks supporters in the away section',
    title: 'Hawks look to rebound',
    description: 'The Hawks focuses on set-piece execution heading into a challenging stretch.',
    previewLink: `/team/atlanta-hawks`,
    newsLink: `/team/atlanta-hawks/news`
  }
]

export function getTeamNews(teamSlug) {
  return newsItems.filter(item => item.teamSlug === teamSlug)
}


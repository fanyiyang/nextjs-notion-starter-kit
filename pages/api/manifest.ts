import { type NextApiRequest, type NextApiResponse } from 'next'

import * as config from '@/lib/config'

/**
 * Serves the web app manifest dynamically so its name and description stay in
 * sync with `site.config.ts`. Exposed as `/manifest.json` via a rewrite in
 * `next.config.js`.
 */
export default function manifest(_req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/manifest+json')
  res.setHeader(
    'Cache-Control',
    'public, max-age=3600, s-maxage=86400, stale-while-revalidate=3600'
  )

  res.send(
    JSON.stringify(
      {
        name: config.name,
        short_name: config.name,
        description: config.description,
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/favicon.png',
            type: 'image/png',
            sizes: '32x32'
          },
          {
            src: '/favicon-128x128.png',
            type: 'image/png',
            sizes: '128x128'
          },
          {
            src: '/favicon-192x192.png',
            type: 'image/png',
            sizes: '192x192'
          }
        ],
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone'
      },
      null,
      2
    )
  )
}

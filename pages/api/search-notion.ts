import { type NextApiRequest, type NextApiResponse } from 'next'

import type * as types from '../../lib/types'
import { search } from '../../lib/notion'

export default async function searchNotion(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).send({ error: 'method not allowed' })
  }

  const searchParams: types.SearchParams = req.body

  console.log('<<< lambda search-notion', searchParams)

  try {
    const results = await search(searchParams)
    console.log('>>> lambda search-notion', results?.results?.length)

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=60, max-age=60, stale-while-revalidate=60'
    )
    res.status(200).json(results)
  } catch (err) {
    // Notion sometimes rejects search requests coming from datacenter IPs.
    // Degrade to an empty result set instead of a 500 so the search dialog
    // stays usable, and surface the upstream error for debugging.
    console.error('lambda search-notion error', err)

    res.status(200).json({
      results: [],
      total: 0,
      recordMap: { block: {} },
      error: err?.message ?? 'notion search failed'
    } as unknown as types.SearchResults)
  }
}

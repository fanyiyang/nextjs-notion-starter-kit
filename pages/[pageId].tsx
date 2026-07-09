import { type GetStaticProps } from 'next'

import { NotionPage } from '@/components/NotionPage'
import { domain } from '@/lib/config'
import { resolveNotionPage } from '@/lib/resolve-notion-page'
import { type PageProps, type Params } from '@/lib/types'

export const getStaticProps: GetStaticProps<PageProps, Params> = async (
  context
) => {
  const rawPageId = context.params.pageId as string

  try {
    const props = await resolveNotionPage(domain, rawPageId)

    return { props, revalidate: 10 }
  } catch (err) {
    console.error('page error', domain, rawPageId, err)

    // we don't want to publish the error version of this page, so
    // let next.js know explicitly that incremental SSG failed
    throw err
  }
}

export async function getStaticPaths() {
  // Pages are generated on-demand via ISR instead of being prerendered at
  // build time. Prerendering the full site map fires a burst of concurrent
  // requests at Notion's API, which rate-limits them (429) and fails the
  // whole build.
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export default function NotionDomainDynamicPage(props) {
  return <NotionPage {...props} />
}

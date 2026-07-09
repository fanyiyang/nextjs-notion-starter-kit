import { NotionAPI } from 'notion-client'
import { type ExtendedRecordMap } from 'notion-types'

export const notion = new NotionAPI({
  apiBaseUrl: process.env.NOTION_API_BASE_URL
})

const maxRetries = 3

/**
 * Fetches a page's record map, retrying transient Notion API failures.
 *
 * Notion aggressively rate-limits concurrent page fetches (which `next build`
 * triggers when prerendering many pages at once), so 429s and 5xxs are
 * retried with exponential backoff instead of failing the whole build.
 */
export async function getPageRecordMap(
  pageId: string,
  opts?: Parameters<NotionAPI['getPage']>[1]
): Promise<ExtendedRecordMap> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await notion.getPage(pageId, opts)
    } catch (err) {
      const status: number | undefined =
        err?.status ?? err?.statusCode ?? err?.response?.status
      const isRetryable =
        status === 429 ||
        (status !== undefined && status >= 500) ||
        /429|too many requests/i.test(String(err?.message))

      if (!isRetryable || attempt >= maxRetries) {
        throw err
      }

      const delayMs = 2 ** attempt * 5000 + Math.random() * 1000
      console.warn(
        `notion getPage "${pageId}" failed (status ${status}); retry ${
          attempt + 1
        }/${maxRetries} in ${Math.round(delayMs)}ms`
      )
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  }
}

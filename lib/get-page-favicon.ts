import { type Block, type ExtendedRecordMap } from 'notion-types'
import { getBlockIcon, isUrl } from 'notion-utils'

import { defaultPageIcon } from './config'
import { mapImageUrl } from './map-image-url'

/**
 * Gets the favicon to use for a given page, preferring the page's Notion icon
 * and falling back to the site-wide `defaultPageIcon` from `site.config.ts`.
 *
 * Emoji icons are converted to an inline SVG data URI so the browser tab
 * mirrors the page's emoji.
 */
export function getPageFavicon(
  block: Block,
  recordMap: ExtendedRecordMap
): string | null {
  const icon = getBlockIcon(block, recordMap) ?? defaultPageIcon
  if (!icon) {
    return null
  }

  // notion image icons may be absolute URLs, relative notion.so paths, or
  // data URIs
  if (isUrl(icon) || icon.startsWith('/') || icon.startsWith('data:')) {
    return mapImageUrl(icon, block) ?? null
  }

  // otherwise, the icon is an emoji
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="55" font-size="85" text-anchor="middle" dominant-baseline="central">${icon}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

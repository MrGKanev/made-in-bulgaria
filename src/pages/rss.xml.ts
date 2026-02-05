import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE_URL = 'https://mrgkanev.github.io/made-in-bulgaria';
const SITE_TITLE = 'Made in Bulgaria';
const SITE_DESCRIPTION = 'Discover innovative tech projects, open-source software, and companies made in Bulgaria.';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const GET: APIRoute = async () => {
  const projectEntries = await getCollection('projects');

  // Sort by stars descending
  const projects = projectEntries
    .map(entry => entry.data)
    .sort((a, b) => b.stars - a.stars);

  const items = projects.map(project => {
    const pubDate = project.lastCommit
      ? new Date(project.lastCommit).toUTCString()
      : new Date().toUTCString();

    return `
    <item>
      <title>${escapeXml(project.name)}</title>
      <link>${SITE_URL}/projects/${project.slug}/</link>
      <description>${escapeXml(project.description)}</description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="true">${SITE_URL}/projects/${project.slug}/</guid>
      <category>${escapeXml(project.category)}</category>
      <author>${escapeXml(project.owner)}</author>
    </item>`;
  }).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}/</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>bg-BG</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/favicon.svg</url>
      <title>${escapeXml(SITE_TITLE)}</title>
      <link>${SITE_URL}/</link>
    </image>
    ${items}
  </channel>
</rss>`.trim();

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};

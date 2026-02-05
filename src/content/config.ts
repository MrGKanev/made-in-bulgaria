import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    category: z.enum(['open-source', 'company', 'dev-tool', 'saas', 'app']),
    url: z.string().url(),
    github: z.string().url().optional(),
    github_username: z.string(),
    stars: z.number().default(0),
    owner: z.string(),
    status: z.enum(['active', 'inactive', 'deprecated']).default('active'),
    // Extended GitHub data
    lastCommit: z.string().nullable().optional(), // ISO date string
    languages: z.array(z.string()).default([]),
    contributorsCount: z.number().default(0)
  })
});

export const collections = {
  projects: projectsCollection
};

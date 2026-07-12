import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
    layout: z.string().optional(),
  }),
});

const caseCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/case" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    seo: z.object({
      title: z.string(),
      description: z.string(),
    }).optional(),
    layout: z.string().optional(),
    category: z.string(),
    categorySlug: z.string(),
    image: z.string(),
    clientName: z.string().optional(),
    location: z.string().optional(),
    timeline: z.string().optional(),
    challenges: z.array(z.object({
      title: z.string(),
      description: z.string(),
      image: z.string().optional(),
      points: z.array(z.string()).optional(),
    })).optional(),
    approach: z.array(z.object({
      title: z.string(),
      description: z.string(),
    })).optional(),
    approachConclusion: z.string().optional(),
    projectFaqs: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
  }),
});

const servicesCollection = defineCollection({
  loader: glob({
    pattern: '*/index.md',
    base: "./src/content/services",
    generateId: ({ entry }) => entry.replace(/\/index\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    seo: z.object({
      title: z.string(),
      description: z.string(),
    }).optional(),
    hub: z.boolean().optional(),
    layout: z.string().optional(),
    image: z.string().optional(),
    no: z.string().optional(),
    icon: z.string().optional(),
    tags: z.array(z.string()).optional(),
    offersTitle: z.string().optional(),
    offersDescription: z.string().optional(),
    offers: z.array(z.object({
      title: z.string(),
      description: z.string(),
      icon: z.string().optional(),
    })).optional(),
    featuresTitle: z.string().optional(),
    featuresDescription: z.string().optional(),
    features: z.array(z.string()).optional(),
    stats: z.array(z.object({
      value: z.string(),
      suffix: z.string().optional(),
      label: z.string(),
    })).optional(),
    faqs: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
    process: z.object({
      title: z.string(),
      description: z.string().optional(),
      step1Title: z.string().optional(),
      step1Desc: z.string().optional(),
      step2Title: z.string().optional(),
      step2Desc: z.string().optional(),
      step3Title: z.string().optional(),
      step3Desc: z.string().optional(),
      step4Title: z.string().optional(),
      step4Desc: z.string().optional(),
    }).optional(),
    pricing: z.object({
      title: z.string(),
      description: z.string().optional(),
      items: z.array(z.object({
        title: z.string(),
        price: z.string(),
        description: z.string().optional(),
        features: z.array(z.string()).optional(),
      })).optional(),
    }).optional(),
  }),
});

const serviceLandingCollection = defineCollection({
  loader: glob({ pattern: ['*/*.md', '!*/index.md'], base: "./src/content/services" }),
  schema: z.object({
    layout: z.string().optional(),
    cluster: z.string(),
    title: z.string(),
    description: z.string(),
    seo: z.object({
      title: z.string(),
      description: z.string(),
    }).optional(),
    excerpt: z.string().optional(),
    dateLabel: z.string().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    icon: z.string().optional(),
    order: z.number().default(0),
    tags: z.array(z.string()).optional(),
    offersTitle: z.string().optional(),
    offersDescription: z.string().optional(),
    offers: z.array(z.object({
      title: z.string(),
      description: z.string(),
      icon: z.string().optional(),
    })).optional(),
    featuresTitle: z.string().optional(),
    featuresDescription: z.string().optional(),
    features: z.array(z.string()).optional(),
    stats: z.array(z.object({
      value: z.string(),
      suffix: z.string().optional(),
      label: z.string(),
    })).optional(),
    faqs: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
    process: z.object({
      title: z.string(),
      description: z.string().optional(),
      step1Title: z.string().optional(),
      step1Desc: z.string().optional(),
      step2Title: z.string().optional(),
      step2Desc: z.string().optional(),
      step3Title: z.string().optional(),
      step3Desc: z.string().optional(),
      step4Title: z.string().optional(),
      step4Desc: z.string().optional(),
    }).optional(),
    pricing: z.object({
      title: z.string(),
      description: z.string().optional(),
      items: z.array(z.object({
        title: z.string(),
        price: z.string(),
        description: z.string().optional(),
        features: z.array(z.string()).optional(),
      })).optional(),
    }).optional(),
  }),
});

const landingBlocksSchema = {
  keywords: z.string().optional(),
  image: z.string().optional(),
  breadcrumbTitle: z.string().optional(),
  breadcrumbLabel: z.string().optional(),
  about: z.object({
    subTitle: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    counterValue: z.string().optional(),
    counterTag: z.string().optional(),
    counterDescription: z.string().optional(),
  }).optional(),
  feature: z.object({
    subTitle: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
  }).optional(),
  introVideo: z.object({
    subTitle: z.string().optional(),
    title: z.string().optional(),
    tickerItems: z.array(z.string()).optional(),
  }).optional(),
  services: z.object({
    subTitle: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    limit: z.number().optional(),
  }).optional(),
  process: z.object({
    subTitle: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    step1Title: z.string().optional(),
    step1Desc: z.string().optional(),
    step2Title: z.string().optional(),
    step2Desc: z.string().optional(),
    step3Title: z.string().optional(),
    step3Desc: z.string().optional(),
    step4Title: z.string().optional(),
    step4Desc: z.string().optional(),
  }).optional(),
  choose: z.object({
    subTitle: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    benefit1Title: z.string().optional(),
    benefit1Desc: z.string().optional(),
    benefit2Title: z.string().optional(),
    benefit2Desc: z.string().optional(),
  }).optional(),
  pricingVariant: z.enum(['consultation', 'hire', 'training']).optional(),
  faqsVariant: z.enum(['consultation', 'hire']).optional(),
  showProjects: z.boolean().optional(),
  bgSections: z.boolean().optional(),
  cta: z.object({
    subTitle: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    formTitle: z.string().optional(),
  }).optional(),
};

const landingClusterCollection = defineCollection({
  loader: glob({
    pattern: '*/index.md',
    base: "./src/content/landings",
    generateId: ({ entry }) => entry.replace(/\/index\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    hub: z.boolean().optional(),
    layout: z.string().optional(),
    seo: z.object({ title: z.string(), description: z.string() }).optional(),
    ...landingBlocksSchema,
  }),
});

const landingSpokeCollection = defineCollection({
  loader: glob({ pattern: ['*/*.md', '!*/index.md'], base: "./src/content/landings" }),
  schema: z.object({
    layout: z.string().optional(),
    cluster: z.string(),
    title: z.string(),
    description: z.string(),
    seo: z.object({ title: z.string(), description: z.string() }).optional(),
    excerpt: z.string().optional(),
    order: z.number().default(0),
    ...landingBlocksSchema,
  }),
});

export const collections = {
  'blog': blogCollection,
  'case': caseCollection,
  'services': servicesCollection,
  'serviceLanding': serviceLandingCollection,
  'landingCluster': landingClusterCollection,
  'landingSpoke': landingSpokeCollection,
};

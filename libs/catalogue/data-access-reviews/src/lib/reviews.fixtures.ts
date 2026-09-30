import { Review } from '@workshop/catalogue-types';

type ReviewFixture = Omit<Review, 'id' | 'productId'>;

// Copy matches the Figma "Default" frame (node 1-290).
const REVIEW_FIXTURES: ReviewFixture[] = [
  {
    author: 'Alex M.',
    rating: 5,
    text: 'Arrived in perfect condition, leaves were lush and healthy. Packaged with real care — not a single leaf bruised in transit. Would order again without hesitation.',
    createdAt: '2025-03-14T09:00:00.000Z',
  },
  {
    author: 'Sofia K.',
    rating: 3,
    text: 'Nice plant but slightly smaller than expected. The photos on the listing feel a bit generous. Still healthy and well-rooted, just give yourself realistic expectations on size.',
    createdAt: '2025-02-20T09:00:00.000Z',
  },
  {
    author: 'Jamie P.',
    rating: 4,
    text: "Third plant I've ordered here. Consistent quality, fast delivery. This one had a couple of minor yellowed leaves on arrival but bounced back within a week of good light.",
    createdAt: '2025-01-08T09:00:00.000Z',
  },
];

export function seedReviews(productId: number): Review[] {
  return REVIEW_FIXTURES.map((fixture, index) => ({
    ...fixture,
    id: `seed-${productId}-${index}`,
    productId,
  })).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

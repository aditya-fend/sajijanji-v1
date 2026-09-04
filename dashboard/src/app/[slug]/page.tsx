import React from 'react';
import { Metadata } from 'next';
import PublicInvitationPageClient from './PublicInvitationPageClient';

export const revalidate = 60; // Incremental Static Regeneration (ISR)

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ to?: string }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const slug = resolvedParams.slug || 'romeo-juliet';
  const guestName = resolvedSearchParams.to ? decodeURIComponent(resolvedSearchParams.to) : '';

  const title = guestName
    ? `Undangan Pernikahan Romeo & Juliet - Kepada Yth. ${guestName}`
    : 'The Wedding of Romeo & Juliet';

  const description =
    'Kami mengundang Anda untuk dapat hadir dan memberikan doa restu pada hari kebahagiaan pernikahan kami.';
  const ogImage =
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&auto=format&fit=crop&q=80';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function PublishedInvitationPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const guestName = resolvedSearchParams.to ? decodeURIComponent(resolvedSearchParams.to) : '';

  return <PublicInvitationPageClient guestName={guestName} slug={resolvedParams.slug} />;
}

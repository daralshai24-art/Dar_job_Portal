'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

export default function AnalyticsTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // 1. Get or Create Visitor ID
        let visitorId = localStorage.getItem('site_visitor_id');
        if (!visitorId) {
            visitorId = uuidv4();
            localStorage.setItem('site_visitor_id', visitorId);
        }

        // 2. Send tracking event
        // Debounce slightly to avoid duplicate firing on strict mode or rapid changes if needed, 
        // but usually direct call is fine for simpler setups.
        const trackPage = async () => {
            try {
                await fetch('/api/analytics/track', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        visitorId,
                        path: pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ''),
                    }),
                });
            } catch (error) {
                console.error('Tracking failed', error);
            }
        };

        trackPage();
    }, [pathname, searchParams]); // Re-run on route change

    return null; // This component renders nothing
}

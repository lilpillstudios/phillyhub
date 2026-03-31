/**
 * useRemoteEvents.js — Live Event Data Hook
 * PhillyHub — Lil Pill Studios © 2026
 *
 * Fetches fresh events.json from hosted GitHub raw URL.
 * Falls back to bundled data if offline or fetch fails.
 *
 * Configure EVENTS_URL after pushing your scraper repo:
 * https://raw.githubusercontent.com/YOUR_USERNAME/phillyhub-events/main/events.json
 */

import { useState, useEffect } from "react";

// ── Replace with your actual GitHub raw URL ──
const EVENTS_URL =
  "https://raw.githubusercontent.com/YOUR_USERNAME/phillyhub-events/main/events.json";

const CACHE_KEY = "ph_events_cache";
const CACHE_TTL = 1000 * 60 * 60 * 4; // 4 hours

export function useRemoteEvents(bundledEvents) {
  const [events, setEvents] = useState(bundledEvents);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("bundled");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // 1. Check cache
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (raw) {
          const cached = JSON.parse(raw);
          if (Date.now() - (cached._ts || 0) < CACHE_TTL && cached.events?.length) {
            if (!cancelled) {
              setEvents(cached.events);
              setSource("cache");
              setLoading(false);
            }
            fetchFresh();
            return;
          }
        }
      } catch {}

      // 2. No cache — fetch
      await fetchFresh();
    }

    async function fetchFresh() {
      try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 8000);
        const resp = await fetch(EVENTS_URL, { signal: ctrl.signal, cache: "no-cache" });
        clearTimeout(timer);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        const valid = (data.events || []).filter(
          (e) => e.id && e.title && e.date && e.lat && e.lng
        );
        if (valid.length && !cancelled) {
          setEvents(valid);
          setSource("remote");
          setLoading(false);
          try {
            localStorage.setItem(
              CACHE_KEY,
              JSON.stringify({ events: valid, _ts: Date.now() })
            );
          } catch {}
          return;
        }
        throw new Error("No valid events");
      } catch {
        if (!cancelled) {
          setSource(events === bundledEvents ? "bundled" : "cache");
          setLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { events, loading, source };
}

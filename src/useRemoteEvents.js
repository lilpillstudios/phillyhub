/**
 * useRemoteEvents.js — Live Event Data Hook
 * PhillyHub — Lil Pill Studios © 2026
 *
 * Fetches fresh events.json from hosted GitHub raw URL.
 * Maps scraper fields to app fields.
 * Falls back to bundled data if offline or fetch fails.
 */
import { useState, useEffect } from "react";

const EVENTS_URL =
  "https://raw.githubusercontent.com/lilpillstudios/phillyhub-events/main/events.json";
const CACHE_KEY = "ph_events_cache";
const CACHE_TTL = 1000 * 60 * 60 * 4; // 4 hours

function mapEvent(e) {
  return {
    id: e.id,
    title: e.title,
    date: e.date,
    time: e.time || "Various",
    venue: e.venue || "Philadelphia",
    addr: e.addr || e.venue || "",
    lat: e.lat,
    lng: e.lng,
    cat: e.cat || "america250",
    free: e.free || false,
    desc: e.description || e.desc || "",
    tix: e.ticketUrl || e.tix || null,
  };
}

export function useRemoteEvents(bundledEvents) {
  const [events, setEvents] = useState(bundledEvents);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("bundled");
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

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
              setEvents(cached.events.map(mapEvent));
              setSource("cache");
              setLastUpdated(cached.scraped_at);
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
        if (!resp.ok) throw new Error("HTTP " + resp.status);
        const data = await resp.json();
        const valid = (data.events || []).filter(
          (e) => e.id && e.title && e.date && e.lat && e.lng
        );
        if (valid.length && !cancelled) {
          setEvents(valid.map(mapEvent));
          setSource("remote");
          setLastUpdated(data.scraped_at);
          setLoading(false);
          try {
            localStorage.setItem(
              CACHE_KEY,
              JSON.stringify({ events: valid, scraped_at: data.scraped_at, _ts: Date.now() })
            );
          } catch {}
          return;
        }
        throw new Error("No valid events");
      } catch (e) {
        if (!cancelled) {
          setError(e.name + ": " + e.message);
          setSource("bundled");
          setLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { events, loading, source, error, lastUpdated };
}

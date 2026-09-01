"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import { branches } from "@/lib/clinic";

export function BranchMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, { scrollWheelZoom: false });
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const icon = L.divIcon({
        className: "",
        iconSize: [22, 22],
        iconAnchor: [11, 11],
        html: '<div style="width:22px;height:22px;border-radius:50%;background:#2F5D57;border:3px solid #FAFBF7;box-shadow:0 1px 4px rgba(31,61,51,0.45)"></div>',
      });

      const points = branches.map((branch) => {
        const marker = L.marker(branch.position, { icon, title: branch.name }).addTo(map);
        marker.bindPopup(
          `<div style="font-size:13px;line-height:1.6"><strong style="font-size:16px">${branch.name} branch</strong><br>${branch.address}<br><a href="${branch.tel.href}">${branch.tel.label}</a></div>`,
        );
        return marker.getLatLng();
      });

      map.fitBounds(L.latLngBounds(points).pad(0.45));
      setTimeout(() => map.invalidateSize(), 200);
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-[340px] w-full border border-ink/15 bg-fog font-body"
      aria-label="Map of our branches"
    />
  );
}

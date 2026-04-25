import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { ReactNode } from 'react'

import iconRetina from 'leaflet/dist/images/marker-icon-2x.png'
import iconDefault from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: iconDefault,
  shadowUrl: iconShadow,
})

const COLOR_HEX: Record<string, string> = {
  indigo: '#4f46e5',
  blue: '#2563eb',
  green: '#16a34a',
  red: '#dc2626',
  yellow: '#d97706',
  gray: '#6b7280',
}

function coloredIcon(color: string, label?: string | number): L.DivIcon {
  const fill = COLOR_HEX[color] ?? color
  const html = `
    <div style="
      background:${fill};
      width:26px;height:26px;border-radius:50%;
      border:3px solid white;
      box-shadow:0 1px 4px rgba(0,0,0,0.4);
      color:white;font-size:11px;font-weight:700;
      display:flex;align-items:center;justify-content:center;
      font-family:system-ui,sans-serif;
    ">${label ?? ''}</div>
  `
  return L.divIcon({
    html,
    className: '',
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -13],
  })
}

export type MapMarker = {
  id: string
  lat: number
  lng: number
  color?: string
  label?: string | number
  popup?: ReactNode
}

type MapViewProps = {
  markers: MapMarker[]
  path?: Array<{ lat: number; lng: number }>
  pathColor?: string
  height?: string
  fitBounds?: boolean
  fallbackCenter?: [number, number]
  fallbackZoom?: number
}

const IZMIR_CENTER: [number, number] = [38.4192, 27.1287]

function FitBounds({
  markers,
  fallbackCenter,
  fallbackZoom,
}: {
  markers: MapMarker[]
  fallbackCenter: [number, number]
  fallbackZoom: number
}) {
  const map = useMap()

  useEffect(() => {
    if (markers.length === 0) {
      map.setView(fallbackCenter, fallbackZoom)
      return
    }
    if (markers.length === 1) {
      map.setView([markers[0].lat, markers[0].lng], 15)
      return
    }
    const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng] as [number, number]))
    map.fitBounds(bounds, { padding: [40, 40] })
  }, [markers, map, fallbackCenter, fallbackZoom])

  return null
}

export function MapView({
  markers,
  path,
  pathColor = 'indigo',
  height = '100%',
  fitBounds = true,
  fallbackCenter = IZMIR_CENTER,
  fallbackZoom = 12,
}: MapViewProps) {
  return (
    <MapContainer
      center={fallbackCenter}
      zoom={fallbackZoom}
      style={{ height, width: '100%' }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {path && path.length >= 2 && (
        <Polyline
          positions={path.map((p) => [p.lat, p.lng])}
          pathOptions={{
            color: COLOR_HEX[pathColor] ?? pathColor,
            weight: 4,
            opacity: 0.7,
            dashArray: '6 8',
          }}
        />
      )}
      {markers.map((m) => (
        <Marker
          key={m.id}
          position={[m.lat, m.lng]}
          icon={coloredIcon(m.color ?? 'indigo', m.label)}
        >
          {m.popup && <Popup>{m.popup}</Popup>}
        </Marker>
      ))}
      {fitBounds && (
        <FitBounds
          markers={markers}
          fallbackCenter={fallbackCenter}
          fallbackZoom={fallbackZoom}
        />
      )}
    </MapContainer>
  )
}

import L from "leaflet";
import retina_marker_icon from "leaflet/dist/images/marker-icon-2x.png";
import marker_icon from "leaflet/dist/images/marker-icon.png";
import marker_shadow from "leaflet/dist/images/marker-shadow.png";

const LeafIcon = L.Icon.extend({
  options: {
    iconSize: [25, 41],
    shadowSize: [41, 41],
    iconAnchor: [12, 41],
    shadowAnchor: [4, 62],
    popupAnchor: [-3, -76],
  },
});
const icon = new LeafIcon({
  iconUrl: "/assets/" + marker_icon,
  iconRetinaUrl: "/assets/" + retina_marker_icon,
  shadowUrl: "/assets/" + marker_shadow,
});

let globalMaps = {};

const setupMap = (el) => {
  // Setup root map node
  let root = document.getElementById(el.id + "-osm");
  let map_el = document.getElementById(el.id + "-osm-map");
  root.classList = el.classList;
  map_el.classList = el.classList;

  const style = "style" in el.dataset ? el.dataset.style : "light_all";

  setTimeout(() => {
    // Create Leaflet map on map element.
    let map = L.map(map_el, {
      center: [0, 0],
      zoom: 1,
      maxBounds: [
        [-90, -180],
        [90, 180],
      ],
      maxBoundsViscosity: 1.0,
      minZoom: 2,
    });
    globalMaps[el.id] = { map: map, feature_group: null };

    // Add OSM tile layer to the Leaflet map.
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/" + style + "/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        noWrap: true,
      },
    ).addTo(map);

    updateMap(el);
  }, 100);
};

const updateMap = (el) => {
  let markers = el.querySelectorAll("div[data-latitude][data-longitude]");
  const map = globalMaps[el.id];

  if (map.feature_group) {
    map.feature_group.clearLayers();
  }

  // Place all markers
  let l_markers = Array.from(markers).reduce((acc, marker) => {
    let { latitude, longitude, radius, type, properties } = marker.dataset;

    const target = L.latLng(latitude, longitude);

    properties =
      typeof properties === "undefined" ? {} : JSON.parse(properties);

    let l_marker;
    if (type == "circle") {
      l_marker = L.circleMarker(target, properties);
    } else {
      properties["icon"] = icon;

      l_marker = L.marker(target, properties);
    }

    // Draw radius circle if provided
    if (typeof radius !== "undefined") {
      const circle = L.circle([latitude, longitude], {
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.3,
        radius: radius,
      }).addTo(map.map);
      acc.push(circle);
    }

    if (marker.innerHTML) {
      l_marker.bindPopup(marker.innerHTML);
    }
    acc.push(l_marker);

    return acc;
  }, []);

  let feature_group = L.featureGroup(l_markers).addTo(map.map);

  globalMaps[el.id].feature_group = feature_group;

  map.map.fitBounds(feature_group.getBounds());
};

const OSM = {
  mounted() {
    setupMap(this.el);
  },
  updated() {
    updateMap(this.el);
  },
  destroyed() {
    delete globalMaps[this.el.id];
  },
};

export { OSM };

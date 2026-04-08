import "leaflet";

declare module "leaflet" {
  interface MarkerCluster {
    getChildCount(): number;
  }

  interface MarkerClusterGroupOptions {
    disableClusteringAtZoom?: number;
    iconCreateFunction?: (cluster: MarkerCluster) => DivIcon;
    maxClusterRadius?: number | ((zoom: number) => number);
    showCoverageOnHover?: boolean;
    spiderfyOnMaxZoom?: boolean;
  }

  interface MarkerClusterGroup extends FeatureGroup {
    clearLayers(): this;
  }

  function markerClusterGroup(
    options?: MarkerClusterGroupOptions,
  ): MarkerClusterGroup;
}

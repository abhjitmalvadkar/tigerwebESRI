import EsriMap from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import {Component, ElementRef, ViewChild} from "@angular/core";

@Component({
  selector: 'app-map-component',
  imports: [],
  templateUrl: './map-component.html',
  styleUrl: './map-component.css'
})
export class MapComponent {
  @ViewChild('mapViewDiv', {static: true}) mapViewDiv!: ElementRef;
  private view!: MapView;

  ngOnInit(): void {
    const map = new EsriMap({
      basemap: 'streets-navigation-vector'
    });

    this.view = new MapView({
      container: this.mapViewDiv.nativeElement,
      map: map,
      center: [-98.5795, 39.8283],
      zoom: 5,
    });

    const layerConfigs = [
      { id: 0, color: [255, 0, 0], title: 'Primary Roads Interstates (5M)' },
      { id: 1, color: [255, 102, 0], title: 'Primary Roads (2.1M)' },
      { id: 2, color: [204, 0, 0], title: 'Primary Roads' },
      { id: 3, color: [0, 0, 255], title: 'Secondary Roads Interstates' },
      { id: 4, color: [102, 178, 255], title: 'Secondary Roads (578k)' },
      { id: 5, color: [0, 255, 255], title: 'Secondary Roads (289–144k)' },
      { id: 6, color: [0, 128, 128], title: 'Secondary Roads (72–1k)' },
      { id: 7, color: [160, 160, 160], title: 'Local Roads (72k)' },
      { id: 8, color: [64, 64, 64], title: 'Local Roads' },
      { id: 9, color: [0, 0, 0], title: 'Railroads' }
    ];

    layerConfigs.forEach(({ id, color, title }) => {
      const layer = new FeatureLayer({
        url: `https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Transportation/MapServer/${id}`,
        outFields: ['*'],
        title,
        renderer: {
          type: 'simple',
          symbol: {
            type: 'simple-line',
            color,
            width: 1.5
          }
        },
        popupTemplate: {
          title: '{FULLNAME}',
          content: `
            <ul>
              <li><strong>Route:</strong> {FULLNAME}</li>
            </ul>
          `
        }
      });
      map.add(layer);
    });
  }
}

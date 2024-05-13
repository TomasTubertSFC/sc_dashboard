import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, effect, signal } from '@angular/core';
import { environment } from '../../../environments/environments';
import { ObservationsService } from '../observations/observations.service';
import { MapObservation, ObservationGeoJSON } from '../../models/map';
import mapboxgl, { LngLat, LngLatBounds, LngLatLike, Map } from 'mapbox-gl';
import { Observations } from '../../models/observations';
import { FeatureCollection, Geometry } from 'geojson';
import { BehaviorSubject, Subject } from 'rxjs';
import { FormFilterValues } from '../../models/forms';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  public map!: Map;

  get isMapReady(): boolean {
    return !!this.map;
  }

  public isFilterActive: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  private mapObservations: MapObservation[] = [];
  private filteredGeoJSON: ObservationGeoJSON = {
    type: 'FeatureCollection',
    features: [],
  };
  public GeoJSON$: BehaviorSubject<ObservationGeoJSON> =
    new BehaviorSubject<ObservationGeoJSON>({
      type: 'FeatureCollection',
      features: [],
    });
  public initialGeoJson: ObservationGeoJSON = {
    type: 'FeatureCollection',
    features: [],
  };

  public mapSettings: {
    zoom: number;
    mapStyle: string;
    centerMapLocation: [number, number] | undefined;
    minZoom?: number;
    maxZoom?: number;
    bounds: LngLatBounds;
    clusterMaxZoom: number;
  } = {
    zoom: 10,
    mapStyle: 'mapbox://styles/mapbox/light-v10',
    centerMapLocation: [2.1487613, 41.3776589],
    minZoom: 2,
    maxZoom: 17,
    bounds: new LngLatBounds(new LngLat(-90, 90), new LngLat(90, -90)),
    clusterMaxZoom: 17,
  };

  constructor(
    private http: HttpClient,
    private observationsService: ObservationsService
  ) {
    this.observationsService.observations$.subscribe((observations) => {
      this.getAllMapObservations(observations);
    });
    this.isFilterActive.subscribe((isFilterActive) => {
      if (!this.map) return;
      let source = this.map.getSource('observations') as mapboxgl.GeoJSONSource;
      if (isFilterActive) {
        //update the geojson
        source.setData(this.filteredGeoJSON as FeatureCollection<Geometry>);
      } else {
        //update the geojson
        source.setData(this.GeoJSON$.getValue() as FeatureCollection<Geometry>);
      }
    });
  }

  //Conseguir todos los olores en el constructor
  public getAllMapObservations(observations: Observations[]): void {
    this.http
      .get<{ data: MapObservation[] }>(
        `${environment.BACKEND_BASE_URL}/map/observations`
      )
      .subscribe(({ data }) => {
        const mapObs = data.map((obs, idx) => {
          const observation = observations[idx];
          return {
            ...obs,
            created_at: new Date(observation.attributes.created_at),
            types: observation.relationships.types.map((type) => type.id),
            Leq: observation.attributes.Leq,
            userType: observation.relationships.user.type,
            quiet: observation.attributes.quiet,
          };
        });
        this.mapObservations = mapObs;
        const geoJSON = this.createGeoJson(mapObs);
        this.GeoJSON$.next(geoJSON);
      });
  }

  private createGeoJson(observations: MapObservation[]): ObservationGeoJSON {
    const features = observations.map((observation, idx) => {
      return {
        type: 'Feature' as const,
        id: idx,
        geometry: {
          type: 'Point' as const,
          coordinates: [
            Number(observation.longitude),
            Number(observation.latitude),
          ],
        },
        properties: {
          id: observation.id,
          created_at: observation.created_at,
          types: observation.types,
          Leq: observation.Leq,
          userType: observation.userType,
          quiet: observation.quiet,
        },
      };
    });

    return {
      type: 'FeatureCollection' as const,
      features,
    };
  }

  public setMap(map: Map): void {
    this.map = map;
  }

  //Funcion para caluclar el offset en circulo de las observaciones
  private calculateSpiderfiedPositionsCircle(count: number) {
    const leavesSeparation = 80;
    const leavesOffset = [0, 0];
    const points = [];
    const theta = (2 * Math.PI) / count;
    let angle = theta;

    for (let i = 0; i < count; i += 1) {
      angle = theta * i;
      const x = leavesSeparation * Math.cos(angle) + leavesOffset[0];
      const y = leavesSeparation * Math.sin(angle) + leavesOffset[1];
      points.push([x, y]);
    }
    return points;
  }

  //Funcion para caluclar el offset en espiral de las observaciones
  private calculateSpiderfiedPositions(count: number) {
    const legLengthStart = 25;
    const legLengthFactor = 5;
    const leavesSeparation = 40;
    const leavesOffset = [0, 0];
    const points = [];
    let legLength = legLengthStart;
    let angle = 0;

    for (let i = 0; i < count; i += 1) {
      angle += leavesSeparation / legLength + i * 0.0005;
      const x = legLength * Math.cos(angle) + leavesOffset[0];
      const y = legLength * Math.sin(angle) + leavesOffset[1];
      points.push([x, y]);

      legLength += (Math.PI * 2 * legLengthFactor) / angle;
    }
    return points;
  }

  //Funcion para crear el GEOJSON de los markers spiderfy
  private spiderFyCluster(
    source: mapboxgl.GeoJSONSource,
    clusterId: number,
    lngLat: { lat: number; lng: number }
  ): void {
    //Consigo todos los markers que el cluster tiene
    source.getClusterLeaves(clusterId, Infinity, 0, (err, features) => {
      if (err) {
        return console.error(err);
      }

      if (features?.length) {
        // Calculate the spiderfied positions
        const spiderfiedPositions =
          features.length > 10
            ? this.calculateSpiderfiedPositions(features.length)
            : this.calculateSpiderfiedPositionsCircle(features.length);

        // Create a new GeoJson of features with the updated positions
        const geoJson = {
          type: 'FeatureCollection' as const,
          features: features.map((feature, index) => ({
            type: 'Feature' as const,
            ...feature,
            properties: {
              ...feature.properties,
              iconOffset: spiderfiedPositions[index],
            },
            geometry: {
              ...feature.geometry,
              coordinates: [lngLat.lng, lngLat.lat],
            },
          })),
        };

        let source = this.map.getSource(
          'observationsSpiderfy'
        ) as mapboxgl.GeoJSONSource;
        source.setData(geoJson as FeatureCollection<Geometry>);

        this.map.setPaintProperty(
          'clusters',
          'circle-color',
          'rgba(215, 177, 242, 0.5)'
        );
      }
    });
  }

  private deletePointsSpiderfy(evt: any) {
    const avoidLayers = [
      'unclustered-point',
      'unclustered-point-spiderfy',
      'clusters',
      'cluster-count',
    ];
    if (this.isMapReady) {
      const features = this.map.queryRenderedFeatures(evt.point);
      const isClickedOnPermitedLayer = features.some((feature) =>
        avoidLayers.some((layer) => feature.layer.id.includes(layer))
      );

      const observationsSpiderfy = this.map.getSource(
        'observationsSpiderfy'
      ) as mapboxgl.GeoJSONSource;

      if (evt.type === 'zoomstart') {
        this.map.setPaintProperty('clusters', 'circle-color', '#D7B1F2');
        observationsSpiderfy.setData(
          this.initialGeoJson as FeatureCollection<Geometry>
        );
        return;
      }

      if (!isClickedOnPermitedLayer) {
        this.map.setPaintProperty('clusters', 'circle-color', '#D7B1F2');
        observationsSpiderfy.setData(
          this.initialGeoJson as FeatureCollection<Geometry>
        );
      }
    }
  }

  //Center after click on a cluster
  private centerZoomCluster(evt: any) {
    try {
      const features = this.map.queryRenderedFeatures(evt.point, {
        layers: ['clusters'],
      });

      if (features.length) {
        const source = this.map.getSource(
          'observations'
        ) as mapboxgl.GeoJSONSource;
        const clusterId = features[0].properties['cluster_id'];
        const lngLat = evt.lngLat;

        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err || !zoom) {
            return console.error(err);
          }
          if (zoom > 17) {
            this.spiderFyCluster(source, clusterId, lngLat);
          } else {
            this.map.easeTo({
              center: lngLat,
              zoom: zoom,
            });
          }
        });
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  //Add mouse pointer on cluster hover
  private mouseEvent(evt: any) {
    if (evt.type === 'mouseenter') {
      this.map.getCanvas().style.cursor = 'pointer';
    } else {
      this.map.getCanvas().style.cursor = '';
    }
  }

  //Filter obs
  public filterMapObservations(values: FormFilterValues) {
    //He de valorar los que son booleanos primero
    //El valor de si se aplican los filtros estará aquí.
    let mapObs = this.mapObservations;
    const { type, days, soundPressure, hours } = values;
    const { typeFilter, daysFilter, soundPressureFilter, hoursFilter } = values;
    if (type) {
      const typesToFilter = Object.keys(typeFilter).filter(
        (key) => typeFilter[Number(key) as keyof typeof typeFilter]
      );
      mapObs = mapObs.filter((obs) =>
        obs.types.some((obsType) =>
          typesToFilter.some((type) => Number(type) === Number(obsType))
        )
      );
    }
    if (days) {
      const isOneDate =
        !daysFilter[1] || daysFilter[0].getDate() === daysFilter[1]?.getDate();

      if (!isOneDate) {
        mapObs = mapObs.filter((obs) => {
          const obsDate = new Date(obs.created_at);
          return (
            obsDate.getDate() >= daysFilter[0].getDate() &&
            obsDate.getDate() <= daysFilter[1].getDate()
          );
        });
      } else {
        mapObs = mapObs.filter((obs) => {
          const obsDate = new Date(obs.created_at);
          return obsDate.getDate() === daysFilter[0].getDate();
        });
      }
    }
    if (soundPressure) {
      mapObs = mapObs.filter((obs) => Number(obs.Leq) <= soundPressureFilter);
    }
    if (hours) {
      mapObs = mapObs.filter((obs) => {
        const obsDate = new Date(obs.created_at);
        return (
          obsDate.getHours() >= hoursFilter[0] &&
          obsDate.getHours() <= hoursFilter[1]
        );
      });
    }

    //create the geojson
    const geoJSON = this.createGeoJson(mapObs);
    this.filteredGeoJSON = geoJSON;

    //update the geojson
    let source = this.map.getSource('observations') as mapboxgl.GeoJSONSource;
    source.setData(geoJSON as FeatureCollection<Geometry>);
  }

  public initializeMap(): void {
    if (!this.isMapReady) return;

    this.map.on('load', () => {
      //Add images of markers to map
      [...Array(8)].forEach((_, numberColor) => {
        const imageURL = `../../../assets/images/markers/marker-${numberColor}.png`;
        this.map.loadImage(imageURL, (error, image) => {
          if (error || !image)
            return console.error(
              `Failed to load image from URL "${imageURL}": ${error}`
            );
          this.map.addImage(numberColor + '-icon', image);
        });
      });

      //Change map language to ES
      //Catalan does not exist in mapbox
      this.map.setLayoutProperty('country-label', 'text-field', [
        'get',
        `name_es`,
      ]);
    });

    // Add event listeners for 'zoomstart' and 'touchstart' events
    this.map.on('zoomstart', this.deletePointsSpiderfy.bind(this));
    this.map.on('touchstart', this.deletePointsSpiderfy.bind(this));

    // Add event listeners for 'click' events on layers
    this.map.on('click', 'clusters', this.centerZoomCluster.bind(this));

    // // Add event listeners for 'mouseenter' and 'mouseleave' events on layers
    this.map.on('mouseenter', 'clusters', this.mouseEvent.bind(this));
    this.map.on('mouseleave', 'clusters', this.mouseEvent.bind(this));
  }
}

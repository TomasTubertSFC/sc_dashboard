import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ObservationsService } from '../../../services/observations/observations.service';
import { MapObservation, ObservationGeoJSON } from '../../../models/map';
import mapboxgl, { LngLat, LngLatBounds, Map } from 'mapbox-gl';
import { FeatureCollection, Geometry } from 'geojson';
import { BehaviorSubject } from 'rxjs';
import { FormFilterValues } from '../../../models/forms';
import { Feature } from '@turf/turf';
import { Observations } from '../../../models/observations';

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
  private filteredFeatures: Feature[] = []
  public features$: BehaviorSubject<Feature[]> = new BehaviorSubject<Feature[]>([]);
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
  public observationSelected!: Observations;
  public isOpenObservationInfoModal: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor(
    private observationsService: ObservationsService
  ) {
    //Subscribe to know if the filter is active
    this.isFilterActive.subscribe((isFilterActive) => {
      if (!this.map) return;
      if (isFilterActive) {
        //update the geojson
        // this.updateSourceObservations(this.filteredGeoJSON);
      } else {
        //update the geojson
        this.updateSourceObservations(this.features$.getValue());
      }
    });
  }

  //Conseguir todos los olores en el constructor
  public getAllMapObservations(): void {
    if (this.mapObservations.length > 0) {
      this.updateSourceObservations(this.features$.getValue());
      return;
    }
    this.observationsService.observations$.subscribe((data) => {
      const features =
        this.observationsService.getLineStringFromObservations(data);
      if (features.length === 0) return;
      this.mapObservations = data.map((obs) => ({
        id: obs.id,
        user_id: obs.relationships.user.id,
        latitude: obs.attributes.latitude,
        longitude: obs.attributes.longitude,
        created_at: new Date(obs.attributes.created_at),
        types: obs.relationships.types.map((type) => type.id),
        Leq: obs.attributes.Leq,
        userType: obs.relationships.user.type,
        quiet: obs.attributes.quiet,
        path: obs.relationships.segments,
      }));
      this.features$.next(features as Feature[]);
      this.updateSourceObservations(features as Feature[]);
    });
  }

  public updateSourceObservations(features: Feature[]): void {
    let isSource = !!this.map.getSource('observations');
    let geoJson = {
      type: 'FeatureCollection' as const,
      features: features,
    };
    if (isSource) {
      let source = this.map.getSource('observations') as mapboxgl.GeoJSONSource;
      source.setData(geoJson as FeatureCollection<Geometry>);
    } else {
      this.map.on('load', () => {
        let source = this.map.getSource(
          'observations'
        ) as mapboxgl.GeoJSONSource;
        source.setData(geoJson as FeatureCollection<Geometry>);
      });
    }
  }

  private getSegmentColor(value: number): string {
    switch (true) {
      case value <= 35:
        return '#B7CE8E';
      case value > 35 && value <= 40:
        return '#1D8435';
      case value > 40 && value <= 45:
        return '#0E4C3C';
      case value > 45 && value <= 50:
        return '#ECD721';
      case value > 50 && value <= 55:
        return '#9F6F2C';
      case value > 55 && value <= 60:
        return '#EF7926';
      case value > 60 && value <= 65:
        return '#C71932';
      case value > 65 && value <= 70:
        return '#8D1A27';
      case value > 70 && value <= 75:
        return '#88497B';
      case value > 75 && value <= 80:
        return '#18558C';
      case value > 80:
        return '#134367';
      default:
        return '#333';
    }
  }

  private createGeoJson(observations: MapObservation[]): any {
    let linestrings: Feature[] = [];
    //Borde negro de la linea
    // linestrings = observations.map((obs) => ({
    //   type: 'Feature',
    //   geometry: {
    //     type: 'LineString',
    //     coordinates: obs.path.map((value) => {
    //       return [
    //         [Number(value.start_longitude), Number(value.start_latitude)],
    //         [Number(value.end_longitude), Number(value.end_latitude)],
    //       ];
    //     }),
    //   },
    //   properties: {
    //     id: obs.id,
    //     type: 'line',
    //     color: '#333',
    //     width: 6,
    //   },
    // }));
    //Obtener los segmentos de las polilineas
    linestrings = linestrings.concat(
      observations
        .map((obs) => {
          //TODO hacer esto con un map
          // console.log('obs', obs)
          let segments: Feature[] = obs.path.map((segment) => {
            return {
              type: 'Feature' as const,
              geometry: {
                type: 'LineString' as const,
                coordinates: [
                  [
                    Number(segment.start_longitude),
                    Number(segment.start_latitude),
                  ],
                  [Number(segment.end_longitude), Number(segment.end_latitude)],
                ],
              },
              properties: {
                id: obs.id,
                type: 'Line',
                color: this.getSegmentColor(segment.LAeq),
                width: 3,
                pause: false, //TODO: Add pause
              },
            };
          });
          // for (let i = 0; i < obs.path.length - 1; i++) {
          //   segments.push({
          //     type: 'Feature' as const,
          //     geometry: {
          //       type: 'LineString' as const,
          //       coordinates: [
          //         [
          //           Number(obs.path[i].start_longitude),
          //           Number(obs.path[i].start_latitude),
          //         ],
          //         [
          //           Number(obs.path[i].end_longitude),
          //           Number(obs.path[i].end_latitud),
          //         ],
          //       ],
          //     },
          //     properties: {
          //       id: obs.id,
          //       type: 'Line',
          //       color: this.getSegmentColor(obs.path[i].LAeq),
          //       width: 3,
          //       pause: false, //TODO: Add pause
          //     },
          //   });
          // }
          return segments;
        })
        .flat()
    );

    // const features = observations.map((observation, idx) => {
    //   return {
    //     type: 'Feature' as const,
    //     id: idx,
    //     geometry: {
    //       type: 'Point' as const,
    //       coordinates: [
    //         Number(observation.longitude),
    //         Number(observation.latitude),
    //       ],
    //     },
    //     properties: {
    //       id: observation.id,
    //       created_at: observation.created_at,
    //       types: observation.types,
    //       LAeq: observation.LAeq,
    //       userType: observation.userType,
    //       quiet: observation.quiet,
    //     },
    //   };
    // });

    console.log('linestrings', linestrings);

    return {
      type: 'FeatureCollection' as const,
      features: linestrings,
    };
  }

  public setMap(map: Map): void {
    this.map = map;
  }

  //Funcion para caluclar el offset en circulo de las observaciones
  // private calculateSpiderfiedPositionsCircle(count: number) {
  //   const leavesSeparation = 80;
  //   const leavesOffset = [0, 0];
  //   const points = [];
  //   const theta = (2 * Math.PI) / count;
  //   let angle = theta;

  //   for (let i = 0; i < count; i += 1) {
  //     angle = theta * i;
  //     const x = leavesSeparation * Math.cos(angle) + leavesOffset[0];
  //     const y = leavesSeparation * Math.sin(angle) + leavesOffset[1];
  //     points.push([x, y]);
  //   }
  //   return points;
  // }

  //Funcion para caluclar el offset en espiral de las observaciones
  // private calculateSpiderfiedPositions(count: number) {
  //   const legLengthStart = 25;
  //   const legLengthFactor = 5;
  //   const leavesSeparation = 40;
  //   const leavesOffset = [0, 0];
  //   const points = [];
  //   let legLength = legLengthStart;
  //   let angle = 0;

  //   for (let i = 0; i < count; i += 1) {
  //     angle += leavesSeparation / legLength + i * 0.0005;
  //     const x = legLength * Math.cos(angle) + leavesOffset[0];
  //     const y = legLength * Math.sin(angle) + leavesOffset[1];
  //     points.push([x, y]);

  //     legLength += (Math.PI * 2 * legLengthFactor) / angle;
  //   }
  //   return points;
  // }

  //Funcion para crear el GEOJSON de los markers spiderfy
  // private spiderFyCluster(
  //   source: mapboxgl.GeoJSONSource,
  //   clusterId: number,
  //   lngLat: { lat: number; lng: number }
  // ): void {
  //   //Consigo todos los markers que el cluster tiene
  //   source.getClusterLeaves(clusterId, Infinity, 0, (err, features) => {
  //     if (err) {
  //       return console.error(err);
  //     }

  //     if (features?.length) {
  //       // Calculate the spiderfied positions
  //       const spiderfiedPositions =
  //         features.length > 10
  //           ? this.calculateSpiderfiedPositions(features.length)
  //           : this.calculateSpiderfiedPositionsCircle(features.length);

  //       // Create a new GeoJson of features with the updated positions
  //       const geoJson = {
  //         type: 'FeatureCollection' as const,
  //         features: features.map((feature, index) => ({
  //           type: 'Feature' as const,
  //           ...feature,
  //           properties: {
  //             ...feature.properties,
  //             iconOffset: spiderfiedPositions[index],
  //           },
  //           geometry: {
  //             ...feature.geometry,
  //             coordinates: [lngLat.lng, lngLat.lat],
  //           },
  //         })),
  //       };

  //       let source = this.map.getSource(
  //         'observationsSpiderfy'
  //       ) as mapboxgl.GeoJSONSource;
  //       source.setData(geoJson as FeatureCollection<Geometry>);

  //       this.map.setPaintProperty(
  //         'clusters',
  //         'circle-color',
  //         'rgba(215, 177, 242, 0.5)'
  //       );
  //     }
  //   });
  // }

  // private deletePointsSpiderfy(evt: any) {
  //   const avoidLayers = [
  //     'unclustered-point',
  //     'unclustered-point-spiderfy',
  //     'clusters',
  //     'cluster-count',
  //   ];
  //   if (this.isMapReady) {
  //     const features = this.map.queryRenderedFeatures(evt.point);
  //     const isClickedOnPermitedLayer = features.some((feature) =>
  //       avoidLayers.some((layer) => feature.layer.id.includes(layer))
  //     );

  //     const observationsSpiderfy = this.map.getSource(
  //       'observationsSpiderfy'
  //     ) as mapboxgl.GeoJSONSource;

  //     if (evt.type === 'zoomstart') {
  //       this.map.setPaintProperty('clusters', 'circle-color', '#D7B1F2');
  //       observationsSpiderfy.setData(
  //         this.initialGeoJson as FeatureCollection<Geometry>
  //       );
  //       return;
  //     }

  //     if (!isClickedOnPermitedLayer) {
  //       this.map.setPaintProperty('clusters', 'circle-color', '#D7B1F2');
  //       observationsSpiderfy.setData(
  //         this.initialGeoJson as FeatureCollection<Geometry>
  //       );
  //     }
  //   }
  // }

  //Center after click on a cluster
  // private centerZoomCluster(evt: any) {
  //   try {
  //     const features = this.map.queryRenderedFeatures(evt.point, {
  //       layers: ['clusters'],
  //     });

  //     if (features.length) {
  //       const source = this.map.getSource(
  //         'observations'
  //       ) as mapboxgl.GeoJSONSource;
  //       const clusterId = features[0].properties['cluster_id'];
  //       const lngLat = evt.lngLat;

  //       source.getClusterExpansionZoom(clusterId, (err, zoom) => {
  //         if (err || !zoom) {
  //           return console.error(err);
  //         }
  //         if (zoom > 17) {
  //           this.spiderFyCluster(source, clusterId, lngLat);
  //         } else {
  //           this.map.easeTo({
  //             center: lngLat,
  //             zoom: zoom,
  //           });
  //         }
  //       });
  //     }
  //   } catch (error) {
  //     console.error('An error occurred:', error);
  //   }
  // }

  //Add mouse pointer on cluster hover
  private mouseEvent(evt: any) {
    if (evt.type === 'mouseenter' && evt.features.length === 1) {
      const featureId = evt.features[0].properties.id;
      this.map.getCanvas().style.cursor = 'pointer';
      this.map.setFilter('lineLayer-hover', ['==', 'id', featureId]);
      return;
    }
    // if (!this.featureIdSelected) return;
    this.map.getCanvas().style.cursor = '';
    this.map.setFilter('lineLayer-hover', ['==', 'id', '']);
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
      mapObs = mapObs.filter(
        (obs) =>
          Number(obs.LAeq) <= soundPressureFilter[1] &&
          Number(obs.LAeq) >= soundPressureFilter[0]
      );
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

    const observations = this.observationsService.observations$.getValue().filter((obs) => {
      return mapObs.some((mapObs) => mapObs.id === obs.id);
    })

    //Get all features
    const features =
        this.observationsService.getLineStringFromObservations(observations);

    this.filteredFeatures = features as Feature[];

    //update the geojson
    this.updateSourceObservations(features as Feature[]);
  }

  private buildClustersAndLayers(features: Feature[]): void {
    // // Add a new source from our GeoJSON data and set the
    // this.map.addSource('observations', {
    //   type: 'geojson',
    //   data: GeoJSON as FeatureCollection<Geometry, { [name: string]: any }>,
    //   cluster: true,
    //   clusterMaxZoom: this.mapSettings.clusterMaxZoom, // Max zoom to cluster points on
    //   clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
    // });
    // // Add a new source for spiderfy observations
    // this.map.addSource('observationsSpiderfy', {
    //   type: 'geojson',
    //   data: this.initialGeoJson as FeatureCollection<
    //     Geometry,
    //     { [name: string]: any }
    //   >,
    //   cluster: false,
    // });
    // //Cluster background color
    // this.map.addLayer({
    //   id: 'clusters',
    //   type: 'circle',
    //   source: 'observations',
    //   filter: ['has', 'point_count'],
    //   paint: {
    //     'circle-color': '#D7B1F2',
    //     'circle-radius': 20,
    //     'circle-stroke-color': 'rgba(215, 177, 242, 0.5)',
    //     'circle-stroke-width': 5,
    //   },
    // });
    // //Cluster number count
    // this.map.addLayer({
    //   id: 'cluster-count',
    //   type: 'symbol',
    //   source: 'observations',
    //   filter: ['has', 'point_count'],
    //   layout: {
    //     'text-field': '{point_count_abbreviated}',
    //     'text-size': 12,
    //   },
    //   paint: {
    //     'text-color': '#ffffff',
    //   },
    // });
    // //Markers
    // this.map.addLayer({
    //   id: 'unclustered-point',
    //   type: 'symbol',
    //   source: 'observations',
    //   filter: ['!has', 'point_count'],
    //   layout: {
    //     'icon-image': [
    //       'match',
    //       ['get', 'userType'],
    //       'citizen',
    //       '1-icon',
    //       '3-icon',
    //     ],
    //     'icon-size': 0.8,
    //     'icon-allow-overlap': true,
    //     'icon-ignore-placement': true,
    //   },
    // });
    // //Spiderfy markers
    // this.map.addLayer({
    //   id: 'unclustered-point-spiderfy',
    //   type: 'symbol',
    //   source: 'observationsSpiderfy',
    //   layout: {
    //     'icon-image': [
    //       'match',
    //       ['get', 'userType'],
    //       'citizen',
    //       '1-icon',
    //       '3-icon',
    //     ],
    //     'icon-size': 0.8,
    //     'icon-allow-overlap': true,
    //     'icon-ignore-placement': true,
    //     'icon-offset': ['get', 'iconOffset'],
    //   },
    // });

    //Añadir la fuente de datos para las lineas de atributo path
    this.map.addSource('observations', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: features as Feature<
          Geometry,
          {
            [name: string]: any;
          }
        >[],
      },
    });

    // resaltar la línea a la que se hace hover de color negro
    this.map.addLayer({
      id: 'lineLayer-hover',
      type: 'line',
      source: 'observations',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#333',
        'line-width': 3,
        'line-gap-width': 5,
      },
      filter: ['==', 'id', ''], // Filtro vacío para iniciar
    });

    // Agregar capa para los paths individuales
    this.map.addLayer({
      id: 'LineString',
      type: 'line',
      source: 'observations',
      //minzoom: 20,
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': [
          'case',
          ['==', ['get', 'pause'], true],
          '#FFF', // Dasharray si pause es 1
          ['get', 'color'], // Sin dasharray si pause no es 1
        ],
        'line-width': ['get', 'width'],
        'line-dasharray': [
          'case',
          ['==', ['get', 'pause'], true],
          [2, 3], // Dasharray si pause es 1
          [1, 0], // Sin dasharray si pause no es 1
        ],
      },
    });
  }
  //TODO MAKE A LOADING FOR MAP
  public initializeMap(): void {
    if (!this.isMapReady) return;

    this.map.on('load', () => {
      //Change map language to ES
      //Catalan does not exist in mapbox
      this.map.setLayoutProperty('country-label', 'text-field', [
        'get',
        `name_es`,
      ]);
    });

    //Build all clusters and layers after the style is loaded
    //Usefull when toggling between style map layers
    this.map.on('style.load', () => {
      //I want to detect if the layer with id observations exists
      if (this.isFilterActive.getValue()) {
        //update the geojson
        this.buildClustersAndLayers(this.filteredFeatures);
      } else {
        //update the geojson
        this.buildClustersAndLayers(this.features$.getValue());
      }
    });

    // // Add event listeners for 'zoomstart' and 'touchstart' events
    // this.map.on('zoomstart', this.deletePointsSpiderfy.bind(this));
    // this.map.on('touchstart', this.deletePointsSpiderfy.bind(this));

    // // Add event listeners for 'click' events on layers
    // this.map.on('click', 'clusters', this.centerZoomCluster.bind(this));

    // Add event listeners for 'mouseenter' and 'mouseleave' events on layers
    this.map.on('mouseenter', 'LineString', this.mouseEvent.bind(this));
    this.map.on('mouseleave', 'LineString', this.mouseEvent.bind(this));

    this.map.on('click', 'LineString', (e) => {
      const feature = e.features[0];

      const obs = this.observationsService.observations$
        .getValue()
        .find((obs) => obs.id === feature.properties['id']);
      this.observationSelected = obs;
      this.isOpenObservationInfoModal.next(true);
    });
  }
}

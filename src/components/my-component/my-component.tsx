import { Component, Prop, h } from '@stencil/core';
import { format } from '../../utils/utils';
import { Deck, MapView } from '@deck.gl/core';
import { TileLayer } from '@deck.gl/geo-layers';
import { ScatterplotLayer } from '@deck.gl/layers';
import { BitmapLayer, PathLayer } from '@deck.gl/layers';

const showBorder = false;

const tileLayer = new TileLayer({
  data: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png', 'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png', 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'],
  maxRequests: 20,
  pickable: true,
  onViewportLoad: null,
  autoHighlight: showBorder,
  highlightColor: [60, 60, 60, 40],
  minZoom: 0,
  maxZoom: 19,
  tileSize: 512 / devicePixelRatio,

  renderSubLayers: props => {
    const {
      bbox: { west, south, east, north },
    } = props.tile;

    return [
      new BitmapLayer(props, {
        data: null,
        image: props.data,
        bounds: [west, south, east, north],
      }),
      showBorder &&
        new PathLayer({
          id: `${props.id}-border`,
          visible: props.visible,
          data: [
            [
              [west, north],
              [west, south],
              [east, south],
              [east, north],
              [west, north],
            ],
          ],
          getPath: d => d,
          getColor: [255, 0, 0],
          widthMinPixels: 4,
        }),
    ];
  },
});

const INITIAL_VIEW_STATE = {
  latitude: 45.442,
  longitude: 12.33,
  zoom: 12,
};

new Deck({
  views: new MapView(),
  controller: true,
  initialViewState: INITIAL_VIEW_STATE,
  layers: [
    tileLayer,
    new ScatterplotLayer({
      data: [{ position: [12.33, 45.442], color: [255, 0, 0], radius: 100 }],
      getColor: d => d.color,
      getRadius: d => d.radius,
    }),
  ],
});

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true,
})
export class MyComponent {
  @Prop() first: string;

  @Prop() middle: string;

  @Prop() last: string;

  private getText(): string {
    return format(this.first, this.middle, this.last);
  }

  render() {
    return (
      <div>
        <div>Hello, World! I'm {this.getText()}</div>
        <div class="map"></div>
      </div>
    );
  }
}

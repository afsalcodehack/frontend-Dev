import { appTitle } from '../../global';
import { backendEventListener } from '../backend';

export const events = [
  { id: 1, name: 'CEBIT', isPublic: false, price: 5.99, currency: 'usd', secret: 'hello' },
  { id: 2, name: 'PyCon', isPublic: true, price: 2.99, currency: 'usd' },
  { id: 3, name: 'B2BNord', isPublic: false, price: 3.99, currency: 'usd', secret: '12345' },
  { id: 4, name: 'TechCrunch', isPublic: true, price: 9.99, currency: 'usd' },
];

export const wikiUrl = 'https://upload.wikimedia.org/wikipedia/commons/';
const thumbUrl = `${wikiUrl}thumb/`;

const imageUrls = [
  '2/2f/Gothic_Chapel_Peterhof_tonemapped.jpg',
  '8/8d/Freudenberg_sg_Switzerland.jpg',
  '0/0e/Salar_de_Atacama.jpg',
  'f/f5/Desert_View_Indian_Wells.jpg',
  'b/b5/GothafossWinter.jpg',
  '4/4c/Monrepos_0550.jpg',
  'd/d3/HVB-Tower_Munich%2C_June_2017.jpg',
];

const getImgUrl = (i) => `${wikiUrl}${imageUrls[i]}`;
const getThumbUrl = (i) => `${thumbUrl}${imageUrls[i]}/640px-${imageUrls[i].replace(/.*\//g, '')}`;

export const album = {
  images: [
    {
      createdAt: new Date(1537684843000),
      fullResUrl: getImgUrl(0),
      thumbUrl: getThumbUrl(0),
      addWatermark: appTitle,
      purchased: false,
    },
    {
      createdAt: new Date(1537684843000),
      fullResUrl: getImgUrl(1),
      thumbUrl: getThumbUrl(1),
      addWatermark: '',
      purchased: true,
    },
    {
      createdAt: new Date(1506151739000),
      fullResUrl: getImgUrl(2),
      thumbUrl: getThumbUrl(2),
      addWatermark: appTitle,
      purchased: false,
    },
    {
      createdAt: new Date(1506151739000),
      fullResUrl: getImgUrl(3),
      thumbUrl: getThumbUrl(3),
      addWatermark: appTitle,
      purchased: false,
    },
    {
      createdAt: new Date(1537684843000),
      fullResUrl: getImgUrl(4),
      thumbUrl: getThumbUrl(4),
      addWatermark: appTitle,
      purchased: false,
    },
    {
      createdAt: new Date(1506151739000),
      fullResUrl: getImgUrl(5),
      thumbUrl: getThumbUrl(5),
      addWatermark: appTitle,
      purchased: false,
    },
    {
      createdAt: new Date(1506151739000),
      fullResUrl: getImgUrl(6),
      thumbUrl: getThumbUrl(6),
      addWatermark: appTitle,
      purchased: false,
    },
  ],
};

export const forkAndCleanEvent = (event) => {
  event = { ...event };
  return event;
};

backendEventListener('payment:success')
  .filter(({ item_type }) => item_type === 'image')
  .subscribe((data) => {
    const photo = album.images.find((image) => image.fullResUrl === data.item_id);
    if (!photo) {
      return;
    }
    photo.addWatermark = '';
    photo.purchased = true;
});

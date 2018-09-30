import { ENV } from './config/environment';

export const hashLocationPrefix = ENV.LOCATION_STRATEGY === 'path' ? '' : '#/';
export let backendUrl = ENV.API_URL

import { ENV } from './config/environment';

export const appTitle = 'Picshare';
export const production = ENV.PRODUCTION;
export const hashLocationPrefix = ENV.LOCATION_STRATEGY === 'path' ? '' : '#/';
export let backendUrl = ENV.API_URL;

export const minPasswordLength = 3;
export const maxPasswordLength = 20;
export const minEventSecretLength = 3;

import { ENV } from './config/environment';

declare const process: any;

export const appTitle = 'Picllary';
export const environment = ENV.NAME;
export const production = ENV.PRODUCTION;
export const hashLocationPrefix = ENV.LOCATION_STRATEGY === 'path' ? '' : '#/';
export let backendUrl = ENV.API_URL;
export const minPasswordLength = 3;
export const maxPasswordLength = 20;
export const minEventSecretLength = 3;
export const buildInformation = {
  isNetlifyBuild: !!process.env.COMMIT_REF,
  commit: process.env.COMMIT_REF,
  branch: process.env.HEAD,
};

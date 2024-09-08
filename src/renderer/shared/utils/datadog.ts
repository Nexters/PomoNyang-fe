import { datadogRum } from '@datadog/browser-rum';

const datadogApplicationId = import.meta.env.VITE_DATADOG_APPLICATION_ID;
const datadogClientToken = import.meta.env.VITE_DATADOG_CLIENT_TOKEN;
const datadogEnv = import.meta.env.VITE_DATADOG_ENV;

export const initDatadogRum = () => {
  datadogRum.init({
    applicationId: datadogApplicationId,
    clientToken: datadogClientToken,
    // `site` refers to the Datadog site parameter of your organization
    // see https://docs.datadoghq.com/getting_started/site/
    site: 'us5.datadoghq.com',
    service: 'mohanyang-desktop',
    env: datadogEnv,
    // Specify a version number to identify the deployed version of your application in Datadog
    version: __APP_VERSION__,
    sessionSampleRate: 100,
    sessionReplaySampleRate: 20,
    allowFallbackToLocalStorage: true,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: 'mask-user-input',
  });
};

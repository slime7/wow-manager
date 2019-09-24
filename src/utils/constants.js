export const gameTypes = {
  classic: '怀旧服',
  retail: '正式服',
};

export const gameVersions = {
  classic: '1.13.2',
  retail: '8.2.0',
};

export const storeSetting = {
  serialize: value => JSON.stringify(value, null, '  '),
};

export const curseBaseUrl = 'https://addons-ecs.forgesvc.net/api/v2/addon/';

export const addonStatusStruct = {
  NOT_INSTALLED: 0,
  INSTALLED: 1,
  CAN_BE_UPDATE: 2,
  NO_UPDATE: 3,
  NO_FILE: 9,
};

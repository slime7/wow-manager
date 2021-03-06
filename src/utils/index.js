import fs from 'fs';

export const addonAvatar = (attachments) => {
  if (!attachments.length) {
    return null;
  }
  const defaultAvatar = attachments.find(a => a.isDefault);
  if (defaultAvatar) {
    return defaultAvatar.url;
  }
  return attachments[0].thumbnailUrl;
};

export const addonLatestFile = (
  latestFiles,
  version,
) => JSON.parse(JSON.stringify(latestFiles)).reverse()
  .find(f => f.releaseType === 1 && f.gameVersion.indexOf(version) >= 0);

export const parseAddon = (addonRaw, gameVersion) => {
  const latestFile = addonLatestFile(addonRaw.latestFiles, gameVersion);
  const addon = {
    id: addonRaw.id,
    name: addonRaw.name,
    summary: addonRaw.summary,
    authors: addonRaw.authors.map(author => author.name),
    avatar: addonAvatar(addonRaw.attachments),
    attachments: addonRaw.attachments,
    web: addonRaw.websiteUrl,
    file: null,
  };
  if (latestFile) {
    addon.file = {
      version: latestFile.displayName,
      downloadUrl: latestFile.downloadUrl,
      fileName: latestFile.fileName,
      modules: latestFile.modules,
    };
  }
  return addon;
};

export const parseConfigWtf = (configFile) => {
  try {
    const configString = fs.readFileSync(configFile, 'utf-8');
    const configObject = {};
    configString.split('\r\n').forEach((line) => {
      if (line !== '') {
        const [, configKey, configValue] = line.split(' ');
        configObject[configKey] = configValue.replace(/^"(.*)"$/, '$1');
      }
    });

    return configObject;
  } catch (err) {
    throw err;
  }
};

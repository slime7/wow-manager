export const addonAvatar = (attachments) => {
  const defaultAvatar = attachments.find(a => a.isDefault);
  if (defaultAvatar) {
    return defaultAvatar.url;
  }
  return attachments[0].thumbnailUrl;
};

export const addonLatestFile = (latestFiles, version) => JSON.parse(JSON.stringify(latestFiles)).reverse()
  .find(f => f.releaseType === 1 && f.gameVersion.indexOf(version) >= 0);

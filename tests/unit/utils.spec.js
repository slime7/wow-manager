import path from 'path';
import { parseConfigWtf } from '@/utils';

describe('@/utils/index.js', () => {
  it('测试 parseConfigWtf()', () => {
    const configFile = path.resolve('tests/mocks/config.wtf');
    const configObject = parseConfigWtf(configFile);
    const expected = {
      portal: 'CN',
      textLocale: 'zhCN',
      audioLocale: 'zhCN',
    };
    expect(configObject).toMatchObject(expected);
  });
});

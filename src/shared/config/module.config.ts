import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';

import configuration from './appconfig';

export const configModuleOptions: ConfigModuleOptions = {
  envFilePath: '.env',
  load: [configuration],
};

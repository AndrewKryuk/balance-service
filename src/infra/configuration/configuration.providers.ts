import { Provider } from '@nestjs/common';
import {
  httpConfigProvider,
  typeormConfigProvider,
} from '@kryuk/ddd-kit/infra/configuration/configuration.providers';
import { AccessTokenConfigAbstract } from '@application/abstract/configuration/access-token-config.abstract';
import { accessTokenConfigFactory } from '@infra/configuration/factories/access-token-config.factory';
import { ApplicationConfigAbstract } from '@application/abstract/configuration/application-config.abstract';
import { applicationConfigFactory } from '@infra/configuration/factories/application-config.factory';

export const accessTokenConfigProvider: Provider = {
  provide: AccessTokenConfigAbstract,
  useFactory: accessTokenConfigFactory,
};

export const applicationConfigProvider: Provider = {
  provide: ApplicationConfigAbstract,
  useFactory: applicationConfigFactory,
};

export const configurationProviders: Provider[] = [
  httpConfigProvider,
  typeormConfigProvider,
  accessTokenConfigProvider,
  applicationConfigProvider,
];

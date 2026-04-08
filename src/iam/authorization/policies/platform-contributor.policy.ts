import { Injectable } from '@nestjs/common';

import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { PolicyHandler } from './interface/policy-handler.interface';
import { Policy } from './interface/policy.interface';
import { PolicyHandlerStorage } from './policy-handlers.storage';

export class PlatformContributorPolicy implements Policy {
  name = 'PlatformContributorPolicy';
}

@Injectable()
export class PlatformContributorPolicyHandler implements PolicyHandler<PlatformContributorPolicy> {
  constructor(private readonly policyHandlerStorage: PolicyHandlerStorage) {
    this.policyHandlerStorage.add(PlatformContributorPolicy, this);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async handle(
    _policy: PlatformContributorPolicy,
    user: ActiveUserData,
  ): Promise<boolean> {
    const isContributor = user.email.endsWith('@puhutko.app');

    if (!isContributor) {
      throw new Error('User is not a contributor');
    }

    return true;
  }
}

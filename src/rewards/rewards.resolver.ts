import { Query, Resolver } from '@nestjs/graphql';
import { RewardsService } from './rewards.service';
import { Reward } from '../rewards/models/reward.model';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { UseInterceptors } from '@nestjs/common';

@Resolver()
export class RewardsResolver {
  constructor(private readonly rewardService: RewardsService) {}

  @CacheKey('rewards')
  @UseInterceptors(CacheInterceptor)
  @Query(() => [Reward], { name: 'rewards' })
  findAll(): Promise<Reward[]> {
    return this.rewardService.findAll();
  }
}

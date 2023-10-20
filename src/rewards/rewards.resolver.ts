import { Query, Resolver } from '@nestjs/graphql';
import { RewardsService } from './rewards.service';
import { Reward } from '../rewards/models/reward.model';

@Resolver()
export class RewardsResolver {
  constructor(private readonly rewardService: RewardsService) {}

  @Query(() => [Reward], { name: 'rewards' })
  findAll(): Promise<Reward[]> {
    return this.rewardService.findAll();
  }
}

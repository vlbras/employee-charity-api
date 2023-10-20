import { Module } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { RewardsResolver } from './rewards.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from 'src/lib/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Employee])],
  providers: [RewardsResolver, RewardsService],
})
export class RewardsModule {}

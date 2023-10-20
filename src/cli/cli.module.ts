import { Module } from '@nestjs/common';
import { CliService } from './cli.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '../database/database.config';
import { ImporterModule } from '../import/importer.module';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), ImporterModule],
  providers: [CliService],
})
export class CliModule {}

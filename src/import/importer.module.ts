import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee, Department, Statement, Donation } from '../lib/entities/index';
import { ImporterService } from './importer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, Department, Statement, Donation]),
  ],
  providers: [ImporterService],
  exports: [ImporterService],
})
export class ImporterModule {}

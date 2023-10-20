import { Injectable } from '@nestjs/common';
import { Reward } from './models/reward.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from 'src/lib/entities';
import { Repository } from 'typeorm';

@Injectable()
export class RewardsService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  findAll(): Promise<Reward[]> {
    return this.employeeRepository.query(/*sql*/ `
      WITH TotalDonations AS (
        SELECT SUM(amount) AS "totalDonations"
        FROM donation
      ),
      CharitableEmployees AS (
        SELECT 
          "employeeId",
          SUM(amount) AS "employeeDonations"
        FROM donation
        GROUP BY "employeeId"
        HAVING SUM(amount) > 100
      )
      
      SELECT
        ce."employeeId" AS "employeeId",
        ROUND((ce."employeeDonations" / td."totalDonations") * 10000,	2) AS amount
      FROM CharitableEmployees AS ce
      CROSS JOIN TotalDonations AS td;
    `);
  }
}

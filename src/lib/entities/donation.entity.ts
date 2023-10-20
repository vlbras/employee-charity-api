
import {
  Entity,
  Column,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Employee } from './employee.entity';

@Entity()
export class Donation {
  @PrimaryColumn()
  id: number;

  @Column('date')
  date: Date;

  @Column('decimal', { precision: 13, scale: 2 })
  amount: number;

  @ManyToOne(() => Employee, (employee) => employee.donations, { onDelete: 'CASCADE' })
  employee?: Employee;

  currency?: string;
}



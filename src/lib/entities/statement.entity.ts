import { Employee } from './employee.entity';
import {
  Entity,
  Column,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class Statement {
  @PrimaryColumn()
  id: number;

  @Column('decimal', { precision: 13, scale: 2 })
  amount: number;

  @Column('date')
  date: Date;

  @ManyToOne(() => Employee, (employee) => employee.salary, { onDelete: 'CASCADE' })
  employee?: Employee;
}
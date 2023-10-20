import { Department } from './department.entity';
import { Statement } from './statement.entity';
import { Donation } from './donation.entity';
import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class Employee {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @ManyToOne(() => Department, (department) => department.employees, { onDelete: 'CASCADE' })
  department: Department;

  @OneToMany(() => Statement, (statement) => statement.employee)
  salary?: Statement[];

  @OneToMany(() => Donation, (donation) => donation.employee)
  donations?: Donation[];
}

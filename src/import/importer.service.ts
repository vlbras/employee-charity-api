import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Employee,
  Department,
  Donation,
  Statement,
} from '../lib/entities';
import { Repository } from 'typeorm';
import { EList, Rate } from '../lib/interfaces';

@Injectable()
export class ImporterService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(Statement)
    private statementRepository: Repository<Statement>,
    @InjectRepository(Donation)
    private donationRepository: Repository<Donation>,
  ) {}

  async importData(dump: string) {
    const parsedData = this.parseDump(dump);
    const rates = this.createRatesMap(parsedData.rates);

    const departmentsCache = new Map();

    for (const employeeData of parsedData.employees) {
      await this.findOrCreateDepartment(
        employeeData.department,
        departmentsCache,
      );

      const employee = await this.createEmployee(employeeData);

      await Promise.all([
        this.createStatements(employee, employeeData.salary),
        this.createDonations(employee, employeeData.donations, rates),
      ]);
    }
  }

  private createRatesMap(rates: Rate[]): { [key: string]: Rate } {
    return rates.reduce((acc, rate) => {
      acc[`${rate.date}_${rate.sign}`] = rate;
      return acc;
    }, {});
  }

  private async findOrCreateDepartment(
    departmentData: Department,
    cache: Map<number, Department>,
  ): Promise<Department> {
    if (cache.has(departmentData.id)) return cache.get(departmentData.id);

    let department = await this.departmentRepository.findOneBy({
      id: departmentData.id,
    });
    if (!department) {
      department = await this.departmentRepository.save(departmentData);
    }
    cache.set(departmentData.id, department);
  }

  private async createEmployee(employeeData: Employee): Promise<Employee> {
    const employee = this.employeeRepository.create({ ...employeeData });
    return await this.employeeRepository.save(employee);
  }

  private async createStatements(
    employee: Employee,
    statementsData: Statement[],
  ) {
    const savePromises = statementsData.map((st) => {
      const statement = this.statementRepository.create({ ...st, employee });
      return this.statementRepository.save(statement);
    });
    await Promise.all(savePromises);
  }

  private async createDonations(
    employee: Employee,
    donationsData: Donation[],
    rates: { [key: string]: Rate },
  ) {
    const savePromises: Promise<Donation>[] = [];
    (donationsData || []).forEach((don) => {
      if (don.currency !== 'USD') {
        const exchangeRate = rates[`${don.date}_${don.currency}`];
        delete don.currency;

        const donation = this.donationRepository.create({
          ...don,
          amount: parseFloat((don.amount * exchangeRate.value).toFixed(2)),
          employee,
        });
        savePromises.push(this.donationRepository.save(donation));
      }
    });
    await Promise.all(savePromises);
  }

  private parseDump(text: string): EList {
    const lines = text.split('\n');
    const eList = { employees: [], rates: [] };

    let currentContext = null;
    let currentEmployee: Employee | null = null;
    let currentSalary: Statement[] = [];

    lines.forEach((line) => {
      const trimmedLine = line.trim();

      if (trimmedLine.includes(':')) {
        const [key, value] = trimmedLine.split(':').map((s) => s.trim());
        currentContext = this.handleKeyVal(currentContext, key, value);
      } 
      
      else {
        switch (trimmedLine) {
          case 'Employee':
            currentEmployee = {
              id: 0,
              name: '',
              surname: '',
              department: { id: 0, name: '' },
            };
            eList.employees.push(currentEmployee);
            currentContext = currentEmployee;
            currentSalary = [];
            break;

          case 'Department':
            if (!currentEmployee) return;
            currentEmployee.department = { id: 0, name: '' };
            currentContext = currentEmployee.department;
            break;

          case 'Salary':
            if (!currentEmployee) return;
            currentSalary = [];
            currentEmployee.salary = currentSalary;
            currentContext = currentSalary;
            break;

          case 'Statement':
            if (!currentSalary) return;
            const statement: Statement = { id: 0, amount: 0, date: new Date() };
            currentSalary.push(statement);
            currentContext = statement;
            break;

          case 'Donation':
            if (!currentEmployee) return;
            if (!currentEmployee.donations) currentEmployee.donations = [];
            const donation: Donation = { id: 0, amount: 0, date: new Date() };
            currentEmployee.donations.push(donation);
            currentContext = donation;
            break;

          case 'Rate':
            const rate: Rate = { date: new Date(), sign: '', value: 0 };
            eList.rates.push(rate);
            currentContext = rate;
            break;
        }
      }
    });

    return eList;
  }

  private handleKeyVal(currentContext, key: string, value: string) {
    if (!currentContext) return;

    if (key === 'amount' && value.includes(' ')) {
      const [amountValue, currency] = value.split(' ');
      currentContext[key] = Number(amountValue);
      currentContext['currency'] = currency;
    } else if (key === 'date') {
      currentContext[key] = new Date(value);
    } else if (key === 'id' || key === 'value') {
      currentContext[key] = Number(value);
    } else {
      currentContext[key] = value;
    }

    return currentContext;
  }
}

import { Employee } from "../entities";
import { Rate } from "./rate.interface";

export interface EList {
  employees: Employee[];
  rates: Rate[];
}
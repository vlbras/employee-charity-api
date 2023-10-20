import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Reward {
  @Field(() => ID)
  employeeId: number;

  @Field()
  amount: number;
}
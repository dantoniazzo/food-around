import { IsEnum } from 'class-validator';

export enum IdentifierEnum {
  USER = 'user',
}

export class Identifier {
  @IsEnum(IdentifierEnum)
  type: IdentifierEnum;
  id: string;
}

/* eslint-disable @typescript-eslint/ban-types */

import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { ethers } from "ethers";

@ValidatorConstraint()
export class IsValidEvmAddressContraint implements ValidatorConstraintInterface {
  validate(evmAddress: string, _: ValidationArguments) {
    return ethers.utils.isAddress(evmAddress)
  }
}

export function IsValidEvmAddress(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidEvmAddressContraint,
    });
  };
}
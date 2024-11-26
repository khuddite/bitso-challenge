import { Input } from "@nextui-org/input";
import React from "react";
import {
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";

interface BitsoInputProps {
  helpText?: string;
  [key: string]: unknown;
}

type RhfBitsoInputProps<T extends FieldValues> = BitsoInputProps &
  UseControllerProps<T>;

export default function BitsoInput<T extends FieldValues>({
  name,
  control,
  useValidationSpacer = false,
  helpText,
  ...rest
}: RhfBitsoInputProps<T>) {
  const {
    field: { ...fieldProps },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <Input
      variant="faded"
      color="primary"
      labelPlacement="outside"
      {...rest}
      {...(!!name && fieldProps)}
    />
  );
}

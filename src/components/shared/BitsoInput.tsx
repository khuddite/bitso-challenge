import type { InputProps } from "@nextui-org/input";
import { Input } from "@nextui-org/input";
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
  UseControllerProps<T> &
  InputProps;

export default function BitsoInput<T extends FieldValues>({
  name,
  control,
  useValidationSpacer = false,
  helpText,
  readOnly,
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
    <>
      <Input
        variant="bordered"
        color={readOnly ? "secondary" : !!error ? "danger" : "primary"}
        labelPlacement="inside"
        size="sm"
        readOnly={readOnly}
        {...rest}
        {...(!!name && fieldProps)}
      />

      {!readOnly && (
        <div className="h-5 mt-1 ml-2">
          {!!error && (
            <p className="font-semibold text-red-700 text-tiny">
              {error.message}
            </p>
          )}
        </div>
      )}
    </>
  );
}

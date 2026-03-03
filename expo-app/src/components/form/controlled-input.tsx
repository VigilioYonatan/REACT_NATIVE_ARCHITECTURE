import React from "react";
import { View, Text, TextInput, type TextInputProps } from "react-native";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { cn } from "../../utils/cn";

interface ControlledInputProps<T extends FieldValues> extends TextInputProps {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  error?: string;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
}

export function ControlledInput<T extends FieldValues>({
  control,
  name,
  label,
  error,
  className = "",
  labelClassName = "",
  inputClassName = "",
  ...textInputProps
}: ControlledInputProps<T>) {
  return (
    <View className={cn("mb-4", className)}>
      {label && (
        <Text className={cn("text-slate-300 font-medium mb-2", labelClassName)}>
          {label}
        </Text>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
          <>
            <TextInput
              className={cn(
                "w-full h-[50px] bg-slate-800/50 border rounded-xl px-4 text-white placeholder:text-slate-500",
                fieldError || error ? "border-red-500" : "border-slate-700",
                inputClassName
              )}
              placeholderTextColor="#64748b"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              {...textInputProps}
            />
            {(fieldError || error) && (
              <Text className="text-red-500 text-sm mt-1">
                {fieldError?.message || error}
              </Text>
            )}
          </>
        )}
      />
    </View>
  );
}

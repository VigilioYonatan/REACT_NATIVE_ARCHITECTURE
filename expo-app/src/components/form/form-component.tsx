import { createContext } from "react";
import type { FieldValues, SubmitHandler, UseFormReturn } from "react-hook-form";
import { View } from "react-native";

// biome-ignore lint/suspicious/noExplicitAny: createContext requires flexible generic types for form context
export const FormControlContext = createContext({} as UseFormReturn<any, any, any>);

// biome-ignore lint/suspicious/noExplicitAny: Required by UseFormReturn generic signature
interface FormProps<T extends FieldValues> extends UseFormReturn<T, any, any> {
  children: React.ReactNode;
  onSubmit?: SubmitHandler<T>;
  className?: string; // for NativeWind
}

export function Form<T extends FieldValues>({
  children,
  onSubmit,
  className,
  ...methods
}: FormProps<T>) {
  return (
    <FormControlContext.Provider value={methods}>
      <View className={className}>
        {/* Form Logic if needed, but in RN usually handled by buttons calling handleSubmit manually */}
        {children}
      </View>
    </FormControlContext.Provider>
  );
}

export default Form;

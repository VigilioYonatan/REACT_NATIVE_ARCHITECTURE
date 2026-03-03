import Badge from "@components/extras/badge";
import Loader from "@components/extras/loader";
import { cn } from "@infrastructure/utils/client";
import { CheckCircle2, FileText, Search, X } from "lucide-react-native";
import type { Path } from "react-hook-form";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { useFormArray } from "../../form-array/hooks/use-form-array.hook";

// Types need to be mocked or imported correctly. Assuming compatibility.
export interface FormDocumentArrayProps<X extends object, T extends object> {
  title: string;
  name: Path<X>;
  // biome-ignore lint/suspicious/noExplicitAny: Dynamic paginator type from library
  paginator: any;
  // biome-ignore lint/suspicious/noExplicitAny: Dynamic query type from library
  query: any;
  // biome-ignore lint/suspicious/noExplicitAny: Return type depends on consumer
  onValue: (value: T) => any;
  placeholder?: string;
  max?: number;
  disabled?: boolean;
  className?: string;
  required?: boolean;
}

export function FormDocumentArray<X extends object, T extends object>({
  name,
  title,
  paginator,
  query,
  onValue,
  placeholder = "Buscar documentos...",
  max,
  disabled,
  className,
  required,
}: FormDocumentArrayProps<X, T>) {
  // using hook logic but adapting UI
  const {
    savedSearches,
    showSuggestions,
    handleSelectSuggestion,
    handleRemoveItem,
    err,
    isFocused,
    data, // Suggestions data
    valueFormated,
  } = useFormArray({
    name,
    paginator,
    query,
    isUnique: false,
    max,
    onValue,
  });

  const error = err;
  const hasError = !!Object.keys(error).length;

  return (
    <View className={cn("w-full mb-4", className)}>
      <View className="flex-row items-center gap-2 mb-2">
        <Text className="text-sm font-semibold text-foreground">
          {title}
          {required ? <Text className="text-primary">*</Text> : ""}
        </Text>
      </View>

      {/* Search Input */}
      <View className="relative z-10 w-full mb-2">
        <View
          className={cn(
            "flex-row items-center border rounded-lg bg-background px-3 h-12",
            hasError ? "border-destructive" : "border-input",
            isFocused.value ? "border-primary ring-1 ring-primary/20" : "",
          )}
        >
          <Search size={18} className="text-muted-foreground mr-2" color="currentColor" />
          <TextInput
            className="flex-1 text-base text-foreground h-full"
            value={paginator.search.value}
            onChangeText={(text) => {
              // Adapt string event
              paginator.search.onSearchByName(text);
              showSuggestions.value = true;
            }}
            onFocus={() => {
              isFocused.value = true;
              showSuggestions.value = true;
            }}
            onBlur={() => {
              isFocused.value = false;
              setTimeout(() => {
                showSuggestions.value = false;
              }, 200);
            }}
            placeholder={placeholder}
            placeholderTextColor="#9ca3af"
            editable={!disabled && (!max || valueFormated.length < max)}
          />
          {(query.isFetching || query.isLoading) && <Loader />}
        </View>

        {/* Suggestions List (Absolute) */}
        {showSuggestions.value && data && data.length > 0 && (
          <View className="absolute top-14 left-0 right-0 bg-popover border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-hidden">
            <FlatList
              data={data}
              // biome-ignore lint/suspicious/noExplicitAny: Dynamic item type from paginator
              keyExtractor={(item: any) => String(item.id)}
              keyboardShouldPersistTaps="handled"
              // biome-ignore lint/suspicious/noExplicitAny: Dynamic item type from paginator
              renderItem={({ item }: { item: any }) => (
                <Pressable
                  className="p-3 border-b border-border active:bg-accent flex-row justify-between items-center"
                  onPress={() => handleSelectSuggestion(item)}
                >
                  <Text className="text-sm text-foreground flex-1">{item.value}</Text>
                  {item.status && (
                    <Badge variant={item.status === "READY" ? "success" : "secondary"}>
                      <Text className="text-[10px]">{item.status}</Text>
                    </Badge>
                  )}
                </Pressable>
              )}
            />
          </View>
        )}
      </View>

      {/* Selected Items Grid */}
      <View className="bg-muted/10 rounded-lg p-2 min-h-[60px] border border-border">
        {savedSearches.value.length === 0 ? (
          <View className="items-center justify-center py-4">
            <FileText size={24} className="text-muted-foreground/50 mb-1" color="currentColor" />
            <Text className="text-xs text-muted-foreground">Sin documentos</Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap gap-2">
            {savedSearches.value.map((item: any) => (
              <View
                key={String(item.id)}
                className="flex-row items-center bg-card border border-primary/20 rounded-md p-2 shadow-sm max-w-full"
              >
                <CheckCircle2 size={16} className="text-primary mr-2" color="currentColor" />
                <View className="flex-1 mr-2">
                  <Text className="text-sm font-medium text-foreground" numberOfLines={1}>
                    {item.value}
                  </Text>
                </View>
                <Pressable onPress={() => handleRemoveItem(item.id)}>
                  <X size={16} className="text-destructive" color="currentColor" />
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </View>

      {hasError && (
        <Text className="text-xs text-destructive mt-1">{error?.message as string}</Text>
      )}
    </View>
  );
}

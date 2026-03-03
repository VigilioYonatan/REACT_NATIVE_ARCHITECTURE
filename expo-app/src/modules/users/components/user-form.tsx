import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Mail, User as UserIcon } from "lucide-react-native";
import { useForm } from "react-hook-form";
import { Alert, View } from "react-native"; // Keep View for container
import Form from "@components/form"; // Import our refactored Form
import { useUserStore } from "../apis/user-store.api";
import { type UserStoreDto, userStoreDto } from "../dtos/user.dto";

export function UserForm() {
  const methods = useForm<UserStoreDto>({
    resolver: zodResolver(userStoreDto),
  });

  const mutation = useUserStore();

  function onSubmit(data: UserStoreDto) {
    mutation.mutate(data, {
      onSuccess(data) {
        Alert.alert("Éxito", `Usuario ${data.name} creado`);
        if (router.canGoBack()) router.back();
      },
      onError(_err) {
        Alert.alert("Error", "No se pudo crear el usuario");
      },
    });
  }

  return (
    <View className="flex-1 p-4 bg-background">
      <Form {...methods}>
        <Form.control
          name="name"
          title="Nombre"
          placeholder="Ej. Juan Pérez"
          ico={<UserIcon size={20} className="text-muted-foreground" color="currentColor" />}
        />

        <Form.control
          name="email"
          title="Email"
          placeholder="Ej. juan@example.com"
          type="email"
          ico={<Mail size={20} className="text-muted-foreground" color="currentColor" />}
          keyboardType="email-address"
        />

        {/* Example of other controls if needed */}

        <Form.button.submit
          isLoading={!!mutation.isLoading}
          title="Guardar Usuario"
          onPress={methods.handleSubmit(onSubmit)}
          className="mt-6"
        />
      </Form>
    </View>
  );
}

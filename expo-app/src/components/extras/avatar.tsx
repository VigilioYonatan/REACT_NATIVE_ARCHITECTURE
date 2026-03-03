import { environments } from "@infrastructure/config/client/environments.config";
import { cn } from "@infrastructure/utils/cn";
import { printFileWithDimension } from "@infrastructure/utils/hybrid";
import { DIMENSION_IMAGE } from "@modules/uploads/const/upload.const";
import { Image } from "expo-image";
import { Text, View, type ViewProps } from "react-native";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
type AvatarStatus = "online" | "offline" | "away" | "busy";

interface UserAvatarObject {
  avatar?: string | null;
  username?: string;
}

interface AvatarProps extends ViewProps {
  user: UserAvatarObject;
  size?: AvatarSize;
  status?: AvatarStatus;
  className?: string;
}

function Avatar({ user, size = "md", status, className, ...props }: AvatarProps) {
  const sizes = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
    xl: "w-20 h-20",
  };

  const textSizes = {
    xs: "text-[10px]",
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  };

  const statusColors = {
    online: "bg-primary",
    offline: "bg-muted-foreground",
    away: "bg-amber-500", // accent in RN usually amber/yellow
    busy: "bg-destructive",
  };

  const statusSizes = {
    xs: "w-2 h-2",
    sm: "w-2.5 h-2.5",
    md: "w-3 h-3",
    lg: "w-4 h-4",
    xl: "w-5 h-5",
  };

  return (
    <View className={cn("relative", className)} {...props}>
      <View
        className={cn(
          "rounded-lg bg-muted border border-border items-center justify-center overflow-hidden shadow-sm",
          sizes[size],
        )}
      >
        {user?.avatar ? (
          <Image
            source={{
              uri: printFileWithDimension(
                user.avatar,
                DIMENSION_IMAGE.xs,
                environments.STORAGE_CDN_URL,
              )[0],
            }}
            alt={user.username || ""}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <Text className={cn("font-medium text-muted-foreground", textSizes[size])}>
            {`${user?.username?.charAt(0).toUpperCase()}` || "?"}
          </Text>
        )}
      </View>

      {status && (
        <View
          className={cn(
            "absolute -bottom-1 -right-1 rounded-sm border border-background shadow-sm",
            statusColors[status],
            statusSizes[size],
          )}
        />
      )}
    </View>
  );
}

export default Avatar;

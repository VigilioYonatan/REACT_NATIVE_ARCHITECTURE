import Loader from "@components/extras/loader";
import { cn } from "@infrastructure/utils/client";

import { Image } from "expo-image";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { type CalendarProps, useCalendar } from "../hooks/use-calendar.hook";

function Calendar(props: CalendarProps) {
  const { changeMonth = true, image, tooltip = [], isLoading = false, custom, finalDate } = props;

  const {
    date,
    daysOfWeek,
    months,
    previousMonth,
    nextMonth,
    chooseDay,
    renderDays,
    isNextMonthDisabled,
  } = useCalendar(props);

  return (
    <View className="p-4 w-full max-w-md self-center">
      {image && (
        <Image
          className="w-full h-[150px] rounded-t-lg mb-4"
          source={{ uri: image }}
          alt="Calendar header"
          contentFit="cover"
          transition={200}
        />
      )}

      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold text-foreground">
          {months[date.getMonth()]} {date.getFullYear()}
        </Text>
        <View className="flex-row items-center gap-2">
          {isLoading && <Loader />}
          {changeMonth && (
            <View className="flex-row gap-2">
              <Pressable
                onPress={previousMonth}
                disabled={isLoading}
                className="p-2 rounded-lg active:bg-muted"
                accessibilityLabel="Previous month"
              >
                <ChevronLeft size={20} className="text-primary" color="currentColor" />
              </Pressable>

              <Pressable
                onPress={nextMonth}
                disabled={isNextMonthDisabled || isLoading}
                className={cn(
                  "p-2 rounded-lg active:bg-muted",
                  isNextMonthDisabled && "opacity-50",
                )}
                accessibilityLabel="Next month"
              >
                <ChevronRight size={20} className="text-primary" color="currentColor" />
              </Pressable>
            </View>
          )}
        </View>
      </View>

      <View className="bg-card border border-border rounded-lg p-2">
        {/* Days Header */}
        <View className="flex-row flex-wrap mb-2">
          {daysOfWeek.map((day, index) => (
            <View key={day} className="w-[14.28%] items-center justify-center py-2">
              <Text
                className={cn(
                  "text-xs font-semibold",
                  index === 6 ? "text-destructive" : "text-muted-foreground",
                )}
              >
                {day}
              </Text>
            </View>
          ))}
        </View>

        {/* Days Grid */}
        <View className="flex-row flex-wrap">
          {isLoading
            ? renderDays().map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: Loading skeleton items have stable order
                <View key={`skeleton-${i}`} className="w-[14.28%] p-1 aspect-square">
                  <View className="w-full h-full bg-muted rounded-lg" />
                </View>
              ))
            : renderDays().map((day, index) => {
                if (day === "") {
                  // biome-ignore lint/suspicious/noArrayIndexKey: Empty calendar slots have stable positions
                  return <View key={`empty-${index}`} className="w-[14.28%] aspect-square" />;
                }

                const dayNumber = day as number;
                const currentDate = new Date(date.getFullYear(), date.getMonth(), dayNumber);
                const isToday =
                  dayNumber === new Date().getDate() &&
                  date.getMonth() === new Date().getMonth() &&
                  date.getFullYear() === new Date().getFullYear();
                const isSelected = dayNumber === date.getDate();
                const isSunday = index % 7 === 6; // Check logic: index implies position in grid (0-6 is first row)
                // Actually index is just index in renderDays array.
                // renderDays includes empty strings at start.
                // So we need careful calculation if we relied on index % 7.
                // renderDays adds padding at start, so the layout flows correctly.
                // Logic check: in DOM version, IS_SUNDAY = index % 7 === 6. Yes.

                const isDayDisabled = finalDate ? currentDate > finalDate : false;

                return (
                  <Pressable
                    key={dayNumber}
                    disabled={isDayDisabled}
                    onPress={() => chooseDay(dayNumber)}
                    className={cn(
                      "w-[14.28%] aspect-square items-center justify-center rounded-lg relative overflow-hidden",
                      isDayDisabled ? "opacity-50" : "active:bg-accent",
                      isSelected && !isDayDisabled
                        ? "bg-primary"
                        : isToday && !isDayDisabled
                          ? "bg-accent"
                          : "",
                    )}
                  >
                    {/* Tooltips/Events Indicators */}
                    <View className="absolute bottom-1 left-0 right-0 flex-row justify-center gap-[1px] px-1">
                      {tooltip
                        .filter((tool) =>
                          tool.result.some(
                            (result) =>
                              new Date(result.date).toDateString() === currentDate.toDateString(),
                          ),
                        )

                        .map((tool) => {
                          // Only showing dots for now as tooltips are hard on mobile grid
                          const dot = (
                            <View
                              key={tool.color}
                              className="w-1 h-1 rounded-full"
                              style={{ backgroundColor: tool.color }}
                            />
                          );
                          return dot;
                        })}
                    </View>

                    <Text
                      className={cn(
                        "text-sm font-medium",
                        isSelected && !isDayDisabled
                          ? "text-primary-foreground font-bold"
                          : isToday && !isDayDisabled
                            ? "text-accent-foreground"
                            : isSunday && !isDayDisabled
                              ? "text-destructive"
                              : "text-foreground",
                        isDayDisabled && "text-muted-foreground",
                      )}
                    >
                      {dayNumber}
                    </Text>

                    {custom ? custom(dayNumber, date.getMonth(), date.getFullYear()) : null}
                  </Pressable>
                );
              })}
        </View>
      </View>
    </View>
  );
}

export default Calendar;

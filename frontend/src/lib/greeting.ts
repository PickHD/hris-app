/**
 * Greeting utility functions for dynamic time-based greetings
 * @module lib/greeting
 */

/**
 * Time period types for type safety
 */
export type TimePeriod = "morning" | "afternoon" | "evening";

/**
 * Get time period based on hour (0-23)
 *
 * Standard time periods:
 * - Morning: 00:00 - 11:59
 * - Afternoon: 12:00 - 17:59
 * - Evening: 18:00 - 23:59
 *
 * @param hour - Hour in 24-hour format (0-23)
 * @returns Time period
 *
 * @example
 * getTimePeriod(8) // "morning"
 * getTimePeriod(14) // "afternoon"
 * getTimePeriod(20) // "evening"
 */
export const getTimePeriod = (hour: number): TimePeriod => {
  // Validate input to prevent runtime errors
  if (typeof hour !== "number" || hour < 0 || hour > 23) {
    console.error(
      `[getTimePeriod] Invalid hour value: ${hour}. Defaulting to morning.`
    );
    return "morning";
  }

  if (hour >= 0 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  return "evening";
};

/**
 * Get greeting message based on time period
 *
 * @param date - Date object (defaults to current time)
 * @returns Greeting message
 *
 * @example
 * getGreetingMessage() // "Good Morning" (if called in the morning)
 * getGreetingMessage(new Date("2024-01-01T14:00:00")) // "Good Afternoon"
 */
export const getGreetingMessage = (date: Date = new Date()): string => {
  // Validate date object
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    console.error(
      "[getGreetingMessage] Invalid date object. Defaulting to current time."
    );
    date = new Date();
  }

  const hour = date.getHours();
  const period = getTimePeriod(hour);

  const greetings: Record<TimePeriod, string> = {
    morning: "Good Morning",
    afternoon: "Good Afternoon",
    evening: "Good Evening",
  };

  return greetings[period];
};

/**
 * Get complete greeting with user name
 *
 * @param full_name - User's full name
 * @param date - Date object (optional, defaults to current time)
 * @returns Formatted greeting string
 *
 * @example
 * getGreetingWithName("John Doe") // "Good Morning, John! 👋"
 * getGreetingWithName("") // "Good Morning!"
 */
export const getGreetingWithName = (
  fullName?: string,
  date?: Date
): string => {
  const greeting = getGreetingMessage(date);

  // Extract first name safely
  const firstName =
    fullName && fullName.trim().length > 0
      ? fullName.trim().split(" ")[0]
      : "";

  // Add emoji only if there's a name
  return firstName ? `${greeting}, ${firstName}! 👋` : `${greeting}!`;
};

/**
 * Get greeting message with custom locale support (extensible for i18n)
 *
 * This function is designed for future internationalization support
 *
 * @param locale - Locale code (e.g., "en", "id")
 * @param date - Date object (optional)
 * @returns Greeting message in specified locale
 *
 * @example
 * getGreetingWithLocale("en") // "Good Morning"
 * getGreetingWithLocale("id") // "Selamat Pagi"
 */
export const getGreetingWithLocale = (
  locale: string = "en",
  date: Date = new Date()
): string => {
  const hour = date.getHours();
  const period = getTimePeriod(hour);

  // Extensible for future i18n support
  const greetings: Record<string, Record<TimePeriod, string>> = {
    en: {
      morning: "Good Morning",
      afternoon: "Good Afternoon",
      evening: "Good Evening",
    },
    id: {
      morning: "Selamat Pagi",
      afternoon: "Selamat Siang",
      evening: "Selamat Malam",
    },
  };

  // Fallback to English if locale not supported
  return greetings[locale]?.[period] || greetings["en"][period];
};

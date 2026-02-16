import * as Popover from "@radix-ui/react-popover";
import { BellIcon, CheckIcon } from "@radix-ui/react-icons";
import { clsx } from "clsx";
import { useWebSocket } from "@/features/notification/hooks/useWebSocket";

export const NotificationBell = () => {
  const { isConnected, notifications, unreadCount, markAllRead } =
    useWebSocket();

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Notifications"
        >
          <BellIcon
            className={clsx(
              "w-6 h-6",
              isConnected
                ? "text-gray-700 dark:text-gray-200"
                : "text-gray-400",
            )}
          />

          <span
            className={clsx(
              "absolute top-2 right-2 w-2 h-2 rounded-full border border-white",
              isConnected ? "bg-green-500" : "bg-red-500",
            )}
          />

          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-50 w-80 rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900 animate-in fade-in zoom-in-95 duration-200"
          sideOffset={5}
          align="end"
        >
          <div className="flex items-center justify-between border-b px-4 py-3 dark:border-gray-700">
            <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
              Notifications
            </h4>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium flex items-center gap-1"
              >
                <CheckIcon className="w-3 h-3" /> Mark read
              </button>
            )}
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <BellIcon className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-sm">No new notifications</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                {notifications.map((notif, idx) => (
                  <li
                    key={idx}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                  >
                    <div className="flex gap-3">
                      <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {notif.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 dark:text-gray-400 leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Popover.Arrow className="fill-white dark:fill-gray-900" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

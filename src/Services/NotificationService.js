import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

const successNotification = (title, message) => {
  notifications.show({
    title: title,
    message: message,
    withCloseButton: true,
    icon: React.createElement(IconCheck, { size: 20 }),
    color: "teal",
    withBorder: true,
  });
};

const errorNotification = (title, message) => {
  notifications.show({
    title: title,
    message: message,
    withCloseButton: true,
    icon: React.createElement(IconX, { size: 20 }),
    color: "red",
    withBorder: true,
  });
};

export { successNotification, errorNotification };

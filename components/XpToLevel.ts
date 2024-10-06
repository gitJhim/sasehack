import { CycleItem } from "../types/cycle.types";
import { User } from "../types/user.types";

function XpToLevel(user: User): number {
  if (user.level === null || user.xp === null) {
    return 0;
  }

  return user.level * 100;
}

const mapItemToXp = (item: string) => {
  switch (item) {
    case "plastic bottle":
      return 5;
    case "cardboard box":
      return 9;
    case "aluminum can":
      return 5;
    case "glass bottle":
      return 10;
    case "plastic bag":
      return 5;
    case "soda can":
      return 5;
    case "paper cup":
      return 6;
    default:
      return 0;
  }
};

export const calculateXp = (items: CycleItem[]) => {
  let xp = 0;

  items.forEach((item) => {
    xp += mapItemToXp(item.type) * item.quantity;
  });

  return xp;
};

export default XpToLevel;

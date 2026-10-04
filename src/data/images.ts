import facade from "@/assets/facade.jpg";
import facadeSet from "@/assets/facade.jpg?w=640;1024&format=webp&quality=74&as=srcset";
import indoor from "@/assets/seat-indoor.jpg";
import indoorSet from "@/assets/seat-indoor.jpg?w=640;1024&format=webp&quality=74&as=srcset";
import lounge from "@/assets/seat-lounge.jpg";
import loungeSet from "@/assets/seat-lounge.jpg?w=640;1024&format=webp&quality=74&as=srcset";
import outdoor from "@/assets/seat-outdoor.jpg";
import outdoorSet from "@/assets/seat-outdoor.jpg?w=640;1024&format=webp&quality=74&as=srcset";
import billiards from "@/assets/m-billiards.jpg";
import billiardsSet from "@/assets/m-billiards.jpg?w=480;1024&format=webp&quality=74&as=srcset";
import coffee from "@/assets/m-coffee.jpg";
import coffeeSet from "@/assets/m-coffee.jpg?w=480;1024&format=webp&quality=74&as=srcset";
import drinks from "@/assets/m-drinks.jpg";
import drinksSet from "@/assets/m-drinks.jpg?w=480;1024&format=webp&quality=74&as=srcset";
import friends from "@/assets/m-friends.jpg";
import friendsSet from "@/assets/m-friends.jpg?w=480;1024&format=webp&quality=74&as=srcset";

export type Img = { src: string; srcSet: string; width: number; height: number };

const wide = (src: string, srcSet: string): Img => ({ src, srcSet, width: 1024, height: 645 });
const square = (src: string, srcSet: string): Img => ({ src, srcSet, width: 1024, height: 1024 });

export const images = {
  facade: wide(facade, facadeSet),
  indoor: wide(indoor, indoorSet),
  lounge: wide(lounge, loungeSet),
  outdoor: wide(outdoor, outdoorSet),
  billiards: square(billiards, billiardsSet),
  coffee: square(coffee, coffeeSet),
  drinks: square(drinks, drinksSet),
  friends: square(friends, friendsSet),
};

export type ImageKey = keyof typeof images;

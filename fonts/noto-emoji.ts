import { Noto_Color_Emoji } from "next/font/google";

export const notoColorEmoji = Noto_Color_Emoji({
    variable: "--noto-color-emoji",
    subsets: ["emoji"],
    weight: "400",
});
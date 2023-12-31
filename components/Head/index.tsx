import React from "react";
import { View } from "react-native";

type HeadProps = {
  position?: number[];
  size?: number;
};

export default function Head({ position = [], size = 1 }: HeadProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        backgroundColor: "red",
        position: "absolute",
        left: position[0] * size,
        top: position[1] * size,
      }}
    ></View>
  );
}

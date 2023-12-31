import React from "react";
import { View } from "react-native";
import Constants from "../../Constants";

type TailProps = {
  position?: number[];
  size?: number;
  elements?: number[][];
};

export default function Tail({ elements = [], size = 1 }: TailProps) {
  const tailList = elements.map((el, idx) => (
    <View
      key={idx}
      style={{
        width: size,
        height: size,
        position: "absolute",
        left: el[0] * size,
        top: el[1] * size,
        backgroundColor: "red",
      }}
    ></View>
  ));
  return (
    <View
      style={{
        width: Constants.GRID_SIZE * size,
        height: Constants.GRID_SIZE * size,
      }}
    >
      {tailList}
    </View>
  );
}

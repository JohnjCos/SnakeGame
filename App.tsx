import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  Dimensions,
} from "react-native";
import { GameEngine } from "react-native-game-engine";
import Constants from "./Constants";
import Head from "./components/Head";
import Food from "./components/Food";
import Tail from "./components/Tail";
import GameLoop from "./systems/GameLoop";
import React from "react";
export default function App() {
  const BoardSize = Constants.GRID_SIZE * Constants.CELL_SIZE;
  const engine = React.useRef<any>(null);
  const [isGameRunning, setIsGameRunning] = React.useState(true);
  const randomPositions = React.useCallback((min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }, []);

  const resetGame = React.useCallback(() => {
    if (!engine.current) {
      return;
    }
    engine.current.swap({
      head: {
        position: [0, 0],
        size: Constants.CELL_SIZE,
        updateFrequency: 10,
        nextMove: 10,
        xspeed: 0,
        yspeed: 0,
        renderer: <Head />,
      },
      food: {
        position: [
          randomPositions(0, Constants.GRID_SIZE - 1),
          randomPositions(0, Constants.GRID_SIZE - 1),
        ],
        size: Constants.CELL_SIZE,
        updateFrequency: 10,
        nextMove: 10,
        xspeed: 0,
        yspeed: 0,
        renderer: <Food />,
      },
      tail: {
        size: Constants.CELL_SIZE,
        elements: [],
        render: <Tail />,
      },
    });
    setIsGameRunning(true);
    return;
  }, []);

  const gameEngineProps = React.useMemo(
    () => ({
      style: [{ width: BoardSize, height: BoardSize }, styles.board],
      systems: [GameLoop],
      onEvent: (e: string) => {
        switch (e) {
          case "game-over":
            setIsGameRunning(false);
            return;
        }
      },
    }),
    [BoardSize, GameLoop, randomPositions]
  );

  return (
    <View style={styles.canvas}>
      <GameEngine
        ref={engine}
        running={isGameRunning}
        entities={{
          head: {
            position: [0, 0],
            size: Constants.CELL_SIZE,
            updateFrequency: 10,
            nextMove: 10,
            xspeed: 0,
            yspeed: 0,
            renderer: <Head />,
          },
          food: {
            position: [
              randomPositions(0, Constants.GRID_SIZE - 1),
              randomPositions(0, Constants.GRID_SIZE - 1),
            ],
            size: Constants.CELL_SIZE,
            updateFrequency: 10,
            nextMove: 10,
            xspeed: 0,
            yspeed: 0,
            renderer: <Food />,
          },
          tail: {
            size: Constants.CELL_SIZE,
            elements: [],
            render: <Tail />,
          },
        }}
        {...gameEngineProps}
      ></GameEngine>
      <View style={styles.controlContainer}>
        <View style={styles.controllerRow}>
          <TouchableOpacity onPress={() => engine.current.dispatch("move-up")}>
            <View style={styles.controlBtn} />
          </TouchableOpacity>
        </View>

        <View style={styles.controllerRow}>
          <TouchableOpacity
            onPress={() => engine.current.dispatch("move-left")}
          >
            <View style={styles.controlBtn} />
          </TouchableOpacity>

          <View style={[styles.controlBtn, { backgroundColor: "" }]} />
          <TouchableOpacity
            onPress={() => engine.current.dispatch("move-right")}
          >
            <View style={styles.controlBtn} />
          </TouchableOpacity>
        </View>

        <View style={styles.controllerRow}>
          <TouchableOpacity
            onPress={() => engine.current.dispatch("move-down")}
          >
            <View style={styles.controlBtn} />
          </TouchableOpacity>
        </View>
      </View>

      {!isGameRunning && (
        <TouchableOpacity onPress={resetGame}>
          <Text
            style={{
              color: "white",
              marginTop: 15,
              fontSize: 22,
              padding: 10,
              backgroundColor: "grey",
              borderRadius: 10,
            }}
          >
            Start New Game
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    backgroundColor: "black",
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  board: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "red",
    position: "absolute",
  },
  controlContainer: {
    marginTop: 10,
    flex: 2,
  },
  controllerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  controlBtn: {
    backgroundColor: "yellow",
    width: 30,
    height: 30,
  },
});

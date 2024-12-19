/* @jsxImportSource @emotion/react */
"use client";
import { PlayButton, ForwardButton, RewindButton } from "../src/index";

const Home = () => (
  <div>
    <h3>Buttons</h3>
    <div
      css={{
        margin: "0.5em",
        padding: "0.5em",
        display: "flex",
        backgroundColor: "#333",
      }}
    >
      <PlayButton />
      <PlayButton playbackState="playing" />
      <PlayButton playbackState="ended" />
      <RewindButton />
      <ForwardButton />
    </div>
  </div>
);

export default Home;

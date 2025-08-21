// server.js
const express = require("express");
const { spawn } = require("child_process");

const app = express();
const port = process.env.PORT || 3000;

// Your DASH source (with license already handled by ffmpeg if supported)
const HBO_SIGNATURE_SRC = "https://cdn-uw2-prod.tsv2.amagi.tv/linear/amg01006-abs-cbn-abscbn-gma-x7-dash-abscbnono/7c693236-e0c1-40a3-8bd0-bb25e43f5bfc/index.mpd";

// Route to serve HLS playlist
app.get("/hbosignature/playlist.m3u8", (req, res) => {
  res.setHeader("Content-Type", "application/vnd.apple.mpegurl");

  const ffmpeg = spawn("ffmpeg", [
    "-i", HBO_SIGNATURE_SRC,
    "-c", "copy",
    "-f", "hls",
    "-hls_time", "10",
    "-hls_list_size", "0",
    "-hls_flags", "delete_segments",
    "pipe:1"
  ]);

  ffmpeg.stdout.pipe(res);
  ffmpeg.stderr.on("data", (data) => {
    console.error("FFmpeg error:", data.toString());
  });

  ffmpeg.on("close", (code) => {
    console.log("FFmpeg exited with code", code);
  });
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});

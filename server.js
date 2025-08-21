// server.js
const express = require("express");
const { spawn } = require("child_process");

const app = express();
const port = process.env.PORT || 3000;

// Your DASH source (with license already handled by ffmpeg if supported)
const HBO_SIGNATURE_SRC = "https://qp-pldt-live-grp-01-prod.akamaized.net/out/u/cg_hbosign.mpd";

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

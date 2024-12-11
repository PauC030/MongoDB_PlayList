const mongoose = require('mongoose');

// Esquema para las canciones dentro de una playlist
const SongSchema = new mongoose.Schema({
  title: { type: String, required: true },
  album: { type: String, required: true },
  duration: { type: String, required: true },
  genre: { type: String, required: true },
  releaseYear: { type: Number, required: true }
});

// Esquema para las playlists
const PlaylistSchema = new mongoose.Schema({
  playlistName: { type: String, required: true },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  songs: { type: [SongSchema], required: true } // Array de canciones
});

module.exports = mongoose.model('Playlist', PlaylistSchema);

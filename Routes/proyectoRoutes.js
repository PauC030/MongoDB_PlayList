const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Playlist = require('../Models/Proyecto');

// Middleware para validar datos de la canción
const validarCancion = (req, res, next) => {
  const { title, album, duration, genre, releaseYear } = req.body;
  if (!title || !album || !duration || !genre || !releaseYear) {
    return res.status(400).json({ success: false, error: 'Todos los campos de la canción son obligatorios.' });
  }
  next();
};

// Agregar una canción a una playlist por el nombre de la playlist
router.post('/:playlistName/songs', validarCancion, async (req, res) => {
  try {
    const { playlistName } = req.params;
    const playlist = await Playlist.findOne({ playlistName });

    if (!playlist) {
      return res.status(404).json({ success: false, error: 'Playlist no encontrada.' });
    }

    playlist.songs.push(req.body);
    const updatedPlaylist = await playlist.save();
    res.status(201).json({ success: true, data: updatedPlaylist });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Obtener todas las canciones de una playlist por el nombre de la playlist
router.get('/:playlistName/songs', async (req, res) => {
  try {
    const { playlistName } = req.params;
    const playlist = await Playlist.findOne({ playlistName });

    if (!playlist) {
      return res.status(404).json({ success: false, error: 'Playlist no encontrada.' });
    }

    res.status(200).json({ success: true, data: playlist.songs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Actualizar una canción en una playlist por el nombre de la playlist y el título de la canción
router.put('/:playlistName/songs/:title', validarCancion, async (req, res) => {
  try {
    const { playlistName, title } = req.params;
    const playlist = await Playlist.findOne({ playlistName });

    if (!playlist) {
      return res.status(404).json({ success: false, error: 'Playlist no encontrada.' });
    }

    const song = playlist.songs.find((song) => song.title === title);

    if (!song) {
      return res.status(404).json({ success: false, error: 'Canción no encontrada en la playlist.' });
    }

    Object.assign(song, req.body);
    const updatedPlaylist = await playlist.save();
    res.status(200).json({ success: true, data: updatedPlaylist });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Eliminar una canción de una playlist por el nombre de la playlist y el título de la canción
router.delete('/:playlistName/songs/:title', async (req, res) => {
  try {
    const { playlistName, title } = req.params;
    const playlist = await Playlist.findOne({ playlistName });

    if (!playlist) {
      return res.status(404).json({ success: false, error: 'Playlist no encontrada.' });
    }

    const songIndex = playlist.songs.findIndex((song) => song.title === title);

    if (songIndex === -1) {
      return res.status(404).json({ success: false, error: 'Canción no encontrada en la playlist.' });
    }

    playlist.songs.splice(songIndex, 1);
    const updatedPlaylist = await playlist.save();
    res.status(200).json({ success: true, message: 'Canción eliminada.', data: updatedPlaylist });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;

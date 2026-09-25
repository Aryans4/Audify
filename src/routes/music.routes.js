const express = require("express");
const multer = require("multer");
const musicController = require("../controllers/music.controller.js");
const { authArtist, authUser } = require("../middlewares/auth.middleware.js");

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();
router.post("/", authArtist, upload.single("music"), musicController.createMusic);
router.post("/upload", authArtist, upload.single("music"), musicController.createMusic);
router.post("/album", authArtist, musicController.createAlbum);
router.get("/", musicController.getAllMusic);
router.get("/albums", musicController.getAllAlbums);
router.get("/albums/:albumId", musicController.getAlbumById);
router.get("/search", musicController.searchGlobalMusic);
router.get("/stream", musicController.streamGlobalMusic);
router.get("/recommendations", musicController.getRecommendations);
router.post("/:id/comments", authUser, musicController.addComment);
router.get("/:id/comments", musicController.getComments);

module.exports = router;

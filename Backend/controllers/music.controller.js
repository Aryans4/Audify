const musicModel = require("../models/music.model.js")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const { uploadMusic } = require("../services/storage.service.js")
const albumModel = require("../models/album.model.js")
const forge = require("node-forge")

function decryptSaavnMediaUrl(encryptedMediaUrl) {
    if (!encryptedMediaUrl) return null;
    try {
        const key = "38346591";
        const encrypted = forge.util.decode64(encryptedMediaUrl);
        const decipher = forge.cipher.createDecipher("DES-ECB", forge.util.createBuffer(key));
        decipher.start({ iv: forge.util.createBuffer("00000000") });
        decipher.update(forge.util.createBuffer(encrypted));
        decipher.finish();
        const decrypted = decipher.output.getBytes();
        return decrypted.replace("_96", "_320");
    } catch (e) {
        return null;
    }
}

function unescapeEntities(str) {
    if (!str) return "";
    return str
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&#039;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
}

async function createMusic(req, res) {

    const { title } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: "No music file provided" })
    }

    const result = await uploadMusic(file.buffer.toString("base64"))
    const music = await musicModel.create({
        uri: result.url || result.uri,
        title,
        artist: req.user.id
    })

    return res.status(201).json({
        message: "Music created successfully",
        music: {
            id: music._id,
            uri: music.uri,
            title: music.title,
            artist: music.artist
        }
    })
}
async function createAlbum(req,res){
    const {title,musicIds}=req.body

    const album=await albumModel.create({
        title,
        artist: req.user.id,
        music: musicIds,
    })

    res.status(201).json({
        message: "Album created successfully",
        album: {
            id: album._id,
            title:album.title,
            artist:album.artist,
            music:musicIds
        }
    })
}
async function getAllMusic(req, res) {
    try {
        const music = await musicModel
            .find()
            .limit(20)
            .populate("artist")
            .populate("comments.user", "username email role");

        return res.status(200).json({
            message: "Music fetched successfully",
            music: music || []
        });
    } catch (err) {
        console.error("Error in getAllMusic:", err.message);
        return res.status(200).json({
            message: "Music fallback (offline/connecting)",
            music: []
        });
    }
}

async function getAllAlbums(req, res) {
    try {
        const album = await albumModel.find().populate("artist").populate("music");
        return res.status(200).json({
            message: "Album fetched successfully",
            album: album || []
        });
    } catch (err) {
        console.error("Error in getAllAlbums:", err.message);
        return res.status(200).json({
            message: "Album fallback (offline/connecting)",
            album: []
        });
    }
}
async function getAlbumById(req, res) {
    try {
        const albumId = req.params.albumId
        const album = await albumModel.findById(albumId).populate("artist").populate("music")
        
        if (!album) {
            return res.status(404).json({
                message: "Album not found"
            })
        }

        return res.status(200).json({
            message: "Album fetched successfully",
            album
        })
    } catch (err) {
        return res.status(400).json({
            message: "Invalid Album ID"
        })
    }
}

async function addComment(req, res) {
    try {
        const musicId = req.params.id;
        const { text, timestamp } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({ message: "Comment text cannot be empty" });
        }

        // Anti-bot & Spam Protection: Block automated promotional patterns common on SoundCloud bots
        const spamPattern = /(dm\s*@|promote\s*(on|it)|telegram|whatsapp|wa\.me|t\.me|50k\s*plays|buy\s*followers|free\s*followers|promo\s*on)/i;
        if (spamPattern.test(text)) {
            return res.status(400).json({
                message: "Blocked by Audify Anti-Bot Shield: Automated promotional bot spam is strictly prohibited."
            });
        }

        if (!mongoose.Types.ObjectId.isValid(musicId)) {
            return res.status(400).json({ message: "Verified notes are available on creator tracks uploaded directly to Audify." });
        }

        const music = await musicModel.findById(musicId);
        if (!music) {
            return res.status(404).json({ message: "Track not found" });
        }

        const newComment = {
            user: req.user.id,
            text: text.trim(),
            timestamp: Number(timestamp) || 0,
            createdAt: new Date()
        };

        if (!music.comments) music.comments = [];
        music.comments.push(newComment);
        await music.save();

        const updatedMusic = await musicModel.findById(musicId).populate("comments.user", "username email role");

        return res.status(201).json({
            message: "Verified comment posted successfully",
            comments: updatedMusic.comments
        });
    } catch (err) {
        return res.status(500).json({ message: "Failed to post comment", error: err.message });
    }
}

async function getComments(req, res) {
    try {
        const musicId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(musicId)) {
            return res.status(200).json({
                message: "Comments fetched successfully",
                comments: []
            });
        }

        const music = await musicModel.findById(musicId).populate("comments.user", "username email role");

        if (!music) {
            return res.status(404).json({ message: "Track not found" });
        }

        return res.status(200).json({
            message: "Comments fetched successfully",
            comments: music.comments || []
        });
    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch comments", error: err.message });
    }
}

async function searchGlobalMusic(req, res) {
    try {
        const query = req.query.q || req.query.query;
        if (!query || !query.trim()) {
            return res.status(400).json({ message: "Search query is required" });
        }

        const url = `https://www.jiosaavn.com/api.php?__call=search.getResults&_format=json&_marker=0&api_version=4&ctx=web6dot0&n=25&p=1&q=${encodeURIComponent(query.trim())}`;
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "application/json, text/plain, */*"
            }
        });

        if (!response.ok) {
            return res.status(502).json({ message: "Failed to fetch from global music catalog" });
        }

        const data = await response.json();
        const rawResults = data.results || [];

        const tracks = rawResults
            .map((item) => {
                const streamUrl = decryptSaavnMediaUrl(item.more_info?.encrypted_media_url);
                if (!streamUrl) return null;

                const primaryArtist = item.more_info?.artistMap?.primary_artists?.[0]?.name || item.subtitle?.split("-")[0]?.trim() || "Artist";
                const highResCover = item.image ? item.image.replace("150x150", "500x500") : "";

                return {
                    _id: `global_${item.id}`,
                    title: unescapeEntities(item.title),
                    artist: {
                        username: unescapeEntities(primaryArtist),
                        role: "global_artist"
                    },
                    album: unescapeEntities(item.more_info?.album || item.subtitle || "Single"),
                    uri: streamUrl,
                    coverArt: highResCover,
                    duration: Number(item.more_info?.duration) || 0,
                    year: item.year || null,
                    isGlobal: true,
                    comments: []
                };
            })
            .filter(Boolean);

        return res.status(200).json({
            message: "Global music search successful",
            query: query.trim(),
            total: tracks.length,
            tracks
        });
    } catch (err) {
        return res.status(500).json({ message: "Search error", error: err.message });
    }
}

// Browser-safe stream proxy for catalog tracks. Some CDNs reject direct playback
// from a localhost origin, while server-side requests are accepted consistently.
async function streamGlobalMusic(req, res) {
    const sourceUrl = req.query.url;

    if (!sourceUrl) {
        return res.status(400).json({ message: "A stream URL is required" });
    }

    let parsedUrl;
    try {
        parsedUrl = new URL(sourceUrl);
    } catch (_) {
        return res.status(400).json({ message: "Invalid stream URL" });
    }

    if (parsedUrl.protocol !== "https:" || !parsedUrl.hostname.endsWith("saavncdn.com")) {
        return res.status(400).json({ message: "Unsupported stream source" });
    }

    try {
        const upstream = await fetch(parsedUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
                "Accept": "audio/*,*/*;q=0.8",
                ...(req.headers.range ? { Range: req.headers.range } : {})
            }
        });

        if (!upstream.ok && upstream.status !== 206) {
            return res.status(502).json({ message: "Music provider could not deliver this track" });
        }

        ["content-type", "content-length", "content-range", "accept-ranges"].forEach((header) => {
            const value = upstream.headers.get(header);
            if (value) res.setHeader(header, value);
        });
        res.status(upstream.status);

        const { Readable } = require("stream");
        Readable.fromWeb(upstream.body).pipe(res);
    } catch (err) {
        console.error("Global stream proxy error:", err.message);
        return res.status(502).json({ message: "Unable to start this track" });
    }
}

async function getRecommendations(req, res) {
    try {
        const { artist, title, genre, songId } = req.query;
        const cleanArtist = (artist || '').trim();
        const cleanTitle = (title || '').trim();
        const cleanGenre = (genre || '').trim();

        const searchQueries = [];

        if (cleanArtist && cleanArtist !== 'Artist' && cleanArtist !== 'Unknown') {
            searchQueries.push(`${cleanArtist} Top Hits`);
            searchQueries.push(`${cleanArtist} Songs`);
        }
        if (cleanGenre) {
            searchQueries.push(`${cleanGenre} Hits`);
        }
        if (cleanTitle) {
            searchQueries.push(`${cleanTitle} Similar`);
        }
        if (searchQueries.length === 0) {
            searchQueries.push('Top Global Hits');
            searchQueries.push('Spotify Pop Hits');
        }

        const collectedTracks = [];
        const seenIds = new Set();
        if (songId) seenIds.add(songId);

        // Fetch recommendations concurrently
        for (const query of searchQueries.slice(0, 3)) {
            try {
                const url = `https://www.jiosaavn.com/api.php?__call=search.getResults&_format=json&_marker=0&api_version=4&ctx=web6dot0&n=15&p=1&q=${encodeURIComponent(query)}`;
                const response = await fetch(url, {
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                        "Accept": "application/json, text/plain, */*"
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    const rawResults = data.results || [];
                    for (const item of rawResults) {
                        const streamUrl = decryptSaavnMediaUrl(item.more_info?.encrypted_media_url);
                        if (!streamUrl) continue;

                        const trackId = `global_${item.id}`;
                        if (seenIds.has(trackId)) continue;
                        seenIds.add(trackId);

                        const primaryArtist = item.more_info?.artistMap?.primary_artists?.[0]?.name || item.subtitle?.split("-")[0]?.trim() || "Artist";
                        const highResCover = item.image ? item.image.replace("150x150", "500x500") : "";

                        let matchReason = "Recommended for you";
                        if (cleanArtist && primaryArtist.toLowerCase().includes(cleanArtist.toLowerCase())) {
                            matchReason = `More by ${cleanArtist}`;
                        } else if (cleanGenre) {
                            matchReason = `${cleanGenre} vibe`;
                        } else if (cleanTitle) {
                            matchReason = `Similar to ${cleanTitle}`;
                        }

                        collectedTracks.push({
                            _id: trackId,
                            title: unescapeEntities(item.title),
                            artist: {
                                username: unescapeEntities(primaryArtist),
                                role: "global_artist"
                            },
                            album: unescapeEntities(item.more_info?.album || item.subtitle || "Single"),
                            uri: streamUrl,
                            coverArt: highResCover,
                            duration: Number(item.more_info?.duration) || 0,
                            year: item.year || null,
                            isGlobal: true,
                            matchReason,
                            comments: []
                        });
                    }
                }
            } catch (e) {
                // Ignore per query failure
            }
        }

        return res.status(200).json({
            message: "Recommendations generated successfully",
            total: collectedTracks.length,
            tracks: collectedTracks.slice(0, 20)
        });
    } catch (err) {
        return res.status(500).json({ message: "Recommendation error", error: err.message });
    }
}

module.exports = {
    createMusic,
    createAlbum,
    getAllMusic,
    getAllAlbums,
    getAlbumById,
    addComment,
    getComments,
    searchGlobalMusic,
    streamGlobalMusic,
    getRecommendations
}

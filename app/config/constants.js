module.exports = {
  apiVersion: 1,
  apiVersion2: 2,
  SUCCESS: 200,
  CREATED: 201,
  ACCEPTED: 202,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SPOTIFY: {
    CLIENT_ID: 'da2cb8c8e3c540ab9feef4d9ded1ef8d',
    CLIENT_SECRET: 'b4b8e576181f4b3c9b2db22182693571',
    ENCRYPTION_SECRET: 'whatever_for_now',
    CLIENT_CALLBACK_URL: 'com-paddle-spotify://spotify-login-callback',
    URI: 'accounts.spotify.com'
  },
  ROLE: {
    USER: 1,
    ADMIN: 2
  },
  MEDIA_TYPE: {
    TRACK: 1,
    ARTIST: 2,
    ALBUM: 3
  },
  USER_MEDIA_TYPE: {
    TOP_TRACKS_ARTISTS: 1,
    SAVED_TRACKS_ARTIST: 2
  }
}

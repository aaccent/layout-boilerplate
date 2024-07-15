type ThumbnailQuality = 'maxresdefault' | 'sddefault' | 'mqdefault' | 'hqdefault'

export function getVideoThumbnail(videoId: string, quality: ThumbnailQuality = 'maxresdefault') {
    return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`
}

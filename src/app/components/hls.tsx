import Hls from 'hls.js'
import React, { useEffect, useRef } from 'react'

interface HLSPlayerProps {
    src: string
}

const HLSPlayer: React.FC<HLSPlayerProps> = ({ src }) => {
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        const defaultOptions = {

            startLevel: -1,
            licenseXhrSetup: function (xhr: any, url: any) {
                xhr.withCredentials = true // do send cookies
                if (!xhr.readyState) {
                    // Call open to change the method (default is POST) or modify the url
                    xhr.open("GET", url, true)
                    // Append headers after opening
                    xhr.setRequestHeader("Content-Type", "application/octet-stream")
                }
            },
        }
        let hls: Hls | undefined

        const initHls = () => {
            if (Hls.isSupported()) {
                hls = new Hls(defaultOptions)

                hls.loadSource(src)
                hls.attachMedia(videoRef.current!)
                hls.on(Hls.Events.ERROR, function (event, data) {
                    console.log('HLS.js Error:', event, data)
                })
                hls.on(Hls.Events.MANIFEST_PARSED, function () {
                    console.log('HLS.js Manifest Parsed')
                    videoRef.current!.play()
                })
            } else if (videoRef.current!.canPlayType('application/vnd.apple.mpegurl')) {
                videoRef.current!.src = src
                videoRef.current!.addEventListener('loadedmetadata', () => {
                    videoRef.current!.play()
                })
            }
        }

        initHls()

        return () => {
            if (hls) {
                hls.destroy()
            }
        }
    }, [src])

    return <video muted autoPlay ref={videoRef} controls />
}

export default HLSPlayer
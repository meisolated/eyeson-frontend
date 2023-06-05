import Hls from 'hls.js'
import React, { useEffect, useRef, useState } from 'react'
import styles from "./hls.module.css"
interface HLSPlayerProps {
    src: string
}

const HLSPlayer: React.FC<HLSPlayerProps> = ({ src }) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [status, setStatus] = useState<string>("")
    useEffect(() => {
        const defaultOptions = {
            liveBackBufferLength: 1,
            startLevel: -1,
            licenseXhrSetup: function (xhr: any, url: any) {
                xhr.withCredentials = true // do send cookies
                if (!xhr.readyState) {
                    xhr.open("GET", url, true)
                    xhr.setRequestHeader("Content-Type", "application/octet-stream")
                }
            },
        }
        let hls: Hls | undefined

        const initHls = () => {
            const video = videoRef.current!
            video.removeAttribute("controls")
            video.autoplay = true
            video.muted = true
            if (Hls.isSupported()) {
                hls = new Hls(defaultOptions)
                hls.loadSource(src)
                hls.attachMedia(video)
                hls.on(Hls.Events.ERROR, function (event: any, data) {
                    console.log('HLS.js Error:', event, data)
                    setStatus("error")
                })
                hls.on(Hls.Events.MANIFEST_PARSED, function () {
                    console.log('HLS.js Manifest Parsed')
                    video.play()
                })
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.removeAttribute("controls")
                video.setAttribute("webkit-playsinline", "")
                video.setAttribute("playsinline", "")
                video.setAttribute("x-webkit-airplay", "allow")
                video.setAttribute("x5-video-player-type", "h5")
                video.setAttribute("x5-video-player-fullscreen", "false")
                video.setAttribute("x5-video-orientation", "portraint")
                video.setAttribute("autoplay", "")
                video.src = src
                video.addEventListener('loadedmetadata', () => {
                    video.play()
                })
            }

        }


        videoRef.current?.addEventListener("waiting", () => {
            setStatus("waiting")
            console.log("waiting")
        })

        videoRef.current?.addEventListener("playing", () => {
            setStatus("playing")
            console.log("playing")
        })
        videoRef.current?.addEventListener("pause", () => {
            console.log("paused")
            setStatus("paused")
        })

        // a loop if the video is stuck in a "waiting" state
        const loop = setInterval(() => {
            if (videoRef.current?.readyState === 4) {
                console.log("ready")
                videoRef.current?.play()
            }
            else if (videoRef.current?.readyState === 0) {
                console.log("init")
                initHls()
            }
            else if (videoRef.current?.paused) {
                console.log(videoRef.current?.readyState)
                console.log("paused")
                videoRef.current?.play()
            }
        }, 1000)

        initHls()

        return () => {
            if (hls) {
                hls.destroy()
            }
        }
    }, [src])
    return <div><video ref={videoRef} className={styles.video} controls={true} />
        <div>{status}</div>
    </div>
}

export default HLSPlayer
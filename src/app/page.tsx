"use client"
import Hls from 'hls.js'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import HLSPlayer from './components/hls'
import styles from './page.module.css'
export default function Home() {
  const src = "http://10.69.69.132:3001/hls/playlist.m3u8"

  return (
    <div>
      <div>
        <h1>Stream Page</h1>
        <HLSPlayer src={src} />
      </div>
    </div>
  )
}

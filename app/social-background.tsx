"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import "./social-background.css";

export default function SocialBackground({
  kind,
  quiet,
}: {
  kind: "youtube" | "instagram";
  quiet: boolean;
}) {
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [origin, setOrigin] = useState("");
  const host = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const sendCommand = (func: string, args: unknown[] = []) =>
    frame.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args }),
      "https://www.youtube-nocookie.com",
    );
  const disableCaptions = () => sendCommand("unloadModule", ["captions"]);
  const running = visible && !paused && !quiet && !reduced && !hidden;
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);

    const visibility = () => setHidden(document.hidden);
    visibility();
    document.addEventListener("visibilitychange", visibility);
    const observer = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting);
        if (e.isIntersecting) {
          setOrigin(window.location.origin);
          setLoaded(true);
        }
      },
      { threshold: 0.15 },
    );
    if (host.current) observer.observe(host.current);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  useEffect(() => {
    if (kind !== "youtube") return;
    const receive = (event: MessageEvent) => {
      if (
        event.origin !== "https://www.youtube-nocookie.com" ||
        event.source !== frame.current?.contentWindow
      )
        return;
      let data;
      try {
        data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
      } catch {
        return;
      }
      if (
        data?.event === "onReady" ||
        data?.event === "onApiChange" ||
        data?.event === "onStateChange"
      ) {
        frame.current?.contentWindow?.postMessage(
          JSON.stringify({
            event: "command",
            func: "unloadModule",
            args: ["captions"],
          }),
          event.origin,
        );
      }
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [kind]);
  useEffect(() => {
    if (kind === "instagram" && video.current) {
      if (running) {
        video.current.muted = true;
        video.current.play().catch(() => {});
      } else video.current.pause();
    }
    if (kind === "youtube" && frame.current) {
      frame.current.contentWindow?.postMessage(
        JSON.stringify({
          event: "command",
          func: running ? "playVideo" : "pauseVideo",
          args: [],
        }),
        "https://www.youtube-nocookie.com",
      );
    }
  }, [running, kind, loaded]);
  const poster =
    kind === "youtube"
      ? "/media/youtube-poster.jpg"
      : "/media/instagram-amv.jpg";
  return (
    <>
      <div
        ref={host}
        className={`social-background ${kind}-background`}
        aria-hidden="true"
      >
        <img src={poster} alt="" width="640" height="480" loading="lazy" />
        {kind === "instagram" && loaded ? (
          <video
            ref={video}
            src="/media/instagram-amv.mp4"
            poster={poster}
            muted
            loop
            playsInline
            preload="metadata"
            tabIndex={-1}
          />
        ) : null}
        {kind === "youtube" && loaded && visible && !quiet && !reduced ? (
          <iframe
            ref={frame}
            title="Vidéo YouTube en arrière-plan"
            src={`https://www.youtube-nocookie.com/embed/-bSc6pG7njA?autoplay=${paused ? 0 : 1}&mute=1&loop=1&playlist=-bSc6pG7njA&controls=0&cc_load_policy=0&playsinline=1&disablekb=1&enablejsapi=1&origin=${encodeURIComponent(origin)}`}
            allow="autoplay; encrypted-media"
            referrerPolicy="strict-origin-when-cross-origin"
            tabIndex={-1}
            onLoad={() => {
              frame.current?.contentWindow?.postMessage(
                JSON.stringify({ event: "listening", id: "cv-youtube" }),
                "https://www.youtube-nocookie.com",
              );
              for (const event of ["onReady", "onApiChange", "onStateChange"])
                sendCommand("addEventListener", [event]);
              disableCaptions();
              if (!running)
                frame.current?.contentWindow?.postMessage(
                  JSON.stringify({
                    event: "command",
                    func: "pauseVideo",
                    args: [],
                  }),
                  "https://www.youtube-nocookie.com",
                );
            }}
          />
        ) : null}
        <div className="social-shade" />
      </div>
      <button
        className="background-control"
        onClick={() => setPaused(!paused)}
        disabled={quiet || reduced}
        aria-label={
          quiet || reduced
            ? "Animation désactivée"
            : paused
              ? "Lire la vidéo en fond"
              : "Mettre en pause la vidéo en fond"
        }
      >
        {paused ? "▷" : "Ⅱ"}
        <span>
          {quiet || reduced ? "IMAGE FIXE" : paused ? "LIRE" : "PAUSE"}
        </span>
      </button>
    </>
  );
}

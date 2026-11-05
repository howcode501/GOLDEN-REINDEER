import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import html from "./body.html?raw";
import "./landing.css";

const SCRIPTS = [
  "/landing/vendor/three.min.js",
  "/landing/js/reindeer.js",
  "/landing/js/site.js",
];

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const added: HTMLScriptElement[] = [];

    const load = (src: string) =>
      new Promise<void>((resolve, reject) => {
        // don't re-download three.js if already in global scope
        if (src.includes("three") && (window as any).THREE) return resolve();
        const s = document.createElement("script");
        s.src = `${src}?v=${Date.now()}`;
        s.onload = () => resolve();
        s.onerror = (e) => {
          console.error("Failed loading script:", src, e);
          reject(e);
        };
        document.body.appendChild(s);
        added.push(s);
      });

    (async () => {
      for (const src of SCRIPTS) {
        if (cancelled) return;
        try {
          await load(src);
        } catch (err) {
          console.error("Error loading", src, err);
        }
      }
    })();

    return () => {
      cancelled = true;
      const gr = (window as any).GoldenReindeer;
      if (gr) {
        if (gr.glRaf) {
          cancelAnimationFrame(gr.glRaf);
        }
        if (gr.gl?.dispose) {
          gr.gl.dispose();
        }
        gr.gl = null;
        gr.glCanvas = null;
      }
      added.forEach((s) => s.remove());
    };
  }, []);

  const onClick = (e: React.MouseEvent) => {
    const a = (e.target as HTMLElement).closest("a");
    const href = a?.getAttribute("href");
    const routes: Record<string, string> = {
      "#login": "/login",
      "#demo": "/book-demo",
      "#report": "/report",
      "#app": "/app",
    };
    if (href && routes[href]) {
      e.preventDefault();
      navigate(routes[href]);
    }
  };

  return <div onClick={onClick} dangerouslySetInnerHTML={{ __html: html }} />;
}

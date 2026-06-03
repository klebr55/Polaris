import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Polaris — O Abismo Digital de Mato Grosso",
    short_name: "Polaris",
    description: "Um dossiê interativo sobre a exclusão digital em Mato Grosso durante e pós-pandemia.",
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#22D3EE",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}

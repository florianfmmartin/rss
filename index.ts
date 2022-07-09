import { serve } from "https://deno.land/std@0.142.0/http/server.ts";
import { parseFeed } from "https://deno.land/x/rss/mod.ts";

const state = {
  urls: [
    "https://hnrss.org/best",
    "https://journal.miso.town/atom?url=https://wiki.xxiivv.com/site/now.html",
  ],
};

const getRSSFeeds = async (urls: string[]) => {
  const responses = await Promise.all(urls.map((url) => fetch(url)));
  const texts = await Promise.all(responses.map((response) => response.text()));
  const feeds = await Promise.all(texts.map((text) => parseFeed(text)));
  return feeds;
};

serve(
  async (req: Request) =>
    new Response(JSON.stringify(await getRSSFeeds(state.urls)), {
      headers: { "Content-Type": "application/json" },
    })
);

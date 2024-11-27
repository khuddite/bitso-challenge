import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("https://api.coingecko.com/api/v3/simple/price", ({ request }) => {
    const url = new URL(request.url);

    const ids = url.searchParams.get("ids");
    const vsCurrencies = url.searchParams.get("vs_currencies");

    if (ids === "ethereum" && vsCurrencies === "usd") {
      return HttpResponse.json({
        ethereum: { usd: 3500 },
      });
    } else {
      HttpResponse.json({ error: "Invalid query params" }, { status: 400 });
    }
  }),
];

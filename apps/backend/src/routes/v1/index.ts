import { Router } from "express";
import authRoutes from "../../modules/auth/auth.routes.js";
import userRoutes from "../../modules/user/user.routes.js";
import newsRoutes from "../../modules/news/news.routes.js";
import watchlistRoutes from "../../modules/watchlist/watchlist.routes.js";
import watchlistCoinRoutes from "../../modules/watchlist-coin/watchlist-coin.routes.js";
import trendingRoutes from "../../modules/trending/trending.routes.js";
import globalMarketRoutes from "../../modules/global-market/global-market.routes.js";
import coinsRoutes from "../../modules/coins/coins.routes.js";
import searchRoutes from "../../modules/search/search.routes.js";
import marketChartRoutes from "../../modules/market-chart/market-chart.routes.js";
import aiRoutes from "../../modules/ai/ai.routes.js";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/users", userRoutes);
routes.use("/news", newsRoutes);
routes.use("/coins", coinsRoutes);
routes.use("/trending", trendingRoutes);
routes.use("/global-market", globalMarketRoutes);
routes.use("/search", searchRoutes);
routes.use("/market-chart", marketChartRoutes);
routes.use("/watchlists", watchlistRoutes);
routes.use("/watchlistCoins", watchlistCoinRoutes);
routes.use("/ai", aiRoutes);

export default routes;

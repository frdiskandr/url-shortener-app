import express from "express"
import { getShorteners } from "./handler.js";
import { ErrorResponse } from "../../shared/Errors/ErrorResponse.js";
import { ShortenerDto } from "./dto.js";
import createError from 'http-errors';
import { DeleteRedis, GetRedis, SetRedis } from "../../shared/lib/redis-connection.js";
import { AnaliticUrl } from "../../shared/utils/analiticUrl.js";

const normalizeTargetUrl = (value) => {
  if (!value) return value;

  const trimmedValue = value.trim();
  if (!trimmedValue) return trimmedValue;

  if (/^https?:\/\//i.test(trimmedValue)) {
    return trimmedValue;
  }

  return `https://${trimmedValue}`;
};

export const ShortenerRouter = express.Router();

ShortenerRouter.get("/all", getShorteners);

ShortenerRouter.post("/shorted", async (req, res, next) => {
  try {
    const { url, shorted_url, user_id } = req.body;
    if (!url || !shorted_url || !user_id) {
      throw new ErrorResponse(400, "need url | shorted_url | user_id!!")
    }

    const shoredUrl = await ShortenerDto.getOriginUrl(shorted_url);
    if (shoredUrl.rowCount > 0) {
      await ShortenerDto.up
    }

    const normalizedUrl = normalizeTargetUrl(url);
    const result = await ShortenerDto.Insert(normalizedUrl, shorted_url, user_id)
    res.json({
      message: "success",
      data: result
    })
  } catch (error) {
    next(error)
  }
})

ShortenerRouter.get("/:url", async (req, res, next) => {
  try {
    const { url } = req.params;
    const getUrlFromRedis = await GetRedis(String(url));
    console.log("redis url  ", getUrlFromRedis)

    let originalUrl;
    if (!getUrlFromRedis || getUrlFromRedis == null) {
      const checkUrl = await ShortenerDto.getOriginUrl(url)
      if (checkUrl.rowCount < 1) {
        next(createError(404));
      }
      originalUrl = checkUrl.rows[0].original_url
      await SetRedis(url, String(originalUrl));
    } else {
      originalUrl = getUrlFromRedis;
    }
    req.originalUrl = originalUrl;

    await AnaliticUrl(req)

    const targetUrl = normalizeTargetUrl(originalUrl);
    res.json(targetUrl)
  } catch (error) {
    next(error)
  }
})

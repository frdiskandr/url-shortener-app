import { query } from "../lib/postgres-connection.js";
import { logger } from "./logger.js";

export const AnaliticUrl = async (req) => {
  const ipAddress = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('user-agent');
  // Referrer (asal request dari mana)
  const referrer = req.get('referrer') || req.get('referer') || 'direct';
  // Waktu request
  const timestamp = new Date();
  // URL yang diminta
  const url = req.originalUrl;
  // HTTP Method
  const method = req.method;
  // Protocol (http atau https)
  const protocol = req.protocol;
  // Hostname
  const hostname = req.hostname;

  try {
    const q = "INSERT INTO RequestLogs (ipAddress, userAgent, referrer, timeReq, protocol, hostname, url, method) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)"
    await query(q, [ipAddress, userAgent, referrer, timestamp, protocol, hostname, url, method]);

  } catch (error) {
    logger.error("failed to store analitic to database", error)
  }
}

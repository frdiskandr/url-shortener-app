import { query } from "../../shared/lib/postgres-connection.js"
import { DeleteRedis, GetRedis, SetRedis } from "../../shared/lib/redis-connection.js"

export class ShortenerDto {
  static async getsByUsername(userID) {
    const Redis = await GetRedis(String(userID));
    if(!Redis){
      const q = "SELECT * FROM shorter_url s join users u on s.user_ID = u.ID where u.ID = $1 order by s.created_at asc"
      const listShorted = await query(q, [userID])
      await SetRedis(String(userID), JSON.stringify(listShorted));
      return listShorted
    }

    return JSON.parse(Redis);
  }

  static async getOriginUrl(ShortedUrl) {
    const q = "SELECT * from shorter_url  where shorter_url = $1"
    const originalUrl = await query(q, [ShortedUrl]);
    return originalUrl
  }

  static async Insert(originalUrl, shorted_url, userID){
    await DeleteRedis(String(userID));

    const shorted = await query("select * from shorter_url s where s.shorter_url = $1", [shorted_url]);
    if(shorted.rowCount > 0){
      const update = await query("update shorter_url  set original_url = $1 where shorter_url = $2", [originalUrl, shorted_url])
      return update
    }
    const result = await query("insert into shorter_url(user_ID, original_url, shorter_url) values ($1, $2 , $3)", [userID, originalUrl, shorted_url]);
    return result
  }

  static async DeleteByShortedUrl(shorted_url){
    const result = await query("delete from shorter_url s where s.shorter_url = $1", [shorted_url]);
    return result
  }
}
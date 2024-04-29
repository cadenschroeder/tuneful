package edu.brown.cs.student.main.server;

import static spark.Spark.after;

import com.google.common.cache.CacheBuilder;
import edu.brown.cs.student.main.csv.ParserState;
import edu.brown.cs.student.main.server.broadband.SpotifySource;
import edu.brown.cs.student.main.server.handlers.RecommendationHandler;
import edu.brown.cs.student.main.server.handlers.SongDataHandler;
import java.util.concurrent.TimeUnit;
import spark.Spark;

/**
 * Main class for initializing a server. Includes 4 endpoints: /broadband, /loadcsv, /viewcsv,
 * /searchcsv Run Server main to start and initialize server.
 */
public class Server {
  public static void main(String[] args) {
    int port = 3232;
    Spark.port(port);

    after(
        (request, response) -> {
          response.header("Access-Control-Allow-Origin", "*");
          response.header("Access-Control-Allow-Methods", "*");
        });

    // ParserState saves a given parser to use among loadcsv, viewcsv, searchcsv endpoints
    ParserState parser = new ParserState();
    CacheBuilder<Object, Object> cacheBuilder =
        CacheBuilder.newBuilder().expireAfterWrite(30, TimeUnit.SECONDS);

    // Setting up the handler for the GET /loadcsv, /viewcsv, /searchcsv, /broadband
    SpotifySource spotifySource = new SpotifySource();
    Spark.get("songData", new SongDataHandler(spotifySource));
    Spark.get("recommendation", new RecommendationHandler(spotifySource));
    // Spark.get("loadcsv", new LoadCSVHandler(parser));
    // Spark.get("viewcsv", new ViewCSVHandler(parser));
    // Spark.get("searchcsv", new SearchCSVHandler(parser));
    Spark.init();
    Spark.awaitInitialization();

    System.out.println("Server started at http://localhost:" + port);
  }
}

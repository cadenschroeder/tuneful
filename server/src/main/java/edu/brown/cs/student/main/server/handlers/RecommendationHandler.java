package edu.brown.cs.student.main.server.handlers;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;

import edu.brown.cs.student.main.server.broadband.MusicSource;
import edu.brown.cs.student.main.server.storage.StorageInterface;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

public class RecommendationHandler implements Route {
  private MusicSource datasource;
  private StorageInterface storageHandler;

  public RecommendationHandler(MusicSource datasource, StorageInterface storageHandler) { // also pass in algorithm class
    this.datasource = datasource;
    this.storageHandler = storageHandler;
  }

  @Override
  public Object handle(Request request, Response response) throws Exception {
    String liked = request.queryParams("liked");
    String songs = request.queryParams("songID"); // array of songs
    String first = request.queryParams("first"); // indicates if it is the first time called or not
    String uid = request.queryParams("uid");

    if (liked == null || songs == null) {
      return new RecommendationHandler.RecommendationFailureResponse(
              "Missing one or more parameters")
          .serialize();
    }
    if (liked.isEmpty() || songs.isEmpty()) {
      return new RecommendationHandler.RecommendationFailureResponse("Empty parameter(s)")
          .serialize();
    }

    // Creates a hashmap to store the results of the request
    Map<String, Object> responseMap = new HashMap<>();

    boolean likedBool = false;
    boolean firstBool = false;

    // convert liked and first into booleans
    if (liked.equals("true")){
      likedBool = true;
    } else if (liked.equals("false")){
      likedBool = false;
    } else {
      return new RecommendationHandler.RecommendationFailureResponse(
              "Unexpected parameter value for liked")
          .serialize();
    }

    if (first.equals("true")){
      firstBool = true;
    } else if (first.equals("false")){
      firstBool = false;
    } else {
      return new RecommendationHandler.RecommendationFailureResponse(
              "Unexpected parameter value for first")
          .serialize();
    }

    // deserialize the songs list
    List<Map<String, Object>> songList = deserializeTracks(songs);

    // create session stats if first time call
    if (firstBool){
      this.storageHandler.addDocument(uid, "stats", "session", responseMap);
    }

    // add params to run algorithm

    // mocked map for now :

    Map<String, String> params = new HashMap<>();
    params.put("seed_genres", "classical%2Ccountry");
    // params.put("seed_artists", "4NHQUGzhtTLFvgF5SZesLK");
    // params.put("seed_tracks", "0c6xIDDpzE81m2q797ordA");
    // params.put("target_acousticness", "0.5");
    params.put("limit", "5");

    List<String> songIDs = this.datasource.getRecommendation(params);
    System.out.println(songIDs);
    responseMap.put("songIDs", songIDs);
    return new RecommendationHandler.RecommendationSuccessResponse(responseMap).serialize();
  }

  public static List<Map<String, Object>> deserializeTracks(String jsonSongList) throws IOException {
    // Initializes Moshi
    Moshi moshi = new Moshi.Builder().build();

    // Initializes an adapter to a Broadband class then uses it to parse the JSON.
    JsonAdapter<List<Map<String, Object>>> adapter =
        moshi.adapter(Types.newParameterizedType(Map.class, String.class, Object.class, List.class));

    List<Map<String, Object>> trackList = adapter.fromJson(jsonSongList);

    return trackList;
  }

  /**
   * Record that represents a succesful response. Returned to querier in handle(). Stores a response
   * map and has serializing capabilities
   *
   * @param response_type
   * @param responseMap
   */
  public record RecommendationSuccessResponse(
      String response_type, Map<String, Object> responseMap) {
    public RecommendationSuccessResponse(Map<String, Object> responseMap) {
      this("success", responseMap);
    }
    /**
     * @return this response, serialized as Json
     */
    String serialize() {
      try {
        Moshi moshi = new Moshi.Builder().build();
        JsonAdapter<RecommendationHandler.RecommendationSuccessResponse> adapter =
            moshi.adapter(RecommendationHandler.RecommendationSuccessResponse.class);
        return adapter.toJson(this);
      } catch (Exception e) {
        e.printStackTrace();
        throw e;
      }
    }
  }

  /**
   * Response object that is returned when an error arises in fetching data
   *
   * @param response_type set as error
   * @param error_message
   */
  public record RecommendationFailureResponse(String response_type, String error_message) {
    public RecommendationFailureResponse(String errorMessage) {
      this("error", errorMessage);
    }

    /**
     * @return this response, serialized as Json
     */
    String serialize() {
      Moshi moshi = new Moshi.Builder().build();
      return moshi.adapter(RecommendationHandler.RecommendationFailureResponse.class).toJson(this);
    }
  }
}

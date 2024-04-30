package edu.brown.cs.student.main.server.handlers;

import com.google.cloud.firestore.FieldValue;
import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import edu.brown.cs.student.main.server.broadband.MusicSource;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import edu.brown.cs.student.main.server.broadband.SongData;
import edu.brown.cs.student.main.server.storage.StorageInterface;
import spark.Request;
import spark.Response;
import spark.Route;

public class RecommendationHandler implements Route {
  private MusicSource datasource;
  private StorageInterface storageHandler;

  public RecommendationHandler(MusicSource datasource, StorageInterface storageHandler) {
    // also pass in algorithm class
    this.datasource = datasource;
    this.storageHandler = storageHandler;
  }

  @Override
  public Object handle(Request request, Response response) throws Exception {
    String liked = request.queryParams("liked");
    String lastSongID = request.queryParams("songID");
    String uid = request.queryParams("uid");

    if (liked == null || lastSongID == null || uid == null) {
      return new RecommendationHandler.RecommendationFailureResponse(
              "Missing one or more parameters")
          .serialize();
    }
    if (liked.isEmpty() || lastSongID.isEmpty() || uid.isEmpty()) {
      return new RecommendationHandler.RecommendationFailureResponse("Empty parameter(s)")
          .serialize();
    }

    // Creates a hashmap to store the results of the request
    Map<String, Object> responseMap = new HashMap<>();

    // add params to run algorithm

    // mocked map for now :

    Map<String, String> params = new HashMap<>();
    params.put("seed_genres", "new-release%2Cpop");
    // params.put("seed_artists", "4NHQUGzhtTLFvgF5SZesLK");
    // params.put("seed_tracks", "0c6xIDDpzE81m2q797ordA");
    // params.put("target_acousticness", "0.5");
    params.put("limit", "5");

    List<Map<String,Object>> songs = new ArrayList<>();

    int tries = 0;
    while(songs.isEmpty()){
      songs = this.datasource.getRecommendation(params, uid);
      tries++;
      if(tries > 5){
        return new RecommendationHandler.RecommendationFailureResponse("Could not fetch more recommendations. Attempts exceeded").serialize();
      }
    }

    responseMap.put("songs", songs);

    try {
      Map<String, Object> firebaseData = new HashMap<>();

      for(Map<String,Object> song : songs){
        //TODO : Make session based
        firebaseData.put("song", song);
        // use the storage handler to add the document to the database
        this.storageHandler.addDocument(uid, "songs", song.get("trackID").toString(), firebaseData);
      }
      // TODO: what to do with incognito users?? can we have a designated user id for them that gets cleared?
    } catch(Exception e){
      //TODO take out
      e.printStackTrace();
      return new RecommendationHandler.RecommendationFailureResponse(e.getMessage()).serialize();
    }


    return new RecommendationHandler.RecommendationSuccessResponse(responseMap).serialize();
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

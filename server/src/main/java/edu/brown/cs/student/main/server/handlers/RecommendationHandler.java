package edu.brown.cs.student.main.server.handlers;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import edu.brown.cs.student.main.server.broadband.MusicSource;
import spark.Request;
import spark.Response;
import spark.Route;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RecommendationHandler implements Route {
  private MusicSource datasource;
  public RecommendationHandler(MusicSource datasource) { //also pass in algorithm class
    this.datasource = datasource;
  }

  @Override
  public Object handle(Request request, Response response) throws Exception {
    String liked = request.queryParams("liked");
    String songID = request.queryParams("songID");

    if (liked == null || songID == null) {
      return new RecommendationHandler.RecommendationFailureResponse("Missing one or more parameters").serialize();
    }
    if (liked.isEmpty() || songID.isEmpty()) {
      return new RecommendationHandler.RecommendationFailureResponse("Empty parameter(s)").serialize();
    }

    // Creates a hashmap to store the results of the request
    Map<String, Object> responseMap = new HashMap<>();

    //add params to run algorithm
    //mocked map for now :

    Map<String,String> params = new HashMap<>();
    params.put("seed_genres", "classical%2Ccountry");
    params.put("seed_artists", "4NHQUGzhtTLFvgF5SZesLK");
    params.put("seed_tracks", "0c6xIDDpzE81m2q797ordA");
    params.put("limit", "5");


    List<String> songIDs = this.datasource.getRecommendation(params);
    System.out.println(songIDs);
    responseMap.put("songIDs", songIDs);
    return new RecommendationHandler.RecommendationSuccessResponse(responseMap).serialize();
  }

  /**
   * Record that represents a succesful response. Returned to querier in handle(). Stores a response
   * map and has serializing capabilities
   *
   * @param response_type
   * @param responseMap
   */
  public record RecommendationSuccessResponse(String response_type, Map<String, Object> responseMap) {
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

package edu.brown.cs.student.main.server.handlers;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import edu.brown.cs.student.main.server.broadband.MusicSource;
import edu.brown.cs.student.main.server.broadband.SongData;
import java.util.HashMap;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

public class SongDataHandler implements Route {
  private MusicSource datasource;

  public SongDataHandler(MusicSource datasource) {
    this.datasource = datasource;
  }

  @Override
  public Object handle(Request request, Response response) throws Exception {
    String trackID = request.queryParams("trackID");

    if (trackID == null) {
      return new SongDataFailureResponse("Missing one or more parameters").serialize();
    }
    if (trackID.isEmpty()) {
      return new SongDataFailureResponse("Empty parameter(s)").serialize();
    }

    // Creates a hashmap to store the results of the request
    Map<String, Object> responseMap = new HashMap<>();
    try {
      // get the track data
      SongData data = this.datasource.getSongData(trackID);

      // Adds results to the responseMap
      responseMap.put("songData", data);

      return new SongDataHandler.SongDataSuccessResponse(responseMap).serialize();
    } catch (Exception e) {
      return new SongDataFailureResponse(e.getMessage()).serialize();
    }
  }

  /**
   * Record that represents a succesful response. Returned to querier in handle(). Stores a response
   * map and has serializing capabilities
   *
   * @param response_type
   * @param responseMap
   */
  public record SongDataSuccessResponse(String response_type, Map<String, Object> responseMap) {
    public SongDataSuccessResponse(Map<String, Object> responseMap) {
      this("success", responseMap);
    }
    /**
     * @return this response, serialized as Json
     */
    String serialize() {
      try {
        Moshi moshi = new Moshi.Builder().build();
        JsonAdapter<SongDataHandler.SongDataSuccessResponse> adapter =
            moshi.adapter(SongDataHandler.SongDataSuccessResponse.class);
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
  public record SongDataFailureResponse(String response_type, String error_message) {
    public SongDataFailureResponse(String errorMessage) {
      this("error", errorMessage);
    }

    /**
     * @return this response, serialized as Json
     */
    String serialize() {
      Moshi moshi = new Moshi.Builder().build();
      return moshi.adapter(SongDataHandler.SongDataFailureResponse.class).toJson(this);
    }
  }
}

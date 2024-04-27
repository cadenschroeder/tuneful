package edu.brown.cs.student.main.server.handlers;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import edu.brown.cs.student.main.server.broadband.MusicSource;
import edu.brown.cs.student.main.server.broadband.SongData;
import java.util.HashMap;
import java.util.Map;

import edu.brown.cs.student.main.server.storage.StorageInterface;
import spark.Request;
import spark.Response;
import spark.Route;

public class SongDataHandler implements Route {
  private MusicSource datasource;
  private StorageInterface storageHandler;

  public SongDataHandler(MusicSource datasource, StorageInterface storageHandler) {
    this.datasource = datasource;
    this.storageHandler = storageHandler;
  }

  @Override
  public Object handle(Request request, Response response) throws Exception {
    String trackID = request.queryParams("trackID");
    String uid = request.queryParams("uid");

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
      Map<String, Object> firebaseData = new HashMap<>();
      firebaseData.put("songData", data.toMap());

      // TODO: what to do with incognito users?? can we have a designated user id for them that gets cleared?
      int songCount = this.storageHandler.getCollection(uid, "songs").size();
      String songID = "song-" + songCount;
      // use the storage handler to add the document to the database
      this.storageHandler.addDocument(uid, "songs", songID, firebaseData);


      return new SongDataHandler.SongDataSuccessResponse(responseMap).serialize();
    } catch (Exception e) {
      e.printStackTrace();
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

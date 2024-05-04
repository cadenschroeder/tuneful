package edu.brown.cs.student.main.server.handlers;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import edu.brown.cs.student.main.server.storage.StorageInterface;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

public class ViewSongHandler implements Route {

  private StorageInterface storageHandler;
  private int songsIndex;

  public ViewSongHandler(StorageInterface storageHandler) {

    this.storageHandler = storageHandler;
  }

  @Override
  public Object handle(Request request, Response response) throws Exception {
    Map<String, Object> responseMap = new HashMap<>();
    try {
      String uid = request.queryParams("uid");
      // boolean to ask for eiher just new songs or all the songs
      String isAllSongs = request.queryParams("isAllSongs");
      boolean boolAllSongs;

      // Error checking
      if (uid == null || isAllSongs == null) {
        return new ViewSongHandler.ViewSongFailureResponse("Missing one or more parameters")
            .serialize();
      }
      if (uid.isEmpty() || isAllSongs.isEmpty()) {
        return new ViewSongHandler.ViewSongFailureResponse("Empty parameter(s)").serialize();
      }
      if (isAllSongs.equalsIgnoreCase("true")) {
        boolAllSongs = true;
      } else if (isAllSongs.equalsIgnoreCase("false")) {
        boolAllSongs = false;
      } else {
        return new ViewSongHandler.ViewSongFailureResponse(
                "isAllSongs parameter must be either 'true' or 'false'")
            .serialize();
      }


      //get all songs for user
      List<Map<String, Object>> vals = this.storageHandler.getCollection(uid, "songs", true);
      List<Object> songs = vals.stream().map(song -> song.get("song")).toList();
      // convert to a songData
      //      System.out.println(songs);
      //      System.out.println(songs.get(0).getClass());
      // System.out.println((vals.stream().map(song -> song.get("songData").getClass())));



    if (!boolAllSongs){
      // TODO: make this songsIndex stored in firebase so its user specific

      int songsIndex = 0;
      List<Map<String, Object>> collection = this.storageHandler.getCollection(uid, "songsIndex", false);
      if(!collection.isEmpty()){
        songsIndex = ((Long) collection.get(0).get("index")).intValue();;
      }
      List<Object> sublist = songs.subList(songsIndex, songs.size());
      // TODO: should this error happen before or after the songsIndex gets updated?
      if (sublist.isEmpty()) {
        return new ViewSongHandler.ViewSongFailureResponse("No new songs found").serialize();
      }
      Map<String, Object> newIndex = new HashMap<>();
      newIndex.put("index", songs.size());
      this.storageHandler.addDocument(uid, "songsIndex", "index", newIndex);

      //return the sub list
      responseMap.put("response_type", "success");
      responseMap.put("songs", sublist);
      return new ViewSongSuccessResponse(responseMap).serialize();
    }

      responseMap.put("response_type", "success");
      responseMap.put("songs", songs);
      return new ViewSongSuccessResponse(responseMap).serialize();
    } catch (Exception e) {
      // error likely occurred in the storage handler
      return new ViewSongFailureResponse(e.getMessage()).serialize();
    }
  }

  /**
   * Record that represents a succesful response. Returned to querier in handle(). Stores a response
   * map and has serializing capabilities
   *
   * @param response_type
   * @param responseMap
   */
  public record ViewSongSuccessResponse(String response_type, Map<String, Object> responseMap) {
    public ViewSongSuccessResponse(Map<String, Object> responseMap) {
      this("success", responseMap);
    }
    /**
     * @return this response, serialized as Json
     */
    String serialize() {
      try {
        Moshi moshi = new Moshi.Builder().build();
        JsonAdapter<ViewSongHandler.ViewSongSuccessResponse> adapter =
            moshi.adapter(ViewSongHandler.ViewSongSuccessResponse.class);
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
  public record ViewSongFailureResponse(String response_type, String error_message) {
    public ViewSongFailureResponse(String errorMessage) {
      this("error", errorMessage);
    }

    /**
     * @return this response, serialized as Json
     */
    String serialize() {
      Moshi moshi = new Moshi.Builder().build();
      return moshi.adapter(ViewSongHandler.ViewSongFailureResponse.class).toJson(this);
    }
  }
}

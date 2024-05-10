package edu.brown.cs.student.main.server.handlers;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
import edu.brown.cs.student.main.server.RecommendAlgo;
import edu.brown.cs.student.main.server.broadband.MusicSource;
import edu.brown.cs.student.main.server.storage.StorageInterface;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;
import spark.Request;
import spark.Response;
import spark.Route;

public class RecommendationHandler implements Route {
  private MusicSource datasource;
  private StorageInterface storageHandler;
  private RecommendAlgo algorithm;

  private List<String> lastLikedTracks;

  public RecommendationHandler(
      MusicSource datasource,
      StorageInterface storageHandler,
      RecommendAlgo algorithm) { // also pass in algorithm class
    this.datasource = datasource;
    this.storageHandler = storageHandler;
    this.algorithm = algorithm;
    this.lastLikedTracks = new ArrayList<>();
  }

  @Override
  public Object handle(Request request, Response response) throws Exception {
    try {
      String liked = request.queryParams("liked");
      String trackIDs = request.queryParams("trackIDs"); // array of track ids
      String first = request.queryParams("first"); // indicates if it is the first time called or not
      String uid = request.queryParams("uid");
      String genre = request.queryParams("genre");
      String numSongs = request.queryParams("numSongs");

      if (liked == null
          || trackIDs == null
          || first == null
          || uid == null
          || genre == null
          || numSongs == null) {
        return new RecommendationHandler.RecommendationFailureResponse(
            "Missing one or more parameters")
            .serialize();
      }
      if (liked.isEmpty()
          || trackIDs.isEmpty()
          || first.isEmpty()
          || uid.isEmpty()
          || numSongs.isEmpty()) {
        return new RecommendationHandler.RecommendationFailureResponse("Empty parameter(s)")
            .serialize();
      }

      System.out.println(
          "Rec handler endpoint hit. Params: "
              + liked
              + " | "
              + trackIDs
              + " | "
              + first
              + " | "
              + genre
              + " | "
              + numSongs);

      // Creates a hashmap to store the results of the request
      Map<String, Object> responseMap = new HashMap<>();

      boolean likedBool = false;
      boolean firstBool = false;

      // deserialize the track ids list
      // List<String> idList = deserializeTracks(trackIDs);
      List<String> songIDsList;
      if (trackIDs.equals("[]")) {
        songIDsList = new ArrayList<>();
      } else {
        songIDsList = Arrays.asList(trackIDs.replaceAll("[\\[\\]\"]", "").split(","));
      }

      // beautiful :)
      if (first.equals("true")) {
        firstBool = true;
        // Reset the lastLikedTracks list
        this.lastLikedTracks = new ArrayList<>();
      } else if (first.equals("false")) {
        firstBool = false;
      } else {
        return new RecommendationHandler.RecommendationFailureResponse(
            "Unexpected parameter value for first")
            .serialize();
      }

      // convert liked and first into booleans
      if (liked.equals("true")) {
        likedBool = true;
        // TODO: make in firebase
        // add song to a list of 5 last liked songs to use for seed_tracks
        if (songIDsList.size() > 5) {
          // deque called lastLikedTracks now should have the first five songs from
          // songIDsList
          this.lastLikedTracks = songIDsList.subList(0, 5);
        } else {
          for (String id : songIDsList) {
            // add the id to last likes
            this.lastLikedTracks.add(id);
            // remove the oldest id if greater than 5
            if (this.lastLikedTracks.size() > 5) {
              this.lastLikedTracks.remove(0);
            }
          }
        }

      } else if (liked.equals("false")) {
        likedBool = false;
      } else {
        return new RecommendationHandler.RecommendationFailureResponse(
            "Unexpected parameter value for liked")
            .serialize();
      }

      // convert numSongs to an int
      int numSongsInt;
      try {
        numSongsInt = Integer.parseInt(numSongs);
      } catch (NumberFormatException e) {
        return new RecommendationHandler.RecommendationFailureResponse(
            "Error: numSongs must be in integer form")
            .serialize();
      }

      // create session stats if first time call
      try {
        if (firstBool) {
          this.algorithm.instantiateProfile(songIDsList, uid);
        } else if (!firstBool) {
          this.algorithm.updateProfile(likedBool, songIDsList.get(0), uid);
        }
      } catch (Exception e) {
        System.out.println(e.getMessage());
      }

      // If zero songs requested just we want to just update the attributes and return
      // an empty list
      if (numSongsInt == 0) {
        responseMap.put("songs", new ArrayList<>());
        return new RecommendationHandler.RecommendationSuccessResponse(responseMap).serialize();
      }

      Map<String, String> params;
      if (genre.isEmpty()) {
        // add params to run algorithm
        List<Map<String, Object>> collection = this.storageHandler.getCollection(uid, "attributes", false); // TODO:
        // check
        // false
        Map<String, Object> likes = collection.get(1);

        Map<String, List<Double>> likesCasted = new HashMap<>();
        // nasty cast to Map<String, ArrayList<Double>>
        for (String attribute : likes.keySet()) {
          // for each value
          List<Double> valuesData = (List<Double>) likes.get(attribute);
          likesCasted.put(attribute, valuesData);
        }

        Map<String, Object> dislikes = collection.get(0);

        Map<String, List<Double>> dislikesCasted = new HashMap<>();
        // nasty cast to Map<String, ArrayList<Double>>
        for (String attribute : dislikes.keySet()) {
          // for each value
          List<Double> valuesData = (List<Double>) dislikes.get(attribute);
          dislikesCasted.put(attribute, valuesData);
        }

        // System.out.println("likes casted: " + likesCasted);
        // System.out.println("dislikes casted: " + dislikesCasted);
        Map<String, Map<String, Double>> rankings = this.algorithm.rankAttributes(likesCasted, dislikesCasted);

        params = this.getParams(rankings, numSongsInt);
      } else {
        params = this.getGenreParams(genre, numSongsInt); // TODO: error handle genres
      }
      System.out.println("Spotify params: " + params);

      List<Map<String, Object>> recSongs = new ArrayList<>();

      int tries = 0;
      while (recSongs.isEmpty()) {
        recSongs = this.datasource.getRecommendation(params, uid);

        tries++;
        if (tries > 5) {
          return new RecommendationHandler.RecommendationFailureResponse(
              "Could not fetch more recommendations. Attempts exceeded")
              .serialize();
        }
      }

      responseMap.put("songs", recSongs);

      try {
        Map<String, Object> firebaseData = new HashMap<>();

        for (Map<String, Object> song : recSongs) {
          // TODO : Make session based
          firebaseData.put("song", song);
          firebaseData.put("timestamp", com.google.cloud.Timestamp.now());
          // use the storage handler to add the document to the database
          this.storageHandler.addDocument(
              uid, "songs", song.get("trackID").toString(), firebaseData, true);
        }
        // TODO: what to do with incognito users?? can we have a designated user id for
        // them that
        // gets
        // cleared?
      } catch (Exception e) {
        // TODO take out
        e.printStackTrace();
        return new RecommendationHandler.RecommendationFailureResponse(e.getMessage()).serialize();
      }

      return new RecommendationHandler.RecommendationSuccessResponse(responseMap).serialize();
    } catch (Exception e) {
      e.printStackTrace();

      return new RecommendationHandler.RecommendationFailureResponse(e.getMessage()).serialize();
    }
  }

  public Map<String, String> getParams(
      Map<String, Map<String, Double>> attributeVals, int numSongs) {
    ArrayList<String> topAttributes = new ArrayList<>();

    // create map from the ranking value to the attribute name
    Map<Double, String> rankToAttribute = new HashMap<>();
    // create a priority queue holding all the ranks
    PriorityQueue<Double> rankQueue = new PriorityQueue<>(Comparator.reverseOrder());
    for (String attribute : attributeVals.keySet()) { // for each attribute stored, put its rank value -> name in map
      // find the ranking value
      Double rankVal = attributeVals.get(attribute).get("ranking"); // gets the rank value for the curr attribute
      rankToAttribute.put(rankVal, attribute);
      rankQueue.add(rankVal); // add rank to the queue
    }

    // take three values from queue (highest rank values), find corresponding
    // attribute, add to top
    // attributes list
    for (int i = 0; i < 3; i++) {
      Double currRank = rankQueue.poll();
      String attribute = rankToAttribute.get(currRank);
      topAttributes.add(attribute);
    }

    // make a parameters map for the top attributes
    Map<String, String> params = new HashMap<>();
    // params.put("seed_artists", "4NHQUGzhtTLFvgF5SZesLK");
    // params.put("seed_tracks", "0c6xIDDpzE81m2q797ordA");

    // fetch a larger batch of songs to begin with

    params.put("limit", String.valueOf(numSongs));

    if (this.lastLikedTracks.isEmpty()) {
      // if they haven't liked any songs yet choose from any of these genres
      String seed_genres = "pop%2Cnew-release%2Calternative%2Chip-hop%2country";
      params.put("seed_genres", seed_genres);
    } else {
      String seed_tracks = this.lastLikedTracks.toString().replaceAll("[\\[\\]\"]", "").replace(", ", "%2C");
      params.put("seed_tracks", seed_tracks);
    }

    for (String attribute : topAttributes) {
      params.put("target_" + attribute, attributeVals.get(attribute).get("target").toString());
    }

    return params;
  }

  private Map<String, String> getGenreParams(String genre, int numSongs) {
    Map<String, String> params = new HashMap<>(); // by caden
    params.put("limit", String.valueOf(numSongs));
    params.put("seed_genres", genre.toLowerCase());
    System.out.println("Finding recommendations for genre: " + genre);
    return params;
  }

  public static List<String> deserializeTracks(String jsonSongList) throws IOException {
    // Initializes Moshi
    Moshi moshi = new Moshi.Builder().build();

    // Initializes an adapter to a Broadband class then uses it to parse the JSON.
    JsonAdapter<List<String>> adapter = moshi.adapter(Types.newParameterizedType(String.class, List.class));

    List<String> trackList = adapter.fromJson(jsonSongList);

    return trackList;
  }

  /**
   * Record that represents a succesful response. Returned to querier in handle().
   * Stores a response
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
        JsonAdapter<RecommendationHandler.RecommendationSuccessResponse> adapter = moshi
            .adapter(RecommendationHandler.RecommendationSuccessResponse.class);
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

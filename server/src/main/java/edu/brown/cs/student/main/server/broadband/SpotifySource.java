package edu.brown.cs.student.main.server.broadband;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
import edu.brown.cs.student.main.exception.DatasourceException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.lang.reflect.Type;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import okio.Buffer;

/**
 * SpotifySource Uses the ACS API to get information about broadband coverage in given county, state
 * Takes in params: state, county
 */
public class SpotifySource implements MusicSource {

  private String clientID;
  private String clientSecret;

  /** Map with keys = state names, values = state ids */
  private Map<String, String> states;

  private final Moshi moshi = new Moshi.Builder().build();
  private final Type listType = Types.newParameterizedType(List.class, List.class, String.class);
  private final JsonAdapter<List<List<String>>> listJsonAdapter = this.moshi.adapter(this.listType);

  public SpotifySource() {
    this.clientID = "12f6f43b0e464dd0b0a5e1f6c4a18386";
    this.clientSecret = "ac4ea3fd4d1146e19a9e13ec5a381037";
  }

  private String getAccessToken() throws IOException {
    URL url = new URL("https://accounts.spotify.com/api/token");
    HttpURLConnection httpConn = (HttpURLConnection) url.openConnection();
    httpConn.setRequestMethod("POST");

    httpConn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");

    httpConn.setDoOutput(true);
    OutputStreamWriter writer = new OutputStreamWriter(httpConn.getOutputStream());
    writer.write(
        "grant_type=client_credentials&client_id="
            + this.clientID
            + "&client_secret="
            + this.clientSecret);
    writer.flush();
    writer.close();
    httpConn.getOutputStream().close();

    InputStream responseStream =
        httpConn.getResponseCode() / 100 == 2
            ? httpConn.getInputStream()
            : httpConn.getErrorStream();
    Scanner s = new Scanner(responseStream).useDelimiter("\\A");
    String response = s.hasNext() ? s.next() : "";
    s.close();
    String[] tokens = response.split(":");
    return tokens[1].replace("\"", "");
  }

  /**
   * calls the get track and get audio features Spotify endpoints to build a SongData record
   *
   * @throws IOException
   * @throws DatasourceException
   */
  @Override
  public SongData getSongData(String songID) throws IOException, DatasourceException {
    // List<List<String>> tokenMap = getAccessToken();
    String accessToken = getAccessToken();

    // get Track API call:
    URL url = new URL("https://api.spotify.com/v1/tracks/" + songID + "?market=SE");
    HttpURLConnection httpConn = (HttpURLConnection) url.openConnection();
    httpConn.setRequestMethod("GET");
    httpConn.setRequestProperty("Authorization", "Bearer " + accessToken);
    InputStream responseStream =
        httpConn.getResponseCode() / 100 == 2
            ? httpConn.getInputStream()
            : httpConn.getErrorStream();
    Scanner s = new Scanner(responseStream).useDelimiter("\\A");
    String response = s.hasNext() ? s.next() : "";
    s.close();

    Map<String, Object> track = deserializeTrack(response);
    // TODO: Add null checks to values below:
    String snippetURL = track.get("preview_url").toString();
    String explicit = track.get("explicit").toString();
    Map<String, Object> albumInfo = (Map<String, Object>) track.get("album");
    String albumName = albumInfo.get("name").toString();
    ArrayList<Map<String, Object>> images =
        (ArrayList<Map<String, Object>>) albumInfo.get("images");

    ArrayList<Map<String, Object>> artists =
        (ArrayList<Map<String, Object>>) track.get("artists"); // check this cast
    ArrayList<String> artistNames = new ArrayList<>();
    for (Map<String, Object> artist : artists) {
      artistNames.add(artist.get("name").toString());
    }

    // get features API call
    URL featuresURL = new URL("https://api.spotify.com/v1/audio-features/11dFghVXANMlKmJXsNCbNl");
    HttpURLConnection featuresHttpConn = (HttpURLConnection) featuresURL.openConnection();
    featuresHttpConn.setRequestMethod("GET");
    featuresHttpConn.setRequestProperty("Authorization", "Bearer " + accessToken);
    InputStream featuresResponseStream =
        featuresHttpConn.getResponseCode() / 100 == 2
            ? featuresHttpConn.getInputStream()
            : featuresHttpConn.getErrorStream();
    Scanner featuresS = new Scanner(featuresResponseStream).useDelimiter("\\A");
    String featuresResponse = featuresS.hasNext() ? featuresS.next() : "";
    featuresS.close();

    Map<String, Object> features = deserializeTrack(featuresResponse);
    // TODO: change features map into integers

    return new SongData(snippetURL, explicit, artistNames, albumName, images, features);
  }

  @Override
  public List<String> getRecommendation(HashMap<String, String> inputs)
      throws IOException, DatasourceException {
    // TODO Auto-generated method stub
    URL requestURL = new URL("https", "api.census.gov", "/data/2010/dec/sf1?get=NAME&for=state:*");
    HttpURLConnection clientConnection = connect(requestURL);
    List<List<String>> statesFromJson =
        this.listJsonAdapter.fromJson(new Buffer().readFrom(clientConnection.getInputStream()));
    return new ArrayList<String>();
  }

  public static Map<String, Object> deserializeTrack(String jsonSong) throws IOException {
    // Initializes Moshi
    Moshi moshi = new Moshi.Builder().build();

    // Initializes an adapter to a Broadband class then uses it to parse the JSON.
    JsonAdapter<Map<String, Object>> adapter =
        moshi.adapter(Types.newParameterizedType(Map.class, String.class, Object.class));

    Map<String, Object> track = adapter.fromJson(jsonSong);

    return track;
  }

  public static List<List<String>> deserializeAccessToken(String jsonToken) throws IOException {
    // Initializes Moshi
    Moshi moshi = new Moshi.Builder().build();

    // Initializes an adapter to a Broadband class then uses it to parse the JSON.
    JsonAdapter<List> adapter = moshi.adapter(List.class);
    List<List<String>> accessToken = adapter.fromJson(jsonToken);

    return accessToken;
  }

  // /**
  //  * fetchStateId is a helper function fetch state id and define state name to id map if
  // undefined
  //  *
  //  * @param state is String representation of state name
  //  * @return List of State
  //  * @throws Exception that may occur while fetching from census api, or an exception if state
  // input
  //  *     is not valid
  //  */
  // private String fetchStateId(String state) throws Exception {
  //   // create state map if undefined
  //   if (this.states == null) {
  //     // Endpoint for state ids:
  //     // https://api.census.gov/data/2010/dec/sf1?get=NAME&for=state:*
  //     URL requestURL =
  //         new URL("https", "api.census.gov", "/data/2010/dec/sf1?get=NAME&for=state:*");
  //     HttpURLConnection clientConnection = connect(requestURL);
  //     List<List<String>> statesFromJson =
  //         this.listJsonAdapter.fromJson(new
  // Buffer().readFrom(clientConnection.getInputStream()));
  //     Map<String, String> statesMap = new HashMap<>();
  //     if (statesFromJson != null) {
  //       for (List<String> stateStateId : statesFromJson) {
  //         // skips header
  //         if (!stateStateId.get(0).equals("NAME")) {
  //           statesMap.put(stateStateId.get(0), stateStateId.get(1));
  //         }
  //       }

  //       this.states = statesMap;
  //     }
  //   }

  //   if (this.states == null) {
  //     throw new DatasourceException("There was an issue fetching states. Please re-query.");
  //   }

  //   String stateId = this.states.get(state);
  //   if (stateId == null) {
  //     Map<String, Object> helperFields = new HashMap<>();
  //     List<String> validStates = new ArrayList<>(this.states.keySet());
  //     helperFields.put("valid-states", validStates);
  //     throw new DatasourceException("State input not valid", helperFields);
  //   }

  //   return stateId;
  // }

  // /**
  //  * fetchCountyId is a helper function to get a county id from stateID and countyName
  //  *
  //  * @param stateId is the stateId of the which the county is in
  //  * @param countyName is the String of the county searching for
  //  * @return String representation of county id
  //  * @throws Exception that may occur while fetching from census api, or an exception if county
  //  *     input is not valid
  //  */
  // private String fetchCountyId(String stateId, String countyName) throws Exception {
  //   URL requestURL =
  //       new URL(
  //           "https",
  //           "api.census.gov",
  //           "/data/2010/dec/sf1?get=NAME&for=county:*&in=state:" + stateId);
  //   HttpURLConnection clientConnection = connect(requestURL);
  //   List<List<String>> countiesFromJson =
  //       this.listJsonAdapter.fromJson(new Buffer().readFrom(clientConnection.getInputStream()));
  //   List<String> validCounties = new ArrayList<>();
  //   if (countiesFromJson != null) {
  //     for (List<String> countyCountyId : countiesFromJson) {
  //       if (!countyCountyId.get(0).equals("NAME")) {
  //         validCounties.add(countyCountyId.get(0));
  //         if (countyCountyId.get(0).startsWith(countyName + " County, ")) {
  //           return countyCountyId.get(2);
  //         }
  //       }
  //     }
  //   }

  //   Map<String, Object> helperFields = new HashMap<>();
  //   helperFields.put("valid-counties", validCounties);

  //   throw new DatasourceException("County input not valid", helperFields);
  // }

  // /**
  //  * fetchPercentBroadband is a helper function to get the percent broadband coverage for a
  // specific
  //  * county within a state
  //  *
  //  * @param stateId is the stateId of which the county is in
  //  * @param countyId is the countyID of the county searching for
  //  * @return double the percent broadband coverage
  //  * @throws Exception that may occur while fetching from census api, or an exception if
  //  *     state/county id input is not valid
  //  */
  // private double fetchPercentBroadband(String stateId, String countyId) throws Exception {
  //   URL requestURL =
  //       new URL(
  //           "https",
  //           "api.census.gov",
  //           "/data/2022/acs/acs1/subject?get=NAME,S2801_C01_014E,S2801_C01_001E&for=county:"
  //               + countyId
  //               + "&in=state:"
  //               + stateId);
  //   HttpURLConnection clientConnection = connect(requestURL);

  //   List<List<String>> broadBandResponse =
  //       this.listJsonAdapter.fromJson(new Buffer().readFrom(clientConnection.getInputStream()));
  //   if (broadBandResponse != null && !broadBandResponse.isEmpty()) {
  //     List<String> broadBandResponseRow = broadBandResponse.get(1);
  //     String broadbandHouseholds = broadBandResponseRow.get(1);
  //     String totalHouseholds = broadBandResponseRow.get(2);
  //     // todo: is there better source for this
  //     return 100.0 * Integer.parseInt(broadbandHouseholds) / Integer.parseInt(totalHouseholds);
  //   }

  //   throw new DatasourceException("Failed to fetch broadband coverage data.");
  // }

  // /**
  //  * getBroadBand returns BroadbandData (percent broadband coverage) for a state and county
  //  *
  //  * @param state is String representation of state we are looking for broadband coverage of
  //  * @param county is String representation of county we are looking for broadband coverage of
  //  * @return BroadbandData from ACS API for result
  //  * @throws DatasourceException that may occur while fetching from census api, or an exception
  // if
  //  *     state/county id input is not valid
  //  */
  // // @Override
  // public BroadbandData getBroadBand(String state, String county) throws DatasourceException {
  //   try {
  //     String stateId = this.fetchStateId(state);

  //     String countyId = this.fetchCountyId(stateId, county);

  //     double percentBroadband = this.fetchPercentBroadband(stateId, countyId);

  //     return new BroadbandData(percentBroadband);
  //   } catch (DatasourceException e) {
  //     throw new DatasourceException(e.getMessage(), e.getHelperFields(), e);
  //   } catch (Exception e) {
  //     throw new DatasourceException(e.getMessage(), e);
  //   }
  // }

  /**
   * Private helper method for setting up an HttpURLConnection connection with the provided URL
   *
   * @return an HttpURLConnection with the provided URL
   * @param requestURL the URL which we want to set up a connection to
   * @throws DatasourceException if API connection doesn't result in success
   * @throws IOException so different callers can handle differently if needed.
   */
  private static HttpURLConnection connect(URL requestURL) throws DatasourceException, IOException {
    URLConnection urlConnection = requestURL.openConnection();
    if (!(urlConnection instanceof HttpURLConnection clientConnection))
      throw new DatasourceException("unexpected: result of connection wasn't HTTP");
    clientConnection.connect(); // GET
    if (clientConnection.getResponseCode() != 200)
      throw new DatasourceException(
          "unexpected: API connection not success status " + clientConnection.getResponseMessage());
    return clientConnection;
  }
}
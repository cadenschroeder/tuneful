package edu.brown.cs.student.main.server.broadband;

import edu.brown.cs.student.main.exception.DatasourceException;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;

/** BroadbandSource interface Has function to get broadband data from state and county */
public interface MusicSource {

  /**
   * Takes in the songID, queries the API to get SongData record containing information about the
   * song
   *
   * @param songID
   * @return SongData for the song
   */
  SongData getSongData(String songID) throws IOException, DatasourceException;

  /**
   * Takes in max, min, and target values for all audio features and queries API to get a list of
   * song IDs
   *
   * @param inputs max, min, target, etc. (hashmap for now but we can change it)
   * @return a list of song IDs referring to the songs to be recommended
   */
  List<String> getRecommendation(HashMap<String, String> inputs)
      throws IOException, DatasourceException;

  /**
   * getBroadBand gets the broadband data of county, state
   *
   * @param state is the String representation of a state data is wanted from
   * @param county is the String representation of a county data is wanted from
   * @return BroadbandData, including the double percent coverage of broadband internet in county
   * @throws DatasourceException is any exception from getting the broadband data
   */
  // BroadbandData getBroadBand(String state, String county) throws DatasourceException;

}

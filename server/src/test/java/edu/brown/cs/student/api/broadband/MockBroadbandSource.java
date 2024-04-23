package edu.brown.cs.student.api.broadband;

import edu.brown.cs.student.main.server.broadband.BroadbandData;
import edu.brown.cs.student.main.server.broadband.MusicSource;
import edu.brown.cs.student.main.server.broadband.SongData;
import java.net.MalformedURLException;
import java.util.HashMap;
import java.util.List;

public class MockBroadbandSource implements MusicSource {

  private final double percentBroadband;

  public MockBroadbandSource(double percentBroadband) {
    this.percentBroadband = percentBroadband;
  }

  public BroadbandData getBroadBand(String state, String county) {
    return new BroadbandData(this.percentBroadband);
  }

  @Override
  public SongData getSongData(String songID) throws MalformedURLException {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'getSongData'");
  }

  @Override
  public List<String> getRecommendation(HashMap<String, String> inputs)
      throws MalformedURLException {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'getRecommendation'");
  }
}

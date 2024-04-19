package edu.brown.cs.student.api.broadband;

import edu.brown.cs.student.main.exception.DatasourceException;
import edu.brown.cs.student.main.server.broadband.SpotifySource;
import edu.brown.cs.student.main.server.broadband.BroadbandData;
import org.junit.jupiter.api.Test;
import org.testng.Assert;

public class TestACSBroadbandSource {

  @Test
  public void testACSBroadbandSourceSuccess() {
    SpotifySource source = new SpotifySource();
    try {
      BroadbandData data = source.getBroadBand("California", "Kings");
      Assert.assertNotNull(data);
      double percent = data.percentBroadband();
      Assert.assertTrue(percent >= 0.0);
      Assert.assertTrue(percent <= 100.0);
    } catch (DatasourceException e) {
      Assert.fail();
    }
  }

  @Test
  public void testACSBroadbandSourceNotFound() {
    SpotifySource source = new SpotifySource();
    Assert.expectThrows(DatasourceException.class, () -> source.getBroadBand("", ""));
  }
}

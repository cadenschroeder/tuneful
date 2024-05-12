//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)
//

package edu.brown.cs.student.tuneful;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
import java.io.IOException;
import java.lang.reflect.Type;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import edu.brown.cs.student.main.server.handlers.ViewSongHandler;
import edu.brown.cs.student.main.server.storage.MockedUtilities;
import okio.Buffer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.testng.Assert;
import spark.Spark;

public class TestViewSong {
    private JsonAdapter<Map<String, Object>> adapter;
    private final Type mapStringObject = Types.newParameterizedType(Map.class, new Type[]{String.class, Object.class});

    public TestViewSong() {
    }

    @BeforeAll
    public static void setupOnce() {
        Spark.port(0);
        Logger.getLogger("").setLevel(Level.WARNING);
    }

    @BeforeEach
    public void setup() {
        Spark.get("viewSongs", new ViewSongHandler(new MockedUtilities()));
        Spark.awaitInitialization();
        Moshi moshi = (new Moshi.Builder()).build();
        this.adapter = moshi.adapter(this.mapStringObject);
    }

    @AfterEach
    public void teardown() {
        Spark.unmap("viewSongs");
        Spark.awaitStop();
    }

    private HttpURLConnection tryRequest(String apiCall) throws IOException {
        int var10002 = Spark.port();
        URL requestURL = new URL("http://localhost:" + var10002 + "/" + apiCall);
        HttpURLConnection clientConnection = (HttpURLConnection)requestURL.openConnection();
        clientConnection.setRequestMethod("GET");
        clientConnection.connect();
        return clientConnection;
    }

    @Test
    public void testLoadHandlerBasic() throws IOException {
        //Test one normal call to the backend view songs with mocked data
        HttpURLConnection clientConnection = this.tryRequest("viewSongs?uid=mocked&isAllSongs=false");
        Assert.assertEquals(200, clientConnection.getResponseCode());
        Map<String, Object> response = (Map)this.adapter.fromJson((new Buffer()).readFrom(clientConnection.getInputStream()));

        Assert.assertEquals("success", response.get("response_type"));
        Map<String,Object> responseMap = (Map) response.get("responseMap");
        Assert.assertEquals("[song1Object, song2Object, song3Object, song4Object]", responseMap.get("songs").toString());
        List<String> list = (List<String>) ((Map) response.get("responseMap")).get("songs");
        Assert.assertEquals(4, list.size());

        //test no new songs found after requesting twice in a row
        clientConnection = this.tryRequest("viewSongs?uid=mocked&isAllSongs=false");
        Assert.assertEquals(200, clientConnection.getResponseCode());
        response = (Map)this.adapter.fromJson((new Buffer()).readFrom(clientConnection.getInputStream()));
        System.out.println(response);
        Assert.assertEquals("error", response.get("response_type"));
        Assert.assertEquals("No new songs found", response.get("error_message"));
        clientConnection.disconnect();
    }

}


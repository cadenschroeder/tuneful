package edu.brown.cs.student.main.server.handlers;

import edu.brown.cs.student.main.server.storage.StorageInterface;
import spark.Request;
import spark.Response;
import spark.Route;

import java.util.HashMap;
import java.util.Map;

public class AddLikesHandler implements Route {

    public StorageInterface storageHandler;

    public AddLikesHandler(StorageInterface storageHandler) {
        this.storageHandler = storageHandler;
    }

    /**
     * Invoked when a request is made on this route's corresponding path e.g. '/hello'
     *
     * @param request The request object providing information about the HTTP request
     * @param response The response object providing functionality for modifying the response
     * @return The content to be set in the response
     */
    @Override
    public Object handle(Request request, Response response) {
        Map<String, Object> responseMap = new HashMap<>();
        try {
            // collect parameters from the request
            String uid = request.queryParams("uid");
            String songName = request.queryParams("songName");
            // TODO: should we save these in session ids?

            Map<String, Object> data = new HashMap<>();
            data.put("songName", songName);

            System.out.println("adding song: " + songName + " for user: " + uid);

            // get the current song count to make a unique song_id by index.
            int songCount = this.storageHandler.getCollection(uid, "likedSongs").size();
            String songId = "songName-" + songCount;

            // use the storage handler to add the document to the database
            this.storageHandler.addDocument(uid, "likedSongs", songId, data);

            responseMap.put("response_type", "success");
            responseMap.put("songName", songName);
        } catch (Exception e) {
            // error likely occurred in the storage handler
            e.printStackTrace();
            responseMap.put("response_type", "failure");
            responseMap.put("error", e.getMessage());
        }

        return Utils.toMoshiJson(responseMap);
    }
}
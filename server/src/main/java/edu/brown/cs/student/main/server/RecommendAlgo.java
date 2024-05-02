package edu.brown.cs.student.main.server;

import java.util.HashMap;
import java.util.List;

import edu.brown.cs.student.main.server.storage.StorageInterface;
import spark.Request;
import spark.Response;
import spark.Route;

public class RecommendAlgo implements Route{
    private StorageInterface storageHandler;
    public RecommendAlgo(StorageInterface storageHandler){
        this.storageHandler = storageHandler;
    }

    /**
     * given a song that the user just swiped on, user's profile is updated
     * @param liked
     * @param songID
     * @return
     */
    public void updateProfile(boolean liked, String songID){
        // given song ID and liked/not, updates the user's profile

        // 
    }

    public void instantiateProfile(List<String> playlists, String genre){

    }

    @Override
    public Object handle(Request request, Response response) throws Exception {
        return null;
    }
}

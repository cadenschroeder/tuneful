package edu.brown.cs.student.main.server;

import java.util.HashMap;

import edu.brown.cs.student.main.server.storage.StorageInterface;

public class RecommendAlgo {
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

    public void instantiateProfile(){
        
    }
}

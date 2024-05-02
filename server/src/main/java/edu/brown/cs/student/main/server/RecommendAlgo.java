package edu.brown.cs.student.main.server;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import edu.brown.cs.student.main.server.broadband.MusicSource;
import edu.brown.cs.student.main.server.storage.StorageInterface;

public class RecommendAlgo {
    private StorageInterface storageHandler;
    private MusicSource datasource;

    public RecommendAlgo(MusicSource datasource, StorageInterface storageHandler){
        this.storageHandler = storageHandler;
        this.datasource = datasource;
    }

    /**
     * given a song that the user just swiped on, user's profile is updated
     * @param liked
     * @param songID
     * @return uid
     */
    public void updateProfile(boolean liked, String id, String uid) throws IOException{
        // given song ID and liked/not, updates the user's profile
        Map<String, Object> attributes = this.reduceMap(this.datasource.getFeatures(id));
        for(String key :  attributes.keySet()){
            this.storageHandler.addToList(uid, "attributes", "session-0", key, attributes.get(key));
        }
        
    }

    public void instantiateProfile(List<String> songIDs, String uid) throws IOException{
        //Make new map 
        Map<String, List<Double>> attributes = new HashMap<>();

        attributes.put("acousticness", new ArrayList<Double>());
        attributes.put("danceability", new ArrayList<Double>());
        attributes.put("energy", new ArrayList<Double>());
        attributes.put("instrumentalness", new ArrayList<Double>());
        attributes.put("liveness", new ArrayList<Double>());
        attributes.put("loudness", new ArrayList<Double>());
        attributes.put("speechiness", new ArrayList<Double>());
        attributes.put("valence", new ArrayList<Double>());
        attributes.put("tempo",new ArrayList<Double>());

        // look thru song ids
        for (String id : songIDs){
            // get the features for the song
            Map<String, Object> features = this.datasource.getFeatures(id);
            // adds each attribute to the attribute map
            Double valString = (Double) features.get("acousticness");
            // Double valDouble = Double.parseDouble(valString);
            // ArrayList<Double> array = new ArrayList<Double>();
            // array.add(valDouble);
            attributes.get("acousticness").add((Double)features.get("acousticness"));
            attributes.get("danceability").add((Double)features.get("danceability"));

            attributes.get("energy").add((Double)features.get("energy"));
            attributes.get("instrumentalness").add((Double)features.get("instrumentalness"));
            attributes.get("liveness").add((Double)features.get("liveness"));
            attributes.get("loudness").add((Double)features.get("loudness"));
            attributes.get("speechiness").add((Double)features.get("speechiness"));
            attributes.get("valence").add((Double)features.get("valence"));
            attributes.get("tempo").add((Double)features.get("tempo"));
        }
        Map<String, Object> stats = new HashMap<String,Object>(attributes);

        this.storageHandler.addDocument(uid, "attributes", "session-0", stats);
    }

    private Map<String, Object> reduceMap(Map<String, Object> features){
        Map<String, Object> attributes = new HashMap<>();
        // adds each attribute to the attribute map
        attributes.put("acousticness", new ArrayList<Double>(Arrays.asList((Double) features.get("acousticness"))));
        attributes.put("danceability", new ArrayList<Double>(Arrays.asList((Double) features.get("danceability"))));
        attributes.put("energy", new ArrayList<Double>(Arrays.asList((Double) features.get("energy"))));
        attributes.put("instrumentalness",
                new ArrayList<Double>(Arrays.asList((Double) features.get("instrumentalness"))));
        attributes.put("liveness", new ArrayList<Double>(Arrays.asList((Double) features.get("liveness"))));
        attributes.put("loudness", new ArrayList<Double>(Arrays.asList((Double) features.get("loudness"))));
        attributes.put("speechiness", new ArrayList<Double>(Arrays.asList((Double) features.get("speechiness"))));
        attributes.put("valence", new ArrayList<Double>(Arrays.asList((Double) features.get("valence"))));
        attributes.put("tempo", new ArrayList<Double>(Arrays.asList((Double) features.get("tempo"))));
        return attributes;
    }
}

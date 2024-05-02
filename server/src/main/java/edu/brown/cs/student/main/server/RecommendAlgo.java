package edu.brown.cs.student.main.server;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import edu.brown.cs.student.main.server.broadband.MusicSource;
import edu.brown.cs.student.main.server.storage.StorageInterface;
import edu.brown.cs.student.main.server.Constants;

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

    private static double calculateStandardDeviation(List<Double> array) {

        // get the sum of array
        double sum = 0.0;
        for (double i : array) {
            sum += i;
        }
    
        // get the mean of array
        int length = array.size();
        double mean = sum / length;
    
        // calculate the standard deviation
        double standardDeviation = 0.0;
        for (double num : array) {
            standardDeviation += Math.pow(num - mean, 2);
        }
    
        return Math.sqrt(standardDeviation / length);
    }

    private static List<Double> normalizeList(List<Double> array, Double min, Double max){
        ArrayList<Double> newArray = new ArrayList<>();
        for (Double num : array) {
            newArray.add((num - min) / (max - min));
        }
        return newArray;
    }

    private static Double getMin(String attribute){
        Double min;
        switch(attribute){
            case "loudness":
                min = Constants.LOUDNESS_MIN;
                break;
            case "tempo":
                min = Constants.TEMPO_MIN;
                break;
            default: 
                min = Constants.GENERAL_MIN;
        }
        return min;
    }

    private static Double getMax(String attribute){
        Double min;
        switch(attribute){
            case "loudness":
                min = Constants.LOUDNESS_MAX;
                break;
            case "tempo":
                min = Constants.TEMPO_MAX;
                break;
            default: 
                min = Constants.GENERAL_MAX;
        }
        return min;
    }

    private static double findMedian(List<Double> list) {
        Collections.sort(list); // Sort the ArrayList
        int n = list.size();
        if (n % 2 != 0) {
            // If the number of elements is odd, return the middle element
            return list.get(n / 2);
        } else {
            // If the number of elements is even, return the average of the two middle elements
            return (list.get((n - 1) / 2) + list.get(n / 2)) / 2.0;
        }
    }

    public Map<String, Map<String, Double>> rankAttributes (Map<String, List<Double>> likeAttributes, Map<String, List<Double>> dislikeAttributes){
        Map<String, Map<String, Double>> rankings = new HashMap<>();
        for (String attribute : likeAttributes.keySet()) {
            Double rawLikeMedian = findMedian(likeAttributes.get(attribute));
            Double rawLikeStdDev = calculateStandardDeviation(likeAttributes.get(attribute));
            if (!(getMax(attribute) == 1.0 && getMin(attribute) == 0.0)){
                likeAttributes.put(attribute, normalizeList(likeAttributes.get(attribute), getMin(attribute), getMax(attribute)));
                dislikeAttributes.put(attribute, normalizeList(dislikeAttributes.get(attribute), getMin(attribute), getMax(attribute)));
            }
            Double normalizedLikeMedian = findMedian(likeAttributes.get(attribute));
            Double normalizedDislikeMedian = findMedian(dislikeAttributes.get(attribute));
            Double difference = Math.abs(normalizedLikeMedian - normalizedDislikeMedian);
            Double likeStdDev = calculateStandardDeviation(likeAttributes.get(attribute));
            Double dislikeStdDev = calculateStandardDeviation(dislikeAttributes.get(attribute));
            Double ranking = 3.0 * difference + 2.0 * likeStdDev + dislikeStdDev;
            Map<String, Double> tempMap= new HashMap<>();
            tempMap.put("ranking", ranking);
            tempMap.put("target", rawLikeMedian);
            tempMap.put("minimum", rawLikeMedian - rawLikeStdDev);
            tempMap.put("maximum", rawLikeMedian + rawLikeStdDev);
            rankings.put(attribute, tempMap);
        }
        return rankings;
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

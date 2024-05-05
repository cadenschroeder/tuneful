package edu.brown.cs.student.main.server;

import edu.brown.cs.student.main.server.broadband.MusicSource;
import edu.brown.cs.student.main.server.storage.StorageInterface;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RecommendAlgo {
  private StorageInterface storageHandler;
  private MusicSource datasource;

  public RecommendAlgo(MusicSource datasource, StorageInterface storageHandler) {
    this.storageHandler = storageHandler;
    this.datasource = datasource;
  }

  /**
   * given a song that the user just swiped on, user's profile is updated
   *
   * @param liked
   * @param songID
   * @return uid
   */
  public void updateProfile(boolean liked, String id, String uid) throws IOException {
    // given song ID and liked/not, updates the user's profile

    Map<String, Object> attributes = this.reduceMap(this.datasource.getFeatures(id));
    if (liked) {
      // update likes stats
      for (String key : attributes.keySet()) {
        this.storageHandler.addToList(uid, "attributes", "likes", key, attributes.get(key));
      }
    } else {
      // update dislikes stats
      for (String key : attributes.keySet()) {
        this.storageHandler.addToList(uid, "attributes", "dislikes", key, attributes.get(key));
      }
    }
  }

  public void instantiateProfile(List<String> songIDs, String uid) throws IOException {

    // make a new map to hold the attributes for liked songs
    Map<String, List<Double>> likeAttributes = new HashMap<>();

    likeAttributes.put("acousticness", new ArrayList<Double>());
    likeAttributes.put("danceability", new ArrayList<Double>());
    likeAttributes.put("energy", new ArrayList<Double>());
    likeAttributes.put("instrumentalness", new ArrayList<Double>());
    likeAttributes.put("liveness", new ArrayList<Double>());
    likeAttributes.put("loudness", new ArrayList<Double>());
    likeAttributes.put("speechiness", new ArrayList<Double>());
    likeAttributes.put("valence", new ArrayList<Double>());
    likeAttributes.put("tempo", new ArrayList<Double>());

    // loop thru song ids
    for (String id : songIDs) {
      // get the features for the song
      Map<String, Object> features = this.datasource.getFeatures(id);
      // adds each attribute to the attribute map
      likeAttributes.get("acousticness").add((Double) features.get("acousticness"));
      likeAttributes.get("danceability").add((Double) features.get("danceability"));

      likeAttributes.get("energy").add((Double) features.get("energy"));
      likeAttributes.get("instrumentalness").add((Double) features.get("instrumentalness"));
      likeAttributes.get("liveness").add((Double) features.get("liveness"));
      likeAttributes.get("loudness").add((Double) features.get("loudness"));
      likeAttributes.get("speechiness").add((Double) features.get("speechiness"));
      likeAttributes.get("valence").add((Double) features.get("valence"));
      likeAttributes.get("tempo").add((Double) features.get("tempo"));
    }
    Map<String, Object> likeStats = new HashMap<String, Object>(likeAttributes);
    this.storageHandler.addDocument(uid, "attributes", "likes", likeStats);

    // make a new map to hold the attributes for disliked songs
    Map<String, List<Double>> dislikeAttributes = new HashMap<>();
    dislikeAttributes.put("acousticness", new ArrayList<Double>());
    dislikeAttributes.put("danceability", new ArrayList<Double>());
    dislikeAttributes.put("energy", new ArrayList<Double>());
    dislikeAttributes.put("instrumentalness", new ArrayList<Double>());
    dislikeAttributes.put("liveness", new ArrayList<Double>());
    dislikeAttributes.put("loudness", new ArrayList<Double>());
    dislikeAttributes.put("speechiness", new ArrayList<Double>());
    dislikeAttributes.put("valence", new ArrayList<Double>());
    dislikeAttributes.put("tempo", new ArrayList<Double>());

    Map<String, Object> dislikeStats = new HashMap<String, Object>(dislikeAttributes);
    this.storageHandler.addDocument(uid, "attributes", "dislikes", dislikeStats);
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

  private static List<Double> normalizeList(List<Double> array, Double min, Double max) {
    ArrayList<Double> newArray = new ArrayList<>();
    for (Double num : array) {
      newArray.add((num - min) / (max - min));
    }
    return newArray;
  }

  private static Double getMin(String attribute) {
    Double min;
    switch (attribute) {
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

  private static Double getMax(String attribute) {
    Double max;
    switch (attribute) {
      case "loudness":
        max = Constants.LOUDNESS_MAX;
        break;
      case "tempo":
        max = Constants.TEMPO_MAX;
        break;
      default:
        max = Constants.GENERAL_MAX;
    }
    return max;
    }    

    private static Double findMedian(List<Double> list) {
        //System.out.println("find median list: " + list);
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

    private static Double[] likeEmptyFindTarget(Double rawDislikeMedian, Double min, Double max){
        Double minDistance = Math.abs(rawDislikeMedian - min);
        Double maxDistance = Math.abs(max - rawDislikeMedian);
        Double generalDistance = min + ((max - min) / 5.0);
        Double target;
        if(minDistance < maxDistance){
            target = min + (rawDislikeMedian - min) * Math.random();
        } else if (maxDistance < minDistance){
            target = min + (rawDislikeMedian - min) * Math.random();
        }else{
            target = min + generalDistance;
        }
        Double[] toReturn = {target, (target - generalDistance), (target + generalDistance)};
        return toReturn;
    }

    public Map<String, Map<String, Double>> rankAttributes (Map<String, List<Double>> likeAttributes, Map<String, List<Double>> dislikeAttributes){
        Map<String, Map<String, Double>> rankings = new HashMap<>();
        if(likeAttributes.get("acousticness").isEmpty()){
            if(dislikeAttributes.get("acousticness").isEmpty()){
                for (String attribute: likeAttributes.keySet()){
                    Double min = getMin(attribute);
                    Double max = getMax(attribute);
                    Map<String, Double> tempMap= new HashMap<>();
                    tempMap.put("ranking", 1.0);
                    tempMap.put("target", min + (max - min) * Math.random());
                    tempMap.put("minimum", min);
                    tempMap.put("maximum", max);
                    rankings.put(attribute, tempMap);
                }
                return rankings;
            }else{
                for (String attribute : dislikeAttributes.keySet()) {
                    Double min = getMin(attribute);
                    Double max = getMax(attribute);
                    Double rawDislikeMedian = findMedian(dislikeAttributes.get(attribute));
                    if (!(max == 1.0 && min == 0.0)){
                        dislikeAttributes.put(attribute, normalizeList(dislikeAttributes.get(attribute), getMin(attribute), getMax(attribute)));
                    }
                    Double dislikeStdDev = calculateStandardDeviation(dislikeAttributes.get(attribute));
                    Double ranking = 1 - dislikeStdDev;
                    Double[] targetList = likeEmptyFindTarget(rawDislikeMedian, min, max);
                    if(Math.abs(targetList[2] - targetList[1]) <= 0.1){
                        if(Math.abs(targetList[2] - targetList[0]) <=0.1){
                            targetList[1] -= 0.2;
                        }else if (Math.abs(targetList[1] - targetList[0]) <=0.1){
                            targetList[2] += 0.2;
                        }else{
                            targetList[1] -= 0.1;
                            targetList[2] += 0.1;
                        }
                    }
                    Map<String, Double> tempMap= new HashMap<>();
                    tempMap.put("ranking", ranking);
                    tempMap.put("target", targetList[0]);
                    tempMap.put("minimum", targetList[1]);
                    tempMap.put("maximum", targetList[2]);
                    rankings.put(attribute, tempMap);
                }
                return rankings;
            }
        }else if (dislikeAttributes.isEmpty()){
            for (String attribute : likeAttributes.keySet()) {
                Double rawLikeMedian = findMedian(likeAttributes.get(attribute));
                Double rawLikeStdDev = calculateStandardDeviation(likeAttributes.get(attribute));
                Double max = getMax(attribute);
                Double min = getMin(attribute);
                if(rawLikeStdDev <= ((max-min) / 10.0)){
                    rawLikeStdDev = (max-min) / 5.0;
                }
                if (!(max == 1.0 && min == 0.0)){
                    likeAttributes.put(attribute, normalizeList(likeAttributes.get(attribute), getMin(attribute), getMax(attribute)));
                }
                Double likeStdDev = calculateStandardDeviation(likeAttributes.get(attribute));
                Double ranking = 1 - likeStdDev;
                Map<String, Double> tempMap= new HashMap<>();
                tempMap.put("ranking", ranking);
                tempMap.put("target", rawLikeMedian);
                tempMap.put("minimum", rawLikeMedian - rawLikeStdDev);
                tempMap.put("maximum", rawLikeMedian + rawLikeStdDev);
                rankings.put(attribute, tempMap);
            }
            return rankings;
        }else{
            for (String attribute : likeAttributes.keySet()) {
                Double rawLikeMedian = findMedian(likeAttributes.get(attribute));
                Double rawLikeStdDev = calculateStandardDeviation(likeAttributes.get(attribute));
                Double min = getMin(attribute);
                Double max = getMax(attribute);
                if(rawLikeStdDev <= ((max-min) / 10.0)){
                    rawLikeStdDev = (max-min) / 5.0;
                }
                if (!(max == 1.0 && min == 0.0)){
                    likeAttributes.put(attribute, normalizeList(likeAttributes.get(attribute), getMin(attribute), getMax(attribute)));
                    dislikeAttributes.put(attribute, normalizeList(dislikeAttributes.get(attribute), getMin(attribute), getMax(attribute)));
                }
                Double normalizedLikeMedian = findMedian(likeAttributes.get(attribute));
                Double normalizedDislikeMedian = findMedian(dislikeAttributes.get(attribute));
                Double difference = Math.abs(normalizedLikeMedian - normalizedDislikeMedian);
                Double likeStdDev = calculateStandardDeviation(likeAttributes.get(attribute));
                Double dislikeStdDev = calculateStandardDeviation(dislikeAttributes.get(attribute));
                Double ranking = 3.0 * difference + 2.0 * (1 - likeStdDev) + (1 - dislikeStdDev);
                Map<String, Double> tempMap= new HashMap<>();
                tempMap.put("ranking", ranking);
                tempMap.put("target", rawLikeMedian);
                tempMap.put("minimum", rawLikeMedian - rawLikeStdDev);
                tempMap.put("maximum", rawLikeMedian + rawLikeStdDev);
                rankings.put(attribute, tempMap);
            }
            return rankings;
        }
    }

  private Map<String, Object> reduceMap(Map<String, Object> features) {
    Map<String, Object> attributes = new HashMap<>();
    // adds each attribute to the attribute map
    attributes.put(
        "acousticness",
        new ArrayList<Double>(Arrays.asList((Double) features.get("acousticness"))));
    attributes.put(
        "danceability",
        new ArrayList<Double>(Arrays.asList((Double) features.get("danceability"))));
    attributes.put("energy", new ArrayList<Double>(Arrays.asList((Double) features.get("energy"))));
    attributes.put(
        "instrumentalness",
        new ArrayList<Double>(Arrays.asList((Double) features.get("instrumentalness"))));
    attributes.put(
        "liveness", new ArrayList<Double>(Arrays.asList((Double) features.get("liveness"))));
    attributes.put(
        "loudness", new ArrayList<Double>(Arrays.asList((Double) features.get("loudness"))));
    attributes.put(
        "speechiness", new ArrayList<Double>(Arrays.asList((Double) features.get("speechiness"))));
    attributes.put(
        "valence", new ArrayList<Double>(Arrays.asList((Double) features.get("valence"))));
    attributes.put("tempo", new ArrayList<Double>(Arrays.asList((Double) features.get("tempo"))));
    return attributes;
  }
}

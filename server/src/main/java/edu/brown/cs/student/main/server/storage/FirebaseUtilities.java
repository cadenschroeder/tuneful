package edu.brown.cs.student.main.server.storage;

import com.google.api.core.ApiFuture;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.*;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.zip.DataFormatException;

public class FirebaseUtilities implements StorageInterface {

  public FirebaseUtilities() throws IOException {
    // TODO: FIRESTORE PART 0:
    // Create /resources/ folder with firebase_config.json and
    // add your admin SDK from Firebase. see:
    // https://docs.google.com/document/d/10HuDtBWjkUoCaVj_A53IFm5torB_ws06fW3KYFZqKjc/edit?usp=sharing
    String workingDirectory = System.getProperty("user.dir");
    Path firebaseConfigPath = Paths.get(workingDirectory, "src", "main", "resources", "firebase_config.json");

    // ^-- if your /resources/firebase_config.json exists but is not found,
    // try printing workingDirectory and messing around with this path.
    // System.out.println(workingDirectory);

    FileInputStream serviceAccount = new FileInputStream(firebaseConfigPath.toString());

    FirebaseOptions options = new FirebaseOptions.Builder()
        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
        .build();

    FirebaseApp.initializeApp(options);
  }

  @Override
  public List<Map<String, Object>> getCollection(
      String uid, String collection_id, Boolean chronological)
      throws InterruptedException, ExecutionException, IllegalArgumentException,
      DataFormatException {

    if (uid == null || collection_id == null) {
      throw new IllegalArgumentException("getCollection: uid and/or collection_id cannot be null");
    }

    // gets all documents in the collection 'collection_id' for user 'uid'

    Firestore db = FirestoreClient.getFirestore();
    // 1: Make the data payload to add to your collection
    CollectionReference dataRef = db.collection("users").document(uid).collection(collection_id);

    // 2: Get pin documents
    QuerySnapshot dataQuery;
    if (chronological) {
      // Order by timestamp
      // Note: the data must have a timestamp field
      dataQuery = dataRef.orderBy("timestamp", Query.Direction.ASCENDING).get().get();
      if (dataQuery.isEmpty()) {
        throw new DataFormatException("Data queried has no timestamp field");
      }
    } else {
      dataQuery = dataRef.get().get();
    }

    // 3: Get data from document queries
    List<Map<String, Object>> data = new ArrayList<>();
    for (QueryDocumentSnapshot doc : dataQuery.getDocuments()) {
      data.add(doc.getData());
    }

    return data;
  }

  @Override
  public void addDocument(String uid, String collection_id, String doc_id, Map<String, Object> data,
      boolean noOverwrites)
      throws IllegalArgumentException {
    if (uid == null || collection_id == null || doc_id == null || data == null) {
      throw new IllegalArgumentException(
          "addDocument: uid, collection_id, doc_id, or data cannot be null");
    }
    // adds a new document 'doc_name' to colleciton 'collection_id' for user 'uid'
    // with data payload 'data'.

    // TODO: FIRESTORE PART 1:
    // use the guide below to implement this handler
    // - https://firebase.google.com/docs/firestore/quickstart#add_data

    Firestore db = FirestoreClient.getFirestore();
    // 1: Get a ref to the collection that you created
    CollectionReference collectionRef = db.collection("users").document(uid).collection(collection_id);
    DocumentReference docRef = collectionRef.document(doc_id);

    // 2: Write data to the collection ref
    if (noOverwrites) {
      ApiFuture<DocumentSnapshot> future = docRef.get();
      try {
        DocumentSnapshot document = future.get();
        if (!document.exists()) {
          // Document doesn't exist, add it
          collectionRef.document(doc_id).set(data);
        } //else do nothing and don't overwrite the existing data
      } catch (InterruptedException | ExecutionException e) {
        // Handle errors
        e.printStackTrace();
        throw new IllegalArgumentException(e.getMessage());
      }
    } else {
      collectionRef.document(doc_id).set(data);
    }

  }

  /**
   * Adds an element to the end of a user's list
   *
   * @param uid
   * @param collection_id
   * @param doc_id
   * @param list_id       --> indicates which list in a set to add to
   * @param data          --> data to be added to the list
   */
  @Override
  public void addToList(
      String uid, String collection_id, String doc_id, String list_id, Object data)
      throws IllegalArgumentException {
    if (uid == null || collection_id == null || doc_id == null || data == null) {
      throw new IllegalArgumentException(
          "addTOList: uid, collection_id, doc_id, or data cannot be null");
    }
    Firestore db = FirestoreClient.getFirestore();
    // 1: Get a ref to the collection that you created
    CollectionReference collectionRef = db.collection("users").document(uid).collection(collection_id);

    // 2: Add the data element to the array by reference to the list id

    DocumentReference doc = collectionRef.document(doc_id);
    ArrayList<Double> dataArrayList = (ArrayList<Double>) data;

    doc.update(list_id, FieldValue.arrayUnion(dataArrayList.toArray()));
  }

  // clears the collections inside of a specific user.
  @Override
  public void clearUser(String uid) throws IllegalArgumentException {
    if (uid == null) {
      throw new IllegalArgumentException("removeUser: uid cannot be null");
    }
    try {
      // removes all data for user 'uid'
      Firestore db = FirestoreClient.getFirestore();
      // 1: Get a ref to the user document
      DocumentReference userDoc = db.collection("users").document(uid);
      // 2: Delete the user document
      // deleteDocument(userDoc);
      // // Update specific fields to null to delete them
      // Map<String, Object> updates = new HashMap<>();
      // updates.put("attributes", FieldValue.delete()); // Replace "field1" with the
      // field you want to delete
      // updates.put("songs", FieldValue.delete()); // Replace "field2" with another
      // field you want to delete
      // updates.put("songsIndex", FieldValue.delete());
      // // Perform the update
      // userDoc.update(updates).get();

      CollectionReference collectionRefAttributes = userDoc.collection("attributes");

      //Option 1: delete the whole colection
//      deleteCollection(collectionRefAttributes, 5);

      //Option 2: If we don't want to fully delete but just set to empty
       Map<String, List<Double>> emptyttributes = new HashMap<>();

       emptyttributes.put("acousticness", new ArrayList<Double>());
       emptyttributes.put("danceability", new ArrayList<Double>());
       emptyttributes.put("energy", new ArrayList<Double>());
       emptyttributes.put("instrumentalness", new ArrayList<Double>());
       emptyttributes.put("liveness", new ArrayList<Double>());
       emptyttributes.put("loudness", new ArrayList<Double>());
       emptyttributes.put("speechiness", new ArrayList<Double>());
       emptyttributes.put("valence", new ArrayList<Double>());
       emptyttributes.put("tempo", new ArrayList<Double>());

       collectionRefAttributes.document("likes").set(emptyttributes);
       collectionRefAttributes.document("dislikes").set(emptyttributes);

      CollectionReference collectionRefSongs = userDoc.collection("songs");

      // deletes the collection of song ids
      deleteCollection(collectionRefSongs, 5); // Todo change batch size?

      CollectionReference collectionRefIndex = userDoc.collection("songsIndex");

      // deletes the collection of the index
      // deleteCollection(collectionRefIndex, 5);

      // initialize index to zero
      Map<String, Object> songIndex = new HashMap<>();
      songIndex.put("index", 0);
      collectionRefIndex.document("index").set(songIndex);

      System.out.println("Finished deleting user session");
    } catch (Exception e) {
      e.printStackTrace();

      System.err.println("Error removing user : " + uid);
      System.err.println(e.getMessage());
    }
  }

  /**
   * Delete a collection in batches to avoid out-of-memory errors. Batch size may
   * be tuned based on
   * document size (atmost 1MB) and application requirements.
   */
  private void deleteCollection(CollectionReference collection, int batchSize) {
    try {
      // retrieve a small batch of documents to avoid out-of-memory errors
      ApiFuture<QuerySnapshot> future = collection.limit(batchSize).get();
      int deleted = 0;
      // future.get() blocks on document retrieval
      List<QueryDocumentSnapshot> documents = future.get().getDocuments();
      for (QueryDocumentSnapshot document : documents) {
        document.getReference().delete();
        ++deleted;
      }
      if (deleted >= batchSize) {
        // retrieve and delete another batch
        deleteCollection(collection, batchSize);
      }
    } catch (Exception e) {
      System.err.println("Error deleting collection : " + e.getMessage());
    }
  }

  @Override
  public void incrementField(String uid, String collection_id, String doc_id) {

    if (uid == null || collection_id == null || doc_id == null) {
      throw new IllegalArgumentException(
          "addTOList: uid, collection_id, doc_id, or data cannot be null");
    }
    Firestore db = FirestoreClient.getFirestore();
    // 1: Get a ref to the collection that you created
    CollectionReference collectionRef = db.collection("users").document(uid).collection(collection_id);

    // 2: Add the data element to the array by reference to the list id

    DocumentReference doc = collectionRef.document(doc_id);

    doc.update("readIndex", FieldValue.increment(1));
  }

  private void deleteDocument(DocumentReference doc) {
    // for each subcollection, run deleteCollection()
    Iterable<CollectionReference> collections = doc.listCollections();
    for (CollectionReference collection : collections) {
      deleteCollection(collection);
    }
    // then delete the document
    doc.delete();
  }

  // recursively removes all the documents and collections inside a collection
  // https://firebase.google.com/docs/firestore/manage-data/delete-data#collections
  private void deleteCollection(CollectionReference collection) {
    try {

      // get all documents in the collection
      ApiFuture<QuerySnapshot> future = collection.get();
      List<QueryDocumentSnapshot> documents = future.get().getDocuments();

      // delete each document
      for (QueryDocumentSnapshot doc : documents) {
        doc.getReference().delete();
      }

      // NOTE: the query to documents may be arbitrarily large. A more robust
      // solution would involve batching the collection.get() call.
    } catch (Exception e) {
      System.err.println("Error deleting collection : " + e.getMessage());
    }
  }

  @Override
  public void updateDocument(
      String uid, String collection_id, String doc_id, Map<String, Object> data) {

    if (uid == null || collection_id == null || doc_id == null || data == null) {
      throw new IllegalArgumentException(
          "addDocument: uid, collection_id, doc_id, or data cannot be null");
    }

    Firestore db = FirestoreClient.getFirestore();
    CollectionReference collectionRef = db.collection("users").document(uid).collection(collection_id);
    collectionRef.document(doc_id).update(data);
  }
}

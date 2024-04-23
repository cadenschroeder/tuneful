package edu.brown.cs.student.main.server.storage;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

public interface StorageInterface {

  void addDocument(String uid, String collection_id, String doc_id, Map<String, Object> data);

  List<Map<String, Object>> getCollection(String uid, String collection_id)
      throws InterruptedException, ExecutionException;

  void clearUser(String uid) throws InterruptedException, ExecutionException;

  // SPRINT 5 - ADDITIONAL FUNCTIONALITY
  // Add methods to your StorageInterface to handle updating and deleting
  // documents.
  // For more info, see:
  // - 'Update a Document' in
  // https://firebase.google.com/docs/firestore/manage-data/add-data#java_19

}

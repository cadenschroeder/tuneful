package edu.brown.cs.student.main.server.storage;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.zip.DataFormatException;

public interface StorageInterface {

  void addDocument(String uid, String collection_id, String doc_id, Map<String, Object> data);
  void addToList(String uid, String collection_id, String doc_id, String list_id, Object data);

  void updateDocument(String uid, String collection_id, String doc_id, Map<String, Object> data);

  List<Map<String, Object>> getCollection(String uid, String collection_id, Boolean chronological)
          throws InterruptedException, ExecutionException, DataFormatException;

  void clearUser(String uid) throws InterruptedException, ExecutionException;

  void incrementField(String uid, String collection_id, String doc_id);

  // SPRINT 5 - ADDITIONAL FUNCTIONALITY
  // Add methods to your StorageInterface to handle updating and deleting
  // documents.
  // For more info, see:
  // - 'Update a Document' in
  // https://firebase.google.com/docs/firestore/manage-data/add-data#java_19

}

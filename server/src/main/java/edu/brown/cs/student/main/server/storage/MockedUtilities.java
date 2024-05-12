package edu.brown.cs.student.main.server.storage;

import edu.brown.cs.student.main.exception.DatasourceException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.zip.DataFormatException;

public class MockedUtilities implements StorageInterface{
    private long songsIndex;
    private List<Map<String, Object>> songs;
    public MockedUtilities(){
        this.songsIndex = 0;
        this.songs = new ArrayList<>();
        Map<String, Object> song1 = new HashMap<>();
        Map<String, Object> song2 = new HashMap<>();
        Map<String, Object> song3 = new HashMap<>();
        Map<String, Object> song4 = new HashMap<>();
        song1.put("song", "song1Object");
        song2.put("song", "song2Object");
        song3.put("song", "song3Object");
        song4.put("song", "song4Object");
        this.songs.add(song1);
        this.songs.add(song2);
        this.songs.add(song3);
        this.songs.add(song4);

    }
    @Override
    public void addDocument(String uid, String collection_id, String doc_id, Map<String, Object> data, boolean noOverwrites) {
        if(collection_id.equals("songs")){
            this.songs.add(data);
        } else if(collection_id.equals("songsIndex")){
            this.songsIndex = Long.parseLong(data.get("index").toString());
        }
    }

    @Override
    public void addToList(String uid, String collection_id, String doc_id, String list_id, Object data) {

    }

    @Override
    public void updateDocument(String uid, String collection_id, String doc_id, Map<String, Object> data) {

    }

    @Override
    public List<Map<String, Object>> getCollection(String uid, String collection_id, Boolean chronological) throws InterruptedException, ExecutionException, DataFormatException {
        if(collection_id.equals("songs")){
            return this.songs;
        } else if(collection_id.equals("songsIndex")){
            List<Map<String,Object>> mockedIndex = new ArrayList<>();
            Map<String,Object> map = new HashMap<>();
            map.put("index", this.songsIndex);
            mockedIndex.add(map);
            return mockedIndex;
        }
        throw new DataFormatException("not correct collection id");
    }

    @Override
    public void clearUser(String uid) throws InterruptedException, ExecutionException {

    }

    @Override
    public void incrementField(String uid, String collection_id, String doc_id) {

    }
}

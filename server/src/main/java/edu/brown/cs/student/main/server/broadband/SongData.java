package edu.brown.cs.student.main.server.broadband;

import java.util.HashMap;

public record SongData(String snippetURL, boolean explicit, String artist, String album, HashMap<String, Integer> features) {}

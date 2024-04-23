package edu.brown.cs.student.main.server.broadband;

import java.util.List;
import java.util.Map;

public record SongData(
    String snippetURL,
    String explicit,
    List<String> artists,
    String album,
    List<Map<String, Object>> images,
    Map<String, Integer> features) {}

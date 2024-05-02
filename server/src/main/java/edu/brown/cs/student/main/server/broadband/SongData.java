package edu.brown.cs.student.main.server.broadband;

import java.util.List;
import java.util.Map;

public record SongData(
    String trackID,
    String name,
    String snippetURL,
    String explicit,
    List<String> artists,
    String album,
    String imageUrl) {
    public Map<String, Object> toMap() {
        return Map.of(
                "trackID", trackID,
                "name", name,
                "snippetURL", snippetURL,
                "explicit", explicit,
                "artists", artists,
                "album", album,
                "images", imageUrl
        );
    }
}

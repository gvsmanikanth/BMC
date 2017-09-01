package com.bmc.models.components.video;

import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public enum VideoType {
    YouTube(1),
    Twistage(2),
    Dam(3);

    public static VideoType valueOf(int typeId) { return typeMap.get(typeId); }
    VideoType(int typeId) { this.typeId = typeId; }
    private int typeId;
    static { typeMap = Stream.of(VideoType.values()).collect(Collectors.toMap(t->t.typeId, t->t)); }
    private static Map<Integer,VideoType> typeMap;
}
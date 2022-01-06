package mokoko.util.jackson;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class JacksonJsonUtil {

    static final Logger LOG = LoggerFactory.getLogger(JacksonJsonUtil.class);

    public static <T> T readValue(File src, TypeReference<T> valueTypeRef, PropertyNamingStrategy strategy)
            throws RuntimeException {
        T value;
        try {
            ObjectMapper mapper = new ObjectMapper();
            if (strategy != null)
                mapper.setPropertyNamingStrategy(strategy);
            value = mapper.readValue(src, valueTypeRef);
        } catch (RuntimeException | IOException e) {
            LOG.error("Error at JacksonJsonUtil.readValue(File, TypeReference)", e);
            throw new RuntimeException("Error at JacksonJsonUtil.readValue(File, TypeReference)");
        }
        return value;
    }

    public static Map<String, Object> readValueAsMap(File src) throws RuntimeException {
        HashMap<String, Object> value;
        try {
            value = readValue(src, new TypeReference<HashMap<String, Object>>() {
            }, null);
        } catch (RuntimeException e) {
            LOG.error("Error at JacksonJsonUtil.readValueAsMap(file:" + src + ")", e);
            throw e;
        }
        return value;
    }

    public static <T> T readValue(String content, Class<T> valueType, PropertyNamingStrategy strategy)
            throws RuntimeException {
        T value;
        try {
            ObjectMapper mapper = new ObjectMapper();
            if (strategy != null)
                mapper.setPropertyNamingStrategy(strategy);
            value = mapper.readValue(content, valueType);
        } catch (IOException e) {
            throw new RuntimeException("JSON Syntax Error: " + content);
        } catch (RuntimeException e) {
            LOG.error("Error at JacksonJsonUtil.readValue(\"" + content + "\", " + valueType.getName() + ".class)", e);
            throw e;
        }
        return value;
    }

    public static <T> T readValue(String content, Class<T> valueType) throws RuntimeException {
        return readValue(content, valueType, null);
    }

    @SuppressWarnings({"unchecked", "rawtypes"})
    public static <T> T readValue(String content, TypeReference valueTypeRef) throws RuntimeException {
        T value;
        try {
            ObjectMapper mapper = new ObjectMapper();
            value = (T) mapper.readValue(content, valueTypeRef);
        } catch (IOException e) {
            throw new RuntimeException("JSON Syntax Error: " + content);
        } catch (RuntimeException e) {
            LOG.error("Error at JacksonJsonUtil.readValue(\"" + content + "\", TypeReference)", e);
            throw e;
        }
        return value;
    }

    public static <T> T mapToPOJO(Map<String, Object> map, Class<T> pojoType) {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.convertValue(map, pojoType);
    }

    public static Map<String, Object> readValueAsMap(String content) throws RuntimeException {
        HashMap<String, Object> value;
        try {
            value = readValue(content, new TypeReference<HashMap<String, Object>>() {
            });
        } catch (RuntimeException e) {
            LOG.error("Error at JacksonJsonUtil.readValueAsMap(\"" + content + "\")", e);
            throw e;
        }
        return value;
    }

    public static String writeValueAsString(Object value) {
        return writeValueAsString(value, null);
    }

    public static String writeValueAsString(Object value, PropertyNamingStrategy strategy) {
        String json = null;
        try {
            ObjectMapper mapper = new ObjectMapper();
            if (strategy != null)
                mapper.setPropertyNamingStrategy(strategy);
            json = mapper.writeValueAsString(value);
        } catch (RuntimeException | IOException e) {
            LOG.error("Error at JacksonJsonUtil.writeValueAsString(Object, PropertyNamingStrategy)", e);
        }
        return json;
    }

    public static void writeValue(File resultFile, Object value, PropertyNamingStrategy strategy) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            if (strategy != null)
                mapper.setPropertyNamingStrategy(strategy);
            mapper.writeValue(resultFile, value);
        } catch (Exception e) {
            LOG.error("Error at JacksonJsonUtil.writeValue(File, Object, PropertyNamingStrategy)", e);
        }
    }

}

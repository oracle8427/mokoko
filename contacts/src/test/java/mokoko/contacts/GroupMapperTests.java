package mokoko.contacts;

import mokoko.TestConfiguration;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@SpringBootTest
public class GroupMapperTests extends TestConfiguration {

    private final Logger log = LoggerFactory.getLogger(getClass());

    @Autowired
    private GroupMapper croupMapper;

    @Test
    public void contextLoad() {
        try {
            selectGroups();
        } catch (Exception e) {
            log.error("Error", e);
        }
    }

    public void selectGroups() {
        Map<String, Object> map = new HashMap<>();
        map.put("userID", "mailmaster@mokoko.shop");
        List<Group> groups = croupMapper.selectGroups(map);
        groups.forEach(group -> log.info(group.toString()));

    }


}

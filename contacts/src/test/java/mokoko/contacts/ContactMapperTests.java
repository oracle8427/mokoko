package mokoko.contacts;

import mokoko.TestConfiguration;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.*;

@SpringBootTest
public class ContactMapperTests extends TestConfiguration {

    private final Logger log = LoggerFactory.getLogger(getClass());

    @Autowired
    private ContactMapper contactMapper;

    @Test
    public void contextLoad() {
        try {
            selectContacts();
            unlinkAllGroupTest();
            moveToTrash();
        } catch (Exception e) {
            log.error("Error", e);
        }
    }

    public void selectContacts() {
        Map<String, Object> params = new HashMap<>();
        String userID = "mailmaster@mokoko.shop";
        List<Contact> contacts = contactMapper.selectAllContacts(userID);
        contacts.forEach(contact -> log.info(contacts.toString()));
    }

    public void unlinkAllGroupTest() {
        List<?> idList = Arrays.asList(15,16,17,18);
        contactMapper.unlinkAllGroup(idList);
    }

    public void moveToTrash() {
        Map<String, Object> params = new HashMap<>();
        List<?> idList = Arrays.asList(15,16,17,18);
        params.put("idList", idList);
        params.put("groupID", 2);
        contactMapper.moveToGroup(params);
    }

}

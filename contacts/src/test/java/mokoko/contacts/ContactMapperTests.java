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
public class ContactMapperTests extends TestConfiguration {

    private final Logger log = LoggerFactory.getLogger(getClass());

    @Autowired
    private ContactMapper contactMapper;

    @Test
    public void contextLoad() {
        try {
            selectContacts();
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

}

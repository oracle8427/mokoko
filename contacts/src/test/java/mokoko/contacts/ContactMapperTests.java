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
            // selectContactsTest();
            // unlinkAllGroupTest();
            // moveToTrashTest();
            // ContactEntity contactEntity =  insertContact();
            // insertContactExpansionsTest(contactEntity.getId());
            // deleteContactExpansion(contactEntity.getId());
            // deleteContact(contactEntity.getId());
        } catch (Exception e) {
            log.error("Error", e);
        }
    }

    public void selectContactsTest() {
        Map<String, Object> params = new HashMap<>();
        String userID = "mailmaster@mokoko.shop";
        List<Contact> contacts = contactMapper.selectAllContacts(userID);
        contacts.forEach(contact -> log.info(contacts.toString()));
    }

    public void unlinkAllGroupTest() {
        List<?> idList = Arrays.asList(15, 16, 17, 18);
        contactMapper.unlinkAllGroup(idList);
    }

    public void moveToTrashTest() {
        Map<String, Object> params = new HashMap<>();
        List<?> idList = Arrays.asList(15, 16, 17, 18);
        params.put("idList", idList);
        params.put("groupID", 2);
        contactMapper.moveToGroup(params);
    }

    public ContactEntity insertContact() {
        ContactEntity contactEntity = ContactEntity.builder()
                .firstname("신지형")
                .build();
        contactMapper.insertContact(contactEntity);
        return contactEntity;
    }

    public void insertContactExpansionsTest(int contactID) {
        List<ContactExpansionEntity> list = new ArrayList<>();
        list.add(ContactExpansionEntity.builder()
                .contactID(contactID)
                .email("hello@gmail.com")
                .build());
        list.add(ContactExpansionEntity.builder()
                .contactID(contactID)
                .email("hello2@gmail.com")
                .build());
        contactMapper.insertContactExpansions(list);
    }

    public void deleteContact(int id) {
        contactMapper.deleteContact(id);
    }

    public void deleteContactExpansion(int contactID) {
        contactMapper.deleteContactExpansion(contactID);
    }

}

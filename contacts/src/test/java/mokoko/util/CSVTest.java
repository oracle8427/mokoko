package mokoko.util;

import mokoko.TestConfiguration;
import mokoko.contacts.Contact;
import mokoko.contacts.ContactEntity;
import mokoko.contacts.ContactExpansionEntity;
import mokoko.contacts.ContactMapper;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ClassPathResource;

import java.io.*;
import java.util.List;
import java.util.Map;
import java.util.Random;

@SpringBootTest
public class CSVTest extends TestConfiguration {

    private final Logger log = LoggerFactory.getLogger(getClass());

    private final String[] PHONE_TYPES = new String[]{"mobile", "home", "company", "fax"};
    private final String[] SNS_TYPES = new String[]{"blog", "homepage", "etc"};
    private final String[] ADDRESS_TYPES = new String[]{"home", "company", "etc"};

    @Autowired
    private ContactMapper contactMapper;

    @Test
    public void parseCSVTest() throws IOException {
        ClassPathResource cpr = new ClassPathResource("csv/us-500.csv");
        File testFile = cpr.getFile();
        List<Map<String, String>> records = CSVUtil.parseCSV(testFile);
        Random random = new Random();

        for (Map<String, String> recordMap : records) {
            String firstname = recordMap.get("first_name");
            String lastname = recordMap.get("last_name");
            String name = lastname + firstname;
            ContactEntity contact = Contact.builder()
                    .userID("mailmaster@mokoko.shop")
                    .fullName(name)
                    .firstname(firstname)
                    .lastname(lastname)
                    .organization(recordMap.get("company_name"))
                    .build();

            contactMapper.insertContact(contact);

            String zip = recordMap.get("zip");
            if (zip == null || zip.trim().length() == 0)
                zip = "";
            String state = recordMap.get("state");
            if (state == null || state.trim().length() == 0)
                state = "";
            String county = recordMap.get("county");
            if (county == null || county.trim().length() == 0)
                county = "";
            String city = recordMap.get("city");
            if (city == null || city.trim().length() == 0)
                city = "";
            String address = recordMap.get("address");
            if (address == null || address.trim().length() == 0)
                address = "";

            String fullAddress = zip + " " + state + " " + county + " " + city + " " + address;
            String addressType = ADDRESS_TYPES[random.nextInt(3)];

            String email = recordMap.get("email");

            String sns = recordMap.get("web");
            String snsType = SNS_TYPES[random.nextInt(3)];

            String phone1 = recordMap.get("phone1");
            String phoneType1 = PHONE_TYPES[random.nextInt(4)];

            String phone2 = recordMap.get("phone2");
            String phoneType2 = PHONE_TYPES[random.nextInt(4)];
            log.info(contact.toString());

            ContactExpansionEntity contactExpansion = ContactExpansionEntity.builder()
                    .contactID(contact.getId())
                    .phone(phone1)
                    .phoneType(phoneType1)
                    .address(fullAddress)
                    .addressType(addressType)
                    .email(email)
                    .sns(sns)
                    .snsType(snsType)
                    .build();
            log.info(contactExpansion.toString());
            contactMapper.insertContactExpansion(contactExpansion);

            contactExpansion = ContactExpansionEntity.builder()
                    .contactID(contact.getId())
                    .phone(phone2)
                    .phoneType(phoneType2)
                    .build();
            log.info(contactExpansion.toString() + "\n");
            contactMapper.insertContactExpansion(contactExpansion);
        }
    }

}

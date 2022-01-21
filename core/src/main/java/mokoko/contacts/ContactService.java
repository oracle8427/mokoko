package mokoko.contacts;

import mokoko.error.BadRequestException;
import mokoko.util.CSVUtil;
import mokoko.util.StringUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.Reader;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class ContactService {

    private final Logger log = LoggerFactory.getLogger(getClass());

    private final ContactMapper contactMapper;

    public ContactService(ContactMapper contactMapper) {
        this.contactMapper = contactMapper;
    }

    public List<Contact> getAllContacts(String userID) {
        return contactMapper.selectAllContacts(userID);
    }

    public Contact getContact(int id) {
        return contactMapper.selectContact(id);
    }

    public List<Contact> getGroupContacts(Map<String, Object> params) {
        return contactMapper.selectGroupContacts(params);
    }

    public List<Integer> getIDListAtGroup(int groupID) {
        return contactMapper.selectIDListAtGroup(groupID);
    }

    public int getAllCount(Map<String, Object> params) {
        return contactMapper.selectAllCount(params);
    }

    public int getImportantCount(Map<String, Object> params) {
        return contactMapper.selectImportantCount(params);
    }

    public int getRecentCount(Map<String, Object> params) {
        return contactMapper.selectRecentCount(params);
    }

    public int unLinkGroupByContactID(int contactID) {
        return contactMapper.unlinkGroup(contactID);
    }

    @Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
    public void deleteContact(int id) {
        // 최근 주소록에서 제거
        contactMapper.deleteContactRecent(id);

        // 주소록 확장 정보 제거
        contactMapper.deleteContactExpansion(id);

        // 주소록이 속해있는 모든 그룹과의 연결 해제
        unLinkGroupByContactID(id);

        // 주소록 제거
        contactMapper.deleteContact(id);
    }

    @Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
    public void moveToTrash(List<?> idList, int trashID) {
        if (idList == null || idList.size() == 0)
            return;

        Map<String, Object> params = new HashMap<>();
        params.put("idList", idList);
        params.put("groupID", trashID);
        contactMapper.unlinkAllGroup(idList);
        contactMapper.moveToGroup(params);
        for (Object contactID : idList) {
            params.put("id", contactID);
            params.put("important", 0);
            contactMapper.updateContact(params);
        }
    }

    @Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
    public void moveToGroup(List<?> contactIDList, List<?> groupIDList) {
        contactMapper.unlinkAllGroup(contactIDList);
        if (groupIDList.size() > 0) {
            Map<String, Object> params = new HashMap<>();
            params.put("idList", contactIDList);
            for (Object groupID : groupIDList) {
                params.put("groupID", groupID);
                contactMapper.moveToGroup(params);
            }
        }
    }

    public void importCSV(Reader reader, String ownerID) throws IOException {
        if (ownerID == null || ownerID.trim().length() == 0)
            throw new BadRequestException("ownerID is null");

        List<Map<String, String>> records = CSVUtil.parseCSV(reader);
        List<ContactExpansionEntity> contactExpansions = new ArrayList<>();
        for (Map<String, String> recordMap : records) {
            String firstname = recordMap.get(ContactRecord.NAME);
            if (StringUtil.isBlank(firstname)) {
                log.warn("Warning at ContactService.importCSV name is null. " + recordMap);
                continue;
            }

            ContactEntity contactEntity = ContactEntity.builder()
                    .userID(ownerID)
                    .firstname(firstname)
                    .lastname(recordMap.get(ContactRecord.LAST_NAME))
                    .nickname(recordMap.get(ContactRecord.NICKNAME))
                    .birth(recordMap.get(ContactRecord.DATE_OF_BIRTH))
                    .organization(recordMap.get(ContactRecord.COMPANY))
                    .position(recordMap.get(ContactRecord.TITLE))
                    .notes(recordMap.get(ContactRecord.MEMO))
                    .build();
            contactMapper.insertContact(contactEntity);

            // 이메일/전화번호/기념일/SNS/메신저/주소
            List<String> emailList = new ArrayList<>();
            List<String> phoneList = new ArrayList<>();
            List<String> anniversaryList = new ArrayList<>();
            List<String> snsList = new ArrayList<>();
            List<String> messengerList = new ArrayList<>();
            List<String> addressList = new ArrayList<>();
            int optionalCount = 0;
            for (String key : recordMap.keySet()) {
                if (optionalCount == 30) {
                    log.warn("Too many options. " + recordMap);
                    break;
                }

                String value = StringUtil.trim(recordMap.get(key));
                if (StringUtil.isBlank(value))
                    continue;

                String trimKey = key.trim();
                optionalCount++;
                if (trimKey.contains(ContactRecord.EMAIL)) {
                    emailList.add(value);
                } else if (trimKey.contains(ContactRecord.PHONE_NUMBER)) {
                    phoneList.add(value);
                } else if (trimKey.contains(ContactRecord.ANNIVERSARY)) {
                    anniversaryList.add(value);
                } else if (trimKey.contains(ContactRecord.SNS)) {
                    snsList.add(value);
                } else if (trimKey.contains(ContactRecord.MSG)) {
                    messengerList.add(value);
                } else if (trimKey.contains(ContactRecord.ADDRESS)) {
                    addressList.add(value);
                } else {
                    optionalCount--;
                }
            }

            int maxSize = Collections.max(Arrays.asList(
                    emailList.size(),
                    phoneList.size(),
                    anniversaryList.size(),
                    snsList.size(),
                    messengerList.size(),
                    addressList.size()
            ));
            for (int i = 0; i < maxSize; i++) {
                ContactExpansionEntity.Builder builder = ContactExpansionEntity.builder();
                builder.contactID(contactEntity.getId());
                if (i < emailList.size())
                    builder.email(emailList.get(i));

                if (i < snsList.size())
                    builder.messenger(messengerList.get(i));

                String value;
                if (i < phoneList.size()) {
                    value = phoneList.get(i);
                    String[] anniversaryEntity = StringUtil.split(value, ",");
                    if (anniversaryEntity != null) {
                        builder.phone(anniversaryEntity[0].trim());
                        builder.phoneType(ContactExpansion.PHONE_TYPE.getOrDefault(
                                anniversaryEntity[1].trim(),
                                ContactExpansion.DEFAULT_PHONE_TYPE));
                    } else {
                        builder.phone(value);
                        builder.phoneType(ContactExpansion.DEFAULT_PHONE_TYPE);
                    }
                }

                if (i < anniversaryList.size()) {
                    value = anniversaryList.get(i);
                    String[] anniversaryEntity = StringUtil.split(value, ",");
                    if (anniversaryEntity != null) {
                        builder.specialDay(anniversaryEntity[0].trim());
                        builder.specialDayType(ContactExpansion.ANNIVERSARY_TYPE.getOrDefault(
                                anniversaryEntity[1].trim(),
                                ContactExpansion.DEFAULT_ANNIVERSARY_TYPE));
                    } else {
                        builder.specialDay(value);
                        builder.specialDayType(ContactExpansion.DEFAULT_ANNIVERSARY_TYPE);
                    }
                }

                if (i < snsList.size()) {
                    value = snsList.get(i);
                    String[] snsEntity = StringUtil.split(value, ",");
                    if (snsEntity != null) {
                        builder.sns(snsEntity[0].trim());
                        builder.snsType(ContactExpansion.SNS_TYPE.getOrDefault(
                                snsEntity[1].trim(),
                                ContactExpansion.DEFAULT_SNS_TYPE));
                    } else {
                        builder.sns(value);
                        builder.snsType(ContactExpansion.DEFAULT_SNS_TYPE);
                    }
                }

                if (i < addressList.size()) {
                    value = addressList.get(i);
                    String[] addressEntity = StringUtil.split(value, ",");
                    if (addressEntity != null) {
                        builder.address(addressEntity[0].trim());
                        builder.addressType(ContactExpansion.ADDRESS_TYPE.getOrDefault(
                                addressEntity[1].trim(),
                                ContactExpansion.DEFAULT_ADDRESS_TYPE));
                    } else {
                        builder.address(value);
                        builder.addressType(ContactExpansion.DEFAULT_ADDRESS_TYPE);
                    }
                }
                contactExpansions.add(builder.build());
            }
        }
        if (contactExpansions.size() > 0)
            contactMapper.insertContactExpansions(contactExpansions);
    }

    @Transactional(rollbackFor = Exception.class)
    public void createContact(Contact contact) {
        if (contact.getFirstname() == null || contact.getFirstname().trim().length() == 0)
            throw new BadRequestException("firstname is null");

        int affectedRows = contactMapper.insertContact(contact);
        if (affectedRows > 0 && contact.getContactExpansions() != null && contact.getContactExpansions().size() > 0) {
            for (ContactExpansion expansion : contact.getContactExpansions()) {
                expansion.setContactID(contact.getId());
                expansion.validateFields();
            }
            contactMapper.insertContactExpansions(contact.getContactExpansions());
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public void putContact(Contact contact) {
        if (contact == null || contact.getId() == 0 ||
                contact.getFirstname() == null || contact.getFirstname().trim().length() == 0)
            throw new BadRequestException("firstname is null");

        moveToGroup(Collections.singletonList(contact.getId()),
                contact.getGroups() == null ? Collections.emptyList() :
                        contact.getGroups()
                                .stream()
                                .map(Group::getId)
                                .collect(Collectors.toList()));

        int affectedRows = contactMapper.updateContact(contact);
        contactMapper.deleteContactExpansion(contact.getId());
        if (affectedRows > 0 && contact.getContactExpansions() != null) {
            for (ContactExpansion expansion : contact.getContactExpansions()) {
                expansion.setContactID(contact.getId());
            }
            contactMapper.insertContactExpansions(contact.getContactExpansions());
        }
    }

    public void updateContact(Contact contact) {
        contactMapper.updateContact(contact);
    }


}

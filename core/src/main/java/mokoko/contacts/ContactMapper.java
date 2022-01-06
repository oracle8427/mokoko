package mokoko.contacts;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface ContactMapper {

    List<Contact> selectAllContacts(String userID);

    List<Contact> selectGroupContacts(Map<String, Object> params);

    List<Integer> selectIDListAtGroup(int groupID);

    int selectAllCount(Map<String, Object> params);

    int selectImportantCount(Map<String, Object> params);

    int selectRecentCount(Map<String, Object> params);

    int deleteContact(int id);

    int deleteContactExpansion(int contactID);

    int deleteContactRecent(int contactID);

    int unlinkGroup(int contactID);

}

package mokoko.contacts;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface ContactMapper {

    List<Contact> selectContacts();

    int selectAllCount(Map<String, Object> params);

    int selectImportantCount(Map<String, Object> params);

    int selectRecentCount(Map<String, Object> params);

    int deleteGroupID(int groupID);

}

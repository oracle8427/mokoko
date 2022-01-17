package mokoko.contacts;

import java.util.HashMap;
import java.util.Map;

public class ContactExpansion extends ContactExpansionEntity {

    public void setContactID(int contactID) {
        this.contactID = contactID;
    }

    public static final String DEFAULT_PHONE_TYPE = "home";
    public static final Map<String, String> PHONE_TYPE = new HashMap<String, String>() {{
        put("집", "home");
        put("직장", "company");
        put("휴대폰", "mobile");
        put("팩스", "fax");
        put("기타", "etc");
    }};

    public static final String DEFAULT_ANNIVERSARY_TYPE = "anniversary";
    public static final Map<String, String> ANNIVERSARY_TYPE = new HashMap<String, String>() {{
        put("기념일", "anniversary");
        put("기타", "etc");
    }};

    public static final String DEFAULT_SNS_TYPE = "blog";
    public static final Map<String, String> SNS_TYPE = new HashMap<String, String>() {{
        put("블로그", "blog");
        put("홈페이지", "homepage");
        put("기타", "etc");
    }};

    public static final String DEFAULT_ADDRESS_TYPE = "home";
    public static final Map<String, String> ADDRESS_TYPE = new HashMap<String, String>() {{
        put("집", "home");
        put("직장", "company");
        put("기타", "etc");
    }};

    public void validateFields() {
        if (phoneType == null || phoneType.length() == 0)
            phoneType = DEFAULT_PHONE_TYPE;
        if (addressType == null || addressType.length() == 0)
            addressType = DEFAULT_ADDRESS_TYPE;
        if (specialDayType == null || specialDayType.length() == 0)
            specialDayType = DEFAULT_ANNIVERSARY_TYPE;
        if (snsType == null || snsType.length() == 0)
            snsType = DEFAULT_SNS_TYPE;
    }

}

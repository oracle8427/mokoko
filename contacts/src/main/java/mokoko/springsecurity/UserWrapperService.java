package mokoko.springsecurity;

import org.springframework.stereotype.Service;

@Service
public class UserWrapperService {

    public UserWrapper getUserWrapper() {
        return new UserWrapper();
    }

    public String getUsername() {
        UserWrapper userWrapper = getUserWrapper();
        return userWrapper.getUsername();
    }

}

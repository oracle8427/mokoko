package mokoko.user;

import org.springframework.stereotype.Service;

@Service
public class UserWrapperService {

    public String getUsername() {
        // TODO: spring security
        return "mailmaster@mokoko.shop";
    }

}

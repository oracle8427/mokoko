package mokoko.springsecurity;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

public class UserWrapper {

    private UserDetails userDetails;

    public UserWrapper() {
        SecurityContext context = SecurityContextHolder.getContext();
        Authentication authentication = context.getAuthentication();
        if (authentication == null) {
            return;
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails) {
            userDetails = (UserDetails) principal;
        }
    }

    public String getUsername() {
        String username = "";
        if (userDetails != null) {
            username = userDetails.getUsername();
        }
        return username;
    }
}

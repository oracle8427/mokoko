package mokoko.springsecurity;

import org.springframework.security.web.util.matcher.RegexRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

import javax.servlet.http.HttpServletRequest;

public class CsrfRequestMatcher implements RequestMatcher {

    private final RegexRequestMatcher protectedMatcher = new RegexRequestMatcher("/j_spring_security_check", null);

    @Override
    public boolean matches(HttpServletRequest httpServletRequest) {
        return protectedMatcher.matches(httpServletRequest);
    }
}

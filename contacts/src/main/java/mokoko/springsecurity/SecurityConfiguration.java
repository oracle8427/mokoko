package mokoko.springsecurity;

import mokoko.user.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.util.matcher.RequestMatcher;

@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public RequestMatcher requestMatcher() {
        return new CsrfRequestMatcher();
    }

    @Bean
    public UserDetailsService userDetailsService(UserService userService) {
        return new ContactUserDetailsService(userService);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .antMatchers("/errors/**", "/img/**", "/js/lib/**", "/login", "/j_spring_security_check")
                .permitAll()
                .antMatchers("/**").hasAuthority("ROLE_USER")
                .anyRequest().authenticated();

        http.csrf().requireCsrfProtectionMatcher(requestMatcher());

        http.formLogin()
                .usernameParameter("j_username")
                .passwordParameter("j_password")
                .loginPage("/login")
                .loginProcessingUrl("/j_spring_security_check");

        http.logout()
                .deleteCookies("JSESSIONID")
                .invalidateHttpSession(true)
                .logoutUrl("/logout")
                .logoutSuccessUrl("/");
    }

}

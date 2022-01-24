package mokoko;

import com.zaxxer.hikari.HikariDataSource;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;

import javax.sql.DataSource;
import java.util.Arrays;

@SpringBootApplication(scanBasePackages = {"mokoko"})
public class ContactsApplication extends SpringBootServletInitializer {
    private static final Logger LOG = LoggerFactory.getLogger(ContactsApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(ContactsApplication.class, args);
        LOG.info("Logger Class: " + LOG.getClass().getName());
    }

    @Configuration
    @MapperScan(value = {"mokoko"})

    public static class DatabaseConfig {

        @Value("${spring.datasource.name}")
        private String name;

        @Bean
        @ConfigurationProperties("spring.datasource.hikari")
        public DataSource dataSource() {
            return DataSourceBuilder.create().type(HikariDataSource.class).build();
        }

        @Bean
        public SqlSessionFactory sqlSessionFactory(DataSource dataSource, ApplicationContext applicationContext)
                throws Exception {
            SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
            sqlSessionFactoryBean.setDataSource(dataSource);
            sqlSessionFactoryBean.setTypeAliasesPackage("mokoko");

            String resourcePattern = "classpath*:/mappers/mokoko/**/*Mapper." + name + ".xml";
            Resource[] resources = applicationContext.getResources(resourcePattern);
            sqlSessionFactoryBean.setMapperLocations(resources);
            if (LOG.isDebugEnabled()) {
                LOG.debug("Mapper resources location: ");
                Arrays.stream(resources).forEach(resource -> LOG.debug("\t" + resource.toString()));
                LOG.debug("// Mapper resources location");
            }
            return sqlSessionFactoryBean.getObject();
        }

        @Bean
        public SqlSessionTemplate sqlSessionTemplate(SqlSessionFactory sqlSessionFactory) {
            return new SqlSessionTemplate(sqlSessionFactory);
        }
    }

}

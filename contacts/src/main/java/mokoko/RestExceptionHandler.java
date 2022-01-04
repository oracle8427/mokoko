package mokoko;

import mokoko.error.BadRequestException;
import mokoko.error.NotFoundException;
import mokoko.error.UnauthorizedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class RestExceptionHandler {

    private final Logger log = LoggerFactory.getLogger(getClass());

    @ExceptionHandler
    public ResponseEntity<?> handleException(Exception e) {
        log.error(e.getMessage(), e);

        Map<String, Object> responseMap = new HashMap<>();
        try {
            String message = e.getMessage();
            String stacktrace = getStackTrace(e);
            if (!log.isDebugEnabled() ||
                    (message != null && message.length() > 0 && message.contains("Error querying database"))) {
                message = "";
                stacktrace = "";
            }
            responseMap.put("message", message);
            responseMap.put("stacktrace", stacktrace);
        } catch (Exception localException) {
            log.error("Error at RestExceptionHandler.handleException", localException);
        }

        if (e instanceof BadRequestException) {
            return new ResponseEntity<>(responseMap, HttpStatus.BAD_REQUEST);
        } else if (e instanceof NotFoundException) {
            return new ResponseEntity<>(responseMap, HttpStatus.NOT_FOUND);
        } else if (e instanceof UnauthorizedException) {
            return new ResponseEntity<>(responseMap, HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity<>(responseMap, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private String getStackTrace(Throwable thrown) {
        StringWriter sw = new StringWriter();
        thrown.printStackTrace(new PrintWriter(sw));
        return sw.toString();
    }

}

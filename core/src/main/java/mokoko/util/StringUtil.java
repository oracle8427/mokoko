package mokoko.util;

public class StringUtil {

    public static String trim(String str) {
        if (str == null)
            return null;
        return str.trim();
    }

    public static boolean isBlank(String str) {
        return str == null || str.length() == 0;
    }

    public static String[] split(String value, String delimiter) {
        if (!isBlank(delimiter)) {
            int pivot = value.indexOf(delimiter);
            if (pivot > 0) {
                return new String[] {
                        value.substring(0, pivot),
                        value.substring(pivot + 1)
                };
            }
        }
        return null;
    }

}

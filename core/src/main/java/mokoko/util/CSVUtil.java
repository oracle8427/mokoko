package mokoko.util;

import mokoko.error.FileTooLargeException;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;

import java.io.*;
import java.util.*;

public class CSVUtil {

    public static List<Map<String, String>> parseCSV(File file) throws IOException {
        if (file == null || !file.exists())
            throw new FileNotFoundException("Not found file (CSV)");

        // 30MB
        if (file.length() > 31457280)
            throw new FileTooLargeException("File is too big. size: " + file.length());

        try (BufferedReader bufferedReader = new BufferedReader(new FileReader(file))) {
            return parseCSV(bufferedReader);
        }
    }

    public static List<Map<String, String>> parseCSV(Reader reader) throws IOException {
        CSVParser parser = parse(reader);
        List<Map<String, String>> list = new ArrayList<>();
        for (CSVRecord record : parser.getRecords()) {
            Map<String, String> recordMap = record.toMap();
            list.add(recordMap);
        }
        parser.close();
        return list;
    }

    public static CSVParser parse(Reader reader) throws IOException {
        BufferedReader bufferedReader;
        if (reader instanceof BufferedReader)
            bufferedReader = (BufferedReader) reader;
        else
            bufferedReader = new BufferedReader(reader);

        return new CSVParser(bufferedReader, CSVFormat.Builder.create().setHeader().build());
    }


}

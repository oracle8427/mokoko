package mokoko.contacts;

import mokoko.Paginator;
import mokoko.util.StringUtil;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class ContactPaginator extends Paginator {

    List<Contact> edges = new ArrayList<>();

    private String userID;

    private String groupID;

    protected String getUserID() {
        return userID;
    }

    public List<Contact> getEdges() {
        return edges;
    }

    public void setEdges(List<Contact> edges) {
        this.edges = edges;
    }

    public void setParameters(Map<String, Object> params) {
        if (params == null || params.size() == 0)
            return;

        Object value = params.getOrDefault("userID", "");
        this.userID = String.valueOf(value);

        value = params.getOrDefault("groupID", "");
        this.groupID = String.valueOf(value);

        String endCursor = String.valueOf(params.getOrDefault("endCursor", "0"));
        if (StringUtil.isNumeric(endCursor))
            this.endCursor = Integer.parseInt(endCursor);

        if (perPage <= 0)
            this.perPage = 100;
    }

    public void setTotalRecords(int totalRecords) {
        if (totalRecords == 0 || endCursor + perPage >= totalRecords)
            hasNext = false;

        if (endCursor + perPage < totalRecords)
            hasNext = true;

        this.totalRecords = totalRecords;
        this.endCursor += perPage;
        if (totalRecords <= endCursor)
            endCursor = totalRecords;
    }

}

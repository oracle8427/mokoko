package mokoko;

import com.fasterxml.jackson.annotation.JsonProperty;

public abstract class Paginator {

    @JsonProperty(value="hasNext")
    protected boolean hasNext = false;

    protected int endCursor = 0;

    protected int perPage = 100;

    protected int totalRecords = 0;

    public boolean hasNext() {
        return hasNext;
    }

    public int getEndCursor() {
        return endCursor;
    }

    public int getPerPage() {
        return perPage;
    }

    public int getTotalRecords() {
        return totalRecords;
    }

}

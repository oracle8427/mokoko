package mokoko.contacts;

import java.util.List;

public class Contact extends ContactEntity {

	private List<ContactExpansion> contactExpansions;

	public List<ContactExpansion> getContactExpansions() {
		return contactExpansions;
	}

	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("\n").append(super.toString());
		if (contactExpansions != null && contactExpansions.size() > 0) {
			sb.append("\n\tcontactExpansions=[\n");
			for (ContactExpansion contactExpansion : contactExpansions)
				sb.append("\t\t").append(contactExpansion).append("\n");
			sb.append('\t');
		}
		return sb.toString();
	}
}

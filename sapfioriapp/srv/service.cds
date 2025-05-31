

service AttributeService {
  entity Attributes {
    key attributeExternalId   : String(5000);
        personExternalId      : String(5000);
        personIdentifierType  : String(5000);
        proficiencyLevel      : Integer;
        proficiencyAssignedDate : DateTime;
        preferenceValue       : Integer;
        status                : String(5000);
        lastModifiedBy        : String(5000);
        lastModifiedAt        : String(5000);
        expectedRating        : Integer;
  }
}

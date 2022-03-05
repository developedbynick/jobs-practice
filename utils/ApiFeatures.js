class APIFeatures {
  constructor(query, urlQuery) {
    this.query = query;
    this.urlQuery = urlQuery;
  }

  filter() {
    // Making a copy of the urlQuery
    let urlQueryCopy = { ...this.urlQuery };
    // Adding some fields to excluded
    const excludedFields = ["page", "sort", "limit", "fields"];
    // Excluding fields
    excludedFields.forEach((field) => delete urlQueryCopy[field]);
    // Making the urlQueryCopy a string
    urlQueryCopy = JSON.stringify(urlQueryCopy);
    // Replacing gte, gt, lte, lt, ne and eq, prefixed with $.
    urlQueryCopy = urlQueryCopy.replace(
      /\b(gte|gt|lte|lt|ne|eq)\b/g,
      (match) => `$${match}`
    );
    // Editing the query.
    this.query = this.query.find(JSON.parse(urlQueryCopy));
    // Returning this.
    return this;
  }

  limit() {
    // prettier-ignore
    // eslint-disable-next-line max-len
    // Checking if there is a fields property on the urlQuery. If there isn't add a field to be excluded
    if (!this.urlQuery.fields) this.urlQuery = { ...this.urlQuery, fields: "-__v" };
    // Formatting the string in a way mongoose can understand it.
    const fieldsToLimit = this.urlQuery.fields.split(",").join(" ");
    // Editing the query
    this.query = this.query.select(`${fieldsToLimit}`);
    // Returning the query.
    return this;
  }

  paginate() {
    //  Getting the page from the urlQUeryObj || using 1;
    const page = +this.urlQuery.page || 1;
    // Getting the page from the urlQUeryObj || using 10;
    const limit = +this.urlQuery.limit || 10;
    // Calculating how many documents to skip before returning documents
    const skip = (page - 1) * limit;
    // Editing the query
    this.query = this.query.skip(skip).limit(limit);
    // Returning this
    return this;
  }

  sort() {
    //   prettier-ignore
    // eslint-disable-next-line max-len
    // Checking if there is a sort property on the urlQuery. If there isn't add a field to be sorted
    if (!this.urlQuery.sort) this.urlQuery = { ...this.urlQuery, sort: "createdAt,title" };
    // eslint-disable-next-line max-len
    // If there are multiple fields to be sorted by, we extract them and replace the comma with a space.
    const fieldsToSort = this.urlQuery.sort.split(",").join(" ");
    // Editing the query
    this.query = this.query.sort(fieldsToSort);
    // Returning this
    return this;
  }
}
module.exports = APIFeatures;

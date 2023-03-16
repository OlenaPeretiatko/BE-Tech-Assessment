module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      acronym: String,
      definition: String
    }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Acronym = mongoose.model("acronym", schema);
  return Acronym;
};
let ThaiAddressParser = function (address = null) {
  this.rawAddress = null;
  if (address)  this.setAddress(address);
};

ThaiAddressParser.prototype.setAddress = function (address) {
  if (typeof address == typeof '' && address) {
    this.rawAddress = address;
    this.parse();
  } else {
    throw new Error("Given address is empty, or not be string.");
  }
};

ThaiAddressParser.prototype.parse = function () {
  let keys = ["buildingNo", "buildingTitle", "floor", "alley", "street", "subDistrict", "district", "province", "postalCode"],
  self = this;
  self.parsed = {};
  keys.forEach(function (key) {self.parsed[key] = self[`_${key}Parse`]()});
  self.parsed._raw = self.rawAddress;
};


ThaiAddressParser.prototype._buildingNoParse = function () {
  return (
    this._returnSimpleMatched(/^\s*([1-9][0-9]*\s*\-\s*[1-9][0-9]*|[1-9][0-9]*\s*\/\s*[1-9][0-9]*|[1-9][0-9]*)(?:[^0-9])/) ||
    this._returnSimpleMatched(/(?:บ้านเลขที่|เลขที่)\s*([1-9][0-9]*\s*\-\s*[1-9][0-9]*|[1-9][0-9]*\s*\/\s*[1-9][0-9]*|[1-9][0-9]*)(?:[^0-9])/)
  );
};

ThaiAddressParser.prototype._buildingTitleParse = function () {
  return (
    this._returnSimpleMatched(/(?:^|\s+)(?:อาคาร|ตึก)\s*([^\s]+)/)
  );
};

ThaiAddressParser.prototype._floorParse = function () {
  return (
    this._returnSimpleMatched(/(?:ชั้น|ชั้นที่)\s*([0-9a-z]{1,3})/i) ||
    this._returnSimpleMatched(/([0-9a-z]{1,3})\s*(?:fl\.?|floor)\s+/i)
  );
};

ThaiAddressParser.prototype._alleyParse = function () {
  return null;
};

ThaiAddressParser.prototype._streetParse = function () {
  return null;
};

ThaiAddressParser.prototype._subDistrictParse = function () {
  return null;
};

ThaiAddressParser.prototype._districtParse = function () {
  return null;
};

ThaiAddressParser.prototype._provinceParse = function () {
  return null;
};

ThaiAddressParser.prototype._postalCodeParse = function () {
  return (
    this._returnSimpleMatched(/(?:รหัสไปรษณีย์|รหัส\s*ป\s*\.?\s*ณ\s*\.)\s*([1-9][0-9]{4})(?:[^0-9]*)/) ||
    this._returnSimpleMatched(/(?:[^0-9])\s*([1-9][0-9]{4})\s*$/)
  );
};

ThaiAddressParser.prototype._returnSimpleMatched = function (regexp, groupReturned = 1) {
  var matched = this.rawAddress.match(regexp);
  return matched ? matched[groupReturned || 1] : null;
};


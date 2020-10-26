/**
 * ThaiAddressParser JS
 * 
 * @author ihut.sovoboys.net
 * @copyright 2020
 * @license Unlicense
 */

let ThaiAddressParser = function (address = null) {
  this.rawAddress = null;

  // reserve [1] for (assume as) subdistrict, [2] for (assume as) district, then [3] for province
  this._regexProvinces = /(\S+)\s*(\S+)\s*(?:จ\.|จังหวัด|)\s*(กระบี่|กาญจนบุรี|กาฬสินธุ์|กำแพงเพชร|ขอนแก่น|จันทบุรี|ฉะเชิงเทรา|ชลบุรี|ชัยนาท|ชัยภูมิ|ชุมพร|เชียงราย|เชียงใหม่|ตรัง|ตราด|ตาก|นครนายก|นครปฐม|นครพนม|นครราชสีมา|นครศรีธรรมราช|นครสวรรค์|นนทบุรี|นราธิวาส|น่าน|บึงกาฬ|บุรีรัมย์|ปทุมธานี|ประจวบคีรีขันธ์|ปราจีนบุรี|ปัตตานี|พะเยา|พังงา|พัทลุง|พิจิตร|พิษณุโลก|เพชรบุรี|เพชรบูรณ์|แพร่|ภูเก็ต|มหาสารคาม|มุกดาหาร|แม่ฮ่องสอน|ยโสธร|ยะลา|ร้อยเอ็ด|ระนอง|ระยอง|ราชบุรี|ลพบุรี|ลำปาง|ลำพูน|เลย|ศรีสะเกษ|สกลนคร|สงขลา|สตูล|สมุทรปราการ|สมุทรสงคราม|สมุทรสาคร|สระแก้ว|สระบุรี|สิงห์บุรี|สุโขทัย|สุพรรณบุรี|สุราษฎร์ธานี|สุรินทร์|หนองคาย|หนองบัวลำภู|อ่างทอง|อำนาจเจริญ|อุดรธานี|อุตรดิตถ์|อุทัยธานี|อุบลราชธานี|[\S]*อยุธยา|ก\.?ท\.?ม\.|กรุงเทพ[\S]*)\s+/;
  
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
  let keys = ["buildingNo", "buildingTitle", "floor", "villageNo", "alley", "street", "subDistrict", "district", "province", "postalCode"],
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
    this._returnSimpleMatched(/(?:^|\s+)(?:อาคาร|ตึก)\s*([\S]+.*)(?:\s*ชั้น)/) ||
    this._returnSimpleMatched(/(?:^|\s+)(?:อาคาร|ตึก)\s*([\S]+.*)(?:\s*[\d].*floor|[\d].*fl\.)/) ||
    this._returnSimpleMatched(/(?:^|\s+)(?:อาคาร|ตึก)\s*([\S]+)/)
  );
};

ThaiAddressParser.prototype._floorParse = function () {
  return (
    this._returnSimpleMatched(/(?:ชั้น|ชั้นที่)\s*([0-9a-z]{1,3})/i) ||
    this._returnSimpleMatched(/([0-9a-z]{1,3})\s*(?:fl\.?|floor)\s+/i)
  );
};

ThaiAddressParser.prototype._villageNoParse = function () {
  return (
    this._returnSimpleMatched(/(?:หมู่ที่|หมู่|ม.)\s*([0-9]{1,2})/i)
  );
};

ThaiAddressParser.prototype._alleyParse = function () {
  return (
    this._returnSimpleMatched(/(?:ซอย|ซ.)\s*(\D+\s*[1-9][0-9]{0,2}|\S+)\s*[^\d]+/i)
  );
};

ThaiAddressParser.prototype._streetParse = function () {
  return (
    this._returnSimpleMatched(/(?:ถนน|ถ.)\s*([\S]+)/i)
  );
};

ThaiAddressParser.prototype._subDistrictParse = function () {
  return (
    this._returnSimpleMatched(/(?:แขวง|ตำบล|ต\.)\s*([\S]+)/i) ||
    this._returnSimpleMatched(this._regexProvinces, 1)
  );
};

ThaiAddressParser.prototype._districtParse = function () {
  return (
    this._returnSimpleMatched(/(?:เขต|อำเภอ|อ\.)\s*([\S]+)/i) ||
    this._returnSimpleMatched(this._regexProvinces, 2)
  );
};

ThaiAddressParser.prototype._provinceParse = function () {
  return (
    this._returnSimpleMatched(this._regexProvinces, 3)
  );
};

ThaiAddressParser.prototype._postalCodeParse = function () {
  return (
    this._returnSimpleMatched(/(?:รหัสไปรษณีย์|รหัส\s*ป\s*\.?\s*ณ\s*\.)\s*([1-9][0-9]{4})(?:[^0-9]*)/) ||
    this._returnSimpleMatched(/(?:[^0-9])\s*([1-9][0-9]{4})\s*$/, -1)
  );
};

ThaiAddressParser.prototype._returnSimpleMatched = function (regexp, groupReturned = 1) {
  var matched = this.rawAddress.match(regexp);
  if (matched) {
    if (groupReturned < 0) {
      return matched[matched.length + groupReturned];
    }
    return matched[groupReturned];
  }
  return null;
};
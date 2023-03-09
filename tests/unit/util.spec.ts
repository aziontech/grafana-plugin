import { flatten, isRFC3339_ISO6801 } from '../../src/util';

describe('util functions', () => {
  describe('flatten function', () => {
    test('should flatten an object', () => {
      let obj = {
        string: 'hello',
        number: 123,
        float: 123.4,
        null: null,
        undefined: undefined,
        array: [1, 2, 3],
        nested: {
          string: 'hello',
          number: 123,
          float: 123.4,
          null: null,
          undefined: undefined,
        },
      };

      let flattenObj = {
        string: 'hello',
        number: 123,
        float: 123.4,
        null: null,
        undefined: undefined,
        'array.0': 1,
        'array.1': 2,
        'array.2': 3,
        'nested.string': 'hello',
        'nested.number': 123,
        'nested.float': 123.4,
        'nested.null': null,
        'nested.undefined': undefined,
      };

      expect(flatten(obj)).toEqual(flattenObj);
    });
  });

  describe('isRFC3339_ISO6801 function', () => {
    test('should return false for non-date strings', () => {
      expect(isRFC3339_ISO6801('I am not a date but a string')).toBe(false);
      expect(isRFC3339_ISO6801('1234')).toBe(false);
      expect(isRFC3339_ISO6801(String(8))).toBe(false);
      expect(isRFC3339_ISO6801(String(null))).toBe(false);
      expect(isRFC3339_ISO6801(String(true))).toBe(false);
      expect(isRFC3339_ISO6801(String(0))).toBe(false);
      expect(isRFC3339_ISO6801(String(Number.MAX_SAFE_INTEGER))).toBe(false);
      expect(isRFC3339_ISO6801(String(0.111111))).toBe(false);
    });

    test('should return true for valid date strings', () => {
      expect(isRFC3339_ISO6801('2020-06-01T00:00:00.000Z')).toBe(true);
      expect(isRFC3339_ISO6801('2020-06-01T00:00:00Z')).toBe(true);
    });

    test('should return true for valid date strings without seconds fraction', () => {
      expect(isRFC3339_ISO6801('2020-06-01T00:00:00.00Z')).toBe(true);
      expect(isRFC3339_ISO6801('2020-06-01T00:00:00.0Z')).toBe(true);
      expect(isRFC3339_ISO6801('2020-06-01T00:00:00Z')).toBe(true);
    });

    test('should return false for invalid date strings', () => {
      expect(isRFC3339_ISO6801('2020-06-01')).toBe(false);
      expect(isRFC3339_ISO6801('01-06-2020')).toBe(false);
      expect(isRFC3339_ISO6801('2020-13-01T00:00:00Z')).toBe(false);
      expect(isRFC3339_ISO6801('2020-01-01T24:00:00Z')).toBe(false);
      expect(isRFC3339_ISO6801('2020-01-01T23:60:00Z')).toBe(false);
      expect(isRFC3339_ISO6801('2020-01-01T23:59:60Z')).toBe(false);
    });
  });
});

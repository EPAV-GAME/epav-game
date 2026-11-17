import { isDeepStrictEqual } from 'node:util';

const scalar = {
  stringValue: 'string_value', integerValue: 'integer_value', doubleValue: 'double_value',
  booleanValue: 'boolean_value', timestampValue: 'timestamp_value', bytesValue: 'bytes_value',
  referenceValue: 'reference_value',
};
const own = (obj, name) => Object.hasOwn(obj, name);
const fail = () => { throw new Error('Um campo Firestore tem uma estrutura não reconhecida. A transação foi cancelada.'); };

function canonicalTimestamp(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,6}0{0,3})?Z$/.test(value)) fail();
  return value.replace(/(\.\d*?[1-9])0+Z$/, '$1Z').replace(/\.0+Z$/, 'Z');
}

function normalizedScalar(kind, value) {
  if (kind === 'integerValue') {
    if (typeof value !== 'string' || !/^-?\d+$/.test(value)) fail();
    return String(BigInt(value));
  }
  if (kind === 'timestampValue') return canonicalTimestamp(value);
  if (kind === 'bytesValue') {
    if (typeof value !== 'string' || Buffer.from(value,'base64').toString('base64') !== value) fail();
    return value;
  }
  if (kind === 'doubleValue') {
    if (typeof value === 'number' && Number.isFinite(value)) return Object.is(value,-0) ? 0 : value;
    if (['NaN','Infinity','-Infinity'].includes(value)) return value;
    fail();
  }
  if (kind === 'booleanValue') {
    if (typeof value !== 'boolean') fail();
  } else if (typeof value !== 'string') fail();
  return value;
}

function entries(object) {
  if (!object || typeof object !== 'object' || Array.isArray(object)) fail();
  return Object.entries(object);
}

export function flatten(fields) {
  const rows = [];
  const visit = (wrapped, parent_no, field_name, array_index) => {
    const fields = entries(wrapped);
    if (fields.length !== 1) fail();
    const [[kind,value]] = fields;
    const node_no = rows.length+1;
    const row = { node_no,parent_no,field_name,array_index,kind };
    rows.push(row);
    if (kind === 'mapValue' || kind === 'arrayValue') {
      const memberKey = kind === 'mapValue' ? 'fields' : 'values';
      if (entries(value).some(([key])=>key!==memberKey)) fail();
      row.members_present = own(value,memberKey);
      if (row.members_present && kind === 'mapValue') {
        for (const [name, child] of entries(value.fields)) visit(child,node_no,name,null);
      } else if (row.members_present) {
        if (!Array.isArray(value.values)) fail();
        value.values.forEach((child,index)=>visit(child,node_no,null,index));
      }
    } else if (kind === 'geoPointValue') {
      const coords = entries(value);
      if (coords.length !== 2 || !Number.isFinite(value.latitude) || !Number.isFinite(value.longitude)) fail();
      row.latitude = value.latitude;
      row.longitude = value.longitude;
    } else if (kind === 'nullValue') {
      if (value !== null && value !== 'NULL_VALUE') fail();
    } else if (own(scalar,kind)) {
      row[scalar[kind]] = normalizedScalar(kind,value);
    } else fail();
  };
  for (const [name,value] of entries(fields)) visit(value,null,name,null);
  return rows;
}

export function rebuild(rows) {
  const root = {};
  const byNo = new Map();
  const writeMap = (map,name,value) => {
    if (typeof name !== 'string' || own(map,name)) fail();
    Object.defineProperty(map,name,{value,enumerable:true,writable:true,configurable:true});
  };
  for (const row of rows) {
    const { node_no,parent_no,field_name,array_index,kind } = row;
    if (byNo.has(node_no)) fail();
    let wrapped;
    if (kind === 'mapValue') wrapped = {mapValue:row.members_present?{fields:{}}:{}};
    else if (kind === 'arrayValue') wrapped = {arrayValue:row.members_present?{values:[]}:{}};
    else if (kind === 'geoPointValue') wrapped = {geoPointValue:{latitude:row.latitude,longitude:row.longitude}};
    else if (kind === 'nullValue') wrapped = {nullValue:null};
    else if (own(scalar,kind)) wrapped = {[kind]:normalizedScalar(kind,row[scalar[kind]])};
    else fail();
    const parent = byNo.get(parent_no);
    if (parent_no === null && array_index === null) writeMap(root,field_name,wrapped);
    else if (parent?.mapValue?.fields && array_index === null) writeMap(parent.mapValue.fields,field_name,wrapped);
    else if (parent?.arrayValue?.values && array_index === parent.arrayValue.values.length && field_name === null) parent.arrayValue.values.push(wrapped);
    else fail();
    byNo.set(node_no,wrapped);
  }
  return root;
}

export function verifyFields(original, rows) {
  const canonical = rebuild(flatten(original));
  if (!isDeepStrictEqual(canonical,rebuild(rows))) {
    throw new Error('A reconstrução de um documento divergiu da origem. A transação foi cancelada.');
  }
}

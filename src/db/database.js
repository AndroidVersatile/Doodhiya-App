// src/db/database.js
import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

const DB_NAME = 'milk_admin.db';

let dbInstance = null;

export const getDBConnection = async () => {
  if (dbInstance) return dbInstance;
  dbInstance = await SQLite.openDatabase({ name: DB_NAME, location: 'default' });
  return dbInstance;
};

export const createTables = async () => {
  const db = await getDBConnection();
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_code TEXT,
      name TEXT,
      address TEXT,
      city TEXT,
      contact_no TEXT,
      whatsapp_no TEXT,
      milk_type TEXT,
      rate REAL
    );
  `);
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS milk_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER,
      date TEXT,
      time_period TEXT,
      delivery_time TEXT,
      delivery_address TEXT,
      milk_type TEXT,
      milk_liter REAL,
      rate REAL,
      amount REAL,
      FOREIGN KEY(customer_id) REFERENCES customers(id)
    );
  `);
};

// ---------- Customers ----------
export const addCustomer = async (customer) => {
  const db = await getDBConnection();
  const {
    customer_code, name, address, city,
    contact_no, whatsapp_no, milk_type, rate
  } = customer;

  const res = await db.executeSql(
    `INSERT INTO customers (customer_code,name,address,city,contact_no,whatsapp_no,milk_type,rate)
     VALUES (?,?,?,?,?,?,?,?);`,
    [customer_code, name, address, city, contact_no, whatsapp_no, milk_type, rate]
  );
  return res[0].insertId;
};

export const updateCustomer = async (id, customer) => {
  const db = await getDBConnection();
  const { customer_code, name, address, city, contact_no, whatsapp_no, milk_type, rate } = customer;
  await db.executeSql(
    `UPDATE customers SET customer_code=?,name=?,address=?,city=?,contact_no=?,whatsapp_no=?,milk_type=?,rate=? WHERE id=?;`,
    [customer_code, name, address, city, contact_no, whatsapp_no, milk_type, rate, id]
  );
};

export const deleteCustomer = async (id) => {
  const db = await getDBConnection();
  await db.executeSql(`DELETE FROM customers WHERE id=?;`, [id]);
};

export const getCustomers = async () => {
  const db = await getDBConnection();
  const results = await db.executeSql(`SELECT * FROM customers ORDER BY name;`);
  const rows = results[0].rows;
  let items = [];
  for (let i = 0; i < rows.length; i++) items.push(rows.item(i));
  return items;
};

export const getCustomerById = async (id) => {
  const db = await getDBConnection();
  const results = await db.executeSql(`SELECT * FROM customers WHERE id=?;`, [id]);
  if (results[0].rows.length) return results[0].rows.item(0);
  return null;
};

// Auto-generate code like CUST001
export const generateCustomerCode = async () => {
  const db = await getDBConnection();
  const res = await db.executeSql(`SELECT MAX(id) as maxId FROM customers;`);
  const maxId = (res[0].rows.item(0).maxId || 0);
  const code = `CUST${String(maxId + 1).padStart(3, '0')}`;
  return code;
};

// ---------- Milk Entries ----------
export const addMilkEntry = async (entry) => {
  const db = await getDBConnection();
  const { customer_id, date, time_period, delivery_time, delivery_address, milk_type, milk_liter, rate, amount } = entry;
  const res = await db.executeSql(
    `INSERT INTO milk_entries (customer_id,date,time_period,delivery_time,delivery_address,milk_type,milk_liter,rate,amount)
     VALUES (?,?,?,?,?,?,?,?,?);`,
    [customer_id, date, time_period, delivery_time, delivery_address, milk_type, milk_liter, rate, amount]
  );
  return res[0].insertId;
};

export const getMilkEntries = async (date = null) => {
  const db = await getDBConnection();
  let q = `SELECT m.*, c.name, c.customer_code FROM milk_entries m
           LEFT JOIN customers c ON c.id = m.customer_id`;
  const params = [];
  if (date) { q += ` WHERE date = ?`; params.push(date); }
  q += ` ORDER BY date DESC, time_period DESC;`;
  const res = await db.executeSql(q, params);
  const rows = res[0].rows;
  const items = [];
  for (let i = 0; i < rows.length; i++) items.push(rows.item(i));
  return items;
};

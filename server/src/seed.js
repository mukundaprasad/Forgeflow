import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import {pool} from './db.js';
dotenv.config();
try {
  const hash=await bcrypt.hash('ForgeFlow123!',12);
  for(const [name,email,role] of [['Aditya Menon','admin@forgeflow.local','ADMIN'],['Maya Shah','sales@forgeflow.local','SALES']]) await pool.query('INSERT INTO users(name,email,password_hash,role) VALUES($1,$2,$3,$4) ON CONFLICT(email) DO NOTHING',[name,email,hash,role]);
  const catalog=[['PR-104','Industrial Product A','Machined parts','pcs',1250,240],['PR-208','Industrial Product B','Assembly components','pcs',840,180],['PR-312','Industrial Product C','Raw materials','kg',320,460],['PR-415','Precision Housing','Machined parts','pcs',2150,92],['PR-526','Drive Coupling','Assembly components','pcs',760,16],['PR-637','Steel Rod 12mm','Raw materials','kg',185,730]];
  for(const [code,name,category,unit,price,physical] of catalog){const p=(await pool.query('INSERT INTO products(code,name,category,unit,base_price) VALUES($1,$2,$3,$4,$5) ON CONFLICT(code) DO UPDATE SET name=EXCLUDED.name RETURNING id',[code,name,category,unit,price])).rows[0];await pool.query('INSERT INTO inventory(product_id,physical_qty,reserved_qty) VALUES($1,$2,0) ON CONFLICT(product_id) DO NOTHING',[p.id,physical]);}
  const accounts=[['ABC Engineering Pvt. Ltd.','Rohan Mehta','procurement@abceng.in','Pune'],['Northstar Components','Priya Shah','buying@northstar.in','Mumbai'],['Vertex Industrial Systems','Arjun Rao','supply@vertex.in','Bengaluru'],['Meridian Manufacturing Co.','Neha Kapoor','orders@meridian.in','Chennai']];
  for(const [name,contact,email,city] of accounts) await pool.query('INSERT INTO customers(name,contact_person,email,city) SELECT $1,$2,$3,$4 WHERE NOT EXISTS(SELECT 1 FROM customers WHERE email=$3)',[name,contact,email,city]);
  const exists=await pool.query('SELECT 1 FROM enquiries LIMIT 1');
  if(!exists.rowCount){const c=(await pool.query('SELECT id FROM customers WHERE email=$1',['procurement@abceng.in'])).rows[0];const p=(await pool.query('SELECT id,base_price FROM products WHERE code=$1',['PR-104'])).rows[0];const e=(await pool.query('INSERT INTO enquiries(customer_id,required_date) VALUES($1,current_date+14) RETURNING id',[c.id])).rows[0];await pool.query('INSERT INTO enquiry_items(enquiry_id,product_id,quantity) VALUES($1,$2,20)',[e.id,p.id]);const q=(await pool.query("INSERT INTO quotations(enquiry_id,customer_id,valid_until,status) VALUES($1,$2,current_date+10,'ACCEPTED') RETURNING id",[e.id,c.id])).rows[0];await pool.query('INSERT INTO quotation_items(quotation_id,product_id,quantity,unit_price,discount_pct,tax_pct) VALUES($1,$2,20,$3,0,18)',[q.id,p.id,p.base_price]);}
  console.log('Seed complete. Admin: admin@forgeflow.local / ForgeFlow123!');
} finally {await pool.end()}

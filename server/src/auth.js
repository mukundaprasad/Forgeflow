import jwt from 'jsonwebtoken';import {hasRole} from './domain.js';
export function auth(req,res,next){try{req.user=jwt.verify((req.headers.authorization||'').replace(/^Bearer /,''),process.env.JWT_SECRET);next()}catch{return res.status(401).json({error:'Authentication required'})}}
export const allow=(...roles)=>(req,res,next)=>hasRole(req.user,roles)?next():res.status(403).json({error:'Insufficient role'});

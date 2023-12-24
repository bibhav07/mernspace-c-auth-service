/* eslint-disable no-undef */
import crypto from 'crypto';
import fs from "fs";

const {publicKey, privateKey} = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
    },
});


console.log("publicKey -> ", publicKey);
console.log("privateKey -> ", privateKey);

fs.writeFileSync('certs/private.pem', privateKey)
fs.writeFileSync('certs/public.pem', publicKey)

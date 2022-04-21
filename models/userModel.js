const mongoose = require("mongoose");
const CryptoJS = require("crypto-js");

const UserSchema = new mongoose.Schema({
    username: {type: String,required: true, unique: true},
    email: {type: String, required:true, unique: true},
    password: {type: String, required: true},
    isAdmin: {type:Boolean, default: false} 
    },
    {timestamps:true}
);

UserSchema.pre("save", async function save(next) {
    if (!this.isModified('password')) return next();
    try {
        
        this.password = await CryptoJS.AES.encrypt(this.password,
            process.env.PASS_SEC
            ).toString()
        return next();
    } catch (err) {
        return next(err)
    }
});


UserSchema.methods.validatePassword = async function validatePassword(data){
    const decryptedPass = CryptoJS.AES.decrypt(
        this.password,
        process.env.PASS_SEC).toString(CryptoJS.enc.Utf8);
        const reqPassword = data;
    // const originalPassword = decryptedPass.toString(CryptoJS.enc.Utf8)

    return decryptedPass == reqPassword
}

module.exports = mongoose.model("User", UserSchema);